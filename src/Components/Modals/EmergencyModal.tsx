import React, { useEffect, useState } from 'react';
import { useBooking } from '../../Context/BookingContext';
import { ModalShell } from '../ui/ModalShell';
import { ThemeLogo } from '../ui/ThemeLogo';
import { X, Phone, Clock, MapPin, Zap, Flame, Key, Radio } from 'lucide-react';
import { TradeCategory } from '../../types';

const EMERGENCY_TRADES: { id: TradeCategory; label: string; icon: typeof Flame }[] = [
  { id: 'Plumber', label: 'Leak / Plumbing', icon: Flame },
  { id: 'Electrician', label: 'Power Outage', icon: Zap },
  { id: 'Locksmith', label: 'Lockout 24/7', icon: Key },
];

export const EmergencyModal: React.FC = () => {
  const { isEmergencyOpen, closeEmergencyModal, emergencyTrade, emergencyOpenCount, userPostcode } = useBooking();
  const [trade, setTrade] = useState<TradeCategory>('Plumber');
  const [postcode, setPostcode] = useState(userPostcode || '');
  const [phone, setPhone] = useState('');
  const [dispatching, setDispatching] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  // Sync with the trade/postcode passed from elsewhere whenever the modal opens
  useEffect(() => {
    if (emergencyOpenCount > 0) {
      setTrade(emergencyTrade);
      setPostcode(userPostcode || '');
      setDispatching(false);
      setDispatched(false);
    }
  }, [emergencyOpenCount, emergencyTrade, userPostcode]);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setDispatching(true);
    setTimeout(() => {
      setDispatching(false);
      setDispatched(true);
    }, 1500);
  };

  const handleReset = () => {
    setDispatching(false);
    setDispatched(false);
    closeEmergencyModal();
  };

  return (
    <ModalShell isOpen={isEmergencyOpen} onClose={handleReset} maxWidth="max-w-lg">
      {/* Urgent header */}
      <div className="bg-black p-6 flex items-center justify-between text-white">
        <div className="flex items-center gap-3.5">
          <ThemeLogo variant="modal" alt="LocalHero" className="h-9 w-auto" />
          <div>
            <div className="text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-primary">
              24/7 Fast-Track Hotline
            </div>
            <h3 className="font-heading text-xl font-extrabold tracking-tight">Emergency Dispatch</h3>
          </div>
        </div>
        <button onClick={handleReset} aria-label="Close" className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="p-6 overflow-y-auto flex-1 min-h-0 space-y-5">
        {dispatched ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/25 text-primary flex items-center justify-center mx-auto relative">
              <span className="pulse-dot w-3 h-3 rounded-full bg-primary absolute top-2 right-2" />
              <Radio className="w-8 h-8" />
            </div>
            <h4 className="font-heading text-2xl font-extrabold text-navy-950 dark:text-white">
              Emergency broadcast active
            </h4>
            <p className="text-sm text-navy-600 dark:text-navy-300">
              Paging <span className="font-bold text-primary">14 verified {trade}s</span> within 3
              miles of <span className="font-mono font-bold text-navy-950 dark:text-white">{postcode}</span>.
            </p>
            <div className="bg-cream-100 dark:bg-navy-800 border border-navy-100 dark:border-white/10 rounded-2xl p-4 text-xs text-left space-y-2">
              <div className="flex justify-between text-navy-500 dark:text-navy-300">
                <span>Guaranteed dispatch time</span>
                <span className="font-bold text-primary">35 – 45 minutes</span>
              </div>
              <div className="flex justify-between text-navy-500 dark:text-navy-300">
                <span>Hotline support</span>
                <span className="font-mono font-bold text-navy-950 dark:text-white">+44 800 917 8020</span>
              </div>
            </div>
            <button onClick={handleReset} className="btn btn-outline w-full py-3 text-sm">
              Close window
            </button>
          </div>
        ) : (
          <form onSubmit={handleDispatch} className="space-y-4">
            <div>
              <label className="block text-xs font-heading font-bold text-navy-700 dark:text-navy-200 uppercase tracking-wider mb-2">
                Emergency trade required
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {EMERGENCY_TRADES.map((item) => {
                  const Icon = item.icon;
                  const active = trade === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setTrade(item.id)}
                      className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all duration-200 ${
                        active
                          ? 'border-primary bg-primary/10 shadow-card'
                          : 'border-navy-100 dark:border-white/10 bg-white dark:bg-navy-800 hover:border-primary/40'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-navy-400 dark:text-navy-300'}`} />
                      <span
                        className={`text-xs font-heading font-bold ${
                          active ? 'text-navy-950 dark:text-white' : 'text-navy-600 dark:text-navy-300'
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-navy-700 dark:text-navy-200 uppercase tracking-wider mb-1.5">
                Your UK postcode
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input
                  type="text"
                  required
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                  className="input-lh pl-11! font-mono uppercase"
                  placeholder="e.g. SW1A 1AA"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-navy-700 dark:text-navy-200 uppercase tracking-wider mb-1.5">
                Phone number for urgent callback
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07700 900123"
                className="input-lh"
              />
            </div>

            <div className="p-3.5 rounded-2xl border border-navy-100 dark:border-white/10 bg-cream-100 dark:bg-navy-800 flex items-center gap-3 text-xs text-navy-700 dark:text-navy-200">
              <Clock className="w-5 h-5 text-primary shrink-0" />
              <span>
                Average UK arrival time is <strong className="text-navy-950 dark:text-white">38 minutes</strong>. Fixed £85 call-out diagnosis rate.
              </span>
            </div>

            <button
              type="submit"
              disabled={dispatching}
              className="btn btn-primary w-full py-4 text-base disabled:opacity-70 disabled:pointer-events-none"
            >
              <Phone className="w-4 h-4" />
              {dispatching ? 'Paging nearby pros...' : 'Broadcast emergency signal'}
            </button>
          </form>
        )}
      </div>
    </ModalShell>
  );
};
