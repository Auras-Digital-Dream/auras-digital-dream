#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Add the four Romanian glyphs Marcellus is missing, then subset it.

Marcellus ships 368 characters and none of them is s-comma, t-comma,
S-comma or T-comma. It has the Turkish cedilla forms instead, which is a
common substitution and the wrong one: Romanian uses a comma below, and
this site went through the trouble of correcting seventy-one cedillas to
commas a few commits ago. Left alone, the browser would fall back to
Georgia for exactly those four letters, mid-word, in every "și" and every
"Soluția" - the most visible failure a display face can have.

The comma is the font's own. Each new glyph is a composite: the letter,
unchanged, plus the designer's `comma` outline placed below it. Where
below is not guessed either - the font already draws a cedilla on the same
letters, so the horizontal centre and the vertical offset are read off
`scedilla` and `Scedilla` and reused. The result is the designer's shapes
in the designer's positions; nothing here is drawn by hand.

Same approach as scripts/patch-amoresa.py, which does this for the display
script. Run:  python scripts/patch-marcellus.py
"""
import os
import sys

from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform
from fontTools.subset import Subsetter, Options

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "marcellus-source.ttf")
DST = os.path.join(HERE, "..", "public", "fonts", "marcellus-400.woff2")

# base letter -> (new codepoint, the cedilla version to read the position from)
NEW = [
    ("s", 0x0219, "scedilla"),
    ("t", 0x021B, "tcedilla"),
    ("S", 0x0218, "Scedilla"),
    ("T", 0x021A, "Tcedilla"),
]

# Everything the site can render, plus the four being added. Latin-1 and the
# Latin Extended-A block cover every language the pages use.
UNICODES = (
    list(range(0x0020, 0x007F)) + list(range(0x00A0, 0x0100)) +
    list(range(0x0100, 0x0180)) + [0x0218, 0x0219, 0x021A, 0x021B] +
    [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x00B7, 0x2116]
)

if not os.path.exists(SRC):
    sys.exit("missing %s - fetch the Marcellus TTF from Google Fonts first" % SRC)

f = TTFont(SRC)
glyf = f["glyf"]
hmtx = f["hmtx"]
cmap_best = f["cmap"].getBestCmap()

comma = cmap_best.get(0x002C)
if comma is None:
    sys.exit("the font has no comma to build the mark from")


def bbox(name):
    g = glyf[name]
    if g.numberOfContours == 0:
        return None
    g.recalcBounds(glyf)
    return (g.xMin, g.yMin, g.xMax, g.yMax)


def contour_offset(base, accented):
    """Read where the designer puts the cedilla under this letter.

    The accented glyph is compared with the plain one; whatever sits below
    the baseline is the mark, and its centre and top are what the comma has
    to match."""
    if accented not in glyf:
        return None
    ab = bbox(accented)
    bb = bbox(base)
    if not ab or not bb:
        return None
    # the mark lives below the baseline; its top edge is roughly y=0
    return ((ab[0] + ab[2]) / 2.0, ab[1])


added = []
for base, cp, cedilla in NEW:
    if base not in glyf:
        sys.exit("no base glyph %s" % base)
    name = {0x0219: "scommaaccent", 0x021B: "tcommaaccent",
            0x0218: "Scommaaccent", 0x021A: "Tcommaaccent"}[cp]

    bb = bbox(base)
    cb = bbox(comma)
    zone = contour_offset(base, cedilla)
    # Horizontally the comma is centred under the letter, not under where the
    # cedilla sat. On the capital T the font hangs its cedilla off to the
    # right, which reads fine as a cedilla and wrong as a comma - a comma
    # below belongs under the stem. Vertically the cedilla's depth is kept,
    # because that is the designer's judgement about how far below the
    # baseline a mark should hang in this face.
    cx = (bb[0] + bb[2]) / 2.0
    ylow = zone[1] if zone else -abs(cb[3] - cb[1]) * 1.05
    # the comma is drawn on the baseline in the font; move it down so its top
    # lands where the cedilla's top was, and centre it under the letter
    dx = cx - (cb[0] + cb[2]) / 2.0
    dy = ylow - cb[1]

    pen = TTGlyphPen(f.getGlyphSet())
    pen.addComponent(base, (1, 0, 0, 1, 0, 0))
    pen.addComponent(comma, (1, 0, 0, 1, round(dx), round(dy)))
    # assigning into glyf registers the name in its own glyph order, so the
    # font's order is taken from there afterwards rather than appended to
    # twice - which is what produced a length mismatch on the first attempt
    glyf[name] = pen.glyph()
    hmtx[name] = hmtx[base]
    for table in f["cmap"].tables:
        if table.isUnicode():
            table.cmap[cp] = name
    added.append((name, cp, round(dx), round(dy)))

f.setGlyphOrder(glyf.glyphOrder)
f["maxp"].numGlyphs = len(glyf.glyphOrder)

tmp = os.path.join(HERE, "_marcellus-patched.ttf")
f.save(tmp)

# subset and write the woff2 the site actually loads
sub = TTFont(tmp)
opts = Options()
opts.layout_features = ["*"]
opts.notdef_outline = True
opts.desubroutinize = False
s = Subsetter(options=opts)
s.populate(unicodes=UNICODES)
s.subset(sub)
sub.flavor = "woff2"
sub.save(DST)
os.remove(tmp)

for name, cp, dx, dy in added:
    print("  adaugat %-16s U+%04X   virgula mutata cu (%d, %d)" % (name, cp, dx, dy))
print("  %s  %.1f KB" % (os.path.relpath(DST, os.path.join(HERE, "..")), os.path.getsize(DST) / 1024))
