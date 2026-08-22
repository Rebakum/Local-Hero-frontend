import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../lib/axiosInstance';
import type { OptionItem } from './useTrades';

interface AvailabilityOptionRow {
  id: string;
  value: string;
  label: string;
  sortOrder: number;
  isActive?: boolean;
}

interface UseOptionsResult {
  options: OptionItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === 'object' && 'response' in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
};

export const useAvailabilityOptions = (): UseOptionsResult => {
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get<{ data?: AvailabilityOptionRow[] }>('/availability-options');
      const rows = res.data?.data ?? [];
      const sorted = [...rows].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      setOptions(sorted.map((o) => ({ value: o.value, label: o.label })));
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to load availability options.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { options, isLoading, error, refetch };
};

export default useAvailabilityOptions;
