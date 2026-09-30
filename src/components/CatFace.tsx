import type { MoodLevel } from '../types';

export interface CatFaceProps {
  mood: MoodLevel;
  size?: number;
  className?: string;
  /** Hides the decorative label from screen readers when the mood is spoken. */
  decorative?: boolean;
}

const FUR = '#FFFDF8';
const LINE = '#C6ADEC';
const FACE = '#3A2F4D';
const NOSE = '#EC8AA1';

/** Five little cat expressions used by the mood tracker. */
export function CatFace({ mood, size = 40, className, decorative = true }: CatFaceProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : `${mood} cat face`}
    >
      <path d="M16 22 12 8l14 6z" fill={FUR} stroke={LINE} strokeWidth={2.6} strokeLinejoin="round" />
      <path d="M48 22l4-14-14 6z" fill={FUR} stroke={LINE} strokeWidth={2.6} strokeLinejoin="round" />
      <circle cx="32" cy="36" r="22" fill={FUR} stroke={LINE} strokeWidth={2.6} />

      {mood === 'happy' && (
        <>
          <path d="M19 34q5-6 10 0" fill="none" stroke={FACE} strokeWidth={2.8} strokeLinecap="round" />
          <path d="M35 34q5-6 10 0" fill="none" stroke={FACE} strokeWidth={2.8} strokeLinecap="round" />
          <path d="M32 41q-6 6-10 1" fill="none" stroke={FACE} strokeWidth={2.4} strokeLinecap="round" />
          <path d="M32 41q6 6 10 1" fill="none" stroke={FACE} strokeWidth={2.4} strokeLinecap="round" />
        </>
      )}

      {mood === 'good' && (
        <>
          <circle cx="24" cy="34" r="2.4" fill={FACE} />
          <circle cx="40" cy="34" r="2.4" fill={FACE} />
          <path d="M31 41q-5 5-8 1" fill="none" stroke={FACE} strokeWidth={2.4} strokeLinecap="round" />
          <path d="M33 41q5 5 8 1" fill="none" stroke={FACE} strokeWidth={2.4} strokeLinecap="round" />
        </>
      )}

      {mood === 'okay' && (
        <>
          <path d="M20 34h8" stroke={FACE} strokeWidth={2.6} strokeLinecap="round" />
          <path d="M36 34h8" stroke={FACE} strokeWidth={2.6} strokeLinecap="round" />
          <path d="M28 43h8" stroke={FACE} strokeWidth={2.4} strokeLinecap="round" />
        </>
      )}

      {mood === 'low' && (
        <>
          <path d="M20 36q4-3 8 1" fill="none" stroke={FACE} strokeWidth={2.6} strokeLinecap="round" />
          <path d="M36 37q4-4 8-1" fill="none" stroke={FACE} strokeWidth={2.6} strokeLinecap="round" />
          <path d="M28 46q4-4 8 0" fill="none" stroke={FACE} strokeWidth={2.4} strokeLinecap="round" />
        </>
      )}

      {mood === 'difficult' && (
        <>
          <path d="M20 31l8 5M28 31l-8 5" stroke={FACE} strokeWidth={2.2} strokeLinecap="round" />
          <path d="M36 31l8 5M44 31l-8 5" stroke={FACE} strokeWidth={2.2} strokeLinecap="round" />
          <path
            d="M27 45q3-4 6 0 3 4 6 0"
            fill="none"
            stroke={FACE}
            strokeWidth={2.4}
            strokeLinecap="round"
          />
        </>
      )}

      <path d="M29 38h6l-3 3z" fill={NOSE} />
      <ellipse cx="17" cy="41" rx="4" ry="2.6" fill="#FBD8E1" opacity="0.85" />
      <ellipse cx="47" cy="41" rx="4" ry="2.6" fill="#FBD8E1" opacity="0.85" />
    </svg>
  );
}
