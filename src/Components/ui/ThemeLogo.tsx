import React, { useState, useEffect } from "react";
import { useTheme } from "../../Context/ThemeContext";

type LogoVariant = "default" | "modal";

type Device = "mobile" | "tablet" | "desktop";

interface ThemeLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: LogoVariant;
  isTransparent?: boolean;
  isDarkHero?: boolean;
  alt?: string;
}

function getDevice(): Device {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export const ThemeLogo: React.FC<ThemeLogoProps> = ({
  variant = "default",
  isTransparent = false,
  isDarkHero = true,
  alt = "LocalHero",
  className = "",
  ...props
}) => {
  const { theme } = useTheme();
  const [device, setDevice] = useState<Device>(getDevice);

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isDark = isTransparent ? isDarkHero : theme === "dark";

  if (variant === "modal") {
    const modalSrc = isDark ? "/logoBlack/logo4.png" : "/logoWhite/logo2.png";
    return (
      <img
        src={modalSrc}
        alt={alt}
        className={className}
        draggable={false}
        {...props}
      />
    );
  }

  // Same device-aware mapping as the dashboard/navbar logo.
  const logoSrc = (() => {
    if (isDark) {
      if (device === "mobile") return "/logoBlack/logo4.png";
      if (device === "tablet") return "/logoBlack/logo5.png";
      return "/logoBlack/logo3.png";
    }
    if (device === "mobile") return "/logoWhite/logo.png";
    if (device === "tablet") return "/logoWhite/logo2.png";
    return "/logoWhite/logo1.png";
  })();

  return (
    <img
      src={logoSrc}
      alt={alt}
      className={className}
      draggable={false}
      {...props}
    />
  );
};
