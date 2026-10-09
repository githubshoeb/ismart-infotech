// Copies the prerendered client build into dist-static/ (the only folder you upload to S3),
// renders 404.html, adds a per-page Content-Security-Policy meta tag (with hashes of that
// page's inline scripts) and writes sitemap.xml + robots.txt from VITE_SITE_URL.
// The server bundle is used once here at build time and is never copied.
import { cpSync, rmSync, writeFileSync, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const env = existsSync(".env") ? readFileSync(".env", "utf8") : "";
const fromFile = env.match(/^VITE_SITE_URL=["']?([^"'\n]+)/m)?.[1];
const SITE_URL = (process.env.VITE_SITE_URL || fromFile || "http://www.example.com").replace(/\/$/, "");
const PAGES = ["/", "/about/", "/services/cloud-infrastructure/", "/services/software-development/",
  "/services/digital-marketing/", "/services/it-consulting-staffing/", "/services/data-ai/",
  "/services/security/", "/contact/", "/privacy/", "/terms/"];

const OUT = "dist-static";
rmSync(OUT, { recursive: true, force: true });
cpSync("dist/client", OUT, { recursive: true });
for (const p of PAGES) {
  const file = `${OUT}${p}index.html`;
  if (!existsSync(file)) throw new Error(`Missing prerendered page: ${file}`);
}

// Styled 404 page, rendered once from the server bundle at build time.
const server = await import(new URL("../dist/server/index.mjs", import.meta.url).href);
const res = await (server.default ?? server).fetch(
  new Request("http://localhost/404-page-not-found/"), {}, { waitUntil() {}, passThroughOnException() {} });
let notFoundHtml = await res.text();
if (!notFoundHtml.includes("<html")) throw new Error("Could not render 404.html");
notFoundHtml = notFoundHtml.replace(/<link rel="canonical"[^>]*>/g, "")
  .replace("<head>", '<head><meta name="robots" content="noindex"/>');
writeFileSync(`${OUT}/404.html`, notFoundHtml);

// CSP meta on every HTML file (S3 website hosting cannot send response headers).
const htmlFiles = [];
const walk = (d) => readdirSync(d).forEach((f) => {
  const p = join(d, f);
  if (statSync(p).isDirectory()) walk(p); else if (f.endsWith(".html")) htmlFiles.push(p);
});
walk(OUT);
for (const file of htmlFiles) {
  let html = readFileSync(file, "utf8");
  const hashes = new Set();
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    if (m[1]) hashes.add(`'sha256-${createHash("sha256").update(m[1].replace(/\r\n?/g, "\n").replace(/\0/g, "\uFFFD"), "utf8").digest("base64")}'`);
  }
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'wasm-unsafe-eval' ${[...hashes].join(" ")}`.trim(),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "media-src 'self'",
    "font-src 'self' data:",
    "connect-src 'self' data: blob:",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
  ].join("; ");
  html = html.replace(/<head>/, `<head><meta http-equiv="Content-Security-Policy" content="${csp}"/>`);
  writeFileSync(file, html);
}

writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`).join("\n")}
</urlset>
`);
writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log(`Static site ready in ${OUT}/ for ${SITE_URL}`);
