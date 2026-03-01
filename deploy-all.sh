#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ ! -f "${SCRIPT_DIR}/.deploy.env" ]; then
  echo "错误: 未找到 .deploy.env 配置文件，请参考 .deploy.env.example 创建"
  exit 1
fi
source "${SCRIPT_DIR}/.deploy.env"

SERVER="${DEPLOY_SERVER}"
REMOTE_DIR="${DEPLOY_REMOTE_DIR}"

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
