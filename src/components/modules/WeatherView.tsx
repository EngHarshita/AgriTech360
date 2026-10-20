import React, { useEffect, useState } from 'react';
import { 
  Droplets, 
  Wind, 
  Thermometer, 
  Sun, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  MapPin, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useAgri } from '../../context/AgriContext';
import { useToast } from '../../context/ToastContext';
import { agriService } from '../../api/agriService';
import type { WeatherIntelligence } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';

export const WeatherView: React.FC = () => {
  const { currentSelectedLocation } = useAgri();
  const { showToast } = useToast();
  const [weather, setWeather] = useState<WeatherIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await agriService.getWeatherIntelligence(currentSelectedLocation);
      setWeather(data);
      showToast('Live satellite weather and spray advisory updated', 'info');
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to connect to OpenWeather agro-meteorological station.');
      showToast('Could not refresh weather feed', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await agriService.getWeatherIntelligence(currentSelectedLocation);
        if (isMounted) setWeather(data);
      } catch (err) {
        console.error('Error fetching weather:', err);
        if (isMounted) setError('Failed to connect to agro-meteorological station.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [currentSelectedLocation]);

  if (error && !loading) {
    return (
      <EmptyState
        icon={<AlertTriangle className="w-8 h-8 text-rose-600" />}
        title="Weather Station Unavailable"
        description={error}
        actionText="Reconnect Radar"
        onAction={fetchWeather}
        className="mt-12"
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Hyper-Local Weather Intelligence
            </h1>
            <Badge variant="primary" size="sm" dot>OpenWeather Synced</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#0B6B53] shrink-0" aria-hidden="true" />
            Station: <strong className="text-slate-800">{weather?.location || currentSelectedLocation}, {weather?.state || 'India'}</strong> {weather && `(Lat: ${weather.coordinates.lat}°N, Lng: ${weather.coordinates.lng}°E)`}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          isLoading={loading}
          onClick={fetchWeather}
          leftIcon={<RefreshCw className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />}
        >
          Refresh Live Radar
        </Button>
      </div>

      {loading || !weather ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <Skeleton variant="card" className="h-64" />
            </div>
            <div className="lg:col-span-5">
              <Skeleton variant="card" className="h-64" />
            </div>
          </div>
          <Skeleton variant="card" className="h-44" />
          <Skeleton variant="card" className="h-72" />
        </div>
      ) : (
        <>
          {/* Hero Weather Card & Agricultural Advisory */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Current Conditions (7 cols) */}
            <div className="lg:col-span-7">
              <Card className="border border-black/[0.06] bg-gradient-to-br from-[#F0F9F6] via-white to-[#FEF9EE]/50 shadow-soft">
                <CardContent className="p-6 sm:p-7">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#0B6B53] block">
                        Current Farm Temperature
                      </span>
                      <div className="flex items-baseline gap-3 mt-1.5">
                        <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
                          {weather.current.temp}°C
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-500">
                          Feels like {weather.current.feelsLike}°C
                        </span>
                      </div>
                      <p className="text-sm font-black text-slate-800 mt-2.5">
                        {weather.current.condition} • {weather.current.description}
                      </p>
                    </div>

                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#0B6B53] to-[#F5B642] flex items-center justify-center text-5xl shadow-lg shadow-[#0B6B53]/20 shrink-0 border border-white/20" aria-hidden="true">
                      ☀️
                    </div>
                  </div>

                  {/* Grid of micro-agrometeorology metrics */}
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-black/[0.06]">
                    <div className="p-3.5 rounded-2xl bg-white border border-black/[0.06] shadow-2xs hover:border-black/[0.12] transition-colors">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mb-1">
                        <Droplets className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" /> Humidity
                      </div>
                      <span className="text-lg font-black text-slate-900">{weather.current.humidity}%</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-black/[0.06] shadow-2xs hover:border-black/[0.12] transition-colors">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mb-1">
                        <Wind className="w-3.5 h-3.5 text-[#0B6B53]" aria-hidden="true" /> Wind Speed
                      </div>
                      <span className="text-base sm:text-lg font-black text-slate-900">{weather.current.windSpeed} km/h</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-black/[0.06] shadow-2xs hover:border-black/[0.12] transition-colors">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mb-1">
                        <Thermometer className="w-3.5 h-3.5 text-orange-600" aria-hidden="true" /> Soil Temp (10cm)
                      </div>
                      <span className="text-lg font-black text-slate-900">{weather.current.soilTemperature}°C</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-black/[0.06] shadow-2xs hover:border-black/[0.12] transition-colors">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mb-1">
                        <Sun className="w-3.5 h-3.5 text-[#C77914]" aria-hidden="true" /> Evapotranspiration
                      </div>
                      <span className="text-base sm:text-lg font-black text-slate-900">{weather.current.evapotranspiration} mm/d</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Agricultural Advisory & Spray Window (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="border border-black/[0.06] bg-white shadow-soft">
                <CardHeader
                  title="Kisan Agricultural Advisory"
                  subtitle="Daily Pest Risk & Spray Window"
                  icon={<ShieldAlert className="w-5 h-5 text-[#C77914]" aria-hidden="true" />}
                  action={<Badge variant="warning" size="sm">Level: {weather.agriculturalAdvisory.level}</Badge>}
                />
                <CardContent className="p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                      {weather.agriculturalAdvisory.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                      {weather.agriculturalAdvisory.message}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F0F9F6] border border-[#DCF1EB]">
                    <span className="text-xs font-black text-[#0B6B53] block mb-0.5">
                      💧 Irrigation Guidance
                    </span>
                    <p className="text-xs text-slate-700 font-medium">
                      {weather.agriculturalAdvisory.irrigationRecommendation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-black/[0.05] text-xs">
                    <span className="font-bold text-slate-700">Pest & Fungal Risk Index:</span>
                    <Badge variant={weather.agriculturalAdvisory.pestRiskLevel === 'Low' ? 'success' : 'warning'} size="sm">
                      {weather.agriculturalAdvisory.pestRiskLevel} Risk
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 24-Hour Hourly Timeline */}
          <Card className="border border-black/[0.06] shadow-soft">
            <CardHeader
              title="24-Hour Hourly Forecast"
              subtitle="Precipitation Probability & Wind Variations"
              icon={<Clock className="w-5 h-5 text-[#0B6B53]" aria-hidden="true" />}
            />
            <CardContent className="p-5">
              <div 
                className="flex items-center gap-3.5 overflow-x-auto pb-3 pt-1 scrollbar-thin"
                tabIndex={0}
                role="region"
                aria-label="Hourly timeline forecast"
              >
                {weather.hourly.map((h, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-24 p-3.5 rounded-2xl border border-black/[0.06] bg-slate-50/70 hover:bg-white hover:border-black/[0.12] hover:shadow-2xs transition-all text-center group"
                  >
                    <span className="text-xs font-black text-slate-600 block">{h.time}</span>
                    <span className="text-2xl my-1.5 block group-hover:scale-110 transition-transform" aria-hidden="true">🌤️</span>
                    <span className="text-base font-black text-slate-900 block">{h.temp}°C</span>
                    <div className="mt-2 text-[11px] text-sky-700 font-bold flex items-center justify-center gap-1">
                      <Droplets className="w-3 h-3 text-sky-600" aria-hidden="true" /> {h.pop}%
                    </div>
                    <div className="text-[10px] font-semibold text-slate-400 mt-0.5">
                      {h.windSpeed} km/h
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 7-Day Extended Agricultural Forecast */}
          <Card className="border border-black/[0.06] shadow-soft">
            <CardHeader
              title="7-Day Extended Agro-Forecast"
              subtitle="Spray Suitability & Rainfall Accumulation"
              icon={<Calendar className="w-5 h-5 text-[#0B6B53]" aria-hidden="true" />}
            />
            <CardContent className="p-0">
              <div className="divide-y divide-black/[0.04]">
                {weather.forecast.map((day) => (
                  <div
                    key={day.date}
                    className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-[160px]">
                      <div className="w-10 h-10 rounded-xl bg-[#FEF9EE] text-[#C77914] border border-[#FDF1D5] flex items-center justify-center font-bold text-lg" aria-hidden="true">
                        ⛅
                      </div>
                      <div>
                        <span className="text-sm font-black text-slate-900 block">{day.dayName}</span>
                        <span className="text-xs font-semibold text-slate-400">{day.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-8 flex-wrap">
                      <div className="text-xs sm:text-sm font-bold text-slate-700 min-w-[110px]">
                        {day.condition}
                      </div>

                      <div className="text-sm font-black text-slate-900 min-w-[90px]">
                        {day.maxTemp}°C <span className="text-xs font-semibold text-slate-400">/ {day.minTemp}°C</span>
                      </div>

                      <div className="text-xs font-bold text-slate-600 min-w-[90px] flex items-center gap-1.5">
                        <Droplets className="w-3.5 h-3.5 text-sky-600" aria-hidden="true" />
                        {day.rainfallMm} mm rain
                      </div>
                    </div>

                    {/* Spray Suitability Tag */}
                    <div className="flex items-center justify-between sm:justify-end gap-2">
                      <span className="text-xs font-bold text-slate-500">Pesticide Spray:</span>
                      <Badge
                        variant={
                          day.spraySuitability === 'Excellent'
                            ? 'success'
                            : day.spraySuitability === 'Good'
                            ? 'primary'
                            : day.spraySuitability === 'Fair'
                            ? 'warning'
                            : 'danger'
                        }
                        size="md"
                      >
                        {day.spraySuitability}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
