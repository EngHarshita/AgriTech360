import React, { useState, useEffect } from 'react';
import { X, Shield, Sprout, User, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { mockCurrentUser, mockCurrentAdmin } from '../../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [acres, setAcres] = useState('');
  const [soilType, setSoilType] = useState<'Alluvial' | 'Black' | 'Red' | 'Laterite' | 'Loamy' | 'Sandy Loam'>('Black');

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDemoLogin = async (role: 'farmer' | 'admin' = 'farmer') => {
    setLoading(true);
    try {
      const demoEmail = role === 'admin' ? mockCurrentAdmin.email : mockCurrentUser.email;
      await login(demoEmail, 'demo');
      showToast(
        role === 'admin'
          ? 'Signed in as Devraj Chauhan (Admin Control Panel)'
          : 'Signed in as Rajesh Sharma (Farmer Panel)',
        'success'
      );
      onClose();
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/farmer/dashboard');
      }
    } catch (err: any) {
      showToast(err?.message || 'Demo sign-in failed. Please verify credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginEmail, password);
      showToast('Signed in successfully to AgriTech360', 'success');
      onClose();
    } catch (err: any) {
      showToast(err?.message || 'Invalid credentials. Please verify your email and password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: regEmail.trim(),
        password: regPassword,
        phone: phone.trim(),
        role: 'farmer',
        location: {
          village: village.trim(),
          district: district.trim(),
          state: state.trim(),
          pincode: '',
        },
        farmDetails: {
          totalAcres: parseFloat(acres) || 0,
          soilType,
          irrigationType: 'Drip',
          primaryCrops: [],
        },
      });
      showToast('Farmer profile created successfully! Welcome to AgriTech360.', 'success');
      onClose();
      navigate('/farmer/dashboard');
    } catch (err: any) {
      showToast(err?.message || 'Registration failed. Please fill all required fields and try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
    >
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-black/[0.08] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B6B53] to-[#085240] flex items-center justify-center text-white shadow-soft">
              <Sprout className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="auth-modal-title" className="text-base font-extrabold text-slate-900 tracking-tight">AgriTech360</h3>
              <p className="text-xs text-slate-500 font-semibold">Agricultural Intelligence & Advisory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close authentication modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-black/[0.06] px-6 pt-3 gap-6" role="tablist">
          <button
            role="tab"
            aria-selected={mode === 'login'}
            onClick={() => setMode('login')}
            className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
              mode === 'login'
                ? 'text-[#0B6B53] border-b-2 border-[#0B6B53]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            role="tab"
            aria-selected={mode === 'register'}
            onClick={() => setMode('register')}
            className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
              mode === 'register'
                ? 'text-[#0B6B53] border-b-2 border-[#0B6B53]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Farmer Account
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* 1-Click Demo Buttons for Both Panels */}
          <div className="mb-5 p-3.5 rounded-xl bg-gradient-to-br from-[#0B6B53]/[0.08] via-slate-50 to-rose-50 border border-slate-200/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">
                ⚡ 1-Click Interactive Demo
              </span>
              <span className="text-[10px] font-bold text-[#0B6B53]">Instant Sign In</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="primary"
                size="sm"
                isLoading={loading}
                onClick={() => handleDemoLogin('farmer')}
                leftIcon={<User className="w-3.5 h-3.5" />}
                className="w-full text-[11px]"
              >
                Farmer Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                isLoading={loading}
                onClick={() => handleDemoLogin('admin')}
                leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-rose-600" />}
                className="w-full text-[11px] border-rose-300 text-rose-700 hover:bg-rose-50"
              >
                Admin Demo
              </Button>
            </div>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email-input" className="block text-xs font-bold text-slate-700 mb-1">
                  Email or Registered Mobile Number
                </label>
                <input
                  id="login-email-input"
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. kisan@agritech360.in or admin@agritech360.internal"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 focus:border-[#0B6B53] outline-none bg-white shadow-2xs transition-all"
                />
              </div>

              <div>
                <label htmlFor="login-password-input" className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  id="login-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 focus:border-[#0B6B53] outline-none bg-white shadow-2xs transition-all"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1 font-medium">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#0B6B53] focus:ring-[#0B6B53]" />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() =>
                    showToast('Demo credentials — Farmer: rajesh.sharma@agritech360.in | Admin: admin@agritech360.internal', 'info')
                  }
                  className="text-[#0B6B53] hover:underline font-bold"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                className="w-full mt-2"
              >
                Sign In to AgriTech360
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 pr-1">
              <div>
                <label htmlFor="reg-name-input" className="block text-xs font-bold text-slate-700 mb-1">
                  Farmer Full Name (किसान का नाम) <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="reg-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="reg-email-input" className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="reg-email-input"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@domain.com"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="reg-pass-input" className="block text-xs font-bold text-slate-700 mb-1">
                    Password <span className="text-rose-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="reg-pass-input"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    minLength={6}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="reg-phone-input" className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone <span className="text-rose-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="reg-phone-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98..."
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="reg-acres-input" className="block text-xs font-bold text-slate-700 mb-1">
                    Land (Acres) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="reg-acres-input"
                    type="number"
                    step="0.5"
                    min="0"
                    value={acres}
                    onChange={(e) => setAcres(e.target.value)}
                    placeholder="e.g. 5.5"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="reg-village-input" className="block text-xs font-bold text-slate-700 mb-1">
                    Village / Tehsil
                  </label>
                  <input
                    id="reg-village-input"
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Village Name"
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="reg-soil-select" className="block text-xs font-bold text-slate-700 mb-1">
                    Soil Type
                  </label>
                  <select
                    id="reg-soil-select"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs transition-all"
                  >
                    <option value="Black">Black Soil (काली मिट्टी)</option>
                    <option value="Alluvial">Alluvial Soil (जलोढ़)</option>
                    <option value="Red">Red Soil (लाल)</option>
                    <option value="Loamy">Loamy Soil (दोमट)</option>
                    <option value="Sandy Loam">Sandy Loam (बलुई दोमट)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="reg-district-input" className="block text-xs font-bold text-slate-700 mb-1">
                    District / City <span className="text-rose-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="reg-district-input"
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="District"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="reg-state-input" className="block text-xs font-bold text-slate-700 mb-1">
                    State <span className="text-rose-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="reg-state-input"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Madhya Pradesh"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                className="w-full mt-3"
              >
                Create Farm Profile & Access
              </Button>
            </form>
          )}

          <div className="mt-5 pt-3.5 border-t border-black/[0.06] flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
            <Shield className="w-3.5 h-3.5 text-[#0B6B53]" aria-hidden="true" />
            Protected by JWT & Indian Digital Agristack protocols
          </div>
        </div>
      </div>
    </div>
  );
};
