import React from 'react';
import { useBooking } from '@/src/Context/BookingContext';
import { SectionTitle } from '@/src/Components/ui/SectionTitle';
import { Star, ArrowRight } from 'lucide-react';
import { useTheme } from '@/src/Context/ThemeContext';

export const CTA: React.FC = () => {
  const { openBooking } = useBooking();
  const { theme } = useTheme();
  
  // Checking if light mode active to pass appropriate dark prop to SectionTitle
  const isDarkMode = theme === 'dark';

  return (
    <section className="relative overflow-hidden bg-navy-950 section-pad border-y border-navy-100/60 dark:border-white/10">
      
      {/* Front Dotted Grid Backdrop */}
      <div 
        className="absolute inset-0 opacity-25 dark:opacity-10 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/15 blur-[140px] pointer-events-none" />

      <div className="container-lh relative z-10">
        <div className="max-w-xl mx-auto text-center space-y-6">
          
          {/* SectionTitle with dynamic dark prop for text contrast */}
          <SectionTitle
            eyebrow="Post in 60 seconds"
            badge={true}
            dark={!isDarkMode}
            animate={true}
            title={
              <span className="text-shimmer">
                Get Fixed Quotes from Local Pros
              </span>
            }
            subtitle="Upfront pricing from DBS-checked pros. No call-out charges or hidden fees."
          />

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              onClick={() => openBooking()}
              className="btn btn-primary group px-8 py-3 text-sm sm:text-base font-semibold shadow-[0_10px_30px_-10px_rgba(220,38,38,0.5)] hover:shadow-[0_10px_36px_-8px_rgba(220,38,38,0.7)] transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <span>Post a Job — Free</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Footer Trust Elements - Text color fixed for dark & light mode */}
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs sm:text-[13px] font-semibold text-white/70 dark:text-navy-950/70 pt-3 border-t border-white/10 dark:border-navy-900/10 max-w-sm mx-auto">
            <span className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              ))}
            </span>
            <span>4.9/5 from 14,200+ reviews</span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CTA;