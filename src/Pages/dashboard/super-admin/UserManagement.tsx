import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Loader2,
  Mail,
  Phone,
  Check,
  X,
  ChevronDown,
  Shield,
  AlertCircle,
  Search,
  UserRound,
  Briefcase,
  Crown,
  UserCheck,
  CalendarDays,
  Command,
  ArrowUpRight,
} from 'lucide-react';
import {
  DataTable,
  PageHeader,
  StatusBadge,
} from '../../../Components/ui';
import { Badge } from '../../../Components/ui/shared/Badge';
import {
  getAllUsers,
  approveUser,
  rejectUser,
  changeUserRole,
} from '../../../services/auth.service';
import type { AdminUser, UserRole } from '../../../types/auth';

type FilterTab = 'ALL' | 'USER' | 'PROVIDER' | 'ADMIN' | 'PENDING';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'All Users' },
  { key: 'USER', label: 'Customers' },
  { key: 'PROVIDER', label: 'Providers' },
  { key: 'ADMIN', label: 'Admins' },
  { key: 'PENDING', label: 'Pending' },
];

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'user', label: 'Customer' },
  { value: 'serviceProvider', label: 'Service Provider' },
  { value: 'ADMIN', label: 'Admin' },
];

const ROLE_META: Record<
  UserRole,
  { label: string; icon: React.FC<{ className?: string }>; pill: string; ring: string }
> = {
  user: {
    label: 'Customer',
    icon: UserRound,
    pill: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-navy-300 border-slate-200 dark:border-white/10',
    ring: 'from-slate-400 to-slate-600',
  },
  serviceProvider: {
    label: 'Service Provider',
    icon: Briefcase,
    pill: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    ring: 'from-sky-400 to-blue-600',
  },
  ADMIN: {
    label: 'Admin',
    icon: Shield,
    pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    ring: 'from-amber-400 to-orange-500',
  },
  SUPER_ADMIN: {
    label: 'Super Admin',
    icon: Crown,
    pill: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    ring: 'from-emerald-400 to-teal-600',
  },
};

const STAT_GRADIENTS: Record<string, string> = {
  total: 'from-primary via-rose-500 to-fuchsia-500',
  providers: 'from-sky-400 via-blue-500 to-indigo-600',
  admins: 'from-amber-400 via-orange-500 to-red-500',
  pending: 'from-emerald-400 via-teal-500 to-cyan-600',
};

const initials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

const formatDate = (iso?: string): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    let result = users;

    switch (activeFilter) {
      case 'USER':
        result = result.filter((u) => u.role === 'user');
        break;
      case 'PROVIDER':
        result = result.filter((u) => u.role === 'serviceProvider');
        break;
      case 'ADMIN':
        result = result.filter((u) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN');
        break;
      case 'PENDING':
        result = result.filter((u) => u.approvalStatus === 'PENDING');
        break;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [users, activeFilter, searchQuery]);

  const handleApprove = async (userId: string) => {
    try {
      setActionLoading(userId);
      setError('');
      await approveUser(userId);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, approvalStatus: 'APPROVED' as const, isApproved: true } : u,
        ),
      );
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || 'Failed to approve user.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      setActionLoading(userId);
      setError('');
      await rejectUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, approvalStatus: 'REJECTED' as const } : u)),
      );
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || 'Failed to reject user.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      setActionLoading(userId);
      setError('');
      await changeUserRole(userId, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      setRoleDropdownOpen(null);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || 'Failed to change role.');
    } finally {
      setActionLoading(null);
    }
  };

  const filterCounts = useMemo(
    () => ({
      ALL: users.length,
      USER: users.filter((u) => u.role === 'user').length,
      PROVIDER: users.filter((u) => u.role === 'serviceProvider').length,
      ADMIN: users.filter((u) => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length,
      PENDING: users.filter((u) => u.approvalStatus === 'PENDING').length,
    }),
    [users],
  );

  const stats = [
    { key: 'total', label: 'Total Users', value: filterCounts.ALL, icon: Users, sub: 'All registered accounts' },
    { key: 'providers', label: 'Service Providers', value: filterCounts.PROVIDER, icon: Briefcase, sub: 'Vetted tradespeople' },
    { key: 'admins', label: 'Admins', value: filterCounts.ADMIN, icon: Shield, sub: 'Team & staff roles' },
    { key: 'pending', label: 'Pending Requests', value: filterCounts.PENDING, icon: UserCheck, sub: 'Awaiting approval' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Super Admin Panel"
        title="User Management"
        description="Manage all platform users, approve registrations, and assign roles."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-navy-800 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
          >
            <div
              className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${STAT_GRADIENTS[stat.key]} opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20`}
            />
            <div className="relative flex items-start justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${STAT_GRADIENTS[stat.key]} text-white shadow-md`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="w-3 h-3" />
                live
              </span>
            </div>
            <p className="relative mt-4 text-3xl font-black tracking-tight text-navy-900 dark:text-white">
              {stat.value.toLocaleString()}
            </p>
            <p className="relative mt-1 text-xs font-bold uppercase tracking-wider text-navy-800 dark:text-navy-300">
              {stat.label}
            </p>
            <p className="relative mt-0.5 text-[11px] text-navy-800 dark:text-navy-300">
              {stat.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Filters + Search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2">
          {FILTER_TABS.map((tab) => {
            const active = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-primary to-rose-500 text-white shadow-md shadow-primary/30'
                    : 'bg-white dark:bg-navy-800 border border-neutral-200 dark:border-white/10 text-navy-800 dark:text-navy-300 hover:border-primary/40 hover:text-primary'
                }`}
              >
                {tab.label}
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-navy-100 text-navy-800 dark:bg-white/10 dark:text-navy-300'
                  }`}
                >
                  {filterCounts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative lg:ml-auto w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-lh pl-10 pr-16 h-11 text-sm rounded-2xl"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-md border border-neutral-200 dark:border-white/10 bg-navy-50 dark:bg-navy-900 px-1.5 py-0.5 text-[10px] font-semibold text-navy-800 dark:text-navy-300">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </div>
      </div>

      <DataTable<AdminUser>
        isLoading={loading}
        loadingText="Loading users..."
        data={filteredUsers}
        rowKey={(u) => u.id}
        sortable
        emptyTitle="No users found"
        emptyDescription={
          activeFilter === 'ALL'
            ? 'No users registered yet.'
            : `No users matching the "${FILTER_TABS.find((t) => t.key === activeFilter)?.label}" filter.`
        }
        emptyIcon={<Users className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        columns={[
          {
            key: 'name',
            header: 'User',
            sortValue: (u) => u.name.toLowerCase(),
            render: (u) => {
              const meta = ROLE_META[u.role];
              return (
                <div className="flex items-center gap-3">
                  <div className={`relative shrink-0 rounded-full bg-gradient-to-br ${meta.ring} p-[2px]`}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-navy-800 text-xs font-black text-navy-800 dark:text-white">
                      {initials(u.name)}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy-800 dark:text-navy-100">
                      {u.name}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-navy-800 dark:text-navy-300">
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate max-w-[200px]">{u.email}</span>
                    </p>
                  </div>
                </div>
              );
            },
          },
          {
            key: 'phone',
            header: 'Phone',
            hideOn: 'md',
            render: (u) => (
              <span className="inline-flex items-center gap-2 rounded-xl bg-navy-50 dark:bg-white/5 px-2.5 py-1.5 text-xs font-medium text-navy-800 dark:text-navy-300">
                <Phone className="w-3 h-3 shrink-0 text-navy-400" />
                {u.phone || '—'}
              </span>
            ),
          },
          {
            key: 'role',
            header: 'Role',
            sortValue: (u) => u.role,
            render: (u) => {
              const meta = ROLE_META[u.role];
              const RoleIcon = meta.icon;
              return (
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.pill}`}>
                  <RoleIcon className="w-3 h-3" />
                  {meta.label}
                </span>
              );
            },
          },
          {
            key: 'status',
            header: 'Status',
            sortValue: (u) => u.approvalStatus ?? '',
            render: (u) =>
              u.approvalStatus ? (
                <StatusBadge
                  status={u.approvalStatus}
                  pulse={u.approvalStatus === 'PENDING'}
                />
              ) : (
                <Badge variant="neutral">—</Badge>
              ),
          },
          {
            key: 'createdAt',
            header: 'Joined',
            hideOn: 'lg',
            sortValue: (u) => u.createdAt ?? '',
            render: (u) => (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-navy-800 dark:text-navy-300">
                <CalendarDays className="w-3 h-3 text-navy-400" />
                {formatDate(u.createdAt)}
              </span>
            ),
          },
        ]}
        actions={(u) => (
          <div className="flex items-center justify-end gap-1.5">
            {u.approvalStatus === 'PENDING' && (
              <>
                <button
                  onClick={() => handleApprove(u.id)}
                  disabled={actionLoading === u.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-emerald-500/30 transition-all duration-200 hover:shadow-md hover:brightness-105 disabled:opacity-50"
                  title="Approve"
                >
                  {actionLoading === u.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  Approve
                </button>
                <button
                  onClick={() => handleReject(u.id)}
                  disabled={actionLoading === u.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 transition-colors duration-200 hover:bg-red-100 dark:hover:bg-red-500/20 disabled:opacity-50"
                  title="Reject"
                >
                  <X className="w-3.5 h-3.5" />
                  Reject
                </button>
              </>
            )}

            {u.role !== 'SUPER_ADMIN' && (
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(roleDropdownOpen === u.id ? null : u.id)}
                  disabled={actionLoading === u.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-white/10 bg-white dark:bg-navy-800 px-3 py-1.5 text-xs font-bold text-navy-800 dark:text-navy-300 transition-all duration-200 hover:border-primary/40 hover:text-primary disabled:opacity-50"
                  title="Change role"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Role
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${roleDropdownOpen === u.id ? 'rotate-180' : ''}`} />
                </button>

                {roleDropdownOpen === u.id && (
                  <div className="absolute right-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-navy-800 p-1.5 shadow-2xl">
                    {ROLE_OPTIONS.map((opt) => {
                      const selected = u.role === opt.value;
                      const optMeta = ROLE_META[opt.value];
                      const OptIcon = optMeta.icon;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleRoleChange(u.id, opt.value)}
                          disabled={actionLoading === u.id || selected}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                            selected
                              ? 'cursor-default bg-primary/10 text-primary'
                              : 'text-navy-800 dark:text-navy-300 hover:bg-navy-50 dark:hover:bg-white/5'
                          }`}
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy-100 dark:bg-white/10">
                            <OptIcon className="w-3.5 h-3.5" />
                          </span>
                          {opt.label}
                          {selected && (
                            <span className="ml-auto text-[10px] font-bold text-primary">
                              Current
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default UserManagement;