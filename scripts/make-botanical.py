"""Lift a botanical plate off its paper and bring it into the site's palette.

The two drawings on the homepage are nineteenth-century engravings, both long
in the public domain:

  * Pierre-Joseph Redouté, *Rosa gallica regalis*, c.1820 — for the dark
    sections, where old paper reads as light rather than as a stain.
  * Otto Wilhelm Thomé, *Flora von Deutschland*, 1885 — Myosotis palustris,
    the forget-me-not, for the white sections. Same flower as the one behind
    Aura in the portrait the palette was measured from. Thomé drew it on a
    clean sheet, one plant to a plate, which is what lets it come off the
    paper at all; a denser plate leaves the sheet trapped between stems and
    no amount of keying gets it out.

Run it from the project root; it writes into public/assets/.
"""
import os
import subprocess
import sys
import urllib.parse
import urllib.request
import json

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

UA = "AuraStudiosBotanical/1.0 (https://aurastudios.ro; auraleobeatrice@gmail.com)"
OUT_DIR = "public/assets"
BLOOM = (172, 188, 227)   # --bloom #ACBCE3, measured off the portrait
CACHE = os.path.join("tmp", "plates")


def fetch(title):
    """Commons only serves a fixed set of thumbnail widths, so ask the API for
    the URL rather than assembling one."""
    os.makedirs(CACHE, exist_ok=True)
    local = os.path.join(CACHE, title.replace("File:", "").replace(" ", "_"))
    if os.path.exists(local):
        return local
    api = ("https://commons.wikimedia.org/w/api.php?action=query&format=json"
           "&prop=imageinfo&iiprop=url&iiurlwidth=1280&titles=" + urllib.parse.quote(title))
    meta = json.load(urllib.request.urlopen(
        urllib.request.Request(api, headers={"User-Agent": UA}), timeout=60))
    page = next(iter(meta["query"]["pages"].values()))
    url = page["imageinfo"][0]["thumburl"]
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}),
                                timeout=90) as r, open(local, "wb") as f:
        f.write(r.read())
    return local


def sheet_colour(pixels, sat):
    """The colour of this plate's own paper.

    Taken from the brightest colourless pixels anywhere in the frame, not
    from the border: a crop tight enough to be all flower has drawing on
    every edge, and a border sample then returns a leaf. Paper is the one
    thing on a plate that is both bright and grey, wherever it happens to
    lie.
    """
    flat = pixels.reshape(-1, 3)
    pale = flat[(sat.ravel() < 0.16) & (flat.max(axis=1) > 170)]
    if len(pale) < 50:
        return np.array([246.0, 242.0, 228.0])
    bright = pale[pale.max(axis=1) >= np.percentile(pale.max(axis=1), 60)]
    return bright.mean(axis=0)


def lift(img):
    """Key out the paper, from the edges inward.

    A plain brightness threshold cannot do this. The sheet is a warm cream,
    but the lit face of a pale petal is also bright and also nearly grey, so
    any threshold loose enough to take the paper out of a leaf's shadow also
    punches holes through the flower.

    What separates them is not colour but connection: the paper runs to the
    border of the plate, and the flower is an island in the middle of it. So
    the mask is grown from the edges and only paper that reaches them is
    lifted — a highlight enclosed by drawing keeps its place.
    """
    a = np.asarray(img.convert("RGB")).astype(float)
    mx, mn = a.max(axis=2), a.min(axis=2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
    paperish = (mx > 188) & (sat < 0.26)

    labels, count = ndimage.label(paperish)
    edge = np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]])
    keep = np.zeros(count + 1, bool)
    keep[np.unique(edge[edge > 0])] = True

    # Paper walled in by leaves never reaches an edge, and left alone it sits
    # on the page as an opaque cream blob. Those go too — but the test has to
    # be what colour this particular sheet is, not a number that happened to
    # suit one plate: Redouté's paper is cooler than the Clements, and a fixed
    # threshold that clears one leaves a stain on the other. So the sheet is
    # measured at its own border and enclosed regions are matched to it. A
    # bright fleck enclosed by petals is a highlight, reads pink or blue
    # against the cream, and stays.
    if count:
        edge_paper = sheet_colour(a, sat)
        idx = np.arange(1, count + 1)
        area = ndimage.sum(paperish, labels, idx)
        dist = np.sqrt(sum(
            (ndimage.mean(a[..., c], labels, idx) - edge_paper[c]) ** 2 for c in range(3)))
        keep[idx[(area > 400) & (dist < 26)]] = True
    paper = keep[labels]

    # Connectivity alone leaves the sheet where it lies in shadow — too dark
    # to have been called paper, but still paper, and along a crop edge it
    # shows on the page as the corner of a rectangle. So the mask is finished
    # by colour: anything close to this plate's own paper fades out, and the
    # ramp is soft enough that the drawing keeps its edge. Nothing painted
    # here comes near cream, so nothing painted here is touched.
    sheet = sheet_colour(a, sat)
    dist = np.sqrt(((a - sheet) ** 2).sum(axis=2))
    # Nothing close to the sheet survives at all. A previous version let it
    # through at low alpha, which composited as a pale box on a tinted ground
    # — a cut square, which is exactly what a drawing must never look like.
    ramp = np.clip((dist - 30) / 24, 0, 1)
    # Anything left barely there is the pale wash between the drawing and the
    # sheet, and across a whole plate it adds up to a visible film. It goes.
    ramp[ramp < 0.22] = 0

    alpha = np.where(paper, 0.0, ramp)
    alpha = Image.fromarray((alpha * 255).astype(np.uint8))
    # feather, or the engraving ends on a stair of hard pixels
    alpha = alpha.filter(ImageFilter.GaussianBlur(1.2))
    return Image.merge("RGBA", (*img.convert("RGB").split(), alpha))


def tone(img, green_drop, lift_amount):
    """Pull the plate toward the page: greens down to a shadow, everything up.

    Aura's rule for the garden is that green is never an accent, only ever a
    shadow — so the leaves lose most of their colour while the flower keeps
    all of its.
    """
    b = np.asarray(img).astype(float)
    rgb, alpha = b[..., :3], b[..., 3:]
    grey = rgb.mean(axis=2, keepdims=True)
    mx, mn = rgb.max(axis=2), rgb.min(axis=2)
    green = (rgb[..., 1] >= mx) & ((mx - mn) > 16)
    weight = np.where(green[..., None], green_drop, 0.24)
    out = grey * weight + rgb * (1 - weight)
    out = 255 - (255 - out) * lift_amount
    return Image.fromarray(
        np.concatenate([np.clip(out, 0, 255), alpha], axis=2).astype(np.uint8), "RGBA")


def bloom_blue(img):
    """Thomé's forget-me-not is drawn barely tinted, all but white.

    The living flower is blue, the portrait's are blue, and the palette's
    --bloom was measured off them — so the petals are carried back to it.
    Only the petals, and the test that finds them is brightness in all three
    channels at once. Thomé's petals are not white but a warm cream, saturated
    enough to fail any low-saturation test and green enough in the middle to
    be mistaken for a leaf — but every channel is pale. A leaf has a dark
    channel, always, whatever its hue.
    """
    b = np.asarray(img).astype(float)
    rgb, alpha = b[..., :3], b[..., 3]
    mx, mn = rgb.max(axis=2), rgb.min(axis=2)
    petal = (alpha > 40) & (mx > 205) & (mn > 168)
    # A flat, firm blend. Keying the strength to brightness left the shift at
    # a quarter, because these petals are pale in every channel to begin with
    # — the very thing that identifies them also flattened the correction.
    strength = 0.66
    mixed = rgb * (1 - strength) + np.array(BLOOM) * strength
    rgb = np.where(petal[..., None], mixed, rgb)
    return Image.fromarray(
        np.concatenate([np.clip(rgb, 0, 255), alpha[..., None]], axis=2).astype(np.uint8), "RGBA")


def save(img, name, width):
    os.makedirs(OUT_DIR, exist_ok=True)
    img = img.crop(img.getbbox())
    h = round(img.height * width / img.width)
    img = img.resize((width, h), Image.LANCZOS)
    path = os.path.join(OUT_DIR, name)
    img.save(path, "WEBP", quality=86, method=6, exact=True)
    print(f"  {name:<26} {img.width}x{img.height}  {os.path.getsize(path) // 1024} KB")


def main():
    # ── the rose, whole plate ────────────────────────────────────────────
    rose = Image.open(fetch("File:Redoute - Rosa gallica regalis.jpg")).convert("RGB")
    # Tight on the bloom and the buds above it. The full plate is mostly
    # foliage, and in a margin only a slice of it ever shows — a slice which
    # then turns out to be leaves. Every part of this crop is flower.
    rose = rose.crop((300, 40, 1010, 830))
    save(tone(lift(rose), green_drop=0.62, lift_amount=0.88), "roza.webp", 460)

    # ── the forget-me-not ────────────────────────────────────────────────
    plate = Image.open(fetch("File:Illustration Myosotis scorpioides0.jpg"))
    spray = plate.crop((300, 55, 700, 470)).convert("RGB")
    # No lift here: the drawing goes onto white paper, and opening it further
    # would take the flower with it.
    save(tone(bloom_blue(lift(spray)), green_drop=0.5, lift_amount=1.0),
         "nu-ma-uita.webp", 400)


if __name__ == "__main__":
    sys.exit(main())
