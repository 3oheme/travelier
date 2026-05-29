#!/usr/bin/env bash
# Upload all Place audio tracks to a Cloudflare R2 bucket.
#
# Prerequisites:
#   1. Create the R2 bucket in the Cloudflare dashboard:
#        Dashboard → R2 → Create bucket → name: travelier-audio
#   2. Enable public access on the bucket:
#        Dashboard → R2 → travelier-audio → Settings → Public Access → Allow Access
#   3. (Optional) Attach a custom domain under Public Access, e.g. audio.travelier.app
#   4. Install / authenticate wrangler:
#        npm install -g wrangler    (or: npx wrangler)
#        wrangler login
#
# Usage (run from repo root):
#   bash scripts/upload-audio-r2.sh [bucket-name]
#
# After upload, copy the bucket's public URL into _config.yml → r2_audio_base.

set -euo pipefail

BUCKET="${1:-travelier-audio}"
UPLOADED=0

echo "Uploading tracks to R2 bucket: ${BUCKET}"
echo "────────────────────────────────────────"

for track in assets/places/*/track.mp3; do
  if [ ! -f "$track" ]; then
    echo "  skip  $track (not found)"
    continue
  fi

  key="${track}"   # object key mirrors local path: assets/places/<id>/track.mp3
  size=$(du -sh "$track" | cut -f1)

  printf "  %-55s %s\n" "$key" "$size"

  wrangler r2 object put "${BUCKET}/${key}" \
    --file "${track}" \
    --content-type "audio/mpeg" \
    --remote

  UPLOADED=$((UPLOADED + 1))
done

echo "────────────────────────────────────────"
echo "Done. Uploaded: ${UPLOADED} tracks."
echo ""
echo "Next steps:"
echo "  1. Copy the bucket's public URL from the Cloudflare dashboard."
echo "  2. Paste it into _config.yml → r2_audio_base (no trailing slash)."
echo "  3. Deploy (git push or Cloudflare Pages trigger)."
