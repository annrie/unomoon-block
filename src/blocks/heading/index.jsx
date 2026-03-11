  import { registerBlockType } from '@wordpress/blocks';
  import {
    RichText,
    useBlockProps,
    BlockControls,
    InspectorControls,  // ← 追加
  } from '@wordpress/block-editor';
  import {
    ToolbarGroup,
    ToolbarDropdownMenu,
    PanelBody,
    SelectControl,
    FontSizePicker,
  } from '@wordpress/components';

  const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

  // スタイル選択肢
  const HEADING_STYLES = [
	{ label: 'Heading 01（上下破線-切り取り線）', value: 'heading01' },
	{ label: 'Heading 02（傾き-テープ）', value: 'heading02' },
	{ label: 'Heading 03（傾き全幅-リボン）', value: 'heading03' },
	{ label: 'Heading 03-2（折り返し）', value: 'heading03-2' },
	{ label: 'Heading 04（角丸下三角-吹き出し）', value: 'heading04' },
	{ label: 'Heading 04-2（下三角塗り潰し）', value: 'heading04-2' },
	{ label: 'Heading 04-3（下三角-枠つき）', value: 'heading04-3' },
	{ label: 'Heading 05（装飾）', value: 'heading05' },
	{ label: 'Heading 06（文字下線-付箋）', value: 'heading06' },
	{ label: 'Heading 07（角丸なし左窪み-Depository）', value: 'heading07' },
	{ label: 'Heading 08（左装飾Gracias）', value: 'heading08' },
	{ label: 'Heading 08-2（左装飾Gracias+penアイコン）', value: 'heading08-2' },
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
    title: 'uno-heading',
    icon: 'heading',
    category: 'text',

    attributes: {
      content: { type: 'string', source: 'html', selector: 'h1,h2,h3,h4,h5,h6' },
      level: { type: 'number', default: 2 },
      style: { type: 'string', default: 'heading05' },
      fontSize: { type: 'number' },
    },

    edit: ({ attributes, setAttributes }) => {
      const { content, level, style, fontSize } = attributes;

      const blockProps = useBlockProps({
        className: style,
        style: fontSize ? { fontSize: `${fontSize}px` } : {},
      });

      return (
        <>
          {/* ツールバー（見出しレベル） */}
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

          {/* サイドバー（スタイル選択） */}
          <InspectorControls>
            <PanelBody title="見出しスタイル">
              <SelectControl
                label="スタイル"
                value={style}
                options={HEADING_STYLES}
                onChange={(newStyle) => setAttributes({ style: newStyle })}
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

          {/* 見出し本体 */}
          {style === 'heading06' ? (
            <div {...blockProps}>
              <RichText
                tagName="span"
                className="heading06-label"
                value={content}
                onChange={(newContent) => setAttributes({ content: newContent })}
                placeholder="見出しを入力..."
              />
            </div>
          ) : (
            <RichText
              {...blockProps}
              tagName={`h${level}`}
              value={content}
              onChange={(newContent) => setAttributes({ content: newContent })}
              placeholder="見出しを入力..."
            />
          )}
        </>
      );
    },

    save: ({ attributes }) => {
      const { content, level, style, fontSize } = attributes;

      const blockProps = useBlockProps.save({
        className: style,
        style: fontSize ? { fontSize: `${fontSize}px` } : {},
      });

      const Tag = `h${level}`;

      // heading06 の場合は span.heading06-label でラップ
      if (style === 'heading06') {
        // 既存の heading06-label span を除去（二重ラップ防止）
        const cleanContent = content
          ? content.replace(/<span[^>]*class="heading06-label"[^>]*>([\s\S]*?)<\/span>/gi, '$1')
          : '';
        return (
          <Tag {...blockProps}>
            <span className="heading06-label" dangerouslySetInnerHTML={{ __html: cleanContent }} />
          </Tag>
        );
      }

      return (
        <RichText.Content
          {...blockProps}
          tagName={Tag}
          value={content}
        />
      );
    },
  });
