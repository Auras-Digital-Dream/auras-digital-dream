import type { SiteConfig } from '../types'
import { SafeImage } from './SafeImage'
import { Seal } from './Seal'

export function SpecimenSection({ config }: { config: SiteConfig }) {
  const { specimen } = config
  const sectionIndex = config.navigation.find((item) => item.id === 'specimen')?.index ?? 'Four'
  return (
    <section className="section specimen" id="specimen" aria-labelledby="specimen-title">
      <div className="specimen__mineral-band" aria-hidden="true">
        <span>VOLUME · {sectionIndex} · OBJECTS</span>
      </div>
      <header className="specimen__heading" data-reveal="mask">
        <span className="eyebrow">{specimen.kicker}</span>
        <h2 id="specimen-title">{specimen.title}</h2>
        <span className="specimen__meta micro">{specimen.period}<br />{specimen.material}</span>
      </header>
      <div className="specimen__seal" data-reveal="seal">
        <Seal character={config.brand.sealCharacter} label={`${config.brand.name} archive seal`} />
      </div>
      <div className="specimen__media" data-reveal="image">
        <SafeImage media={specimen.image} fallbackLabel={config.copy.imageUnavailable} />
      </div>
      <div className="specimen__notes" data-reveal="stagger">
        {specimen.notes.map((note) => (
          <article key={note.id} className="specimen-note">
            <span className="specimen-note__dot" aria-hidden="true" />
            <h3>{note.heading}</h3>
            <p>{note.text}</p>
          </article>
        ))}
      </div>
      <p className="specimen__summary" data-reveal="rise">{specimen.summary}</p>
      <div className="specimen__scale" aria-hidden="true">
        <span className="specimen__scale-line" />
        {specimen.scaleLabels.map((label, index) => (
          <span key={label} className="specimen__scale-mark"><i />{String(index + 1).padStart(2, '0')} · {label}</span>
        ))}
      </div>
    </section>
  )
}
