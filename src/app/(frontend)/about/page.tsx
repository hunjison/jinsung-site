import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { SectionHeading } from '@/components/site/SectionHeading'
import { PageHero } from '@/components/site/PageHero'
import { site, telHref, strengths, productCategories } from '@/lib/site'

export const metadata = { title: '회사소개' }
export const dynamic = 'force-dynamic'

/** 보유 공정·설비 목록 (실제 데이터 기반, 하드코딩 허용) */
const processes = [
  {
    title: '파이프레이저 (6K급)',
    desc: '원형·각형 파이프 절단 및 홀 타공. 앵글, ㄷ형강 등 형강 가공도 가능한 6킬로와트급 파이프 레이저를 운영합니다.',
  },
  {
    title: '판(평철)레이저',
    desc: '스텐·철 평철 및 판재를 정밀 레이저로 절단합니다. 얇은 박판부터 두꺼운 후판까지 폭넓게 처리합니다.',
  },
  {
    title: '앵글 · ㄷ형강 가공',
    desc: '앵글과 ㄷ형강 등 구조용 형강을 규격에 맞게 절단·타공합니다. 별도 공정 없이 레이저 한 번에 완성합니다.',
  },
  {
    title: '스텐 후판 절단 (12T~20T)',
    desc: '스테인리스 12T에서 20T까지 두꺼운 후판을 정밀하게 절단하고 홀 타공합니다. 중장비·산업 설비 부품도 대응 가능합니다.',
  },
  {
    title: '용접',
    desc: '레이저 절단 후 후속 용접 공정까지 한 곳에서 처리합니다. 별도 외주 없이 납기를 단축하고 품질을 일관되게 유지합니다.',
  },
]

export default async function AboutPage() {
  const payload = await getPayload({ config })
  const home = (await payload.findGlobal({ slug: 'home', depth: 1 }).catch(() => null)) as {
    facilityImages?: Array<{ url?: string | null; alt?: string; sizes?: { card?: { url?: string | null } } } | number>
  } | null
  const facility = (home?.facilityImages || []).filter(
    (m): m is { url?: string | null; alt?: string; sizes?: { card?: { url?: string | null } } } =>
      typeof m === 'object' && m !== null,
  )

  return (
    <>
      {/* 1. 페이지 히어로 */}
      <PageHero title="회사소개" subtitle={site.tagline} />

      {/* 2. 인사말 / 소개 */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            eyebrow="GREETING"
            title="대표 인사말"
            align="left"
          />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-slate-700">
            <p>
              안녕하십니까. {site.region}에서 레이저 가공 전문 업체 <strong className="text-brand-700">{site.name}</strong>을 운영하고 있는 대표 {site.ceo}입니다.
            </p>
            <p>
              {site.name}은 스텐(스테인리스)·철·알루미늄 파이프와 판재를 정밀 레이저로 가공하고, 난간·방범창·사다리·조형물 등 각종 제품을 도면 작업부터 제작·출고까지 책임지는 주문제작 전문 공장입니다. 파이프레이저와 판(평철)레이저를 모두 보유하고 있어 한 곳에서 다양한 소재와 형상을 처리할 수 있습니다. 스텐 12T~20T 후판 절단과 정밀 타공, 용접 공정까지 직접 운영하기 때문에 외주 없이 품질을 균일하게 유지하고 납기를 지킵니다.
            </p>
            <p>
              규격 절단이든 복잡한 도면 주문제작이든 언제든지 편하게 전화 주십시오. 현장 경험을 바탕으로 정확하고 빠르게 도와드리겠습니다. 앞으로도 한결같은 품질과 신뢰로 보답하겠습니다.
            </p>
            <p className="pt-2 font-bold text-slate-800">
              {site.name} 대표 {site.ceo} 드림
            </p>
          </div>
        </div>
      </Section>

      {/* 3. 핵심 역량 */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="STRENGTHS"
          title="핵심 역량"
          description="소재 수급부터 가공·제작·출고까지 한 공장에서 해결합니다."
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

      {/* 4. 가공 분야 */}
      <Section>
        <SectionHeading
          eyebrow="PRODUCTS"
          title="가공 분야"
          description="아래 분야 외에도 다양한 주문제작이 가능합니다. 문의해 주세요."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* 5. 보유 공정·설비 */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="EQUIPMENT"
          title="보유 공정 · 설비"
          description="직접 보유한 설비로 절단부터 용접까지 원스톱 처리합니다."
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* 공정 목록 */}
          <ul className="space-y-5">
            {processes.map((p) => (
              <li
                key={p.title}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white"
                  aria-hidden
                >
                  ✓
                </span>
                <div>
                  <h3 className="text-lg font-bold text-brand-800">{p.title}</h3>
                  <p className="mt-1 text-slate-600">{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* 시설 사진 (관리자 업로드) — 없으면 플레이스홀더 */}
          {facility.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 lg:content-start">
              {facility.map((m, i) => (
                <img
                  key={i}
                  src={m.sizes?.card?.url || m.url || ''}
                  alt={m.alt || '시설 사진'}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-2xl border border-slate-200 object-cover"
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-72 items-center justify-center rounded-2xl bg-slate-200 text-slate-400 lg:min-h-full">
              <div className="text-center">
                <p className="text-2xl">📷</p>
                <p className="mt-2 text-base">시설 사진 준비 중</p>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* 6. 마무리 CTA */}
      <Section tone="brand">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <SectionHeading
              eyebrow="CONTACT US"
              title="궁금한 점은 전화로 바로 상담하세요"
              description="견적·납기·가공 가능 여부 무엇이든 편하게 문의해 주세요. 친절하게 안내해 드립니다."
              align="left"
              invert
            />
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a
              href={telHref}
              className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-4 text-lg font-bold text-white shadow-sm transition-colors hover:bg-accent-dark"
            >
              ☎ 전화 상담 {site.tel}
            </a>
            <Link
              href="/location"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-brand-700"
            >
              오시는 길 →
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}
