import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const SOCIALS = [
  { icon: Facebook, label: 'Facebook' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Twitter, label: 'Twitter' },
];

export const FooterSocial: React.FC = () => {
  return (
    <div className="flex items-center gap-4 pt-2">
      {SOCIALS.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.label}
            href="#"
            aria-label={social.label}
            className="text-white/80 hover:text-primary transition-colors"
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
};