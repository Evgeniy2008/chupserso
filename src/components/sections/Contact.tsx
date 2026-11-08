import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/config/site';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SplitLines } from '@/components/ui/SplitLines';
import { ButtonLink } from '@/components/ui/Button';
import { ContactChannels } from '@/features/contact/ContactChannels';
import { CopyEmail } from '@/features/contact/CopyEmail';

export async function Contact() {
  const t = await getTranslations('contact');
  const email = siteConfig.contacts.email;

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-clip pt-24 pb-24 md:pt-40 md:pb-32">
      {/* Horizon: a vast arc of light rising behind the closing statement */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[30%] -z-10 flex justify-center">
        <div className="aspect-square w-[170vw] shrink-0 rounded-full border-t border-white/25 bg-[radial-gradient(closest-side,rgb(201_206_214/0.09),transparent_70%)] shadow-[0_-30px_120px_-20px_rgb(201_206_214/0.18)] md:w-[120vw]" />
      </div>

      <div className="container-x">
        <SectionLabel index="06">{t('label')}</SectionLabel>

        <SplitLines
          id="contact-title"
          lines={t.raw('lines') as string[]}
          className="text-heading mt-10 text-[clamp(2.6rem,8.6vw,10rem)]"
          lineClassName={(i) => (i === 1 ? 'text-outline' : undefined)}
        />
        <p
          data-reveal
          className="text-display mt-6 bg-[linear-gradient(100deg,#8a8f98_0%,#ffffff_35%,#c9ced6_55%,#6f747c_100%)] bg-clip-text pb-[0.06em] text-[clamp(2.6rem,8.6vw,10rem)] text-transparent md:mt-8"
        >
          {t('cta')}
        </p>

        <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="text-lead text-muted" data-reveal>
              {t('intro')}
            </p>
            {email && (
              <div className="mt-8 flex flex-wrap items-center gap-3" data-reveal>
                <ButtonLink href={`mailto:${email}`} label={email} icon="external" />
                <CopyEmail email={email} />
              </div>
            )}
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <ContactChannels />
          </div>
        </div>
      </div>
    </section>
  );
}
