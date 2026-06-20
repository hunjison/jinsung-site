import localFont from 'next/font/local'

/**
 * Pretendard 가변 폰트 (셀프 호스팅).
 * 40~60대 가독성을 위해 본문 기본 굵기는 충분히 진하게, 제목은 ExtraBold 이상 사용.
 * 외부 CDN 의존 없이 woff2 1개만 로드 → resilience.
 */
export const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
  fallback: ['Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
})
