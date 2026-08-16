import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_STYLES: Record<ToastType, { icon: React.FC<{ className?: string }>; accent: string; bar: string }> = {
  success: { icon: CheckCircle2, accent: 'text-emerald-500', bar: 'bg-emerald-500' },
  error: { icon: XCircle, accent: 'text-red-500', bar: 'bg-red-500' },
  info: { icon: Info, accent: 'text-primary', bar: 'bg-primary' },
};

let toastId = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type: ToastType, message: string) => {
      const id = ++toastId;
      setToasts((prev) => [...prev.slice(-3), { id, type, message }]);
      window.setTimeout(() => dismiss(id), 4500);
    },
    [dismiss]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('error', message),
      info: (message) => push('info', message),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 w-[calc(100vw-2.5rem)] max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const config = TOAST_STYLES[toast.type];
          return (
            <div
              key={toast.id}
              className="pointer-events-auto relative overflow-hidden rounded-xl bg-white dark:bg-navy-800 shadow-lg shadow-navy-900/10 dark:shadow-black/30 border border-navy-100 dark:border-white/10 flex items-start gap-3 p-4 animate-[toast-in_0.3s_ease-out]"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.bar}`} />
              <config.icon className={`w-5 h-5 shrink-0 ${config.accent}`} />
              <p className="flex-1 text-sm font-medium text-navy-700 dark:text-navy-200 leading-snug">
                {toast.message}
              </p>
              <button
                onClick={() => dismiss(toast.id)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-navy-400 hover:text-navy-600 dark:hover:text-navy-200 hover:bg-navy-100 dark:hover:bg-white/5 transition-colors shrink-0"
              >
                <X className="w-3.5 3" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export default ToastProvider;
