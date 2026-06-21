import { site, telHref } from '@/lib/site'

/* 브랜드 로고 아이콘 (인라인 SVG) */
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1l-2.2 2.2z" />
    </svg>
  )
}
function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.79 1.86 5.23 4.65 6.61-.15.53-.97 3.32-1 3.54 0 0-.02.16.08.22.1.06.23.02.23.02.3-.04 3.43-2.25 3.97-2.63.66.09 1.36.14 2.07.14 5.52 0 10-3.48 10-7.86S17.52 3 12 3z" />
    </svg>
  )
}
function NaverIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.273 12.845 7.376 0H0v24h7.726V11.155L16.624 24H24V0h-7.727z" />
    </svg>
  )
}
function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M9.5 7.5v9l7-4.5-7-4.5z" />
    </svg>
  )
}

/**
 * 빠른 연락 수단.
 * - 모바일: 화면 하단 고정 '전화 상담' 큰 버튼 (40~60대 접근성)
 * - 데스크톱: 우측 세로 플로팅 버튼 (전화 / 카카오톡 / 네이버 블로그 / 유튜브)
 */
export function QuickContactBar() {
  return (
    <>
      {/* 모바일 하단 고정 바 */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <a
          href={telHref}
          className="flex h-14 items-center justify-center gap-2 rounded-xl bg-accent text-xl font-extrabold text-white shadow-lg active:bg-accent-dark"
        >
          <PhoneIcon className="h-6 w-6" />
          전화 상담 {site.tel}
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
          <PhoneIcon className="h-7 w-7" />
        </a>
        <a
          href={site.links.kakao || '/location'}
          {...(site.links.kakao ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] text-[#3C1E1E] shadow-lg transition-transform hover:scale-105"
          aria-label="카카오톡 상담"
          title="카카오톡 상담"
        >
          <KakaoIcon className="h-7 w-7" />
        </a>
        <a
          href={site.links.cafe}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#03C75A] text-white shadow-lg transition-transform hover:scale-105"
          aria-label="네이버 카페"
          title="네이버 카페"
        >
          <NaverIcon className="h-6 w-6" />
        </a>
        <a
          href={site.links.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform hover:scale-105"
          aria-label="유튜브 채널"
          title="유튜브 채널"
        >
          <YoutubeIcon className="h-8 w-8" />
        </a>
      </div>
    </>
  )
}
