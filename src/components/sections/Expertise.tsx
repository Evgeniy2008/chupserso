import type { CSSProperties } from 'react';
import { getTranslations } from 'next-intl/server';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SplitLines } from '@/components/ui/SplitLines';

interface ExpertiseItem {
  title: string;
  description: string;
  tags: string[];
}

/**
 * Editorial index of capabilities. Sticky intro on the left, rows on the right.
 * Descriptions are always visible (nothing depends on hover); on desktop the
 * hovered row lifts forward while the others recede.
 */
export async function Expertise() {
  const t = await getTranslations('expertise');
  const items = t.raw('items') as ExpertiseItem[];

  return (
    <section id="expertise" aria-labelledby="expertise-title" className="relative py-24 md:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <SectionLabel index="03">{t('label')}</SectionLabel>
            <SplitLines id="expertise-title" lines={t.raw('title') as string[]} className="text-heading mt-8 text-[clamp(2.75rem,6.4vw,7rem)]" />
            <p className="text-lead mt-8 max-w-[38ch] text-muted" data-reveal>
              {t('intro')}
            </p>
          </div>
        </div>

        <ol className="exp-list lg:col-span-7 lg:col-start-6">
          {items.map((item, i) => (
            <li key={item.title} className="exp-row relative border-t border-line py-8 last:border-b md:py-11" data-reveal style={{ '--reveal-delay': 0 } as CSSProperties}>
              <span aria-hidden className="exp-sweep absolute inset-x-0 -top-px h-px bg-fg" />
              <div className="grid gap-4 md:grid-cols-[5rem_1fr] md:gap-6">
                <span className="label-mono pt-2 text-faint tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="exp-title text-[clamp(1.75rem,3.4vw,3.25rem)] leading-[0.95] font-medium tracking-[-0.045em]">{item.title}</h3>
                  <p className="mt-4 max-w-[52ch] leading-relaxed text-muted">{item.description}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <li key={tag} className="label-mono rounded-full border border-line px-3 py-1.5 text-[0.625rem] text-muted">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
