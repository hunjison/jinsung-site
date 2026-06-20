import { site, telHref } from '@/lib/site'

/**
 * 빠른 연락 수단.
 * - 모바일: 화면 하단 고정 '전화 상담' 큰 버튼 (40~60대 접근성)
 * - 데스크톱: 우측 세로 플로팅 버튼 (전화 / 유튜브)
 */
export function QuickContactBar() {
  return (
    <>
      {/* 모바일 하단 고정 바 */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <a
          href={telHref}
          className="flex h-14 items-center justify-center rounded-xl bg-accent text-xl font-extrabold text-white shadow-lg active:bg-accent-dark"
        >
          ☎ 전화 상담 {site.tel}
        </a>
      </div>
      {/* 모바일 하단 바에 가려지지 않도록 여백 확보 */}
      <div className="h-20 lg:hidden" aria-hidden />

      {/* 데스크톱 우측 플로팅 */}
      <div className="fixed right-5 bottom-8 z-40 hidden flex-col gap-3 lg:flex">
        <a
          href={telHref}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform hover:scale-105"
          aria-label={`전화 ${site.tel}`}
          title={`전화 ${site.tel}`}
        >
          <span className="text-2xl">☎</span>
        </a>
        <a
          href={site.links.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform hover:scale-105"
          aria-label="유튜브 채널"
          title="유튜브 채널"
        >
          <span className="text-xl font-bold">▶</span>
        </a>
      </div>
    </>
  )
}
