import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { isLocale, locales } from '@/i18n/routing';
import { siteConfig, contactHref, type ContactChannel } from '@/config/site';
import { jsonLdString, personJsonLd } from '@/lib/seo';
import { Providers } from '@/components/motion/Providers';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { MotionDirector } from '@/components/motion/MotionDirector';
import { Cursor } from '@/components/motion/Cursor';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Intro } from '@/components/layout/Intro';
import { Guides } from '@/components/layout/Guides';
import '@/styles/globals.css';

const geist = Geist({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-geist',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-geist-mono',
  display: 'swap',
});

/**
 * Runs before first paint: skips the intro curtain on repeat visits within a
 * session. Kept tiny and dependency-free on purpose.
 */
const INTRO_SCRIPT = `try{var d=document.documentElement;if(sessionStorage.getItem('intro-seen'))d.setAttribute('data-intro','off');else sessionStorage.setItem('intro-seen','1')}catch(e){}`;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.displayName[locale]} — ${t('title')}`,
      template: `%s — ${siteConfig.displayName[locale]}`,
    },
    description: t('description'),
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    keywords: t('keywords'),
    formatDetection: { telephone: false, email: false, address: false },
    robots: { index: true, follow: true },
  };
}

const MENU_CHANNELS: ContactChannel[] = ['email', 'telegram', 'upwork', 'linkedin', 'github', 'instagram'];

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [messages, intro, hero, contact, meta, a11y] = await Promise.all([
    getMessages(),
    getTranslations('intro'),
    getTranslations('hero'),
    getTranslations('contact'),
    getTranslations('meta'),
    getTranslations('a11y'),
  ]);

  const menuContacts = MENU_CHANNELS.flatMap((c) => {
    const href = contactHref(c);
    return href ? [{ label: contact(`channels.${c}`), href }] : [];
  });

  // Client components only receive the namespaces they actually use.
  const clientMessages = { a11y: messages.a11y, nav: messages.nav, contact: { copy: messages.contact.copy, copied: messages.contact.copied } };
  const jsonLd = personJsonLd(locale, hero('eyebrow'), meta('description'));

  return (
    <html lang={locale} className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>
        <NextIntlClientProvider messages={clientMessages}>
          <Providers>
            <a href="#main" className="sr-only-focusable fixed top-3 left-3 z-[110] rounded-full bg-fg px-5 py-3 text-sm font-medium text-ink">
              {a11y('skip')}
            </a>
            <Intro label={intro('label')} wordmark={siteConfig.wordmark} />
            <Guides />
            <Header wordmark={siteConfig.wordmark} available={siteConfig.availableForWork ? hero('available') : null} contacts={menuContacts} />
            <main id="main" tabIndex={-1} className="relative z-10 outline-none">
              {children}
            </main>
            <Footer locale={locale} />
            <Cursor />
            <SmoothScroll />
            <MotionDirector />
            <div className="grain" aria-hidden />
          </Providers>
        </NextIntlClientProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      </body>
    </html>
  );
}
