import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowsOutSimple,
  Check,
  CaretLeft,
  CaretRight,
  Code,
  FileText,
  InstagramLogo,
  LinkedinLogo,
  List,
  Megaphone,
  Palette,
  Phone,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";
import { projectDetails } from "./projectDetails";
import { useScrollExperience } from "./useScrollExperience";

const portfolioAssets = __PORTFOLIO_ASSETS__;
const supplementalPortfolioAssets = {
  "adi-ecoo-2009-sa": [
    "/portfolio/adi-ecoo-2009-sa/adi-ecoo-rollup-real.jpeg",
  ],
  "verde-bean": [
    "/portfolio/verde-bean/verde-bean-coffee-flatlay.jpeg",
    "/portfolio/verde-bean/verde-bean-brand-system.jpeg",
    "/portfolio/verde-bean/verde-bean-hero-branding.jpeg",
    "/portfolio/verde-bean/verde-bean-menu-system.jpeg",
  ],
  "selectii-cromatice": [
    "/portfolio/selectii-cromatice/olive-blush.jpeg",
    "/portfolio/selectii-cromatice/dusty-yellow-cool-blue.jpeg",
    "/portfolio/selectii-cromatice/smokey-blue-merlot-red.jpeg",
    "/portfolio/selectii-cromatice/warm-orange-dusty-yellow.jpeg",
    "/portfolio/selectii-cromatice/warm-white-cool-blue.jpeg",
  ],
  "auras-trend-vault": [
    "/portfolio/auras-trend-vault/editorial-2026/editorial-black-white.jpeg",
    "/portfolio/auras-trend-vault/editorial-2026/editorial-golden-light.jpeg",
    "/portfolio/auras-trend-vault/editorial-2026/editorial-city-motion.jpeg",
    "/portfolio/auras-trend-vault/editorial-2026/vogue-cover.jpeg",
    "/portfolio/auras-trend-vault/editorial-2026/trend-vault-motion-01.mp4",
    "/portfolio/auras-trend-vault/editorial-2026/trend-vault-motion-02.mp4",
    "/portfolio/auras-trend-vault/editorial-2026/trend-vault-motion-03.mp4",
    "/portfolio/auras-trend-vault/editorial-2026/trend-vault-motion-04.mp4",
  ],
};
const excludedPortfolioAssets = new Set([
  "/portfolio/arta-digitala-materiale-grafice/76bc483af_freepik__genereazaa-o-imagine-realistica-a-unor-deseuri-din__37852.jpg",
  "/portfolio/verde-bean/43d21e774_WhatsAppImage2026-07-02at090629.jpeg",
  "/portfolio/verde-bean/85c614852_generated_image.png",
  "/portfolio/verde-bean/a2f94eaa5_generated_image.png",
  "/portfolio/verde-bean/dab706afd_generated_image.png",
  "/portfolio/verde-bean/e0a278da9_generated_image.png",
]);
const detailHeroAssets = {
  "verde-bean": "/portfolio/verde-bean/verde-bean-hero-branding.jpeg",
  "lumina-botanica": "/portfolio/lumina-botanica/20c5ceaff_WhatsAppImage2026-07-02at090233.jpg",
  "lupul-and-brici": "/portfolio/lupul-and-brici/852b052a0_generated_image.png",
  "luxury-hair-by-aura": "/portfolio/luxury-hair-by-aura/0429b7c7f_WhatsAppImage2026-07-02at1127334.jpg",
  "real-estate-co": "/portfolio/real-estate-co/7254652e3_Capturdeecran2025-10-27232250.png",
  "carti-de-vizita": "/portfolio/carti-de-vizita/3cd5b72d3_adiecoo1.png",
  "adi-ecoo-2009-sa": "/portfolio/adi-ecoo-2009-sa/adi-ecoo-rollup-real.jpeg",
  "painea-de-acasa": "/portfolio/painea-de-acasa/painea-de-acasa-packaging.jpeg",
  "campanie-social-media-luxe": "/portfolio/campanie-social-media-luxe/65714e254_generated_image.png",
  "auras-trend-vault": "/portfolio/auras-trend-vault/84ce9f083_WhatsAppImage2026-07-01at120708.jpg",
  "magazine-online-e-commerce": "/portfolio/magazine-online-e-commerce/21dc16065_WhatsAppImage2026-07-02at090809.jpg",
  "invitatii-nunti-botezuri-evenimente": "/portfolio/invitatii-nunti-botezuri-evenimente/766c6c8d9_generated_image.png",
  "documente-corporatiste-licenta": "/portfolio/documente-corporatiste-licenta/2e1da68ae_generated_image.png",
  "arta-digitala-materiale-grafice": "/portfolio/arta-digitala-materiale-grafice/a847754e3_WhatsAppImage2026-07-02at1140104.jpg",
  "logo-design": "/portfolio/logo-design/3caeb0cc1_Untitled-design.png",
  "selectii-cromatice": "/portfolio/selectii-cromatice/olive-blush.jpeg",
};

const projects = [
  { slug: "selectii-cromatice", title: "Selecții Cromatice — Moodboard-uri & Direcție Vizuală", category: ["Moodboard", "Grafică"], image: "/portfolio/selectii-cromatice/olive-blush.jpeg", description: "Palete atent curatoriate, transformate în atmosfere vizuale pentru identități de brand, campanii și spații digitale." },
  { slug: "verde-bean", title: "Verde Bean — Identitate de Brand", category: ["Branding"], image: "/portfolio/verde-bean/verde-bean-hero-branding.jpeg", description: "Identitate vizuală completă pentru un brand de cafea specialty sustenabil." },
  { slug: "painea-de-acasa", title: "Pâinea de Acasă — Identitate de Brand Artizanală", category: ["Branding", "Grafică"], image: "/portfolio/painea-de-acasa/painea-de-acasa-packaging.jpeg", description: "Identitate caldă și autentică pentru o brutărie artizanală locală, cu logo, paletă, tipografie și aplicații de brand." },
  { slug: "lumina-botanica", title: "Lumina Botanica — Identitate de Brand", category: ["Branding"], image: "/portfolio/lumina-botanica/20c5ceaff_WhatsAppImage2026-07-02at090233.jpg", description: "Branding premium pentru o linie de produse cosmetice organice și botanice." },
  { slug: "lupul-and-brici", title: "Lupul & Brici — Identitate de Brand", category: ["Branding", "Web"], image: "/portfolio/lupul-and-brici/852b052a0_generated_image.png", description: "Identitate vizuală pentru un brand de îngrijire masculină, cu website de prezentare inclus." },
  { slug: "luxury-hair-by-aura", title: "Luxury Hair by Aura — Identitate de Brand", category: ["Branding"], image: "/portfolio/luxury-hair-by-aura/0429b7c7f_WhatsAppImage2026-07-02at1127334.jpg", description: "Identitate vizuală premium pentru un salon de extensii de păr din Slobozia." },
  { slug: "real-estate-co", title: "Real Estate Co. — Identitate de Brand & Website", category: ["Branding", "Web"], image: "/portfolio/real-estate-co/7254652e3_Capturdeecran2025-10-27232250.png", description: "Identitate vizuală completă, materiale print și website pentru o agenție imobiliară din Anglia." },
  { slug: "carti-de-vizita", title: "Cărți de Vizită — Design Corporate & Personal", category: ["Branding"], image: "/portfolio/carti-de-vizita/3cd5b72d3_adiecoo1.png", description: "Cărți de vizită digitale cu cod QR și print, create într-un stil modern și memorabil." },
  { slug: "adi-ecoo-2009-sa", title: "ADI ECOO 2009 S.A. — Identitate, campanii & www.adiecoo2009sa.ro", category: ["Branding", "Marketing", "Grafică", "Web", "Documente"], image: "/portfolio/adi-ecoo-2009-sa/adi-ecoo-rollup-real.jpeg", description: "Identitate completă și ecosistem de comunicare: logo, campanii, materiale editoriale, conținut digital și website www.adiecoo2009sa.ro." },
  { slug: "campanie-social-media-luxe", title: "Campanie Social Media — Bijuterii de Lux", category: ["Marketing"], image: "/assets/bijuterii.png", description: "Campanie editorială pentru o maison de bijuterii fine, cu fotografie și storytelling premium." },
  { slug: "auras-trend-vault", title: "Aura's Trend Vault — Platformă Web, Blog, AI & Fotografie Editorială", category: ["Web"], image: "/portfolio/auras-trend-vault/editorial-2026/vogue-cover.jpeg", description: "Platformă web completă, blog editorial și experiențe AI create de la zero." },
  { slug: "magazine-online-e-commerce", title: "Magazine Online E-Commerce — Web Design, Dezvoltare & Fotografie", category: ["Web"], image: "/assets/ecommerce.jpg", description: "Magazine online complete, cu design, plăți, curieri, fotografie de produs și optimizare SEO." },
  { slug: "invitatii-nunti-botezuri-evenimente", title: "Invitații Nunți, Botezuri & Evenimente", category: ["Grafică"], image: "/assets/invitatii.png", description: "Invitații premium personalizate, cu accente botanice, caligrafie și finisaje rafinate." },
  { slug: "documente-corporatiste-licenta", title: "Documente Corporatiste & Lucrare de Licență", category: ["Documente"], image: "/assets/documente.png", description: "Rapoarte, broșuri, prezentări și documente academice cu structură clară și design profesionist." },
  { slug: "arta-digitala-materiale-grafice", title: "Artă Digitală & Materiale Grafice", category: ["Grafică"], image: "/portfolio/arta-digitala-materiale-grafice/a847754e3_WhatsAppImage2026-07-02at1140104.jpg", description: "Ilustrații, postere, compoziții abstracte și materiale grafice create într-o direcție contemporană." },
  { slug: "logo-design", title: "Logo Design — Identități Vizuale de Brand", category: ["Logo Design"], image: "/portfolio/logo-design/3caeb0cc1_Untitled-design.png", description: "Colecție de logo-uri profesionale — de la monograme elegante la embleme corporate și sigle de lux." },
];

const featuredSlugs = ["auras-trend-vault", "verde-bean", "real-estate-co", "campanie-social-media-luxe"];
const featuredCardAssets = {
  "auras-trend-vault": "/portfolio/auras-trend-vault/editorial-2026/vogue-cover.jpeg",
};

const portfolioGroups = [
  {
    title: "Branding",
    copy: "Identități vizuale, logo-uri, direcții cromatice și materiale de brand care fac o afacere recognoscibilă.",
    slugs: ["verde-bean", "painea-de-acasa", "lumina-botanica", "luxury-hair-by-aura", "logo-design", "carti-de-vizita", "selectii-cromatice"],
  },
  {
    title: "Web",
    copy: "Platforme, website-uri și experiențe digitale create pentru prezentare, conversie și încredere.",
    slugs: ["auras-trend-vault", "real-estate-co", "lupul-and-brici", "magazine-online-e-commerce"],
  },
  {
    title: "Marketing",
    copy: "Campanii, conținut vizual, documente și materiale promoționale construite pentru vizibilitate.",
    slugs: ["adi-ecoo-2009-sa", "campanie-social-media-luxe", "invitatii-nunti-botezuri-evenimente", "documente-corporatiste-licenta", "arta-digitala-materiale-grafice"],
  },
];

const services = [
  { icon: Palette, title: "Pachet Start-up", subtitle: "Identitate completă pentru afaceri noi", copy: "Pentru branduri la început care au nevoie de o imagine clară și credibilă din prima zi.", list: ["Logo profesional + 2 variante cromatice", "Paletă cromatică + fonturi", "Carte de vizită / semnătură digitală", "Mini kit social media (3 postări + 3 stories)", "Ghid de identitate PDF"], benefits: ["Arăți profesionist din prima zi", "Ai o imagine coerentă pe toate platformele", "Ai materiale gata de folosit"], price: "900 – 1.200 RON" },
  { icon: Megaphone, title: "Pachet Rebranding", subtitle: "Upgrade complet de imagine", copy: "Pentru afaceri care există deja, dar au nevoie de o identitate matură și premium.", list: ["Audit vizual complet", "Refresh logo + direcție vizuală", "Materiale grafice actualizate", "Direcție de comunicare", "6 vizualuri social media", "Ghid de brand PDF"], benefits: ["Imagine modernă și coerentă", "Creștere încredere + profesionalism", "Materiale actualizate pentru toate platformele"], price: "1.500 – 2.200 RON" },
  { icon: Code, title: "Pachet Website", subtitle: "Prezență digitală profesionistă", copy: "Pentru branduri care vor un site elegant, rapid și construit pentru conversie.", list: ["Website 5–8 pagini", "Structură UX + texte", "Formular + WhatsApp + CTA-uri", "Responsive mobil", "SEO de bază", "Instruire video"], benefits: ["Site rapid și modern", "Crește încrederea clienților", "Optimizat pentru conversie"], price: "2.000 – 2.500 RON" },
  { icon: Code, title: "Pachet Website Premium", subtitle: "Storytelling & animații", copy: "Pentru branduri care vor o experiență digitală cinematică.", list: ["Design avansat", "Animații GSAP / Lottie", "Storytelling vizual", "Elemente 3D / video", "Strategie de conținut", "SEO extins"], benefits: ["Experiență memorabilă", "Diferențiere premium", "Mai multă atenție și timp petrecut pe site"], price: "3.500 – 4.500 RON" },
  { icon: Megaphone, title: "Pachet Social Media", subtitle: "Vizibilitate constantă", copy: "Pentru branduri care au nevoie de conținut coerent și o prezență recognoscibilă.", list: ["6 vizualuri / lună", "Template-uri reutilizabile", "Calendar de conținut", "Copywriting", "Mini strategie"], benefits: ["Postări coerente vizual", "Mai multă claritate în comunicare", "Prezență constantă fără haos"], price: "450 – 600 RON" },
  { icon: FileText, title: "Pachet Documente Profesionale", subtitle: "Materiale impecabile", copy: "Pentru documente, prezentări și materiale oficiale care trebuie să arate ordonat și profesionist.", list: ["Prezentări", "Rapoarte", "Broșuri", "PDF-uri", "Tehnoredactare completă"], benefits: ["Documente curate și ușor de citit", "Imagine serioasă și profesionistă", "Structură clară pentru informații complexe"], price: "40 – 60 RON / pagină" },
];

const documentTemplates = [
  { title: "Memorandum juridic / administrativ", label: "Legal memo", copy: "Document structurat pentru situații oficiale: context, întrebare, răspuns scurt, fapte relevante, analiză și concluzie." },
  { title: "Documentație tehnică / system design", label: "System design", copy: "Pentru aplicații, website-uri sau procese digitale: obiective, arhitectură, componente, fluxuri, API-uri, riscuri și pași de implementare." },
  { title: "Dosare, rapoarte și lucrări", label: "Business & academic", copy: "Structurare, tehnoredactare și design pentru materiale lungi: lucrări de licență, rapoarte, proceduri, ghiduri și prezentări PDF." },
];

const priceItems = [
  { title: "Pachet Start-up", price: 900, maxPrice: 1200, copy: "Logo, identitate vizuală de bază și mini kit social media." },
  { title: "Pachet Rebranding", price: 1500, maxPrice: 2200, copy: "Refresh vizual, repoziționare, materiale actualizate și direcție de comunicare." },
  { title: "Pachet Website (5–8 pagini)", price: 2000, maxPrice: 2500, copy: "Structură completă, design responsive, contact, SEO de bază și instruire." },
  { title: "Website Premium — animații & storytelling", price: 3500, maxPrice: 4500, copy: "Design avansat, animații, storytelling vizual și experiență personalizată." },
  { title: "Magazin online", price: 4500, maxPrice: 6000, copy: "Catalog, coș, plăți, curier, configurare inițială și instruire." },
  { title: "Logo design", price: 400, maxPrice: 600, copy: "Concept de logo, variante cromatice și fișiere pregătite pentru web." },
  { title: "Identitate vizuală completă", price: 800, maxPrice: 1200, copy: "Logo, paletă cromatică, fonturi, direcție vizuală și aplicații de bază." },
  { title: "Pachet social media — 6 vizualuri", price: 450, maxPrice: 600, copy: "Șase postări sau story-uri coerente vizual, adaptate brandului." },
  { title: "Documente profesionale", price: 40, maxPrice: 60, unit: "/ pagină", copy: "Formatare, structurare și aranjare vizuală; tariful final depinde de complexitate." },
  { title: "Prezentare profesională — 10 slide-uri", price: 450, maxPrice: 700, copy: "Structură clară, design coerent și pregătire pentru prezentare sau PDF." },
  { title: "Poster / flyer", price: 150, maxPrice: 250, copy: "O direcție vizuală personalizată și fișiere pentru digital sau tipar." },
  { title: "Carte de vizită", price: 180, maxPrice: 250, copy: "Design față-verso, variantă digitală și fișier pregătit pentru tipar." },
];

const testimonials = [
  { type: "Branding", initials: "MB", quote: "Aura ne-a ajutat să transformăm o idee destul de împrăștiată într-o identitate clară: logo, culori, materiale și o direcție vizuală pe care o putem folosi consecvent.", name: "Mihaela B.", role: "Fondator brand local" },
  { type: "Web", initials: "AC", quote: "Site-ul a devenit mult mai ușor de înțeles pentru clienți. Structura, butoanele și prezentarea serviciilor ne-au ajutat să primim cereri mai clare.", name: "Andrei C.", role: "Antreprenor servicii premium" },
  { type: "Documente", initials: "EP", quote: "Aveam nevoie ca documentele să arate profesionist, nu doar corect scrise. Aura a organizat informația, a curățat vizual paginile și a dat materialului un aspect serios.", name: "Elena P.", role: "Client documente & prezentări" },
  { type: "Social Media", initials: "IR", quote: "Vizualurile pentru social media au început să pară parte din același brand. Nu mai postăm la întâmplare, ci cu o linie estetică ușor de recunoscut.", name: "Ioana R.", role: "Beauty & lifestyle business" },
];

function scrollToId(id) {
  const targetId = id === "estimare" ? "estimator" : id;
  document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
}

function scheduleScrollToId(id) {
  requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)));
  window.setTimeout(() => scrollToId(id), 120);
}

function ProjectDetail({ project, details, onNavigate, onSection }) {
  const [zoomed, setZoomed] = useState(null);
  const assets = [...new Set([
    ...(portfolioAssets[project.slug] || []),
    ...(supplementalPortfolioAssets[project.slug] || []),
  ])];
  const curatedAssets = assets.filter((asset) => !excludedPortfolioAssets.has(asset));
  const images = curatedAssets.filter((asset) => !asset.toLowerCase().endsWith(".mp4"));
  const videos = curatedAssets.filter((asset) => asset.toLowerCase().endsWith(".mp4"));
  const heroImage = detailHeroAssets[project.slug] || images[0] || project.image;
  const whatsappMessage = encodeURIComponent(`Bună, Aura! Am văzut proiectul ${project.title} și aș dori să discutăm despre un proiect asemănător.`);

  return (
    <main className="detail-page"><div className="scroll-progress" aria-hidden="true" /><div className="custom-cursor" aria-hidden="true" /><div className="custom-cursor-ring" aria-hidden="true" />
      <header className="detail-header">
        <a className="brand" href="/" onClick={(event) => onNavigate(event, "/")}><img src="/assets/logo.jpg" alt="Aura's Digital Dream" /><span>Aura's <em>Digital</em> Dream</span></a>
        <nav><a href="/" onClick={(event) => onNavigate(event, "/")}>Acasă</a><a href="/#despre" onClick={(event) => onSection(event, "despre")}>Despre</a><a href="/#servicii" onClick={(event) => onSection(event, "servicii")}>Servicii</a><a href="/#portofoliu" onClick={(event) => onSection(event, "portofoliu")}>Portofoliu</a><a href="/#contact" onClick={(event) => onSection(event, "contact")}>Contact</a></nav>
      </header>

      <section className="detail-hero">
        <div className="detail-hero-copy" data-reveal>
          <a className="detail-back" href="/#portofoliu" onClick={(event) => onSection(event, "portofoliu")}><ArrowLeft size={18} /> Înapoi la portofoliu</a>
          <div className="detail-meta"><span>{details.category}</span><span>{details.date}</span></div>
          <h1>{project.title}</h1>
          <p>Client: {details.client}</p>
        </div>
        <div className="detail-hero-visual" data-parallax="0.08"><img className="detail-hero-backdrop" src={heroImage} alt="" aria-hidden="true" /><img className="detail-hero-main" src={heroImage} alt={project.title} /></div>
      </section>

      <section className="detail-content">
        <div className="detail-intro" data-reveal><p className="section-kicker">Despre proiect</p><h2>{details.about}</h2></div>
        <div className="project-facts" data-reveal><article><small>Rol & servicii</small><strong>{project.category.join(" · ")}</strong></article><article><small>Client</small><strong>{details.client}</strong></article><article><small>Perioadă</small><strong>{details.date}</strong></article><article><small>Livrabile</small><strong>{details.results.length} rezultate-cheie</strong></article></div>
        <div className="detail-columns"><article data-reveal><span>01</span><h3>Provocarea</h3><p>{details.challenge}</p></article><article data-reveal><span>02</span><h3>Soluția</h3><p>{details.solution}</p></article></div>
        <div className="detail-results"><p className="section-kicker">Rezultate</p><div>{details.results.map((result) => <article key={result}><Check size={18} weight="bold" /><span>{result}</span></article>)}</div></div>
      </section>

      <section className="detail-gallery">
        <p className="section-kicker">Galerie</p><h2>Proiectul <em>în imagini.</em></h2>
        <div className="gallery-grid">{images.map((image, index) => <button data-reveal key={image} className={index % 7 === 0 ? "gallery-wide" : ""} onClick={() => setZoomed(image)}><img src={image} alt={`${project.title} — imagine ${index + 1}`} loading="lazy" /><span><ArrowsOutSimple size={24} /> Click pentru zoom</span></button>)}</div>
        {videos.length > 0 && <div className="video-section"><h3>Video</h3><div>{videos.map((video) => <video controls preload="metadata" key={video}><source src={video} type="video/mp4" /></video>)}</div></div>}
      </section>

      <section className="detail-cta"><p>Îți place direcția?</p><h2>Putem crea o poveste la fel de <em>memorabilă pentru brandul tău.</em></h2><a className="button primary" href={`https://wa.me/40762509423?text=${whatsappMessage}`}>Vreau un proiect asemănător <WhatsappLogo size={19} /></a></section>
      <footer><div className="footer-brand"><img src="/assets/logo.jpg" alt="Aura's Digital Dream" /><div><strong>Aura's Digital Dream</strong><p>Marketing, design și soluții digitale, cu suflet.</p></div></div><p>© 2026 Aura's Digital Dream. Toate drepturile rezervate.</p></footer>
      <a className="floating-whatsapp" href="https://wa.me/40762509423" aria-label="Scrie-mi pe WhatsApp"><WhatsappLogo size={28} weight="fill" /></a>
      {zoomed && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Imagine mărită" onClick={() => setZoomed(null)}><button aria-label="Închide imaginea" onClick={() => setZoomed(null)}><X size={26} /></button><img src={zoomed} alt="Imagine mărită din proiect" /></div>}
    </main>
  );
}

function BooksPage({ onNavigate, onSection }) {
  const bookScenes = [
    { nr: "01", title: "Izolarea", book: "Unreachable", image: "/assets/amazon/unreachable.jpg", tone: "zăpadă · tăcere · obsesie", copy: "O casă rece, o prezență care apasă pe fiecare pagină și sentimentul că liniștea nu este niciodată sigură." },
    { nr: "02", title: "Mecanismul", book: "The Clockmaker's Curse", image: "/assets/amazon/clockmakers-curse.jpg", tone: "timp · cheie · blestem", copy: "Aici timpul nu curge. Se strânge. Fiecare rotiță ascunde o alegere, iar fiecare alegere deschide ceva ce nu mai poate fi închis." },
    { nr: "03", title: "Pădurea", book: "Lunaria's Secret Treasure", image: "/assets/amazon/lunaria-secret-treasure.jpg", tone: "magie · copilărie · aventură", copy: "O lume luminoasă, creată ca o hartă pentru curaj, curiozitate și acea parte din noi care încă mai caută comori." },
  ];
  return (
    <main className="books-page"><div className="scroll-progress" aria-hidden="true" /><div className="custom-cursor" aria-hidden="true" /><div className="custom-cursor-ring" aria-hidden="true" />
      <header className="detail-header books-header">
        <a className="brand" href="/" onClick={(event) => onNavigate(event, "/")}><img src="/assets/logo.jpg" alt="Aura's Digital Dream" /><span>Aura's <em>Digital</em> Dream</span></a>
        <nav><a href="/" onClick={(event) => onNavigate(event, "/")}>Acasă</a><a href="/#portofoliu" onClick={(event) => onSection(event, "portofoliu")}>Portofoliu</a><a href="/#servicii" onClick={(event) => onSection(event, "servicii")}>Servicii</a><a href="/#contact" onClick={(event) => onSection(event, "contact")}>Contact</a></nav>
      </header>

      <section className="books-hero" data-reveal>
        <div><p className="section-kicker">Aura Dobre · Author universe</p><h1>O pagină care se citește ca un trailer.</h1><p>Aceasta este vitrina mea literară: cărțile pe care le-am scris și publicat, trăite aici ca un storytelling vizual. Fiecare scroll deschide o altă atmosferă: tensiune, mister, magie și lumi construite cu intenție.</p><div className="books-actions"><a className="button primary" href="https://www.amazon.co.uk/stores/author/B0DSJP6MX8/allbooks?ingress=0" target="_blank" rel="noopener noreferrer">Vezi toate cărțile pe Amazon <ArrowRight size={18} /></a><a className="button ghost" href="https://www.goodreads.com/user/show/203519366-aura-dobre" target="_blank" rel="noopener noreferrer">Profilul meu pe Goodreads</a></div></div>
        <div className="books-cover-stack cinematic-stack" data-parallax="0.035"><span className="book-spark one" /><span className="book-spark two" /><img src="/assets/amazon/clockmakers-curse.jpg" alt="The Clockmaker's Curse" /><img src="/assets/amazon/unreachable.jpg" alt="Unreachable" /><img src="/assets/amazon/lunaria-secret-treasure.jpg" alt="Lunaria Secret Treasure" /><b>scroll pentru capitole</b></div>
      </section>

      <section className="book-scroll-story" aria-label="Storytelling cinematic pentru cărțile Aura Dobre">
        <div className="book-story-pin">
          <p className="section-kicker">Scroll story</p>
          <h2>Trei uși. Trei lumi. Același instinct: să intri mai adânc.</h2>
        </div>
        <div className="book-story-scenes">
          {bookScenes.map((scene) => <article className="book-story-scene" data-reveal key={scene.title}>
            <div className="scene-copy"><span>{scene.nr} / {scene.tone}</span><h3>{scene.title}</h3><p>{scene.copy}</p></div>
            <figure><img src={scene.image} alt={`Coperta ${scene.book}`} /><figcaption>{scene.book}</figcaption></figure>
          </article>)}
        </div>
      </section>

      <section className="books-section books-universe" data-reveal>
        <div className="books-section-inner"><p className="section-kicker">Univers literar</p><h2>Universul meu literar</h2><p>Scriu despre oameni care cred că sunt de neatins și despre momentele în care descoperă că nu mai sunt. Despre case care nu sunt doar locuri, ci mecanisme. Despre relații care nu sunt doar povești de dragoste, ci experimente de putere. Despre vulnerabilitate, obsesie și felul în care ne construim propriile mitologii.</p><p>Cărțile mele trăiesc la intersecția dintre dark romance, thriller psihologic și ficțiune literară. Amazon le listează ca produse. Eu le văd ca lumi.</p></div>
      </section>

      <section className="books-section book-feature" id="unreachable" data-reveal>
        <div className="book-feature-copy"><p className="section-kicker">Flagship book</p><h2>Unreachable</h2><p className="book-meta">Dark Romance · Thriller psihologic · Remote northern estate</p><p>Un bărbat care nu vrea să fie iubit — vrea să fie temut. O femeie care dispare fără urmă. O casă izolată pe un promontoriu, unde unele lucruri sunt aduse ca să rămână. <em>Unreachable</em> este o poveste despre obsesie, captivitate și momentul în care îți dai seama că nu mai ești doar spectator în propria viață.</p><div className="literary-chips">{["villain romance","psychological tension","remote estate","literary prose"].map((chip) => <span key={chip}>{chip}</span>)}</div><div className="book-quotes"><p>„Nu te-a răpit. Te-a colecționat.”</p><p>„El nu voia iubire. Voia momentul în care ai înțeles că ești a lui.”</p><p>„Unele femei sunt de neatins. Până nu mai sunt.”</p></div><div className="books-actions"><a className="button primary" href="https://www.amazon.co.uk/dp/B0GXSLHRNY" target="_blank" rel="sponsored noopener noreferrer">Citește Unreachable pe Amazon <ArrowRight size={18} /></a><a className="button ghost" href="https://www.goodreads.com/book/show/256317209-unreachable" target="_blank" rel="noopener noreferrer">Vezi cartea pe Goodreads</a></div></div>
        <figure className="book-feature-cover"><img src="/assets/amazon/unreachable.jpg" alt="Coperta Unreachable de Aura Dobre" /><figcaption>Atmosferă cinematică: zăpadă, casă izolată, tensiune psihologică.</figcaption></figure>
      </section>

      <section className="books-section other-books" data-reveal>
        <div className="books-section-inner"><p className="section-kicker">Bibliotecă de autor</p><h2>Alte cărți scrise de mine</h2><p>Pe pagina mea de autor de pe Amazon vei găsi toate titlurile publicate: proiecte literare, ficțiune psihologică, povești scurte și lumi care explorează identitatea, memoria, relațiile și felul în care ne spunem poveștile nouă înșine.</p></div>
        <div className="other-book-grid">
          {[["The Clockmaker's Curse","/assets/amazon/clockmakers-curse.jpg","Time Holds The Key"],["Lunaria's Secret Treasure","/assets/amazon/lunaria-secret-treasure.jpg","In the Enchanted Forest"]].map(([title,image,meta]) => <article className="other-book-card" key={title}><img src={image} alt={`Coperta ${title}`} /><div><h3>{title}</h3><p>{meta}</p><a href="https://www.amazon.com/stores/Aura-Dobre/author/B0DSJP6MX8?ref=ap_rdr&shoppingPortalEnabled=true&ccs_id=26b0d51d-d6bb-476b-bde1-e053aa0e05fb" target="_blank" rel="noopener noreferrer">Vezi pe Amazon <ArrowRight size={15} /></a></div></article>)}
        </div>
      </section>

      <section className="books-section books-reader" data-reveal><div><p className="section-kicker">Pentru cititori</p><h2>Pentru cine sunt cărțile mele</h2><p>Dacă iubești poveștile întunecate, personajele complexe, tensiunea psihologică și relațiile care nu pot fi reduse la „boy meets girl”, ești în locul potrivit. Cărțile mele sunt pentru cititorii care vor să simtă ceva intens, nu doar să treacă prin pagini.</p><div className="literary-chips">{["dark romance","thriller psihologic","villain energy","literary dark fiction","obsession stories"].map((chip) => <span key={chip}>{chip}</span>)}</div></div></section>

      <section className="books-section behind-author" data-reveal><div><p className="section-kicker">Behind the author</p><h2>În spatele poveștilor</h2><p>Sunt Aura Dobre, autor, designer și om care se uită la lume ca la un set de povești posibile. Scriu dintr-un loc în care estetica, psihologia și vulnerabilitatea se întâlnesc.</p><div className="books-actions"><a className="button primary" href="mailto:auraleodobre@gmail.com?subject=Newsletter%20Aura%20Dobre">Abonează-te la newsletter</a><a className="button ghost" href="/" onClick={(event) => onNavigate(event, "/")}>Vezi și lumea mea digitală</a></div></div></section>

      <section className="books-final-cta" data-reveal><h2>Hai să intri în poveste.</h2><p>Derularea se oprește aici, dar poveștile nu. Amazon îți arată titlurile, Goodreads îți arată reacțiile, iar această pagină îți arată intenția: să construiesc lumi în care să vrei să rămâi.</p><div className="books-actions"><a className="button primary" href="https://www.amazon.co.uk/stores/author/B0DSJP6MX8/allbooks?ingress=0" target="_blank" rel="noopener noreferrer">Intră în vitrina mea de pe Amazon <ArrowRight size={18} /></a><a className="button ghost" href="https://aurasdigitaldream.gumroad.com/" target="_blank" rel="noopener noreferrer">Cărțile mele pe Gumroad</a></div></section>

      <footer><div className="footer-brand"><img src="/assets/logo.jpg" alt="Aura's Digital Dream" /><div><strong>Aura Dobre</strong><p>Cărți, lumi vizuale și povești cinematice.</p></div></div><p>© 2026 Aura Dobre. Toate drepturile rezervate.</p></footer>
    </main>
  );
}

function BooksPageCinematic({ onNavigate, onSection }) {
  const authorAmazon = "https://www.amazon.co.uk/stores/author/B0DSJP6MX8/allbooks?ingress=0";
  const goodreads = "https://www.goodreads.com/user/show/203519366-aura-dobre";
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 800], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollY, [0, 450], [1, 0]);
  const featureRef = useRef(null);
  const featureInView = useInView(featureRef, { once: true, margin: "-18% 0px" });
  const { scrollYProgress: featureProgress } = useScroll({ target: featureRef, offset: ["start end", "center center"] });
  const featureScale = useTransform(featureProgress, [0, 1], [0.86, 1]);
  const authorRef = useRef(null);
  const authorInView = useInView(authorRef, { once: true, margin: "-20% 0px" });
  const { scrollYProgress: authorProgress } = useScroll({ target: authorRef, offset: ["start end", "end start"] });
  const authorBgY = useTransform(authorProgress, [0, 1], ["-12%", "12%"]);
  const finalRef = useRef(null);
  const { scrollYProgress: finalProgress } = useScroll({ target: finalRef, offset: ["start end", "center center"] });
  const finalScale = useTransform(finalProgress, [0, 1], [1.14, 1]);
  const publishedBooks = [
    { title: "The Clockmaker's Curse", image: "/assets/amazon/clockmakers-curse.jpg", meta: "Time Holds The Key", copy: "Un blestem, un mecanism și o poveste în care timpul ascunde mai multe decât dezvăluie.", link: "https://amzn.eu/d/0bGKmBLR" },
    { title: "Lunaria's Secret Treasure", image: "/assets/amazon/lunaria-secret-treasure.jpg", meta: "In the Enchanted Forest", copy: "O aventură luminoasă și magică, construită ca o hartă pentru curaj, curiozitate și copilărie.", link: "https://a.co/d/0gsNh4wn" },
  ];
  const chips = ["dark romance", "thriller psihologic", "villain energy", "literary dark fiction", "obsession stories", "morally grey heroes", "slow burn tension"];
  const fadeUp = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } },
  };
  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.18, delayChildren: 0.75 } } };

  return (
    <main className="books-page cinematic-books"><div className="scroll-progress" aria-hidden="true" /><div className="custom-cursor" aria-hidden="true" /><div className="custom-cursor-ring" aria-hidden="true" /><div className="film-grain" aria-hidden="true" />
      <motion.header className="cinematic-nav" initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
        <a className="cinematic-author-logo" href="/" onClick={(event) => onNavigate(event, "/")}>Aura Dobre</a>
        <nav><a href="#carti">Cărți</a><a href="#despre">Despre</a><a href="/#contact" onClick={(event) => onSection(event, "contact")}>Contact</a><a className="cinematic-amazon-link" href={authorAmazon} target="_blank" rel="noopener noreferrer">Amazon <ArrowRight size={14} /></a></nav>
      </motion.header>

      <section className="cinematic-hero">
        <motion.div className="cinematic-video-wrap" style={{ y: heroBgY }}><video autoPlay muted loop playsInline className="cinematic-video"><source src="/assets/books-cinematic/hero-waves.mp4" type="video/mp4" /></video></motion.div>
        <div className="cinematic-veil" />
        <motion.div className="cinematic-hero-copy" variants={stagger} initial="hidden" animate="visible" style={{ opacity: heroOpacity }}>
          <motion.div variants={fadeUp} className="cinematic-label"><i />Ficțiune literară<i /></motion.div>
          <motion.h1 variants={fadeUp}>Aura Dobre</motion.h1>
          <motion.p variants={fadeUp} className="cinematic-subtitle">Author · Stories · Dark Fiction</motion.p>
          <motion.p variants={fadeUp}>Dark romance, thrillere psihologice și povești care se citesc ca un film.</motion.p>
          <motion.div variants={fadeUp} className="books-actions"><a className="button primary" href={authorAmazon} target="_blank" rel="noopener noreferrer">Vezi cărțile pe Amazon <ArrowRight size={18} /></a><a className="button ghost" href={goodreads} target="_blank" rel="noopener noreferrer">Profil Goodreads</a></motion.div>
        </motion.div>
        <motion.div className="scroll-cue" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 1 }}>Scroll <CaretRight size={14} /></motion.div>
      </section>

      <section className="cinematic-universe">
        <div className="gold-divider" aria-hidden="true"><i /><b /><i /></div>
        <div className="cinematic-universe-inner" data-reveal>
          <p className="section-kicker">01 — Universul</p>
          <h2>Personajele mele trăiesc la marginea rațiunii.</h2>
          <div><p>Unde obsesia devine artă și vulnerabilitatea, putere. Conace izolate, tensiuni psihologice, iubiri care ard și distrug în același timp.</p><p>Cărțile mele trăiesc la intersecția dintre dark romance, thriller psihologic și ficțiune literară. Amazon le listează ca produse. Eu le văd ca lumi.</p></div>
        </div>
      </section>

      <section className="cinematic-feature" id="carti" ref={featureRef}>
        <video autoPlay muted loop playsInline className="cinematic-bg-video"><source src="/assets/books-cinematic/hallway.mp4" type="video/mp4" /></video>
        <div className="cinematic-feature-inner">
          <div className="book-feature-copy"><motion.p className="section-kicker" initial={{ opacity: 0 }} animate={featureInView ? { opacity: 1 } : {}} transition={{ duration: 0.8 }}>02 — Carte featured</motion.p><motion.h2 initial={{ opacity: 0, y: 30 }} animate={featureInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>Unreachable</motion.h2><motion.p className="book-meta" initial={{ opacity: 0 }} animate={featureInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.22 }}>Dark Romance · Thriller psihologic · Remote northern estate</motion.p><motion.p initial={{ opacity: 0 }} animate={featureInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.32 }}>Iris Vane dispare într-o noapte de decembrie. Când se trezește într-o cameră perfectă, într-o casă fără ieșire, înțelege că bărbatul care a urmărit-o luni întregi nu este un necunoscut — este un arhitect al obsesiei.</motion.p><motion.div className="literary-chips" initial={{ opacity: 0 }} animate={featureInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.42 }}>{["villain romance","psychological tension","remote estate","literary prose","slow burn"].map((chip) => <span key={chip}>{chip}</span>)}</motion.div><motion.div className="book-quotes" initial={{ opacity: 0 }} animate={featureInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.52 }}><p>„Nu voiam să plec. Nu voiam să rămân. Voiam să fiu văzută.”</p><p>„Conacul era o capcană frumoasă. El era lacătul.”</p><p>„Iubirea lui era ca marea iarna — rece, inevitabilă, perfectă.”</p></motion.div><motion.div className="books-actions" initial={{ opacity: 0 }} animate={featureInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.62 }}><a className="button primary" href="https://www.amazon.co.uk/dp/B0GXSLHRNY" target="_blank" rel="sponsored noopener noreferrer">Citește pe Amazon <ArrowRight size={18} /></a><a className="button ghost" href={goodreads} target="_blank" rel="noopener noreferrer">Goodreads</a></motion.div></div>
          <motion.figure className="cinematic-trailer-card" style={{ scale: featureScale }}><video autoPlay muted loop playsInline><source src="/assets/books-cinematic/hallway.mp4" type="video/mp4" /></video><span className="trailer-badge">▶ Trailer</span><div className="card-shimmer" aria-hidden="true" /><figcaption><strong>Unreachable</strong><small>Aura Dobre · Dark Romance</small></figcaption></motion.figure>
        </div>
      </section>

      <section className="cinematic-quote">
        <video autoPlay muted loop playsInline><source src="/assets/books-cinematic/atmosphere.mp4" type="video/mp4" /></video>
        <blockquote data-reveal>„O carte de Aura Dobre nu se uită ușor. Intră în lume ca o lumină rece și rămâne acolo.”</blockquote>
      </section>

      <section className="cinematic-library">
        <div className="cinematic-library-head" data-reveal><p className="section-kicker">03 — Biblioteca</p><h2>Cărțile scrise de mine</h2><p>Amazon le listează ca titluri publicate; aici le prezint ca lumi vizuale, cu atmosferă, tensiune și storytelling.</p></div>
        <div className="cinematic-published-grid">{publishedBooks.map((book) => <article className="cinematic-published-card" data-reveal key={book.title}><div className="book-card-shine" /><img src={book.image} alt={`Coperta ${book.title}`} /><div><span>{book.meta}</span><h3>{book.title}</h3><p>{book.copy}</p><a href={book.link} target="_blank" rel="sponsored noopener noreferrer">Vezi pe Amazon <ArrowRight size={15} /></a></div></article>)}</div>
        <div className="cinematic-coming-label" data-reveal>Ce urmează</div>
        <div className="cinematic-coming-grid">
          <article className="cinematic-upcoming-card" data-reveal><img src="/assets/books-cinematic/echoes-of-eternity.png" alt="Coperta Echoes of Eternity" /><div><span>Coming soon</span><h3>Echoes of Eternity</h3><p>O promisiune editorială construită în aceeași atmosferă: umbre, memorie, dorință și destin.</p></div></article>
          <article className="abstract-story-card" data-reveal><video autoPlay muted loop playsInline><source src="/assets/books-cinematic/book-pages.mp4" type="video/mp4" /></video>{["obsesie","putere","frică","control","dorință","umbră"].map((word, index) => <span className={`scattered-word word-${index + 1}`} key={word}>{word}</span>)}<div><span>Abstract storytelling</span><h3>Nescrisă</h3><p>Un spațiu vizual pentru următoarea lume: pagini, cerneală și tensiune înainte să devină capitol.</p></div></article>
        </div>
      </section>

      <section className="cinematic-reader" data-reveal><p className="section-kicker">04 — Cititoarea mea</p><h2>Pentru cine sunt cărțile mele</h2><p>Pentru cititoarea care iubește intensitatea — care vrea să simtă tensiunea de pe fiecare pagină, care nu se teme de eroi moralmente gri și care citește la 3 dimineața pentru că nu poate lăsa cartea jos.</p><div className="literary-chips">{chips.map((chip) => <span key={chip}>{chip}</span>)}</div></section>

      <section className="cinematic-author" id="despre" ref={authorRef}>
        <motion.div className="cinematic-author-bg" style={{ y: authorBgY }}><video autoPlay muted loop playsInline><source src="/assets/books-cinematic/book-pages.mp4" type="video/mp4" /></video></motion.div>
        <div><motion.p className="section-kicker" initial={{ opacity: 0 }} animate={authorInView ? { opacity: 1 } : {}} transition={{ duration: 0.8 }}>05 — Autoarea</motion.p><motion.h2 initial={{ opacity: 0, x: -28 }} animate={authorInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>În spatele poveștilor</motion.h2><motion.div initial={{ opacity: 0 }} animate={authorInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.35 }}><p>Aura Dobre scrie ficțiune care se citește ca un film — cu personaje care te urmăresc mult timp după ce ai închis cartea. Îmi construiesc lumile din psihologie, tensiune, atmosferă și detalii vizuale care rămân în memorie.</p><p>În paralel cu scrisul, creez identități vizuale și experiențe digitale; de aceea pagina aceasta nu este doar o listă de linkuri, ci o vitrină cinematică pentru universurile mele.</p></motion.div><motion.div className="books-actions" initial={{ opacity: 0 }} animate={authorInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.5 }}><a className="button primary" href="mailto:auraleodobre@gmail.com?subject=Newsletter%20Aura%20Dobre">Newsletter</a><a className="button ghost" href="/" onClick={(event) => onNavigate(event, "/")}>Studio Digital</a></motion.div></div>
      </section>

      <motion.section className="cinematic-final" ref={finalRef} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}><motion.div className="cinematic-final-orb" style={{ scale: finalScale }} /><p className="section-kicker">06 — Finale</p><h2>Hai să intri <em>în poveste.</em></h2><p>O carte de Aura Dobre nu se uită ușor. Amazon îți arată titlurile, Goodreads îți arată reacțiile, iar această pagină îți arată intenția: lumi în care să vrei să rămâi.</p><div className="books-actions"><a className="button primary" href={authorAmazon} target="_blank" rel="noopener noreferrer">Cărți pe Amazon <ArrowRight size={18} /></a><a className="button ghost" href="https://aurasdigitaldream.gumroad.com/" target="_blank" rel="noopener noreferrer">Cărțile mele pe Gumroad</a></div></motion.section>
      <footer><div className="footer-brand"><img src="/assets/logo.jpg" alt="Aura's Digital Dream" /><div><strong>Aura Dobre</strong><p>Cărți, lumi vizuale și povești cinematice.</p></div></div><p>© 2026 Aura Dobre. Toate drepturile rezervate.</p></footer>
    </main>
  );
}

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  useScrollExperience(currentPath);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [testimonial, setTestimonial] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("idle");
  const groupedProjects = useMemo(() => portfolioGroups.map((group) => ({
    ...group,
    projects: group.slugs.map((slug) => projects.find((project) => project.slug === slug)).filter(Boolean),
  })), []);
  const selectedPriceItems = priceItems.filter((item) => selectedPrices.includes(item.title));
  const total = selectedPriceItems.reduce((sum, item) => sum + item.price, 0);
  const totalMax = selectedPriceItems.reduce((sum, item) => sum + (item.maxPrice || item.price), 0);
  const nav = [["Servicii", "servicii"], ["Portofoliu", "portofoliu"], ["Cărțile mele", "/cartile-mele"], ["Prețuri", "estimator"], ["Contact", "contact"]];
  const featured = projects.filter((project) => featuredSlugs.includes(project.slug));
  const detailSlug = currentPath.match(/^\/portofoliu\/([^/]+)\/?$/)?.[1];
  const detailProject = projects.find((project) => project.slug === detailSlug);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (currentPath !== "/" || !window.location.hash) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    scheduleScrollToId(id);
  }, [currentPath]);

  function navigateTo(event, path) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const update = () => {
      window.history.pushState({}, "", path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    if (document.startViewTransition) document.startViewTransition(update);
    else update();
  }

  function goToSection(event, id) {
    event?.preventDefault();
    const revealSection = () => {
      window.history.pushState({}, "", `/#${id}`);
      setCurrentPath("/");
      scheduleScrollToId(id);
    };
    if (currentPath !== "/" && document.startViewTransition) document.startViewTransition(revealSection);
    else revealSection();
  }

  if (detailProject && projectDetails[detailSlug]) {
    return <ProjectDetail project={detailProject} details={projectDetails[detailSlug]} onNavigate={navigateTo} onSection={goToSection} />;
  }

  if (currentPath === "/cartile-mele") {
    return <BooksPageCinematic onNavigate={navigateTo} onSection={goToSection} />;
  }

  function togglePrice(title) {
    setSelectedPrices((current) => current.includes(title) ? current.filter((itemTitle) => itemTitle !== title) : [...current, title]);
  }

  function contactMessage(form) {
    const data = new FormData(form);
    return `Nume: ${data.get("name")}\nEmail: ${data.get("email")}\nTelefon: ${data.get("phone") || "nespecificat"}\nServiciu: ${data.get("service") || "nespecificat"}\n\n${data.get("message")}`;
  }

  async function submitContact(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return;
    setFormStatus("sending");
    const payload = Object.fromEntries(data.entries());
    try {
      const response = await fetch("https://formsubmit.co/ajax/aurastrendvault@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          service: payload.service,
          message: payload.message,
          _subject: `Cerere nouă Aura's Digital Dream — ${payload.service || "proiect digital"}`,
          _template: "table",
          _replyto: payload.email,
          _honey: payload.website,
        }),
      });
      if (!response.ok) throw new Error("Delivery failed");
      setFormStatus("success");
      form.reset();
    } catch {
      setFormStatus("error");
    }
  }

  function submitWhatsapp() {
    const form = document.getElementById("contact-form");
    if (!form?.reportValidity()) return;
    const data = new FormData(form);
    if (data.get("website")) return;
    window.open(`https://wa.me/40762509423?text=${encodeURIComponent(`Bună, Aura!\n\n${contactMessage(form)}`)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main><div className="scroll-progress" aria-hidden="true" /><div className="custom-cursor" aria-hidden="true" /><div className="custom-cursor-ring" aria-hidden="true" />
      <header className="site-header">
        <button className="brand" onClick={(event) => goToSection(event, "acasa")}><img src="/assets/logo.jpg" alt="Aura's Digital Dream" /><span>Aura's <em>Digital</em> Dream</span></button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Deschide meniul">{menuOpen ? <X /> : <List />}</button>
        <nav className={menuOpen ? "open" : ""}>{nav.map(([label, id]) => <button key={id} onClick={(event) => { id.startsWith("/") ? navigateTo(event, id) : goToSection(event, id); setMenuOpen(false); }}>{label}</button>)}</nav>
      </header>

      <section className="hero" id="acasa">
        <div className="hero-motion" data-parallax="0.12">
          <img className="hero-image hero-image-base" src="/assets/hero.png" alt="Floare digitală abstractă în mișcare" />
          <img className="hero-image hero-image-liquid" src="/assets/hero.png" alt="" aria-hidden="true" />
          <div className="hero-light" aria-hidden="true" />
        </div>
        <svg className="hero-filters" aria-hidden="true"><filter id="hero-liquid"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves="2" seed="7" result="noise"><animate attributeName="baseFrequency" dur="14s" values="0.006 0.012;0.011 0.007;0.006 0.012" repeatCount="indefinite" /></feTurbulence><feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="B"><animate attributeName="scale" dur="10s" values="10;28;10" repeatCount="indefinite" /></feDisplacementMap></filter></svg>
        <div className="hero-overlay" />
        <div className="hero-content" data-reveal>
          <p className="eyebrow">Marketing · Design · Soluții Digitale</p>
          <h1>Aura's <em>Digital</em><br />Dream</h1>
          <p className="hero-copy">Marketing, design și web pentru branduri care vor să crească vizibil, rapid și profesionist.</p>
          <div className="hero-actions"><button className="button primary" onClick={() => scrollToId("contact")}>Hai să lucrăm împreună</button><button className="button ghost" onClick={() => scrollToId("portofoliu")}>Vezi portofoliul</button><a className="button ghost" href="https://wa.me/40762509423">Scrie-mi pe WhatsApp</a></div>
        </div>
        <button className="scroll-mark" onClick={() => scrollToId("despre")} aria-label="Derulează la secțiunea despre"><span /></button>
      </section>

      <div className="story-marquee" aria-hidden="true"><div>STRATEGIE <i>✦</i> IDENTITATE <i>✦</i> EXPERIENȚE DIGITALE <i>✦</i> STORYTELLING <i>✦</i> STRATEGIE <i>✦</i> IDENTITATE <i>✦</i></div></div>

      <section className="section about" id="despre" data-reveal>
        <div><p className="section-kicker">Despre mine</p><h2>Marketing, design și soluții digitale, <em>cu suflet.</em></h2></div>
        <div className="about-copy"><p>Sunt un specialist în marketing digital care crede că fiecare proiect merită atenție la detalii și o viziune clară. Lucrez atât cu companii, cât și cu antreprenori independenți, oferind soluții complete — de la strategie și branding, până la dezvoltare web și documente profesionale.</p><p>Fiecare brand are o poveste unică. Misiunea mea este să transform acea poveste într-o prezență digitală care inspiră încredere, atrage clienți și construiește relații pe termen lung.</p></div>
      </section>

      <section className="story-section" data-scroll-story aria-label="Povestea procesului creativ">
        <div className="story-stage">
          <div className="story-visuals" aria-hidden="true">
            <figure className="story-image story-cutout scene-one"><img src="/portfolio/lumina-botanica/8be8eec80_generated_image.png" alt="" /></figure>
            <figure className="story-image story-cutout scene-two"><img src="/portfolio/auras-trend-vault/84ce9f083_WhatsAppImage2026-07-01at120708.jpg" alt="" /></figure>
            <figure className="story-image story-cutout scene-three"><img src="/portfolio/campanie-social-media-luxe/150a726d7_generated_image.png" alt="" /></figure>
            <div className="story-sculpture">
              <span className="petal p1" /><span className="petal p2" /><span className="petal p3" /><span className="petal p4" /><span className="petal p5" /><span className="petal p6" />
              <i className="orbit o1" /><i className="orbit o2" /><i className="orbit o3" /><b className="sculpture-core" />
            </div>
            <div className="story-glow" />
          </div>
          <div className="story-copy">
            <p className="section-kicker">Din idee în experiență</p>
            <article className="scene-one"><span>01 / Ascult</span><h2>Povestea ta devine <em>punctul de plecare.</em></h2><p>Descopăr esența brandului, publicul și emoția care trebuie să rămână.</p></article>
            <article className="scene-two"><span>02 / Imaginez</span><h2>Ideile capătă <em>formă și profunzime.</em></h2><p>Culoarea, cuvintele și mișcarea construiesc o identitate recognoscibilă.</p></article>
            <article className="scene-three"><span>03 / Construiesc</span><h2>Totul devine o <em>experiență vie.</em></h2><p>Fiecare interacțiune conduce publicul de la curiozitate la încredere și acțiune.</p></article>
            <div className="story-counter"><b>0<span /></b><i /><small>03</small></div>
          </div>
        </div>
      </section>

      <section className="section dark" id="servicii">
        <p className="section-kicker">Servicii</p><h2>Tot ce ai nevoie, <em>sub un singur acoperiș.</em></h2><p className="section-lead">De la strategie la execuție, fiecare serviciu este gândit pentru a-ți aduce rezultate reale.</p>
        <div className="service-grid">{services.map(({ icon: Icon, title, subtitle, copy, list, benefits, price }) => <article className="service-card" data-reveal key={title}><Icon size={32} weight="light" /><h3>{title}</h3><strong className="service-subtitle">{subtitle}</strong><p>{copy}</p><div className="service-list-block"><span>Ce primești</span><ul>{list.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></div><div className="service-list-block benefits"><span>Beneficii</span><ul>{benefits.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></div><div className="service-price"><span>Investiție orientativă</span><strong>{price}</strong></div></article>)}</div>
        <div className="document-template-showcase" data-reveal>
          <div>
            <p className="section-kicker">Documente premium</p>
            <h3>Template-uri profesionale, adaptate pentru afacerea sau proiectul tău.</h3>
            <p>Pot construi documente cu structură clară, estetică premium și logică de prezentare — nu doar fișiere frumoase, ci materiale care se pot trimite către clienți, instituții, colaboratori sau echipe tehnice.</p>
          </div>
          <div className="document-template-grid">
            {documentTemplates.map((item) => <article key={item.title}><span>{item.label}</span><h4>{item.title}</h4><p>{item.copy}</p></article>)}
          </div>
        </div>
      </section>

      <section className="section estimator" id="estimator">
        <p className="section-kicker">Estimator de cost</p><h2>Estimează-ți <em>bugetul.</em></h2><p className="section-lead">Selectează serviciile de care ai nevoie și primește o estimare instantanee. Toate prețurile sunt sugestive, afișate „de la” și pot varia în funcție de complexitate, volum și termenul de livrare.</p>
        <div className="estimator-grid"><div className="price-list">{priceItems.map((item) => <button className={selectedPrices.includes(item.title) ? "selected" : ""} key={item.title} onClick={() => togglePrice(item.title)}><span className="price-check"><Check size={18} /></span><span><b>{item.title}</b><small>{item.copy}</small></span><strong>{item.price.toLocaleString("ro-RO")} – {(item.maxPrice || item.price).toLocaleString("ro-RO")} RON {item.unit && <em>{item.unit}</em>}</strong></button>)}</div><aside className="summary"><span className="summary-label">Estimare orientativă</span><h3>Sumar estimare</h3><p>{selectedPrices.length ? `${selectedPrices.length} servicii selectate` : "Selectează serviciile dorite."}</p><div><span>Total estimativ</span><strong>{total.toLocaleString("ro-RO")} – {totalMax.toLocaleString("ro-RO")} RON</strong></div><small className="estimate-note">Sumele sunt sugestive pentru Ialomița / România 2026. Oferta finală se stabilește după brief, în funcție de complexitate, număr de pagini sau livrabile, urgență și revizii. Domeniul, hostingul, tiparul și serviciile recurente se calculează separat.</small><a className="button primary" href={`https://wa.me/40762509423?text=${encodeURIComponent(`Salut! Aș dori o ofertă personalizată. Total estimativ: ${total} - ${totalMax} RON`)}`}><WhatsappLogo size={20} /> Cere ofertă</a></aside></div>
      </section>

      <section className="creative-services" aria-label="Servicii de creație digitală">
        <div className="creative-services-copy" data-reveal><p className="section-kicker">Portofoliu de servicii</p><h2>De la o idee vizuală la un univers <em>coerent.</em></h2><p>Fiecare material este gândit ca parte din aceeași poveste — nu ca o piesă izolată.</p><div className="service-pill-list">{["Artă digitală", "Postere", "Broșuri", "Invitații", "Moodboard-uri", "Coperte"].map((item, index) => <span style={{ "--pill-delay": `${index * 90}ms` }} key={item}>{item}</span>)}</div></div>
        <figure className="creative-services-visual" data-reveal data-parallax="0.035"><img src="/assets/editorial/creative-services-clean.jpg" alt="Selecție de servicii creative și lucrare pentru ADI ECOO" /><span aria-hidden="true">06 / DIRECȚII CREATIVE</span></figure>
      </section>

      <section className="section skills" id="skills">
        <p className="section-kicker">Skills & Competențe</p><h2>Instrumente <em>stăpânite.</em></h2>
        <div className="skill-columns">{[
          ["Design & Creație", [["Canva (avansat)",98],["Editare foto",80],["Design Thinking",88]]],
          ["Web & Tehnic", [["Wix",95],["WebWave",90],["Dezvoltare aplicații web",78],["SEO de bază",82]]],
          ["Marketing & AI", [["Meta Business Suite",92],["Copywriting",95],["AI avansat (prompting)",96]]],
        ].map(([title, rows]) => <div className="skill-card" key={title}><h3>{title}</h3>{rows.map(([name, value]) => <div className="skill" key={name}><div><span>{name}</span><b>{value}%</b></div><div className="bar"><i style={{ width: `${value}%` }} /></div></div>)}</div>)}</div>
      </section>

      <section className="golden-interlude" aria-label="Artă digitală și storytelling vizual">
        <div className="golden-image" data-parallax="0.075"><img className="golden-backdrop" src="/assets/editorial/golden-portrait-clean.jpg" alt="" aria-hidden="true" /><img className="golden-subject" src="/assets/editorial/golden-portrait-clean.jpg" alt="Portret artistic în tonuri aurii" /></div>
        <div className="golden-shade" aria-hidden="true" />
        <div className="golden-copy" data-reveal><p className="section-kicker">Artă care oprește scroll-ul</p><h2>Imaginea devine <em>atmosferă.</em></h2><p>Compoziții digitale construite pentru campanii, postere și povești vizuale cu personalitate.</p><button className="text-button" onClick={(event) => goToSection(event, "portofoliu")}>Descoperă selecția <ArrowRight size={20} /></button></div>
        <span className="golden-number" aria-hidden="true">ART / 01</span>
      </section>

      <section className="section portfolio" id="portofoliu">
        <div className="portfolio-heading"><div><p className="section-kicker">Selecție curatorială</p><h2>Proiecte care spun o <em>poveste.</em></h2></div><p>O selecție de identități, experiențe web și campanii în care strategia și estetica lucrează împreună.</p></div>
        <div className="featured-projects">{featured.map((project, index) => <a className="featured-project" data-reveal data-parallax={index % 2 ? "0.025" : "-0.02"} href={`/portofoliu/${project.slug}`} onClick={(event) => navigateTo(event, `/portofoliu/${project.slug}`)} key={project.slug}><div className="featured-visual"><img src={featuredCardAssets[project.slug] || detailHeroAssets[project.slug] || project.image} alt={project.title} /><span className="featured-index">0{index + 1}</span><span className="featured-open">Descoperă proiectul <ArrowRight size={18} /></span></div><div className="featured-copy"><div className="tags">{project.category.map((tag) => <span key={tag}>{tag}</span>)}</div><h3>{project.title}</h3><p>{project.description}</p><span className="text-link">Vezi studiul de caz <ArrowRight size={17} /></span></div></a>)}</div>
        <div className="archive-head"><div><p className="section-kicker">Portofoliu organizat</p><h2>Alege direcția care se potrivește <em>brandului tău.</em></h2></div><span>{projects.length.toString().padStart(2, "0")} proiecte</span></div>
        <div className="portfolio-groups">
          {groupedProjects.map((group) => <section className="portfolio-group" data-reveal key={group.title}>
            <div className="portfolio-group-head"><span>{group.title}</span><p>{group.copy}</p></div>
            <div className="project-grid compact">
              {group.projects.map((project) => <a className="project-card" data-reveal href={`/portofoliu/${project.slug}`} onClick={(event) => navigateTo(event, `/portofoliu/${project.slug}`)} key={project.slug}><div className="project-image"><img src={project.image} alt={project.title} /><div className="project-hover"><span>Vezi proiectul</span><ArrowRight size={22} /></div></div><div className="tags">{project.category.map((tag) => <span key={tag}>{tag}</span>)}</div><h3>{project.title}</h3><p>{project.description}</p></a>)}
            </div>
          </section>)}
        </div>
      </section>

      <section className="creative-direction">
        <div className="creative-direction-copy" data-reveal><p className="section-kicker">Creative Direction</p><h2>O privire de ansamblu asupra <em>lumii vizuale.</em></h2><p>Branding, artă digitală, campanii și materiale editoriale reunite într-o compoziție care arată amplitudinea portofoliului.</p><a className="button ink" href="/portofoliu/arta-digitala-materiale-grafice" onClick={(event) => navigateTo(event, "/portofoliu/arta-digitala-materiale-grafice")}>Vezi proiectul de artă digitală <ArrowRight size={18} /></a></div>
        <figure className="creative-collage" data-reveal data-parallax="-0.035"><div className="collage-halo" aria-hidden="true" /><img className="collage-piece collage-main" src="/portfolio/auras-trend-vault/84ce9f083_WhatsAppImage2026-07-01at120708.jpg" alt="Portret editorial Aura's Trend Vault" /><img className="collage-piece collage-adi" src="/portfolio/adi-ecoo-2009-sa/1269c6c20_bannerorizontalv2.png" alt="Campanie vizuală ADI ECOO" /><img className="collage-piece collage-invite" src="/portfolio/invitatii-nunti-botezuri-evenimente/766c6c8d9_generated_image.png" alt="Invitație pentru botezul lui Theodore" /><img className="collage-piece collage-detail" src="/portfolio/luxury-hair-by-aura/7c76798b9_WhatsAppImage2026-07-02at1127331.jpg" alt="Detaliu vizual dintr-un proiect de branding" /><span className="collage-caption">Selected works · Aura's Digital Dream</span></figure>
      </section>

      <section className="behind" id="behind">
        <div className="behind-portrait" data-reveal data-parallax="0.035"><div className="portrait-frame portrait-video"><video autoPlay muted loop playsInline preload="metadata" aria-label="Aura Dobre — showreel personal"><source src="/video/aura-creative-showreel.mp4" type="video/mp4" /></video><span className="portrait-film-label" aria-hidden="true">MOTION PORTRAIT / 01</span></div><span className="portrait-orbit" aria-hidden="true">STRATEGIE · CREATIVITATE · EMPATIE ·</span></div>
        <div className="behind-copy" data-reveal><p className="section-kicker">Behind the Dream</p><h2>Un studio digital cu o perspectivă <em>personală.</em></h2><p>În spatele fiecărui proiect sunt eu, Aura. Îmi place să unesc gândirea strategică, sensibilitatea vizuală și tehnologia, astfel încât fiecare brand să se simtă autentic — nu construit după un șablon.</p><p>Ascult înainte să desenez, caut ideea care merită păstrată și construiesc fiecare experiență cu grijă pentru detalii, ritm și emoție.</p><button className="button ink" onClick={() => scrollToId("contact")}>Povestește-mi ideea ta <ArrowRight size={18} /></button></div>
      </section>

      <section className="amazon-world amazon-teaser" id="amazon-picks">
        <div className="amazon-world-glow" aria-hidden="true" />
        <div className="amazon-world-copy" data-reveal>
          <p className="section-kicker">Aura Dobre · Author Universe</p>
          <h2>Cărțile mele au acum <em>pagina lor.</em></h2>
          <p>Am separat vitrina literară într-o pagină dedicată, unde cărțile scrise de mine pot respira ca lumi vizuale: cu atmosferă, tensiune, coperți și storytelling.</p>
          <div className="literary-chips" aria-label="Genuri literare">
            {["dark romance", "thriller psihologic", "ficțiune cinematică"].map((chip) => <span key={chip}>{chip}</span>)}
          </div>
          <div className="books-actions">
            <a className="button primary" href="/cartile-mele" onClick={(event) => navigateTo(event, "/cartile-mele")}>Vezi pagina cărților <ArrowRight size={18} /></a>
            <a className="button ghost" href="https://www.amazon.com/stores/Aura-Dobre/author/B0DSJP6MX8?ref=ap_rdr&shoppingPortalEnabled=true&ccs_id=26b0d51d-d6bb-476b-bde1-e053aa0e05fb" target="_blank" rel="noopener noreferrer">Amazon Author Page</a>
          </div>
        </div>
        <div className="author-mini-stack" data-reveal data-parallax="0.025" aria-label="Coperțile cărților Aura Dobre">
          <img src="/assets/amazon/clockmakers-curse.jpg" alt="Coperta The Clockmaker's Curse" />
          <img src="/assets/amazon/unreachable.jpg" alt="Coperta Unreachable de Aura Dobre" />
          <img src="/assets/amazon/lunaria-secret-treasure.jpg" alt="Coperta Lunaria's Secret Treasure" />
        </div>
      </section>
      <section className="section dark" id="proces">
        <p className="section-kicker">Proces de lucru</p><h2>De la idee, <em>la realitate.</em></h2>
        <div className="process-grid">{[["01","Descoperire","Înțeleg obiectivele tale, publicul și provocările brandului."],["02","Strategie","Construiesc direcția creativă și planul de comunicare."],["03","Creație","Transform strategia în identitate vizuală, website sau materiale."],["04","Optimizare","Lansăm proiectul și îl ajustăm pentru rezultate maxime."]].map(([nr,title,copy]) => <article key={nr}><span>{nr}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className="section why-me" id="de-ce-eu">
        <div className="why-me-card" data-reveal>
          <p className="section-kicker">Încredere & direcție</p>
          <h2>De ce să lucrezi <em>cu mine</em></h2>
          <div className="why-me-copy">
            <p>Sunt specialist în marketing digital, design și web, cu peste 15 proiecte finalizate în branding, campanii, website-uri și documente profesionale.</p>
            <p>Lucrez cu antreprenori și companii care vor rezultate reale, nu doar vizibilitate.</p>
            <p>Fiecare proiect este construit cu atenție la detalii, strategie clară și o estetică premium care diferențiază brandul tău.</p>
          </div>
        </div>
      </section>

      <section className="section testimonials">
        <p className="section-kicker">Testimoniale</p><h2>Ce spun <em>clienții.</em></h2>
        <div className="quote"><span className="quote-type">{testimonials[testimonial].type}</span><p>„{testimonials[testimonial].quote}”</p><div className="quote-author"><span className="quote-avatar">{testimonials[testimonial].initials}</span><div><strong>{testimonials[testimonial].name}</strong><span>{testimonials[testimonial].role}</span></div></div><div className="quote-controls"><button onClick={() => setTestimonial((testimonial + testimonials.length - 1) % testimonials.length)} aria-label="Anterior"><CaretLeft /></button><button onClick={() => setTestimonial((testimonial + 1) % testimonials.length)} aria-label="Următor"><CaretRight /></button></div></div>
      </section>

      <section className="section contact" id="contact">
        <div><p className="section-kicker">Contact</p><h2>Hai să lucrăm <em>împreună.</em></h2><p>Ai un proiect în minte? Scrie-mi și găsim împreună cea mai bună soluție. Răspund în maximum 24 de ore.</p><a href="https://wa.me/40762509423"><WhatsappLogo size={22} /><span><b>Scrie-mi pe WhatsApp</b><small>Răspuns rapid, oricând</small></span></a><a href="tel:+40762509423"><Phone size={22} /><span><b>Sună-mă direct</b><small>+40 762 509 423</small></span></a></div>
        <form id="contact-form" onSubmit={submitContact} data-reveal><input className="honeypot" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" /><div className="form-row"><input required name="name" maxLength="80" autoComplete="name" placeholder="Numele tău" /><input required name="email" maxLength="120" type="email" autoComplete="email" placeholder="Email" /></div><input name="phone" maxLength="30" inputMode="tel" autoComplete="tel" placeholder="Telefon" /><select name="service" defaultValue=""><option value="" disabled>Alege pachetul potrivit</option><option>Pachet Start-up</option><option>Pachet Rebranding</option><option>Pachet Website</option><option>Pachet Social Media</option><option>Pachet Documente Profesionale</option><option>Nu sunt sigură încă</option></select><textarea required name="message" minLength="15" maxLength="2000" placeholder="Descrie pe scurt proiectul tău..." /><div className="form-actions"><button className="button primary" type="submit" disabled={formStatus === "sending"}>{formStatus === "sending" ? "Se trimite..." : "Trimite pe email"} <ArrowRight size={18} /></button><button className="button whatsapp" type="button" onClick={submitWhatsapp}><WhatsappLogo size={20} /> Trimite pe WhatsApp</button></div>{formStatus === "success" && <p className="form-notice success" role="status">Mesajul a fost trimis. Îți voi răspunde în maximum 24 de ore.</p>}{formStatus === "error" && <p className="form-notice error" role="alert">Trimiterea nu a reușit. Te rog folosește butonul WhatsApp.</p>}<small className="privacy-note">Prin trimitere ești de acord ca datele să fie procesate de FormSubmit exclusiv pentru livrarea mesajului către mine.</small></form>
      </section>

      <footer><div className="footer-brand"><img src="/assets/logo.jpg" alt="Aura's Digital Dream" /><div><strong>Aura's Digital Dream</strong><p>Marketing, design și soluții digitale, cu suflet.</p></div></div><div className="social"><a href="https://www.instagram.com/aurasdigitaldream" aria-label="Instagram"><InstagramLogo /></a><a href="https://www.linkedin.com/in/aurelia-dobre-a033b2104" aria-label="LinkedIn"><LinkedinLogo /></a><a href="https://wa.me/40762509423" aria-label="WhatsApp"><WhatsappLogo /></a></div><p>© 2026 Aura's Digital Dream. Toate drepturile rezervate.</p></footer>
      <a className="floating-whatsapp" href="https://wa.me/40762509423" aria-label="Scrie-mi pe WhatsApp"><WhatsappLogo size={28} weight="fill" /></a>
    </main>
  );
}
