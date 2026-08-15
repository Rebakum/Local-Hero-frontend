import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2, CheckCircle2, MailX, Mail } from 'lucide-react';
import { verifyEmail, resendVerificationEmail } from '../../../services/auth.service';
import { useToast } from '../../../Context/ToastContext';

type VerifyStatus = 'verifying' | 'success' | 'error' | 'no-token';

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams]);

  const [status, setStatus] = useState<VerifyStatus>(token ? 'verifying' : 'no-token');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        await verifyEmail(token);
        if (!cancelled) {
          setStatus('success');
          toast.success('Email verified successfully!');
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const apiError = err as { response?: { data?: { message?: string } }; message?: string };
        const message =
          apiError.response?.data?.message ||
          apiError.message ||
          'Something went wrong verifying your email.';
        setErrorMessage(message);
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, toast]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResending(true);

    try {
      await resendVerificationEmail(email.trim());
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
            <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Verify your email</h1>
          </div>

          {status === 'verifying' && (
            <div className="flex flex-col items-center gap-4 py-6">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-navy-500 dark:text-navy-400">Verifying your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-navy-900 dark:text-white">Email verified!</h2>
              <p className="text-sm text-navy-500 dark:text-navy-400 leading-relaxed">
                Your email address has been confirmed. You can now log in and start using LocalHero.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login', { replace: true })}
                className="btn btn-primary w-full h-12 text-sm mt-2"
              >
                Log in to LocalHero
              </button>
            </div>
          )}

          {(status === 'error' || status === 'no-token') && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
                <MailX className="w-9 h-9 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-navy-900 dark:text-white">
                {status === 'no-token' ? 'Link is missing' : 'Verification failed'}
              </h2>
              <p className="text-sm text-navy-500 dark:text-navy-400 leading-relaxed">
                {status === 'no-token'
                  ? 'This page needs a verification link. Open the link from your email, or request a new one below.'
                  : errorMessage || 'This link is invalid or has expired.'}
              </p>

              <div className="w-full mt-2 text-left">
                <label htmlFor="verify-email" className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                  Email address
                </label>
                <form onSubmit={handleResend} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
                    <input
                      id="verify-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input-lh pl-10"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isResending}
                    className="btn btn-primary w-full h-12 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Resend verification email'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

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
};

export default VerifyEmailPage;
