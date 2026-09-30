import type { MoodLevel } from '../../types';
import { accent } from '../../lib/color';
import { MOODS, moodMeta } from '../../lib/mood';
import { CatFace } from '../CatFace';
import { cx } from '../../lib/cx';

export interface MoodPickerProps {
  value: MoodLevel | null;
  onChange: (mood: MoodLevel) => void;
  /** Quiet labels for tight spaces like a diary form row. */
  compact?: boolean;
  label?: string;
}

/** One tap to log how today (or a diary day) felt. No health claims. */
export function MoodPicker({ value, onChange, compact = false, label = 'How did the day feel?' }: MoodPickerProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-bold text-lilac-700">{label}</legend>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
        {MOODS.map((mood) => {
          const active = value === mood.level;
          const tone = accent(mood.color);
          return (
            <button
              key={mood.level}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(mood.level)}
              className={cx(
                'flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl border px-3 py-2 transition',
                compact ? 'flex-col gap-1 text-[0.7rem]' : 'text-sm',
                active
                  ? cx(tone.soft, tone.border, tone.text, 'font-bold shadow-soft')
                  : 'border-lilac-200 bg-cream text-ink-soft hover:bg-lilac-50',
              )}
              title={mood.hint}
            >
              <CatFace mood={mood.level} size={compact ? 28 : 34} />
              <span>{mood.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export interface MoodBadgeProps {
  mood: MoodLevel;
  withLabel?: boolean;
  className?: string;
}

export function MoodBadge({ mood, withLabel = true, className }: MoodBadgeProps) {
  const meta = moodMeta(mood);
  const tone = accent(meta.color);
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold',
        tone.soft,
        tone.border,
        tone.text,
        className,
      )}
    >
      <CatFace mood={mood} size={18} />
      {withLabel && meta.label}
    </span>
  );
}
