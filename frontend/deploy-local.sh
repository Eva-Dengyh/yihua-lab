#!/bin/bash
set -e

source "$(cd "$(dirname "$0")" && pwd)/../.deploy.env"

SERVER="${DEPLOY_SERVER}"
REMOTE_DIR="${DEPLOY_REMOTE_DIR}/frontend"
REMOTE_TMP="/tmp/yihua-lab-deploy/frontend"
BACKUP_DIR="${DEPLOY_REMOTE_DIR}/backups/frontend"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== [前端] 1/5 本地构建 ==="
cd "${SCRIPT_DIR}"
npm install
npm run build

echo "=== [前端] 2/5 上传构建产物到服务器 ==="
ssh ${SERVER} "mkdir -p ${REMOTE_TMP}"
rsync -avz --delete \
  --exclude='node_modules' \
  --exclude='.env*' \
  ./ ${SERVER}:${REMOTE_TMP}/

echo "=== [前端] 3/5 备份旧版本 ==="
ssh ${SERVER} << 'BACKUP_EOF'
  BACKUP_DIR="/opt/yihua-lab/backups/frontend"
  REMOTE_DIR="/opt/yihua-lab/frontend"
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  BACKUP_PATH="${BACKUP_DIR}/${TIMESTAMP}"

  mkdir -p "${BACKUP_PATH}"

  if [ -d "${REMOTE_DIR}" ]; then
    rsync -a --exclude='node_modules' "${REMOTE_DIR}/" "${BACKUP_PATH}/"
    echo "备份完成: ${BACKUP_PATH}"
  else
    echo "首次部署，无需备份"
  fi

  # 只保留最近 5 个备份
  cd "${BACKUP_DIR}" && ls -dt */ 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null || true
BACKUP_EOF

echo "=== [前端] 4/5 部署新代码并重启 ==="
ssh ${SERVER} << 'DEPLOY_EOF'
  REMOTE_DIR="/opt/yihua-lab/frontend"
  REMOTE_TMP="/tmp/yihua-lab-deploy/frontend"

  mkdir -p "${REMOTE_DIR}"

  # 保留 node_modules 和 .env，替换其余文件
  rsync -a --delete \
    --exclude='node_modules' \
    --exclude='.env*' \
    "${REMOTE_TMP}/" "${REMOTE_DIR}/"

  cd "${REMOTE_DIR}"
  npm install

  # 同步 PM2 配置并重启前端
  cd /opt/yihua-lab
  pm2 restart frontend 2>/dev/null || pm2 start ecosystem.config.js --only frontend
  pm2 save

  # 清理临时目录
  rm -rf "${REMOTE_TMP}"
DEPLOY_EOF

echo "=== [前端] 5/5 健康检查 ==="
sleep 3
HEALTH=$(ssh ${SERVER} "curl -sf http://127.0.0.1:3000 2>/dev/null | head -c 100" || echo "FAIL")

if [ "${HEALTH}" = "FAIL" ]; then
  echo "!!! 前端健康检查失败 !!!"
  echo ""
  read -p "是否回滚到上一版本？(y/N): " ROLLBACK
  if [ "${ROLLBACK}" = "y" ] || [ "${ROLLBACK}" = "Y" ]; then
    echo "开始回滚..."
    ssh ${SERVER} << 'ROLLBACK_EOF'
      BACKUP_DIR="/opt/yihua-lab/backups/frontend"
      REMOTE_DIR="/opt/yihua-lab/frontend"
      LATEST_BACKUP=$(ls -dt ${BACKUP_DIR}/*/ 2>/dev/null | head -1)

      if [ -n "${LATEST_BACKUP}" ]; then
        rsync -a --delete \
          --exclude='node_modules' \
          --exclude='.env*' \
          "${LATEST_BACKUP}/" "${REMOTE_DIR}/"
        cd "${REMOTE_DIR}" && npm install
        cd /opt/yihua-lab && pm2 restart frontend && pm2 save
        echo "回滚完成"
      else
        echo "没有可用的备份"
      fi
ROLLBACK_EOF
  fi
  exit 1
else
  echo "前端部署成功，服务运行正常"
fi
