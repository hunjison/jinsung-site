import React from 'react'
import { cn } from '@/lib/utils'
import { Container } from './Container'

/** 세로 여백을 가진 섹션 래퍼. tone으로 배경 구분 */
export function Section({
  children,
  className,
  tone = 'default',
  id,
}: {
  children: React.ReactNode
  className?: string
  tone?: 'default' | 'muted' | 'brand'
  id?: string
}) {
  const toneClass =
    tone === 'muted' ? 'bg-slate-50' : tone === 'brand' ? 'bg-brand-800 text-white' : 'bg-white'
  return (
    <section id={id} className={cn('py-16 sm:py-20', toneClass, className)}>
      <Container>{children}</Container>
    </section>
  )
}
