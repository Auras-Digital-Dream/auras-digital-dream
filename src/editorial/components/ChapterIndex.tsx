import { useId, useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { SiteConfig } from '../types'
import { SafeImage } from './SafeImage'
import { Seal } from './Seal'

export function ChapterIndex({ config, onOpenDetail }: {
  config: SiteConfig
  onOpenDetail: (id: string, trigger: HTMLElement) => void
}) {
  const [activeId, setActiveId] = useState(config.chapters[0]?.id ?? '')
  const groupId = useId()
  const activeIndex = Math.max(0, config.chapters.findIndex((chapter) => chapter.id === activeId))
  const active = config.chapters[activeIndex]

  if (!active) return null

  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0
    if (!delta) return
    event.preventDefault()
    const nextIndex = (index + delta + config.chapters.length) % config.chapters.length
    setActiveId(config.chapters[nextIndex]?.id ?? activeId)
    document.getElementById(`${groupId}-${nextIndex}`)?.focus()
  }

  return (
    <section className="section chapters" id="chapters" aria-labelledby="chapters-title">
      <div className="chapters__image" data-reveal="image">
        <SafeImage key={active.image.src + active.image.position} media={active.image} fallbackLabel={config.copy.imageUnavailable} />
        <div className="chapters__image-wash" aria-hidden="true" />
        <span className="chapters__coordinate micro">{active.coordinates}</span>
      </div>
      <div className="chapters__content">
        <header className="chapters__header" data-reveal="mask">
          <div>
            <span className="eyebrow">{config.copy.chapterIndexKicker}</span>
            <h2 id="chapters-title">Patru piloni. Un singur vis.</h2>
          </div>
          <Seal character={active.index} label={`${config.copy.activeChapter}: ${active.label}`} small />
        </header>
        <div
          className="chapters__tabs"
          role="tablist"
          aria-label={config.copy.chapterNavLabel}
          aria-orientation="horizontal"
          style={{ gridTemplateColumns: `repeat(${config.chapters.length}, minmax(72px, 1fr))` }}
          data-reveal="stagger"
        >
          {config.chapters.map((chapter, index) => {
            const selected = chapter.id === active.id
            return (
              <button
                id={`${groupId}-${index}`}
                key={chapter.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${groupId}-panel`}
                tabIndex={selected ? 0 : -1}
                className={selected ? 'chapter-tab is-active' : 'chapter-tab'}
                onClick={() => setActiveId(chapter.id)}
                onMouseEnter={() => setActiveId(chapter.id)}
                onKeyDown={(event) => move(event, index)}
              >
                <span className="chapter-tab__dot" aria-hidden="true" />
                <span className="chapter-tab__label">{chapter.label}</span>
                <span className="chapter-tab__script">{chapter.script}</span>
                <span className="chapter-tab__slit" aria-hidden="true">
                  <img src={chapter.image.src} alt="" style={{ objectPosition: chapter.image.position }} />
                </span>
              </button>
            )
          })}
        </div>
        <article id={`${groupId}-panel`} className="chapters__panel" role="tabpanel" aria-live="polite" data-reveal="rise">
          <span className="chapters__panel-index">{active.index}</span>
          <div>
            <span className="chapters__panel-script">{active.script}</span>
            <h3>{active.title}</h3>
            <p>{active.summary}</p>
            <button
              type="button"
              className="editorial-link chapters__detail-link"
              onClick={(event) => onOpenDetail(active.id, event.currentTarget)}
            >
              <span>{config.copy.openChapterDetail}</span>
              <i aria-hidden="true">→</i>
            </button>
          </div>
        </article>
      </div>
    </section>
  )
}
