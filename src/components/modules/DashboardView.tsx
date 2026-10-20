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
                Rabi Season 2026-27 Active
              </span>
              <span className="text-xs font-semibold text-[#8BDFC1] px-2.5 py-0.5 rounded-full bg-black/20 border border-white/10">
                {currentSelectedLocation}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Namaste, {user?.name || 'Kisan Bandhu'}! 🌾
            </h1>
            <p className="text-xs sm:text-sm text-[#DCF6EC]/90 max-w-xl leading-relaxed font-normal">
              Your farm intelligence dashboard is active. Soil moisture is optimal for vegetative crop growth, and local mandi prices for Soybean are trading +2.4% above modal average.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold text-white">
              <span className="bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15 shadow-xs">
                Land: <strong className="text-[#F5B642]">{user?.farmDetails.totalAcres || 12.5} Acres</strong>
              </span>
              <span className="bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15 shadow-xs">
                Soil: <strong className="text-white">{user?.farmDetails.soilType || 'Black'}</strong>
              </span>
              <span className="bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15 shadow-xs">
                Irrigation: <strong className="text-white">{user?.farmDetails.irrigationType || 'Drip'}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              variant="accent"
              size="md"
              onClick={() => onNavigate('crop-recommendation')}
              leftIcon={<Sprout className="w-4 h-4" aria-hidden="true" />}
              className="w-full sm:w-auto shadow-md shadow-[#F5B642]/25"
            >
              Run AI Crop Model
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('mandi')}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm shadow-soft"
              leftIcon={<TrendingUp className="w-4 h-4 text-[#F5B642]" aria-hidden="true" />}
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
          className="p-4 sm:p-5 rounded-2xl bg-[#FEF9EE] border border-[#FBE3AA] shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FDE68A] text-[#9C5813] flex items-center justify-center shrink-0 mt-0.5 border border-[#FCD34D]" aria-hidden="true">
              <AlertTriangle className="w-5 h-5 text-[#9C5813]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-[#683B17] uppercase tracking-wide">
                  Agricultural Advisory • {activeAdvisory.title}
                </span>
                <Badge variant="warning" size="sm">Level: {activeAdvisory.level}</Badge>
              </div>
              <p className="text-xs text-[#7E4717] mt-1 leading-relaxed font-medium">
                {activeAdvisory.message} <strong className="font-extrabold text-[#683B17]">Tip:</strong> {activeAdvisory.irrigationRecommendation}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('weather')}
            className="shrink-0 border-[#F5B642]/60 text-[#683B17] hover:bg-[#FDE68A]/60 w-full sm:w-auto"
            rightIcon={<ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />}
          >
            Spray Timeline
          </Button>
        </div>
      )}

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

      {/* Mid Section: Quick Action Cards (Linear / Notion Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Module 3 Trigger */}
        <div 
          onClick={() => onNavigate('crop-recommendation')}
          onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('crop-recommendation'); }}
          tabIndex={0}
          role="button"
          aria-label="Navigate to AI Crop Recommendation"
          className="group cursor-pointer p-6 rounded-2xl bg-white border border-black/[0.06] hover:border-[#0B6B53]/50 hover:shadow-card hover:-translate-y-1 transition-all duration-300 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B53]"
        >
          <div className="w-11 h-11 rounded-xl bg-[#F0F9F6] text-[#0B6B53] border border-[#DCF1EB] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#0B6B53] group-hover:text-white transition-all duration-300 shadow-2xs" aria-hidden="true">
            <Sprout className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 group-hover:text-[#0B6B53] transition-colors">
              AI Crop Recommendation
            </h3>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#0B6B53] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed">
            Input soil N-P-K, pH, & moisture to calculate suitable crops and estimated net return.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="primary" size="sm">Scikit-learn ML</Badge>
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
          className="group cursor-pointer p-6 rounded-2xl bg-white border border-black/[0.06] hover:border-[#F5B642]/60 hover:shadow-card hover:-translate-y-1 transition-all duration-300 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B642]"
        >
          <div className="w-11 h-11 rounded-xl bg-[#FEF9EE] text-[#C77914] border border-[#FDF1D5] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#F5B642] group-hover:text-slate-950 transition-all duration-300 shadow-2xs" aria-hidden="true">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 group-hover:text-[#C77914] transition-colors">
              Live Mandi Rates & MSP
            </h3>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#C77914] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed">
            Compare regional APMC mandi prices with official Minimum Support Price benchmarks.
          </p>
          <div className="mt-4 flex items-center gap-2">
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
          className="group cursor-pointer p-6 rounded-2xl bg-white border border-black/[0.06] hover:border-[#1B8F6B]/60 hover:shadow-card hover:-translate-y-1 transition-all duration-300 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B8F6B]"
        >
          <div className="w-11 h-11 rounded-xl bg-[#F0FBF7] text-[#1B8F6B] border border-[#DCF6EC] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#1B8F6B] group-hover:text-white transition-all duration-300 shadow-2xs" aria-hidden="true">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 group-hover:text-[#1B8F6B] transition-colors">
              Government Schemes
            </h3>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#1B8F6B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed">
            Explore subsidies for solar pumps, drip irrigation, PM-KISAN, and PMFBY crop insurance.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="primary" size="sm">Direct DBT</Badge>
            <Badge variant="neutral" size="sm">Doc Checklists</Badge>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Weather Live Snippet & Mandi Ticker Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Intelligence Widget */}
        <Card hoverEffect className="border border-black/[0.06] shadow-soft">
          <CardHeader
            title="Hyper-Local Weather"
            subtitle={`${currentSelectedLocation} • Live Radar Forecast`}
            icon={<CloudSun className="w-5 h-5 text-[#0B6B53]" aria-hidden="true" />}
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('weather')}
                rightIcon={<ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />}
              >
                Full Radar
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
                        {weather.current.condition} • Feels like {weather.current.feelsLike}°C
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge variant="success" size="sm" dot>
                      Spray: Excellent
                    </Badge>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      Pest Risk: {weather.agriculturalAdvisory.pestRiskLevel}
                    </p>
                  </div>
                </div>

                {/* Micro indicators */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50/80 border border-black/[0.05] text-center">
                  <div>
                    <span className="text-[11px] text-slate-500 block font-bold">Humidity</span>
                    <span className="text-sm sm:text-base font-black text-slate-900">{weather.current.humidity}%</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block font-bold">Wind</span>
                    <span className="text-sm sm:text-base font-black text-slate-900">{weather.current.windSpeed} km/h</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block font-bold">Rain (24h)</span>
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
            title="Mandi Prices (Live APMC)"
            subtitle="Today's Modal Rates vs MSP"
            icon={<TrendingUp className="w-5 h-5 text-[#C77914]" aria-hidden="true" />}
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('mandi')}
                rightIcon={<ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />}
              >
                All APMC Rates
              </Button>
            }
          />
          <CardContent className="p-4 sm:p-5 divide-y divide-black/[0.05]">
            {loading ? (
              <div className="space-y-3 py-2">
                <Skeleton variant="card" />
              </div>
            ) : mandiPrices.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500 font-semibold">No mandi records available.</p>
            ) : (
              mandiPrices.slice(0, 4).map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0 gap-3 hover:bg-slate-50/60 transition-colors px-2 rounded-xl">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-black text-slate-900 truncate">{item.commodity}</span>
                      {item.hindiName && <span className="text-[11px] font-bold text-slate-500">({item.hindiName})</span>}
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
