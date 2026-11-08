import type { Locale } from '@/i18n/routing';
import type messages from '@/messages/en.json';

/**
 * next-intl's key typing walks every property of every value — for arrays that
 * means `length`, `map`, … which collapses the key union. Arrays (lines, list
 * items) are always read with `t.raw(key)`, so we type them as leaves.
 */
type ArraysAsLeaves<T> = T extends readonly unknown[] ? string : T extends object ? { [K in keyof T]: ArraysAsLeaves<T[K]> } : T;

declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: ArraysAsLeaves<typeof messages>;
  }
}
