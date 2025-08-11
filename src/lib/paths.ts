// Small helpers to generate URLs that respect Astro's base path (e.g., for GitHub Pages)
const ensureTrailingSlash = (s: string) => (s.endsWith('/') ? s : s + '/');
const stripLeadingSlash = (s: string) => (s.startsWith('/') ? s.slice(1) : s);

export const withBase = (p: string) => {
  const rawBase = import.meta.env.BASE_URL || '/';
  const base = ensureTrailingSlash(rawBase);
  const path = stripLeadingSlash(p);
  return `${base}${path}`;
};

export const withBaseIfAbsolute = (p?: string) => {
  if (!p) return p;
  return p.startsWith('/') ? withBase(p) : p;
};
