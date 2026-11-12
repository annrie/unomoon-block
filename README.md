# unomoon-block

<p align="center">
  <!-- License -->
  <a href="LICENSE">
    <img src="https://img.shields.io/github/license/annrie/unomoon-block.svg" alt="License">
  </a>
  <!-- Stars -->
  <a href="https://github.com/annrie/unomoon-block/stargazers">
    <img src="https://img.shields.io/github/stars/annrie/unomoon-block.svg" alt="Stars">
  </a>
  <!-- Last commit -->
  <a href="https://github.com/annrie/unomoon-block/commits">
    <img src="https://img.shields.io/github/last-commit/annrie/unomoon-block.svg" alt="Last commit">
  </a>
</p>

WordPressブロックエディタ(Gutenberg)用のカスタム見出しブロックプラグイン。
[cielos](https://github.com/annrie/cielos)テーマ向けに、**29種類の装飾見出しスタイル**を提供します。
(リポジトリ名は歴史的経緯によるもので、対象テーマはcielosです)

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

### リリース版のzipを使う

[Releases](https://github.com/annrie/unomoon-block/releases) から `unomoon-block-<版>.zip` をダウンロードし、WordPress管理画面の
「プラグイン → 新規追加 → プラグインのアップロード」からインストールして有効化します。

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
pnpm release:patch --push   # changelogenでバンプ + CHANGELOG + タグ + push
```

changelogen は `uno-block.php` のヘッダーの `Version` を書き換えないので、リリースの前に次の版へ手で合わせます。
GitHub のリリースには `bash scripts/package.sh` で作った zip を `unomoon-block-<版>.zip` の名前で添付します。

## ライセンス

[MIT](./LICENSE)
