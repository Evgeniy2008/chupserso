'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useLinkStatus } from 'next/link';
import { useEffect } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { localeNames, locales } from '@/i18n/routing';
import { cn } from '@/lib/cn';

/**
 * EN / RU segmented switch. Real links (crawlable, work without JS) that keep
 * the current page and scroll position; the page softly dims while the other
 * language loads.
 */
export function LanguageSwitcher({ className, size = 'sm' }: { className?: string; size?: 'sm' | 'lg' }) {
  const t = useTranslations('a11y');
  const locale = useLocale();
  const pathname = usePathname();
  const activeIndex = locales.indexOf(locale);

  return (
    <nav aria-label={t('language')} className={className}>
      <ul
        className={cn(
          'relative grid grid-cols-2 rounded-full border border-line p-[3px]',
          size === 'lg' ? 'h-12 w-[7.5rem]' : 'h-9 w-[5.75rem]',
        )}
      >
        <span
          aria-hidden
          className="absolute top-[3px] bottom-[3px] left-[3px] w-[calc(50%-3px)] rounded-full bg-fg transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />
        {locales.map((l) => {
          const active = l === locale;
          return (
            <li key={l} className="relative z-10 flex">
              <Link
                href={pathname}
                locale={l}
                scroll={false}
                hrefLang={l}
                lang={l}
                aria-current={active ? 'true' : undefined}
                aria-label={active ? t('currentLanguage', { language: localeNames[l].native }) : t('switchLanguage', { language: localeNames[l].native })}
                className={cn(
                  'label-mono flex flex-1 items-center justify-center rounded-full transition-colors duration-500',
                  active ? 'text-ink' : 'text-muted hover:text-fg',
                )}
              >
                {localeNames[l].short}
                <PendingSignal />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Mirrors the link's pending state onto <html> so the page can dim during the switch. */
function PendingSignal() {
  const { pending } = useLinkStatus();
  useEffect(() => {
    if (!pending) return;
    const root = document.documentElement;
    root.dataset.switching = 'true';
    return () => {
      delete root.dataset.switching;
    };
  }, [pending]);
  return null;
}
