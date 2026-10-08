// Absolute URLs for canonical/og tags come from one setting: VITE_SITE_URL
// (set it to the real domain before building). Read at build time, so every
// prerendered HTML file has the final URLs baked in.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://www.example.com").replace(/\/$/, "");

export const absUrl = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;

export function seoMeta(path: string) {
  const image = absUrl("/og-image.png");
  return [
    { property: "og:url", content: absUrl(path) },
    { property: "og:image", content: image },
    { name: "twitter:image", content: image },
  ];
}

export const seoLinks = (path: string) => [{ rel: "canonical", href: absUrl(path) }];
