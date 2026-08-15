import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Search,
  Loader2,
  AlertCircle,
  MapPin,
  Star,
  Check,
  XCircle,
  MessageSquareQuote,
  Eye,
} from 'lucide-react';
import {
  DataTable,
  Modal,
  PageHeader,
  Input,
  Select,
  Textarea,
  StatusBadge,
} from '../../../Components/ui';
import { Badge } from '../../../Components/ui/shared/Badge';
import {
  createQuote,
  getMyQuotes,
  setQuoteResponseStatus,
  type QuoteRecord,
  type QuoteInput,
} from '../../../services/quote.service';
import { getProfessionsAdmin } from '../../../services/content.service';
import type { Profession } from '../../../types';

const TRADE_OPTIONS = [
  { value: 'Plumber', label: 'Plumber' },
  { value: 'Electrician', label: 'Electrician' },
  { value: 'Cleaner', label: 'Cleaner' },
  { value: 'Painter', label: 'Painter' },
  { value: 'Gardener', label: 'Gardener' },
  { value: 'Carpenter', label: 'Carpenter' },
  { value: 'Locksmith', label: 'Locksmith' },
  { value: 'Roofer', label: 'Roofer' },
];

const formatPrice = (pence: number | null) =>
  pence == null ? 'No budget set' : `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;

interface QuoteForm {
  trade: string;
  professionId: string;
  postcode: string;
  city: string;
  description: string;
  budgetInPence: string;
  preferredDate: string;
}

const emptyForm: QuoteForm = {
  trade: '',
  professionId: '',
  postcode: '',
  city: '',
  description: '',
  budgetInPence: '',
  preferredDate: '',
};

const MyQuotes: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteRecord[]>([]);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<QuoteForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [viewing, setViewing] = useState<QuoteRecord | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  const loadQuotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyQuotes();
      setQuotes(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not load your quotes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuotes();
    getProfessionsAdmin({ page: 1, limit: 200 })
      .then(setProfessions)
      .catch(() => setProfessions([]));
  }, [loadQuotes]);

  const professionOptions = useMemo(() => {
    if (!form.trade) return [];
    return professions
      .filter((p) => p.trade?.category === form.trade)
      .map((p) => ({ value: p.id, label: p.name }));
  }, [professions, form.trade]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return quotes;
    return quotes.filter((quote) =>
      [quote.trade, quote.city, quote.postcode, quote.description]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q))
    );
  }, [quotes, searchQuery]);

  const handleSubmit = async () => {
    if (!form.trade || !form.postcode.trim() || !form.city.trim() || !form.description.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const payload: QuoteInput = {
        trade: form.trade,
        professionId: form.professionId || undefined,
        postcode: form.postcode.trim(),
        city: form.city.trim(),
        description: form.description.trim(),
        budgetInPence: Number(form.budgetInPence) > 0 ? Math.round(Number(form.budgetInPence) * 100) : undefined,
        preferredDate: form.preferredDate || undefined,
      };
      await createQuote(payload);
      setFormOpen(false);
      setForm(emptyForm);
      await loadQuotes();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not submit your quote request.');
    } finally {
      setSaving(false);
    }
  };

  const handleResponseStatus = async (responseId: string, status: 'ACCEPTED' | 'REJECTED') => {
    if (!viewing) return;
    setActing(responseId);
    setError(null);
    try {
      await setQuoteResponseStatus(viewing.id, responseId, status);
      const updated = await getMyQuotes();
      setQuotes(updated);
      setViewing(updated.find((q) => q.id === viewing.id) ?? null);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not update the response.');
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Customer Dashboard"
        title="Quote Requests"
        description="Post a job and let local professionals send you their best price."
        actions={
          <button
            onClick={() => setFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Request a Quote
          </button>
        }
      />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-sm font-semibold text-navy-500 dark:text-navy-400">
          {filtered.length} {filtered.length === 1 ? 'quote' : 'quotes'}
        </p>
        <div className="relative sm:ml-auto w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search quotes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-lh pl-9 h-10 text-sm"
          />
        </div>
      </div>

      <DataTable<QuoteRecord>
        isLoading={isLoading}
        loadingText="Loading your quotes..."
        data={filtered}
        rowKey={(q) => q.id}
        sortable
        emptyTitle="No quote requests"
        emptyDescription="Post a job request and receive quotes from local professionals."
        emptyIcon={<MessageSquareQuote className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        columns={[
          {
            key: 'trade',
            header: 'Job',
            render: (q) => (
              <div>
                <p className="font-semibold text-navy-800 dark:text-navy-200 capitalize">{q.trade}</p>
                <p className="text-[11px] text-navy-400 dark:text-navy-500 truncate max-w-[220px]">
                  {q.description}
                </p>
              </div>
            ),
          },
          {
            key: 'location',
            header: 'Location',
            render: (q) => (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-xs">
                <MapPin className="w-3 h-3" />
                {q.city}, {q.postcode}
              </span>
            ),
          },
          {
            key: 'budget',
            header: 'Budget',
            hideOn: 'md',
            render: (q) => <span className="text-navy-700 dark:text-navy-200">{formatPrice(q.budgetInPence)}</span>,
          },
          {
            key: 'responses',
            header: 'Quotes',
            render: (q) => (
              <span className="font-semibold text-navy-800 dark:text-navy-200">
                {q.responses.length} response{q.responses.length === 1 ? '' : 's'}
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (q) => <StatusBadge status={q.status} />,
          },
        ]}
        actions={(quote) => (
          <button
            onClick={() => setViewing(quote)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View quotes
          </button>
        )}
      />

      {/* Create quote modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Request a Quote"
        description="Tell local professionals what you need and compare their prices."
        size="lg"
        icon={<MessageSquareQuote className="w-5 h-5" />}
        footer={
          <>
            <button
              onClick={() => setFormOpen(false)}
              disabled={saving}
              className="px-4 py-2 rounded-full bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || !form.trade || !form.postcode.trim() || !form.city.trim() || !form.description.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit request
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Trade"
            required
            options={TRADE_OPTIONS}
            placeholder="Select a trade"
            value={form.trade}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                trade: e.target.value,
                professionId: '',
              }))
            }
          />
          <Select
            label="Profession"
            required
            options={professionOptions}
            placeholder={form.trade ? 'Select a profession' : 'Select a trade first'}
            value={form.professionId}
            onChange={(e) => setForm((prev) => ({ ...prev, professionId: e.target.value }))}
          />
          <Input
            label="City"
            required
            placeholder="e.g. London"
            value={form.city}
            onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
          />
          <Input
            label="Postcode"
            required
            placeholder="e.g. E1 1AA"
            value={form.postcode}
            onChange={(e) => setForm((prev) => ({ ...prev, postcode: e.target.value }))}
          />
          <Input
            label="Budget (£)"
            type="number"
            min="0"
            step="0.01"
            placeholder="Optional budget"
            value={form.budgetInPence}
            onChange={(e) => setForm((prev) => ({ ...prev, budgetInPence: e.target.value }))}
          />
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold text-navy-700 dark:text-navy-300">Preferred date</label>
          <input
            type="date"
            value={form.preferredDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setForm((prev) => ({ ...prev, preferredDate: e.target.value }))}
            className="input-lh w-full mt-1.5"
          />
        </div>

        <Textarea
          label="Describe the job"
          required
          placeholder="What do you need done?"
          className="mt-4"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />
      </Modal>

      {/* Quote detail / responses modal */}
      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing ? `${viewing.trade} — ${viewing.city}` : ''}
        description={viewing?.description}
        size="lg"
        icon={<MessageSquareQuote className="w-5 h-5" />}
        footer={
          <button
            onClick={() => setViewing(null)}
            className="px-4 py-2 rounded-full bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors"
          >
            Close
          </button>
        }
      >
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs text-navy-500 dark:text-navy-400">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {viewing.postcode}
              </span>
              <span>{formatPrice(viewing.budgetInPence)}</span>
              <StatusBadge status={viewing.status} />
            </div>

            {viewing.responses.length === 0 ? (
              <p className="text-sm text-navy-400 dark:text-navy-500">
                No professionals have responded yet. Check back soon.
              </p>
            ) : (
              viewing.responses.map((response) => (
                <div
                  key={response.id}
                  className="p-4 rounded-2xl border border-navy-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {response.professional?.companyName?.[0] ?? 'P'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-navy-800 dark:text-white truncate">
                        {response.professional?.companyName || 'Professional'}
                      </p>
                      {response.message && (
                        <p className="text-xs text-navy-400 dark:text-navy-500 truncate">{response.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-primary">{formatPrice(response.amountInPence)}</span>
                    {response.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleResponseStatus(response.id, 'ACCEPTED')}
                          disabled={acting === response.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleResponseStatus(response.id, 'REJECTED')}
                          disabled={acting === response.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </>
                    )}
                    {response.status === 'ACCEPTED' && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <Check className="w-3.5 h-3.5" /> Accepted
                      </span>
                    )}
                    {response.status === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-500">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyQuotes;
