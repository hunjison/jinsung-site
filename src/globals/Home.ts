import type { GlobalConfig } from 'payload'

/** 홈 화면 설정 (단일) — 메인 뷰의 배경 영상·문구·강점/제품 카드를 모두 관리자에서 편집 */
export const Home: GlobalConfig = {
  slug: 'home',
  label: '홈 화면',
  admin: { group: '설정' },
  access: { read: () => true },
  fields: [
    {
      type: 'collapsible',
      label: '상단 히어로 (배경·문구)',
      fields: [
        {
          name: 'heroVideo',
          label: '히어로 배경 동영상',
          type: 'upload',
          relationTo: 'hero-media',
          admin: { description: '메인 상단 배경 동영상(mp4). 비우면 기본 남색 배경.' },
        },
        {
          name: 'heroPoster',
          label: '동영상 로딩 전 이미지 (선택)',
          type: 'upload',
          relationTo: 'media',
        },
        { name: 'heroEyebrow', label: '상단 작은 문구', type: 'text' },
        {
          name: 'heroTitle',
          label: '큰 제목 (엔터로 줄바꿈 가능)',
          type: 'textarea',
        },
        { name: 'heroSubtitle', label: '제목 아래 설명', type: 'textarea' },
      ],
    },
    {
      type: 'collapsible',
      label: '강점 섹션',
      fields: [
        { name: 'strengthsTitle', label: '섹션 제목', type: 'text' },
        { name: 'strengthsSubtitle', label: '섹션 설명', type: 'text' },
        {
          name: 'strengths',
          label: '강점 카드',
          type: 'array',
          admin: { description: '카드 추가/삭제·순서 변경 가능' },
          fields: [
            { name: 'title', label: '제목', type: 'text', required: true },
            { name: 'description', label: '설명', type: 'textarea' },
            { name: 'image', label: '사진', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: '제품·가공 분야 섹션',
      fields: [
        { name: 'productsTitle', label: '섹션 제목', type: 'text' },
        { name: 'productsSubtitle', label: '섹션 설명', type: 'text' },
        {
          name: 'productCards',
          label: '제품·가공 카드',
          type: 'array',
          admin: { description: '카드 추가/삭제·순서 변경 가능' },
          fields: [
            { name: 'title', label: '제목', type: 'text', required: true },
            { name: 'description', label: '설명', type: 'textarea' },
            { name: 'image', label: '사진', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: '동영상 안내 섹션',
      fields: [
        { name: 'videoTitle', label: '제목', type: 'text' },
        { name: 'videoSubtitle', label: '설명', type: 'text' },
      ],
    },
    {
      type: 'collapsible',
      label: '회사소개 — 보유 공정·설비 사진',
      fields: [
        {
          name: 'facilityImages',
          label: '시설/설비 사진',
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
          admin: {
            description:
              '회사소개 페이지의 ‘보유 공정·설비’ 옆에 표시됩니다. 비우면 ‘시설 사진 준비 중’으로 표시.',
          },
        },
      ],
    },
  ],
}
