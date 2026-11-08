'use client';

import { LazyMotion, MotionConfig, domAnimation } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Motion is used only for component-state transitions (menu, cursor, magnetic
 * springs). Scroll-driven choreography belongs to GSAP. `strict` keeps the
 * bundle lean by forbidding the full `motion.*` components.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8 }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
