import { useEffect } from 'react'

export function useReveal(enabled: boolean) {
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>('.editorial-archive')
    if (!shell) return
    const nodes = Array.from(shell.querySelectorAll<HTMLElement>('[data-reveal]'))
    const revealNode = (node: HTMLElement) => {
      node.dataset.revealed = 'true'
    }
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach(revealNode)
      return
    }

    const clippedNodes = new Set(
      nodes.filter((node) => node.dataset.reveal === 'mask' || node.dataset.reveal === 'image'),
    )
    const heroNodes = nodes.filter((node) => node.closest('#cover'))
    requestAnimationFrame(() => requestAnimationFrame(() => heroNodes.forEach(revealNode)))
    const targets = Array.from(new Set(nodes.map((node) => (
      clippedNodes.has(node) ? node.closest<HTMLElement>('.section') ?? node : node
    ))))

    const revealTarget = (target: HTMLElement) => {
      if (target.hasAttribute('data-reveal')) revealNode(target)
      target.querySelectorAll<HTMLElement>('[data-reveal="mask"], [data-reveal="image"]')
        .forEach(revealNode)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          revealTarget(entry.target as HTMLElement)
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12 },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [enabled])
}
