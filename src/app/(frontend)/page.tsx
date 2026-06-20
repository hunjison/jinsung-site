import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { SectionHeading } from '@/components/site/SectionHeading'
import { MapEmbed } from '@/components/site/MapEmbed'
import { productCategories, site, strengths, telHref, mobileHref } from '@/lib/site'

export const dynamic = 'force-dynamic'

type AnyMedia = { url?: string | null; sizes?: { card?: { url?: string | null } } } | number | null | undefined
const videoUrl = (m: AnyMedia): string | null =>
  m && typeof m === 'object' && 'url' in m ? (m.url ?? null) : null
const cardUrl = (m: AnyMedia): string | null =>
  m && typeof m === 'object' ? (m.sizes?.card?.url ?? m.url ?? null) : null

type Card = { title: string; description?: string | null; image?: AnyMedia }

export default async function HomePage() {
  const payload = await getPayload({ config })
  const home = (await payload.findGlobal({ slug: 'home', depth: 1 }).catch(() => null)) as any

  const heroVideoUrl = videoUrl(home?.heroVideo)
  const heroPosterUrl = videoUrl(home?.heroPoster)

  // 설정값 우선, 없으면 기본 문구로 폴백
  const heroEyebrow = home?.heroEyebrow || `${site.region} · 레이저 가공 전문`
  const heroTitle = home?.heroTitle || '스텐·철·알루미늄\n파이프·판재 정밀 레이저 가공'
  const heroSubtitle =
    home?.heroSubtitle ||
    '파이프레이저와 판(평철)레이저로 절단·타공은 물론, 난간·방범창·조형물 등 각종 제품을 도면 작업부터 제작까지 책임집니다. 원주의 레이저 가공, 진성레이져입니다.'
  const strengthsTitle = home?.strengthsTitle || '진성레이져의 강점'
  const strengthsSubtitle =
    home?.strengthsSubtitle || '한 곳에서 소재·가공·제작까지. 믿고 맡기실 수 있습니다.'
  const strengthCards: Card[] =
    home?.strengths?.length > 0
      ? home.strengths
      : strengths.map((s) => ({ title: s.title, description: s.desc }))
  const productsTitle = home?.productsTitle || '제품 · 가공 분야'
  const productsSubtitle = home?.productsSubtitle || '아래 분야 외에도 다양한 주문제작이 가능합니다.'
  const productCards: Card[] =
    home?.productCards?.length > 0
      ? home.productCards
      : productCategories.map((c) => ({ title: c.name, description: c.desc }))
  const videoTitle = home?.videoTitle || '작업 영상으로 보는 가공 현장'
  const videoSubtitle =
    home?.videoSubtitle || '파이프 타공·평철 가공 등 실제 작업 영상을 확인해 보세요.'

  return (
    <>
      {/* 히어로 */}
      <section className="relative overflow-hidden bg-brand-900 text-white">
        {heroVideoUrl ? (
          <>
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster={heroPosterUrl ?? undefined}
              aria-hidden
            >
              <source src={heroVideoUrl} />
            </video>
            <div
              className="absolute inset-0 bg-gradient-to-t from-brand-900 via-brand-900/70 to-brand-900/40"
              aria-hidden
            />
          </>
        ) : (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, #5085c1 0, transparent 45%), radial-gradient(circle at 80% 60%, #e07b1f 0, transparent 40%)',
            }}
            aria-hidden
          />
        )}
        <Container className="relative py-20 sm:py-28">
          <p className="mb-4 text-base font-bold tracking-wider text-brand-200">{heroEyebrow}</p>
          <h1 className="max-w-3xl text-4xl leading-tight text-white sm:text-5xl">
            {heroTitle.split('\n').map((line: string, i: number) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-brand-100 sm:text-xl">{heroSubtitle}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg bg-white px-7 py-4 text-lg font-bold text-brand-800 shadow-sm transition-colors hover:bg-brand-50"
            >
              제품·가공 보기
            </Link>
            <a
              href={telHref}
              className="inline-flex items-center justify-center rounded-lg bg-accent px-7 py-4 text-lg font-bold text-white shadow-sm transition-colors hover:bg-accent-dark"
            >
              ☎ 전화 상담 {site.tel}
            </a>
          </div>
        </Container>
      </section>

      {/* 강점 */}
      <Section>
        <SectionHeading eyebrow="WHY JINSUNG" title={strengthsTitle} description={strengthsSubtitle} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {strengthCards.map((c, i) => {
            const img = cardUrl(c.image)
            return (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {img ? (
                  <img
                    src={img}
                    alt={c.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : null}
                <div className="p-6">
                  <h3 className="text-xl text-brand-700">{c.title}</h3>
                  {c.description ? <p className="mt-2 text-slate-600">{c.description}</p> : null}
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* 제품·가공 요약 */}
      <Section tone="muted">
        <SectionHeading eyebrow="PRODUCTS" title={productsTitle} description={productsSubtitle} />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productCards.map((c, i) => {
            const img = cardUrl(c.image)
            return (
              <Link
                key={i}
                href="/products"
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-brand-300 hover:shadow-md"
              >
                {img ? (
                  <img
                    src={img}
                    alt={c.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : null}
                <div className="p-6">
                  <h3 className="text-xl text-slate-900 group-hover:text-brand-700">{c.title}</h3>
                  {c.description ? <p className="mt-2 text-slate-600">{c.description}</p> : null}
                  <span className="mt-3 inline-block font-semibold text-brand-600">자세히 보기 →</span>
                </div>
              </Link>
            )
          })}
        </div>
      </Section>

      {/* 동영상 안내 */}
      <Section tone="brand">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl text-white">{videoTitle}</h2>
            <p className="mt-3 text-lg text-brand-100">{videoSubtitle}</p>
          </div>
          <Link
            href="/videos"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-white px-7 py-4 text-lg font-bold text-brand-800 transition-colors hover:bg-brand-50"
          >
            동영상 보러가기
          </Link>
        </div>
      </Section>

      {/* 오시는 길 / 연락처 요약 */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="CONTACT"
              title="문의 · 오시는 길"
              align="left"
              description="견적 및 주문제작 문의는 전화로 편하게 상담해 드립니다."
            />
            <dl className="mt-8 space-y-3 text-lg">
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 font-bold text-slate-500">전화</dt>
                <dd>
                  <a href={telHref} className="font-bold text-brand-700">
                    {site.tel}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 font-bold text-slate-500">휴대폰</dt>
                <dd>
                  <a href={mobileHref} className="font-bold text-brand-700">
                    {site.mobile}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 font-bold text-slate-500">팩스</dt>
                <dd>{site.fax}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 font-bold text-slate-500">주소</dt>
                <dd>{site.address}</dd>
              </div>
            </dl>
            <Link
              href="/location"
              className="mt-7 inline-block rounded-lg border-2 border-brand-600 px-6 py-3 font-bold text-brand-700 hover:bg-brand-50"
            >
              찾아오시는 길 →
            </Link>
          </div>
          <MapEmbed className="h-72 w-full lg:h-full lg:min-h-[20rem]" />
        </div>
      </Section>
    </>
  )
}
