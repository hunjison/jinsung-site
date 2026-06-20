/**
 * 진성레이져 회사 정보 및 사이트 전역 상수.
 * 푸터 · 오시는 길 · 메타데이터 등 여러 곳에서 단일 출처로 사용한다.
 * (실데이터: jinsung.md)
 */

export const site = {
  name: '진성레이져',
  alias: '진성스텐',
  ceo: '장성진',
  region: '강원도 원주',
  tagline: '스텐·철·알루미늄 파이프·판재 레이저 정밀 가공·주문제작',
  description:
    '강원도 원주의 레이저 가공 전문 진성레이져입니다. 스텐·철·알루미늄 파이프 및 판재를 정밀 레이저 가공하고, 난간·방범창·사다리·조형물 등 각종 제품을 도면 작업부터 제작까지 주문 제작합니다.',
  address: '강원특별자치도 원주시 흥업면 봉현길 142',
  tel: '033-734-8801',
  fax: '033-734-8808',
  email: 'sjj0544@naver.com',
  kakaoId: 'jang5008',
  bizNo: '411-24-21517',
  mailOrder: '신고면제',
  // 지도 fallback 중심 좌표 (흥업면 봉현길 인근 근사값).
  // 카카오맵은 아래 주소를 직접 지오코딩해 마커를 정확히 찍고, 실패 시에만 이 좌표 사용.
  geo: { lat: 37.2746, lng: 127.9156 },
  links: {
    cafe: 'https://cafe.naver.com/jinsungstill3634',
    blog: 'https://blog.naver.com/wkdrhkdwns01',
    youtube: 'https://www.youtube.com/@진성레이져',
  },
} as const

/** 전화 걸기용 tel: 링크 (숫자만) */
export const telHref = `tel:${site.tel.replace(/[^0-9]/g, '')}`

/** 상단/하단 내비게이션 */
export const nav = [
  { href: '/', label: '홈' },
  { href: '/about', label: '회사소개' },
  { href: '/products', label: '제품·가공' },
  { href: '/videos', label: '동영상' },
  { href: '/board', label: '공지·작업사례' },
  { href: '/location', label: '오시는 길' },
] as const

/** 홈/회사소개에서 노출할 핵심 강점 */
export const strengths = [
  {
    title: '도면부터 주문제작',
    desc: '난간·방범창·조형물 등 원하는 형태를 도면 작업부터 제작·출고까지 책임집니다.',
  },
  {
    title: '다양한 소재 대응',
    desc: '스텐(스테인리스)·철·알루미늄까지 한 곳에서 레이저 가공이 가능합니다.',
  },
  {
    title: '후판·정밀 가공',
    desc: '스텐 12T~20T 두께 절단과 정밀 홀 타공, 용접까지 처리합니다.',
  },
  {
    title: '파이프 + 판재 레이저',
    desc: '파이프레이저와 판(평철)레이저를 모두 보유해 폭넓은 형상을 가공합니다.',
  },
] as const

/**
 * 제품/가공 카테고리 — 관리자가 실제 제품(사진)을 올리기 전까지의 기본 구성이자
 * 제품 페이지의 분류 기준. (실데이터 기반)
 */
export const productCategories = [
  {
    slug: 'pipe-laser',
    name: '파이프 레이저 가공',
    desc: '원형·각형 파이프 절단 및 홀 타공. 앵글·ㄷ형강 등 형강 가공도 가능합니다.',
  },
  {
    slug: 'plate-laser',
    name: '판(평철) 레이저 가공',
    desc: '스텐·철 평철 및 판재 레이저 절단. 후판(12T~20T) 가공과 용접까지.',
  },
  {
    slug: 'railing',
    name: '스텐 난간·난간대',
    desc: '계단·발코니용 스텐 난간 및 난간대 주문제작.',
  },
  {
    slug: 'security',
    name: '방범창·발코니',
    desc: '스텐 방범창, 발코니 난간 등 안전·외장 제품 제작.',
  },
  {
    slug: 'ladder',
    name: '사다리·안전망 사다리',
    desc: '스텐 사다리, 안전망(보호망) 사다리 제작.',
  },
  {
    slug: 'custom',
    name: '주문제작',
    desc: '화분대·자전거 거치대·조형물·국기봉·디자인 펜스·키링/간판 등 각종 주문제작.',
  },
] as const
