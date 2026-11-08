import type { Locale } from '@/i18n/routing';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PERSONAL CONFIGURATION — edit this file to change who the site is about.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  • Set a contact to `null` and it disappears everywhere (contact rows, menu,
 *    footer, structured data). In development, empty channels show as dashed
 *    placeholders in the Contact section.
 *  • Every value here is published as-is.
 *  • Localised copy (headline, bio, section texts) lives in `src/messages/*.json`.
 *  • Projects live in `src/features/projects/data.ts`.
 */

export type ContactChannel = 'email' | 'telegram' | 'phone' | 'upwork' | 'freelancehunt' | 'linkedin' | 'github' | 'instagram';

export interface SiteConfig {
  /** Full name in Latin script — metadata, structured data, Open Graph. */
  name: string;
  /** The name as shown to readers of each language. */
  displayName: Record<Locale, string>;
  /** Short wordmark used in the header and the giant footer type. */
  wordmark: string;
  /**
   * Public URL of the deployed site, without trailing slash. Set
   * NEXT_PUBLIC_SITE_URL at build time — it's used for canonical URLs,
   * hreflang, the sitemap and Open Graph images.
   */
  url: string;
  /** Shown in the hero, menu and footer as a small status label. */
  availableForWork: boolean;
  /** Portrait (public path). Rendered in monochrome; colour returns on hover. */
  portrait: { src: string; width: number; height: number } | null;
  avatar: string | null;
  contacts: Record<ContactChannel, string | null>;
  /** Optional @handle for Twitter/X cards (without @). */
  twitterHandle: string | null;
}

export const siteConfig: SiteConfig = {
  name: 'Evgeny Chupakhin',
  displayName: { en: 'Evgeny Chupakhin', ru: 'Евгений Чупахин' },
  wordmark: 'chupserso',

  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),

  availableForWork: true,

  portrait: { src: '/images/portrait.jpg', width: 1024, height: 1280 },
  avatar: '/images/avatar.jpg',

  contacts: {
    email: 'chipserso@gmail.com',
    telegram: 'https://t.me/chupserso',
    phone: '+40753358717',
    upwork: 'https://www.upwork.com/freelancers/~01e5bfd3df5bd74421',
    freelancehunt: 'https://freelancehunt.com/freelancer/bosjeny.html',
    linkedin: 'https://www.linkedin.com/in/evgeny-chupakhin-a0716736a/',
    github: 'https://github.com/Evgeniy2008',
    instagram: 'https://www.instagram.com/chupserso/',
  },

  twitterHandle: null,
};

/** Builds the outbound href for a channel, or null if it isn't configured. */
export function contactHref(channel: ContactChannel): string | null {
  const value = siteConfig.contacts[channel];
  if (!value) return null;
  if (channel === 'email') return `mailto:${value}`;
  if (channel === 'phone') return `tel:${value.replace(/[^\d+]/g, '')}`;
  return value;
}

/** Human-readable value for a channel: the address, the number or the @handle. */
export function contactDisplay(channel: ContactChannel): string | null {
  const value = siteConfig.contacts[channel];
  if (!value) return null;
  switch (channel) {
    case 'email':
      return value;
    case 'phone':
      return formatPhone(value);
    case 'telegram':
    case 'instagram':
    case 'github':
      return `@${value.replace(/\/+$/, '').split('/').pop()}`;
    default:
      return null;
  }
}

/** "+40753358717" → "+40 753 358 717" */
function formatPhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '');
  const m = digits.match(/^(\d{2})(\d{3})(\d{3})(\d{3})$/);
  return m ? `+${m[1]} ${m[2]} ${m[3]} ${m[4]}` : raw;
}

/** Public profile URLs, used for `sameAs` in structured data. */
export function profileUrls(): string[] {
  return (['linkedin', 'github', 'upwork', 'freelancehunt', 'telegram', 'instagram'] as const)
    .map((c) => siteConfig.contacts[c])
    .filter((v): v is string => Boolean(v));
}
