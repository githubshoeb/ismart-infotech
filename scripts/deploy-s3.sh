#!/usr/bin/env bash
# Build the static site and upload it to an S3 bucket with static website hosting.
# No CloudFront. Uses your local AWS CLI credentials — none are stored in this repo.
# Usage: BUCKET_NAME=www.example.com AWS_REGION=us-east-1 VITE_SITE_URL=http://www.example.com ./scripts/deploy-s3.sh
set -euo pipefail
BUCKET_NAME="${BUCKET_NAME:-BUCKET_NAME}"
AWS_REGION="${AWS_REGION:-$(aws configure get region || echo us-east-1)}"
: "${VITE_SITE_URL:?Set VITE_SITE_URL, e.g. http://www.example.com}"
export VITE_SITE_URL

npm ci
npm run build:static
OUT=dist-static

# Temporary copy: gzip text files in place (keeping their names) so S3 serves them compressed.
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp -R "$OUT/." "$TMP/"
find "$TMP" -type f \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.svg' -o -name '*.json' -o -name '*.wasm' \) \
  -print0 | while IFS= read -r -d '' f; do gzip -9 -n -c "$f" > "$f.gz" && mv "$f.gz" "$f"; done

S3="s3://$BUCKET_NAME"
IMMUTABLE="public, max-age=31536000, immutable"
DAY="public, max-age=86400"
GZ=(--content-encoding gzip)

# upload <cache-control> <content-type> <gzip yes|no> <include patterns...>
upload() {
  local cc="$1" ct="$2" gz="$3"; shift 3
  local inc=(); for p in "$@"; do inc+=(--include "$p"); done
  local extra=(); [ "$gz" = yes ] && extra=("${GZ[@]}")
  aws s3 cp "$TMP" "$S3" --recursive --exclude "*" "${inc[@]}" \
    --cache-control "$cc" --content-type "$ct" "${extra[@]}" --metadata-directive REPLACE
}

# HTML: always revalidate.
upload "no-cache" "text/html; charset=utf-8" yes "*.html"
# Hashed build files in assets/: cache for a year.
for pair in "js:application/javascript" "css:text/css; charset=utf-8" "svg:image/svg+xml" \
            "json:application/json" "wasm:application/wasm"; do
  ext="${pair%%:*}"; ct="${pair#*:}"
  aws s3 cp "$TMP/assets" "$S3/assets" --recursive --exclude "*" --include "*.$ext" \
    --cache-control "$IMMUTABLE" --content-type "$ct" "${GZ[@]}" --metadata-directive REPLACE
  aws s3 cp "$TMP" "$S3" --recursive --exclude "*" --include "*.$ext" --exclude "assets/*" \
    --cache-control "$DAY" --content-type "$ct" "${GZ[@]}" --metadata-directive REPLACE
done
# Binary / uncompressed files.
for pair in "glb:model/gltf-binary" "mp4:video/mp4" "png:image/png" "jpg:image/jpeg" "jpeg:image/jpeg" \
            "webp:image/webp" "woff:font/woff" "woff2:font/woff2" "ttf:font/ttf" "hdr:application/octet-stream" "ico:image/x-icon"; do
  ext="${pair%%:*}"; ct="${pair#*:}"
  aws s3 cp "$TMP/assets" "$S3/assets" --recursive --exclude "*" --include "*.$ext" \
    --cache-control "$IMMUTABLE" --content-type "$ct" --metadata-directive REPLACE
  aws s3 cp "$TMP" "$S3" --recursive --exclude "*" --include "*.$ext" --exclude "assets/*" \
    --cache-control "$DAY" --content-type "$ct" --metadata-directive REPLACE
done
aws s3 cp "$TMP/site.webmanifest" "$S3/site.webmanifest" --content-type "application/manifest+json" --cache-control "$DAY"
aws s3 cp "$TMP/robots.txt" "$S3/robots.txt" --content-type "text/plain; charset=utf-8" --cache-control "$DAY"
aws s3 cp "$TMP/sitemap.xml" "$S3/sitemap.xml" --content-type "application/xml; charset=utf-8" --cache-control "$DAY"

# Remove files that no longer exist locally (sync --delete; uploads above already set metadata).
aws s3 sync "$TMP" "$S3" --delete --size-only --exclude "*" >/dev/null
aws s3 sync "$TMP" "$S3" --delete --dryrun | grep '^(dryrun) delete' | awk '{print $3}' | while read -r key; do
  aws s3 rm "$key"
done

echo "Deployed. Website endpoint: http://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com"
echo "(Some older regions use a dot instead: http://$BUCKET_NAME.s3-website.$AWS_REGION.amazonaws.com)"
