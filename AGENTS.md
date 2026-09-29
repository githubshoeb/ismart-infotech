# Project rules

- Content, service data and site constants live in `src/lib/site.ts` — pages read from it so copy changes happen in one place.
- Service pages all render `src/components/ServicePageTemplate.tsx` from a `Service` entry, so the six pages stay visually identical.
- Colors, type scale and section spacing are tokens/utilities in `src/styles.css`; components never hardcode color values.
