import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  LogOut,
  LayoutDashboard,
  User,
  Home,
  Shield,
  Users,
  UserCheck,
  AlertTriangle,
  ChevronLeft,
  Star,
  Settings,
  FileText,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { logoutUser } from '../services/auth.service';
import { useTheme } from '../Context/ThemeContext';
import { Link as RouterLink } from 'react-router-dom';
import type { UserRole } from '../types/auth';
import { Badge } from '../Components/ui/shared/Badge';

interface SidebarLink {
  to: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  exact?: boolean;
}

const ROLE_SIDEBAR_LINKS: Record<UserRole, SidebarLink[]> = {
  user: [
    { to: '/dashboard/user', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/dashboard/user/bookings', label: 'My Bookings', icon: FileText },
    { to: '/dashboard/user/saved', label: 'Saved Pros', icon: Star },
    { to: '/dashboard/user/apply-provider', label: 'Become a Provider', icon: Briefcase },
    { to: '/dashboard/profile', label: 'Profile', icon: User },
  ],
  serviceProvider: [
    { to: '/dashboard/provider', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/dashboard/provider/leads', label: 'Leads', icon: Users },
    { to: '/dashboard/provider/jobs', label: 'My Jobs', icon: FileText },
    { to: '/dashboard/profile', label: 'Profile', icon: User },
  ],
  ADMIN: [
    { to: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/dashboard/admin/approvals', label: 'Approvals', icon: UserCheck },
    { to: '/dashboard/admin/moderation', label: 'Moderation', icon: Shield },
    { to: '/dashboard/profile', label: 'Profile', icon: User },
  ],
  SUPER_ADMIN: [
    { to: '/dashboard/super-admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/dashboard/super-admin/admin-approvals', label: 'Admin Approvals', icon: Shield },
    { to: '/dashboard/super-admin/user-approvals', label: 'Provider Approvals', icon: Users },
    { to: '/dashboard/super-admin/users', label: 'User Management', icon: UserCheck },
    { to: '/dashboard/super-admin/system', label: 'System', icon: Settings },
    { to: '/dashboard/profile', label: 'Profile', icon: User },
  ],
};

const ROLE_BADGE_VARIANT: Record<UserRole, 'primary' | 'success' | 'warning' | 'neutral'> = {
  user: 'neutral',
  serviceProvider: 'primary',
  ADMIN: 'warning',
  SUPER_ADMIN: 'success',
};

const ROLE_LABELS: Record<UserRole, string> = {
  user: 'User',
  serviceProvider: 'Service Provider',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin',
};

const DashboardLayout: React.FC = () => {
  const { user, logout, isApproved } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const links = user ? ROLE_SIDEBAR_LINKS[user.role] : ROLE_SIDEBAR_LINKS.user;

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
      // proceed with local logout even if API fails
    } finally {
      logout();
      navigate('/login');
    }
  };

  const logoSrc = theme === 'dark' ? '/logoBlack/logo3.png' : '/logoWhite/logo1.png';

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-navy-950 font-body text-navy-800 dark:text-navy-200 transition-colors duration-300">
      {/* Top Navbar */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.06] shadow-sm"
      >
        <div className="container-lh h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
            <RouterLink to="/" className="flex items-center shrink-0">
              <img src={logoSrc} alt="LocalHero" className="h-8 w-auto select-none" draggable={false} />
            </RouterLink>
            <Badge variant={ROLE_BADGE_VARIANT[user?.role || 'user']} className="hidden sm:inline-flex">
              {ROLE_LABELS[user?.role || 'user']}
            </Badge>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Info */}
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-navy-50 dark:bg-white/5 border border-navy-100 dark:border-white/10">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-navy-700 dark:text-navy-200 max-w-[120px] truncate leading-tight">
                  {user?.name || 'User'}
                </p>
                <p className="text-[10px] text-navy-400 dark:text-navy-500 leading-tight">{user?.email}</p>
              </div>
            </div>

            <RouterLink
              to="/"
              className="btn btn-ghost text-xs sm:text-sm h-9 px-3"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </RouterLink>

            <button
              onClick={handleLogout}
              className="btn btn-ghost text-xs sm:text-sm h-9 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </motion.header>

      <div className="container-lh flex gap-6 py-6 sm:py-8 md:py-10">
        {/* Sidebar */}
        <aside
          className={`w-64 shrink-0 space-y-2 ${
            sidebarOpen ? 'block' : 'hidden'
          } lg:block`}
        >
          <nav className="sticky top-24 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20'
                      : 'text-navy-600 dark:text-navy-400 hover:bg-navy-100 dark:hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                <link.icon className="w-4.5 h-4.5" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {user?.role === 'serviceProvider' && !isApproved && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Your account is pending verification by Admin
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  You have limited access until your account is approved.
                </p>
              </div>
            </motion.div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
