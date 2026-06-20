/**
 * 샘플 콘텐츠 시드 스크립트.
 * 실행: npm run seed   (또는 npx tsx scripts/seed.ts)
 * - sharp로 그라데이션 플레이스홀더 이미지를 생성해 Media에 업로드
 * - Products / Posts / Videos를 비어있을 때만 채움 (재실행 시 중복 방지)
 * 실제 자료가 준비되면 관리자에서 지우고 교체하면 된다.
 */
import 'dotenv/config'
import { existsSync, readFileSync } from 'fs'
import sharp from 'sharp'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { productCategories } from '../src/lib/site'

type AnyPayload = Awaited<ReturnType<typeof getPayload>>

async function gradientJpeg(c1: string, c2: string, w = 1200, h = 800): Promise<Buffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <rect x="40" y="40" width="${w - 80}" height="${h - 80}" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="3"/>
  </svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer()
}

async function uploadImage(
  payload: AnyPayload,
  name: string,
  alt: string,
  c1: string,
  c2: string,
): Promise<number> {
  const data = await gradientJpeg(c1, c2)
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/jpeg', name: `${name}.jpg`, size: data.length },
  })
  return doc.id as number
}

function lexical(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((t) => ({
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [
          { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: t, version: 1 },
        ],
      })),
    },
  }
}

const PALETTES: Array<[string, string]> = [
  ['#1f4f8a', '#132a45'],
  ['#2f66a6', '#1a4070'],
  ['#5085c1', '#1f4f8a'],
  ['#e07b1f', '#c2670f'],
  ['#475569', '#1e293b'],
  ['#0f766e', '#134e4a'],
  ['#7c5e10', '#3f3206'],
  ['#334155', '#0f172a'],
]

async function main() {
  const payload = await getPayload({ config })

  // ── Products ──────────────────────────────
  const productCount = await payload.count({ collection: 'products' })
  if (productCount.totalDocs === 0) {
    const sample: Record<string, { summary: string; specs: string }> = {
      'pipe-laser': {
        summary: '원형·각형 파이프를 정밀하게 절단·타공합니다. 도면에 맞춰 다량 타공도 가능합니다.',
        specs: '소재: 스텐/철/알루미늄 · 파이프 외경 ~150Φ · 두께 1~6T',
      },
      'plate-laser': {
        summary: '스텐·철 평철과 판재를 레이저로 깔끔하게 절단합니다. 후판 가공도 대응합니다.',
        specs: '소재: 스텐/철 · 두께 1~20T · 최대 1500×3000',
      },
      railing: {
        summary: '계단·발코니용 스텐 난간을 도면 작업부터 제작·설치까지 진행합니다.',
        specs: '소재: STS304 · 맞춤 제작',
      },
      security: {
        summary: '튼튼한 스텐 방범창과 발코니 난간. 디자인과 안전을 모두 고려해 제작합니다.',
        specs: '소재: STS304 · 맞춤 치수',
      },
      ladder: {
        summary: '스텐 사다리 및 안전망(보호망) 사다리. 현장 규격에 맞춰 제작합니다.',
        specs: '소재: 스텐 파이프 · 맞춤 높이',
      },
      custom: {
        summary: '화분대·자전거 거치대·조형물·국기봉·키링/간판 등 다양한 주문제작.',
        specs: '소재·치수 협의 후 도면 제작',
      },
    }

    let i = 0
    for (const cat of productCategories) {
      const s = sample[cat.slug] ?? { summary: cat.desc, specs: '맞춤 제작' }
      const [c1, c2] = PALETTES[i % PALETTES.length]
      const imgId = await uploadImage(payload, `product-${cat.slug}`, cat.name, c1, c2)
      await payload.create({
        collection: 'products',
        data: {
          title: cat.name,
          category: cat.slug,
          summary: s.summary,
          specs: s.specs,
          images: [imgId],
          featured: i < 3,
          order: i,
        },
      })
      i++
    }
    console.log(`✓ 제품 ${productCategories.length}건 생성`)
  } else {
    console.log('· 제품이 이미 있어 건너뜀')
  }

  // ── Posts ─────────────────────────────────
  const postCount = await payload.count({ collection: 'posts' })
  if (postCount.totalDocs === 0) {
    const posts = [
      {
        title: '63파이 파이프 홀 타공 작업',
        category: 'work',
        palette: PALETTES[0],
        body: [
          '63파이 파이프에 다량의 홀 가공을 진행한 작업입니다.',
          '도면 작업 후 레이저로 정밀하게 타공하여 균일한 품질로 완성했습니다.',
          '파이프 종류와 홀 규격에 맞춰 다양한 타공이 가능하니 문의해 주세요.',
        ],
      },
      {
        title: '스텐 12T 후판 레이저 가공 + 용접',
        category: 'work',
        palette: PALETTES[4],
        body: [
          '스텐 12T 후판을 레이저로 절단한 뒤 용접까지 마감한 작업입니다.',
          '두꺼운 소재도 깔끔하게 가공하며, 15T~20T까지 대응 가능합니다.',
        ],
      },
      {
        title: '진성레이져 홈페이지를 새롭게 단장했습니다',
        category: 'notice',
        palette: PALETTES[3],
        body: [
          '안녕하세요, 진성레이져입니다.',
          '제품과 작업 사례를 더 편하게 보실 수 있도록 홈페이지를 새로 단장했습니다.',
          '문의는 전화로 언제든 편하게 연락 주세요. 감사합니다.',
        ],
      },
    ] as const

    let j = 0
    for (const p of posts) {
      const coverId = await uploadImage(payload, `post-${j}`, p.title, p.palette[0], p.palette[1])
      await payload.create({
        collection: 'posts',
        data: {
          title: p.title,
          category: p.category,
          coverImage: coverId,
          body: lexical([...p.body]),
        },
      })
      j++
    }
    console.log(`✓ 게시글 ${posts.length}건 생성`)
  } else {
    console.log('· 게시글이 이미 있어 건너뜀')
  }

  // ── Videos (샘플: 블렌더 오픈 무비) ─────────
  const videoCount = await payload.count({ collection: 'videos' })
  if (videoCount.totalDocs === 0) {
    const videos = [
      {
        title: '(샘플) 파이프 레이저 가공 영상',
        youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        description: '실제 작업 영상으로 교체할 자리입니다.',
        order: 0,
      },
      {
        title: '(샘플) 평철 가공 영상',
        youtubeUrl: 'https://www.youtube.com/watch?v=eRsGyueVLvQ',
        description: '실제 작업 영상으로 교체할 자리입니다.',
        order: 1,
      },
      {
        title: '(샘플) 방범창 제작 영상',
        youtubeUrl: 'https://www.youtube.com/watch?v=R6MlUcmOul8',
        description: '실제 작업 영상으로 교체할 자리입니다.',
        order: 2,
      },
    ]
    for (const v of videos) {
      await payload.create({ collection: 'videos', data: v })
    }
    console.log(`✓ 동영상 ${videos.length}건 생성(샘플)`)
  } else {
    console.log('· 동영상이 이미 있어 건너뜀')
  }

  // ── Hero 배경 동영상 (샘플; 파일이 있을 때만) ──
  const home = await payload.findGlobal({ slug: 'home' })
  const heroPath = process.env.HERO_VIDEO_PATH || '/tmp/sample-hero.mp4'
  if (!home?.heroVideo && existsSync(heroPath)) {
    const data = readFileSync(heroPath)
    const v = await payload.create({
      collection: 'hero-media',
      data: { alt: '홈 배경 동영상 (샘플)' },
      file: { data, mimetype: 'video/mp4', name: 'hero-sample.mp4', size: data.length },
    })
    await payload.updateGlobal({ slug: 'home', data: { heroVideo: v.id } })
    console.log('✓ 홈 배경 동영상(샘플) 설정')
  } else {
    console.log('· 홈 배경 동영상: 이미 설정됨 또는 샘플 파일 없음(건너뜀)')
  }

  console.log('시드 완료.')
  process.exit(0)
}

main().catch((err) => {
  console.error('시드 실패:', err)
  process.exit(1)
})
