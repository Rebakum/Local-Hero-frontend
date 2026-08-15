import React from 'react';
import { FooterTop } from './FooterTop';
import { FooterLinks } from './FooterLinks';
import { FooterBottom } from './FooterBottom';
import { PhoneCall } from 'lucide-react';
import { SectionTitle } from '../../ui';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-white font-sans">
      <div className="container-lh px-6 lg:px-16 py-12 ">
        {/* TOP CTA SECTION WITH SECTION TITLE */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-16 gap-6">
          <SectionTitle
            align="left"
            dark={true}
            animate={true}
            maxWidth="max-w-2xl"
            title="Need Expert Local Tradespeople? Call Today!"
          />
          <a
            href="tel:+448009178020"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-primary text-white font-medium text-sm hover:opacity-90 transition-opacity shrink-0 shadow-sm md:self-center"
          >
            <PhoneCall className="w-4 h-4 fill-current" />
            <span>0800 917 8020</span>
          </a>
        </div>

        {/* THIN HORIZONTAL DIVIDER */}
        <div className="h-[1px] w-full bg-white/10 mb-16" />

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16">
          <FooterTop />
          <FooterLinks />
        </div>

        {/* BOTTOM COPYRIGHT */}
        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;