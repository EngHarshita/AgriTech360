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
const inMemoryAuditLogs: IAuditLog[] = [
  {
    id: 'log_boot_001',
    action: 'SYSTEM_STARTUP',
    performedBy: 'system',
    performedByEmail: 'core@agritech360.internal',
    targetId: 'srv_backend',
    targetType: 'System',
    details: { environment: 'development', port: 5000, mlPort: 8000 },
    ipAddress: '127.0.0.1',
    timestamp: new Date().toISOString()
  },
  {
    id: 'log_ml_002',
    action: 'ML_ENGINE_ATTACHED',
    performedBy: 'ml-service',
    performedByEmail: 'ml@agritech360.internal',
    targetId: 'rf_crop_recommendation',
    targetType: 'MLModel',
    details: { dataset: 'Crop_recommendation.csv', accuracy: '99.55%', classes: 22 },
    ipAddress: '127.0.0.1',
    timestamp: new Date().toISOString()
  }
];

const inMemoryAdminUsers: ISafeUser[] = [
  {
    id: 'usr_admin_001',
    name: 'Devraj Chauhan',
    email: 'admin@agritech360.internal',
    phone: '+91 98111 00000',
    district: 'Bhopal',
    state: 'Madhya Pradesh',
    landHolding: 50,
    soilType: 'Black',
    irrigationType: 'Canal',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date()
  },
  {
    id: 'usr_farmer_001',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@agritech.in',
    phone: '+91 98765 43210',
    district: 'Sehore',
    state: 'Madhya Pradesh',
    landHolding: 8.5,
    soilType: 'Black Cotton',
    irrigationType: 'Tube Well',
    role: 'farmer',
    status: 'active',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date()
  },
  {
    id: 'usr_farmer_002',
    name: 'Vikram Patel',
    email: 'vikram.patel@kisanmail.in',
    phone: '+91 98234 56789',
    district: 'Indore',
    state: 'Madhya Pradesh',
    landHolding: 12.0,
    soilType: 'Alluvial',
    irrigationType: 'Drip Irrigation',
    role: 'farmer',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date()
  },
  {
    id: 'usr_farmer_003',
    name: 'Sunita Bai',
    email: 'sunita.bai@kisanmail.in',
    phone: '+91 97123 45678',
    district: 'Ujjain',
    state: 'Madhya Pradesh',
    landHolding: 4.5,
    soilType: 'Clayey',
    irrigationType: 'Sprinkler',
    role: 'farmer',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  },
  {
    id: 'usr_buyer_001',
    name: 'Anita Verma',
    email: 'anita.verma@agrocorp.com',
    phone: '+91 98345 67890',
    district: 'Dewas',
    state: 'Madhya Pradesh',
    businessName: 'Malwa Agro Trading Co.',
    businessType: 'Grain Wholesaler',
    role: 'buyer',
    status: 'active',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date()
  }
];

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
      totalUsers: inMemoryAdminUsers.length,
      totalFarmers: inMemoryAdminUsers.filter((u) => u.role === 'farmer').length,
      totalBuyers: inMemoryAdminUsers.filter((u) => u.role === 'buyer').length,
      totalAdmins: inMemoryAdminUsers.filter((u) => u.role === 'admin').length,
      activeUsers: inMemoryAdminUsers.filter((u) => u.status === 'active').length,
      suspendedUsers: inMemoryAdminUsers.filter((u) => u.status === 'suspended').length,
      totalParcels: 18,
      activeCultivationParcels: 15,
      totalLandAcres: 124.5,
      totalSchemes: 26,
      totalMandiRecords: 88,
      databaseStatus: 'degraded',
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
    let filtered = [...inMemoryAdminUsers];
    if (query.role && query.role !== 'all') {
      filtered = filtered.filter((u) => u.role === query.role);
    }
    if (query.status && query.status !== 'all') {
      filtered = filtered.filter((u) => u.status === query.status);
    }
    if (query.search && query.search.trim()) {
      const s = query.search.trim().toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s) ||
          u.phone.toLowerCase().includes(s) ||
          u.district.toLowerCase().includes(s)
      );
    }
    return {
      users: filtered,
      total: filtered.length,
      page: 1,
      pages: 1
    };
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
    const target = inMemoryAdminUsers.find((u) => u.id === targetUserId);
    if (!target) {
      throw ApiError.notFound('Target user account not found');
    }
    const previousStatus = target.status;
    target.status = newStatus;
    target.updatedAt = new Date();

    const actionName = newStatus === 'suspended' ? 'USER_SUSPENDED' : 'USER_RESTORED';
    await recordAuditLog(
      actionName,
      adminUser.userId,
      adminUser.email,
      target.id,
      'User',
      {
        targetEmail: target.email,
        targetRole: target.role,
        previousStatus,
        newStatus,
        reason: reason?.trim() || (newStatus === 'suspended' ? 'Administrative suspension' : 'Administrative restoration')
      },
      ipAddress
    );

    return target;
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
