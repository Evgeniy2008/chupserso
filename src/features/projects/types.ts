import type { Locale } from '@/i18n/routing';

export type ProjectStatus = 'live' | 'commercial' | 'client' | 'mvp' | 'in-development' | 'placeholder';

export interface ProjectMedia {
  /** Path under /public. SVG, AVIF, WebP, PNG and JPG are supported. */
  src: string;
  width: number;
  height: number;
  /**
   * `true` while the image is a generated placeholder visual.
   * Placeholders get a small dashed badge in development so they're easy to spot.
   */
  placeholder: boolean;
  /** Focal point when the frame crops the image (CSS object-position). Defaults to 'center top'. */
  position?: string;
}

export interface ProjectHighlight {
  title: string;
  text: string;
}

/** Everything a visitor reads about a project, written once per language. */
export interface ProjectCopy {
  title: string;
  tagline: string;
  category: string;
  role: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  highlights: ProjectHighlight[];
  /** Alt text for the cover image. */
  coverAlt: string;
}

export interface Project {
  slug: string;
  /** Omit when unknown — nothing is shown instead of a guess. */
  year?: string;
  status: ProjectStatus;
  /** Featured projects get the large sticky cards; the rest go to the compact index below. */
  featured: boolean;
  /** Leave empty if you'd rather not list technologies. */
  stack: string[];
  links: {
    live?: string;
    repo?: string;
  };
  cover: ProjectMedia;
  gallery: ProjectMedia[];
  copy: Record<Locale, ProjectCopy>;
}

/** A project with copy already resolved for one locale — what components receive. */
export interface LocalizedProject extends Omit<Project, 'copy'> {
  copy: ProjectCopy;
  index: number;
}
