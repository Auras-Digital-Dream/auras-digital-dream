import { useMemo, useState } from "react";
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
const detailHeroAssets = {
  "verde-bean": "/portfolio/verde-bean/730b9953c_WhatsAppImage2026-07-02at090603.jpeg",
  "lumina-botanica": "/portfolio/lumina-botanica/69944db3b_WhatsAppImage2026-07-02at090156.jpg",
  "lupul-and-brici": "/portfolio/lupul-and-brici/2f028c963_generated_image.png",
  "luxury-hair-by-aura": "/portfolio/luxury-hair-by-aura/31d17cea7_generated_image.png",
  "real-estate-co": "/portfolio/real-estate-co/9e3247426_generated_image.png",
  "carti-de-vizita": "/portfolio/carti-de-vizita/4c8202a7a_aurasdigitaldream1.png",
  "adi-ecoo-2009-sa": "/portfolio/adi-ecoo-2009-sa/1269c6c20_bannerorizontalv2.png",
  "campanie-social-media-luxe": "/portfolio/campanie-social-media-luxe/65714e254_generated_image.png",
  "auras-trend-vault": "/portfolio/auras-trend-vault/84ce9f083_WhatsAppImage2026-07-01at120708.jpg",
  "magazine-online-e-commerce": "/portfolio/magazine-online-e-commerce/21dc16065_WhatsAppImage2026-07-02at090809.jpg",
  "invitatii-nunti-botezuri-evenimente": "/portfolio/invitatii-nunti-botezuri-evenimente/cbb2fbd88_Daiana.png",
  "documente-corporatiste-licenta": "/portfolio/documente-corporatiste-licenta/2e1da68ae_generated_image.png",
  "arta-digitala-materiale-grafice": "/portfolio/arta-digitala-materiale-grafice/4cf0976b6_generated_image.png",
  "logo-design": "/portfolio/logo-design/4403fa619_generated_image.png",
};

const projects = [
  { slug: "verde-bean", title: "Verde Bean — Identitate de Brand", category: ["Branding"], image: "/assets/verde-bean.jpeg", description: "Identitate vizuală completă pentru un brand de cafea specialty sustenabil." },
  { slug: "lumina-botanica", title: "Lumina Botanica — Identitate de Brand", category: ["Branding"], image: "/assets/lumina-botanica.jpg", description: "Branding premium pentru o linie de produse cosmetice organice și botanice." },
  { slug: "lupul-and-brici", title: "Lupul & Brici — Identitate de Brand", category: ["Branding", "Web"], image: "/assets/lupul-brici.png", description: "Identitate vizuală pentru un brand de îngrijire masculină, cu website de prezentare inclus." },
  { slug: "luxury-hair-by-aura", title: "Luxury Hair by Aura — Identitate de Brand", category: ["Branding"], image: "/assets/luxury-hair.png", description: "Identitate vizuală premium pentru un salon de extensii de păr din Slobozia." },
  { slug: "real-estate-co", title: "Real Estate Co. — Identitate de Brand & Website", category: ["Branding", "Web"], image: "/assets/real-estate.png", description: "Identitate vizuală completă, materiale print și website pentru o agenție imobiliară din Anglia." },
  { slug: "carti-de-vizita", title: "Cărți de Vizită — Design Corporate & Personal", category: ["Branding"], image: "/assets/carti-vizita.png", description: "Cărți de vizită digitale cu cod QR și print, create într-un stil modern și memorabil." },
  { slug: "adi-ecoo-2009-sa", title: "ADI ECOO 2009 S.A. — Branding, Grafică, Social Media & Website", category: ["Marketing", "Branding", "Web"], image: "/assets/adi-ecoo.png", description: "Proiect complet de comunicare pentru colectarea corectă a deșeurilor în județul Ialomița." },
  { slug: "campanie-social-media-luxe", title: "Campanie Social Media — Bijuterii de Lux", category: ["Marketing"], image: "/assets/bijuterii.png", description: "Campanie editorială pentru o maison de bijuterii fine, cu fotografie și storytelling premium." },
  { slug: "auras-trend-vault", title: "Aura's Trend Vault — Platformă Web, Blog, AI & Fotografie Editorială", category: ["Web"], image: "/assets/trend-vault.jpg", description: "Platformă web completă, blog editorial și experiențe AI create de la zero." },
  { slug: "magazine-online-e-commerce", title: "Magazine Online E-Commerce — Web Design, Dezvoltare & Fotografie", category: ["Web"], image: "/assets/ecommerce.jpg", description: "Magazine online complete, cu design, plăți, curieri, fotografie de produs și optimizare SEO." },
  { slug: "invitatii-nunti-botezuri-evenimente", title: "Invitații Nunți, Botezuri & Evenimente", category: ["Grafică"], image: "/assets/invitatii.png", description: "Invitații premium personalizate, cu accente botanice, caligrafie și finisaje rafinate." },
  { slug: "documente-corporatiste-licenta", title: "Documente Corporatiste & Lucrare de Licență", category: ["Documente"], image: "/assets/documente.png", description: "Rapoarte, broșuri, prezentări și documente academice cu structură clară și design profesionist." },
  { slug: "arta-digitala-materiale-grafice", title: "Artă Digitală & Materiale Grafice", category: ["Grafică"], image: "/assets/arta-digitala.png", description: "Ilustrații, postere, compoziții abstracte și materiale grafice create într-o direcție contemporană." },
  { slug: "logo-design", title: "Logo Design — Identități Vizuale de Brand", category: ["Logo Design"], image: "/assets/logo-design.png", description: "Colecție de logo-uri profesionale — de la monograme elegante la embleme corporate și sigle de lux." },
];

const services = [
  { icon: Megaphone, title: "Marketing & Strategie Digitală", copy: "Strategii care transformă vizibilitatea în rezultate concrete.", list: ["Consultanță și strategie", "Social media & content", "Meta / Google Ads", "Branding & poziționare"] },
  { icon: Code, title: "Web & Aplicații", copy: "Prezență online profesională, construită pe fundații solide.", list: ["Site-uri de prezentare", "Landing pages", "Aplicații web", "Optimizare & SEO"] },
  { icon: Palette, title: "Identitate Vizuală & Grafică", copy: "Design care comunică valori, nu doar culori.", list: ["Logo & identitate de brand", "Afișe și bannere", "Materiale social media", "Flyere și broșuri"] },
  { icon: FileText, title: "Documente & Conținut", copy: "Documente care impresionează prin claritate și estetică.", list: ["Lucrări academice", "Prezentări profesionale", "Rapoarte & analize", "Template-uri"] },
];

const priceItems = [
  { title: "Landing page / site one-page", price: 1200 },
  { title: "Site de prezentare (5–8 pagini)", price: 2500 },
  { title: "Site de prezentare premium", price: 4500 },
  { title: "Magazin online standard", price: 6000 },
];

const testimonials = [
  ["Colaborarea cu Aura's Digital Dream a fost cea mai bună decizie pentru brandul nostru. Profesionalism de top și rezultate vizibile.", "Maria P.", "Studio de Design Interior"],
  ["Aura a înțeles imediat direcția brandului și a transformat ideile noastre într-o identitate coerentă și elegantă.", "Andreea M.", "Fondator brand beauty"],
  ["Comunicare excelentă, atenție la detalii și o livrare care a depășit așteptările.", "Radu C.", "Antreprenor"],
];

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function ProjectDetail({ project, details }) {
  useScrollExperience();
  const [zoomed, setZoomed] = useState(null);
  const assets = portfolioAssets[project.slug] || [];
  const images = assets.filter((asset) => !asset.toLowerCase().endsWith(".mp4"));
  const videos = assets.filter((asset) => asset.toLowerCase().endsWith(".mp4"));

  return (
    <main className="detail-page"><div className="scroll-progress" aria-hidden="true" />
      <header className="detail-header">
        <a className="brand" href="/"><img src="/assets/logo.jpg" alt="Aura's Digital Dream" /><span>Aura's <em>Digital</em> Dream</span></a>
        <nav><a href="/">Acasă</a><a href="/#despre">Despre</a><a href="/#servicii">Servicii</a><a href="/#portofoliu">Portofoliu</a><a href="/#contact">Contact</a></nav>
      </header>

      <section className="detail-hero">
        <div className="detail-hero-copy" data-reveal>
          <a className="detail-back" href="/#portofoliu"><ArrowLeft size={18} /> Înapoi la portofoliu</a>
          <div className="detail-meta"><span>{details.category}</span><span>{details.date}</span></div>
          <h1>{project.title}</h1>
          <p>Client: {details.client}</p>
        </div>
        <div className="detail-hero-visual" data-parallax="0.08"><img src={detailHeroAssets[project.slug] || images[0] || project.image} alt={project.title} /></div>
      </section>

      <section className="detail-content">
        <div className="detail-intro" data-reveal><p className="section-kicker">Despre proiect</p><h2>{details.about}</h2></div>
        <div className="detail-columns"><article data-reveal><span>01</span><h3>Provocarea</h3><p>{details.challenge}</p></article><article data-reveal><span>02</span><h3>Soluția</h3><p>{details.solution}</p></article></div>
        <div className="detail-results"><p className="section-kicker">Rezultate</p><div>{details.results.map((result) => <article key={result}><Check size={18} weight="bold" /><span>{result}</span></article>)}</div></div>
      </section>

      <section className="detail-gallery">
        <p className="section-kicker">Galerie</p><h2>Proiectul <em>în imagini.</em></h2>
        <div className="gallery-grid">{images.map((image, index) => <button data-reveal key={image} className={index % 7 === 0 ? "gallery-wide" : ""} onClick={() => setZoomed(image)}><img src={image} alt={`${project.title} — imagine ${index + 1}`} loading="lazy" /><span><ArrowsOutSimple size={24} /> Click pentru zoom</span></button>)}</div>
        {videos.length > 0 && <div className="video-section"><h3>Video</h3><div>{videos.map((video) => <video controls preload="metadata" key={video}><source src={video} type="video/mp4" /></video>)}</div></div>}
      </section>

      <section className="detail-cta"><p>Îți place ce vezi?</p><h2>Hai să construim ceva <em>memorabil.</em></h2><a className="button primary" href="/#contact">Hai să lucrăm împreună <ArrowRight size={18} /></a></section>
      <footer><div className="footer-brand"><img src="/assets/logo.jpg" alt="Aura's Digital Dream" /><div><strong>Aura's Digital Dream</strong><p>Marketing, design și soluții digitale, cu suflet.</p></div></div><p>© 2026 Aura's Digital Dream. Toate drepturile rezervate.</p></footer>
      <a className="floating-whatsapp" href="https://wa.me/40762509423" aria-label="Scrie-mi pe WhatsApp"><WhatsappLogo size={28} weight="fill" /></a>
      {zoomed && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Imagine mărită" onClick={() => setZoomed(null)}><button aria-label="Închide imaginea" onClick={() => setZoomed(null)}><X size={26} /></button><img src={zoomed} alt="Imagine mărită din proiect" /></div>}
    </main>
  );
}

export function App() {
  useScrollExperience();
  const [filter, setFilter] = useState("Toate");
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [testimonial, setTestimonial] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("idle");
  const filtered = useMemo(() => filter === "Toate" ? projects : projects.filter((p) => p.category.includes(filter)), [filter]);
  const total = selectedPrices.reduce((sum, price) => sum + price, 0);
  const nav = [["Acasă", "acasa"], ["Despre", "despre"], ["Servicii", "servicii"], ["Skills", "skills"], ["Portofoliu", "portofoliu"], ["Estimator", "estimator"], ["Proces", "proces"], ["Contact", "contact"]];
  const detailSlug = window.location.pathname.match(/^\/portofoliu\/([^/]+)\/?$/)?.[1];
  const detailProject = projects.find((project) => project.slug === detailSlug);

  if (detailProject && projectDetails[detailSlug]) {
    return <ProjectDetail project={detailProject} details={projectDetails[detailSlug]} />;
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
    <main><div className="scroll-progress" aria-hidden="true" />
      <header className="site-header">
        <button className="brand" onClick={() => scrollToId("acasa")}><img src="/assets/logo.jpg" alt="Aura's Digital Dream" /><span>Aura's <em>Digital</em> Dream</span></button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Deschide meniul">{menuOpen ? <X /> : <List />}</button>
        <nav className={menuOpen ? "open" : ""}>{nav.map(([label, id]) => <button key={id} onClick={() => { scrollToId(id); setMenuOpen(false); }}>{label}</button>)}</nav>
      </header>

      <section className="hero" id="acasa">
        <img className="hero-image" data-parallax="0.16" src="/assets/hero.png" alt="Fundal abstract digital" />
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

      <section className="story-section" aria-label="Povestea procesului creativ">
        <div className="story-orbit" data-parallax="-0.08" aria-hidden="true"><span /><span /><span /></div>
        <div className="story-sticky"><p className="section-kicker">Din idee în experiență</p><h2>Nu creez doar imagini.<br /><em>Construiesc o lume.</em></h2></div>
        <div className="story-chapters"><article data-reveal><span>01 / Ascult</span><h3>Încep cu povestea ta.</h3><p>Descopăr esența brandului, oamenii cărora li se adresează și emoția pe care vrei să o lași în urmă.</p></article><article data-reveal><span>02 / Imaginez</span><h3>Dau formă unei direcții.</h3><p>Strategia, cuvintele, culoarea și mișcarea devin un limbaj vizual recognoscibil și coerent.</p></article><article data-reveal><span>03 / Construiesc</span><h3>Transform direcția în experiență.</h3><p>Fiecare ecran și fiecare detaliu lucrează împreună pentru ca publicul tău să simtă, să înțeleagă și să acționeze.</p></article></div>
      </section>

      <section className="section dark" id="servicii">
        <p className="section-kicker">Servicii</p><h2>Tot ce ai nevoie, <em>sub un singur acoperiș.</em></h2><p className="section-lead">De la strategie la execuție, fiecare serviciu este gândit pentru a-ți aduce rezultate reale.</p>
        <div className="service-grid">{services.map(({ icon: Icon, title, copy, list }) => <article className="service-card" data-reveal key={title}><Icon size={32} weight="light" /><h3>{title}</h3><p>{copy}</p><ul>{list.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></article>)}</div>
      </section>

      <section className="section skills" id="skills">
        <p className="section-kicker">Skills & Competențe</p><h2>Instrumente <em>stăpânite.</em></h2>
        <div className="skill-columns">{[
          ["Design & Creație", [["Canva (avansat)",98],["Editare foto",80],["Design Thinking",88]]],
          ["Web & Tehnic", [["Wix",95],["WebWave",90],["Dezvoltare aplicații web",78],["SEO de bază",82]]],
          ["Marketing & AI", [["Meta Business Suite",92],["Copywriting",95],["AI avansat (prompting)",96]]],
        ].map(([title, rows]) => <div className="skill-card" key={title}><h3>{title}</h3>{rows.map(([name, value]) => <div className="skill" key={name}><div><span>{name}</span><b>{value}%</b></div><div className="bar"><i style={{ width: `${value}%` }} /></div></div>)}</div>)}</div>
      </section>

      <section className="section portfolio" id="portofoliu">
        <p className="section-kicker">Portofoliu</p><h2>Proiecte <em>recente</em></h2>
        <div className="filters">{["Toate", "Branding", "Web", "Marketing", "Grafică", "Logo Design", "Documente"].map((item) => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
        <div className="project-grid">{filtered.map((project) => <a className="project-card" data-reveal href={`/portofoliu/${project.slug}`} key={project.slug}><div className="project-image"><img src={project.image} alt={project.title} /><div className="project-hover"><span>Vezi proiectul</span><ArrowRight size={22} /></div></div><div className="tags">{project.category.map((tag) => <span key={tag}>{tag}</span>)}</div><h3>{project.title}</h3><p>{project.description}</p></a>)}</div>
      </section>

      <section className="section estimator" id="estimator">
        <p className="section-kicker">Estimator de cost</p><h2>Estimează-ți <em>bugetul.</em></h2><p className="section-lead">Selectează serviciile de care ai nevoie și primește o estimare instantanee. Prețurile sunt orientative, afișate ca „de la”.</p>
        <div className="estimator-grid"><div className="price-list">{priceItems.map((item) => <button className={selectedPrices.includes(item.price) ? "selected" : ""} key={item.title} onClick={() => togglePrice(item.price)}><span className="price-check"><Check size={18} /></span><span><b>{item.title}</b><small>Serviciu complet, adaptat obiectivelor proiectului tău.</small></span><strong>de la {item.price.toLocaleString("ro-RO")} RON</strong></button>)}</div><aside className="summary"><h3>Sumar estimare</h3><p>{selectedPrices.length ? `${selectedPrices.length} servicii selectate` : "Selectează serviciile dorite."}</p><div><span>Total estimativ</span><strong>{total.toLocaleString("ro-RO")} RON</strong></div><a className="button primary" href={`https://wa.me/40762509423?text=${encodeURIComponent(`Salut! Aș dori o ofertă. Total estimat: ${total} RON`)}`}><WhatsappLogo size={20} /> Cere ofertă</a></aside></div>
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
