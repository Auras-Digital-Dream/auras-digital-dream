import { useEffect } from 'react'

const clamp = (value: number) => Math.min(1, Math.max(0, value))

export function useScrollMotion(enabled: boolean) {
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>('.editorial-archive')
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.section'))
    const recordEntries = Array.from(document.querySelectorAll<HTMLElement>('.record-entry'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const settleReducedMotion = () => {
      if (shell) shell.dataset.motion = 'reduced'
      sections.forEach((section) => {
        section.dataset.motionState = 'active'
        section.style.setProperty('--section-shift', '0px')
        section.style.setProperty('--section-shift-soft', '0px')
      })
      recordEntries.forEach((entry, index) => {
        entry.dataset.recordActive = index === 0 ? 'true' : 'false'
      })
    }

    const update = () => {
      frame = 0
      if (!enabled || reducedMotion.matches) {
        settleReducedMotion()
        return
      }

      if (shell) shell.dataset.motion = 'full'
      const viewportHeight = window.innerHeight

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height))
        const shift = (0.5 - progress) * 44
        section.style.setProperty('--section-shift', `${shift.toFixed(2)}px`)
        section.style.setProperty('--section-shift-soft', `${(shift * 0.46).toFixed(2)}px`)

        if (rect.top > viewportHeight * 0.56) section.dataset.motionState = 'entering'
        else if (rect.bottom < viewportHeight * 0.44) section.dataset.motionState = 'leaving'
        else section.dataset.motionState = 'active'
      })

      const visibleEntries = recordEntries.filter((entry) => {
        const rect = entry.getBoundingClientRect()
        return rect.bottom > viewportHeight * 0.16 && rect.top < viewportHeight * 0.84
      })
      const activeEntry = visibleEntries.sort((a, b) => {
        const aRect = a.getBoundingClientRect()
        const bRect = b.getBoundingClientRect()
        return Math.abs(aRect.top + aRect.height / 2 - viewportHeight * 0.48)
          - Math.abs(bRect.top + bRect.height / 2 - viewportHeight * 0.48)
      })[0]
      recordEntries.forEach((entry) => {
        entry.dataset.recordActive = entry === activeEntry ? 'true' : 'false'
      })
    }

    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    reducedMotion.addEventListener('change', schedule)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      reducedMotion.removeEventListener('change', schedule)
    }
  }, [enabled])
}
