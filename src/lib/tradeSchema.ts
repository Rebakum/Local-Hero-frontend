import type { Resolver, FieldErrors } from 'react-hook-form';

export interface TradeFormValues {
  category: string;
  subtitle: string;
  iconUrl: string;
  description: string;
  avgHourlyRate: string;
  startingPrice: string;
  popularTasks: string;
  badge: string;
  sortOrder: string;
  isActive: boolean;
}

export const defaultTradeFormValues: TradeFormValues = {
  category: '',
  subtitle: '',
  iconUrl: '',
  description: '',
  avgHourlyRate: '',
  startingPrice: '',
  popularTasks: '',
  badge: '',
  sortOrder: '0',
  isActive: true,
};

const fieldError = (type: string, message: string) => ({ type, message });

// Split a comma-separated string into trimmed, non-empty entries.
export const parseCsvList = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

// Frontend validation. Mirrors trade.validation.ts on the backend — both must
// be kept in sync. This is UX + defense-in-depth, never a substitute for the
// backend Zod schema.
export const tradeFormResolver: Resolver<TradeFormValues> = (values) => {
  const errors: Partial<Record<keyof TradeFormValues, { type: string; message: string }>> = {};

  if (!values.category.trim()) {
    errors.category = fieldError('required', 'Category is required');
  }
  if (!values.description.trim()) {
    errors.description = fieldError('required', 'Description is required');
  }
  if (!values.avgHourlyRate.trim()) {
    errors.avgHourlyRate = fieldError('required', 'Average hourly rate is required');
  }

  if (parseCsvList(values.popularTasks).length === 0) {
    errors.popularTasks = fieldError(
      'required',
      'At least one popular task is required',
    );
  }

  if (values.sortOrder.trim()) {
    const order = Number(values.sortOrder);
    if (!Number.isInteger(order)) {
      errors.sortOrder = fieldError('invalid', 'Sort order must be a whole number');
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      values: {} as Record<string, never>,
      errors: errors as FieldErrors<TradeFormValues>,
    };
  }

  return { values, errors: {} };
};