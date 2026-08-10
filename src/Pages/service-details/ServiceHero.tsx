import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Sparkles } from 'lucide-react';

interface ServiceHeroProps {
  image: string;
  title: string;
  tradeName: string;
  isEmergency?: boolean;
  className?: string;
  objectFit?: 'cover' | 'contain';
}

export const ServiceHero: React.FC<ServiceHeroProps> = ({
  image,
  title,
  tradeName,
  isEmergency,
  className = '',
  objectFit = 'cover',
}) => {
  const navigate = useNavigate();

  return (
    <section
      className={`relative w-full mb-16 md:mb-32 min-h-[85vh] md:min-h-screen bg-navy-950 overflow-hidden flex flex-col justify-between ${className}`}
    >
      {/* 1. Background Image Layer — fills the ENTIRE section, no width/height constraint */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <img
          src={image}
          alt={title}
          className={`w-full h-full ${objectFit === 'cover' ? 'object-cover' : 'object-contain'} object-top`}
        />

        {/* Multi-layer Overlays for perfect contrast & readability */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
      </div>

      {/* 2. Top Navigation Bar (Back Button) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate('/services')}
          className="flex items-center gap-2 bg-navy-950/60 backdrop-blur-md border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-950/90 hover:scale-105"
        >
          <ArrowLeft size={16} />
          Back to Services
        </button>
      </div>

      {/* 3. Content Layer with Max-Width & Proper Padding */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-16 flex-1 flex items-end">
        <div className="w-full space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-primary/90 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-white shadow-lg">
              <Sparkles size={12} /> {tradeName}
            </span>
            {isEmergency && (
              <span className="inline-flex items-center gap-1.5 bg-red-600/90 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-white shadow-lg animate-pulse">
                <Flame size={12} /> 24/7 Emergency Dispatch
              </span>
            )}
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md max-w-4xl">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
};