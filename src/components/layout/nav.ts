/** Section anchors shared by the header, mobile menu and footer. */
export const NAV_ITEMS = [
  { id: 'work', key: 'work' },
  { id: 'expertise', key: 'expertise' },
  { id: 'about', key: 'about' },
  { id: 'process', key: 'process' },
  { id: 'contact', key: 'contact' },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]['key'];
