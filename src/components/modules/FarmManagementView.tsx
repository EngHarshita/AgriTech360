import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sprout, 
  Plus, 
  Edit3, 
  Trash2, 
  MapPin, 
  Layers, 
  Droplets, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { agriService } from '../../api/agriService';
import { env } from '../../config/env';
import type { FarmParcel, FarmParcelStatus, CreateFarmParcelDto } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';

const SOIL_TYPES = [
  'Deep Black Soil (Regur)',
  'Medium Black Soil',
  'Alluvial Soil',
  'Red & Yellow Soil',
  'Clay Loam Soil',
  'Sandy Loam Soil'
];

const IRRIGATION_TYPES = [
  'Drip Irrigation (Micro-irrigation)',
  'Sprinkler System',
  'Canal / Gravity Flow',
  'Tube-well / Borewell',
  'Rainfed (Barani)'
];

const SEASONS = ['Kharif 2026', 'Rabi 2026', 'Zaid 2026', 'Perennial'];
const STATUSES: FarmParcelStatus[] = ['Active Cultivation', 'Sowing Prep', 'Harvested', 'Fallow'];

export const FarmManagementView: React.FC = () => {
  const { user } = useAuth();
  const { isHindi, formatNumberLocale } = useLanguage();
  const { showToast } = useToast();

  const [parcels, setParcels] = useState<FarmParcel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingParcel, setEditingParcel] = useState<FarmParcel | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState<string>('');
  const [areaAcres, setAreaAcres] = useState<string>('5.0');
  const [surveyNumber, setSurveyNumber] = useState<string>('');
  const [village, setVillage] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [soilType, setSoilType] = useState<string>(SOIL_TYPES[0]);
  const [irrigationType, setIrrigationType] = useState<string>(IRRIGATION_TYPES[0]);
  const [currentCrop, setCurrentCrop] = useState<string>('Soybean');
  const [croppingSeason, setCroppingSeason] = useState<string>(SEASONS[0]);
  const [status, setStatus] = useState<FarmParcelStatus>('Active Cultivation');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadParcels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await agriService.getFarmParcels();
      setParcels(data);
    } catch (err: any) {
      console.error('Failed to load farm parcels:', err);
      const msg = err?.message || 'Unable to retrieve farm parcels from server.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadParcels();
  }, [loadParcels]);

  const resetForm = () => {
    setName('');
    setAreaAcres('5.0');
    setSurveyNumber('');
    setVillage(user?.location?.village || '');
    setDistrict(user?.location?.district || 'Indore');
    setState(user?.location?.state || 'Madhya Pradesh');
    setSoilType(user?.farmDetails?.soilType || SOIL_TYPES[0]);
    setIrrigationType(user?.farmDetails?.irrigationType || IRRIGATION_TYPES[0]);
    setCurrentCrop('Soybean');
    setCroppingSeason(SEASONS[0]);
    setStatus('Active Cultivation');
    setEditingParcel(null);
    setFormError(null);
    setIsModalOpen(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (parcel: FarmParcel) => {
    setEditingParcel(parcel);
    setName(parcel.name);
    setAreaAcres(parcel.areaAcres.toString());
    setSurveyNumber(parcel.surveyNumber || '');
    setVillage(parcel.village || user?.location?.village || '');
    setDistrict(parcel.district || user?.location?.district || '');
    setState(parcel.state || user?.location?.state || '');
    setSoilType(parcel.soilType || SOIL_TYPES[0]);
    setIrrigationType(parcel.irrigationType || IRRIGATION_TYPES[0]);
    setCurrentCrop(parcel.currentCrop || 'Soybean');
    setCroppingSeason(parcel.croppingSeason || SEASONS[0]);
    setStatus(parcel.status || 'Active Cultivation');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Frontend validation
    if (!name.trim() || name.trim().length < 2) {
      setFormError('Please enter a field name (at least 2 characters).');
      return;
    }

    const parsedArea = parseFloat(areaAcres);
    if (isNaN(parsedArea) || parsedArea <= 0) {
      setFormError('Area must be a valid positive number greater than 0.');
      return;
    }

    if (!district.trim()) {
      setFormError('District is required.');
      return;
    }

    setSubmitting(true);

    const payload: CreateFarmParcelDto = {
      name: name.trim(),
      areaAcres: parsedArea,
      surveyNumber: surveyNumber.trim() || undefined,
      village: village.trim() || undefined,
      district: district.trim(),
      state: state.trim(),
      soilType,
      irrigationType,
      currentCrop: currentCrop.trim(),
      croppingSeason,
      status
    };

    try {
      if (editingParcel) {
        await agriService.updateFarmParcel(editingParcel.id, payload);
        showToast(`Field "${payload.name}" updated successfully.`, 'success');
      } else {
        await agriService.createFarmParcel(payload);
        showToast(`New field "${payload.name}" (${parsedArea} acres) registered.`, 'success');
      }
      resetForm();
      await loadParcels();
    } catch (err: any) {
      console.error('Parcel mutation error:', err);
      const msg = err?.message || 'Failed to save farm parcel to backend.';
      setFormError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, fieldName: string) => {
    try {
      await agriService.deleteFarmParcel(id);
      showToast(`Field "${fieldName}" deleted successfully.`, 'success');
      setDeleteConfirmId(null);
      await loadParcels();
    } catch (err: any) {
      console.error('Delete parcel error:', err);
      showToast(err?.message || 'Failed to delete farm parcel.', 'error');
    }
  };

  const totalRegisteredAcres = parcels.reduce((sum, p) => sum + (p.areaAcres || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              {isHindi ? 'मेरी खेती और खेत की जमीन' : 'Farm Land & Field Parcels'}
            </h1>
            <Badge variant="accent" size="sm">
              <Sprout className="w-3.5 h-3.5 mr-1" />
              {parcels.length} {isHindi ? 'दर्ज खेत' : 'Registered Fields'}
            </Badge>
            {env.useMockData && (
              <Badge variant="warning" size="sm">
                {isHindi ? 'डेमो मोड' : 'SANDBOX DEMO'}
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {isHindi 
              ? 'अपने खेतों का रकबा, खसरा नंबर, मिट्टी का प्रकार और सिंचाई की जानकारी यहाँ दर्ज व प्रबंधित करें।' 
              : 'Manage your surveyed land holdings, soil classifications, and seasonal crop rotations.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadParcels}
            disabled={loading}
            icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
          >
            {isHindi ? 'ताजा करें' : 'Refresh'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            {isHindi ? 'नया खेत जोड़ें' : 'Register Field'}
          </Button>
        </div>
      </div>

      {/* Aggregate Overview Stat Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-black/[0.06] shadow-soft">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {isHindi ? 'कुल खेती का रकबा' : 'Total Cultivated Area'}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-900">{formatNumberLocale(Number(totalRegisteredAcres.toFixed(1)))}</span>
            <span className="text-xs font-bold text-[#0B6B53]">{isHindi ? 'एकड़' : 'Acres'}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            {isHindi ? `${parcels.length} खेतों में विभाजित` : `Across ${parcels.length} surveyed parcels`}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-black/[0.06] shadow-soft">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {isHindi ? 'वर्तमान फसल' : 'Active Kharif Crop'}
          </span>
          <div className="text-lg font-black text-slate-900 mt-1 truncate">
            {parcels.find((p) => p.status === 'Active Cultivation')?.currentCrop || (isHindi ? 'सोयाबीन व दलहन' : 'Soybean & Pulses')}
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            {isHindi ? 'वर्तमान मौसम के अनुकूल' : 'Optimal for current seasonal weather'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-black/[0.06] shadow-soft">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {isHindi ? 'मृदा स्वास्थ्य स्थिति' : 'Soil Health Status'}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-black text-[#0B6B53]">
              {isHindi ? 'ICAR सत्यापित' : 'ICAR Verified'}
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#0B6B53]" />
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-1 block">
            {isHindi ? 'भूलेख एवं सरकारी रिकॉर्ड अनुसार' : 'Bhulekh Land Record Registry'}
          </span>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold block">Could not load farm parcels:</span>
            <span>{error}</span>
            <button
              onClick={loadParcels}
              className="mt-2 text-xs font-bold underline block hover:text-rose-900"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Parcels Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-5 rounded-2xl bg-white border border-black/[0.06] space-y-4">
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : parcels.length === 0 ? (
        <EmptyState
          icon={<Sprout className="w-10 h-10 text-[#0B6B53]" />}
          title="No Farm Fields Registered Yet"
          description="Register your agricultural land parcels to track soil attributes, irrigation setups, and crop rotation schedules."
          actionText="Register First Field"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {parcels.map((parcel) => (
            <Card
              key={parcel.id}
              className="border border-black/[0.06] hover:border-[#0B6B53]/30 transition-all shadow-soft rounded-2xl bg-white flex flex-col justify-between"
            >
              <CardHeader
                title={parcel.name}
                subtitle={parcel.surveyNumber ? `Survey / Khasra: ${parcel.surveyNumber}` : 'Survey Pending'}
                icon={<Layers className="w-5 h-5 text-[#0B6B53]" />}
                action={
                  <Badge
                    variant={
                      parcel.status === 'Active Cultivation'
                        ? 'success'
                        : parcel.status === 'Sowing Prep'
                        ? 'accent'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {parcel.status}
                  </Badge>
                }
              />
              <CardContent className="p-5 space-y-4">
                <div className="flex items-baseline justify-between border-b border-black/[0.06] pb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase">Field Area</span>
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900">{parcel.areaAcres}</span>
                    <span className="text-xs font-bold text-slate-500 ml-1">Acres</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-black/[0.04]">
                    <span className="text-slate-400 font-bold uppercase block text-[10px]">Current Crop</span>
                    <span className="font-extrabold text-slate-800 mt-0.5 block truncate">
                      {parcel.currentCrop || 'Not Specified'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-black/[0.04]">
                    <span className="text-slate-400 font-bold uppercase block text-[10px]">Season</span>
                    <span className="font-extrabold text-slate-800 mt-0.5 block truncate">
                      {parcel.croppingSeason || 'Kharif 2026'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{parcel.village ? `${parcel.village}, ` : ''}{parcel.district}, {parcel.state}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Droplets className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">{parcel.irrigationType || 'Drip Irrigation'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Sparkles className="w-3.5 h-3.5 text-[#F5B642] shrink-0" />
                    <span className="truncate">{parcel.soilType || 'Black Soil'}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(parcel)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1"
                      title="Edit field details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    {deleteConfirmId === parcel.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(parcel.id, parcel.name)}
                          className="px-2 py-1 rounded bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 rounded bg-slate-200 text-slate-700 text-[11px] font-bold hover:bg-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(parcel.id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1"
                        title="Delete field"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    )}
                  </div>

                  <span className="text-[10px] font-bold text-slate-400">
                    ID: #{parcel.id.slice(-5)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Register / Edit Farm Field */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-black/[0.08] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-black/[0.06] flex items-center justify-between bg-[#F5F7F6]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0B6B53]/10 flex items-center justify-center text-[#0B6B53]">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingParcel 
                      ? (isHindi ? 'खेत की जानकारी बदलें' : 'Edit Farm Field') 
                      : (isHindi ? 'नया खेत जोड़ें' : 'Register New Farm Field')}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {isHindi ? 'कृषि भूलेख एवं जमीन रिकॉर्ड' : 'Agricultural Survey & Land Records'}
                  </p>
                </div>
              </div>
              <button
                onClick={resetForm}
                className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Field Name & Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHindi ? 'खेत का नाम *' : 'Field / Parcel Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isHindi ? 'उदा. नहर वाला खेत' : 'e.g. North Canal Plot'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-[#0B6B53] focus:ring-2 focus:ring-[#0B6B53]/20 text-sm font-semibold outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHindi ? 'रकबा (एकड़ में) *' : 'Area (Acres) *'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={areaAcres}
                    onChange={(e) => setAreaAcres(e.target.value)}
                    placeholder="5.0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-[#0B6B53] focus:ring-2 focus:ring-[#0B6B53]/20 text-sm font-semibold outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Survey Number & Village */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHindi ? 'खसरा / सर्वे नंबर' : 'Khasra / Survey Number'}
                  </label>
                  <input
                    type="text"
                    value={surveyNumber}
                    onChange={(e) => setSurveyNumber(e.target.value)}
                    placeholder={isHindi ? 'उदा. 142/3' : 'e.g. 142/3'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-[#0B6B53] focus:ring-2 focus:ring-[#0B6B53]/20 text-sm font-semibold outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHindi ? 'गाँव / क्षेत्र' : 'Village / Locality'}
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder={isHindi ? 'उदा. पिपरिया कलां' : 'e.g. Pipariya Kalan'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-[#0B6B53] focus:ring-2 focus:ring-[#0B6B53]/20 text-sm font-semibold outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* District & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHindi ? 'जिला *' : 'District *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder={isHindi ? 'उदा. इंदौर' : 'e.g. Indore'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-[#0B6B53] focus:ring-2 focus:ring-[#0B6B53]/20 text-sm font-semibold outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHindi ? 'राज्य *' : 'State *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder={isHindi ? 'उदा. मध्य प्रदेश' : 'e.g. Madhya Pradesh'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-[#0B6B53] focus:ring-2 focus:ring-[#0B6B53]/20 text-sm font-semibold outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Soil Type & Irrigation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHindi ? 'मिट्टी का प्रकार' : 'Soil Classification'}
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-[#0B6B53] focus:ring-2 focus:ring-[#0B6B53]/20 text-sm font-semibold outline-hidden transition-all bg-white"
                  >
                    {SOIL_TYPES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHindi ? 'सिंचाई व्यवस्था' : 'Irrigation System'}
                  </label>
                  <select
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:border-[#0B6B53] focus:ring-2 focus:ring-[#0B6B53]/20 text-sm font-semibold outline-hidden transition-all bg-white"
                  >
                    {IRRIGATION_TYPES.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Current Crop, Season & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHindi ? 'बोई गई फसल' : 'Current Crop'}
                  </label>
                  <input
                    type="text"
                    value={currentCrop}
                    onChange={(e) => setCurrentCrop(e.target.value)}
                    placeholder={isHindi ? 'उदा. सोयाबीन' : 'e.g. Soybean'}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 text-xs font-semibold outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHindi ? 'सीज़न' : 'Season'}
                  </label>
                  <select
                    value={croppingSeason}
                    onChange={(e) => setCroppingSeason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 text-xs font-semibold outline-hidden bg-white"
                  >
                    {SEASONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHindi ? 'स्थिति' : 'Status'}
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as FarmParcelStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 text-xs font-semibold outline-hidden bg-white"
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-black/[0.06] flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={submitting}
                >
                  {editingParcel 
                    ? (isHindi ? 'बदलाव सहेजें' : 'Save Changes') 
                    : (isHindi ? 'खेत जोड़ें' : 'Register Field')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
