'use client';

import type Lenis from 'lenis';

/** Single Lenis instance shared by the app (null on touch devices / reduced motion). */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Smoothly scrolls to an in-page target and moves focus there for keyboard and
 * screen-reader users. Works with and without Lenis.
 */
export function scrollToTarget(target: string | HTMLElement, { focus = true }: { focus?: boolean } = {}) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  const headerOffset = el.id === 'top' ? 0 : -8;

  const done = () => {
    if (!focus) return;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: headerOffset, duration: 1.4, onComplete: done });
    return;
  }
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  window.setTimeout(done, prefersReducedMotion() ? 0 : 700);
}
