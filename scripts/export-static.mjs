// Copies the prerendered client build into static-site/ (the folder you upload to S3)
// and writes sitemap.xml + robots.txt from VITE_SITE_URL. The server bundle is not copied.
import { cpSync, rmSync, writeFileSync, existsSync, readFileSync } from "node:fs";

const env = existsSync(".env") ? readFileSync(".env", "utf8") : "";
const fromFile = env.match(/^VITE_SITE_URL=["']?([^"'\n]+)/m)?.[1];
const SITE_URL = (process.env.VITE_SITE_URL || fromFile || "https://www.example.com").replace(/\/$/, "");
const PAGES = ["/", "/about", "/services/cloud-infrastructure", "/services/software-development",
  "/services/digital-marketing", "/services/it-consulting-staffing", "/services/data-ai",
  "/services/security", "/contact", "/privacy", "/terms"];

const OUT = "static-site";
rmSync(OUT, { recursive: true, force: true });
cpSync("dist/client", OUT, { recursive: true });
for (const p of PAGES) {
  const file = p === "/" ? `${OUT}/index.html` : `${OUT}${p}/index.html`;
  if (!existsSync(file)) throw new Error(`Missing prerendered page: ${file}`);
}
// Render the styled 404 page once (build time only) and save it as 404.html.
const server = await import(new URL("../dist/server/index.mjs", import.meta.url).href);
const res = await (server.default ?? server).fetch(new Request("http://localhost/404-page-not-found"), {}, { waitUntil() {}, passThroughOnException() {} });
const notFoundHtml = await res.text();
if (!notFoundHtml.includes("<html")) throw new Error("Could not render 404.html");
writeFileSync(`${OUT}/404.html`, notFoundHtml);
writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.filter((p) => p !== "/404").map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`).join("\n")}
</urlset>
`);
writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log(`Static site ready in ${OUT}/ for ${SITE_URL}`);
