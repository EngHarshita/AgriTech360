import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Layers,
  Activity,
  Server,
  FileText,
  Search,
  RefreshCw,
  Database,
  Cpu,
  Clock,
  LogOut,
  Ban,
  UserCheck,
  Shield,
  FileCheck,
  Sprout
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { agriService } from '../../api/agriService';
import { env } from '../../config/env';
import type { 
  AdminOverview, 
  User, 
  UserRole, 
  AuditLogEntry, 
  SystemHealthData,
  FarmParcel
} from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';

type AdminTab = 'overview' | 'users' | 'moderation' | 'health' | 'logs';

export const AdminDashboardView: React.FC = () => {
  const { user: currentAdmin, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [parcels, setParcels] = useState<FarmParcel[]>([]);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [health, setHealth] = useState<SystemHealthData | null>(null);

  // Loading & Error states
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingParcels, setLoadingParcels] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [loadingHealth, setLoadingHealth] = useState(false);

  // User management filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<UserRole | 'all'>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<'active' | 'suspended' | 'all'>('all');
  const [userPage, setUserPage] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0);

  // Suspend/Restore modal state
  const [selectedUserForAction, setSelectedUserForAction] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'suspend' | 'restore'>('suspend');
  const [actionReason, setActionReason] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // 1. Load Overview Telemetry
  const loadOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const data = await agriService.getAdminOverview();
      setOverview(data);
    } catch (err: unknown) {
      console.error('Error fetching admin overview:', err);
      showToast('Could not load live platform metrics', 'error');
    } finally {
      setLoadingOverview(false);
    }
  }, [showToast]);

  // 2. Load Users with Filters
  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await agriService.getAdminUsers({
        page: userPage,
        limit: 15,
        search: userSearch,
        role: userRoleFilter,
        status: userStatusFilter
      });
      setUsers(res.users);
      setTotalUsersCount(res.total);
    } catch (err: unknown) {
      console.error('Error fetching users:', err);
      showToast('Failed to load user registry', 'error');
    } finally {
      setLoadingUsers(false);
    }
  }, [userPage, userSearch, userRoleFilter, userStatusFilter, showToast]);

  // 3. Load Farm Parcels for Moderation
  const loadParcels = useCallback(async () => {
    setLoadingParcels(true);
    try {
      const data = await agriService.getFarmParcels();
      setParcels(data);
    } catch (err: unknown) {
      console.error('Error fetching parcels for moderation:', err);
    } finally {
      setLoadingParcels(false);
    }
  }, []);

  // 4. Load Audit Logs
  const loadLogs = useCallback(async () => {
    setLoadingLogs(true);
    try {
      const data = await agriService.getAdminLogs(50);
      setLogs(data);
    } catch (err: unknown) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  // 5. Load System Health
  const loadHealth = useCallback(async () => {
    setLoadingHealth(true);
    try {
      const data = await agriService.getAdminSystemHealth();
      setHealth(data);
    } catch (err: unknown) {
      console.error('Error fetching system health:', err);
    } finally {
      setLoadingHealth(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'moderation') {
      loadParcels();
    } else if (activeTab === 'logs') {
      loadLogs();
    } else if (activeTab === 'health') {
      loadHealth();
    }
  }, [activeTab, loadUsers, loadParcels, loadLogs, loadHealth]);

  // Trigger Suspend/Restore Account
  const handleConfirmAction = async () => {
    if (!selectedUserForAction) return;

    if (selectedUserForAction.id === currentAdmin?.id) {
      showToast('Self-lockout prevented: You cannot suspend your own administrative account.', 'error');
      setSelectedUserForAction(null);
      return;
    }

    setIsSubmittingAction(true);
    try {
      const newStatus = actionType === 'suspend' ? 'suspended' : 'active';
      const updated = await agriService.updateUserStatus(
        selectedUserForAction.id,
        newStatus,
        actionReason
      );

      showToast(
        `User ${updated.name} successfully ${newStatus === 'suspended' ? 'suspended' : 'restored'}. Action logged.`,
        'success'
      );

      // Refresh users and overview
      setSelectedUserForAction(null);
      setActionReason('');
      loadUsers();
      loadOverview();
      if (activeTab === 'logs') loadLogs();
    } catch (err: any) {
      console.error('Error updating user status:', err);
      showToast(err.message || 'Failed to update user account status', 'error');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.08]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Platform Administration & Governance
            </h1>
            <Badge variant="danger" size="sm" dot>Admin Control Panel</Badge>
            {env.useMockData && (
              <Badge variant="warning" size="sm">DEMO MODE</Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Centralized platform telemetry, farmer governance, data service health, and audit trails.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/farmer/dashboard')}
            leftIcon={<Sprout className="w-3.5 h-3.5" />}
          >
            Open Farmer Panel
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              loadOverview();
              if (activeTab === 'users') loadUsers();
              if (activeTab === 'moderation') loadParcels();
              if (activeTab === 'health') loadHealth();
              if (activeTab === 'logs') loadLogs();
              showToast('Platform metrics refreshed', 'info');
            }}
            isLoading={loadingOverview}
            leftIcon={<RefreshCw className="w-3.5 h-3.5 text-slate-600" />}
          >
            Refresh Telemetry
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={logout}
            leftIcon={<LogOut className="w-3.5 h-3.5 text-slate-600" />}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Demo Mode Notice */}
      {env.useMockData && (
        <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 text-[10px] shrink-0">
              DEMO SANDBOX
            </span>
            <span className="font-semibold text-slate-700 leading-relaxed">
              You are currently previewing the <strong>Admin Control Panel</strong> in offline demonstration mode. User accounts, metrics, and subsystem telemetry are simulated. Account actions (suspend/restore) update in-memory state only and do not modify a production database.
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-800 shrink-0">
            Profile: Devraj Chauhan (Admin)
          </span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-black/[0.06] scrollbar-none" role="tablist">
        <button
          onClick={() => setActiveTab('overview')}
          role="tab"
          aria-selected={activeTab === 'overview'}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#0B6B53] text-white shadow-sm shadow-[#0B6B53]/25'
              : 'bg-white border border-black/[0.06] text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-4 h-4" /> System Overview
        </button>

        <button
          onClick={() => setActiveTab('users')}
          role="tab"
          aria-selected={activeTab === 'users'}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#0B6B53] text-white shadow-sm shadow-[#0B6B53]/25'
              : 'bg-white border border-black/[0.06] text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" /> User Management
          {overview && (
            <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] bg-white/20 font-black">
              {overview.totalUsers}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          role="tab"
          aria-selected={activeTab === 'moderation'}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'moderation'
              ? 'bg-[#0B6B53] text-white shadow-sm shadow-[#0B6B53]/25'
              : 'bg-white border border-black/[0.06] text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" /> Fields & Marketplace
        </button>

        <button
          onClick={() => setActiveTab('health')}
          role="tab"
          aria-selected={activeTab === 'health'}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'health'
              ? 'bg-[#0B6B53] text-white shadow-sm shadow-[#0B6B53]/25'
              : 'bg-white border border-black/[0.06] text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Server className="w-4 h-4" /> Subsystem Health
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          role="tab"
          aria-selected={activeTab === 'logs'}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-[#0B6B53] text-white shadow-sm shadow-[#0B6B53]/25'
              : 'bg-white border border-black/[0.06] text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" /> Audit Trail
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {loadingOverview || !overview ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton variant="card" className="h-32" />
              <Skeleton variant="card" className="h-32" />
              <Skeleton variant="card" className="h-32" />
              <Skeleton variant="card" className="h-32" />
            </div>
          ) : (
            <>
              {/* Top Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border border-black/[0.06] shadow-soft bg-white p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Platform Users</span>
                    <div className="w-9 h-9 rounded-xl bg-[#0B6B53]/10 text-[#0B6B53] flex items-center justify-center font-bold">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">{overview.totalUsers}</span>
                    <span className="text-xs font-bold text-[#16A34A]">{overview.activeUsers} Active</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 font-medium flex items-center justify-between pt-2 border-t border-black/[0.04]">
                    <span>Farmers: <strong className="text-slate-800">{overview.totalFarmers}</strong></span>
                    <span>Parcels: <strong className="text-slate-800">{overview.totalParcels}</strong></span>
                    <span>Admins: <strong className="text-slate-800">{overview.totalAdmins}</strong></span>
                  </div>
                </Card>

                <Card className="border border-black/[0.06] shadow-soft bg-white p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Governance</span>
                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">{overview.suspendedUsers}</span>
                    <span className="text-xs font-bold text-rose-600">Suspended Accounts</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 font-medium pt-2 border-t border-black/[0.04]">
                    Compliance rate: <strong className="text-slate-800">{overview.totalUsers ? Math.round((overview.activeUsers / overview.totalUsers) * 100) : 100}%</strong> in good standing
                  </div>
                </Card>

                <Card className="border border-black/[0.06] shadow-soft bg-white p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Land</span>
                    <div className="w-9 h-9 rounded-xl bg-[#F5B642]/10 text-[#C77914] flex items-center justify-center font-bold">
                      <Layers className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">{overview.totalLandAcres}</span>
                    <span className="text-xs font-bold text-slate-500">Acres Tracked</span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 font-medium flex items-center justify-between pt-2 border-t border-black/[0.04]">
                    <span>Total Parcels: <strong className="text-slate-800">{overview.totalParcels}</strong></span>
                    <span>Cultivated: <strong className="text-slate-800">{overview.activeCultivationParcels}</strong></span>
                  </div>
                </Card>

                <Card className="border border-black/[0.06] shadow-soft bg-white p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Database & Feeds</span>
                    <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold">
                      <Database className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <Badge variant={overview.databaseStatus === 'connected' ? 'success' : 'danger'} size="md">
                      MongoDB: {overview.databaseStatus}
                    </Badge>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 font-medium flex items-center justify-between pt-2 border-t border-black/[0.04]">
                    <span>Schemes: <strong className="text-slate-800">{overview.totalSchemes}</strong></span>
                    <span>APMC Records: <strong className="text-slate-800">{overview.totalMandiRecords}</strong></span>
                  </div>
                </Card>
              </div>

              {/* System Infrastructure Telemetry Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card className="p-5 border border-black/[0.06] shadow-soft bg-white">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Node.js Runtime</span>
                  <div className="flex items-center gap-2 mt-2">
                    <Cpu className="w-5 h-5 text-[#0B6B53]" />
                    <span className="text-lg font-black text-slate-900">{overview.nodeVersion}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Server host runtime</p>
                </Card>

                <Card className="p-5 border border-black/[0.06] shadow-soft bg-white">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Memory Footprint</span>
                  <div className="flex items-center gap-2 mt-2">
                    <Activity className="w-5 h-5 text-sky-600" />
                    <span className="text-lg font-black text-slate-900">{overview.memoryUsageMb} MB</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Process heap allocated by Node runtime</p>
                </Card>

                <Card className="p-5 border border-black/[0.06] shadow-soft bg-white">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Uptime Telemetry</span>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-5 h-5 text-[#C77914]" />
                    <span className="text-lg font-black text-slate-900">
                      {Math.floor(overview.systemUptimeSeconds / 3600)}h {Math.floor((overview.systemUptimeSeconds % 3600) / 60)}m
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Continuous uptime without restart</p>
                </Card>
              </div>

              {/* Connected Farmer Operations Hub Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-white border border-emerald-200 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#0B6B53] flex items-center justify-center text-white shadow-soft shrink-0">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      Connected Farmer Operations & Advisory Hub
                      <Badge variant="success" size="sm">LIVE CONNECTED</Badge>
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Open the Farmer Panel to run AI crop diagnostics, monitor live weather radar, and track APMC mandi rates directly.
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/farmer/dashboard')}
                  leftIcon={<Sprout className="w-4 h-4" />}
                  className="shrink-0"
                >
                  Launch Farmer Panel
                </Button>
              </div>

              {/* Quick Actions Bar */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0D2B23] via-[#09221C] to-[#061813] text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" /> Administrative Governance Ready
                  </h3>
                  <p className="text-xs text-white/70 mt-1">
                    Manage farmer account authorizations, review agricultural parcels, and inspect audit logs.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => setActiveTab('users')}
                  >
                    Manage Users
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                    onClick={() => setActiveTab('logs')}
                  >
                    View Audit Trail
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white p-4 rounded-2xl border border-black/[0.06] shadow-soft">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search user by name, email, phone, district..."
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setUserPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0B6B53] outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Role filter */}
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-black/[0.06]">
                {(['all', 'farmer', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setUserRoleFilter(r);
                      setUserPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${
                      userRoleFilter === r
                        ? 'bg-[#0B6B53] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-black/[0.06]">
                {(['all', 'active', 'suspended'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setUserStatusFilter(s);
                      setUserPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${
                      userStatusFilter === s
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Table */}
          {loadingUsers ? (
            <div className="p-6 space-y-3 bg-white rounded-2xl border border-black/[0.06]">
              <Skeleton variant="card" className="h-16" />
              <Skeleton variant="card" className="h-16" />
              <Skeleton variant="card" className="h-16" />
            </div>
          ) : users.length === 0 ? (
            <EmptyState
              icon={<Users className="w-8 h-8 text-slate-400" />}
              title="No Users Match Query"
              description={`No account found matching search "${userSearch}". Try clearing filters.`}
              actionText="Reset Filters"
              onAction={() => {
                setUserSearch('');
                setUserRoleFilter('all');
                setUserStatusFilter('all');
              }}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-black/[0.08] shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F5F7F6] border-b border-black/[0.06] text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="p-4 pl-6">User Account</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Location / Business</th>
                      <th className="p-4">Lifecycle Status</th>
                      <th className="p-4">Member Since</th>
                      <th className="p-4 pr-6 text-right">Administrative Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.04]">
                    {users.map((u) => {
                      const isSelf = u.id === currentAdmin?.id;
                      const isSuspended = u.status === 'suspended';

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* User info */}
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={u.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'}
                                alt={u.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block">{u.name}</span>
                                <span className="text-[11px] text-slate-500 font-medium">{u.email}</span>
                                <span className="text-[10px] text-slate-400 block">{u.phone}</span>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="p-4">
                            <Badge
                              variant={u.role === 'admin' ? 'danger' : 'success'}
                              size="sm"
                              className="uppercase"
                            >
                              {u.role || 'farmer'}
                            </Badge>
                          </td>

                          {/* Location / Farm */}
                          <td className="p-4">
                            <div className="font-semibold text-slate-800">
                              {u.location?.district ? `${u.location.district}, ${u.location.state}` : 'Location unlisted'}
                            </div>
                            <span className="text-[11px] text-slate-500">
                              {u.farmDetails ? `${u.farmDetails.totalAcres} Acres • ${u.farmDetails.soilType || 'Farm'}` : 'Platform Administrator'}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-4">
                            {isSuspended ? (
                              <Badge variant="danger" size="sm" dot>Suspended</Badge>
                            ) : (
                              <Badge variant="success" size="sm" dot>Active</Badge>
                            )}
                          </td>

                          {/* Member Since */}
                          <td className="p-4 text-slate-500 font-medium">
                            {u.memberSince || 'Active Member'}
                          </td>

                          {/* Actions */}
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {u.role === 'farmer' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigate('/farmer/dashboard')}
                                  className="text-[11px] text-[#0B6B53] hover:bg-[#0B6B53]/10 !py-1 !px-2"
                                  leftIcon={<Sprout className="w-3 h-3" />}
                                >
                                  Farmer View
                                </Button>
                              )}
                              {isSelf ? (
                                <span className="text-[11px] text-slate-400 italic font-medium px-2 py-1 bg-slate-100 rounded-md">
                                  Current Session
                                </span>
                              ) : isSuspended ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUserForAction(u);
                                    setActionType('restore');
                                  }}
                                  className="text-[#16A34A] border-[#16A34A]/30 hover:bg-[#16A34A]/10 text-xs"
                                  leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                                >
                                  Restore
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUserForAction(u);
                                    setActionType('suspend');
                                  }}
                                  className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs"
                                  leftIcon={<Ban className="w-3.5 h-3.5" />}
                                >
                                  Suspend
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination footer */}
              <div className="p-4 border-t border-black/[0.05] flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Total records: <strong>{totalUsersCount}</strong> users</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={userPage <= 1}
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="font-bold text-slate-800">Page {userPage}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={users.length < 15}
                    onClick={() => setUserPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MODERATION & FIELDS */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <Card className="border border-black/[0.06] bg-white p-5 shadow-soft">
            <CardHeader
              title="Agricultural Field Parcels & Operations"
              subtitle="System-wide audit of farmer land holdings and crop cultivation status"
              icon={<Layers className="w-5 h-5 text-[#0B6B53]" />}
              action={
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">{parcels.length} Parcels Audited</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/farmer/dashboard')}
                    className="text-xs text-[#0B6B53] border-[#0B6B53]/30 hover:bg-[#0B6B53]/10"
                    leftIcon={<Sprout className="w-3.5 h-3.5" />}
                  >
                    Open Farmer View
                  </Button>
                </div>
              }
            />
            <CardContent className="p-0 pt-4">
              {loadingParcels ? (
                <div className="p-6 space-y-3">
                  <Skeleton variant="card" className="h-16" />
                  <Skeleton variant="card" className="h-16" />
                </div>
              ) : parcels.length === 0 ? (
                <EmptyState
                  icon={<Layers className="w-8 h-8 text-slate-400" />}
                  title="No Registered Parcels"
                  description="No farm parcels currently registered in the database."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F5F7F6] border-b border-black/[0.06] text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                        <th className="p-3.5 pl-6">Field / Parcel Name</th>
                        <th className="p-3.5">Survey / Khasra</th>
                        <th className="p-3.5">Area (Acres)</th>
                        <th className="p-3.5">Location</th>
                        <th className="p-3.5">Current Crop</th>
                        <th className="p-3.5 pr-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04]">
                      {parcels.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 pl-6 font-bold text-slate-900">{p.name}</td>
                          <td className="p-3.5 text-slate-600">{p.surveyNumber || 'Unassigned'}</td>
                          <td className="p-3.5 font-bold text-[#0B6B53]">{p.areaAcres} Acres</td>
                          <td className="p-3.5 text-slate-600">{p.village ? `${p.village}, ` : ''}{p.district}, {p.state}</td>
                          <td className="p-3.5 font-medium text-slate-800">{p.currentCrop || 'Fallow'}</td>
                          <td className="p-3.5 pr-6">
                            <Badge
                              variant={
                                p.status === 'Active Cultivation'
                                  ? 'success'
                                  : p.status === 'Sowing Prep'
                                  ? 'accent'
                                  : 'neutral'
                              }
                              size="sm"
                            >
                              {p.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: SYSTEM HEALTH */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          {loadingHealth || !health ? (
            <div className="space-y-4">
              <Skeleton variant="card" className="h-40" />
              <Skeleton variant="card" className="h-40" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Database Telemetry */}
              <Card className="border border-black/[0.06] bg-white p-5 shadow-soft">
                <CardHeader
                  title="Database Infrastructure"
                  subtitle="MongoDB Atlas Replica / Standalone State"
                  icon={<Database className="w-5 h-5 text-sky-600" />}
                  action={
                    <Badge variant={health.database.state === 'connected' ? 'success' : 'danger'} size="sm" dot>
                      {health.database.state}
                    </Badge>
                  }
                />
                <CardContent className="p-0 pt-4 space-y-3 text-xs">
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-black/[0.04]">
                    <span className="text-slate-500 font-bold">Database Name:</span>
                    <strong className="text-slate-900">{health.database.name}</strong>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-black/[0.04]">
                    <span className="text-slate-500 font-bold">Database Host:</span>
                    <strong className="text-slate-900">{health.database.host}</strong>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-black/[0.04]">
                    <span className="text-slate-500 font-bold">Write Safety Protocol:</span>
                    <strong className="text-[#0B6B53]">Strict HTTP 503 on Disconnect</strong>
                  </div>
                </CardContent>
              </Card>

              {/* Node Runtime & Process */}
              <Card className="border border-black/[0.06] bg-white p-5 shadow-soft">
                <CardHeader
                  title="Runtime Environment"
                  subtitle="Node.js Process & Memory Allocation"
                  icon={<Cpu className="w-5 h-5 text-[#0B6B53]" />}
                  action={<Badge variant="primary" size="sm">{health.system.nodeVersion}</Badge>}
                />
                <CardContent className="p-0 pt-4 space-y-3 text-xs">
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-black/[0.04]">
                    <span className="text-slate-500 font-bold">Operating System:</span>
                    <strong className="text-slate-900">{health.system.platform} ({health.system.arch})</strong>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-black/[0.04]">
                    <span className="text-slate-500 font-bold">Process ID (PID):</span>
                    <strong className="text-slate-900">{health.system.pid}</strong>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-slate-50 border border-black/[0.04]">
                    <span className="text-slate-500 font-bold">Heap Used / Total:</span>
                    <strong className="text-slate-900">
                      {health.system.memory.heapUsedMb} MB / {health.system.memory.heapTotalMb} MB
                    </strong>
                  </div>
                </CardContent>
              </Card>

              {/* Microservice Endpoints Status */}
              <Card className="col-span-1 md:col-span-2 border border-black/[0.06] bg-white p-5 shadow-soft">
                <CardHeader
                  title="Connected Agricultural Data Services"
                  subtitle="External API adapters and AI inference engine availability"
                  icon={<Activity className="w-5 h-5 text-[#F5B642]" />}
                />
                <CardContent className="p-0 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl border border-black/[0.06] bg-slate-50/70">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Agro-Meteorology</span>
                        <Badge variant="success" size="sm">Online</Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">
                        OpenWeather OneCall 3.0 station sync with localized offline backup cache.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-black/[0.06] bg-slate-50/70">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">APMC Mandi Bhav</span>
                        <Badge variant="success" size="sm">Online</Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">
                        Agmarknet wholesale market ticker with MSP benchmark comparisons.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-black/[0.06] bg-slate-50/70">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Crop Recommendation</span>
                        <Badge variant="primary" size="sm">Dual Engine</Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">
                        Python FastAPI Random Forest microservice (Port 8000) with ICAR regional benchmark fallback.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <Card className="border border-black/[0.06] bg-white p-5 shadow-soft">
          <CardHeader
            title="Administrative Audit Trail"
            subtitle="Chronological log of account suspensions, security interventions, and profile governance"
            icon={<FileCheck className="w-5 h-5 text-[#0B6B53]" />}
            action={<Badge variant="primary" size="sm">{logs.length} Logged Events</Badge>}
          />
          <CardContent className="p-0 pt-4">
            {loadingLogs ? (
              <div className="p-6 space-y-3">
                <Skeleton variant="card" className="h-14" />
                <Skeleton variant="card" className="h-14" />
              </div>
            ) : logs.length === 0 ? (
              <EmptyState
                icon={<FileText className="w-8 h-8 text-slate-400" />}
                title="No Audit Records"
                description="No administrative actions have been logged yet."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F5F7F6] border-b border-black/[0.06] text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="p-3.5 pl-6">Timestamp</th>
                      <th className="p-3.5">Action</th>
                      <th className="p-3.5">Performed By</th>
                      <th className="p-3.5">Target Record</th>
                      <th className="p-3.5">Reason / Details</th>
                      <th className="p-3.5 pr-6">Client IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.04]">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 pl-6 text-slate-500 whitespace-nowrap font-medium">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <Badge
                            variant={
                              log.action.includes('SUSPEND')
                                ? 'danger'
                                : log.action.includes('RESTORE')
                                ? 'success'
                                : 'neutral'
                            }
                            size="sm"
                          >
                            {log.action}
                          </Badge>
                        </td>
                        <td className="p-3.5 font-bold text-slate-800">{log.performedByEmail}</td>
                        <td className="p-3.5 text-slate-700">
                          {log.details?.targetEmail ? String(log.details.targetEmail) : (log.targetId || 'Platform')}
                        </td>
                        <td className="p-3.5 text-slate-600 max-w-xs truncate">
                          {log.details?.reason ? String(log.details.reason) : JSON.stringify(log.details || {})}
                        </td>
                        <td className="p-3.5 pr-6 text-slate-400 font-mono text-[11px]">{log.ipAddress || 'internal'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Confirmation Modal for Suspend / Restore */}
      {selectedUserForAction && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-black/[0.1] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  actionType === 'suspend' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-[#0B6B53]'
                }`}
              >
                {actionType === 'suspend' ? <Ban className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {actionType === 'suspend' ? 'Suspend User Account' : 'Restore User Account'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{selectedUserForAction.name} ({selectedUserForAction.email})</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {actionType === 'suspend'
                ? 'Suspending this account will immediately revoke authentication access and block all Farmer/Buyer APIs. This action is recorded in the platform audit trail.'
                : 'Restoring this account will permit the user to authenticate and access their panel.'}
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Administrative Reason / Justification
              </label>
              <textarea
                rows={2}
                placeholder={
                  actionType === 'suspend'
                    ? 'e.g., APMC dispute non-compliance, terms violation, or suspicious activity'
                    : 'e.g., Identity documents verified, dispute resolved'
                }
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full p-3 rounded-xl border border-black/[0.1] text-xs outline-none focus:ring-2 focus:ring-[#0B6B53]"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedUserForAction(null)}
                disabled={isSubmittingAction}
              >
                Cancel
              </Button>
              <Button
                variant={actionType === 'suspend' ? 'danger' : 'primary'}
                size="sm"
                onClick={handleConfirmAction}
                isLoading={isSubmittingAction}
              >
                {actionType === 'suspend' ? 'Confirm Suspension' : 'Confirm Restoration'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
