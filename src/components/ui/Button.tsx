import { ArrowRight, ArrowUpRight, ArrowDown } from 'lucide-react';
import { Magnetic } from '@/components/motion/Magnetic';
import { SmartLink } from './SmartLink';
import { Roll } from './Roll';
import { cn } from '@/lib/cn';

const icons = { right: ArrowRight, external: ArrowUpRight, down: ArrowDown } as const;

interface ButtonLinkProps {
  href: string;
  label: string;
  variant?: 'primary' | 'ghost';
  icon?: keyof typeof icons;
  className?: string;
  magnetic?: boolean;
  externalLabel?: string;
}

/**
 * Pill CTA. Primary is solid white; ghost is a hairline outline whose fill
 * rises on hover. Both are ≥ 52px tall for comfortable touch targets.
 */
export function ButtonLink({ href, label, variant = 'primary', icon = 'right', className, magnetic = true, externalLabel }: ButtonLinkProps) {
  const Icon = icons[icon];
  const link = (
    <SmartLink
      href={href}
      externalLabel={externalLabel}
      className={cn(
        'group relative isolate inline-flex h-13 items-center gap-3 overflow-clip rounded-full pr-2 pl-6 text-[0.9375rem] font-medium tracking-[-0.01em] whitespace-nowrap transition-colors duration-500',
        variant === 'primary' ? 'bg-fg text-ink' : 'border border-line-strong text-fg hover:text-ink',
        className,
      )}
    >
      {variant === 'ghost' && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 origin-bottom scale-y-0 rounded-full bg-fg transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
        />
      )}
      <Roll>{label}</Roll>
      <span
        aria-hidden
        className={cn(
          'flex size-9 items-center justify-center rounded-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
          variant === 'primary' ? 'bg-ink text-fg' : 'bg-fg text-ink',
          icon === 'right' && 'group-hover:-rotate-45',
          icon === 'down' && 'group-hover:translate-y-0.5',
        )}
      >
        <Icon className="size-4" strokeWidth={1.75} />
      </span>
    </SmartLink>
  );

  return magnetic ? <Magnetic strength={0.22}>{link}</Magnetic> : link;
}
