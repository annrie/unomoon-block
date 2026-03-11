# カスタム見出しブロックの作成手順（プラグイン版）

このドキュメントでは、プラグイン `unomoon-block` で複数の見出しスタイル（heading01-13）を選択可能な WordPress ブロックを作成する手順を説明します。

## 前提条件

- Node.js 18+ と pnpm がインストール済み
- `unomoon-block` プラグインがセットアップ済み
- Vite + UnoCSS 環境が動作中

## ブロック名について

テーマ版と競合を避けるため、プラグイン版とテーマ版は異なるブロック名を使用します：

| 版 | ブロック名 | フレームワーク |
|---|----------|--------------|
| プラグイン | `uno/heading` | React |
| テーマ | `uno/theme-heading` | Vue 3 |

---

## 手順 1: ブロックコンポーネントの作成

### 1.1 統一見出しブロック（全スタイル対応）

**`src/blocks/heading/index.jsx`**

```jsx
import { registerBlockType } from '@wordpress/blocks';
import {
  RichText,
  useBlockProps,
  BlockControls,
  InspectorControls,
} from '@wordpress/block-editor';
import {
  PanelBody,
  SelectControl,
  ToolbarGroup,
  ToolbarDropdownMenu,
  FontSizePicker,
} from '@wordpress/components';

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

// スタイルバリエーション（heading01〜heading13-9）
// ※ 定義は shortcuts/headings.ts で一元管理
const STYLE_OPTIONS = [
  { label: 'Heading 01（上下破線-切り取り線）', value: 'heading01' },
  { label: 'Heading 02（傾き文字幅-テープ）', value: 'heading02' },
  { label: 'Heading 03（傾き全幅-リボン）', value: 'heading03' },
  { label: 'Heading 03-2（左折り返し）', value: 'heading03-2' },
  { label: 'Heading 04（角丸下三角-吹き出し）', value: 'heading04' },
  { label: 'Heading 04-2（下三角塗り潰し）', value: 'heading04-2' },
  { label: 'Heading 04-3（下三角-枠つき）', value: 'heading04-3' },
  { label: 'Heading 05（装飾）', value: 'heading05' },
  { label: 'Heading 06（文字下線-付箋）', value: 'heading06' },
  { label: 'Heading 07（角丸なし左窪み-Depository）', value: 'heading07' },
  { label: 'Heading 08（左装飾Gracias）', value: 'heading08' },
  { label: 'Heading 09（左旗）', value: 'heading09' },
  { label: 'Heading 10（ピンマーク）', value: 'heading10' },
  { label: 'Heading 10-2（ピンマーク2）', value: 'heading10-2' },
  { label: 'Heading 10-3（ピンマーク3）', value: 'heading10-3' },
  { label: 'Heading 11（下ボーダー）', value: 'heading11' },
  { label: 'Heading 12（ワンポイント）', value: 'heading12' },
  { label: 'Heading 13（シンプル）', value: 'heading13' },
  { label: 'Heading 13-2（シンプル2）', value: 'heading13-2' },
  { label: 'Heading 13-3（枠シンプル）', value: 'heading13-3' },
  { label: 'Heading 13-4（枠シンプル2）', value: 'heading13-4' },
  { label: 'Heading 13-5（枠シンプル3）', value: 'heading13-5' },
  { label: 'Heading 13-6（枠塗り潰し）', value: 'heading13-6' },
  { label: 'Heading 13-7（枠シンプル4）', value: 'heading13-7' },
  { label: 'Heading 13-8（枠塗り潰し2-傾き）', value: 'heading13-8' },
  { label: 'Heading 13-9（枠シンプル5-下線のみ）', value: 'heading13-9' },
];

// フォントサイズプリセット（FontSizePicker用）
const FONT_SIZES = [
  { name: '小', slug: 'small', size: 14 },
  { name: '標準', slug: 'normal', size: 16 },
  { name: '中', slug: 'medium', size: 20 },
  { name: '大', slug: 'large', size: 24 },
  { name: '特大', slug: 'x-large', size: 32 },
  { name: '巨大', slug: 'huge', size: 48 },
];

registerBlockType('uno/heading', {
  title: 'Uno 見出し',
  description: 'スタイル選択可能な見出しブロック（プラグイン版）',
  icon: 'heading',
  category: 'text',
  keywords: ['heading', 'title', '見出し', 'uno'],

  attributes: {
    content: {
      type: 'string',
      source: 'html',
      selector: 'h1,h2,h3,h4,h5,h6',
    },
    level: {
      type: 'number',
      default: 2,
    },
    styleVariant: {
      type: 'string',
      default: 'heading10',
    },
    fontSize: {
      type: 'number',
    },
  },

  edit: ({ attributes, setAttributes }) => {
    const { content, level, styleVariant, fontSize } = attributes;
    const TagName = `h${level}`;

    const blockProps = useBlockProps({
      className: styleVariant,
      style: fontSize ? { fontSize: `${fontSize}px` } : {},
    });

    return (
      <>
        {/* 右パネル（InspectorControls） */}
        <InspectorControls>
          <PanelBody title="見出し設定" initialOpen={true}>
            <SelectControl
              label="スタイル"
              value={styleVariant}
              options={STYLE_OPTIONS}
              onChange={(value) => setAttributes({ styleVariant: value })}
            />
          </PanelBody>
          <PanelBody title="フォントサイズ" initialOpen={false}>
            <FontSizePicker
              fontSizes={FONT_SIZES}
              value={fontSize}
              onChange={(newFontSize) => setAttributes({ fontSize: newFontSize })}
              withSlider
            />
          </PanelBody>
        </InspectorControls>

        {/* ツールバー（見出しレベル選択） */}
        <BlockControls>
          <ToolbarGroup>
            <ToolbarDropdownMenu
              icon="heading"
              label="見出しレベル"
              controls={HEADING_LEVELS.map((lvl) => ({
                title: `H${lvl}`,
                isActive: level === lvl,
                onClick: () => setAttributes({ level: lvl }),
              }))}
            />
          </ToolbarGroup>
        </BlockControls>

        {/* エディタ表示 */}
        <RichText
          {...blockProps}
          tagName={TagName}
          value={content}
          onChange={(newContent) => setAttributes({ content: newContent })}
          placeholder="見出しを入力..."
        />
      </>
    );
  },

  save: ({ attributes }) => {
    const { content, level, styleVariant, fontSize } = attributes;
    const TagName = `h${level}`;

    const blockProps = useBlockProps.save({
      className: styleVariant,
      style: fontSize ? { fontSize: `${fontSize}px` } : {},
    });

    return (
      <TagName {...blockProps}>
        <RichText.Content value={content} />
      </TagName>
    );
  },
});
```

**ポイント**:
- `useBlockProps()` で WordPress の「高度な設定」のクラス・スタイルを取得
- `styleVariant` で見出しスタイルを選択
- `FontSizePicker` でスライダー付きフォントサイズ選択を提供
- `useBlockProps.save()` で保存時にもスタイルを適用

---

## 手順 2: UnoCSS ショートカットの設定

### 2.1 スタイル定義の構成

見出しスタイルは **`shortcuts/headings.ts`** で一元管理されています：

```
プラグイン版: unomoon-block/shortcuts/headings.ts
テーマ版: unomoon/shortcuts/headings.ts（内容は同一）
```

### 2.2 uno.config.ts でインポート

**`uno.config.ts`**

```typescript
import { headingShortcuts } from './shortcuts/headings';

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600 no-underline'],
    ['flex-center', 'flex justify-center items-center'],
    // heading01〜heading13-9 は shortcuts/headings.ts で定義
    ...headingShortcuts,
  ],

  // safelist に追加（動的クラス用）
  safelist: [
    'heading01', 'heading02', 'heading03', 'heading03-2',
    'heading04', 'heading04-2', 'heading04-3',
    'heading05', 'heading06', 'heading06-label',
    'heading07', 'heading08', 'heading08-2',
    'heading09', 'heading09-2',
    'heading10', 'heading10-2', 'heading10-3',
    'heading11', 'heading12',
    'heading13', 'heading13-2', 'heading13-3', 'heading13-4', 'heading13-5',
    'heading13-6', 'heading13-7', 'heading13-8', 'heading13-9',
  ],
});
```

---

## 手順 3: CSS トークンの定義

### 3.1 トークンファイル

**`src/tokens.css`** にすべての見出しトークンが定義されています：

```css
:root {
  /* heading01 トークン */
  --hd01-fg: #333;
  --hd01-bg: #f5f5f5;
  /* ... */

  /* heading02 トークン */
  --hd02-bg: hsl(210 60% 95%);
  --hd02-fg: hsl(0 0% 20%);
  /* ... */

  /* heading10-3 トークン（ピン内部方式） */
  --hd10-3-pin-size: 12px;
  --hd10-3-pin-color: #e74c3c;
  --hd10-3-pin-x: 0.3em;
  --hd10-3-pin-y: 0.8em;
  --hd10-3-fg: #333;
  --hd10-3-bg: linear-gradient(180deg, #fff 0%, #f5f5f5 100%);
  --hd10-3-border: #ddd;
  /* ... */

  /* 他の見出しトークン（heading03-heading13-9） */
}

/* ダークモード対応 */
.dark {
  --hd01-fg: #eee;
  --hd01-bg: #2a2a2a;
  /* ... 他のダークモード値 ... */
}
```

### 3.2 エントリーポイントでインポート

**`src/index.jsx`**

```jsx
import { registerBlockType } from '@wordpress/blocks';
import 'virtual:uno.css';
import './tokens.css';  // トークンをインポート
import './style.scss';

// 見出しブロックをインポート
import './blocks/heading';
```

---

## 手順 4: ビルドとテスト

### 4.1 ビルド実行

```bash
cd wp-content/plugins/unomoon-block
pnpm build
```

### 4.2 出力確認

```
build/
├── index.asset.php
├── index.js
└── style-index.css
```

### 4.3 WordPress で確認

1. プラグイン「Uno Block」を有効化
2. 投稿/固定ページのブロックエディタを開く
3. ブロック挿入パネルで「Uno 見出し」を検索
4. ブロックを挿入
5. **ツールバー**: 見出しレベル（H1-H6）を選択
6. **右パネル**: 「見出し設定」→「スタイル」でスタイルを選択

---

## 手順 5: スタイルの追加（応用）

### 5.1 新しいスタイルを追加する手順

1. **`shortcuts/headings.ts`** にスタイル定義を追加：

```typescript
// shortcuts/headings.ts
export const headingShortcuts: UserShortcuts = [
  // ... 既存のスタイル
  [
    'heading14',
    `relative p-[0.8em] font-bold
     text-[var(--hd14-fg)]
     bg-[var(--hd14-bg)]
     border-2 border-solid border-[var(--hd14-bc)]`,
  ],
]
```

2. **`src/tokens.css`** にトークンを追加：

```css
:root {
  --hd14-fg: #333;
  --hd14-bg: #f0f0f0;
  --hd14-bc: #999;
}
.dark {
  --hd14-fg: #eee;
  --hd14-bg: #2a2a2a;
  --hd14-bc: #555;
}
```

3. **ブロックの `STYLE_OPTIONS`** に選択肢を追加：

```jsx
const STYLE_OPTIONS = [
  // ... 既存のスタイル
  { label: 'Heading 14（カスタム）', value: 'heading14' },
]
```

4. **`uno.config.ts` の `safelist`** に追加：

```typescript
safelist: [
  // ... 既存のクラス
  'heading14',
],
```

5. テーマ版も使用している場合は、同じ変更をテーマ版にも適用

---

## トラブルシューティング

### supports.typography を使わない理由

WordPress の `supports` 機能（`typography`, `color`, `spacing` など）を使用すると、ゴミクラスが生成される問題があります：

```html
<!-- NG: supports.typography を使用した場合 -->
<h2 class="wp-block-uno-heading 0 1 2 3 4 5 6 7 8 typography text-h2" style="font-size:36px">
```

**解決策**: `supports` を使用せず、カスタム `FontSizePicker` で実装してください。

### スタイルが適用されない

1. **safelist 確認**: 動的クラス名は safelist に追加が必要
2. **トークン確認**: CSS カスタムプロパティが定義されているか
3. **ビルド再実行**: `pnpm build` でアセットを再生成

### エディタでスタイルが見えない

1. `editor_style` が正しく登録されているか確認
2. UnoCSS の `content.pipeline.include` にエディタファイルが含まれているか

### WordPress 依存関係エラー

`index.asset.php` の dependencies を確認：

```php
<?php return array(
  'dependencies' => array('wp-blocks', 'wp-block-editor', 'wp-components'),
  'version' => '...'
);
```

---

## ファイル構成（完成形）

```
unomoon-block/
├── src/
│   ├── blocks/
│   │   └── heading/
│   │       └── index.jsx
│   ├── index.jsx        # エントリーポイント
│   ├── style.scss       # 追加スタイル
│   └── tokens.css       # CSS トークン（全見出し対応）
├── shortcuts/
│   └── headings.ts      # 見出しショートカット定義
├── build/               # ビルド出力
├── uno.config.ts        # UnoCSS 設定
├── vite.config.ts       # Vite 設定
├── package.json
└── uno-block.php        # プラグインメイン
```

---

## テーマ版との比較

| 項目 | プラグイン版 | テーマ版 |
|------|------------|---------|
| ブロック名 | `uno/heading` | `uno/theme-heading` |
| フレームワーク | React | Vue 3 |
| スタイル選択 | InspectorControls | InspectorControls |
| コンポーネント | RichText | contenteditable + ref |
| ビルド出力 | `build/` | `dist/` |
| マニフェスト | `index.asset.php` | `.vite/manifest.json` |
| スタイル定義 | `shortcuts/headings.ts` | `shortcuts/headings.ts` |
| トークン定義 | `src/tokens.css` | `src/assets/css/tokens.css` |

**注**: 2025-12-30 以降、テーマ版とプラグイン版で `shortcuts/headings.ts` の内容が統一されました。

---

## 参考リンク

- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [UnoCSS Documentation](https://unocss.dev/)
- [Vite Documentation](https://vitejs.dev/)
