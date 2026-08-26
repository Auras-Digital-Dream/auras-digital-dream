import type { CSSProperties } from 'react'
import type { SiteConfig } from '../types'
import { SafeImage } from './SafeImage'
import { Seal } from './Seal'

type MarkerStyle = CSSProperties & {
  '--marker-x': string
  '--marker-y': string
  '--motion-delay': string
}

export function LandscapeAtlasSection({ config }: { config: SiteConfig }) {
  const { landscape } = config

  return (
    <section className="section landscape" id="landscape" aria-labelledby="landscape-title">
      <aside className="landscape__intro" data-reveal="mask">
        <span className="eyebrow">{landscape.kicker}</span>
        <h2 id="landscape-title">{landscape.title}</h2>
        <p>{landscape.intro}</p>
        <Seal character={config.brand.sealCharacter} label={`${config.brand.name} landscape atlas seal`} />
        <span className="landscape__folio micro">{landscape.folio}</span>
      </aside>

      <div className="landscape__media" data-reveal="image">
        <SafeImage media={landscape.image} fallbackLabel={config.copy.imageUnavailable} />
        <div className="landscape__wash" aria-hidden="true" />
        <div className="landscape__markers" aria-label={`${landscape.title} terrain notes`}>
          {landscape.markers.map((marker, index) => {
            const style: MarkerStyle = {
              '--marker-x': `${marker.x}%`,
              '--marker-y': `${marker.y}%`,
              '--motion-delay': `${360 + index * 110}ms`,
            }

            return (
              <article
                key={marker.id}
                className={`landscape-marker landscape-marker--${marker.align}`}
                style={style}
              >
                <span className="landscape-marker__point" aria-hidden="true" />
                <div>
                  <h3>{marker.label}</h3>
                  <p>{marker.text}</p>
                </div>
              </article>
            )
          })}
        </div>
        <div
          className="landscape__axis micro"
          style={{ gridTemplateColumns: `repeat(${landscape.axisLabels.length}, 1fr)` }}
          aria-hidden="true"
        >
          {landscape.axisLabels.map((label) => <span key={label}>{label}</span>)}
        </div>
      </div>
    </section>
  )
}
