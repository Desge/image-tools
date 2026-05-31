#!/bin/bash
# ═══════════════════════════════════════════
# ImageTools — 启动脚本（开发模式）
# 用法: ./scripts/start.sh    → 启动开发服务器 (localhost:3000)
#       ./scripts/start.sh -p → 构建并启动生产预览 (localhost:8080)
#       ./scripts/start.sh -b → 仅构建
# ═══════════════════════════════════════════

set -e
cd "$(dirname "$0")/.."

case "${1:-dev}" in
  dev|-d)
    echo "🚀 Starting dev server on http://localhost:3000 ..."
    npm run dev
    ;;
  prod|-p)
    echo "📦 Building for production..."
    npm run build
    echo "✅ Build complete. Serving from out/ on http://localhost:8080 ..."
    npm run serve
    ;;
  build|-b)
    echo "📦 Building for production..."
    npm run build
    echo "✅ Build complete. Output: out/"
    ls -lh out/index.html
    ;;
  clean|-c)
    echo "🧹 Cleaning..."
    npm run clean
    echo "✅ Cleaned."
    ;;
  *)
    echo "Usage: ./scripts/start.sh [dev|prod|build|clean]"
    echo "  dev   - Start dev server (default)"
    echo "  prod  - Build & serve production preview"
    echo "  build - Build only"
    echo "  clean - Remove build artifacts"
    ;;
esac
