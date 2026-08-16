import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink, Navigate } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { loginUser, getProfile, resendVerificationEmail } from '../../../services/auth.service';
import { useAuth } from '../../../Context/AuthContext';
import { useToast } from '../../../Context/ToastContext';
import { getRoleDashboardPath } from '../../../lib/helpers';
import type { LoginCredentials } from '../../../types/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, isAuthenticated } = useAuth();
  const toast = useToast();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isResending, setIsResending] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard/user" replace />;
  }

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setIsSubmitting(true);

    try {
      const response = await loginUser(credentials);

      if (response?.success || response?.statusCode === 200) {
        const user = response?.data?.user || response?.user || (await getProfile());

        if (!user) {
          throw new Error('User details could not be loaded.');
        }

        flushSync(() => {
          setUser(user);
        });

        const redirectPath = from || getRoleDashboardPath(user.role);
        navigate(redirectPath, { replace: true });
      } else {
        setError(response?.message || 'Invalid email or password.');
      }
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string }; status?: number }; message?: string };

      if (apiError.response?.status === 403) {
        setNeedsVerification(true);
        setError('Please verify your email address before logging in.');
      } else {
        setError(
          apiError.response?.data?.message || apiError.message || 'Login failed. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);

    try {
      await resendVerificationEmail(credentials.email.trim());
      toast.success('A new verification link has been sent to your email.');
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(
        apiError.response?.data?.message || apiError.message || 'Could not resend the verification email.',
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-navy-950 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="card p-8 sm:p-10">
          <div className="text-center mb-8">
            <RouterLink to="/" className="inline-block mb-6">
              <img src="/logoWhite/logo1.png" alt="LocalHero" className="h-10 w-auto mx-auto dark:hidden" />
              <img src="/logoBlack/logo3.png" alt="LocalHero" className="h-10 w-auto mx-auto hidden dark:block" />
            </RouterLink>
            <h1 className="text-2xl font-bold text-navy-900 dark:text-white">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-navy-500 dark:text-navy-400">
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="flex-1">{error}</span>
              {needsVerification && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {isResending ? (
                    <Loader2 className="w-3.5 3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 3" />
                  )}
                  Resend email
                </button>
              )}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-lh pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input-lh pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600 dark:hover:text-navy-200 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end -mt-1">
              <RouterLink
                to="/forgot-password"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Forgot password?
              </RouterLink>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full h-12 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-navy-500 dark:text-navy-400">
            Don&apos;t have an account?{' '}
            <RouterLink to="/register" className="font-semibold text-primary hover:underline">
              Sign Up
            </RouterLink>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
