import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** Human-readable names, shown in the language switcher (each in its own language). */
export const localeNames: Record<Locale, { short: string; native: string; og: string }> = {
  en: { short: 'EN', native: 'English', og: 'en_US' },
  ru: { short: 'RU', native: 'Русский', og: 'ru_RU' },
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  // English is the default for everyone; the visitor switches explicitly.
  localeDetection: false,
});

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
