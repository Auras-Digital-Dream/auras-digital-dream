import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const ORIGIN = "https://aurastudios.ro";
export const SITE = "Aura's Digital Dream";
export const DEFAULT_IMAGE = "/og-cover.jpg";

/* Two different images per route, because they answer different questions.
 *
 * `image` is the work itself, and it is what schema.org gets: an answer
 * engine asking "what does this project look like" should be handed the
 * photograph, at whatever shape it really is.
 *
 * `ogImage` is the card a link preview draws, and that has to be exactly
 * 1200x630 or the crawler either crops through the middle of the work or
 * drops the card. Twelve of the sixteen photographs are smaller than that
 * and several are portrait, so scripts/make-og-cards.py builds one card per
 * project - the same photograph, whole, on a blurred copy of itself - and
 * they live in /og. Nothing on the site renders them. */
export const OG_SIZE = { width: 1200, height: 630 };

/* The projects live in one array in HomePage.jsx, so they are read from
 * there rather than kept in a second list that would drift. The sitemap and
 * the prerender walk the same routes and share the same titles.
 */
function parse(file) {
  const source = readFileSync(path.join(root, "src", file), "utf8");
  const block = source.match(/const projects = \[([\s\S]*?)\n\];/);
  if (!block) throw new Error(`Could not find the projects array in ${file}`);

  const found = [];
  const entry = /\{\s*slug:\s*"([a-z0-9-]+)",\s*title:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?image:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?description:\s*"((?:[^"\\]|\\.)*)"/g;
  let match;
  while ((match = entry.exec(block[1])) !== null) {
    found.push({ slug: match[1], title: match[2], image: match[3], description: match[4] });
  }
  if (!found.length) throw new Error(`No projects parsed from ${file}`);
  return found;
}

/* The same sixteen projects are declared twice - once in HomePage.jsx for
 * the cards on the home page, once in App.jsx for the detail pages - and
 * only the HomePage copy feeds the titles, descriptions, sitemap, llms.txt
 * and schema. So when the two drift, the page says one thing and every
 * machine reading the site is told another, silently.
 *
 * They had drifted: seventy-one legacy cedilla characters, one curly
 * apostrophe, and a misspelling - the description Google and the answer
 * engines were given for the bakery project said "bratarie" where the page
 * itself said "brutarie". Nothing failed. It just shipped.
 *
 * This makes the next drift impossible to ship. A guard rather than a
 * merge, because merging the two lists changes how the app is assembled,
 * and this catches the same class of bug for the price of one comparison.
 */
function projects() {
  const home = parse("HomePage.jsx");
  const detail = parse("App.jsx");
  const line = (p) => [p.slug, p.title, p.image, p.description].join(" |#| ");
  const a = home.map(line).sort();
  const b = detail.map(line).sort();
  const drift = a.filter((x, i) => x !== b[i]);
  if (a.length !== b.length || drift.length) {
    const shown = drift.slice(0, 3).map((x) => "  HomePage.jsx: " + x.slice(0, 110)).join(String.fromCharCode(10));
    throw new Error(
      "The projects array in HomePage.jsx and the one in App.jsx have drifted. " +
      a.length + " vs " + b.length + " projects, " + drift.length + " differing." +
      String.fromCharCode(10) + shown,
    );
  }
  return home;
}

export function routes() {
  const home = {
    url: "/",
    priority: "1.0",
    title: `${SITE} — Marketing, Design & Web`,
    description: "Marketing, branding, design și experiențe web create cu strategie și suflet.",
    image: DEFAULT_IMAGE,
    ogImage: DEFAULT_IMAGE,
    ogImageAlt: "Sculptură de marmură cu vine de aur, ținută în palmă.",
  };
  const books = {
    url: "/cartile-mele",
    priority: "0.8",
    title: `Cărțile mele — Aura Dobre`,
    description: "Dark romance, thrillere psihologice și povești care se citesc ca un film.",
    image: DEFAULT_IMAGE,
    ogImage: DEFAULT_IMAGE,
    ogImageAlt: "Sculptură de marmură cu vine de aur, ținută în palmă.",
  };
  return [
    home,
    books,
    ...projects().map((p) => ({
      url: `/portofoliu/${p.slug}`,
      priority: "0.6",
      title: `${p.title.split(" — ")[0]} — ${SITE}`,
      description: p.description,
      image: p.image,
      ogImage: `/og/${p.slug}.jpg`,
      ogImageAlt: `${p.title.split(" — ")[0]} — proiect din portofoliul Aura's Digital Dream.`,
    })),
  ];
}
