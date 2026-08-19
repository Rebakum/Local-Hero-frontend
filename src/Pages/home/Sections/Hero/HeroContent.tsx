import React from 'react';
import { motion, type Variants } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

interface HeroContentProps {
  itemVariant: Variants;
}

export const HeroContent: React.FC<HeroContentProps> = ({ itemVariant }) => {
  return (
   <>
  <motion.div variants={itemVariant} className="eyebrow text-white/90">
    <ShieldCheck className="w-3.5 3" />
    Your Trusted Local Experts
  </motion.div>

  <motion.h1
    variants={itemVariant}
    className="font-heading text-[2rem]  sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight text-white"
  >
    Trusted Local<span className="text-primary"> Pros </span><span>Instantly.</span>
  </motion.h1>

  <motion.p
    variants={itemVariant}
    className="text-[14px] sm:text-lg lg:text-xl leading-relaxed text-white/70 max-w-lg"
  >
    Get matched with verified local professionals for any job, big or small. Fast, reliable, and hassle free.
  </motion.p>
</>
  );
};
