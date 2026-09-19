import { useSyncExternalStore } from 'react';
import { getTheme, subscribe } from '../lib/theme';

/* The current theme as React state. Only needed where markup depends on it
   (aria-checked on the toggle); colours never do — they are CSS tokens. */
export function useTheme() {
  return useSyncExternalStore(subscribe, getTheme, () => 'light');
}
