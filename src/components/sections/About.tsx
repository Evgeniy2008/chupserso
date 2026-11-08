import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { contactHref, siteConfig } from '@/config/site';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SmartLink } from '@/components/ui/SmartLink';
import { Parallax } from '@/components/motion/Parallax';
import { CountUp } from '@/components/motion/CountUp';
import { ScrollWords } from './ScrollWords';

interface Principle {
  title: string;
  text: string;
}
interface Stat {
  value: string;
  suffix?: string;
  label: string;
}
interface ExperienceItem {
  title: string;
  meta: string;
  role: string;
  text: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

export async function About() {
  const [t, a11y, locale] = await Promise.all([getTranslations('about'), getTranslations('a11y'), getLocale()]);
  const paragraphs = t.raw('paragraphs') as string[];
  const principles = t.raw('principles') as Principle[];
  const stats = t.raw('stats') as Stat[];
  const experience = t.raw('experience') as ExperienceItem[];
  const name = siteConfig.displayName[locale];

  const profiles = (['upwork', 'freelancehunt'] as const).flatMap((key) => {
    const href = contactHref(key);
    return href ? [{ key, href }] : [];
  });

  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-clip py-24 md:py-40">
      {/* Soft cool light behind the statement */}
      <div aria-hidden className="pointer-events-none absolute top-[10%] right-[-20%] -z-10 h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(closest-side,rgb(201_206_214/0.07),transparent)]" />

      <div className="container-x">
        <SectionLabel index="04">{t('label')}</SectionLabel>
        <h2 id="about-title" className="sr-only">
          {t('label')}
        </h2>

        {/* ── Portrait + statement ─────────────────────────────── */}
        <div className="mt-10 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-8">
          {siteConfig.portrait && (
            <figure className="md:col-span-5 lg:col-span-4">
              <div
                data-reveal="clip"
                className="portrait group relative aspect-[4/5] overflow-clip rounded-[clamp(0.75rem,1.4vw,1.25rem)] border border-line bg-surface"
              >
                <Parallax amount={10} scaleFrom={1.1} className="absolute inset-x-0 -top-[6%] -bottom-[6%]">
                  <Image
                    src={siteConfig.portrait.src}
                    alt={a11y('portrait', { name })}
                    fill
                    sizes="(min-width: 64rem) 34vw, (min-width: 48rem) 42vw, 100vw"
                    className="portrait-img object-cover object-[50%_18%]"
                  />
                </Parallax>
                <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgb(0_0_0/0.45)]" />
                <span aria-hidden className="label-mono absolute top-4 right-4 hidden rounded-full border border-line-strong bg-ink/40 px-3 py-1.5 text-muted backdrop-blur-sm [@media(hover:hover)]:inline">
                  {t('colorHint')}
                </span>
              </div>
              <figcaption className="mt-5 flex flex-col gap-2" data-reveal="fade">
                <span className="text-xl font-medium tracking-[-0.03em]">{name}</span>
                <span className="label-mono text-muted">{t('role')}</span>
              </figcaption>
            </figure>
          )}

          <div className="md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
            <ScrollWords text={t('statement')} className="text-[clamp(1.75rem,3.7vw,3.9rem)] leading-[1.05] font-medium tracking-[-0.045em] text-balance" />
            <div className="mt-12 grid gap-8 sm:grid-cols-2 md:mt-16">
              {paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? 'text-lead text-fg' : 'text-lead text-muted'} data-reveal>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* ── Numbers ──────────────────────────────────────────── */}
        <div className="mt-24 md:mt-36">
          <h3 className="label-mono mb-6 text-fg" data-reveal="fade">
            {t('statsLabel')}
          </h3>
          <dl className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                data-reveal
                className="flex flex-col-reverse justify-end gap-4 border-b border-line py-8 odd:border-r odd:pr-4 even:pl-4 sm:py-10 sm:even:pl-6 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
              >
                <dt className="max-w-[16ch] text-[0.9375rem] leading-snug text-muted">{stat.label}</dt>
                <dd className="flex items-baseline gap-1 text-[clamp(3.25rem,8vw,7.5rem)] leading-[0.85] font-medium tracking-[-0.06em] tabular-nums">
                  <CountUp value={stat.value} />
                  {stat.suffix && <span className="text-[0.3em] tracking-[-0.02em] text-faint">{stat.suffix}</span>}
                </dd>
                <span aria-hidden className="label-mono text-faint">
                  {pad(i + 1)}
                </span>
              </div>
            ))}
          </dl>
        </div>

        {/* ── Experience ───────────────────────────────────────── */}
        <div className="mt-24 md:mt-36">
          <div className="flex items-center justify-between border-b border-line pb-4" data-reveal="fade">
            <h3 className="label-mono text-fg">{t('experienceLabel')}</h3>
            <span className="label-mono text-faint tabular-nums">{pad(experience.length)}</span>
          </div>
          <ol>
            {experience.map((item) => (
              <li key={item.title} data-reveal className="grid gap-4 border-b border-line py-8 md:grid-cols-12 md:gap-8 md:py-12">
                <div className="md:col-span-4">
                  <h4 className="text-[clamp(1.5rem,2.6vw,2.5rem)] leading-none font-medium tracking-[-0.045em]">{item.title}</h4>
                  <p className="label-mono mt-3 text-muted">{item.meta}</p>
                </div>
                <p className="text-fg md:col-span-3">{item.role}</p>
                <p className="leading-relaxed text-muted md:col-span-5">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* ── Freelance profiles ───────────────────────────────── */}
        {profiles.length > 0 && (
          <div className="mt-24 md:mt-36">
            <h3 className="label-mono mb-6 text-fg" data-reveal="fade">
              {t('profilesLabel')}
            </h3>
            <ul className="grid gap-4 md:grid-cols-2">
              {profiles.map(({ key, href }) => {
                const badge = key === 'freelancehunt' ? t('profiles.freelancehunt.badge') : null;
                return (
                  <li key={key} data-reveal>
                    <SmartLink
                      href={href}
                      externalLabel={a11y('externalLink')}
                      className="profile-card group relative isolate flex h-full min-h-64 flex-col justify-between overflow-clip rounded-[clamp(0.75rem,1.4vw,1.25rem)] border border-line bg-surface/60 p-6 md:p-8"
                    >
                      <span aria-hidden className="profile-fill absolute inset-0 -z-10 bg-fg" />
                      <div className="flex items-start justify-between gap-6">
                        <span className="profile-text text-[clamp(2.25rem,4.4vw,4rem)] leading-none font-medium tracking-[-0.05em] transition-colors duration-500">
                          {t(`profiles.${key}.title`)}
                        </span>
                        <span className="profile-arrow flex size-12 shrink-0 items-center justify-center rounded-full border border-line-strong transition-colors duration-500">
                          <ArrowUpRight aria-hidden className="size-5" strokeWidth={1.5} />
                        </span>
                      </div>
                      <div className="mt-10">
                        {badge && (
                          <p className="profile-text mb-3 flex items-center gap-2 text-lg font-medium tracking-[-0.02em] transition-colors duration-500">
                            <span aria-hidden className="flex gap-0.5">
                              {Array.from({ length: 5 }, (_, i) => (
                                <svg key={i} viewBox="0 0 24 24" className="size-4 fill-current">
                                  <path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
                                </svg>
                              ))}
                            </span>
                            {badge}
                          </p>
                        )}
                        <p className="profile-muted max-w-[42ch] leading-relaxed text-muted transition-colors duration-500">{t(`profiles.${key}.text`)}</p>
                        <p className="profile-text label-mono mt-6 text-fg transition-colors duration-500">{t(`profiles.${key}.cta`)}</p>
                      </div>
                    </SmartLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* ── Principles ───────────────────────────────────────── */}
        <div className="mt-24 md:mt-36">
          <div className="flex items-center justify-between border-b border-line pb-4" data-reveal="fade">
            <h3 className="label-mono text-fg">{t('principlesLabel')}</h3>
            <span className="label-mono text-faint tabular-nums">{pad(principles.length)}</span>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((item, i) => (
              <li
                key={item.title}
                data-reveal
                className="relative border-b border-line py-8 sm:px-6 sm:odd:pl-0 lg:border-b-0 lg:border-l lg:px-6 lg:py-10 lg:first:border-l-0 lg:first:pl-0"
              >
                <span className="label-mono text-faint tabular-nums">{pad(i + 1)}</span>
                <h4 className="mt-8 text-xl font-medium tracking-[-0.03em] lg:mt-12">{item.title}</h4>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
