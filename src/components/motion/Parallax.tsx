'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/cn';

interface ParallaxProps {
  children: ReactNode;
  /** Total drift in percent of the element's own height (positive = moves down while scrolling). */
  amount?: number;
  /** Optional scale-down from this value to 1 while entering. */
  scaleFrom?: number;
  className?: string;
}

/** Generic scrubbed parallax for media. The wrapper should clip (overflow-clip). */
export function Parallax({ children, amount = 12, scaleFrom, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const frame = el?.parentElement;
      if (!el || !frame) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          el,
          { yPercent: -amount / 2, scale: scaleFrom ?? 1 },
          { yPercent: amount / 2, scale: 1, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [amount, scaleFrom] },
  );

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  );
}
