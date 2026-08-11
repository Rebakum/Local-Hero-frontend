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
  Building,
  DollarSign,
  MapPin,
  Tag,
} from 'lucide-react';
import { applyProvider } from '../../../services/auth.service';
import { useAuth } from '../../../Context/AuthContext';
import { useToast } from '../../../Context/ToastContext';
import { Card } from '../../../Components/ui/shared/Card';
import { SERVICE_CATEGORIES, type ServiceCategory } from '../../../types/auth';

const ProviderApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshProfile } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

 
  const [form, setForm] = useState({
    trade: '' as ServiceCategory | '',
    companyName: '',
    bio: '',
    hourlyRate: '',
    location: '',
    postcodeArea: '',
    specialties: '', 
    experienceYears: '',
    phone: user?.phone || '',
    avatar: '',
    portfolioImages: '', 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'serviceProvider' && user?.approvalStatus === 'APPROVED') {
    return <Navigate to="/dashboard/provider" replace />;
  }

  const isSubmitted = success || user?.approvalStatus === 'PENDING';

  if (isSubmitted) {
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

    // Form Client-side Validation
    if (!form.trade) return setError('Please select a trade category.');
    if (!form.companyName.trim()) return setError('Company name is required.');
    if (!form.bio.trim()) return setError('Bio is required.');
    if (!form.hourlyRate || Number(form.hourlyRate) < 1) return setError('Hourly rate must be at least 1.');
    if (!form.location.trim()) return setError('Location is required.');
    if (!form.postcodeArea.trim()) return setError('Postcode area is required.');
    if (!form.phone.trim()) return setError('Phone number is required.');
    if (!form.experienceYears || Number(form.experienceYears) < 0) return setError('Please enter valid experience years.');

    const formattedSpecialties = form.specialties
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (formattedSpecialties.length === 0) {
      return setError('At least one specialty is required (separated by comma).');
    }

    const formattedPortfolioImages = form.portfolioImages
      ? form.portfolioImages.split(',').map((img) => img.trim()).filter((img) => img.length > 0)
      : [];

    setIsSubmitting(true);

    try {
      // Backend Payload Mapping
      const payload = {
        trade: form.trade,
        companyName: form.companyName.trim(),
        bio: form.bio.trim(),
        hourlyRate: Number(form.hourlyRate),
        location: form.location.trim(),
        postcodeArea: form.postcodeArea.trim(),
        specialties: formattedSpecialties,
        experienceYears: Number(form.experienceYears),
        phone: form.phone.trim(),
        avatar: form.avatar.trim() || null,
        portfolioImages: formattedPortfolioImages,
      };

      await applyProvider(payload);
      setSuccess(true);
      toastSuccess('Application submitted! Our team will review it shortly.');
      await refreshProfile();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        apiError.response?.data?.message ||
        apiError.message ||
        'Failed to submit application. Please check your inputs.';
      setError(msg);
      toastError(msg);
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
            Fill out the details below to apply as a service provider.
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Trade & Company Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                  Trade Category *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400 pointer-events-none" />
                  <select
                    name="trade"
                    required
                    value={form.trade}
                    onChange={handleChange}
                    className="input-lh pl-10 pr-10 appearance-none"
                  >
                    <option value="" disabled>Select trade...</option>
                    {SERVICE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                  Company Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
                  <input
                    name="companyName"
                    type="text"
                    required
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Acme Plumbing Ltd"
                    className="input-lh pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Hourly Rate & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                  Hourly Rate (£) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
                  <input
                    name="hourlyRate"
                    type="number"
                    min={1}
                    required
                    value={form.hourlyRate}
                    onChange={handleChange}
                    placeholder="e.g. 45"
                    className="input-lh pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                  Years of Experience *
                </label>
                <input
                  name="experienceYears"
                  type="number"
                  min={0}
                  required
                  value={form.experienceYears}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className="input-lh"
                />
              </div>
            </div>

            {/* Location & Postcode Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                  Location / City *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
                  <input
                    name="location"
                    type="text"
                    required
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. London"
                    className="input-lh pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                  Postcode Area *
                </label>
                <input
                  name="postcodeArea"
                  type="text"
                  required
                  value={form.postcodeArea}
                  onChange={handleChange}
                  placeholder="e.g. SW1A"
                  className="input-lh"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
                <input
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="07700 900000"
                  className="input-lh pl-10"
                />
              </div>
            </div>

            {/* Specialties */}
            <div>
              <label className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                Specialties * (Comma separated)
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
                <input
                  name="specialties"
                  type="text"
                  required
                  value={form.specialties}
                  onChange={handleChange}
                  placeholder="e.g. Pipe Leakage, Boiler Repair, Emergency Services"
                  className="input-lh pl-10"
                />
              </div>
            </div>

            {/* Bio / Description */}
            <div>
              <label className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                Bio / Service Description *
              </label>
              <textarea
                name="bio"
                required
                rows={4}
                value={form.bio}
                onChange={handleChange}
                placeholder="Describe your background, skills, and exact services you offer..."
                className="input-lh resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full h-12 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting Application...
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