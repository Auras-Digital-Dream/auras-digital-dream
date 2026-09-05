import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowsOutSimple,
  Sparkle,
  Play,
  Pause,
  BookOpen,
  Check,
  CaretLeft,
  CaretRight,
  Code,
  FileText,
  InstagramLogo,
  LinkedinLogo,
  Megaphone,
  Palette,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";
import { projectDetails } from "./projectDetails";
import { useScrollExperience } from "./useScrollExperience";
import { HomePage } from "./HomePage";
import { ContactPage } from "./ContactPage";
import { SiteFooter } from "./SiteFooter.jsx";
import EditorialArchive from "./editorial/App.tsx";
import { gsap, ScrollTrigger, useGSAP } from "./gsap.js";
const portfolioAssets = __PORTFOLIO_ASSETS__;
const supplementalPortfolioAssets = {
  "adi-ecoo-2009-sa": [
    "/portfolio/adi-ecoo-2009-sa/adi-ecoo-rollup-real.webp",
  ],
  "verde-bean": [
    "/portfolio/verde-bean/verde-bean-coffee-flatlay.webp",
    "/portfolio/verde-bean/verde-bean-brand-system.webp",
    "/portfolio/verde-bean/verde-bean-hero-branding.webp",
    "/portfolio/verde-bean/verde-bean-menu-system.webp",
    "/portfolio/verde-bean/verde-bean-business-card.webp",
    "/portfolio/verde-bean/verde-bean-tote-bag.webp",
    "/portfolio/verde-bean/verde-bean-logo-mark.webp",
    "/portfolio/verde-bean/verde-bean-storefront-sign.webp",
    "/portfolio/verde-bean/verde-bean-package-detail.mp4",
  ],
  "selectii-cromatice": [
    "/portfolio/selectii-cromatice/olive-blush.webp",
    "/portfolio/selectii-cromatice/dusty-yellow-cool-blue.webp",
    "/portfolio/selectii-cromatice/smokey-blue-merlot-red.webp",
    "/portfolio/selectii-cromatice/warm-orange-dusty-yellow.webp",
    "/portfolio/selectii-cromatice/warm-white-cool-blue.webp",
  ],
  "auras-trend-vault": [
    "/portfolio/auras-trend-vault/editorial-2026/editorial-black-white.webp",
    "/portfolio/auras-trend-vault/editorial-2026/editorial-golden-light.webp",
    "/portfolio/auras-trend-vault/editorial-2026/editorial-city-motion.webp",
    "/portfolio/auras-trend-vault/editorial-2026/vogue-cover.webp",
    "/portfolio/auras-trend-vault/editorial-2026/trend-vault-motion-01.mp4",
    "/portfolio/auras-trend-vault/editorial-2026/trend-vault-motion-02.mp4",
    "/portfolio/auras-trend-vault/editorial-2026/trend-vault-motion-03.mp4",
    "/portfolio/auras-trend-vault/editorial-2026/trend-vault-motion-04.mp4",
  ],
};
/* What plays inside a device frame on each case study.
 *
 * The device is not guessed from the video's shape. Shape gets it wrong in
 * exactly the case that matters: the AI-generated product clips are 1280x720,
 * which is the shape of a laptop screen, and framing one that way would tell
 * a visitor "this is a website I built" about a video of a bottle. So each
 * clip says what it is, and the frame follows from that.
 *
 * kind "site" is a recording of a real website scrolling. kind "social" is
 * campaign content, which genuinely lives on a phone - the frame is the same,
 * the label is not, and neither claims to be the other.
 *
 * Files are built by scripts/make-scroll-videos.py: cropped free of the
 * recording phone's own status bar, capped at forty seconds and re-encoded
 * from 136 MB down to 18. Originals are untouched on disk.
 */
const deviceShowcase = {
  "adi-ecoo-2009-sa": [
    { device: "laptop", kind: "site", name: "site-desktop", ratio: 2.1695, caption: "adiecoo2009sa.ro, derulat pe desktop" },
    { device: "phone", kind: "social", name: "social-story", ratio: 0.5625, caption: "Story de campanie pentru colectarea separată" },
  ],
  "lupul-and-brici": [
    { device: "laptop", kind: "site", name: "site-desktop", ratio: 1.4953, caption: "Site-ul de prezentare, derulat pe desktop" },
  ],
  "auras-trend-vault": [
    { device: "phone", kind: "site", name: "site-mobil", ratio: 0.5039, caption: "Platforma, derulată pe telefon" },
  ],
  "magazine-online-e-commerce": [
    { device: "phone", kind: "site", name: "site-mobil", ratio: 0.4922, caption: "Magazinul, derulat pe telefon" },
  ],
  "real-estate-co": [
    { device: "laptop", kind: "site", name: "site-desktop", ratio: 2.2939, caption: "Site-ul agenției, derulat pe desktop" },
    { device: "phone", kind: "site", name: "site-mobil", ratio: 0.5835, caption: "Site-ul agenției, derulat pe telefon" },
  ],
  "verde-bean": [
    { device: "phone", kind: "social", name: "social-mobil", ratio: 0.5625, caption: "Conținut de campanie pentru social media" },
  ],
  "lumina-botanica": [
    { device: "phone", kind: "social", name: "social-mobil", ratio: 0.5624, caption: "Conținut de campanie pentru social media" },
  ],
};

/* The heavy originals now have a light, cropped version playing in a frame,
 * so nothing should still point a visitor at the 59 MB file. */
const showcasedSources = new Set([
  "/portfolio/adi-ecoo-2009-sa/877bd41c8_nregistrareecran2026-02-05123949.mp4",
  "/portfolio/adi-ecoo-2009-sa/89fb91d78_InstagramVideoStory1080x1920px2.mp4",
  "/portfolio/lupul-and-brici/a45070a4f_nregistrare2026-07-01114857.mp4",
  "/portfolio/auras-trend-vault/b2db01172_aurastrendvault.mp4",
  "/portfolio/magazine-online-e-commerce/2df41b79e_ClipvideoWhatsApp2025-01-13la153142_c682764f.mp4",
  "/portfolio/real-estate-co/610ce2e53_ClipvideoWhatsApp2025-10-27la231539_71ff5ca2.mp4",
  "/portfolio/real-estate-co/real-estate-co-site-desktop-source.mp4",
  "/portfolio/verde-bean/96848f026_WhatsAppVideo2026-07-02at090552.mp4",
  "/portfolio/lumina-botanica/45639281f_WhatsAppVideo2026-07-02at090147.mp4",
]);

const excludedPortfolioAssets = new Set([
  "/portfolio/arta-digitala-materiale-grafice/76bc483af_freepik__genereazaa-o-imagine-realistica-a-unor-deseuri-din__37852.webp",
]);
const detailHeroAssets = {
  "verde-bean": "/portfolio/verde-bean/verde-bean-hero-branding.webp",
  "lumina-botanica": "/portfolio/lumina-botanica/20c5ceaff_WhatsAppImage2026-07-02at090233.webp",
  "lupul-and-brici": "/portfolio/lupul-and-brici/852b052a0_generated_image.webp",
  "luxury-hair-by-aura": "/portfolio/luxury-hair-by-aura/31d17cea7_generated_image.webp",
  "real-estate-co": "/portfolio/real-estate-co/d7b6e03d9_Capturdeecran2025-10-27234018.webp",
  "carti-de-vizita": "/portfolio/carti-de-vizita/12a649300_generated_image.webp",
  "adi-ecoo-2009-sa": "/portfolio/adi-ecoo-2009-sa/c989567bf_campanievoluminoase.webp",
  "painea-de-acasa": "/portfolio/painea-de-acasa/painea-de-acasa-packaging.webp",
  "campanie-social-media-luxe": "/portfolio/campanie-social-media-luxe/65714e254_generated_image.webp",
  "auras-trend-vault": "/portfolio/auras-trend-vault/84ce9f083_WhatsAppImage2026-07-01at120708.webp",
  "magazine-online-e-commerce": "/portfolio/magazine-online-e-commerce/21dc16065_WhatsAppImage2026-07-02at090809.webp",
  "invitatii-nunti-botezuri-evenimente": "/portfolio/invitatii-nunti-botezuri-evenimente/766c6c8d9_generated_image.webp",
  "documente-corporatiste-licenta": "/portfolio/documente-corporatiste-licenta/2e1da68ae_generated_image.webp",
  "arta-digitala-materiale-grafice": "/portfolio/arta-digitala-materiale-grafice/a847754e3_WhatsAppImage2026-07-02at1140104.webp",
  "logo-design": "/portfolio/logo-design/4403fa619_generated_image.webp",
  "selectii-cromatice": "/portfolio/selectii-cromatice/olive-blush.webp",
};

const ecommerceStorySlides = [
  {
    src: "/portfolio/magazine-online-e-commerce/editorial-concept-chanel-no5.webp",
    body: "Într-un magazin online, parfumul nu poate fi testat. Provocarea este să traduci dorința prin lumină, reflexii și o imagine suficient de precisă încât obiectul să transmită lux înainte ca vizitatorul să citească descrierea.",
    alt: "Flacon Chanel N°5 fotografiat editorial pe marmură burgundy, încadrat de un halo transparent și o arcadă luminoasă.",
  },
  {
    src: "/portfolio/magazine-online-e-commerce/editorial-concept-aesop-hand-balm.webp",
    body: "Soluția combină fotografie editorială, ierarhie vizuală și un parcurs de cumpărare simplu. Travertinul, sticla și lumina naturală comunică formula și tactilitatea, iar interfața păstrează produsul în centrul deciziei.",
    alt: "Flacon Aesop din sticlă brună pe un soclu din travertin, lângă frunze și un panou translucid albastru.",
  },
  {
    src: "/portfolio/magazine-online-e-commerce/editorial-concept-nike-air-max.webp",
    body: "Design-ul se adaptează fiecărei categorii fără să piardă coerența magazinului: cadre largi pentru siluetă, detalii clare pentru materiale și contraste cromatice care transformă caracteristicile tehnice în identitate vizuală.",
    alt: "Pantof sport Nike Air Max ivory și burgundy expus integral pe un soclu din marmură cu lumină teal discretă.",
  },
  {
    src: "/portfolio/magazine-online-e-commerce/editorial-concept-bang-olufsen-h95.webp",
    body: "Rezultatul este un sistem e-commerce în care beauty, fashion și tehnologia pot avea lumi vizuale distincte, dar aceeași experiență fluidă: produsul se înțelege rapid, se simte premium și rămâne memorabil.",
    alt: "Căști Bang & Olufsen Beoplay H95 aurii și crem pe suport transparent, cu tapiserie renascentistă și halo luminos.",
  },
];

const portfolioImageAlt = {
  "/portfolio/magazine-online-e-commerce/21dc16065_WhatsAppImage2026-07-02at090809.webp": "Două produse Solait pentru îngrijire după expunerea la soare, într-o compoziție editorială cu aloe, nisip și accente aurii.",
  "/portfolio/magazine-online-e-commerce/66ff9fedd_WhatsAppImage2026-07-02at114431.webp": "Mască facială verde Sukin fotografiată lângă fereastră, cu frunze și spatulă din lemn.",
  "/portfolio/magazine-online-e-commerce/85dbe451e_WhatsAppImage2026-07-02at114542.webp": "Recipient Pixi Glow Tonic To-Go fotografiat de aproape, într-un decor luminos cu plante.",
  "/portfolio/magazine-online-e-commerce/ecommerce-stila-one-step-primer.webp": "Primer Stila One Step Correct fotografiat vertical, cu flori de mușețel și ingrediente naturale.",
  "/portfolio/magazine-online-e-commerce/ecommerce-florena-cleansing-tonic.webp": "Tonic de curățare Florena și pipetă cu ulei, aranjate pe marmură albă cu flori delicate.",
  "/portfolio/magazine-online-e-commerce/ecommerce-smashbox-glow-primer.webp": "Primer Smashbox Photo Finish Illuminate alături de felie de portocală și textură luminoasă de produs.",
  "/portfolio/magazine-online-e-commerce/ecommerce-burei-watch.webp": "Ceas Burei cu cadran turcoaz și brățară metalică, fotografiat integral pe fundal alb.",
  ...Object.fromEntries(ecommerceStorySlides.map(({ src, alt }) => [src, alt])),
};

function getPortfolioImageAlt(project, image, index) {
  return portfolioImageAlt[image] || `${project.title} — imagine ${index + 1}`;
}

const projects = [
  { slug: "selectii-cromatice", title: "Selecții Cromatice — Moodboard-uri & Direcție Vizuală", category: ["Moodboard", "Grafică"], image: "/portfolio/selectii-cromatice/olive-blush.webp", description: "Palete atent curatoriate, transformate în atmosfere vizuale pentru identități de brand, campanii și spații digitale." },
  { slug: "verde-bean", title: "Verde Bean — Identitate de Brand", category: ["Branding"], image: "/portfolio/verde-bean/verde-bean-hero-branding.webp", description: "Identitate vizuală completă pentru un brand de cafea specialty sustenabil." },
  { slug: "painea-de-acasa", title: "Pâinea de Acasă — Identitate de Brand Artizanală", category: ["Branding", "Grafică"], image: "/portfolio/painea-de-acasa/painea-de-acasa-packaging.webp", description: "Identitate caldă și autentică pentru o brutărie artizanală locală, cu logo, paletă, tipografie și aplicații de brand." },
  { slug: "lumina-botanica", title: "Lumina Botanica — Identitate de Brand", category: ["Branding"], image: "/portfolio/lumina-botanica/20c5ceaff_WhatsAppImage2026-07-02at090233.webp", description: "Branding premium pentru o linie de produse cosmetice organice și botanice." },
  { slug: "lupul-and-brici", title: "Lupul & Brici — Identitate de Brand", category: ["Branding", "Web"], image: "/portfolio/lupul-and-brici/852b052a0_generated_image.webp", description: "Identitate vizuală pentru un brand de îngrijire masculină, cu website de prezentare inclus." },
  { slug: "luxury-hair-by-aura", title: "Luxury Hair by Aura — Identitate de Brand", category: ["Branding"], image: "/portfolio/luxury-hair-by-aura/0429b7c7f_WhatsAppImage2026-07-02at1127334.webp", description: "Identitate vizuală premium pentru un salon de extensii de păr din Slobozia." },
  { slug: "real-estate-co", title: "Real Estate Co. — Identitate de Brand & Website", category: ["Branding", "Web"], image: "/portfolio/real-estate-co/7254652e3_Capturdeecran2025-10-27232250.webp", description: "Identitate vizuală completă, materiale print și website pentru o agenție imobiliară din Anglia." },
  { slug: "carti-de-vizita", title: "Cărți de Vizită — Design Corporate & Personal", category: ["Branding"], image: "/portfolio/carti-de-vizita/3cd5b72d3_adiecoo1.webp", description: "Cărți de vizită digitale cu cod QR și print, create într-un stil modern și memorabil." },
  { slug: "adi-ecoo-2009-sa", title: "ADI ECOO 2009 S.A. — Identitate, campanii & www.adiecoo2009sa.ro", category: ["Branding", "Marketing", "Grafică", "Web", "Documente"], image: "/portfolio/adi-ecoo-2009-sa/adi-ecoo-rollup-real.webp", description: "Identitate completă și ecosistem de comunicare: logo, campanii, materiale editoriale, conținut digital și website www.adiecoo2009sa.ro." },
  { slug: "campanie-social-media-luxe", title: "Campanie Social Media — Bijuterii de Lux", category: ["Marketing"], image: "/assets/bijuterii.webp", description: "Campanie editorială pentru o maison de bijuterii fine, cu fotografie și storytelling premium." },
  { slug: "auras-trend-vault", title: "Aura's Trend Vault — Platformă Web, Blog, AI & Fotografie Editorială", category: ["Web"], image: "/portfolio/auras-trend-vault/editorial-2026/vogue-cover.webp", description: "Platformă web completă, blog editorial și experiențe AI create de la zero." },
  { slug: "magazine-online-e-commerce", title: "Magazine Online E-Commerce — Web Design, Dezvoltare & Fotografie", category: ["Web"], image: "/assets/ecommerce.webp", description: "Magazine online complete, cu design, plăți, curieri, fotografie de produs și optimizare SEO." },
  { slug: "invitatii-nunti-botezuri-evenimente", title: "Invitații Nunți, Botezuri & Evenimente", category: ["Grafică"], image: "/assets/invitatii.webp", description: "Invitații premium personalizate, cu accente botanice, caligrafie și finisaje rafinate." },
  { slug: "documente-corporatiste-licenta", title: "Documente Corporatiste & Lucrare de Licență", category: ["Documente"], image: "/assets/documente.webp", description: "Rapoarte, broșuri, prezentări și documente academice cu structură clară și design profesionist." },
  { slug: "arta-digitala-materiale-grafice", title: "Artă Digitală & Materiale Grafice", category: ["Grafică"], image: "/portfolio/arta-digitala-materiale-grafice/a847754e3_WhatsAppImage2026-07-02at1140104.webp", description: "Ilustrații, postere, compoziții abstracte și materiale grafice create într-o direcție contemporană." },
  { slug: "logo-design", title: "Logo Design — Identități Vizuale de Brand", category: ["Logo Design"], image: "/portfolio/logo-design/3caeb0cc1_Untitled-design.webp", description: "Colecție de logo-uri profesionale — de la monograme elegante la embleme corporate și sigle de lux." },
];

const featuredSlugs = ["auras-trend-vault", "verde-bean", "real-estate-co", "campanie-social-media-luxe"];
const featuredCardAssets = {
  "auras-trend-vault": "/portfolio/auras-trend-vault/editorial-2026/vogue-cover.webp",
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

function scrollToId(id) {
  const targetId = id === "estimare" ? "estimator" : id;
  document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
}

function scheduleScrollToId(id) {
  requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)));
  window.setTimeout(() => scrollToId(id), 120);
}

/* A screen recording, inside the machine it was recorded on.
 *
 * The frame is drawn in CSS - no mockup image to download, nothing to go
 * blurry on a retina screen, and it is built from her own material: the ink
 * body, the gold hairline, the glass edge already used everywhere else.
 *
 * Nothing is fetched until the frame is on screen: preload="none" means the
 * browser holds off, and the observer only calls play() when at least a third
 * of it is visible, then pauses again on the way out. A visitor who never
 * scrolls this far downloads the poster and nothing more. Reduced motion
 * keeps the poster and offers a control instead of starting on its own.
 */
function DeviceFrame({ slug, clip }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const base = `/portfolio/${slug}/scroll/${clip.name}`;

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.34 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced]);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) video.play().then(() => setPlaying(true)).catch(() => {});
    else { video.pause(); setPlaying(false); }
  }

  return (
    <figure className={`device device-${clip.device}`} data-reveal style={{ "--screen-ratio": clip.ratio }}>
      <div className="device-shell">
        <div className="device-screen">
          <video
            ref={ref}
            muted
            loop
            playsInline
            preload="none"
            poster={`${base}.jpg`}
            aria-label={clip.caption}
          >
            <source src={`${base}.mp4`} type="video/mp4" />
          </video>
          <button type="button" className="device-play" onClick={toggle} aria-pressed={playing}>
            {playing ? <Pause size={17} weight="fill" /> : <Play size={17} weight="fill" />}
            <span>{playing ? "Oprește" : "Pornește"}</span>
          </button>
        </div>
      </div>
      {clip.device === "laptop" && <div className="device-base" aria-hidden="true" />}
      <figcaption>
        <span className={`device-kind is-${clip.kind}`}>{clip.kind === "site" ? "Website" : "Social media"}</span>
        {clip.caption}
      </figcaption>
    </figure>
  );
}

function ProjectStoryCard({ chapter, index, active }) {
  function floatCard(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    event.currentTarget.style.setProperty("--float-x", `${x * -16}px`);
    event.currentTarget.style.setProperty("--float-y", `${y * -12}px`);
    event.currentTarget.style.setProperty("--float-rx", `${y * 2.4}deg`);
    event.currentTarget.style.setProperty("--float-ry", `${x * -3.2}deg`);
  }

  function resetCard(event) {
    event.currentTarget.style.setProperty("--float-x", "0px");
    event.currentTarget.style.setProperty("--float-y", "0px");
    event.currentTarget.style.setProperty("--float-rx", "0deg");
    event.currentTarget.style.setProperty("--float-ry", "0deg");
  }

  return (
    <article className="project-story-card" data-active={active} onPointerMove={floatCard} onPointerLeave={resetCard}>
      <div className="project-story-card-inner">
        <span>{String(index + 1).padStart(2, "0")} / 04</span>
        <p>{chapter.eyebrow}</p>
        <h2>{chapter.title}</h2>
        <div className="project-story-rule" aria-hidden="true" />
        <p className="project-story-body">{chapter.body}</p>
      </div>
    </article>
  );
}

function ProjectStory({ project, details, images, heroImage }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const storySlides = project.slug === "magazine-online-e-commerce" ? ecommerceStorySlides : null;
  const backgrounds = storySlides
    ? storySlides.map(({ src }) => src)
    : [heroImage, images[1] || heroImage, images[2] || images[0] || heroImage, images[3] || images[1] || heroImage];
  const chapters = [
    { eyebrow: "Context", title: "Provocarea", body: storySlides?.[0].body || details.challenge },
    { eyebrow: "Direcție", title: "Soluția", body: storySlides?.[1].body || details.solution },
    { eyebrow: "Limbaj vizual", title: "Design-ul", body: storySlides?.[2].body || details.approach || `Am construit un sistem coerent de ${project.category.join(", ").toLowerCase()}, în care fiecare material susține aceeași poveste.` },
    { eyebrow: "Impact", title: "Rezultatul", body: storySlides?.[3].body || details.results.join(" · ") },
  ];

  useGSAP(() => {
    if (reduced || !ref.current) return undefined;
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: ({ progress }) => {
        const next = Math.min(3, Math.max(0, Math.floor(progress * 4)));
        setActive((current) => current === next ? current : next);
      },
    });
    return () => trigger.kill();
  }, { scope: ref, dependencies: [reduced], revertOnUpdate: true });

  useGSAP(() => {
    if (reduced || !ref.current) return;
    const currentBackground = ref.current.querySelector(`.project-story-bg[data-index="${active}"] img`);
    const scan = ref.current.querySelector(".project-story-scan");
    if (currentBackground) gsap.fromTo(currentBackground, { scale: 1.13 }, { scale: 1.035, duration: 2.2, ease: "power2.out" });
    if (scan) gsap.fromTo(scan, { xPercent: -120, opacity: 0 }, { xPercent: 120, opacity: .82, duration: 1.15, ease: "power2.inOut" });
  }, { scope: ref, dependencies: [active, reduced], revertOnUpdate: true });

  return (
    <section ref={ref} className="project-story" aria-label={`Povestea proiectului ${project.title}`}>
      <div className="project-story-stage">
        <div className="project-story-backgrounds" aria-hidden="true">
          {backgrounds.map((image, index) => (
            <figure className="project-story-bg" data-active={index === active} data-index={index} key={`${image}-${index}`}><img src={image} alt="" /></figure>
          ))}
          <div className="project-story-veil" />
          <div className="project-story-scan" />
        </div>
        <div className="project-story-chrome" aria-hidden="true">
          <span>{project.title.split(" — ")[0]}</span>
          <i><b style={{ transform: `scaleX(${(active + 1) / 4})` }} /></i>
          <span>{String(active + 1).padStart(2, "0")} — 04</span>
        </div>
        <div className="project-story-card-stack">
          {chapters.map((chapter, index) => <ProjectStoryCard chapter={chapter} index={index} active={index === active} key={chapter.title} />)}
        </div>
      </div>
      <div className="project-story-track">
        {chapters.map((chapter) => <div className="project-story-sentinel" aria-hidden="true" key={chapter.title} />)}
      </div>
    </section>
  );
}

function ProjectDetail({ project, details, onNavigate, onSection }) {
  const [zoomed, setZoomed] = useState(null);
  const assets = [...new Set([
    ...(portfolioAssets[project.slug] || []),
    ...(supplementalPortfolioAssets[project.slug] || []),
  ])];
  const curatedAssets = assets.filter(
    (asset) => !excludedPortfolioAssets.has(asset) && !showcasedSources.has(asset),
  );
  const images = curatedAssets.filter((asset) => !asset.toLowerCase().endsWith(".mp4"));
  const videos = curatedAssets.filter((asset) => asset.toLowerCase().endsWith(".mp4"));
  const heroImage = detailHeroAssets[project.slug] || images[0] || project.image;
  const whatsappMessage = encodeURIComponent(`Bună, Aura! Am văzut proiectul ${project.title} și aș dori să discutăm despre un proiect asemănător.`);
  /* Three ways out of a dead end. A case study used to link only back to
   * the home page, which meant every one of the sixteen was a leaf: a
   * reader who arrived from a search had nowhere to go, and a crawler saw
   * no path between them. Same category first, so the suggestion is
   * actually related, then whatever else is there to fill the row. */
  const related = useMemo(() => {
    const others = projects.filter((p) => p.slug !== project.slug);
    const sameField = others.filter((p) => p.category.some((c) => project.category.includes(c)));
    return [...sameField, ...others.filter((p) => !sameField.includes(p))].slice(0, 3);
  }, [project.slug]);

  return (
    <main className="detail-page"><div className="scroll-progress" aria-hidden="true" /><div className="custom-cursor" aria-hidden="true" /><div className="custom-cursor-ring" aria-hidden="true" />
      <header className="detail-header">
        <a className="brand" href="/" onClick={(event) => onNavigate(event, "/")}><img src="/assets/logo.webp" alt="Aura's Digital Dream" /><span>Aura's <em>Digital</em> Dream</span></a>
        <nav><a href="/" onClick={(event) => onNavigate(event, "/")}>Acasă</a><a href="/studio#despre-mine" onClick={(event) => onSection(event, "despre-mine")}>Despre</a><a href="/studio#servicii" onClick={(event) => onSection(event, "servicii")}>Servicii</a><a href="/studio#portofoliu" onClick={(event) => onSection(event, "portofoliu")}>Portofoliu</a><a href="/contact" onClick={(event) => onNavigate(event, "/contact")}>Contact</a></nav>
      </header>

      <section className="detail-hero">
        <div className="detail-hero-copy" data-reveal>
          <a className="detail-back" href="/studio#portofoliu" onClick={(event) => onSection(event, "portofoliu")}><ArrowLeft size={18} /> Înapoi la portofoliu</a>
          <div className="detail-meta"><span>{details.category}</span><span>{details.date}</span></div>
          <h1>{project.title}</h1>
          <p>Client: {details.client}</p>
        </div>
        <div className="detail-hero-visual" data-parallax="0.08"><img className="detail-hero-backdrop" src={heroImage} alt="" aria-hidden="true" /><img className="detail-hero-main" src={heroImage} alt={project.title} /></div>
      </section>

      <ProjectStory project={project} details={details} images={images} heroImage={heroImage} />

      <section className="detail-content">
        <div className="detail-intro" data-reveal><p className="section-kicker"><span className="eyebrow-text">Despre proiect</span></p><h2>{details.about}</h2></div>
        <div className="project-facts" data-reveal><article><small>Rol & servicii</small><strong>{project.category.join(" · ")}</strong></article><article><small>Client</small><strong>{details.client}</strong></article><article><small>Perioadă</small><strong>{details.date}</strong></article><article><small>Livrabile</small><strong>{details.results.length} rezultate-cheie</strong></article></div>
        {details.services && <div className="detail-results detail-services"><p className="section-kicker"><span className="eyebrow-text">Servicii livrate</span></p><div>{details.services.map((service) => <article key={service}><Sparkle size={17} weight="fill" /><span>{service}</span></article>)}</div></div>}
        <div className="detail-results"><p className="section-kicker"><span className="eyebrow-text">Rezultate</span></p><div>{details.results.map((result) => <article key={result}><Check size={18} weight="bold" /><span>{result}</span></article>)}</div></div>
      </section>

      {(deviceShowcase[project.slug] || []).length > 0 && (
        <section className="detail-devices">
          <p className="section-kicker"><span className="eyebrow-text">În funcțiune</span></p>
          <h2>Cum arată <em>pe ecranul tău.</em></h2>
          <div className="device-row">
            {deviceShowcase[project.slug].map((clip) => (
              <DeviceFrame key={clip.name} slug={project.slug} clip={clip} />
            ))}
          </div>
        </section>
      )}

      <section className="detail-gallery">
        <p className="section-kicker"><span className="eyebrow-text">Galerie</span></p><h2>Proiectul <em>în imagini.</em></h2>
        <div className="gallery-grid">{images.map((image, index) => <button data-reveal key={image} className={index % 7 === 0 ? "gallery-wide" : ""} onClick={() => setZoomed(image)}><img src={image} alt={getPortfolioImageAlt(project, image, index)} loading="lazy" /><span><ArrowsOutSimple size={24} /> Click pentru zoom</span></button>)}</div>
        {videos.length > 0 && <div className="video-section"><h3>Video</h3><div>{videos.map((video) => <video controls preload="metadata" key={video}><source src={video} type="video/mp4" /></video>)}</div></div>}
      </section>

      <section className="detail-related"><p className="section-kicker"><span className="eyebrow-text">Continuă</span></p><h2>Alte proiecte <em>din aceeași lume.</em></h2><div className="related-grid">{related.map((other) => <a key={other.slug} href={`/portofoliu/${other.slug}`} onClick={(event) => onNavigate(event, `/portofoliu/${other.slug}`)} data-reveal><img src={detailHeroAssets[other.slug] || other.image} alt="" loading="lazy" /><div><small>{other.category.join(" · ")}</small><strong>{other.title.split(" — ")[0]}</strong></div></a>)}</div></section>

      <section className="detail-cta"><p>Îți place direcția?</p><h2>Putem crea o poveste la fel de <em>memorabilă pentru brandul tău.</em></h2><a className="button primary" href={`https://wa.me/40762509423?text=${whatsappMessage}`}>Vreau un proiect asemănător <WhatsappLogo size={19} /></a></section>
      <SiteFooter />
      <a className="floating-whatsapp" href="https://wa.me/40762509423" aria-label="Scrie-mi pe WhatsApp"><WhatsappLogo size={28} weight="fill" /></a>
      {zoomed && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Imagine mărită" onClick={() => setZoomed(null)}><button aria-label="Închide imaginea" onClick={() => setZoomed(null)}><X size={26} /></button><img src={zoomed} alt={getPortfolioImageAlt(project, zoomed, images.indexOf(zoomed))} /></div>}
    </main>
  );
}

function BooksPageCinematic({ onNavigate }) {
  const reducedMotion = useReducedMotion();
  const [newsletterStatus, setNewsletterStatus] = useState("idle");
  const authorAmazon = "https://www.amazon.co.uk/stores/author/B0DSJP6MX8/allbooks?ingress=0";
  const goodreads = "https://www.goodreads.com/user/show/203519366-aura-dobre";
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 800], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollY, [0, 450], [1, 0]);
  const featureRef = useRef(null);
  const featureInView = useInView(featureRef, { once: true, margin: "-18% 0px" });
  const { scrollYProgress: featureProgress } = useScroll({ target: featureRef, offset: ["start end", "center center"] });
  const featureScale = useTransform(featureProgress, [0, 1], [0.86, 1]);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springTiltX = useSpring(tiltX, { stiffness: 220, damping: 22 });
  const springTiltY = useSpring(tiltY, { stiffness: 220, damping: 22 });
  function handleTiltMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    tiltX.set(((e.clientY - cy) / (rect.height / 2)) * -10);
    tiltY.set(((e.clientX - cx) / (rect.width / 2)) * 10);
  }
  function handleTiltLeave() { tiltX.set(0); tiltY.set(0); }
  const authorRef = useRef(null);
  const authorInView = useInView(authorRef, { once: true, margin: "-20% 0px" });
  const { scrollYProgress: authorProgress } = useScroll({ target: authorRef, offset: ["start end", "end start"] });
  const authorBgY = useTransform(authorProgress, [0, 1], ["-12%", "12%"]);
  const authorPortraitY = useTransform(authorProgress, [0, 1], ["7%", "-7%"]);
  const finalRef = useRef(null);
  const { scrollYProgress: finalProgress } = useScroll({ target: finalRef, offset: ["start end", "center center"] });
  const finalScale = useTransform(finalProgress, [0, 1], [1.14, 1]);
  const publishedBooks = [
    { title: "The Clockmaker's Curse", image: "/assets/amazon/clockmakers-curse.webp", meta: "Thriller · Mystery", subtitle: "Time Holds The key", copy: "O poveste despre timp, obsesie și secrete îngropate adânc în mecanismele unui ceas. Fiecare tic-tac ascunde o minciună.", link: "https://amzn.eu/d/0bGKmBLR" },
    { title: "Lunaria's Secret Treasure", image: "/assets/amazon/lunaria-secret-treasure.webp", meta: "Children's Fantasy · Adventure", subtitle: "in the Enchanted Forest", copy: "O aventură magică pentru cei mici — unde păduri fermecate ascund comori, iar curajul e singura hartă de care ai nevoie.", link: "https://a.co/d/0gsNh4wn" },
  ];
  const fallingGenres = [
    ["dark romance", "#ff8fb7", "#231218", -8],
    ["thriller psihologic", "#5388ff", "#f8fbff", 7],
    ["fantasy", "#ffd34f", "#201c08", -5],
    ["ficțiune literară", "#f06d45", "#fff8f1", 8],
    ["mister", "#cf2dff", "#fff7ff", -7],
    ["slow burn", "#9dd968", "#13200d", 5],
    ["obsesie", "#ff6f91", "#fff8fb", -4],
    ["eroi moralmente gri", "#7f73ff", "#fbfaff", 6],
  ];
  const genreDropVariants = {
    hidden: ({ index, rotation }) => ({ opacity: 0, y: -360 - index * 46, rotate: rotation * 3.2, scale: .86 }),
    visible: ({ index, rotation }) => ({
      opacity: 1,
      y: 0,
      rotate: rotation,
      scale: 1,
      transition: { type: "spring", stiffness: 128, damping: 11, mass: .92, delay: index * .13 },
    }),
  };
  const footerBooks = [
    ["/assets/amazon/clockmakers-curse.webp", "The Clockmaker's Curse", "https://amzn.eu/d/0bGKmBLR", -20, -78],
    ["/assets/amazon/lunaria-secret-treasure.webp", "Lunaria's Secret Treasure", "https://a.co/d/0gsNh4wn", -8, -28],
    ["/assets/amazon/unreachable.webp", "Unreachable", "https://www.amazon.co.uk/dp/B0GXSLHRNY", 7, 28],
    ["/assets/books-cinematic/echoes-of-eternity.webp", "Echoes of Eternity", authorAmazon, 19, 78],
  ];
  const fadeUp = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } },
  };
  const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.18, delayChildren: 0.75 } } };

  return (
    <main className="books-page cinematic-books"><div className="scroll-progress" aria-hidden="true" /><div className="custom-cursor" aria-hidden="true" /><div className="custom-cursor-ring" aria-hidden="true" /><div className="film-grain" aria-hidden="true" />
      <motion.header className="cinematic-nav" initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
        <a className="cinematic-author-logo" href="/" onClick={(event) => onNavigate(event, "/")}>Aura Dobre</a>
        <nav><a className="cinematic-home-link" href="/" onClick={(event) => onNavigate(event, "/")}>Acasă</a><a href="#carti">Cărți</a><a href="#despre">Despre</a><a href="/contact" onClick={(event) => onNavigate(event, "/contact")}>Contact</a><a className="cinematic-amazon-link" href={authorAmazon} target="_blank" rel="noopener noreferrer">Amazon <ArrowRight size={14} /></a></nav>
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
        <div className="cinematic-universe-inner cinematic-universe-editorial">
          <motion.p className="section-kicker" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}><span className="eyebrow-text">01 — Universul literar</span></motion.p>
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>Universul meu literar</motion.h2>
          <div className="universe-lines">
            {[
              "Personajele mele trăiesc la marginea rațiunii —",
              "unde obsesia devine artă și vulnerabilitatea, putere.",
              "Conace izolate, tensiuni psihologice,",
              "iubiri care ard și distrug în același timp.",
            ].map((line, index) => <motion.p key={line} initial={{ opacity: 0, x: -28, filter: "blur(5px)" }} whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.35 + index * 0.18, ease: [0.16, 1, 0.3, 1] }}>{line}</motion.p>)}
          </div>
          <motion.div className="universe-copy" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 1.1 }}>
            <p>Scriu despre putere și fragilitate, despre bărbați care stăpânesc și femei care îi sfidează — nu pentru că aleg un clișeu, ci pentru că tensiunea aceasta e adevărată.</p>
            <p>Fiecare carte este o experiență senzorială — un film pe care îl citești, o lume în care intri și din care nu vrei să ieși.</p>
          </motion.div>
        </div>
      </section>

      <section className="cinematic-feature" id="carti" ref={featureRef}>
        <video autoPlay muted loop playsInline className="cinematic-bg-video"><source src="/assets/books-cinematic/hallway.mp4" type="video/mp4" /></video>
        <div className="cinematic-feature-inner">
          <div className="book-feature-copy"><motion.p className="section-kicker" initial={{ opacity: 0 }} animate={featureInView ? { opacity: 1 } : {}} transition={{ duration: 0.8 }}><span className="eyebrow-text">02 — Carte featured</span></motion.p><motion.h2 initial={{ opacity: 0, y: 30 }} animate={featureInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>Unreachable</motion.h2><motion.p className="book-meta" initial={{ opacity: 0 }} animate={featureInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.22 }}>Dark Romance · Thriller psihologic · Remote northern estate</motion.p><motion.p initial={{ opacity: 0 }} animate={featureInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.32 }}>Iris Vane dispare într-o noapte de decembrie. Când se trezește într-o cameră perfectă, într-o casă fără ieșire, înțelege că bărbatul care a urmărit-o luni întregi nu este un necunoscut — este un arhitect al obsesiei.</motion.p><motion.div className="literary-chips" initial={{ opacity: 0 }} animate={featureInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.42 }}>{["villain romance","psychological tension","remote estate","literary prose","slow burn"].map((chip) => <span key={chip}>{chip}</span>)}</motion.div><motion.div className="book-quotes" initial={{ opacity: 0 }} animate={featureInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.52 }}><p>„Nu voiam să plec. Nu voiam să rămân. Voiam să fiu văzută.”</p><p>„Conacul era o capcană frumoasă. El era lacătul.”</p><p>„Iubirea lui era ca marea iarna — rece, inevitabilă, perfectă.”</p></motion.div><motion.div className="books-actions" initial={{ opacity: 0 }} animate={featureInView ? { opacity: 1 } : {}} transition={{ duration: 0.8, delay: 0.62 }}><a className="button primary" href="https://www.amazon.co.uk/dp/B0GXSLHRNY" target="_blank" rel="sponsored noopener noreferrer">Citește pe Amazon <ArrowRight size={18} /></a><a className="button ghost" href={goodreads} target="_blank" rel="noopener noreferrer">Goodreads</a></motion.div></div>
          <motion.figure className="cinematic-trailer-card" style={{ scale: featureScale }}><video autoPlay muted loop playsInline><source src="/assets/books-cinematic/unreachable-trailer-card.mp4" type="video/mp4" /></video><span className="trailer-badge">▶ Trailer</span><div className="card-shimmer" aria-hidden="true" /><figcaption><strong>Unreachable</strong><small>Aura Dobre · Dark Romance</small></figcaption></motion.figure>
        </div>
      </section>

      <section className="cinematic-quote">
        <video autoPlay muted loop playsInline><source src="/assets/books-cinematic/atmosphere.mp4" type="video/mp4" /></video>
        <motion.div className="cinematic-quote-inner" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
          <blockquote>
            <motion.span initial={{ opacity: 0, y: 30, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>She knew the moment she</motion.span>
            <motion.span initial={{ opacity: 0, y: 30, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}>walked in.</motion.span>
            <motion.span initial={{ opacity: 0, y: 30, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.49, ease: [0.16, 1, 0.3, 1] }}>Not where he was.</motion.span>
            <motion.span initial={{ opacity: 0, y: 30, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.66, ease: [0.16, 1, 0.3, 1] }}>That he was.</motion.span>
          </blockquote>
          <motion.div className="quote-book-label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 1.25 }}><i />Unreachable<i /></motion.div>
        </motion.div>
      </section>

      <section className="cinematic-library">
        <div className="cinematic-library-head" data-reveal><h2>Alte cărți scrise de mine</h2><p>Scriu în mai multe lumi — fiecare carte e un univers cu propria sa atmosferă, propriile sale reguli și propriile sale personaje care nu te lasă să uiți.</p></div>
        <div className="cinematic-published-grid">{publishedBooks.map((book) => <article className="cinematic-published-card" data-reveal key={book.title}><div className="published-image-frame"><img src={book.image} alt={`Coperta ${book.title}`} /></div><div><span>{book.meta}</span><h3>{book.title}</h3><em>{book.subtitle}</em><p>{book.copy}</p><a href={book.link} target="_blank" rel="sponsored noopener noreferrer"><BookOpen size={13} /> Disponibil pe Amazon <ArrowRight size={12} /></a></div></article>)}</div>
        <div className="cinematic-coming-label" data-reveal>Ce urmează</div>
        <div className="cinematic-coming-grid">
          <article className="cinematic-upcoming-card" data-reveal><div className="upcoming-image-frame"><img src="/assets/books-cinematic/echoes-of-eternity.webp" alt="Coperta Echoes of Eternity" /></div><div><span className="upcoming-badge">În curând</span><h3>Echoes of Eternity</h3><em>Unraveling the Dawn of Faith and Forgotten Histories</em><p className="upcoming-meta">Spiritualitate · Istorie · Esoteric</p><p>O călătorie prin simbolurile și credințele care au modelat umanitatea — de la rune la mandala, de la pietre antice la mitul eternității.</p><a href={authorAmazon} target="_blank" rel="noopener noreferrer"><BookOpen size={13} /> Notifică-mă <ArrowRight size={12} /></a></div></article>
          <article className="abstract-story-card" data-reveal><video autoPlay muted loop playsInline><source src="/assets/books-cinematic/book-pages.mp4" type="video/mp4" /></video>{["obsesie","putere","frică","control","dorință","umbră"].map((word, index) => <span className={`scattered-word word-${index + 1}`} key={word}>{word}</span>)}<div><span>Abstract storytelling</span><h3>„Nescrisă”</h3><p>Manuscrisul care respiră în sertar. Personajele există deja — așteptând să fie eliberate în pagini.</p><a href="mailto:auraleodobre@gmail.com?subject=Notificare%20carte%20noua">Notifică-mă <ArrowRight size={12} /></a></div></article>
        </div>
      </section>

      <section className="cinematic-reader reader-subscribe" id="cititoarea" data-reveal>
        <div className="reader-subscribe-card">
          <p className="section-kicker"><span className="eyebrow-text">04 — Cititoarea mea</span></p>
          <h2>Pentru cine sunt cărțile mele?</h2>
          <p>Pentru cititoarea care iubește intensitatea — care vrea să simtă tensiunea de pe fiecare pagină, care nu se teme de eroi moralmente gri și care citește la 3 dimineața pentru că nu poate lăsa cartea jos.</p>
          <motion.div className="falling-genres" aria-label="Genurile și temele cărților" initial={reducedMotion ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: .38 }}>
            {fallingGenres.map(([label, color, ink, rotation], index) => (
              <motion.span
                key={label}
                custom={{ index, rotation }}
                variants={genreDropVariants}
                style={{ "--genre-color": color, "--genre-ink": ink }}
              >{label}</motion.span>
            ))}
          </motion.div>
          <div className="reader-newsletter-separator" aria-hidden="true" />
          <div className="reader-newsletter-mark" aria-hidden="true"><BookOpen size={30} weight="thin" /></div>
          <h3>Primește următorul capitol</h3>
          <p className="reader-newsletter-note">Noutăți despre cărți, fragmente în premieră și universuri care se pregătesc să prindă viață.</p>
          <form className="books-newsletter" onSubmit={(event) => { event.preventDefault(); setNewsletterStatus("success"); }}>
            <input id="books-newsletter-email" aria-label="Adresa ta de email" type="email" placeholder="Adresa ta de email" required />
            <button type="submit">Abonează-mă <ArrowRight size={16} /></button>
          </form>
          {newsletterStatus === "success" && <p className="books-newsletter-success" role="status"><Check size={16} /> Mulțumesc! Te voi ține la curent.</p>}
        </div>
      </section>

      <section className="cinematic-author" id="despre" ref={authorRef}>
        <motion.div className="cinematic-author-bg" style={{ y: authorBgY }}><video autoPlay muted loop playsInline><source src="/assets/books-cinematic/book-pages.mp4" type="video/mp4" /></video></motion.div>
        <div className="cinematic-author-inner">
          <motion.div className="cinematic-author-copy" initial={reducedMotion ? false : { opacity: 0, x: -46 }} animate={authorInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}>
            <p className="section-kicker"><span className="eyebrow-text">05 — Autoarea</span></p>
            <h2>În spatele poveștilor</h2>
            <div className="author-signature">Aura Dobre</div>
            <p>Aura Dobre scrie ficțiune care se citește ca un film — cu personaje care te urmăresc mult timp după ce ai închis cartea. Îmi construiesc lumile din psihologie, tensiune, atmosferă și detalii vizuale care rămân în memorie.</p>
            <p>În paralel cu scrisul, creez identități vizuale și experiențe digitale; de aceea pagina aceasta nu este doar o listă de linkuri, ci o vitrină cinematică pentru universurile mele.</p>
            <div className="books-actions"><a className="button primary" href="mailto:auraleodobre@gmail.com?subject=Newsletter%20Aura%20Dobre">Newsletter</a><a className="button ghost" href="/studio" onClick={(event) => onNavigate(event, "/studio")}>Studio Digital</a><a className="button ghost" href="/contact" onClick={(event) => onNavigate(event, "/contact")}>Contact</a></div>
          </motion.div>
          <motion.figure className="author-portrait-stage" style={{ y: reducedMotion ? 0 : authorPortraitY }} initial={reducedMotion ? false : { opacity: 0, scale: 1.08 }} animate={authorInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1.25, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}>
            <motion.img src="/assets/books-cinematic/aura-in-red.webp" alt="Aura Dobre, autoare, într-un portret pe fundal roșu" initial={reducedMotion ? false : { clipPath: "inset(18% 0 18% 0)" }} animate={authorInView ? { clipPath: "inset(0% 0 0% 0)" } : {}} whileHover={reducedMotion ? undefined : { scale: 1.035 }} transition={{ duration: 1.2, delay: 0.12, ease: [0.16, 1, 0.3, 1] }} />
            <motion.span className="author-orbit author-orbit-one" aria-hidden="true" animate={reducedMotion ? undefined : { rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}>AUTHOR · STORYTELLER · DREAMER · </motion.span>
            <span className="author-photo-caption">Portrait / Aura in red</span>
          </motion.figure>
        </div>
      </section>

      <section className="books-fan-section">
        <motion.div className="books-fan-copy" initial={reducedMotion ? false : { opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
          <p className="section-kicker"><span className="eyebrow-text">06 — Biblioteca Aura Dobre</span></p>
          <h2>Alege povestea care te cheamă.</h2>
          <p>Patru lumi, patru atmosfere și aceeași promisiune: o lectură care continuă să trăiască după ultima pagină.</p>
          <a className="button primary" href={authorAmazon} target="_blank" rel="noopener noreferrer">Descoperă toate cărțile <ArrowRight size={18} /></a>
        </motion.div>
        <motion.div className="books-fan" aria-label="Cărțile semnate de Aura Dobre" initial={reducedMotion ? false : { opacity: 0, y: 190, scale: 0.82 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.12 }} transition={{ type: "spring", stiffness: 92, damping: 17, delay: 0.18 }}>
          {footerBooks.map(([image, title, link, rotation, x], index) => (
            <motion.a
              key={title}
              href={link}
              target="_blank"
              rel="sponsored noopener noreferrer"
              aria-label={`${title} — deschide pagina cărții`}
              style={{ zIndex: index + 1, "--book-x": `${x}%`, "--book-rotate": `${rotation}deg` }}
              initial={false}
            ><img src={image} alt={`Coperta ${title}`} /></motion.a>
          ))}
        </motion.div>
      </section>

      <motion.section className="cinematic-final" ref={finalRef} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}><motion.div className="cinematic-final-orb" style={{ scale: finalScale }} /><p className="section-kicker"><span className="eyebrow-text">07 — Finale</span></p><h2>Hai să intri <em>în poveste.</em></h2><p>O carte de Aura Dobre nu se uită ușor. Intră în lumea ei și vei vrea să rămâi.</p><div className="books-actions"><a className="button primary" href={authorAmazon} target="_blank" rel="noopener noreferrer">Cărți pe Amazon <ArrowRight size={18} /></a><a className="button ghost" href="https://aurasdigitaldream.gumroad.com/" target="_blank" rel="noopener noreferrer">Cărțile mele pe Gumroad</a></div></motion.section>
      <SiteFooter />
      <a className="floating-whatsapp" href="https://wa.me/40762509423" aria-label="Scrie-mi pe WhatsApp"><WhatsappLogo size={28} weight="fill" /></a>
    </main>
  );
}

/* `path` is only passed when rendering on the server, where there is no
   window to read the route from. In the browser it stays undefined and the
   component behaves exactly as before. */
export function App({ path }) {
  const [currentPath, setCurrentPath] = useState(
    path ?? (typeof window === "undefined" ? "/" : window.location.pathname),
  );
  useScrollExperience(currentPath);
  const groupedProjects = useMemo(() => portfolioGroups.map((group) => ({
    ...group,
    projects: group.slugs.map((slug) => projects.find((project) => project.slug === slug)).filter(Boolean),
  })), []);
  const featured = projects.filter((project) => featuredSlugs.includes(project.slug));
  const detailSlug = currentPath.match(/^\/portofoliu\/([^/]+)\/?$/)?.[1];
  const detailProject = projects.find((project) => project.slug === detailSlug);

  useEffect(() => {
    const origin = "https://aurastudios.ro";
    const staticMeta = {
      "/": {
        title: "Aura's Digital Dream | Marketing · Design · Web",
        description: "Designer, marketer și sculptor digital. Identități care unesc Renașterea, efemerul și viitorul — strategie, design și experiențe digitale.",
        image: "/og-cover.jpg",
        type: "website",
      },
      "/studio": {
        title: "Studio — Portofoliu și servicii | Aura's Digital Dream",
        description: "Descoperă portofoliul, serviciile, procesul și proiectele de branding, design, marketing și web realizate de Aura's Digital Dream.",
        image: "/og-cover.jpg",
        type: "website",
      },
      "/cartile-mele": {
        title: "Cărțile mele — Aura Dobre",
        description: "Dark romance, thrillere psihologice și povești care se citesc ca un film.",
        image: "/og-cover.jpg",
        type: "website",
      },
      "/contact": {
        title: "Contact — Atelierul | Aura's Digital Dream",
        description: "Scrie-mi povestea proiectului tău — o pagină de contact cinematică, cu Medusa.",
        image: "/og-cover.jpg",
        type: "website",
      },
    };
    const meta = detailProject
      ? {
          title: `${detailProject.title.split(" — ")[0]} — Aura's Digital Dream`,
          description: detailProject.description,
          image: `/og/${detailProject.slug}.jpg`,
          type: "article",
        }
      : staticMeta[currentPath];
    if (!meta) return;

    const absoluteUrl = origin + currentPath;
    const absoluteImage = origin + meta.image;
    const setContent = (selector, value) => document.querySelector(selector)?.setAttribute("content", value);
    document.title = meta.title;
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", absoluteUrl);
    setContent('meta[name="description"]', meta.description);
    setContent('meta[property="og:url"]', absoluteUrl);
    setContent('meta[property="og:title"]', meta.title);
    setContent('meta[property="og:description"]', meta.description);
    setContent('meta[property="og:image"]', absoluteImage);
    setContent('meta[property="og:type"]', meta.type);
    setContent('meta[name="twitter:title"]', meta.title);
    setContent('meta[name="twitter:description"]', meta.description);
    setContent('meta[name="twitter:image"]', absoluteImage);
  }, [currentPath, detailProject]);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (currentPath !== "/studio" || !window.location.hash) return;
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
      window.history.pushState({}, "", `/studio#${id}`);
      setCurrentPath("/studio");
      scheduleScrollToId(id);
    };
    if (currentPath !== "/studio" && document.startViewTransition) document.startViewTransition(revealSection);
    else revealSection();
  }

  if (detailProject && projectDetails[detailSlug]) {
    return <ProjectDetail project={detailProject} details={projectDetails[detailSlug]} onNavigate={navigateTo} onSection={goToSection} />;
  }

  if (currentPath === "/cartile-mele") {
    return <BooksPageCinematic onNavigate={navigateTo} />;
  }

  if (currentPath === "/contact") {
    return <ContactPage />;
  }

  if (currentPath === "/studio") return <HomePage onNavigate={navigateTo} />;

  return <EditorialArchive />;
}
