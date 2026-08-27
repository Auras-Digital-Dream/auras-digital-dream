import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, CaretLeft, CaretRight, Check, Code, FacebookLogo, FileText, InstagramLogo, LinkedinLogo, Megaphone, Palette, Phone, TiktokLogo, WhatsappLogo } from "@phosphor-icons/react";
import { Chapters, Depth, Lines, Marquee, Progress, Reveal, Rise, ScrollCue } from "./scroll.jsx";
import { GoldLine } from "./goldline.jsx";
import { GlobalNavigation } from "./editorial/components/GlobalNavigation.tsx";

// Fields arrive one after another as the form comes into view. Same
// mechanism the rest of the page uses, so there is one reveal system, not two.
const FIELD = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};
const FORM_STAGGER = { visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } } };
const ABOUT_MOTION_WORDS = ["STRATEGIE", "IDENTITATE", "DESIGN", "EXPERIENȚE DIGITALE"];

const PROJECT_PREVIEWS = {
  "selectii-cromatice": ["/portfolio/selectii-cromatice/olive-blush.jpeg", "/portfolio/selectii-cromatice/smokey-blue-merlot-red.jpeg", "/portfolio/selectii-cromatice/warm-orange-dusty-yellow.jpeg"],
  "verde-bean": ["/portfolio/verde-bean/verde-bean-hero-branding.jpeg", "/portfolio/verde-bean/verde-bean-coffee-flatlay.jpeg", "/portfolio/verde-bean/verde-bean-brand-system.jpeg"],
  "painea-de-acasa": ["/portfolio/painea-de-acasa/painea-de-acasa-hero.jpeg", "/portfolio/painea-de-acasa/painea-de-acasa-packaging.jpeg", "/portfolio/painea-de-acasa/painea-de-acasa-brand-board.jpeg"],
  "lumina-botanica": ["/portfolio/lumina-botanica/20c5ceaff_WhatsAppImage2026-07-02at090233.jpg", "/portfolio/lumina-botanica/2f1230ad6_WhatsAppImage2026-07-02at090309.jpg", "/portfolio/lumina-botanica/69944db3b_WhatsAppImage2026-07-02at090156.jpg"],
  "lupul-and-brici": ["/portfolio/lupul-and-brici/852b052a0_generated_image.png", "/portfolio/lupul-and-brici/19cd4610c_generated_image.png", "/portfolio/lupul-and-brici/2f028c963_generated_image.png"],
  "luxury-hair-by-aura": ["/portfolio/luxury-hair-by-aura/0429b7c7f_WhatsAppImage2026-07-02at1127334.jpg", "/portfolio/luxury-hair-by-aura/31d17cea7_generated_image.png", "/portfolio/luxury-hair-by-aura/2e4e765e2_WhatsAppImage2026-07-02at1127333.jpg"],
  "real-estate-co": ["/portfolio/real-estate-co/d7b6e03d9_Capturdeecran2025-10-27234018.png", "/portfolio/real-estate-co/257a93cd6_wwwrealestatecom.png", "/portfolio/real-estate-co/420192b72_Capturdeecran2025-10-27231821.png"],
  "carti-de-vizita": ["/portfolio/carti-de-vizita/12a649300_generated_image.png", "/portfolio/carti-de-vizita/12003543f_generated_image.png", "/portfolio/carti-de-vizita/31e5aed9a_generated_image.png"],
  "adi-ecoo-2009-sa": ["/portfolio/adi-ecoo-2009-sa/adi-ecoo-rollup-real.jpeg", "/portfolio/adi-ecoo-2009-sa/1269c6c20_bannerorizontalv2.png", "/portfolio/adi-ecoo-2009-sa/1f620d631_greenfact-octombrie.png"],
  "campanie-social-media-luxe": ["/portfolio/campanie-social-media-luxe/65714e254_generated_image.png", "/portfolio/campanie-social-media-luxe/150a726d7_generated_image.png", "/portfolio/campanie-social-media-luxe/64686f8af_generated_image.png"],
  "auras-trend-vault": ["/portfolio/auras-trend-vault/editorial-2026/vogue-cover.jpeg", "/portfolio/auras-trend-vault/editorial-2026/editorial-golden-light.jpeg", "/portfolio/auras-trend-vault/editorial-2026/editorial-black-white.jpeg"],
  "magazine-online-e-commerce": ["/portfolio/magazine-online-e-commerce/21dc16065_WhatsAppImage2026-07-02at090809.jpg", "/portfolio/magazine-online-e-commerce/66ff9fedd_WhatsAppImage2026-07-02at114431.jpeg", "/portfolio/magazine-online-e-commerce/85dbe451e_WhatsAppImage2026-07-02at114542.jpeg"],
  "invitatii-nunti-botezuri-evenimente": ["/portfolio/invitatii-nunti-botezuri-evenimente/766c6c8d9_generated_image.png", "/portfolio/invitatii-nunti-botezuri-evenimente/174ce0fdf_WhatsAppImage2026-07-02at152155.jpeg", "/portfolio/invitatii-nunti-botezuri-evenimente/293e33e9b_generated_image.png"],
  "documente-corporatiste-licenta": ["/portfolio/documente-corporatiste-licenta/2e1da68ae_generated_image.png", "/portfolio/documente-corporatiste-licenta/0aede3d97_Capturdeecran2026-07-02143741.png", "/portfolio/documente-corporatiste-licenta/2346f68b2_generated_image.png"],
  "arta-digitala-materiale-grafice": ["/portfolio/arta-digitala-materiale-grafice/a847754e3_WhatsAppImage2026-07-02at1140104.jpg", "/portfolio/arta-digitala-materiale-grafice/059a89151_WhatsAppImage2026-07-02at1140101.jpg", "/portfolio/arta-digitala-materiale-grafice/28cc11e17_WhatsAppImage2026-07-02at114012.jpeg"],
  "logo-design": ["/portfolio/logo-design/3caeb0cc1_Untitled-design.png", "/portfolio/logo-design/00539c763_realestatelogo.png", "/portfolio/logo-design/3e75777fb_generated_image.png"],
};

function ProjectIndex({ items, onNavigate }) {
  const [activeSlug, setActiveSlug] = useState(items[0]?.slug);
  const archiveRef = useRef(null);

  return (
    <section ref={archiveRef} className="project-index" id="portofoliu" aria-label="Toate proiectele">
      <ProjectDisintegrationField rootRef={archiveRef} />
      <div className="project-index-head">
        <p className="kicker"><span className="eyebrow-text">Colecția de proiecte</span></p>
        <p>Identități, spații digitale și obiecte grafice construite ca fragmente din aceeași lume.</p>
      </div>
      <div className="project-index-list">
        {items.map((project, index) => {
          const previews = PROJECT_PREVIEWS[project.slug] || [project.image];
          return (
            <a
              className="project-index-row"
              data-active={project.slug === activeSlug}
              key={project.slug}
              href={`/portofoliu/${project.slug}`}
              onMouseEnter={() => setActiveSlug(project.slug)}
              onFocus={() => setActiveSlug(project.slug)}
              onClick={(event) => onNavigate(event, `/portofoliu/${project.slug}`)}
            >
              <span className="project-index-number">{String(index + 1).padStart(2, "0")}</span>
              <strong>{project.title.split(" — ")[0]}</strong>
              <span className="project-index-tags">{project.category.map((tag) => <i key={tag}>{tag}</i>)}</span>
              <span className="project-index-preview" aria-hidden="true">
                {previews.slice(0, 3).map((image, imageIndex) => <img key={image} src={image} alt="" loading="lazy" style={{ "--preview-i": imageIndex }} />)}
              </span>
              <span className="project-index-open">Vezi proiectul <ArrowRight size={15} /></span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function ProjectDisintegrationField({ rootRef }) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas || reduced || !window.matchMedia("(pointer:fine)").matches) return undefined;

    const context = canvas.getContext("2d", { alpha: true });
    const particles = [];
    const palette = ["#F0ECE9", "#C4BEA8", "#A7A086", "#C5D5D2"];
    let frame = 0;
    let activeRow = null;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(root.clientWidth * ratio);
      canvas.height = Math.round(root.clientHeight * ratio);
      canvas.style.width = `${root.clientWidth}px`;
      canvas.style.height = `${root.clientHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function dissolve(event) {
      const rootRect = root.getBoundingClientRect();
      const x = event.clientX - rootRect.left;
      const y = event.clientY - rootRect.top;
      const row = event.target.closest(".project-index-row");
      if (activeRow && activeRow !== row) activeRow.classList.remove("is-dissolving");
      activeRow = row;
      if (row) {
        const rowRect = row.getBoundingClientRect();
        row.classList.add("is-dissolving");
        row.style.setProperty("--dissolve-x", `${event.clientX - rowRect.left}px`);
        row.style.setProperty("--dissolve-y", `${event.clientY - rowRect.top}px`);
      }
      for (let index = 0; index < 13; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = .08 + Math.random() * .58;
        particles.push({
          x: x + (Math.random() - .5) * 22,
          y: y + (Math.random() - .5) * 22,
          vx: Math.cos(angle) * speed - .16,
          vy: Math.sin(angle) * speed - .12,
          life: 1,
          decay: .014 + Math.random() * .012,
          size: .28 + Math.random() * .68,
          sparkle: Math.random() > .9,
          color: palette[Math.floor(Math.random() * palette.length)],
        });
      }
      if (particles.length > 480) particles.splice(0, particles.length - 480);
    }

    function clearRow() {
      activeRow?.classList.remove("is-dissolving");
      activeRow = null;
    }

    function render() {
      context.clearRect(0, 0, root.clientWidth, root.clientHeight);
      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += .008;
        particle.life -= particle.decay;
        if (particle.life <= 0) { particles.splice(index, 1); continue; }
        context.globalAlpha = particle.life;
        context.fillStyle = particle.color;
        const size = Math.max(.3, particle.size * (.55 + particle.life * .65));
        if (particle.sparkle) {
          context.save();
          context.translate(particle.x, particle.y);
          context.rotate(Math.PI / 4);
          context.fillRect(-size * .45, -size * .45, size * .9, size * .9);
          context.fillRect(-size * 1.2, -size * .12, size * 2.4, size * .24);
          context.fillRect(-size * .12, -size * 1.2, size * .24, size * 2.4);
          context.restore();
        } else {
          context.fillRect(particle.x, particle.y, size, size);
        }
      }
      context.globalAlpha = 1;
      frame = requestAnimationFrame(render);
    }

    resize();
    frame = requestAnimationFrame(render);
    root.addEventListener("pointermove", dissolve, { passive: true });
    root.addEventListener("pointerleave", clearRow, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", dissolve);
      root.removeEventListener("pointerleave", clearRow);
      window.removeEventListener("resize", resize);
      clearRow();
    };
  }, [rootRef, reduced]);

  return <canvas ref={canvasRef} className="project-disintegration" aria-hidden="true" />;
}

// ── Static data ──────────────────────────────────────────────────────────────
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
const services = [
  { icon: Palette, title: "Pachet Start-up", subtitle: "Identitate completă pentru afaceri noi", copy: "Pentru branduri la început care au nevoie de o imagine clară și credibilă din prima zi.", list: ["Logo profesional + 2 variante cromatice", "Paletă cromatică + fonturi", "Carte de vizită / semnătură digitală", "Mini kit social media (3 postări + 3 stories)", "Ghid de identitate PDF"], benefits: ["Arăți profesionist din prima zi", "Ai o imagine coerentă pe toate platformele", "Ai materiale gata de folosit"], price: "900 – 1.200 RON" },
  { icon: Megaphone, title: "Pachet Rebranding", subtitle: "Upgrade complet de imagine", copy: "Pentru afaceri care există deja, dar au nevoie de o identitate matură și premium.", list: ["Audit vizual complet", "Refresh logo + direcție vizuală", "Materiale grafice actualizate", "Direcție de comunicare", "6 vizualuri social media", "Ghid de brand PDF"], benefits: ["Imagine modernă și coerentă", "Creștere încredere + profesionalism", "Materiale actualizate pentru toate platformele"], price: "1.500 – 2.200 RON" },
  { icon: Code, title: "Pachet Website", subtitle: "Prezență digitală profesionistă", copy: "Pentru branduri care vor un site elegant, rapid și construit pentru conversie.", list: ["Website 5–8 pagini", "Structură UX + texte", "Formular + WhatsApp + CTA-uri", "Responsive mobil", "SEO de bază", "Instruire video"], benefits: ["Site rapid și modern", "Crește încrederea clienților", "Optimizat pentru conversie"], price: "2.000 – 2.500 RON" },
  { icon: Code, title: "Pachet Website Premium", subtitle: "Storytelling & animații", copy: "Pentru branduri care vor o experiență digitală cinematică.", list: ["Design avansat", "Animații GSAP / Lottie", "Storytelling vizual", "Elemente 3D / video", "Strategie de conținut", "SEO extins"], benefits: ["Experiență memorabilă", "Diferențiere premium", "Mai multă atenție și timp petrecut pe site"], price: "3.500 – 4.500 RON" },
  { icon: Megaphone, title: "Pachet Social Media", subtitle: "Vizibilitate constantă", copy: "Pentru branduri care au nevoie de conținut coerent și o prezență recognoscibilă.", list: ["6 vizualuri / lună", "Template-uri reutilizabile", "Calendar de conținut", "Copywriting", "Mini strategie"], benefits: ["Postări coerente vizual", "Mai multă claritate în comunicare", "Prezență constantă fără haos"], price: "450 – 600 RON" },
  { icon: FileText, title: "Pachet Documente Profesionale", subtitle: "Materiale impecabile", copy: "Pentru documente, prezentări și materiale oficiale care trebuie să arate ordonat și profesionist.", list: ["Prezentări", "Rapoarte", "Broșuri", "PDF-uri", "Tehnoredactare completă"], benefits: ["Documente curate și ușor de citit", "Imagine serioasă și profesionistă", "Structură clară pentru informații complexe"], price: "40 – 60 RON / pagină" },
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
  { key: "aparitia", number: "01", title: "Apariția", video: "/video/story-aparitia-renaissance-1080p.mp4", headline: "Te ajut să apari.", copy: "Strategia și identitatea vizuală scot brandul din anonimat și îl așază exact în lumina potrivită.", meta: "Claritate · poziționare · identitate" },
  { key: "povestea", number: "02", title: "Povestea", video: "/video/story-imaginez-golden-hand.mp4", poster: "/video/poster/story-imaginez-golden-hand.jpg", headline: "Îi dau o poveste care rămâne.", copy: "Transform informația în concept, ritm și limbaj vizual — o prezență care se simte înainte să fie explicată.", meta: "Storytelling · direcție de artă · conținut" },
  { key: "constructia", number: "03", title: "Construcția", video: "/video/story-construiesc-modern-office.mp4", poster: "/video/poster/story-construiesc-modern-office.jpg", headline: "Construiesc ce poate dura.", copy: "Website-uri, campanii și sisteme vizuale șlefuite ca un întreg: clare, responsive și pregătite să crească.", meta: "Design · web · experiență digitală" },
  { key: "atelierul", number: "04", title: "Atelierul", video: "/video/about-renaissance-studio.mp4", poster: "/video/poster/about-renaissance-studio.jpg", headline: "Renaștere și tehnologie, la lucru.", copy: "Aici, strategia întâlnește estetica, iar ideea ta devine o experiență vie — creată împreună, nu livrată mecanic.", meta: "Aura's Digital Dream · atelier digital" },
];
const processSteps = [
  ["01", "Descoperire", "Înțeleg obiectivele tale, publicul și provocările brandului. Ascult înainte să propun."],
  ["02", "Strategie", "Definesc direcția vizuală, structura și mesajele-cheie. Nimic nu se întâmplă la întâmplare."],
  ["03", "Execuție", "Construiesc fiecare element cu atenție la detalii: design, texte, funcționalitate."],
  ["04", "Livrare & Ajustare", "Prezint rezultatul, colectez feedback și îl ajustăm pentru rezultate maxime."],
];
const skillGroups = [
  ["Design & Creație", [["Canva (avansat)", 98], ["Editare foto", 80], ["Design Thinking", 88]]],
  ["Web & Tehnic", [["Wix", 95], ["WebWave", 90], ["Dezvoltare aplicații web", 78], ["SEO de bază", 82]]],
  ["Marketing & AI", [["Meta Business Suite", 92], ["Copywriting", 95], ["AI avansat (prompting)", 96]]],
];

/* Two blocks rather than one: a ProfessionalService describing the studio,
 * and a separate FAQPage. The questions used to hang off the service as
 * mainEntity, which is not what either type means — a FAQPage is the shape
 * that answer engines actually read.
 *
 * Everything here is taken from what the site already states in public.
 * There is no postal address because there is no public one to give, and an
 * invented one would be worse than none.
 */
const SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://aurastudios.ro/studio#studio",
  name: "Aura's Digital Dream",
  url: "https://aurastudios.ro/studio",
  image: "https://aurastudios.ro/og-cover.jpg",
  logo: "https://aurastudios.ro/assets/logo.jpg",
  description:
    "Marketing, branding, design și experiențe web create cu strategie și suflet.",
  founder: { "@type": "Person", name: "Aura Dobre" },
  areaServed: "România",
  inLanguage: "ro-RO",
  telephone: "+40762509423",
  priceRange: "400–6000 RON",
  serviceType: ["Branding", "Web design", "Marketing digital", "Documente profesionale"],
  sameAs: [
    "https://www.instagram.com/aurasdigitaldream",
    "https://www.facebook.com/auratrendvault",
    "https://www.tiktok.com/@aurasdigitaldream",
    "https://www.linkedin.com/in/aurelia-dobre-a033b2104",
    "https://aurasdigitaldream.gumroad.com/",
    "https://www.amazon.co.uk/stores/author/B0DSJP6MX8",
    "https://www.goodreads.com/user/show/203519366-aura-dobre",
  ],
};

/* Mapped one to one off clientQuestions, so the schema and the accordion
 * can never say different things. */
const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://aurastudios.ro/studio#faq",
  mainEntity: clientQuestions.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

function scrollToId(id) {
  document.getElementById(id === "estimare" ? "estimator" : id)?.scrollIntoView({ behavior: "smooth" });
}

function SkillBar({ name, value }) {
  const reduced = useReducedMotion();
  /* The trigger cannot live on the fill. It starts at scaleX(0), which makes
     its box zero pixels wide, and IntersectionObserver reports a ratio of 0
     for a zero-area target — so `amount: 0.6` was a threshold the element
     could never reach, whatever the scroll position. The row is watched
     instead, and the fill follows it through a variant. Same trap that had
     the headings stuck behind their masks. */
  return (
    <motion.div
      className="skill-row"
      initial={reduced ? false : "empty"}
      whileInView="filled"
      viewport={{ once: true, amount: 0.6 }}
    >
      <div className="skill-label"><span>{name}</span><span>{value}%</span></div>
      <div className="skill-bar">
        <motion.div
          className="skill-fill"
          variants={{ empty: { scaleX: 0 }, filled: { scaleX: value / 100 } }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={{ transformOrigin: "left", scaleX: reduced ? value / 100 : undefined }}
        />
      </div>
    </motion.div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export function HomePage({ onNavigate }) {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [formStatus, setFormStatus] = useState("idle");
  const [selectedPrices, setSelectedPrices] = useState([]);
  const heroRef = useRef(null);
  const reduced = useReducedMotion();
  const selectedPriceItems = priceItems.filter((i) => selectedPrices.includes(i.title));
  const total = selectedPriceItems.reduce((s, i) => s + i.price, 0);
  const totalMax = selectedPriceItems.reduce((s, i) => s + (i.maxPrice || i.price), 0);

  /* The hero is the site's opening move: the footage starts as a held card
     and grows into the whole screen, then the headline settles down into the
     lower third and the rest of the copy arrives. The section is pinned and
     tall enough to give that its own beat. */
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end end"] });
  /* One scalar drives the frame; the start size lives in CSS so it can be
     set per breakpoint. Interpolating vw/vh strings here would have locked
     a 33vw card on phones, where it reads as a sliver. */
  const frameOpen = useTransform(heroProgress, [0, 0.52], [0, 1]);
  const frameScrim = useTransform(heroProgress, [0.3, 0.62], [0, 1]);
  const titleScale = useTransform(heroProgress, [0.5, 0.92], [1, 0.58]);
  const titleShift = useTransform(heroProgress, [0.5, 0.92], ["0vh", "11vh"]);
  const bodyReveal = useTransform(heroProgress, [0.62, 0.88], [0, 1]);
  const bodyShift = useTransform(heroProgress, [0.62, 0.88], [28, 0]);
  const cueFade = useTransform(heroProgress, [0, 0.12], [1, 0]);
  /* The headline crosses the frame the whole way down, so the moment it
     stops being ink on paper and starts being white on film has to be late
     and quick: at 0.39 the footage already fills 75% of the width, and by
     0.49 it is at the edges. Anywhere in between the type would be a grey
     that suits neither ground, which is why this window is narrow.
     --lit drives everything that has to turn over with it - the plates
     behind the copy and both halos on the title - so they can never drift
     out of step with the colour. */
  const heroLit = useTransform(heroProgress, [0.39, 0.49], [0, 1]);
  const heroInk = useTransform(heroProgress, [0.39, 0.49], ["#2D353C", "#FFFFFF"]);

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

  return (
    <main className="home">
      <script
        type="application/ld+json"
        // The value is built from the same constants the page renders, so it
        // cannot drift from what a reader actually sees.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <GoldLine />
      <div className="custom-cursor" aria-hidden="true" />
      <div className="custom-cursor-ring" aria-hidden="true" />
      <Progress />

      <GlobalNavigation currentPath="/studio" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      {/* --open moves up from the frame to the section so the copy can read
          it too: the plates behind the type fade in exactly as the footage
          takes the screen. The colour is driven rather than swapped, because
          the type crosses from white paper onto full-bleed film mid-scroll,
          and a hard switch would flash. */}
      <motion.section
        className="hero bg-marble"
        ref={heroRef}
        id="acasa"
        style={reduced ? undefined : { "--open": frameOpen, "--lit": heroLit, color: heroInk }}
      >
        <div className="hero-pin">
          <div className="hero-frame">
            <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true" poster="/video/poster/renaissance-sculptor-hero.jpg">
              <source src="/assets/hero-statues.mp4" type="video/mp4" />
            </video>
            <motion.span
              className="hero-frame-scrim"
              aria-hidden="true"
              style={reduced ? undefined : { opacity: frameScrim }}
            />
          </div>

          <motion.div
            className="hero-headline"
            style={reduced ? undefined : { scale: titleScale, y: titleShift }}
          >
            <Reveal as="p" className="kicker" delay={0.15}><span className="eyebrow-text">Marketing · Design · Web</span></Reveal>
            <Lines as="h1" className="hero-title" text="Îți transform ideea brută într-o experiență șlefuită cu grijă." delay={0.3} />
          </motion.div>

          <motion.div
            className="hero-body shell"
            style={reduced ? undefined : { opacity: bodyReveal, y: bodyShift }}
          >
            <p className="hero-lead">
              Așa cum sculptorul vede forma în piatră înainte ca lumea s-o vadă.
            </p>
            <div className="hero-actions">
              <button className="button primary" onClick={() => scrollToId("contact")}>Începe un proiect <ArrowRight size={16} /></button>
              <button className="button ghost" onClick={() => scrollToId("portofoliu")}>Vezi portofoliul</button>
            </div>
          </motion.div>

          <motion.div style={reduced ? undefined : { opacity: cueFade }}><ScrollCue /></motion.div>
        </div>
      </motion.section>

      {/* ── About: Renaissance material, futuristic rhythm ──────────────── */}
      <section className="home-about" id="despre-mine" aria-label="Despre Aura Dobre">
        <div className="home-about-atmosphere" aria-hidden="true" />
        <motion.figure className="home-about-portrait" initial={reduced ? false : { opacity: 0, y: 80, scale: 1.08 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: .28 }} transition={{ duration: 1.35, ease: [0.16, 1, 0.3, 1] }}>
          <motion.img src="/assets/eu-in-renascentism.jpeg" alt="Aura Dobre într-un portret renascentist contemporan" whileHover={reduced ? undefined : { scale: 1.025, y: -8 }} transition={{ duration: .7, ease: [0.16, 1, 0.3, 1] }} />
          <figcaption className="home-about-signature">
            <motion.span initial={reduced ? false : { opacity: 0, x: -22 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .8 }}>Eu sunt</motion.span>
            <motion.strong initial={reduced ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.05, delay: .08, ease: [0.16, 1, 0.3, 1] }}>Aura</motion.strong>
          </figcaption>
        </motion.figure>

        <div className="home-about-motion" aria-label="Strategie, identitate, design și experiențe digitale">
          {ABOUT_MOTION_WORDS.map((word, index) => (
            <span className="home-about-motion-line" key={word}>
              <motion.b
                animate={reduced ? undefined : { x: ["-108%", "0%", "0%", "8%"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 6.4, delay: index * .28, repeat: Infinity, repeatDelay: .8, ease: [0.16, 1, 0.3, 1], times: [0, .16, .78, 1] }}
              >{word}</motion.b>
            </span>
          ))}
        </div>

        <motion.div className="home-about-copy" initial={reduced ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .9, delay: .25 }}>
          <p>Designer, marketer și sculptor digital. Modelez identități care unesc strategia, estetica și tehnologia.</p>
          <span>Aura Dobre · fondator Aura&apos;s Digital Dream</span>
        </motion.div>
      </section>

      <section className="marquee-band" aria-hidden="true">
        <Marquee text="CREAȚIE  ·  IDENTITATE  ·  STRATEGIE  ·  EXPERIENȚE DIGITALE  ·  " angle={0} speed={0.22} repeat={3} />
      </section>

      {/* ── Chapters: the working method ─────────────────────────────────── */}
      <Chapters
        id="proces"
        className="method bg-ink-marble"
        items={chapters}
        renderMedia={(item) => (
          <>
            <video autoPlay muted loop playsInline preload="metadata" poster={item.poster || undefined} aria-hidden="true">
              <source src={item.video} type="video/mp4" />
            </video>
            <span className="chapter-scrim" aria-hidden="true" />
          </>
        )}
        renderCopy={(item) => (
          <>
            <p className="kicker"><span className="eyebrow-text">Scena {item.number} — {item.title}</span></p>
            <h2 className="chapter-headline">{item.headline}</h2>
            <p className="chapter-body">{item.copy}</p>
            <span className="chapter-meta">{item.meta}</span>
          </>
        )}
      />

      <ProjectIndex items={projects} onNavigate={onNavigate} />

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section className="services gilt bg-marble is-deep bloom flip" id="servicii">
        <div className="shell">
          <div className="section-head reveal-on-scroll">
            <p className="kicker reveal-child"><span className="eyebrow-text">Servicii</span></p>
            <h2 className="section-title reveal-child">Nu livrez servicii. Livrez transformări.</h2>
            <p className="section-lead reveal-child">
                Adun sub un singur acoperiș tot ce dă viață unei prezențe: identitate,
                strategie, design, experiență.
              </p>
          </div>
          <div className="service-grid reveal-on-scroll">
            {services.map(({ icon: Icon, title, subtitle, copy, list, benefits, price }, index) => (
              <div key={title} className="service-card glass-panel is-frost is-tilted reveal-child">
                <span className="service-icon"><Icon size={24} /></span>
                <h3>{title}</h3>
                <p className="service-subtitle"><span className="eyebrow-text">{subtitle}</span></p>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────── */}
      <section className="process bg-marble">
        <div className="shell">
          <div className="section-head reveal-on-scroll">
            <p className="kicker reveal-child"><span className="eyebrow-text">Proces de lucru</span></p>
            <h2 className="section-title reveal-child">De la idee, la realitate.</h2>
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
      <section className="estimator bg-marble is-deep bloom" id="estimator">
        <div className="shell">
          <div className="section-head reveal-on-scroll">
            <p className="kicker reveal-child"><span className="eyebrow-text">Estimator de cost</span></p>
            <h2 className="section-title reveal-child">Estimează-ți bugetul.</h2>
            <p className="section-lead reveal-child">
                Selectează serviciile de care ai nevoie și obții imediat o estimare orientativă.
                Prețul final se stabilește după o discuție personalizată.
              </p>
          </div>
          <div className="estimator-grid">
            <div className="price-list reveal-on-scroll" role="group" aria-label="Servicii disponibile">
              {priceItems.map((item) => {
                const on = selectedPrices.includes(item.title);
                return (
                  <button
                    key={item.title}
                    type="button"
                    className={"price-item glass-panel is-frost is-tilted reveal-child" + (on ? " is-on" : "")}
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
              <p className="kicker"><span className="eyebrow-text">Estimare totală</span></p>
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

      {/* ── Editorial break ──────────────────────────────────────────────── */}
      <section className="editorial" aria-label="Direcție de artă">
        <Depth speed={0.18} className="editorial-media">
          <video
            autoPlay muted loop playsInline preload="metadata"
            poster="/video/poster/aura-creative-showreel.jpg"
            aria-hidden="true"
          >
            <source src="/video/aura-creative-showreel.mp4" type="video/mp4" />
          </video>
        </Depth>
        <span className="editorial-scrim" aria-hidden="true" />
        <div className="shell editorial-body reveal-on-scroll">
          <p className="kicker reveal-child"><span className="eyebrow-text">Behind the Dream</span></p>
          <h2 className="section-title reveal-child">Imaginile vorbesc înaintea cuvintelor.</h2>
          <Rise delay={0.2}>
            <p>Am pornit dintr-o dorință simplă: să transform ideile în experiențe care se simt, nu doar se văd.</p>
          </Rise>
        </div>
      </section>

      {/* ── Skills ───────────────────────────────────────────────────────── */}
      <section className="skills bg-marble" id="skills">
        <div className="shell">
          <div className="section-head reveal-on-scroll">
            <p className="kicker reveal-child"><span className="eyebrow-text">Skills & competențe</span></p>
            <h2 className="section-title reveal-child">Instrumente stăpânite.</h2>
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

      {/* ── Difference: what you get elsewhere vs here ───────────────────── */}
      <section className="difference bg-ink-marble bloom" id="de-ce-eu">
        <div className="shell">
          <div className="section-head reveal-on-scroll">
            <p className="kicker reveal-child"><span className="eyebrow-text">Diferența</span></p>
            <h2 className="section-title reveal-child">Un livrabil se termină. Un sistem rămâne.</h2>
            <p className="section-lead reveal-child">
                Cei mai mulți îți trimit fișierele și dispar. Eu îți las în urmă o structură
                pe care o poți folosi și fără mine, peste șase luni, când apare materialul
                la care nimeni nu se gândise.
              </p>
          </div>
          <div className="difference-grid">
            <Rise className="difference-col">
              <h3>De obicei primești</h3>
              <p>Un livrabil. Atât.</p>
              <ul className="difference-list">
                <li>Un logo trimis pe email, fără nicio explicație despre cum se folosește.</li>
                <li>Culori alese pentru că arătau bine în ziua aceea, nu pentru că spun ceva.</li>
                <li>Un site care seamănă cu alte zece mii de site-uri.</li>
                <li>Materiale care nu se leagă între ele când le pui unul lângă altul.</li>
              </ul>
              <figure className="difference-figure">
                <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true" poster="/video/poster/stone-hand-dust.jpg">
                  <source src="/video/stone-hand-dust.mp4" type="video/mp4" />
                </video>
              </figure>
            </Rise>
            <Rise className="difference-col is-mine" delay={0.12}>
              <h3>De la mine primești</h3>
              <p>Un sistem care ține.</p>
              <ul className="difference-list">
                <li>O direcție argumentată: de ce culoarea asta, de ce fontul ăsta, de ce ritmul ăsta.</li>
                <li>Reguli scrise, pe care le poți aplica singură oricând.</li>
                <li>Storytelling construit pe ce te diferențiază pe tine, nu pe ce e la modă.</li>
                <li>Fiecare material se recunoaște ca parte din același brand.</li>
              </ul>
              <figure className="difference-figure">
                <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true" poster="/video/poster/about-renaissance-studio.jpg">
                  <source src="/video/about-renaissance-studio.mp4" type="video/mp4" />
                </video>
              </figure>
            </Rise>
          </div>
        </div>
      </section>

      {/* ── Clarity: FAQ + comparison ────────────────────────────────────── */}
      <section className="clarity bg-ink-marble" id="claritate">
        <div className="shell">
          <div className="section-head reveal-on-scroll">
            <p className="kicker reveal-child"><span className="eyebrow-text">Claritate înainte de ofertă</span></p>
            <h2 className="section-title reveal-child">Nu te las să alegi la întâmplare. Îți arăt drumul.</h2>
            <p className="section-lead reveal-child">
                Fiecare secțiune din site răspunde unei întrebări reale: ce primești, cât costă,
                cum lucrăm și unde vezi exemple.
              </p>
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
      <section className="voices bg-marble bloom flip">
        <div className="shell">
          <div className="section-head reveal-on-scroll">
            <p className="kicker reveal-child"><span className="eyebrow-text">Testimoniale</span></p>
            <h2 className="section-title reveal-child">Ce spun clienții.</h2>
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
      <section className="books gilt bg-marble bloom" id="amazon-picks">
        <div className="shell books-grid">
          <div className="reveal-on-scroll">
            <p className="kicker reveal-child"><span className="eyebrow-text">Aura Dobre · Author Universe</span></p>
            <h2 className="section-title reveal-child">Cărțile mele au acum pagina lor.</h2>
            <Rise delay={0.15}>
              <p className="section-lead">
                Am separat vitrina literară într-o pagină dedicată, unde cărțile scrise de mine pot
                respira ca lumi vizuale separate. Dark romance, thrillere psihologice și povești
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
          <video autoPlay muted loop playsInline preload="metadata" poster="/video/poster/atelier-statue-seams.jpg">
            <source src="/video/atelier-statue-seams.mp4" type="video/mp4" />
          </video>
          <span className="contact-scrim" />
        </div>
        <div className="shell contact-grid">
          <div className="contact-copy reveal-on-scroll">
            {/* A face before the promise of an answer: whoever writes here
                should be able to see who reads it. */}
            <figure className="contact-portrait reveal-child">
              <img
                src="/assets/aura-dobre.webp"
                srcSet="/assets/aura-dobre-mic.webp 360w, /assets/aura-dobre.webp 720w"
                sizes="(max-width: 720px) 132px, 168px"
                width="720" height="720" loading="lazy" decoding="async"
                alt="Aura Dobre"
              />
              <figcaption>
                <strong>Aura Dobre</strong>
                <span>Îți răspund personal</span>
              </figcaption>
            </figure>
            <p className="kicker reveal-child"><span className="eyebrow-text">Contact</span></p>
            <h2 className="section-title reveal-child">Hai să sculptăm împreună ideea ta.</h2>
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
            <motion.form
              id="contact-form"
              onSubmit={submitContact}
              initial={reduced ? false : "hidden"}
              whileInView={reduced ? undefined : "visible"}
              viewport={{ once: true, amount: 0.2 }}
              variants={FORM_STAGGER}
            >
              <input className="honeypot" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" />
              <motion.div className="form-row" variants={FIELD}>
                <input required name="name" maxLength="80" autoComplete="name" placeholder="Numele tău" />
                <input required name="email" maxLength="120" type="email" autoComplete="email" placeholder="Email" />
              </motion.div>
              <motion.input variants={FIELD} name="phone" maxLength="30" inputMode="tel" autoComplete="tel" placeholder="Telefon" />
              <motion.select variants={FIELD} name="service" defaultValue="" aria-label="Pachetul care te interesează">
                <option value="" disabled>Alege pachetul potrivit</option>
                <option>Pachet Start-up</option>
                <option>Pachet Rebranding</option>
                <option>Pachet Website</option>
                <option>Pachet Social Media</option>
                <option>Pachet Documente Profesionale</option>
                <option>Nu sunt sigură încă</option>
              </motion.select>
              <motion.textarea variants={FIELD} required name="message" minLength="15" maxLength="2000" placeholder="Descrie pe scurt proiectul tău..." />
              <motion.div className="form-actions" variants={FIELD}>
                <button className="button primary" type="submit" disabled={formStatus === "sending"}>
                  {formStatus === "sending" ? "Se trimite..." : "Trimite pe email"} <ArrowRight size={16} />
                </button>
                <button className="button ghost" type="button" onClick={submitWhatsapp}>
                  <WhatsappLogo size={18} /> Trimite pe WhatsApp
                </button>
              </motion.div>
              {formStatus === "success" && <p className="form-notice is-success" role="status">Mesajul a fost trimis. Îți voi răspunde în maximum 24 de ore.</p>}
              {formStatus === "error" && <p className="form-notice is-error" role="alert">Trimiterea nu a reușit. Te rog folosește butonul WhatsApp.</p>}
              <small className="form-privacy">
                Prin trimitere ești de acord ca datele să fie procesate de FormSubmit exclusiv
                pentru livrarea mesajului către mine.
              </small>
            </motion.form>
          </Rise>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="site-footer bg-ink-marble" id="footer">
        <div className="footer-image" aria-hidden="true">
          <img src="/assets/footer-bg.jpg" alt="" />
        </div>
        <div className="footer-plinth">
          <div className="shell footer-grid">
            <div className="footer-brand">
              <img src="/assets/logo.jpg" alt="" aria-hidden="true" />
              <div>
                <strong>Aura's Digital Dream</strong>
                <p>Marketing, design și soluții digitale, cu suflet.</p>
              </div>
            </div>
            <nav className="footer-social" aria-label="Rețele sociale">
              <a href="https://www.instagram.com/aurasdigitaldream" aria-label="Instagram"><InstagramLogo size={20} /></a>
              <a href="https://www.facebook.com/auratrendvault" aria-label="Facebook"><FacebookLogo size={20} /></a>
              <a href="https://www.tiktok.com/@aurasdigitaldream" aria-label="TikTok"><TiktokLogo size={20} /></a>
              <a href="https://www.linkedin.com/in/aurelia-dobre-a033b2104" aria-label="LinkedIn"><LinkedinLogo size={20} /></a>
              <a href="https://wa.me/40762509423" aria-label="WhatsApp"><WhatsappLogo size={20} /></a>
            </nav>
            <p className="footer-legal">© 2026 Aura's Digital Dream. Toate drepturile rezervate.</p>
          </div>
        </div>
      </footer>

      <a className="whatsapp-fab" href="https://wa.me/40762509423" aria-label="Scrie-mi pe WhatsApp">
        <WhatsappLogo size={26} weight="fill" />
      </a>
    </main>
  );
}
