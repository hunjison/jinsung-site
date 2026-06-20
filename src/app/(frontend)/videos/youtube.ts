/**
 * 유튜브 URL에서 video ID를 추출하는 헬퍼.
 * 지원 형식:
 *   https://www.youtube.com/watch?v=XXXXXXXXXXX
 *   https://youtu.be/XXXXXXXXXXX
 *   https://www.youtube.com/embed/XXXXXXXXXXX
 *   https://www.youtube.com/shorts/XXXXXXXXXXX
 */
export function getYouTubeId(url: string): string | null {
  if (!url) return null

  try {
    const parsed = new URL(url)

    // youtu.be/<id>
    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0]
      return id || null
    }

    // www / m / music 등 모든 youtube.com 서브도메인 대응
    if (parsed.hostname === 'youtube.com' || parsed.hostname.endsWith('.youtube.com')) {
      // /watch?v=<id>
      const v = parsed.searchParams.get('v')
      if (v) return v

      const parts = parsed.pathname.split('/').filter(Boolean)

      // /embed/<id>
      if (parts[0] === 'embed' && parts[1]) return parts[1]

      // /shorts/<id>
      if (parts[0] === 'shorts' && parts[1]) return parts[1]
    }
  } catch {
    // URL 파싱 실패 시 정규식으로 재시도
  }

  // 정규식 폴백 (비표준 형식 대응)
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  )
  return match ? match[1] : null
}
