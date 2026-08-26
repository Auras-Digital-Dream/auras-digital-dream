import { useEffect, useState } from 'react'
import type { SectionId } from '../types'

export function useSectionProgress(sectionIds: SectionId[]) {
  const [activeSection, setActiveSection] = useState<SectionId>(sectionIds[0] ?? 'cover')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))
    let frame = 0

    const updatePosition = () => {
      frame = 0
      const available = document.documentElement.scrollHeight - window.innerHeight
      setProgress(available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0)

      const readingLine = window.innerHeight * 0.42
      const current = sections.find((section) => {
        const rect = section.getBoundingClientRect()
        return rect.top <= readingLine && rect.bottom > readingLine
      }) ?? sections.reduce<HTMLElement | undefined>((nearest, section) => {
        const distance = Math.abs(section.getBoundingClientRect().top - readingLine)
        if (!nearest) return section
        return distance < Math.abs(nearest.getBoundingClientRect().top - readingLine) ? section : nearest
      }, undefined)

      if (current) setActiveSection(current.id as SectionId)
    }

    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(updatePosition)
    }

    updatePosition()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [sectionIds])

  return { activeSection, progress }
}
