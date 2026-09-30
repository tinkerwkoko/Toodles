import type { ReactNode } from 'react';
import type { DateString } from '../../types';
import { dayLabel, formatDay, formatLongDay, todayString } from '../../lib/date';
import { cx } from '../../lib/cx';

export interface DateSectionProps {
  date: DateString | 'none';
  count?: number;
  /** Extra control on the right, e.g. "Reschedule all to today". */
  action?: ReactNode;
  tone?: 'default' | 'overdue';
  children: ReactNode;
}

/** Friendly day heading: "Today", "Friday", "Next week", "Later". */
export function DateSection({
  date,
  count,
  action,
  tone = 'default',
  children,
}: DateSectionProps) {
  const label =
    date === 'none'
      ? 'No date yet'
      : date === todayString()
        ? 'Today'
        : dayLabel(date);

  const sub = date === 'none' ? 'Whenever you like' : formatLongDay(date);

  return (
    <section className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <h2
          className={cx(
            'text-lg',
            tone === 'overdue' ? 'text-rose-700' : 'text-lilac-700',
          )}
        >
          {label}
        </h2>
        {date !== 'none' && label !== formatDay(date, { withWeekday: false }) && (
          <span className="text-sm font-semibold text-ink-soft">· {formatDay(date)}</span>
        )}
        {typeof count === 'number' && (
          <span
            className={cx(
              'rounded-full px-2 py-0.5 text-xs font-bold',
              tone === 'overdue' ? 'bg-rose-100 text-rose-700' : 'bg-lilac-100 text-lilac-700',
            )}
          >
            {count}
          </span>
        )}
        {action && <div className="ml-auto">{action}</div>}
      </div>
      <p className="sr-only">{sub}</p>
      {children}
    </section>
  );
}
