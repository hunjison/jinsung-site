#!/usr/bin/env sh
# 진성레이져 데이터 백업 — SQLite DB + 업로드 이미지(볼륨)를 tar.gz로 저장.
# 사용: sh scripts/backup.sh   (cron 야간 등록 권장)
set -e

# compose 프로젝트명(=디렉터리명)에 따라 볼륨 접두사가 정해짐. 다르면 PROJECT 수정.
PROJECT="${PROJECT:-jinsung-site}"
STAMP=$(date +%Y%m%d-%H%M%S)
OUT="backups"
mkdir -p "$OUT"

docker run --rm \
  -v "${PROJECT}_app_data:/data:ro" \
  -v "${PROJECT}_app_media:/media:ro" \
  -v "$(pwd)/${OUT}:/backup" \
  alpine sh -c "tar czf /backup/jinsung-backup-${STAMP}.tar.gz -C / data media"

echo "백업 생성: ${OUT}/jinsung-backup-${STAMP}.tar.gz"

# 30일 이상 된 백업 자동 정리
find "$OUT" -name 'jinsung-backup-*.tar.gz' -mtime +30 -delete 2>/dev/null || true
