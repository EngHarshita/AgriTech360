import React, { useState } from 'react';
import { 
  Sprout, 
  FlaskConical, 
  Sparkles, 
  Calendar, 
  CheckCircle, 
  RefreshCw, 
  Info,
  BookmarkCheck
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { agriService } from '../../api/agriService';
import type { CropRecommendation, SoilParams } from '../../types';
import { Card, CardHeader, CardContent } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { formatINR } from '../../utils/formatters';

const DEFAULT_PARAMS: SoilParams = {
  nitrogen: 92,
  phosphorus: 48,
  potassium: 44,
  phLevel: 6.8,
  moisture: 38,
  rainfall: 110,
  temperature: 24,
  soilType: 'Black',
};

export const CropRecommendationView: React.FC = () => {
  const { showToast } = useToast();
  const [params, setParams] = useState<SoilParams>(DEFAULT_PARAMS);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropRecommendation | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const handlePredict = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setHasRun(true);
    setLoadingStep(1);

    const stepInterval = setInterval(() => {
      setLoadingStep((s) => (s < 3 ? s + 1 : s));
    }, 280);

    try {
      const results = await agriService.getCropRecommendations(params);
      clearInterval(stepInterval);
      setRecommendations(results);
      if (results.length > 0) {
        setSelectedCrop(results[0]);
      }
      showToast(`Generated ${results.length} crop recommendations using ML model`, 'success');
    } catch (err) {
      clearInterval(stepInterval);
      console.error('Error fetching recommendations:', err);
      showToast('Failed to run crop recommendation model', 'error');
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const handleAutofillSoilCard = () => {
    setParams({
      nitrogen: 105,
      phosphorus: 55,
      potassium: 50,
      phLevel: 7.2,
      moisture: 42,
      rainfall: 125,
      temperature: 23,
      soilType: 'Black',
    });
    showToast('Loaded Soil Health Card laboratory benchmarks (ICAR Indore)', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              AI Crop Recommendation Engine
            </h1>
            <Badge variant="success" size="sm" dot>ML Model Active</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Scikit-learn Decision Intelligence based on N-P-K soil nutrients, pH, moisture, and local weather patterns.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAutofillSoilCard}
          leftIcon={<FlaskConical className="w-4 h-4 text-emerald-700" aria-hidden="true" />}
        >
          Autofill Soil Health Card
        </Button>
      </div>

      {/* Main Grid: Input Form on Left, Output Recommendations on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border border-slate-200/90 shadow-soft">
            <CardHeader
              title="Soil & Climate Parameters"
              subtitle="Enter ICAR lab soil test or farm sensor values"
              icon={<FlaskConical className="w-5 h-5 text-emerald-700" aria-hidden="true" />}
            />
            <CardContent className="p-5">
              <form onSubmit={handlePredict} className="space-y-4">
                {/* N-P-K Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="param-nitrogen" className="block text-xs font-black text-slate-800 mb-1">
                      Nitrogen (N)
                    </label>
                    <div className="relative">
                      <input
                        id="param-nitrogen"
                        type="number"
                        min="0"
                        max="300"
                        value={params.nitrogen}
                        onChange={(e) => setParams({ ...params, nitrogen: Number(e.target.value) })}
                        required
                        aria-describedby="nitrogen-help"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                      <span id="nitrogen-help" className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-500">kg/ha</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="param-phosphorus" className="block text-xs font-black text-slate-800 mb-1">
                      Phosphorus (P)
                    </label>
                    <div className="relative">
                      <input
                        id="param-phosphorus"
                        type="number"
                        min="0"
                        max="150"
                        value={params.phosphorus}
                        onChange={(e) => setParams({ ...params, phosphorus: Number(e.target.value) })}
                        required
                        aria-describedby="phosphorus-help"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                      <span id="phosphorus-help" className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-500">kg/ha</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="param-potassium" className="block text-xs font-black text-slate-800 mb-1">
                      Potassium (K)
                    </label>
                    <div className="relative">
                      <input
                        id="param-potassium"
                        type="number"
                        min="0"
                        max="200"
                        value={params.potassium}
                        onChange={(e) => setParams({ ...params, potassium: Number(e.target.value) })}
                        required
                        aria-describedby="potassium-help"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                      <span id="potassium-help" className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-500">kg/ha</span>
                    </div>
                  </div>
                </div>

                {/* pH & Moisture */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="param-ph" className="block text-xs font-black text-slate-800 mb-1">
                      Soil pH Level (0-14)
                    </label>
                    <input
                      id="param-ph"
                      type="number"
                      step="0.1"
                      min="4.0"
                      max="9.5"
                      value={params.phLevel}
                      onChange={(e) => setParams({ ...params, phLevel: Number(e.target.value) })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <span className="text-[10px] font-semibold text-slate-500 mt-0.5 block">Ideal target: 6.5 - 7.5</span>
                  </div>

                  <div>
                    <label htmlFor="param-moisture" className="block text-xs font-black text-slate-800 mb-1">
                      Soil Moisture (%)
                    </label>
                    <input
                      id="param-moisture"
                      type="number"
                      min="0"
                      max="100"
                      value={params.moisture}
                      onChange={(e) => setParams({ ...params, moisture: Number(e.target.value) })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <span className="text-[10px] font-semibold text-slate-500 mt-0.5 block">Volumetric soil water %</span>
                  </div>
                </div>

                {/* Rainfall & Temperature */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="param-rainfall" className="block text-xs font-black text-slate-800 mb-1">
                      Avg Rainfall (mm)
                    </label>
                    <input
                      id="param-rainfall"
                      type="number"
                      min="0"
                      max="2000"
                      value={params.rainfall}
                      onChange={(e) => setParams({ ...params, rainfall: Number(e.target.value) })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="param-temp" className="block text-xs font-black text-slate-800 mb-1">
                      Temperature (°C)
                    </label>
                    <input
                      id="param-temp"
                      type="number"
                      min="5"
                      max="50"
                      value={params.temperature}
                      onChange={(e) => setParams({ ...params, temperature: Number(e.target.value) })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                {/* Soil Type Select */}
                <div>
                  <label htmlFor="param-soiltype" className="block text-xs font-black text-slate-800 mb-1">
                    Primary Soil Classification
                  </label>
                  <select
                    id="param-soiltype"
                    value={params.soilType}
                    onChange={(e) => setParams({ ...params, soilType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                  >
                    <option value="Black">Black Soil (Regur / काली मिट्टी)</option>
                    <option value="Alluvial">Alluvial Soil (जलोढ़ मिट्टी)</option>
                    <option value="Red">Red Soil (लाल मिट्टी)</option>
                    <option value="Loamy">Loamy Soil (दोमट मिट्टी)</option>
                    <option value="Sandy Loam">Sandy Loam (बलुई दोमट)</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={loading}
                  className="w-full mt-2"
                  leftIcon={<Sparkles className="w-4 h-4" aria-hidden="true" />}
                >
                  Generate Crop Recommendations
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Model info card */}
          <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex items-start gap-3 text-xs text-slate-800">
            <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-black text-emerald-950 block">About Pragati's ML Model</span>
              <p className="mt-0.5 text-slate-700 leading-relaxed font-medium">
                Random Forest Classifier trained on ICAR agriculture dataset with 94.6% validation accuracy across Kharif, Rabi, and Zaid cultivation cycles.
              </p>
            </div>
          </div>
        </div>

        {/* Results Column (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {!hasRun ? (
            <EmptyState
              icon={<Sprout className="w-8 h-8 text-emerald-600" />}
              title="Awaiting Soil Chemical Parameters"
              description="Enter your soil N-P-K nutrient values and local climate conditions on the left, or auto-fill with standard regional lab data."
              actionText="Autofill Lab Test & Run Model"
              onAction={() => {
                handleAutofillSoilCard();
                handlePredict();
              }}
              className="h-full min-h-[460px]"
            />
          ) : loading ? (
            <div className="h-full min-h-[460px] rounded-3xl border border-slate-200 bg-white p-8 flex flex-col items-center justify-center text-center shadow-soft">
              <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
              <h3 className="text-base font-black text-slate-900">
                Running Scikit-learn Classifier
              </h3>
              <p className="text-xs text-slate-600 font-medium max-w-sm mt-1 mb-6">
                Evaluating soil NPK balance, climate risk vectors, and market profitability...
              </p>

              {/* Progress Steps */}
              <div className="w-full max-w-xs space-y-2.5 text-left text-xs font-semibold">
                <div className={`flex items-center gap-2 ${loadingStep >= 1 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  <CheckCircle className={`w-4 h-4 ${loadingStep >= 1 ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>1. Parsing soil nutrients & pH</span>
                </div>
                <div className={`flex items-center gap-2 ${loadingStep >= 2 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  <CheckCircle className={`w-4 h-4 ${loadingStep >= 2 ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>2. Cross-referencing rainfall & temperature</span>
                </div>
                <div className={`flex items-center gap-2 ${loadingStep >= 3 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  <CheckCircle className={`w-4 h-4 ${loadingStep >= 3 ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>3. Calculating APMC net margins</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900">
                  Top Recommended Crops ({recommendations.length} Matches)
                </h3>
                <span className="text-xs font-bold text-slate-500">Ranked by Suitability</span>
              </div>

              {/* Recommendation Cards */}
              <div className="space-y-4">
                {recommendations.map((crop, idx) => (
                  <Card
                    key={crop.id}
                    hoverEffect
                    tabIndex={0}
                    role="button"
                    aria-label={`Select recommendation for ${crop.cropName}`}
                    onKeyDown={(e) => { if (e.key === 'Enter') setSelectedCrop(crop); }}
                    className={`border transition-all cursor-pointer ${
                      selectedCrop?.id === crop.id
                        ? 'border-emerald-600 ring-2 ring-emerald-500/30 shadow-md'
                        : 'border-slate-200/90'
                    }`}
                    onClick={() => setSelectedCrop(crop)}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                        <div className="flex items-start gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 text-white flex items-center justify-center text-xl font-black shadow-md shadow-emerald-600/20 shrink-0">
                            #{idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base sm:text-lg font-black text-slate-900">
                                {crop.cropName}
                              </h4>
                              {crop.hindiName && (
                                <span className="text-xs font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                                  {crop.hindiName}
                                </span>
                              )}
                              <Badge variant="neutral" size="sm">{crop.category}</Badge>
                            </div>
                            <p className="text-xs font-semibold text-slate-600 mt-1">
                              Season: <strong className="text-slate-900">{crop.season}</strong> • Duration: {crop.durationDays} Days • Water: {crop.waterRequirement}
                            </p>
                          </div>
                        </div>

                        {/* Suitability Score Gauge */}
                        <div className="text-right shrink-0">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-300">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                            <span className="text-base font-black">{crop.suitabilityScore}%</span>
                            <span className="text-[10px] font-extrabold uppercase">Match</span>
                          </div>
                          <span className="block text-[11px] font-bold text-slate-500 mt-1">
                            Climate Risk: <strong className={crop.climateRisk === 'Low' ? 'text-emerald-700' : 'text-amber-700'}>{crop.climateRisk}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Economics Breakdown */}
                      <div className="mt-4 grid grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-500 uppercase block">
                            Expected Yield
                          </span>
                          <span className="text-xs sm:text-sm font-black text-slate-900 mt-0.5 block">
                            {crop.expectedYield}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-500 uppercase block">
                            Cost of Cultivation
                          </span>
                          <span className="text-xs sm:text-sm font-black text-slate-800 mt-0.5 block">
                            {formatINR(crop.costOfCultivationPerAcre)}/ac
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">
                            Net Est. Profit
                          </span>
                          <span className="text-xs sm:text-sm font-black text-emerald-800 mt-0.5 block">
                            {formatINR(crop.netProfitPerAcre)}/ac
                          </span>
                        </div>
                      </div>

                      {/* Sowing window & reasons */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
                          <span>Sowing Window: <strong className="text-slate-900">{crop.bestSowingWindow}</strong></span>
                        </div>
                        <div className="text-emerald-800 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>{crop.matchReasons[0]}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Selected Crop Fertilizer & Management Drawer */}
              {selectedCrop && (
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Sprout className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                      <h4 className="text-sm sm:text-base font-black">
                        Nutrient Management Plan: {selectedCrop.cropName} ({selectedCrop.hindiName})
                      </h4>
                    </div>
                    <Badge variant="primary" size="sm" className="bg-emerald-500/20 text-emerald-200 border-none">
                      ICAR Protocol
                    </Badge>
                  </div>

                  <p className="text-xs text-emerald-200/90 mb-4 leading-relaxed">
                    Based on your soil NPK test ({params.nitrogen}-{params.phosphorus}-{params.potassium} kg/ha), apply the following fertilizer dosages:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedCrop.recommendedFertilizers.map((fert, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                        <span className="text-xs font-black text-white block">{fert.name}</span>
                        <span className="text-[11px] text-emerald-300 font-semibold block mt-1">Dosage: {fert.dosage}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-emerald-300">
                    <span>Target Soil pH: {params.phLevel} (Optimal for assimilation)</span>
                    <button 
                      onClick={() => showToast(`Nutrient plan for ${selectedCrop.cropName} saved to farm logs`, 'success')}
                      className="font-bold underline hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <BookmarkCheck className="w-3.5 h-3.5" /> Save Plan to Farm Logs
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
