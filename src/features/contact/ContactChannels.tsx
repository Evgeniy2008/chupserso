import { ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { contactDisplay, contactHref, type ContactChannel } from '@/config/site';
import { SmartLink } from '@/components/ui/SmartLink';

/** Large rows for the main channels… */
const PRIMARY: ContactChannel[] = ['email', 'telegram', 'upwork', 'linkedin', 'github'];
/** …and a quieter line for the rest. */
const SECONDARY: ContactChannel[] = ['phone', 'freelancehunt', 'instagram'];

/**
 * Contact channels. Only configured values are rendered; in development the
 * missing ones appear as dashed placeholders so it's obvious what to fill in.
 */
export async function ContactChannels() {
  const [t, a11y] = await Promise.all([getTranslations('contact'), getTranslations('a11y')]);
  const isDev = process.env.NODE_ENV === 'development';

  const primary = PRIMARY.map((channel) => ({ channel, href: contactHref(channel) })).filter((r) => r.href || isDev);
  const secondary = SECONDARY.flatMap((channel) => {
    const href = contactHref(channel);
    return href ? [{ channel, href }] : [];
  });
  if (!primary.length && !secondary.length) return null;

  return (
    <div>
      <ul className="border-t border-line">
        {primary.map(({ channel, href }, i) =>
          href ? (
            <li key={channel} data-reveal className="border-b border-line">
              <SmartLink
                href={href}
                externalLabel={a11y('externalLink')}
                className="contact-row group relative isolate grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 overflow-clip py-6 md:grid-cols-[4rem_1fr_1fr_auto] md:py-7"
              >
                <span aria-hidden className="contact-fill absolute inset-0 -z-10 bg-fg" />
                <span className="contact-label label-mono text-faint tabular-nums transition-colors duration-500">0{i + 1}</span>
                <span className="min-w-0">
                  <span className="contact-label block text-[clamp(1.75rem,4vw,3.5rem)] leading-none font-medium tracking-[-0.045em] transition-colors duration-500">
                    {t(`channels.${channel}`)}
                  </span>
                  <span className="contact-label mt-2 block truncate text-sm text-muted transition-colors duration-500 md:hidden">
                    {contactDisplay(channel) ?? t(`channelHints.${channel}`)}
                  </span>
                </span>
                <span className="contact-label hidden truncate text-muted transition-colors duration-500 md:block">
                  {contactDisplay(channel) ?? t(`channelHints.${channel}`)}
                </span>
                <span className="contact-label contact-arrow flex size-11 items-center justify-center rounded-full border border-line-strong transition-colors duration-500 md:mr-4">
                  <ArrowUpRight aria-hidden className="size-5" strokeWidth={1.5} />
                </span>
              </SmartLink>
            </li>
          ) : (
            <li key={channel} className="border-b border-dashed border-white/20">
              <div className="grid grid-cols-[2.5rem_1fr] items-center gap-4 py-6 opacity-60 md:grid-cols-[4rem_1fr_1fr] md:py-7">
                <span className="label-mono text-faint">0{i + 1}</span>
                <span className="text-[clamp(1.75rem,4vw,3.5rem)] leading-none font-medium tracking-[-0.045em] text-faint line-through decoration-1">
                  {t(`channels.${channel}`)}
                </span>
                <span className="label-mono col-span-2 text-faint md:col-span-1">{t('missing')}</span>
              </div>
            </li>
          ),
        )}
      </ul>

      {secondary.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-3" data-reveal="fade">
          <span className="label-mono mr-2 text-faint">{t('alsoLabel')}</span>
          {secondary.map(({ channel, href }) => (
            <SmartLink
              key={channel}
              href={href}
              externalLabel={a11y('externalLink')}
              className="group inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm text-muted transition-colors duration-500 hover:border-line-strong hover:text-fg"
            >
              <span className="text-fg">{t(`channels.${channel}`)}</span>
              <span>{contactDisplay(channel) ?? t(`channelHints.${channel}`)}</span>
              <ArrowUpRight aria-hidden className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
            </SmartLink>
          ))}
        </div>
      )}

      {isDev && primary.some((r) => !r.href) && <p className="label-mono mt-4 text-faint">{t('devNote')}</p>}
    </div>
  );
}
