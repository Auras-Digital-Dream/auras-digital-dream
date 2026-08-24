# Surse

Originalele din care se generează materialele publicate. Nimic de aici nu
ajunge pe site — `public/` conține versiunile procesate, care sunt singurele
servite. Folderul acesta există ca site-ul să poată fi reconstruit fără să
depindă de calculatorul cuiva sau de un site din exterior care poate dispărea.

## portret/

`aura-dobre.jpeg` — fotografia lui Aura Dobre, 1254×1254.

Din ea vin două lucruri: portretul din secțiunea de Contact, și **întreaga
paletă botanică a site-ului**. Nuanțele nu au fost alese, au fost măsurate
din această imagine — 354° pentru `--petal`, 223° pentru `--bloom`, 69°
pentru `--leaf` — apoi ridicate în valoare și tăiate în saturație, ca să
trăiască pe hârtie albă în loc de lumina de seară din fotografie.

Se procesează manual în WebP la 720 și 360px → `public/assets/aura-dobre*.webp`.

## botanice/

Două planșe din secolul XIX, amândouă demult în domeniul public:

- `redoute-rosa-gallica-regalis.jpg` — Pierre-Joseph Redouté, *Les Roses*,
  c.1820. Trandafirul de pe secțiunile închise.
- `thome-myosotis-scorpioides.jpg` — Otto Wilhelm Thomé, *Flora von
  Deutschland*, 1885. Nu-mă-uita de pe secțiunile albe — aceeași floare care
  stă în spatele Aurei în portret.

Se procesează cu `scripts/make-botanical.py` → `public/assets/roza.webp` și
`public/assets/nu-ma-uita.webp`.

Scriptul le poate descărca singur de pe Wikimedia Commons, dar sunt păstrate
aici pentru că o adresă de pe internet nu e o garanție: dacă fișierul se mută
sau se șterge, scriptul nu mai are din ce lucra.

## statuie/

`statue-of-the-muse-thalia.glb` — scanarea 3D, 199.793 de triunghiuri.

**CC BY 4.0**, autor Samuel Francis Johnson (Oneironauticus). Uz comercial
permis, cu credit — creditul apare pe pagină, în banda statuii. Textul
integral al licenței e în `LICENSE.txt`, alături.

Se procesează cu `scripts/make-statue.py` → `public/models/thalia.glb` (50k
triunghiuri, 340 KB) și `thalia-mobil.glb` (18k, 250 KB).

Sursa cere cont Sketchfab ca să fie descărcată din nou, deci e singurul
material de aici care nu se poate recupera automat.

## Comenzile

Rulate din rădăcina proiectului:

```
python scripts/make-botanical.py
python scripts/make-statue.py sources/statuie/statue-of-the-muse-thalia.glb thalia
python scripts/make-statue.py sources/statuie/statue-of-the-muse-thalia.glb thalia-mobil 18000
```

Au nevoie de `numpy`, `scipy`, `Pillow` și `trimesh`, plus `npx` pentru
`gltfpack`, care face simplificarea și compresia modelului 3D.
