/**
 * Server-side text fitting for display typography.
 *
 * We estimate the rendered width of an uppercase line in `em` using approximate
 * Geist (weight ~560) advance widths, then size the type with container query
 * units so the longest line fills the container exactly — no client-side
 * measuring, no layout shift.
 */

const NARROW = new Set(['I', 'Ї', 'І', '.', ',', ':', ';', '!', '’', "'", '|']);
const WIDE = new Set(['M', 'W', 'Ж', 'Ш', 'Щ', 'Ю', 'Ы', 'Ф', 'М']);
const MEDIUM_NARROW = new Set(['J', 'L', 'F', 'E', 'Г', 'T', 'Т', 'З', 'Е', 'Ё', 'Ь', 'P', 'Р', 'S', 'Z']);
const ROUND = new Set(['O', 'Q', 'C', 'G', 'D', 'О', 'С', 'Э', 'Ф', 'Д']);

function charWidth(ch: string): number {
  if (ch === ' ') return 0.25;
  if (ch === '-' || ch === '—' || ch === '–') return ch === '—' ? 0.9 : 0.4;
  if (ch === '?') return 0.55;
  if (NARROW.has(ch)) return 0.28;
  if (WIDE.has(ch)) return 0.9;
  if (MEDIUM_NARROW.has(ch)) return 0.62;
  if (ROUND.has(ch)) return 0.76;
  return 0.7;
}

/** Approximate width of an uppercase string in em, including negative tracking. */
export function estimateWidthEm(text: string, trackingEm = -0.048): number {
  const chars = [...text.toUpperCase()];
  const raw = chars.reduce((sum, ch) => sum + charWidth(ch), 0);
  return raw + tracking(chars.length, trackingEm);
}

function tracking(count: number, trackingEm: number): number {
  return Math.max(0, count - 1) * trackingEm;
}

/**
 * Returns a CSS font-size expression that makes the widest of `lines`
 * span `fill` of its inline-size container (requires `container-type: inline-size`).
 */
export function fitFontSize(lines: string[], { fill = 0.98, maxRem = 14 }: { fill?: number; maxRem?: number } = {}): string {
  const widest = Math.max(...lines.map((l) => estimateWidthEm(l)));
  const cqw = (fill * 100) / widest;
  return `min(${maxRem}rem, ${cqw.toFixed(3)}cqw)`;
}

/** Same as fitFontSize, but sized by the widest single word (for stacked mobile layouts). */
export function fitByWord(lines: string[], options?: { fill?: number; maxRem?: number }): string {
  const words = lines.flatMap((l) => l.split(/\s+/)).filter(Boolean);
  return fitFontSize(words, options);
}
