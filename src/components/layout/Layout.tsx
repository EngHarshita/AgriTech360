import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  currentModule: string;
  onNavigate: (module: string) => void;
  onOpenAuth: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentModule,
  onNavigate,
  onOpenAuth,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased text-slate-800 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-700 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs font-bold"
      >
        Skip to main content
      </a>

      {/* Offline Rural Connectivity Banner */}
      {!isOnline && (
        <div
          role="status"
          aria-live="polite"
          className="bg-amber-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm"
        >
          <WifiOff className="w-4 h-4" />
          <span>Offline Mode Active: Local farm cache enabled. Live mandi updates will sync once connectivity resumes.</span>
        </div>
      )}

      <Navbar
        onOpenAuth={onOpenAuth}
        isMobileMenuOpen={isMobileMenuOpen}
        onOpenMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onNavigate={onNavigate}
      />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar
          currentModule={currentModule}
          onNavigate={onNavigate}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main id="main-content" tabIndex={-1} className="flex-1 min-w-0 p-3 sm:p-5 lg:p-8 overflow-y-auto outline-none">
          {children}
        </main>
      </div>

      <footer className="mt-auto border-t border-slate-200/90 bg-white py-6 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">AgriTech360</span>
            <span>•</span>
            <span className="font-semibold text-slate-600">Final Year B.Tech Capstone Project</span>
          </div>
          <div className="text-slate-600 text-[11px] font-medium">
            Team: <strong className="text-slate-800">Harshita</strong> (Frontend) • <strong className="text-slate-800">Divyanshi</strong> (Backend) • <strong className="text-slate-800">Khushi</strong> (DB & Testing) • <strong className="text-slate-800">Pragati</strong> (ML & Research)
          </div>
        </div>
      </footer>
    </div>
  );
};
