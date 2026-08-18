import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, CaretLeft, CaretRight, Check, Code, FileText, InstagramLogo, LinkedinLogo, List, Megaphone, Palette, Phone, WhatsappLogo, X } from "@phosphor-icons/react";
import { Chapters, Depth, Lines, Progress, Reveal, Rise, ScrollCue, Track } from "./scroll.jsx";

// ── Static data ──────────────────────────────────────────────────────────────
const projects = [
  { slug: "selectii-cromatice", title: "Selecții Cromatice — Moodboard-uri & Direcție Vizuală", category: ["Moodboard", "Grafică"], image: "/portfolio/selectii-cromatice/olive-blush.jpeg", description: "Palete atent curatoriate, transformate în atmosfere vizuale pentru identități de brand, campanii şi spații digitale." },
  { slug: "verde-bean", title: "Verde Bean — Identitate de Brand", category: ["Branding"], image: "/portfolio/verde-bean/verde-bean-hero-branding.jpeg", description: "Identitate vizuală completă pentru un brand de cafea specialty sustenabil." },
  { slug: "painea-de-acasa", title: "Pâinea de Acasă — Identitate de Brand Artizanală", category: ["Branding", "Grafică"], image: "/portfolio/painea-de-acasa/painea-de-acasa-packaging.jpeg", description: "Identitate caldă şi autentică pentru o brătărie artizanală locală, cu logo, paletă, tipografie şi aplicații de brand." },
  { slug: "lumina-botanica", title: "Lumina Botanica — Identitate de Brand", category: ["Branding"], image: "/portfolio/lumina-botanica/20c5ceaff_WhatsAppImage2026-07-02at090233.jpg", description: "Branding premium pentru o linie de produse cosmetice organice şi botanice." },
  { slug: "lupul-and-brici", title: "Lupul & Brici — Identitate de Brand", category: ["Branding", "Web"], image: "/portfolio/lupul-and-brici/852b052a0_generated_image.png", description: "Identitate vizuală pentru un brand de îngrijire masculină, cu website de prezentare inclus." },
  { slug: "luxury-hair-by-aura", title: "Luxury Hair by Aura — Identitate de Brand", category: ["Branding"], image: "/portfolio/luxury-hair-by-aura/0429b7c7f_WhatsAppImage2026-07-02at1127334.jpg", description: "Identitate vizuală premium pentru un salon de extensii de păr din Slobozia." },
  { slug: "real-estate-co", title: "Real Estate Co. — Identitate de Brand & Website", category: ["Branding", "Web"], image: "/portfolio/real-estate-co/7254652e3_Capturdeecran2025-10-27232250.png", description: "Identitate vizuală completă, materiale print şi website pentru o agenție imobiliară din Anglia." },
  { slug: "carti-de-vizita", title: "Cărți de Vizită — Design Corporate & Personal", category: ["Branding"], image: "/portfolio/carti-de-vizita/3cd5b72d3_adiecoo1.png", description: "Cărți de vizită digitale cu cod QR şi print, create într-un stil modern şi memorabil." },
  { slug: "adi-ecoo-2009-sa", title: "ADI ECOO 2009 S.A. — Identitate, campanii & www.adiecoo2009sa.ro", category: ["Branding", "Marketing", "Grafică", "Web", "Documente"], image: "/portfolio/adi-ecoo-2009-sa/adi-ecoo-rollup-real.jpeg", description: "Identitate completă şi ecosistem de comunicare: logo, campanii, materiale editoriale, conținut digital şi website www.adiecoo2009sa.ro." },
  { slug: "campanie-social-media-luxe", title: "Campanie Social Media — Bijuterii de Lux", category: ["Marketing"], image: "/assets/bijuterii.png", description: "Campanie editorială pentru o maison de bijuterii fine, cu fotografie şi storytelling premium." },
  { slug: "auras-trend-vault", title: "Aura’s Trend Vault — Platformă Web, Blog, AI & Fotografie Editorială", category: ["Web"], image: "/portfolio/auras-trend-vault/editorial-2026/vogue-cover.jpeg", description: "Platformă web completă, blog editorial şi experiențe AI create de la zero." },
  { slug: "magazine-online-e-commerce", title: "Magazine Online E-Commerce — Web Design, Dezvoltare & Fotografie", category: ["Web"], image: "/assets/ecommerce.jpg", description: "Magazine online complete, cu design, plăți, curieri, fotografie de produs şi optimizare SEO." },
  { slug: "invitatii-nunti-botezuri-evenimente", title: "Invitații Nunți, Botezuri & Evenimente", category: ["Grafică"], image: "/assets/invitatii.png", description: "Invitații premium personalizate, cu accente botanice, caligrafie şi finisaje rafinate." },
  { slug: "documente-corporatiste-licenta", title: "Documente Corporatiste & Lucrare de Licență", category: ["Documente"], image: "/assets/documente.png", description: "Rapoarte, broşuri, prezentări şi documente academice cu structură clară şi design profesionist." },
  { slug: "arta-digitala-materiale-grafice", title: "Artă Digitală & Materiale Grafice", category: ["Grafică"], image: "/portfolio/arta-digitala-materiale-grafice/a847754e3_WhatsAppImage2026-07-02at1140104.jpg", description: "Ilustrații, postere, compoziții abstracte şi materiale grafice create într-o direcție contemporană." },
  { slug: "logo-design", title: "Logo Design — Identități Vizuale de Brand", category: ["Logo Design"], image: "/portfolio/logo-design/3caeb0cc1_Untitled-design.png", description: "Colecție de logo-uri profesionale — de la monograme elegante la embleme corporate şi sigle de lux." },
];
const featuredSlugs = ["auras-trend-vault", "verde-bean", "real-estate-co", "campanie-social-media-luxe", "adi-ecoo-2009-sa", "lumina-botanica"];
const portfolioGroups = [
  { title: "Branding", copy: "Identități vizuale, logo-uri, direcții cromatice şi materiale de brand care fac o afacere recognoscibilă.", slugs: ["verde-bean", "painea-de-acasa", "lumina-botanica", "luxury-hair-by-aura", "logo-design", "carti-de-vizita", "selectii-cromatice"] },
  { title: "Web", copy: "Platforme, website-uri şi experiențe digitale create pentru prezentare, conversie şi încredere.", slugs: ["auras-trend-vault", "real-estate-co", "lupul-and-brici", "magazine-online-e-commerce"] },
  { title: "Marketing", copy: "Campanii, conținut vizual, documente şi materiale promoționale construite pentru vizibilitate.", slugs: ["adi-ecoo-2009-sa", "campanie-social-media-luxe", "invitatii-nunti-botezuri-evenimente", "documente-corporatiste-licenta", "arta-digitala-materiale-grafice"] },
];
const services = [
  { icon: Palette, title: "Pachet Start-up", subtitle: "Identitate completă pentru afaceri noi", copy: "Pentru branduri la început care au nevoie de o imagine clară şi credibilă din prima zi.", list: ["Logo profesional + 2 variante cromatice", "Paletă cromatică + fonturi", "Carte de vizită / semnătură digitală", "Mini kit social media (3 postări + 3 stories)", "Ghid de identitate PDF"], benefits: ["Arăți profesionist din prima zi", "Ai o imagine coerentă pe toate platformele", "Ai materiale gata de folosit"], price: "900 – 1.200 RON" },
  { icon: Megaphone, title: "Pachet Rebranding", subtitle: "Upgrade complet de imagine", copy: "Pentru afaceri care există deja, dar au nevoie de o identitate matură şi premium.", list: ["Audit vizual complet", "Refresh logo + direcție vizuală", "Materiale grafice actualizate", "Direcție de comunicare", "6 vizualuri social media", "Ghid de brand PDF"], benefits: ["Imagine modernă şi coerentă", "Creştere încredere + profesionalism", "Materiale actualizate pentru toate platformele"], price: "1.500 – 2.200 RON" },
  { icon: Code, title: "Pachet Website", subtitle: "Prezență digitală profesionistă", copy: "Pentru branduri care vor un site elegant, rapid şi construit pentru conversie.", list: ["Website 5–8 pagini", "Structură UX + texte", "Formular + WhatsApp + CTA-uri", "Responsive mobil", "SEO de bază", "Instruire video"], benefits: ["Site rapid şi modern", "Creşte încrederea clienților", "Optimizat pentru conversie"], price: "2.000 – 2.500 RON" },
  { icon: Code, title: "Pachet Website Premium", subtitle: "Storytelling & animații", copy: "Pentru branduri care vor o experiență digitală cinematică.", list: ["Design avansat", "Animații GSAP / Lottie", "Storytelling vizual", "Elemente 3D / video", "Strategie de conținut", "SEO extins"], benefits: ["Experiență memorabilă", "Diferențiere premium", "Mai multă atenție şi timp petrecut pe site"], price: "3.500 – 4.500 RON" },
  { icon: Megaphone, title: "Pachet Social Media", subtitle: "Vizibilitate constantă", copy: "Pentru branduri care au nevoie de conținut coerent şi o prezență recognoscibilă.", list: ["6 vizualuri / lună", "Template-uri reutilizabile", "Calendar de conținut", "Copywriting", "Mini strategie"], benefits: ["Postări coerente vizual", "Mai multă claritate în comunicare", "Prezență constantă fără haos"], price: "450 – 600 RON" },
  { icon: FileText, title: "Pachet Documente Profesionale", subtitle: "Materiale impecabile", copy: "Pentru documente, prezentări şi materiale oficiale care trebuie să arate ordonat şi profesionist.", list: ["Prezentări", "Rapoarte", "Broşuri", "PDF-uri", "Tehnoredactare completă"], benefits: ["Documente curate şi uşor de citit", "Imagine serioasă şi profesionistă", "Structură clară pentru informații complexe"], price: "40 – 60 RON / pagină" },
];
const priceItems = [
  { title: "Pachet Start-up", price: 900, maxPrice: 1200, copy: "Logo, identitate vizuală de bază şi mini kit social media." },
  { title: "Pachet Rebranding", price: 1500, maxPrice: 2200, copy: "Refresh vizual, repoziționare, materiale actualizate şi direcție de comunicare." },
  { title: "Pachet Website (5–8 pagini)", price: 2000, maxPrice: 2500, copy: "Structură completă, design responsive, contact, SEO de bază şi instruire." },
  { title: "Website Premium — animații & storytelling", price: 3500, maxPrice: 4500, copy: "Design avansat, animații, storytelling vizual şi experiență personalizată." },
  { title: "Magazin online", price: 4500, maxPrice: 6000, copy: "Catalog, coş, plăți, curier, configurare inițială şi instruire." },
  { title: "Logo design", price: 400, maxPrice: 600, copy: "Concept de logo, variante cromatice şi fişiere pregătite pentru web." },
  { title: "Identitate vizuală completă", price: 800, maxPrice: 1200, copy: "Logo, paletă cromatică, fonturi, direcție vizuală şi aplicații de bază." },
  { title: "Pachet social media — 6 vizualuri", price: 450, maxPrice: 600, copy: "Şase postări sau story-uri coerente vizual, adaptate brandului." },
  { title: "Documente profesionale", price: 40, maxPrice: 60, unit: "/ pagină", copy: "Formatare, structurare şi aranjare vizuală; tariful final depinde de complexitate." },
  { title: "Prezentare profesională — 10 slide-uri", price: 450, maxPrice: 700, copy: "Structură clară, design coerent şi pregătire pentru prezentare sau PDF." },
  { title: "Poster / flyer", price: 150, maxPrice: 250, copy: "O direcție vizuală personalizată şi fişiere pentru digital sau tipar." },
  { title: "Carte de vizită", price: 180, maxPrice: 250, copy: "Design față-verso, variantă digitală şi fişier pregătit pentru tipar." },
];
const testimonials = [
  { type: "Branding", initials: "MB", quote: "Aura ne-a ajutat să transformăm o idee destul de împrăştiată într-o identitate clară: logo, culori, materiale şi o direcție vizuală pe care o putem folosi consecvent.", name: "Mihaela B.", role: "Fondator brand local" },
  { type: "Web", initials: "AC", quote: "Site-ul a devenit mult mai uşor de înțeles pentru clienți. Structura, butoanele şi prezentarea serviciilor ne-au ajutat să primim cereri mai clare.", name: "Andrei C.", role: "Antreprenor servicii premium" },
  { type: "Documente", initials: "EP", quote: "Aveam nevoie ca documentele să arate profesionist, nu doar corect scrise. Aura a organizat informația, a curățat vizual paginile şi a dat materialului un aspect serios.", name: "Elena P.", role: "Client documente & prezentări" },
  { type: "Social Media", initials: "IR", quote: "Vizualurile pentru social media au început să pară parte din acelaşi brand. Nu mai postăm la întâmplare, ci cu o linie estetică uşor de recunoscut.", name: "Ioana R.", role: "Beauty & lifestyle business" },
];
const clientQuestions = [
  { q: "Nu știu exact ce pachet mi se potrivește. De unde încep?", a: "Începem cu o discuție scurtă despre obiectiv, buget și urgență. Dacă ai nevoie de imagine de la zero, Start-up sau Branding sunt firești; dacă ai nevoie de vânzare și prezență online, Website devine prioritar." },
  { q: "Ce primesc concret la final?", a: "Primești fișiere clare, materiale pregătite pentru folosire, structură de comunicare și instrucțiuni. La web includ pagini responsive, CTA-uri, formular, WhatsApp și SEO de bază." },
  { q: "Cât durează un proiect?", a: "Logo-ul sau materialele rapide pot dura câteva zile. Un website sau un brand complet are nevoie, de regulă, de una până la câteva săptămâni, în funcție de conținut, feedback și complexitate." },
  { q: "Pot începe cu ceva mic și continua apoi?", a: "Da. Site-ul și pachetele sunt gândite modular: poți începe cu logo, un set de vizualuri sau o pagină de prezentare, apoi extindem identitatea, campaniile sau website-ul." },
];
const packageComparison = [
  { feature: "Identitate vizuală", start: "esențială", web: "adaptată", premium: "direcție completă" },
  { feature: "Website responsive", start: "opțional", web: "inclus", premium: "experiență cinematică" },
  { feature: "Storytelling & animații", start: "minimal", web: "echilibrat", premium: "avansat" },
  { feature: "SEO & claritate", start: "de bază", web: "structurat", premium: "extins + conținut" },
];
const chapters = [
  { key: "asculta", number: "01", title: "Ascult", video: "/video/story-ascult-workshop.mp4", headline: "Nu pornesc de la tendințe. Pornesc de la tine.", copy: "Îți ascult ideea, contextul, publicul și tensiunea din spatele brandului înainte să desenez direcția.", meta: "Atelier vechi · marmură" },
  { key: "imaginez", number: "02", title: "Imaginez", video: "/video/story-imaginez-golden-hand.mp4", headline: "Ideile tale devin formă, lumină și experiență.", copy: "Transform informația în concept vizual: culori, ritm, ierarhie, atmosferă și primul fir de storytelling.", meta: "Palmă · lumină" },
  { key: "construiesc", number: "03", title: "Construiesc", video: "/video/story-construiesc-modern-office.mp4", headline: "Construiesc sisteme care se simt vii.", copy: "Aduc totul într-o experiență clară, responsive și premium: identitate, website, campanie sau material digital.", meta: "Birou modern · lumină rece" },
];
const processSteps = [
  ["01", "Descoperire", "Înțeleg obiectivele tale, publicul şi provocările brandului. Ascult înainte să propun."],
  ["02", "Strategie", "Definesc direcția vizuală, structura şi mesajele-cheie. Nimic nu se întâmplă la întâmplare."],
  ["03", "Execuție", "Construiesc fiecare element cu atenție la detalii: design, texte, funcționalitate."],
  ["04", "Livrare & Ajustare", "Prezint rezultatul, colectez feedback şi îl ajustăm pentru rezultate maxime."],
];
const skillGroups = [
  ["Design & Creație", [["Canva (avansat)", 98], ["Editare foto", 80], ["Design Thinking", 88]]],
  ["Web & Tehnic", [["Wix", 95], ["WebWave", 90], ["Dezvoltare aplicații web", 78], ["SEO de bază", 82]]],
  ["Marketing & AI", [["Meta Business Suite", 92], ["Copywriting", 95], ["AI avansat (prompting)", 96]]],
];

function scrollToId(id) {
  document.getElementById(id === "estimare" ? "estimator" : id)?.scrollIntoView({ behavior: "smooth" });
}

function SkillBar({ name, value }) {
  const reduced = useReducedMotion();
  return (
    <div className="skill-row">
      <div className="skill-label"><span>{name}</span><span>{value}%</span></div>
      <div className="skill-bar">
        <motion.div
          className="skill-fill"
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: value / 100 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={{ transformOrigin: "left", scaleX: reduced ? value / 100 : undefined }}
        />
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export function HomePage({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [formStatus, setFormStatus] = useState("idle");
  const [selectedPrices, setSelectedPrices] = useState([]);

  const heroRef = useRef(null);
  const reduced = useReducedMotion();
  const nav = [["Servicii", "servicii"], ["Portofoliu", "portofoliu"], ["Cărțile mele", "/cartile-mele"], ["Prețuri", "estimator"], ["Contact", "contact"]];
  const featured = featuredSlugs.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean);
  const groupedProjects = portfolioGroups.map((g) => ({ ...g, projects: g.slugs.map((s) => projects.find((p) => p.slug === s)).filter(Boolean) }));
  const selectedPriceItems = priceItems.filter((i) => selectedPrices.includes(i.title));
  const total = selectedPriceItems.reduce((s, i) => s + i.price, 0);
  const totalMax = selectedPriceItems.reduce((s, i) => s + (i.maxPrice || i.price), 0);

  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.12]);
  const heroFade = useTransform(heroProgress, [0, 0.85], [1, 0]);
  const heroLift = useTransform(heroProgress, [0, 1], ["0%", "-14%"]);

  function togglePrice(title) {
    setSelectedPrices((c) => (c.includes(title) ? c.filter((t) => t !== title) : [...c, title]));
  }

  function contactMessage(form) {
    const d = new FormData(form);
    return "Nume: " + d.get("name") + "\nEmail: " + d.get("email") + "\nTelefon: " + (d.get("phone") || "nespecificat") + "\nServiciu: " + (d.get("service") || "nespecificat") + "\n\n" + d.get("message");
  }

  async function submitContact(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return;
    setFormStatus("sending");
    const payload = Object.fromEntries(data.entries());
    try {
      const res = await fetch("https://formsubmit.co/ajax/aurastrendvault@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: payload.name, email: payload.email, phone: payload.phone, service: payload.service, message: payload.message, _subject: "Cerere nouă Aura's Digital Dream — " + (payload.service || "proiect digital"), _template: "table", _replyto: payload.email, _honey: payload.website }),
      });
      if (!res.ok) throw new Error();
      setFormStatus("success");
      form.reset();
    } catch { setFormStatus("error"); }
  }

  function submitWhatsapp() {
    const form = document.getElementById("contact-form");
    if (!form?.reportValidity()) return;
    const data = new FormData(form);
    if (data.get("website")) return;
    window.open("https://wa.me/40762509423?text=" + encodeURIComponent("Bună, Aura!\n\n" + contactMessage(form)), "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "Aura's Digital Dream",
      url: "https://aurastudios.ro/",
      founder: { "@type": "Person", name: "Aura Dobre" },
      areaServed: "România",
      serviceType: ["Branding", "Web design", "Marketing digital", "Documente profesionale"],
      mainEntity: clientQuestions.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "homepage-service-faq-schema";
    script.textContent = JSON.stringify(structuredData);
    document.head.querySelector("#homepage-service-faq-schema")?.remove();
    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <main className="home">
      <Progress />

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="masthead">
        <button className="masthead-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src="/assets/logo.jpg" alt="" aria-hidden="true" />
          <span>Aura's Digital Dream</span>
        </button>
        <nav className="masthead-nav" aria-label="Navigare principală">
          {nav.map(([label, target]) => (
            target.startsWith("/")
              ? <a key={label} href={target} onClick={(e) => onNavigate(e, target)}>{label}</a>
              : <button key={label} onClick={() => scrollToId(target)}>{label}</button>
          ))}
        </nav>
        <button className="masthead-toggle" onClick={() => setMenuOpen(true)} aria-label="Deschide meniul">
          <List size={24} />
        </button>
      </header>

      {menuOpen && (
        <div className="menu-sheet" role="dialog" aria-modal="true" aria-label="Meniu">
          <button className="menu-close" onClick={() => setMenuOpen(false)} aria-label="Închide meniul"><X size={26} /></button>
          {nav.map(([label, target]) => (
            target.startsWith("/")
              ? <a key={label} href={target} onClick={(e) => { setMenuOpen(false); onNavigate(e, target); }}>{label}</a>
              : <button key={label} onClick={() => { setMenuOpen(false); scrollToId(target); }}>{label}</button>
          ))}
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero" ref={heroRef} id="acasa">
        <motion.div className="hero-media" style={reduced ? undefined : { scale: heroScale }}>
          <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
            <source src="/video/renaissance-sculptor-hero.mp4" type="video/mp4" />
          </video>
          <span className="hero-scrim" aria-hidden="true" />
        </motion.div>
        <motion.div className="hero-body shell" style={reduced ? undefined : { opacity: heroFade, y: heroLift }}>
          <Reveal as="p" className="kicker" delay={0.15}>Marketing · Design · Web</Reveal>
          <Lines as="h1" className="hero-title" text="Brandul tău merită să fie simțit, nu doar văzut." delay={0.3} />
          <Reveal as="p" className="hero-lead" delay={0.6}>
            Construiesc identități vizuale, website-uri și campanii pentru antreprenori care vor
            o prezență clară, coerentă și memorabilă.
          </Reveal>
          <Rise delay={0.8} className="hero-actions">
            <button className="button primary" onClick={() => scrollToId("contact")}>Începe un proiect <ArrowRight size={16} /></button>
            <button className="button ghost" onClick={() => scrollToId("portofoliu")}>Vezi portofoliul</button>
          </Rise>
        </motion.div>
        <ScrollCue />
      </section>

      {/* ── Manifesto ────────────────────────────────────────────────────── */}
      <section className="manifesto" aria-label="Manifest">
        <div className="shell">
          <Lines
            as="p"
            className="manifesto-text"
            text="Nu fac doar materiale frumoase. Construiesc lumi vizuale în care brandul tău capătă ritm, claritate și memorie."
          />
          <Rise delay={0.2} className="manifesto-meta">
            <span>Aura Dobre</span>
            <span>Designer & strateg digital</span>
          </Rise>
        </div>
      </section>

      {/* ── Chapters: the working method ─────────────────────────────────── */}
      <Chapters
        id="proces"
        className="method"
        items={chapters}
        renderMedia={(item) => (
          <>
            <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
              <source src={item.video} type="video/mp4" />
            </video>
            <span className="chapter-scrim" aria-hidden="true" />
          </>
        )}
        renderCopy={(item) => (
          <>
            <p className="kicker">{item.number} — {item.title}</p>
            <h2 className="chapter-headline">{item.headline}</h2>
            <p className="chapter-body">{item.copy}</p>
            <span className="chapter-meta">{item.meta}</span>
          </>
        )}
      />

      {/* ── Featured work, horizontal ────────────────────────────────────── */}
      <section className="work-intro" id="portofoliu">
        <div className="shell">
          <Reveal as="p" className="kicker">Selecție curatorială</Reveal>
          <Lines as="h2" className="section-title" text="Proiecte care nu doar arată bine — ci spun ceva." />
        </div>
      </section>

      <Track className="work-track" label="Proiecte reprezentative">
        {featured.map((project, index) => (
          <a
            className="work-frame"
            key={project.slug}
            href={"/portofoliu/" + project.slug}
            onClick={(e) => onNavigate(e, "/portofoliu/" + project.slug)}
          >
            <span className="work-frame-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="work-frame-media">
              <img src={project.image} alt={project.title} loading="lazy" />
            </span>
            <span className="work-frame-copy">
              <span className="work-frame-tags">{project.category.join(" · ")}</span>
              <span className="work-frame-title">{project.title}</span>
              <span className="work-frame-cta">Vezi proiectul <ArrowRight size={14} /></span>
            </span>
          </a>
        ))}
      </Track>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section className="services" id="servicii">
        <div className="shell">
          <div className="section-head">
            <Reveal as="p" className="kicker">Servicii</Reveal>
            <Lines as="h2" className="section-title" text="Tot ce ai nevoie, sub un singur acoperiș." />
            <Rise delay={0.15}>
              <p className="section-lead">
                De la identitate vizuală şi web la documente şi social media — construiesc tot ce
                are nevoie un brand pentru a arăta şi comunica profesionist.
              </p>
            </Rise>
          </div>
          <div className="service-grid">
            {services.map(({ icon: Icon, title, subtitle, copy, list, benefits, price }, index) => (
              <Rise key={title} delay={(index % 3) * 0.08} className="service-card">
                <span className="service-icon"><Icon size={24} /></span>
                <h3>{title}</h3>
                <p className="service-subtitle">{subtitle}</p>
                <p className="service-copy">{copy}</p>
                <ul className="service-list">
                  {list.map((item) => <li key={item}><Check size={12} weight="bold" /> {item}</li>)}
                </ul>
                <ul className="service-benefits">
                  {benefits.map((b) => <li key={b}>{b}</li>)}
                </ul>
                <p className="service-price">{price}</p>
                <button className="button ghost small" onClick={() => scrollToId("contact")}>
                  Solicită ofertă <ArrowRight size={13} />
                </button>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────── */}
      <section className="process">
        <div className="shell">
          <div className="section-head">
            <Reveal as="p" className="kicker">Proces de lucru</Reveal>
            <Lines as="h2" className="section-title" text="De la idee, la realitate." />
          </div>
          <ol className="process-grid">
            {processSteps.map(([nr, title, copy], index) => (
              <Rise key={nr} delay={index * 0.08}>
                <li className="process-step">
                  <span className="process-number">{nr}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </li>
              </Rise>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Estimator ────────────────────────────────────────────────────── */}
      <section className="estimator" id="estimator">
        <div className="shell">
          <div className="section-head">
            <Reveal as="p" className="kicker">Estimator de cost</Reveal>
            <Lines as="h2" className="section-title" text="Estimează-ți bugetul." />
            <Rise delay={0.15}>
              <p className="section-lead">
                Selectează serviciile de care ai nevoie şi obții imediat o estimare orientativă.
                Prețul final se stabileşte după o discuție personalizată.
              </p>
            </Rise>
          </div>
          <div className="estimator-grid">
            <div className="price-list" role="group" aria-label="Servicii disponibile">
              {priceItems.map((item) => {
                const on = selectedPrices.includes(item.title);
                return (
                  <button
                    key={item.title}
                    type="button"
                    className={"price-item" + (on ? " is-on" : "")}
                    aria-pressed={on}
                    onClick={() => togglePrice(item.title)}
                  >
                    <span className="price-check" aria-hidden="true">{on && <Check size={13} weight="bold" />}</span>
                    <span className="price-text">
                      <strong>{item.title}</strong>
                      <small>{item.copy}</small>
                    </span>
                    <span className="price-value">
                      {item.price.toLocaleString("ro")}
                      {item.maxPrice ? " – " + item.maxPrice.toLocaleString("ro") : ""} {item.unit || "RON"}
                    </span>
                  </button>
                );
              })}
            </div>
            <aside className="price-summary" aria-live="polite">
              <p className="kicker">Estimare totală</p>
              {selectedPriceItems.length === 0 ? (
                <p className="price-empty">Selectează serviciile pentru a vedea estimarea.</p>
              ) : (
                <>
                  <ul className="price-chosen">
                    {selectedPriceItems.map((i) => (
                      <li key={i.title}>
                        <span>{i.title}</span>
                        <span>{i.price.toLocaleString("ro")} – {(i.maxPrice || i.price).toLocaleString("ro")} {i.unit || "RON"}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="price-total">
                    <span>Total estimat</span>
                    <strong>{total.toLocaleString("ro")} – {totalMax.toLocaleString("ro")} RON</strong>
                  </p>
                  <p className="price-note">Preț orientativ. Oferta finală se trimite după o discuție despre proiect.</p>
                  <button className="button primary" onClick={() => scrollToId("contact")}>
                    Solicită ofertă personalizată <ArrowRight size={15} />
                  </button>
                </>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* ── Portfolio archive ────────────────────────────────────────────── */}
      <section className="archive">
        <div className="shell">
          <div className="section-head">
            <Reveal as="p" className="kicker">Portofoliu organizat</Reveal>
            <Lines as="h2" className="section-title" text="Alege direcția care te reprezintă." />
          </div>
          {groupedProjects.map((group) => (
            <div className="archive-group" key={group.title}>
              <div className="archive-group-head">
                <h3>{group.title}</h3>
                <p>{group.copy}</p>
              </div>
              <div className="archive-grid">
                {group.projects.map((project, index) => (
                  <Rise key={project.slug} delay={(index % 4) * 0.06}>
                    <a
                      className="archive-card"
                      href={"/portofoliu/" + project.slug}
                      onClick={(e) => onNavigate(e, "/portofoliu/" + project.slug)}
                    >
                      <span className="archive-card-media">
                        <img src={project.image} alt={project.title} loading="lazy" />
                      </span>
                      <span className="archive-card-tags">{project.category.join(" · ")}</span>
                      <span className="archive-card-title">{project.title}</span>
                    </a>
                  </Rise>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Editorial break ──────────────────────────────────────────────── */}
      <section className="editorial" aria-label="Direcție de artă">
        <Depth speed={0.18} className="editorial-media">
          <img src="/assets/editorial/golden-portrait-clean.jpg" alt="" aria-hidden="true" />
        </Depth>
        <span className="editorial-scrim" aria-hidden="true" />
        <div className="shell editorial-body">
          <Reveal as="p" className="kicker">Artă care oprește scroll-ul</Reveal>
          <Lines as="h2" className="section-title" text="Imaginile vorbesc înaintea cuvintelor." />
          <Rise delay={0.2}>
            <p>Fotografie editorială, direcție de artă şi estetică de brand construite cu intenție şi coerență.</p>
          </Rise>
        </div>
      </section>

      {/* ── Skills ───────────────────────────────────────────────────────── */}
      <section className="skills" id="skills">
        <div className="shell">
          <div className="section-head">
            <Reveal as="p" className="kicker">Skills & competențe</Reveal>
            <Lines as="h2" className="section-title" text="Instrumente stăpânite." />
          </div>
          <div className="skill-grid">
            {skillGroups.map(([title, rows], index) => (
              <Rise key={title} delay={index * 0.1} className="skill-card">
                <h3>{title}</h3>
                {rows.map(([name, value]) => <SkillBar key={name} name={name} value={value} />)}
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why me ───────────────────────────────────────────────────────── */}
      <section className="why" id="de-ce-eu">
        <div className="shell">
          <div className="section-head">
            <Reveal as="p" className="kicker">Încredere & direcție</Reveal>
            <Lines as="h2" className="section-title" text="De ce să lucrezi cu mine" />
          </div>
          <div className="why-grid">
            {[
              "Sunt specialist în marketing digital, design şi web, cu peste 15 proiecte finalizate în branding, campanii, website-uri şi documente profesionale.",
              "Lucrez cu antreprenori şi companii care vor rezultate reale, nu doar vizibilitate.",
              "Fiecare proiect este construit cu atenție la detalii, strategie clară şi o estetică premium care diferențiază brandul tău.",
            ].map((copy, index) => (
              <Rise key={copy} delay={index * 0.08}>
                <p className="why-item">{copy}</p>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* ── Clarity: FAQ + comparison ────────────────────────────────────── */}
      <section className="clarity" id="claritate">
        <div className="shell">
          <div className="section-head">
            <Reveal as="p" className="kicker">Claritate înainte de ofertă</Reveal>
            <Lines as="h2" className="section-title" text="Nu te las să alegi la întâmplare. Îți arăt drumul." />
            <Rise delay={0.15}>
              <p className="section-lead">
                Fiecare secțiune din site răspunde unei întrebări reale: ce primești, cât costă,
                cum lucrăm și unde vezi exemple.
              </p>
            </Rise>
          </div>
          <div className="clarity-grid">
            <div className="faq">
              {clientQuestions.map((item, index) => (
                <Rise key={item.q} delay={index * 0.06}>
                  <details className="faq-item" open={index === 0}>
                    <summary>
                      <span className="faq-number">{String(index + 1).padStart(2, "0")}</span>
                      {item.q}
                    </summary>
                    <p>{item.a}</p>
                  </details>
                </Rise>
              ))}
            </div>
            <Rise delay={0.1} className="compare">
              <h3>Alegi după nevoie, nu după ghicit.</h3>
              <table className="compare-table">
                <caption className="visually-hidden">Comparație pachete Aura's Digital Dream</caption>
                <thead>
                  <tr><th scope="col">Ce contează</th><th scope="col">Start-up</th><th scope="col">Website</th><th scope="col">Premium</th></tr>
                </thead>
                <tbody>
                  {packageComparison.map((row) => (
                    <tr key={row.feature}>
                      <th scope="row">{row.feature}</th>
                      <td>{row.start}</td><td>{row.web}</td><td>{row.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="compare-note">
                Portofoliul rămâne viu: proiectele, materialele, cărțile și aplicațiile pot fi
                extinse fără să pierdem estetica sau storytelling-ul.
              </p>
            </Rise>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="voices">
        <div className="shell">
          <div className="section-head">
            <Reveal as="p" className="kicker">Testimoniale</Reveal>
            <Lines as="h2" className="section-title" text="Ce spun clienții." />
          </div>
          <motion.figure
            className="voice"
            key={testimonialIdx}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="voice-tag">{testimonials[testimonialIdx].type}</span>
            <blockquote>„{testimonials[testimonialIdx].quote}”</blockquote>
            <figcaption>
              <span className="voice-avatar" aria-hidden="true">{testimonials[testimonialIdx].initials}</span>
              <span>
                <strong>{testimonials[testimonialIdx].name}</strong>
                <small>{testimonials[testimonialIdx].role}</small>
              </span>
            </figcaption>
          </motion.figure>
          <div className="voice-controls">
            <button onClick={() => setTestimonialIdx((testimonialIdx + testimonials.length - 1) % testimonials.length)} aria-label="Testimonialul anterior"><CaretLeft size={18} /></button>
            <span aria-hidden="true">{testimonialIdx + 1} / {testimonials.length}</span>
            <button onClick={() => setTestimonialIdx((testimonialIdx + 1) % testimonials.length)} aria-label="Testimonialul următor"><CaretRight size={18} /></button>
          </div>
        </div>
      </section>

      {/* ── Books teaser ─────────────────────────────────────────────────── */}
      <section className="books" id="amazon-picks">
        <div className="shell books-grid">
          <div>
            <Reveal as="p" className="kicker">Aura Dobre · Author Universe</Reveal>
            <Lines as="h2" className="section-title" text="Cărțile mele au acum pagina lor." />
            <Rise delay={0.15}>
              <p className="section-lead">
                Am separat vitrina literară într-o pagină dedicată, unde cărțile scrise de mine pot
                respira ca lumi vizuale separate. Dark romance, thrillere psihologice şi poveşti
                care se citesc ca un film.
              </p>
              <div className="books-actions">
                <a className="button primary" href="/cartile-mele" onClick={(e) => onNavigate(e, "/cartile-mele")}>
                  Vizitează lumea mea literară <ArrowRight size={15} />
                </a>
                <a className="button ghost" href="https://www.amazon.com/stores/Aura-Dobre/author/B0DSJP6MX8" target="_blank" rel="noopener noreferrer">Amazon</a>
              </div>
            </Rise>
          </div>
          <Rise delay={0.2} className="books-stack">
            {[
              ["/assets/amazon/clockmakers-curse.jpg", "Coperta The Clockmaker's Curse"],
              ["/assets/amazon/unreachable.jpg", "Coperta Unreachable de Aura Dobre"],
              ["/assets/amazon/lunaria-secret-treasure.jpg", "Coperta Lunaria's Secret Treasure"],
            ].map(([src, alt]) => <img key={src} src={src} alt={alt} loading="lazy" />)}
          </Rise>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section className="contact" id="contact">
        <div className="contact-media" aria-hidden="true">
          <video autoPlay muted loop playsInline preload="metadata">
            <source src="/video/story-imaginez-golden-hand.mp4" type="video/mp4" />
          </video>
          <span className="contact-scrim" />
        </div>
        <div className="shell contact-grid">
          <div className="contact-copy">
            <Reveal as="p" className="kicker">Contact</Reveal>
            <Lines as="h2" className="section-title" text="Hai să construim împreună ideea ta." />
            <Rise delay={0.15}>
              <p>
                Spune-mi ce vrei să construim, iar eu transform brief-ul într-o direcție clară:
                strategie, estetică și pașii potriviți pentru lansare. Răspund în maximum 24 de ore.
              </p>
              <div className="contact-links">
                <a href="https://wa.me/40762509423">
                  <WhatsappLogo size={20} />
                  <span><b>Scrie-mi pe WhatsApp</b><small>Răspuns rapid, oricând</small></span>
                </a>
                <a href="tel:+40762509423">
                  <Phone size={20} />
                  <span><b>Sună-mă direct</b><small>+40 762 509 423</small></span>
                </a>
              </div>
            </Rise>
          </div>
          <Rise delay={0.2} className="contact-form-wrap">
            <form id="contact-form" onSubmit={submitContact}>
              <input className="honeypot" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" />
              <div className="form-row">
                <input required name="name" maxLength="80" autoComplete="name" placeholder="Numele tău" />
                <input required name="email" maxLength="120" type="email" autoComplete="email" placeholder="Email" />
              </div>
              <input name="phone" maxLength="30" inputMode="tel" autoComplete="tel" placeholder="Telefon" />
              <select name="service" defaultValue="">
                <option value="" disabled>Alege pachetul potrivit</option>
                <option>Pachet Start-up</option>
                <option>Pachet Rebranding</option>
                <option>Pachet Website</option>
                <option>Pachet Social Media</option>
                <option>Pachet Documente Profesionale</option>
                <option>Nu sunt sigură încă</option>
              </select>
              <textarea required name="message" minLength="15" maxLength="2000" placeholder="Descrie pe scurt proiectul tău..." />
              <div className="form-actions">
                <button className="button primary" type="submit" disabled={formStatus === "sending"}>
                  {formStatus === "sending" ? "Se trimite..." : "Trimite pe email"} <ArrowRight size={16} />
                </button>
                <button className="button ghost" type="button" onClick={submitWhatsapp}>
                  <WhatsappLogo size={18} /> Trimite pe WhatsApp
                </button>
              </div>
              {formStatus === "success" && <p className="form-notice is-success" role="status">Mesajul a fost trimis. Îți voi răspunde în maximum 24 de ore.</p>}
              {formStatus === "error" && <p className="form-notice is-error" role="alert">Trimiterea nu a reuşit. Te rog foloseşte butonul WhatsApp.</p>}
              <small className="form-privacy">
                Prin trimitere eşti de acord ca datele să fie procesate de FormSubmit exclusiv
                pentru livrarea mesajului către mine.
              </small>
            </form>
          </Rise>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="site-footer">
        <div className="shell footer-grid">
          <div className="footer-brand">
            <img src="/assets/logo.jpg" alt="" aria-hidden="true" />
            <div>
              <strong>Aura's Digital Dream</strong>
              <p>Marketing, design şi soluții digitale, cu suflet.</p>
            </div>
          </div>
          <nav className="footer-social" aria-label="Rețele sociale">
            <a href="https://www.instagram.com/aurasdigitaldream" aria-label="Instagram"><InstagramLogo size={20} /></a>
            <a href="https://www.linkedin.com/in/aurelia-dobre-a033b2104" aria-label="LinkedIn"><LinkedinLogo size={20} /></a>
            <a href="https://wa.me/40762509423" aria-label="WhatsApp"><WhatsappLogo size={20} /></a>
          </nav>
          <p className="footer-legal">© 2026 Aura's Digital Dream. Toate drepturile rezervate.</p>
        </div>
      </footer>

      <a className="whatsapp-fab" href="https://wa.me/40762509423" aria-label="Scrie-mi pe WhatsApp">
        <WhatsappLogo size={26} weight="fill" />
      </a>
    </main>
  );
}
