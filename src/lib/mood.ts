import type { AccentColor, MoodLevel } from '../types';

export interface MoodMeta {
  level: MoodLevel;
  label: string;
  /** Gentle, non-clinical description. */
  hint: string;
  color: AccentColor;
}

/** Order matters: index 0 is the brightest mood. No health claims here. */
export const MOODS: MoodMeta[] = [
  { level: 'happy', label: 'Happy', hint: 'A bright one', color: 'butter' },
  { level: 'good', label: 'Good', hint: 'Steady and calm', color: 'mint' },
  { level: 'okay', label: 'Okay', hint: 'Just ticking along', color: 'sky' },
  { level: 'low', label: 'Low', hint: 'A quieter day', color: 'lilac' },
  { level: 'difficult', label: 'Difficult', hint: 'A heavy one', color: 'rose' },
];

const MOOD_BY_LEVEL: Record<MoodLevel, MoodMeta> = MOODS.reduce(
  (accumulator, mood) => ({ ...accumulator, [mood.level]: mood }),
  {} as Record<MoodLevel, MoodMeta>,
);

export function moodMeta(level: MoodLevel): MoodMeta {
  return MOOD_BY_LEVEL[level] ?? MOODS[2];
}
