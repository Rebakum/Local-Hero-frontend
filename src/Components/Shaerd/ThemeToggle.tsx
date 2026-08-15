import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../Context";


interface ThemeToggleProps {
  atTop?: boolean;
  isScrolled?: boolean;
  variant?: 'navbar' | 'chip';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ atTop, variant = 'navbar' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const isChip = variant === 'chip';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
        isChip
          ? "bg-violet-100 text-violet-600 hover:bg-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20"
          : atTop
            ? "text-navy-700 dark:text-navy-100 hover:bg-navy-100 dark:hover:bg-white/10"
            : "text-navy-600 dark:text-navy-200 hover:bg-navy-100 dark:hover:bg-white/10"
      }`}
    >
      <Sun
        className={`absolute w-5 h-5 transition-all duration-300 ${
          isDark ? "opacity-0 scale-50 rotate-90" : "opacity-100 scale-100 rotate-0"
        }`}
      />
      <Moon
        className={`absolute w-5 h-5 transition-all duration-300 ${
          isDark ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-90"
        }`}
      />
    </button>
  );
};