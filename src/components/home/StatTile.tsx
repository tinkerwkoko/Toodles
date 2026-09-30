import type { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { cx } from '../../lib/cx';

export interface StatTileProps {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  className?: string;
}

/** Small "today at a glance" figure. */
export function StatTile({ label, value, hint, icon, className }: StatTileProps) {
  return (
    <Card padding="sm" className={cx('flex items-center gap-3', className)}>
      {icon && (
        <span
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-lilac-300 text-ink"
        >
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <p className="font-display text-xl leading-none text-ink">{value}</p>
        <p className="truncate text-xs font-bold text-ink-soft">{label}</p>
        {hint && <p className="truncate text-xs text-ink-soft">{hint}</p>}
      </div>
    </Card>
  );
}
