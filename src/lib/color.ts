import type { AccentColor, Priority } from '../types';

export interface AccentClasses {
  /** soft fill for chips, cards and column headers */
  soft: string;
  /** slightly stronger fill for dots, bars and decorations */
  mid: string;
  /** gentle border */
  border: string;
  /** text that stays readable on the soft fill */
  text: string;
  /** solid pill (white text) */
  solid: string;
  /** raw value for SVG fills and icon tints */
  hex: string;
}

/**
 * Every class name is written out literally so Tailwind's scanner keeps it.
 * Palette keys are shared by projects, board columns, task cards and habits.
 */
export const ACCENTS: Record<AccentColor, AccentClasses> = {
  lilac: {
    soft: 'bg-lilac-100',
    mid: 'bg-lilac-300',
    border: 'border-lilac-200',
    text: 'text-lilac-700',
    solid: 'bg-lilac-500 text-white',
    hex: '#A484DA',
  },
  peach: {
    soft: 'bg-peach-100',
    mid: 'bg-peach-300',
    border: 'border-peach-200',
    text: 'text-peach-700',
    solid: 'bg-peach-500 text-white',
    hex: '#F0A473',
  },
  mint: {
    soft: 'bg-mint-100',
    mid: 'bg-mint-300',
    border: 'border-mint-200',
    text: 'text-mint-700',
    solid: 'bg-mint-500 text-white',
    hex: '#6FC29B',
  },
  butter: {
    soft: 'bg-butter-100',
    mid: 'bg-butter-300',
    border: 'border-butter-200',
    text: 'text-butter-700',
    solid: 'bg-butter-500 text-white',
    hex: '#E5BE5C',
  },
  sky: {
    soft: 'bg-sky-100',
    mid: 'bg-sky-300',
    border: 'border-sky-200',
    text: 'text-sky-700',
    solid: 'bg-sky-500 text-white',
    hex: '#74ACEA',
  },
  rose: {
    soft: 'bg-rose-100',
    mid: 'bg-rose-300',
    border: 'border-rose-200',
    text: 'text-rose-700',
    solid: 'bg-rose-500 text-white',
    hex: '#EC8AA1',
  },
};

export const ACCENT_KEYS: AccentColor[] = ['lilac', 'peach', 'mint', 'butter', 'sky', 'rose'];

export const ACCENT_LABELS: Record<AccentColor, string> = {
  lilac: 'Lilac',
  peach: 'Peach',
  mint: 'Mint',
  butter: 'Butter',
  sky: 'Sky',
  rose: 'Rose',
};

export function accent(color: AccentColor | null | undefined): AccentClasses {
  return ACCENTS[color ?? 'lilac'] ?? ACCENTS.lilac;
}

export interface PriorityStyle {
  label: string;
  chip: string;
  dot: string;
  icon: string;
}

export const PRIORITY_STYLES: Record<Priority, PriorityStyle> = {
  none: {
    label: 'No priority',
    chip: 'bg-lilac-50 text-ink-soft border-lilac-200',
    dot: 'bg-lilac-200',
    icon: 'text-lilac-400',
  },
  low: {
    label: 'Low',
    chip: 'bg-sky-100 text-sky-700 border-sky-200',
    dot: 'bg-sky-500',
    icon: 'text-sky-500',
  },
  medium: {
    label: 'Medium',
    chip: 'bg-butter-100 text-butter-700 border-butter-200',
    dot: 'bg-butter-500',
    icon: 'text-butter-500',
  },
  high: {
    label: 'High',
    chip: 'bg-peach-100 text-peach-700 border-peach-200',
    dot: 'bg-peach-500',
    icon: 'text-peach-500',
  },
};

export const PRIORITY_KEYS: Priority[] = ['none', 'low', 'medium', 'high'];
