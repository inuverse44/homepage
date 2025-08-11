## 開発タスクボード

目的: 今後のCSSリファクタリングとTailwind CSS導入を中心に、作業を小さく安全に進めるためのタスク一覧。チェックボックスは自由に更新してください。

### 優先度: 高 (High)
- [ ] CSS方針の合意: 現状(グローバルCSS + 各コンポーネント`<style>`)を継続し、段階的にTailwind移行を検討する方針を明文化（AGENTS.mdに追記）
- [ ] robots.txt のSitemapを環境変数に合わせて出力（SITE_URLを使用）
- [ ] SEO確認: canonical/OGの生成がBASE_PATH対応になっているか再点検

### 優先度: 中 (Medium)
- [ ] Organisms追加: HeaderNav.astro, Footer.astro, PostGrid.astro
- [ ] ページ置換: index.astro / blog系で PostGrid を使用
- [ ] atoms拡充: Button.astro, Card.astro（必要になったら）
- [ ] コンポーネントのインラインスタイル削減を継続（global.css もしくは各` <style>` に集約）

### Tailwind CSS 導入（検討→導入→移行）
- [ ] 検討: Tailwind採用の判断材料整理（変更頻度、レスポンシブ/状態バリアント、学習/運用コスト）
- [ ] 導入: @astrojs/tailwind 追加、tailwind.config.js 作成、src/styles をエントリに
- [ ] デザイントークン: CSS変数をTailwindカスタムテーマにマッピング
- [ ] 移行: ナビ/フッター/カード/タグ等から段階的にユーティリティクラスへ置換
- [ ] ドキュメント: AGENTS.md に運用ルール（命名、適用範囲、共存方針）追記

### 品質とCI
- [ ] npm run check をCIのci.ymlに追加（型/コンテンツチェック）
- [ ] Lint導入検討（ESLint + @typescript-eslint、Astro ESLintプラグイン）
- [ ] 単体テスト: Vitestをセットアップし、src/lib/date.ts からサンプル追加
- [ ] e2e（任意）: Playwrightで重要ルート（/、/blog/、/tags/）のスモークテスト

### 運用/改善（任意）
- [ ] PRプレビュー検討（Draft PRでのビルド確認、コメントBotでのプレビューURL共有など運用でカバー）
- [ ] アクセシビリティ初期チェック（コントラスト、スキップリンク、altなど）
- [ ] パフォーマンス確認（画像サイズ、プリロード/プリフェッチの要否）

更新の目安: 小さくPR、npm run check / npm run build が通ること、UI変更多めのPRはスクショ添付。
