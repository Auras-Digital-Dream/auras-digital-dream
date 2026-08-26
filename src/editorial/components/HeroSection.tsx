import type { SiteConfig } from '../types'
import { navigateToHash } from '../lib/navigateToHash'
import { SafeImage } from './SafeImage'
import { Seal } from './Seal'

export function HeroSection({ config }: { config: SiteConfig }) {
  const [brandLead, ...brandRest] = config.hero.title.split(' ')
  return (
    <section className="section hero" id="cover" aria-labelledby="hero-title">
      <div className="section-register section-register--top" aria-hidden="true" />
      <div className="hero__edition micro" data-reveal="rise">{config.brand.edition}</div>
      <div className="hero__title-card" data-reveal="mask">
        <img className="hero__brand-logo" src={config.brand.logoSrc} alt="" aria-hidden="true" />
        <span className="hero__kicker">{config.hero.kicker}</span>
        <h1 id="hero-title" aria-label={config.hero.title}>
          <span aria-hidden="true">{brandLead}</span>
          <small aria-hidden="true">{brandRest.join(' ')}</small>
        </h1>
        <span className="hero__card-rule" aria-hidden="true" />
        <Seal character={config.brand.sealCharacter} label={`${config.brand.name} seal`} small />
      </div>
      <p className="hero__statement" data-reveal="rise">{config.hero.statement}</p>
      <div className="hero__art" aria-hidden="true">
        <SafeImage media={config.hero.image} fallbackLabel={config.copy.imageUnavailable} loading="eager" />
      </div>
      <a className="hero__scroll" href="#chapters" onClick={navigateToHash}>
        <span>{config.hero.scrollLabel}</span>
        <i aria-hidden="true" />
      </a>
      <div className="hero__folio micro" aria-hidden="true">{config.copy.archiveFolio}</div>
    </section>
  )
}
