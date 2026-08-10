import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, PhoneCall } from 'lucide-react';

const SERVICES = [
  { label: 'Plumbers', to: '/services' },
  { label: 'Electricians', to: '/services' },
  { label: 'Cleaners', to: '/services' },
  { label: 'Painters', to: '/services' },
  { label: 'Gardeners', to: '/services' },
];

const COMPANY_LINKS = [
  { label: 'About LocalHero', to: '/about' },
  { label: 'Become a Pro', to: '/professionals' },
  { label: 'Trust & Safety', to: '/about' },
  { label: 'Careers', to: '/about' },
  { label: 'Blog', to: '/about' },
];

export const FooterLinks: React.FC = () => {
  return (
    <>
      {/* Services Links */}
      <div className="lg:col-span-2 lg:col-start-6">
        <h3 className="text-sm font-semibold text-white mb-6">
          Services
        </h3>
        <ul className="space-y-4">
          {SERVICES.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                className="text-[13px] text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Company Links */}
      <div className="lg:col-span-2">
        <h3 className="text-sm font-semibold text-white mb-6">
          Company
        </h3>
        <ul className="space-y-4">
          {COMPANY_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                className="text-[13px] text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact Info */}
      <div className="lg:col-span-3">
        <h3 className="text-sm font-semibold text-white mb-6">
          Contact Us
        </h3>
        <ul className="space-y-4 text-[13px] text-white/70">
          <li className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>The Lighthouse Building, Shoreditch, London EC2A 4NE</span>
          </li>
          <li className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-primary shrink-0" />
            <a href="mailto:hello@localhero.co.uk" className="hover:underline hover:text-white">
              hello@localhero.co.uk
            </a>
          </li>
          <li className="flex items-center gap-3">
            <PhoneCall className="w-4 h-4 text-primary shrink-0" />
            <a href="tel:+448009178020" className="hover:text-white">
              0800 917 8020
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};