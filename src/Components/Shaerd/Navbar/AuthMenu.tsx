import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  LogOut,
  LogIn,
  ChevronDown,
  LayoutDashboard,
  UserRound,
  CalendarDays,
  Check,
} from 'lucide-react';
import { useAuth } from '../../../Context/AuthContext';
import { useClickOutside, useEscapeKey } from '../../../hooks';
import { getRoleConfig, getInitials } from './userRoleConfig';

interface AuthMenuProps {
  atTop: boolean;
}

export const AuthMenu: React.FC<AuthMenuProps> = ({ atTop }) => {
  const { user, isAuthenticated, isApproved, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setOpen(false), open);
  useEscapeKey(() => setOpen(false), open);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate('/');
  };

  // ---- Logged out: styled Login button ----
  if (!isAuthenticated || !user) {
    return (
      <Link
        to="/login"
        className="btn-secondary  "
      >
        <LogIn  />
        LOGIN
      </Link>
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

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5  dark:border-white/10 bg-white dark:bg-navy-900 hover:border-navy-300 dark:hover:border-white/20 transition-colors"
      >
        <span className="relative shrink-0">
          <span
            className={`block w-9 h-9 rounded-full overflow-hidden ring-2 ${role.ringClass} ${
              user.avatar ? '' : 'bg-primary/10 flex items-center justify-center text-xs font-bold text-primary'
            }`}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </span>
          {/* Role status indicator */}
          <span
            title={role.label}
            className={`absolute -bottom-0.5 -right-0.5 w-3.5 3 rounded-full border-2 border-white dark:border-navy-900 ${role.dotClass}`}
          />
        </span>
        {/* <ChevronDown
          className={`w-4 h-4 text-navy-500 dark:text-navy-400 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        /> */}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="auth-menu"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="menu"
            className="absolute right-0 top-full mt-3 w-72 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-xl shadow-navy-950/10 dark:shadow-black/40 overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-4 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
              <div className="flex items-center gap-3.5">
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
                <div className="min-w-0">
                  <p className="font-heading text-sm font-bold text-navy-950 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-navy-800 dark:text-navy-300 truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${role.badgeClass}`}
                >
                  <RoleIcon className="w-3 h-3" />
                  {role.label}
                </span>
                
              </div>
            </div>

            <div className="h-px bg-navy-100 dark:bg-white/10" />

            {/* Links */}
            <nav className="py-2">
              {menuLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-navy-800 dark:text-navy-300 hover:text-primary hover:bg-primary/5 dark:hover:bg-white/5 transition-colors"
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
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 rounded-full text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthMenu;
