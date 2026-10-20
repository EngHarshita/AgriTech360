import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import { AuthProvider } from './context/AuthContext';
import { AgriProvider } from './context/AgriContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';
import { DashboardView } from './components/modules/DashboardView';
import { CropRecommendationView } from './components/modules/CropRecommendationView';
import { WeatherView } from './components/modules/WeatherView';
import { MandiPricesView } from './components/modules/MandiPricesView';
import { SchemesView } from './components/modules/SchemesView';
import { ProfileView } from './components/modules/ProfileView';
import { AuthModal } from './components/modules/AuthModal';

function AppContent() {
  const [currentModule, setCurrentModule] = useState<string>('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentModule} />;
      case 'crop-recommendation':
        return <CropRecommendationView />;
      case 'weather':
        return <WeatherView />;
      case 'mandi':
        return <MandiPricesView />;
      case 'schemes':
        return <SchemesView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView onNavigate={setCurrentModule} />;
    }
  };

  return (
    <Layout
      currentModule={currentModule}
      onNavigate={setCurrentModule}
      onOpenAuth={() => setIsAuthOpen(true)}
    >
      {renderModule()}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AgriProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AgriProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
