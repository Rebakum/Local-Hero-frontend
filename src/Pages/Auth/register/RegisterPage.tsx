import React, { useState } from 'react';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Mail, Lock, Phone, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, MailCheck, RefreshCw } from 'lucide-react';
import { registerUser, resendVerificationEmail } from '../../../services/auth.service';
import { useAuth } from '../../../Context/AuthContext';
import { useToast } from '../../../Context/ToastContext';
import type { RegisterCredentials } from '../../../types/auth';

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user', // ডিফল্ট রোল
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard/user" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload: RegisterCredentials = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role || 'user',
      };

      if (form.phone?.trim()) {
        payload.phone = form.phone.trim();
      }

      // Registration creates the account and emails a verification link; it
      // does NOT log the user in. Show the "check your inbox" screen.
      const response = await registerUser(payload);

      if (response?.success || response?.statusCode === 200 || response?.statusCode === 201) {
        setRegisteredEmail(payload.email);
      } else {
        setError(response?.message || 'Registration failed. Please try again.');
      }
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        apiError.response?.data?.message || apiError.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!registeredEmail) return;
    setIsResending(true);

    try {
      await resendVerificationEmail(registeredEmail);
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

  const passwordChecks = [
    { label: 'At least 8 characters', met: form.password.length >= 8 },
    { label: 'At least 1 uppercase letter', met: /[A-Z]/.test(form.password) },
    { label: 'At least 1 number', met: /[0-9]/.test(form.password) },
  ];

  if (registeredEmail) {
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
                Almost there!
              </h1>
            </div>

            <div className="flex flex-col items-center gap-4 py-2 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <MailCheck className="w-9 h-9 text-primary" />
              </div>
              <p className="text-sm text-navy-500 dark:text-navy-400 leading-relaxed">
                We've sent a verification link to{' '}
                <span className="font-semibold text-navy-700 dark:text-navy-200">{registeredEmail}</span>.
                Check your inbox (and spam folder) and click the button to verify your email address.
              </p>
              <p className="text-xs text-navy-400 dark:text-navy-500">
                This link expires in 30 minutes.
              </p>

              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="btn btn-outline w-full h-12 text-sm mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Resend verification email
                  </>
                )}
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-navy-500 dark:text-navy-400">
              Already verified?{' '}
              <RouterLink to="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </RouterLink>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

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
              Create your account
            </h1>
            <p className="mt-2 text-sm text-navy-500 dark:text-navy-400">
              Join LocalHero and find trusted local pros
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={100}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-lh pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-lh pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                Phone <span className="text-navy-400 dark:text-navy-500 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="07700 900000"
                  className="input-lh pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={128}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
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

              {form.password.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-2 text-xs">
                      <CheckCircle
                        className={`w-3.5 3 shrink-0 transition-colors ${
                          check.met ? 'text-emerald-500' : 'text-navy-300 dark:text-navy-600'
                        }`}
                      />
                      <span className={check.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-navy-400 dark:text-navy-500'}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full h-12 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-navy-500 dark:text-navy-400">
            Already have an account?{' '}
            <RouterLink to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </RouterLink>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;