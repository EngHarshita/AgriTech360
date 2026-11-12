import apiClient from './apiClient';
import { env } from '../config/env';
import { 
  mockCurrentUser, 
  mockDashboardMetrics, 
  mockWeatherData, 
  mockMandiPrices, 
  mockCropRecommendations, 
  mockGovernmentSchemes, 
  mockAlerts,
  mockFarmParcels,
  mockAdminOverview,
  mockUsersList,
  mockAuditLogs,
  mockSystemHealth
} from '../data/mockData';
import type { 
  User, 
  UserRole,
  WeatherIntelligence, 
  MandiPriceItem, 
  GovernmentScheme, 
  CropRecommendation, 
  FarmAlert, 
  FarmMetric, 
  SoilParams,
  FarmParcel,
  CreateFarmParcelDto,
  UpdateFarmParcelDto,
  AdminOverview,
  AdminUserFilter,
  AuditLogEntry,
  SystemHealthData
} from '../types';

/**
 * Normalizes backend user payload (flat ISafeUser) into the frontend User interface,
 * preserving genuine user attributes without fabricating synthetic data.
 */
export const normalizeUser = (raw: any): User => {
  if (!raw) return raw;
  const role = (raw.role as UserRole) || 'farmer';
  const businessDetails = (raw.businessDetails || raw.businessName)
    ? {
        businessName: raw.businessDetails?.businessName || raw.businessName || '',
        businessType: raw.businessDetails?.businessType || raw.businessType || '',
      }
    : undefined;

  const farmDetails = (role === 'farmer' || raw.farmDetails || raw.landHolding !== undefined)
    ? {
        totalAcres: Number(raw.landHolding ?? raw.farmDetails?.totalAcres ?? 0),
        soilType: raw.soilType || raw.farmDetails?.soilType || 'Black',
        irrigationType: raw.irrigationType || raw.farmDetails?.irrigationType || 'Drip',
        primaryCrops: Array.isArray(raw.primaryCrops) 
          ? raw.primaryCrops 
          : (Array.isArray(raw.farmDetails?.primaryCrops) ? raw.farmDetails.primaryCrops : []),
        kisanCreditCardNo: raw.kisanCreditCardNo || raw.farmDetails?.kisanCreditCardNo,
      }
    : undefined;

  return {
    id: raw.id || raw._id || '',
    name: raw.name || '',
    email: raw.email || '',
    phone: raw.phone || '',
    avatar: raw.avatar || (role === 'admin'
      ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80'),
    role,
    businessDetails,
    location: {
      village: raw.village || raw.location?.village || '',
      district: raw.district || raw.location?.district || '',
      state: raw.state || raw.location?.state || '',
      pincode: raw.pincode || raw.location?.pincode || '',
    },
    farmDetails,
    status: raw.status || 'active',
    memberSince: raw.createdAt 
      ? new Date(raw.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : (raw.memberSince || (role === 'admin' ? 'Platform Administrator' : 'Registered Farmer')),
  };
};

/**
 * AgriService: Unified API service layer.
 * Governed by `env.useMockData` (controlled via VITE_USE_MOCK_DATA).
 * - When true: serves rich, localized mock datasets with realistic latency.
 * - When false: executes live HTTP requests against the Express backend and propagates real ApiErrors.
 */
export const agriService = {
  get isMockMode(): boolean {
    return env.useMockData || env.isDemoMode;
  },

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
    params.append('limit', '100');
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

    const res = await apiClient.post<any>('/crops/recommend', params);
    if (res.data) {
      if (Array.isArray(res.data.data)) return res.data.data;
      if (Array.isArray(res.data.recommendations)) return res.data.recommendations;
      if (Array.isArray(res.data)) return res.data;
    }
    return [];
  },

  // 6. Government Schemes Module
  async getGovernmentSchemes(category?: string): Promise<GovernmentScheme[]> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (!category || category === 'All') return mockGovernmentSchemes;
      return mockGovernmentSchemes.filter((s) => s.category === category);
    }

    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    params.append('limit', '100');
    const queryString = params.toString() ? `?${params.toString()}` : '';

    const res = await apiClient.get<{ data?: GovernmentScheme[]; schemes?: GovernmentScheme[] } | GovernmentScheme[]>(`/schemes${queryString}`);
    if (Array.isArray(res.data)) return res.data;
    if (res.data && 'data' in res.data && Array.isArray(res.data.data)) return res.data.data;
    if (res.data && 'schemes' in res.data && Array.isArray(res.data.schemes)) return res.data.schemes;
    return [];
  },

  async getSchemeById(id: string): Promise<GovernmentScheme | null> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      return mockGovernmentSchemes.find((s) => s.id === id) ?? null;
    }
    const res = await apiClient.get<{ scheme?: GovernmentScheme; data?: GovernmentScheme } | GovernmentScheme>(`/schemes/${encodeURIComponent(id)}`);
    if ('id' in res.data) return res.data as GovernmentScheme;
    if (res.data && 'scheme' in res.data) return res.data.scheme!;
    if (res.data && 'data' in res.data) return res.data.data!;
    return null;
  },

  async toggleBookmarkScheme(id: string): Promise<{ success: boolean; isBookmarked: boolean; bookmarkCount: number }> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { success: true, isBookmarked: true, bookmarkCount: 1 };
    }
    const res = await apiClient.post<{ success: boolean; isBookmarked: boolean; bookmarkCount: number }>(`/schemes/${encodeURIComponent(id)}/bookmark`);
    return res.data;
  },

  async checkSchemeEligibility(id: string): Promise<{ eligible: boolean; status: string; reasons: string[] }> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { eligible: true, status: 'Eligible', reasons: ['Demo evaluation — live eligibility check requires backend connection.'] };
    }
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
  async getFarmParcels(): Promise<FarmParcel[]> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const saved = localStorage.getItem('agritech_mock_parcels');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore parse error and fall through
        }
      }
      return mockFarmParcels;
    }
    const res = await apiClient.get<any>('/farms');
    return res.data?.parcels || res.data?.data || (Array.isArray(res.data) ? res.data : []);
  },

  async createFarmParcel(parcelData: CreateFarmParcelDto): Promise<FarmParcel> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const current = await this.getFarmParcels();
      const newParcel: FarmParcel = {
        id: `parcel_${Date.now()}`,
        farmerId: mockCurrentUser.id,
        name: parcelData.name,
        surveyNumber: parcelData.surveyNumber || '',
        village: parcelData.village || mockCurrentUser.location.village,
        district: parcelData.district || mockCurrentUser.location.district,
        state: parcelData.state || mockCurrentUser.location.state,
        areaAcres: Number(parcelData.areaAcres),
        soilType: parcelData.soilType || 'Black Soil',
        irrigationType: parcelData.irrigationType || 'Drip Irrigation',
        currentCrop: parcelData.currentCrop || 'Soybean',
        croppingSeason: parcelData.croppingSeason || 'Kharif 2026',
        status: parcelData.status || 'Active Cultivation',
        createdAt: new Date().toISOString(),
      };
      const updated = [newParcel, ...current];
      localStorage.setItem('agritech_mock_parcels', JSON.stringify(updated));
      return newParcel;
    }
    const res = await apiClient.post<any>('/farms', parcelData);
    return res.data?.parcel || res.data?.data || res.data;
  },

  async updateFarmParcel(id: string, parcelData: UpdateFarmParcelDto): Promise<FarmParcel> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const current = await this.getFarmParcels();
      const index = current.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Farm parcel not found');
      const updatedParcel: FarmParcel = {
        ...current[index],
        ...parcelData,
        areaAcres: parcelData.areaAcres !== undefined ? Number(parcelData.areaAcres) : current[index].areaAcres,
        updatedAt: new Date().toISOString(),
      };
      current[index] = updatedParcel;
      localStorage.setItem('agritech_mock_parcels', JSON.stringify(current));
      return updatedParcel;
    }
    const res = await apiClient.put<any>(`/farms/${encodeURIComponent(id)}`, parcelData);
    return res.data?.parcel || res.data?.data || res.data;
  },

  async deleteFarmParcel(id: string): Promise<{ success: boolean; message: string }> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const current = await this.getFarmParcels();
      const filtered = current.filter((p) => p.id !== id);
      localStorage.setItem('agritech_mock_parcels', JSON.stringify(filtered));
      return { success: true, message: 'Farm parcel removed successfully' };
    }
    const res = await apiClient.delete<any>(`/farms/${encodeURIComponent(id)}`);
    return res.data;
  },

  // 12. Admin Control Panel Module
  async getAdminOverview(): Promise<AdminOverview> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return mockAdminOverview;
    }
    const res = await apiClient.get<any>('/admin/overview');
    return res.data?.data || res.data;
  },

  async getAdminUsers(params: AdminUserFilter = {}): Promise<{ users: User[]; total: number; page: number; pages: number }> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      let filtered = [...mockUsersList];
      if (params.role && params.role !== 'all') {
        filtered = filtered.filter((u) => u.role === params.role);
      }
      if (params.status && params.status !== 'all') {
        filtered = filtered.filter((u) => (u.status || 'active') === params.status);
      }
      if (params.search && params.search.trim()) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter((u) =>
          u.name.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s) ||
          u.phone.includes(s)
        );
      }
      const page = params.page || 1;
      const limit = params.limit || 10;
      const total = filtered.length;
      const paged = filtered.slice((page - 1) * limit, page * limit);
      return { users: paged, total, page, pages: Math.ceil(total / limit) || 1 };
    }

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.search) queryParams.set('search', params.search);
    if (params.role && params.role !== 'all') queryParams.set('role', params.role);
    if (params.status && params.status !== 'all') queryParams.set('status', params.status);

    const res = await apiClient.get<any>(`/admin/users?${queryParams.toString()}`);
    const rawUsers = res.data?.users || res.data?.data || [];
    return {
      users: rawUsers.map((u: any) => normalizeUser(u)),
      total: res.data?.total ?? rawUsers.length,
      page: res.data?.page ?? 1,
      pages: res.data?.pages ?? 1,
    };
  },

  async updateUserStatus(userId: string, status: 'active' | 'suspended', reason?: string): Promise<User> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const user = mockUsersList.find((u) => u.id === userId);
      if (!user) throw new Error('User not found');
      user.status = status;
      return user;
    }

    const res = await apiClient.patch<any>(`/admin/users/${encodeURIComponent(userId)}/status`, {
      status,
      reason,
    });
    const raw = res.data?.user || res.data?.data;
    return normalizeUser(raw);
  },

  async getAdminLogs(limit = 50): Promise<AuditLogEntry[]> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return mockAuditLogs.slice(0, limit);
    }
    const res = await apiClient.get<any>(`/admin/logs?limit=${limit}`);
    return res.data?.data || res.data || [];
  },

  async getAdminSystemHealth(): Promise<SystemHealthData> {
    if (env.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return mockSystemHealth;
    }
    const res = await apiClient.get<any>('/admin/health');
    return res.data?.data || res.data;
  },
};
