import React from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  CloudSun, 
  TrendingUp, 
  FileText, 
  UserCircle, 
  HelpCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';

export interface NavItem {
  id: string;
  label: string;
  hindiLabel?: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
}

interface SidebarProps {
  currentModule: string;
  onNavigate: (moduleId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Overview Dashboard',
    hindiLabel: 'डैशबोर्ड',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: 'crop-recommendation',
    label: 'Crop Recommendation',
    hindiLabel: 'फसल सिफारिश (AI)',
    icon: <Sprout className="w-5 h-5" />,
    badge: 'AI ML',
    badgeVariant: 'success',
  },
  {
    id: 'weather',
    label: 'Weather Intelligence',
    hindiLabel: 'मौसम और कृषि सलाह',
    icon: <CloudSun className="w-5 h-5" />,
    badge: 'Live',
    badgeVariant: 'info',
  },
  {
    id: 'mandi',
    label: 'Market & Mandi Prices',
    hindiLabel: 'मंडी भाव (APMC)',
    icon: <TrendingUp className="w-5 h-5" />,
    badge: 'Live Bhav',
    badgeVariant: 'accent',
  },
  {
    id: 'schemes',
    label: 'Government Schemes',
    hindiLabel: 'सरकारी योजनाएं',
    icon: <FileText className="w-5 h-5" />,
    badge: 'Kisan Yojna',
    badgeVariant: 'primary',
  },
  {
    id: 'profile',
    label: 'Farm & Profile',
    hindiLabel: 'प्रोफ़ाइल एवं खेत विवरण',
    icon: <UserCircle className="w-5 h-5" />,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { user } = useAuth();

  const handleSelect = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 lg:w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation Items */}
        <div className="p-4 space-y-2 overflow-y-auto flex-1">
          <div className="px-3 pb-2 pt-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            Core Modules
          </div>

          <nav className="space-y-1.5" aria-label="Main application modules">
            {NAV_ITEMS.map((item) => {
              const isActive = currentModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center justify-between px-3.5 py-3 min-h-[46px] rounded-xl text-xs font-bold transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                      : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span
                      className={`${
                        isActive
                          ? 'text-white'
                          : 'text-slate-500 group-hover:text-emerald-600 transition-colors'
                      }`}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    <div className="text-left">
                      <span className="block truncate text-xs">{item.label}</span>
                      <span
                        className={`block text-[10px] font-semibold leading-none mt-1 ${
                          isActive ? 'text-emerald-100' : 'text-slate-500'
                        }`}
                      >
                        {item.hindiLabel}
                      </span>
                    </div>
                  </div>

                  {item.badge && (
                    <Badge
                      variant={isActive ? 'neutral' : item.badgeVariant || 'primary'}
                      size="sm"
                      className={isActive ? 'bg-white/20 text-white border-white/30' : ''}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          {/* AI Banner */}
          <div className="pt-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50 border border-emerald-100/80 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-1.5 text-emerald-800">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span className="text-xs font-bold">Smart Advisory Engine</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Trained on soil parameters, weather forecast, and historical crop yields for optimal recommendation.
              </p>
              <button
                onClick={() => handleSelect('crop-recommendation')}
                className="mt-2.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
              >
                Launch Soil Analysis <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Farmer Status Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="truncate flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">
                  {user.location.district}, {user.location.state}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    {user.farmDetails.totalAcres} Acres Registered
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-1">
              <p className="text-xs font-semibold text-slate-600">Guest Farmer Mode</p>
              <p className="text-[11px] text-slate-400">Sign in to save farm records</p>
            </div>
          )}

          <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Kisan Helpline: 1551
            </span>
            <span>v1.0 Capstone</span>
          </div>
        </div>
      </aside>
    </>
  );
};
