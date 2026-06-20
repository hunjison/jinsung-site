#!/usr/bin/env bash
# 자동 배포: 최신 코드를 받아 빌드. 빌드가 성공할 때만 '배포됨'으로 기록하므로,
# 빌드가 실패하면 다음 실행 때 자동으로 다시 시도한다.
set -e
cd /opt/jinsung-site
git fetch -q origin main
git pull -q origin main
CURRENT=$(git rev-parse HEAD)
LAST=$(cat .last-deployed 2>/dev/null || echo none)

if [ "$CURRENT" = "$LAST" ]; then
  exit 0   # 이미 이 커밋으로 배포 완료
fi

echo "[$(date '+%F %T')] 배포 시작 ($CURRENT)"
if docker compose up -d --build; then
  echo "$CURRENT" > .last-deployed
  echo "[$(date '+%F %T')] 배포 완료"
else
  echo "[$(date '+%F %T')] 빌드 실패 — 다음 실행에 재시도"
  exit 1
fi
