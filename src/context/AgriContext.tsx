import React, { createContext, useContext, useState } from 'react';
import type { FarmAlert } from '../types';
import { mockAlerts } from '../data/mockData';

interface AgriContextType {
  alerts: FarmAlert[];
  savedSchemeIds: string[];
  toggleSaveScheme: (schemeId: string) => void;
  markAlertAsRead: (alertId: string) => void;
  unreadAlertCount: number;
  currentSelectedLocation: string;
  setCurrentSelectedLocation: (loc: string) => void;
}

const AgriContext = createContext<AgriContextType | undefined>(undefined);

export const AgriProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<FarmAlert[]>(mockAlerts);
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(['sch_pm_kisan', 'sch_pmksy']);
  const [currentSelectedLocation, setCurrentSelectedLocation] = useState<string>('Indore, Madhya Pradesh');

  const toggleSaveScheme = (schemeId: string) => {
    setSavedSchemeIds((prev) =>
      prev.includes(schemeId) ? prev.filter((id) => id !== schemeId) : [...prev, schemeId]
    );
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, read: true } : a))
    );
  };

  const unreadAlertCount = alerts.filter((a) => !a.read).length;

  return (
    <AgriContext.Provider
      value={{
        alerts,
        savedSchemeIds,
        toggleSaveScheme,
        markAlertAsRead,
        unreadAlertCount,
        currentSelectedLocation,
        setCurrentSelectedLocation,
      }}
    >
      {children}
    </AgriContext.Provider>
  );
};

export const useAgri = () => {
  const context = useContext(AgriContext);
  if (!context) {
    throw new Error('useAgri must be used within an AgriProvider');
  }
  return context;
};
