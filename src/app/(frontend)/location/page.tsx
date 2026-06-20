import { Metadata } from 'next'
import { PageHero } from '@/components/site/PageHero'
import { Section } from '@/components/site/Section'
import { SectionHeading } from '@/components/site/SectionHeading'
import { site, telHref, mobileHref } from '@/lib/site'
import KakaoMap from './KakaoMap'

export const metadata: Metadata = {
  title: '오시는 길',
}

export default function LocationPage() {
  return (
    <>
      {/* 상단 히어로 */}
      <PageHero title="오시는 길" subtitle={`${site.region} · ${site.address}`} />

      {/* 지도 */}
      <Section>
        <SectionHeading
          eyebrow="LOCATION"
          title="찾아오시는 길"
          description={`${site.address}에 위치한 진성레이져를 지도로 확인하세요.`}
        />
        <div className="mt-10">
          <KakaoMap />
        </div>
      </Section>

      {/* 연락처 정보 카드 */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="CONTACT"
          title="연락처 정보"
          description="전화·팩스·이메일·카카오톡으로 언제든지 문의하세요."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {/* 주소 카드 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-widest text-brand-500">주소</p>
            <p className="mt-3 text-xl font-bold leading-snug text-slate-900">{site.address}</p>
          </div>

          {/* 전화 / 팩스 카드 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-brand-500">휴대폰</p>
                <a
                  href={mobileHref}
                  className="mt-1 block text-2xl font-bold text-brand-700 hover:text-brand-800"
                >
                  {site.mobile}
                </a>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-brand-500">전화</p>
                <a
                  href={telHref}
                  className="mt-1 block text-2xl font-bold text-brand-700 hover:text-brand-800"
                >
                  {site.tel}
                </a>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-brand-500">팩스</p>
                <p className="mt-1 text-xl font-semibold text-slate-800">{site.fax}</p>
              </div>
            </div>
          </div>

          {/* 이메일 / 카카오톡 카드 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-brand-500">이메일</p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-1 block text-xl font-semibold text-brand-700 hover:text-brand-800"
                >
                  {site.email}
                </a>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-brand-500">
                  카카오톡 상담
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-800">
                  카카오 ID:{' '}
                  <span className="font-bold text-slate-900">{site.kakaoId}</span>
                </p>
              </div>
            </div>
          </div>

          {/* 사업자 정보 카드 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-brand-500">
                  사업자등록번호
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-800">{site.bizNo}</p>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-brand-500">대표</p>
                <p className="mt-1 text-xl font-semibold text-slate-800">{site.ceo}</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 외부 채널 */}
      <Section>
        <SectionHeading
          eyebrow="CHANNEL"
          title="공식 채널"
          description="유튜브·블로그·네이버카페에서 작업 현장과 최신 소식을 확인하세요."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <a
            href={site.links.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:border-red-200 hover:shadow-md"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-3xl">
              ▶
            </span>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900 group-hover:text-red-600">유튜브</p>
              <p className="mt-1 text-base text-slate-500">작업 영상 채널</p>
            </div>
          </a>

          <a
            href={site.links.blog}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:border-[#03C75A]/40 hover:shadow-md"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-3xl">
              ✏
            </span>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900 group-hover:text-[#02a84d]">
                네이버 블로그
              </p>
              <p className="mt-1 text-base text-slate-500">소식 및 작업 사례</p>
            </div>
          </a>

          <a
            href={site.links.cafe}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:border-[#03C75A]/40 hover:shadow-md"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-3xl">
              ☕
            </span>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-900 group-hover:text-[#02a84d]">
                네이버 카페
              </p>
              <p className="mt-1 text-base text-slate-500">커뮤니티 · Q&amp;A</p>
            </div>
          </a>
        </div>
      </Section>

      {/* 전화 상담 CTA */}
      <Section tone="brand">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <SectionHeading
              eyebrow="상담 안내"
              title="전화 한 통으로 빠르게 상담받으세요"
              description="견적·납기·소재 등 궁금한 점은 전화로 바로 답변드립니다."
              align="left"
              invert
            />
          </div>
          <a
            href={mobileHref}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-accent px-9 py-5 text-xl font-bold text-white shadow-sm transition-colors hover:bg-accent-dark"
          >
            ☎&nbsp;{site.mobile}
          </a>
        </div>
      </Section>
    </>
  )
}
