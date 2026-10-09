# Hosting on Amazon S3 static website hosting (no CloudFront)

## Build
```bash
VITE_SITE_URL=http://www.yourdomain.com npm run build:static
npm run preview:static   # optional local check at http://localhost:4173
```
Output folder `dist-static/` — plain static files only (no server code):
```
index.html, 404.html
about/index.html, contact/index.html, privacy/index.html, terms/index.html
services/{cloud-infrastructure,software-development,digital-marketing,it-consulting-staffing,data-ai,security}/index.html
assets/ (hashed JS/CSS/images/fonts/wasm)   fonts/   og-image.png
robots.txt, sitemap.xml, site.webmanifest, favicon.png
```
Every page is pre-rendered with its real content, title, description, canonical, Open Graph and Twitter tags, plus a Content-Security-Policy and referrer meta tag. All page URLs use the trailing-slash form (`/about/`).

`VITE_SITE_URL` drives every absolute URL (canonical, og:url, og:image, JSON-LD, sitemap, robots). It is `http://` because the S3 website endpoint has no HTTPS; switch to `https://` later by changing only this value and rebuilding.

`npm run build` still produces the normal Lovable build in `dist/`; `build:static` runs it and then assembles `dist-static/`.

**Only ever upload the contents of `dist-static/` to the bucket.** Everything in it becomes public.

## 1. Create the bucket
- For a custom domain the bucket name must equal the domain, e.g. `www.example.com`.
- Properties → **Static website hosting** → Enable. Index document: `index.html`. Error document: `404.html`.

## 2. Allow public reads
S3 website hosting requires public read access. For this bucket only:
- Permissions → **Block public access** → turn off.
- Permissions → **Bucket policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET_NAME/*"
    }
  ]
}
```
Replace `BUCKET_NAME` with your bucket name.

## 3. Custom domain
- Route 53: create an **A (Alias)** record for `www.example.com` pointing to the bucket's S3 website endpoint (or a CNAME at another DNS provider to `www.example.com.s3-website-REGION.amazonaws.com`).
- Need the bare domain too? Create a second bucket named `example.com`, enable static website hosting with **Redirect requests** to `www.example.com`, and alias `example.com` to it.

## Warning: HTTP only
The S3 website endpoint serves **HTTP only**. Browsers will show "Not secure". This setup cannot provide HTTPS, HSTS or response-header security policies; the HTML meta tags (CSP, referrer) are the only protections available.

## Deploy script
```bash
export BUCKET_NAME=www.yourdomain.com AWS_REGION=us-east-1 VITE_SITE_URL=http://www.yourdomain.com
./scripts/deploy-s3.sh
```
It runs `npm ci && npm run build:static`, gzips `.html .js .css .svg .json .wasm` in a temporary copy and uploads them with `Content-Encoding: gzip`, sets content types (incl. `.glb`, `.wasm`, `.mp4`, `.webmanifest`) and cache headers (`no-cache` for HTML, one year immutable for `assets/`, one day for everything else), deletes files that were removed, and prints the website endpoint. Credentials come from your local AWS CLI profile.

## Security policy note
The CSP's `script-src` includes `blob:` (beyond the requested list): the 3D badge text renderer starts a background worker that loads its code from a `blob:` URL, and the badges' text would not render without it.
