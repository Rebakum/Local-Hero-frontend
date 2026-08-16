import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';
import { Card } from '../../../Components/ui/shared/Card';
import { ModalShell } from '../../../Components/ui/ModalShell';
import {
  User,
  Mail,
  Phone,
  Camera,
  Loader2,
  Save,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { updateProfile, deleteAccount } from '../../../services/auth.service';
import { uploadImage } from '../../../services/upload.service';

const ProfilePage: React.FC = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const nameError = !name.trim() ? 'Name is required.' : name.trim().length < 2 ? 'Name must be at least 2 characters.' : '';
  const phoneError = phone && !/^[0-9+\s()-]{7,20}$/.test(phone) ? 'Invalid phone number.' : '';

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    setAvatarError('');
    setIsUploadingAvatar(true);
    try {
      const uploaded = await uploadImage(file, 'avatars');
      setAvatar(uploaded.url);
      setSaveMessage('');
    } catch {
      setAvatarError('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nameError || phoneError) return;

    try {
      setIsSaving(true);
      setSaveError('');
      setSaveMessage('');
      const updatedUser = await updateProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
        avatar: avatar.trim() || undefined,
      });
      setUser(updatedUser);
      setSaveMessage('Profile updated successfully.');
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setSaveError(apiError.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword) return;

    try {
      setIsDeleting(true);
      setDeleteError('');
      await deleteAccount({ password: deletePassword });
      logout();
      navigate('/');
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setDeleteError(apiError.response?.data?.message || 'Failed to delete account. Please check your password.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="mt-2 text-sm text-navy-500 dark:text-navy-400">
          Update your personal information and account settings.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card padding="lg">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-primary" />
                  )}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profile-avatar-file"
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 3" />
                </label>
                <input
                  id="profile-avatar-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  onChange={handleAvatarSelect}
                  disabled={isUploadingAvatar}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy-800 dark:text-navy-200">{user?.name}</p>
                <p className="text-xs text-navy-400 dark:text-navy-500">{user?.email}</p>
                {avatarError && <p className="mt-1 text-xs text-red-500">{avatarError}</p>}
              </div>
            </div>

            {saveMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm">
                {saveMessage}
              </div>
            )}

            {saveError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                {saveError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="profile-name" className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setSaveMessage(''); }}
                    className="input-lh pl-10"
                    required
                  />
                </div>
                {nameError && <p className="mt-1 text-xs text-red-500">{nameError}</p>}
              </div>

              <div>
                <label htmlFor="profile-email" className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
                  <input
                    id="profile-email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input-lh pl-10 opacity-60 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-navy-400 dark:text-navy-500">Email cannot be changed.</p>
              </div>

              <div>
                <label htmlFor="profile-phone" className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
                  <input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setSaveMessage(''); }}
                    placeholder="07700 900000"
                    className="input-lh pl-10"
                  />
                </div>
                {phoneError && <p className="mt-1 text-xs text-red-500">{phoneError}</p>}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving || isUploadingAvatar || !!nameError || !!phoneError}
                className="btn btn-primary h-11 px-6 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card padding="lg" className="border-red-200 dark:border-red-500/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-navy-900 dark:text-white">Danger Zone</h2>
              <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </Card>
      </motion.div>

      <ModalShell isOpen={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setDeletePassword(''); setDeleteError(''); }}>
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-lg font-bold text-navy-900 dark:text-white">Delete Account</h2>
          </div>

          <p className="text-sm text-navy-500 dark:text-navy-400 mb-6">
            This will permanently delete your account and all associated data. Please enter your password to confirm.
          </p>

          {deleteError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm mb-4">
              {deleteError}
            </div>
          )}

          <form onSubmit={handleDeleteAccount} className="space-y-4">
            <div>
              <label htmlFor="delete-password" className="block text-sm font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="delete-password"
                  type={showDeletePassword ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(''); }}
                  placeholder="Enter your password"
                  className="input-lh pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePassword(!showDeletePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600 dark:hover:text-navy-200 transition-colors"
                  tabIndex={-1}
                >
                  {showDeletePassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setDeleteModalOpen(false); setDeletePassword(''); setDeleteError(''); }}
                className="btn btn-ghost h-10 px-4 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!deletePassword || isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </ModalShell>
    </div>
  );
};

export default ProfilePage;
