import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../lib/axiosInstance';

export interface OptionItem {
  value: string;
  label: string;
}

interface TradeOptionRow {
  id: string;
  category: string;
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

export const useTrades = (): UseOptionsResult => {
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get<{ data?: TradeOptionRow[] }>('/trades', {
        params: { limit: 100 },
      });
      const rows = res.data?.data ?? [];
      const sorted = [...rows].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      setOptions(
        sorted.map((t) => ({ value: t.category, label: t.category })),
      );
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to load trades.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { options, isLoading, error, refetch };
};

export default useTrades;
