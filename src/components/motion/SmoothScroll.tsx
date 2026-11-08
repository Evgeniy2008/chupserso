'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { setLenis } from '@/lib/smooth';
import { QUERIES } from '@/hooks/useMediaQuery';

/**
 * Lenis smoothing for mouse/trackpad only. Touch devices keep native momentum
 * scrolling, and reduced-motion users get the browser default. Lenis drives the
 * real window scroll, so anchors, find-in-page and the scrollbar keep working.
 */
export function SmoothScroll() {
  useEffect(() => {
    const enabled = window.matchMedia(QUERIES.richPointer).matches;
    if (!enabled) return;

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, autoRaf: false, stopInertiaOnNavigate: true });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
