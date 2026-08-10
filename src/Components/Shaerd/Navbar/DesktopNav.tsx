import React from "react";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "../ThemeToggle";
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
    <div className="hidden lg:flex items-center gap-8">
      <NavLinks
        pathname={pathname}
        atTop={atTop}
      />

      <ThemeToggle atTop={atTop} isScrolled={isScrolled} />

      <button
        onClick={() => openBooking()}
        className={`btn px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all duration-300 hover:scale-[1.02] ${
          atTop
            ? "bg-primary text-white hover:bg-primary/90 shadow-lg"
            : "bg-primary text-white hover:bg-primary/90"
        }`}
      >
        <Wrench className="w-4 h-4" />
        <span>Post a Job</span>
      </button>
    </div>
  );
};