'use client'

import { useEffect, useRef, useState } from 'react'
import { site } from '@/lib/site'

const KAKAO_SDK_URL = (appKey: string) =>
  `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`

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

function MapFallback() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
      <div>
        <p className="text-lg font-bold text-slate-700">{site.address}</p>
        <p className="mt-1 text-base text-slate-500">({site.addressOld})</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
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

          const center = new kakao.maps.LatLng(site.geo.lat, site.geo.lng)
          const map = new kakao.maps.Map(container, {
            center,
            level: 4,
          })

          new kakao.maps.Marker({ position: center, map })
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
