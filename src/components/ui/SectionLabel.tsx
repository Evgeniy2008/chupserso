import { cn } from '@/lib/cn';

/** "(02) ─── Selected Work" — the index label that opens every section. */
export function SectionLabel({ index, children, className }: { index: string; children: string; className?: string }) {
  return (
    <div className={cn('flex items-center gap-4 text-muted', className)} data-reveal="fade">
      <span className="label-mono text-fg">({index})</span>
      <span aria-hidden className="h-px w-10 bg-line-strong" />
      <span className="label-mono">{children}</span>
    </div>
  );
}
