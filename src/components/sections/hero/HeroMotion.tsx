'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

/**
 * Scroll + pointer choreography for the hero (GSAP).
 *  • [data-depth="n"]  headline lines drift apart at different speeds (layered parallax)
 *  • [data-hero-bg]    the light field sinks and dims as the hero leaves
 *  • [data-hero-fade]  secondary content fades out early
 *  • [data-pointer]    subtle depth shift following the mouse (desktop only)
 */
export function HeroMotion({ children, className }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const section = root.closest('section') ?? root;
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const scrub = { trigger: section, start: 'top top', end: 'bottom top', scrub: true } satisfies ScrollTrigger.Vars;

        root.querySelectorAll<HTMLElement>('[data-depth]').forEach((line) => {
          const depth = Number(line.dataset.depth ?? 0);
          gsap.to(line, { yPercent: -18 - depth * 22, ease: 'none', scrollTrigger: scrub });
        });

        gsap.to(root.querySelectorAll('[data-hero-fade]'), { autoAlpha: 0, y: -40, ease: 'none', scrollTrigger: { ...scrub, end: '45% top' } });

        const bg = section.querySelector('[data-hero-bg]');
        if (bg) gsap.to(bg, { yPercent: 18, scale: 1.08, autoAlpha: 0.25, ease: 'none', scrollTrigger: scrub });
      });

      mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-pointer]')).map((el) => {
          const depth = Number(el.dataset.pointer ?? 1);
          return {
            depth,
            x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3.out' }),
            y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3.out' }),
          };
        });
        const onMove = (event: PointerEvent) => {
          const nx = event.clientX / window.innerWidth - 0.5;
          const ny = event.clientY / window.innerHeight - 0.5;
          for (const layer of layers) {
            layer.x(nx * layer.depth * 14);
            layer.y(ny * layer.depth * 8);
          }
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
