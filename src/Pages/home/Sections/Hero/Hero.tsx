// import React, { useRef, useState, useEffect } from 'react';
// import { motion, useScroll, useTransform, type Variants } from 'motion/react';
// import { TradeCategory, type Professional } from '@/src/types';
// import { useProfessionals } from '@/src/Context/ProfessionalsContext';

// import { HeroContent } from './HeroContent';

// import { HeroButtons } from './HeroButtons';
// import { HeroSearch } from './HeroSearch';
// import HeroSlider from './HeroSlider';
// import ProfessionSlider from './ProfessionSlider';

// const container: Variants = {
//   hidden: {},
//   show: { transition: { staggerChildren: 0.11, delayChildren: 0.2 } },
// };

// const item: Variants = {
//   hidden: { opacity: 0, y: 30 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
// };

// export const Hero: React.FC = () => {
//   const [trade] = useState<TradeCategory>('Plumber');
//   const sectionRef = useRef<HTMLElement>(null);

//   // Live professionals only — no mockData fallback. Until the API
//   // responds, `professionals` is just an empty array and the banner
//   // quietly falls back to hero.png (see below) until real data lands.
//   const { professionals: pros } = useProfessionals();

//   // Mirrors Rahmah Institute's `activeTeacher` state: whichever card is
//   // active drives the banner image. Starts null and gets seeded the
//   // moment real data arrives (effect below) — never seeded from mock data.
//   const [activePro, setActivePro] = useState<Professional | null>(null);

//   useEffect(() => {
//     // Seed with the first real professional once the API data arrives.
//     // Also re-seeds if the currently active pro disappears from the list
//     // (e.g. a refetch), so the banner never points at stale/missing data.
//     const stillExists = activePro && pros.some((p) => (p.id || p._id) === (activePro.id || activePro._id));
//     if (!stillExists && pros.length > 0) setActivePro(pros[0]);
//   }, [pros, activePro]);

//   const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
//   const fadeOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0.25]);

//   return (
//     <div className="relative w-full">


//       <section
//         ref={sectionRef}
//         className="relative z-0 w-full min-h-[580px] md:min-h-[680px] lg:min-h-[700px] bg-navy-950 overflow-x-hidden overflow-y-visible flex flex-col justify-between pb-16 md:pb-24"
//       >
//         {/* 1. Background Image Layer — now driven by the active professional
//             (click a card, or let the carousel auto-advance) instead of a
//             fixed hero.png, mirroring Rahmah Institute's HeroImage pattern.
//             Falls back to hero.png if the active pro has no avatar.
//             NOTE: previously `left-0 max-w-7xl` (no right-0/width) left this
//             wrapper with an auto width — and since the <img> inside is
//             itself `absolute` (out of flow), it never contributed to that
//             auto width, so the wrapper collapsed to width:0 and the image
//             had nowhere to render (solid black background). Now explicitly
//             spans full width with left-0 right-0. Also rendered as a plain
//             <img> (no AnimatePresence opacity-0 animation) so it's always
//             visible even during React 19 StrictMode double-mounting. */}
//         <div className="absolute left-0 right-0 top-20 md:top-32 bottom-0 pointer-events-none select-none z-10 overflow-hidden">

//           <img
//             key={activePro?.id || activePro?._id || activePro?.name || 'default'}
//             src={activePro?.avatar || '/images/hero.png'}
//             alt={activePro?.name || 'Hero Background'}
//             loading="eager"
//             className="absolute inset-0 h-full w-full object-cover object-top"
//           />

//           {/* Text readability overlays */}
//           <div className="absolute inset-0 bg-black/50" />
//           <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-black/30" />
//         </div>

//         {/* 2. Main Content Layer */}
//         <div className="container-lh relative z-10 pt-24 md:pt-32 lg:pt-36 pb-8 md:pb-16 flex-1 flex items-center">
//           <motion.div
//             style={{ opacity: fadeOpacity }}
//             className="grid relative grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full max-w-5xl"
//             variants={container}
//             initial="hidden"
//             animate="show"
//           >
//             <motion.div className="lg:col-span-12 mt-12 justify-center items-start space-y-4 md:space-y-5" variants={item}>
//               <HeroContent itemVariant={item} />
//               <HeroButtons itemVariant={item} trade={trade} />

//             </motion.div>
//           </motion.div>
//         </div>

//         {/* Profession carousel — inside the hero so it stays above the video */}
//         <div className="absolute z-30 bottom-0 w-full mx-auto overflow-visible">
//           <ProfessionSlider pros={pros} activePro={activePro} setActivePro={setActivePro} />
//         </div>
//        </section>

//     </div>
//   );
// };


import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'motion/react';
import { TradeCategory, type Professional } from '@/src/types';
import { useProfessionals } from '@/src/Context/ProfessionalsContext';

import { HeroContent } from './HeroContent';

import { HeroButtons } from './HeroButtons';
import { HeroSearch } from './HeroSearch';
import HeroSlider from './HeroSlider';
import ProfessionSlider from './ProfessionSlider';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.2 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};

export const Hero: React.FC = () => {
  const [trade] = useState<TradeCategory>('Plumber');
  const sectionRef = useRef<HTMLElement>(null);

  // Live professionals only — no mockData fallback. Until the API
  // responds, `professionals` is just an empty array and the banner
  // quietly falls back to hero.png (see below) until real data lands.
  const { professionals: pros } = useProfessionals();

  // Mirrors Rahmah Institute's `activeTeacher` state: whichever card is
  // active drives the banner image. Starts null and gets seeded the
  // moment real data arrives (effect below) — never seeded from mock data.
  const [activePro, setActivePro] = useState<Professional | null>(null);

  useEffect(() => {
    // Seed with the first real professional once the API data arrives.
    // Also re-seeds if the currently active pro disappears from the list
    // (e.g. a refetch), so the banner never points at stale/missing data.
    const stillExists = activePro && pros.some((p) => (p.id || p._id) === (activePro.id || activePro._id));
    if (!stillExists && pros.length > 0) setActivePro(pros[0]);
  }, [pros, activePro]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const fadeOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0.25]);

  return (
    <div className="relative w-full">


      <section
        ref={sectionRef}
        className="relative z-0 w-full min-h-[580px] md:min-h-[680px] lg:min-h-[700px] bg-navy-950 overflow-x-hidden overflow-y-visible flex flex-col justify-between pb-16 md:pb-24"
      >
        {/* 1. Background layer — driven by the active professional (click a
            card, or let the carousel auto-advance), mirroring Rahmah
            Institute's HeroImage pattern.
            Two-layer treatment because a small square headshot avatar
            stretched full-width via object-cover zoomed into an ugly,
            cropped close-up (just eyes/forehead). Fixed by splitting it:
              (a) an ambient blurred/dimmed cover-fill for atmosphere, and
              (b) a right-anchored portrait sized by height (not width) —
                  exactly Rahmah's `.hero-image { height:100%; width:auto;
                  object-fit:cover }` — so the photo keeps its natural
                  aspect ratio instead of being force-stretched.
            Falls back to hero.png if the active pro has no avatar.
            Plain <img>s (no AnimatePresence opacity-0 animation) so
            they're always visible even during React 19 StrictMode
            double-mounting. */}
        <div className="absolute left-0 right-0 top-20 md:top-32 bottom-0 pointer-events-none select-none z-10 overflow-hidden">

          {/* (a) Ambient blurred backdrop — fills the full width so the
              section never looks empty, but is blurred/dimmed enough
              that its distorted crop isn't distracting. */}
          <img
            key={`bg-${activePro?.id || activePro?._id || activePro?.name || 'default'}`}
            src={activePro?.avatar || '/images/hero.png'}
            alt=""
            aria-hidden="true"
            loading="eager"
            className="absolute inset-0 h-full w-full scale-110 object-cover object-top blur-2xl brightness-[0.55]"
          />

          {/* (b) Sharp portrait — sized by height with auto width, kept on
              the right, so the face is never cropped/distorted. */}
          <div className="absolute inset-y-0 right-0 flex items-end justify-end">
            <img
              key={`portrait-${activePro?.id || activePro?._id || activePro?.name || 'default'}`}
              src={activePro?.avatar || '/images/hero.png'}
              alt={activePro?.name || 'Hero Background'}
              loading="eager"
              className="h-full w-auto max-w-none object-cover object-top"
            />
          </div>

          {/* Text readability overlays */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-black/30" />
        </div>


        {/* 2. Main Content Layer */}
        <div className="container-lh relative z-10 pt-24 md:pt-32 lg:pt-36 pb-8 md:pb-16 flex-1 flex items-center">
          <motion.div
            style={{ opacity: fadeOpacity }}
            className="grid relative grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full max-w-5xl"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div className="lg:col-span-12 mt-12 justify-center items-start space-y-4 md:space-y-5" variants={item}>
              <HeroContent itemVariant={item} />
              <HeroButtons itemVariant={item} trade={trade} />

            </motion.div>
          </motion.div>
        </div>

        {/* Profession carousel — inside the hero so it stays above the video */}
        <div className="absolute z-30 bottom-0 w-full mx-auto overflow-visible">
          <ProfessionSlider pros={pros} activePro={activePro} setActivePro={setActivePro} />
        </div>
       </section>

    </div>
  );
};