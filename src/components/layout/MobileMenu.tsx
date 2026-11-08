'use client';

import { AnimatePresence, m } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, type MouseEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SmartLink } from '@/components/ui/SmartLink';
import { getLenis, scrollToTarget } from '@/lib/smooth';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NAV_ITEMS } from './nav';

export interface MenuContact {
  label: string;
  href: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  isHome: boolean;
  available: string | null;
  contacts: MenuContact[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Full-screen menu for phones and tablets. Behaves as a modal dialog: the rest of
 * the page becomes inert, Escape closes it, focus moves in on open and returns
 * to the toggle on close. The header (with the close button) stays above it.
 */
export function MobileMenu({ open, onClose, isHome, available, contacts }: MobileMenuProps) {
  const t = useTranslations('nav');
  const a11y = useTranslations('a11y');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const main = document.getElementById('main');
    const footer = document.getElementById('site-footer');
    const toggle = document.querySelector<HTMLElement>('[aria-controls="mobile-menu"]');
    main?.setAttribute('inert', '');
    footer?.setAttribute('inert', '');
    getLenis()?.stop();
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const onResize = () => {
      if (window.matchMedia('(min-width: 64rem)').matches) onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    const focusTimer = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('a, button')?.focus(), 60);

    return () => {
      main?.removeAttribute('inert');
      footer?.removeAttribute('inert');
      getLenis()?.start();
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(focusTimer);
      toggle?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  const go = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    onClose();
    if (!isHome) return; // let the router navigate to /#id
    event.preventDefault();
    window.setTimeout(() => scrollToTarget(`#${id}`), 380);
  };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={a11y('menu')}
          className="fixed inset-0 z-40 flex flex-col bg-ink pt-[calc(var(--header-h)+var(--safe-top))] lg:hidden"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.1 } }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        >
          <nav aria-label={a11y('primaryNav')} className="container-x flex flex-1 flex-col justify-center">
            <ul className="hairline-t">
              {NAV_ITEMS.map((item, i) => (
                <li key={item.id} className="hairline-b overflow-clip">
                  <m.div
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '-40%', opacity: 0, transition: { duration: 0.35, ease: EASE } }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.18 + i * 0.06 }}
                  >
                    <SmartLink
                      href={isHome ? `#${item.id}` : `/#${item.id}`}
                      onClick={go(item.id)}
                      className="flex items-baseline justify-between py-4 text-[clamp(2.4rem,11vw,4.5rem)] leading-none font-medium tracking-[-0.05em] uppercase"
                    >
                      {t(item.key)}
                      <span aria-hidden className="font-mono text-xs tracking-normal text-faint">
                        0{i + 1}
                      </span>
                    </SmartLink>
                  </m.div>
                </li>
              ))}
            </ul>
          </nav>

          <m.div
            className="container-x flex flex-col gap-6 pb-safe pt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
          >
            {contacts.length > 0 && (
              <ul className="flex flex-wrap gap-x-6 gap-y-3">
                {contacts.map((c) => (
                  <li key={c.href}>
                    <SmartLink href={c.href} externalLabel={a11y('externalLink')} className="flex items-center gap-1 text-sm text-muted">
                      {c.label}
                      <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={1.5} />
                    </SmartLink>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center justify-between gap-4">
              {available ? (
                <p className="label-mono flex items-center gap-2.5 text-muted">
                  <span className="pulse-dot" aria-hidden />
                  {available}
                </p>
              ) : (
                <span />
              )}
              <LanguageSwitcher size="lg" />
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
