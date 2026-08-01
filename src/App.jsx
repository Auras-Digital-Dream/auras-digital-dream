import { useEffect, useMemo, useState } from "react";
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
  "verde-bean": ["/portfolio/verde-bean/verde-bean-coffee-flatlay.jpeg"],
};
const detailHeroAssets = {
  "verde-bean": "/portfolio/verde-bean/1e4525e49_WhatsAppImage2026-07-02at090649.jpeg",
  "lumina-botanica": "/portfolio/lumina-botanica/20c5ceaff_WhatsAppImage2026-07-02at090233.jpg",
  "lupul-and-brici": "/portfolio/lupul-and-brici/2f028c963_generated_image.png",
  "luxury-hair-by-aura": "/portfolio/luxury-hair-by-aura/7c76798b9_WhatsAppImage2026-07-02at1127331.jpg",
  "real-estate-co": "/portfolio/real-estate-co/ae9c7cdde_realestate.png",
  "carti-de-vizita": "/portfolio/carti-de-vizita/3cd5b72d3_adiecoo1.png",
  "adi-ecoo-2009-sa": "/portfolio/adi-ecoo-2009-sa/71bf13109_IMG-20250618-WA0053.jpg",
  "campanie-social-media-luxe": "/portfolio/campanie-social-media-luxe/65714e254_generated_image.png",
  "auras-trend-vault": "/portfolio/auras-trend-vault/84ce9f083_WhatsAppImage2026-07-01at120708.jpg",
  "magazine-online-e-commerce": "/portfolio/magazine-online-e-commerce/21dc16065_WhatsAppImage2026-07-02at090809.jpg",
  "invitatii-nunti-botezuri-evenimente": "/portfolio/invitatii-nunti-botezuri-evenimente/766c6c8d9_generated_image.png",
  "documente-corporatiste-licenta": "/portfolio/documente-corporatiste-licenta/2e1da68ae_generated_image.png",
  "arta-digitala-materiale-grafice": "/portfolio/arta-digitala-materiale-grafice/a847754e3_WhatsAppImage2026-07-02at1140104.jpg",
  "logo-design": "/portfolio/logo-design/3caeb0cc1_Untitled-design.png",
};

const projects = [
  { slug: "verde-bean", title: "Verde Bean — Identitate de Brand", category: ["Branding"], image: "/assets/verde-bean.jpeg", description: "Identitate vizuală completă pentru un brand de cafea specialty sustenabil." },
  { slug: "lumina-botanica", title: "Lumina Botanica — Identitate de Brand", category: ["Branding"], image: "/portfolio/lumina-botanica/20c5ceaff_WhatsAppImage2026-07-02at090233.jpg", description: "Branding premium pentru o linie de produse cosmetice organice și botanice." },
  { slug: "lupul-and-brici", title: "Lupul & Brici — Identitate de Brand", category: ["Branding", "Web"], image: "/assets/lupul-brici.png", description: "Identitate vizuală pentru un brand de îngrijire masculină, cu website de prezentare inclus." },
  { slug: "luxury-hair-by-aura", title: "Luxury Hair by Aura — Identitate de Brand", category: ["Branding"], image: "/assets/luxury-hair.png", description: "Identitate vizuală premium pentru un salon de extensii de păr din Slobozia." },
  { slug: "real-estate-co", title: "Real Estate Co. — Identitate de Brand & Website", category: ["Branding", "Web"], image: "/portfolio/real-estate-co/ae9c7cdde_realestate.png", description: "Identitate vizuală completă, materiale print și website pentru o agenție imobiliară din Anglia." },
  { slug: "carti-de-vizita", title: "Cărți de Vizită — Design Corporate & Personal", category: ["Branding"], image: "/portfolio/carti-de-vizita/3cd5b72d3_adiecoo1.png", description: "Cărți de vizită digitale cu cod QR și print, create într-un stil modern și memorabil." },
  { slug: "adi-ecoo-2009-sa", title: "ADI ECOO 2009 S.A. — Branding, Grafică, Social Media & Website", category: ["Marketing", "Branding", "Web"], image: "/portfolio/adi-ecoo-2009-sa/71bf13109_IMG-20250618-WA0053.jpg", description: "Proiect complet de comunicare pentru colectarea corectă a deșeurilor în județul Ialomița." },
  { slug: "campanie-social-media-luxe", title: "Campanie Social Media — Bijuterii de Lux", category: ["Marketing"], image: "/assets/bijuterii.png", description: "Campanie editorială pentru o maison de bijuterii fine, cu fotografie și storytelling premium." },
  { slug: "auras-trend-vault", title: "Aura's Trend Vault — Platformă Web, Blog, AI & Fotografie Editorială", category: ["Web"], image: "/assets/trend-vault.jpg", description: "Platformă web completă, blog editorial și experiențe AI create de la zero." },
  { slug: "magazine-online-e-commerce", title: "Magazine Online E-Commerce — Web Design, Dezvoltare & Fotografie", category: ["Web"], image: "/assets/ecommerce.jpg", description: "Magazine online complete, cu design, plăți, curieri, fotografie de produs și optimizare SEO." },
  { slug: "invitatii-nunti-botezuri-evenimente", title: "Invitații Nunți, Botezuri & Evenimente", category: ["Grafică"], image: "/assets/invitatii.png", description: "Invitații premium personalizate, cu accente botanice, caligrafie și finisaje rafinate." },
  { slug: "documente-corporatiste-licenta", title: "Documente Corporatiste & Lucrare de Licență", category: ["Documente"], image: "/assets/documente.png", description: "Rapoarte, broșuri, prezentări și documente academice cu structură clară și design profesionist." },
  { slug: "arta-digitala-materiale-grafice", title: "Artă Digitală & Materiale Grafice", category: ["Grafică"], image: "/portfolio/arta-digitala-materiale-grafice/a847754e3_WhatsAppImage2026-07-02at1140104.jpg", description: "Ilustrații, postere, compoziții abstracte și materiale grafice create într-o direcție contemporană." },
  { slug: "logo-design", title: "Logo Design — Identități Vizuale de Brand", category: ["Logo Design"], image: "/portfolio/logo-design/3caeb0cc1_Untitled-design.png", description: "Colecție de logo-uri profesionale — de la monograme elegante la embleme corporate și sigle de lux." },
];

const featuredSlugs = ["auras-trend-vault", "verde-bean", "real-estate-co", "campanie-social-media-luxe"];

const services = [
  { icon: Megaphone, title: "Marketing & Strategie Digitală", copy: "Strategii care transformă vizibilitatea în rezultate concrete.", list: ["Consultanță și strategie", "Social media & content", "Meta / Google Ads", "Branding & poziționare"] },
  { icon: Code, title: "Web & Aplicații", copy: "Prezență online profesională, construită pe fundații solide.", list: ["Site-uri de prezentare", "Landing pages", "Aplicații web", "Optimizare & SEO"] },
  { icon: Palette, title: "Identitate Vizuală & Grafică", copy: "Design care comunică valori, nu doar culori.", list: ["Logo & identitate de brand", "Afișe și bannere", "Materiale social media", "Flyere și broșuri"] },
  { icon: FileText, title: "Documente & Conținut", copy: "Documente care impresionează prin claritate și estetică.", list: ["Lucrări academice", "Prezentări profesionale", "Rapoarte & analize", "Template-uri"] },
];

const priceItems = [
  { title: "Landing page / site one-page", price: 850, copy: "Design personalizat, responsive, formular și optimizare de bază." },
  { title: "Site de prezentare (5–8 pagini)", price: 1750, copy: "Structură completă, design responsive, contact, SEO de bază și instruire." },
  { title: "Site de prezentare premium", price: 2950, copy: "Design avansat, animații, strategie de conținut și experiență personalizată." },
  { title: "Magazin online standard", price: 4200, copy: "Catalog, coș, plăți, curier, configurare inițială și instruire." },
  { title: "Asistență editorială pentru lucrare de licență", price: 1000, copy: "Structurare, tehnoredactare, formatare, bibliografie și prezentare. Conținutul original este furnizat și asumat de student." },
  { title: "Logo design", price: 300, copy: "Concept de logo, variante cromatice și fișiere pregătite pentru web." },
  { title: "Brand design / identitate vizuală", price: 500, copy: "Logo, paletă cromatică, fonturi și direcție vizuală de bază." },
  { title: "Întocmire și tehnoredactare documente", price: 30, unit: "/ pagină", copy: "Formatare, structurare și aranjare vizuală; tariful final depinde de complexitate." },
  { title: "Pachet social media — 6 vizualuri", price: 450, copy: "Șase postări sau story-uri coerente vizual, adaptate brandului." },
  { title: "Poster, flyer sau invitație", price: 150, copy: "O direcție vizuală personalizată și fișiere pentru digital sau tipar." },
  { title: "Prezentare profesională — până la 10 slide-uri", price: 400, copy: "Structură clară, design coerent și pregătire pentru prezentare sau PDF." },
  { title: "Carte de vizită", price: 180, copy: "Design față-verso, variantă digitală și fișier pregătit pentru tipar." },
];

const testimonials = [
  ["Colaborarea cu Aura's Digital Dream a fost cea mai bună decizie pentru brandul nostru. Profesionalism de top și rezultate vizibile.", "Maria P.", "Studio de Design Interior"],
  ["Aura a înțeles imediat direcția brandului și a transformat ideile noastre într-o identitate coerentă și elegantă.", "Andreea M.", "Fondator brand beauty"],
  ["Comunicare excelentă, atenție la detalii și o livrare care a depășit așteptările.", "Radu C.", "Antreprenor"],
];

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function ProjectDetail({ project, details, onNavigate, onSection }) {
  const [zoomed, setZoomed] = useState(null);
  const assets = [...new Set([
    ...(portfolioAssets[project.slug] || []),
    ...(supplementalPortfolioAssets[project.slug] || []),
  ])];
  const qualityAssets = assets.filter((asset) => !/generated_(image|video)|freepik|43d21e774/i.test(asset));
  const images = qualityAssets.filter((asset) => !asset.toLowerCase().endsWith(".mp4"));
  const videos = qualityAssets.filter((asset) => asset.toLowerCase().endsWith(".mp4"));
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

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  useScrollExperience(currentPath);
  const [filter, setFilter] = useState("Toate");
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [testimonial, setTestimonial] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("idle");
  const filtered = useMemo(() => filter === "Toate" ? projects : projects.filter((p) => p.category.includes(filter)), [filter]);
  const total = selectedPrices.reduce((sum, price) => sum + price, 0);
  const nav = [["Servicii", "servicii"], ["Portofoliu", "portofoliu"], ["Prețuri", "estimator"], ["Contact", "contact"]];
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
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)));
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
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)));
    };
    if (currentPath !== "/" && document.startViewTransition) document.startViewTransition(revealSection);
    else revealSection();
  }

  if (detailProject && projectDetails[detailSlug]) {
    return <ProjectDetail project={detailProject} details={projectDetails[detailSlug]} onNavigate={navigateTo} onSection={goToSection} />;
  }

  function togglePrice(price) {
    setSelectedPrices((current) => current.includes(price) ? current.filter((p) => p !== price) : [...current, price]);
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
        <nav className={menuOpen ? "open" : ""}>{nav.map(([label, id]) => <button key={id} onClick={(event) => { goToSection(event, id); setMenuOpen(false); }}>{label}</button>)}</nav>
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
          <p className="hero-copy">Idei care prind viață digital.</p>
          <div className="hero-actions"><button className="button primary" onClick={() => scrollToId("contact")}>Hai să lucrăm împreună</button><a className="button ghost" href="https://wa.me/40762509423">Scrie-mi pe WhatsApp</a></div>
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
        <div className="service-grid">{services.map(({ icon: Icon, title, copy, list }) => <article className="service-card" data-reveal key={title}><Icon size={32} weight="light" /><h3>{title}</h3><p>{copy}</p><ul>{list.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></article>)}</div>
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
        <div className="featured-projects">{featured.map((project, index) => <a className="featured-project" data-reveal data-parallax={index % 2 ? "0.025" : "-0.02"} href={`/portofoliu/${project.slug}`} onClick={(event) => navigateTo(event, `/portofoliu/${project.slug}`)} key={project.slug}><div className="featured-visual"><img src={detailHeroAssets[project.slug] || project.image} alt={project.title} /><span className="featured-index">0{index + 1}</span><span className="featured-open">Descoperă proiectul <ArrowRight size={18} /></span></div><div className="featured-copy"><div className="tags">{project.category.map((tag) => <span key={tag}>{tag}</span>)}</div><h3>{project.title}</h3><p>{project.description}</p><span className="text-link">Vezi studiul de caz <ArrowRight size={17} /></span></div></a>)}</div>
        <div className="archive-head"><div><p className="section-kicker">Arhivă</p><h2>Explorează toate <em>creațiile.</em></h2></div><span>{filtered.length.toString().padStart(2, "0")} proiecte</span></div>
        <div className="filters">{["Toate", "Branding", "Web", "Marketing", "Grafică", "Logo Design", "Documente"].map((item) => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
        <div className="project-grid">{filtered.map((project) => <a className="project-card" data-reveal href={`/portofoliu/${project.slug}`} onClick={(event) => navigateTo(event, `/portofoliu/${project.slug}`)} key={project.slug}><div className="project-image"><img src={project.image} alt={project.title} /><div className="project-hover"><span>Vezi proiectul</span><ArrowRight size={22} /></div></div><div className="tags">{project.category.map((tag) => <span key={tag}>{tag}</span>)}</div><h3>{project.title}</h3><p>{project.description}</p></a>)}</div>
      </section>

      <section className="creative-direction">
        <div className="creative-direction-copy" data-reveal><p className="section-kicker">Creative Direction</p><h2>O privire de ansamblu asupra <em>lumii vizuale.</em></h2><p>Branding, artă digitală, campanii și materiale editoriale reunite într-o compoziție care arată amplitudinea portofoliului.</p><a className="button ink" href="/portofoliu/arta-digitala-materiale-grafice" onClick={(event) => navigateTo(event, "/portofoliu/arta-digitala-materiale-grafice")}>Vezi proiectul de artă digitală <ArrowRight size={18} /></a></div>
        <figure className="creative-collage" data-reveal data-parallax="-0.035"><div className="collage-halo" aria-hidden="true" /><img className="collage-piece collage-main" src="/portfolio/auras-trend-vault/84ce9f083_WhatsAppImage2026-07-01at120708.jpg" alt="Portret editorial Aura's Trend Vault" /><img className="collage-piece collage-adi" src="/portfolio/adi-ecoo-2009-sa/1269c6c20_bannerorizontalv2.png" alt="Campanie vizuală ADI ECOO" /><img className="collage-piece collage-invite" src="/portfolio/invitatii-nunti-botezuri-evenimente/766c6c8d9_generated_image.png" alt="Invitație pentru botezul lui Theodore" /><img className="collage-piece collage-detail" src="/portfolio/luxury-hair-by-aura/7c76798b9_WhatsAppImage2026-07-02at1127331.jpg" alt="Detaliu vizual dintr-un proiect de branding" /><span className="collage-caption">Selected works · Aura's Digital Dream</span></figure>
      </section>

      <section className="behind" id="behind">
        <div className="behind-portrait" data-reveal data-parallax="0.035"><div className="portrait-frame portrait-video"><video autoPlay muted loop playsInline preload="metadata" aria-label="Aura Dobre — showreel personal"><source src="/video/aura-creative-showreel.mp4" type="video/mp4" /></video><span className="portrait-film-label" aria-hidden="true">MOTION PORTRAIT / 01</span></div><span className="portrait-orbit" aria-hidden="true">STRATEGIE · CREATIVITATE · EMPATIE ·</span></div>
        <div className="behind-copy" data-reveal><p className="section-kicker">Behind the Dream</p><h2>Un studio digital cu o perspectivă <em>personală.</em></h2><p>În spatele fiecărui proiect sunt eu, Aura. Îmi place să unesc gândirea strategică, sensibilitatea vizuală și tehnologia, astfel încât fiecare brand să se simtă autentic — nu construit după un șablon.</p><p>Ascult înainte să desenez, caut ideea care merită păstrată și construiesc fiecare experiență cu grijă pentru detalii, ritm și emoție.</p><button className="button ink" onClick={() => scrollToId("contact")}>Povestește-mi ideea ta <ArrowRight size={18} /></button></div>
      </section>

      <section className="section estimator" id="estimator">
        <p className="section-kicker">Estimator de cost</p><h2>Estimează-ți <em>bugetul.</em></h2><p className="section-lead">Selectează serviciile de care ai nevoie și primește o estimare instantanee. Toate prețurile sunt sugestive, afișate „de la” și pot varia în funcție de complexitate, volum și termenul de livrare.</p>
        <div className="estimator-grid"><div className="price-list">{priceItems.map((item) => <button className={selectedPrices.includes(item.price) ? "selected" : ""} key={item.title} onClick={() => togglePrice(item.price)}><span className="price-check"><Check size={18} /></span><span><b>{item.title}</b><small>{item.copy}</small></span><strong>de la {item.price.toLocaleString("ro-RO")} RON {item.unit && <em>{item.unit}</em>}</strong></button>)}</div><aside className="summary"><span className="summary-label">Estimare orientativă</span><h3>Sumar estimare</h3><p>{selectedPrices.length ? `${selectedPrices.length} servicii selectate` : "Selectează serviciile dorite."}</p><div><span>Total minim estimativ</span><strong>{total.toLocaleString("ro-RO")} RON</strong></div><small className="estimate-note">Sumele sunt sugestive. Oferta finală se stabilește după brief, în funcție de complexitate, număr de pagini sau livrabile, urgență și revizii. Domeniul, hostingul, tiparul și serviciile recurente se calculează separat.</small><a className="button primary" href={`https://wa.me/40762509423?text=${encodeURIComponent(`Salut! Aș dori o ofertă personalizată. Total minim estimat: ${total} RON`)}`}><WhatsappLogo size={20} /> Cere ofertă</a></aside></div>
      </section>

      <section className="section dark" id="proces">
        <p className="section-kicker">Proces de lucru</p><h2>De la idee, <em>la realitate.</em></h2>
        <div className="process-grid">{[["01","Descoperire","Înțeleg nevoile tale, publicul țintă și obiectivele de business."],["02","Strategie","Construiesc un plan clar, cu direcții creative adaptate brandului."],["03","Creație","Transform strategia în elemente vizuale și conținut memorabil."],["04","Livrare","Lansez proiectul și optimizez experiența pentru rezultate maxime."]].map(([nr,title,copy]) => <article key={nr}><span>{nr}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className="section testimonials">
        <p className="section-kicker">Testimoniale</p><h2>Ce spun <em>clienții.</em></h2>
        <div className="quote"><p>„{testimonials[testimonial][0]}”</p><strong>{testimonials[testimonial][1]}</strong><span>{testimonials[testimonial][2]}</span><div><button onClick={() => setTestimonial((testimonial + testimonials.length - 1) % testimonials.length)} aria-label="Anterior"><CaretLeft /></button><button onClick={() => setTestimonial((testimonial + 1) % testimonials.length)} aria-label="Următor"><CaretRight /></button></div></div>
      </section>

      <section className="section contact" id="contact">
        <div><p className="section-kicker">Contact</p><h2>Hai să lucrăm <em>împreună.</em></h2><p>Ai un proiect în minte? Scrie-mi și găsim împreună cea mai bună soluție. Răspund în maximum 24 de ore.</p><a href="https://wa.me/40762509423"><WhatsappLogo size={22} /><span><b>Scrie-mi pe WhatsApp</b><small>Răspuns rapid, oricând</small></span></a><a href="tel:+40762509423"><Phone size={22} /><span><b>Sună-mă direct</b><small>+40 762 509 423</small></span></a></div>
        <form id="contact-form" onSubmit={submitContact} data-reveal><input className="honeypot" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" /><div className="form-row"><input required name="name" maxLength="80" autoComplete="name" placeholder="Numele tău" /><input required name="email" maxLength="120" type="email" autoComplete="email" placeholder="Email" /></div><input name="phone" maxLength="30" inputMode="tel" autoComplete="tel" placeholder="Telefon" /><select name="service" defaultValue=""><option value="" disabled>Tip serviciu dorit</option><option>Web & Magazine Online</option><option>Branding & Identitate Vizuală</option><option>Social Media & Promovare</option><option>Design Grafic</option></select><textarea required name="message" minLength="15" maxLength="2000" placeholder="Descrie pe scurt proiectul tău..." /><div className="form-actions"><button className="button primary" type="submit" disabled={formStatus === "sending"}>{formStatus === "sending" ? "Se trimite..." : "Trimite pe email"} <ArrowRight size={18} /></button><button className="button whatsapp" type="button" onClick={submitWhatsapp}><WhatsappLogo size={20} /> Trimite pe WhatsApp</button></div>{formStatus === "success" && <p className="form-notice success" role="status">Mesajul a fost trimis. Îți voi răspunde în maximum 24 de ore.</p>}{formStatus === "error" && <p className="form-notice error" role="alert">Trimiterea nu a reușit. Te rog folosește butonul WhatsApp.</p>}<small className="privacy-note">Prin trimitere ești de acord ca datele să fie procesate de FormSubmit exclusiv pentru livrarea mesajului către mine.</small></form>
      </section>

      <footer><div className="footer-brand"><img src="/assets/logo.jpg" alt="Aura's Digital Dream" /><div><strong>Aura's Digital Dream</strong><p>Marketing, design și soluții digitale, cu suflet.</p></div></div><div className="social"><a href="https://www.instagram.com/aurasdigitaldream" aria-label="Instagram"><InstagramLogo /></a><a href="https://www.linkedin.com/in/aurelia-dobre-a033b2104" aria-label="LinkedIn"><LinkedinLogo /></a><a href="https://wa.me/40762509423" aria-label="WhatsApp"><WhatsappLogo /></a></div><p>© 2026 Aura's Digital Dream. Toate drepturile rezervate.</p></footer>
      <a className="floating-whatsapp" href="https://wa.me/40762509423" aria-label="Scrie-mi pe WhatsApp"><WhatsappLogo size={28} weight="fill" /></a>
    </main>
  );
}
