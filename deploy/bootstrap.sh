#!/usr/bin/env bash
# 진성레이져 사이트 — 콘솔 1줄 자동 배포 (SSH 불필요)
# 실행: curl -fsSL https://raw.githubusercontent.com/hunjison/jinsung-site/main/deploy/bootstrap.sh | bash
set -euo pipefail

REPO="https://github.com/hunjison/jinsung-site.git"
DIR="/opt/jinsung-site"

echo "==================================================="
echo " 진성레이져 사이트 배포 시작"
echo "==================================================="

echo "[1/5] 스왑(가상 메모리) 2GB 설정..."
if ! swapon --show 2>/dev/null | grep -q '/swapfile'; then
  fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo "  스왑 설정 완료"
else
  echo "  스왑 이미 있음, 건너뜀"
fi

echo "[2/5] Docker 설치..."
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
else
  echo "  Docker 이미 설치됨"
fi
apt-get update -y >/dev/null 2>&1 || true
command -v git >/dev/null 2>&1 || apt-get install -y git

echo "[3/5] 코드 내려받기..."
rm -rf "$DIR"
git clone --depth 1 "$REPO" "$DIR"
cd "$DIR"

echo "[4/5] 환경설정(.env) 생성..."
IP="$(curl -4 -s ifconfig.me 2>/dev/null || echo '')"
ADMIN_PW="$(openssl rand -base64 12 | tr -dc 'A-Za-z0-9' | cut -c1-14)"
SECRET="$(openssl rand -hex 32)"
cat > .env <<EOF
DATABASE_URI=file:./data/jinsung.db
PAYLOAD_SECRET=${SECRET}
PAYLOAD_ADMIN_EMAIL=admin@jinsung-laser.co.kr
PAYLOAD_ADMIN_PASSWORD=${ADMIN_PW}
SITE_URL=http://${IP}
NEXT_PUBLIC_KAKAO_MAP_KEY=
DOMAIN=:80
ACME_EMAIL=admin@example.com
EOF

echo "[5/5] 빌드 & 실행 (처음엔 수 분 걸립니다)..."
docker compose up -d --build

echo ""
echo "==================================================="
echo " ✅ 배포 완료!"
echo "---------------------------------------------------"
echo "  사이트 :  http://${IP}"
echo "  관리자 :  http://${IP}/admin"
echo "  아이디 :  admin@jinsung-laser.co.kr"
echo "  비밀번호:  ${ADMIN_PW}"
echo "---------------------------------------------------"
echo "  ⚠️  위 비밀번호를 꼭 메모하세요! (이 화면에서만 보입니다)"
echo "  도메인 연결(HTTPS)은 도메인 준비되면 안내드립니다."
echo "==================================================="
