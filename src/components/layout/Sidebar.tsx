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

      {/* Sidebar Container: Fixed width 280px, Premium Dark Gradient #0D2B23 */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-[280px] min-w-[280px] max-w-[280px] bg-gradient-to-b from-[#0D2B23] via-[#09221C] to-[#061813] border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 text-white ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation Items */}
        <div className="p-4 space-y-2 overflow-y-auto flex-1 scrollbar-thin">
          <div className="px-3 pb-2 pt-1 text-[10px] font-black uppercase tracking-widest text-[#50CAA2]/70">
            Platform Modules
          </div>

          <nav className="space-y-1" aria-label="Main application modules">
            {NAV_ITEMS.map((item) => {
              const isActive = currentModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 min-h-[46px] rounded-xl text-xs font-bold transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B8F6B] cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0B6B53] to-[#147657] text-white shadow-lg shadow-[#0B6B53]/35 border border-[#1B8F6B]/40'
                      : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span
                      className={`transition-colors shrink-0 ${
                        isActive
                          ? 'text-white drop-shadow-[0_0_8px_rgba(80,202,162,0.5)]'
                          : 'text-[#8DCAB9]/70 group-hover:text-white'
                      }`}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    <div className="text-left">
                      <span className="block truncate text-xs font-bold leading-tight">{item.label}</span>
                      <span
                        className={`block text-[10px] font-semibold leading-none mt-1 ${
                          isActive ? 'text-[#DCF6EC]' : 'text-slate-400 group-hover:text-slate-300'
                        }`}
                      >
                        {item.hindiLabel}
                      </span>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white border border-white/30'
                          : item.badgeVariant === 'accent'
                          ? 'bg-[#F5B642]/20 text-[#F5B642] border border-[#F5B642]/30'
                          : item.badgeVariant === 'info'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                          : 'bg-[#1B8F6B]/25 text-[#8BDFC1] border border-[#1B8F6B]/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* AI Banner: Dark Glassmorphic Card */}
          <div className="pt-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.09] backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#1B8F6B]/15 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-1.5 text-[#8BDFC1]">
                <Sparkles className="w-4 h-4 text-[#F5B642] animate-pulse" />
                <span className="text-xs font-black tracking-tight text-white">Smart Advisory Engine</span>
              </div>
              <p className="text-[11px] text-slate-300/90 leading-relaxed font-normal">
                Trained on regional soil health, weather radar, and historical APMC rates.
              </p>
              <button
                onClick={() => handleSelect('crop-recommendation')}
                className="mt-3 text-[11px] font-bold text-[#F5B642] hover:text-[#F8D076] flex items-center gap-1.5 group cursor-pointer transition-colors"
              >
                <span>Launch Soil Analysis</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Farmer Status Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-black/20">
          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-xl object-cover border border-[#1B8F6B]/40 shrink-0 shadow-sm"
              />
              <div className="truncate flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-slate-300 truncate">
                  {user.location.district}, {user.location.state}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                  <span className="text-[10px] text-[#8BDFC1] font-semibold">
                    {user.farmDetails.totalAcres} Acres Registered
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-1">
              <p className="text-xs font-bold text-slate-200">Guest Farmer Mode</p>
              <p className="text-[11px] text-slate-400">Sign in to save farm records</p>
            </div>
          )}

          <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 hover:text-slate-200 transition-colors">
              <HelpCircle className="w-3.5 h-3.5 text-[#50CAA2]" /> Kisan Helpline: 1551
            </span>
            <span className="text-[#8DCAB9]/70 text-[10px] font-mono">v1.0 Capstone</span>
          </div>
        </div>
      </aside>
    </>
  );
};
