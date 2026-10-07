import React, { useState } from 'react';
import { 
  MapPin, 
  Sprout, 
  Droplet, 
  Save, 
  ShieldCheck, 
  Edit3,
  Calendar,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { mockCurrentUser } from '../../data/mockData';

export const ProfileView: React.FC = () => {
  const { user, updateUser, login } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [village, setVillage] = useState(user?.location.village || '');
  const [district, setDistrict] = useState(user?.location.district || '');
  const [state, setState] = useState(user?.location.state || '');
  const [pincode, setPincode] = useState(user?.location.pincode || '');
  const [acres, setAcres] = useState(user?.farmDetails.totalAcres.toString() || '12.5');
  const [soilType, setSoilType] = useState(user?.farmDetails.soilType || 'Black');
  const [irrigationType, setIrrigationType] = useState(user?.farmDetails.irrigationType || 'Drip');
  const [kcc, setKcc] = useState(user?.farmDetails.kisanCreditCardNo || 'KCC-MP-492019-X');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    updateUser({
      name,
      email,
      phone,
      location: {
        village,
        district,
        state,
        pincode,
      },
      farmDetails: {
        ...user.farmDetails,
        totalAcres: parseFloat(acres) || 10,
        soilType: soilType as any,
        irrigationType: irrigationType as any,
        kisanCreditCardNo: kcc,
      },
    });

    setIsEditing(false);
    showToast('Farm records successfully updated in local registry and database', 'success');
  };

  const handleSwitchToDemo = async () => {
    await login(mockCurrentUser.email, 'demo');
    setName(mockCurrentUser.name);
    setEmail(mockCurrentUser.email);
    setPhone(mockCurrentUser.phone);
    setVillage(mockCurrentUser.location.village);
    setDistrict(mockCurrentUser.location.district);
    setState(mockCurrentUser.location.state);
    setPincode(mockCurrentUser.location.pincode);
    setAcres(mockCurrentUser.farmDetails.totalAcres.toString());
    setSoilType(mockCurrentUser.farmDetails.soilType);
    setIrrigationType(mockCurrentUser.farmDetails.irrigationType);
    setKcc(mockCurrentUser.farmDetails.kisanCreditCardNo || '');
    showToast('Switched to default Capstone demo farmer profile', 'info');
  };

  if (!user) {
    return (
      <div className="text-center py-20 text-slate-600 font-bold">
        Please sign in to view and manage your farm profile.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Farmer & Land Profile Management
            </h1>
            <Badge variant="success" size="sm" dot>Kisan Agristack Verified</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Manage your registered land acreage, irrigation infrastructure, and soil classification records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSwitchToDemo}
            leftIcon={<UserCheck className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />}
          >
            Reset Demo Farm
          </Button>
          <Button
            variant={isEditing ? 'outline' : 'primary'}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            leftIcon={<Edit3 className="w-3.5 h-3.5" aria-hidden="true" />}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Farm Records'}
          </Button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={`${user.name}'s profile avatar`}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-600/40 shadow-md shadow-emerald-600/10 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-slate-900">{user.name}</h2>
              <Badge variant="primary" size="sm">Active Farmer</Badge>
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
              {user.location.village}, {user.location.district}, {user.location.state} - {user.location.pincode}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" /> {user.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" /> {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" /> Member since {user.memberSince}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center md:text-right">
            <span className="text-[10px] font-black uppercase text-emerald-950 block">Kisan Credit Card (KCC)</span>
            <span className="text-xs sm:text-sm font-black text-emerald-950 block">{user.farmDetails.kisanCreditCardNo || 'Registered'}</span>
          </div>
        </div>
      </div>

      {/* Editable or Display View */}
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-6">
          <Card className="border border-slate-200/90 shadow-soft">
            <CardHeader
              title="Edit Farm & Personal Information"
              subtitle="Keep your records updated for accurate AI recommendations"
              icon={<Edit3 className="w-5 h-5 text-emerald-700" aria-hidden="true" />}
            />
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="farmer-name-input" className="block text-xs font-black text-slate-800 mb-1">
                    Full Name
                  </label>
                  <input
                    id="farmer-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="farmer-phone-input" className="block text-xs font-black text-slate-800 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    id="farmer-phone-input"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="farmer-email-input" className="block text-xs font-black text-slate-800 mb-1">
                    Email Address
                  </label>
                  <input
                    id="farmer-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="farmer-village-input" className="block text-xs font-black text-slate-800 mb-1">
                    Village / Tehsil
                  </label>
                  <input
                    id="farmer-village-input"
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="farmer-district-input" className="block text-xs font-black text-slate-800 mb-1">
                    District
                  </label>
                  <input
                    id="farmer-district-input"
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="farmer-state-input" className="block text-xs font-black text-slate-800 mb-1">
                    State
                  </label>
                  <input
                    id="farmer-state-input"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="farmer-pin-input" className="block text-xs font-black text-slate-800 mb-1">
                    PIN Code
                  </label>
                  <input
                    id="farmer-pin-input"
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-200">
                <div>
                  <label htmlFor="farmer-acres-input" className="block text-xs font-black text-slate-800 mb-1">
                    Total Land (Acres)
                  </label>
                  <input
                    id="farmer-acres-input"
                    type="number"
                    step="0.1"
                    value={acres}
                    onChange={(e) => setAcres(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="farmer-soil-select" className="block text-xs font-black text-slate-800 mb-1">
                    Soil Classification
                  </label>
                  <select
                    id="farmer-soil-select"
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
                <div>
                  <label htmlFor="farmer-irrigation-select" className="block text-xs font-black text-slate-800 mb-1">
                    Irrigation System
                  </label>
                  <select
                    id="farmer-irrigation-select"
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    <option value="Drip">Drip Irrigation (ड्रिप)</option>
                    <option value="Canal">Canal Irrigation (नहर)</option>
                    <option value="Borewell">Borewell (नलकूप)</option>
                    <option value="Sprinkler">Sprinkler (फव्वारा)</option>
                    <option value="Rainfed">Rainfed (वर्षा आधारित)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="farmer-kcc-input" className="block text-xs font-black text-slate-800 mb-1">
                    KCC Number
                  </label>
                  <input
                    id="farmer-kcc-input"
                    type="text"
                    value={kcc}
                    onChange={(e) => setKcc(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  leftIcon={<Save className="w-4 h-4" aria-hidden="true" />}
                >
                  Save Profile Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Land Holding */}
          <Card className="border border-slate-200/90 shadow-soft">
            <CardHeader
              title="Registered Farm Land"
              subtitle="Agricultural Survey Parcel"
              icon={<Sprout className="w-5 h-5 text-emerald-700" aria-hidden="true" />}
            />
            <CardContent className="p-5 space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{user.farmDetails.totalAcres}</span>
                <span className="text-sm font-bold text-slate-500">Total Acres</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Registered under PM-KISAN Portal and Madhya Pradesh Bhulekh Portal.
              </p>
              <div className="pt-2">
                <Badge variant="success" size="sm">Title Clean & Freehold</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Soil Classification */}
          <Card className="border border-slate-200/90 shadow-soft">
            <CardHeader
              title="Soil Classification"
              subtitle="Regur / Deep Black Soil"
              icon={<ShieldCheck className="w-5 h-5 text-amber-700" aria-hidden="true" />}
            />
            <CardContent className="p-5 space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{user.farmDetails.soilType} Soil</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                High clay content, excellent moisture retention. Optimal for Soybean, Cotton, and Sharbati Wheat.
              </p>
              <div className="pt-2">
                <Badge variant="accent" size="sm">Soil Card Valid (2026)</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Irrigation System */}
          <Card className="border border-slate-200/90 shadow-soft">
            <CardHeader
              title="Irrigation Infrastructure"
              subtitle="Water Source & Delivery"
              icon={<Droplet className="w-5 h-5 text-sky-700" aria-hidden="true" />}
            />
            <CardContent className="p-5 space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{user.farmDetails.irrigationType}</span>
                <span className="text-xs text-emerald-800 font-bold">+ Borewell</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Micro-irrigation enabled with PMKSY subsidy. Delivers high water efficiency (90%+).
              </p>
              <div className="pt-2">
                <Badge variant="info" size="sm">70% Water Saved</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Primary Crops Cultivated */}
      <Card className="border border-slate-200/90 shadow-soft">
        <CardHeader
          title="Primary Crop Rotation Cycle"
          subtitle="Registered Cultivars for 2026 Season"
          icon={<Sprout className="w-5 h-5 text-emerald-700" aria-hidden="true" />}
        />
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-2.5">
            {user.farmDetails.primaryCrops.map((crop, idx) => (
              <div
                key={idx}
                className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-black text-slate-900 flex items-center gap-2 shadow-2xs"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" aria-hidden="true" />
                {crop}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
