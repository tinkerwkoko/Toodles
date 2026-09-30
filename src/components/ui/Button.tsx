import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../lib/cx';

export type ButtonVariant = 'primary' | 'soft' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-lilac-500 text-white shadow-soft hover:bg-lilac-600 active:bg-lilac-700',
  soft: 'bg-lilac-100 text-lilac-700 border border-lilac-200 hover:bg-lilac-200',
  ghost: 'bg-transparent text-lilac-700 hover:bg-lilac-100',
  outline: 'bg-cream text-ink border border-lilac-200 hover:bg-lilac-50',
  danger: 'bg-rose-500 text-white shadow-soft hover:bg-rose-700',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3.5 text-sm',
  md: 'min-h-11 px-5 text-[0.95rem]',
  lg: 'min-h-13 px-6 text-base',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  block?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  block = false,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200',
        'focus-visible:outline-3 focus-visible:outline-offset-2',
        'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45',
        VARIANTS[variant],
        SIZES[size],
        block && 'w-full',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
