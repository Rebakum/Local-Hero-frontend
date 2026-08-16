import React, { useCallback, useEffect, useState } from 'react';
import {
  Zap,
  Loader2,
  AlertCircle,
  MapPin,
  PoundSterling,
  MessageSquareQuote,
  Check,
  XCircle,
  Clock,
} from 'lucide-react';
import {
  DataTable,
  Modal,
  PageHeader,
  Input,
  Textarea,
  StatusBadge,
} from '../../../Components/ui';
import {
  getAvailableQuotes,
  getProviderQuotes,
  respondToQuote,
  type QuoteRecord,
} from '../../../services/quote.service';

const formatPrice = (pence: number | null) =>
  pence == null ? 'No budget set' : `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;

const ProviderQuotes: React.FC = () => {
  const [available, setAvailable] = useState<QuoteRecord[]>([]);
  const [mine, setMine] = useState<QuoteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [respondTarget, setRespondTarget] = useState<QuoteRecord | null>(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [responding, setResponding] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [availableData, mineData] = await Promise.all([
        getAvailableQuotes(),
        getProviderQuotes(),
      ]);
      setAvailable(availableData);
      setMine(mineData);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not load quotes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRespond = async () => {
    if (!respondTarget) return;
    const price = Number(amount);
    if (!price || price <= 0) return;
    setResponding(true);
    setError(null);
    try {
      await respondToQuote(respondTarget.id, {
        amountInPence: Math.round(price * 100),
        message: message.trim() || undefined,
      });
      setRespondTarget(null);
      setAmount('');
      setMessage('');
      await load();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not submit your quote.');
    } finally {
      setResponding(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Provider Panel"
        title="Quotes"
        description="Browse open job requests and send customers your best price."
      />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-primary" />
          <h2 className="text-base font-bold text-navy-800 dark:text-white">Open requests</h2>
          <span className="text-xs text-navy-400 dark:text-navy-500">({available.length})</span>
        </div>
        <DataTable<QuoteRecord>
          isLoading={isLoading}
          loadingText="Loading open requests..."
          data={available}
          rowKey={(q) => q.id}
          searchable
          searchPlaceholder="Search open requests..."
          searchKeys={(q) => [q.trade, q.city, q.postcode, q.description]}
          sortable
          emptyTitle="No open requests"
          emptyDescription="When customers post a job matching your trade, it will appear here."
          emptyIcon={<MessageSquareQuote className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
          columns={[
            {
              key: 'job',
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
              key: 'date',
              header: 'Preferred date',
              hideOn: 'lg',
              render: (q) =>
                q.preferredDate ? (
                  <span className="text-xs text-navy-500 dark:text-navy-400">
                    {new Date(q.preferredDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                ) : (
                  <span className="text-xs text-navy-400 dark:text-navy-500">Flexible</span>
                ),
            },
          ]}
          actions={(quote) => (
            <button
              onClick={() => {
                setRespondTarget(quote);
                setAmount('');
                setMessage('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              <PoundSterling className="w-3.5 3" />
              Send quote
            </button>
          )}
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Check className="w-4 h-4 text-emerald-500" />
          <h2 className="text-base font-bold text-navy-800 dark:text-white">My responses</h2>
          <span className="text-xs text-navy-400 dark:text-navy-500">({mine.length})</span>
        </div>
        <DataTable<QuoteRecord>
          isLoading={isLoading}
          loadingText="Loading your responses..."
          data={mine}
          rowKey={(q) => q.id}
          searchable
          searchPlaceholder="Search your responses..."
          searchKeys={(q) => [q.trade, q.city, q.postcode, q.description]}
          sortable
          emptyTitle="No responses yet"
          emptyDescription="Quotes you send will appear here with their status."
          emptyIcon={<Clock className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
          columns={[
            {
              key: 'job',
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
                  {q.city}
                </span>
              ),
            },
            {
              key: 'myPrice',
              header: 'My quote',
              render: (q) => (
                <span className="font-semibold text-primary">
                  {formatPrice(q.responses.find((r) => r.professionalId)?.amountInPence ?? null)}
                </span>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (q) => <StatusBadge status={q.status} />,
            },
          ]}
        />
      </div>

      {/* Respond modal */}
      <Modal
        open={!!respondTarget}
        onClose={() => setRespondTarget(null)}
        title="Send your quote"
        description={`Quote for the ${respondTarget?.trade.toLowerCase()} job at ${respondTarget?.postcode}.`}
        size="sm"
        icon={<PoundSterling className="w-5 h-5" />}
        footer={
          <>
            <button
              onClick={() => setRespondTarget(null)}
              disabled={responding}
              className="px-4 py-2 rounded-full bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRespond}
              disabled={responding || !Number(amount)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {responding && <Loader2 className="w-4 h-4 animate-spin" />}
              Send quote
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Your price (£)"
            required
            type="number"
            min="1"
            step="0.01"
            placeholder="e.g. 120"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />
          <Textarea
            label="Message (optional)"
            placeholder="e.g. I can start tomorrow morning."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ProviderQuotes;
