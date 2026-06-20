import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { SectionHeading } from '@/components/site/SectionHeading'
import { productCategories, site, strengths, telHref } from '@/lib/site'

export const dynamic = 'force-dynamic'

type MediaUrl = { url?: string | null } | number | null | undefined
const urlOf = (m: MediaUrl): string | null =>
  m && typeof m === 'object' && 'url' in m ? (m.url ?? null) : null

export default async function HomePage() {
  const payload = await getPayload({ config })
  const home = await payload.findGlobal({ slug: 'home', depth: 1 }).catch(() => null)
  const heroVideoUrl = urlOf(home?.heroVideo as MediaUrl)
  const heroPosterUrl = urlOf(home?.heroPoster as MediaUrl)

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
            {/* 가독성용 어두운 오버레이 */}
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
          <p className="mb-4 text-base font-bold tracking-wider text-brand-200">
            {site.region} · 레이저 가공 전문
          </p>
          <h1 className="max-w-3xl text-4xl leading-tight text-white sm:text-5xl">
            스텐·철·알루미늄
            <br />
            파이프·판재 정밀 레이저 가공
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-brand-100 sm:text-xl">
            파이프레이저와 판(평철)레이저로 절단·타공은 물론, 난간·방범창·조형물 등 각종 제품을 도면
            작업부터 제작까지 책임집니다. 원주의 레이저 가공, 진성레이져입니다.
          </p>
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
        <SectionHeading
          eyebrow="WHY JINSUNG"
          title="진성레이져의 강점"
          description="한 곳에서 소재·가공·제작까지. 믿고 맡기실 수 있습니다."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {strengths.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-xl text-brand-700">{s.title}</h3>
              <p className="mt-3 text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 제품·가공 요약 */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="PRODUCTS"
          title="제품 · 가공 분야"
          description="아래 분야 외에도 다양한 주문제작이 가능합니다."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productCategories.map((c) => (
            <Link
              key={c.slug}
              href="/products"
              className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:border-brand-300 hover:shadow-md"
            >
              <h3 className="text-xl text-slate-900 group-hover:text-brand-700">{c.name}</h3>
              <p className="mt-3 text-slate-600">{c.desc}</p>
              <span className="mt-4 inline-block font-semibold text-brand-600">자세히 보기 →</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* 동영상 안내 */}
      <Section tone="brand">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl text-white">작업 영상으로 보는 가공 현장</h2>
            <p className="mt-3 text-lg text-brand-100">
              파이프 타공·평철 가공 등 실제 작업 영상을 확인해 보세요.
            </p>
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
          <div className="flex min-h-64 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            지도 영역 (오시는 길 페이지에서 확인)
          </div>
        </div>
      </Section>
    </>
  )
}
