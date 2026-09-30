import { useContext } from 'react';
import { ToodlesContext, type ToodlesContextValue } from './toodlesContext';

/** Access the local workspace. Must be used inside <ToodlesProvider>. */
export function useToodles(): ToodlesContextValue {
  const context = useContext(ToodlesContext);
  if (!context) {
    throw new Error('useToodles must be used inside <ToodlesProvider>');
  }
  return context;
}
