import { cacheLife } from 'next/cache';

/** Current year, cached so prerendering stays deterministic. */
export async function getCurrentYear(): Promise<number> {
  'use cache';
  cacheLife('days');
  return new Date().getFullYear();
}
