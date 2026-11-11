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
  HelpCircle,
  X
} from 'lucide-react';
import { useAgri } from '../../context/AgriContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { VoiceAccessibility } from '../common/VoiceAccessibility';
import { agriService } from '../../api/agriService';
import type { GovernmentScheme } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';

const SCHEME_CATEGORIES_EN = [
  'All',
  'Financial Assistance',
  'Crop Insurance',
  'Irrigation & Machinery',
  'Soil & Fertilizers',
  'Solar Energy',
];

export const SchemesView: React.FC = () => {
  const { savedSchemeIds, toggleSaveScheme } = useAgri();
  const { isHindi } = useLanguage();
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
      showToast(isHindi ? `${scheme.shortCode} को सहेजी गई योजनाओं में जोड़ा गया` : `Bookmarked ${scheme.shortCode} to saved schemes`, 'success');
    } else {
      showToast(isHindi ? `${scheme.shortCode} को सहेजी गई सूची से हटाया गया` : `Removed ${scheme.shortCode} from saved schemes`, 'info');
    }
  };

  const getCategoryLabel = (cat: string) => {
    if (!isHindi) return cat;
    switch (cat) {
      case 'All': return 'सभी योजनाएँ';
      case 'Financial Assistance': return 'आर्थिक सहायता';
      case 'Crop Insurance': return 'फसल बीमा';
      case 'Irrigation & Machinery': return 'सिंचाई व कृषि यंत्र';
      case 'Soil & Fertilizers': return 'मिट्टी व खाद';
      case 'Solar Energy': return 'सौर ऊर्जा व पंप';
      default: return cat;
    }
  };

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      scheme.title.toLowerCase().includes(search.toLowerCase()) ||
      scheme.shortCode.toLowerCase().includes(search.toLowerCase()) ||
      scheme.description.toLowerCase().includes(search.toLowerCase()) ||
      scheme.targetBeneficiaries.toLowerCase().includes(search.toLowerCase());
    
    if (showSavedOnly) {
      return matchesSearch && savedSchemeIds.includes(scheme.id);
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {isHindi ? 'सरकारी योजनाएँ एवं सब्सिडी' : 'Government Schemes & Subsidies'}
            </h1>
            <Badge variant={agriService.isMockMode ? "warning" : "primary"} size="sm" dot>
              {agriService.isMockMode ? (isHindi ? 'डेमो योजनाएँ' : 'DEMO CATALOG') : (isHindi ? 'डीबीटी प्रत्यक्ष लाभ' : 'DBT Direct Transfer')}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            {isHindi 
              ? 'केंद्र एवं राज्य सरकार की प्रमुख किसान योजनाएँ, सब्सिडी, फसल बीमा और वित्तीय सहायता।'
              : 'Official central and state agricultural subsidies, insurance schemes, and solar pump grants.'}
          </p>
        </div>

        <button
          onClick={() => setShowSavedOnly(!showSavedOnly)}
          aria-pressed={showSavedOnly}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B53] cursor-pointer ${
            showSavedOnly
              ? 'bg-[#0B6B53] text-white shadow-sm shadow-[#0B6B53]/25'
              : 'bg-white border border-black/[0.08] text-slate-700 hover:bg-slate-50 shadow-soft'
          }`}
        >
          {showSavedOnly ? <BookmarkCheck className="w-4 h-4 text-white" /> : <Bookmark className="w-4 h-4 text-slate-400" />}
          <span>{isHindi ? `सहेजी गई योजनाएँ (${savedSchemeIds.length})` : `Saved Schemes (${savedSchemeIds.length})`}</span>
        </button>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <label htmlFor="scheme-search-input" className="sr-only">
              {isHindi ? 'योजना खोजें' : 'Search government schemes'}
            </label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" aria-hidden="true" />
            <input
              id="scheme-search-input"
              type="text"
              placeholder={isHindi ? 'योजना का नाम खोजें (उदा. पीएम किसान, कुसुम सौर पंप, फसल बीमा)...' : 'Search schemes by title, shortcode, or benefit...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-black/[0.08] text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0B6B53] outline-none bg-white shadow-soft"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 p-0.5 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={isHindi ? 'खोज मिटाएं' : 'Clear search'}
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

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="toolbar" aria-label="Scheme categories">
          {SCHEME_CATEGORIES_EN.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setShowSavedOnly(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B53] cursor-pointer ${
                selectedCategory === cat && !showSavedOnly
                  ? 'bg-[#0B6B53] text-white shadow-sm shadow-[#0B6B53]/25'
                  : 'bg-white border border-black/[0.06] text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes List with Skeletons or Cards (Requirement 5: Display 5 key farmer fields) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <>
            <Skeleton variant="card" className="h-80" />
            <Skeleton variant="card" className="h-80" />
          </>
        ) : filteredSchemes.length === 0 ? (
          <div className="col-span-1 md:col-span-2">
            {showSavedOnly ? (
              <EmptyState
                icon={<Bookmark className="w-8 h-8 text-[#0B6B53]" />}
                title={isHindi ? "कोई सहेजी गई योजना नहीं है" : "No Saved Schemes Yet"}
                description={isHindi ? "किसी भी योजना कार्ड पर बुकमार्क आइकन दबाकर उसे बाद के लिए सहेजें।" : "Click the bookmark icon on any scheme card to save it."}
                actionText={isHindi ? "सभी योजनाएँ देखें" : "Explore All Schemes"}
                onAction={() => setShowSavedOnly(false)}
              />
            ) : (
              <EmptyState
                icon={<FileText className="w-8 h-8 text-[#F5B642]" />}
                title={isHindi ? "कोई योजना नहीं मिली" : "No Schemes Found"}
                description={isHindi ? `"${search}" से संबंधित कोई योजना नहीं मिली।` : `No schemes match "${search}".`}
                actionText={isHindi ? "खोज रीसेट करें" : "Reset Search"}
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
              <Card key={scheme.id} hoverEffect className="border-2 border-slate-200/80 shadow-soft rounded-2xl flex flex-col justify-between overflow-hidden bg-white hover:border-[#0B6B53] transition-all">
                <div>
                  {/* Card Header: योजना का नाम */}
                  <div className="p-5 pb-4 border-b border-black/[0.04] flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#0B6B53] bg-[#0B6B53]/10 border border-[#0B6B53]/20 px-2.5 py-0.5 rounded-md">
                          {scheme.shortCode}
                        </span>
                        <Badge variant="neutral" size="sm">{getCategoryLabel(scheme.category)}</Badge>
                      </div>

                      {/* Requirement 5.1: योजना का नाम */}
                      <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                        {scheme.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                        {scheme.department}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <VoiceAccessibility
                        textToSpeak={`${isHindi ? 'योजना का नाम' : 'Scheme'}: ${scheme.title}. ${isHindi ? 'क्या लाभ मिल सकता है' : 'Benefit'}: ${scheme.subsidyAmount}. ${isHindi ? 'किस किसान के लिए है' : 'Target'}: ${scheme.targetBeneficiaries}`}
                        label={isHindi ? 'योजना सुनें' : 'Read Scheme'}
                      />
                      <button
                        onClick={() => handleToggleSave(scheme)}
                        aria-label={isSaved ? `Remove ${scheme.shortCode} from saved` : `Save ${scheme.shortCode}`}
                        className={`p-2 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B53] cursor-pointer ${
                          isSaved
                            ? 'bg-[#0B6B53]/10 text-[#0B6B53] hover:bg-[#0B6B53]/15'
                            : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                        }`}
                      >
                        {isSaved ? <BookmarkCheck className="w-5 h-5 text-[#0B6B53]" /> : <Bookmark className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Requirement 5.3: क्या लाभ मिल सकता है */}
                  <div className="px-5 py-3.5 bg-gradient-to-r from-[#0B6B53]/[0.08] via-[#1B8F6B]/[0.04] to-emerald-50/30 border-b border-black/[0.04] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#0B6B53] block">
                        {isHindi ? 'क्या लाभ मिल सकता है:' : 'Direct Subsidy / Benefit:'}
                      </span>
                      <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        {scheme.subsidyAmount}
                      </span>
                    </div>
                    <Badge variant="success" size="sm">
                      {isHindi ? 'सक्रिय योजना' : scheme.status}
                    </Badge>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4 text-xs">
                    <p className="text-slate-600 leading-relaxed font-normal text-xs sm:text-sm">
                      {scheme.description}
                    </p>

                    {/* Requirement 5.2: किस किसान के लिए है */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="font-bold text-slate-900 block mb-1 text-xs flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-[#0B6B53]" />
                        {isHindi ? 'किस किसान के लिए है:' : 'Eligible Beneficiaries:'}
                      </span>
                      <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                        {scheme.targetBeneficiaries}
                      </p>
                      <ul className="mt-2 space-y-1 pl-1">
                        {scheme.eligibilityCriteria.map((crit, idx) => (
                          <li key={idx} className="text-slate-600 flex items-start gap-1.5 text-xs">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{crit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Requirement 5.4: कौन से दस्तावेज जरूरी हैं */}
                    <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60">
                      <span className="font-bold text-amber-950 block mb-2 text-xs flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                        {isHindi ? 'कौन से दस्तावेज जरूरी हैं:' : 'Documents Needed:'}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {scheme.documentsRequired.map((doc, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-white border border-amber-200 font-bold px-2.5 py-0.5 rounded-md text-slate-800 shadow-2xs"
                          >
                            ✓ {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirement 5.5: आवेदन कहाँ करें */}
                <div className="p-4 bg-[#F5F7F6]/80 border-t border-black/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 font-bold">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isHindi ? 'आवेदन की अंतिम तारीख:' : 'Deadline:'}</span>
                    <strong className="text-slate-900">{scheme.deadline}</strong>
                  </div>

                  <a
                    href={scheme.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Apply on official portal for ${scheme.title}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B6B53] text-white font-black text-xs hover:bg-[#1B8F6B] shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-[#0B6B53]/20 w-full sm:w-auto justify-center"
                  >
                    <span>{isHindi ? 'आवेदन यहाँ करें (Govt Portal)' : 'Apply on Govt Portal'}</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
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
