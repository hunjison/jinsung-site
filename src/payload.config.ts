import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { ko } from '@payloadcms/translations/languages/ko'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Videos } from './collections/Videos'
import { Posts } from './collections/Posts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · 진성레이져 관리자',
    },
  },
  collections: [Products, Videos, Posts, Media, Users],
  editor: lexicalEditor(),
  i18n: {
    fallbackLanguage: 'ko',
    supportedLanguages: { ko },
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./jinsung.db',
    },
    // 개발: 자동 push로 스키마 동기화 / 프로덕션: 컨테이너 시작 시 `payload migrate` 적용
    // (마이그레이션 파일: src/migrations)
  }),
  sharp,
  plugins: [],
  // 첫 실행 시 관리자 계정이 없으면 .env 값으로 고정 관리자 1명을 생성
  onInit: async (payload) => {
    const { totalDocs } = await payload.count({ collection: 'users' })
    if (totalDocs > 0) return
    const email = process.env.PAYLOAD_ADMIN_EMAIL
    const password = process.env.PAYLOAD_ADMIN_PASSWORD
    if (!email || !password) {
      payload.logger.warn('PAYLOAD_ADMIN_EMAIL/PASSWORD 미설정 — 관리자 자동 생성 건너뜀')
      return
    }
    await payload.create({
      collection: 'users',
      data: { email, password, name: '관리자' },
    })
    payload.logger.info(`관리자 계정 생성됨: ${email}`)
  },
})
