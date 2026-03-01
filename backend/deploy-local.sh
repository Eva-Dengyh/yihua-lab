#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/../.deploy.env"

SERVER="${DEPLOY_SERVER}"
REMOTE_DIR="${DEPLOY_REMOTE_DIR}/backend"
REMOTE_TMP="/tmp/yihua-lab-deploy/backend"
BACKUP_DIR="${DEPLOY_REMOTE_DIR}/backups/backend"

echo "=== [后端] 1/4 上传代码到服务器临时目录 ==="
ssh ${SERVER} "mkdir -p ${REMOTE_TMP}"
rsync -avz --delete \
  --exclude='.venv' \
  --exclude='__pycache__' \
  --exclude='.env' \
  --exclude='*.pyc' \
  --exclude='.pytest_cache' \
  --exclude='deploy-local.sh' \
  backend/ ${SERVER}:${REMOTE_TMP}/

echo "=== [后端] 2/4 备份旧版本 ==="
ssh ${SERVER} << 'BACKUP_EOF'
  BACKUP_DIR="/opt/yihua-lab/backups/backend"
  REMOTE_DIR="/opt/yihua-lab/backend"
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  BACKUP_PATH="${BACKUP_DIR}/${TIMESTAMP}"

  mkdir -p "${BACKUP_PATH}"

  if [ -d "${REMOTE_DIR}" ]; then
    # 备份代码（排除 .venv）
    rsync -a --exclude='.venv' "${REMOTE_DIR}/" "${BACKUP_PATH}/"
    echo "备份完成: ${BACKUP_PATH}"
  else
    echo "首次部署，无需备份"
  fi

  # 只保留最近 5 个备份
  cd "${BACKUP_DIR}" && ls -dt */ 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null || true
BACKUP_EOF

echo "=== [后端] 3/4 部署新代码 ==="
ssh ${SERVER} << 'DEPLOY_EOF'
  REMOTE_DIR="/opt/yihua-lab/backend"
  REMOTE_TMP="/tmp/yihua-lab-deploy/backend"

  mkdir -p "${REMOTE_DIR}"

  # 保留 .env 和 .venv，替换其余文件
  rsync -a --delete \
    --exclude='.venv' \
    --exclude='.env' \
    "${REMOTE_TMP}/" "${REMOTE_DIR}/"

  # 执行服务器端部署脚本
  cd "${REMOTE_DIR}"
  bash deploy.sh

  # 清理临时目录
  rm -rf "${REMOTE_TMP}"
DEPLOY_EOF

echo "=== [后端] 4/4 健康检查 ==="
MAX_RETRIES=10
RETRY_INTERVAL=3
HEALTH="FAIL"
for i in $(seq 1 ${MAX_RETRIES}); do
  echo "  健康检查第 ${i}/${MAX_RETRIES} 次..."
  HEALTH=$(ssh ${SERVER} "curl -sf http://127.0.0.1:8000/api/health 2>/dev/null" || echo "FAIL")
  if [ "${HEALTH}" != "FAIL" ]; then
    break
  fi
  sleep ${RETRY_INTERVAL}
done

if [ "${HEALTH}" = "FAIL" ]; then
  echo "!!! 后端健康检查失败 !!!"
  echo ""
  read -p "是否回滚到上一版本？(y/N): " ROLLBACK
  if [ "${ROLLBACK}" = "y" ] || [ "${ROLLBACK}" = "Y" ]; then
    echo "开始回滚..."
    ssh ${SERVER} << 'ROLLBACK_EOF'
      BACKUP_DIR="/opt/yihua-lab/backups/backend"
      REMOTE_DIR="/opt/yihua-lab/backend"
      LATEST_BACKUP=$(ls -dt ${BACKUP_DIR}/*/ 2>/dev/null | head -1)

      if [ -n "${LATEST_BACKUP}" ]; then
        rsync -a --delete \
          --exclude='.venv' \
          --exclude='.env' \
          "${LATEST_BACKUP}/" "${REMOTE_DIR}/"
        cd "${REMOTE_DIR}" && bash deploy.sh
        echo "回滚完成"
      else
        echo "没有可用的备份"
      fi
ROLLBACK_EOF
  fi
  exit 1
else
  echo "后端部署成功，服务运行正常"
fi
