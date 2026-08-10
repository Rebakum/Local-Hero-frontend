import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Professional } from '../types';
import { getProfessionalsPublic } from '../services/content.service';

interface ProfessionalsContextValue {
  professionals: Professional[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addProfessional: (pro: Professional) => void;
}

const ProfessionalsContext = createContext<ProfessionalsContextValue | null>(null);

// Single source of truth for the professional directory. Both the public
// Featured Pros section and the admin Professionals Management page share
// this state, so a professional created in the admin modal appears in the
// public section instantly (optimistic insert) and is re-synced from the
// database on every refresh().
export const ProfessionalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await getProfessionalsPublic();
      setProfessionals(data);
      setError(null);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to load professionals.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addProfessional = useCallback((pro: Professional) => {
    setProfessionals((prev) => [pro, ...prev.filter((p) => p.id !== pro.id)]);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ professionals, isLoading, error, refresh, addProfessional }),
    [professionals, isLoading, error, refresh, addProfessional],
  );

  return <ProfessionalsContext.Provider value={value}>{children}</ProfessionalsContext.Provider>;
};

export const useProfessionals = (): ProfessionalsContextValue => {
  const ctx = useContext(ProfessionalsContext);
  if (!ctx) throw new Error('useProfessionals must be used within ProfessionalsProvider');
  return ctx;
};

export default ProfessionalsProvider;
