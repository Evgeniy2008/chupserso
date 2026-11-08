import { getRequestConfig } from 'next-intl/server';
import { locale as rootLocale } from 'next/root-params';
import { defaultLocale, isLocale } from './routing';

export default getRequestConfig(async ({ locale }) => {
  // `locale` is set when a caller passes it explicitly, e.g. getTranslations({ locale }).
  let resolved = locale;
  if (!isLocale(resolved)) {
    const fromSegment = await rootLocale();
    resolved = isLocale(fromSegment) ? fromSegment : defaultLocale;
  }

  return {
    locale: resolved,
    timeZone: 'UTC',
    messages: (await import(`../messages/${resolved}.json`)).default,
  };
});
