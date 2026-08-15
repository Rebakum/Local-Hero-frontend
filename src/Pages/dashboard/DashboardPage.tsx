import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../Context/AuthContext';
import { Card } from '../../Components/ui/shared/Card';
import { Badge } from '../../Components/ui/shared/Badge';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Clock,
  MapPin,
  Phone,
  Wrench,
  Star,
  ArrowRight,
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-sm text-navy-500 dark:text-navy-400 mb-1">
          Welcome back,
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">
          {user?.name || 'User'}
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Calendar,
            label: 'Member Since',
            value: memberSince,
          },
          {
            icon: Shield,
            label: 'Account Status',
            value: 'Verified',
            badge: 'success' as const,
          },
          {
            icon: Wrench,
            label: 'Role',
            value: user?.role || 'User',
            badge: 'primary' as const,
          },
          {
            icon: Clock,
            label: 'Last Active',
            value: 'Now',
            badge: 'success' as const,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card hover padding="md" className="h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                {stat.badge && (
                  <Badge variant={stat.badge}>
                    {stat.value}
                  </Badge>
                )}
              </div>
              <p className="text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              {!stat.badge && (
                <p className="text-sm font-medium text-navy-800 dark:text-navy-200 truncate">
                  {stat.value}
                </p>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2"
        >
          <Card padding="lg" className="h-full">
            <h2 className="text-lg font-bold text-navy-900 dark:text-white mb-6">
              Profile Information
            </h2>
            <div className="space-y-4">
              {[
                { icon: User, label: 'Full Name', value: user?.name || 'N/A' },
                { icon: Mail, label: 'Email', value: user?.email || 'N/A' },
                { icon: Phone, label: 'Phone', value: user?.phone || 'Not provided' },
                { icon: Shield, label: 'Role', value: user?.role || 'N/A' },
                { icon: MapPin, label: 'Location', value: 'London' },
                { icon: Calendar, label: 'Joined', value: memberSince },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-cream-50 dark:bg-navy-800/50 border border-navy-100 dark:border-white/5"
                >
                  <div className="w-9 h-9 rounded-lg bg-navy-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-navy-500 dark:text-navy-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-navy-400 dark:text-navy-500 uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-navy-800 dark:text-navy-200 truncate">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <Card padding="lg" className="h-full">
            <h2 className="text-lg font-bold text-navy-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Find a Professional', desc: 'Browse verified pros', href: '/professionals', color: 'bg-primary/10 text-primary' },
                { label: 'Browse Services', desc: 'Explore all services', href: '/services', color: 'bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-300' },
                { label: 'View Categories', desc: 'See trade categories', href: '/categories', color: 'bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-300' },
              ].map((action) => (
                <RouterLink
                  key={action.label}
                  to={action.href}
                  className="flex items-center justify-between p-3 rounded-xl border border-navy-100 dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/30 bg-cream-50 dark:bg-navy-800/50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${action.color}`}>
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy-800 dark:text-navy-200">
                        {action.label}
                      </p>
                      <p className="text-xs text-navy-400 dark:text-navy-500">
                        {action.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-navy-300 dark:text-navy-600 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                </RouterLink>
              ))}
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-navy-900 dark:text-white">
                  Account Status
                </p>
                <p className="text-xs text-navy-500 dark:text-navy-400">
                  Your account is active
                </p>
              </div>
            </div>
            <Badge variant="success" className="w-full justify-center py-1.5">
              Active &amp; Verified
            </Badge>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
