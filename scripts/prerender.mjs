#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ORIGIN, routes } from "./routes.mjs";

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
  const image = route.image.startsWith("http") ? route.image : ORIGIN + route.image;
  return { url, image, title: escape(route.title), description: escape(route.description) };
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
    .replace(/(<meta property="og:type" content=")[^"]*(")/, `$1${route.url === "/" ? "website" : "article"}$2`)
    .replace("</head>", `  ${NOSCRIPT}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
}

const all = routes();
let written = 0;
let smallest = { chars: Infinity };

for (const route of all) {
  const markup = render(route.url);
  const chars = markup.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;
  if (chars < 400) throw new Error(`${route.url} rendered only ${chars} characters of text`);
  if (chars < smallest.chars) smallest = { url: route.url, chars };

  const dir = route.url === "/" ? client : path.join(client, route.url);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), pageFor(route, markup));
  written += 1;
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  path.join(client, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${
    all.map((r) => `  <url>\n    <loc>${ORIGIN}${r.url}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${r.priority}</priority>\n  </url>`).join("\n")
  }\n</urlset>\n`,
);

console.log(`Prerendered ${written} routes + sitemap.xml (leanest: ${smallest.url}, ${smallest.chars} chars)`);
