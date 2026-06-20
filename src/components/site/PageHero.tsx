import React from 'react'
import { Container } from './Container'

/** 내부 페이지 상단 히어로 띠 (제목 + 부제) */
export function PageHero({
  title,
  subtitle,
}: {
  title: React.ReactNode
  subtitle?: React.ReactNode
}) {
  return (
    <div className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
      <Container className="py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-lg text-slate-600">{subtitle}</p>}
      </Container>
    </div>
  )
}
