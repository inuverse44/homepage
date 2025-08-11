#!/usr/bin/env bash
set -euo pipefail

# Setup Workload Identity Federation (GitHub OIDC) and a deploy Service Account
# for GitHub Actions to deploy static assets to a GCS bucket.

# Defaults (override via env or pass as args)
PROJECT_ID=${PROJECT_ID:-inuverse-homepage}
BUCKET_NAME=${BUCKET_NAME:-inuverse-homepage}
REPO=${REPO:-inuverse44/homepage}
SA_NAME=${SA_NAME:-github-deployer}
POOL_ID=${POOL_ID:-github-pool}
PROVIDER_ID=${PROVIDER_ID:-github-provider}

echo "[Info] Using PROJECT_ID=${PROJECT_ID} BUCKET_NAME=${BUCKET_NAME} REPO=${REPO}"

command -v gcloud >/dev/null 2>&1 || { echo >&2 "gcloud is required"; exit 1; }

gcloud config set project "$PROJECT_ID"

echo "[Step] Enable required APIs"
gcloud services enable \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  sts.googleapis.com \
  storage.googleapis.com \
  compute.googleapis.com

echo "[Step] Create bucket if not exists: gs://${BUCKET_NAME}"
if ! gcloud storage buckets describe "gs://${BUCKET_NAME}" >/dev/null 2>&1; then
  gcloud storage buckets create "gs://${BUCKET_NAME}" --location=US --uniform-bucket-level-access
else
  echo "[Info] Bucket exists"
fi

echo "[Step] Create Service Account if not exists: ${SA_NAME}"
if ! gcloud iam service-accounts describe "${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" >/dev/null 2>&1; then
  gcloud iam service-accounts create "${SA_NAME}"
else
  echo "[Info] Service Account exists"
fi

SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo "[Step] Grant roles/storage.objectAdmin to ${SA_EMAIL}"
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.objectAdmin" >/dev/null

echo "[Step] Create WIF pool if not exists: ${POOL_ID}"
if ! gcloud iam workload-identity-pools describe "$POOL_ID" --location=global --project="$PROJECT_ID" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools create "$POOL_ID" \
    --project="$PROJECT_ID" --location=global \
    --display-name="GitHub Actions Pool"
else
  echo "[Info] WIF pool exists"
fi

echo "[Step] Create OIDC provider if not exists: ${PROVIDER_ID}"
if ! gcloud iam workload-identity-pools providers describe "$PROVIDER_ID" \
  --location=global --workload-identity-pool="$POOL_ID" --project="$PROJECT_ID" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_ID" \
    --project="$PROJECT_ID" --location=global \
    --workload-identity-pool="$POOL_ID" \
    --display-name="GitHub OIDC" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub"
else
  echo "[Info] OIDC provider exists"
fi

PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')

echo "[Step] Allow GitHub repo to impersonate SA via WIF"
gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --role=roles/iam.workloadIdentityUser \
  --member="principal://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/subject/repo/${REPO}:ref:refs/heads/main" >/dev/null

PROVIDER_NAME=$(gcloud iam workload-identity-pools providers describe "$PROVIDER_ID" \
  --location=global --workload-identity-pool="$POOL_ID" --project="$PROJECT_ID" --format='value(name)')

cat <<EOF

[Done]
- WIF provider: ${PROVIDER_NAME}
- Service Account: ${SA_EMAIL}

Next steps:
1) In GitHub repo Settings → Actions → Variables, set:
   - GCP_PROJECT_ID=${PROJECT_ID}
   - GCS_BUCKET_NAME=${BUCKET_NAME}
   - WIF_WORKLOAD_IDENTITY_PROVIDER=${PROVIDER_NAME}
   - WIF_SERVICE_ACCOUNT_EMAIL=${SA_EMAIL}
2) For GCS-only hosting (public read), run scripts/gcs-quick-hosting.sh
3) Push to main to deploy
EOF

