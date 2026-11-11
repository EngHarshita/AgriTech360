import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import type { UserRole } from '../../types';

export const RegisterPage: React.FC = () => {
  const { user, isAuthenticated, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('Madhya Pradesh');
  const [district, setDistrict] = useState('');

  // Farmer-specific fields
  const [village, setVillage] = useState('');
  const [acres, setAcres] = useState('');
  const [soilType, setSoilType] = useState('Black');

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      const destination = user.role === 'admin' ? '/admin/dashboard' : '/farmer/dashboard';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        role: 'farmer' as UserRole,
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
      showToast('Farmer profile registered successfully! Welcome to AgriTech360.', 'success');
      navigate('/farmer/dashboard');
    } catch (err: any) {
      const msg = err?.message || 'Registration failed. Please verify all required fields.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-black/[0.08] p-8 animate-in fade-in zoom-in-95">
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

        <div className="mb-5">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Farmer Registration</h2>
            <span className="px-2 py-0.5 rounded-md bg-[#0B6B53]/10 text-[#0B6B53] text-[11px] font-bold">
              किसान पंजीकरण
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Register your farm profile to access AI crop advisory, weather forecasts, and APMC market prices.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200/90 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" aria-hidden="true" />
            <span className="font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Identity Fields */}
          <div>
            <label htmlFor="reg-name" className="block text-xs font-bold text-slate-700 mb-1">
              Farmer Full Name (किसान का पूरा नाम) <span className="text-rose-500">*</span>
            </label>
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Patel"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs"
              />
            </div>
            <div>
              <label htmlFor="reg-phone" className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="reg-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-xs font-bold text-slate-700 mb-1">
              Password <span className="text-rose-500">*</span> <span className="text-[10px] text-slate-400 font-normal">(Min 6 characters)</span>
            </label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs"
            />
          </div>

          {/* Farm Details */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label htmlFor="reg-acres" className="block text-xs font-bold text-slate-700 mb-1">
                Land Holding (Acres) <span className="text-rose-500">*</span>
              </label>
              <input
                id="reg-acres"
                type="number"
                step="0.5"
                min="0"
                value={acres}
                onChange={(e) => setAcres(e.target.value)}
                placeholder="e.g. 8.5"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs"
              />
            </div>
            <div>
              <label htmlFor="reg-soil" className="block text-xs font-bold text-slate-700 mb-1">
                Soil Classification (मिट्टी का प्रकार)
              </label>
              <select
                id="reg-soil"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs"
              >
                <option value="Black">Black Soil (काली मिट्टी)</option>
                <option value="Alluvial">Alluvial Soil (जलोढ़)</option>
                <option value="Red">Red Soil (लाल)</option>
                <option value="Loamy">Loamy Soil (दोमट)</option>
                <option value="Sandy Loam">Sandy Loam (बलुई दोमट)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="reg-village" className="block text-xs font-bold text-slate-700 mb-1">
              Village / Tehsil (गाँव / तहसील)
            </label>
            <input
              id="reg-village"
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="e.g. Pipariya Kalan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs"
            />
          </div>

          {/* Location Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="reg-district" className="block text-xs font-bold text-slate-700 mb-1">
                District (ज़िला) <span className="text-rose-500">*</span>
              </label>
              <input
                id="reg-district"
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Indore"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs"
              />
            </div>
            <div>
              <label htmlFor="reg-state" className="block text-xs font-bold text-slate-700 mb-1">
                State (राज्य) <span className="text-rose-500">*</span>
              </label>
              <input
                id="reg-state"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Madhya Pradesh"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#0B6B53]/20 outline-none bg-white shadow-2xs"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={loading}
            className="w-full mt-4"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Farmer Account (किसान खाता बनाएं)
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-black/[0.06] text-center">
          <p className="text-xs text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0B6B53] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <Shield className="w-3.5 h-3.5 text-[#0B6B53]" aria-hidden="true" />
          Digital Agristack verified • Public admin registration prohibited
        </div>
      </div>
    </div>
  );
};
