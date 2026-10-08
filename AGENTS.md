# Project rules

- Content, service data and site constants live in `src/lib/site.ts` — pages read from it so copy changes happen in one place.
- Service pages all render `src/components/ServicePageTemplate.tsx` from a `Service` entry, so the six pages stay visually identical.
- Colors, type scale and section spacing are tokens/utilities in `src/styles.css`; components never hardcode color values.
- All images and fonts are bundled from the repo (src/assets imports, @fontsource, public/fonts); no CDN asset pointers or font hosts — the site must run as static files on S3.
- Absolute SEO URLs come from VITE_SITE_URL via src/lib/seo.ts; every route head spreads seoMeta/seoLinks so prerendered HTML carries the final domain.
- `build:static` prerenders the page list in vite.config.ts and scripts/export-static.mjs assembles static-site/ (404.html, sitemap, robots); add new pages to both lists.
- Router uses trailingSlash "preserve" — required for folder-style prerender output (otherwise prerender redirect-loops).
