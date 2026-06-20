import React from 'react'
import { cn } from '@/lib/utils'

/** 페이지 공통 가로 폭 컨테이너 */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8', className)}>{children}</div>
}
