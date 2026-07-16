import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
import { presetWind4 } from '@unocss/preset-wind4';
import transformerCompileClass from '@unocss/transformer-compile-class';
import { presetHeroPatterns } from '@julr/unocss-preset-heropatterns';
import { presetExtra } from 'unocss-preset-extra';
import { animatedUno } from 'animated-unocss';
import { headingShortcuts } from './shortcuts/headings';

export default defineConfig({
  theme: {
    breakpoints: {
      sm: '320px',
      md: '640px',
      tb: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    colors: {
      white: '#fefefe',
      black: '#0a0a0a',
      primary: '#1779ba',
      secondary: '#767676',
      success: '#3adb76',
      warning: '#ffae00',
      alert: '#cc4b37',
    },
  },

  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600 no-underline'],
    ['flex-center', 'flex justify-center items-center'],
    // heading01〜heading13-9 は shortcuts/headings.ts で定義
    ...headingShortcuts,
  ],

  // safelist に追加（動的クラス用）
  // heading01〜heading13-9 を含める
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

  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons({ prefix: 'i-' }),
    presetTypography(),
    presetHeroPatterns(),
    presetExtra(),
    animatedUno(),
    presetWebFonts({}),
  ],

  transformers: [
    transformerDirectives({
      applyVariable: ['--at-apply', '--uno-apply', '--uno'],
    }),
    transformerVariantGroup(),
    transformerCompileClass(),
  ],

  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx?|mdx?|html|php)($|\?)/,
        'src/**/*.{js,jsx,ts,tsx}',
      ],
    },
  },
});
