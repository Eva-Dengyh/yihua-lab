#!/bin/bash
# 服务器端执行的后端部署脚本
set -e

cd /opt/yihua-lab/backend

echo "[服务器] 安装 Python 依赖..."
uv venv .venv 2>/dev/null || true
uv pip install -r pyproject.toml
uv pip install gunicorn

echo "[服务器] 释放 8000 端口..."
fuser -k 8000/tcp 2>/dev/null || true
sleep 1

echo "[服务器] 重启后端服务..."
cd /opt/yihua-lab
pm2 delete backend 2>/dev/null || true
pm2 start ecosystem.config.js --only backend
pm2 save

echo "[服务器] 后端服务已重启"
