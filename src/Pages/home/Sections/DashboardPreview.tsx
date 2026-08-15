import React from 'react';
import {
  LayoutDashboard, Calendar, MessageSquare, PoundSterling, Users,
  Bell, Clock, MapPin, Wrench, Zap, Sparkles, Star, Check, ArrowRight, ShieldCheck,
} from 'lucide-react';
import { SectionTitle } from '@/src/Components/ui/SectionTitle';
import { Reveal } from '@/src/Components/ui/Reveal';

const SIDEBAR = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Calendar, label: 'Bookings' },
  { icon: MessageSquare, label: 'Messages' },
  { icon: PoundSterling, label: 'Payouts' },
  { icon: Users, label: 'Reviews' },
];

const BOOKINGS = [
  { id: 'LH-2918', name: 'Boiler service  Islington', pro: 'James S.', time: 'Today 9:00', location: 'N1 1AA', status: 'In progress', icon: Wrench },
  { id: 'LH-2914', name: 'EV charger install  London', pro: 'Sarah J.', time: 'Tomorrow 11:00', location: 'SE1 2DU', status: 'Confirmed', icon: Zap },
  { id: 'LH-2901', name: 'End of tenancy clean  Hackney', pro: 'Elena R.', time: 'Sat 14:00', location: 'E2 8QA', status: 'Completed', icon: Sparkles },
];

const STATS = [
  { label: 'This month', value: '£4,280', delta: '+18%', icon: PoundSterling },
  { label: 'Jobs completed', value: '36', delta: '+6', icon: Check },
  { label: 'Avg. rating', value: '4.98', delta: '+0.02', icon: Star },
  { label: 'Response time', value: '12 min', delta: '-3 min', icon: Clock },
];

const BARS = [42, 58, 45, 72, 66, 88, 54, 78, 92, 70, 84, 96];
const WEEK_LABELS = Array.from({ length: 12 }, (_, i) => `W${i + 1}`);

export const DashboardPreview: React.FC = () => {
  return (
    <section className="bg-cream-100 dark:bg-black border-y border-navy-100/60 dark:border-white/10 section-pad">
      <div className="container-lh">
        <SectionTitle
          badge
          eyebrow="Pro dashboard"
          title="Everything in one place"
          subtitle="Pros run their whole business on LocalHero  instant dispatch alerts, live booking management and next-day payouts."
        />

        <Reveal delay={0.1}>
        <div className="mt-8 md:mt-14 rounded-4xl overflow-hidden bg-white dark:bg-navy-800 shadow-lg border border-neutral-200 dark:border-white/10">
          {/* Browser chrome */}
          <div className="border-b border-navy-100 dark:border-white/10 px-4 py-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="w-3 h-3 rounded-full bg-black" />
            <span className="w-3 h-3 rounded-full bg-navy-200" />
            <div className="mx-auto hidden sm:flex items-center gap-1.5 bg-cream-100 dark:bg-navy-800 rounded-full px-3 py-1 text-[11px] font-mono text-navy-500 dark:text-navy-300">
              <ShieldCheck className="w-3 h-3 text-primary" />
              app.localhero.com/dashboard
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Sidebar (hidden on mobile) */}
            <div className="hidden lg:flex lg:col-span-2 flex-col gap-1.5 p-5 bg-cream-100 dark:bg-navy-800 border-r border-navy-100 dark:border-white/10">
              {SIDEBAR.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] font-bold transition-colors ${
                      item.active ? 'bg-black dark:bg-white text-white dark:text-navy-950 shadow-soft' : 'text-navy-600 dark:text-navy-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {item.label}
                  </div>
                );
              })}
            </div>

            {/* Main panel */}
            <div className="lg:col-span-10 bg-white dark:bg-navy-900 p-4 sm:p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading text-lg font-extrabold text-navy-950 dark:text-white">Good evening, James</h3>
                  <p className="text-xs font-medium text-navy-500 dark:text-navy-300 mt-0.5">Monday, 3 August  3 jobs scheduled</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="chip">
                    <Bell className="w-3.5 h-3.5 text-primary" /> 3 alerts
                  </span>
                  <span className="chip !border-primary/25 !bg-primary/10 text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Available
                  </span>
                </div>
              </div>

              {/* Stat tiles */}
              <div className="mt-6 grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3">
                {STATS.map((tile) => {
                  const Icon = tile.icon;
                  return (
                    <div
                      key={tile.label}
                      className="rounded-2xl border border-navy-100 dark:border-white/10 bg-cream-100 dark:bg-navy-800 p-3 sm:p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-navy-400 dark:text-navy-300">
                          {tile.label}
                        </span>
                        <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                          <Icon className="w-4 h-4 text-white" />
                        </span>
                      </div>
                      <div className="mt-2 font-heading text-xl font-extrabold text-navy-950 dark:text-white">{tile.value}</div>
                      <div className={`mt-0.5 text-[11px] font-bold ${tile.delta.startsWith('-') ? 'text-navy-400 dark:text-navy-300' : 'text-primary'}`}>
                        {tile.delta} vs last month
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-4">
                {/* Bookings list */}
                <div className="xl:col-span-7 rounded-2xl border border-navy-100 dark:border-white/10 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 bg-cream-100 dark:bg-navy-800 border-b border-navy-100 dark:border-white/10">
                    <span className="font-heading text-sm font-extrabold text-navy-950 dark:text-white">Upcoming bookings</span>
                    <span className="text-[11px] font-bold text-primary">View all</span>
                  </div>
                  <div className="divide-y divide-navy-100 dark:divide-white/10">
                    {BOOKINGS.map((b) => {
                      const Icon = b.icon;
                      return (
                        <div key={b.id} className="flex items-center gap-2.5 sm:gap-3.5 px-3 sm:px-5 py-3 sm:py-3.5">
                          <span className="w-9 h-9 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-bold text-navy-950 dark:text-white truncate">{b.name}</div>
                            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-medium text-navy-500 dark:text-navy-300">
                              <span>{b.pro}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {b.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {b.location}
                              </span>
                            </div>
                          </div>
                          <span className="shrink-0 text-[10px] font-bold rounded-full border border-primary/25 bg-primary/10 text-primary px-2.5 py-1">
                            {b.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Earnings chart */}
                <div className="xl:col-span-5 rounded-2xl border border-navy-100 dark:border-white/10 p-3 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-heading text-sm font-extrabold text-navy-950 dark:text-white">Earnings  last 12 weeks</span>
                    <span className="inline-flex items-center gap-1 rounded-4xl bg-primary text-white font-heading text-xs font-bold px-3 py-1.5">
                      <ArrowRight className="w-3 h-3 -rotate-45" /> +32%
                    </span>
                  </div>
                  <div className="mt-5 grid grid-cols-12 items-end gap-1.5 h-32">
                    {BARS.map((h, i) => (
                      <div
                        key={i}
                        className="bg-primary rounded-t transition-opacity hover:opacity-80"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="mt-2.5 hidden sm:flex justify-between text-[9px] font-semibold text-navy-400 dark:text-navy-300">
                    {WEEK_LABELS.map((w) => (
                      <span key={w}>{w}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
};
