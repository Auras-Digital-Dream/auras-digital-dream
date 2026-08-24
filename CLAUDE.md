# aurastudios.ro

Site-ul de prezentare al Aurei Dobre — designer, marketer și autoare.
React 19.2 · Vite 6.4 · Motion 13.1 · three.js. Se publică pe Vercel, din
`main`. Fiecare push declanșează build-ul.

```
npm run dev      # dezvoltare
npm run build    # build + prerender a 18 rute + sitemap + llms.txt
```

---

## Reguli date de Aura. Nu se încalcă fără să o întrebi.

1. **Fontul de display rămâne Amoresa.** E semnătura ei. Marcellus se
   folosește doar în paginile de proiect; EB Garamond pentru text curent.
2. **Nu modifica text existent** fără să ceară ea. Poți adăuga text nou, dar
   spune-i clar ce ai scris.
3. **Folosește doar variabilele din `:root`.** Ai nevoie de o culoare nouă?
   Spune numele, hexul și unde o folosești **înainte** să o adaugi.
4. **Orice animație respectă `prefers-reduced-motion`.**
5. **Animă doar `transform` și `opacity`.** Nu width/height/top/left, nu
   box-shadow greu — blochează scroll-ul.
6. **Nu atinge:** hero-ul cu mâna de marmură, panoul „01-02-03", cardurile
   de portofoliu din slider.
7. **Rezumat scurt după fiecare modificare** — 3-5 rânduri, nu tot codul.
8. **Șterge codul mort** ca parte din fiecare schimbare, fără să ți se ceară.
   Reguli CSS orfane au produs deja bug-uri reale de cascadă aici.
9. **Răspunde în română.**
10. **Prețurile rămân afișate** pe site. Decizie luată.

---

## Metoda care contează

Site-ul ăsta a fost construit măsurând, nu presupunând. Lecțiile au fost
plătite scump:

- **Măsoară pixelii randați, nu valorile declarate.** Contrastul se
  calculează compunând culoarea textului peste ce e efectiv în spatele lui,
  nu peste tokenul din CSS.
- **Când instrumentul contrazice ochiul, verifică întâi instrumentul.** Au
  fost cel puțin cinci alarme false aici: eyebrow-uri cu `background-clip:
  text` citite ca 1.00:1, un audit de contrast rulat pe o statuie invizibilă,
  secțiuni „nerelevate" care erau de fapt un server local lent.
- **Nu urca ce nu poți demonstra că funcționează.** O protecție care n-a
  reparat nimic măsurabil a fost scoasă înainte de commit.
- **Testează sub CSP-ul real.** Un bug a ajuns în producție fiindcă în dev nu
  există `Content-Security-Policy`. Servește `dist/client` cu header-ul din
  `vercel.json` înainte de a publica orice care încarcă WebAssembly, blob-uri
  sau resurse externe.
- **După fiecare deploy**, compară numele fișierului CSS/JS din `dist/client`
  cu cel din HTML-ul live. Altfel nu știi dacă s-a publicat.

---

## Culorile

Ground alb, ink pentru text, aur ca singurul accent activ.

```
--paper #FFFFFF     --ink #2D353C       --ink-ground #13171A   fundal secțiuni închise
--gold  #C9A86A     --glass-edge #87CEEB --line #DFE7EC
--petal #EBBCC0     --bloom #ACBCE3     --leaf #ACB288         grădina
```

`--petal`, `--bloom` și `--leaf` **nu au fost alese** — au fost măsurate din
fotografia `sources/portret/aura-dobre.jpeg`: nuanțele 354°, 223° și 69°,
ridicate în valoare și tăiate în saturație ca să trăiască pe hârtie albă.
Verdele nu apare niciodată ca accent, doar ca umbră.

Aura a cerut explicit ca nimic să nu arate gri. `--sky` și `--steel` erau la
9% saturație și au fost mutate pe nuanța de nu-mă-uita, la aceeași
luminozitate. Dacă mai găsești gri, schimbă-l.

---

## Materiale

Tot ce se servește e în `public/`. Originalele din care se generează sunt în
`sources/`, cu licențele lor — vezi `sources/README.md`.

| ce | din ce | cu ce |
|---|---|---|
| `public/models/thalia*.glb` | `sources/statuie/` | `scripts/make-statue.py` |
| `public/assets/roza.webp`, `nu-ma-uita.webp` | `sources/botanice/` | `scripts/make-botanical.py` |
| `public/assets/aura-dobre*.webp` | `sources/portret/` | manual, WebP 720 și 360px |

**`scripts/amoresa-source.otf` nu e în GitHub și nu are voie să fie** —
licențiat pentru uz personal, repo-ul e public. Versiunea subsetată de pe
site rămâne.

Statuia (CC BY 4.0) și gravurile botanice cer credit. Creditul statuii apare
în banda ei, jos-dreapta, și se aprinde abia pe ultima treime a mișcării.

---

## Capcane găsite aici

- **Roluri CSS moștenite.** O secțiune albă pusă într-o pagină ink
  moștenește `--accent` și `--muted` de la pagină și devine invizibilă. S-a
  întâmplat de patru ori. Verifică orice secțiune nouă pe fundal opus.
- **Specificitate.** `.glass-panel.is-frost` bate `.price-item.is-on` la
  specificitate egală fiindcă e declarată mai jos. A fost nevoie de trei
  clase.
- **Contexte 3D distrug claritatea textului.** `perspective` +
  `preserve-3d` + `rotateX` fac browserul să rasterizeze într-o textură. Nu
  le pune pe text.
- **Fiecare secțiune are `overflow: clip`.** Orice decor care iese din ea e
  tăiat drept.
- **Marginile libere sunt de 80px**, nu 180. Prea înguste pentru un element
  decorativ — florile stau în sferturile goale ale secțiunilor, definite
  individual prin `--bloom-x/-y/-w`.
- **Marcellus n-are virgulă-dedesubt** pentru ș/ț. `scripts/patch-marcellus.py`
  o adaugă ca glife compuse.

---

## Ce a rămas de făcut

**1. Cifre inventate, de scos.** Aura a confirmat că portofoliul e în mare
parte fabricat. Astea sunt afirmații despre lume care nu s-au întâmplat și
nu au variantă onestă. În `src/projectDetails.js`:

- linia 18 — „Creștere de 40% în recunoașterea brandului"
- linia 36 — „Poziționare premium confirmată de clienți"
- linia 45 — „Lansare de brand cu recepție excelentă"
- linia 90 — cinci cifre de campanie (+320% engagement, ROI 5.1x, ...)
- linia 117 — „Satisfacție 100%"

Se înlocuiesc cu ce a livrat efectiv. `PageSpeed 90+` (linia 108) e
verificabil — măsoară-l sau scoate-l.

**2. Clasificarea onestă a portofoliului.** Aura a stabilit-o:
**7 proiecte de client** (ADI ECOO, Campanie bijuterii, Cărți de Vizită,
Invitații, Documente & Licență, Artă Digitală, Logo Design), **4 proprii**
(Trend Vault, Magazine Online, Luxury Hair, Selecții Cromatice),
**5 concepte de nișă** (Verde Bean, Pâinea de Acasă, Lumina Botanica,
Lupul & Brici, Real Estate Co.). Trebuie să apară pe site. Un concept
etichetat corect nu e o slăbiciune; un client inventat e.

Un singur site e live: `adiecoo2009sa.ro`. `aurastrendvault.com` a expirat.

**3. Greutatea paginii de start: 22,7 MB pe telefon, din care 21,2 MB
video.** Trei fișiere nu sunt referite nicăieri și pot dispărea imediat:
`story-trailer-scroll.mp4` (12 MB), `branding-elements-montage-hero.mp4`
(7 MB), `identity-forge.mp4`.

**4. Prețurile sunt la ecranul 19 din 39** pe telefon. Animația a fost deja
reparată (1871ms → 732ms), dar poziția rămâne problema reală.

**5. Sticla din estimator înjumătățește fluența** — 26 de elemente cu
`backdrop-filter`, 31,4ms per cadru față de 16,6ms fără. Decizia e a Aurei:
sticla e limbajul vizual al site-ului.

**6. Patru legende din carusel sub 4.5:1** — Cărți de Vizită 1.87:1, Real
Estate 2.76:1, Logo Design 3.63:1, Invitații 4.03:1. Sunt pe lista
„nu atinge"; cere-i voie.

**7. Petalele nu-mă-uita au rămas crem**, nu albastre. Thomé le-a desenat
aproape albe; `bloom_blue()` din `make-botanical.py` le duce spre `--bloom`
doar pe vârfuri. Aura știe și decide dacă vrea mai apăsat.
