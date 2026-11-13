import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sprout, Shield, AlertCircle, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { mockCurrentUser, mockCurrentAdmin } from '../../data/mockData';

export const LoginPage: React.FC = () => {
  const { user, isAuthenticated, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to appropriate role dashboard or previous route
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;
      const defaultDest = user.role === 'admin' 
        ? '/admin/dashboard' 
        : '/farmer/dashboard';

      let targetDest = defaultDest;
      if (from && from !== '/login' && from !== '/unauthorized') {
        const isFarmerPath = from.startsWith('/farmer');
        const isAdminPath = from.startsWith('/admin');

        if (user.role === 'admin') {
          // Admin can access both admin and farmer paths
          targetDest = isAdminPath || isFarmerPath ? from : defaultDest;
        } else if (user.role === 'farmer' && !isFarmerPath) {
          targetDest = defaultDest;
        } else {
          targetDest = from;
        }
      }

      navigate(targetDest, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      showToast('Signed in successfully', 'success');
    } catch (err: any) {
      const msg = err?.message || 'Invalid email or password. Please verify credentials.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'farmer' | 'admin') => {
    setLoading(true);
    setError(null);
    try {
      const demoEmail = role === 'admin'
        ? mockCurrentAdmin.email
        : mockCurrentUser.email;
      await login(demoEmail, 'demo');
      showToast(
        role === 'admin'
          ? 'Signed in as Devraj Chauhan (Admin Governance Panel)'
          : 'Signed in as Rajesh Sharma (Farmer Panel)',
        'success'
      );
    } catch (err: any) {
      setError(err?.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-black/[0.08] p-8 animate-in fade-in zoom-in-95">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0B6B53] to-[#085240] flex items-center justify-center text-white shadow-soft">
            <Sprout className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">AgriTech360</h1>
            <p className="text-xs text-slate-500 font-semibold">Agricultural Intelligence & Farmer Advisory</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Sign In to Your Account</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Access your Farmer Dashboard or Administrator Control Panel
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200/90 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
            <span className="font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        {/* 1-Click Interactive Demo Access for Both Panels */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-[#F0F9F6] via-slate-50 to-rose-50 border border-slate-200/90 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span>⚡</span> 1-Click Interactive Demo
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#0B6B53]">
              Instant Access
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Choose a panel to immediately explore with pre-loaded real-time agricultural data:
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('farmer')}
              className="p-2.5 rounded-xl bg-white border border-emerald-300 text-left hover:border-[#0B6B53] hover:shadow-sm transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#0B6B53]">
                <UserCheck className="w-4 h-4 text-[#0B6B53] group-hover:scale-110 transition-transform" />
                <span>Farmer Demo</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                Crop Advisory AI, Mandi Rates & Weather Radar
              </p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="p-2.5 rounded-xl bg-white border border-rose-300 text-left hover:border-rose-600 hover:shadow-sm transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-rose-700">
                <ShieldCheck className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
                <span>Admin Demo</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                User Moderation, System Health & Audit Logs
              </p>
            </button>
          </div>
        </div>

        {/* Main Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email-input" className="block text-xs font-bold text-slate-700 mb-1">
              Registered Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="login-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. kisan@agritech360.in or admin@agritech360.internal"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="login-password-input" className="block text-xs font-bold text-slate-700">
                Password <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Min 6 characters</span>
            </div>
            <input
              id="login-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs transition-all"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={loading}
            className="w-full mt-2"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Dashboard
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-black/[0.06] text-center space-y-2">
          <p className="text-xs text-slate-500 font-medium">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-[#0B6B53] font-bold hover:underline">
              Register as Farmer (किसान पंजीकरण)
            </Link>
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            Platform Operator?{' '}
            <Link to="/admin/login" className="text-rose-600 font-bold hover:underline">
              Admin Governance Portal
            </Link>
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <Shield className="w-3.5 h-3.5 text-[#0B6B53]" aria-hidden="true" />
          Protected by JWT authentication & Indian Digital Agristack
        </div>
      </div>
    </div>
  );
};
