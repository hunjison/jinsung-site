# 진성레이져 웹사이트

강원 원주의 레이저 가공 전문 **진성레이져**의 회사 소개 웹사이트.
브로셔형(회사소개·제품·동영상·게시판·오시는 길) + 관리자(사진/동영상/게시글 등록).

## 기술 스택
- **Next.js 16** (App Router) + TypeScript + **Tailwind CSS v4**
- **Payload CMS 3** (관리자 패널 자동 생성, 한국어 UI) + **SQLite**
- 폰트: **Pretendard**(셀프 호스팅) · 지도: **KakaoMap**(키 없을 시 외부 지도 링크 폴백)
- 배포: **Docker Compose** (app + **Caddy** 자동 HTTPS), 데이터/이미지 볼륨 보존

## 로컬 개발
```bash
npm install
cp .env.example .env          # DATABASE_URI=file:./jinsung.db 그대로 사용
npm run dev                   # http://localhost:3000 , 관리자: /admin
npm run seed                  # (선택) 샘플 제품·게시글·동영상 채우기
```

## 주요 스크립트
| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (스키마 자동 동기화) |
| `npm run build` / `npm run start` | 프로덕션 빌드 / 실행 |
| `npm run seed` | 샘플 콘텐츠 시드(비어 있을 때만) |
| `npm run payload -- migrate` | 마이그레이션 적용(프로덕션 스키마 생성) |

## 콘텐츠 관리
`/admin` 로그인(고정 계정은 `.env`의 `PAYLOAD_ADMIN_EMAIL/PASSWORD`, 첫 실행 시 자동 생성) 후:
- **제품·가공**: 사진·규격 등록 · **동영상**: 유튜브 주소 입력 · **공지·작업사례**: 글+사진
- 회사소개·연락처 등 고정 정보는 코드(`src/lib/site.ts`)에서 관리

## 배포
서버 배포 절차는 **[DEPLOY.md](./DEPLOY.md)** 참고. 요약:
```bash
cp .env.example .env   # 값 채우기 (PAYLOAD_SECRET, 관리자 계정, DOMAIN, ACME_EMAIL 등)
docker compose up -d --build
```
컨테이너는 시작 시 `payload migrate`로 테이블을 생성한 뒤 서버를 기동하며,
Caddy가 도메인에 대해 HTTPS를 자동 발급한다. 백업은 `sh scripts/backup.sh`.

## 구조
```
src/
  app/(frontend)/   공개 페이지 (home, about, products, videos, board, location)
  app/(payload)/    Payload 관리자/API (자동 생성)
  collections/      Products, Videos, Posts, Media, Users
  components/site/   공통 UI (헤더·푸터·빠른연락 등)
  lib/site.ts       회사 정보·메뉴·강점·제품 카테고리 (단일 출처)
  migrations/       DB 마이그레이션
```
