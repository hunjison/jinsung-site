/**
 * 「홈 화면」 글로벌을 현재 문구 + 강점/제품 카드(사진 포함)로 채운다.
 * content/manifest.json 의 이미지(카페 작업사진)를 카드 사진으로 사용.
 * 로컬:  BASE_URL=http://localhost:3000 ADMIN_PASSWORD=... npx tsx scripts/setup-home.ts
 * 라이브: BASE_URL=https://jinsunglaser.co.kr ADMIN_PASSWORD=... npx tsx scripts/setup-home.ts
 */
import { readFileSync } from 'fs'
import { basename, join } from 'path'
import { strengths, productCategories } from '../src/lib/site'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const EMAIL = process.env.ADMIN_EMAIL || 'admin@jinsung-laser.co.kr'
const PASSWORD = process.env.ADMIN_PASSWORD || ''
if (!PASSWORD) {
  console.error('ADMIN_PASSWORD 필요')
  process.exit(1)
}

let token = ''
const mediaCache = new Map<string, number>()

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

async function uploadMedia(localPath: string, alt: string): Promise<number> {
  if (mediaCache.has(localPath)) return mediaCache.get(localPath)!
  const buf = readFileSync(join(process.cwd(), localPath))
  const fd = new FormData()
  fd.append('file', new Blob([buf], { type: 'image/jpeg' }), basename(localPath))
  fd.append('alt', alt)
  const r = await fetch(`${BASE}/api/media`, { method: 'POST', headers: { Authorization: `JWT ${token}` }, body: fd })
  const j = await r.json()
  if (!r.ok || !j.doc) throw new Error('이미지 업로드 실패: ' + JSON.stringify(j).slice(0, 200))
  mediaCache.set(localPath, j.doc.id)
  return j.doc.id
}

async function main() {
  const manifest = JSON.parse(readFileSync(join(process.cwd(), 'content/manifest.json'), 'utf8'))
  const posts: any[] = manifest.posts || []
  const products: any[] = manifest.products || []

  // 카테고리 → 대표 이미지
  const catImage: Record<string, string> = {}
  for (const p of products) if (p.images?.[0] && !catImage[p.category]) catImage[p.category] = p.images[0]
  const anyImage = products.flatMap((p) => p.images || [])[0] || posts.flatMap((p) => p.images || [])[0]

  const postImageByKeyword = (keywords: string[]): string | null => {
    for (const kw of keywords) {
      const hit = posts.find((p) => p.title.includes(kw) && p.images?.[0])
      if (hit) return hit.images[0]
    }
    return null
  }

  await login()

  // 강점 카드 (site.ts strengths 순서) + 키워드 매칭 사진
  const strengthKeywords: Record<string, string[]> = {
    '도면부터 주문제작': ['난간', '휀스', '동자', '화분대'],
    '다양한 소재 대응': ['아연', '알루', 'R가공', '글씨', '1T'],
    '후판·정밀 가공': ['12T', '용접', '후판', '9T'],
    '파이프 + 판재 레이저': ['파이프', '265', '평철', '판'],
  }
  const strengthCards: any[] = []
  for (const s of strengths) {
    const imgPath = postImageByKeyword(strengthKeywords[s.title] || []) || anyImage
    const id = imgPath ? await uploadMedia(imgPath, s.title) : null
    strengthCards.push({ title: s.title, description: s.desc, image: id })
  }

  // 제품 카드 (productCategories) + 카테고리 사진
  const productCards: any[] = []
  for (const c of productCategories) {
    const imgPath = catImage[c.slug] || anyImage
    const id = imgPath ? await uploadMedia(imgPath, c.name) : null
    productCards.push({ title: c.name, description: c.desc, image: id })
  }

  // 기존 heroVideo/heroPoster 보존
  const cur = await fetch(`${BASE}/api/globals/home?depth=0`, {
    headers: { Authorization: `JWT ${token}` },
  }).then((r) => r.json())

  const data = {
    heroVideo: cur?.heroVideo ?? null,
    heroPoster: cur?.heroPoster ?? null,
    heroEyebrow: '강원특별자치도 원주 · 레이저 가공 전문',
    heroTitle: '스텐·철·알루미늄\n파이프·판재 정밀 레이저 가공',
    heroSubtitle:
      '파이프레이저와 판(평철)레이저로 절단·타공은 물론, 난간·방범창·조형물 등 각종 제품을 도면 작업부터 제작까지 책임집니다. 원주의 레이저 가공, 진성레이져입니다.',
    strengthsTitle: '진성레이져의 강점',
    strengthsSubtitle: '한 곳에서 소재·가공·제작까지. 믿고 맡기실 수 있습니다.',
    strengths: strengthCards,
    productsTitle: '제품 · 가공 분야',
    productsSubtitle: '아래 분야 외에도 다양한 주문제작이 가능합니다.',
    productCards,
    videoTitle: '작업 영상으로 보는 가공 현장',
    videoSubtitle: '파이프 타공·평철 가공 등 실제 작업 영상을 확인해 보세요.',
  }

  const r = await fetch(`${BASE}/api/globals/home`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify(data),
  })
  const j = await r.json()
  if (!r.ok) throw new Error('홈 글로벌 저장 실패: ' + JSON.stringify(j).slice(0, 300))
  console.log(`홈 화면 설정 완료 — 강점 ${strengthCards.length}장, 제품 ${productCards.length}장`)
}

main().catch((e) => {
  console.error('실패:', e)
  process.exit(1)
})
