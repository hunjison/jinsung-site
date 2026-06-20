import React from 'react'
import { cn } from '@/lib/utils'

/** 섹션 제목 블록: 작은 라벨(eyebrow) + 제목 + 설명 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  invert = false,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: 'center' | 'left'
  invert?: boolean
}) {
  return (
    <div className={cn('max-w-3xl', align === 'center' ? 'mx-auto text-center' : 'text-left')}>
      {eyebrow && (
        <p
          className={cn(
            'mb-3 text-sm font-bold tracking-wider uppercase',
            invert ? 'text-brand-200' : 'text-brand-600',
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2 className={cn('text-3xl sm:text-4xl', invert && 'text-white')}>{title}</h2>
      {description && (
        <p className={cn('mt-4 text-lg', invert ? 'text-brand-100' : 'text-slate-600')}>
          {description}
        </p>
      )}
    </div>
  )
}
