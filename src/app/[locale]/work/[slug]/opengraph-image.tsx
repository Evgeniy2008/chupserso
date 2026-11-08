import { getTranslations } from 'next-intl/server';
import { defaultLocale, isLocale } from '@/i18n/routing';
import { getProject } from '@/features/projects/queries';
import { siteConfig } from '@/config/site';
import { OG_SIZE, renderOg } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = `${siteConfig.name} — Case study`;

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const project = getProject(slug, locale);
  const t = await getTranslations({ locale, namespace: 'caseStudy' });
  if (!project) return renderOg({ eyebrow: siteConfig.name, title: siteConfig.name, footer: '' });
  return renderOg({ eyebrow: project.copy.category, title: project.copy.title, footer: t('metaTitle', { title: project.copy.title }) });
}
