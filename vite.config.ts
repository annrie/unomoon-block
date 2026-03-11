import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import UnoCSS from 'unocss/vite';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

// WordPress の外部依存関係マッピング
const wpExternals: Record<string, string> = {
  '@wordpress/blocks': 'wp.blocks',
  '@wordpress/element': 'wp.element',
  '@wordpress/components': 'wp.components',
  '@wordpress/i18n': 'wp.i18n',
  '@wordpress/data': 'wp.data',
  '@wordpress/block-editor': 'wp.blockEditor',
  '@wordpress/editor': 'wp.editor',
  '@wordpress/compose': 'wp.compose',
  '@wordpress/hooks': 'wp.hooks',
  '@wordpress/primitives': 'wp.primitives',
  'react': 'React',
  'react-dom': 'ReactDOM',
};

// WordPress 依存関係のハンドル名マッピング
const wpHandles: Record<string, string> = {
  '@wordpress/blocks': 'wp-blocks',
  '@wordpress/element': 'wp-element',
  '@wordpress/components': 'wp-components',
  '@wordpress/i18n': 'wp-i18n',
  '@wordpress/data': 'wp-data',
  '@wordpress/block-editor': 'wp-block-editor',
  '@wordpress/editor': 'wp-editor',
  '@wordpress/compose': 'wp-compose',
  '@wordpress/hooks': 'wp-hooks',
  '@wordpress/primitives': 'wp-primitives',
  'react': 'react',
  'react-dom': 'react-dom',
};

// index.asset.php を生成するカスタムプラグイン
function wpAssetPlugin(): Plugin {
  const dependencies = new Set<string>();

  return {
    name: 'wp-asset-generator',
    enforce: 'post',

    transform(code, id) {
      // ソースコード内の WordPress パッケージインポートを検出
      if (id.endsWith('.jsx') || id.endsWith('.tsx') || id.endsWith('.js') || id.endsWith('.ts')) {
        for (const pkg of Object.keys(wpExternals)) {
          if (code.includes(`from '${pkg}'`) || code.includes(`from "${pkg}"`)) {
            dependencies.add(wpHandles[pkg]);
          }
        }
      }
      return null;
    },

    generateBundle() {
      const buildDir = resolve(__dirname, 'build');
      if (!existsSync(buildDir)) {
        mkdirSync(buildDir, { recursive: true });
      }

      // index.asset.php を生成
      const depsArray = Array.from(dependencies).filter(d => d.startsWith('wp-'));
      const version = Date.now().toString(36);
      const phpContent = `<?php return array('dependencies' => array(${depsArray.map(d => `'${d}'`).join(', ')}), 'version' => '${version}');`;

      writeFileSync(resolve(buildDir, 'index.asset.php'), phpContent);
    },
  };
}

export default defineConfig({
  plugins: [
    UnoCSS(),
    react({
      jsxRuntime: 'classic', // WordPress は React 17+ の JSX トランスフォームを使用
    }),
    wpAssetPlugin(),
  ],

  build: {
    outDir: 'build',
    emptyDirBeforeWrite: true,
    sourcemap: false,
    minify: 'esbuild',

    lib: {
      entry: resolve(__dirname, 'src/index.jsx'),
      name: 'UnoBlock',
      formats: ['iife'],
      fileName: () => 'index.js',
    },

    rollupOptions: {
      external: Object.keys(wpExternals),
      output: {
        globals: wpExternals,
        assetFileNames: (assetInfo) => {
          // CSS ファイル名を WordPress 規約に合わせる
          if (assetInfo.name?.endsWith('.css')) {
            return 'style-index.css';
          }
          return assetInfo.name || 'assets/[name]-[hash][extname]';
        },
      },
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
