#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ORIGIN, OG_SIZE, SITE, routes } from "./routes.mjs";
import { jsonLd } from "./schema.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const client = path.join(root, "dist", "client");
const template = readFileSync(path.join(client, "index.html"), "utf8");
// Windows needs a file:// URL here, not a bare absolute path.
const { render } = await import(pathToFileURL(path.join(root, "dist", "ssr", "entry-server.js")).href);

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* The reveal keeps things at opacity 0 until its observer fires, and motion
 * writes the same inline. Neither runs without scripts, so a reader without
 * them would get a page full of invisible text — the markup is there but
 * nothing shows. This only applies when scripts are off. */
const NOSCRIPT = `<noscript><style>
  .reveal-on-scroll:not(:has(> .reveal-child)),.reveal-on-scroll > .reveal-child,
  [style*="opacity:0"]{opacity:1!important;transform:none!important}
  /* Lines() parks each word below its own mask with a transform, not an
     opacity, so the headings need naming separately. */
  .lines-word{overflow:visible!important}
  .lines-word > span{transform:none!important;translate:none!important}
</style></noscript>`;

function head(route) {
  const url = ORIGIN + route.url;
  const abs = (u) => (u.startsWith("http") ? u : ORIGIN + u);
  return {
    url,
    image: abs(route.ogImage || route.image),
    imageAlt: escape(route.ogImageAlt || route.title),
    title: escape(route.title),
    description: escape(route.description),
  };
}

function pageFor(route, markup) {
  const m = head(route);
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${m.title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${m.description}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${m.url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${m.url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${m.title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${m.description}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${m.image}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${m.title}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${m.description}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${m.image}$2`)
    /* The template declared 1200x630 for every page while twelve of the
     * project photographs were smaller than that and several were portrait.
     * A crawler that measures the file and finds it does not match the
     * declaration usually drops the card. Now the file really is that size,
     * and the alt text describes the page rather than the home page. */
    .replace(/(<meta property="og:image:width" content=")[^"]*(")/, `$1${OG_SIZE.width}$2`)
    .replace(/(<meta property="og:image:height" content=")[^"]*(")/, `$1${OG_SIZE.height}$2`)
    .replace(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${m.imageAlt}$2`)
    .replace(/(<meta name="twitter:image:alt" content=")[^"]*(")/, `$1${m.imageAlt}$2`)
    .replace(/(<meta property="og:type" content=")[^"]*(")/, `$1${route.url === "/" ? "website" : "article"}$2`)
    /* The home page renders its own ProfessionalService and FAQPage from
     * inside the component, because both are built from the arrays the
     * visible sections use. This adds what no component carries: the site
     * node, the author, the breadcrumb trail and, on a case study, the
     * work itself. It goes in <head>, so no rendered markup moves. */
    .replace("</head>", `  <script type="application/ld+json">${jsonLd(route).replace(/</g, "\\u003c")}</script>\n  </head>`)
    .replace("</head>", `  ${NOSCRIPT}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
}

/* When a page last actually changed.
 *
 * git cannot answer this where the build runs: the CLI uploads the working
 * tree without .git, and a CI clone is shallow, so every file reports the
 * same commit — which is how the sitemap ended up claiming all eighteen
 * pages changed on the same day, every deploy. Google ignores lastmod once
 * it reads like that.
 *
 * So the page dates itself. Its markup is hashed; if the hash differs from
 * the one recorded last time, the content really did change and the date
 * moves to today. Otherwise it keeps the date it already had. The record is
 * committed, so it survives a build that has no history to consult.
 */
const stampsFile = path.join(root, "scripts", "content-dates.json");
const stamps = existsSync(stampsFile) ? JSON.parse(readFileSync(stampsFile, "utf8")) : {};
const today = new Date().toISOString().slice(0, 10);
const moved = [];

const all = routes();
let written = 0;
let smallest = { chars: Infinity };

for (const route of all) {
  const markup = render(route.url);
  const chars = markup.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;
  if (chars < 400) throw new Error(`${route.url} rendered only ${chars} characters of text`);
  if (chars < smallest.chars) smallest = { url: route.url, chars };

  const hash = createHash("sha1").update(markup).digest("hex").slice(0, 16);
  const seen = stamps[route.url];
  if (!seen || seen.hash !== hash) {
    stamps[route.url] = { hash, date: today };
    if (seen) moved.push(route.url);
  }
  route.lastmod = stamps[route.url].date;

  const dir = route.url === "/" ? client : path.join(client, route.url);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), pageFor(route, markup));
  written += 1;
}

writeFileSync(
  path.join(client, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
    all.map((r) => `  <url>\n    <loc>${ORIGIN}${r.url}</loc>\n    <lastmod>${r.lastmod}</lastmod>\n    <priority>${r.priority}</priority>\n  </url>`).join("\n")
  }\n</urlset>\n`,
);

/* A real 404.
 *
 * Every unmatched path used to be rewritten to index.html and answered 200
 * with the home page inside it - a soft 404. Google reports those, and an
 * answer engine that follows a wrong link is told the page exists. Vercel
 * serves this file with a 404 status once the catch-all rewrite is gone,
 * and every real route is already a file on disk, so nothing needed it.
 *
 * It deliberately does not load the app: App() renders the home page for an
 * unknown path, so hydration would replace this markup with the home page a
 * moment after it appeared. Stylesheet only, no script, nothing to hydrate.
 */
const css = (template.match(/<link rel="stylesheet"[^>]*href="([^"]+)"/) || [])[1];
if (!css) throw new Error("Could not find the built stylesheet in index.html");

writeFileSync(path.join(client, "404.html"), `<!doctype html>
<html lang="ro">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pagina nu a fost găsită &#8212; ${SITE}</title>
    <meta name="robots" content="noindex, follow" />
    <meta name="description" content="Adresa cerută nu există pe acest site." />
    <link rel="stylesheet" href="${css}" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <meta name="theme-color" content="#2D353C" />
    <style>
      /* Scoped to this page. It reuses the site tokens, type and button,
         and adds no rule any other page can see. */
      .nf{min-height:100svh;display:grid;place-items:center;padding:48px 24px;
        background:var(--ink);color:#fff;text-align:center}
      .nf-inner{display:grid;gap:22px;justify-items:center;max-width:52ch}
      .nf h1{margin:0;font-family:var(--font-display);font-weight:400;
        font-size:clamp(40px,7vw,84px);line-height:1.06;letter-spacing:1px}
      .nf p{margin:0;font-size:16px;line-height:1.6;color:rgba(255,255,255,.74)}
      .nf-links{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
      .nf-code{font-family:var(--font-sans);font-size:11.5px;letter-spacing:.24em;
        text-transform:uppercase;color:var(--gold)}
    </style>
  </head>
  <body>
    <main class="nf">
      <div class="nf-inner">
        <p class="nf-code">Eroare 404</p>
        <h1>Pagina asta nu există.</h1>
        <p>Poate a fost mutată, poate adresa are o literă în plus. Restul site-ului te așteaptă.</p>
        <div class="nf-links">
          <a class="button primary" href="/">Înapoi acasă</a>
          <a class="button ghost" href="/#portofoliu">Vezi portofoliul</a>
          <a class="button ghost" href="/cartile-mele">Cărțile mele</a>
        </div>
      </div>
    </main>
  </body>
</html>
`);

/* llms.txt - the convention answer engines are converging on for "here is
 * what this site is, in the order that matters". One small text file, and
 * a model no longer has to infer the structure out of markup. Generated
 * from the same route list as the sitemap, so it cannot drift. */
const detail = all.filter((r) => r.url.startsWith("/portofoliu/"));
writeFileSync(path.join(client, "llms.txt"), `# ${SITE}

> Studio de marketing, branding, design și web al Aurei Dobre, din România.
> Serviciile, prețurile orientative și portofoliul sunt publicate integral pe
> site, în română. Aceeași persoană publică și ficțiune, sub numele Aura Dobre.

Toate paginile sunt redate pe server: HTML-ul livrat conține textul complet,
fără JavaScript. Datele structurate (schema.org) sunt în head-ul fiecărei
pagini, iar întrebările frecvente sunt marcate ca FAQPage pe pagina de start.

## Principal

- [Acasă](${ORIGIN}/): servicii, pachete cu prețuri orientative în RON,
  estimator de cost, portofoliu, întrebări frecvente și contact.
- [Cărțile mele](${ORIGIN}/cartile-mele): ficțiune publicată de Aura Dobre,
  dark romance și thriller psihologic.

## Portofoliu (${detail.length} studii de caz)

${detail.map((r) => `- [${r.title.split(" — ")[0]}](${ORIGIN}${r.url}): ${r.description}`).join("\n")}

## Contact

- Email: auraleobeatrice@gmail.com
- Telefon / WhatsApp: +40 762 509 423
- Instagram: https://www.instagram.com/aurasdigitaldream

## Altele

- [Sitemap](${ORIGIN}/sitemap.xml)
- [robots.txt](${ORIGIN}/robots.txt)
`);

writeFileSync(stampsFile, JSON.stringify(stamps, null, 2) + "\n");
if (moved.length) console.log(`Content changed on ${moved.length} route(s): ${moved.slice(0, 4).join(", ")}${moved.length > 4 ? "…" : ""}`);

console.log(`Prerendered ${written} routes + sitemap.xml + 404.html + llms.txt (leanest: ${smallest.url}, ${smallest.chars} chars)`);
