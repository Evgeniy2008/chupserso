import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const OG_SIZE = { width: 1200, height: 630 };

async function fonts() {
  const dir = join(process.cwd(), 'src/assets/fonts');
  const [sans, mono] = await Promise.all([readFile(join(dir, 'Geist-SemiBold.ttf')), readFile(join(dir, 'GeistMono-Regular.ttf'))]);
  return [
    { name: 'Geist', data: sans, weight: 600 as const, style: 'normal' as const },
    { name: 'Geist Mono', data: mono, weight: 400 as const, style: 'normal' as const },
  ];
}

interface OgInput {
  eyebrow: string;
  title: string;
  footer: string;
}

/** Shared Open Graph composition: black field, silver light, editorial type. */
export async function renderOg({ eyebrow, title, footer }: OgInput) {
  const size = title.length > 28 ? 92 : title.length > 16 ? 116 : 150;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: '#050505',
          backgroundImage:
            'radial-gradient(70% 90% at 88% 8%, rgba(201,206,214,0.32), rgba(201,206,214,0.06) 45%, rgba(5,5,5,0) 70%)',
          color: '#ffffff',
          fontFamily: 'Geist',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Geist Mono', fontSize: 20, letterSpacing: 3, textTransform: 'uppercase', color: '#999999' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: '#ffffff' }} />
            <span style={{ color: '#ffffff' }}>{siteConfig.wordmark}</span>
          </div>
          <span>{eyebrow}</span>
        </div>
        <div style={{ display: 'flex', fontSize: size, lineHeight: 0.9, letterSpacing: -size * 0.05, textTransform: 'uppercase', maxWidth: 1050 }}>{title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.14)', paddingTop: 24, fontFamily: 'Geist Mono', fontSize: 18, letterSpacing: 2, textTransform: 'uppercase', color: '#999999' }}>
          <span>{footer}</span>
          <span>Next.js · React · TypeScript</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
