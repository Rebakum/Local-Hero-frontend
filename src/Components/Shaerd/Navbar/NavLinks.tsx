import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'All Categories', path: '/categories' },
  { label: 'About', path: '/about' },
  { label: 'Professionals', path: '/professionals' },
  { label: 'How it Works', path: '/how-it-works' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact Us', path: '/contact' },
];

interface NavLinksProps {
  pathname: string;
  atTop: boolean;
}

export const NavLinks: React.FC<NavLinksProps> = ({ pathname, atTop }) => {
  return (
    <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
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
              className={`relative py-1 text-sm font-medium transition-colors duration-300 ${
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
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
};