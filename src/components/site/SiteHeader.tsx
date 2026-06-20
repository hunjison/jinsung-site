'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { nav, site, telHref } from '@/lib/site'
import { Container } from './Container'

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      {/* 상단 연락 스트립 */}
      <div className="hidden bg-brand-800 text-white sm:block">
        <Container className="flex h-9 items-center justify-end gap-5 text-sm">
          <span className="text-brand-100">강원도 원주 · 레이저 가공 전문</span>
          <a href={telHref} className="font-semibold hover:text-accent">
            ☎ {site.tel}
          </a>
        </Container>
      </div>

      <Container className="flex h-16 items-center justify-between sm:h-20">
        {/* 로고 */}
        <Link href="/" className="flex items-baseline gap-2" aria-label={`${site.name} 홈`}>
          <span className="text-2xl font-extrabold tracking-tight text-brand-700">{site.name}</span>
          <span className="hidden text-sm font-medium text-slate-400 sm:inline">JINSUNG LASER</span>
        </Link>

        {/* 데스크톱 내비 */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="주요 메뉴">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-4 py-2 text-[1.05rem] font-semibold transition-colors',
                isActive(item.href)
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-brand-700',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 데스크톱 CTA */}
        <a
          href={telHref}
          className="hidden rounded-lg bg-accent px-5 py-2.5 text-[1.05rem] font-bold text-white shadow-sm transition-colors hover:bg-accent-dark lg:inline-block"
        >
          전화 상담
        </a>

        {/* 모바일 햄버거 */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-slate-700 lg:hidden"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-2xl leading-none">{open ? '✕' : '☰'}</span>
        </button>
      </Container>

      {/* 모바일 메뉴 */}
      {open && (
        <nav className="border-t border-slate-200 bg-white lg:hidden" aria-label="모바일 메뉴">
          <Container className="flex flex-col py-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-md px-3 py-3 text-lg font-semibold',
                  isActive(item.href) ? 'bg-brand-50 text-brand-700' : 'text-slate-800',
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={telHref}
              className="mt-2 mb-2 rounded-lg bg-accent px-4 py-3 text-center text-lg font-bold text-white"
            >
              ☎ 전화 상담 {site.tel}
            </a>
          </Container>
        </nav>
      )}
    </header>
  )
}
