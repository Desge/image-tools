#!/bin/bash
# ═══════════════════════════════════════════
# ImageTools — 停止脚本
# 停止开发服务器 (port 3000) 和静态预览服务器 (port 8080)
# ═══════════════════════════════════════════

set -e

echo "🛑 Stopping ImageTools servers..."

# 停止 Next.js 开发服务器 (port 3000)
if lsof -ti :3000 > /dev/null 2>&1; then
  echo "  → Killing process on port 3000..."
  kill $(lsof -ti :3000) 2>/dev/null || true
  echo "  ✅ Port 3000 freed."
else
  echo "  → Nothing on port 3000."
fi

# 停止静态预览服务器 (port 8080)
if lsof -ti :8080 > /dev/null 2>&1; then
  echo "  → Killing process on port 8080..."
  kill $(lsof -ti :8080) 2>/dev/null || true
  echo "  ✅ Port 8080 freed."
else
  echo "  → Nothing on port 8080."
fi

# 停止所有 node next 进程
NEXT_PIDS=$(pgrep -f "next dev" 2>/dev/null || true)
if [ -n "$NEXT_PIDS" ]; then
  echo "  → Stopping remaining next dev processes..."
  kill $NEXT_PIDS 2>/dev/null || true
  echo "  ✅ Done."
fi

echo "✅ All stopped."
