import type { SectionId, SectionNavItem, SiteConfig } from '../types'
import { navigateToHash } from '../lib/navigateToHash'
import { Seal } from './Seal'

interface ArchiveChromeProps {
  config: SiteConfig
  activeSection: SectionId
  progress: number
}

function SectionLinks({ items, activeSection, label, compact = false }: {
  items: SectionNavItem[]
  activeSection: SectionId
  label: string
  compact?: boolean
}) {
  return (
    <nav
      className={compact ? 'mobile-dock__nav' : 'archive-rail__nav'}
      aria-label={label}
      style={compact ? { gridTemplateColumns: `repeat(${items.length}, minmax(54px, 1fr))` } : undefined}
    >
      {items.map((item) => (
        <a
          key={item.id}
          className={item.id === activeSection ? 'section-link is-active' : 'section-link'}
          href={`#${item.id}`}
          onClick={navigateToHash}
          aria-current={item.id === activeSection ? 'location' : undefined}
        >
          <span className="section-link__mark" aria-hidden="true">{item.id === activeSection ? '◆' : '○'}</span>
          <span className="section-link__index">{item.index}</span>
          <span className="section-link__label">{item.label}</span>
        </a>
      ))}
    </nav>
  )
}

export function ArchiveChrome({ config, activeSection, progress }: ArchiveChromeProps) {
  return (
    <>
      <header className="mobile-header">
        <a className="mobile-header__brand" href="#cover" onClick={navigateToHash} aria-label={config.copy.returnToTop}>
          <img src={config.brand.logoSrc} alt="" aria-hidden="true" />
          <span>{config.brand.name}</span>
          <small>{config.brand.edition}</small>
        </a>
        <Seal character={config.brand.sealCharacter} label={`${config.brand.name} seal`} small />
      </header>

      <aside className="archive-rail" aria-label={config.copy.primaryNavLabel}>
        <div className="archive-rail__register" aria-hidden="true"><span /><span /></div>
        <a className="archive-rail__brand" href="#cover" onClick={navigateToHash} aria-label={config.copy.returnToTop}>
          <img className="archive-rail__logo" src={config.brand.logoSrc} alt="" aria-hidden="true" />
          <span className="archive-rail__brand-name">{config.brand.name}</span>
          <span className="archive-rail__edition">{config.brand.edition}</span>
        </a>
        <div className="archive-rail__track" aria-label={config.copy.scrollProgress} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
          <span style={{ transform: `scaleY(${progress})` }} />
        </div>
        <SectionLinks items={config.navigation} activeSection={activeSection} label={config.copy.primaryNavLabel} />
        <div className="archive-rail__mountain" aria-hidden="true">⌁</div>
      </aside>

      <div className="mobile-dock">
        <SectionLinks items={config.navigation} activeSection={activeSection} label={config.copy.primaryNavLabel} compact />
      </div>
    </>
  )
}
