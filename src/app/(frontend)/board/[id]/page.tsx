import type { ComponentProps } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Container } from '@/components/site/Container'
import { PageHero } from '@/components/site/PageHero'

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

const CATEGORY_BADGE: Record<CategoryValue, string> = {
  notice: 'bg-accent text-white',
  work: 'bg-brand-700 text-white',
}

type PostDoc = {
  title: string
  category?: string | null
  publishedAt?: string | null
  coverImage?: unknown
  body?: unknown
  images?: unknown[]
}

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  try {
    const payload = await getPayload({ config })
    const post = await payload.findByID({ collection: 'posts', id, depth: 0 })
    return { title: post?.title ?? '게시글' }
  } catch {
    return { title: '게시글' }
  }
}

export default async function BoardDetailPage({ params }: Props) {
  const { id } = await params

  const payload = await getPayload({ config })

  let postData: PostDoc | null = null

  try {
    postData = (await payload.findByID({ collection: 'posts', id, depth: 1 })) as unknown as PostDoc
  } catch {
    notFound()
  }

  if (!postData) notFound()

  const cat = postData.category as CategoryValue | undefined
  const badgeClass = cat ? (CATEGORY_BADGE[cat] ?? 'bg-slate-500 text-white') : 'bg-slate-500 text-white'
  const badgeLabel = cat ? (CATEGORY_LABEL[cat] ?? cat) : ''

  // 대표 사진
  const coverImg =
    postData.coverImage &&
    typeof postData.coverImage === 'object' &&
    'url' in (postData.coverImage as object)
      ? (postData.coverImage as { url?: string | null; sizes?: { large?: { url?: string | null } }; alt?: string; width?: number; height?: number })
      : null

  const coverSrc = coverImg?.sizes?.large?.url ?? coverImg?.url ?? null

  // 추가 사진 배열
  const extraImages = Array.isArray(postData.images)
    ? postData.images
        .filter((img): img is { url?: string | null; sizes?: { card?: { url?: string | null } }; alt?: string } =>
          typeof img === 'object' && img !== null && 'url' in (img as object),
        )
    : []

  return (
    <>
      <PageHero title={postData.title} />

      <div className="py-10 sm:py-14">
        <Container>
          {/* 메타 행: 배지 + 날짜 */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {cat && (
              <span className={`rounded-full px-4 py-1 text-sm font-semibold ${badgeClass}`}>
                {badgeLabel}
              </span>
            )}
            {postData.publishedAt && (
              <time dateTime={postData.publishedAt} className="text-base text-slate-400">
                {formatDate(postData.publishedAt)}
              </time>
            )}
          </div>

          {/* 대표 사진 */}
          {coverSrc && (
            <div className="mb-10 overflow-hidden rounded-2xl">
              <img
                src={coverSrc}
                alt={coverImg?.alt ?? postData.title}
                loading="lazy"
                className="w-full object-cover"
              />
            </div>
          )}

          {/* 본문 (Lexical richText) */}
          {Boolean(postData.body) && (
            <div className="mb-12">
              <RichText
                data={postData.body as ComponentProps<typeof RichText>['data']}
                className="prose-ko"
              />
            </div>
          )}

          {/* 추가 사진 갤러리 */}
          {extraImages.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-slate-800">사진 갤러리</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {extraImages.map((img, idx) => {
                  const src = img.sizes?.card?.url ?? img.url ?? ''
                  return (
                    <div key={idx} className="overflow-hidden rounded-xl border border-slate-200">
                      <img
                        src={src}
                        alt={img.alt ?? `사진 ${idx + 1}`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 목록으로 돌아가기 */}
          <div className="border-t border-slate-200 pt-8">
            <Link
              href="/board"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-600 px-6 py-3 font-bold text-brand-700 transition-colors hover:bg-brand-50"
            >
              ← 목록으로
            </Link>
          </div>
        </Container>
      </div>
    </>
  )
}
