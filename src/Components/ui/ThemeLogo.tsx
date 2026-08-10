import React from "react";
import { useTheme } from "../../Context/ThemeContext";

type LogoVariant = "default" | "modal";

interface ThemeLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variant?: LogoVariant;
  isTransparent?: boolean;
  isDarkHero?: boolean;
  alt?: string;
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

  
  const isDark = isTransparent ? isDarkHero : theme === "dark";

 
  if (variant === "modal") {
    const modalSrc = isDark ? "/logoBlack/logo4.png " : "/logoWhite/logo2.png";
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

 
  const mobileSrc = isDark ? "/logoWhite/logo.png " : "/logoBlack/logo5.png";
  const desktopSrc = isDark ? "/logoWhite/logo1.png" : "/logoBlack/logo3.png";

  return (
    <picture>
      {/* Desktop View (min-width: 768px) */}
      <source media="(min-width: 768px)" srcSet={desktopSrc} />
      
      {/* Mobile View (Default Fallback) */}
      <img
        src={mobileSrc}
        alt={alt}
        className={className}
        draggable={false}
        {...props}
      />
    </picture>
  );
};