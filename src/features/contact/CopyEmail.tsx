'use client';

import { Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

/** Copies the address to the clipboard, with a polite live-region confirmation. */
export function CopyEmail({ email }: { email: string }) {
  const t = useTranslations('contact');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="flex h-11 items-center gap-2 rounded-full border border-line px-4 text-sm text-muted transition-colors duration-500 hover:border-line-strong hover:text-fg"
    >
      {copied ? <Check aria-hidden className="size-4" strokeWidth={1.5} /> : <Copy aria-hidden className="size-4" strokeWidth={1.5} />}
      <span aria-live="polite">{copied ? t('copied') : t('copy')}</span>
    </button>
  );
}
