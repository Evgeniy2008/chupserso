'use client';

import Image from 'next/image';
import { AnimatePresence, m, useMotionValue, useSpring } from 'motion/react';
import { useState, type PointerEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { QUERIES, useMediaQuery } from '@/hooks/useMediaQuery';

export interface IndexItem {
  slug: string;
  number: string;
  title: string;
  category: string;
  tagline: string;
  meta: string;
  cover: string;
}

/**
 * Compact editorial index for the remaining projects. On desktop a preview of
 * the hovered project floats next to the pointer (spring-follow); on touch
 * devices each row simply shows its one-line description.
 */
export function ProjectIndex({ items, cursorLabel }: { items: IndexItem[]; cursorLabel: string }) {
  const rich = useMediaQuery(QUERIES.richPointer);
  const [active, setActive] = useState<string | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

  const onMove = (event: PointerEvent<HTMLUListElement>) => {
    if (!rich) return;
    x.set(event.clientX);
    y.set(event.clientY);
  };

  return (
    <div className="relative">
      <ul className="border-t border-line" onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
        {items.map((item) => (
          <li key={item.slug} data-reveal className="border-b border-line">
            <Link
              href={`/work/${item.slug}`}
              prefetch
              onPointerEnter={() => setActive(item.slug)}
              onFocus={() => setActive(null)}
              className="index-row group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 md:grid-cols-[4rem_1.2fr_1fr_10rem_auto] md:py-8"
            >
              <span className="label-mono text-faint tabular-nums">{item.number}</span>
              <span className="min-w-0">
                <span className="index-title block text-[clamp(1.75rem,4.2vw,4rem)] leading-none font-medium tracking-[-0.05em] uppercase transition-[transform,color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  {item.title}
                </span>
                <span className="mt-2 block text-sm text-muted md:hidden">{item.tagline}</span>
              </span>
              <span className="hidden text-muted md:block">{item.category}</span>
              <span className="label-mono hidden text-faint md:block">{item.meta}</span>
              <span className="flex size-11 items-center justify-center rounded-full border border-line-strong transition-[transform,background-color,color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-hover:bg-fg group-hover:text-ink">
                <ArrowUpRight aria-hidden className="size-5" strokeWidth={1.5} />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {rich && (
        <m.div aria-hidden className="pointer-events-none fixed top-0 left-0 z-30" style={{ x: sx, y: sy }}>
          <AnimatePresence>
            {active && (
              <m.div
                key="preview"
                className="absolute h-[13.5rem] w-[21.5rem] -translate-x-1/2 -translate-y-[115%] overflow-clip rounded-xl border border-line-strong bg-surface shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]"
                initial={{ opacity: 0, scale: 0.85, clipPath: 'inset(50% 0 50% 0)' }}
                animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0 0% 0)' }}
                exit={{ opacity: 0, scale: 0.9, clipPath: 'inset(50% 0 50% 0)' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {items.map((item) => (
                  <Image
                    key={item.slug}
                    src={item.cover}
                    alt=""
                    fill
                    sizes="344px"
                    unoptimized={item.cover.endsWith('.svg')}
                    className="object-cover transition-opacity duration-500"
                    style={{ opacity: item.slug === active ? 1 : 0 }}
                  />
                ))}
                <span className="label-mono absolute bottom-3 left-3 rounded-full bg-fg px-2.5 py-1 text-ink">{cursorLabel}</span>
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      )}
    </div>
  );
}
