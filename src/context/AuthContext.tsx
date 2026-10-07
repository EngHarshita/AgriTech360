import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { mockCurrentUser } from '../data/mockData';
import { env } from '../config/env';
import apiClient from '../api/apiClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(env.userStorageKey);
    return saved ? JSON.parse(saved) : (env.useMockData ? mockCurrentUser : null);
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const hasToken = !!localStorage.getItem(env.authTokenKey);
    return hasToken || (env.useMockData && localStorage.getItem('agritech_auth') !== 'false');
  });

  // Listen to 401 unauthorized events from apiClient
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem(env.authTokenKey);
      localStorage.removeItem(env.userStorageKey);
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
    if (env.useMockData) {
      await new Promise((r) => setTimeout(r, 350));
      const updatedUser = {
        ...mockCurrentUser,
        email: email || mockCurrentUser.email,
      };
      setUser(updatedUser);
      setIsAuthenticated(true);
      localStorage.setItem(env.authTokenKey, 'mock-jwt-farmer-token-xyz');
      localStorage.setItem('agritech_auth', 'true');
      localStorage.setItem(env.userStorageKey, JSON.stringify(updatedUser));
      return true;
    }

    // Live API Login
    const res = await apiClient.post<{ token: string; user: User }>('/auth/login', {
      email,
      password: pass,
    });

    const { token, user: loggedInUser } = res.data;
    if (token) {
      localStorage.setItem(env.authTokenKey, token);
    }
    setUser(loggedInUser);
    setIsAuthenticated(true);
    localStorage.setItem(env.userStorageKey, JSON.stringify(loggedInUser));
    return true;
  };

  const register = async (data: Partial<User>): Promise<boolean> => {
    if (env.useMockData) {
      await new Promise((r) => setTimeout(r, 400));
      const newUser: User = {
        ...mockCurrentUser,
        ...data,
        id: `usr_${Date.now()}`,
        memberSince: 'Just now',
      };
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem(env.authTokenKey, 'mock-jwt-farmer-token-xyz');
      localStorage.setItem('agritech_auth', 'true');
      localStorage.setItem(env.userStorageKey, JSON.stringify(newUser));
      return true;
    }

    // Live API Registration
    const res = await apiClient.post<{ token: string; user: User }>('/auth/register', data);
    const { token, user: registeredUser } = res.data;
    if (token) {
      localStorage.setItem(env.authTokenKey, token);
    }
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
    localStorage.setItem('agritech_auth', 'false');
  };

  const updateUser = (updated: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...updated };
    setUser(merged);
    localStorage.setItem(env.userStorageKey, JSON.stringify(merged));
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
