import { useMemo, useState } from "react";
import {
  ArrowRight,
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

export function App() {
  const [filter, setFilter] = useState("Toate");
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [testimonial, setTestimonial] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const filtered = useMemo(() => filter === "Toate" ? projects : projects.filter((p) => p.category.includes(filter)), [filter]);
  const total = selectedPrices.reduce((sum, price) => sum + price, 0);
  const nav = [["Acasă", "acasa"], ["Despre", "despre"], ["Servicii", "servicii"], ["Skills", "skills"], ["Portofoliu", "portofoliu"], ["Estimator", "estimator"], ["Proces", "proces"], ["Contact", "contact"]];

  function togglePrice(price) {
    setSelectedPrices((current) => current.includes(price) ? current.filter((p) => p !== price) : [...current, price]);
  }

  return (
    <main>
      <header className="site-header">
        <button className="brand" onClick={() => scrollToId("acasa")}><img src="/assets/logo.jpg" alt="Aura's Digital Dream" /><span>Aura's <em>Digital</em> Dream</span></button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Deschide meniul">{menuOpen ? <X /> : <List />}</button>
        <nav className={menuOpen ? "open" : ""}>{nav.map(([label, id]) => <button key={id} onClick={() => { scrollToId(id); setMenuOpen(false); }}>{label}</button>)}</nav>
      </header>

      <section className="hero" id="acasa">
        <img className="hero-image" src="/assets/hero.png" alt="Fundal abstract digital" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">Marketing · Design · Soluții Digitale</p>
          <h1>Aura's <em>Digital</em><br />Dream</h1>
          <p className="hero-copy">Idei care prind viață digital.</p>
          <div className="hero-actions"><button className="button primary" onClick={() => scrollToId("contact")}>Hai să lucrăm împreună</button><a className="button ghost" href="https://wa.me/40762509423">Scrie-mi pe WhatsApp</a></div>
        </div>
        <button className="scroll-mark" onClick={() => scrollToId("despre")} aria-label="Derulează la secțiunea despre"><span /></button>
      </section>

      <section className="section about" id="despre">
        <div><p className="section-kicker">Despre mine</p><h2>Marketing, design și soluții digitale, <em>cu suflet.</em></h2></div>
        <div className="about-copy"><p>Sunt un specialist în marketing digital care crede că fiecare proiect merită atenție la detalii și o viziune clară. Lucrez atât cu companii, cât și cu antreprenori independenți, oferind soluții complete — de la strategie și branding, până la dezvoltare web și documente profesionale.</p><p>Fiecare brand are o poveste unică. Misiunea mea este să transform acea poveste într-o prezență digitală care inspiră încredere, atrage clienți și construiește relații pe termen lung.</p></div>
      </section>

      <section className="section dark" id="servicii">
        <p className="section-kicker">Servicii</p><h2>Tot ce ai nevoie, <em>sub un singur acoperiș.</em></h2><p className="section-lead">De la strategie la execuție, fiecare serviciu este gândit pentru a-ți aduce rezultate reale.</p>
        <div className="service-grid">{services.map(({ icon: Icon, title, copy, list }) => <article className="service-card" key={title}><Icon size={32} weight="light" /><h3>{title}</h3><p>{copy}</p><ul>{list.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></article>)}</div>
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
        <div className="project-grid">{filtered.map((project) => <article className="project-card" key={project.slug}><div className="project-image"><img src={project.image} alt={project.title} /><div className="project-hover"><span>Vezi proiectul</span><ArrowRight size={22} /></div></div><div className="tags">{project.category.map((tag) => <span key={tag}>{tag}</span>)}</div><h3>{project.title}</h3><p>{project.description}</p></article>)}</div>
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
        <form onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); alert("Mulțumesc! Mesajul tău a fost pregătit."); }}><div className="form-row"><input required placeholder="Numele tău" /><input required type="email" placeholder="Email" /></div><input placeholder="Telefon" /><select defaultValue=""><option value="" disabled>Tip serviciu dorit</option><option>Web & Magazine Online</option><option>Branding & Identitate Vizuală</option><option>Social Media & Promovare</option><option>Design Grafic</option></select><textarea required placeholder="Descrie pe scurt proiectul tău..." /><button className="button primary">Trimite mesajul <ArrowRight size={18} /></button></form>
      </section>

      <footer><div className="footer-brand"><img src="/assets/logo.jpg" alt="Aura's Digital Dream" /><div><strong>Aura's Digital Dream</strong><p>Marketing, design și soluții digitale, cu suflet.</p></div></div><div className="social"><a href="https://www.instagram.com/aurasdigitaldream" aria-label="Instagram"><InstagramLogo /></a><a href="https://www.linkedin.com/in/aurelia-dobre-a033b2104" aria-label="LinkedIn"><LinkedinLogo /></a><a href="https://wa.me/40762509423" aria-label="WhatsApp"><WhatsappLogo /></a></div><p>© 2026 Aura's Digital Dream. Toate drepturile rezervate.</p></footer>
      <a className="floating-whatsapp" href="https://wa.me/40762509423" aria-label="Scrie-mi pe WhatsApp"><WhatsappLogo size={28} weight="fill" /></a>
    </main>
  );
}
