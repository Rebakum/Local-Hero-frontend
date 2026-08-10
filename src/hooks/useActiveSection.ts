import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useActiveSection(sectionIds: string[]): string {
  const [activeSection, setActiveSection] = useState('');
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('');
      return;
    }
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, [pathname, sectionIds]);

  return activeSection;
}
