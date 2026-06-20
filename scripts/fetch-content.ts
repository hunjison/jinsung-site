/**
 * 1단계: 콘텐츠 수집·정리 (로컬 전용 — 라이브 사이트에 아무것도 쓰지 않음).
 * 네이버 카페 API + 유튜브 RSS에서 모아 content/manifest.json + content/images/* 생성.
 * 실행: npm run fetch:content   (또는 npx tsx scripts/fetch-content.ts)
 */
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { productCategories } from '../src/lib/site'

const CLUB = 29516142
const YT_CHANNEL = 'UC4CgUhssONVyxYCCKGbVWfg'
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
const OUT = join(process.cwd(), 'content')
const IMGDIR = join(OUT, 'images')
mkdirSync(IMGDIR, { recursive: true })

const MAX_POSTS = 22
const IMAGES_PER_POST = 4

async function getJson(url: string, referer = 'https://cafe.naver.com/'): Promise<any> {
  const r = await fetch(url, { headers: { 'User-Agent': UA, Referer: referer } })
  return r.json()
}
async function getText(url: string, referer = 'https://www.youtube.com/'): Promise<string> {
  const r = await fetch(url, { headers: { 'User-Agent': UA, Referer: referer } })
  return r.text()
}

async function downloadImage(url: string, name: string, referer: string): Promise<string | null> {
  try {
    const clean = url.split('?')[0]
    const r = await fetch(clean, { headers: { 'User-Agent': UA, Referer: referer } })
    if (!r.ok) return null
    const buf = Buffer.from(await r.arrayBuffer())
    if (buf.length < 3000) return null // 깨졌거나 너무 작은 썸네일 제외
    writeFileSync(join(IMGDIR, name), buf)
    return `content/images/${name}`
  } catch {
    return null
  }
}

function htmlToText(html: string): string {
  let t = html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h\d|li)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
  t = t
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
  return t
}

const DROP = [
  /TELL|FAX|033\s*-?\s*734|^전화|^팩스/i,
  /cafe\.naver|blog\.naver|youtube|youtu\.be|https?:\/\//i,
  /^#/,
  /이용약관|사업자|통신판매/,
  /스텐 파이프레이저\s*\/\s*스텐 난간/,
  /자전거 거치대\s*\/\s*스텐 조형물/,
  /스텐파이프를 이용한 각종/,
  /판 ?레이져 ?\/ ?스텐/,
  /스텐 파이프 레이저 ?& ?스텐 파이프/,
  /^스크랩|재스크랩|출처/,
  /강원도 ?원주시|동화골길|문막|봉현길/, // 주소 푸터 (옛 주소 포함) 제거
  /사다리 ?\/ ?방범창|방범창 ?\/ ?화분대|화분대 ?\/ ?난간대|난간대 ?\/ ?국기봉|자전거\s*거치대/,
  /각종 ?구조물 ?주문|각종 ?형태의 ?물품|주문 ?제작 ?입니다/,
  /파이프 ?레이져 ?\/ ?판 ?레이져|판 ?레이져 ?\/ ?스텐/,
]

function cleanBody(text: string): string {
  let lines = text
    .split('\n')
    .map((s) => s.replace(/​/g, '').trim())
    .filter(Boolean)
  lines = lines.filter((l) => !DROP.some((p) => p.test(l)))
  const out: string[] = []
  for (const l of lines) if (out[out.length - 1] !== l) out.push(l)
  return out.join('\n').trim()
}

function extractImages(html: string): string[] {
  const set = new Set<string>()
  const re = /(https?:\/\/[a-z0-9.\-]*(?:pstatic\.net|naver\.net)\/[^\s"'\\)]+\.(?:jpg|jpeg|png))/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    const u = m[1]
    if (/profile|static\/cafe|cafe_profile|blank|default|btn_|icon|ico_/i.test(u)) continue
    set.add(u.split('?')[0])
  }
  return [...set]
}

// 중복 홍보글 제거용 제목 정규화 키 (한글은 보존, 공백·기호만 제거)
function titleKey(s: string): string {
  return s.replace(/\s+/g, '').replace(/[^가-힣A-Za-z0-9]/g, '').toLowerCase()
}

function categoryForText(s: string): string {
  if (/난간|난간대|동자/.test(s)) return 'railing'
  if (/방범창|발코니|난간대?/.test(s)) return 'security'
  if (/사다리/.test(s)) return 'ladder'
  if (/휀스|펜스|조형물|키링|간판|화분대|거치대|국기봉|다이|등|조명/.test(s)) return 'custom'
  if (/평철|판레|판\s|판재|9t|12t/i.test(s)) return 'plate-laser'
  return 'pipe-laser'
}

async function main() {
  console.log('네이버 카페 목록 수집...')
  const articles: any[] = []
  for (let page = 1; page <= 3; page++) {
    const d = await getJson(
      `https://apis.naver.com/cafe-web/cafe2/ArticleListV2dot1.json?search.clubid=${CLUB}&search.queryType=lastArticle&search.page=${page}&search.perPage=50`,
    )
    const al = d?.message?.result?.articleList || []
    articles.push(...al)
  }
  console.log(`  총 ${articles.length}개 글`)

  // 사진 있는 글만, 중복 제목 제거, 제작기/제작사진 우선
  const withImg = articles.filter((a) => a.attachImage && a.subject)
  const priority = (a: any) => (/제작기|제작사진/.test(a.menuName || '') ? 0 : /제품소개/.test(a.menuName || '') ? 1 : 2)
  withImg.sort((a, b) => priority(a) - priority(b))

  const seen = new Set<string>()
  const selected: any[] = []
  for (const a of withImg) {
    const k = titleKey(a.subject)
    if (k.length < 2) continue
    if (seen.has(k)) continue
    seen.add(k)
    selected.push(a)
    if (selected.length >= MAX_POSTS) break
  }
  console.log(`  엄선 ${selected.length}개 글 본문/이미지 수집...`)

  const posts: any[] = []
  const productImagePool: { category: string; image: string; title: string }[] = []
  let imgCounter = 0

  for (const a of selected) {
    const id = a.articleId
    let html = ''
    let writeDate = a.writeDateTimestamp || Date.now()
    let subject = a.subject
    try {
      const d = await getJson(
        `https://apis.naver.com/cafe-web/cafe-articleapi/v3/cafes/${CLUB}/articles/${id}?query=&useCafeId=true&requestFrom=A`,
      )
      const art = d?.result?.article
      if (art) {
        html = art.contentHtml || ''
        writeDate = art.writeDate || writeDate
        subject = art.subject || subject
      }
    } catch {
      /* skip */
    }

    const bodyText = cleanBody(htmlToText(html))
    let urls = extractImages(html).slice(0, IMAGES_PER_POST)
    // 본문에서 이미지를 못 뽑으면 목록의 대표이미지(원본 크기)로 폴백
    if (urls.length === 0 && a.representImage) urls = [a.representImage.split('?')[0]]
    const localImgs: string[] = []
    for (const u of urls) {
      imgCounter++
      const name = `cafe-${id}-${imgCounter}.jpg`
      const p = await downloadImage(u, name, 'https://cafe.naver.com/')
      if (p) localImgs.push(p)
    }
    if (localImgs.length === 0) continue // 사진 못 받으면 제외

    const isNotice = /회사소개/.test(a.menuName || '') || /공지|공고|이전|안내/.test(subject)
    posts.push({
      title: subject.trim(),
      category: isNotice ? 'notice' : 'work',
      publishedAt: new Date(writeDate).toISOString(),
      bodyText: bodyText || subject.trim(),
      images: localImgs,
      sourceArticleId: id,
      menu: a.menuName,
    })

    // 제품 갤러리용 이미지 풀에 분류
    if (!isNotice) {
      const cat = categoryForText(subject + ' ' + bodyText)
      for (const img of localImgs) productImagePool.push({ category: cat, image: img, title: subject.trim() })
    }
  }

  // 제품: 카테고리별 대표 이미지 모아 productCategories 설명/규격 재사용
  const products: any[] = []
  let order = 0
  for (const cat of productCategories) {
    const imgs = productImagePool.filter((p) => p.category === cat.slug).map((p) => p.image)
    const uniqImgs = [...new Set(imgs)].slice(0, 6)
    if (uniqImgs.length === 0) continue
    products.push({
      title: cat.name,
      category: cat.slug,
      summary: cat.desc,
      specs: '소재·치수 협의 후 주문 제작',
      images: uniqImgs,
      order: order++,
    })
  }

  // 동영상: 유튜브 RSS
  console.log('유튜브 RSS 수집...')
  const rss = await getText(`https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL}`)
  const videos: any[] = []
  const entryRe = /<entry>([\s\S]*?)<\/entry>/g
  let em: RegExpExecArray | null
  let vorder = 0
  while ((em = entryRe.exec(rss))) {
    const block = em[1]
    const vid = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]
    const title = block.match(/<title>([^<]+)<\/title>/)?.[1]
    if (vid && title) {
      videos.push({
        title: title.trim(),
        youtubeUrl: `https://www.youtube.com/watch?v=${vid}`,
        order: vorder++,
      })
    }
  }

  const manifest = { generatedAt: new Date().toISOString(), videos, posts, products }
  writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))

  console.log('\n=== 수집 완료 (content/manifest.json) ===')
  console.log(`동영상: ${videos.length}개`)
  console.log(`게시글: ${posts.length}개`)
  posts.forEach((p) => console.log(`  [${p.category}] ${p.title}  (사진 ${p.images.length})`))
  console.log(`제품: ${products.length}개`)
  products.forEach((p) => console.log(`  ${p.title} (${p.category}) — 사진 ${p.images.length}`))
  console.log('\n이미지 폴더: content/images/')
}

main().catch((e) => {
  console.error('수집 실패:', e)
  process.exit(1)
})
