import { useEffect, useRef } from 'react'
import type { SiteConfig } from '../types'
import type { DetailRoute } from '../hooks/useDetailRoute'
import { SafeImage } from './SafeImage'
import { Seal } from './Seal'

interface DetailPageProps {
  config: SiteConfig
  route: DetailRoute
  isClosing: boolean
  onClose: () => void
  onGoHome: () => void
  onNavigate: (route: DetailRoute, trigger?: HTMLElement | null) => void
}

function DetailRail({ config, kind, onGoHome }: {
  config: SiteConfig
  kind: DetailRoute['kind']
  onGoHome: () => void
}) {
  const backLabel = kind === 'chapter' ? config.copy.chapterDetailBack : config.copy.recordDetailBack
  return (
    <aside className="detail-rail" aria-label={backLabel}>
      <span className="detail-rail__brand">{config.brand.name}</span>
      <span className="detail-rail__rule" aria-hidden="true" />
      <span className="detail-rail__kind">{kind === 'chapter' ? 'Foi de capitol' : 'Dosare de servicii'}</span>
      <button type="button" className="detail-rail__back" onClick={onGoHome} aria-label={`${backLabel}, ${config.copy.closeDetail}`}>
        <span aria-hidden="true">←</span>
        <span>{backLabel}</span>
      </button>
    </aside>
  )
}

function ChapterDetail({ config, route, onClose, onNavigate }: Omit<DetailPageProps, 'isClosing'>) {
  const chapterIndex = config.chapters.findIndex((chapter) => chapter.id === route.id)
  const chapter = config.chapters[chapterIndex]
  const next = config.chapters[(chapterIndex + 1) % config.chapters.length]
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => titleRef.current?.focus({ preventScroll: true }), [chapter?.id])
  if (!chapter || !next) return null

  return (
    <main className="detail-main detail-main--chapter" id="detail-main">
      <div className="chapter-detail__painting" data-detail-motion="image">
        <SafeImage media={chapter.image} fallbackLabel={config.copy.imageUnavailable} loading="eager" />
        <div className="chapter-detail__painting-wash" aria-hidden="true" />
        <span className="chapter-detail__coordinate micro">{chapter.coordinates}</span>
      </div>

      <article className="chapter-detail__article">
        <header className="chapter-detail__header" data-detail-motion="mask">
          <span className="eyebrow">{chapter.detail.kicker}</span>
          <span className="chapter-detail__accent-rule" aria-hidden="true" />
          <h1 ref={titleRef} tabIndex={-1}>{chapter.detail.title}</h1>
          <p>{chapter.detail.intro}</p>
        </header>

        <blockquote className="chapter-detail__quote" data-detail-motion="draw">
          <span aria-hidden="true">“</span>
          <p>{chapter.detail.quote}</p>
          <cite>— {chapter.detail.quoteAttribution}</cite>
          <span aria-hidden="true">”</span>
        </blockquote>

        <div className="chapter-detail__prose" data-detail-motion="stagger">
          {chapter.detail.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>

        <footer className="detail-pager">
          <span>{chapter.index}</span>
          <span className="detail-pager__line" aria-hidden="true" />
          <span className="detail-pager__footnote">{chapter.detail.footnote}</span>
          <button
            type="button"
            onClick={(event) => onNavigate({ kind: 'chapter', id: next.id }, event.currentTarget)}
          >
            <small>{config.copy.nextChapter}</small>
            <strong>{next.label}</strong>
            <span aria-hidden="true">→</span>
          </button>
        </footer>
      </article>

      <button type="button" className="detail-close-mobile" onClick={onClose}>{config.copy.chapterDetailBack}</button>
    </main>
  )
}

function RecordDetail({ config, route, onClose, onNavigate }: Omit<DetailPageProps, 'isClosing'>) {
  const recordIndex = config.records.entries.findIndex((record) => record.id === route.id)
  const record = config.records.entries[recordIndex]
  const next = config.records.entries[(recordIndex + 1) % config.records.entries.length]
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => titleRef.current?.focus({ preventScroll: true }), [record?.id])
  if (!record || !next) return null

  return (
    <main className="detail-main detail-main--record" id="detail-main">
      <article className="record-detail__article">
        <header className="record-detail__header" data-detail-motion="mask">
          <div>
            <h1 ref={titleRef} tabIndex={-1}>{record.title}</h1>
            <p><strong>{record.season}</strong><span>·</span>{record.date}</p>
            <p className="record-detail__phenology">{record.detail.phenology}</p>
          </div>
          <div className="record-detail__folio">
            <span>DOSAR {String(recordIndex + 1).padStart(3, '0')}</span>
            <Seal character={record.index} label={`${record.season} field-note seal`} small />
          </div>
        </header>

        <div className="record-detail__season-index" aria-label="Season index" data-detail-motion="draw">
          {config.records.entries.map((entry) => {
            const isActive = entry.id === record.id
            return (
              <button
                key={entry.id}
                type="button"
                aria-current={isActive ? 'true' : undefined}
                className={isActive ? 'is-active' : ''}
                onClick={(event) => { if (!isActive) onNavigate({ kind: 'record', id: entry.id }, event.currentTarget) }}
              >
                <strong>{entry.season}</strong>
                <small>{entry.date}</small>
              </button>
            )
          })}
        </div>

        <div className="record-detail__landscape" data-detail-motion="image">
          <SafeImage media={config.records.primaryImage} fallbackLabel={config.copy.imageUnavailable} loading="eager" />
          <span>{record.title}</span>
        </div>

        <section className="record-detail__ledger" data-detail-motion="stagger" aria-labelledby="record-note-title">
          <div className="record-detail__note">
            <h2 id="record-note-title">{record.detail.noteHeading}</h2>
            <p>{record.detail.note}</p>
          </div>
          <div className="record-detail__findings">
            <h2>Livrabile cheie</h2>
            {record.detail.findings.map((finding) => (
              <p key={finding.label}><strong>{finding.label}</strong><span>{finding.text}</span></p>
            ))}
          </div>
          <dl>
            {record.detail.facts.map((fact) => (
              <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
            ))}
          </dl>
        </section>

        <div className="record-detail__specimen" data-detail-motion="specimen">
          <SafeImage media={config.records.specimenImage} fallbackLabel={config.copy.imageUnavailable} loading="eager" />
          <span className="record-detail__annotation record-detail__annotation--top">Forma văzută<br />înainte de material</span>
          <span className="record-detail__annotation record-detail__annotation--bottom">Detaliul care<br />rămâne în memorie</span>
        </div>

        <div className="record-detail__vessel" data-detail-motion="image" aria-hidden="true">
          <img src={config.records.detailImage.src} alt="" style={{ objectPosition: config.records.detailImage.position }} />
        </div>

        <button
          type="button"
          className="record-detail__next"
          onClick={(event) => onNavigate({ kind: 'record', id: next.id }, event.currentTarget)}
        >
          <small>{config.copy.nextRecord}</small>
          <strong>{next.title}</strong>
          <span aria-hidden="true">→</span>
        </button>
      </article>

      <button type="button" className="detail-close-mobile" onClick={onClose}>{config.copy.recordDetailBack}</button>
    </main>
  )
}

function MissingDetail({ config, kind, onClose }: {
  config: SiteConfig
  kind: DetailRoute['kind']
  onClose: () => void
}) {
  const backLabel = kind === 'chapter' ? config.copy.chapterDetailBack : config.copy.recordDetailBack
  const noteRef = useRef<HTMLParagraphElement>(null)
  useEffect(() => noteRef.current?.focus({ preventScroll: true }), [])
  return (
    <main className="detail-main detail-missing" id="detail-main">
      <p ref={noteRef} tabIndex={-1} className="detail-missing__note">
        {config.copy.detailMissing ?? 'This page doesn’t exist — or it has been sent back to the archive.'}
      </p>
      <button type="button" className="editorial-link detail-missing__back" onClick={onClose}>
        <span>{backLabel}</span>
        <i aria-hidden="true">←</i>
      </button>
      <button type="button" className="detail-close-mobile" onClick={onClose}>{backLabel}</button>
    </main>
  )
}

export function DetailPage(props: DetailPageProps) {
  const { config, route, isClosing, onClose, onGoHome } = props
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const resolved = route.kind === 'chapter'
    ? config.chapters.some((chapter) => chapter.id === route.id)
    : config.records.entries.some((record) => record.id === route.id)

  return (
    <div className="detail-page" data-kind={route.kind} data-closing={isClosing ? 'true' : 'false'}>
      <DetailRail config={config} kind={route.kind} onGoHome={onGoHome} />
      {!resolved && <MissingDetail config={config} kind={route.kind} onClose={onClose} />}
      {resolved && (route.kind === 'chapter'
        ? <ChapterDetail {...props} />
        : <RecordDetail {...props} />)}
    </div>
  )
}
