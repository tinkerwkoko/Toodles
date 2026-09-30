import { cx } from '../../lib/cx';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  /** Optional count badge, e.g. number of tasks in that view. */
  count?: number;
}

export interface SegmentedControlProps<T extends string> {
  options: Array<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

/** Pill tab bar — scrolls sideways on small screens instead of overflowing. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cx('no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1', className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cx(
              'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-bold transition',
              active
                ? 'border-lilac-500 bg-lilac-500 text-white shadow-soft'
                : 'border-lilac-200 bg-cream text-lilac-700 hover:bg-lilac-100',
            )}
          >
            {option.label}
            {typeof option.count === 'number' && (
              <span
                className={cx(
                  'rounded-full px-2 py-0.5 text-xs',
                  active ? 'bg-white/25 text-white' : 'bg-lilac-100 text-lilac-700',
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
