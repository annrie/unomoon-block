#!/bin/bash
# unomoon-block プラグインパッケージングスクリプト

set -e

# 変数設定
PLUGIN_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PLUGIN_NAME="unomoon-block"
DATE=$(date +%Y%m%d)
ARCHIVE_DIR="${PLUGIN_DIR}/packaged"
ARCHIVE_NAME="${PLUGIN_NAME}-${DATE}.zip"
TEMP_DIR="${ARCHIVE_DIR}/.temp-${PLUGIN_NAME}"

# 色付きログ
log_info() { echo -e "\033[1;34m[INFO]\033[0m $1"; }
log_success() { echo -e "\033[1;32m[SUCCESS]\033[0m $1"; }
log_error() { echo -e "\033[1;31m[ERROR]\033[0m $1"; }

# ビルド確認
if [ ! -d "${PLUGIN_DIR}/build" ]; then
  log_info "build/ が見つかりません。ビルドを実行します..."
  cd "${PLUGIN_DIR}" && pnpm build
fi

# packaged ディレクトリを作成
log_info "packaged ディレクトリを準備中..."
mkdir -p "${ARCHIVE_DIR}"

# 一時ディレクトリをクリーンアップ・作成
rm -rf "${TEMP_DIR}"
mkdir -p "${TEMP_DIR}/${PLUGIN_NAME}"

# 必要なファイルをコピー
log_info "プラグインファイルをコピー中..."

# メインPHPファイル
cp "${PLUGIN_DIR}/uno-block.php" "${TEMP_DIR}/${PLUGIN_NAME}/"
log_info "  - uno-block.php"

# index.php（セキュリティ用）
cp "${PLUGIN_DIR}/index.php" "${TEMP_DIR}/${PLUGIN_NAME}/"
log_info "  - index.php"

# build/ ディレクトリ
cp -R "${PLUGIN_DIR}/build" "${TEMP_DIR}/${PLUGIN_NAME}/"
log_info "  - build/"

# README があれば
if [ -f "${PLUGIN_DIR}/README.md" ]; then
  cp "${PLUGIN_DIR}/README.md" "${TEMP_DIR}/${PLUGIN_NAME}/"
  log_info "  - README.md"
fi

# 不要ファイル削除
find "${TEMP_DIR}" -name ".DS_Store" -delete 2>/dev/null || true
find "${TEMP_DIR}" -name "*.map" -delete 2>/dev/null || true

# ZIP 作成
log_info "ZIP アーカイブを作成中..."
cd "${TEMP_DIR}"
zip -rq "${ARCHIVE_DIR}/${ARCHIVE_NAME}" "${PLUGIN_NAME}"

# 一時ディレクトリをクリーンアップ
rm -rf "${TEMP_DIR}"

# 結果表示
log_success "プラグインパッケージ作成完了！"
echo ""
echo "  📦 ${ARCHIVE_DIR}/${ARCHIVE_NAME}"
echo ""

# ファイルサイズ表示
SIZE=$(du -h "${ARCHIVE_DIR}/${ARCHIVE_NAME}" | cut -f1)
echo "  サイズ: ${SIZE}"
echo ""

# 内容確認
echo "  含まれるファイル:"
unzip -l "${ARCHIVE_DIR}/${ARCHIVE_NAME}"
