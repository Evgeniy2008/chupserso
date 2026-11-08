import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { isLocale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/config/site';
import { getNextProject, getProject, getProjectSlugs, getProjects } from '@/features/projects/queries';
import { absoluteUrl, jsonLdString, pageMetadata } from '@/lib/seo';
import { fitFontSize } from '@/lib/fit';
import { ButtonLink } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Parallax } from '@/components/motion/Parallax';
import { ScrollWords } from '@/components/sections/ScrollWords';
import { Roll } from '@/components/ui/Roll';

/**
 * Every case study is prerendered (generateStaticParams), and links to them use
 * per-link prefetching (`prefetch`), so navigations arrive with the page ready.
 * The segment reads `params` at the top level by design — opt out of the
 * dev-time instant-shell validation rather than adding an empty Suspense shell.
 */
export const instant = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/[locale]/work/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = getProject(slug, locale);
  if (!project) return {};
  const t = await getTranslations({ locale, namespace: 'caseStudy' });
  return pageMetadata({
    locale,
    path: `/work/${slug}`,
    title: t('metaTitle', { title: project.copy.title }),
    description: `${project.copy.tagline} ${project.copy.summary}`,
    ogType: 'article',
  });
}

const pad = (n: number) => String(n).padStart(2, '0');

export default async function CaseStudyPage({ params }: PageProps<'/[locale]/work/[slug]'>) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const project = getProject(slug, locale);
  if (!project) notFound();

  const [t, work, a11y] = await Promise.all([getTranslations('caseStudy'), getTranslations('work'), getTranslations('a11y')]);
  const next = getNextProject(slug, locale);
  const total = getProjects(locale).length;
  const { copy } = project;
  const isDev = process.env.NODE_ENV === 'development';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: copy.title,
    headline: copy.tagline,
    description: copy.summary,
    url: absoluteUrl(`/work/${slug}`, locale),
    inLanguage: locale,
    ...(project.year ? { dateCreated: project.year } : {}),
    ...(project.stack.length ? { keywords: project.stack.join(', ') } : {}),
    author: { '@type': 'Person', '@id': `${siteConfig.url}/#person`, name: siteConfig.name },
    ...(project.links.live ? { sameAs: project.links.live } : {}),
  };

  const meta = [
    ...(project.year ? [{ label: work('year'), value: project.year }] : []),
    { label: work('role'), value: copy.role },
    { label: t('status'), value: work(`status.${project.status}`) },
  ];

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />

      {/* ── Intro ───────────────────────────────────────── */}
      <header className="container-x pt-[calc(var(--header-h)+var(--safe-top)+2rem)] md:pt-[calc(var(--header-h)+4rem)]">
        <div className="page-enter flex items-center justify-between gap-6 border-b border-line pb-5">
          <Link href={{ pathname: '/', hash: 'work' }} className="group flex items-center gap-3 text-sm text-muted transition-colors duration-500 hover:text-fg">
            <ArrowLeft aria-hidden className="size-4 transition-transform duration-500 group-hover:-translate-x-1" strokeWidth={1.5} />
            <Roll>{t('back')}</Roll>
          </Link>
          <span className="label-mono text-faint tabular-nums">
            {pad(project.index + 1)} / {pad(total)}
          </span>
        </div>

        <p className="label-mono page-enter mt-12 text-muted md:mt-20" style={{ '--d': 100 } as CSSProperties}>
          {copy.category}
        </p>
        <div className="mt-5 [container-type:inline-size]">
          <h1 className="text-display" style={{ fontSize: fitFontSize([copy.title], { fill: 1, maxRem: 22 }) }}>
            <span className="mask">
              <span className="page-rise">{copy.title}</span>
            </span>
          </h1>
        </div>

        <div className="mt-10 grid gap-10 pb-14 md:mt-14 md:grid-cols-12 md:pb-20">
          <p className="page-enter text-[clamp(1.375rem,2.4vw,2.25rem)] leading-[1.15] tracking-[-0.03em] text-balance md:col-span-6" style={{ '--d': 250 } as CSSProperties}>
            {copy.tagline}
          </p>
          <div className="page-enter md:col-span-5 md:col-start-8" style={{ '--d': 350 } as CSSProperties}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
              {meta.map((m) => (
                <div key={m.label} className="border-t border-line pt-3">
                  <dt className="label-mono text-faint">{m.label}</dt>
                  <dd className="mt-2 text-[0.9375rem] text-fg">{m.value}</dd>
                </div>
              ))}
              {project.stack.length > 0 && (
              <div className="col-span-2 border-t border-line pt-3">
                <dt className="label-mono text-faint">{work('stack')}</dt>
                <dd className="mt-3">
                  <ul className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <li key={tech} className="label-mono rounded-full border border-line px-3 py-1.5 text-[0.625rem] text-muted">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              )}
            </dl>
            {(project.links.live || project.links.repo) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {project.links.live && <ButtonLink href={project.links.live} label={t('visit')} icon="external" externalLabel={a11y('externalLink')} />}
                {project.links.repo && <ButtonLink href={project.links.repo} label={t('source')} icon="external" variant="ghost" externalLabel={a11y('externalLink')} />}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Cover ───────────────────────────────────────── */}
      <figure className="container-x page-enter" style={{ '--d': 450 } as CSSProperties}>
        <div className="relative aspect-[4/5] overflow-clip rounded-[clamp(0.75rem,1.4vw,1.25rem)] border border-line bg-surface sm:aspect-[16/10]">
          <Parallax amount={14} scaleFrom={1.08} className="absolute inset-x-0 -top-[8%] -bottom-[8%]">
            <Image src={project.cover.src} alt={copy.coverAlt} fill priority sizes="(min-width: 120rem) 1800px, 100vw" unoptimized={project.cover.src.endsWith('.svg')} className="object-cover" style={{ objectPosition: project.cover.position ?? 'center top' }} />
          </Parallax>
          {isDev && project.cover.placeholder && (
            <span className="label-mono absolute top-4 right-4 rounded-full border border-dashed border-white/40 bg-ink/60 px-2.5 py-1 text-[0.625rem] text-muted">{work('placeholderBadge')}</span>
          )}
        </div>
      </figure>

      {/* ── Overview ───────────────────────────────────── */}
      <section aria-labelledby="overview" className="container-x py-24 md:py-40">
        <SectionLabel index="01">{t('overview')}</SectionLabel>
        <h2 id="overview" className="sr-only">
          {t('overview')}
        </h2>
        <ScrollWords text={copy.summary} className="mt-10 max-w-[26ch] text-[clamp(1.875rem,4.6vw,4.75rem)] leading-[1.04] font-medium tracking-[-0.045em] text-balance md:mt-14" />
      </section>

      {/* ── Challenge / Approach ───────────────────────── */}
      <section className="container-x grid gap-16 border-t border-line pt-16 pb-24 md:grid-cols-12 md:gap-8 md:pt-24 md:pb-40">
        {[
          { id: 'challenge', label: t('challenge'), text: copy.challenge, index: '02' },
          { id: 'approach', label: t('approach'), text: copy.approach, index: '03' },
        ].map((block, i) => (
          <div key={block.id} className={i === 0 ? 'md:col-span-5' : 'md:col-span-6 md:col-start-7'} data-reveal>
            <SectionLabel index={block.index}>{block.label}</SectionLabel>
            <h2 className="sr-only">{block.label}</h2>
            <p className={i === 0 ? 'text-lead mt-8 text-fg' : 'text-lead mt-8 text-muted'}>{block.text}</p>
          </div>
        ))}
      </section>

      {/* ── Highlights ─────────────────────────────────── */}
      {copy.highlights.length > 0 && (
        <section aria-labelledby="highlights" className="container-x pb-24 md:pb-40">
          <div className="flex items-end justify-between gap-6 border-b border-line pb-6">
            <h2 id="highlights" className="text-heading text-[clamp(2.25rem,5.4vw,5.5rem)]" data-reveal>
              {t('highlights')}
            </h2>
            <span className="label-mono text-faint tabular-nums">{pad(copy.highlights.length)}</span>
          </div>
          <ul className="grid md:grid-cols-2">
            {copy.highlights.map((h, i) => (
              <li key={h.title} data-reveal className="border-b border-line py-10 md:px-10 md:py-14 md:odd:border-r md:odd:pl-0 md:even:pr-0">
                <span className="label-mono text-faint tabular-nums">{pad(i + 1)}</span>
                <h3 className="mt-8 text-[clamp(1.5rem,2.4vw,2.25rem)] leading-tight font-medium tracking-[-0.04em]">{h.title}</h3>
                <p className="mt-3 max-w-[46ch] leading-relaxed text-muted">{h.text}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Gallery ────────────────────────────────────── */}
      {project.gallery.length > 0 && (
        <section aria-label={t('gallery')} className="container-x grid gap-4 pb-24 md:grid-cols-12 md:gap-6 md:pb-40">
          {project.gallery.map((media, i) => (
            <figure
              key={media.src}
              data-reveal="clip"
              className={
                project.gallery.length === 1
                  ? 'relative aspect-[4/3] overflow-clip rounded-[clamp(0.75rem,1.2vw,1rem)] border border-line bg-surface md:col-span-10 md:col-start-2 md:aspect-[16/10]'
                  : i % 2 === 0
                  ? 'relative aspect-[4/3] overflow-clip rounded-[clamp(0.75rem,1.2vw,1rem)] border border-line bg-surface md:col-span-7'
                  : 'relative aspect-[4/3] overflow-clip rounded-[clamp(0.75rem,1.2vw,1rem)] border border-line bg-surface md:col-span-5 md:mt-[20%]'
              }
            >
              <Parallax amount={10} className="absolute inset-x-0 -top-[6%] -bottom-[6%]">
                <Image
                  src={media.src}
                  alt={t('galleryAlt', { title: copy.title, index: i + 1 })}
                  fill
                  sizes="(min-width: 48rem) 60vw, 100vw"
                  unoptimized={media.src.endsWith('.svg')}
                  className="object-cover"
                />
              </Parallax>
            </figure>
          ))}
        </section>
      )}

      {/* ── Outcome ────────────────────────────────────── */}
      <section aria-labelledby="outcome" className="container-x border-t border-line pt-16 pb-24 md:pt-24 md:pb-40">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionLabel index="04">{t('outcome')}</SectionLabel>
            <h2 id="outcome" className="sr-only">
              {t('outcome')}
            </h2>
          </div>
          <p className="text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.15] tracking-[-0.035em] text-balance md:col-span-8" data-reveal>
            {copy.outcome}
          </p>
        </div>
      </section>

      {/* ── Next project ───────────────────────────────── */}
      {next && (
        <nav aria-label={t('next')} className="border-t border-line">
          <Link href={`/work/${next.slug}`} prefetch data-cursor={work('cursor')} className="group container-x relative block overflow-clip py-16 md:py-28">
            <p className="label-mono text-muted">{t('next')}</p>
            <div className="mt-6 flex items-end justify-between gap-6 [container-type:inline-size]">
              <span className="text-display transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4" style={{ fontSize: fitFontSize([next.copy.title], { fill: 0.82, maxRem: 16 }) }}>
                {next.copy.title}
              </span>
              <span className="mb-[1.5cqw] flex size-14 shrink-0 items-center justify-center rounded-full bg-fg text-ink transition-transform duration-700 group-hover:rotate-45 md:size-20">
                <ArrowUpRight aria-hidden className="size-6" strokeWidth={1.5} />
              </span>
            </div>
            <p className="mt-6 max-w-[48ch] text-muted">{next.copy.tagline}</p>
          </Link>
        </nav>
      )}
    </article>
  );
}
