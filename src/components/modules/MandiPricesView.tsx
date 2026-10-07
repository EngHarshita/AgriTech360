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
import { Card, CardHeader, CardContent } from '../common/Card';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Live Mandi Prices & MSP Intelligence
            </h1>
            <Badge variant="accent" size="sm" dot>Agmarknet Verified</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Real-time modal wholesale rates across regulated APMC Mandis with official Minimum Support Price comparison.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          isLoading={loading}
          onClick={fetchPrices}
          leftIcon={<RefreshCw className="w-3.5 h-3.5 text-slate-700" aria-hidden="true" />}
        >
          Refresh Rates
        </Button>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-soft">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            Monitored Commodities
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {prices.length} Active Lots
          </div>
          <span className="text-xs text-emerald-800 font-bold mt-1 block">
            Across MP, Maharashtra & Haryana Mandis
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-soft">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            Above MSP Percentage
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
            {Math.round((prices.filter((p) => p.modalPrice >= p.msp).length / (prices.length || 1)) * 100)}%
          </div>
          <span className="text-xs text-slate-600 font-semibold mt-1 block">
            Trading at or higher than central MSP
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-soft">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            Top Gainer Today
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Mustard (Sarson)
          </div>
          <span className="text-xs text-emerald-700 font-bold mt-1 block flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" /> +3.8% in Morena Mandi
          </span>
        </div>
      </div>

      {/* Harvest Revenue Calculator Widget */}
      {activeCalcItem && (
        <Card className="border border-emerald-300 bg-gradient-to-r from-emerald-50/80 to-green-50/50 shadow-soft">
          <CardHeader
            title="Kisan Harvest Revenue Estimator"
            subtitle="Calculate gross revenue from your harvest based on today's modal mandi rate"
            icon={<Calculator className="w-5 h-5 text-emerald-700" aria-hidden="true" />}
          />
          <CardContent className="p-5 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label htmlFor="calc-commodity-select" className="block text-xs font-black text-slate-800 mb-1">
                  Select Crop Lot
                </label>
                <select
                  id="calc-commodity-select"
                  value={calcCommodity}
                  onChange={(e) => setCalcCommodity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  {prices.map((p) => (
                    <option key={p.id} value={p.commodity}>
                      {p.commodity} ({p.market} - ₹{p.modalPrice}/Qtl)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="calc-quantity-input" className="block text-xs font-black text-slate-800 mb-1">
                  Quantity (in Quintals / 100 kg)
                </label>
                <input
                  id="calc-quantity-input"
                  type="number"
                  min="1"
                  max="10000"
                  value={calcQuantityQtl}
                  onChange={(e) => setCalcQuantityQtl(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-emerald-300 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-600 block">Total Est. Mandi Value</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-800 block mt-0.5">
                  {formatINR(calculatedTotal)}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs">
                <span className="text-[11px] font-bold text-slate-600 block">Vs Government MSP</span>
                <span className={`font-black text-xs sm:text-sm block mt-0.5 ${surplusOverMsp >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {surplusOverMsp >= 0 ? `+${formatINR(surplusOverMsp)} above MSP` : `${formatINR(surplusOverMsp)} below MSP`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <label htmlFor="mandi-search-input" className="sr-only">Search commodity, market, or state</label>
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" aria-hidden="true" />
          <input
            id="mandi-search-input"
            type="text"
            placeholder="Search commodity (e.g. Wheat, Gram), mandi, or state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 p-0.5 rounded text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1" role="toolbar" aria-label="Filter commodity categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Content: Mobile Cards + Desktop Table */}
      {loading ? (
        <Card className="border border-slate-200/90 overflow-hidden">
          <div className="p-6 space-y-4">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
        </Card>
      ) : prices.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8 text-amber-600" />}
          title="No Commodities Match Query"
          description={`No results found for "${search || selectedCategory}". Try searching for popular crops like Soybean, Wheat, or Mustard.`}
          actionText="Reset Search & Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <>
          {/* Mobile Card Layout (Visible on < 768px) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {prices.map((item) => {
              const isAboveMsp = item.modalPrice >= item.msp;
              return (
                <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-soft space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-sm text-slate-900">{item.commodity}</span>
                        {item.hindiName && (
                          <span className="text-[11px] font-bold text-slate-600">({item.hindiName})</span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-medium block mt-0.5">{item.variety} • {item.category}</span>
                    </div>
                    <Badge variant={item.priceChange >= 0 ? 'success' : 'danger'} size="sm">
                      {item.priceChange >= 0 ? `+${item.priceChange}%` : `${item.priceChange}%`}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-600 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                    <span>{item.market}, {item.district} ({item.state})</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Modal Rate</span>
                      <span className="text-base font-black text-slate-900">₹{item.modalPrice.toLocaleString('en-IN')}/Qtl</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Govt MSP</span>
                      <span className="text-xs font-bold text-slate-700">₹{item.msp}/Qtl</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <Badge variant={isAboveMsp ? 'success' : 'danger'} size="sm">
                      {isAboveMsp ? `+₹${item.modalPrice - item.msp} above MSP` : `-₹${item.msp - item.modalPrice} below MSP`}
                    </Badge>
                    <span className="text-[11px] font-semibold text-slate-500">Vol: {item.volumeTradedTons} MT</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table Layout (Visible on >= 768px) */}
          <Card className="hidden md:block border border-slate-200/90 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" aria-label="Mandi commodity wholesale price list">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-xs font-black uppercase tracking-wider text-slate-600">
                    <th className="p-4 pl-6" scope="col">Commodity & Variety</th>
                    <th className="p-4" scope="col">APMC Market</th>
                    <th className="p-4 text-right" scope="col">Modal Price</th>
                    <th className="p-4 text-center" scope="col">Day Trend</th>
                    <th className="p-4 text-right" scope="col">MSP Comparison</th>
                    <th className="p-4 text-right pr-6" scope="col">Volume Traded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                  {prices.map((item) => {
                    const isAboveMsp = item.modalPrice >= item.msp;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Commodity */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-sm">{item.commodity}</span>
                            {item.hindiName && (
                              <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded">
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
                            <MapPin className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
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
                              <span className="text-emerald-700 flex items-center gap-0.5 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-xs font-black">
                                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" /> +{item.priceChange}%
                              </span>
                            ) : item.priceChange < 0 ? (
                              <span className="text-rose-700 flex items-center gap-0.5 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-xs font-black">
                                <ArrowDownRight className="w-3.5 h-3.5" aria-hidden="true" /> {item.priceChange}%
                              </span>
                            ) : (
                              <span className="text-slate-700 flex items-center gap-0.5 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full text-xs font-bold">
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
                          <div className="mt-0.5">
                            <Badge variant={isAboveMsp ? 'success' : 'danger'} size="sm">
                              {isAboveMsp ? `+₹${item.modalPrice - item.msp} above MSP` : `-₹${item.msp - item.modalPrice} below MSP`}
                            </Badge>
                          </div>
                        </td>

                        {/* Volume */}
                        <td className="p-4 text-right pr-6">
                          <span className="font-black text-slate-900">{item.volumeTradedTons} MT</span>
                          <span className="block text-[11px] text-slate-500 font-medium">{item.lastUpdated}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
