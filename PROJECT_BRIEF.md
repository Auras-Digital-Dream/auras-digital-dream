# Aura's Digital Dream — Renaissance Redesign
## Proiect complet — Documentație internă

### Stack
- React 19.2 + Vite 6.4 + Motion 13.1 + three.js
- Publicat pe Vercel din `main`
- Font display: Amoresa (subsetată, nu în repo)
- Font body: EB Garamond
- Font proiecte: Marcellus

---

### Paleta de culori (înlocuiește TOTUL)

| Token | Hex | Rol |
|-------|-----|-----|
| `--cream` | `#EDEDE9` | Fundal principal |
| `--mint-pale` | `#C3D4D2` | Hover states, accente subtile |
| `--beige-gold` | `#C3BEA4` | Borduri decorative, separatori |
| `--bronze-light` | `#A79F83` | Text secundar, metadata |
| `--water-green` | `#BCD7D2` | Glassmorphism, carduri translucide |
| `--charcoal` | `#34312D` | Text principal |
| `--teal-dark` | `#477473` | CTA-uri primare, link-uri active |
| `--bronze-dark` | `#6E4925` | Accente calde, hover butoane |

---

### Materiale primite

#### Batch 1 (inițial)
1. `WhatsApp Image 2026-08-24 at 10.22.38.jpeg` — Logo LOVERA™ → înlocuiește textul din header lângă logo
2. `image.png` — "Hi, I am Olivia" (portret orange) → secțiunea "Despre mine", imagine decupată central
3. `image(1).png` — Renascentistă cu ochelari, fundal statuie/flori → **background secțiune "Despre mine"**
4. `Imagine Codex 24 aug. 2026, 14_59_30.png` — Femeie cu laptop în nori (stil pictură clasică) → secțiune de tranziție/proces
5. `Imagine Codex 24 aug. 2026, 15_02_04.png` — Mese de femei cu laptopuri (stil clasic) → **footer background**

#### Batch 2 (video + referință)
6. `WhatsApp Video 2026-08-24 at 11.04.57.mp4` — Statui clasice în templu cu petale de trandafir căzând → **hero scroll storytelling**
7. `WhatsApp Image 2026-08-24 at 11.04.11 (4).jpeg` — Referință layout exact: "AURA'S DIGITAL DREAM", navigație, CTA, siglă circulară

#### Batch 3 (7 portrete editoriale)
8. `aura in red.jpeg` — Portret pe fundal roșu, bijuterii aurii → secțiunea "Despre mine" / pagina cărți
9. `aura with details over face.jpeg` — Colaj artistic text manuscris + frunze → pagina editorială
10. `black and white portrait.jpeg` — Portret B&W dramatic → pagina editorială
11. `contrast portrait.jpeg` — B&W cu accent albastru → pagina editorială (hover B&W→color)
12. `elegant photo aura.jpeg` — Fotografie elegantă, lumină naturală → secțiune "Despre mine" (imagine secundară)
13. `new york times -aura.jpeg` — Ziar în flăcări → pagina editorială (piesă centrală, glow warm)
14. `upside down pic.jpeg` — Perspectivă artistică pe scări → pagina editorială (layout asimetric)

---

### Structura site-ului

1. **Home** — Video hero (statui + petale), layout ca în referință Codex
2. **Despre mine** — Imaginea #3 (renascentistă cu ochelari) ca background + portret "aura in red" decupat central + text "eu sunt / Aura" + imaginea elegantă secundară
3. **Portofoliu / Proiecte editoriale** — Cele 7 imagini noi într-o galerie imersivă cu scroll storytelling
4. **Cărți** — Pagina existentă `BooksPageCinematic` — va fi actualizată cu portretul "aura in red"
5. **Footer** — Imaginea #5 (femeile cu laptopuri) ca background parallax + "auras digital dream" + social media + animație loop text

---

### Animații cerute (toate implementate nativ)

- Scroll storytelling cu animații sincronizate
- Parallax pe mai multe straturi
- Glassmorphism și Liquid Glass
- Carduri 3D cu efect de înclinare la cursor
- Fundaluri animate cu mesh gradients și particule
- Texte animate (word reveal, scramble, split text)
- Tranziții fluide între secțiuni și pagini
- Cursor personalizat și efecte magnetice
- SVG și logo-uri animate
- Microinteracțiuni rafinate pentru fiecare buton, formular și element interactiv
- Efecte de lumină, reflexii și umbre dinamice
- Elemente care răspund în timp real la poziția cursorului și la scroll

---

### Decizii de design

- Tipografie: Serif cu contrast înalt pentru display, sans-serif curat pentru body
- Atmosferă: Lumină difuză, texturi de marmură și stofă, tranziții fluide
- Video hero: Playback controlat de scroll
- Secțiune "Despre mine": "eu sunt" font mediu, "Aura" font masiv display
- Footer: Text brand cu animație loop (scramble/fade pulse/marquee), iconițe social cu hover magnetic
- Toate animațiile respectă `prefers-reduced-motion`
- Animații doar pe `transform` și `opacity`

---

### Fișiere de generat

1. `PROJECT_BRIEF.md` — acest fișier
2. `HomePage.jsx` — homepage complet cu toate secțiunile
3. `AboutSection.jsx` — secțiunea "Despre mine"
4. `Footer.jsx` — footer cu imaginea #5
5. `EditorialPage.jsx` — pagina imagini editoriale
6. `App.jsx` — rutare actualizată
7. `main.css` — variabile CSS noi + stiluri
