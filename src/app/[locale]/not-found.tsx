import type { CSSProperties } from 'react';
import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/Button';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <section className="container-x relative flex min-h-[100svh] flex-col justify-center pt-[var(--header-h)] pb-16">
      <p className="label-mono page-enter text-muted">{t('label')}</p>
      <p aria-hidden className="text-display text-outline mt-6 text-[clamp(7rem,30vw,26rem)]">
        <span className="mask">
          <span className="page-rise">404</span>
        </span>
      </p>
      <h1 className="page-enter mt-6 max-w-[18ch] text-[clamp(1.75rem,4vw,3.5rem)] leading-tight font-medium tracking-[-0.04em]" style={{ '--d': 200 } as CSSProperties}>
        {t('title')}
      </h1>
      <p className="text-lead page-enter mt-4 max-w-[44ch] text-muted" style={{ '--d': 300 } as CSSProperties}>
        {t('text')}
      </p>
      <div className="page-enter mt-10" style={{ '--d': 400 } as CSSProperties}>
        <ButtonLink href="/" label={t('home')} />
      </div>
    </section>
  );
}
