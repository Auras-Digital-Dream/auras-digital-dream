import { useCallback, useEffect, useRef, useState } from 'react'

export type DetailRoute =
  | { kind: 'chapter'; id: string }
  | { kind: 'record'; id: string }

const DETAIL_STATE = 'qixiuDetail'
const SCROLL_STATE = 'qixiuScrollY'

function readRoute(): DetailRoute | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const chapter = params.get('chapter')
  const record = params.get('record')
  if (chapter) return { kind: 'chapter', id: chapter }
  if (record) return { kind: 'record', id: record }
  return null
}

function writeRoute(route: DetailRoute | null) {
  const url = new URL(window.location.href)
  url.searchParams.delete('chapter')
  url.searchParams.delete('record')
  if (route) url.searchParams.set(route.kind, route.id)
  if (route) url.hash = ''
  return `${url.pathname}${url.search}${url.hash}`
}

export function useDetailRoute() {
  const [route, setRoute] = useState<DetailRoute | null>(() => readRoute())
  const [isClosing, setIsClosing] = useState(false)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const closeTimerRef = useRef<number | null>(null)

  const restorePage = useCallback((state: unknown) => {
    const restoredState = state && typeof state === 'object' ? state as Record<string, unknown> : {}
    const scrollY = typeof restoredState[SCROLL_STATE] === 'number' ? restoredState[SCROLL_STATE] : 0
    setRoute(readRoute())
    setIsClosing(false)
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const previousScrollBehavior = document.documentElement.style.scrollBehavior
      document.documentElement.style.scrollBehavior = 'auto'
      window.scrollTo(0, scrollY)
      document.documentElement.style.scrollBehavior = previousScrollBehavior
      returnFocusRef.current?.focus({ preventScroll: true })
      returnFocusRef.current = null
    }))
  }, [])

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    const onPopState = (event: PopStateEvent) => restorePage(event.state)
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      window.history.scrollRestoration = previousRestoration
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
    }
  }, [restorePage])

  useEffect(() => {
    document.body.classList.toggle('is-detail-open', Boolean(route))
    return () => document.body.classList.remove('is-detail-open')
  }, [route])

  const open = useCallback((next: DetailRoute, trigger?: HTMLElement | null) => {
    if (!route) {
      const currentState = window.history.state && typeof window.history.state === 'object' ? window.history.state : {}
      window.history.replaceState({ ...currentState, [SCROLL_STATE]: window.scrollY }, '', window.location.href)
      returnFocusRef.current = trigger ?? null
    }
    window.history.pushState({ [DETAIL_STATE]: true }, '', writeRoute(next))
    setIsClosing(false)
    setRoute(next)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [route])

  const closeNow = useCallback(() => {
    const state = window.history.state && typeof window.history.state === 'object' ? window.history.state as Record<string, unknown> : {}
    if (state[DETAIL_STATE]) {
      window.history.back()
      return
    }
    window.history.replaceState({}, '', writeRoute(null))
    restorePage({ [SCROLL_STATE]: 0 })
  }, [restorePage])

  const close = useCallback(() => {
    if (!route || isClosing) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      closeNow()
      return
    }
    setIsClosing(true)
    closeTimerRef.current = window.setTimeout(closeNow, 440)
  }, [closeNow, isClosing, route])

  return { route, isClosing, open, close }
}
