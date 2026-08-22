import React from "react";
import { AnimatedNumber } from "@/src/Components/ui/AnimatedNumber";
import { Reveal, Stagger, StaggerItem } from "@/src/Components/ui/Reveal";

const STATS = [
  {
    value: 25000,
    label: "Jobs Done",
    format: (v: number) => `${Math.round(v).toLocaleString("en-GB")}+`,
  },
  {
    value: 12500,
    label: "Verified Pros",
    format: (v: number) => `${Math.round(v).toLocaleString("en-GB")}+`,
  },
  {
    value: 4.9,
    label: "Client Rating",
    format: (v: number) => `${v.toFixed(1)} / 5`,
  },
  {
    value: 38,
    label: "Response",
    format: (v: number) => `${Math.round(v)} min`,
  },
];

export const Stats: React.FC = () => {
  return (
    <Reveal>
      <div className="relative w-full py-10">
        <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {STATS.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                {/* Premium Gradient Ambient Glow */}
                <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                {/* Number Section */}
                <div className="font-heading flex justify-center items-center text-2xl font-black tracking-tight text-navy-950 dark:text-white sm:text-3xl">
                  <AnimatedNumber value={stat.value} format={stat.format} />
                </div>

                {/* Label Section */}
                <div className="mt-2 flex justify-center items-center gap-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-navy-800 dark:text-navy-300">
                    {stat.label}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Reveal>
  );
};