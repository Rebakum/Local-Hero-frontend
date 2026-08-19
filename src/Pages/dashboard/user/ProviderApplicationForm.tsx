import React, { useEffect, useState } from 'react';
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
  Layers,
} from 'lucide-react';
import { applyProvider } from '../../../services/auth.service';
import { getProfessionsAdmin } from '../../../services/content.service';
import { getAllTrades } from '../../../services/api';
import { uploadImage, uploadImages } from '../../../services/upload.service';
import { useAuth } from '../../../Context/AuthContext';
import { useToast } from '../../../Context/ToastContext';
import { Card } from '../../../Components/ui/shared/Card';
import type { Trade, Profession } from '../../../types';

const ProviderApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshProfile } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();

  const [trades, setTrades] = useState<Trade[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);

  const [form, setForm] = useState({
    tradeId: '',
    professionId: '',
    companyName: '',
    bio: '',
    hourlyRate: '',
    location: '',
    postcodeArea: '',
    specialties: '',
    experienceYears: '',
    phone: user?.phone || '',
    avatar: '',
    portfolioImages: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingPortfolio, setIsUploadingPortfolio] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getAllTrades()
      .then((data) => {
        if (!cancelled) setTrades(data);
      })
      .catch(() => {
        if (!cancelled) setTrades([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load professions that belong to the selected trade (database records only).
  useEffect(() => {
    if (!form.tradeId) {
      setProfessions([]);
      return;
    }
    let cancelled = false;
    getProfessionsAdmin({ tradeId: form.tradeId, limit: 200 })
      .then((data) => {
        if (!cancelled) setProfessions(data);
      })
      .catch(() => {
        if (!cancelled) setProfessions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [form.tradeId]);

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
    const next = { ...form, [e.target.name]: e.target.value };
    // Changing the trade invalidates the previously selected profession.
    if (e.target.name === 'tradeId') {
      next.professionId = '';
    }
    setForm(next);
    if (error) setError('');
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setIsUploadingAvatar(true);

    try {
      const uploaded = await uploadImage(file, 'avatars');
      setForm((current) => ({ ...current, avatar: uploaded.url }));
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = apiError.response?.data?.message || apiError.message || 'Failed to upload profile photo.';
      setError(msg);
      toastError(msg);
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = '';
    }
  };

  const handlePortfolioUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setError('');
    setIsUploadingPortfolio(true);

    try {
      const uploaded = await uploadImages(files, 'portfolios');
      setForm((current) => ({
        ...current,
        portfolioImages: [...current.portfolioImages, ...uploaded.map((image) => image.url)],
      }));
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = apiError.response?.data?.message || apiError.message || 'Failed to upload portfolio images.';
      setError(msg);
      toastError(msg);
    } finally {
      setIsUploadingPortfolio(false);
      event.target.value = '';
    }
  };

  const removePortfolioImage = (url: string) => {
    setForm((current) => ({
      ...current,
      portfolioImages: current.portfolioImages.filter((item) => item !== url),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation (defense-in-depth only — the backend re-validates).
    if (!form.tradeId) return setError('Please select a trade.');
    if (!form.professionId) return setError('Please select a profession.');
    if (!form.companyName.trim()) return setError('Company name is required.');
    if (!form.bio.trim()) return setError('Bio is required.');
    if (!form.hourlyRate || Number(form.hourlyRate) < 1) return setError('Hourly rate must be at least 1.');
    if (!form.location.trim()) return setError('Location is required.');
    if (!form.postcodeArea.trim()) return setError('Postcode area is required.');
    if (!form.phone.trim()) return setError('Phone number is required.');
    if (!form.experienceYears || Number(form.experienceYears) < 0) return setError('Please enter valid experience years.');
    if (!form.avatar.trim()) return setError('Please upload a profile photo.');

    const formattedSpecialties = form.specialties
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (formattedSpecialties.length === 0) {
      return setError('At least one specialty is required (separated by comma).');
    }

    setIsSubmitting(true);

    try {
      const payload = {
        tradeId: form.tradeId,
        professionId: form.professionId,
        companyName: form.companyName.trim(),
        bio: form.bio.trim(),
        hourlyRate: Number(form.hourlyRate),
        location: form.location.trim(),
        postcodeArea: form.postcodeArea.trim(),
        specialties: formattedSpecialties,
        experienceYears: Number(form.experienceYears),
        phone: form.phone.trim(),
        avatar: form.avatar.trim(),
        portfolioImages: form.portfolioImages,
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
            {/* Trade & Profession */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                  Trade *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400 pointer-events-none" />
                  <select
                    name="tradeId"
                    required
                    value={form.tradeId}
                    onChange={handleChange}
                    className="input-lh pl-10 pr-10 appearance-none"
                  >
                    <option value="" disabled>Select trade...</option>
                    {trades.map((trade) => (
                      <option key={trade.id} value={trade.id}>{trade.category}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                  Profession *
                </label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400 pointer-events-none" />
                  <select
                    name="professionId"
                    required
                    value={form.professionId}
                    onChange={handleChange}
                    disabled={!form.tradeId}
                    className="input-lh pl-10 pr-10 appearance-none disabled:opacity-50"
                  >
                    <option value="" disabled>
                      {form.tradeId ? 'Select profession...' : 'Select a trade first'}
                    </option>
                    {professions.map((profession) => (
                      <option key={profession.id} value={profession.id}>{profession.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Company Name */}
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

            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                Profile Photo *
              </label>
              <div className="flex flex-col gap-3 rounded-2xl border border-navy-200 dark:border-white/10 bg-navy-50/60 dark:bg-navy-900/40 p-3">
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isUploadingAvatar || isSubmitting}
                    className="block w-full text-sm file:mr-4 file:py-2 file:px-3 file:rounded-full file:border-0 file:bg-primary file:text-white file:font-medium file:cursor-pointer file:hover:bg-primary/90 disabled:opacity-60"
                  />
                </div>

                {isUploadingAvatar && (
                  <div className="flex items-center gap-2 text-sm text-navy-500 dark:text-navy-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading profile photo...
                  </div>
                )}

                {form.avatar && (
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 p-2">
                    <img src={form.avatar} alt="Profile preview" className="h-14 w-14 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Profile photo ready</p>
                      <p className="truncate text-[11px] text-navy-500 dark:text-navy-400">{form.avatar}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Portfolio images */}
            <div>
              <label className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                Portfolio Photos
              </label>
              <div className="rounded-2xl border border-navy-200 dark:border-white/10 bg-navy-50/60 dark:bg-navy-900/40 p-3 space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePortfolioUpload}
                  disabled={isUploadingPortfolio || isSubmitting}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-3 file:rounded-full file:border-0 file:bg-primary file:text-white file:font-medium file:cursor-pointer file:hover:bg-primary/90 disabled:opacity-60"
                />

                {isUploadingPortfolio && (
                  <div className="flex items-center gap-2 text-sm text-navy-500 dark:text-navy-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading portfolio images...
                  </div>
                )}

                {form.portfolioImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {form.portfolioImages.map((image, index) => (
                      <div key={`${image}-${index}`} className="relative group">
                        <img src={image} alt={`Portfolio ${index + 1}`} className="h-20 w-full rounded-xl object-cover" />
                        <button
                          type="button"
                          onClick={() => removePortfolioImage(image)}
                          className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-md opacity-90 hover:opacity-100"
                          aria-label="Remove portfolio image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isUploadingAvatar || isUploadingPortfolio}
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