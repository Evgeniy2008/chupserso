'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { SmartLink } from '@/components/ui/SmartLink';
import { Roll } from '@/components/ui/Roll';
import { Magnetic } from '@/components/motion/Magnetic';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu, type MenuContact } from './MobileMenu';
import { NAV_ITEMS } from './nav';
import { cn } from '@/lib/cn';

interface HeaderProps {
  wordmark: string;
  available: string | null;
  contacts: MenuContact[];
}

export function Header({ wordmark, available, contacts }: HeaderProps) {
  const t = useTranslations('nav');
  const a11y = useTranslations('a11y');
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Solid background after leaving the top; hide while scrolling down, reveal on the way up.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY.current;
      setScrolled(y > 24);
      if (Math.abs(delta) > 6) setHidden(delta > 0 && y > window.innerHeight * 0.6);
      lastY.current = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const hrefFor = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <header
        className="site-header fixed inset-x-0 top-0 z-50 border-b border-transparent pt-[var(--safe-top)]"
        data-scrolled={scrolled || menuOpen}
        data-hidden={hidden && !menuOpen}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" aria-label={a11y('home', { name: wordmark })} className="group flex items-center gap-2.5 text-[0.95rem] font-medium tracking-[-0.02em]">
            <span aria-hidden className="relative flex size-2 items-center justify-center">
              <span className="absolute size-2 rounded-full bg-fg transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-150" />
            </span>
            <Roll>{wordmark}</Roll>
          </Link>

          <nav aria-label={a11y('primaryNav')} className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {NAV_ITEMS.map((item, i) => (
                <li key={item.id}>
                  <SmartLink href={hrefFor(item.id)} className="group flex items-baseline gap-1.5 text-[0.875rem] text-muted transition-colors duration-500 hover:text-fg">
                    <span aria-hidden className="font-mono text-[0.625rem] text-faint">
                      0{i + 1}
                    </span>
                    <Roll>{t(item.key)}</Roll>
                  </SmartLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher className="hidden sm:block" />
            <Magnetic strength={0.25} className="hidden xs:inline-flex">
              <SmartLink
                href={hrefFor('contact')}
                className="group inline-flex h-9 items-center gap-2 rounded-full bg-fg px-4 text-[0.8125rem] font-medium text-ink"
              >
                <Roll>{t('cta')}</Roll>
              </SmartLink>
            </Magnetic>
            <button
              type="button"
              className="group -mr-2 flex h-11 items-center gap-3 px-2 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? a11y('closeMenu') : a11y('openMenu')}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="label-mono text-fg">{menuOpen ? t('close') : t('menu')}</span>
              <span aria-hidden className="relative block h-3 w-6">
                <span
                  className={cn(
                    'absolute left-0 h-px w-full bg-fg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    menuOpen ? 'top-1/2 rotate-45' : 'top-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-0 h-px bg-fg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    menuOpen ? 'top-1/2 w-full -rotate-45' : 'top-full w-2/3',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} isHome={isHome} available={available} contacts={contacts} />
    </>
  );
}
