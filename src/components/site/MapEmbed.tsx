import { site } from '@/lib/site'

/**
 * API 키 없이 주소만으로 지도를 임베드 (Google 지도 embed).
 * 키 불필요 — 어디서나 바로 표시된다. (오시는 길에서 카카오 키가 있으면 KakaoMap이 우선 사용됨)
 */
export function MapEmbed({ className = 'h-72 w-full sm:h-96' }: { className?: string }) {
  const q = encodeURIComponent(site.address)
  return (
    <iframe
      title={`${site.name} 위치 지도`}
      src={`https://maps.google.com/maps?q=${q}&z=16&hl=ko&output=embed`}
      loading="lazy"
      className={`overflow-hidden rounded-2xl border border-slate-200 ${className}`}
      style={{ border: 0 }}
      referrerPolicy="no-referrer-when-downgrade"
    />
  )
}
