import React from 'react';
import { motion } from 'motion/react';

export const CostEstimateAnimation: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-12 p-8 bg-[#0d0f12] min-h-[500px] rounded-3xl overflow-hidden">
      
      {/* ---------------- 1. নিওন আইকন (360 Degree Rotating Animation) ---------------- */}
      <div className="relative flex items-center justify-center p-8 bg-[#14171d] rounded-2xl border border-white/5 shadow-2xl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 12, // ঘোরার গতি (কম বা বেশি করতে পারেন)
            repeat: Infinity,
            ease: 'linear',
          }}
          className="w-48 h-48 sm:w-56 sm:h-56 relative flex items-center justify-center drop-shadow-[0_0_20px_rgba(204,255,0,0.4)]"
        >
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 6-Petal Neon Geometric Flower Pattern */}
            <g stroke="#ccff00" strokeWidth="4" fill="none">
              <ellipse cx="100" cy="100" rx="30" ry="85" />
              <ellipse cx="100" cy="100" rx="30" ry="85" transform="rotate(60 100 100)" />
              <ellipse cx="100" cy="100" rx="30" ry="85" transform="rotate(120 100 100)" />
              <circle cx="100" cy="100" r="5" fill="#ccff00" />
            </g>
          </svg>
        </motion.div>
      </div>

      {/* ---------------- 2. Cost Estimate Card (Slow Slide Up Animation) ---------------- */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 1.2, // ধীরে ধীরে উপরে ওঠার সময়
          ease: [0.16, 1, 0.3, 1], // স্মুথ ইজিং ইফেক্ট
        }}
        className="relative w-full max-w-md bg-[#16191e] border border-white/10 rounded-2xl p-6 shadow-2xl text-white overflow-hidden"
      >
        {/* ব্যাকগ্রাউন্ড নিওন অ্যাম্বিয়েন্ট গ্লো */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#ccff00]/10 blur-2xl pointer-events-none" />

        {/* হেডার */}
        <h3 className="text-center text-xl font-medium tracking-wide text-white/90 mb-8">
          Cost estimate
        </h3>

        {/* গ্রাফ ও প্রাইস ইন্ডিকেটর সেকশন */}
        <div className="relative w-full h-44 flex items-end justify-between px-2">
          
          {/* বেল কার্ভ শ্যাডো গ্রাফ (SVG) */}
          <svg
            viewBox="0 0 300 120"
            className="absolute inset-0 w-full h-full overflow-visible"
            fill="none"
          >
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ccff00" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ccff00" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* ফিল্ড এরিয়া (Typical Highlight) */}
            <path
              d="M 80 80 Q 150 10 220 80 L 220 120 L 80 120 Z"
              fill="url(#curveGradient)"
            />

            {/* কার্ভ লাইন */}
            <path
              d="M 10 100 Q 80 80 150 20 Q 220 80 290 100"
              stroke="#ccff00"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          {/* $30/hr ট্যাগে এনিমেশন সহ ব্যাজ */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute left-[20%] top-[30%] -translate-x-1/2 bg-black/80 border border-[#ccff00] text-[#ccff00] font-semibold text-sm px-3.5 py-1 rounded-full shadow-lg backdrop-blur-md"
          >
            $30/hr
          </motion.div>

          {/* $50/hr ট্যাগে এনিমেশন সহ ব্যাজ */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute right-[20%] top-[30%] translate-x-1/2 bg-black/80 border border-[#ccff00] text-[#ccff00] font-semibold text-sm px-3.5 py-1 rounded-full shadow-lg backdrop-blur-md"
          >
            $50/hr
          </motion.div>

          {/* লেবেলসমূহ */}
          <div className="w-full flex justify-between items-end z-10 pt-16 text-xs font-medium text-white/50">
            <span className="text-white/40">Affordable</span>
            <span className="text-white/90 font-semibold text-sm pb-2">Typical</span>
            <span className="text-white/40">Experts</span>
          </div>

        </div>
      </motion.div>

    </div>
  );
};