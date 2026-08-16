import React from 'react';
import { Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom';
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
  Wrench,
  UserRound,
  Images,
  MessageSquare,
  CalendarDays,
  CreditCard,
  Bell,
  MessageSquareText,
  Tag,
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { logoutUser } from '../services/auth.service';
import { useTheme } from '../Context/ThemeContext';
import { Link as RouterLink } from 'react-router-dom';
import { DashboardLoading } from '../Components/ui/DashboardLoading';
import type { UserRole } from '../types/auth';
import { Badge } from '../Components/ui/shared/Badge';
import { BookingModal } from '../Components/Modals/BookingModal/BookingModal';
import { NotificationBell } from '../Components/Shaerd/Navbar/NotificationBell';
import { ThemeToggle } from '../Components/Shaerd/ThemeToggle';

interface SidebarLink {
  to: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  exact?: boolean;
  color: string;
}

const ICON_COLORS: Record<string, string> = {
  red: 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  sky: 'bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  violet: 'bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
  pink: 'bg-pink-100 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400',
  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400',
  slate: 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-navy-300',
  teal: 'bg-teal-100 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400',
  cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
};

const ROLE_SIDEBAR_LINKS: Record<UserRole, SidebarLink[]> = {
  user: [
    { to: '/dashboard/user', label: 'Dashboard', icon: LayoutDashboard, exact: true, color: 'red' },
    { to: '/dashboard/user/bookings', label: 'My Bookings', icon: FileText, color: 'sky' },
    { to: '/dashboard/user/quotes', label: 'Quotes', icon: Tag, color: 'amber' },
    { to: '/dashboard/user/messages', label: 'Messages', icon: MessageSquareText, color: 'emerald' },
    { to: '/dashboard/user/notifications', label: 'Notifications', icon: Bell, color: 'violet' },
    { to: '/dashboard/user/saved', label: 'Saved Pros', icon: Star, color: 'pink' },
    { to: '/dashboard/user/apply-provider', label: 'Become a Provider', icon: Briefcase, color: 'indigo' },
    { to: '/dashboard/user/reviews', label: 'Review', icon: Briefcase, color: 'orange' },
    { to: '/dashboard/profile', label: 'Profile', icon: User, color: 'slate' },
  ],
  serviceProvider: [
    { to: '/dashboard/provider', label: 'Dashboard', icon: LayoutDashboard, exact: true, color: 'red' },
    { to: '/dashboard/provider/leads', label: 'Leads', icon: Users, color: 'teal' },
    { to: '/dashboard/provider/quotes', label: 'Quotes', icon: Tag, color: 'amber' },
    { to: '/dashboard/provider/appointments', label: 'Appointments', icon: CalendarDays, color: 'cyan' },
    { to: '/dashboard/provider/jobs', label: 'My Jobs', icon: Briefcase, color: 'blue' },
    { to: '/dashboard/provider/providerPBooking', label: 'Bookings', icon: FileText, color: 'sky' },
    { to: '/dashboard/provider/messages', label: 'Messages', icon: MessageSquare, color: 'emerald' },
    { to: '/dashboard/provider/notifications', label: 'Notifications', icon: Bell, color: 'violet' },
    { to: '/dashboard/provider/reviews', label: 'Reviews', icon: Star, color: 'orange' },
    { to: '/dashboard/provider/payments', label: 'Payments', icon: CreditCard, color: 'green' },
    { to: '/dashboard/provider/subscription', label: 'Subscription', icon: Briefcase, color: 'fuchsia' },
    { to: '/dashboard/profile', label: 'Profile', icon: User, color: 'slate' },
  ],
  ADMIN: [
    { to: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true, color: 'red' },
    { to: '/dashboard/admin/notifications', label: 'Notifications', icon: Bell, color: 'violet' },
    { to: '/dashboard/admin/approvals', label: 'Approvals', icon: UserCheck, color: 'amber' },
    { to: '/dashboard/admin/moderation', label: 'Moderation', icon: Shield, color: 'orange' },
    { to: '/dashboard/admin/manage/bookings', label: 'Bookings', icon: CalendarDays, color: 'sky' },
    { to: '/dashboard/admin/manage/payments', label: 'Payments', icon: CreditCard, color: 'green' },
    { to: '/dashboard/admin/manage/subscriptions', label: 'Subscriptions', icon: Star, color: 'fuchsia' },
    { to: '/dashboard/admin/manage/trades', label: 'Trades', icon: Wrench, color: 'red' },
    { to: '/dashboard/admin/manage/professions', label: 'Professions', icon: Tag, color: 'purple' },
    { to: '/dashboard/admin/manage/professionals', label: 'Professionals', icon: UserRound, color: 'indigo' },
    { to: '/dashboard/admin/manage/before-after', label: 'Before & After', icon: Images, color: 'cyan' },
    { to: '/dashboard/admin/manage/testimonials', label: 'Testimonials', icon: MessageSquare, color: 'pink' },
    { to: '/dashboard/profile', label: 'Profile', icon: User, color: 'slate' },
  ],
  SUPER_ADMIN: [
    { to: '/dashboard/super-admin', label: 'Dashboard', icon: LayoutDashboard, exact: true, color: 'red' },
    { to: '/dashboard/super-admin/notifications', label: 'Notifications', icon: Bell, color: 'violet' },
    { to: '/dashboard/super-admin/admin-approvals', label: 'Admin Approvals', icon: Shield, color: 'amber' },
    { to: '/dashboard/super-admin/user-approvals', label: 'Provider Approvals', icon: Users, color: 'teal' },
    { to: '/dashboard/super-admin/users', label: 'User Management', icon: UserCheck, color: 'indigo' },
    { to: '/dashboard/admin/manage/trades', label: 'Trades', icon: Wrench, color: 'red' },
    { to: '/dashboard/admin/manage/professions', label: 'Professions', icon: Tag, color: 'purple' },
    { to: '/dashboard/admin/manage/professionals', label: 'Professionals', icon: UserRound, color: 'indigo' },
    { to: '/dashboard/admin/manage/before-after', label: 'Before & After', icon: Images, color: 'cyan' },
    { to: '/dashboard/admin/manage/testimonials', label: 'Testimonials', icon: MessageSquare, color: 'pink' },
    { to: '/dashboard/admin/manage/bookings', label: 'Bookings', icon: CalendarDays, color: 'sky' },
    { to: '/dashboard/admin/manage/payments', label: 'Payments', icon: CreditCard, color: 'green' },
    { to: '/dashboard/admin/manage/subscriptions', label: 'Subscriptions', icon: Star, color: 'fuchsia' },
    { to: '/dashboard/super-admin/system', label: 'System', icon: Settings, color: 'slate' },
    { to: '/dashboard/profile', label: 'Profile', icon: User, color: 'slate' },
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
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [location.pathname]);

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


  const logoSrc = theme === 'dark' ? '/logoBlack/logo4.png' : '/logoWhite/logo.png';

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-navy-950 font-body text-navy-800 dark:text-navy-200 transition-colors duration-300">
      {loading && <DashboardLoading />}
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

          <div className="flex items-center gap-1.5 sm:gap-2">
            <NotificationBell atTop={false} variant="chip" />

            <ThemeToggle atTop={false} variant="chip" />

            {/* Home */}
            <RouterLink
              to="/"
              aria-label="Home"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600 transition-all duration-200 hover:bg-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20"
            >
              <Home className="w-5 h-5" />
            </RouterLink>

            {/* Profile — hover to reveal name & email */}
            <div className="relative group">
              <button
                type="button"
                aria-label="Account"
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-red-100 text-xs font-bold text-red-600 transition-all duration-200 hover:bg-red-200 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                  initials
                )}
              </button>

              {/* Hover tooltip with name + email */}
              <div className="pointer-events-none absolute right-0 top-full z-50 mt-2 w-60 translate-y-1 rounded-2xl border border-neutral-200 bg-white p-4 opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 dark:border-white/10 dark:bg-navy-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user?.name} className="h-full w-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy-950 dark:text-white">
                      {user?.name || 'User'}
                    </p>
                    <p className="truncate text-xs text-navy-500 dark:text-navy-400">{user?.email}</p>
                  </div>
                </div>
                
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 transition-all duration-200 hover:bg-red-200 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
            >
              <LogOut className="w-5 h-5" />
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
                  `group flex items-center gap-3 px-3 py-2.5   rounded-2xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary dark:bg-white/10 dark:text-white border border-red-200 dark:border-white/10'
                      : 'text-navy-600 dark:text-navy-400 hover:bg-primary/10 dark:hover:bg-white/10 hover:text-primary dark:hover:text-white border border-transparent'
                  }`
                }
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105 ${ICON_COLORS[link.color]}`}
                >
                  <link.icon className="w-4 h-4" />
                </span>
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

      <BookingModal />
    </div>
  );
};

export default DashboardLayout;
