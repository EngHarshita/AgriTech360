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
  ExternalLink,
  Sprout
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

  // Close menus on click outside or Escape key, plus global shortcut listener for ⌘K / Ctrl+K
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
      // Global ⌘K / Ctrl+K shortcut to focus or trigger mandi/search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onNavigate('mandi');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onNavigate]);

  const handleLocationChange = (loc: string) => {
    setCurrentSelectedLocation(loc);
    setShowLocationMenu(false);
    showToast(`Farming district updated to ${loc}`, 'info');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2.5 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B53] transition-colors cursor-pointer"
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
            <div className="w-10 h-10 rounded-xl bg-[#0B6B53] flex items-center justify-center text-white shadow-sm shadow-[#0B6B53]/25 group-hover:scale-105 transition-transform shrink-0">
              <Sprout className="w-5 h-5 text-white" strokeWidth={2.2} aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-[#0B6B53] transition-colors">
                  AgriTech<span className="text-[#0B6B53]">360</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#E8F5E9] text-[#0B6B53] border border-[#C8E6C9]">
                  CAPSTONE
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block -mt-0.5">
                Smart Decision Platform for Farmers
              </p>
            </div>
          </div>
        </div>

        {/* Middle-Left: Location Selector (Immediately following brand as in reference) */}
        <div ref={locationRef} className="hidden sm:flex items-center relative shrink-0">
          <button
            type="button"
            onClick={() => setShowLocationMenu(!showLocationMenu)}
            aria-expanded={showLocationMenu}
            aria-haspopup="listbox"
            aria-label="Select farming district location"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B53] transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#0B6B53] shrink-0" aria-hidden="true" />
            <span className="max-w-[150px] truncate">{currentSelectedLocation}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          </button>

          {showLocationMenu && (
            <div
              role="listbox"
              className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95"
            >
              <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
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

        {/* Center: Search Centered with ⌘ K shortcut */}
        <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-2 lg:mx-4 items-center relative text-slate-400">
          <Search className="w-4 h-4 absolute left-3.5 pointer-events-none text-slate-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search crops, mandi, schemes..."
            onClick={() => onNavigate('mandi')}
            aria-label="Search crops, mandi, schemes"
            className="w-full pl-10 pr-14 py-2 text-xs font-medium rounded-xl bg-slate-50/80 hover:bg-slate-100/70 border border-slate-200 focus:border-[#0B6B53] focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all outline-none cursor-pointer shadow-2xs"
            readOnly
          />
          <div className="absolute right-3 flex items-center gap-1 pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              ⌘ K
            </kbd>
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Search Quick Action */}
          <button
            type="button"
            onClick={() => onNavigate('mandi')}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B53]"
            aria-label="Search crops, mandi, schemes"
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
              className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B53] transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
              {unreadAlertCount > 0 && (
                <span 
                  className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#EF4444] text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white"
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
                className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3 z-50 animate-in fade-in zoom-in-95"
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

          {/* User Profile or Login Button */}
          {isAuthenticated && user ? (
            <div ref={userRef} className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-expanded={showUserMenu}
                aria-haspopup="menu"
                aria-label="User account menu"
                className="flex items-center gap-2.5 p-1 pl-1.5 pr-3 rounded-full hover:bg-slate-100/80 border border-slate-200/90 shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6B53] transition-colors cursor-pointer bg-slate-50/60"
              >
                <img
                  src={user.avatar}
                  alt={`${user.name}'s profile avatar`}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">{user.name}</div>
                  <div className="text-[10px] font-medium text-slate-500 leading-tight">
                    {user.farmDetails ? `${user.farmDetails.totalAcres} Acres • ${user.farmDetails.soilType}` : 'Farmer'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              </button>

              {showUserMenu && (
                <div 
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95"
                >
                  <div className="px-4 py-2.5 border-b border-black/[0.05]">
                    <p className="text-xs font-black text-slate-900">{user.name}</p>
                    <p className="text-[11px] font-medium text-slate-500 truncate">{user.email}</p>
                    <Badge variant="success" size="sm" className="mt-2">
                      KCC: {user.farmDetails?.kisanCreditCardNo || 'Active'}
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
