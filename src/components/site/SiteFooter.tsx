import Link from 'next/link'
import { nav, site, telHref } from '@/lib/site'
import { Container } from './Container'

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* 회사 */}
          <div>
            <p className="text-xl font-extrabold text-white">{site.name}</p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-slate-400">{site.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <a href={site.links.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                유튜브
              </a>
              <span className="text-slate-600">·</span>
              <a href={site.links.blog} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                블로그
              </a>
              <span className="text-slate-600">·</span>
              <a href={site.links.cafe} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                네이버 카페
              </a>
            </div>
          </div>

          {/* 메뉴 */}
          <div>
            <p className="text-sm font-bold tracking-wider text-slate-500 uppercase">메뉴</p>
            <ul className="mt-4 space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[0.98rem] hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 연락처 / 사업자정보 */}
          <div>
            <p className="text-sm font-bold tracking-wider text-slate-500 uppercase">연락처</p>
            <ul className="mt-4 space-y-1.5 text-[0.98rem]">
              <li>
                전화{' '}
                <a href={telHref} className="font-semibold text-white hover:text-accent">
                  {site.tel}
                </a>
              </li>
              <li>팩스 {site.fax}</li>
              <li>
                이메일{' '}
                <a href={`mailto:${site.email}`} className="hover:text-white">
                  {site.email}
                </a>
              </li>
              <li>{site.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500">
          <p>
            상호 {site.name} · 대표 {site.ceo} · 사업자등록번호 {site.bizNo} · 통신판매{' '}
            {site.mailOrder}
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
