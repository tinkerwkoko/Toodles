import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cx } from '../../lib/cx';

export interface QuickTileProps {
  to: string;
  label: string;
  /** Big, glanceable number or short word. */
  value: string;
  hint?: string;
  icon: ReactNode;
  tone?: 'lilac' | 'peach' | 'mint' | 'butter' | 'sky' | 'rose';
}

const TONES: Record<NonNullable<QuickTileProps['tone']>, string> = {
  lilac: 'bg-lilac-100 border-lilac-200 text-lilac-700',
  peach: 'bg-peach-100 border-peach-200 text-peach-700',
  mint: 'bg-mint-100 border-mint-200 text-mint-700',
  butter: 'bg-butter-100 border-butter-200 text-butter-700',
  sky: 'bg-sky-100 border-sky-200 text-sky-700',
  rose: 'bg-rose-100 border-rose-200 text-rose-700',
};

/** One soft tile that leads somewhere useful. */
export function QuickTile({ to, label, value, hint, icon, tone = 'lilac' }: QuickTileProps) {
  return (
    <Link
      to={to}
      className={cx(
        'flex min-h-24 flex-col justify-between rounded-3xl border p-4 transition',
        'hover:-translate-y-0.5 hover:shadow-lift',
        TONES[tone],
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span aria-hidden="true">{icon}</span>
        <ChevronRight size={16} aria-hidden="true" className="opacity-60" />
      </div>
      <div>
        <p className="font-display text-2xl leading-none text-ink">{value}</p>
        <p className="mt-1 text-sm font-bold">{label}</p>
        {hint && <p className="text-xs opacity-80">{hint}</p>}
      </div>
    </Link>
  );
}
