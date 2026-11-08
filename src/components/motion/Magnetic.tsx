'use client';

import { m, useMotionValue, useSpring } from 'motion/react';
import { useRef, type PointerEvent, type ReactNode } from 'react';
import { QUERIES, useMediaQuery } from '@/hooks/useMediaQuery';

interface MagneticProps {
  children: ReactNode;
  /** How far the element follows the pointer, as a fraction of the offset. */
  strength?: number;
  /** Defaults to `inline-flex`; pass your own display classes to override. */
  className?: string;
}

/** Pulls its child toward the pointer on fine-pointer devices; inert on touch. */
export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const enabled = useMediaQuery(QUERIES.richPointer);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.6 });

  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (!enabled || event.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.span ref={ref} className={className ?? 'inline-flex'} style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </m.span>
  );
}
