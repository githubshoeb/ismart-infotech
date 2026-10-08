#!/usr/bin/env bash
# Build the static site and upload it to S3 behind CloudFront.
# Replace the placeholders (or export them) before running. Uses your local AWS CLI credentials.
set -euo pipefail
BUCKET_NAME="${BUCKET_NAME:-BUCKET_NAME}"
DISTRIBUTION_ID="${DISTRIBUTION_ID:-DISTRIBUTION_ID}"
: "${VITE_SITE_URL:?Set VITE_SITE_URL, e.g. https://www.yourdomain.com}"

npm ci
npm run build:static
OUT=static-site

# 1) Hashed assets: cache for a year.
aws s3 sync "$OUT/assets" "s3://$BUCKET_NAME/assets" --delete \
  --cache-control "public, max-age=31536000, immutable"

# 2) Everything else (HTML, sitemap, robots, favicon, fonts...): always revalidate.
aws s3 sync "$OUT" "s3://$BUCKET_NAME" --delete --exclude "assets/*" \
  --cache-control "no-cache"

# 3) Correct content types for special files.
fix_type() { # pattern content-type cache-control
  find "$OUT" -name "$1" -print0 | while IFS= read -r -d '' f; do
    key="${f#$OUT/}"
    aws s3 cp "$f" "s3://$BUCKET_NAME/$key" --content-type "$2" --cache-control "$3" --metadata-directive REPLACE
  done
}
fix_type "*.glb" "model/gltf-binary" "public, max-age=31536000, immutable"
fix_type "*.wasm" "application/wasm" "public, max-age=31536000, immutable"
fix_type "*.mp4" "video/mp4" "public, max-age=31536000, immutable"
fix_type "*.webmanifest" "application/manifest+json" "no-cache"
fix_type "*.html" "text/html; charset=utf-8" "no-cache"

# 4) Refresh CloudFront for the pages and SEO files.
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" \
  --paths "/" "/*.html" "/about*" "/services/*" "/contact*" "/privacy*" "/terms*" "/sitemap.xml" "/robots.txt" "/site.webmanifest"
echo "Deployed to s3://$BUCKET_NAME"
