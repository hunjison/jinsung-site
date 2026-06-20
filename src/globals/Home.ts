import type { GlobalConfig } from 'payload'

/** 홈 화면 설정 (단일) — 관리자에서 히어로 배경 동영상을 교체 */
export const Home: GlobalConfig = {
  slug: 'home',
  label: '홈 화면',
  admin: {
    group: '설정',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroVideo',
      label: '히어로 배경 동영상',
      type: 'upload',
      relationTo: 'hero-media',
      admin: {
        description:
          '메인 상단 배경에 재생할 동영상(mp4). 비워두면 기본 남색 배경이 표시됩니다.',
      },
    },
    {
      name: 'heroPoster',
      label: '동영상 로딩 전 표시 이미지 (선택)',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: '동영상이 로딩되기 전/재생 불가 시 보여줄 이미지.',
      },
    },
  ],
}
