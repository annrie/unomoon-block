<?php
/*
Plugin Name: Uno Block
*/

//直接このファイルにアクセスされた場合は exit（セキュリティ対策）
defined( 'ABSPATH' ) || exit;

// 「wp-editor スクリプトを新しいウィジェットエディター (wp-edit-widgets または wp-customize-widgets) と一緒にエンキューしないでください」 のエラー解消のため
function uno_theme_support() {
    remove_theme_support( 'widgets-block-editor' );
}
add_action( 'after_setup_theme', 'uno_theme_support' );

//function my_enqueue_scripts() {
//      if ( is_customize_preview() || isset( $_GET['action'] ) && $_GET['action'] == 'customize' ) {
//          wp_enqueue_script( 'wp-editor' );
//      }
//  }
//  add_action( 'wp_enqueue_scripts', 'my_enqueue_scripts' );

function my_uno_block_enqueue() {
  //依存スクリプトの配列とバージョンが記述された index.asset.php をインクルード
  $asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');

  //ブロック用のスクリプト build/index.js を登録
  wp_register_script(
    'my_uno_block-script',
    plugins_url( 'build/index.js', __FILE__ ),
    $asset_file['dependencies'], //依存スクリプトの配列
    $asset_file['version'] //バージョン
  );

  //フロント&エディター用スタイル（UnoCSS で統一）
  wp_register_style(
    'my_uno_block-style',
    plugins_url( 'build/style-index.css', __FILE__ ),
    array(),
    filemtime( plugin_dir_path( __FILE__ ) . 'build/style-index.css' )
  );

  //ブロックタイプの登録
  register_block_type(
    'uno/test-block',
    array(
      //エディター用スクリプト
      'editor_script' => 'my_uno_block-script',
      //フロントとエディター用スタイル（UnoCSS で統一）
      'style' => 'my_uno_block-style',
      'editor_style' => 'my_uno_block-style',
    )
  );
}
add_action( 'init', 'my_uno_block_enqueue' );
