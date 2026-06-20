import type { CollectionConfig } from 'payload'

/** 제품·가공 갤러리 — 관리자가 사진/규격과 함께 등록 */
export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: '제품', plural: '제품·가공' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'order'],
    group: '콘텐츠 관리',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'title',
      label: '제품명',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      label: '분류',
      type: 'select',
      required: true,
      defaultValue: 'custom',
      options: [
        { label: '파이프 레이저 가공', value: 'pipe-laser' },
        { label: '판(평철) 레이저 가공', value: 'plate-laser' },
        { label: '스텐 난간·난간대', value: 'railing' },
        { label: '방범창·발코니', value: 'security' },
        { label: '사다리·안전망사다리', value: 'ladder' },
        { label: '주문제작', value: 'custom' },
      ],
    },
    {
      name: 'summary',
      label: '간단 설명',
      type: 'textarea',
    },
    {
      name: 'specs',
      label: '규격 / 사양',
      type: 'textarea',
      admin: { description: '소재·두께·치수 등 자유롭게 작성' },
    },
    {
      name: 'images',
      label: '사진',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'featured',
      label: '대표 제품 (홈 노출)',
      type: 'checkbox',
      defaultValue: false,
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
