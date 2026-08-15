import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
} from 'lucide-react';
import {
  DataTable,
  PageHeader,
  StatusBadge,
} from '../../../Components/ui';
import { Badge } from '../../../Components/ui/shared/Badge';
import { Card } from '../../../Components/ui/shared/Card';
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
  { key: 'USER', label: 'Normal Users' },
  { key: 'PROVIDER', label: 'Service Providers' },
  { key: 'ADMIN', label: 'Admins' },
  { key: 'PENDING', label: 'Pending Requests' },
];

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'user', label: 'User' },
  { value: 'serviceProvider', label: 'Service Provider' },
  { value: 'ADMIN', label: 'Admin' },
];

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
    { label: 'Total Users', value: filterCounts.ALL, color: 'bg-primary/10 text-primary' },
    { label: 'Providers', value: filterCounts.PROVIDER, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { label: 'Admins', value: filterCounts.ADMIN, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { label: 'Pending', value: filterCounts.PENDING, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Super Admin Panel"
        title="User Management"
        description="Manage all platform users, approve registrations, and assign roles."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={stat.label} hover padding="md" className="h-full">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <Users className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-navy-900 dark:text-white">{stat.value}</p>
            <p className="text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider mt-1">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeFilter === tab.key
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-white/10'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 opacity-70">({filterCounts[tab.key]})</span>
            </button>
          ))}
        </div>

        <div className="relative sm:ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-lh pl-9 h-10 text-sm"
          />
        </div>
      </div>

      <DataTable<AdminUser>
        isLoading={loading}
        loadingText="Loading users..."
        data={filteredUsers}
        rowKey={(u) => u.id}
        sortable
        searchable
        searchPlaceholder="Search users..."
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
            header: 'Name',
            render: (u) => (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {u.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <span className="font-medium text-navy-800 dark:text-navy-200 truncate max-w-[140px]">
                  {u.name}
                </span>
              </div>
            ),
          },
          {
            key: 'email',
            header: 'Email',
            render: (u) => (
              <div className="flex items-center gap-1.5 text-navy-500 dark:text-navy-400">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate max-w-[180px]">{u.email}</span>
              </div>
            ),
          },
          {
            key: 'phone',
            header: 'Phone',
            hideOn: 'md',
            render: (u) => (
              <div className="flex items-center gap-1.5 text-navy-500 dark:text-navy-400 text-xs">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                {u.phone || '—'}
              </div>
            ),
          },
          {
            key: 'role',
            header: 'Role',
            hideOn: 'sm',
            render: (u) => <Badge variant={ROLE_BADGE_VARIANT[u.role]}>{ROLE_LABELS[u.role]}</Badge>,
          },
          {
            key: 'status',
            header: 'Status',
            hideOn: 'sm',
            render: (u) =>
              u.approvalStatus ? (
                <StatusBadge status={u.approvalStatus} />
              ) : (
                <span className="text-xs text-navy-400 dark:text-navy-500">—</span>
              ),
          },
        ]}
        actions={(u) => (
          <>
            {u.approvalStatus === 'PENDING' && (
              <>
                <button
                  onClick={() => handleApprove(u.id)}
                  disabled={actionLoading === u.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-xs font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                  title="Change role"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Role
                  <ChevronDown className="w-3 h-3" />
                </button>

                {roleDropdownOpen === u.id && (
                  <div className="absolute right-0 top-full mt-1 z-20 w-48 py-1 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-white/10 shadow-xl">
                    {ROLE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleRoleChange(u.id, opt.value)}
                        disabled={actionLoading === u.id || u.role === opt.value}
                        className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                          u.role === opt.value
                            ? 'text-primary bg-primary/5 cursor-default'
                            : 'text-navy-600 dark:text-navy-400 hover:bg-navy-50 dark:hover:bg-white/5'
                        }`}
                      >
                        {opt.label}
                        {u.role === opt.value && <span className="ml-2 text-primary">(current)</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      />
    </div>
  );
};

export default UserManagement;
