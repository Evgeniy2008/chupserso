import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { localeNames, locales } from '@/i18n/routing';
import { siteConfig, contactHref, type ContactChannel } from '@/config/site';
import { getCurrentYear } from '@/lib/year';
import { fitFontSize } from '@/lib/fit';
import { SmartLink } from '@/components/ui/SmartLink';
import { Roll } from '@/components/ui/Roll';
import { Link } from '@/i18n/navigation';
import { BackToTop } from './BackToTop';
import { NAV_ITEMS } from './nav';

const CHANNELS: ContactChannel[] = ['email', 'telegram', 'upwork', 'freelancehunt', 'linkedin', 'github', 'instagram'];

export async function Footer({ locale }: { locale: Locale }) {
  const [t, nav, contact, a11y, hero, year] = await Promise.all([
    getTranslations('footer'),
    getTranslations('nav'),
    getTranslations('contact'),
    getTranslations('a11y'),
    getTranslations('hero'),
    getCurrentYear(),
  ]);

  const channels = CHANNELS.map((c) => ({ channel: c, href: contactHref(c) })).filter((c): c is { channel: ContactChannel; href: string } => Boolean(c.href));

  return (
    <footer id="site-footer" className="relative z-10 overflow-clip border-t border-line bg-ink pb-safe">
      <div className="container-x grid gap-12 pt-16 pb-12 md:grid-cols-12 md:pt-24">
        <div className="md:col-span-5">
          <p className="max-w-sm text-lg leading-snug tracking-[-0.015em] text-balance">{t('tagline')}</p>
          {siteConfig.availableForWork && (
            <p className="label-mono mt-6 flex items-center gap-2.5 text-muted">
              <span className="pulse-dot" aria-hidden />
              {hero('available')}
            </p>
          )}
        </div>

        <nav aria-label={t('navigation')} className="md:col-span-2 md:col-start-7">
          <h2 className="label-mono mb-5 text-faint">{t('navigation')}</h2>
          <ul className="space-y-2.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <SmartLink href={`/#${item.id}`} className="group text-sm text-muted transition-colors duration-500 hover:text-fg">
                  <Roll>{nav(item.key)}</Roll>
                </SmartLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <h2 className="label-mono mb-5 text-faint">{t('connect')}</h2>
          {channels.length > 0 ? (
            <ul className="space-y-2.5">
              {channels.map(({ channel, href }) => (
                <li key={channel}>
                  <SmartLink href={href} externalLabel={a11y('externalLink')} className="group text-sm text-muted transition-colors duration-500 hover:text-fg">
                    <Roll>{contact(`channels.${channel}`)}</Roll>
                  </SmartLink>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-faint">—</p>
          )}
        </div>

        <div className="md:col-span-2">
          <h2 className="label-mono mb-5 text-faint">{t('language')}</h2>
          <ul className="space-y-2.5">
            {locales.map((l) => (
              <li key={l}>
                <Link
                  href="/"
                  locale={l}
                  hrefLang={l}
                  lang={l}
                  aria-current={l === locale ? 'true' : undefined}
                  className={l === locale ? 'text-sm text-fg' : 'text-sm text-muted transition-colors duration-500 hover:text-fg'}
                >
                  {localeNames[l].native}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-x [container-type:inline-size]" aria-hidden>
        <p
          className="text-display bg-gradient-to-b from-white/90 via-white/25 to-transparent bg-clip-text pb-[0.04em] leading-[0.8] text-transparent select-none"
          style={{ fontSize: fitFontSize([siteConfig.wordmark], { fill: 0.97, maxRem: 40 }) }}
          data-reveal="fade"
        >
          {siteConfig.wordmark}
        </p>
      </div>

      <div className="container-x flex flex-col-reverse items-start justify-between gap-6 border-t border-line py-6 sm:flex-row sm:items-center">
        <p className="label-mono text-faint">
          © {year} {siteConfig.displayName[locale]}. {t('rights')}
        </p>
        <p className="label-mono hidden text-faint lg:block">{t('made')}</p>
        <BackToTop label={t('backToTop')} />
      </div>
    </footer>
  );
}
