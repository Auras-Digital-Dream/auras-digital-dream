#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build a 1200x630 link-preview card for every project.

Nothing on the site changes. These files exist only for the crawlers that
draw a card when someone pastes a link into Facebook, LinkedIn, WhatsApp,
Slack or iMessage.

Why they are needed: twelve of the sixteen project photos are smaller than
1200x630 and several are portrait, so a preview either fell back to a small
square thumbnail or was cropped through the middle of the work. Worse, the
head declared og:image:width 1200 and og:image:height 630 for all of them,
which was simply untrue - and a crawler that measures the file and finds it
does not match will often drop the card entirely.

No new graphics are invented. Each card is the project's own photo, whole
and uncropped, sitting on a backdrop made of the same photo blown up,
blurred and darkened - the standard way to fill a fixed frame without
cutting the subject or inventing a background.

Run: python scripts/make-og-cards.py
"""
import io
import os
import re
from PIL import Image, ImageFilter, ImageEnhance

W, H = 1200, 630
INK = (0x2D, 0x35, 0x3C)
OUT = os.path.join("public", "og")


def projects():
    src = io.open(os.path.join("src", "HomePage.jsx"), encoding="utf-8").read()
    block = re.search(r"const projects = \[([\s\S]*?)\n\];", src).group(1)
    return re.findall(r'slug:\s*"([a-z0-9-]+)"[\s\S]*?image:\s*"([^"]+)"', block)


def card(path):
    src = Image.open(path).convert("RGB")

    # Backdrop: the same photo, covering the frame, blurred well past the
    # point of legibility and pulled down, so it reads as colour rather than
    # as a second image competing with the one in front of it.
    scale = max(W / src.width, H / src.height)
    back = src.resize((max(1, round(src.width * scale)), max(1, round(src.height * scale))), Image.LANCZOS)
    left, top = (back.width - W) // 2, (back.height - H) // 2
    back = back.crop((left, top, left + W, top + H))
    back = back.filter(ImageFilter.GaussianBlur(38))
    back = ImageEnhance.Brightness(back).enhance(0.46)
    back = Image.blend(back, Image.new("RGB", (W, H), INK), 0.34)

    # Foreground: the whole photo, inset so it never touches the edge.
    fit = min((W - 96) / src.width, (H - 72) / src.height)
    front = src.resize((max(1, round(src.width * fit)), max(1, round(src.height * fit))), Image.LANCZOS)
    back.paste(front, ((W - front.width) // 2, (H - front.height) // 2))
    return back


os.makedirs(OUT, exist_ok=True)
written = []
for slug, image in projects():
    source = os.path.join("public", image.lstrip("/").replace("/", os.sep))
    if not os.path.exists(source):
        raise SystemExit("missing source image for %s: %s" % (slug, source))
    dest = os.path.join(OUT, slug + ".jpg")
    card(source).save(dest, "JPEG", quality=82, optimize=True, progressive=True)
    written.append((slug, os.path.getsize(dest)))

for slug, size in written:
    print("  %-44s %5.1f KB" % (slug + ".jpg", size / 1024))
print("  %d carduri, %.0f KB in total" % (len(written), sum(s for _, s in written) / 1024))
