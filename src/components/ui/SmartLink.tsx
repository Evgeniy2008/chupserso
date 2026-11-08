'use client';

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { scrollToTarget } from '@/lib/smooth';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: ReactNode;
  /** Extra text for screen readers on external links. */
  externalLabel?: string;
};

/**
 * One link component for every kind of destination:
 *  • `#section`         → smooth in-page scroll (Lenis-aware) + focus management
 *  • `https://`/mailto: → external, opens in a new tab (mailto stays in place)
 *  • `/path`            → locale-aware client navigation
 */
export function SmartLink({ href, children, onClick, externalLabel, ...rest }: Props) {
  if (href.startsWith('#')) {
    const handle = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || event.metaKey || event.ctrlKey) return;
      event.preventDefault();
      scrollToTarget(href);
    };
    return (
      <a href={href} onClick={handle} {...rest}>
        {children}
      </a>
    );
  }

  if (/^(https?:|mailto:|tel:)/.test(href)) {
    const isWeb = href.startsWith('http');
    return (
      <a href={href} onClick={onClick} {...(isWeb ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
        {isWeb && externalLabel ? <span className="sr-only"> ({externalLabel})</span> : null}
      </a>
    );
  }

  // "/path#hash" → keep the hash as a separate field so the locale prefix lands on the path.
  const [pathname, hash] = href.split('#');
  return (
    <Link href={hash ? { pathname: pathname || '/', hash } : href} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
