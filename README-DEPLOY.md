# Deploying to AWS S3 + CloudFront

## Build
```bash
VITE_SITE_URL=https://www.yourdomain.com npm run build:static
npm run preview:static   # optional local check at http://localhost:4173
```
Output folder `static-site/` — static files only:
```
index.html, 404.html
about/index.html, contact/index.html, privacy/index.html, terms/index.html
services/{cloud-infrastructure,software-development,digital-marketing,it-consulting-staffing,data-ai,security}/index.html
assets/ (hashed JS/CSS/images/fonts)   fonts/   og-image.png
robots.txt, sitemap.xml, site.webmanifest, favicon.png
```
Every page is prerendered with its real content plus its own title, description, canonical, Open Graph and Twitter tags. `VITE_SITE_URL` drives every absolute URL (canonical, og:url, og:image, JSON-LD, sitemap, robots). Placeholder: `https://www.example.com`.

`npm run build` alone still produces the normal Lovable build in `dist/`. `build:static` runs it, then assembles `static-site/`. The server bundle is used once at build time to render `404.html` and is never uploaded.

## S3 bucket
- Private, Block Public Access ON, no S3 website hosting.
- Accessed only by CloudFront through Origin Access Control (OAC); apply the bucket policy CloudFront generates.

## CloudFront distribution
- Origin: the bucket's REST endpoint with OAC. Default root object: `index.html`.
- Viewer protocol policy: Redirect HTTP to HTTPS. ACM certificate (us-east-1) for your domain.
- **CloudFront Function (viewer request)** so clean URLs find the folder pages:
```js
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (!uri.includes('.')) {
    request.uri += '/index.html';
  }
  return request;
}
```
- **Custom error responses:** 403 and 404 → `/404.html`, response code **404**. Do not map errors to index.html with 200 — every real page exists as its own file.
- **Response headers policy:**
  - Strict-Transport-Security: `max-age=63072000; includeSubDomains; preload`
  - X-Content-Type-Options: `nosniff`
  - X-Frame-Options: `DENY`
  - Referrer-Policy: `strict-origin-when-cross-origin`
  - Content-Security-Policy (own domain only):
    `default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' data: blob:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`
    - `'unsafe-inline'` scripts: each page has small inline scripts (theme before first paint, page hydration data).
    - `'wasm-unsafe-eval'`, `blob:`: the 3D physics engine and the badge text renderer.
- **Caching:** `assets/*` → `public, max-age=31536000, immutable`; HTML and everything else → `no-cache`. The deploy script writes these as object metadata; use a cache policy that respects origin Cache-Control.

## Deploy script
```bash
export BUCKET_NAME=your-bucket DISTRIBUTION_ID=E123EXAMPLE VITE_SITE_URL=https://www.yourdomain.com
./scripts/deploy-s3.sh
```
Runs `npm ci` + `npm run build:static`, syncs with the cache headers above, sets content types for `.glb`, `.wasm`, `.mp4`, `.webmanifest` and `.html`, then creates a CloudFront invalidation. No credentials live in the repo; it uses your local AWS CLI profile.
