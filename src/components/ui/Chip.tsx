import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';

export interface ChipProps {
  children: ReactNode;
  className?: string;
  /** Colour classes, usually from lib/color accents. */
  tone?: string;
  size?: 'sm' | 'md';
}

/** Small rounded label used for dates, tags, priorities and counts. */
export function Chip({ children, className, tone, size = 'sm' }: ChipProps) {
  return (
    <span
      className={cx(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border-[1.5px] border-peach-200 bg-peach-100 font-semibold text-peach-700',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        tone,
        className,
      )}
    >
      {children}
    </span>
  );
}

export interface ColorDotProps {
  className?: string;
  label?: string;
}

export function ColorDot({ className, label }: ColorDotProps) {
  return (
    <span
      className={cx('inline-block h-2.5 w-2.5 shrink-0 rounded-full', className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    />
  );
}
