# ホームページ仕様書

自己紹介＋ブログを中核とする静的サイトの仕様です。合意済みの決定事項に基づき、未決事項はTBDとして明記します。

## 1. ゴールと範囲
- 目的: 自己紹介とブログ発信（技術系、数式対応）
- 対象言語: 初版は日本語。英語は将来対応（URL・構造は多言語前提）
- MVP範囲:
  - トップ（自己紹介＋新着）
  - ブログ一覧（タグフィルタ、日付降順）
  - 記事詳細（数式・画像・コードハイライト）
  - タグ一覧/タグ詳細
  - ヘッダーにメール・SNSリンク
  - RSS/サイトマップ/OGP
  - 解析なし（後日追加可）
- 後日拡張: 検索、並び替えUI（新着/古い/タグ別）、英語版、軽量解析、プロジェクト一覧

## 2. 情報設計 / ルーティング
- 主要ページ
  - `/` トップ
  - `/blog/` ブログ一覧（ページネーションあり。例: `/blog/page/2/`）
  - `/blog/{slug}/` 記事詳細（公開URLはフラット）
  - `/tags/` タグ一覧
  - `/tags/{tag}/` タグ詳細（URLは小文字+ハイフン、エンコード対応）
  - 将来: `/en/...` 英語系ルート
- パンくず例: `Home > Blog > slug`
- 404ページ: `/404.html`

## 3. コンテンツモデル（Markdown）
- 配置: `content/{lang}/blog/{slug}/index.md`
- 同階層に関連画像を配置（相対パス参照）
- フロントマター（YAML）
  - 必須: `title: string`, `date: string(ISO8601)`
  - 任意: `tags: string[]`, `description: string`, `lang: 'ja'|'en'`, `updated: string(ISO8601)`, `hero: string(ルート相対を推奨)`, `draft: boolean`, `slugOverride: string`
  - 備考: 公開スラグはフォルダ名を既定とし、`slugOverride` 指定時に上書き。`slug` は予約語のため使用しない
- `hero` の用途（任意）
  - 記事のメインビジュアル画像のパス。推奨はルート相対（例: `/images/my-post-hero.webp`）。実体は `public/images/` 配下に配置する
  - 使用箇所: 記事詳細のヘッダー上部、一覧カードのサムネイル、OGP画像（記事個別OGPとして使用）
  - 推奨サイズ: 1200×630px（16:9〜1.91:1程度）。形式はWebP/AVIF優先、ロゴ/図はSVGも可
  - 備考: フロントマターから参照する都合上、`./hero.*` のような記事相対パスは既定では非推奨（高度な運用で対応可能）

### 3.1 画像パス運用ルール
- 記事固有の画像: 記事フォルダに同梱し、Markdownから相対パスで参照
  - 例: `content/ja/blog/my-post/index.md` から `![キャプション](./diagram.webp)`
- 共有画像（ロゴ、既定OG、アイコン等）: `public/images/` 配下に配置し、ルート相対パスで参照
  - 例: `/images/logo.svg`, `/og-default.png`
- hero画像の推奨配置: `public/images/` に配置し、`hero: "/images/<slug>-hero.webp"` のように指定（OGPの絶対URL化・レイアウト参照が安定）
- OGP用URL: ビルド時に `hero`（相対）を絶対URLへ解決（`https://example.com/blog/slug/hero.webp`）。なければ `/og-default.png` を使用
- 命名・形式: 小文字ケバブケース（`my-diagram-1.webp`）、WebP/AVIF優先、PNGは透過やイラストに、JPEGは写真に
- キャッシュ指針: `public/` 内のビルド生成アセットはハッシュ付きで長期キャッシュ。記事フォルダ内の画像は短期キャッシュ（必要に応じてファイル名にバージョンを付与）

### 3.2 ブログのファイル名・スラグ命名規則
- 目的: 読みやすく、安定し、重複しないURL/パスを保つ
- ディレクトリとファイル
  - 1記事=1フォルダ: `content/{lang}/blog/{slug}/`
  - 本文: `index.md` 固定
  - 記事内画像: フォルダ直下（例: `hero.webp`, `img-01.webp`）
- スラグ規則（公開URLにも使用）
  - 文字種: 英小文字・数字・ハイフンのみ（lowercase-kebab-case）
  - 生成: タイトルをもとに手動設定を推奨（日本語タイトルは英語/ローマ字に要約）。未指定時はフォルダ名を使用（必要なら `slugOverride` で上書き）
  - 整形: 空白/記号→`-`、連続ハイフン縮約、先頭末尾の`-`除去、長さは目安60文字以内
  - 例: `"はじめての投稿" → "first-post"`, `"TypeScript入門#1" → "typescript-intro-1"`
  - 衝突回避: ビルド時に一意性を検査。重複する場合は末尾に短いサフィックス（`-v2`, `-2025` など）
- 運用ポリシー
  - 公開後のスラグは極力変更しない（ブックマーク/SEO保護）。変更が必要な場合は旧URL→新URLへCDN/LBリダイレクトを設定
  - 下書き: `draft: true` をフロントマターに設定（フォルダ名はそのままでOK）
  - 予約語回避: `tags`, `blog`, `feed`, `sitemap`, `assets`, `images` 等はスラグに使用しない

- サンプル
  ```yaml
  ---
  title: "初めての投稿"
  date: "2025-08-10T09:00:00+09:00"
  tags: ["react", "typescript"]
  description: "React+TypeScriptで始めるブログ"
  lang: "ja"
  hero: "./hero.png"
  draft: false
  ---

  本文はMarkdownで書きます。$E=mc^2$ のような行内数式や、

  $$
  \int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
  $$

  のようなディスプレイ数式をKaTeXで描画します。
  ```

## 4. 機能要件
- ブログ一覧
  - 日付降順で並び替え（既定）
  - タグフィルタ（複数タグANDはTBD、初版は単一タグフィルタを想定）
  - ページネーション（件数は後述の非機能要件参照）
- タグ
  - タグ一覧で件数表示、タグ詳細で該当記事のみ表示
  - タグの正規化（小文字化、空白→ハイフン）
- 検索（将来）
  - ビルド時に軽量インデックス（タイトル/タグ/要約/本文の冒頭N文字）を生成
  - クライアント側で `mini-search`/`lunr` 等で全文検索
- 並び替え（将来）
  - UIで「新着順/古い順/タイトル順」切り替え
- 数式
  - `remark-math` + `rehype-katex` を採用
- コードハイライト
  - `Shiki`（ビルド時ハイライト）
- RSS/サイトマップ
  - `/feed.xml` と `/sitemap.xml` をビルド時生成
- OGP/Twitterカード
  - サイト共通OGP + 記事個別（title/description/heroがあれば差し替え）
- 国際化
  - 初版は日本語のみ。構造とURL規約は多言語前提（`/en/` 接頭）
- 連絡手段
  - メールリンク（`mailto:`）とSNSアイコン/リンク（X/GitHub/LinkedIn等）。専用Contactページは無し

## 5. デザイン / 品質
- トーン: シンプル・可読性重視、余白広め
- カラー: モノトーン基調＋アクセント1色（TBD）
- フォント: Noto Sans JP / UI、Noto Serif（数式時も破綻しにくい）、等幅は JetBrains Mono
- ダークモード: `prefers-color-scheme` 準拠、自動切替＋手動トグルは将来
- CSS実装方針: 初版は最小限のプレーンCSSで構築し、後日Tailwind CSSを導入予定（ユーティリティクラスで一貫したデザイン管理）
- アクセシビリティ: 見出し階層、コントラスト比 AA、キーボード操作、スキップリンク
- パフォーマンス目標（Lighthouse）: PWA要件は対象外、Performance/Accessibility/Best Practices/SEO いずれも 90+
- 初期バンドル目安（トップ）
  - HTML < 50KB、CSS < 30KB、JS < 70KB（Astro採用時は更に軽量化）
  - 画像は`loading=lazy`、適切な`srcset`/`sizes`

## 6. 技術アーキテクチャ
- Astro（SSG）とは: 静的サイトジェネレーター。Markdown/コンポーネントからビルド時に「完成済みの静的HTML」と最小限のJSを出力する。いわゆる“アイランドアーキテクチャ”で、必要な部分だけReact等をハイドレートできるため、SEO/OGPとパフォーマンスの両立がしやすい。
- 採用: Astro（SSG）＋ React + TypeScript
  - 理由: SEO/OGPに強く、Markdown（数式・コードハイライト）やタグ/RSSが実装容易
  - Reactは必要箇所のみハイドレーション（見た目はSPAに近い体験）

### 6.1 コンポーネント設計（Atomic Design 指針）
- レイヤ構成
  - Atoms: `Button`, `Icon`, `Heading`, `TextLink`, `Tag`
  - Molecules: `PostCard`, `TagList`, `SearchBox`（将来）, `Pagination`
  - Organisms: `Header`, `Footer`, `Article`（本文表示）, `PostList`
  - Templates: `BlogListTemplate`, `PostTemplate`
  - Pages: `src/pages`（Astroのルーティング）
- ディレクトリ例
  - `src/components/atoms/...`
  - `src/components/molecules/...`
  - `src/components/organisms/...`
  - `src/layouts/...`（テンプレート/レイアウト）
- 運用ガイド
  - 過剰分割は避け、まずはAtoms/Molecules/Organisms中心で開始し、必要に応じてTemplatesへ
  - 各コンポーネントはPropsを厳密に型付け（TypeScript）
  - スタイルは初版はプレーンCSS、後日Tailwind CSS導入（ユーティリティクラス化）。Tailwind導入後も責務はレイヤに沿って分割
  - 依存方向は上位→下位（Pages→Templates→Organisms→Molecules→Atoms）。下位から上位へは参照しない
  - 画像URLは上位（ページ/テンプレート）で決定し、下位にはURL/altをPropsで渡す
- ルーティング: 各ルートごとに静的HTMLを出力

## 7. ディレクトリ構成（提案）
```
.
├─ content/
│  └─ ja/
│     └─ blog/
│        └─ first-post/
│           └─ index.md
├─ public/            # 静的アセット（OG既定画像、faviconなど）
├─ src/
│  ├─ components/     # Reactコンポーネント
│  ├─ layouts/        # 記事/一覧レイアウト
│  ├─ pages/          # ルーティング（Astroのpages）
│  ├─ lib/            # Markdown/日付/タグユーティリティ
│  └─ styles/         # グローバルCSS
├─ package.json
└─ SPEC.md
```

## 8. フロントマター検証（SSG採用時）
- Content Collections + Zodスキーマで必須/型を検証
- スキーマ例（擬似）
  ```ts
  const Post = z.object({
    title: z.string(),
    date: z.string().datetime(),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
    lang: z.enum(['ja','en']).default('ja'),
    updated: z.string().datetime().optional(),
    hero: z.string().optional(),
    draft: z.boolean().default(false),
  })
  ```

## 9. 検索・並び替えの方針（将来）
- ビルド時に `posts.index.json` を生成（タイトル/タグ/日付/要約/パス）
- クライアントで `mini-search` を用い全文/前方一致検索
- 並び替えはクエリパラメータ（`?sort=new|old|title`）で制御

## 10. SEO/OGP/メタ
- ページ固有: `title`, `description`, `canonical`、記事は構造化データ `BlogPosting`
- 既定OGP: `public/og-default.png`。記事に `hero` があれば差し替え（`astro.config.mjs` の `site` を基準に絶対URLを生成）
- robots.txt と sitemap.xml をビルド時生成
  - RSS: `/feed.xml` を提供

## 11. デプロイ（GCP）
- 出力: `dist/` に静的ファイルを生成
- ホスティング: GCS + Cloud CDN
  - GCSバケット: `gs://<bucket-name>`（リージョン/マルチリージョンは`ASIA`系を想定）
  - ウェブサイト設定: `mainPageSuffix = index.html`、`notFoundPage = 404.html`
  - Cloud CDN/HTTPS: バケットの背後にCDN/HTTPSを構成（ロードバランサ or Cloud CDNバケットオリジン）
  - キャッシュ: 静的アセット(`*.css,*.js,*.png,*.svg`)は長期`Cache-Control: public,max-age=31536000,immutable`、HTMLは短期（例: `max-age=60`）
- ドメイン: Cloud DNSでA/AAAA、TLSはCDNで自動発行
- CI/CD（GitHub Actions → GCS）
  - 認証: `google-github-actions/auth` でWorkload Identity Federation or SAキー
  - 手順: checkout → Nodeセットアップ → インストール → ビルド → `gsutil -m rsync -r dist gs://<bucket>`

## 12. 非機能要件
- パフォーマンス: 前述のバンドル目安達成、画像最適化（WebP/AVIF優先）
- 可用性: 静的配信、CDNキャッシュで高可用
- セキュリティ: 依存性の監査、ヘッダー（`Content-Security-Policy` はCDN/LB側で付与検討）
- プライバシー: 初版は解析なし。後日、軽量解析（Plausible/Umami）追加可

## 13. アクセプタンス基準（MVP）
- ルート `/`, `/blog/`, `/blog/{slug}/`, `/tags/`, `/tags/{tag}/` が動作
- Markdown記事からタイトル・日付（必須）を読み取り、一覧/詳細に反映
- タグフィルタが機能（単一タグ）
- KaTeXで数式が正しく描画
- RSSとサイトマップが生成
- OGP（既定 or 個別hero）が埋め込まれる
- メールおよびSNSリンクがヘッダー/フッターに表示
- GCS上で配信できるビルド産物（`dist/`）を生成

## 14. 決定事項 / TBD
- 決定
  - 記事はMarkdownで管理、`title`と`date`は必須
  - タグで記事を絞り込み（初版は単一タグ）
  - 連絡はメールとSNSリンクのみ、Contactページなし
  - ホスティングはGCP（GCS+CDN）、CIはGitHub Actions
  - 記事URLはフラット（`/blog/{slug}/`）
  - RSSは生成する
  - 数式はKaTeXを採用
  - CSSは初版ミニマル、後日Tailwind CSS導入方針
- 採用
  - アーキテクチャ: Astro（SSG）＋React+TypeScript
  - 検索方針（実装は後日）: ビルド時インデックス＋クライアント検索
- TBD
  - 英語対応の開始時期と運用（翻訳方針）
  - タグフィルタのAND/OR仕様（将来）
  - ページネーションの1ページ件数（例: 10件）

---
本ドラフトへのコメント（修正/追加/削除）をいただければ、確定版に反映します。
