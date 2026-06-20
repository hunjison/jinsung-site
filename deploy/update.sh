#!/usr/bin/env bash
# 자동 배포: GitHub에 새 변경이 있으면 받아서 재배포 (cron이 주기적으로 실행).
set -e
cd /opt/jinsung-site
git fetch -q origin main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
if [ "$LOCAL" != "$REMOTE" ]; then
  echo "[$(date '+%F %T')] 변경 감지 → 배포 시작 ($REMOTE)"
  git pull -q origin main
  docker compose up -d --build
  echo "[$(date '+%F %T')] 배포 완료"
fi
