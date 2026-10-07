import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  CheckCircle2, 
  FileCheck, 
  Calendar, 
  Building,
  X
} from 'lucide-react';
import { useAgri } from '../../context/AgriContext';
import { useToast } from '../../context/ToastContext';
import { agriService } from '../../api/agriService';
import type { GovernmentScheme } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';

const SCHEME_CATEGORIES = [
  'All',
  'Financial Assistance',
  'Crop Insurance',
  'Irrigation & Machinery',
  'Soil & Fertilizers',
  'Solar Energy',
];

export const SchemesView: React.FC = () => {
  const { savedSchemeIds, toggleSaveScheme } = useAgri();
  const { showToast } = useToast();
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchemes() {
      setLoading(true);
      try {
        const data = await agriService.getGovernmentSchemes(selectedCategory);
        setSchemes(data);
      } catch (err) {
        console.error('Error fetching schemes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSchemes();
  }, [selectedCategory]);

  const handleToggleSave = (scheme: GovernmentScheme) => {
    const willBeSaved = !savedSchemeIds.includes(scheme.id);
    toggleSaveScheme(scheme.id);
    if (willBeSaved) {
      showToast(`Bookmarked ${scheme.shortCode} to saved schemes`, 'success');
    } else {
      showToast(`Removed ${scheme.shortCode} from saved schemes`, 'info');
    }
  };

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      scheme.title.toLowerCase().includes(search.toLowerCase()) ||
      scheme.shortCode.toLowerCase().includes(search.toLowerCase()) ||
      scheme.description.toLowerCase().includes(search.toLowerCase());
    
    if (showSavedOnly) {
      return matchesSearch && savedSchemeIds.includes(scheme.id);
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Government Schemes & Subsidies (Kisan Yojna)
            </h1>
            <Badge variant="primary" size="sm" dot>DBT Direct Transfer</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Official central and state government agricultural subsidies, insurance schemes, and solar pump grants.
          </p>
        </div>

        <button
          onClick={() => setShowSavedOnly(!showSavedOnly)}
          aria-pressed={showSavedOnly}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
            showSavedOnly
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
              : 'bg-white border-2 border-slate-300 text-slate-800 hover:bg-slate-50'
          }`}
        >
          {showSavedOnly ? <BookmarkCheck className="w-4 h-4" aria-hidden="true" /> : <Bookmark className="w-4 h-4 text-emerald-600" aria-hidden="true" />}
          Saved Schemes ({savedSchemeIds.length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <label htmlFor="schemes-search-input" className="sr-only">Search government schemes</label>
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" aria-hidden="true" />
          <input
            id="schemes-search-input"
            type="text"
            placeholder="Search by scheme name, PM-KISAN, subsidy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 p-0.5 rounded text-slate-400 hover:text-slate-600"
              aria-label="Clear scheme search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1" role="toolbar" aria-label="Scheme category filters">
          {SCHEME_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setShowSavedOnly(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
                selectedCategory === cat && !showSavedOnly
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes List with Skeletons or Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <>
            <Skeleton variant="card" className="h-80" />
            <Skeleton variant="card" className="h-80" />
            <Skeleton variant="card" className="h-80" />
            <Skeleton variant="card" className="h-80" />
          </>
        ) : filteredSchemes.length === 0 ? (
          <div className="col-span-1 md:col-span-2">
            {showSavedOnly ? (
              <EmptyState
                icon={<Bookmark className="w-8 h-8 text-emerald-600" />}
                title="No Saved Schemes Yet"
                description="Click the bookmark icon on any scheme card to save it for quick reference and application checklists."
                actionText="Explore All Schemes"
                onAction={() => setShowSavedOnly(false)}
              />
            ) : (
              <EmptyState
                icon={<FileText className="w-8 h-8 text-amber-600" />}
                title="No Schemes Found"
                description={`No schemes match "${search}". Try searching by category or keywords like subsidy, insurance, or solar.`}
                actionText="Reset Search"
                onAction={() => {
                  setSearch('');
                  setSelectedCategory('All');
                }}
              />
            )}
          </div>
        ) : (
          filteredSchemes.map((scheme) => {
            const isSaved = savedSchemeIds.includes(scheme.id);
            return (
              <Card key={scheme.id} hoverEffect className="border border-slate-200/90 shadow-soft flex flex-col justify-between">
                <div>
                  {/* Card Top */}
                  <div className="p-5 pb-3 border-b border-slate-100 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                          {scheme.shortCode}
                        </span>
                        <Badge variant="neutral" size="sm">{scheme.category}</Badge>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mt-2">
                        {scheme.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                        {scheme.department}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleSave(scheme)}
                      aria-label={isSaved ? `Remove ${scheme.shortCode} from saved schemes` : `Save ${scheme.shortCode} scheme`}
                      className={`p-2.5 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
                        isSaved
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                      }`}
                    >
                      {isSaved ? <BookmarkCheck className="w-5 h-5 text-emerald-700" aria-hidden="true" /> : <Bookmark className="w-5 h-5" aria-hidden="true" />}
                    </button>
                  </div>

                  {/* Subsidy Highlight */}
                  <div className="px-5 py-3 bg-gradient-to-r from-emerald-50/90 to-teal-50/90 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-950 block">
                        Direct Subsidy / Benefit
                      </span>
                      <span className="text-sm sm:text-base font-black text-emerald-950">
                        {scheme.subsidyAmount}
                      </span>
                    </div>
                    <Badge variant="success" size="sm">{scheme.status}</Badge>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4 text-xs font-semibold">
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {scheme.description}
                    </p>

                    {/* Eligibility criteria */}
                    <div>
                      <span className="font-black text-slate-900 block mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" /> Eligibility Checklist
                      </span>
                      <ul className="space-y-1.5 pl-1" aria-label="Eligibility requirements">
                        {scheme.eligibilityCriteria.map((crit, idx) => (
                          <li key={idx} className="text-slate-700 flex items-start gap-2 text-xs font-medium">
                            <span className="text-emerald-600 font-bold mt-0.5">•</span>
                            <span>{crit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Documents Required */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-black text-slate-800 block mb-1.5 text-xs flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" /> Documents Needed
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {scheme.documentsRequired.map((doc, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-white border border-slate-300 font-bold px-2 py-0.5 rounded text-slate-800 shadow-2xs"
                          >
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Apply Link */}
                <div className="p-4 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    Deadline: <strong className="text-slate-900">{scheme.deadline}</strong>
                  </div>

                  <a
                    href={scheme.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Apply on official portal for ${scheme.title} (opens in new tab)`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-700 active:bg-emerald-800 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    Apply on Govt Portal <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
