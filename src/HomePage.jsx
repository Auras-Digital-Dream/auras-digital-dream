import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, CaretLeft, CaretRight, Check, Code, FileText, InstagramLogo, LinkedinLogo, List, Megaphone, Palette, Phone, WhatsappLogo, X } from "@phosphor-icons/react";
import { Chapters, Depth, Fan, Lines, Marquee, Progress, Reveal, Rise, ScrollCue } from "./scroll.jsx";
import { useRevealOnScroll } from "./reveal.js";
import { GoldLine } from "./goldline.jsx";
import { useNavTone } from "./navtone.js";

// Fields arrive one after another as the form comes into view. Same
// mechanism the rest of the page uses, so there is one reveal system, not two.
const FIELD = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};
const FORM_STAGGER = { visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } } };

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
  { key: "asculta", number: "01", title: "Ascult", video: "/video/story-ascult-workshop.mp4", poster: "/video/poster/story-ascult-workshop.jpg", headline: "Nu pornesc de la tendințe. Pornesc de la tine.", copy: "Îți ascult ideea, contextul, publicul și tensiunea din spatele brandului înainte să desenez direcția.", meta: "Atelier vechi · marmură" },
  { key: "imaginez", number: "02", title: "Imaginez", video: "/video/story-imaginez-golden-hand.mp4", poster: "/video/poster/story-imaginez-golden-hand.jpg", headline: "Ideea ta devine formă. Forma devine lumină. Lumina devine experiență.", copy: "Transform informația în concept vizual: culori, ritm, ierarhie, atmosferă și primul fir de storytelling.", meta: "Palmă · lumină" },
  { key: "construiesc", number: "03", title: "Construiesc", video: "/video/story-construiesc-modern-office.mp4", poster: "/video/poster/story-construiesc-modern-office.jpg", headline: "Construiesc sisteme care se simt vii.", copy: "Aduc totul într-o experiență clară, responsive și premium: identitate, website, campanie sau material digital.", meta: "Birou modern · lumină rece" },
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
  "@id": "https://aurastudios.ro/#studio",
  name: "Aura's Digital Dream",
  url: "https://aurastudios.ro/",
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
  "@id": "https://aurastudios.ro/#faq",
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [formStatus, setFormStatus] = useState("idle");
  const [selectedPrices, setSelectedPrices] = useState([]);

  const heroRef = useRef(null);
  const reduced = useReducedMotion();
  const nav = [["Servicii", "servicii"], ["Portofoliu", "portofoliu"], ["Cărțile mele", "/cartile-mele"], ["Prețuri", "estimator"], ["Contact", "contact"]];
  const groupedProjects = portfolioGroups.map((g) => ({ ...g, projects: g.slugs.map((s) => projects.find((p) => p.slug === s)).filter(Boolean) }));
  const selectedPriceItems = priceItems.filter((i) => selectedPrices.includes(i.title));
  const total = selectedPriceItems.reduce((s, i) => s + i.price, 0);
  const totalMax = selectedPriceItems.reduce((s, i) => s + (i.maxPrice || i.price), 0);

  useRevealOnScroll([]);
  useNavTone();

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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

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

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="masthead">
        <button className="masthead-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src="/assets/logo.jpg" alt="" aria-hidden="true" />
          <span>Aura's Digital Dream</span>
        </button>
        <nav className="masthead-nav" aria-label="Navigare principală">
          {nav.filter(([, target]) => target !== "contact").map(([label, target]) => (
            target.startsWith("/")
              ? <a key={label} href={target} onClick={(e) => onNavigate(e, target)}>{label}</a>
              : <button key={label} onClick={() => scrollToId(target)}>{label}</button>
          ))}
          <button className="masthead-cta" onClick={() => scrollToId("contact")}>Contact</button>
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
              <source src="/video/renaissance-sculptor-hero.mp4" type="video/mp4" />
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

      {/* ── Manifesto ────────────────────────────────────────────────────── */}
      <section className="manifesto gilt bg-marble" aria-label="Manifest">
        <div className="shell manifesto-grid">
          <div className="manifesto-copy">
            <Lines
              as="p"
              className="manifesto-text"
              text="Sunt Aura — designer, marketer și sculptor digital. Nu creez proiecte. Modelez identități."
            />
            <Rise delay={0.2} className="manifesto-meta">
              <span>Aura Dobre</span>
              <span>Designer & strateg digital</span>
            </Rise>
          </div>

          <Rise delay={0.15} className="manifesto-figure" y={40}>
            <div className="manifesto-frame">
              <video
                autoPlay muted loop playsInline preload="metadata" aria-hidden="true"
                poster="/video/poster/identity-forge.jpg"
              >
                <source src="/video/identity-forge.mp4" type="video/mp4" />
              </video>
              <span className="manifesto-seam" aria-hidden="true" />
            </div>
          </Rise>
        </div>
      </section>

      <section className="marquee-band" aria-hidden="true">
        <Marquee text="CREAȚIE · IDENTITATE · STRATEGIE · " angle={-7} speed={0.55} />
      </section>

      {/* ── Chapters: the working method ─────────────────────────────────── */}
      <Chapters
        id="proces"
        className="method bg-ink-marble"
        items={chapters}
        renderMedia={(item) => (
          <>
            <video autoPlay muted loop playsInline preload="metadata" poster={item.poster} aria-hidden="true">
              <source src={item.video} type="video/mp4" />
            </video>
            <span className="chapter-scrim" aria-hidden="true" />
          </>
        )}
        renderCopy={(item) => (
          <>
            <p className="kicker"><span className="eyebrow-text">{item.number} — {item.title}</span></p>
            <h2 className="chapter-headline">{item.headline}</h2>
            <p className="chapter-body">{item.copy}</p>
            <span className="chapter-meta">{item.meta}</span>
          </>
        )}
      />

      {/* ── Full-bleed film: no scrim, no type, pure breath ──────────────── */}
      <section className="film" aria-label="Mâna care atinge piatra">
        <video autoPlay muted loop playsInline preload="metadata" poster="/video/poster/kintsugi-hand-touch.jpg">
          <source src="/video/kintsugi-hand-touch.mp4" type="video/mp4" />
        </video>
      </section>

      {/* ── Featured work, fanned ────────────────────────────────────────── */}
      <section className="work-intro bg-ink-marble" id="portofoliu">
        <div className="shell reveal-on-scroll">
          <p className="kicker reveal-child"><span className="eyebrow-text">Selecție curatorială</span></p>
          <h2 className="section-title reveal-child">Creez proiecte care nu doar arată bine. Spun ceva.</h2>
        </div>
      </section>

      <Fan
        className="work-fan bg-ink-marble"
        label="Toate proiectele"
        backdrop={(
          <p className="fan-backdrop" aria-hidden="true">
            <span>Modelez</span>
            <span>identități</span>
          </p>
        )}
        items={projects.map((p) => ({ ...p, key: p.slug }))}
        renderCard={(project) => (
          <a href={"/portofoliu/" + project.slug} onClick={(e) => onNavigate(e, "/portofoliu/" + project.slug)}>
            <figure>
              <img src={project.image} alt={project.title} loading="lazy" />
              <figcaption>{project.title.split(" — ")[0]}</figcaption>
            </figure>
          </a>
        )}
      />

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section className="services gilt bg-marble is-deep" id="servicii">
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
      <section className="estimator bg-marble is-deep" id="estimator">
        <div className="shell">
          <div className="section-head reveal-on-scroll">
            <p className="kicker reveal-child"><span className="eyebrow-text">Estimator de cost</span></p>
            <h2 className="section-title reveal-child">Estimează-ți bugetul.</h2>
            <p className="section-lead reveal-child">
                Selectează serviciile de care ai nevoie şi obții imediat o estimare orientativă.
                Prețul final se stabileşte după o discuție personalizată.
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

      {/* ── Portfolio archive ────────────────────────────────────────────── */}
      <section className="archive bg-marble">
        <div className="shell">
          <div className="section-head reveal-on-scroll">
            <p className="kicker reveal-child"><span className="eyebrow-text">Portofoliu organizat</span></p>
            <h2 className="section-title reveal-child">Alege direcția care te reprezintă.</h2>
          </div>
          {groupedProjects.map((group) => (
            <div className="archive-group" key={group.title}>
              <div className="archive-group-head">
                <h3>{group.title}</h3>
                <p>{group.copy}</p>
              </div>
              <div className="archive-grid">
                {group.projects.map((project, index) => (
                  <a
                    key={project.slug}
                    className="archive-card is-tilted is-subtle reveal-on-scroll"
                    href={"/portofoliu/" + project.slug}
                    onClick={(e) => onNavigate(e, "/portofoliu/" + project.slug)}
                  >
                    <span className="archive-card-media">
                      <img src={project.image} alt={project.title} loading="lazy" />
                    </span>
                    <span className="archive-card-tags">{project.category.join(" · ")}</span>
                    <span className="archive-card-title">{project.title}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
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
      <section className="difference bg-ink-marble" id="de-ce-eu">
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
      <section className="voices bg-marble">
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
      <section className="books gilt bg-marble" id="amazon-picks">
        <div className="shell books-grid">
          <div className="reveal-on-scroll">
            <p className="kicker reveal-child"><span className="eyebrow-text">Aura Dobre · Author Universe</span></p>
            <h2 className="section-title reveal-child">Cărțile mele au acum pagina lor.</h2>
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
          <video autoPlay muted loop playsInline preload="metadata" poster="/video/poster/atelier-statue-seams.jpg">
            <source src="/video/atelier-statue-seams.mp4" type="video/mp4" />
          </video>
          <span className="contact-scrim" />
        </div>
        <div className="shell contact-grid">
          <div className="contact-copy reveal-on-scroll">
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
              <motion.select variants={FIELD} name="service" defaultValue="">
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
              {formStatus === "error" && <p className="form-notice is-error" role="alert">Trimiterea nu a reuşit. Te rog foloseşte butonul WhatsApp.</p>}
              <small className="form-privacy">
                Prin trimitere eşti de acord ca datele să fie procesate de FormSubmit exclusiv
                pentru livrarea mesajului către mine.
              </small>
            </motion.form>
          </Rise>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="site-footer bg-ink-marble">
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
