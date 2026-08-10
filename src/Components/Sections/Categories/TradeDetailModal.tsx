import React from "react";
import { ModalShell } from "../../ui/ModalShell";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  Users,
  X,
} from "lucide-react";
import {
  Wrench,
  Zap,
  Sparkles,
  Paintbrush,
  Trees,
  Hammer,
  Key,
  Home,
} from "lucide-react";

const ICONS: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Wrench, Zap, Sparkles, Paintbrush, Trees, Hammer, Key, Home,
};

interface TradeDetailModalProps {
  trade: any;
  isOpen: boolean;
  onClose: () => void;
  onProceedToBooking: (tradeName: string) => void;
}

export const TradeDetailModal: React.FC<TradeDetailModalProps> = ({
  trade,
  isOpen,
  onClose,
  onProceedToBooking,
}) => {
  if (!trade) return null;

  const tradeName = trade.name || trade.title || '';
  const iconKey = trade.iconName || trade.icon || 'Wrench';
  const Icon = ICONS[iconKey] || Wrench;
  const rating = trade.rating || '4.9';
  const reviewsCount = trade.reviewsCount || 240;
  const startingPrice = trade.startingPrice || trade.avgHourlyRate || '£45/hr';
  const prosCount = trade.activeProsCount ?? trade.prosCount ?? 120;
  const description = trade.description || `Get matched with background-checked ${tradeName} experts in your area. Guaranteed fixed quotes with no hidden fees.`;
  const features = trade.features || [
    "DBS-checked & verified professionals",
    "Public liability insurance up to £2M",
    "Same-day emergency & scheduled options",
    "No payment until the job is done"
  ];

  return (
    <ModalShell isOpen={isOpen} onClose={onClose}>
      {/* Modal Header */}
      <div className="relative p-6 border-b border-navy-100 dark:border-white/10 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-xl font-extrabold text-navy-950 dark:text-white">
                {tradeName}
              </h3>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {rating} ({reviewsCount})
              </span>
            </div>
            <p className="text-xs text-navy-500 dark:text-navy-300 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-primary" /> {prosCount}+ Verified Pros</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary" /> ~45 min ETA</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl text-navy-400 hover:text-navy-950 hover:bg-navy-100 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
        {/* Pricing Box */}
        <div className="p-4 rounded-2xl bg-cream-100 dark:bg-navy-800 border border-navy-100 dark:border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-navy-500 dark:text-navy-300">Starting Rate</span>
            <div className="text-2xl font-heading font-extrabold text-primary">{startingPrice}</div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" /> Fixed Pricing
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-navy-700 dark:text-navy-200 mb-2">
            Service Overview
          </h4>
          <p className="text-sm text-navy-600 dark:text-navy-300 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Key Benefits / Features */}
        <div>
          <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-navy-700 dark:text-navy-200 mb-3">
            Why Book With LocalHero
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {features.map((feat: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-medium text-navy-700 dark:text-navy-200">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Footer / Action */}
      <div className="p-6 border-t border-navy-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-navy-900 rounded-b-3xl">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-3 text-sm font-heading font-bold text-navy-600 hover:text-navy-950 dark:text-navy-300 dark:hover:text-white transition-colors"
        >
          Close
        </button>
        <button
          type="button"
          onClick={() => onProceedToBooking(tradeName)}
          className="btn btn-primary px-7 py-3.5 text-base flex items-center gap-2"
        >
          Book {tradeName} Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </ModalShell>
  );
};
