import { useEffect, useState } from 'react'

interface GlobalNavigationProps {
  progress?: number
  currentPath?: '/' | '/studio' | '/contact'
}

const primaryLinks = [
  { label: 'Acasă', href: '/' },
  { label: 'Studio', href: '/studio' },
  { label: 'Despre mine', href: '/studio#despre-mine' },
  { label: 'Cărțile mele', href: '/cartile-mele' },
  { label: 'Contact', href: '/contact' },
]

function NavigationLinks({ currentPath, mobile = false }: { currentPath: string; mobile?: boolean }) {
  return (
    <nav className={mobile ? 'global-nav__links global-nav__links--mobile' : 'global-nav__links'} aria-label="Navigare principală">
      {primaryLinks.map((item) => (
        <a
          key={item.label}
          href={item.href}
          aria-current={item.href === currentPath ? 'page' : undefined}
          onClick={(event) => event.currentTarget.closest('details')?.removeAttribute('open')}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}

export function GlobalNavigation({ progress, currentPath = '/' }: GlobalNavigationProps) {
  const [measuredProgress, setMeasuredProgress] = useState(0)

  useEffect(() => {
    if (progress !== undefined) return undefined
    const update = () => {
      const distance = document.documentElement.scrollHeight - window.innerHeight
      setMeasuredProgress(distance > 0 ? Math.min(1, window.scrollY / distance) : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [progress])

  const visibleProgress = progress ?? measuredProgress

  return (
    <header className="global-nav" aria-label="Meniu principal">
      <div className="global-nav__glass">
        <NavigationLinks currentPath={currentPath} />
        <details className="global-nav__mobile-menu">
          <summary><span>Meniu</span><i aria-hidden="true" /></summary>
          <NavigationLinks currentPath={currentPath} mobile />
        </details>
      </div>
      <span className="global-nav__progress" aria-hidden="true">
        <i style={{ transform: `scaleX(${visibleProgress})` }} />
      </span>
    </header>
  )
}
