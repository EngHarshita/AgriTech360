import mongoose from 'mongoose';
import { User, FarmParcel, GovernmentScheme, MandiPrice, AuditLog } from '../models';
import { ApiError } from '../utils/apiError';
import { 
  AdminOverviewDto, 
  AdminUserFilterQuery, 
  ISafeUser, 
  UserStatus, 
  JWTPayload, 
  IAuditLog 
} from '../types';
import { logger } from '../utils/logger';

// In-memory fallback buffer for audit logs when MongoDB is offline
const inMemoryAuditLogs: IAuditLog[] = [];

/**
 * Record an administrative action into the audit trail
 */
export const recordAuditLog = async (
  action: string,
  performedBy: string,
  performedByEmail: string,
  targetId?: string,
  targetType = 'User',
  details: Record<string, unknown> = {},
  ipAddress = 'internal'
): Promise<IAuditLog> => {
  const logEntry: IAuditLog = {
    id: new mongoose.Types.ObjectId().toString(),
    action,
    performedBy,
    performedByEmail,
    targetId,
    targetType,
    details,
    ipAddress,
    timestamp: new Date().toISOString()
  };

  // Add to in-memory fallback
  inMemoryAuditLogs.unshift(logEntry);
  if (inMemoryAuditLogs.length > 200) {
    inMemoryAuditLogs.pop();
  }

  // Attempt database persistence if MongoDB is connected
  if (mongoose.connection.readyState === 1) {
    try {
      const doc = new AuditLog({
        action,
        performedBy,
        performedByEmail,
        targetId,
        targetType,
        details,
        ipAddress
      });
      await doc.save();
    } catch (err) {
      logger.warn('Failed to write audit log to database collection:', err);
    }
  }

  return logEntry;
};

/**
 * Retrieve administrative overview metrics from real MongoDB datasets
 */
export const getAdminOverview = async (): Promise<AdminOverviewDto> => {
  const isDbOnline = mongoose.connection.readyState === 1;
  const memoryUsage = process.memoryUsage();
  const memoryUsageMb = Math.round(memoryUsage.heapUsed / 1024 / 1024);
  const systemUptimeSeconds = Math.round(process.uptime());
  const nodeVersion = process.version;

  if (!isDbOnline) {
    return {
      totalUsers: 0,
      totalFarmers: 0,
      totalBuyers: 0,
      totalAdmins: 0,
      activeUsers: 0,
      suspendedUsers: 0,
      totalParcels: 0,
      activeCultivationParcels: 0,
      totalLandAcres: 0,
      totalSchemes: 0,
      totalMandiRecords: 0,
      databaseStatus: 'disconnected',
      systemUptimeSeconds,
      nodeVersion,
      memoryUsageMb
    };
  }

  // Run real aggregate counts in parallel
  const [
    totalUsers,
    totalFarmers,
    totalBuyers,
    totalAdmins,
    suspendedUsers,
    totalParcels,
    activeParcels,
    parcelAreaAgg,
    totalSchemes,
    totalMandiRecords
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'farmer' }),
    User.countDocuments({ role: 'buyer' }),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ status: 'suspended' }),
    FarmParcel.countDocuments(),
    FarmParcel.countDocuments({ status: 'Active Cultivation' }),
    FarmParcel.aggregate([{ $group: { _id: null, totalAcres: { $sum: '$areaAcres' } } }]),
    GovernmentScheme.countDocuments(),
    MandiPrice.countDocuments()
  ]);

  const activeUsers = Math.max(0, totalUsers - suspendedUsers);
  const totalLandAcres = parcelAreaAgg.length > 0 && parcelAreaAgg[0].totalAcres ? Math.round(parcelAreaAgg[0].totalAcres * 10) / 10 : 0;

  return {
    totalUsers,
    totalFarmers,
    totalBuyers,
    totalAdmins,
    activeUsers,
    suspendedUsers,
    totalParcels,
    activeCultivationParcels: activeParcels,
    totalLandAcres,
    totalSchemes,
    totalMandiRecords,
    databaseStatus: 'connected',
    systemUptimeSeconds,
    nodeVersion,
    memoryUsageMb
  };
};

/**
 * Search and list users with server-side pagination, role and status filtering
 */
export const getAdminUsers = async (
  query: AdminUserFilterQuery
): Promise<{ users: ISafeUser[]; total: number; page: number; pages: number }> => {
  if (mongoose.connection.readyState !== 1) {
    return { users: [], total: 0, page: 1, pages: 1 };
  }

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const skip = (page - 1) * limit;

  const mongoFilter: Record<string, unknown> = {};

  if (query.role && query.role !== 'all') {
    mongoFilter.role = query.role;
  }

  if (query.status && query.status !== 'all') {
    mongoFilter.status = query.status;
  }

  if (query.search && query.search.trim()) {
    const s = query.search.trim();
    mongoFilter.$or = [
      { name: { $regex: s, $options: 'i' } },
      { email: { $regex: s, $options: 'i' } },
      { phone: { $regex: s, $options: 'i' } },
      { district: { $regex: s, $options: 'i' } },
      { state: { $regex: s, $options: 'i' } },
      { businessName: { $regex: s, $options: 'i' } }
    ];
  }

  const [total, users] = await Promise.all([
    User.countDocuments(mongoFilter),
    User.find(mongoFilter).sort({ createdAt: -1 }).skip(skip).limit(limit)
  ]);

  return {
    users: users.map((u) => u.toSafeObject()),
    total,
    page,
    pages: Math.ceil(total / limit) || 1
  };
};

/**
 * Update user account status (suspend or restore)
 * Prevents administrator self-lockout
 */
export const updateUserStatus = async (
  targetUserId: string,
  newStatus: UserStatus,
  adminUser: JWTPayload,
  ipAddress = 'unknown',
  reason?: string
): Promise<ISafeUser> => {
  // Prevent admin from suspending their own account
  if (targetUserId === adminUser.userId) {
    throw ApiError.badRequest('Administrators cannot suspend their own account to prevent accidental lockout');
  }

  if (mongoose.connection.readyState !== 1) {
    throw ApiError.serviceUnavailable('Database connection is offline. Cannot modify account status.');
  }

  const user = await User.findById(targetUserId);
  if (!user) {
    throw ApiError.notFound('Target user account not found');
  }

  // Update status
  const previousStatus = (user as any).status || 'active';
  (user as any).status = newStatus;
  const savedUser = await user.save();

  // Record in audit trail
  const actionName = newStatus === 'suspended' ? 'USER_SUSPENDED' : 'USER_RESTORED';
  await recordAuditLog(
    actionName,
    adminUser.userId,
    adminUser.email,
    user._id.toString(),
    'User',
    {
      targetEmail: user.email,
      targetRole: user.role,
      previousStatus,
      newStatus,
      reason: reason?.trim() || (newStatus === 'suspended' ? 'Administrative suspension' : 'Administrative restoration')
    },
    ipAddress
  );

  return savedUser.toSafeObject();
};

/**
 * Retrieve chronological platform audit logs
 */
export const getAuditLogs = async (limit = 50): Promise<IAuditLog[]> => {
  if (mongoose.connection.readyState === 1) {
    try {
      const docs = await AuditLog.find().sort({ createdAt: -1 }).limit(limit);
      if (docs.length > 0) {
        return docs.map((d) => ({
          id: d._id.toString(),
          action: d.action,
          performedBy: d.performedBy,
          performedByEmail: d.performedByEmail,
          targetId: d.targetId,
          targetType: d.targetType,
          details: d.details as Record<string, unknown>,
          ipAddress: d.ipAddress,
          timestamp: d.createdAt.toISOString()
        }));
      }
    } catch (err) {
      logger.warn('Failed to query AuditLog collection; using memory fallback:', err);
    }
  }

  return inMemoryAuditLogs.slice(0, limit);
};

/**
 * Retrieve comprehensive system and infrastructure health
 */
export const getSystemHealth = async () => {
  const memory = process.memoryUsage();
  return {
    status: mongoose.connection.readyState === 1 ? 'healthy' : 'degraded',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      state: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      host: mongoose.connection.host || 'unknown',
      name: mongoose.connection.name || 'agritech360'
    },
    subsystems: {
      mongodb: mongoose.connection.readyState === 1 ? 'operational' : 'disconnected',
      weatherService: 'operational',
      mandiAggregator: 'operational',
      cropInferenceEngine: 'standby'
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
      memory: {
        heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
        rssMb: Math.round(memory.rss / 1024 / 1024)
      }
    },
    microservices: {
      weatherStation: 'operational',
      mandiAggregator: 'operational',
      cropInferenceEngine: 'standby'
    }
  };
};
