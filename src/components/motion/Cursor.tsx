'use client';

import { AnimatePresence, m, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { QUERIES, useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * Contextual cursor for desktop pointers. It doesn't replace the system cursor
 * everywhere — it only appears over elements marked `data-cursor="Label"`
 * (project cards), where it turns into a "View" disc.
 */
export function Cursor() {
  const enabled = useMediaQuery(QUERIES.richPointer);
  if (!enabled) return null;
  return <CursorInner />;
}

function CursorInner() {
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 420, damping: 38, mass: 0.55 });
  const sy = useSpring(y, { stiffness: 420, damping: 38, mass: 0.55 });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('has-cursor');

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      x.set(event.clientX);
      y.set(event.clientY);
      const target = (event.target as Element | null)?.closest<HTMLElement>('[data-cursor]');
      setLabel(target?.dataset.cursor ?? null);
    };
    const onLeave = () => setLabel(null);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);
    return () => {
      root.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, [x, y]);

  return (
    <m.div aria-hidden className="pointer-events-none fixed top-0 left-0 z-[95]" style={{ x: sx, y: sy }}>
      <AnimatePresence>
        {label && (
          <m.div
            key="disc"
            className="absolute flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 rounded-full bg-white text-[0.8125rem] font-medium tracking-tight text-ink"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          >
            {label}
            <ArrowUpRight className="size-3.5" strokeWidth={1.75} />
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}
