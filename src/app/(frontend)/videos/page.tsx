import { getPayload } from 'payload'
import config from '@/payload.config'
import { site } from '@/lib/site'
import { Container } from '@/components/site/Container'
import { Section } from '@/components/site/Section'
import { SectionHeading } from '@/components/site/SectionHeading'
import { PageHero } from '@/components/site/PageHero'
import { getYouTubeId } from './youtube'

export const dynamic = 'force-dynamic'

export const metadata = { title: '동영상' }

export default async function VideosPage() {
  const payload = await getPayload({ config })
  const { docs: videos } = await payload.find({
    collection: 'videos',
    sort: 'order',
    limit: 100,
  })

  // YouTube ID가 유효한 영상만 표시
  const validVideos = videos.filter((v) => getYouTubeId(v.youtubeUrl))

  return (
    <>
      <PageHero
        title="동영상"
        subtitle="진성레이져의 실제 레이저 가공·작업 현장을 영상으로 확인하세요."
      />

      {validVideos.length === 0 ? (
        /* ── 빈 DB 폴백 ── */
        <Section>
          <Container>
            <div className="flex flex-col items-center py-16 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
                {/* 재생 아이콘 */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-10 w-10 text-brand-600"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 sm:text-4xl">
                준비 중입니다
              </h2>
              <p className="mt-4 max-w-md text-lg text-slate-600">
                곧 파이프 레이저·판재 레이저 작업 영상이 업로드될 예정입니다.
                <br />
                지금은 유튜브 채널에서 영상을 먼저 확인하실 수 있습니다.
              </p>
              <a
                href={site.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-9 inline-flex items-center gap-2 rounded-lg bg-[#FF0000] px-8 py-4 text-lg font-bold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                {/* YouTube 로고 아이콘 */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                유튜브 채널 바로가기
              </a>
              <p className="mt-4 text-base text-slate-400">
                새 탭에서 {site.name} 유튜브 채널이 열립니다.
              </p>
            </div>
          </Container>
        </Section>
      ) : (
        /* ── 영상 그리드 ── */
        <Section>
          <Container>
            <SectionHeading
              eyebrow="WORKS"
              title="작업 영상"
              description="진성레이져의 레이저 가공 현장을 직접 확인해 보세요."
            />
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {validVideos.map((video) => {
                const videoId = getYouTubeId(video.youtubeUrl)!
                return (
                  <div
                    key={video.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    {/* 16:9 반응형 iframe */}
                    <div className="aspect-video w-full">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        className="h-full w-full"
                      />
                    </div>
                    {/* 제목·설명 */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="mt-2 text-base text-slate-600 line-clamp-3">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 채널 링크 — 영상이 있을 때도 유튜브 채널로 유도 */}
            <div className="mt-14 flex justify-center">
              <a
                href={site.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-600 px-7 py-3 font-bold text-brand-700 transition-colors hover:bg-brand-50"
              >
                유튜브 채널에서 더 보기 →
              </a>
            </div>
          </Container>
        </Section>
      )}
    </>
  )
}
