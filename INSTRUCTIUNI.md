# Instrucțiuni de Integrare — Aura's Digital Dream Renaissance

## Pași rapizi (5 minute)

### 1. Descarcă fișierele
Toate fișierele generate sunt în folderul `output/`. Descarcă-le pe toate.

### 2. Copiază fișierele în proiect

```
auras-digital-dream/
├── src/
│   ├── App.jsx              ← înlocuiește cu cel nou
│   ├── HomePage.jsx         ← fișier nou
│   ├── AboutSection.jsx     ← fișier nou
│   ├── EditorialPage.jsx    ← fișier nou
│   ├── Footer.jsx           ← fișier nou
│   ├── main.css             ← înlocuiește cu cel nou
│   └── main.jsx             ← adaugă import './main.css'
│
└── public/
    └── assets/              ← creează acest folder
        ├── logo-lovera.jpg
        ├── hero-statues.mp4
        ├── about-bg.jpg
        ├── aura-red.jpg
        ├── process-bg.jpg
        ├── footer-bg.jpg
        ├── editorial-1.jpg
        ├── editorial-2.jpg
        ├── editorial-3.jpg
        ├── editorial-4.jpg
        ├── editorial-aura-red.jpg
        ├── editorial-details-face.jpg
        ├── editorial-bw-portrait.jpg
        ├── editorial-contrast.jpg
        ├── editorial-elegant.jpg
        ├── editorial-nyt.jpg
        └── editorial-upside-down.jpg
```

### 3. Redenumește imaginile tale
Redenumește imaginile pe care mi le-ai trimis conform listei de mai sus și pune-le în `public/assets/`.

| Fișierul tău original | Redenumește în |
|---|---|
| `WhatsApp Image 2026-08-24 at 10.22.38.jpeg` | `logo-lovera.jpg` |
| `WhatsApp Video 2026-08-24 at 11.04.57.mp4` | `hero-statues.mp4` |
| `image(1).png` (renascentistă cu ochelari) | `about-bg.jpg` |
| `aura in red.jpeg` | `aura-red.jpg` |
| `Imagine Codex 24 aug. 2026, 14_59_30.png` (femeie cu laptop în nori) | `process-bg.jpg` |
| `Imagine Codex 24 aug. 2026, 15_02_04.png` (mese de femei cu laptopuri) | `footer-bg.jpg` |
| `image.png` (Olivia orange) | `editorial-1.jpg` |
| `aura with details over face.jpeg` | `editorial-details-face.jpg` |
| `black and white portrait.jpeg` | `editorial-bw-portrait.jpg` |
| `contrast portrait.jpeg` | `editorial-contrast.jpg` |
| `elegant photo aura.jpeg` | `editorial-elegant.jpg` |
| `new york times -aura.jpeg` | `editorial-nyt.jpg` |
| `upside down pic.jpeg` | `editorial-upside-down.jpg` |
| `WhatsApp Image 2026-08-24 at 11.04.11 (4).jpeg` (referință layout) | NU e nevoie, e doar referință |

**Notă:** Imaginile `editorial-1.jpg` până la `editorial-4.jpg` din secțiunea Portofoliu sunt placeholder-e. Înlocuiește-le cu proiectele tale reale sau folosește imaginile editoriale.

### 4. Verifică dependințele
Asigură-te că ai instalat:
```bash
npm install react-router-dom
```

### 5. Testează local
```bash
npm run dev
```

### 6. Deploy
```bash
git add .
git commit -m "feat: renaissance redesign"
git push origin main
```
Vercel va face deploy automat.

---

## Ce conține redesign-ul

### Secțiuni noi/modificate în HomePage:
1. **Hero** — Video scroll-driven (statui + petale), text "AURA'S DIGITAL DREAM", siglă circulară rotativă, scramble text
2. **Servicii** — 6 carduri glassmorphism cu tilt 3D
3. **Portofoliu** — Grid 2 coloane cu parallax, particule canvas, mesh gradient
4. **Despre mine** — Background renascentist, portret "aura in red" decupat, text "eu sunt / Aura"
5. **Proces** — Secțiune de tranziție cu imaginea #4 (femeie cu laptop în nori)
6. **Insights** — Testimoniale în carduri glassmorphism
7. **Contact** — CTA pe fundal închis
8. **Footer** — Background imaginea #5, text "auras digital dream", social media, animație scramble loop

### Pagină nouă:
- **/editorial** — Galerie masonry cu cele 7 portrete, parallax, hover B&W→color, reveal la scroll

### Animații implementate:
- ✅ Scroll storytelling (video hero sincronizat cu scroll)
- ✅ Parallax multi-strat (imagini, text, fundal)
- ✅ Glassmorphism & Liquid Glass (carduri, header)
- ✅ Carduri 3D tilt la cursor
- ✅ Mesh gradients animate
- ✅ Particule canvas
- ✅ Texte animate (word reveal, scramble)
- ✅ Tranziții fluide între secțiuni
- ✅ Cursor personalizat (dot + ring)
- ✅ SVG animate (ornamente cu stroke-dashoffset)
- ✅ Microinteracțiuni (hover, focus, magnetic buttons)
- ✅ Efecte de lumină dinamică
- ✅ Elemente care răspund la cursor și scroll în timp real
- ✅ Respectă `prefers-reduced-motion`

### Paleta nouă (înlocuiește totul):
- `#EDEDE9` cream, `#C3D4D2` mint, `#C3BEA4` beige-gold, `#A79F83` bronze-light
- `#BCD7D2` water-green, `#34312D` charcoal, `#477473` teal-dark, `#6E4925` bronze-dark

---

## Troubleshooting

**Eroare `react-router-dom` not found:**
```bash
npm install react-router-dom
```

**Imaginile nu se încarcă:**
Verifică că fișierele sunt în `public/assets/` (nu `src/assets/`). React servește `public/` la root.

**Fontul Amoresa nu apare:**
Fontul Amoresa trebuie încărcat manual (e subsetat și nu e în repo). Adaugă-l în `public/fonts/` și importă-l în `main.css`.

**Video-ul nu pornește:**
Asigură-te că fișierul `hero-statues.mp4` e în `public/assets/` și că browserul suportă formatul.
