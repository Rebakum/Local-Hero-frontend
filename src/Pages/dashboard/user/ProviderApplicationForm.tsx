import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Briefcase,
  Phone,
  Loader2,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';
import { applyProvider } from '../../../services/auth.service';
import { useAuth } from '../../../Context/AuthContext';
import { Card } from '../../../Components/ui/shared/Card';
import { SERVICE_CATEGORIES, type ServiceCategory } from '../../../types/auth';

const ProviderApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    serviceCategory: '' as ServiceCategory | '',
    experienceYears: '',
    serviceDetails: '',
    phone: user?.phone || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'serviceProvider') {
    return <Navigate to="/dashboard/provider" replace />;
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card padding="lg">
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">
                Application Submitted
              </h2>
              <p className="text-navy-500 dark:text-navy-400 mb-8 max-w-md">
                Your application is under review by Super Admin. You'll receive a notification once your account is approved.
              </p>
              <button
                onClick={() => navigate('/dashboard/user')}
                className="btn btn-primary h-12 px-8"
              >
                Back to Dashboard
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.serviceCategory) {
      setError('Please select a service category.');
      return;
    }
    if (!form.experienceYears || Number(form.experienceYears) < 0) {
      setError('Please enter valid years of experience.');
      return;
    }
    if (!form.serviceDetails.trim()) {
      setError('Please describe your services.');
      return;
    }
    if (!form.phone.trim()) {
      setError('Please provide a phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      await applyProvider({
        serviceCategory: form.serviceCategory,
        experienceYears: Number(form.experienceYears),
        serviceDetails: form.serviceDetails.trim(),
        phone: form.phone.trim(),
      });
      setSuccess(true);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(
        apiError.response?.data?.message ||
          apiError.message ||
          'Failed to submit application. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          onClick={() => navigate('/dashboard/user')}
          className="flex items-center gap-2 text-sm text-navy-500 dark:text-navy-400 hover:text-navy-700 dark:hover:text-navy-200 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-2">
          <p className="text-sm text-primary font-semibold">Become a Professional</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">
            Service Provider Application
          </h1>
          <p className="text-sm text-navy-500 dark:text-navy-400 mt-1">
            Fill out the form below to apply as a service provider. Your application will be reviewed by our Super Admin team.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card padding="lg">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Category */}
            <div>
              <label
                htmlFor="serviceCategory"
                className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5"
              >
                Service Category
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400 pointer-events-none" />
                <select
                  id="serviceCategory"
                  name="serviceCategory"
                  required
                  value={form.serviceCategory}
                  onChange={handleChange}
                  className="input-lh pl-10 pr-10 appearance-none"
                >
                  <option value="" disabled>
                    Select your trade...
                  </option>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
              </div>
            </div>

            {/* Experience Years */}
            <div>
              <label
                htmlFor="experienceYears"
                className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5"
              >
                Years of Experience
              </label>
              <input
                id="experienceYears"
                name="experienceYears"
                type="number"
                min={0}
                max={50}
                required
                value={form.experienceYears}
                onChange={handleChange}
                placeholder="e.g. 5"
                className="input-lh"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="07700 900000"
                  className="input-lh pl-10"
                />
              </div>
            </div>

            {/* Service Details */}
            <div>
              <label
                htmlFor="serviceDetails"
                className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5"
              >
                Service Details
              </label>
              <textarea
                id="serviceDetails"
                name="serviceDetails"
                required
                minLength={20}
                maxLength={1000}
                rows={5}
                value={form.serviceDetails}
                onChange={handleChange}
                placeholder="Describe the services you offer, certifications, specialities, areas you cover..."
                className="input-lh resize-none"
              />
              <p className="mt-1.5 text-xs text-navy-400 dark:text-navy-500">
                {form.serviceDetails.length}/1000 characters
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full h-12 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProviderApplicationForm;
