import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../lib/cx';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: icon-only buttons must be named for screen readers. */
  label: string;
  children: ReactNode;
  tone?: 'default' | 'danger';
}

/** Round, 44px-friendly icon button. */
export function IconButton({
  label,
  children,
  tone = 'default',
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx(
        'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition duration-200',
        'active:scale-95 disabled:pointer-events-none disabled:opacity-40',
        tone === 'danger'
          ? 'border-rose-200 bg-rose-100 text-rose-700 hover:bg-rose-200'
          : 'border-lilac-200 bg-cream text-lilac-700 hover:bg-lilac-100',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
