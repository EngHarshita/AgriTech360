import React, { useEffect, useState, useCallback } from 'react';
import { 
  Sprout, 
  CloudSun, 
  TrendingUp, 
  FileText, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Droplets, 
  Activity, 
  ChevronRight, 
  ShieldCheck,
  Layers,
  MapPin,
  CheckCircle2,
  Bell,
  Clock,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAgri } from '../../context/AgriContext';
import { useToast } from '../../context/ToastContext';
import { VoiceAccessibility } from '../common/VoiceAccessibility';
import { agriService } from '../../api/agriService';
import { env } from '../../config/env';
import type { 
  FarmMetric, 
  WeatherIntelligence, 
  MandiPriceItem, 
  FarmParcel, 
  FarmAlert, 
  GovernmentScheme 
} from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';

interface DashboardViewProps {
  onNavigate: (module: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t, isHindi, formatNumberLocale } = useLanguage();
  const { currentSelectedLocation } = useAgri();
  const { showToast } = useToast();

  const [metrics, setMetrics] = useState<FarmMetric[]>([]);
  const [weather, setWeather] = useState<WeatherIntelligence | null>(null);
  const [mandiPrices, setMandiPrices] = useState<MandiPriceItem[]>([]);
  const [parcels, setParcels] = useState<FarmParcel[]>([]);
  const [alerts, setAlerts] = useState<FarmAlert[]>([]);
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const location = currentSelectedLocation || user?.location?.district || 'Indore';
      const [metricData, weatherData, priceData, parcelData, alertData, schemeData] = await Promise.all([
        agriService.getDashboardMetrics().catch(() => []),
        agriService.getWeatherIntelligence(location).catch(() => null),
        agriService.getMandiPrices().catch(() => []),
        agriService.getFarmParcels().catch(() => []),
        agriService.getAlerts().catch(() => []),
        agriService.getGovernmentSchemes().catch(() => []),
      ]);
      setMetrics(metricData);
      setWeather(weatherData);
      setMandiPrices(priceData);
      setParcels(parcelData);
      setAlerts(alertData);
      setSchemes(schemeData);
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError('Unable to load live dashboard feeds. Check your network connection.');
      showToast('Network issue while loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentSelectedLocation, user?.location?.district, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeAdvisory = weather?.agriculturalAdvisory;

  if (error && !loading) {
    return (
      <EmptyState
        icon={<AlertTriangle className="w-8 h-8 text-rose-600" />}
        title="Dashboard Feeds Unavailable"
        description={error}
        actionText="Retry Connection"
        onAction={loadData}
        className="mt-12"
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Banner: Deep Forest Gradient with Gold Accents */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0D2B23] via-[#0B6B53] to-[#147657] text-white p-6 sm:p-8 lg:p-9 shadow-xl shadow-[#0D2B23]/15 border border-white/10">
        <div className="absolute right-0 top-0 bottom-0 opacity-15 pointer-events-none" aria-hidden="true">
          <svg className="w-96 h-96 -mr-16 -mt-16 text-white" viewBox="0 0 200 200" fill="currentColor">
            <path d="M40,100 C40,40 100,40 100,100 C100,160 160,160 160,100" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black bg-white/15 backdrop-blur-md text-[#DCF6EC] border border-white/20 flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" aria-hidden="true" />
                {isHindi ? 'रबी सीज़न 2026-27 सक्रिय' : 'Rabi Season 2026-27 Active'}
              </span>
              <span className="text-xs font-semibold text-[#8BDFC1] px-2.5 py-0.5 rounded-full bg-black/20 border border-white/10 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#F5B642]" />
                {user?.location?.village ? `${user.location.village}, ` : ''}{user?.location?.district || currentSelectedLocation}, {user?.location?.state || (isHindi ? 'मध्य प्रदेश' : 'Madhya Pradesh')}
              </span>
              {env.useMockData ? (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-amber-950 font-mono">
                  {isHindi ? 'डेमो मोड' : 'DEMO MODE'}
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-white font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" /> {isHindi ? 'लाइव कनेक्टेड' : 'LIVE CONNECTED'}
                </span>
              )}
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {isHindi ? `नमस्ते, ${user?.name || 'किसान बंधु'}! 🌾` : `Welcome, ${user?.name || 'Farmer'}! 🌾`}
            </h1>
            <p className="text-xs sm:text-sm text-[#DCF6EC]/90 max-w-xl leading-relaxed font-normal">
              {isHindi 
                ? 'आपका कृषि डैशबोर्ड सक्रिय है। अपने खेत, ताज़ा मंडी भाव, फसल सलाह और मौसम की जानकारी यहाँ से आसानी से देखें।'
                : 'Your farm intelligence dashboard is active. Land holdings, real-time APMC mandi price indices, and localized agricultural weather advisories are synced.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold text-white">
              <span className="bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15 shadow-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#F5B642]" />
                {isHindi ? 'कुल जमीन:' : 'Land:'} <strong className="text-[#F5B642]">
                  {formatNumberLocale(
                    parcels.length > 0 
                      ? Number(parcels.reduce((sum, p) => sum + (p.areaAcres || 0), 0).toFixed(1))
                      : (user?.farmDetails?.totalAcres ?? 12.5)
                  )} {isHindi ? 'एकड़' : 'Acres'}
                </strong>
                <button
                  onClick={() => onNavigate('farms')}
                  className="ml-1.5 text-[11px] underline text-[#8BDFC1] hover:text-white transition-colors"
                >
                  ({parcels.length > 0 ? parcels.length : 1} {isHindi ? 'खेत' : (parcels.length === 1 ? 'Field' : 'Fields')})
                </button>
              </span>
              <span className="bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15 shadow-xs">
                {isHindi ? 'मिट्टी:' : 'Soil:'} <strong className="text-white">{user?.farmDetails?.soilType || (parcels[0]?.soilType ?? (isHindi ? 'काली मिट्टी' : 'Black Soil'))}</strong>
              </span>
              <span className="bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15 shadow-xs">
                {isHindi ? 'सिंचाई:' : 'Irrigation:'} <strong className="text-white">{user?.farmDetails?.irrigationType || (parcels[0]?.irrigationType ?? (isHindi ? 'ड्रिप सिंचाई' : 'Drip'))}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              variant="accent"
              size="md"
              onClick={() => onNavigate('farms')}
              icon={<Layers className="w-4 h-4" aria-hidden="true" />}
              className="w-full sm:w-auto shadow-md shadow-[#F5B642]/25"
            >
              {isHindi ? `मेरे खेत (${parcels.length})` : `My Fields (${parcels.length})`}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('crop-recommendation')}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm shadow-soft"
              icon={<Sprout className="w-4 h-4 text-[#F5B642]" aria-hidden="true" />}
            >
              {isHindi ? 'फसल की सलाह लें' : 'Run AI Crop Model'}
            </Button>
          </div>
        </div>
      </div>

      {/* Advisory & Critical Alerts Banner with Voice Read-Aloud */}
      {activeAdvisory && (
        <div 
          role="region"
          aria-label={isHindi ? "मौसम एवं कृषि परामर्श" : "Agricultural Weather Advisory"}
          className="p-4 sm:p-5 rounded-2xl bg-[#FEF9EE] border-2 border-[#FBE3AA] shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#FDE68A] text-[#9C5813] flex items-center justify-center shrink-0 mt-0.5 border border-[#FCD34D]" aria-hidden="true">
              <AlertTriangle className="w-6 h-6 text-[#9C5813]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-[#683B17] uppercase tracking-wide">
                  {isHindi ? 'कृषि परामर्श' : 'Agricultural Advisory'} • {activeAdvisory.title}
                </span>
                <Badge variant="warning" size="sm">{isHindi ? 'सतर्कता' : 'Level'}: {activeAdvisory.level}</Badge>
              </div>
              <p className="text-sm text-[#7E4717] mt-1.5 leading-relaxed font-medium">
                {activeAdvisory.message}
              </p>
              <p className="text-xs text-[#683B17] mt-1 font-bold">
                💡 {isHindi ? 'सिंचाई सलाह:' : 'Irrigation tip:'} {activeAdvisory.irrigationRecommendation}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <VoiceAccessibility
              textToSpeak={`${isHindi ? 'कृषि परामर्श' : 'Agricultural Advisory'}. ${activeAdvisory.title}. ${activeAdvisory.message}. ${isHindi ? 'सिंचाई सलाह' : 'Irrigation recommendation'}: ${activeAdvisory.irrigationRecommendation}`}
              label={isHindi ? 'सलाह सुनें' : 'Read Aloud'}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('weather')}
              className="border-[#F5B642]/60 text-[#683B17] hover:bg-[#FDE68A]/60 w-full sm:w-auto"
              rightIcon={<ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />}
            >
              {isHindi ? 'मौसम देखें' : 'Spray Timeline'}
            </Button>
          </div>
        </div>
      )}

      {/* 6 Core Farmer Action Cards (Requirement 2 & 3: High visibility, simple Hindi, familiar icons) */}
      <section aria-labelledby="core-actions-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="core-actions-heading" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isHindi ? 'मुख्य सेवाएं' : 'Main Services'}
            </h2>
            <p className="text-sm text-slate-600 font-medium mt-0.5">
              {isHindi ? 'अपनी जरूरत के अनुसार सीधे विकल्प चुनें' : 'Quickly access essential agricultural tools'}
            </p>
          </div>
          <span className="text-xs font-bold text-[#0B6B53] bg-[#E8F6F1] px-3 py-1 rounded-full border border-[#BDE7D7] hidden sm:inline-block">
            {isHindi ? '6 मुख्य सुविधाएं' : '6 Core Actions'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Action 1: फसल की सलाह लें */}
          <button
            type="button"
            onClick={() => onNavigate('crop-recommendation')}
            className="group text-left p-5 sm:p-6 rounded-2xl bg-white border-2 border-emerald-100 hover:border-[#0B6B53] shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-[#0B6B53]/20 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0B6B53] border border-emerald-200 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#0B6B53] group-hover:text-white transition-all shadow-2xs">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-[#0B6B53] transition-colors">
                {t('dashboard.actions.cropAdvisory', 'फसल की सलाह लें')}
              </h3>
              <p className="text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                {t('dashboard.actions.cropAdvisoryDesc', 'अपनी जमीन और मौसम के अनुसार सबसे ज्यादा पैदावार देने वाली फसल चुनें।')}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0B6B53]">
              <span>{isHindi ? 'सलाह देखें' : 'Get Advisory'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 2: आज का मौसम देखें */}
          <button
            type="button"
            onClick={() => onNavigate('weather')}
            className="group text-left p-5 sm:p-6 rounded-2xl bg-white border-2 border-sky-100 hover:border-sky-600 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-sky-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-2xs">
                <CloudSun className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-sky-700 transition-colors">
                {t('dashboard.actions.checkWeather', 'आज का मौसम देखें')}
              </h3>
              <p className="text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                {t('dashboard.actions.checkWeatherDesc', 'आज की बारिश, तापमान और खाद या छिड़काव के लिए सही समय जानें।')}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700">
              <span>{isHindi ? 'मौसम देखें' : 'View Forecast'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 3: मंडी भाव जानें */}
          <button
            type="button"
            onClick={() => onNavigate('mandi')}
            className="group text-left p-5 sm:p-6 rounded-2xl bg-white border-2 border-amber-100 hover:border-amber-600 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-amber-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-2xs">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                {t('dashboard.actions.mandiPrices', 'मंडी भाव जानें')}
              </h3>
              <p className="text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                {t('dashboard.actions.mandiPricesDesc', 'आस-पास की मंडियों में अपनी फसल के ताजा भाव और सरकारी एमएसपी देखें।')}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>{isHindi ? 'ताजा भाव देखें' : 'Check Prices'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 4: सरकारी योजनाएँ देखें */}
          <button
            type="button"
            onClick={() => onNavigate('schemes')}
            className="group text-left p-5 sm:p-6 rounded-2xl bg-white border-2 border-emerald-100 hover:border-[#147657] shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-[#147657]/20 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#147657] border border-emerald-200 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#147657] group-hover:text-white transition-all shadow-2xs">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-[#147657] transition-colors">
                {t('dashboard.actions.govtSchemes', 'सरकारी योजनाएँ देखें')}
              </h3>
              <p className="text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                {t('dashboard.actions.govtSchemesDesc', 'सब्सिडी, पीएम किसान और कृषि उपकरणों पर मिलने वाली मदद की जानकारी लें।')}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#147657]">
              <span>{isHindi ? 'योजनाएं देखें' : 'View Schemes'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 5: अपना खेत जोड़ें */}
          <button
            type="button"
            onClick={() => onNavigate('farms')}
            className="group text-left p-5 sm:p-6 rounded-2xl bg-white border-2 border-teal-100 hover:border-teal-600 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-teal-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-2xs">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                {t('dashboard.actions.addFarm', 'अपना खेत जोड़ें')}
              </h3>
              <p className="text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                {t('dashboard.actions.addFarmDesc', 'अपने खेत का रकबा (एकड़), खसरा नंबर और मिट्टी का प्रकार सुरक्षित दर्ज करें।')}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
              <span>{isHindi ? 'खेत जोड़ें' : 'Add Parcel'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 6: किसान प्रोफ़ाइल व रिकॉर्ड्स */}
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="group text-left p-5 sm:p-6 rounded-2xl bg-white border-2 border-emerald-100 hover:border-emerald-600 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-emerald-500/20 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                {isHindi ? 'किसान प्रोफ़ाइल व KCC' : 'Farm Profile & KCC'}
              </h3>
              <p className="text-sm text-slate-600 font-medium mt-2 leading-relaxed">
                {isHindi 
                  ? 'अपनी भूमि रिकॉर्ड, किसान क्रेडिट कार्ड (KCC) और व्यक्तिगत विवरण सुरक्षित रखें।' 
                  : 'Manage your farm land records, Kisan Credit Card (KCC) limit, and profile details.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>{isHindi ? 'प्रोफ़ाइल देखें' : 'View Profile'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* Key Farm Metrics Cards (Stripe Analytics + Vercel Dashboard feel) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="stat-card" />
            ))
          : metrics.map((metric) => (
              <div
                key={metric.id}
                className="group p-5 sm:p-6 rounded-2xl bg-white border border-black/[0.06] shadow-soft hover:shadow-card hover:-translate-y-1 hover:border-black/[0.12] transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      {metric.title}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#F0F9F6] text-[#0B6B53] border border-[#DCF1EB] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#0B6B53] group-hover:text-white transition-all duration-300" aria-hidden="true">
                      {metric.iconName === 'Activity' && <Activity className="w-4 h-4" />}
                      {metric.iconName === 'Droplet' && <Droplets className="w-4 h-4" />}
                      {metric.iconName === 'TrendingUp' && <TrendingUp className="w-4 h-4" />}
                      {metric.iconName === 'ShieldCheck' && <ShieldCheck className="w-4 h-4" />}
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {metric.value}
                    </span>
                    {metric.unit && (
                      <span className="text-xs font-bold text-slate-500">
                        {metric.unit}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-black/[0.04]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-black ${
                        metric.isPositive
                          ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                          : 'bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]'
                      }`}
                    >
                      {metric.isPositive ? (
                        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" aria-hidden="true" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" aria-hidden="true" />
                      )}
                      {metric.change}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500 font-medium line-clamp-1">
                    {metric.description}
                  </p>
                </div>
              </div>
            ))}
      </div>

      {/* Two Column Layout: Weather Live Snippet & Mandi Ticker Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Intelligence Widget */}
        <Card hoverEffect className="border border-black/[0.06] shadow-soft">
          <CardHeader
            title={isHindi ? "आज का मौसम" : "Hyper-Local Weather"}
            subtitle={isHindi ? `${currentSelectedLocation} • मौसम की स्थिति` : `${currentSelectedLocation} • Microclimate Observation`}
            icon={<CloudSun className="w-5 h-5 text-[#0B6B53]" aria-hidden="true" />}
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('weather')}
                rightIcon={<ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />}
              >
                {isHindi ? "विस्तृत मौसम" : "Full Radar"}
              </Button>
            }
          />
          <CardContent className="p-5 sm:p-6">
            {loading || !weather ? (
              <div className="space-y-4">
                <Skeleton variant="card" />
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0B6B53] to-[#F5B642] flex items-center justify-center text-white shadow-md shadow-[#0B6B53]/20 text-3xl border border-white/20">
                      ☀️
                    </div>
                    <div>
                      <div className="text-3xl font-black text-slate-900 tracking-tight">
                        {weather.current.temp}°C
                      </div>
                      <div className="text-xs font-bold text-slate-700">
                        {weather.current.condition} • {isHindi ? 'अनुभव' : 'Feels like'} {weather.current.feelsLike}°C
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge variant="success" size="sm" dot>
                      {isHindi ? "छिड़काव: उत्तम" : "Spray: Excellent"}
                    </Badge>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      {isHindi ? "कीट का खतरा:" : "Pest Risk:"} {weather.agriculturalAdvisory.pestRiskLevel}
                    </p>
                  </div>
                </div>

                {/* Micro indicators */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-black/[0.05] text-center">
                  <div>
                    <span className="text-[11px] text-slate-500 block font-bold">{isHindi ? "नमी" : "Humidity"}</span>
                    <span className="text-sm sm:text-base font-black text-slate-900">{weather.current.humidity}%</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block font-bold">{isHindi ? "हवा की गति" : "Wind"}</span>
                    <span className="text-sm sm:text-base font-black text-slate-900">{weather.current.windSpeed} km/h</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block font-bold">{isHindi ? "बारिश (24 घंटे)" : "Rain (24h)"}</span>
                    <span className="text-sm sm:text-base font-black text-slate-900">{weather.current.rainfallPast24h} mm</span>
                  </div>
                </div>

                {/* 3-Day Forecast mini bar */}
                <div className="grid grid-cols-3 gap-2.5">
                  {weather.forecast.slice(0, 3).map((day) => (
                    <div key={day.date} className="p-3 rounded-xl border border-black/[0.06] text-center bg-white shadow-2xs hover:border-black/[0.12] transition-colors">
                      <span className="text-xs font-black text-slate-700 block">{day.dayName}</span>
                      <span className="text-sm sm:text-base font-black text-slate-900 block my-0.5">
                        {day.maxTemp}° / {day.minTemp}°
                      </span>
                      <span className="text-[11px] text-[#0B6B53] font-bold block truncate">
                        {day.spraySuitability}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mandi Bhav Preview */}
        <Card hoverEffect className="border border-black/[0.06] shadow-soft">
          <CardHeader
            title={isHindi ? "मंडी भाव (ताजा APMC)" : "Mandi Prices (Live APMC)"}
            subtitle={isHindi ? "बाजार भाव और सरकारी एमएसपी • स्त्रोत: AGMARKNET" : "Modal Rates vs MSP • Source: AGMARKNET"}
            icon={<TrendingUp className="w-5 h-5 text-[#C77914]" aria-hidden="true" />}
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('mandi')}
                rightIcon={<ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />}
              >
                {isHindi ? "सभी भाव देखें" : "All APMC Rates"}
              </Button>
            }
          />
          <CardContent className="p-4 sm:p-5 divide-y divide-black/[0.05]">
            <div className="flex items-center justify-between pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>{isHindi ? "फसल का नाम / मंडी" : "Commodity / APMC Hub"}</span>
              <span>{isHindi ? "भाव (₹ प्रति क्विंटल)" : "Modal / MSP Benchmark"}</span>
            </div>
            {loading ? (
              <div className="space-y-3 py-2">
                <Skeleton variant="card" />
              </div>
            ) : mandiPrices.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500 font-semibold">{isHindi ? "कोई मंडी रिकॉर्ड उपलब्ध नहीं है।" : "No mandi records available."}</p>
            ) : (
              mandiPrices.slice(0, 4).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between first:pt-2 last:pb-0 gap-3 hover:bg-slate-50/60 transition-colors px-2 rounded-xl">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-black text-slate-900 truncate">
                        {isHindi && item.hindiName ? item.hindiName : item.commodity}
                      </span>
                      {isHindi && item.hindiName && <span className="text-[11px] font-bold text-slate-500">({item.commodity})</span>}
                      <Badge variant="neutral" size="sm">{item.variety}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                      {item.market} ({item.state}) • {isHindi ? 'एमएसपी:' : 'MSP:'} ₹{item.msp}/{isHindi ? 'क्विंटल' : 'Qtl'}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-black text-slate-900">
                      ₹{formatNumberLocale(item.modalPrice)}<span className="text-[10px] font-bold text-slate-500">/{isHindi ? 'क्विंटल' : 'Qtl'}</span>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <span
                        className={`text-[11px] font-black ${
                          item.priceChange >= 0 ? 'text-[#16A34A]' : 'text-[#EF4444]'
                        }`}
                      >
                        {item.priceChange >= 0 ? `+${item.priceChange}%` : `${item.priceChange}%`}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                          item.modalPrice >= item.msp
                            ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                            : 'bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]'
                        }`}
                      >
                        {item.modalPrice >= item.msp 
                          ? (isHindi ? 'एमएसपी से अधिक' : 'Above MSP') 
                          : (isHindi ? 'एमएसपी से कम' : 'Below MSP')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div className="pt-2.5 text-[10px] text-slate-400 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> {isHindi ? 'दैनिक ताज़ा भाव सुबह 11:30 बजे अपडेट होते हैं' : 'Live updates refreshed daily at 11:30 AM'}
              </span>
              <span>Govt of India Portal</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Actionable Alerts & Government Schemes Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actionable Alerts Widget */}
        <Card hoverEffect className="border border-black/[0.06] shadow-soft">
          <CardHeader
            title={isHindi ? "जरूरी सूचनाएं व अलर्ट" : "Actionable Farm Alerts"}
            subtitle={isHindi ? "कीट चेतावनी, मौसम सलाह और कृषि सूचनाएं" : "Advisories, Pest Warnings & Agronomic Notices"}
            icon={<Bell className="w-5 h-5 text-amber-600" aria-hidden="true" />}
          />
          <CardContent className="p-4 sm:p-5 space-y-3">
            {alerts.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium py-4 text-center">
                {isHindi ? "आपके जिले के लिए कोई नया अलर्ट नहीं है।" : "No active alerts for your district."}
              </p>
            ) : (
              alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => alert.actionUrl && onNavigate(alert.actionUrl.replace('/', ''))}
                  className="p-3.5 rounded-xl border border-black/[0.06] bg-slate-50/60 hover:bg-slate-100/70 hover:border-[#0B6B53]/30 transition-all cursor-pointer flex items-start gap-3"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    alert.type === 'danger' ? 'bg-rose-100 text-rose-700' :
                    alert.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-slate-900 truncate">{alert.title}</span>
                      <span className="text-[10px] font-bold text-slate-400 shrink-0">{alert.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-0.5 line-clamp-2">{alert.message}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Government Schemes Highlight */}
        <Card hoverEffect className="border border-black/[0.06] shadow-soft">
          <CardHeader
            title={isHindi ? "सरकारी कृषि योजनाएँ" : "Active Government Schemes"}
            subtitle={isHindi ? "सब्सिडी और डायरेक्ट बेनिफिट ट्रांसफर (DBT)" : "Subsidies & Direct Benefit Transfers"}
            icon={<FileText className="w-5 h-5 text-[#0B6B53]" aria-hidden="true" />}
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('schemes')}
                rightIcon={<ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />}
              >
                {isHindi ? `सभी देखें (${schemes.length})` : `Browse All (${schemes.length})`}
              </Button>
            }
          />
          <CardContent className="p-4 sm:p-5 space-y-3">
            {schemes.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium py-4 text-center">
                {isHindi ? "कृषि योजनाएं लोड हो रही हैं..." : "Loading registered agricultural schemes..."}
              </p>
            ) : (
              schemes.slice(0, 3).map((scheme) => (
                <div
                  key={scheme.id}
                  onClick={() => onNavigate('schemes')}
                  className="p-3.5 rounded-xl border border-black/[0.06] bg-slate-50/60 hover:bg-slate-100/70 hover:border-[#0B6B53]/30 transition-all cursor-pointer flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 truncate">{scheme.title}</span>
                      <Badge variant="primary" size="sm">{scheme.category}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-1 line-clamp-1">{scheme.targetBeneficiaries}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-400 font-bold">
                      <span>{isHindi ? 'अंतिम तारीख:' : 'Deadline:'} {scheme.deadline}</span>
                      <span className="text-[#0B6B53]">{isHindi ? 'सरकारी डीबीटी पोर्टल' : 'Direct DBT Portal'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

