import React from 'react';
import { Link } from 'react-router-dom';
import { FooterSocial } from './FooterSocial';

export const FooterTop: React.FC = () => {
  return (
    <div className="lg:col-span-4 space-y-6">
      {/* LOGO */}
      <Link to="/" className="flex items-start justify-start transition-opacity duration-300 hover:opacity-75">
        <img
          src="/logoBlack/logo3.png"
          alt="LocalHero"
          className="h-8 sm:h-9 w-auto "
          draggable={false}
        />
      </Link>

      {/* DESCRIPTION */}
      <p className="text-[13px] sm:text-[14px] leading-relaxed text-white/60 max-w-xs">
        The premium UK marketplace connecting homeowners with vetted local tradespeople. Fixed prices, insured work, guaranteed peace of mind.
      </p>

      {/* SOCIAL ICONS */}
      <FooterSocial />
    </div>
  );
};