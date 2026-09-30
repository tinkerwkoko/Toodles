import { useEffect, useState, type ReactNode } from 'react';
import { Cat } from './Cat';
import { cx } from '../lib/cx';

export interface WelcomeScreenProps {
  onDone: () => void;
}

/** Shown once per fresh visit, for about two seconds. Tap anywhere to skip. */
const ROTATING_LINES = [
  'Untangle your day, one tiny win at a time.',
  'Your to-dos, your moods, your habits, all tucked into one cozy place.',
  'No sign-ups. No clutter. Just you and a very helpful cat.',
];

const VISIBLE_MS = 1900;
const FADE_MS = 320;

export function WelcomeScreen({ onDone }: WelcomeScreenProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const rotate = window.setInterval(
      () => setLineIndex((current) => (current + 1) % ROTATING_LINES.length),
      1500,
    );
    return () => window.clearInterval(rotate);
  }, []);

  useEffect(() => {
    if (leaving) return;
    const timer = window.setTimeout(() => setLeaving(true), VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(onDone, FADE_MS);
    return () => window.clearTimeout(timer);
  }, [leaving, onDone]);

  return (
    <SplashShell leaving={leaving} onSkip={() => setLeaving(true)}>
      <div className="flex w-full max-w-md flex-col items-center px-6 text-center">
        <Cat pose="sleepy" size={168} />
        <h1 className="mt-5 text-5xl leading-none tracking-tight sm:text-6xl">Toodles</h1>
        <p className="mt-3 text-lg font-bold text-ink">Small tasks, big calm.</p>

        <div className="mt-5 flex min-h-16 items-center justify-center">
          <p
            key={lineIndex}
            className="text-[0.95rem] text-ink-soft motion-safe:animate-fade-in"
          >
            {ROTATING_LINES[lineIndex]}
          </p>
        </div>

        <div className="mt-2 h-2 w-52 overflow-hidden rounded-full bg-lilac-100">
          <div className="h-full rounded-full bg-lilac-300 motion-safe:animate-grow" />
        </div>
        <p className="mt-3 text-xs font-bold tracking-[0.2em] text-ink-soft uppercase">
          Tucking things away
        </p>
      </div>
    </SplashShell>
  );
}

interface SplashShellProps {
  leaving: boolean;
  onSkip: () => void;
  children: ReactNode;
}

/** Flat cream wash that fades out once the splash is finished. */
export function SplashShell({ leaving, onSkip, children }: SplashShellProps) {
  return (
    <div
      className={cx(
        'fixed inset-0 z-60 grid place-items-center bg-lilac-50 transition-opacity duration-300',
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100',
      )}
    >
      <button
        type="button"
        onClick={onSkip}
        className="absolute inset-0 h-full w-full cursor-default"
        aria-label="Skip the welcome screen"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
