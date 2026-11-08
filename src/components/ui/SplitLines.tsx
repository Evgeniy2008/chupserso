import type { CSSProperties, ElementType } from 'react';
import { cn } from '@/lib/cn';

interface SplitLinesProps {
  lines: string[];
  as?: ElementType;
  id?: string;
  className?: string;
  lineClassName?: (index: number) => string | undefined;
  /** Reveal on scroll (default) or animate immediately on page load. */
  mode?: 'scroll' | 'load';
}

/** Heading split into masked lines that slide up — on scroll or on load. */
export function SplitLines({ lines, as: Tag = 'h2', id, className, lineClassName, mode = 'scroll' }: SplitLinesProps) {
  return (
    <Tag id={id} className={className} data-reveal={mode === 'scroll' ? 'lines' : undefined} aria-label={lines.join(' ')}>
      {lines.map((line, i) => (
        <span key={i} aria-hidden className={cn('block', lineClassName?.(i))}>
          <span className="mask">
            <span className={mode === 'load' ? 'page-rise' : undefined} style={{ '--i': i } as CSSProperties}>
              {line}
            </span>
          </span>
        </span>
      ))}
    </Tag>
  );
}
