import { cn } from '@/lib/cn';

/** Hover text-roll: the label slides up and an identical copy follows. Needs a `.group` ancestor. */
export function Roll({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn('roll', className)}>
      <span>{children}</span>
      <span aria-hidden>{children}</span>
    </span>
  );
}
