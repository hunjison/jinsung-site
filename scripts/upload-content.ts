/**
 * 2단계: content/manifest.json 을 Payload REST API로 업로드.
 * 로컬 검토:  BASE_URL=http://localhost:3000  ADMIN_PASSWORD=... npm run upload:content
 * 라이브:     BASE_URL=https://jinsunglaser.co.kr ADMIN_PASSWORD=... npm run upload:content
 * 멱등: 같은 제목/youtubeUrl 이미 있으면 건너뜀.
 */
import { readFileSync } from 'fs'
import { basename, join } from 'path'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const EMAIL = process.env.ADMIN_EMAIL || 'admin@jinsung-laser.co.kr'
const PASSWORD = process.env.ADMIN_PASSWORD || ''

if (!PASSWORD) {
  console.error('ADMIN_PASSWORD 환경변수가 필요합니다.')
  process.exit(1)
}

let token = ''
const mediaCache = new Map<string, number>()

function lexical(text: string) {
  const paras = text.split('\n').map((s) => s.trim()).filter(Boolean)
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: (paras.length ? paras : ['']).map((t) => ({
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: t, version: 1 }],
      })),
    },
  }
}

async function login() {
  const r = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const j = await r.json()
  if (!r.ok || !j.token) throw new Error('로그인 실패: ' + JSON.stringify(j).slice(0, 200))
  token = j.token
  console.log(`로그인 OK (${BASE})`)
}

async function exists(collection: string, field: string, value: string): Promise<boolean> {
  const u = `${BASE}/api/${collection}?where[${field}][equals]=${encodeURIComponent(value)}&limit=1&depth=0`
  const r = await fetch(u, { headers: { Authorization: `JWT ${token}` } })
  const j = await r.json()
  return (j.totalDocs || 0) > 0
}

async function create(collection: string, data: unknown): Promise<any> {
  const r = await fetch(`${BASE}/api/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
  })
  const j = await r.json()
  if (!r.ok) throw new Error(`${collection} 생성 실패: ` + JSON.stringify(j).slice(0, 300))
  return j.doc
}

async function uploadMedia(localPath: string, alt: string): Promise<number> {
  if (mediaCache.has(localPath)) return mediaCache.get(localPath)!
  const buf = readFileSync(join(process.cwd(), localPath))
  const fd = new FormData()
  fd.append('file', new Blob([buf], { type: 'image/jpeg' }), basename(localPath))
  fd.append('alt', alt)
  const r = await fetch(`${BASE}/api/media`, {
    method: 'POST',
    headers: { Authorization: `JWT ${token}` },
    body: fd,
  })
  const j = await r.json()
  if (!r.ok || !j.doc) throw new Error('이미지 업로드 실패: ' + JSON.stringify(j).slice(0, 200))
  mediaCache.set(localPath, j.doc.id)
  return j.doc.id
}

async function main() {
  const manifest = JSON.parse(readFileSync(join(process.cwd(), 'content/manifest.json'), 'utf8'))
  await login()

  // ── 동영상 ──
  let v = 0
  for (const vid of manifest.videos) {
    if (await exists('videos', 'youtubeUrl', vid.youtubeUrl)) continue
    await create('videos', { title: vid.title, youtubeUrl: vid.youtubeUrl, order: vid.order })
    v++
  }
  console.log(`동영상: ${v}개 추가`)

  // ── 게시글 ──
  let p = 0
  for (const post of manifest.posts) {
    if (await exists('posts', 'title', post.title)) continue
    const ids: number[] = []
    for (const img of post.images) {
      try {
        ids.push(await uploadMedia(img, post.title))
      } catch (e) {
        console.warn('  이미지 skip:', img, String(e).slice(0, 80))
      }
    }
    await create('posts', {
      title: post.title,
      category: post.category,
      publishedAt: post.publishedAt,
      coverImage: ids[0] ?? null,
      body: lexical(post.bodyText),
      images: ids.slice(1),
    })
    p++
    process.stdout.write('.')
  }
  console.log(`\n게시글: ${p}개 추가`)

  // ── 제품 ──
  let pr = 0
  for (const prod of manifest.products) {
    if (await exists('products', 'title', prod.title)) continue
    const ids: number[] = []
    for (const img of prod.images) {
      try {
        ids.push(await uploadMedia(img, prod.title))
      } catch (e) {
        console.warn('  이미지 skip:', img, String(e).slice(0, 80))
      }
    }
    await create('products', {
      title: prod.title,
      category: prod.category,
      summary: prod.summary,
      specs: prod.specs,
      images: ids,
      featured: prod.order < 3,
      order: prod.order,
    })
    pr++
  }
  console.log(`제품: ${pr}개 추가`)

  console.log('\n업로드 완료.')
}

main().catch((e) => {
  console.error('\n업로드 실패:', e)
  process.exit(1)
})
