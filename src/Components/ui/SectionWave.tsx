import React from 'react';

interface SectionWaveProps {
  /** Position the wave at the top of the section. Defaults to true. */
  top?: boolean;
  /** Position the wave at the bottom of the section. Defaults to true. */
  bottom?: boolean;
  className?: string;
}

/**
 * Decorative layered wave backdrop for full-width sections.
 * Render inside a `relative overflow-hidden` section; the wave uses the
 * primary brand colour at low opacity so it works in both light and dark mode.
 */
export const SectionWave: React.FC<SectionWaveProps> = ({
  top = true,
  bottom = true,
  className = '',
}) => {
  return (
    <>
      {top && (
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          className={`pointer-events-none absolute inset-x-0 top-0 w-full h-16 md:h-24 text-primary/[0.06] dark:text-primary/[0.04] ${className}`}
        >
          <path
            fill="currentColor"
            d="M0,72 C160,104 320,40 480,56 C640,72 760,112 900,96 C1060,80 1240,32 1440,72 L1440,0 L0,0 Z"
          />
          <path
            fill="currentColor"
            opacity="0.55"
            d="M0,96 C180,118 360,72 540,84 C720,96 840,124 1020,108 C1200,92 1320,60 1440,96 L1440,0 L0,0 Z"
          />
        </svg>
      )}

      {bottom && (
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          className={`pointer-events-none absolute inset-x-0 bottom-0 w-full h-16 md:h-24 text-primary/[0.06] dark:text-primary/[0.04] ${className}`}
          style={{ transform: 'scaleY(-1)' }}
        >
          <path
            fill="currentColor"
            d="M0,72 C160,104 320,40 480,56 C640,72 760,112 900,96 C1060,80 1240,32 1440,72 L1440,140 L0,140 Z"
          />
          <path
            fill="currentColor"
            opacity="0.55"
            d="M0,96 C180,118 360,72 540,84 C720,96 840,124 1020,108 C1200,92 1320,60 1440,96 L1440,140 L0,140 Z"
          />
        </svg>
      )}
    </>
  );
};

export default SectionWave;