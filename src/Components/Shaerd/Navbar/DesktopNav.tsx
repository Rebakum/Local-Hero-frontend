import React from "react";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "../ThemeToggle";
import { AuthMenu } from "./AuthMenu";
import { Wrench } from "lucide-react";

interface DesktopNavProps {
  pathname: string;
  atTop: boolean;
  isScrolled: boolean;
  isTransparent: boolean;
  openBooking: () => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
  pathname,
  atTop,
  isScrolled,
  openBooking,
}) => {
  return (
    <div className="hidden lg:flex items-center gap-3">
      <NavLinks
        pathname={pathname}
        atTop={atTop}
      />

      <div className="flex items-center gap-2 pl-4 border-l border-navy-100 dark:border-white/10">
        <ThemeToggle atTop={atTop} isScrolled={isScrolled} />

        <button
          onClick={() => openBooking()}
          className={`btn px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all duration-300 hover:scale-[1.02] ${
            atTop
              ? "bg-primary text-white hover:bg-primary/90 shadow-lg"
              : "bg-primary text-white hover:bg-primary/90"
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Post a Job</span>
        </button>

        <AuthMenu atTop={atTop} />
      </div>
    </div>
  );
};