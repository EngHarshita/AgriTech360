import apiClient from './apiClient';
import { env } from '../config/env';
import { 
  mockCurrentUser, 
  mockDashboardMetrics, 
  mockWeatherData, 
  mockMandiPrices, 
  mockCropRecommendations, 
  mockGovernmentSchemes, 
  mockAlerts 
} from '../data/mockData';
import type { 
  User, 
  WeatherIntelligence, 
  MandiPriceItem, 
  GovernmentScheme, 
  CropRecommendation, 
  FarmAlert, 
  FarmMetric, 
  SoilParams 
} from '../types';

/**
 * AgriService: Unified API service layer.
 * Governed by `env.useMockData` (controlled via VITE_USE_MOCK_DATA).
 * - When true: serves rich, localized mock datasets with realistic latency.
 * - When false: executes live HTTP requests against the Express backend and propagates real ApiErrors.
 */
export const agriService = {
  // 1. User Profile Module
  async getUserProfile(): Promise<User> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const saved = localStorage.getItem(env.userStorageKey);
      return saved ? JSON.parse(saved) : mockCurrentUser;
    }

    const res = await apiClient.get<{ data?: User } | User>('/user/profile');
    const user = (res.data && 'data' in res.data && res.data.data) ? res.data.data : (res.data as User);
    localStorage.setItem(env.userStorageKey, JSON.stringify(user));
    return user;
  },

  async updateUserProfile(user: User): Promise<User> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      localStorage.setItem(env.userStorageKey, JSON.stringify(user));
      return user;
    }

    const res = await apiClient.put<{ data?: User } | User>('/user/profile', user);
    const updated = (res.data && 'data' in res.data && res.data.data) ? res.data.data : (res.data as User);
    localStorage.setItem(env.userStorageKey, JSON.stringify(updated));
    return updated;
  },

  // 2. Dashboard Metrics Module
  async getDashboardMetrics(): Promise<FarmMetric[]> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return mockDashboardMetrics;
    }

    const res = await apiClient.get<{ data?: FarmMetric[] } | FarmMetric[]>('/dashboard/metrics');
    return (res.data && 'data' in res.data && res.data.data) ? res.data.data : (res.data as FarmMetric[]);
  },

  // 3. Weather Intelligence Module
  async getWeatherIntelligence(location?: string): Promise<WeatherIntelligence> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return mockWeatherData;
    }

    const query = location ? `?location=${encodeURIComponent(location)}` : '';
    const res = await apiClient.get<{ data?: WeatherIntelligence } | WeatherIntelligence>(`/weather${query}`);
    return (res.data && 'data' in res.data && res.data.data) ? res.data.data : (res.data as WeatherIntelligence);
  },

  // 4. Mandi Prices Module
  async getMandiPrices(search?: string, category?: string): Promise<MandiPriceItem[]> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      let results = [...mockMandiPrices];
      if (category && category !== 'All') {
        results = results.filter((item) => item.category === category);
      }
      if (search && search.trim() !== '') {
        const q = search.toLowerCase();
        results = results.filter((item) =>
          item.commodity.toLowerCase().includes(q) ||
          item.market.toLowerCase().includes(q) ||
          item.state.toLowerCase().includes(q)
        );
      }
      return results;
    }

    const params = new URLSearchParams();
    if (search) params.append('q', search);
    if (category && category !== 'All') params.append('category', category);
    const queryString = params.toString() ? `?${params.toString()}` : '';

    const res = await apiClient.get<{ data?: MandiPriceItem[] } | MandiPriceItem[]>(`/mandi${queryString}`);
    return (res.data && 'data' in res.data && res.data.data) ? res.data.data : (res.data as MandiPriceItem[]);
  },

  // 5. Crop Recommendation Module (ML)
  async getCropRecommendations(params?: Partial<SoilParams>): Promise<CropRecommendation[]> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 450));
      const nitrogen = params?.nitrogen;
      const ph = params?.phLevel;
      const moisture = params?.moisture;
      if (nitrogen !== undefined && ph !== undefined) {
        return mockCropRecommendations.map((crop) => {
          let scoreMod = 0;
          if (crop.id === 'crop_wheat' && nitrogen > 100) scoreMod += 2;
          if (crop.id === 'crop_chana' && moisture !== undefined && moisture < 40) scoreMod += 4;
          return {
            ...crop,
            suitabilityScore: Math.min(99, Math.max(65, crop.suitabilityScore + scoreMod)),
          };
        });
      }
      return mockCropRecommendations;
    }

    const res = await apiClient.post<{ data?: CropRecommendation[] } | CropRecommendation[]>('/crop/recommend', params);
    return (res.data && 'data' in res.data && res.data.data) ? res.data.data : (res.data as CropRecommendation[]);
  },

  // 6. Government Schemes Module
  async getGovernmentSchemes(category?: string): Promise<GovernmentScheme[]> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (!category || category === 'All') return mockGovernmentSchemes;
      return mockGovernmentSchemes.filter((s) => s.category === category);
    }

    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await apiClient.get<{ data?: GovernmentScheme[]; schemes?: GovernmentScheme[] } | GovernmentScheme[]>(`/schemes${query}`);
    if (Array.isArray(res.data)) return res.data;
    if (res.data && 'data' in res.data && Array.isArray(res.data.data)) return res.data.data;
    if (res.data && 'schemes' in res.data && Array.isArray(res.data.schemes)) return res.data.schemes;
    return [];
  },

  async getSchemeById(id: string): Promise<GovernmentScheme | null> {
    const res = await apiClient.get<{ scheme?: GovernmentScheme; data?: GovernmentScheme } | GovernmentScheme>(`/schemes/${encodeURIComponent(id)}`);
    if ('id' in res.data) return res.data as GovernmentScheme;
    if (res.data && 'scheme' in res.data) return res.data.scheme!;
    if (res.data && 'data' in res.data) return res.data.data!;
    return null;
  },

  async toggleBookmarkScheme(id: string): Promise<{ success: boolean; isBookmarked: boolean; bookmarkCount: number }> {
    const res = await apiClient.post<{ success: boolean; isBookmarked: boolean; bookmarkCount: number }>(`/schemes/${encodeURIComponent(id)}/bookmark`);
    return res.data;
  },

  async checkSchemeEligibility(id: string): Promise<{ eligible: boolean; status: string; reasons: string[] }> {
    const res = await apiClient.post<{ eligible: boolean; status: string; reasons: string[] }>(`/schemes/${encodeURIComponent(id)}/check-eligibility`);
    return res.data;
  },

  // 7. Farm Alerts & Advisories Module
  async getAlerts(): Promise<FarmAlert[]> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      return mockAlerts;
    }

    const res = await apiClient.get<{ data?: FarmAlert[] } | FarmAlert[]>('/alerts');
    return (res.data && 'data' in res.data && res.data.data) ? res.data.data : (res.data as FarmAlert[]);
  },
};
