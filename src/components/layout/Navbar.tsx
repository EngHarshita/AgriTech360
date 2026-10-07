import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  MapPin, 
  Search, 
  User as UserIcon, 
  LogOut, 
  ChevronDown, 
  Check, 
  Menu, 
  X,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAgri } from '../../context/AgriContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
  onNavigate: (module: string) => void;
}

const POPULAR_LOCATIONS = [
  'Indore, Madhya Pradesh',
  'Bhopal, Madhya Pradesh',
  'Ujjain, Madhya Pradesh',
  'Karnal, Haryana',
  'Ludhiana, Punjab',
  'Pune, Maharashtra',
];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onOpenMobileMenu,
  isMobileMenuOpen,
  onNavigate,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { alerts, unreadAlertCount, markAlertAsRead, currentSelectedLocation, setCurrentSelectedLocation } = useAgri();
  const { showToast } = useToast();
  
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const alertsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationMenu(false);
      }
      if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
        setShowAlertsMenu(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLocationMenu(false);
        setShowAlertsMenu(false);
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLocationChange = (loc: string) => {
    setCurrentSelectedLocation(loc);
    setShowLocationMenu(false);
    showToast(`Farming district updated to ${loc}`, 'info');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-black/[0.06] transition-all">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2.5 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-black/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B53] transition-colors cursor-pointer"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => onNavigate('dashboard')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate('dashboard'); }}
            tabIndex={0}
            role="button"
            aria-label="AgriTech360 Dashboard home"
            className="flex items-center gap-2.5 cursor-pointer group select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B53] rounded-xl p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B6B53] via-[#147657] to-[#1B8F6B] flex items-center justify-center text-white shadow-md shadow-[#0B6B53]/25 group-hover:scale-105 transition-transform shrink-0 border border-white/20">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 20h10" />
                <path d="M10 20c5.5-2.5.8-6.4 3-10" />
                <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4.1 5.5.8z" />
                <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.4 1.7-4.6-2.7.2-4.2 1.1-4.9 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-[#0B6B53] transition-colors">
                  AgriTech<span className="text-[#0B6B53]">360</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[#0B6B53]/10 text-[#0B6B53] border border-[#0B6B53]/20">
                  Intelligence
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 hidden sm:block -mt-0.5">
                Modern Agriculture SaaS Platform
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search Centered */}
        <div className="hidden md:flex flex-1 max-w-lg mx-auto items-center relative text-slate-400">
          <Search className="w-4 h-4 absolute left-3.5 pointer-events-none text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Quick search mandi rates, crops, agro schemes..."
            onClick={() => onNavigate('mandi')}
            aria-label="Quick search crops, mandi rates, and schemes"
            className="w-full pl-10 pr-16 py-2 text-xs font-semibold rounded-xl bg-slate-100/80 hover:bg-slate-100 border border-black/[0.06] focus:border-[#0B6B53] focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all outline-none cursor-pointer shadow-soft"
            readOnly
          />
          <kbd className="absolute right-3 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white border border-black/[0.08] rounded-md shadow-2xs pointer-events-none">
            ⌘K
          </kbd>
        </div>

        {/* Right: Location Selector, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Location Selector */}
          <div ref={locationRef} className="hidden sm:flex items-center relative">
            <button
              type="button"
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              aria-expanded={showLocationMenu}
              aria-haspopup="listbox"
              aria-label="Select farming district location"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-black/[0.08] shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B53] transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0B6B53] shrink-0" aria-hidden="true" />
              <span className="max-w-[150px] truncate">{currentSelectedLocation}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            </button>

            {showLocationMenu && (
              <div 
                role="listbox" 
                className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-black/[0.06] py-2 z-50 animate-in fade-in zoom-in-95"
              >
                <div className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Select Farming District
                </div>
                {POPULAR_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    role="option"
                    aria-selected={currentSelectedLocation === loc}
                    onClick={() => handleLocationChange(loc)}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-[#F0F9F6] hover:text-[#0B6B53] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{loc}</span>
                    {currentSelectedLocation === loc && (
                      <Check className="w-4 h-4 text-[#0B6B53]" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Search Quick Action */}
          <button
            type="button"
            onClick={() => onNavigate('mandi')}
            className="md:hidden p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-black/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B53]"
            aria-label="Search mandi market rates"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Notifications Dropdown */}
          <div ref={alertsRef} className="relative">
            <button
              type="button"
              onClick={() => setShowAlertsMenu(!showAlertsMenu)}
              aria-expanded={showAlertsMenu}
              aria-haspopup="dialog"
              aria-label={`Farm advisories and notifications, ${unreadAlertCount} unread`}
              className="relative p-2.5 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-black/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B53] transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
              {unreadAlertCount > 0 && (
                <span 
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#EF4444] text-[10px] font-black text-white flex items-center justify-center ring-2 ring-white animate-pulse"
                  aria-hidden="true"
                >
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {showAlertsMenu && (
              <div 
                role="dialog"
                aria-label="Farm alerts and advisory center"
                className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-xl border border-black/[0.08] py-3 z-50 animate-in fade-in zoom-in-95"
              >
                <div className="px-4 pb-2.5 border-b border-black/[0.05] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">Farm Alerts & Advisory</span>
                    {unreadAlertCount > 0 && (
                      <Badge variant="danger" size="sm">{unreadAlertCount} unread</Badge>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      alerts.forEach((a) => markAlertAsRead(a.id));
                      showToast('All advisories marked as read', 'info');
                    }}
                    className="text-xs text-[#0B6B53] hover:text-[#095B46] hover:underline font-bold cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-black/[0.04] py-1">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => markAlertAsRead(alert.id)}
                      className={`p-3.5 px-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                        !alert.read ? 'bg-[#F0F9F6]' : ''
                      }`}
                    >
                      <div className="mt-0.5 shrink-0" aria-hidden="true">
                        {alert.type === 'danger' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                        {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                        {alert.type === 'info' && <Info className="w-4 h-4 text-sky-600" />}
                        {alert.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#0B6B53]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-slate-900 truncate">{alert.title}</p>
                          <span className="text-[10px] font-medium text-slate-400 shrink-0">{alert.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">{alert.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 pt-2.5 border-t border-black/[0.05] text-center">
                  <button
                    onClick={() => {
                      setShowAlertsMenu(false);
                      onNavigate('weather');
                    }}
                    className="text-xs font-bold text-[#0B6B53] hover:text-[#095B46] flex items-center justify-center gap-1.5 w-full py-1 cursor-pointer"
                  >
                    View All Weather Advisories <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile or Login */}
          {isAuthenticated && user ? (
            <div ref={userRef} className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-expanded={showUserMenu}
                aria-haspopup="menu"
                aria-label="User account menu"
                className="flex items-center gap-2.5 p-1 pl-2 sm:pl-3 rounded-xl hover:bg-black/[0.04] border border-black/[0.08] shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B53] transition-colors cursor-pointer bg-white"
              >
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">{user.name}</div>
                  <div className="text-[10px] font-semibold text-slate-500 leading-tight">{user.farmDetails.totalAcres} Acres • {user.farmDetails.soilType}</div>
                </div>
                <img
                  src={user.avatar}
                  alt={`${user.name}'s profile avatar`}
                  className="w-8 h-8 rounded-lg object-cover border border-[#0B6B53]/30"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              </button>

              {showUserMenu && (
                <div 
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-black/[0.08] py-2 z-50 animate-in fade-in zoom-in-95"
                >
                  <div className="px-4 py-2.5 border-b border-black/[0.05]">
                    <p className="text-xs font-black text-slate-900">{user.name}</p>
                    <p className="text-[11px] font-medium text-slate-500 truncate">{user.email}</p>
                    <Badge variant="success" size="sm" className="mt-2">
                      KCC: {user.farmDetails.kisanCreditCardNo || 'Active'}
                    </Badge>
                  </div>

                  <button
                    role="menuitem"
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('profile');
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-950 flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" aria-hidden="true" />
                    Manage Farm Profile
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                      showToast('Signed out of AgriTech360', 'info');
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#EF4444] hover:bg-rose-50 flex items-center gap-2.5 border-t border-black/[0.05] cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" aria-hidden="true" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenAuth}
              leftIcon={<UserIcon className="w-3.5 h-3.5" aria-hidden="true" />}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
