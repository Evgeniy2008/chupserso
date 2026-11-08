import Image from 'next/image';
import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { LocalizedProject } from '@/features/projects/types';

interface ProjectCardProps {
  project: LocalizedProject;
  total: number;
  labels: { view: string; cursor: string; status: string; placeholder: string };
  priority?: boolean;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Immersive project card. The whole card is one link (one tab stop). On
 * desktop cards stick and stack while scrolling (see WorkStack); on phones they
 * simply flow.
 */
export function ProjectCard({ project, total, labels, priority }: ProjectCardProps) {
  const { copy, cover } = project;
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <article
      data-card
      aria-labelledby={`project-${project.slug}`}
      className="project-card md:sticky md:top-[calc(var(--header-h)+1.25rem+var(--stack-i)*0.9rem)]"
      style={{ '--stack-i': project.index } as CSSProperties}
    >
      <div data-card-inner className="origin-top will-change-transform">
        <Link
          href={`/work/${project.slug}`}
          prefetch
          data-cursor={labels.cursor}
          className="group relative block overflow-clip rounded-[clamp(0.75rem,1.4vw,1.25rem)] border border-line bg-surface"
        >
          {/* Cover */}
          <div data-reveal="clip" className="relative aspect-[4/5] overflow-clip sm:aspect-[4/3] md:aspect-auto md:h-[calc(100svh-var(--header-h)-6.5rem)] md:max-h-[58rem] md:min-h-[32rem]">
            <div data-cover-parallax className="absolute inset-x-0 -top-[8%] -bottom-[8%]">
              <Image
                src={cover.src}
                alt={copy.coverAlt}
                fill
                priority={priority}
                sizes="(min-width: 120rem) 1800px, 100vw"
                unoptimized={cover.src.endsWith('.svg')}
                className={cover.src.endsWith('.svg') ? 'project-cover-img object-cover' : 'project-cover-img is-photo object-cover'}
                style={{ objectPosition: cover.position ?? 'center top' }}
              />
            </div>
            <div data-card-shade aria-hidden className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
            <div aria-hidden className="absolute inset-x-0 top-0 h-3/5 bg-gradient-to-b from-ink/85 via-ink/35 to-transparent" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
          </div>

          {/* Top: index, status, then the title — the part that stays visible while cards stack */}
          <div className="absolute inset-x-0 top-0 p-5 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <span className="label-mono text-fg tabular-nums">
                {pad(project.index + 1)} <span className="text-faint">/ {pad(total)}</span>
              </span>
              <div className="flex flex-wrap items-center justify-end gap-2">
                {isDev && cover.placeholder && (
                  <span className="label-mono hidden rounded-full border border-dashed border-white/40 px-2.5 py-1 text-[0.625rem] text-muted sm:inline">{labels.placeholder}</span>
                )}
                <span className="label-mono rounded-full border border-line-strong bg-ink/40 px-3 py-1.5 text-fg backdrop-blur-sm">{labels.status}</span>
                {project.year && (
                  <span className="label-mono hidden rounded-full border border-line-strong bg-ink/40 px-3 py-1.5 text-muted backdrop-blur-sm sm:inline">{project.year}</span>
                )}
              </div>
            </div>
            <p className="label-mono mt-8 text-muted md:mt-10">{copy.category}</p>
            <h3 id={`project-${project.slug}`} className="mt-3 text-[clamp(2.6rem,8vw,9rem)] leading-[0.85] font-medium tracking-[-0.055em] uppercase md:mt-4">
              {copy.title}
            </h3>
          </div>

          {/* Bottom: one-line pitch, stack and the call to action */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-5 md:p-8">
            <div className="max-w-[46ch]">
              <p className="text-[0.9375rem] leading-relaxed text-fg/85 md:text-base">{copy.tagline}</p>
              {project.stack.length > 0 && (
              <ul className="mt-3 hidden flex-wrap gap-x-4 gap-y-1 md:flex">
                {project.stack.slice(0, 5).map((tech) => (
                  <li key={tech} className="label-mono text-faint">
                    {tech}
                  </li>
                ))}
              </ul>
              )}
            </div>
            <span className="flex shrink-0 items-center gap-3">
              <span className="label-mono hidden text-fg lg:inline">{labels.view}</span>
              <span className="project-arrow flex size-12 items-center justify-center rounded-full bg-fg text-ink md:size-14">
                <ArrowUpRight aria-hidden className="size-5" strokeWidth={1.5} />
              </span>
            </span>
          </div>
        </Link>

        {/* Stack — below the card on phones */}
        {project.stack.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 px-1 md:hidden">
          {project.stack.slice(0, 5).map((tech) => (
            <li key={tech} className="label-mono text-faint">
              {tech}
            </li>
          ))}
        </ul>
        )}
      </div>
    </article>
  );
}
