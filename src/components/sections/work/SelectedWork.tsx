import { getLocale, getTranslations } from 'next-intl/server';
import { getProjects } from '@/features/projects/queries';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SplitLines } from '@/components/ui/SplitLines';
import { ProjectCard } from './ProjectCard';
import { WorkStack } from './WorkStack';
import { ProjectIndex, type IndexItem } from './ProjectIndex';

export async function SelectedWork() {
  const [t, locale] = await Promise.all([getTranslations('work'), getLocale()]);
  const projects = getProjects(locale);
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const pad = (n: number) => String(n).padStart(2, '0');
  const indexItems: IndexItem[] = rest.map((p) => ({
    slug: p.slug,
    number: pad(p.index + 1),
    title: p.copy.title,
    category: p.copy.category,
    tagline: p.copy.tagline,
    meta: [t(`status.${p.status}`), p.year].filter(Boolean).join(' · '),
    cover: p.cover.src,
  }));

  return (
    <section id="work" aria-labelledby="work-title" className="relative scroll-mt-0 py-24 md:py-36">
      <div className="container-x">
        <div className="mb-14 grid gap-10 md:mb-24 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <SectionLabel index="02">{t('label')}</SectionLabel>
            <SplitLines id="work-title" lines={t.raw('title') as string[]} className="text-heading mt-8" lineClassName={(i) => (i === 1 ? 'md:pl-[12%] text-outline' : undefined)} />
          </div>
          <div className="md:col-span-4" data-reveal>
            <p className="label-mono mb-4 text-fg tabular-nums">{t('count', { count: projects.length })}</p>
            <p className="text-lead text-muted">{t('intro')}</p>
          </div>
        </div>

        <WorkStack>
          {featured.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              total={projects.length}
              labels={{ view: t('view'), cursor: t('cursor'), status: t(`status.${project.status}`), placeholder: t('placeholderBadge') }}
            />
          ))}
        </WorkStack>

        {rest.length > 0 && (
          <div className="mt-28 md:mt-44">
            <div className="mb-8 grid gap-6 md:mb-12 md:grid-cols-12 md:items-end">
              <h3 className="text-[clamp(2.25rem,5vw,5rem)] leading-[0.9] font-medium tracking-[-0.05em] uppercase md:col-span-7" data-reveal>
                {t('moreLabel')}
              </h3>
              <p className="text-muted md:col-span-4 md:col-start-9" data-reveal>
                {t('moreIntro')}
              </p>
            </div>
            <ProjectIndex items={indexItems} cursorLabel={t('cursor')} />
          </div>
        )}
      </div>
    </section>
  );
}
