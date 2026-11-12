import React, { useEffect, useState } from 'react';
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  MapPin, 
  RefreshCw, 
  Calculator,
  Calendar,
  X
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { VoiceAccessibility } from '../common/VoiceAccessibility';
import { agriService } from '../../api/agriService';
import type { MandiPriceItem } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';

const CATEGORIES_EN = ['All', 'Grains', 'Pulses', 'Oilseeds', 'Commercial', 'Spices'];

export const MandiPricesView: React.FC = () => {
  const { isHindi, formatNumberLocale } = useLanguage();
  const { showToast } = useToast();
  const [prices, setPrices] = useState<MandiPriceItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Quick Revenue Calculator state
  const [calcCommodity, setCalcCommodity] = useState<string>('Soybean');
  const [calcQuantityQtl, setCalcQuantityQtl] = useState<number>(50);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const data = await agriService.getMandiPrices(search, selectedCategory);
      setPrices(data);
      showToast(isHindi ? 'ताजा मंडी भाव अपडेट हो गए' : 'Live Mandi prices synchronized from APMC network', 'info');
    } catch (err) {
      console.error('Error fetching mandi prices:', err);
      showToast(isHindi ? 'मंडी भाव लोड नहीं हो सके' : 'Failed to refresh mandi rates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await agriService.getMandiPrices(search, selectedCategory);
        if (isMounted) setPrices(data);
      } catch (err) {
        console.error('Error fetching mandi prices:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [search, selectedCategory]);

  const activeCalcItem = prices.find((p) => p.commodity === calcCommodity) || prices[0];
  const calculatedTotal = activeCalcItem ? activeCalcItem.modalPrice * calcQuantityQtl : 0;
  const mspTotal = activeCalcItem ? activeCalcItem.msp * calcQuantityQtl : 0;
  const surplusOverMsp = calculatedTotal - mspTotal;

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
  };

  const getCategoryLabel = (cat: string) => {
    if (!isHindi) return cat;
    switch (cat) {
      case 'All': return 'सभी फसलें';
      case 'Grains': return 'अनाज';
      case 'Pulses': return 'दलहन';
      case 'Oilseeds': return 'तिलहन';
      case 'Commercial': return 'व्यापारिक';
      case 'Spices': return 'मसाले';
      default: return cat;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {isHindi ? 'मंडी भाव (ताजा APMC)' : 'Live Mandi Prices & MSP Intelligence'}
            </h1>
            <Badge variant={agriService.isMockMode ? "warning" : "accent"} size="sm" dot>
              {agriService.isMockMode ? (isHindi ? 'डेमो मंडी भाव' : 'DEMO APMC FEED') : (isHindi ? 'AGMARKNET प्रमाणित' : 'Agmarknet Verified')}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            {isHindi 
              ? 'प्रमुख कृषि उपज मंडियों (APMC) के दैनिक थोक भाव और सरकारी न्यूनतम समर्थन मूल्य (MSP)।'
              : 'Real-time modal wholesale rates across regulated APMC Mandis with official Minimum Support Price benchmarks.'}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          isLoading={loading}
          onClick={fetchPrices}
          leftIcon={<RefreshCw className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />}
        >
          {isHindi ? 'भाव रीफ्रेश करें' : 'Refresh Rates'}
        </Button>
      </div>

      {/* Hero Metrics Section: 3 Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-black/[0.06] shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              {isHindi ? 'ट्रैक की जा रही फसलें' : 'Monitored Commodities'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F0F9F6] text-[#0B6B53] flex items-center justify-center font-bold text-xs" aria-hidden="true">
              APMC
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
            {prices.length} {isHindi ? 'फसलें' : 'Active Lots'}
          </div>
          <span className="text-xs text-[#0B6B53] font-bold mt-1.5 block">
            {isHindi ? 'मध्य प्रदेश, महाराष्ट्र, पंजाब व हरियाणा की मंडियां' : 'Across MP, Maharashtra, Punjab & Haryana'}
          </span>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-black/[0.06] shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              {isHindi ? 'एमएसपी से अधिक भाव' : 'Above MSP Benchmark'}
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" aria-hidden="true" />
          </div>
          <div className="text-3xl font-black text-[#16A34A] mt-2 tracking-tight">
            {Math.round((prices.filter((p) => p.modalPrice >= p.msp).length / (prices.length || 1)) * 100)}%
          </div>
          <span className="text-xs text-slate-500 font-semibold mt-1.5 block">
            {isHindi ? 'सरकारी एमएसपी से ऊंचे दाम पर बिक रही फसलें' : 'Commodities trading higher than central MSP'}
          </span>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-black/[0.06] shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              {isHindi ? 'शीर्ष तेजी वाली फसल' : 'Top Gainer'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              🌾
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
            {isHindi ? 'सरसों (Mustard)' : 'Mustard (Sarson)'}
          </div>
          <span className="text-xs text-[#16A34A] font-bold mt-1.5 block flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" /> +3.8% {isHindi ? 'मुरैना मंडी में' : 'in Morena APMC'}
          </span>
        </div>
      </div>

      {/* Harvest Revenue Calculator Widget */}
      {activeCalcItem && (
        <div className="rounded-2xl border border-[#0B6B53]/20 bg-gradient-to-r from-[#F0F9F6] via-white to-[#FEF9EE] p-5 sm:p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-black/[0.05]">
            <div className="w-9 h-9 rounded-xl bg-[#0B6B53] text-white flex items-center justify-center shadow-xs shrink-0">
              <Calculator className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight">
                {isHindi ? 'किसान आय कैलकुलेटर (अनुमानित कमाई)' : 'Kisan Harvest Revenue Estimator'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {isHindi ? 'अपनी फसल की मात्रा लिखकर आज के मंडी भाव अनुसार कुल अनुमानित कमाई निकालें' : 'Calculate gross return from your crop yield based on today\'s live modal mandi price'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label htmlFor="calc-commodity-select" className="block text-xs font-bold text-slate-700 mb-1.5">
                {isHindi ? 'फसल चुनें' : 'Select Crop Lot'}
              </label>
              <select
                id="calc-commodity-select"
                value={calcCommodity}
                onChange={(e) => setCalcCommodity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.1] text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0B6B53] outline-none bg-white shadow-2xs"
              >
                {prices.map((p) => (
                  <option key={p.id} value={p.commodity}>
                    {isHindi && p.hindiName ? `${p.hindiName} (${p.commodity})` : p.commodity} ({p.market} - ₹{p.modalPrice}/{isHindi ? 'क्विंटल' : 'Qtl'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="calc-quantity-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                {isHindi ? 'मात्रा (क्विंटल में)' : 'Yield Quantity (Quintals / 100 kg)'}
              </label>
              <input
                id="calc-quantity-input"
                type="number"
                min="1"
                max="10000"
                value={calcQuantityQtl}
                onChange={(e) => setCalcQuantityQtl(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.1] text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0B6B53] outline-none bg-white shadow-2xs"
              />
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#0B6B53]/30 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {isHindi ? 'कुल अनुमानित मंडी मूल्य' : 'Total Est. Mandi Gross'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#0B6B53] block mt-0.5">
                ₹{formatNumberLocale(calculatedTotal)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-black/[0.08] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {isHindi ? 'सरकारी एमएसपी से तुलना' : 'Vs Government MSP'}
              </span>
              <span className={`font-black text-xs sm:text-sm block mt-1 ${surplusOverMsp >= 0 ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}>
                {surplusOverMsp >= 0 
                  ? (isHindi ? `+₹${formatNumberLocale(surplusOverMsp)} एमएसपी से अधिक` : `+₹${formatNumberLocale(surplusOverMsp)} above MSP`)
                  : (isHindi ? `-₹${formatNumberLocale(Math.abs(surplusOverMsp))} एमएसपी से कम` : `-₹${formatNumberLocale(Math.abs(surplusOverMsp))} below MSP`)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters with Voice Search Button */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input with Voice Mic */}
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <label htmlFor="mandi-search-input" className="sr-only">
              {isHindi ? 'फसल, मंडी या राज्य खोजें' : 'Search commodity, market, or state'}
            </label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" aria-hidden="true" />
            <input
              id="mandi-search-input"
              type="text"
              placeholder={isHindi ? 'फसल खोजें (उदा. सोयाबीन, गेहूं, चना)...' : 'Search commodity (e.g. Wheat, Gram), APMC mandi, state...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-black/[0.08] text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0B6B53] focus:border-transparent outline-none bg-white shadow-soft"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 p-0.5 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={isHindi ? "खोज मिटाएं" : "Clear search"}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <VoiceAccessibility
            isSearchMode
            onVoiceQuery={(query) => setSearch(query)}
            label={isHindi ? 'बोलकर खोजें' : 'Voice Search'}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="toolbar" aria-label="Filter commodity categories">
          {CATEGORIES_EN.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B53] cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0B6B53] text-white shadow-sm shadow-[#0B6B53]/25 border border-[#0B6B53]'
                  : 'bg-white border border-black/[0.08] text-slate-700 hover:bg-slate-50 shadow-soft'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Content: Mobile Cards + Desktop Modern Table */}
      {loading ? (
        <div className="p-6 space-y-4 rounded-2xl bg-white border border-black/[0.06] shadow-soft">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      ) : prices.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8 text-[#F5B642]" />}
          title={isHindi ? "कोई फसल रिकॉर्ड नहीं मिला" : "No Commodities Match Query"}
          description={isHindi ? `"${search || selectedCategory}" के लिए कोई भाव नहीं मिला। कृपया गेहूं, सोयाबीन या चना खोजें।` : `No results found for "${search || selectedCategory}".`}
          actionText={isHindi ? "खोज रीसेट करें" : "Reset Search & Filters"}
          onAction={handleResetFilters}
        />
      ) : (
        <>
          {/* Mobile Card Layout (Visible on < 768px, zero overflow) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {prices.map((item) => {
              const isAboveMsp = item.modalPrice >= item.msp;
              return (
                <div key={item.id} className="p-5 rounded-2xl bg-white border border-black/[0.06] shadow-soft space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {/* Requirement 5: फसल का नाम */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-base text-slate-900">
                          {isHindi && item.hindiName ? item.hindiName : item.commodity}
                        </span>
                        {isHindi && item.hindiName && (
                          <span className="text-xs font-bold text-slate-500">
                            ({item.commodity})
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-medium block mt-0.5">{item.variety}</span>
                    </div>
                    <Badge variant={item.priceChange >= 0 ? 'success' : 'danger'} size="sm">
                      {item.priceChange >= 0 ? `+${item.priceChange}%` : `${item.priceChange}%`}
                    </Badge>
                  </div>

                  {/* Requirement 5: मंडी का नाम */}
                  <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#0B6B53] shrink-0" aria-hidden="true" />
                    <span>{item.market}, {item.district} ({item.state})</span>
                  </div>

                  {/* Requirement 5: भाव (₹ प्रति क्विंटल) */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-black/[0.04] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {isHindi ? 'भाव (₹ प्रति क्विंटल)' : 'Modal Rate'}
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        ₹{formatNumberLocale(item.modalPrice)}/{isHindi ? 'क्विंटल' : 'Qtl'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        {isHindi ? 'सरकारी एमएसपी' : 'Govt MSP'}
                      </span>
                      <span className="text-xs font-bold text-slate-700">₹{formatNumberLocale(item.msp)}/{isHindi ? 'क्विंटल' : 'Qtl'}</span>
                    </div>
                  </div>

                  {/* Requirement 5: भाव की तारीख */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span
                      className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                        isAboveMsp
                          ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                          : 'bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]'
                      }`}
                    >
                      {isAboveMsp 
                        ? (isHindi ? `+₹${formatNumberLocale(item.modalPrice - item.msp)} एमएसपी से अधिक` : `+₹${item.modalPrice - item.msp} above MSP`)
                        : (isHindi ? `-₹${formatNumberLocale(item.msp - item.modalPrice)} एमएसपी से कम` : `-₹${item.msp - item.modalPrice} below MSP`)}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {item.lastUpdated}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Modern Table Layout (Requirement 5: Display फसल का नाम, मंडी का नाम, भाव (₹ प्रति क्विंटल), भाव की तारीख) */}
          <div className="hidden md:block rounded-2xl border border-black/[0.06] shadow-soft overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" aria-label="Mandi commodity wholesale price list">
                <thead>
                  <tr className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm border-b border-black/[0.06] text-xs font-black uppercase tracking-wider text-slate-500">
                    <th className="p-4 pl-6" scope="col">{isHindi ? 'फसल का नाम' : 'Commodity & Variety'}</th>
                    <th className="p-4" scope="col">{isHindi ? 'मंडी का नाम' : 'APMC Market'}</th>
                    <th className="p-4 text-right" scope="col">{isHindi ? 'भाव (₹ प्रति क्विंटल)' : 'Modal Price (₹/Qtl)'}</th>
                    <th className="p-4 text-center" scope="col">{isHindi ? 'दैनिक रुझान' : 'Day Trend'}</th>
                    <th className="p-4 text-right" scope="col">{isHindi ? 'एमएसपी तुलना' : 'MSP Comparison'}</th>
                    <th className="p-4 text-right pr-6" scope="col">{isHindi ? 'भाव की तारीख' : 'Quotation Date'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] text-xs font-semibold">
                  {prices.map((item) => {
                    const isAboveMsp = item.modalPrice >= item.msp;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Requirement 5: फसल का नाम */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-sm">
                              {isHindi && item.hindiName ? item.hindiName : item.commodity}
                            </span>
                            {isHindi && item.hindiName && (
                              <span className="text-xs font-bold text-slate-500">
                                ({item.commodity})
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 font-medium">
                            {item.variety} • <span className="text-slate-600">{getCategoryLabel(item.category)}</span>
                          </div>
                        </td>

                        {/* Requirement 5: मंडी का नाम */}
                        <td className="p-4">
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#0B6B53]" aria-hidden="true" />
                            {item.market}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">{item.district}, {item.state}</div>
                        </td>

                        {/* Requirement 5: भाव (₹ प्रति क्विंटल) */}
                        <td className="p-4 text-right">
                          <div className="font-black text-base text-slate-900">
                            ₹{formatNumberLocale(item.modalPrice)}
                            <span className="text-[10px] font-bold text-slate-500">/{isHindi ? 'क्विंटल' : 'Qtl'}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                            {isHindi ? 'दायरा:' : 'Range:'} ₹{formatNumberLocale(item.minPrice)} - ₹{formatNumberLocale(item.maxPrice)}
                          </div>
                        </td>

                        {/* Trend */}
                        <td className="p-4 text-center">
                          <div className="inline-flex items-center gap-1 font-bold">
                            {item.priceChange > 0 ? (
                              <span className="text-[#16A34A] flex items-center gap-0.5 bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-0.5 rounded-full text-xs font-black">
                                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" /> +{item.priceChange}%
                              </span>
                            ) : item.priceChange < 0 ? (
                              <span className="text-[#EF4444] flex items-center gap-0.5 bg-[#FEF2F2] border border-[#FECACA] px-2.5 py-0.5 rounded-full text-xs font-black">
                                <ArrowDownRight className="w-3.5 h-3.5" aria-hidden="true" /> {item.priceChange}%
                              </span>
                            ) : (
                              <span className="text-slate-600 flex items-center gap-0.5 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                                <Minus className="w-3.5 h-3.5" aria-hidden="true" /> 0.0%
                              </span>
                            )}
                          </div>
                        </td>

                        {/* MSP Comparison */}
                        <td className="p-4 text-right">
                          <div className="text-xs font-bold text-slate-600">
                            {isHindi ? 'एमएसपी:' : 'Govt MSP:'} ₹{formatNumberLocale(item.msp)}/{isHindi ? 'क्विंटल' : 'Qtl'}
                          </div>
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center text-[10px] font-black px-2 py-0.5 rounded-full ${
                                isAboveMsp
                                  ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                                  : 'bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]'
                              }`}
                            >
                              {isAboveMsp 
                                ? (isHindi ? `+₹${formatNumberLocale(item.modalPrice - item.msp)} एमएसपी से अधिक` : `+₹${item.modalPrice - item.msp} above MSP`)
                                : (isHindi ? `-₹${formatNumberLocale(item.msp - item.modalPrice)} एमएसपी से कम` : `-₹${item.msp - item.modalPrice} below MSP`)}
                            </span>
                          </div>
                        </td>

                        {/* Requirement 5: भाव की तारीख */}
                        <td className="p-4 text-right pr-6">
                          <span className="font-black text-slate-900 block">{item.lastUpdated}</span>
                          <span className="block text-[11px] text-slate-400 font-medium">
                            {isHindi ? 'आवक:' : 'Vol:'} {item.volumeTradedTons} MT
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
