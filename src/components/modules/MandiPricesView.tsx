import React, { useEffect, useState } from 'react';
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  MapPin, 
  RefreshCw, 
  Calculator,
  X
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { agriService } from '../../api/agriService';
import type { MandiPriceItem } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import { formatINR } from '../../utils/formatters';

const CATEGORIES = ['All', 'Grains', 'Pulses', 'Oilseeds', 'Commercial', 'Spices'];

export const MandiPricesView: React.FC = () => {
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
      showToast('Live Mandi prices synchronized from APMC network', 'info');
    } catch (err) {
      console.error('Error fetching mandi prices:', err);
      showToast('Failed to refresh mandi rates', 'error');
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-black/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Live Mandi Prices & MSP Intelligence
            </h1>
            <Badge variant="accent" size="sm" dot>Agmarknet Verified</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Real-time modal wholesale rates across regulated APMC Mandis with official Minimum Support Price benchmarks.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          isLoading={loading}
          onClick={fetchPrices}
          leftIcon={<RefreshCw className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />}
        >
          Refresh Rates
        </Button>
      </div>

      {/* Hero Metrics Section: 3 Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-black/[0.06] shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Monitored Commodities
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F0F9F6] text-[#0B6B53] flex items-center justify-center font-bold text-xs" aria-hidden="true">
              APMC
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
            {prices.length} Active Lots
          </div>
          <span className="text-xs text-[#0B6B53] font-bold mt-1.5 block">
            Across MP, Maharashtra, Punjab & Haryana
          </span>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-black/[0.06] shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Above MSP Benchmark
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse" aria-hidden="true" />
          </div>
          <div className="text-3xl font-black text-[#16A34A] mt-2 tracking-tight">
            {Math.round((prices.filter((p) => p.modalPrice >= p.msp).length / (prices.length || 1)) * 100)}%
          </div>
          <span className="text-xs text-slate-500 font-semibold mt-1.5 block">
            Commodities trading higher than central MSP
          </span>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-black/[0.06] shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Top Gainer Today
            </span>
            <span className="text-xs font-bold text-[#C77914] bg-[#FEF9EE] px-2 py-0.5 rounded-full border border-[#FBE3AA]">
              Bullish
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
            Mustard (Sarson)
          </div>
          <span className="text-xs text-[#16A34A] font-bold mt-1.5 block flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" /> +3.8% in Morena APMC
          </span>
        </div>
      </div>

      {/* Harvest Revenue Calculator Widget (Premium Green/Amber Theme) */}
      {activeCalcItem && (
        <div className="rounded-2xl border border-[#0B6B53]/20 bg-gradient-to-r from-[#F0F9F6] via-white to-[#FEF9EE] p-5 sm:p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-black/[0.05]">
            <div className="w-9 h-9 rounded-xl bg-[#0B6B53] text-white flex items-center justify-center shadow-xs shrink-0">
              <Calculator className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight">Kisan Harvest Revenue Estimator</h2>
              <p className="text-xs text-slate-500 font-medium">Calculate gross return from your crop yield based on today's live modal mandi price</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label htmlFor="calc-commodity-select" className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Crop Lot
              </label>
              <select
                id="calc-commodity-select"
                value={calcCommodity}
                onChange={(e) => setCalcCommodity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.1] text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0B6B53] outline-none bg-white shadow-2xs"
              >
                {prices.map((p) => (
                  <option key={p.id} value={p.commodity}>
                    {p.commodity} ({p.market} - ₹{p.modalPrice}/Qtl)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="calc-quantity-input" className="block text-xs font-bold text-slate-700 mb-1.5">
                Yield Quantity (Quintals / 100 kg)
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Est. Mandi Gross</span>
              <span className="text-xl sm:text-2xl font-black text-[#0B6B53] block mt-0.5">
                {formatINR(calculatedTotal)}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-black/[0.08] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Vs Government MSP</span>
              <span className={`font-black text-xs sm:text-sm block mt-1 ${surplusOverMsp >= 0 ? 'text-[#16A34A]' : 'text-[#EF4444]'}`}>
                {surplusOverMsp >= 0 ? `+${formatINR(surplusOverMsp)} above MSP` : `${formatINR(surplusOverMsp)} below MSP`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <label htmlFor="mandi-search-input" className="sr-only">Search commodity, market, or state</label>
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" aria-hidden="true" />
          <input
            id="mandi-search-input"
            type="text"
            placeholder="Search commodity (e.g. Wheat, Gram), APMC mandi, state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-black/[0.08] text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0B6B53] focus:border-transparent outline-none bg-white shadow-soft"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 p-0.5 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="toolbar" aria-label="Filter commodity categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B53] cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0B6B53] text-white shadow-sm shadow-[#0B6B53]/25 border border-[#0B6B53]'
                  : 'bg-white border border-black/[0.08] text-slate-700 hover:bg-slate-50 shadow-soft'
              }`}
            >
              {cat}
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
          title="No Commodities Match Query"
          description={`No results found for "${search || selectedCategory}". Try searching for popular crops like Soybean, Wheat, or Mustard.`}
          actionText="Reset Search & Filters"
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
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-sm text-slate-900">{item.commodity}</span>
                        {item.hindiName && (
                          <span className="text-[11px] font-bold text-[#0B6B53] bg-[#F0F9F6] border border-[#DCF1EB] px-1.5 py-0.5 rounded">
                            {item.hindiName}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-medium block mt-0.5">{item.variety} • {item.category}</span>
                    </div>
                    <Badge variant={item.priceChange >= 0 ? 'success' : 'danger'} size="sm">
                      {item.priceChange >= 0 ? `+${item.priceChange}%` : `${item.priceChange}%`}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#0B6B53] shrink-0" aria-hidden="true" />
                    <span>{item.market}, {item.district} ({item.state})</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-black/[0.04] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Modal Rate</span>
                      <span className="text-base font-black text-slate-900">₹{item.modalPrice.toLocaleString('en-IN')}/Qtl</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Govt MSP</span>
                      <span className="text-xs font-bold text-slate-700">₹{item.msp}/Qtl</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span
                      className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                        isAboveMsp
                          ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                          : 'bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]'
                      }`}
                    >
                      {isAboveMsp ? `+₹${item.modalPrice - item.msp} above MSP` : `-₹${item.msp - item.modalPrice} below MSP`}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">Vol: {item.volumeTradedTons} MT</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Modern Table Layout (Visible on >= 768px) */}
          <div className="hidden md:block rounded-2xl border border-black/[0.06] shadow-soft overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" aria-label="Mandi commodity wholesale price list">
                <thead>
                  <tr className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm border-b border-black/[0.06] text-xs font-black uppercase tracking-wider text-slate-500">
                    <th className="p-4 pl-6" scope="col">Commodity & Variety</th>
                    <th className="p-4" scope="col">APMC Market</th>
                    <th className="p-4 text-right" scope="col">Modal Price</th>
                    <th className="p-4 text-center" scope="col">Day Trend</th>
                    <th className="p-4 text-right" scope="col">MSP Comparison</th>
                    <th className="p-4 text-right pr-6" scope="col">Volume Traded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04] text-xs font-semibold">
                  {prices.map((item) => {
                    const isAboveMsp = item.modalPrice >= item.msp;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Commodity */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-sm">{item.commodity}</span>
                            {item.hindiName && (
                              <span className="text-[11px] font-bold text-[#0B6B53] bg-[#F0F9F6] border border-[#DCF1EB] px-1.5 py-0.5 rounded">
                                {item.hindiName}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 font-medium">
                            {item.variety} • <span className="text-slate-600">{item.category}</span>
                          </div>
                        </td>

                        {/* Market */}
                        <td className="p-4">
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#0B6B53]" aria-hidden="true" />
                            {item.market}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">{item.district}, {item.state}</div>
                        </td>

                        {/* Modal Price */}
                        <td className="p-4 text-right">
                          <div className="font-black text-base text-slate-900">
                            ₹{item.modalPrice.toLocaleString('en-IN')}
                            <span className="text-[10px] font-bold text-slate-500">/Qtl</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                            Range: ₹{item.minPrice} - ₹{item.maxPrice}
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
                            Govt MSP: ₹{item.msp}/Qtl
                          </div>
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center text-[10px] font-black px-2 py-0.5 rounded-full ${
                                isAboveMsp
                                  ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                                  : 'bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]'
                              }`}
                            >
                              {isAboveMsp ? `+₹${item.modalPrice - item.msp} above MSP` : `-₹${item.msp - item.modalPrice} below MSP`}
                            </span>
                          </div>
                        </td>

                        {/* Volume */}
                        <td className="p-4 text-right pr-6">
                          <span className="font-black text-slate-900">{item.volumeTradedTons} MT</span>
                          <span className="block text-[11px] text-slate-400 font-medium">{item.lastUpdated}</span>
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
