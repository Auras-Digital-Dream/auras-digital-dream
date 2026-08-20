import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const ORIGIN = "https://aurastudios.ro";
export const SITE = "Aura's Digital Dream";
export const DEFAULT_IMAGE = "/og-cover.jpg";

/* The projects live in one array in HomePage.jsx, so they are read from
 * there rather than kept in a second list that would drift. The sitemap and
 * the prerender walk the same routes and share the same titles.
 */
function projects() {
  const source = readFileSync(path.join(root, "src", "HomePage.jsx"), "utf8");
  const block = source.match(/const projects = \[([\s\S]*?)\n\];/);
  if (!block) throw new Error("Could not find the projects array in HomePage.jsx");

  const found = [];
  const entry = /\{\s*slug:\s*"([a-z0-9-]+)",\s*title:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?image:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?description:\s*"((?:[^"\\]|\\.)*)"/g;
  let match;
  while ((match = entry.exec(block[1])) !== null) {
    found.push({ slug: match[1], title: match[2], image: match[3], description: match[4] });
  }
  if (!found.length) throw new Error("No projects parsed from HomePage.jsx");
  return found;
}

/* The date a page last actually changed, taken from the commit that last
 * touched the file its content comes from. A sitemap where every entry
 * carries the build date tells a crawler nothing — Google says as much, and
 * ignores lastmod once it looks fabricated.
 */
function lastChanged(file) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", "--", file], {
      cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out;
  } catch {
    /* no git history here — fall through */
  }
  return new Date().toISOString().slice(0, 10);
}

export function routes() {
  const homeDate = lastChanged("src/HomePage.jsx");
  const booksDate = lastChanged("src/App.jsx");
  const projectDate = lastChanged("src/projectDetails.js");

  const home = {
    url: "/",
    priority: "1.0",
    lastmod: homeDate,
    title: `${SITE} — Marketing, Design & Web`,
    description: "Marketing, branding, design și experiențe web create cu strategie și suflet.",
    image: DEFAULT_IMAGE,
  };
  const books = {
    url: "/cartile-mele",
    priority: "0.8",
    lastmod: booksDate,
    title: `Cărțile mele — Aura Dobre`,
    description: "Dark romance, thrillere psihologice și povești care se citesc ca un film.",
    image: DEFAULT_IMAGE,
  };
  return [
    home,
    books,
    ...projects().map((p) => ({
      url: `/portofoliu/${p.slug}`,
      priority: "0.6",
      // A project page is written from both files, so it is as new as the
      // later of the two.
      lastmod: projectDate > homeDate ? projectDate : homeDate,
      title: `${p.title.split(" — ")[0]} — ${SITE}`,
      description: p.description,
      image: p.image,
    })),
  ];
}
