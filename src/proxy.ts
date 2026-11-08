import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { getProjectSlugs } from './features/projects/queries';

const intl = createMiddleware(routing);
const slugs = new Set(getProjectSlugs());
const CASE_STUDY = /^\/(en|ru)\/work\/([^/]+)\/?$/;

export default function proxy(request: NextRequest) {
  // Unknown case-study slugs: rewrite to the catch-all so the response carries a
  // real 404 status (a streamed notFound() inside a prerendered shell can't).
  const match = request.nextUrl.pathname.match(CASE_STUDY);
  if (match && !slugs.has(decodeURIComponent(match[2]))) {
    return NextResponse.rewrite(new URL(`/${match[1]}/__not-found`, request.url));
  }
  return intl(request);
}

export const config = {
  // Everything except API routes, Next internals, metadata routes and files with an extension.
  matcher: ['/((?!api|_next|_vercel|sitemap.xml|robots.txt|manifest.webmanifest|icon|apple-icon|opengraph-image|.*\\..*).*)'],
};
