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
 * Colours are the Toodles mauve-and-cream palette (see src/index.css).
 */
export const ACCENTS: Record<AccentColor, AccentClasses> = {
  lilac: {
    soft: 'bg-lilac-300',
    mid: 'bg-lilac-300',
    border: 'border-lilac-200',
    text: 'text-ink',
    solid: 'bg-lilac-300 text-ink',
    hex: '#D9BFCC',
  },
  peach: {
    soft: 'bg-peach-300',
    mid: 'bg-peach-300',
    border: 'border-peach-300',
    text: 'text-peach-700',
    solid: 'bg-peach-300 text-peach-700',
    hex: '#F4C3A8',
  },
  mint: {
    soft: 'bg-mint-100',
    mid: 'bg-mint-300',
    border: 'border-mint-100',
    text: 'text-ink',
    solid: 'bg-mint-300 text-ink',
    hex: '#DCE6D3',
  },
  butter: {
    soft: 'bg-butter-100',
    mid: 'bg-butter-300',
    border: 'border-butter-100',
    text: 'text-ink',
    solid: 'bg-butter-300 text-ink',
    hex: '#F6EAC2',
  },
  sky: {
    soft: 'bg-sky-100',
    mid: 'bg-sky-300',
    border: 'border-sky-100',
    text: 'text-ink',
    solid: 'bg-sky-300 text-ink',
    hex: '#D3E2EC',
  },
  rose: {
    soft: 'bg-rose-100',
    mid: 'bg-rose-300',
    border: 'border-rose-100',
    text: 'text-ink',
    solid: 'bg-rose-300 text-ink',
    hex: '#F3DCCB',
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
    chip: 'bg-peach-100 text-peach-700 border-peach-200',
    dot: 'bg-peach-200',
    icon: 'text-ink-soft',
  },
  low: {
    label: 'Low',
    chip: 'bg-sky-100 text-ink border-sky-100',
    dot: 'bg-sky-500',
    icon: 'text-sky-500',
  },
  medium: {
    label: 'Medium',
    chip: 'bg-butter-100 text-ink border-butter-100',
    dot: 'bg-butter-500',
    icon: 'text-butter-500',
  },
  high: {
    label: 'High',
    chip: 'bg-peach-300 text-peach-700 border-peach-300',
    dot: 'bg-peach-500',
    icon: 'text-peach-700',
  },
};

export const PRIORITY_KEYS: Priority[] = ['none', 'low', 'medium', 'high'];
