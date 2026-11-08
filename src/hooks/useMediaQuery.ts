'use client';

import { useSyncExternalStore } from 'react';

/**
 * Subscribes to a media query. Renders `serverValue` during SSR and hydration,
 * then switches to the real value — without setState-in-effect flicker logic.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const QUERIES = {
  finePointer: '(hover: hover) and (pointer: fine)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  motionOk: '(prefers-reduced-motion: no-preference)',
  desktop: '(min-width: 64rem)',
  richPointer: '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
} as const;
