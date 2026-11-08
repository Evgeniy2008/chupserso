import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import { getProjectSlugs } from '@/features/projects/queries';
import { absoluteUrl, languageAlternates } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', ...getProjectSlugs().map((slug) => `/work/${slug}`)];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(path, locale),
      changeFrequency: path === '/' ? ('monthly' as const) : ('yearly' as const),
      priority: path === '/' ? 1 : 0.7,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
