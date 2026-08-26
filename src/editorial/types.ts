export type SectionId = 'cover' | 'chapters' | 'landscape' | 'specimen' | 'records' | 'colophon'

export interface MediaAsset {
  src: string
  alt: string
  position?: string
}

export interface ThemeConfig {
  paper: string
  paperDeep: string
  ink: string
  mutedInk: string
  rule: string
  accent: string
  mineral: string
}

export interface BrandConfig {
  name: string
  logoSrc: string
  subtitle: string
  edition: string
  sealCharacter: string
}

export interface SectionNavItem {
  id: SectionId
  index: string
  label: string
}

export interface HeroConfig {
  kicker: string
  title: string
  statement: string
  scrollLabel: string
  image: MediaAsset
}

export interface ChapterDetailPage {
  kicker: string
  title: string
  intro: string
  quote: string
  quoteAttribution: string
  paragraphs: string[]
  footnote: string
}

export interface ChapterConfig {
  id: string
  index: string
  label: string
  script: string
  title: string
  summary: string
  coordinates: string
  image: MediaAsset
  detail: ChapterDetailPage
}

export interface LandscapeMarker {
  id: string
  label: string
  text: string
  x: number
  y: number
  align: 'start' | 'end'
}

export interface LandscapeConfig {
  kicker: string
  title: string
  intro: string
  folio: string
  image: MediaAsset
  markers: LandscapeMarker[]
  axisLabels: string[]
}

export interface SpecimenNote {
  id: string
  heading: string
  text: string
}

export interface SpecimenConfig {
  kicker: string
  title: string
  period: string
  material: string
  summary: string
  image: MediaAsset
  notes: SpecimenNote[]
  scaleLabels: [string, string, string]
}

export interface RecordEntry {
  id: string
  index: string
  season: string
  date: string
  title: string
  text: string
  detail: RecordDetailPage
}

export interface RecordFinding {
  label: string
  text: string
}

export interface RecordFact {
  label: string
  value: string
}

export interface RecordDetailPage {
  phenology: string
  noteHeading: string
  note: string
  findings: RecordFinding[]
  facts: RecordFact[]
}

export interface RecordsConfig {
  kicker: string
  title: string
  intro: string
  primaryImage: MediaAsset
  detailImage: MediaAsset
  specimenImage: MediaAsset
  entries: RecordEntry[]
}

export interface ColophonConfig {
  kicker: string
  quote: string
  note: string
  restartLabel: string
}

export interface InterfaceCopy {
  skipToContent: string
  primaryNavLabel: string
  chapterNavLabel: string
  chapterIndexKicker: string
  archiveFolio: string
  footerCredit: string
  openChapter: string
  activeChapter: string
  imageUnavailable: string
  scrollProgress: string
  returnToTop: string
  openChapterDetail: string
  openRecordDetail: string
  closeDetail: string
  chapterDetailBack: string
  recordDetailBack: string
  nextChapter: string
  nextRecord: string
  detailMissing?: string
}

export interface SiteConfig {
  locale: string
  siteTitle: string
  siteDescription: string
  theme: ThemeConfig
  brand: BrandConfig
  navigation: SectionNavItem[]
  hero: HeroConfig
  chapters: ChapterConfig[]
  landscape: LandscapeConfig
  specimen: SpecimenConfig
  records: RecordsConfig
  colophon: ColophonConfig
  copy: InterfaceCopy
  motion: {
    reveals: boolean
    imageDrift: boolean
    paperBreath: boolean
    scrollCue?: boolean
  }
}
