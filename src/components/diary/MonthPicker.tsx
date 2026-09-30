import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { formatMonthYear } from '../../lib/date';
import { cx } from '../../lib/cx';

export interface MonthPickerProps {
  /** `YYYY-MM`, or null when every month is shown. */
  value: string | null;
  onChange: (value: string | null) => void;
}

/** Quiet previous/next month navigation for the diary. */
export function MonthPicker({ value, onChange }: MonthPickerProps) {
  const [year, month] = value ? value.split('-').map(Number) : [null, null];
  const hasYear = year !== null && month !== null;

  function step(delta: number): void {
    if (!hasYear || year === null || month === null) return;
    const date = new Date(year, month - 1 + delta, 1);
    onChange(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  }

  return (
    <div className="flex items-center gap-2">
      {hasYear && (
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous month"
          className="grid h-11 w-11 place-items-center rounded-full border border-lilac-200 bg-cream text-lilac-700 transition hover:bg-lilac-100"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
      )}

      <p
        className={cx(
          'flex min-w-36 items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-bold',
          hasYear ? 'border-lilac-200 bg-lilac-50 text-lilac-700' : 'border-lilac-200 bg-cream text-ink-soft',
        )}
      >
        <CalendarDays size={15} aria-hidden="true" />
        {hasYear ? formatMonthYear(year as number, (month as number) - 1) : 'All months'}
      </p>

      {hasYear && (
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next month"
          className="grid h-11 w-11 place-items-center rounded-full border border-lilac-200 bg-cream text-lilac-700 transition hover:bg-lilac-100"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      )}

      {hasYear && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="min-h-11 rounded-full px-3 text-sm font-bold text-lilac-700 hover:bg-lilac-100"
        >
          Show all
        </button>
      )}
    </div>
  );
}
