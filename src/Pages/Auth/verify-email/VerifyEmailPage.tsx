import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2, CheckCircle2, MailX, Mail } from 'lucide-react';
import { validateEmailToken, confirmEmailVerification, resendVerificationEmail } from '../../../services/auth.service';
import { useToast } from '../../../Context/ToastContext';

type VerifyStatus = 'checking' | 'ready' | 'success' | 'error' | 'no-token';

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams]);
  const emailFromLink = useMemo(() => searchParams.get('email') ?? '', [searchParams]);

  const [status, setStatus] = useState<VerifyStatus>(token ? 'checking' : 'no-token');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState(emailFromLink);
  const [isResending, setIsResending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        await validateEmailToken(token);
        if (!cancelled) {
          setStatus('ready');
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const apiError = err as { response?: { data?: { message?: string } }; message?: string };
        const message =
          apiError.response?.data?.message ||
          apiError.message ||
          'Something went wrong validating your email.';
        setErrorMessage(message);
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, toast]);

  const handleConfirm = async () => {
    if (!token) return;

    setIsConfirming(true);

    try {
      await confirmEmailVerification(token);
      setStatus('success');
      toast.success('Email verified successfully!');
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        apiError.response?.data?.message ||
        apiError.message ||
        'Something went wrong verifying your email.';
      setErrorMessage(message);
      setStatus('error');
    } finally {
      setIsConfirming(false);
    }
  };

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

          {status === 'checking' && (
            <div className="flex flex-col items-center gap-4 py-6">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-navy-500 dark:text-navy-400">Checking your verification link...</p>
            </div>
          )}

          {status === 'ready' && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
                <Mail className="w-9 h-9 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-navy-900 dark:text-white">Confirm your email</h2>
              <p className="text-sm text-navy-500 dark:text-navy-400 leading-relaxed">
                This verification link is valid. Click below to finish confirming your email address.
              </p>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isConfirming}
                className="btn btn-primary w-full h-12 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  'Confirm my email'
                )}
              </button>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-navy-900 dark:text-white">Email verified successfully</h2>
              <p className="text-sm text-navy-500 dark:text-navy-400 leading-relaxed">
                You can now sign in and start using LocalHero.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login', { replace: true })}
                className="btn btn-primary w-full h-12 text-sm mt-2"
              >
                Continue to Login
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
                <form onSubmit={handleResend} className="space-y-3">
                  {emailFromLink ? (
                    <p className="text-sm text-navy-500 dark:text-navy-300 bg-navy-50 dark:bg-navy-800 border border-navy-100 dark:border-white/10 rounded-xl px-3 py-2.5">
                      Resending to <span className="font-semibold text-navy-700 dark:text-navy-200">{emailFromLink}</span>
                    </p>
                  ) : (
                    <>
                      <label htmlFor="verify-email" className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                        Email address
                      </label>
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
                    </>
                  )}
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
