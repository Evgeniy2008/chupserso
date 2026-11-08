import type { CSSProperties } from 'react';

/** Faint architectural column guides fixed behind the page. */
export function Guides() {
  return (
    <div className="guides" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} className={i >= 4 ? 'hidden lg:block' : undefined} style={{ '--i': i } as CSSProperties} />
      ))}
    </div>
  );
}
