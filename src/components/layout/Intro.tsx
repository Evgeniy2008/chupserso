'use client';

import { useEffect, useState } from 'react';

// Survives client-side navigations (module state), so the curtain plays once per page load.
let played = false;

/**
 * Opening curtain: a hairline draws across the screen while a counter runs to
 * 100, then the panel lifts. Pure CSS, so it starts before hydration; it never
 * blocks input (pointer-events: none) and is skipped for reduced motion and on
 * repeat visits within a session (see the inline script in the root layout).
 */
export function Intro({ label, wordmark }: { label: string; wordmark: string }) {
  const [show, setShow] = useState(() => !played);

  useEffect(() => {
    played = true;
    if (!show) return;
    // Leave the DOM once the hero choreography has finished, so later visits to
    // the home page (client navigation) don't wait for a curtain that's gone.
    const id = window.setTimeout(() => setShow(false), 4000);
    return () => window.clearTimeout(id);
  }, [show]);

  if (!show) return null;

  return (
    <div className="intro" aria-hidden>
      <div className="intro__line" />
      <div className="intro__meta label-mono">
        <span>
          {wordmark} — {label}
        </span>
        <span className="intro__count tabular-nums" />
      </div>
    </div>
  );
}
