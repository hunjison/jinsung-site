import { getPayload } from 'payload'
import config from '@/payload.config'
import { Section } from '@/components/site/Section'
import { SectionHeading } from '@/components/site/SectionHeading'
import { PageHero } from '@/components/site/PageHero'
import { productCategories, site, telHref } from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata = { title: '제품·가공' }

/* ─── 타입 ──────────────────────────────────────────────── */
type MediaObj = {
  url: string
  alt?: string
  sizes?: {
    card?: { url?: string | null }
    thumbnail?: { url?: string | null }
    large?: { url?: string | null }
  }
}

type Product = {
  id: string | number
  title: string
  category: string
  summary?: string | null
  specs?: string | null
  images?: MediaObj[] | null
  featured?: boolean
  order?: number
}

/* ─── 헬퍼 ──────────────────────────────────────────────── */
function getCardUrl(img: MediaObj): string {
  return img.sizes?.card?.url || img.url
}

/* ─── 카테고리 뱃지 색 ────────────────────────────────── */
const badgeColors: Record<string, string> = {
  'pipe-laser': 'bg-brand-100 text-brand-700',
  'plate-laser': 'bg-blue-100 text-blue-700',
  railing: 'bg-emerald-100 text-emerald-700',
  security: 'bg-amber-100 text-amber-700',
  ladder: 'bg-orange-100 text-orange-700',
  custom: 'bg-purple-100 text-purple-700',
}

/* ─── 제품 카드 ──────────────────────────────────────────── */
function ProductCard({ product }: { product: Product }) {
  const firstImage = product.images?.[0] ?? null
  const cat = productCategories.find((c) => c.slug === product.category)
  const badgeClass = badgeColors[product.category] ?? 'bg-slate-100 text-slate-600'

  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md overflow-hidden flex flex-col">
      {/* 이미지 영역 */}
      {firstImage ? (
        <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <img
            src={getCardUrl(firstImage)}
            alt={firstImage.alt || product.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-slate-100 flex items-center justify-center">
          <span className="text-slate-300 text-5xl select-none" aria-hidden>
            ✦
          </span>
        </div>
      )}

      {/* 본문 */}
      <div className="flex flex-col flex-1 p-6">
        {/* 카테고리 뱃지 */}
        {cat && (
          <span className={`mb-3 inline-block self-start rounded-full px-3 py-1 text-sm font-semibold ${badgeClass}`}>
            {cat.name}
          </span>
        )}

        {/* 제품명 */}
        <h3 className="text-xl font-bold text-slate-900 leading-snug">{product.title}</h3>

        {/* 간단 설명 */}
        {product.summary && (
          <p className="mt-2 text-slate-600 leading-relaxed flex-1">{product.summary}</p>
        )}

        {/* 규격/사양 */}
        {product.specs && (
          <p className="mt-3 text-sm text-slate-500 border-t border-slate-100 pt-3 whitespace-pre-line">
            {product.specs}
          </p>
        )}
      </div>
    </article>
  )
}

/* ─── 빈 DB 폴백: 카테고리 안내 카드 ─────────────────── */
function EmptyFallback() {
  return (
    <>
      <Section tone="muted">
        <SectionHeading
          eyebrow="준비 중"
          title="제품 사진을 등록하고 있습니다"
          description="현재 제품 사진과 상세 정보를 순차적으로 업로드 중입니다. 아래 가공 분야를 참고하시고, 견적·주문은 전화로 편하게 문의해 주세요."
          align="center"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productCategories.map((cat) => {
            const badgeClass = badgeColors[cat.slug] ?? 'bg-slate-100 text-slate-600'
            return (
              <div
                key={cat.slug}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <span
                  className={`mb-4 inline-block rounded-full px-3 py-1 text-sm font-semibold ${badgeClass}`}
                >
                  {cat.name}
                </span>
                <h3 className="text-xl font-bold text-slate-900">{cat.name}</h3>
                <p className="mt-3 text-slate-600 leading-relaxed">{cat.desc}</p>
                <p className="mt-4 text-sm font-medium text-brand-600">
                  현재 준비 중입니다. 제작 문의는 전화로 주세요.
                </p>
              </div>
            )
          })}
        </div>
      </Section>

      {/* 전화 CTA */}
      <Section tone="brand">
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="text-2xl font-bold text-white sm:text-3xl">
            원하시는 제품을 바로 문의하세요
          </p>
          <p className="max-w-xl text-lg text-brand-100">
            도면 작업부터 제작까지 상담해 드립니다. 규격·수량·소재를 말씀해 주시면 견적을 빠르게
            드립니다.
          </p>
          <a
            href={telHref}
            className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-xl font-bold text-brand-800 shadow-sm transition-colors hover:bg-brand-50"
          >
            ☎ 전화 상담 {site.tel}
          </a>
        </div>
      </Section>
    </>
  )
}

/* ─── 페이지 ─────────────────────────────────────────────── */
export default async function ProductsPage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'products',
    sort: 'order',
    depth: 1,
    limit: 100,
  })

  const products = docs as Product[]

  return (
    <>
      <PageHero
        title="제품·가공"
        subtitle="파이프·판재 레이저 가공부터 난간·방범창·주문제작까지. 진성레이져의 가공 분야를 확인하세요."
      />

      {products.length === 0 ? (
        <EmptyFallback />
      ) : (
        <>
          {productCategories.map((cat, idx) => {
            const catProducts = products.filter((p) => p.category === cat.slug)
            if (catProducts.length === 0) return null

            const tone: 'default' | 'muted' = idx % 2 === 0 ? 'default' : 'muted'

            return (
              <Section key={cat.slug} tone={tone} id={cat.slug}>
                <SectionHeading
                  eyebrow={cat.slug.toUpperCase().replaceAll('-', ' ')}
                  title={cat.name}
                  description={cat.desc}
                  align="left"
                />
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {catProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </Section>
            )
          })}

          {/* 페이지 하단 문의 CTA */}
          <Section tone="brand">
            <div className="flex flex-col items-center gap-5 text-center">
              <p className="text-2xl font-bold text-white sm:text-3xl">
                원하시는 규격·수량 문의하기
              </p>
              <p className="max-w-xl text-lg text-brand-100">
                도면 작업부터 납품까지 전 과정을 맡겨 주시면 됩니다.
              </p>
              <a
                href={telHref}
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-xl font-bold text-brand-800 shadow-sm transition-colors hover:bg-brand-50"
              >
                ☎ 전화 상담 {site.tel}
              </a>
            </div>
          </Section>
        </>
      )}
    </>
  )
}
