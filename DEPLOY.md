# 진성레이져 사이트 배포 가이드

Next.js 16 + Payload CMS 3 + SQLite 단일 컨테이너 구성. 리버스 프록시 Caddy가 자동 HTTPS를 처리한다.
저비용·고안정 목표: 작은 VPS 1대 + Docker로 운영, 데이터는 볼륨에 보존, 야간 백업.

## 0. 준비물
- VPS 1대 (예: Vultr 서울 리전, 또는 가비아 클라우드). Ubuntu 22.04/24.04 권장, 1vCPU/1~2GB RAM 충분.
- 도메인 1개. DNS A 레코드를 VPS 공인 IP로 지정.
- (선택) 카카오맵 JavaScript 앱키 — 없으면 지도는 외부 지도앱 링크 폴백으로 동작.

## 1. 서버 기본 세팅 (Ubuntu 기준)
```bash
# Docker + compose 설치
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # 재로그인 후 적용

# 방화벽
sudo ufw allow OpenSSH && sudo ufw allow 80 && sudo ufw allow 443 && sudo ufw enable
```

## 2. 코드 배치
```bash
git clone <레포 주소> jinsung-site && cd jinsung-site
# 또는 압축본 업로드
```

## 3. 환경변수 (.env) 작성
`.env.example`를 복사해 `.env`로 만들고 값 채우기:
```bash
cp .env.example .env
```
- `PAYLOAD_SECRET` → `openssl rand -hex 32` 결과로 교체 (필수)
- `PAYLOAD_ADMIN_EMAIL` / `PAYLOAD_ADMIN_PASSWORD` → 관리자 고정 계정 (첫 실행 시 자동 생성)
- `SITE_URL` → `https://도메인`
- `DOMAIN` → 실제 도메인 (예: jinsung-laser.co.kr)
- `ACME_EMAIL` → 인증서 알림 받을 이메일
- `NEXT_PUBLIC_KAKAO_MAP_KEY` → 카카오맵 앱키 (선택)
> ⚠️ `DATABASE_URI`는 compose가 자동으로 `file:./data/jinsung.db`(볼륨)로 설정하므로 그대로 둬도 됨.

## 4. 실행
```bash
docker compose up -d --build
```
- 첫 빌드는 수 분 소요. 이후 `app`이 3000 포트로 뜨고, `caddy`가 80/443에서 HTTPS 종단.
- 도메인으로 접속 → 사이트, `/admin` → 관리자 로그인.

## 5. 관리자 사용
- `https://도메인/admin` 접속 → `.env`의 관리자 계정으로 로그인.
- **제품·가공 / 동영상 / 공지·작업사례**에 콘텐츠 등록. 동영상은 유튜브 주소만 붙여넣으면 됨.
- 이미지는 **이미지(Media)**에 업로드되어 제품/게시글에 연결.

## 6. 백업 (권장: 매일 새벽)
```bash
# 수동 1회
sh scripts/backup.sh         # backups/ 에 tar.gz 생성 (DB + 미디어)

# cron 등록 (매일 03:30)
( crontab -l 2>/dev/null; echo "30 3 * * * cd $(pwd) && sh scripts/backup.sh >> backups/backup.log 2>&1" ) | crontab -
```
복원: 컨테이너 정지 후 백업 tar.gz를 풀어 `app_data`/`app_media` 볼륨에 덮어쓰기.

## 7. 업데이트 / 운영
```bash
git pull && docker compose up -d --build   # 코드 갱신 재배포
docker compose logs -f app                  # 로그 확인
docker compose restart                      # 재시작 (데이터 유지)
```
- `restart: unless-stopped` 정책으로 서버 재부팅·크래시 시 자동 복구.

## 참고: 로컬 개발
```bash
npm install
cp .env.example .env   # 로컬은 DATABASE_URI=file:./jinsung.db 그대로
npm run dev            # http://localhost:3000  (admin: /admin)
```
