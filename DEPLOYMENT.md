# Deployment (GCP + GitHub Actions)

このドキュメントは、GitHub Actions から Google Cloud Storage (GCS) に Astro の静的サイトをデプロイし、Cloud CDN を使って配信するための初期セットアップ手順です。キーレス運用（Workload Identity Federation: WIF）を前提にしています。

## 構成概要

- ビルド: GitHub Actions（Astro `npm run build`）
- 配信: GCS バケット（静的ファイル） + Cloud CDN（オプションでキャッシュ無効化）
- 認証: GitHub Actions ⇔ GCP を WIF でフェデレーション
- キャッシュ運用:
  - HTML: `Cache-Control: no-cache, max-age=0`
  - 静的アセット: `Cache-Control: public, max-age=31536000, immutable`

## 事前条件

- カスタムドメイン（例: `example.com`）
- GCP プロジェクト（請求有効）
- リポジトリの `astro.config.mjs` の `site` を本番ドメインに設定（RSS/Sitemapの絶対URLに使用）

## まずは「GCSのみ」で最速デプロイ（推奨の初期運用）

最短で公開するには、GCS バケットを公開読み取りにし、Web サイト設定（index/404）を有効化するだけで運用開始できます。

注意: 独自ドメインで HTTPS を使うにはロードバランサ（Cloud CDN を含む）経由が推奨です。GCS のカスタムドメイン直接マッピングは HTTP のみです。まずは GCS の公開 URL（`https://storage.googleapis.com/<BUCKET>/...`）での公開・検証から始め、後で CDN + LB に移行すると安全です。

1) バケット作成（未作成の場合）と公開読み取り付与

```bash
gcloud storage buckets create gs://${BUCKET_NAME} --project ${PROJECT_ID} --location=US --uniform-bucket-level-access
gcloud storage buckets add-iam-policy-binding gs://${BUCKET_NAME} \
  --member=allUsers --role=roles/storage.objectViewer
```

2) Web サイト設定（Index/404）

```bash
gsutil web set -m index.html -e 404.html gs://${BUCKET_NAME}
```

3) GitHub Actions の変数を設定後、`main` に push

CI がビルド、Deploy ワークフローが GCS に `dist` を同期し、HTML/アセットのキャッシュヘッダ付与と Web サイト設定を実行します。

4) 動作確認

- サイト: `https://storage.googleapis.com/${BUCKET_NAME}/index.html`
- ディレクトリインデックス（`/blog/` など）は `index.html` に解決されます
- 存在しないパスは `404.html` にリダイレクトされます

後で CDN を追加するときは、以下の「Cloud CDN（HTTPS ロードバランサ）」手順に進み、`CDN_URL_MAP_NAME` を GitHub Actions の Variables に追加するだけで移行できます。

## GCP セットアップ手順

以下は `gcloud` CLI を使った例です。プロジェクトID/ドメイン/リソース名は適宜置換してください。

1) プロジェクト/API 有効化

```bash
gcloud config set project <PROJECT_ID>
gcloud services enable \
  iam.googleapis.com \
  iamcredentials.googleapis.com \
  sts.googleapis.com \
  storage.googleapis.com \
  compute.googleapis.com
```

2) GCS バケット作成（静的配信用）

```bash
export PROJECT_ID=<PROJECT_ID>
export BUCKET_NAME=<your-public-bucket-name> # 例: example-com
gcloud storage buckets create gs://${BUCKET_NAME} --project ${PROJECT_ID} --location=US --uniform-bucket-level-access

# 必要に応じて公開読み取り（CDN経由配信ならLBの設定で制御するのが推奨）
# gcloud storage buckets add-iam-policy-binding gs://${BUCKET_NAME} \
#   --member=allUsers --role=roles/storage.objectViewer
```

3) Cloud CDN（HTTPS ロードバランサ + Backend Bucket）構築（任意・推奨）

- Backend Bucket を作成し CDN を有効化
- HTTPS ロードバランサを作成し、URL マップと証明書（Managed SSL）を紐付け
- ドメインの A レコードを LB のグローバルIPに向ける

参考: https://cloud.google.com/cdn/docs/setting-up-cdn-with-bucket?hl=ja

作成できた URL マップ名を `CDN_URL_MAP_NAME` として控えておきます（Actions のキャッシュ無効化で使用）。

4) Workload Identity Federation の設定（キーレス）

```bash
export SA_NAME=github-deployer
export SA_EMAIL=${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com
export POOL_ID=github-pool
export PROVIDER_ID=github-provider
export REPO="<GITHUB_OWNER>/<REPO_NAME>" # 例: tatsukikodama/homepage

# サービスアカウント作成
gcloud iam service-accounts create ${SA_NAME}

# 必要権限付与（最小権限）
# - オブジェクトのアップロード/メタ更新: roles/storage.objectAdmin
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member=serviceAccount:${SA_EMAIL} \
  --role=roles/storage.objectAdmin

# - CDN キャッシュ無効化（URL マップ）を行う場合のみ
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member=serviceAccount:${SA_EMAIL} \
  --role=roles/compute.loadBalancerAdmin

# ワークロードアイデンティティプール作成
gcloud iam workload-identity-pools create ${POOL_ID} \
  --project=${PROJECT_ID} --location=global \
  --display-name="GitHub Actions Pool"

# プロバイダ作成（GitHub OIDC）
gcloud iam workload-identity-pools providers create-oidc ${PROVIDER_ID} \
  --project=${PROJECT_ID} --location=global \
  --workload-identity-pool=${POOL_ID} \
  --display-name="GitHub OIDC" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# GitHub リポジトリから SA へアクトアズ許可
gcloud iam service-accounts add-iam-policy-binding ${SA_EMAIL} \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_ID}/locations/global/workloadIdentityPools/${POOL_ID}/attribute.repository/${REPO}"
```

この結果得られる値:

- WIF プロバイダ: `projects/${PROJECT_ID}/locations/global/workloadIdentityPools/${POOL_ID}/providers/${PROVIDER_ID}`
- SA メール: `${SA_EMAIL}`

## GitHub Actions の変数設定

リポジトリの Settings → Secrets and variables → Actions → Variables に以下を登録:

- `GCP_PROJECT_ID`: `<PROJECT_ID>`
- `GCS_BUCKET_NAME`: `<BUCKET_NAME>`
- `WIF_WORKLOAD_IDENTITY_PROVIDER`: `projects/.../workloadIdentityPools/.../providers/...`
- `WIF_SERVICE_ACCOUNT_EMAIL`: `${SA_EMAIL}`
- `CDN_URL_MAP_NAME`（任意）: Cloud CDN の URL マップ名（キャッシュ無効化する場合）

Secrets は不要（キーレス）です。

## ワークフローの動作

- `.github/workflows/ci.yml`: PR/Push で Astro のビルド検証
- `.github/workflows/deploy.yml`: `main` に Push でビルド→GCS へ同期→メタ更新→（任意で）CDN 無効化

## よくある確認ポイント

- `astro.config.mjs` の `site` が本番ドメインか
- GCS バケット名/URL マップ名のタイプミス
- `compute.googleapis.com` を有効化しているか（CDN 無効化を使う場合）
- DNS 切替（LB を使う場合）と証明書の発行完了

## ロール最小化メモ

- デプロイのみ: `roles/storage.objectAdmin`
- CDN 無効化も実施: 上記 + `roles/compute.loadBalancerAdmin`

必要に応じて専用 SA/環境別バケットを作成し、権限をより細かく分離してください。
