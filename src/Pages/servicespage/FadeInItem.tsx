import React, { useEffect, useState } from 'react';

interface FadeInItemProps {
  children: React.ReactNode;
  delayMs?: number;
}

export const FadeInItem: React.FC<FadeInItemProps> = ({ children, delayMs = 0 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`h-full transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
};