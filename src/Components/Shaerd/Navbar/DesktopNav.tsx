import React from "react";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "../ThemeToggle";
import { AuthMenu } from "./AuthMenu";
import { NotificationBell } from "./NotificationBell";
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
    <div className="hidden lg:flex items-center gap-10">
      <NavLinks
        pathname={pathname}
        atTop={atTop}
      />

      <div className="flex items-center gap-2 pl-4 border-l border-navy-100 dark:border-white/10">
        <ThemeToggle atTop={atTop} isScrolled={isScrolled} variant="chip" />
        <NotificationBell atTop={atTop} variant="chip" />
        <button
          onClick={() => openBooking()}
         className="btn btn-primary px-7 py-3 text-base "
        >
          <Wrench className="w-3 h-3" />
          <span>Post a Job</span>
        </button>

        

        <AuthMenu atTop={atTop} />
      </div>
    </div>
  );
};