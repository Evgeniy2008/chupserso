'use client';

import { ArrowUp } from 'lucide-react';
import { scrollToTarget } from '@/lib/smooth';

export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => scrollToTarget(document.getElementById('top') ?? document.body)}
      className="group flex items-center gap-3 text-sm text-muted transition-colors duration-500 hover:text-fg"
    >
      {label}
      <span className="flex size-10 items-center justify-center rounded-full border border-line transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
        <ArrowUp aria-hidden className="size-4" strokeWidth={1.5} />
      </span>
    </button>
  );
}
