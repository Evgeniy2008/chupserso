'use client';

import { useRef, type CSSProperties } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { QUERIES, useMediaQuery } from '@/hooks/useMediaQuery';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SplitLines } from '@/components/ui/SplitLines';

export interface ProcessStep {
  title: string;
  description: string;
  deliverables: string[];
}

interface ProcessTimelineProps {
  label: string;
  title: string[];
  intro: string;
  deliverablesLabel: string;
  steps: ProcessStep[];
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Two compositions, one source of truth:
 *  • Desktop with motion → the section pins and the five steps travel
 *    horizontally with the scroll (native scroll distance, nothing hijacked).
 *  • Everything else (phones, tablets, reduced motion, no JS) → a vertical
 *    timeline whose line fills as you read.
 */
export function ProcessTimeline(props: ProcessTimelineProps) {
  const track = useMediaQuery(`${QUERIES.desktop} and ${QUERIES.motionOk}`);
  return track ? <HorizontalTrack {...props} /> : <VerticalTimeline {...props} />;
}

function Header({ label, title, intro, compact }: Pick<ProcessTimelineProps, 'label' | 'title' | 'intro'> & { compact?: boolean }) {
  return (
    <div className="container-x grid gap-8 md:grid-cols-12 md:items-end">
      <div className="md:col-span-7">
        <SectionLabel index="05">{label}</SectionLabel>
        <SplitLines id="process-title" lines={title} className={compact ? 'text-heading mt-8 text-[clamp(2.75rem,6.2vw,6.75rem)]' : 'text-heading mt-8'} />
      </div>
      <p className="text-lead max-w-[38ch] text-muted md:col-span-4 md:col-start-9" data-reveal>
        {intro}
      </p>
    </div>
  );
}

function Deliverables({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="label-mono mb-3 text-faint">{label}</p>
      <ul className="flex flex-wrap gap-2">
        {items.map((d) => (
          <li key={d} className="label-mono rounded-full border border-line px-3 py-1.5 text-[0.625rem] text-muted">
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

function VerticalTimeline({ label, title, intro, deliverablesLabel, steps }: ProcessTimelineProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(QUERIES.motionOk, () => {
        gsap.fromTo(
          '[data-fill]',
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-steps]', start: 'top 70%', end: 'bottom 70%', scrub: 0.5 } },
        );
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div ref={scope} className="py-24 md:py-36">
      <Header label={label} title={title} intro={intro} />
      <div className="container-x mt-16 md:mt-24">
        <ol data-steps className="relative">
          <span aria-hidden className="absolute top-0 bottom-0 left-[0.3125rem] w-px bg-line md:left-[calc(25%-0.5px)]" />
          <span aria-hidden data-fill className="absolute top-0 bottom-0 left-[0.3125rem] w-px origin-top bg-fg md:left-[calc(25%-0.5px)]" />
          {steps.map((step, i) => (
            <li key={step.title} className="relative grid gap-5 pb-14 pl-10 md:grid-cols-12 md:gap-8 md:pb-20 md:pl-0" data-reveal>
              <span aria-hidden className="absolute top-2 left-0 size-[0.6875rem] rounded-full border border-fg bg-ink md:left-[calc(25%-0.34375rem)]" />
              <span className="text-outline text-[clamp(3.5rem,9vw,7rem)] leading-[0.8] font-medium tracking-[-0.05em] md:col-span-3" aria-hidden>
                {pad(i + 1)}
              </span>
              <div className="md:col-span-8 md:col-start-5">
                <h3 className="text-[clamp(1.75rem,3.6vw,3rem)] leading-none font-medium tracking-[-0.045em]">
                  <span className="sr-only">{pad(i + 1)}. </span>
                  {step.title}
                </h3>
                <p className="mt-4 max-w-[48ch] leading-relaxed text-muted">{step.description}</p>
                <div className="mt-6">
                  <Deliverables label={deliverablesLabel} items={step.deliverables} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function HorizontalTrack({ label, title, intro, deliverablesLabel, steps }: ProcessTimelineProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      const rail = root?.querySelector<HTMLElement>('[data-rail]');
      if (!root || !rail) return;

      const distance = () => Math.max(0, rail.scrollWidth - document.documentElement.clientWidth);
      const range = { trigger: root, start: 'top top', end: () => `+=${distance()}`, scrub: 0.7, invalidateOnRefresh: true };

      const travel = gsap.to(rail, { x: () => -distance(), ease: 'none', scrollTrigger: { ...range, pin: true, anticipatePin: 1 } });
      gsap.fromTo('[data-progress]', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: range });

      gsap.utils.toArray<HTMLElement>('[data-panel]').forEach((panel) => {
        const num = panel.querySelector('[data-num]');
        const body = panel.querySelector('[data-body]');
        const st = { trigger: panel, containerAnimation: travel, start: 'left 85%', end: 'left 40%', scrub: true };
        if (num) gsap.fromTo(num, { opacity: 0.25, x: 40 }, { opacity: 1, x: 0, ease: 'none', scrollTrigger: st });
        // Text keeps full contrast at all times — only the decorative numerals dim.
        if (body) gsap.fromTo(body, { x: 28 }, { x: 0, ease: 'none', scrollTrigger: st });
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="flex h-svh flex-col justify-center gap-[4.5vh] overflow-clip pt-[var(--header-h)]">
      <Header label={label} title={title} intro={intro} compact />

      <div className="container-x">
        <div className="relative h-px bg-line">
          <span aria-hidden data-progress className="absolute inset-0 origin-left bg-fg" />
        </div>
      </div>

      <ol data-rail className="flex w-max gap-[2vw] pr-[var(--gutter)] pl-[max(var(--gutter),calc((100vw-var(--max-w))/2+var(--gutter)))]">
        {steps.map((step, i) => (
          <li
            key={step.title}
            data-panel
            className="relative flex h-[min(44vh,28rem)] w-[clamp(22rem,31vw,32rem)] flex-col border-l border-line pr-8 pl-8"
            style={{ '--i': i } as CSSProperties}
          >
            <span aria-hidden className="absolute top-0 -left-[0.34375rem] size-[0.6875rem] rounded-full border border-fg bg-ink" />
            <span data-num aria-hidden className="text-outline block text-[clamp(5rem,9vw,10rem)] leading-[0.8] font-medium tracking-[-0.06em]">
              {pad(i + 1)}
            </span>
            <div data-body className="mt-[clamp(1.5rem,6vh,4.5rem)]">
              <h3 className="text-[clamp(2rem,2.8vw,3rem)] leading-none font-medium tracking-[-0.045em]">
                <span className="sr-only">{pad(i + 1)}. </span>
                {step.title}
              </h3>
              <p className="mt-4 max-w-[40ch] leading-relaxed text-muted">{step.description}</p>
              <div className="mt-6">
                <Deliverables label={deliverablesLabel} items={step.deliverables} />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
