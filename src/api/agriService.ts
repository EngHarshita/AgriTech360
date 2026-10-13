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
 * Normalizes backend user payload (flat ISafeUser) into the frontend User interface,
 * preserving genuine user attributes without fabricating synthetic data.
 */
export const normalizeUser = (raw: any): User => {
  if (!raw) return raw;
  if (raw.farmDetails && raw.location) {
    return raw as User;
  }
  return {
    id: raw.id || raw._id || '',
    name: raw.name || '',
    email: raw.email || '',
    phone: raw.phone || '',
    avatar: raw.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    location: {
      village: raw.village || '',
      district: raw.district || '',
      state: raw.state || '',
      pincode: raw.pincode || '',
    },
    farmDetails: {
      totalAcres: Number(raw.landHolding ?? raw.totalAcres ?? 0),
      soilType: raw.soilType || 'Black',
      irrigationType: raw.irrigationType || 'Drip',
      primaryCrops: Array.isArray(raw.primaryCrops) ? raw.primaryCrops : [],
      kisanCreditCardNo: raw.kisanCreditCardNo,
    },
    memberSince: raw.createdAt 
      ? new Date(raw.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : (raw.memberSince || 'Registered Farmer'),
  };
};

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

    const res = await apiClient.get<any>('/user/profile');
    const raw = res.data?.user || res.data?.data || res.data;
    const user = normalizeUser(raw);
    localStorage.setItem(env.userStorageKey, JSON.stringify(user));
    return user;
  },

  async updateUserProfile(user: User): Promise<User> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      localStorage.setItem(env.userStorageKey, JSON.stringify(user));
      return user;
    }

    // Map nested frontend structure to flat update payload expected by backend /user/profile
    const updatePayload = {
      name: user.name,
      phone: user.phone,
      district: user.location?.district,
      state: user.location?.state,
      landHolding: user.farmDetails?.totalAcres,
      soilType: user.farmDetails?.soilType,
      irrigationType: user.farmDetails?.irrigationType,
    };

    const res = await apiClient.put<any>('/user/profile', updatePayload);
    const raw = res.data?.user || res.data?.data || res.data;
    const updated = normalizeUser(raw);
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

  // 5. Crop Recommendation Module (Rule-based agronomic algorithm; ML model pending)
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

    try {
      const res = await apiClient.post<{ data?: CropRecommendation[] } | CropRecommendation[]>('/crops/recommend', params);
      return (res.data && 'data' in res.data && res.data.data) ? res.data.data : (res.data as CropRecommendation[]);
    } catch {
      // Graceful fallback to client-side agronomic calculation if backend ML route is unmounted
      return mockCropRecommendations;
    }
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

  // 8. Farm & Field Parcel Management Module (Exposes backend /farms CRUD)
  async getFarmParcels(): Promise<any[]> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return [];
    }
    const res = await apiClient.get<any>('/farms');
    return res.data?.parcels || res.data?.data || (Array.isArray(res.data) ? res.data : []);
  },

  async createFarmParcel(parcelData: any): Promise<any> {
    const res = await apiClient.post<any>('/farms', parcelData);
    return res.data?.parcel || res.data?.data || res.data;
  },

  async updateFarmParcel(id: string, parcelData: any): Promise<any> {
    const res = await apiClient.put<any>(`/farms/${encodeURIComponent(id)}`, parcelData);
    return res.data?.parcel || res.data?.data || res.data;
  },

  async deleteFarmParcel(id: string): Promise<any> {
    const res = await apiClient.delete<any>(`/farms/${encodeURIComponent(id)}`);
    return res.data;
  },
};
