import React from 'react'
import type { Metadata } from 'next'
import './styles.css'
import { pretendard } from './fonts'
import { site } from '@/lib/site'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { QuickContactBar } from '@/components/site/QuickContactBar'

const siteUrl = process.env.SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} | ${site.region} 레이저 가공·주문제작`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    '진성레이져',
    '원주 레이저가공',
    '파이프레이저',
    '판레이저',
    '스텐 가공',
    '스텐 난간',
    '방범창',
    '주문제작',
  ],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: site.name,
    title: `${site.name} | ${site.region} 레이저 가공·주문제작`,
    description: site.description,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="min-h-screen bg-white">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <QuickContactBar />
      </body>
    </html>
  )
}
