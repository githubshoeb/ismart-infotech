// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Every real page, prerendered to its own HTML file at build time (static S3 export).
export const STATIC_PAGES = [
  "/",
  "/about",
  "/services/cloud-infrastructure",
  "/services/software-development",
  "/services/digital-marketing",
  "/services/it-consulting-staffing",
  "/services/data-ai",
  "/services/security",
  "/contact",
  "/privacy",
  "/terms",
];

export default defineConfig({
  vite: { base: "/" },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    pages: [
      ...STATIC_PAGES.map((path) => ({ path })),
      // Any unmatched URL renders the styled 404 page; saved as 404.html for CloudFront errors.
      { path: "/404-page-not-found", prerender: { enabled: true, outputPath: "/404.html" } },
    ],
    prerender: { enabled: true, autoStaticPathsDiscovery: false },
  },
});
