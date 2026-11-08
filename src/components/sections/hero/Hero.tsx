import type { CSSProperties } from 'react';
import Image from 'next/image';
import { getLocale, getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { fitByWord, fitFontSize } from '@/lib/fit';
import { getCurrentYear } from '@/lib/year';
import { ButtonLink } from '@/components/ui/Button';
import { HeroCanvas } from './HeroCanvas';
import { HeroMotion } from './HeroMotion';

export async function Hero() {
  const [t, year, locale] = await Promise.all([getTranslations('hero'), getCurrentYear(), getLocale()]);
  const lines = t.raw('lines') as string[];

  // Desktop sizes by the widest line, phones by the widest word (lines reflow into a word stack).
  // On desktop the headline is also capped by viewport height so the whole hero
  // (eyebrow → CTAs → scroll rail) fits on one screen.
  const fontVars = {
    '--fs-line': `min(${fitFontSize(lines, { fill: 0.985, maxRem: 15 })}, calc((100svh - 27rem) / ${(lines.length * 0.88).toFixed(2)}))`,
    '--fs-word': fitByWord(lines, { fill: 0.96, maxRem: 9 }),
  } as CSSProperties;

  let wordIndex = 0;

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-clip">
      {/* Light field */}
      <div data-hero-bg aria-hidden className="absolute inset-0 -z-10 origin-top">
        <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_78%_28%,rgb(201_206_214/0.16),transparent_70%)]" />
        <HeroCanvas className="absolute inset-0 size-full opacity-0 transition-opacity duration-1000 data-[ready=true]:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <HeroMotion className="container-x relative flex flex-1 flex-col pt-[calc(var(--header-h)+var(--safe-top))] pb-6 md:pb-8">
        {/* Eyebrow row */}
        <div data-hero-fade className="flex items-center justify-between gap-6 pt-5 md:pt-8">
          <div className="hero-fade flex items-center gap-3.5" style={{ '--d': 120 } as CSSProperties}>
            {siteConfig.avatar && (
              <Image src={siteConfig.avatar} alt="" width={96} height={96} priority className="size-11 rounded-full border border-line-strong object-cover md:size-12" />
            )}
            <div className="flex flex-col gap-1.5">
              <span className="text-[0.9375rem] leading-none font-medium tracking-[-0.015em] md:text-base">{siteConfig.displayName[locale]}</span>
              <span className="label-mono text-muted">{t('eyebrow')}</span>
            </div>
          </div>
          {siteConfig.availableForWork && (
            <p className="label-mono hero-fade hidden items-center gap-2.5 text-muted sm:flex" style={{ '--d': 220 } as CSSProperties}>
              <span className="pulse-dot" aria-hidden />
              {t('available')}
            </p>
          )}
        </div>
        <div aria-hidden className="hero-line mt-5 h-px bg-line" style={{ '--d': 60 } as CSSProperties} />

        {/* Headline */}
        <div className="mt-auto pt-14 [container-type:inline-size] md:pt-10" style={fontVars}>
          <h1
            id="hero-title"
            aria-label={lines.join(' ')}
            className="text-display text-[length:var(--fs-word)] md:text-[length:var(--fs-line)]"
          >
            {lines.map((line, li) => (
              <span key={li} aria-hidden data-depth={li} className="inline md:block md:whitespace-nowrap">
                <span data-pointer={li + 1} className="inline md:inline-block">
                  {line.split(' ').map((word, wi, words) => {
                    const i = wordIndex++;
                    return (
                      <span key={wi}>
                        <span className="mask">
                          <span className="hero-rise" style={{ '--i': i } as CSSProperties}>
                            {word}
                          </span>
                        </span>
                        {wi < words.length - 1 || li < lines.length - 1 ? ' ' : null}
                      </span>
                    );
                  })}
                </span>
              </span>
            ))}
          </h1>
        </div>

        {/* Supporting copy + CTAs */}
        <div data-hero-fade className="mt-10 grid gap-8 md:mt-10 md:grid-cols-12 md:items-end">
          <p className="text-lead hero-slide max-w-[34ch] text-muted md:col-span-5 lg:col-span-4" style={{ '--d': 650 } as CSSProperties}>
            {t('supporting')}
          </p>
          <div className="hero-fade flex flex-wrap items-center gap-3 md:col-span-7 md:justify-end lg:col-span-8" style={{ '--d': 780 } as CSSProperties}>
            <ButtonLink href="#work" label={t('primaryCta')} icon="down" />
            <ButtonLink href="#contact" label={t('secondaryCta')} variant="ghost" />
          </div>
        </div>

        {/* Bottom rail */}
        <div data-hero-fade className="hero-fade mt-12 flex items-end justify-between gap-6 md:mt-10" style={{ '--d': 950 } as CSSProperties}>
          <div className="flex items-end gap-4">
            <span className="scroll-cue" aria-hidden />
            <span className="label-mono text-muted">{t('scroll')}</span>
          </div>
          <p className="label-mono hidden text-faint md:block">{t('focus')}</p>
          <p className="label-mono text-faint">
            {t('index')} ©{year}
          </p>
        </div>
      </HeroMotion>
    </section>
  );
}
