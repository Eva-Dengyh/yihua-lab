#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVER="root@119.91.226.17"
REMOTE_DIR="/opt/yihua-lab"

echo "============================================"
echo "  yihua-lab 一键部署"
echo "============================================"
echo ""

# 同步 PM2 配置
echo ">>> 同步 PM2 配置"
echo "--------------------------------------------"
rsync -avz "${SCRIPT_DIR}/ecosystem.config.js" ${SERVER}:${REMOTE_DIR}/
echo ""

# 阶段一：后端部署
echo ">>> 阶段一：后端部署"
echo "--------------------------------------------"
bash "${SCRIPT_DIR}/backend/deploy-local.sh"
echo ""

# 阶段二：前端部署
echo ">>> 阶段二：前端部署"
echo "--------------------------------------------"
bash "${SCRIPT_DIR}/frontend/deploy-local.sh"
echo ""

echo "============================================"
echo "  全部部署完成！"
echo "============================================"
