import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'motion/react';
import { TradeCategory, type Professional } from '@/src/types';
import { useProfessionals } from '@/src/Context/ProfessionalsContext';

import { HeroContent } from './HeroContent';
import { HeroButtons } from './HeroButtons';
import { HeroSearch } from './HeroSearch';
import ProfessionSlider from './ProfessionSlider';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.2 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};

// আলাদা আলাদা ইমেজের/আইডির জন্য ব্যাকগ্রাউন্ড কালারের তালিকা
const bgGradients = [
  'from-blue-950 via-slate-900 to-navy-950',
  'from-amber-950 via-neutral-900 to-black',
  'from-emerald-950 via-teal-950 to-slate-950',
  'from-purple-950 via-slate-900 to-navy-950',
  'from-rose-950 via-stone-900 to-black',
  'from-indigo-950 via-slate-900 to-navy-950',
  'from-cyan-950 via-slate-950 to-black',
];

// ইউনিক আইডি বা ইমেজের নাম থেকে অটোমেটিক নির্দিষ্ট ব্যাকগ্রাউন্ড বেছে নেওয়ার ফাংশন
const getBgForPro = (pro: Professional | null): string => {
  if (!pro) return bgGradients[0];
  
  // প্রফেশনাল অবজেক্টে সরাসরি bgColor/bgGradient থাকলে সেটি কাজ করবে
  if ((pro as any).bgGradient) return (pro as any).bgGradient;

  // অন্যথায় আইডি বা নেম হ্যাশ করে একটি নির্দিষ্ট ব্যাকগ্রাউন্ড সিলেক্ট হবে
  const str = String(pro.id || (pro as any)._id || pro.name || pro.avatar || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % bgGradients.length;
  return bgGradients[index];
};

export const Hero: React.FC = () => {
  const [trade] = useState<TradeCategory>('Plumber');
  const sectionRef = useRef<HTMLElement>(null);

  const { professionals: pros } = useProfessionals();
  const [activePro, setActivePro] = useState<Professional | null>(null);

  useEffect(() => {
    const stillExists = activePro && pros.some((p) => (p.id || p._id) === (activePro.id || activePro._id));
    if (!stillExists && pros.length > 0) setActivePro(pros[0]);
  }, [pros, activePro]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const fadeOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0.25]);


  const currentBgGradient = getBgForPro(activePro);

  return (
    <div className="relative w-full">
      <section
        ref={sectionRef}
        className={`relative z-0 w-full min-h-[580px] md:min-h-[780px] lg:min-h-[800px] bg-gradient-to-br ${currentBgGradient} transition-all duration-700 ease-in-out overflow-x-hidden overflow-y-visible flex flex-col justify-between pb-16 md:pb-24`}
      >
        {/* Dynamic Portrait Image Section */}
        <div className="absolute inset-0 pointer-events-none select-none z-10 overflow-hidden">
          {/* Right Side Portrait Image */}
          <div className="absolute right-20 top-1/2 -translate-y-1/2 hidden md:block w-1/2 max-w-[600px] pr-6 lg:pr-12">
            <img
              key={`portrait-${activePro?.id || (activePro as any)?._id || activePro?.name || 'default'}`}
              src={activePro?.avatar || '/images/hero.png'}
              alt={activePro?.name || 'Hero Portrait'}
              loading="eager"
              className="w-full h-auto max-h-[550px] object-cover rounded-2xl shadow-2xl brightness-[0.8] transition-all duration-500 ease-in-out"
            />
          </div>

          {/* Bottom Gradient Overlay for Smooth Blending */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Main Content Layer */}
        <div className="container-lh relative z-20 pt-24 md:pt-32 lg:pt-36 pb-8 md:pb-16 flex-1 flex items-center">
          <motion.div
            style={{ opacity: fadeOpacity }}
            className="grid relative grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full max-w-5xl"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div className="lg:col-span-7 mt-6 md:mt-12 justify-center items-start space-y-4 md:space-y-5" variants={item}>
              <HeroContent itemVariant={item} />
              <HeroButtons itemVariant={item} trade={trade} />
            </motion.div>
          </motion.div>
        </div>

        {/* Profession Carousel */}
        <div className="absolute z-30 bottom-0 w-full mx-auto overflow-visible">
          <ProfessionSlider pros={pros} activePro={activePro} setActivePro={setActivePro} />
        </div>
      </section>
    </div>
  );
};