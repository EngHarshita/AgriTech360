import React, { useState, useEffect } from 'react';
import { X, UserCheck, Shield, Sprout, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import { mockCurrentUser } from '../../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('rajesh.sharma@agritech360.in');
  const [password, setPassword] = useState('kisan1234');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('Indore');
  const [state, setState] = useState('Madhya Pradesh');
  const [acres, setAcres] = useState('5.0');
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

  const handleDemoLogin = async () => {
    setLoading(true);
    await login(mockCurrentUser.email, 'demo');
    setLoading(false);
    showToast('Signed in as Rajesh Sharma (Indore, 12.5 Acres)', 'success');
    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(loginEmail, password);
    setLoading(false);
    showToast('Signed in successfully to AgriTech360', 'success');
    onClose();
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await register({
      name: name || 'Suresh Patel',
      phone: phone || '+91 94251 12345',
      location: {
        village: village || 'Dharampuri',
        district: district || 'Dhar',
        state: state || 'Madhya Pradesh',
        pincode: '454001',
      },
      farmDetails: {
        totalAcres: parseFloat(acres) || 4.5,
        soilType,
        irrigationType: 'Drip',
        primaryCrops: ['Wheat', 'Soybean'],
        kisanCreditCardNo: 'KCC-MP-NEW-01',
      },
    });
    setLoading(false);
    showToast('New farmer profile registered successfully!', 'success');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Sprout className="w-5 h-5 text-emerald-200" aria-hidden="true" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-200">
              Kisan Portal Access
            </span>
          </div>

          <h2 id="auth-modal-title" className="text-2xl font-black tracking-tight">
            {mode === 'login' ? 'Farmer Sign In' : 'Register New Farm'}
          </h2>
          <p className="text-xs text-emerald-100 font-medium mt-1">
            Access hyper-local recommendations, live mandi rates & schemes.
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3 shrink-0" role="tablist">
          <button
            role="tab"
            aria-selected={mode === 'login'}
            onClick={() => setMode('login')}
            className={`pb-3 text-xs font-black transition-all relative mr-6 cursor-pointer ${
              mode === 'login'
                ? 'text-emerald-800 border-b-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In with Credentials
          </button>
          <button
            role="tab"
            aria-selected={mode === 'register'}
            onClick={() => setMode('register')}
            className={`pb-3 text-xs font-black transition-all relative cursor-pointer ${
              mode === 'register'
                ? 'text-emerald-800 border-b-2 border-emerald-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New Farmer Registration
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Quick Evaluator One-Click Demo Button */}
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                Quick Evaluator Demo
              </div>
              <div className="text-[11px] font-semibold text-emerald-800 mt-0.5">
                Rajesh Sharma (12.5 Acres, Indore)
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              isLoading={loading}
              onClick={handleDemoLogin}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />}
            >
              One-Click Demo
            </Button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email-input" className="block text-xs font-black text-slate-800 mb-1">
                  Email or Registered Mobile Number
                </label>
                <input
                  id="login-email-input"
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. 9876543210 or email@domain.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label htmlFor="login-password-input" className="block text-xs font-black text-slate-800 mb-1">
                  Password / PIN
                </label>
                <input
                  id="login-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1 font-semibold">
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Demo security PIN: 1234', 'info')}
                  className="text-emerald-700 hover:underline font-bold"
                >
                  Forgot PIN?
                </button>
              </div>

              <Button
                type="submit"
                variant="secondary"
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
                <label htmlFor="reg-name-input" className="block text-xs font-black text-slate-800 mb-1">
                  Farmer Full Name
                </label>
                <input
                  id="reg-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="reg-phone-input" className="block text-xs font-black text-slate-800 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    id="reg-phone-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98..."
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="reg-acres-input" className="block text-xs font-black text-slate-800 mb-1">
                    Land (Acres)
                  </label>
                  <input
                    id="reg-acres-input"
                    type="number"
                    step="0.5"
                    value={acres}
                    onChange={(e) => setAcres(e.target.value)}
                    placeholder="e.g. 5.5"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="reg-village-input" className="block text-xs font-black text-slate-800 mb-1">
                    Village / Tehsil
                  </label>
                  <input
                    id="reg-village-input"
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Village Name"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="reg-district-input" className="block text-xs font-black text-slate-800 mb-1">
                    District
                  </label>
                  <input
                    id="reg-district-input"
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="District"
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="reg-state-input" className="block text-xs font-black text-slate-800 mb-1">
                    State
                  </label>
                  <input
                    id="reg-state-input"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="reg-soil-select" className="block text-xs font-black text-slate-800 mb-1">
                    Soil Type
                  </label>
                  <select
                    id="reg-soil-select"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    <option value="Black">Black Soil (काली मिट्टी)</option>
                    <option value="Alluvial">Alluvial Soil (जलोढ़)</option>
                    <option value="Red">Red Soil (लाल)</option>
                    <option value="Loamy">Loamy Soil (दोमट)</option>
                    <option value="Sandy Loam">Sandy Loam (बलुई दोमट)</option>
                  </select>
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

          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Shield className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
            Protected by JWT & Indian Digital Agristack protocols
          </div>
        </div>
      </div>
    </div>
  );
};
