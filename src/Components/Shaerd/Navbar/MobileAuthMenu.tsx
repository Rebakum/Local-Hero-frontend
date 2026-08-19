import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  LogOut,
  LogIn,
  LayoutDashboard,
  UserRound,
  CalendarDays,
  Check,
} from 'lucide-react';
import { useAuth } from '../../../Context/AuthContext';
import { getRoleConfig, getInitials } from './userRoleConfig';

interface MobileAuthMenuProps {
  close: () => void;
}

export const MobileAuthMenu: React.FC<MobileAuthMenuProps> = ({ close }) => {
  const { user, isAuthenticated, isApproved, logout } = useAuth();
  const navigate = useNavigate();

  // ---- Logged out: Login button ----
  if (!isAuthenticated || !user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          to="/login"
          onClick={close}
          className="btn-secondary w-full"
        >
          <LogIn className="w-4 h-4" />
          Login to your account
        </Link>
        <p className="text-center text-xs text-navy-400 dark:text-navy-500 mt-3">
          New to LocalHero?{' '}
          <Link to="/register" onClick={close} className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    );
  }

  const role = getRoleConfig(user.role);
  const initials = getInitials(user.name);
  const RoleIcon = role.icon;

  const menuLinks = [
    { to: role.dashboardPath, label: 'Dashboard', icon: LayoutDashboard, color: 'text-primary', chip: 'bg-primary/10' },
    { to: '/dashboard/profile', label: 'My Profile', icon: UserRound, color: 'text-sky-600 dark:text-sky-400', chip: 'bg-sky-100 dark:bg-sky-500/10' },
    ...(role.showBookings
      ? [{ to: '/dashboard/user/bookings', label: 'My Bookings', icon: CalendarDays, color: 'text-amber-600 dark:text-amber-400', chip: 'bg-amber-100 dark:bg-amber-500/10' }]
      : []),
  ];

  const handleLogout = async () => {
    close();
    await logout();
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-navy-100 dark:border-white/10 bg-white dark:bg-navy-900 overflow-hidden"
    >
      {/* Profile header */}
      <div className="flex items-center gap-3.5 px-4 pt-4 pb-3">
        <span className="relative shrink-0">
          <span
            className={`block w-12 h-12 rounded-full overflow-hidden ring-2 ${role.ringClass} ${
              user.avatar
                ? ''
                : 'bg-primary/10 flex items-center justify-center text-sm font-bold text-primary'
            }`}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </span>
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-navy-900 ${role.dotClass}`}
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-sm font-bold text-navy-950 dark:text-white truncate">
            {user.name}
          </p>
          <p className="text-xs text-navy-400 dark:text-navy-500 truncate">{user.email}</p>
        </div>
      </div>

      {/* Role + approval pills */}
      <div className="flex items-center gap-2 px-4 pb-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${role.badgeClass}`}
        >
          <RoleIcon className="w-3 h-3" />
          {role.label}
        </span>
        {isApproved ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
            <Check className="w-3 h-3" />
            Approved
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold">
            Pending approval
          </span>
        )}
      </div>

      <div className="h-px bg-navy-100 dark:bg-white/10" />

      {/* Links */}
      <nav className="py-1.5">
        {menuLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={close}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-navy-700 dark:text-navy-200 hover:text-primary hover:bg-primary/5 dark:hover:bg-white/5 transition-colors"
          >
            <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${link.chip} ${link.color}`}>
              <link.icon className="w-4 h-4" />
            </span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="h-px bg-navy-100 dark:bg-white/10" />

      {/* Logout */}
      <div className="p-2">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </motion.div>
  );
};

export default MobileAuthMenu;
