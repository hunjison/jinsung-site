import type { CollectionConfig } from 'payload'

/** 업로드 이미지 (제품·게시판 공용) */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: '이미지', plural: '이미지' },
  admin: {
    group: '콘텐츠 관리',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: '대체 텍스트 (검색·접근성)',
      type: 'text',
    },
  ],
  upload: {
    // 한글 파일명 깨짐 방지를 위해 업로드 파일명을 안전하게 정규화
    formatOptions: undefined,
    imageSizes: [
      { name: 'thumbnail', width: 480, height: undefined, position: 'centre' },
      { name: 'card', width: 900, height: undefined, position: 'centre' },
      { name: 'large', width: 1600, height: undefined, position: 'centre' },
    ],
    focalPoint: false,
  },
}
