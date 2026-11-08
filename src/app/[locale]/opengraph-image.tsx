import { getTranslations } from 'next-intl/server';
import { defaultLocale, isLocale } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { OG_SIZE, renderOg } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = `${siteConfig.name} — Full-Stack Developer`;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const t = await getTranslations({ locale, namespace: 'hero' });
  const lines = t.raw('lines') as string[];
  return renderOg({ eyebrow: siteConfig.displayName[locale], title: lines.join(' '), footer: t('eyebrow') });
}
