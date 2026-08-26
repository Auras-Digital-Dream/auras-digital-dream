import { useState } from 'react'
import type { MediaAsset } from '../types'

interface SafeImageProps {
  media: MediaAsset
  className?: string
  fallbackLabel: string
  loading?: 'eager' | 'lazy'
}

export function SafeImage({ media, className = '', fallbackLabel, loading = 'lazy' }: SafeImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`safe-image__fallback ${className}`} role="img" aria-label={`${media.alt} · ${fallbackLabel}`}>
        <span aria-hidden="true">A</span>
        <small>{fallbackLabel}</small>
      </div>
    )
  }

  return (
    <img
      className={className}
      src={media.src}
      alt={media.alt}
      style={{ objectPosition: media.position }}
      loading={loading}
      onError={() => setFailed(true)}
    />
  )
}
