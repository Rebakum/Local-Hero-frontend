import React, { useRef } from 'react';
import { Star, BadgeCheck, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { useProfessionals } from '@/src/Context/ProfessionalsContext';
import { useBooking } from '@/src/Context/BookingContext';
import { FEATURED_PROS as FALLBACK_PROS } from '@/src/data/mockData';
import type { Professional, TradeCategory } from '@/src/types';

const initials = (name?: string) =>
  (name || '?')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const ProCard: React.FC<{ pro: Professional }> = ({ pro }) => {
  const { openBooking } = useBooking();
  const avatar = pro.avatar || '';
  const proName = pro.name || 'Local Pro';
  const trade = pro.trade || 'Trade Pro';
  const rating = typeof pro.rating === 'number' ? pro.rating.toFixed(1) : '4.9';
  const rate = pro.hourlyRate ? `£${pro.hourlyRate}/hr` : 'Fixed rates';

  const handleBook = () => {
    openBooking({
      trade: (pro.trade as TradeCategory) || 'Plumber',
      professionalId: pro.id || pro._id,
      professionalName: pro.name,
    });
  };

  return (
    <div className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-navy-100/70 bg-white/90 p-4 shadow-soft backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[0_18px_40px_-12px_rgba(37,99,235,0.28)] dark:border-white/10 dark:bg-navy-900/90">
      {/* Gradient top accent */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-gradient-to-r from-primary via-secondary to-primary/40 transition-transform duration-300 origin-left group-hover:scale-x-100" />

      {/* Soft glow on hover */}
      <span className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(120px_60px_at_20%_0%,theme(colors.primary/12%),transparent)]" />

      {/* Pro identity */}
      <div className="relative flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="rounded-full bg-gradient-to-br from-primary/60 via-secondary/50 to-transparent p-[2px]">
            {avatar ? (
              <img
                src={avatar}
                alt={proName}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-white dark:ring-navy-900"
              />
            ) : (
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-2 ring-white dark:ring-navy-900">
                {initials(proName)}
              </span>
            )}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-navy-900">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 truncate text-sm font-bold text-navy-950 dark:text-white">
            <span className="truncate">{proName}</span>
            <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
          </p>
          <p className="truncate text-[11px] font-medium text-navy-400 dark:text-navy-500">
            {trade}
          </p>
        </div>
      </div>

      {/* Rate + rating + Book button */}
      <div className="relative mt-auto flex items-end justify-between gap-3 border-t border-navy-100/70 pt-3.5 dark:border-white/10">
        <div className="min-w-0">
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {rating}
          </span>
          <p className="mt-0.5 truncate text-[11px] font-semibold text-primary">{rate}</p>
        </div>

        <button
          type="button"
          onClick={handleBook}
          className="group/btn flex shrink-0 items-center gap-1 rounded-full bg-primary px-5 py-2 text-[11px] font-semibold text-white transition-all duration-300 hover:gap-1.5 hover:bg-primary/90"
        >
          Book Now
          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default function ProfessionSlider() {
  const { professionals } = useProfessionals();
  const pros = professionals.length > 0 ? professionals : FALLBACK_PROS;
  const swiperRef = useRef<SwiperType | null>(null);

  if (pros.length === 0) return null;

  return (
    <div className="relative z-30 mb-2 md:mb-4">
      {/* container-lh — same wrapper the headline/buttons above use, so
          the slider's side margins line up with the rest of the hero
          content instead of using their own separate padding. */}
      <div className="container-lh relative">
        {/* Clip wrapper: padded just enough to clear the arrow buttons,
            and overflow-x-hidden so a card can never render behind or
            past them. overflow-y stays visible so the hover-lift/shadow
            on a card isn't clipped. */}
        <div className="overflow-x-hidden overflow-y-visible px-12 py-4 md:px-14">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={12}
            slidesPerView={1}
            loop
            speed={700}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="!overflow-visible py-4"
          >
            {pros.map((pro, i) => (
              <SwiperSlide key={pro.id || pro._id || i} className="!h-auto">
                <ProCard pro={pro} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Arrows — sit at container-lh's own edge, outside the clip
            wrapper's padding, so no card is ever visible beyond them */}
        <button
          type="button"
          aria-label="Previous professionals"
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-navy-200 bg-white text-navy-700 shadow-soft transition-all duration-300 hover:scale-105 hover:border-primary hover:text-primary dark:border-white/15 dark:bg-navy-900 dark:text-navy-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Next professionals"
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-navy-200 bg-white text-navy-700 shadow-soft transition-all duration-300 hover:scale-105 hover:border-primary hover:text-primary dark:border-white/15 dark:bg-navy-900 dark:text-navy-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}