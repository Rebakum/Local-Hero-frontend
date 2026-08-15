import React from 'react';
import { Reveal } from './Reveal';

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  bgImageSrc?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow = "// Professional Home & Commercial Services",
  title = "Let's Find Your Right Pro!",
  subtitle = "Expert plumbing, electrical, cleaning, and maintenance services at fixed rates.",
  ctaText = "CONTACT US",
  onCtaClick,
  bgImageSrc = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1600&auto=format&fit=crop"
}) => {
  return (
    // items-center সরিয়ে items-end দেওয়া হয়েছে যাতে কনটেন্ট নিচে চলে আসে
    <section className="relative w-full overflow-hidden bg-black text-white min-h-[350px] sm:min-h-[420px] md:min-h-[480px] lg:min-h-[520px] flex items-end justify-center">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src={bgImageSrc}
          alt="Service Background"
          className="w-full h-full object-cover object-center opacity-90 transition-opacity duration-500 pointer-events-none"
        />
        
        {/* Soft Linear Gradient Overlay - নিচের টেক্সট স্পষ্ট করার জন্য নিচ থেকে কভার গ্রেডিয়েন্ট */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Main Content Area - pb-6 sm:pb-10 দিয়ে একদম নিচে এলাইন করা হয়েছে */}
      <div className="container-lh relative z-10 pt-16 pb-6 sm:pb-10 md:pb-12 w-full">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end  gap-6 sm:gap-8 md:gap-10">
            
            {/* Left Content */}
            <div className=" space-y-2 sm:space-y-3 text-left">
              {/* Eyebrow */}
              {eyebrow && (
                <p className="text-xs sm:text-sm md:text-base font-bold tracking-wider text-primary font-mono uppercase drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  {eyebrow}
                </p>
              )}

              {/* Main Title */}
              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] sm:leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {title}
              </h1>

              {/* Subtitle (যদি প্রয়োজন হয়) */}
              {subtitle && (
                <p className="text-xs sm:text-sm md:text-base text-gray-200 font-medium max-w-lg md:max-w-xl leading-relaxed drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  {subtitle}
                </p>
              )}
            </div>

           

          </div>
        </Reveal>
      </div>

    </section>
  );
};