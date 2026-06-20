export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { PageHero } from '@/components/site/PageHero'
import { site, mobileHref } from '@/lib/site'

export const metadata = { title: '공지·작업사례' }

/** ISO 날짜 문자열 → YYYY.MM.DD */
function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

type CategoryValue = 'notice' | 'work'

const CATEGORY_LABEL: Record<CategoryValue, string> = {
  notice: '공지사항',
  work: '작업사례',
}

/** 배지 색상: 공지=앰버 계열, 작업=브랜드 계열 */
const CATEGORY_BADGE: Record<CategoryValue, string> = {
  notice: 'bg-accent text-white',
  work: 'bg-brand-700 text-white',
}

export default async function BoardListPage() {
  const payload = await getPayload({ config })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    depth: 1,
    limit: 100,
  })

  return (
    <>
      <PageHero
        title="공지·작업사례"
        subtitle="진성레이져의 공지사항과 레이저 가공 작업 사례를 확인하세요."
      />

      <Section>
        {posts.length === 0 ? (
          /* ── 빈 DB 폴백 ── */
          <div className="flex flex-col items-center gap-6 py-16 text-center">
            <p className="text-2xl text-slate-500">등록된 글이 없습니다.</p>
            <p className="text-lg text-slate-400">
              작업 사례나 공지사항이 곧 업로드될 예정입니다.
            </p>
            <a
              href={mobileHref}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-accent px-7 py-4 text-lg font-bold text-white shadow-sm transition-colors hover:bg-accent-dark"
            >
              ☎ 전화 문의 {site.mobile}
            </a>
          </div>
        ) : (
          /* ── 카드 그리드 ── */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              // coverImage 또는 images[0]에서 썸네일 URL 추출
              const cover =
                post.coverImage &&
                typeof post.coverImage === 'object' &&
                'url' in post.coverImage
                  ? (post.coverImage as { url?: string | null; sizes?: { card?: { url?: string | null } }; alt?: string })
                  : null

              const firstImg =
                !cover &&
                Array.isArray(post.images) &&
                post.images.length > 0 &&
                typeof post.images[0] === 'object' &&
                'url' in post.images[0]
                  ? (post.images[0] as { url?: string | null; sizes?: { card?: { url?: string | null } }; alt?: string })
                  : null

              const imgObj = cover ?? firstImg
              const imgSrc = imgObj?.sizes?.card?.url ?? imgObj?.url ?? null
              const imgAlt = imgObj?.alt ?? post.title

              const cat = post.category as CategoryValue
              const badgeClass = CATEGORY_BADGE[cat] ?? 'bg-slate-500 text-white'
              const badgeLabel = CATEGORY_LABEL[cat] ?? cat

              return (
                <Link
                  key={post.id}
                  href={`/board/${post.id}`}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-brand-300 hover:shadow-md"
                >
                  {/* 썸네일 */}
                  {imgSrc ? (
                    <div className="aspect-video w-full overflow-hidden rounded-t-2xl">
                      <img
                        src={imgSrc}
                        alt={imgAlt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video w-full items-center justify-center rounded-t-2xl bg-slate-100 text-slate-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* 카드 본문 */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className={`rounded-full px-3 py-0.5 text-sm font-semibold ${badgeClass}`}>
                        {badgeLabel}
                      </span>
                      {post.publishedAt && (
                        <time
                          dateTime={post.publishedAt}
                          className="text-sm text-slate-400"
                        >
                          {formatDate(post.publishedAt)}
                        </time>
                      )}
                    </div>
                    <h2 className="flex-1 text-xl font-bold leading-snug text-slate-900 group-hover:text-brand-700">
                      {post.title}
                    </h2>
                    <span className="mt-4 text-sm font-semibold text-brand-600">
                      자세히 보기 →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </Section>
    </>
  )
}
