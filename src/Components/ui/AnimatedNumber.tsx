import React, { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';

interface AnimatedNumberProps {
  value: number;
  format?: (value: number) => string;
  className?: string;
  duration?: number;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  format,
  className,
  duration = 1.8,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!ref.current || !inView) return;
    const node = ref.current;

    if (reduce) {
      node.textContent = format ? format(value) : Math.round(value).toString();
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = format ? format(latest) : Math.round(latest).toString();
      },
    });

    return () => controls.stop();
  }, [inView, value, format, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {format ? format(0) : '0'}
    </span>
  );
};
