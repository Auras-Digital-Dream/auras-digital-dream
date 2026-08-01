# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

Durable visual direction: use cinematic scroll storytelling, restrained parallax, staggered reveals, and a visible journey from strategy to creation. Always honor `prefers-reduced-motion` and avoid animation dependencies when browser-native APIs are sufficient.

Storytelling must be genuinely scroll-driven, not limited to entrance reveals: use pinned scenes, changing imagery, depth, and 3D transformations tied continuously to scroll progress. On fine-pointer devices, the custom cursor's central point must stay exactly under the system pointer; only its decorative outer ring may trail.

The hero flower should feel alive through continuous cinematic motion and refraction, not behave like a static background. Prefer refined organic 3D sculpture forms (light, petals, glass, orbital curves) over hard geometric objects such as cubes.

Story-scene portfolio imagery should read as elegant cutouts or floating compositions, with high-resolution source assets and organically feathered transparency. Avoid visible rectangular cards, borders, hard frames, or obvious carousel containers.

Portfolio detail heroes must show the selected artwork in full. Use the strongest available landscape source where possible; for square or portrait artwork, preserve the complete image with `object-fit: contain` over a subtle blurred backdrop rather than cropping it.

Treat the portfolio as an editorial journey: lead with a curated selection of flagship projects, then offer the complete filterable archive. Keep the primary navigation concise and use cinematic in-app transitions between the portfolio index and case studies.

Project detail pages should surface practical context (role, client, period, deliverables) and end with a project-specific WhatsApp CTA. Preserve a personal "Behind the Dream" section so the portfolio communicates the creator behind the work, not only the deliverables.

Use supplied editorial composites as distinct storytelling chapters rather than repeating them as ordinary cards. Keep embedded text artwork legible, but recreate navigation, service labels, and conversion copy as responsive HTML.

Keep the supplied creative showreel inside the arched portrait frame of the "Behind the Dream" section, replacing the static portrait rather than creating a separate video chapter.

The estimator must state prominently that prices are suggestive and vary with complexity, volume, urgency, and revisions. Academic services must be framed only as lawful editorial support, formatting, bibliography, and presentation assistance; never advertise ready-to-submit academic work.

Public web pricing should suit small and medium clients in Ialomița: accessible but not bargain-basement, with clear deliverables and recurring costs separated from the initial build estimate.
