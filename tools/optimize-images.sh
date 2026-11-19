#!/bin/bash
# Make project photos fast to load.
# Run after adding or replacing photos:   bash tools/optimize-images.sh
#
# For every assets/img/projects/<id>/<name>.jpg it:
#   1. shrinks the JPG to max 1920px wide (fallback for old browsers)
#   2. creates <name>.webp      (1920px, used for big views + lightbox)
#   3. creates <name>-800.webp  (800px, used on phones and in cards)
# Needs: cwebp  (macOS: brew install webp)
set -euo pipefail
cd "$(dirname "$0")/../assets/img/projects"
command -v cwebp >/dev/null || { echo "cwebp not found — install with: brew install webp"; exit 1; }

n=0
for jpg in */*.jpg */*.jpeg; do
  [ -e "$jpg" ] || continue
  base="${jpg%.*}"
  # only redo work when the JPG is newer than its WebP versions
  if [ -e "$base.webp" ] && [ -e "$base-800.webp" ] && [ "$base.webp" -nt "$jpg" ]; then continue; fi

  w=$(sips -g pixelWidth "$jpg" | awk '/pixelWidth/ {print $2}')
  if [ "$w" -gt 1920 ]; then sips --resampleWidth 1920 -s formatOptions 80 "$jpg" >/dev/null; fi

  cwebp -quiet -q 72 -resize "$([ "$w" -gt 1920 ] && echo 1920 || echo "$w")" 0 "$jpg" -o "$base.webp"
  cwebp -quiet -q 70 -resize 800 0 "$jpg" -o "$base-800.webp"
  n=$((n+1)); echo "✓ $jpg"
done
echo "Done: $n photo(s) optimized."
