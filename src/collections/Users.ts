import type { CollectionConfig } from 'payload'

/** 관리자 계정 (고정 아이디/비밀번호로 운영) */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: '관리자', plural: '관리자' },
  admin: {
    useAsTitle: 'email',
    group: '설정',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      label: '이름',
      type: 'text',
    },
  ],
}
