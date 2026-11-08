import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { isLocale } from '@/i18n/routing';
import { siteConfig } from '@/config/site';
import { pageMetadata } from '@/lib/seo';
import { Hero } from '@/components/sections/hero/Hero';
import { Marquee } from '@/components/sections/Marquee';
import { SelectedWork } from '@/components/sections/work/SelectedWork';
import { Expertise } from '@/components/sections/Expertise';
import { About } from '@/components/sections/About';
import { Process } from '@/components/sections/process/Process';
import { Contact } from '@/components/sections/Contact';

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return pageMetadata({
    locale,
    path: '/',
    title: `${siteConfig.displayName[locale]} — ${t('title')}`,
    absoluteTitle: true,
    description: t('description'),
  });
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <SelectedWork />
      <Expertise />
      <About />
      <Process />
      <Contact />
    </>
  );
}
