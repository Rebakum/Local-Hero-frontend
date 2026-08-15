// import React, { useRef, useState, useEffect } from 'react';
// import { motion, useScroll, useTransform, type Variants } from 'motion/react';
// import { usePrefersReducedMotion } from '@/src/hooks';
// import { TradeCategory } from '@/src/types';

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
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const prefersReducedMotion = usePrefersReducedMotion();

//   const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
//   const fadeOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0.25]);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;
//     if (prefersReducedMotion) {
//       video.pause();
//     } else {
//       video.play().catch(() => {});
//     }
//   }, [prefersReducedMotion]);

//   return (
//     <div className="relative w-full">
     
//       <section 
//         ref={sectionRef} 
//         className="relative z-0 w-full min-h-[580px] md:min-h-[680px] lg:min-h-[700px] bg-navy-950 overflow-hidden flex flex-col justify-between pb-16 md:pb-24"
//       >
//         {/* 1. Background Video Layer */}
//         <div className="absolute inset-y-0 left-0 max-w-7xl top-20 md:top-32 h-full pointer-events-none select-none z-10">

//         {prefersReducedMotion ? (
//           <img
//             src="/images/hero.png"
//             alt="Hero Background"
//             className="w-full h-full object-cover object-top"
//           />
//         ) : (

//           <video
//             ref={videoRef}
//             autoPlay
//             muted
//             loop
//             playsInline
//             preload="metadata"
//             poster="/images/hero.png"
//             className="w-full h-full object-cover object-top"

//           >

//             <source src="/videos/hero-bg.mp4" type="video/mp4" />

//             <img

//               src="/images/hero.png"

//               alt="Hero Background"

//               className="w-full h-full object-cover object-top"

//             />

//           </video>

//         )}

//           {/* Text readability overlays */}
//           <div className="absolute inset-0 bg-black/50" />
//           <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-black/30" />
//         </div>

//         {/* 2. Main Content Layer (Padding অ্যাডজাস্ট করা হয়েছে) */}
//         <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 lg:pt-36 pb-8 md:pb-16 flex-1 flex items-center">
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
//         <div className="absolute z-20 bottom-0  w-full  mx-auto ">
//           <ProfessionSlider />
//         </div>
//        </section>

//     </div>
//   );
// };




import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, type Variants } from 'motion/react';
import { usePrefersReducedMotion } from '@/src/hooks';
import { TradeCategory } from '@/src/types';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const fadeOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0.25]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (prefersReducedMotion) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, [prefersReducedMotion]);

  return (
    <div className="relative w-full">

    
      <section
        ref={sectionRef}
        className="relative z-0 w-full min-h-[580px] md:min-h-[680px] lg:min-h-[700px] bg-navy-950 overflow-x-hidden overflow-y-visible flex flex-col justify-between pb-16 md:pb-24"
      >
        {/* 1. Background Video Layer — clipping now lives here, not on the section */}
        <div className="absolute inset-y-0 left-0 max-w-7xl top-20 md:top-32 h-full pointer-events-none select-none z-10 overflow-hidden">

        {prefersReducedMotion ? (
          <img
            src="/images/hero.png"
            alt="Hero Background"
            className="w-full h-full object-cover object-top"
          />
        ) : (

          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/hero.png"
            className="w-full h-full object-cover object-top"

          >

            <source src="/videos/hero-bg.mp4" type="video/mp4" />

            <img

              src="/images/hero.png"

              alt="Hero Background"

              className="w-full h-full object-cover object-top"

            />

          </video>

        )}

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
          <ProfessionSlider />
        </div>
       </section>

    </div>
  );
};