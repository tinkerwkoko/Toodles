import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../lib/cx';

export type ButtonVariant = 'primary' | 'soft' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-lilac-300 text-ink hover:bg-lilac-600',
  soft: 'bg-cream text-ink border border-lilac-200 hover:bg-lilac-50',
  ghost: 'bg-transparent text-ink hover:bg-lilac-100',
  outline: 'bg-cream text-ink border border-lilac-200 hover:bg-lilac-50',
  danger: 'bg-peach-300 text-peach-700 hover:bg-peach-200',
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
        // Pill buttons in Chewy. text-sm/body is 14–15px, tags 13px elsewhere.
        'inline-flex items-center justify-center gap-2 rounded-full font-display transition duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
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
