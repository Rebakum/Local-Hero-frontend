import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../../../Components/ui/shared/Card';
import { useBooking } from '../../../Context/BookingContext';
import {
  Star,
  MapPin,
  Search,
  Heart,
  Calendar,
  Shield,
  Bookmark,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  getMyFavourites,
  removeFavourite,
  type FavouriteProfessional,
} from '../../../services/favourite.service';
import type { TradeCategory } from '../../../types';

const TRADE_COLORS: Record<string, string> = {
  Plumber: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Cleaner: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Electrician: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Gardener: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Roofer: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  Locksmith: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  Carpenter: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  Painter: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
};

const SavedPros: React.FC = () => {
  const [professionals, setProfessionals] = useState<FavouriteProfessional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [removing, setRemoving] = useState<string | null>(null);
  const { openBooking } = useBooking();

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const favourites = await getMyFavourites();
      setProfessionals(favourites.map((f) => f.professional));
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not load your saved professionals.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      professionals.filter(
        (p) =>
          !searchQuery.trim() ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.trade.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [professionals, searchQuery]
  );

  const handleRemove = async (id: string) => {
    setRemoving(id);
    setError(null);
    try {
      await removeFavourite(id);
      setProfessionals((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not remove this professional.');
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-400 to-orange-400 p-6 sm:p-8 text-white shadow-xl shadow-amber-500/20"
      >
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-sm" />
        <div className="absolute left-1/3 top-0 w-64 h-32 bg-white/5 blur-3xl rounded-full" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-white/80">Your Saved Pros</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Saved Professionals</h1>
            <p className="mt-2 text-sm text-white/70 max-w-md leading-relaxed">
              Quick access to your favourite service providers for fast rebooking.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
            <Heart className="w-4 h-4 fill-white" />
            <span className="text-sm font-medium">{professionals.length} Saved</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-4"
      >
        <div className="relative flex-1 sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search saved pros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-lh pl-9 h-10 text-sm"
          />
        </div>
      </motion.div>

      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </motion.div>
      )}

      {/* Grid */}
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card padding="lg">
            <div className="flex flex-col items-center text-center py-10">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-sm font-semibold text-navy-500 dark:text-navy-400">Loading saved professionals...</p>
            </div>
          </Card>
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card padding="lg">
            <div className="flex flex-col items-center text-center py-8">
              <Heart className="w-12 h-12 text-navy-300 dark:text-navy-600 mb-4" />
              <p className="text-sm font-semibold text-navy-500 dark:text-navy-400">
                {professionals.length === 0 ? 'No saved professionals' : 'No matches found'}
              </p>
              <p className="text-xs text-navy-400 dark:text-navy-500 mt-1">
                Browse professionals and save your favourites for quick access.
              </p>
            </div>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((pro, i) => (
            <motion.div
              key={pro.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card hover padding="md" className="h-full group relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {pro.avatar ? (
                      <img
                        src={pro.avatar}
                        alt={pro.name}
                        className="w-12 h-12 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {pro.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-navy-900 dark:text-white">{pro.name}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${TRADE_COLORS[pro.trade] || 'bg-navy-100 text-navy-600'}`}>
                        {pro.trade}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(pro.id)}
                    disabled={removing === pro.id}
                    className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    {removing === pro.id ? (
                      <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                    ) : (
                      <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-navy-900 dark:text-white">{pro.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-navy-400 dark:text-navy-500">({pro.reviewCount} reviews)</span>
                  {pro.isVerified && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                      <Shield className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4 text-xs text-navy-500 dark:text-navy-400">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {pro.postcodeArea || pro.location || 'N/A'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Available Today
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-navy-100 dark:border-white/5">
                  <span className="text-sm font-bold text-primary">£{pro.hourlyRate}/hr</span>
                  <button
                    onClick={() =>
                      openBooking({
                        trade: pro.trade as TradeCategory,
                        professionalName: pro.name,
                        professionalId: pro.id,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all duration-200 shadow-sm shadow-primary/25"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Book Now
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPros;
