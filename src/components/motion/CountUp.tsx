'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

/**
 * Counts up to `value` the first time it scrolls into view. The server HTML
 * already holds the final number (no JS, reduced motion and screen readers all
 * get the real value); only the visual digits animate.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const target = Number.parseFloat(value);
  const decimals = value.includes('.') ? value.split('.')[1].length : 0;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || Number.isNaN(target)) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Already visible on load → leave it alone.
        if (el.getBoundingClientRect().top < window.innerHeight) return;
        const counter = { v: 0 };
        el.textContent = (0).toFixed(decimals);
        const tween = gsap.to(counter, {
          v: target,
          duration: 1.8,
          ease: 'expo.out',
          paused: true,
          onUpdate: () => {
            el.textContent = counter.v.toFixed(decimals);
          },
        });
        const st = ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => tween.play() });
        return () => {
          st.kill();
          tween.kill();
          el.textContent = value;
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <>
      <span ref={ref} aria-hidden className={className}>
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
