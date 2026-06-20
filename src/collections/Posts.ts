import type { CollectionConfig } from 'payload'

/** 공지·작업사례 게시판 — 글 + 사진 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: '게시글', plural: '공지·작업사례' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt'],
    group: '콘텐츠 관리',
  },
  access: {
    read: () => true,
  },
  defaultSort: '-publishedAt',
  fields: [
    {
      name: 'title',
      label: '제목',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      label: '분류',
      type: 'select',
      required: true,
      defaultValue: 'work',
      options: [
        { label: '공지사항', value: 'notice' },
        { label: '작업사례', value: 'work' },
      ],
    },
    {
      name: 'publishedAt',
      label: '게시일',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' } },
    },
    {
      name: 'coverImage',
      label: '대표 사진',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'body',
      label: '본문',
      type: 'richText',
    },
    {
      name: 'images',
      label: '추가 사진',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
  ],
}
