import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Wrench, LayoutGrid, Users, CreditCard, MessageSquare } from 'lucide-react';

export const NAV_LINKS = [
  {
    label: 'Services',
    path: '/services',
    icon: Wrench,
    color: 'text-primary',
    chip: '',
  },
  {
    label: 'All Categories',
    path: '/categories',
    icon: LayoutGrid,
    color: 'text-sky-600 dark:text-sky-400',
    chip: '',
  },
  {
    label: 'Professionals',
    path: '/professionals',
    icon: Users,
    color: 'text-emerald-600 dark:text-emerald-400',
    chip: '',
  },
  {
    label: 'Pricing',
    path: '/pricing',
    icon: CreditCard,
    color: 'text-amber-600 dark:text-amber-400',
    chip: '',
  },
  {
    label: 'Contact Us',
    path: '/contact',
    icon: MessageSquare,
    color: 'text-violet-600 dark:text-violet-400',
    chip: '',
  },
];

interface NavLinksProps {
  pathname: string;
  atTop: boolean;
}

export const NavLinks: React.FC<NavLinksProps> = ({ pathname, atTop }) => {
  return (
    <nav className="hidden lg:flex items-center gap-3">
      {NAV_LINKS.map((link, i) => {
        const isActive = pathname === link.path;
        return (
          <motion.div
            key={link.path}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.15 + i * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Link
              to={link.path}
              onClick={(e) => {
                if (pathname === link.path) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`relative py-1 px-1 text-sm font-medium  transition-colors duration-300 ${
                isActive
                  ? 'text-primary font-semibold'
                  : atTop
                  ? 'text-navy-700 dark:text-navy-100 hover:text-primary dark:hover:text-primary'
                  : 'text-navy-600 dark:text-navy-200 hover:text-navy-950 dark:hover:text-white'
              }`}
            >
              {link.label}
              {isActive && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary"
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
};
