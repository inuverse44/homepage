// Small helpers to generate URLs that respect Astro's base path (e.g., for GitHub Pages)
export const withBase = (p: string) => {
  const base = import.meta.env.BASE_URL || '/';
  const path = p.startsWith('/') ? p.slice(1) : p;
  return `${base}${path}`;
};

export const withBaseIfAbsolute = (p?: string) => {
  if (!p) return p;
  return p.startsWith('/') ? withBase(p) : p;
};

