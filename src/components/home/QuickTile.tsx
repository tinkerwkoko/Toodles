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
  lilac: 'bg-lilac-300 border-lilac-300 text-ink',
  peach: 'bg-rose-100 border-rose-100 text-ink',
  mint: 'bg-mint-100 border-mint-100 text-ink',
  butter: 'bg-butter-100 border-butter-100 text-ink',
  sky: 'bg-sky-100 border-sky-100 text-ink',
  rose: 'bg-peach-300 border-peach-300 text-peach-700',
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
