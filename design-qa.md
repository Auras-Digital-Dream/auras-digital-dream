# Design QA — secțiunile inferioare ale paginii de cărți

source visual truth path: `C:\Users\aural\Downloads\inspiratie carti.mp4` (cadru capturat în `design-qa-source.png`)

implementation screenshot path: `design-qa-implementation.png`

comparison image path: `design-qa-comparison.png`

viewport: desktop implicit Edge, 1125 x 772 CSS px; verificare responsive suplimentară la override 390 x 844, randat de extensie la 434 x 938 CSS px

pixel dimensions and density normalization: sursă 1142 x 784 px; implementare 1125 x 772 px; comparație 1142 x 784 px; capturi la densitatea implicită a browserului, scalate proporțional în aceeași planșă pentru comparație vizuală

state: secțiunea de abonare și pilulele după intrarea în viewport; secțiunea cu evantaiul de cărți după animație; formular testat în starea de succes

## Full-view comparison evidence

Planșa `design-qa-comparison.png` pune în același cadru secțiunea de abonare din videoclip și implementarea Aura Dobre. Structura, contrastul, formularul liniar, fundalul aproape negru și gruparea pilulelor colorate păstrează direcția vizuală a sursei, fără a copia identitatea sau textele site-ului din videoclip.

## Focused region comparison evidence

Au fost inspectate separat zona formularului și a pilulelor, apoi evantaiul cu cele patru coperți. Verificarea focalizată a fost necesară pentru alinierea câmpului și butonului, lizibilitatea etichetelor, rotațiile pilulelor, crop-ul copertelor și suprapunerea cărților.

## Findings

Nu au rămas diferențe P0, P1 sau P2 acționabile. Adaptările de copy, serif-ul existent și paleta Aura Dobre sunt intenționate, pentru continuitatea brandului.

- [P3] Pilulele din implementare sunt mai ordonate decât în referință. Acest lucru păstrează lizibilitatea pe mobil; efectul de cădere și rotațiile oferă în continuare impresia de acumulare.

## Required fidelity surfaces

- Fonts and typography: serif-ul cinematic existent este păstrat pentru titluri; textul UI folosește familia sans a proiectului, cu greutăți și contrast lizibile.
- Spacing and layout rhythm: ierarhia abonare → pilule → autoare → evantai este clară; nu există overflow orizontal la verificarea mobilă.
- Colors and visual tokens: fundal aproape negru, alb cald și accentele colorate corespund direcției sursei și rămân compatibile cu tema paginii.
- Image quality and asset fidelity: sunt folosite coperțile reale deja existente în proiect, fără substituții sau ilustrații improvizate.
- Copy and content: toate textele sunt rescrise pentru Aura Dobre și universul cărților ei; nu este preluat copy-ul site-ului de referință.

## Interaction and accessibility evidence

- Formularul acceptă un email valid și afișează local mesajul de succes.
- Câmpul are etichetă accesibilă, imaginile au texte alternative, linkurile au denumiri explicite.
- `prefers-reduced-motion` este respectat prin dezactivarea stărilor inițiale animate.
- Consola browserului: zero erori.
- Build de producție: trecut.

## Comparison history

1. P2 găsit: eticheta accesibilă era afișată și rupea grila formularului. Fix: eticheta vizuală a fost înlocuită cu `aria-label`; recapturarea arată câmpul și butonul pe același rând.
2. P1 găsit: coperțile rămâneau invizibile deoarece fiecare element absolut depindea de propriul observer. Fix: animația a fost mutată pe containerul evantaiului, iar rotațiile finale sunt definite stabil în CSS; recapturarea arată toate cele patru coperți.
3. Verificare după fix: fără probleme P0/P1/P2 pe desktop; fără overflow orizontal la viewport mobil.

## Implementation checklist

- [x] formular de abonare funcțional
- [x] pilule animate la scroll
- [x] evantai animat cu coperțile reale
- [x] layout responsive și reduced motion
- [x] build și verificare în browser

## Actualizare QA — portretul autoarei

- source visual truth path: `C:\Users\aural\OneDrive\Immagini\aura\IMAGINI EDITORIALE\aura in red.jpeg`
- implementation screenshot path: `design-qa-author-implementation.png`
- combined comparison path: `design-qa-author-comparison.png`
- viewport: 1142 x 784 CSS px, densitate implicită Edge; verificare responsive suplimentară la 434 x 938 CSS px
- source pixels: 1086 x 1448; implementation capture pixels: 1142 x 784; imaginile au fost normalizate proporțional în aceeași planșă
- state: secțiunea `#despre` după reveal și stabilizarea parallaxului

### Evidence și findings

Planșa combinată confirmă păstrarea fidelă a portretului, a proporțiilor, culorii burgundy și a detaliilor aurii. Integrarea adaugă ramă decalată, lumină ambientală, caption editorial, orbită animată, reveal vertical, parallax și hover fără să altereze fotografia.

Nu au rămas diferențe P0, P1 sau P2 acționabile. Prima captură a evidențiat contrast insuficient al textului peste filmarea cu pagini și tăierea elementului orbital. Filmarea a fost întunecată și colorată spre burgundy, iar clip-path-ul a fost mutat de pe întreaga figură pe imagine, astfel încât rama și orbita să rămână vizibile.

- Fonts and typography: titlul serif, semnătura italică și microcopy-ul sans păstrează ierarhia editorială.
- Spacing and layout: grila text-portret este echilibrată pe desktop și devine o singură coloană pe mobil, fără overflow orizontal.
- Colors and tokens: burgundy, negru și auriu derivă direct din fotografie și se leagă de paleta cinematică existentă.
- Image quality: fotografia originală este servită local, fără regenerare, deformare sau crop agresiv.
- Copy and content: copy-ul existent al autoarei a fost păstrat; s-au adăugat doar semnătura și caption-ul editorial.
- Accessibility and motion: alt text descriptiv, contrast corectat, hover opțional și dezactivarea reveal/parallax/rotație pentru `prefers-reduced-motion`.
- Browser evidence: imagine vizibilă, fără overflow pe mobil și zero erori în consolă.

## Actualizare QA — paleta unitară și reîncadrarea finală

- source visual truth path: cele două capturi atașate de utilizatoare în conversație, cu nuanța bleumarin-negru și problemele de încadrare marcate vizual
- implementation screenshot paths: `design-qa-books-palette-reader.png`, `design-qa-books-palette-author.png`
- viewport: 1142 x 784 CSS px, densitate implicită Edge; verificare responsive la 434 x 938 CSS px
- state: secțiunea cititoarei după animația pilulelor și secțiunea autoarei după reveal/parallax
- normalization: capturile de implementare au fost evaluate la scara naturală a browserului; referința a fost folosită pentru culoare, margini și vizibilitatea filmării, nu pentru reproducere pixel-perfect a întregii pagini

### Full-view și focused-region evidence

Captura cititoarei confirmă folosirea nuanței `#11111f`, margini laterale egale, padding vertical echilibrat, formular aliniat și pilule complet încadrate. Captura autoarei confirmă insigna circulară și caption-ul în interiorul portretului, rama vizibilă, precum și filmarea cu pagini păstrată clar în spatele textului și în spațiul dintre coloane.

### Findings și history

1. P2 inițial: paleta era fragmentată între gri-albăstrui, negru și burgundy. Fix: a fost introdusă o bază `#11111f` cu gradiente bleumarin, reflexe violet și tranziții specifice pentru hero, univers, bibliotecă, cititoare, autoare, fan, final și footer.
2. P2 inițial: cadrul cititoarei și elementele portretului păreau tăiate. Fix: cardul a primit lățime maximă și padding simetric, iar orbita și caption-ul au fost mutate complet în interiorul fotografiei.
3. P2 inițial: filmarea autoarei era excesiv întunecată. Fix: luminozitatea video a crescut la `.68`, saturația la `.72`, iar overlay-ul a fost redus și localizat gradual pentru păstrarea contrastului textului.
4. Post-fix: zero overflow orizontal pe desktop și mobil, zero erori în consolă, fără elemente tăiate în capturile finale.

- Typography: ierarhia serif/sans rămâne coerentă, cu wrapping controlat.
- Spacing/layout: cadrele și elementele decorative sunt complet încadrate; grila devine o coloană pe mobil.
- Colors/tokens: întreaga pagină folosește acum aceeași familie bleumarin-negru, cu variații de lumină și profunzime.
- Image/video quality: portretul original rămâne intact; filmarea este mai luminoasă și mai ușor de perceput.
- Copy/content: textele existente au fost păstrate.
- Accessibility/motion: contrastul textului rămâne lizibil, iar reduced motion continuă să fie respectat.

final result: passed
