import type { Locale } from '@/i18n/routing';
import { projects } from './data';
import type { LocalizedProject, Project } from './types';

function localize(project: Project, locale: Locale, index: number): LocalizedProject {
  return { ...project, copy: project.copy[locale], index };
}

export function getProjects(locale: Locale): LocalizedProject[] {
  return projects.map((p, i) => localize(p, locale, i));
}

export function getProject(slug: string, locale: Locale): LocalizedProject | null {
  const index = projects.findIndex((p) => p.slug === slug);
  return index === -1 ? null : localize(projects[index], locale, index);
}

/** The project that follows `slug`, wrapping around — used for "Next project". */
export function getNextProject(slug: string, locale: Locale): LocalizedProject | null {
  if (projects.length < 2) return null;
  const index = projects.findIndex((p) => p.slug === slug);
  const next = (index + 1) % projects.length;
  return localize(projects[next], locale, next);
}

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
