import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '../../../Context/ThemeContext';

interface LogoProps {
  atTop: boolean;
}

type Device = 'mobile' | 'tablet' | 'desktop';

function getDevice(): Device {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

export const Logo: React.FC<LogoProps> = ({ atTop }) => {
  const { theme } = useTheme();
  const [device, setDevice] = useState<Device>(getDevice);

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const logoSrc = (() => {
    if (theme === 'dark') {
      if (device === 'mobile') return '/logoBlack/logo4.png';
      if (device === 'tablet') return '/logoBlack/logo5.png';
      return '/logoBlack/logo3.png';
    }
    if (device === 'mobile') return '/logoWhite/logo.png';
    if (device === 'tablet') return '/logoWhite/logo2.png';
    return '/logoWhite/logo1.png';
  })();

  return (
    <RouterLink
      to="/"
      className="group flex items-center shrink-0 transition-all duration-300 hover:scale-[1.04] active:scale-[0.98]"
      aria-label="LocalHero home"
    >
      <img
        src={logoSrc}
        alt="LocalHero"
        className="h-8 sm:h-9 w-auto select-none drop-shadow-sm transition-all duration-300 group-hover:drop-shadow-lg"
        draggable={false}
      />
    </RouterLink>
  );
};
