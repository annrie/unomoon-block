# unomoon-block

WordPressブロックエディタ(Gutenberg)用のカスタム見出しブロックプラグイン。
[unomoon](https://github.com/annrie/unomoon)テーマ向けに、**29種類の装飾見出しスタイル**を提供します。

スタイルは[UnoCSS](https://unocss.dev/)のショートカットとして定義されており、ビルド時に必要なCSSだけが静的に生成されます(ランタイム依存なし)。

## 特徴

- 見出しレベル(h1〜h6)と装飾スタイルをブロックのツールバー/サイドバーから選択
- スタイル例: 切り取り線・テープ・リボン・吹き出し・付箋・ピンマーク・左旗・メタルプレート など29種
- フォントサイズピッカー対応(`FontSizePicker`)
- UnoCSS(presetWind4 + attributify + icons + typography ほか)によるユーティリティベースのスタイル定義
- Vite + `@vitejs/plugin-react`(WordPress element向けJSX)でビルド

## 必要環境

- WordPress 6.x
- ビルドには Node.js 22+ / pnpm 10+

## 開発

```bash
pnpm install
pnpm dev        # Vite開発サーバー
pnpm build      # build/ に index.js / index.asset.php / style-index.css を出力
pnpm lint       # ESLint
```

見出しスタイルの定義は `shortcuts/headings.ts`、デザイントークン(CSS変数)は `src/tokens.css` にあります。

## WordPressへの導入

### 配布用zipを作る

```bash
bash scripts/package.sh
```

`packaged/unomoon-block-YYYYMMDD.zip` が生成されるので、WordPress管理画面の
「プラグイン → 新規追加 → プラグインのアップロード」からインストールして有効化します。

### 開発環境で直接使う

このリポジトリを `wp-content/plugins/unomoon-block/` に配置し、`pnpm install && pnpm build` 後に有効化します。

## リリース

```bash
pnpm release:patch   # changelogenでバンプ + CHANGELOG + タグ
```

## ライセンス

[MIT](./LICENSE)
