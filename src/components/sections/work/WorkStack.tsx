'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/**
 * Desktop: each sticky card recedes (scales down and dims) as the next one
 * slides over it. All devices: covers drift slightly inside their frame.
 * Pure transforms/opacity, scrubbed to native scroll — no hijacking.
 */
export function WorkStack({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]');

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        cards.forEach((card) => {
          const media = card.querySelector('[data-cover-parallax]');
          if (media) {
            gsap.fromTo(media, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } });
          }
        });
      });

      mm.add('(min-width: 48rem) and (prefers-reduced-motion: no-preference)', () => {
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          const inner = card.querySelector('[data-card-inner]');
          const shade = card.querySelector('[data-card-shade]');
          const range = { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true };
          gsap.to(inner, { scale: 0.9, ease: 'none', scrollTrigger: range });
          if (shade) gsap.to(shade, { opacity: 0.65, ease: 'none', scrollTrigger: range });
        });
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="flex flex-col gap-16 md:gap-[18vh]">
      {children}
    </div>
  );
}
