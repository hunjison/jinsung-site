import type { CollectionConfig } from 'payload'

/** 동영상 — 유튜브 링크로 등록 (대용량 파일 저장 없음) */
export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: { singular: '동영상', plural: '동영상' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'order'],
    group: '콘텐츠 관리',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'title',
      label: '제목',
      type: 'text',
      required: true,
    },
    {
      name: 'youtubeUrl',
      label: '유튜브 주소',
      type: 'text',
      required: true,
      admin: {
        description: '예) https://www.youtube.com/watch?v=XXXX 또는 https://youtu.be/XXXX',
      },
      validate: (val: string | null | undefined) => {
        if (!val) return '유튜브 주소를 입력하세요.'
        return /youtu\.?be/.test(val) ? true : '올바른 유튜브 주소가 아닙니다.'
      },
    },
    {
      name: 'description',
      label: '설명',
      type: 'textarea',
    },
    {
      name: 'order',
      label: '정렬 순서',
      type: 'number',
      defaultValue: 0,
      admin: { description: '숫자가 작을수록 먼저 표시됩니다.' },
    },
  ],
}
