import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
// 업로드 파일 저장 위치 = 프로젝트 루트의 /media (배포 시 볼륨으로 마운트)
const mediaDir = path.resolve(dirname, '../../media')

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
    staticDir: mediaDir,
    // 한글 파일명 깨짐 방지 — 업로드 시 안전한 파일명으로 정규화
    imageSizes: [
      { name: 'thumbnail', width: 480, position: 'centre' },
      { name: 'card', width: 900, position: 'centre' },
      { name: 'large', width: 1600, position: 'centre' },
    ],
    focalPoint: false,
  },
}
