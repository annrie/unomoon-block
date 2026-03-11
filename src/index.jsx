import { registerBlockType } from '@wordpress/blocks';
import 'virtual:uno.css'; // UnoCSS styles
import './tokens.css';  // トークンをインポート
import './style.scss'; // フロントエンドおよびエディター用

// 個別ブロックをインポート
import './blocks/heading';

registerBlockType('uno/test-block', {
  title: 'Uno Test Block',
  icon: 'smiley',
  category: 'layout',

  edit: ({ className }) => (
    <div className={`${className} p-4 bg-green-500 text-white rounded`}>
      プラグイン側ブロック (Plugin-editor)
    </div>
  ),

  save: () => (
    <div className="p-4 bg-green-500 text-white rounded">
      プラグイン側ブロック (Plugin-frontend)
    </div>
  ),
});
