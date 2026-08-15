import React from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useBooking } from "../../../Context/BookingContext";
import { MapPin, Wrench } from "lucide-react";
import { NAV_LINKS } from "./NavLinks";
import { MobileAuthMenu } from "./MobileAuthMenu";

interface MobileMenuProps {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pathname: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  mobileOpen,
  setMobileOpen,
  pathname,
}) => {
  const { openBooking, userPostcode, setUserPostcode } = useBooking();

  const closeMobile = () => setMobileOpen(false);

  return (
    <AnimatePresence>
      {mobileOpen && (
        <motion.div
          key="mobile-menu"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="lg:hidden overflow-hidden border-t border-navy-100 dark:border-white/10 bg-white/97 dark:bg-navy-900/97 backdrop-blur-xl"
        >
          <div className="container-lh py-6 space-y-6">
            {/* Auth: profile card when logged in, Login button when logged out */}
            <MobileAuthMenu close={closeMobile} />

            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => {
                const isActive = pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.12 + i * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      to={link.path}
                      onClick={closeMobile}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-base font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-navy-800 hover:bg-navy-100 dark:text-navy-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${link.chip} ${link.color} ${
                          isActive ? "" : "group-hover:scale-110"
                        } transition-transform duration-300`}
                      >
                        <link.icon className="w-4.5 h-4.5" />
                      </span>
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-navy-900 border border-navy-200 dark:border-white/10">
              <MapPin className="w-4 h-4 text-primary ml-1" />
              <input
                value={userPostcode}
                onChange={(e) =>
                  setUserPostcode(e.target.value.toUpperCase())
                }
                placeholder="Enter your postcode"
                className="flex-1 bg-transparent text-sm font-bold uppercase text-navy-950 dark:text-white placeholder:text-navy-400 dark:placeholder:text-navy-500 focus:outline-none"
              />
            </div>
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={() => {
                closeMobile();
                openBooking();
              }}
              className="btn btn-primary w-full py-3 text-sm"
            >
              <Wrench className="w-4 h-4" />
              Post a Job
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};