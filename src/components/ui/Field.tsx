import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { cx } from '../../lib/cx';

/* Shared input look — soft borders, generous touch height, visible focus. */
const CONTROL =
  'w-full rounded-2xl border border-lilac-200 bg-cream px-4 py-3 text-ink placeholder:text-ink-soft/70 ' +
  'transition focus:border-lilac-400 focus:outline-none focus:ring-4 focus:ring-lilac-200/70 ' +
  'disabled:opacity-60';

export interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, htmlFor, hint, children, className }: FieldProps) {
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-bold text-lilac-700"
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  compact?: boolean;
}

export function Input({ className, compact = false, ...rest }: InputProps) {
  return (
    <input
      className={cx(CONTROL, compact && 'px-3 py-2 text-sm', className)}
      {...rest}
    />
  );
}

export function Textarea({ className, rows = 4, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={rows} className={cx(CONTROL, 'resize-y leading-relaxed', className)} {...rest} />;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  compact?: boolean;
}

export function Select({ className, compact = false, children, ...rest }: SelectProps) {
  return (
    <select className={cx(CONTROL, 'appearance-none pr-10', compact && 'px-3 py-2 text-sm', className)} {...rest}>
      {children}
    </select>
  );
}
