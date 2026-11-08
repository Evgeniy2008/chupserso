import { getTranslations } from 'next-intl/server';

function Row({ items, hidden }: { items: string[]; hidden?: boolean }) {
  return (
    <ul className={hidden ? 'marquee-dupe flex shrink-0' : 'flex shrink-0'} aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center">
          <span className={i % 2 === 0 ? 'text-fg' : 'text-outline'}>{item}</span>
          <svg aria-hidden viewBox="0 0 24 24" className="mx-[0.45em] size-[0.32em] text-faint" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v20M2 12h20" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

/** Slow capability ticker — the hinge between the hero and the work. */
export async function Marquee() {
  const t = await getTranslations();
  const items = t.raw('marquee') as string[];

  return (
    <section aria-label={items.join(', ')} className="relative overflow-clip border-y border-line py-6 md:py-9">
      <div className="marquee text-[clamp(2.25rem,6.5vw,6rem)] leading-none font-medium tracking-[-0.045em] uppercase">
        <Row items={items} />
        <Row items={items} hidden />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[12vw] bg-gradient-to-r from-ink to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-[12vw] bg-gradient-to-l from-ink to-transparent" />
    </section>
  );
}
