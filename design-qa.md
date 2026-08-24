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

final result: passed
