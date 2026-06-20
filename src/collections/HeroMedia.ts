import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
// 이미지와 같은 /media 볼륨에 저장 (배포 시 마운트)
const mediaDir = path.resolve(dirname, '../../media')

/** 홈 배경 등 동영상 파일 업로드 (mp4 등) */
export const HeroMedia: CollectionConfig = {
  slug: 'hero-media',
  labels: { singular: '배경 동영상', plural: '배경 동영상' },
  admin: {
    group: '콘텐츠 관리',
    description: 'mp4 등 동영상 파일. 홈 화면 배경에 사용됩니다. (권장: 10초 내외, 10MB 이하)',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: '설명',
      type: 'text',
    },
  ],
  upload: {
    staticDir: mediaDir,
    mimeTypes: ['video/*'],
  },
}
