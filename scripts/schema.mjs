/* Structured data for the pages the React tree does not carry any.
 *
 * The home page renders its own ProfessionalService and FAQPage from inside
 * HomePage.jsx, because they are built from the same arrays the visible
 * sections are. Everything else had none at all, which is the gap this
 * fills: seventeen of eighteen pages were arriving at a crawler - and at an
 * answer engine, which has no layout to fall back on - as plain prose with
 * no machine-readable claim about what they are.
 *
 * Written into <head> at prerender rather than into the components, so no
 * rendered markup changes and nothing can shift on screen.
 */
import { ORIGIN, SITE } from "./routes.mjs";
import { projectDetails } from "../src/projectDetails.js";

/* Every discipline named anywhere in the portfolio, deduplicated.
 *
 * The studio node used to declare four service types by hand - Branding,
 * Web design, Marketing digital, Documente profesionale - while the
 * sixteen case studies between them name dozens of distinct deliverables,
 * from foil stamping to courier integrations. An answer engine asked what
 * she does could only repeat the four. This reads the same list the pages
 * render, so the catalogue and the visible text can never disagree. */
const ALL_SERVICES = [...new Set(
  Object.values(projectDetails).flatMap((d) => d.services || []),
)].sort((a, b) => a.localeCompare(b, "ro"));

const STUDIO = `${ORIGIN}/studio#studio`;
const PERSON = `${ORIGIN}/#aura`;
const abs = (u) => (u.startsWith("http") ? u : ORIGIN + u);

/* One author node the whole site points at, so a machine reading two pages
 * knows it is reading about one person rather than two names. */
const person = {
  "@type": "Person",
  "@id": PERSON,
  name: "Aura Dobre",
  url: ORIGIN + "/",
  jobTitle: "Designer, marketer și autor",
  worksFor: { "@id": STUDIO },
  sameAs: [
    "https://www.instagram.com/aurasdigitaldream",
    "https://www.linkedin.com/in/aurelia-dobre-a033b2104",
    "https://www.amazon.co.uk/stores/author/B0DSJP6MX8",
    "https://www.goodreads.com/user/show/203519366-aura-dobre",
  ],
};

const website = {
  "@type": "WebSite",
  "@id": `${ORIGIN}/#website`,
  url: ORIGIN + "/",
  name: SITE,
  inLanguage: "ro-RO",
  publisher: { "@id": STUDIO },
};

const studio = {
  "@type": "ProfessionalService",
  "@id": STUDIO,
  name: SITE,
  url: `${ORIGIN}/studio`,
  image: `${ORIGIN}/og-cover.jpg`,
  logo: `${ORIGIN}/assets/logo.jpg`,
  description: "Studio de strategie, branding, design, marketing și experiențe web fondat de Aura Dobre.",
  founder: { "@id": PERSON },
  areaServed: "România",
  inLanguage: "ro-RO",
  telephone: "+40762509423",
  priceRange: "400–6000 RON",
  knowsAbout: ALL_SERVICES,
  sameAs: [
    "https://www.instagram.com/aurasdigitaldream",
    "https://www.linkedin.com/in/aurelia-dobre-a033b2104",
    "https://aurasdigitaldream.gumroad.com/",
  ],
};

function crumbs(trail) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: ORIGIN + step.url,
    })),
  };
}

/* The two published titles, as they are listed on the books page. Kept here
 * rather than parsed out of App.jsx: they carry an ISBN-less Amazon link and
 * a genre, neither of which appears in the markup in a parseable shape. */
const BOOKS = [
  {
    name: "The Clockmaker's Curse",
    alternativeHeadline: "Time Holds The Key",
    genre: ["Thriller", "Mystery"],
    image: "/assets/amazon/clockmakers-curse.jpg",
    url: "https://amzn.eu/d/0bGKmBLR",
    inLanguage: "en",
  },
  {
    name: "Lunaria's Secret Treasure",
    alternativeHeadline: "In the Enchanted Forest",
    genre: ["Children's fantasy", "Adventure"],
    image: "/assets/amazon/lunaria-secret-treasure.jpg",
    url: "https://a.co/d/0gsNh4wn",
    inLanguage: "en",
  },
  {
    name: "Unreachable",
    genre: ["Dark romance", "Psychological thriller"],
    image: "/assets/amazon/unreachable.jpg",
    url: "https://www.amazon.co.uk/dp/B0GXSLHRNY",
    inLanguage: "en",
  },
];

export function graphFor(route) {
  const url = ORIGIN + route.url;
  const nodes = [website, person];

  if (route.url === "/") {
    /* Same @id as the node the component renders, so the two merge into one
     * studio rather than describing two. */
    nodes.push({
      ...studio,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servicii",
        itemListElement: ALL_SERVICES.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s, provider: { "@id": STUDIO }, areaServed: "România" },
        })),
      },
    });
    nodes.push({
      "@type": "WebPage",
      "@id": url + "#page",
      url,
      name: route.title,
      description: route.description,
      isPartOf: { "@id": `${ORIGIN}/#website` },
      about: { "@id": STUDIO },
      inLanguage: "ro-RO",
      primaryImageOfPage: { "@type": "ImageObject", url: abs(route.image) },
    });
    return nodes;
  }

  const trail = [{ name: "Acasă", url: "/" }];

  if (route.url === "/studio") {
    trail.push({ name: "Studio", url: route.url });
    nodes.push(studio, crumbs(trail), {
      "@type": "CollectionPage",
      "@id": url + "#page",
      url,
      name: route.title,
      description: route.description,
      isPartOf: { "@id": `${ORIGIN}/#website` },
      about: { "@id": STUDIO },
      author: { "@id": PERSON },
      inLanguage: "ro-RO",
      primaryImageOfPage: { "@type": "ImageObject", url: abs(route.image) },
    });
    return nodes;
  }

  if (route.url === "/cartile-mele") {
    trail.push({ name: "Cărțile mele", url: route.url });
    nodes.push(person, crumbs(trail), {
      "@type": "CollectionPage",
      "@id": url + "#page",
      url,
      name: route.title,
      description: route.description,
      isPartOf: { "@id": `${ORIGIN}/#website` },
      about: { "@id": PERSON },
      inLanguage: "ro-RO",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: BOOKS.length,
        itemListElement: BOOKS.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: { "@type": "Book", author: { "@id": PERSON }, ...b, image: abs(b.image) },
        })),
      },
    });
    return nodes;
  }

  // Everything left is one portfolio case study.
  trail.push({ name: "Studio", url: "/studio" }, { name: route.title.split(" — ")[0], url: route.url });
  nodes.push(crumbs(trail), {
    "@type": "WebPage",
    "@id": url + "#page",
    url,
    name: route.title,
    description: route.description,
    isPartOf: { "@id": `${ORIGIN}/#website` },
    inLanguage: "ro-RO",
    primaryImageOfPage: { "@type": "ImageObject", url: abs(route.image) },
    mainEntity: {
      "@type": "CreativeWork",
      "@id": url + "#work",
      name: route.title.split(" — ")[0],
      description: route.description,
      url,
      image: abs(route.image),
      creator: { "@id": PERSON },
      provider: { "@id": STUDIO },
      inLanguage: "ro-RO",
      genre: "Design",
      /* What was actually delivered here, from the same array the page
       * prints under "Servicii livrate". */
      keywords: (projectDetails[route.url.split("/").pop()]?.services || []).join(", "),
      abstract: projectDetails[route.url.split("/").pop()]?.approach,
    },
  });
  return nodes;
}

export function jsonLd(route) {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graphFor(route) });
}
