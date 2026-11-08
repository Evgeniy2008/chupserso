'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { QUERIES } from '@/hooks/useMediaQuery';

const SELECTOR = '[data-reveal]:not(.is-in)';

/**
 * One observer for every `[data-reveal]` element on the page.
 *
 * Content is fully visible in the server HTML. Only after hydration — and only
 * when motion is allowed — do below-the-fold elements get hidden and revealed
 * as they enter the viewport. If JavaScript fails, nothing is ever hidden.
 * Elements mounted later (client navigation, responsive re-renders) are picked
 * up by a MutationObserver.
 *
 * Variants (CSS in globals.css): default (rise), "fade", "lines", "line", "clip".
 */
export function MotionDirector() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia(QUERIES.reducedMotion).matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        let order = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          if (!el.style.getPropertyValue('--reveal-delay')) {
            el.style.setProperty('--reveal-delay', String(order * 90));
            order += 1;
          }
          el.classList.add('is-in');
          io.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );

    const register = (elements: HTMLElement[]) => {
      const viewport = window.innerHeight;
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        // Already on screen → stays as it is (no hide-then-show flash).
        if (rect.top < viewport * 0.94 && rect.bottom > 0) el.classList.add('is-in');
        else io.observe(el);
      }
    };

    register(Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)));
    document.documentElement.classList.add('motion-ready');

    const mo = new MutationObserver((mutations) => {
      const added: HTMLElement[] = [];
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(SELECTOR)) added.push(node);
          added.push(...node.querySelectorAll<HTMLElement>(SELECTOR));
        });
      }
      if (added.length) register(added);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
