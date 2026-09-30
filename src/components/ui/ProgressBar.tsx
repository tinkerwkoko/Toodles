import { cx } from '../../lib/cx';

export interface ProgressBarProps {
  /** 0 – 100 */
  value: number;
  label?: string;
  /** Tailwind classes for the filled bar, e.g. 'bg-mint-500'. */
  tone?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function ProgressBar({
  value,
  label,
  tone = 'bg-lilac-500',
  className,
  size = 'sm',
}: ProgressBarProps) {
  const safe = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-valuenow={safe}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? 'Progress'}
      className={cx(
        'w-full overflow-hidden rounded-full bg-lilac-100',
        size === 'sm' ? 'h-2' : 'h-3',
        className,
      )}
    >
      <div
        className={cx('h-full rounded-full transition-[width] duration-500 ease-out', tone)}
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}
