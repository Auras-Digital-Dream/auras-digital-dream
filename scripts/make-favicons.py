#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Export the favicon set from the navbar logo.

No new mark is drawn. The one editorial decision is framing: the source
carries an 84px black margin around a 340px disc, and at 16px that margin
would eat most of the icon, leaving a speck. The disc is cropped to fill,
which is what makes the mark readable at tab size.

The Apple icon sits on --ink rather than the source's black, because iOS
puts it on the home screen next to the site's own colour, and it keeps a
small margin since iOS applies its own rounded mask.

Run: python scripts/make-favicons.py
"""
import os
from PIL import Image

SRC = "public/assets/logo.jpg"
OUT = "public"
DISC = (84, 90, 84 + 340, 90 + 340)   # measured, not guessed
INK = (0x2D, 0x35, 0x3C)              # --ink

disc = Image.open(SRC).convert("RGB").crop(DISC)


def square(size, pad=0.0, bg=INK):
    """The disc centred on a square, optionally inset."""
    inner = round(size * (1 - pad * 2))
    canvas = Image.new("RGB", (size, size), bg)
    canvas.paste(disc.resize((inner, inner), Image.LANCZOS),
                 ((size - inner) // 2, (size - inner) // 2))
    return canvas


written = []


def save(img, name, **kw):
    """The mark is a photographed gold texture, which PNG stores badly — the
    512 came out at 399KB as truecolour. A 256-entry palette is invisible on
    a shape this small and costs a fraction of that."""
    path = os.path.join(OUT, name)
    if kw.get("format") != "ICO" and img.size[0] >= 48:
        img = img.quantize(colors=256, method=Image.MEDIANCUT)
    img.save(path, optimize=True, **kw)
    written.append((name, os.path.getsize(path)))


save(square(16), "favicon-16x16.png")
save(square(32), "favicon-32x32.png")
# One .ico carrying all three, so a browser picks the size it wants.
save(square(48), "favicon.ico", format="ICO",
     sizes=[(16, 16), (32, 32), (48, 48)])
# iOS masks the corners itself, so leave it room.
save(square(180, pad=0.06), "apple-touch-icon.png")
# A manifest that names no large icon cannot answer an install prompt, so
# Android's two sizes come along even though the brief did not list them.
save(square(192), "android-chrome-192x192.png")
save(square(512), "android-chrome-512x512.png")

for name, size in written:
    print("  %-24s %5.1f KB" % (name, size / 1024))
