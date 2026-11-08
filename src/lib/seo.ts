import type { Metadata } from 'next';
import { siteConfig, profileUrls } from '@/config/site';
import { defaultLocale, localeNames, locales, type Locale } from '@/i18n/routing';

/** Absolute URL for a locale-less path, e.g. ('/work/x', 'ru') → https://site/ru/work/x */
export function absoluteUrl(path: string, locale: Locale): string {
  const clean = path === '/' ? '' : path;
  return `${siteConfig.url}/${locale}${clean}`;
}

/** hreflang map for a locale-less path, including x-default. */
export function languageAlternates(path: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const l of locales) map[l] = absoluteUrl(path, l);
  map['x-default'] = absoluteUrl(path, defaultLocale);
  return map;
}

interface PageMetaInput {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  /** Use the title as-is instead of applying the template. */
  absoluteTitle?: boolean;
  ogType?: 'website' | 'article';
}

export function pageMetadata({ locale, path, title, description, absoluteTitle, ogType = 'website' }: PageMetaInput): Metadata {
  const url = absoluteUrl(path, locale);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: ogType,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: localeNames[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeNames[l].og),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(siteConfig.twitterHandle ? { creator: `@${siteConfig.twitterHandle}` } : {}),
    },
  };
}

/** Person + WebSite structured data. Contains only configured, real information. */
export function personJsonLd(locale: Locale, jobTitle: string, description: string) {
  const sameAs = profileUrls();
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteConfig.url}/#person`,
        name: siteConfig.name,
        alternateName: [...new Set([siteConfig.displayName[locale], siteConfig.wordmark])].filter((n) => n !== siteConfig.name),
        jobTitle,
        description,
        url: absoluteUrl('/', locale),
        ...(siteConfig.portrait ? { image: `${siteConfig.url}${siteConfig.portrait.src}` } : {}),
        ...(siteConfig.contacts.email ? { email: `mailto:${siteConfig.contacts.email}` } : {}),
        ...(siteConfig.contacts.phone ? { telephone: siteConfig.contacts.phone } : {}),
        ...(sameAs.length ? { sameAs } : {}),
        knowsAbout: ['Next.js', 'React', 'TypeScript', 'Node.js', 'NestJS', 'PostgreSQL', 'SaaS development', 'AI integration', 'API development'],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        inLanguage: locales,
        publisher: { '@id': `${siteConfig.url}/#person` },
      },
    ],
  };
}

/** Serialises JSON-LD safely for an inline <script>. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
