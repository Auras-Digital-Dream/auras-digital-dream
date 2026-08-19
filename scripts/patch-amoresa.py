# -*- coding: utf-8 -*-
"""Add the Romanian glyphs Amoresa is missing.

The face ships 216 glyphs and no a-breve, s-comma or t-comma — five of the
most common characters in Romanian. Without them the browser falls back to
Georgia mid-word, which on a display serif is instantly visible.

Marks are derived from the designer's own work wherever possible: the comma
below is the font's own `comma` glyph, and the breve is placed in exactly the
optical zone the designer used for the acute on the same letter. Only the
breve outline is drawn, because nothing in the face contains one.
"""
import os
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "amoresa-source.otf")
DST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "fonts", "amoresa.woff2")

BREVE_W = float(sys.argv[1]) if len(sys.argv) > 1 else 1.70   # x acute width
BREVE_H = float(sys.argv[2]) if len(sys.argv) > 2 else 0.72   # x acute height
BREVE_T = float(sys.argv[3]) if len(sys.argv) > 3 else 0.30   # stroke, x height

f = TTFont(SRC)
gs = f.getGlyphSet()
cff = f["CFF "].cff
top = cff[cff.fontNames[0]]
charstrings = top.CharStrings
hmtx = f["hmtx"]


def contours(name):
    p = RecordingPen()
    gs[name].draw(p)
    out, cur = [], []
    for op, args in p.value:
        cur.append((op, args))
        if op == "closePath":
            out.append(tuple(cur))
            cur = []
    return out


def cbbox(cnt):
    xs, ys = [], []
    for op, args in cnt:
        for pt in args:
            if isinstance(pt, tuple):
                xs.append(pt[0]); ys.append(pt[1])
    return (min(xs), min(ys), max(xs), max(ys))


def gbbox(name):
    bs = [cbbox(c) for c in contours(name)]
    return (min(b[0] for b in bs), min(b[1] for b in bs),
            max(b[2] for b in bs), max(b[3] for b in bs))


def mark_zone(base, accented):
    """Where the designer puts an accent over this letter."""
    if accented not in gs:
        return None
    b, a = contours(base), contours(accented)
    extra = [c for c in a if c not in b]
    bb = gbbox(base)
    cands = [c for c in extra if cbbox(c)[1] > bb[1] + (bb[3] - bb[1]) * 0.75]
    if not cands:
        return None
    bs = [cbbox(c) for c in cands]
    return (min(x[0] for x in bs), min(x[1] for x in bs),
            max(x[2] for x in bs), max(x[3] for x in bs))


low_zone = mark_zone("a", "aacute")
cap_zone = mark_zone("A", "Aacute")
print("acute zone lowercase:", tuple(round(v) for v in low_zone))
print("acute zone uppercase:", tuple(round(v) for v in cap_zone) if cap_zone else "n/a")


def draw_breve(pen, cx, ybase, w, h, t):
    """A shallow bowl opening upward, tapering toward the tips."""
    hw = w / 2.0
    yt = ybase + h
    pen.moveTo((cx - hw, yt))
    pen.curveTo((cx - hw + w * 0.06, ybase + h * 0.42), (cx - w * 0.28, ybase), (cx, ybase))
    pen.curveTo((cx + w * 0.28, ybase), (cx + hw - w * 0.06, ybase + h * 0.42), (cx + hw, yt))
    pen.lineTo((cx + hw - t * 0.55, yt))
    pen.curveTo((cx + hw - t * 0.72, ybase + h * 0.52), (cx + w * 0.24, ybase + t), (cx, ybase + t))
    pen.curveTo((cx - w * 0.24, ybase + t), (cx - hw + t * 0.72, ybase + h * 0.52), (cx - hw + t * 0.55, yt))
    pen.closePath()


def add_charstring(name, cs):
    """CFF CharStrings has no setter for a name it does not already know."""
    charstrings.charStringsIndex.append(cs)
    charstrings.charStrings[name] = len(charstrings.charStringsIndex) - 1


def charstring_width(base, adv):
    """CFF stores width as (advance - nominalWidthX), omitted when it equals
    defaultWidthX. T2CharStringPen writes whatever number it is handed, so the
    subtraction has to happen here — passing the raw advance is what made the
    new glyphs 1316 units wide instead of 536."""
    priv = charstrings[base].private
    default = getattr(priv, "defaultWidthX", None)
    if default is not None and adv == default:
        return None, priv
    return adv - getattr(priv, "nominalWidthX", 0), priv


def build(new_name, base, unicode_val, kind, zone):
    adv = hmtx[base][0]
    # Swash caps have bounding boxes far wider than their advance, so the bbox
    # centre is not where the letter sits. For the breve, follow the designer
    # and use the centre of the acute they drew for that same letter.
    cx = ((zone[0] + zone[2]) / 2.0) if (kind == "breve" and zone) else adv / 2.0
    w, priv = charstring_width(base, adv)
    pen = T2CharStringPen(w, None)
    gs[base].draw(pen)                                  # the letter, untouched
    if kind == "breve":
        mh = zone[3] - zone[1]
        draw_breve(pen, cx, zone[1], (zone[2] - zone[0]) * BREVE_W,
                   mh * BREVE_H, mh * BREVE_T)
    else:
        cbb = gbbox("comma")
        ccx = (cbb[0] + cbb[2]) / 2.0
        dy = -(cbb[3] + (38 if base.islower() else 52))
        gs["comma"].draw(TransformPen(pen, Transform(1, 0, 0, 1, cx - ccx, dy)))
    cs = pen.getCharString()
    cs.private = priv
    add_charstring(new_name, cs)
    hmtx[new_name] = hmtx[base]
    for t in f["cmap"].tables:
        if t.isUnicode():
            t.cmap[unicode_val] = new_name
    return new_name


jobs = [
    ("abreve", "a", 0x0103, "breve", low_zone),
    ("Abreve", "A", 0x0102, "breve", cap_zone or low_zone),
    ("scommaaccent", "s", 0x0219, "comma", None),
    ("Scommaaccent", "S", 0x0218, "comma", None),
    ("tcommaaccent", "t", 0x021B, "comma", None),
    ("Tcommaaccent", "T", 0x021A, "comma", None),
]

order = list(f.getGlyphOrder())
made = []
for name, base, uni, kind, zone in jobs:
    made.append(build(name, base, uni, kind, zone))
    if name not in order:
        order.append(name)

# The cedilla spellings are what older Romanian keyboards emit; point them at
# the same shapes so text typed either way renders identically.
for uni, target in [(0x015F, "scommaaccent"), (0x015E, "Scommaaccent"),
                    (0x0163, "tcommaaccent"), (0x0162, "Tcommaaccent")]:
    for t in f["cmap"].tables:
        if t.isUnicode():
            t.cmap[uni] = target

def alias_kerning(base, new):
    """Make `new` kern exactly like `base`.

    This is a connecting script: the letters overlap and lean on pair kerning
    to join up. A new glyph that is in no kern pair sits at its raw advance
    and leaves a visible gap, which is what "ta u" instead of "tau" was.
    Both the per-pair and the class-based subtables need the alias.
    """
    import copy
    order = {g: i for i, g in enumerate(f.getGlyphOrder())}

    if "GDEF" in f and getattr(f["GDEF"].table, "GlyphClassDef", None):
        cd = f["GDEF"].table.GlyphClassDef.classDefs
        if base in cd:
            cd[new] = cd[base]

    if "GPOS" not in f:
        return
    for lk in f["GPOS"].table.LookupList.Lookup:
        if lk.LookupType != 2:
            continue
        for st in lk.SubTable:
            if st.Format == 1:
                # as first glyph: clone the whole pair set
                if base in st.Coverage.glyphs and new not in st.Coverage.glyphs:
                    i = st.Coverage.glyphs.index(base)
                    rows = list(zip(st.Coverage.glyphs, st.PairSet))
                    rows.append((new, copy.deepcopy(st.PairSet[i])))
                    rows.sort(key=lambda r: order[r[0]])
                    st.Coverage.glyphs = [r[0] for r in rows]
                    st.PairSet = [r[1] for r in rows]
                    st.PairSetCount = len(st.PairSet)
                # as second glyph: clone each record that targets the base
                for ps in st.PairSet:
                    extra = []
                    for pvr in ps.PairValueRecord:
                        if pvr.SecondGlyph == base:
                            n = copy.deepcopy(pvr)
                            n.SecondGlyph = new
                            extra.append(n)
                    if extra:
                        ps.PairValueRecord.extend(extra)
                        ps.PairValueRecord.sort(key=lambda r: order[r.SecondGlyph])
                        ps.PairValueCount = len(ps.PairValueRecord)
            elif st.Format == 2:
                for cdname in ("ClassDef1", "ClassDef2"):
                    cd = getattr(st, cdname, None)
                    if cd is not None and base in cd.classDefs:
                        cd.classDefs[new] = cd.classDefs[base]
                if base in st.Coverage.glyphs and new not in st.Coverage.glyphs:
                    g = st.Coverage.glyphs + [new]
                    g.sort(key=lambda x: order[x])
                    st.Coverage.glyphs = g


f.setGlyphOrder(order)
for name, base, uni, kind, zone in jobs:
    alias_kerning(base, name)
def alias_calt(base, new):
    """Let the letter *after* the new glyph pick its connecting form.

    Amoresa is a joining script: 126 chained contextual rules swap each letter
    for a variant based on what precedes it. A glyph missing from those
    backtrack coverages leaves the next letter in its default, unjoined form —
    which is the gap that showed as "ta u" rather than "tau". The advances were
    always correct; it was the shapes that were wrong.
    """
    if "GSUB" not in f:
        return
    gsub = f["GSUB"].table
    order = {g: i for i, g in enumerate(f.getGlyphOrder())}
    idxs = set()
    for fr in gsub.FeatureList.FeatureRecord:
        if fr.FeatureTag in ("calt", "liga", "dlig"):
            idxs.update(fr.Feature.LookupListIndex)

    def extend(cov):
        if cov is not None and base in cov.glyphs and new not in cov.glyphs:
            g = cov.glyphs + [new]
            g.sort(key=lambda x: order[x])
            cov.glyphs = g

    seen = set()
    stack = list(idxs)
    while stack:
        i = stack.pop()
        if i in seen:
            continue
        seen.add(i)
        lk = gsub.LookupList.Lookup[i]
        for st in lk.SubTable:
            for attr in ("BacktrackCoverage", "LookAheadCoverage"):
                for cov in (getattr(st, attr, None) or []):
                    extend(cov)
            for rec in (getattr(st, "SubstLookupRecord", None) or []):
                stack.append(rec.LookupListIndex)


for name, base, uni, kind, zone in jobs:
    alias_calt(base, name)
top.charset = list(order)
f.flavor = "woff2"
f.save(DST)
print("glyphs added:", ", ".join(made))
print("written:", DST)
