import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const UnauthorizedPage: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const state = (location.state as { requiredRole?: string; currentRole?: string }) || {};
  const requiredRole = state.requiredRole || 'authorized';
  const currentRole = state.currentRole || user?.role || 'user';

  const userDashboardUrl = currentRole === 'buyer'
    ? '/client/dashboard'
    : currentRole === 'admin'
      ? '/admin/dashboard'
      : '/farmer/dashboard';
  const roleLabel = currentRole === 'buyer' ? 'Client' : currentRole === 'admin' ? 'Admin' : 'Farmer';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-black/[0.08] p-8 text-center animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center mx-auto mb-5 text-amber-600 shadow-soft">
          <ShieldAlert className="w-9 h-9" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          Access Restricted
        </h1>

        <p className="text-sm text-slate-600 font-medium mb-6 leading-relaxed">
          This portal section is restricted to <strong>{requiredRole.toUpperCase()}</strong> accounts.
          Your account is currently registered with the <strong>{currentRole.toUpperCase()}</strong> role.
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-black/[0.05] text-left text-xs text-slate-600 mb-6 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Active User:</span>
            <span className="font-bold text-slate-800">{user?.name || 'Authenticated User'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Assigned Role:</span>
            <span className="font-bold text-[#0B6B53] uppercase">{currentRole}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-semibold">Target Section:</span>
            <span className="font-bold text-amber-700 uppercase">{requiredRole} Panel</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => navigate(userDashboardUrl)}
            leftIcon={<LayoutDashboard className="w-4 h-4" />}
          >
            Go to Your {roleLabel} Dashboard
          </Button>

          <Button
            variant="outline"
            size="md"
            className="w-full"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            leftIcon={<LogOut className="w-4 h-4 text-slate-500" />}
          >
            Sign Out & Switch Account
          </Button>

          <div className="pt-2">
            <Link
              to="/login"
              className="text-xs font-bold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
