#!/usr/bin/env bash
set -euo pipefail

# Prepare a GCS bucket for quick static website hosting (public read + website config).

PROJECT_ID=${PROJECT_ID:-inuverse-homepage}
BUCKET_NAME=${BUCKET_NAME:-inuverse-homepage}

echo "[Info] Using PROJECT_ID=${PROJECT_ID} BUCKET_NAME=${BUCKET_NAME}"

command -v gcloud >/dev/null 2>&1 || { echo >&2 "gcloud is required"; exit 1; }
gcloud config set project "$PROJECT_ID"

echo "[Step] Ensure bucket exists"
if ! gcloud storage buckets describe "gs://${BUCKET_NAME}" >/dev/null 2>&1; then
  gcloud storage buckets create "gs://${BUCKET_NAME}" --location=US --uniform-bucket-level-access
else
  echo "[Info] Bucket exists"
fi

echo "[Step] Make bucket objects publicly readable (viewer)"
gcloud storage buckets add-iam-policy-binding "gs://${BUCKET_NAME}" \
  --member=allUsers --role=roles/storage.objectViewer >/dev/null || true

echo "[Step] Website config: index.html / 404.html"
gsutil web set -m index.html -e 404.html "gs://${BUCKET_NAME}" >/dev/null || true

cat <<EOF

[Done] GCS website hosting ready.
Verify:
- https://storage.googleapis.com/${BUCKET_NAME}/index.html

Note: For custom domain + HTTPS, add Cloud CDN + HTTPS LB later.
EOF

