import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, AlertCircle, LifeBuoy, CheckCircle2, XCircle, Clock, Inbox } from 'lucide-react';
import { RowActions } from '../../../../Components/dashboard/RowActions';
import { DataTable, PageHeader, StatusBadge } from '../../../../Components/ui';
import {
  getAllSupportTickets,
  updateSupportTicket,
  type SupportTicket,
  type SupportTicketStatus,
} from '../../../../services/support.service';

const STATUS_FILTERS: { value: SupportTicketStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
];

const SupportTicketsManagement: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<SupportTicketStatus | 'ALL'>('ALL');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (status: SupportTicketStatus | 'ALL') => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAllSupportTickets({
        page: 1,
        limit: 200,
        ...(status !== 'ALL' ? { status } : {}),
      });
      setTickets(res.tickets || []);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to load support tickets.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(statusFilter);
  }, [statusFilter, load]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of tickets) c[t.status] = (c[t.status] ?? 0) + 1;
    return c;
  }, [tickets]);

  const changeStatus = async (ticket: SupportTicket, status: SupportTicketStatus) => {
    setBusyId(ticket.id);
    setError(null);
    try {
      await updateSupportTicket(ticket.id, { status });
      await load(statusFilter);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to update ticket.');
    } finally {
      setBusyId(null);
    }
  };

  const relative = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return 'today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="Support Tickets"
        description="Incoming messages from the Contact Us form. Resolve or close tickets as they are handled."
      />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-navy-100/70 dark:bg-white/5 w-fit">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
              statusFilter === f.value
                ? 'bg-white dark:bg-navy-800 text-primary shadow-sm'
                : 'text-navy-800 dark:text-navy-300 hover:text-navy-700 dark:hover:text-navy-200'
            }`}
          >
            {f.label}
            {f.value !== 'ALL' && (
              <span className="ml-1 text-[10px] opacity-70">({counts[f.value] ?? 0})</span>
            )}
          </button>
        ))}
      </div>

      <DataTable<SupportTicket>
        isLoading={isLoading}
        loadingText="Loading tickets..."
        data={tickets}
        rowKey={(t) => t.id}
        searchable
        searchPlaceholder="Search by name, email, subject..."
        searchKeys={(t) => [t.name ?? '', t.email ?? '', t.subject, t.message]}
        emptyTitle="No support tickets found"
        emptyDescription="Messages sent from the Contact Us form will appear here."
        emptyIcon={<Inbox className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        columns={[
          {
            key: 'subject',
            header: 'Subject',
            render: (t) => (
              <div className="min-w-0">
                <p className="font-semibold text-navy-800 dark:text-navy-200 truncate max-w-[220px]">{t.subject}</p>
                <p className="text-[11px] text-navy-800 dark:text-navy-300 truncate max-w-[220px]">
                  {t.message}
                </p>
              </div>
            ),
          },
          {
            key: 'contact',
            header: 'Contact',
            hideOn: 'sm',
            render: (t) => (
              <div className="min-w-0">
                <p className="font-semibold text-navy-800 dark:text-navy-200">{t.name || '—'}</p>
                <p className="text-[11px] text-navy-800 dark:text-navy-300 truncate max-w-[180px]">{t.email || '—'}</p>
              </div>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (t) => <StatusBadge status={t.status} />,
          },
          {
            key: 'createdAt',
            header: 'Submitted',
            hideOn: 'md',
            render: (t) => (
              <span className="text-xs text-navy-800 dark:text-navy-300">{relative(t.createdAt)}</span>
            ),
          },
        ]}
        actions={(t) => (
          <RowActions
            actions={[
              {
                key: 'progress',
                icon: <Clock className="w-3.5 h-3.5" />,
                label: 'Mark in progress',
                tone: 'info',
                loading: busyId === t.id,
                hidden: t.status !== 'OPEN',
                onClick: () => changeStatus(t, 'IN_PROGRESS'),
              },
              {
                key: 'resolve',
                icon: <CheckCircle2 className="w-3.5 h-3.5" />,
                label: 'Mark resolved',
                tone: 'success',
                loading: busyId === t.id,
                hidden: t.status !== 'OPEN' && t.status !== 'IN_PROGRESS',
                onClick: () => changeStatus(t, 'RESOLVED'),
              },
              {
                key: 'close',
                icon: <XCircle className="w-3.5 h-3.5" />,
                label: 'Close',
                tone: 'danger',
                loading: busyId === t.id,
                hidden: t.status === 'CLOSED',
                onClick: () => changeStatus(t, 'CLOSED'),
              },
              {
                key: 'reopen',
                icon: <LifeBuoy className="w-3.5 h-3.5" />,
                label: 'Reopen',
                loading: busyId === t.id,
                hidden: t.status !== 'CLOSED',
                onClick: () => changeStatus(t, 'OPEN'),
              },
            ]}
          />
        )}
      />
    </div>
  );
};

export default SupportTicketsManagement;
