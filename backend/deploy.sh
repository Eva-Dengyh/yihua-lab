#!/bin/bash
# 服务器端执行的后端部署脚本
set -e

cd /opt/yihua-lab/backend

echo "[服务器] 安装 Python 依赖..."
uv venv .venv 2>/dev/null || true
uv pip install -r pyproject.toml
uv pip install gunicorn

echo "[服务器] 重启后端服务..."
cd /opt/yihua-lab
# 先通过 PM2 优雅停止，等待端口完全释放
pm2 stop backend 2>/dev/null || true
pm2 delete backend 2>/dev/null || true
sleep 2

# 确保端口已释放，若仍被占用则强制释放
if fuser 8000/tcp >/dev/null 2>&1; then
  echo "[服务器] 端口 8000 仍被占用，强制释放..."
  fuser -k 8000/tcp 2>/dev/null || true
  sleep 2
fi

pm2 start ecosystem.config.js --only backend
pm2 save

echo "[服务器] 后端服务已重启"
