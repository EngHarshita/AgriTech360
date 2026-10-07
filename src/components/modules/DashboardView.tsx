import React, { useEffect, useState } from 'react';
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
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAgri } from '../../context/AgriContext';
import { useToast } from '../../context/ToastContext';
import { agriService } from '../../api/agriService';
import type { FarmMetric, WeatherIntelligence, MandiPriceItem } from '../../types';
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
  const { currentSelectedLocation } = useAgri();
  const { showToast } = useToast();

  const [metrics, setMetrics] = useState<FarmMetric[]>([]);
  const [weather, setWeather] = useState<WeatherIntelligence | null>(null);
  const [mandiPrices, setMandiPrices] = useState<MandiPriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [metricData, weatherData, priceData] = await Promise.all([
        agriService.getDashboardMetrics(),
        agriService.getWeatherIntelligence(currentSelectedLocation),
        agriService.getMandiPrices(),
      ]);
      setMetrics(metricData);
      setWeather(weatherData);
      setMandiPrices(priceData);
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError('Unable to load live dashboard feeds. Check your network connection.');
      showToast('Network issue while loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const [metricData, weatherData, priceData] = await Promise.all([
          agriService.getDashboardMetrics(),
          agriService.getWeatherIntelligence(currentSelectedLocation),
          agriService.getMandiPrices(),
        ]);
        if (isMounted) {
          setMetrics(metricData);
          setWeather(weatherData);
          setMandiPrices(priceData);
        }
      } catch (err: any) {
        console.error('Error loading dashboard data:', err);
        if (isMounted) {
          setError('Unable to load live dashboard feeds. Check your network connection.');
          showToast('Network issue while loading dashboard data', 'error');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, [currentSelectedLocation, showToast]);

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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 sm:p-7 lg:p-8 shadow-xl shadow-emerald-950/15">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none" aria-hidden="true">
          <svg className="w-96 h-96 -mr-16 -mt-16" viewBox="0 0 200 200" fill="currentColor">
            <path d="M40,100 C40,40 100,40 100,100 C100,160 160,160 160,100" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-white/20 backdrop-blur-md text-emerald-100 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                Rabi Season 2026-27 Active
              </span>
              <span className="text-xs font-semibold text-emerald-200">
                {currentSelectedLocation}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Namaste, {user?.name || 'Kisan Bandhu'}! 🌾
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
              Your farm intelligence portal is active. Soil moisture is optimal for vegetative crop growth, and local mandi prices for Soybean are up by 2.4%.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold text-emerald-200">
              <span className="bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-700/40">
                Land: <strong className="text-white">{user?.farmDetails.totalAcres || 12.5} Acres</strong>
              </span>
              <span className="bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-700/40">
                Soil: <strong className="text-white">{user?.farmDetails.soilType || 'Black'}</strong>
              </span>
              <span className="bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-700/40">
                Irrigation: <strong className="text-white">{user?.farmDetails.irrigationType || 'Drip'}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 shrink-0">
            <Button
              variant="accent"
              size="md"
              onClick={() => onNavigate('crop-recommendation')}
              leftIcon={<Sprout className="w-4 h-4" aria-hidden="true" />}
              className="w-full sm:w-auto"
            >
              Run AI Crop Model
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('mandi')}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30"
              leftIcon={<TrendingUp className="w-4 h-4" aria-hidden="true" />}
            >
              Check Mandi Bhav
            </Button>
          </div>
        </div>
      </div>

      {/* Advisory & Critical Alerts Banner */}
      {activeAdvisory && (
        <div 
          role="region"
          aria-label="Agricultural Weather Advisory"
          className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
              <AlertTriangle className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-amber-950 uppercase tracking-wide">
                  Agricultural Advisory • {activeAdvisory.title}
                </span>
                <Badge variant="warning" size="sm">Level: {activeAdvisory.level}</Badge>
              </div>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                {activeAdvisory.message} <strong className="font-extrabold text-amber-950">Tip:</strong> {activeAdvisory.irrigationRecommendation}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('weather')}
            className="shrink-0 border-amber-400 text-amber-950 hover:bg-amber-100/80 w-full sm:w-auto"
            rightIcon={<ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />}
          >
            Spray Timeline
          </Button>
        </div>
      )}

      {/* Key Farm Metrics Cards (Loading Skeletons or Content) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="stat-card" />
            ))
          : metrics.map((metric) => (
              <Card key={metric.id} hoverEffect className="border border-slate-200/90 shadow-soft">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                      {metric.title}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0" aria-hidden="true">
                      {metric.iconName === 'Activity' && <Activity className="w-4 h-4" />}
                      {metric.iconName === 'Droplet' && <Droplets className="w-4 h-4" />}
                      {metric.iconName === 'TrendingUp' && <TrendingUp className="w-4 h-4" />}
                      {metric.iconName === 'ShieldCheck' && <ShieldCheck className="w-4 h-4" />}
                    </div>
                  </div>

                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {metric.value}
                    </span>
                    {metric.unit && (
                      <span className="text-xs font-bold text-slate-500">
                        {metric.unit}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center text-xs font-bold ${
                        metric.isPositive ? 'text-emerald-700' : 'text-rose-700'
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

                  <p className="mt-2 text-xs text-slate-600 font-medium line-clamp-1">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Mid Section: Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Module 3 Trigger */}
        <div 
          onClick={() => onNavigate('crop-recommendation')}
          onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('crop-recommendation'); }}
          tabIndex={0}
          role="button"
          aria-label="Navigate to AI Crop Recommendation"
          className="group cursor-pointer p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500 hover:shadow-card transition-all duration-300 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" aria-hidden="true">
            <Sprout className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
              AI Crop Recommendation
            </h3>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
            Input soil N-P-K, pH, & moisture to calculate suitable crops and net profit margin.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="primary" size="sm">Scikit-learn Model</Badge>
            <Badge variant="neutral" size="sm">NPK & Climate</Badge>
          </div>
        </div>

        {/* Module 5 Trigger */}
        <div 
          onClick={() => onNavigate('mandi')}
          onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('mandi'); }}
          tabIndex={0}
          role="button"
          aria-label="Navigate to Live Mandi Rates & MSP"
          className="group cursor-pointer p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-500 hover:shadow-card transition-all duration-300 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" aria-hidden="true">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-800 transition-colors">
              Live Mandi Rates & MSP
            </h3>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
            Compare Indore, Bhopal, and nearby APMC mandi prices with official Minimum Support Price.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="accent" size="sm">Live Ticker</Badge>
            <Badge variant="neutral" size="sm">APMC Verified</Badge>
          </div>
        </div>

        {/* Module 6 Trigger */}
        <div 
          onClick={() => onNavigate('schemes')}
          onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('schemes'); }}
          tabIndex={0}
          role="button"
          aria-label="Navigate to Government Schemes"
          className="group cursor-pointer p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-sky-500 hover:shadow-card transition-all duration-300 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" aria-hidden="true">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 group-hover:text-sky-800 transition-colors">
              Government Schemes
            </h3>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
            Explore subsidies for solar pumps, drip irrigation, PM-KISAN, and crop insurance enrollments.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="info" size="sm">Direct Apply Links</Badge>
            <Badge variant="neutral" size="sm">Doc Checklists</Badge>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Weather Live Snippet & Mandi Ticker Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Intelligence Widget */}
        <Card hoverEffect className="border border-slate-200/90 shadow-soft">
          <CardHeader
            title="Hyper-Local Weather"
            subtitle={`${currentSelectedLocation} • Live Forecast`}
            icon={<CloudSun className="w-5 h-5 text-emerald-600" aria-hidden="true" />}
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('weather')}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />}
              >
                Full Forecast
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
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-amber-300 flex items-center justify-center text-white shadow-md shadow-sky-500/20 text-3xl">
                      ☀️
                    </div>
                    <div>
                      <div className="text-3xl font-black text-slate-900 tracking-tight">
                        {weather.current.temp}°C
                      </div>
                      <div className="text-xs font-bold text-slate-700">
                        {weather.current.condition} • Feels like {weather.current.feelsLike}°C
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge variant="success" size="sm" dot>
                      Spray: Excellent
                    </Badge>
                    <p className="text-xs font-semibold text-slate-600 mt-1">
                      Pest Risk: {weather.agriculturalAdvisory.pestRiskLevel}
                    </p>
                  </div>
                </div>

                {/* Micro indicators */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                  <div>
                    <span className="text-[11px] text-slate-600 block font-bold">Humidity</span>
                    <span className="text-sm sm:text-base font-black text-slate-900">{weather.current.humidity}%</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-600 block font-bold">Wind</span>
                    <span className="text-sm sm:text-base font-black text-slate-900">{weather.current.windSpeed} km/h</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-600 block font-bold">Rain (24h)</span>
                    <span className="text-sm sm:text-base font-black text-slate-900">{weather.current.rainfallPast24h} mm</span>
                  </div>
                </div>

                {/* 3-Day Forecast mini bar */}
                <div className="grid grid-cols-3 gap-2">
                  {weather.forecast.slice(0, 3).map((day) => (
                    <div key={day.date} className="p-3 rounded-xl border border-slate-200 text-center bg-white shadow-2xs">
                      <span className="text-xs font-extrabold text-slate-700 block">{day.dayName}</span>
                      <span className="text-sm sm:text-base font-black text-slate-900 block my-0.5">
                        {day.maxTemp}° / {day.minTemp}°
                      </span>
                      <span className="text-[11px] text-emerald-800 font-bold block truncate">
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
        <Card hoverEffect className="border border-slate-200/90 shadow-soft">
          <CardHeader
            title="Mandi Prices (Live APMC)"
            subtitle="Today's Modal Rates vs MSP"
            icon={<TrendingUp className="w-5 h-5 text-amber-600" aria-hidden="true" />}
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('mandi')}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />}
              >
                All 50+ Mandis
              </Button>
            }
          />
          <CardContent className="p-4 sm:p-5 divide-y divide-slate-100">
            {loading ? (
              <div className="space-y-3 py-2">
                <Skeleton variant="card" />
              </div>
            ) : mandiPrices.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500 font-semibold">No mandi records available.</p>
            ) : (
              mandiPrices.slice(0, 4).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0 gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-black text-slate-900 truncate">{item.commodity}</span>
                      {item.hindiName && <span className="text-[11px] font-bold text-slate-600">({item.hindiName})</span>}
                      <Badge variant="neutral" size="sm">{item.variety}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                      {item.market} ({item.state}) • MSP: ₹{item.msp}/Qtl
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-black text-slate-900">
                      ₹{item.modalPrice.toLocaleString('en-IN')}<span className="text-[10px] font-bold text-slate-500">/Qtl</span>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <span
                        className={`text-[11px] font-black ${
                          item.priceChange >= 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {item.priceChange >= 0 ? `+${item.priceChange}%` : `${item.priceChange}%`}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                          item.modalPrice >= item.msp
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}
                      >
                        {item.modalPrice >= item.msp ? 'Above MSP' : 'Below MSP'}
                      </span>
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
