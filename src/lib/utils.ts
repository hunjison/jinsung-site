/** 간단한 className 결합 헬퍼 (외부 의존성 없이 토큰 절약) */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
