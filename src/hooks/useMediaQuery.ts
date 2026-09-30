import { useEffect, useState } from 'react';

/** Tracks a CSS media query in React (used to switch layouts, not styling). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    setMatches(list.matches);
    function handleChange(event: MediaQueryListEvent): void {
      setMatches(event.matches);
    }
    list.addEventListener('change', handleChange);
    return () => list.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

/** The desktop breakpoint Toodles uses for its two-pane task view. */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
