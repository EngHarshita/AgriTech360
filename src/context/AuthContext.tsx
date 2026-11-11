import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { mockCurrentUser, mockCurrentAdmin } from '../data/mockData';
import { env } from '../config/env';
import apiClient from '../api/apiClient';
import { normalizeUser } from '../api/agriService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password?: string; role?: UserRole }) => Promise<boolean>;
  logout: () => void;
  updateUser: (updated: Partial<User>) => Promise<void> | void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Returns true only if a valid real JWT token is present in localStorage.
 * Never considers mock session state as real authentication.
 */
const hasRealToken = (): boolean => {
  const token = localStorage.getItem(env.authTokenKey);
  if (!token || token === 'undefined' || token === 'null' || token.startsWith('mock-')) {
    if (token?.startsWith('mock-')) {
      localStorage.removeItem(env.authTokenKey);
    }
    return false;
  }
  return true;
};

/**
 * Mock authentication must ONLY run in an explicitly enabled development/demo environment.
 * In production builds, real backend authentication is strictly enforced.
 */
const isMockAuthAllowed = (): boolean => {
  return (env.useMockData || env.isDemoMode) && env.environment !== 'production';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // In mock mode, restore or default to the mock user only if mock auth is allowed and session active
    if (isMockAuthAllowed() && env.useMockData) {
      const saved = localStorage.getItem(env.userStorageKey);
      const isMockActive = localStorage.getItem(env.mockTokenKey) !== null;
      if (isMockActive) {
        return saved ? (JSON.parse(saved) as User) : mockCurrentUser;
      }
      return null;
    }
    if (hasRealToken()) {
      const saved = localStorage.getItem(env.userStorageKey);
      return saved ? (JSON.parse(saved) as User) : null;
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Mock mode: authenticated if mock auth is allowed and session active
    if (isMockAuthAllowed() && env.useMockData) {
      return localStorage.getItem(env.mockTokenKey) !== null;
    }
    // Live mode: authenticated only when a real JWT token is present.
    return hasRealToken();
  });

  // Verify and restore valid live session from backend on mount / page refresh
  useEffect(() => {
    if (!env.useMockData && hasRealToken()) {
      apiClient.get('/auth/me')
        .then((res) => {
          const rawUser = res.data?.user || res.data?.data || res.data;
          if (rawUser) {
            const freshUser = normalizeUser(rawUser);
            setUser(freshUser);
            setIsAuthenticated(true);
            localStorage.setItem(env.userStorageKey, JSON.stringify(freshUser));
          }
        })
        .catch(() => {
          // If token was expired or rejected (401), the unauthorized event listener cleans up.
        });
    }
  }, []);

  // Listen to 401 unauthorized events from apiClient
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem(env.authTokenKey);
      localStorage.removeItem(env.userStorageKey);
      localStorage.removeItem(env.mockTokenKey);
    };

    window.addEventListener('agritech:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('agritech:unauthorized', handleUnauthorized);
    };
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(env.userStorageKey, JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    if (isMockAuthAllowed() && env.useMockData) {
      await new Promise((r) => setTimeout(r, 350));
      const isAdminLogin = email.toLowerCase().includes('admin') || email === mockCurrentAdmin.email;
      const baseMock = isAdminLogin ? mockCurrentAdmin : mockCurrentUser;
      const updatedUser: User = {
        ...baseMock,
        email: email || baseMock.email,
      };
      setUser(updatedUser);
      setIsAuthenticated(true);
      // Store under the mock-only key — never touches the real authTokenKey.
      localStorage.setItem(env.mockTokenKey, 'mock-session-active');
      localStorage.setItem(env.userStorageKey, JSON.stringify(updatedUser));
      return true;
    }

    // Live API Login
    const res = await apiClient.post<{ token: string; user?: unknown; data?: unknown }>('/auth/login', {
      email,
      password: pass,
    });

    const { token } = res.data;
    if (!token) {
      throw new Error('Authentication server did not return a session token. Please try again.');
    }

    const rawUser = res.data.user || res.data.data || res.data;
    const loggedInUser = normalizeUser(rawUser);

    if (loggedInUser.status === 'suspended') {
      throw new Error('Your account has been suspended by an administrator. Please contact support.');
    }

    localStorage.setItem(env.authTokenKey, token);
    setUser(loggedInUser);
    setIsAuthenticated(true);
    localStorage.setItem(env.userStorageKey, JSON.stringify(loggedInUser));
    return true;
  };

  const register = async (data: Partial<User> & { password?: string; role?: UserRole }): Promise<boolean> => {
    // Validate required fields; never fabricate missing values.
    const missingFields: string[] = [];
    if (!data.name?.trim()) missingFields.push('Full Name');
    if (!data.email?.trim()) missingFields.push('Email');
    if (!data.phone?.trim()) missingFields.push('Mobile Phone');
    if (!data.password?.trim()) missingFields.push('Password');
    if (!data.location?.district?.trim()) missingFields.push('District');
    if (!data.location?.state?.trim()) missingFields.push('State');

    if (missingFields.length > 0) {
      throw new Error(`Please fill in required fields: ${missingFields.join(', ')}.`);
    }

    if (isMockAuthAllowed() && env.useMockData) {
      await new Promise((r) => setTimeout(r, 400));
      const baseMock = mockCurrentUser;
      const newUser: User = {
        ...baseMock,
        ...data,
        name: data.name!.trim(),
        email: data.email!.toLowerCase().trim(),
        phone: data.phone!.trim(),
        role: 'farmer',
        farmDetails: {
          totalAcres: data.farmDetails?.totalAcres ?? 5,
          soilType: data.farmDetails?.soilType || 'Black',
          irrigationType: data.farmDetails?.irrigationType || 'Drip',
          primaryCrops: data.farmDetails?.primaryCrops || ['Wheat', 'Gram'],
          kisanCreditCardNo: data.farmDetails?.kisanCreditCardNo || 'KCC-MP-ACTIVE',
        },
        location: {
          village: data.location?.village?.trim() || '',
          district: data.location!.district!.trim(),
          state: data.location!.state!.trim(),
          pincode: data.location?.pincode || '',
        },
        id: `usr_${Date.now()}`,
        memberSince: 'Just now',
      };
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem(env.mockTokenKey, 'mock-session-active');
      localStorage.setItem(env.userStorageKey, JSON.stringify(newUser));
      return true;
    }

    const registerPayload = {
      name: data.name!.trim(),
      email: data.email!.toLowerCase().trim(),
      phone: data.phone!.trim(),
      password: data.password!,
      district: data.location!.district!.trim(),
      state: data.location!.state!.trim(),
      landHolding: data.farmDetails?.totalAcres ?? 0,
      soilType: data.farmDetails?.soilType ?? 'Black',
      irrigationType: data.farmDetails?.irrigationType ?? 'Drip',
      role: 'farmer',
    };

    const res = await apiClient.post<{ token: string; user?: unknown; data?: unknown }>('/auth/register', registerPayload);
    const { token } = res.data;
    if (!token) {
      throw new Error('Registration succeeded but no session token was returned. Please sign in.');
    }

    const rawUser = res.data.user || res.data.data || res.data;
    const registeredUser = normalizeUser(rawUser);

    localStorage.setItem(env.authTokenKey, token);
    setUser(registeredUser);
    setIsAuthenticated(true);
    localStorage.setItem(env.userStorageKey, JSON.stringify(registeredUser));
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(env.authTokenKey);
    localStorage.removeItem(env.userStorageKey);
    localStorage.removeItem(env.mockTokenKey);
  };

  const updateUser = async (updated: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem(env.userStorageKey, JSON.stringify(merged));

    const token = localStorage.getItem(env.authTokenKey);
    if (token && !token.startsWith('mock-')) {
      try {
        const payload: Record<string, unknown> = {};
        if (updated.name) payload.name = updated.name;
        if (updated.phone) payload.phone = updated.phone;
        if (updated.location?.district) payload.district = updated.location.district;
        if (updated.location?.state) payload.state = updated.location.state;
        if (updated.farmDetails?.totalAcres !== undefined) payload.landHolding = updated.farmDetails.totalAcres;
        if (updated.farmDetails?.soilType) payload.soilType = updated.farmDetails.soilType;
        if (updated.farmDetails?.irrigationType) payload.irrigationType = updated.farmDetails.irrigationType;
        if (updated.businessDetails?.businessName) payload.businessName = updated.businessDetails.businessName;
        if (updated.businessDetails?.businessType) payload.businessType = updated.businessDetails.businessType;

        const res = await apiClient.put<{ success: boolean; user?: unknown; data?: unknown }>('/user/profile', payload);
        const raw = res.data.user || res.data.data;
        if (raw) {
          const synced = normalizeUser(raw);
          setUser(synced);
          localStorage.setItem(env.userStorageKey, JSON.stringify(synced));
        }
      } catch (err) {
        console.warn('Profile sync to backend /user/profile failed:', err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
