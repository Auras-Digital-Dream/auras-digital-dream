import { useEffect, useRef } from 'react'
import type { SiteConfig } from '../types'
import { navigateToHash } from '../lib/navigateToHash'
import { Seal } from './Seal'

export function ColophonSection({ config }: { config: SiteConfig }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const pauseAt = config.colophon.quote.indexOf('，')
  const quoteLead = pauseAt >= 0 ? config.colophon.quote.slice(0, pauseAt + 1) : config.colophon.quote
  const quoteTail = pauseAt >= 0 ? config.colophon.quote.slice(pauseAt + 1) : ''

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const play = () => {
      video.muted = true
      void video.play().catch(() => undefined)
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) play()
      else video.pause()
    }, { threshold: 0.16 })

    observer.observe(video)
    video.addEventListener('canplay', play)
    return () => {
      observer.disconnect()
      video.removeEventListener('canplay', play)
    }
  }, [])

  return (
    <section className="section colophon" id="colophon" aria-labelledby="colophon-title">
      <div className="colophon__register" aria-hidden="true"><span /><span /></div>
      <div className="colophon__stage">
        <figure className="colophon__device" data-reveal="image">
          <video
            ref={videoRef}
            className="colophon__video"
            src="/editorial-media/colophon-dream.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
            aria-hidden="true"
          />
          <figcaption>
            <span>MEMORIA VIZUALĂ</span>
            <span>08 SEC · LOOP</span>
          </figcaption>
        </figure>

        <div className="colophon__glass" data-reveal="mask">
          <div className="colophon__body">
            <span className="eyebrow">{config.colophon.kicker}</span>
            <h2 id="colophon-title">
              {quoteLead}
              {quoteTail && <><br />{quoteTail}</>}
            </h2>
          </div>
          <div className="colophon__note">
            <p>{config.colophon.note}</p>
            <Seal character={config.brand.sealCharacter} label={`${config.brand.name} colophon seal`} />
            <a className="colophon__return" href="#cover" onClick={navigateToHash} aria-label={config.copy.returnToTop}>
              <span>{config.colophon.restartLabel}</span>
              <i aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <footer className="colophon__footer">
        <span>{config.brand.name} · {config.brand.subtitle}</span>
        <span>{config.copy.footerCredit}</span>
      </footer>
    </section>
  )
}
