'use client'

import { useEffect, useRef, useState } from 'react'
import { site } from '@/lib/site'

const KAKAO_SDK_URL = (appKey: string) =>
  `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`

type MapState = 'loading' | 'ready' | 'fallback'

const encodedAddress = encodeURIComponent(site.address)

const externalMapLinks = [
  {
    label: '카카오맵으로 보기',
    href: `https://map.kakao.com/?q=${encodedAddress}`,
    bg: 'bg-[#FFE000] text-slate-900 hover:bg-yellow-300',
  },
  {
    label: '네이버지도로 보기',
    href: `https://map.naver.com/v5/search/${encodedAddress}`,
    bg: 'bg-[#03C75A] text-white hover:bg-[#02a84d]',
  },
  {
    label: '구글지도로 보기',
    href: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
    bg: 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50',
  },
] as const

// 카카오 키가 없을 때: API 키 불필요한 Google 지도 임베드(실제 지도) + 외부 지도앱 링크
function MapFallback() {
  return (
    <div>
      <iframe
        title={`${site.name} 위치 지도`}
        src={`https://maps.google.com/maps?q=${encodedAddress}&z=16&hl=ko&output=embed`}
        loading="lazy"
        className="h-72 w-full overflow-hidden rounded-2xl border border-slate-200 sm:h-96"
        style={{ border: 0 }}
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        {externalMapLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-base font-bold transition-colors ${link.bg}`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<MapState>('loading')

  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY

  useEffect(() => {
    // No app key configured — go straight to fallback
    if (!appKey) {
      setState('fallback')
      return
    }

    function initMap() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const kakao = (window as any).kakao
      if (!kakao?.maps) {
        setState('fallback')
        return
      }

      kakao.maps.load(() => {
        try {
          const container = mapRef.current
          if (!container) {
            setState('fallback')
            return
          }

          const fallbackCenter = new kakao.maps.LatLng(site.geo.lat, site.geo.lng)
          const map = new kakao.maps.Map(container, {
            center: fallbackCenter,
            level: 4,
          })

          const placeMarker = (position: unknown) => {
            new kakao.maps.Marker({ position, map })
          }

          // 주소를 직접 지오코딩해 정확한 위치에 마커 표시 (services 라이브러리)
          const geocoder = kakao.maps.services && new kakao.maps.services.Geocoder()
          if (geocoder) {
            geocoder.addressSearch(
              site.address,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (result: any[], status: string) => {
                if (status === kakao.maps.services.Status.OK && result[0]) {
                  const coords = new kakao.maps.LatLng(Number(result[0].y), Number(result[0].x))
                  map.setCenter(coords)
                  placeMarker(coords)
                } else {
                  placeMarker(fallbackCenter)
                }
              },
            )
          } else {
            placeMarker(fallbackCenter)
          }

          setState('ready')
        } catch {
          setState('fallback')
        }
      })
    }

    // SDK already loaded
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).kakao?.maps) {
      initMap()
      return
    }

    // Inject SDK script idempotently
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-maps-sdk]',
    )
    if (existingScript) {
      // Script is already being loaded; wait for it
      existingScript.addEventListener('load', initMap)
      existingScript.addEventListener('error', () => setState('fallback'))
      return
    }

    const script = document.createElement('script')
    script.setAttribute('data-kakao-maps-sdk', 'true')
    script.src = KAKAO_SDK_URL(appKey)
    script.async = true
    script.onload = initMap
    script.onerror = () => setState('fallback')
    document.head.appendChild(script)
  }, [appKey])

  if (state === 'fallback') {
    return <MapFallback />
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      {/* Map container — always rendered; hidden until ready to avoid layout shift */}
      <div
        ref={mapRef}
        className="h-72 w-full sm:h-96"
        aria-label="진성레이져 위치 지도"
      />
      {state === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <span className="text-slate-400">지도를 불러오는 중…</span>
        </div>
      )}
    </div>
  )
}
