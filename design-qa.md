# Design QA — editorial archive homepage

- Date: 2026-08-26
- Source visual truth: user-provided desktop screenshots in the current conversation and the supplied `Kimi_Agent_Renaissance Futuristic Web.zip`
- Implementation evidence: browser-rendered captures from the current QA session
- Desktop viewport: 1663 × 889 requested; browser CSS viewport 1848 × 988 at extension scaling
- Mobile viewport: 390 × 844 requested; browser CSS viewport 434 × 938 at extension scaling
- State: homepage `/`, top of page and Manifest section after scroll
- Density normalization: source and implementation were judged at their visible CSS composition; extension scaling was recorded rather than treated as a design mismatch

## Full-view comparison evidence

- The legacy `.hero { height: 260vh }` collision produced the oversized blank field and displaced artwork. The archive hero is now isolated at exactly `100svh`.
- Desktop artwork now fills the useful hero width while preserving the editorial fade at the left edge.
- The fixed rail remains within its own 108px column and no longer overlaps its six navigation labels.
- Manifest labels and their secondary scripts now occupy separate horizontal lanes.
- Mobile hero height is isolated from the legacy studio hero and has no horizontal overflow.

## Focused-region evidence

- Hero: edition label, Studio CTA, title card, statement and artwork bounds inspected independently.
- Archive rail: all six navigation labels inspected at 1663 × 889.
- Manifest tabs: bounding boxes compared programmatically; no label/script intersections remain.
- Motion: Hero elements transition to revealed state; Manifest image, mask and stagger elements change from opacity 0 before scroll to opacity 1 after scroll.

## Findings and comparison history

- P1 — Hero inherited the studio homepage's 260vh height.
  - Fix: route-qualified 100svh height, min-height and max-height rules.
  - Post-fix evidence: desktop hero measures one viewport high; artwork is contained in the same frame.
- P1 — Audit safeguard disabled original reveal transitions.
  - Fix: removed permanent final-state overrides and restored route-scoped initial/revealed states.
  - Post-fix evidence: below-fold reveal nodes are hidden before intersection and visible after scrolling.
- P2 — Manifest title and script labels overlapped.
  - Fix: separated label/script x positions and tightened rail navigation rhythm.
  - Post-fix evidence: all four measured pairs report no intersection.
- P2 — Hero artwork left excessive unused lateral space.
  - Fix: increased desktop art width to 84%, softened the mask and moved the title card toward the visual axis.
  - Post-fix evidence: image begins substantially earlier while the statement remains readable on a translucent paper panel.

## Required fidelity surfaces

- Typography: original display/UI families retained; vertical editorial typesetting preserved; overlapping secondary labels corrected.
- Spacing/layout: hero, rail and Manifest geometry corrected at desktop and mobile breakpoints.
- Colors/tokens: paper, burgundy, royal blue and dark ink palette retained.
- Image quality: original ZIP imagery retained without replacement or additional compression.
- Copy/content: original Romanian archive copy retained.

## Interaction and technical checks

- Section navigation and scroll-progress behavior retained.
- Hero reveal, image drift, stagger, mask, rise and section motion states restored.
- Browser console: no errors.
- Production build: 19 routes prerender successfully.

## Iteration — Atlas holograms and complete brand lockup

- Source visual truth: the two user-provided screenshots in the current conversation and `AURA DIGITAL DREAM LOGO SVG.svg`.
- Implementation evidence: browser captures of Hero and Atlas plus measured layouts at laptop, compact-tablet and mobile widths.
- P1 — Hero showed only “Aura” and the subtitle intersected the display word.
  - Fix: complete `Aura's Digital Dream` lockup with separate display and UI-text axes.
  - Post-fix evidence: display word, `Digital Dream`, kicker, rule and seal occupy sequential non-overlapping positions on laptop and mobile.
- P1 — Brand logo was missing.
  - Fix: supplied SVG copied into `public/editorial-media/` and used in Hero, desktop rail and mobile header with transparent rendering.
  - Post-fix evidence: SVG reports intrinsic 500 × 500 dimensions, transparent CSS background and renders without a rectangular backdrop.
- P2 — Atlas text blocks appeared as opaque paper notes.
  - Fix: transparent teal/royal holographic glass panels with burgundy emitter line, luminous edge, controlled blur and dark text.
  - Post-fix evidence: laptop capture shows the Renaissance hall visible through the Web panel while its title and paragraph remain legible.
- P2 — Atlas notes needed resilient responsive placement.
  - Fix: preserved spatial markers on laptop, three-column device layout on tablet and one-column stacked layout on mobile.
  - Post-fix evidence: no pairwise card intersections and no horizontal overflow at tested breakpoints; descriptions remain visible on mobile.
- Browser console after this iteration: no errors.

## Follow-up polish

- P3: the rail may be made slightly wider if a more generous editorial rhythm is preferred on very short laptop screens.

## Iteration — long text, pricing ledger and mobile gutters

- Source visual truth: the six user-provided issue screenshots in the current conversation.
- Implementation evidence: browser captures and element-bound measurements at laptop and phone widths.
- P1 — long notes in “Sistem” overflowed while using vertical writing.
  - Fix: notes now use horizontal glass-paper cards with responsive one/two-column layouts.
  - Post-fix evidence: both mobile notes report zero horizontal and vertical content overflow and `horizontal-tb` writing mode.
- P1 — six price entries were forced into four narrow columns.
  - Fix: six minimum-width ledger cells, full-width desktop strip and horizontal mobile navigation.
  - Post-fix evidence: all six cells report zero internal overflow on laptop and phone; the mobile strip scrolls only on the horizontal axis.
- P2 — media frames touched mobile viewport edges.
  - Fix: explicit gutters and subtle borders for Manifest, Atlas, Sistem and service imagery.
  - Post-fix evidence: the tested Sistem image retains approximately 24–44 CSS px side spacing and the document has no horizontal overflow.
- P2 — Colophon headline was cropped at narrow widths.
  - Fix: bounded responsive type scale, reduced tracking and explicit section gutters.
  - Post-fix evidence: the full title has matching `scrollWidth` and `clientWidth`, with approximately 35 CSS px side spacing.
- Copy correction: “Nu livrez doar servicii. Creez transformări.”

## Iteration — Studio shared navigation and refined moving frieze

- Source visual truth: user-provided Studio screenshot in the current conversation, showing the oversized angled 3D marquee and legacy header.
- Implementation evidence: `http://127.0.0.1:5174/studio`, browser-rendered desktop and mobile captures from the current QA session.
- Viewports: 1440 × 900 desktop and 390 × 844 mobile; device density handled by the browser surface.
- State: Studio hero, open mobile navigation, and the transition from `#despre-mine` into the moving frieze.

### Full-view comparison evidence

- The former full-width masthead and logo lockup are replaced by the same compact glass route switcher used on Acasă.
- The marquee no longer dominates an entire viewport or crops large extruded letters; it is a 192px editorial frieze on desktop and 148px on mobile.
- No horizontal document overflow occurs at either tested viewport.

### Focused-region evidence

- Navigation: four routes remain visible on desktop; Studio is the active route; the mobile menu opens, exposes the same four destinations and remains inside the viewport.
- Frieze: Cormorant/EB Garamond serif stack, 500 weight, 60px desktop and approximately 39px mobile, burgundy ink, restrained tracking and no 3D extrusion.
- Motion: scroll-linked horizontal travel remains active at a reduced speed; `prefers-reduced-motion` continues to disable it.

### Findings and comparison history

- P1 — Legacy Studio masthead did not match the new homepage navigation.
  - Fix: reused the shared GlobalNavigation component and removed the duplicate Studio logo/header/menu sheet.
  - Post-fix evidence: desktop and mobile captures show the same glass capsule and route order as Acasă.
- P1 — Moving text was oversized, heavy, steeply angled and visually crude.
  - Fix: removed rotation and multi-step 3D shadow, reduced size and speed, introduced a low marble-glass frieze with restrained burgundy serif type and fine gold rules.
  - Post-fix evidence: the full line sits vertically centered, remains legible and does not collide with adjacent sections.
- P2 — A slight rail rotation enlarged the transformed bounds and pushed type toward the lower crop.
  - Fix: removed the remaining 1.25-degree rotation while preserving horizontal motion.
  - Post-fix evidence: desktop item bounds sit entirely inside the 192px band.

### Required fidelity surfaces

- Typography: lighter Renaissance serif, smaller optical size and wider but controlled tracking.
- Spacing/layout: compact band height, centered line box and responsive mobile proportions.
- Colors/tokens: porcelain/mist ground, burgundy text, petrol microcopy and antique-gold hairlines.
- Image quality: no image assets were replaced or degraded in this iteration.
- Copy/content: the original three concepts were retained and “Experiențe digitale” was added to match the Studio's four-pillar language.

- Primary interactions tested: desktop navigation visibility, mobile menu open state, route labels, active route and scroll-linked frieze movement.
- Browser console: no errors or warnings.
- Build and SEO audit: passed for all 19 current routes.

## Iteration — Studio „Despre mine” compact glass composition

- Source visual truth: user-provided Studio screenshots and the spacing correction described in the current conversation.
- Implementation evidence: browser-rendered captures of `/studio#despre-mine` from the current QA session.
- Viewport: 1142 × 784 CSS px at browser density.
- State: upper portrait composition and lower portrait-to-biography transition after scroll.

### Full-view comparison evidence

- The portrait grows from the former 76vw/890px frame to an 88vw/1080px frame and now occupies the section as the dominant visual.
- Section height is reduced from 1180px minimum to 1010px at the tested viewport, removing the large inactive band below the image.
- The biography is no longer pinned to a distant bottom edge; it overlaps the portrait base by 22 CSS px and reads as part of the same composition.

### Focused-region evidence

- Portrait crop: face, sunglasses, Renaissance setting and lower jacket remain visible; the image is loaded at natural resolution and no replacement asset is used.
- Biography card: 520px glass panel, dark charcoal copy on a translucent porcelain/mist surface, with readable line length and no clipping.
- Background: petrol, mineral green and antique neutral layers remain within the Studio palette; the inset glass field has a fine light border and controlled blur.

### Findings and comparison history

- P1 — biography and portrait were visually disconnected by a wide empty strip.
  - Fix: shortened the section and moved the copy panel to overlap the portrait base.
  - Post-fix evidence: measured 22px overlap instead of the former approximately 250px gap.
- P2 — portrait lacked the visual scale requested for the section.
  - Fix: increased maximum width to 1080px and expanded the mask/frame bounds.
  - Post-fix evidence: the portrait fills nearly the full useful width while the document reports zero horizontal overflow.
- P2 — flat pale background weakened depth and separation.
  - Fix: added a darker mineral gradient and a translucent inset glass layer with blur, restrained highlight and shadow.
  - Post-fix evidence: the bright portrait and biography card retain clear contrast against the deeper ground.

### Required fidelity surfaces

- Typography: existing Renaissance display and editorial serif families retained; biography line length is capped at 40 characters.
- Spacing/layout: portrait, copy and frame now form one compact vertical composition; the mobile breakpoint uses a full-width inset card at 18px gutters.
- Colors/tokens: Studio petrol, porcelain, mist, antique and charcoal tokens retained with stronger foreground/background separation.
- Image quality: original `eu-in-renascentism.jpeg` retained, uncropped at source and rendered without blend-mode darkening.
- Copy/content: biography and founder attribution are unchanged.

- Primary checks: image load, portrait/copy overlap, sticky navigation visibility, document overflow and route links.
- Browser console: no runtime errors; only Vite and development analytics messages.
- Production build and SEO audit: passed for all 19 routes.

## Iteration — simplified glass background

- Source visual truth: the user's review of the previous browser-rendered About composition.
- Implementation evidence: browser-rendered `/studio#despre-mine` capture in the current QA session at 1142 × 784 CSS px.
- P2 — layered radial colors competed with the portrait and glass panel.
  - Fix: replaced the multi-color field with one desaturated mineral tone (`#718381`) and removed the decorative atmosphere circles.
  - Post-fix evidence: the background reads as one continuous plane; depth is carried by the inset glass and biography card, with zero document overflow.
- Typography, copy, portrait crop and layout geometry remain unchanged.
- Browser check: image loaded, glass/text contrast retained, no horizontal overflow.
- Production build and SEO audit: passed for all 19 routes.

## Iteration — Scene 01 video replacement and directional reveal

- Source visual truth: `C:\Users\aural\Downloads\grok-video-bd9e186a-d815-4594-beeb-f1285f5a6d72.mp4` and the user's requested left-edge-to-opposite-direction scroll motion.
- Implementation evidence: browser-rendered `/studio#proces` captures from the current QA session at 1142 × 784 CSS px.
- State: Scene 01 active and subsequent scene active after a physical scroll gesture.

### Full-view and focused-region evidence

- Scene 01 renders the supplied 736 × 400 video full-bleed; the former geometric square/gold-line footage and its mismatched poster are no longer referenced by this scene.
- Runtime media state: loaded (`readyState: 4`), playing, looping, inline and muted; measured duration 6.041667 seconds.
- Inactive scene media begins 6vw to the left with `clip-path: inset(0 100% 0 0)`; active media resolves to zero translation and a full clip, producing a left-to-right reveal.
- Typography, scrim, scene copy and index remain unchanged and legible over the new footage.

### Findings and comparison history

- P1 — Scene 01 still displayed the unwanted gold-lined geometric footage.
  - Fix: replaced only its media source with `public/video/story-aparitia-grok.mp4` and removed the former poster from that scene.
  - Post-fix evidence: browser `currentSrc` points to the new asset and the supplied knight/Renaissance footage is visible.
- P2 — scene changes used only opacity and scale, without the requested directional travel.
  - Fix: added a restrained negative-x start position and left-to-right clip reveal for all four scene visuals.
  - Post-fix evidence: inactive transform measures approximately -68.5px at the tested viewport; active transform is zero with a fully open clip.

### Required fidelity surfaces

- Typography and copy: unchanged.
- Spacing/layout: full-viewport scene framing retained; zero horizontal document overflow.
- Colors/tokens: existing dark cinematic scrim and white text retained.
- Image quality: supplied MP4 used directly at its native 736 × 400 frame without recompression.
- Motion/accessibility: muted autoplay with `playsInline`; reduced-motion mode removes translation and clipping.

- Primary interaction tested: physical scroll gesture changed the active scene and retained the directional media state.
- Browser console: no runtime errors.
- Production build and SEO audit: passed for all 19 routes.

## Iteration — Scene 01 replacement, Full HD delivery

- Source: `grok-video-3f730100-f1b8-4409-945a-8d6e01a0ca3c.mp4` (736 × 400, 24 fps, 6.041667 s).
- Implementation: `public/video/story-aparitia-renaissance-1080p.mp4` (1920 × 1080, 24 fps, H.264, no audio track).
- Processing: Lanczos upscale, minimal center crop to 16:9, restrained sharpening, fast-start MP4 optimization.
- Browser evidence: Scene 01 loads at 1920 × 1080, plays automatically and loops while muted; supplied woman-with-gilded-book footage fills the scene without horizontal overflow.
- The former Scene 01 MP4 and intermediate exports were removed after the new source was linked and browser-verified.
- Production build and SEO audit: passed for all 19 routes.

## Iteration — removed post-scenes film section

- Removed the full-viewport `film` section that followed the four Studio scenes.
- Removed its unused component-specific CSS and grouped vignette/theme selectors.
- Browser evidence: `.film` is absent; `.chapters` is followed directly by `.work-intro`, headed „Creez proiecte care nu doar arată bine. Spun ceva.”
- Scene 01 still loads the verified 1920 × 1080 replacement video; no horizontal overflow or browser console errors.
- Production build and SEO audit: passed for all 19 routes.

## Iteration — direct transition into the project collection

- Removed the former „Selecție curatorială / Creez proiecte…” intro section.
- Renamed „Arhiva vie” to „Colecția de proiecte”.
- The four Scene chapters now transition directly into `.project-index`.
- Reworked the collection background as a layered mineral surface: deep verdigris base, restrained bronze light, diffuse cool reflection and paper grain.
- Browser evidence at 1142 × 784 CSS px: title, supporting copy, project names, tags and CTAs remain readable; project imagery retains separation; zero horizontal overflow and no console errors.
- Production build and SEO audit: passed for all 19 routes.

final result: passed

## Iteration — responsive editorial Hero lockup

- Source visual truth: current-turn user screenshot of the clipped Hero at a narrow viewport (460 × 784 px).
- Implementation screenshot: `qa/hero-responsive-desktop.jpg`.
- Browser viewport: 1142 × 784 CSS px; captured content: 1125 × 772 px at browser density.
- State: `/`, initial Hero after reveal animation.

### Full-view comparison evidence

- The source screenshot loses the lower/right portion of the vertical brand lockup. In the revised render, `MARKETING · DESIGN · WEB`, `Aura's`, `DIGITAL DREAM`, the rule and the seal are all visible inside one bounded glass panel.
- The panel now uses the available top and bottom viewport space instead of expanding from stacked vertical text. The portrait remains full-bleed without creating document overflow.

### Focused-region evidence and comparison history

- P1 — complete brand lockup was clipped by the one-screen Hero.
  - Fix: changed the lockup to two coordinated vertical columns, bounded it with explicit top/bottom insets and moved the decorative rule and seal into fixed safe positions.
  - Post-fix evidence: every direct child of `.hero__title-card` measures inside both the card and Hero bounds; the card measures 176 × 634 px and ends 36 px above the Hero edge at the tested desktop viewport.
- P2 — the portrait crop was overly aggressive at tablet/mobile rules.
  - Fix: reduced the negative horizontal offset, narrowed the oversize image canvas and added dedicated 1100px, 900px, 520px and low-height safeguards.
  - Post-fix evidence: desktop image fills the visual field with the subject's face, eyewear, jacket and garden visible; document horizontal overflow is zero.

### Required fidelity surfaces

- Typography: existing Renaissance display serif and futuristic UI microtype retained; vertical labels use reduced tracking so words remain complete.
- Spacing/layout: all lockup children, statement and scroll cue stay inside the Hero; mobile header/dock space is reserved explicitly.
- Colors/tokens: porcelain glass, burgundy accent, antique rules and existing contrast are unchanged.
- Image quality: original 2048 × 1082 Hero artwork remains loaded at natural resolution with a safer responsive focal position.
- Copy/content: complete brand name and all Hero copy are unchanged.

- Primary interactions tested: reveal animation, sticky navigation visibility and scroll cue visibility.
- Browser checks: Hero image loaded; no Vite error overlay; zero horizontal overflow.
- Production build and SEO audit: passed for all 19 routes.

final result: passed
