import { useEffect, useState, useRef } from "react";
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, CaretLeft, CaretRight, Check, Code, FileText, InstagramLogo, LinkedinLogo, List, Megaphone, Palette, Phone, WhatsappLogo, X } from "@phosphor-icons/react";

// ── Animation primitives ─────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

function TiltCard({ children, className = "", delay = 0 }) {
  const tx = useMotionValue(0), ty = useMotionValue(0);
  const rx = useSpring(tx, { stiffness: 200, damping: 22 });
  const ry = useSpring(ty, { stiffness: 200, damping: 22 });
  return (
    <motion.div className={className}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 42, scale: 0.96, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={e => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
        tx.set(((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -7);
        ty.set(((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 7);
      }}
      onMouseLeave={() => { tx.set(0); ty.set(0); }}>
      {children}
    </motion.div>
  );
}

function ParallaxY({ children, strength = 0.1 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-" + (strength * 100) + "%", (strength * 100) + "%"]);
  return <div ref={ref} style={{ overflow: "hidden", position: "relative" }}><motion.div style={{ y }}>{children}</motion.div></div>;
}

function SkillBar({ name, value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  return (
    <div ref={ref} className="skill-row">
      <div className="skill-label"><span>{name}</span><span>{value}%</span></div>
      <div className="skill-bar">
        <motion.div className="skill-fill"
          initial={{ width: 0 }}
          animate={inView ? { width: value + "%" } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} />
      </div>
    </div>
  );
}

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
const featuredSlugs = ["auras-trend-vault", "verde-bean", "real-estate-co", "campanie-social-media-luxe"];
const featuredCardAssets = { "auras-trend-vault": "/portfolio/auras-trend-vault/editorial-2026/vogue-cover.jpeg" };
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

function scrollToId(id) {
  const targetId = id === "estimare" ? "estimator" : id;
  document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
}

// ── Main component ───────────────────────────────────────────────────────────
export function HomePage({ onNavigate, onSection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [formStatus, setFormStatus] = useState("idle");
  const [selectedPrices, setSelectedPrices] = useState([]);

  const nav = [["Servicii", "servicii"], ["Portofoliu", "portofoliu"], ["Cărțile mele", "/cartile-mele"], ["Prețuri", "estimator"], ["Contact", "contact"]];
  const featured = projects.filter(p => featuredSlugs.includes(p.slug));
  const groupedProjects = portfolioGroups.map(g => ({ ...g, projects: g.slugs.map(s => projects.find(p => p.slug === s)).filter(Boolean) }));
  const storySceneNames = ["one", "two", "three"];
  const storySteps = [
    {
      number: "01",
      title: "Ascult",
      label: "Atelier vechi · marmură",
      video: "/video/story-ascult-workshop.mp4",
      headline: <>Nu pornesc de la tendințe. <em>Pornesc de la tine.</em></>,
      copy: "Îți ascult ideea, contextul, publicul și tensiunea din spatele brandului înainte să desenez direcția.",
      quote: "Nu pornesc de la tendințe. Pornesc de la tine.",
    },
    {
      number: "02",
      title: "Imaginez",
      label: "Palmă · lumină aurie",
      video: "/video/story-imaginez-golden-hand.mp4",
      headline: <>Ideile tale devin <em>formă, lumină și experiență.</em></>,
      copy: "Transform informația în concept vizual: culori, ritm, ierarhie, atmosferă și primul fir de storytelling.",
      quote: "Ideile tale devin formă, lumină și experiență.",
    },
    {
      number: "03",
      title: "Construiesc",
      label: "Birou modern · lumină rece",
      video: "/video/story-construiesc-modern-office.mp4",
      headline: <>Construiesc sisteme care <em>se simt vii.</em></>,
      copy: "Aduc totul într-o experiență clară, responsive și premium: identitate, website, campanie sau material digital.",
      quote: "Fiecare detaliu trebuie să conducă spre emoție, claritate și acțiune.",
    },
  ];
  const portfolioThumbVideos = [
    "/video/story-ascult-workshop.mp4",
    "/video/story-imaginez-golden-hand.mp4",
    "/video/story-construiesc-modern-office.mp4",
  ];
  const selectedPriceItems = priceItems.filter(i => selectedPrices.includes(i.title));
  const total = selectedPriceItems.reduce((s, i) => s + i.price, 0);
  const totalMax = selectedPriceItems.reduce((s, i) => s + (i.maxPrice || i.price), 0);

  function togglePrice(title) { setSelectedPrices(c => c.includes(title) ? c.filter(t => t !== title) : [...c, title]); }

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

  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 760], ["-2%", "10%"]);
  const heroTextY = useTransform(scrollY, [0, 760], ["0%", "-18%"]);
  const heroParticleY = useTransform(scrollY, [0, 760], ["0%", "42%"]);
  const heroVideoScale = useTransform(scrollY, [0, 760], [1.02, 1.11]);
  const heroDistortion = useTransform(scrollY, [0, 760], ["brightness(1.08) saturate(1.08) contrast(1.05)", "brightness(1.14) saturate(1.16) contrast(1.12) hue-rotate(-2deg)"]);
  const heroOpacity = useTransform(scrollY, [0, 560], [1, 0]);

  const heroStagger = { hidden: {}, visible: { transition: { staggerChildren: 0.14, delayChildren: 0.5 } } };
  const heroItem = { hidden: { opacity: 0, y: 32, filter: "blur(8px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } };
  const heroTitle = "Aura's Digital Dream";
  const heroLetters = heroTitle.split("");
  const floatingLogos = ["AD", "SEO", "UX", "3D", "WEB", "AI"];
  const aboutRef = useRef(null);
  const aboutVideoRef = useRef(null);
  const behindRef = useRef(null);
  const { scrollYProgress: aboutProgress } = useScroll({ target: aboutRef, offset: ["start end", "end start"] });
  const aboutVideoScale = useTransform(aboutProgress, [0, 0.5, 1], [1.16, 1.04, 1.12]);
  const aboutVideoFilter = useTransform(aboutProgress, [0, 0.5, 1], ["brightness(.52) saturate(.95) contrast(1.05)", "brightness(.86) saturate(1.08) contrast(1.12)", "brightness(.48) saturate(.92) contrast(1.08)"]);
  const aboutPortraitY = useTransform(aboutProgress, [0, 1], ["8%", "-10%"]);
  const aboutPortraitRotate = useTransform(aboutProgress, [0, 1], [-3, 3]);
  const aboutMask = useTransform(aboutProgress, [0, 0.18, 0.56, 0.82], ["inset(0 100% 0 0 round 28px)", "inset(0 18% 0 0 round 28px)", "inset(0 0% 0 0 round 28px)", "inset(0 0% 0 0 round 28px)"]);
  const { scrollYProgress: behindProgress } = useScroll({ target: behindRef, offset: ["start end", "end start"] });
  const behindLightY = useTransform(behindProgress, [0, 1], ["12%", "-16%"]);
  const behindStudioY = useTransform(behindProgress, [0, 1], ["-8%", "10%"]);
  const behindHandY = useTransform(behindProgress, [0, 1], ["18%", "-12%"]);
  const behindGlow = useTransform(behindProgress, [0, 0.5, 1], [0.24, 0.74, 0.32]);
  const behindText = "Aura’s Digital Dream s-a născut dintr-o obsesie: să transform ideile în experiențe care se simt, nu doar se văd.";
  const storyRef = useRef(null);
  const storyVideoRef = useRef(null);
  const storyStepVideoRefs = useRef([]);
  const { scrollYProgress: storyProgress } = useScroll({ target: storyRef, offset: ["start start", "end end"] });
  const storyVideoScale = useTransform(storyProgress, [0, 0.5, 1], [1.08, 1.16, 1.04]);
  const storyVideoOpacity = useTransform(storyProgress, [0, 0.08, 0.88, 1], [0, 0.85, 0.85, 0]);
  const storyDepthNear = useTransform(storyProgress, [0, 1], ["-8%", "18%"]);
  const storyDepthMid = useTransform(storyProgress, [0, 1], ["10%", "-22%"]);
  const storyDepthFar = useTransform(storyProgress, [0, 1], ["22%", "-10%"]);
  const storyBlackout = useTransform(storyProgress, [0, 0.28, 0.5, 0.72, 1], [0.18, 0.45, 0.12, 0.5, 0.78]);
  const storySceneOne = useTransform(storyProgress, [0, 0.12, 0.28, 0.4], [0, 1, 1, 0]);
  const storySceneTwo = useTransform(storyProgress, [0.28, 0.42, 0.58, 0.7], [0, 1, 1, 0]);
  const storySceneThree = useTransform(storyProgress, [0.58, 0.72, 0.9, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const video = storyVideoRef.current;
    const unsubscribe = storyProgress.on("change", (progress) => {
      if (video && Number.isFinite(video.duration)) {
        video.currentTime = Math.min(video.duration - 0.05, Math.max(0, progress * video.duration));
      }
      storyStepVideoRefs.current.forEach((stepVideo, index) => {
        if (!stepVideo || !Number.isFinite(stepVideo.duration)) return;
        const localProgress = Math.min(1, Math.max(0, (progress - index / 3) * 3));
        stepVideo.currentTime = Math.min(stepVideo.duration - 0.05, Math.max(0, localProgress * stepVideo.duration));
      });
    });
    return unsubscribe;
  }, [storyProgress]);

  useEffect(() => {
    const video = aboutVideoRef.current;
    const unsubscribe = aboutProgress.on("change", (progress) => {
      if (!video || !Number.isFinite(video.duration)) return;
      video.currentTime = Math.min(video.duration - 0.05, Math.max(0, progress * video.duration));
    });
    return unsubscribe;
  }, [aboutProgress]);

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

  const serif = { fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "1px" };

  return (
    <main>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="custom-cursor" aria-hidden="true" />
      <div className="custom-cursor-ring" aria-hidden="true" />

      <motion.header className="site-header"
        initial={{ opacity: 0, y: -22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
        <button className="brand" onClick={e => onSection(e, "acasa")}>
          <img src="/assets/logo.jpg" alt="Aura's Digital Dream" />
          <span>Aura's <em>Digital</em> Dream</span>
        </button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Deschide meniul">
          {menuOpen ? <X /> : <List />}
        </button>
        <nav className={menuOpen ? "open" : ""}>
          {nav.map(([label, id]) => (
            <button key={id} onClick={e => { id.startsWith("/") ? onNavigate(e, id) : onSection(e, id); setMenuOpen(false); }}>{label}</button>
          ))}
        </nav>
      </motion.header>

      <section className="hero" id="acasa">
        <motion.div className="hero-motion hero-video-layer" style={{ y: heroBgY, filter: heroDistortion, scale: heroVideoScale }}>
          <video autoPlay muted loop playsInline preload="metadata" className="hero-cinematic-video">
            <source src="/video/renaissance-sculptor-hero.mp4" type="video/mp4" />
          </video>
        </motion.div>
        <motion.div className="hero-motion hero-orb-layer" style={{ y: heroParticleY }}>
          <div className="hero-light" aria-hidden="true" />
          <div className="hero-gold-veins" aria-hidden="true"><span /><span /><span /></div>
          <div className="hero-renaissance-frame" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="hero-dust-field" aria-hidden="true">
            {Array.from({ length: 28 }).map((_, index) => <b key={index} style={{ "--i": index }} />)}
          </div>
          <div className="hero-particles" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, index) => <span key={index} style={{ "--i": index }} />)}
          </div>
          <div className="hero-floating-logos" aria-hidden="true">
            {floatingLogos.map((logo, index) => <i key={logo} style={{ "--i": index }}>{logo}</i>)}
          </div>
        </motion.div>
        <div className="hero-overlay" />
        <motion.div className="hero-content hero-cinematic-content" variants={heroStagger} initial="hidden" animate="visible" style={{ opacity: heroOpacity, y: heroTextY }}>
          <motion.p variants={heroItem} className="eyebrow hero-kicker">Atelier digital renascentist</motion.p>
          <motion.h1 className="hero-letter-title" aria-label={heroTitle} style={serif}>
            {heroLetters.map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                aria-hidden="true"
                initial={{ opacity: 0, y: 34, rotateX: -75, filter: "blur(14px)" }}
                animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.85, delay: 0.45 + index * 0.035, ease: [0.16, 1, 0.3, 1] }}
                className={letter === " " ? "hero-letter-space" : undefined}
                style={{ "--letter-index": index }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p variants={heroItem} className="hero-copy hero-sculptor-copy">transformă ideea ta brută într-o experiență digitală șlefuită cu grijă — așa cum un sculptor vede forma din piatră înainte ca lumea s-o vadă.</motion.p>
          <motion.div variants={heroItem} className="hero-actions">
            <button className="button primary" onClick={() => scrollToId("contact")}>Hai să lucrăm împreună</button>
            <button className="button ghost" onClick={() => scrollToId("portofoliu")}>Vezi portofoliul</button>
            <button className="button ghost" onClick={e => onNavigate(e, "/cartile-mele")}>Cărțile mele</button>
          </motion.div>
          <motion.div variants={heroItem} className="hero-proof-strip" aria-label="Servicii principale">
            <span>Brand strategy</span>
            <span>Web cinematic</span>
            <span>Visual identity</span>
          </motion.div>
        </motion.div>
        <motion.button className="scroll-mark" onClick={() => scrollToId("despre")} aria-label="Derulează mai jos"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 1 }}>↓</motion.button>
      </section>

      <div className="story-marquee" aria-hidden="true">
        <div>STRATEGIE <i>✶</i> IDENTITATE <i>✶</i> EXPERIENȞE DIGITALE <i>✶</i> BRANDING <i>✶</i> WEB <i>✶</i> MARKETING <i>✶</i> STRATEGIE <i>✶</i> IDENTITATE <i>✶</i> EXPERIENȞE DIGITALE <i>✶</i></div>
      </div>

      <section ref={aboutRef} className="about-scene" id="despre" aria-label="Despre Aura">
        <motion.div className="about-scene-video" style={{ scale: aboutVideoScale, filter: aboutVideoFilter }}>
          <video ref={aboutVideoRef} muted playsInline preload="auto" className="about-scroll-video">
            <source src="/video/about-renaissance-studio.mp4" type="video/mp4" />
          </video>
        </motion.div>
        <div className="about-scene-overlay" />
        <motion.div className="about-portrait-card" style={{ y: aboutPortraitY, rotate: aboutPortraitRotate }}>
          <img src="/assets/aura-cinematic-portrait.jpeg" alt="Aura Dobre într-un portret editorial cinematic" />
          <span className="about-portrait-glow" aria-hidden="true" />
        </motion.div>
        <motion.div className="about-scene-copy" style={{ clipPath: aboutMask }}>
          <p className="section-kicker">Despre mine</p>
          <h2 style={serif}>Sunt Aura — designer, marketer şi <em>sculptor digital.</em></h2>
          <p className="about-manifesto">Nu creez proiecte. Modelez identități.</p>
          <p>Fiecare brand are o formă ascunsă. Eu o scot la lumină.</p>
          <button className="button ghost" onClick={() => scrollToId("servicii")}>Vezi cum lucrăm <ArrowRight size={16} /></button>
        </motion.div>
      </section>

      <motion.section ref={storyRef} className="story-section trailer-story-section" data-scroll-story aria-label="Povestea procesului creativ" style={{ "--story-progress": storyProgress, "--scene-one": storySceneOne, "--scene-two": storySceneTwo, "--scene-three": storySceneThree }}>
        <div className="story-stage">
          <motion.div className="story-video-layer" style={{ opacity: storyVideoOpacity, scale: storyVideoScale }}>
            <video ref={storyVideoRef} muted playsInline preload="auto" className="story-scroll-video">
              <source src="/video/story-trailer-scroll.mp4" type="video/mp4" />
            </video>
            <motion.div className="story-cinematic-blackout" style={{ opacity: storyBlackout }} />
          </motion.div>
          <div className="story-visuals story-video-scenes" aria-hidden="true">
            <div className="story-step-videos">
              {storySteps.map((step, index) => (
                <motion.figure
                  key={step.number}
                  className={`story-step-video-card scene-${index + 1}`}
                  style={{ y: index === 0 ? storyDepthNear : index === 1 ? storyDepthMid : storyDepthFar, z: index === 1 ? 120 : 70 }}
                >
                  <video ref={(el) => { storyStepVideoRefs.current[index] = el; }} muted playsInline preload="auto">
                    <source src={step.video} type="video/mp4" />
                  </video>
                  <figcaption><span>{step.number}</span>{step.label}</figcaption>
                </motion.figure>
              ))}
            </div>
            <motion.div className="story-sculpture" style={{ y: storyDepthMid }}>
              <span className="petal p1" /><span className="petal p2" /><span className="petal p3" /><span className="petal p4" />
              <i className="orbit o1" /><i className="orbit o2" /><i className="orbit o3" /><b className="sculpture-core" />
            </motion.div>
            <div className="story-glow" />
          </div>
          <div className="story-copy story-cinematic-copy">
            <p className="section-kicker">Din idee în experiență</p>
            {storySteps.map((step, index) => (
              <motion.article key={step.number} className={`scene-${storySceneNames[index]} story-step-copy`}>
                <span>{step.number} / {step.title}</span>
                <h2 style={serif}>{step.headline}</h2>
                <p>{step.copy}</p>
                <blockquote>„{step.quote}”</blockquote>
              </motion.article>
            ))}
            <div className="story-counter"><b>0<span /></b><i /><small>03</small></div>
          </div>
        </div>
      </motion.section>

      <section className="section dark services-premium" id="servicii">
        <div className="services-heading">
        <FadeUp><p className="section-kicker">Servicii</p></FadeUp>
        <FadeUp delay={0.1}><h2 style={serif}>Tot ce ai nevoie, <em>sub un singur acoperis.</em></h2></FadeUp>
        <FadeUp delay={0.18}><p className="section-copy">De la identitate vizuală şi web la documente şi social media — construiesc tot ce are nevoie un brand pentru a arăta şi comunica profesionist.</p></FadeUp>
        </div>
        <div className="service-grid">
          {services.map(({ icon: Icon, title, subtitle, copy, list, benefits, price }, index) => (
            <TiltCard key={title} className="service-card premium-service-card" delay={index * 0.08}>
              <div className="service-icon"><Icon size={28} /></div>
              <h3>{title}</h3>
              <p className="service-subtitle">{subtitle}</p>
              <p>{copy}</p>
              <ul>{list.map(item => <li key={item}><Check size={13} weight="bold" /> {item}</li>)}</ul>
              <ul className="benefit-list">{benefits.map(b => <li key={b}>✶ {b}</li>)}</ul>
              <p className="price-tag">{price}</p>
              <button className="button primary small" onClick={() => scrollToId("contact")}>Solicită ofertă <ArrowRight size={14} /></button>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="section estimator" id="estimator">
        <FadeUp><p className="section-kicker">Estimator de cost</p></FadeUp>
        <FadeUp delay={0.1}><h2 style={serif}>Estimează-ți <em>bugetul.</em></h2></FadeUp>
        <FadeUp delay={0.15}><p className="section-copy">Selectează serviciile de care ai nevoie şi obții imediat o estimare orientativă. Prețul final se stabileste după o discuție personalizată.</p></FadeUp>
        <div className="estimator-grid">
          <div className="price-list">
            {priceItems.map(item => (
              <motion.button key={item.title}
                className={"price-item" + (selectedPrices.includes(item.title) ? " selected" : "")}
                onClick={() => togglePrice(item.title)}
                whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
                <div><strong>{item.title}</strong><p>{item.copy}</p></div>
                <span>{item.price.toLocaleString("ro")} {item.unit || "RON"}{item.maxPrice ? " – " + item.maxPrice.toLocaleString("ro") + " RON" : ""}</span>
              </motion.button>
            ))}
          </div>
          <div className="price-summary">
            <p className="section-kicker">Estimare totală</p>
            {selectedPriceItems.length === 0
              ? <p>Selectează serviciile pentru a vedea estimarea.</p>
              : <>
                  <ul>{selectedPriceItems.map(i => <li key={i.title}><span>{i.title}</span><span>{i.price.toLocaleString("ro")} – {(i.maxPrice || i.price).toLocaleString("ro")} {i.unit || "RON"}</span></li>)}</ul>
                  <div className="price-total"><strong>Total estimat</strong><span>{total.toLocaleString("ro")} – {totalMax.toLocaleString("ro")} RON</span></div>
                  <p className="price-note">Preț orientativ. Oferta finală se trimite după o discuție despre proiect.</p>
                  <button className="button primary" onClick={() => scrollToId("contact")}>Solicită ofertă personalizată <ArrowRight size={16} /></button>
                </>
            }
          </div>
        </div>
      </section>

      <section className="section skills" id="skills">
        <FadeUp><p className="section-kicker">Skills & Competențe</p></FadeUp>
        <FadeUp delay={0.1}><h2 style={serif}>Instrumente <em>stăpânite.</em></h2></FadeUp>
        <div className="skill-columns">
          {[
            ["Design & Creație", [["Canva (avansat)", 98], ["Editare foto", 80], ["Design Thinking", 88]]],
            ["Web & Tehnic", [["Wix", 95], ["WebWave", 90], ["Dezvoltare aplicații web", 78], ["SEO de bază", 82]]],
            ["Marketing & AI", [["Meta Business Suite", 92], ["Copywriting", 95], ["AI avansat (prompting)", 96]]],
          ].map(([title, rows]) => (
            <FadeUp key={title} className="skill-card">
              <h3>{title}</h3>
              {rows.map(([name, value]) => <SkillBar key={name} name={name} value={value} />)}
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="golden-interlude" aria-label="Artă digitală şi storytelling vizual">
        <ParallaxY strength={0.1}>
          <img className="golden-backdrop" src="/assets/editorial/golden-portrait-clean.jpg" alt="" aria-hidden="true" style={{ width: "100%", objectFit: "cover", display: "block" }} />
        </ParallaxY>
        <div className="golden-shade" aria-hidden="true" />
        <FadeUp className="golden-copy">
          <p className="section-kicker">Artă care opreşte scroll-ul</p>
          <h2 style={serif}>Imaginile vorbesc <em>înaintea cuvintelor.</em></h2>
          <p>Fotografie editorială, direcție de artă şi identitate vizuală pentru branduri care vor să fie simțite, nu doar văzute.</p>
          <button className="button primary" onClick={() => scrollToId("portofoliu")}>Explorează portofoliul <ArrowRight size={15} /></button>
        </FadeUp>
        <span className="golden-number" aria-hidden="true">ART / 01</span>
      </section>

      <section className="section portfolio" id="portofoliu">
        <div className="portfolio-heading">
          <FadeUp><p className="section-kicker">Selecție curatorială</p><h2 style={serif}>Proiecte care nu doar arată bine — <em>ci spun ceva.</em></h2></FadeUp>
        </div>
        <div className="featured-projects cinematic-featured-projects">
          {featured.map((project, index) => (
            <TiltCard key={project.slug} className="featured-project cinematic-project-card" delay={index * 0.08}>
              <a href={"/portofoliu/" + project.slug} data-reveal onClick={e => onNavigate(e, "/portofoliu/" + project.slug)}>
                <video className="portfolio-thumb-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
                  <source src={portfolioThumbVideos[index % portfolioThumbVideos.length]} type="video/mp4" />
                </video>
                <img src={featuredCardAssets[project.slug] || project.image} alt={project.title} />
                <span className="portfolio-card-grain" aria-hidden="true" />
                <span className="portfolio-card-orbit" aria-hidden="true" />
                <div className="featured-project-copy">
                  <span>{project.category.join(" · ")}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <span className="link-cta">Vezi proiectul <ArrowRight size={14} /></span>
                </div>
              </a>
            </TiltCard>
          ))}
        </div>
        <FadeUp className="archive-head">
          <p className="section-kicker">Portofoliu organizat</p>
          <h2 style={serif}>Alege direcția care <em>te reprezintă.</em></h2>
        </FadeUp>
        <div className="portfolio-groups">
          {groupedProjects.map(group => (
            <FadeUp key={group.title} className="portfolio-group">
              <div className="portfolio-group-head"><span>{group.title}</span><p>{group.copy}</p></div>
              <div className="project-grid compact">
                {group.projects.map((project, index) => (
                  <motion.a key={project.slug} className="project-card compact-cinematic-card" data-reveal
                    href={"/portofoliu/" + project.slug}
                    onClick={e => onNavigate(e, "/portofoliu/" + project.slug)}
                    whileHover={{ y: -5, transition: { duration: 0.25 } }}>
                    <video className="compact-project-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
                      <source src={portfolioThumbVideos[index % portfolioThumbVideos.length]} type="video/mp4" />
                    </video>
                    <img src={project.image} alt={project.title} loading="lazy" />
                    <span className="portfolio-card-grain" aria-hidden="true" />
                    <div><span>{project.category.join(" · ")}</span><h4>{project.title}</h4></div>
                  </motion.a>
                ))}
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="creative-direction">
        <FadeUp className="creative-direction-copy">
          <p className="section-kicker">Creative Direction</p>
          <h2 style={serif}>O poveste vizuală <em>completă.</em></h2>
          <p>Direcție de artă, fotografie editorială şi estetică de brand construite cu intenție şi coerență.</p>
        </FadeUp>
        <figure className="creative-collage" style={{ overflow: "hidden" }}>
          <ParallaxY strength={-0.06}>
            <div className="collage-halo" aria-hidden="true" />
            <img src="/assets/editorial/golden-portrait-clean.jpg" alt="Creative direction Aura's Digital Dream" style={{ width: "100%", objectFit: "cover", display: "block" }} />
          </ParallaxY>
        </figure>
      </section>

      <section ref={behindRef} className="behind behind-film" id="behind" aria-label="Behind the Dream">
        <div className="behind-film-stage" aria-hidden="true">
          <motion.video className="behind-film-video behind-film-studio" style={{ y: behindStudioY }} autoPlay muted loop playsInline preload="metadata">
            <source src="/video/about-renaissance-studio.mp4" type="video/mp4" />
          </motion.video>
          <motion.video className="behind-film-video behind-film-hand" style={{ y: behindHandY }} autoPlay muted loop playsInline preload="metadata">
            <source src="/video/renaissance-sculptor-hero.mp4" type="video/mp4" />
          </motion.video>
          <motion.video className="behind-film-video behind-film-light" style={{ y: behindLightY }} autoPlay muted loop playsInline preload="metadata">
            <source src="/video/story-imaginez-golden-hand.mp4" type="video/mp4" />
          </motion.video>
          <motion.span className="behind-film-glow" style={{ opacity: behindGlow }} />
          <span className="behind-film-blackout" />
          <span className="behind-film-grain" />
        </div>
        <motion.div className="behind-copy behind-film-copy" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.055, delayChildren: 0.18 } } }}>
          <motion.p className="section-kicker" variants={heroItem}>Behind the Dream</motion.p>
          <h2 style={serif} aria-label={behindText}>
            {behindText.split(" ").map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                aria-hidden="true"
                variants={{ hidden: { opacity: 0, y: 24, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] } } }}
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </h2>
          <motion.p variants={heroItem}>Nu fac doar materiale frumoase. Construiesc lumi vizuale în care brandul tău capătă ritm, claritate și memorie.</motion.p>
          <motion.div variants={heroItem} className="books-actions">
            <button className="button primary" onClick={() => scrollToId("contact")}>Hai să lucrăm <ArrowRight size={15} /></button>
          </motion.div>
        </motion.div>
      </section>

      <section className="amazon-world amazon-teaser" id="amazon-picks">
        <div className="amazon-world-glow" aria-hidden="true" />
        <FadeUp className="amazon-world-copy">
          <p className="section-kicker">Aura Dobre · Author Universe</p>
          <h2 style={serif}>Cărțile mele au acum <em>pagina lor.</em></h2>
          <p>Am separat vitrina literară într-o pagină dedicată, unde cărțile scrise de mine pot respira ca lumi vizuale separate. Dark romance, thrillere psihologice şi poveşti care se citesc ca un film.</p>
          <div className="literary-chips">
            {["dark romance", "thriller psihologic", "ficțiune cinematică"].map(chip => <span key={chip}>{chip}</span>)}
          </div>
          <div className="books-actions">
            <a className="button primary" href="/cartile-mele" onClick={e => onNavigate(e, "/cartile-mele")}>Vizitează lumea mea literară <ArrowRight size={16} /></a>
            <a className="button ghost" href="https://www.amazon.com/stores/Aura-Dobre/author/B0DSJP6MX8" target="_blank" rel="noopener noreferrer">Amazon</a>
          </div>
        </FadeUp>
        <FadeUp delay={0.2} className="author-mini-stack">
          <img src="/assets/amazon/clockmakers-curse.jpg" alt="Coperta The Clockmaker's Curse" />
          <img src="/assets/amazon/unreachable.jpg" alt="Coperta Unreachable de Aura Dobre" />
          <img src="/assets/amazon/lunaria-secret-treasure.jpg" alt="Coperta Lunaria's Secret Treasure" />
        </FadeUp>
      </section>

      <section className="section dark" id="proces">
        <FadeUp><p className="section-kicker">Proces de lucru</p></FadeUp>
        <FadeUp delay={0.1}><h2 style={serif}>De la idee, <em>la realitate.</em></h2></FadeUp>
        <div className="process-grid">
          {[
            ["01", "Descoperire", "Înteleg obiectivele tale, publicul şi provocările brandului. Ascult înainte să propun."],
            ["02", "Strategie", "Definesc direcția vizuală, structura şi mesajele-cheie. Nimic nu se întâmplă la întâmplare."],
            ["03", "Execuție", "Construiesc fiecare element cu atenție la detalii: design, texte, funcționalitate."],
            ["04", "Livrare & Ajustare", "Prezint rezultatul, colectez feedback şi îl ajustăm pentru rezultate maxime."],
          ].map(([nr, title, copy], i) => (
            <FadeUp key={nr} delay={i * 0.1} className="process-step">
              <span>{nr}</span><h3>{title}</h3><p>{copy}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="section why-me" id="de-ce-eu">
        <TiltCard className="why-me-card">
          <FadeUp>
            <p className="section-kicker">Încredere & direcție</p>
            <h2 style={serif}>De ce să lucrezi <em>cu mine</em></h2>
            <div className="why-me-copy">
              <p>Sunt specialist în marketing digital, design şi web, cu peste 15 proiecte finalizate în branding, campanii, website-uri şi documente profesionale.</p>
              <p>Lucrez cu antreprenori şi companii care vor rezultate reale, nu doar vizibilitate.</p>
              <p>Fiecare proiect este construit cu atenție la detalii, strategie clară şi o estetică premium care diferențiază brandul tău.</p>
            </div>
          </FadeUp>
        </TiltCard>
      </section>

      <section className="client-clarity" id="claritate">
        <div className="clarity-veil" aria-hidden="true" />
        <FadeUp className="clarity-heading">
          <p className="section-kicker">Claritate înainte de ofertă</p>
          <h2 style={serif}>Nu te las să alegi la întâmplare. <em>Îți arăt drumul.</em></h2>
          <p>Fiecare secțiune din site răspunde unei întrebări reale: ce primești, cât costă, cum lucrăm și unde vezi exemple. Așa transform vizitatorul curios într-un client care înțelege valoarea.</p>
        </FadeUp>
        <div className="clarity-grid">
          <div className="clarity-faq" aria-label="Întrebări frecvente">
            {clientQuestions.map((item, index) => (
              <FadeUp key={item.q} delay={index * 0.06}>
                <details className="clarity-question" open={index === 0}>
                  <summary><span>0{index + 1}</span>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              </FadeUp>
            ))}
          </div>
          <TiltCard className="clarity-comparison">
            <p className="section-kicker">Comparație rapidă</p>
            <h3 style={serif}>Alegi după nevoie, nu după ghicit.</h3>
            <div className="comparison-table" role="table" aria-label="Comparație pachete Aura's Digital Dream">
              <div role="row" className="comparison-head"><span>Ce contează</span><span>Start-up</span><span>Website</span><span>Premium</span></div>
              {packageComparison.map((row) => (
                <div role="row" key={row.feature}>
                  <span>{row.feature}</span><span>{row.start}</span><span>{row.web}</span><span>{row.premium}</span>
                </div>
              ))}
            </div>
            <div className="live-page-note">
              <span>Actualizat: august 2026</span>
              <p>Portofoliul rămâne viu: proiectele, materialele, cărțile și aplicațiile pot fi extinse fără să pierdem estetica sau storytelling-ul.</p>
            </div>
          </TiltCard>
        </div>
      </section>

      <section className="section testimonials">
        <FadeUp><p className="section-kicker">Testimoniale</p></FadeUp>
        <FadeUp delay={0.1}><h2 style={serif}>Ce spun <em>clienții.</em></h2></FadeUp>
        <motion.div className="quote" key={testimonialIdx}
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
          <span className="quote-type">{testimonials[testimonialIdx].type}</span>
          <p>„{testimonials[testimonialIdx].quote}”</p>
          <div className="quote-author">
            <span className="quote-avatar">{testimonials[testimonialIdx].initials}</span>
            <div><strong>{testimonials[testimonialIdx].name}</strong><span>{testimonials[testimonialIdx].role}</span></div>
          </div>
          <div className="quote-controls">
            <button onClick={() => setTestimonialIdx((testimonialIdx + testimonials.length - 1) % testimonials.length)} aria-label="Anterior"><CaretLeft /></button>
            <button onClick={() => setTestimonialIdx((testimonialIdx + 1) % testimonials.length)} aria-label="Următor"><CaretRight /></button>
          </div>
        </motion.div>
      </section>

      <section className="section contact cinematic-contact" id="contact">
        <div className="contact-film-layer" aria-hidden="true">
          <video autoPlay muted loop playsInline preload="metadata">
            <source src="/video/story-imaginez-golden-hand.mp4" type="video/mp4" />
          </video>
          <span className="contact-light-orb" />
          <span className="contact-grain" />
          <span className="contact-black-fade" />
        </div>
        <FadeUp className="contact-copy">
          <p className="section-kicker">Contact</p>
          <h2 className="contact-cinematic-title" style={serif}>
            {"Hai să sculptăm împreună ideea ta.".split(" ").map((word, index) => (
              <span key={`${word}-${index}`} style={{ "--word-index": index }}>{word}&nbsp;</span>
            ))}
          </h2>
          <p>Spune-mi ce vrei să construim, iar eu transform brief-ul într-o direcție clară: strategie, estetică și pașii potriviți pentru lansare. Răspund în maximum 24 de ore.</p>
          <a href="https://wa.me/40762509423"><WhatsappLogo size={22} /><span><b>Scrie-mi pe WhatsApp</b><small>Răspuns rapid, oricând</small></span></a>
          <a href="tel:+40762509423"><Phone size={22} /><span><b>Sună-mă direct</b><small>+40 762 509 423</small></span></a>
        </FadeUp>
        <FadeUp delay={0.15} className="contact-form-wrap">
          <form id="contact-form" onSubmit={submitContact} data-reveal>
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
                {formStatus === "sending" ? "Se trimite..." : "Trimite pe email"} <ArrowRight size={18} />
              </button>
              <button className="button whatsapp" type="button" onClick={submitWhatsapp}>
                <WhatsappLogo size={20} /> Trimite pe WhatsApp
              </button>
            </div>
            {formStatus === "success" && <p className="form-notice success" role="status">Mesajul a fost trimis. Îi voi răspunde în maximum 24 de ore.</p>}
            {formStatus === "error" && <p className="form-notice error" role="alert">Trimiterea nu a reuşit. Te rog foloseşte butonul WhatsApp.</p>}
            <small className="privacy-note">Prin trimitere eşti de acord ca datele să fie procesate de FormSubmit exclusiv pentru livrarea mesajului către mine.</small>
          </form>
        </FadeUp>
      </section>

      <footer>
        <div className="footer-brand">
          <img src="/assets/logo.jpg" alt="Aura's Digital Dream" />
          <div><strong>Aura's Digital Dream</strong><p>Marketing, design şi soluții digitale, cu suflet.</p></div>
        </div>
        <div className="social">
          <a href="https://www.instagram.com/aurasdigitaldream" aria-label="Instagram"><InstagramLogo /></a>
          <a href="https://www.linkedin.com/in/aurelia-dobre-a033b2104" aria-label="LinkedIn"><LinkedinLogo /></a>
          <a href="https://wa.me/40762509423" aria-label="WhatsApp"><WhatsappLogo /></a>
        </div>
        <p>© 2026 Aura's Digital Dream. Toate drepturile rezervate.</p>
      </footer>

      <motion.a className="floating-whatsapp" href="https://wa.me/40762509423" aria-label="Scrie-mi pe WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 3, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.14 }}
        whileTap={{ scale: 0.92 }}>
        <WhatsappLogo size={28} weight="fill" />
      </motion.a>
    </main>
  );
}
