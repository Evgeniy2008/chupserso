'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/**
 * A statement that "reads itself": words brighten one by one as the paragraph
 * moves through the viewport. Fully legible without JS and with reduced motion.
 */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const words = ref.current?.querySelectorAll('[data-word]');
        if (!words?.length) return;
        gsap.fromTo(
          words,
          { opacity: 0.5 }, // 50% white on ink ≈ #828282 — still AA-legible before it "lights up"
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.08,
            scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'bottom 50%', scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} data-word>
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}
