import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, AlertCircle, ArrowRight, Lock, KeyRound, Server } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { mockCurrentAdmin } from '../../data/mockData';

/**
 * Dedicated Administrator Login Portal (/admin/login)
 * Strictly separated from the public Farmer and Buyer login page.
 * Not linked from public application navigation.
 */
export const AdminLoginPage: React.FC = () => {
  const { user, isAuthenticated, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated as an administrator, immediately direct to /admin/dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;
        const target = from && from.startsWith('/admin') ? from : '/admin/dashboard';
        navigate(target, { replace: true });
      } else {
        // If a farmer or buyer visits /admin/login while logged in, redirect them to unauthorized or their own panel
        const dest = user.role === 'buyer' ? '/client/dashboard' : '/farmer/dashboard';
        navigate(dest, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email.trim(), password);
      // Navigation is triggered by useEffect observing user & isAuthenticated
      showToast('Administrative session established', 'success');
    } catch (err: any) {
      const msg = err?.message || 'Administrative authentication failed. Access denied.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login(mockCurrentAdmin.email, 'demo');
      showToast('Signed in as Devraj Chauhan (Admin Control Panel)', 'success');
    } catch (err: any) {
      setError(err?.message || 'Admin demo authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700/80 p-8 animate-in fade-in zoom-in-95 text-slate-100">
        {/* Admin Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white shadow-soft">
            <Shield className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">AgriTech360</h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                GOVERNANCE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold">Administrative Access Control Portal</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-400" /> Platform Security & Administration
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Restricted entry. Authorized staff, system operators and platform auditors only.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span className="font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        {/* 1-Click Admin Demo Access */}
        <div className="mb-5 p-3.5 rounded-xl bg-slate-900/80 border border-rose-900/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 block">
              ⚡ 1-Click Interactive Admin Demo
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Instant Access</span>
          </div>
          <button
            type="button"
            onClick={handleAdminDemoLogin}
            className="w-full py-2 px-3 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/50 text-xs font-bold text-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <KeyRound className="w-3.5 h-3.5 text-rose-400" /> 1-Click Sign In as Administrator (Devraj Chauhan)
          </button>
        </div>

        {/* Main Admin Login Form */}
        <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email-input" className="block text-xs font-bold text-slate-300 mb-1">
              Administrator Email <span className="text-rose-400">*</span>
            </label>
            <input
              id="admin-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@agritech360.internal"
              required
              autoComplete="username"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-white bg-slate-900/80 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          <div>
            <label htmlFor="admin-password-input" className="block text-xs font-bold text-slate-300 mb-1">
              Administrative Password <span className="text-rose-400">*</span>
            </label>
            <input
              id="admin-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold text-white bg-slate-900/80 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          <Button
            type="submit"
            variant="danger"
            size="md"
            isLoading={loading}
            className="w-full mt-3 !bg-rose-600 hover:!bg-rose-700 !text-white font-black"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Authenticate & Access Panel
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-700/60 text-center space-y-2">
          <p className="text-[11px] text-slate-400 font-medium">
            Looking for Farmer Portal?{' '}
            <a href="/login" className="text-emerald-400 font-bold hover:underline">
              Go to Farmer Portal & Demo
            </a>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <Server className="w-3 h-3 text-slate-500" aria-hidden="true" />
            All administrative access attempts are securely recorded in the immutable audit log
          </div>
        </div>
      </div>
    </div>
  );
};
