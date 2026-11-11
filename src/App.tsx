import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AgriProvider } from './context/AgriContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';
import { DashboardView } from './components/modules/DashboardView';
import { CropRecommendationView } from './components/modules/CropRecommendationView';
import { WeatherView } from './components/modules/WeatherView';
import { MandiPricesView } from './components/modules/MandiPricesView';
import { SchemesView } from './components/modules/SchemesView';
import { ProfileView } from './components/modules/ProfileView';
import { FarmManagementView } from './components/modules/FarmManagementView';
import { AuthModal } from './components/modules/AuthModal';
import { LoginPage } from './components/modules/LoginPage';
import { RegisterPage } from './components/modules/RegisterPage';
import { UnauthorizedPage } from './components/modules/UnauthorizedPage';
import { NotFoundPage } from './components/modules/NotFoundPage';
import { AdminDashboardView } from './components/modules/AdminDashboardView';
import { AdminLoginPage } from './components/modules/AdminLoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

/**
 * Farmer Management Panel (/farmer/dashboard)
 */
function FarmerPanel() {
  const [currentModule, setCurrentModule] = useState<string>('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <DashboardView onNavigate={setCurrentModule} />;
      case 'farms':
        return <FarmManagementView />;
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

/**
 * Admin Governance Panel (/admin/dashboard)
 */
function AdminPanel() {
  const [currentModule, setCurrentModule] = useState<string>('admin-dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const renderModule = () => {
    switch (currentModule) {
      case 'admin-dashboard':
      case 'dashboard':
        return <AdminDashboardView />;
      case 'farms':
        return <FarmManagementView />;
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
        return <AdminDashboardView />;
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

/**
 * Root URL Route Handler
 * Directs authenticated users to their correct panel and guest users to login/demo
 */
function RootRedirect() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/farmer/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <AgriProvider>
            <ToastProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<RootRedirect />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/farmer/dashboard"
                    element={
                      <ProtectedRoute allowedRole={['farmer', 'admin']}>
                        <FarmerPanel />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/client/*"
                    element={<Navigate to="/farmer/dashboard" replace />}
                  />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute allowedRole="admin">
                        <AdminPanel />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/unauthorized" element={<UnauthorizedPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </BrowserRouter>
            </ToastProvider>
          </AgriProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
