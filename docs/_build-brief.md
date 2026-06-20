# 진성레이져 사이트 — 페이지 개발 공통 브리핑 (에이전트 필독)

당신은 이미 골격이 갖춰진 Next.js 16 + Payload 3.85 프로젝트에서 **공개 페이지 1개**를 만든다.
프로젝트 루트: `/Users/hunjison/CRG/2026_jinsung/jinsung-site`

## 절대 규칙
- **당신에게 배정된 페이지 폴더 안에서만** 파일을 생성/수정한다. 페이지 전용 컴포넌트가 필요하면 그 폴더 안에 둔다.
- 다음 파일은 **절대 수정 금지**: `src/app/(frontend)/layout.tsx`, `src/app/(frontend)/styles.css`, `src/payload.config.ts`, `src/collections/*`, `src/lib/site.ts`, `src/components/site/*`, `package.json`.
- `npm install` / dev 서버 실행 / 빌드 **하지 말 것**. 파일만 작성한다. (검증은 오케스트레이터가 한다.)
- 새 npm 패키지 추가 금지. 이미 있는 것만 사용.
- 모든 텍스트는 **한국어**. 주 고객 40~60대 → 큰 글씨·높은 대비·넉넉한 여백. 본문 기본 18px는 전역 설정됨.
- 홈(`src/app/(frontend)/page.tsx`)의 톤/마크업 스타일을 **참고 기준**으로 삼아 일관성을 유지한다. 먼저 읽어볼 것.

## 디자인 시스템 (재사용)
공통 컴포넌트 (`@/components/site/...`):
- `Container({children, className?})` — 가로 폭 컨테이너 (max-w-6xl)
- `Section({children, className?, tone?: 'default'|'muted'|'brand', id?})` — 세로 여백 섹션. tone='muted'는 회색 배경, 'brand'는 네이비 배경+흰 글씨
- `SectionHeading({eyebrow?, title, description?, align?: 'center'|'left', invert?})` — 섹션 제목 블록. brand 배경 위에선 `invert`
- `PageHero({title, subtitle?})` — 내부 페이지 상단 띠 (홈 외 모든 페이지 상단에 사용 권장)

색상 토큰 (Tailwind 유틸 그대로 사용): `brand-50`~`brand-900`(네이비), `accent`/`accent-dark`(앰버 #e07b1f). 예: `bg-brand-800`, `text-brand-700`, `bg-accent`, `border-slate-200`.
스타일 관례: 카드 = `rounded-2xl border border-slate-200 bg-white p-7 shadow-sm`. 제목 `text-3xl sm:text-4xl`. 한글 줄바꿈은 전역 `word-break: keep-all` 적용됨.

## 회사 데이터 (`@/lib/site`에서 import — 하드코딩 말 것)
`site` 객체: `name`(진성레이져), `ceo`(장성진), `region`(강원도 원주), `tagline`, `description`, `address`(강원도 원주시 동화골길 25), `addressOld`, `tel`(033-734-8801), `fax`(033-734-8808), `email`, `kakaoId`, `bizNo`, `geo:{lat,lng}`, `links:{cafe,blog,youtube}`.
그 외 export: `telHref`(tel: 링크), `nav`, `strengths`, `productCategories`(slug/name/desc).

## Payload 데이터 읽기 (서버 컴포넌트)
```ts
import { getPayload } from 'payload'
import config from '@/payload.config'

const payload = await getPayload({ config })
const { docs } = await payload.find({
  collection: 'products', // 'videos' | 'posts'
  sort: 'order',          // posts는 '-publishedAt'
  limit: 100,
  depth: 1,               // 업로드(미디어) 관계를 객체로 채워줌
})
```
- 페이지는 항상 **빈 DB에서도 깨지지 않게** 한다(아직 관리자가 콘텐츠를 안 올림). 데이터가 없으면 적절한 안내/폴백을 보여준다.
- 동적 렌더가 필요하면 파일 상단에 `export const dynamic = 'force-dynamic'`를 둔다.

## 컬렉션 필드 모양
- **products**: `id`, `title`, `category`(값: pipe-laser|plate-laser|railing|security|ladder|custom), `summary`, `specs`, `images`(Media 객체 배열, hasMany), `featured`(bool), `order`(number)
- **videos**: `id`, `title`, `youtubeUrl`, `description`, `order`
- **posts**: `id`, `title`, `category`(notice|work), `publishedAt`(ISO), `coverImage`(Media 객체|null), `body`(Lexical richText), `images`(Media 객체 배열)
- **media(업로드 객체)**: `url`(string), `alt`, `width`, `height`, `sizes.thumbnail.url`, `sizes.card.url`, `sizes.large.url`

## 이미지 렌더링
- 간단·안정적으로 **plain `<img>`** 사용 (next/image 원격 설정 회피). 예:
  `<img src={img.sizes?.card?.url || img.url} alt={img.alt || ''} className="..." loading="lazy" />`
- 이미지가 없을 때를 위한 회색 플레이스홀더 블록을 둔다.

## 유튜브 임베드 (videos 페이지)
- `youtubeUrl`에서 video id를 추출해 `https://www.youtube.com/embed/<id>` iframe으로 임베드.
- `watch?v=`, `youtu.be/`, `/embed/`, `/shorts/` 형식을 모두 처리하는 헬퍼를 페이지 폴더 안에 작성.
- iframe은 16:9 반응형 래퍼(`aspect-video w-full`)로 감싼다.

## 리치텍스트 렌더링 (posts 본문)
```ts
import { RichText } from '@payloadcms/richtext-lexical/react'
// <RichText data={post.body} className="prose-ko" />  // body가 있을 때만
```
전역에 `.prose-ko` 클래스가 정의돼 있다.

## 메타데이터
각 페이지에 `export const metadata = { title: '회사소개' }` 처럼 한국어 title을 둔다(템플릿이 ` | 진성레이져`를 자동 부착).

작성이 끝나면, 만든 파일 목록과 빈 DB에서의 동작(폴백) 요약을 보고하라.
