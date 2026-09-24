"""Build public/fonts/bayon-latin.woff2: Bayon extended with French accents.

Bayon (Google Fonts, OFL 1.1, no reserved font name) ships ASCII only in
Latin. This script composes the missing glyphs from Bayon's own strokes so
the display face never falls back mid-word on a French heading.

Run from a scratch folder holding the upstream font:
  curl -LO https://raw.githubusercontent.com/google/fonts/main/ofl/bayon/Bayon-Regular.ttf
  python build_bayon.py            # needs: pip install fonttools brotli
  copy bayon-latin.woff2 -> public/fonts/bayon-latin.woff2
"""
# Build "Bayon" with Latin accents: every new glyph is composed from Bayon's
# own strokes (grave bar, period, hyphen, letters), so weight and rhythm match.
import math, os
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib.tables._g_l_y_f import Glyph, GlyphComponent
from fontTools import subset

SRC, OUT_TTF, OUT_WOFF2 = "Bayon-Regular.ttf", "Bayon-Latin.ttf", "bayon-latin.woff2"
f = TTFont(SRC)
glyf, hmtx = f["glyf"], f["hmtx"]
gs = f.getGlyphSet()
order = f.getGlyphOrder()


def bounds(name):
    bp = BoundsPen(gs)
    gs[name].draw(bp)
    return bp.bounds


def center(name):
    b = bounds(name)
    return (b[0] + b[2]) / 2


# contour direction of the source (shoelace sign of E's outline)
rp = RecordingPen()
gs["E"].draw(rp)
flat = []
for op, a in rp.value:
    if op in ("moveTo", "lineTo"):
        flat.append(a[0])
    elif op == "qCurveTo":
        flat.extend(a)
area = sum(flat[i][0] * flat[(i + 1) % len(flat)][1] - flat[(i + 1) % len(flat)][0] * flat[i][1] for i in range(len(flat)))
SRC_CLOCKWISE = area < 0
print("source outer contour clockwise:", SRC_CLOCKWISE)


def register(name, glyph, adv, lsb=None):
    glyf[name] = glyph
    if name not in order:
        order.append(name)
    if lsb is None:
        glyph.recalcBounds(glyf)
        lsb = glyph.xMin
    hmtx[name] = (int(adv), int(lsb))


def simple_from_pen(name, drawer, adv):
    pen = TTGlyphPen(gs)
    drawer(pen)
    g = pen.glyph()
    g.recalcBounds(glyf)
    register(name, g, adv)
    return g


def polygon(pen, pts):
    a = sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts)))
    if (a < 0) != SRC_CLOCKWISE:
        pts = pts[::-1]
    pen.moveTo(pts[0])
    for p in pts[1:]:
        pen.lineTo(p)
    pen.closePath()


def copy_transformed(pen, src, xform):
    gs[src].draw(TransformPen(pen, xform))


def composite(name, parts, adv, overlap=False):
    g = Glyph()
    g.numberOfContours = -1
    g.components = []
    for part in parts:
        src, dx, dy = part[0], part[1], part[2]
        c = GlyphComponent()
        c.glyphName = src
        c.x, c.y = int(round(dx)), int(round(dy))
        c.flags = 0x4 | 0x200 | 0x1  # ROUND_XY_TO_GRID | UNSCALED_COMPONENT_OFFSET | ARG_1_AND_2_ARE_WORDS
        if len(part) > 3:
            s = part[3]
            c.transform = [[s, 0], [0, s]]
        if overlap:
            c.flags |= 0x400  # OVERLAP_COMPOUND
        g.components.append(c)
    pass
    register(name, g, adv)


# ── accent marks, drawn at capital height ──────────────────────────
CAP = 1425
gb = bounds("grave")  # (80, 1534, 497, 1905): a slanted bar already at accent height
simple_from_pen("grave.cap", lambda p: copy_transformed(p, "grave", (1, 0, 0, 1, 0, 0)), 0)
simple_from_pen("acute.cap", lambda p: copy_transformed(p, "grave", (-1, 0, 0, 1, gb[0] + gb[2], 0)), 0)

# circumflex: a chevron with the bar's stroke (perpendicular ~181) and height
H, T, W = gb[3] - gb[1], 181, 560
apex = W / 2
ang = math.atan2(apex, H)          # arm angle from vertical
hx = T / math.cos(ang)             # horizontal cross-section of an arm
iy = H - hx * H / apex             # where the inner edges meet
flat_half = 30


def circ(p):
    y0 = gb[1]
    polygon(p, [(0, y0), (apex - flat_half, y0 + H), (apex + flat_half, y0 + H), (W, y0),
                (W - hx, y0), (apex, y0 + iy), (hx, y0)])


simple_from_pen("circumflex.cap", circ, 0)

# dieresis: two squares from the period, centred on the bar's height
pb = bounds("period")
ps = 210 / (pb[2] - pb[0])
gap = 120
mid = (gb[1] + gb[3]) / 2
dy = mid - ps * (pb[1] + pb[3]) / 2


def dier(p):
    copy_transformed(p, "period", (ps, 0, 0, ps, -ps * pb[0], dy))
    copy_transformed(p, "period", (ps, 0, 0, ps, -ps * pb[0] + 210 + gap, dy))


simple_from_pen("dieresis.cap", dier, 0)


# cedilla: a squared hook hanging from the bottom stroke
def ced(p):
    polygon(p, [(400, 40), (540, 40), (540, -170), (640, -170), (640, -360), (320, -360),
                (320, -240), (510, -240), (510, -170), (400, -170)])


simple_from_pen("cedilla.cap", ced, 0)

marks = {"grave": "grave.cap", "acute": "acute.cap", "circumflex": "circumflex.cap", "dieresis": "dieresis.cap"}
mark_center = {m: center(g) for m, g in marks.items()}
print("mark bounds:", {g: bounds(g) for g in marks.values()}, "cedilla", bounds("cedilla.cap"))

# ── accented letters (Bayon is unicase: lowercase shares the capital shapes) ──
table = {
    "À": ("A", "grave"), "Â": ("A", "circumflex"), "Ä": ("A", "dieresis"),
    "È": ("E", "grave"), "É": ("E", "acute"), "Ê": ("E", "circumflex"), "Ë": ("E", "dieresis"),
    "Î": ("I", "circumflex"), "Ï": ("I", "dieresis"), "Ô": ("O", "circumflex"), "Ö": ("O", "dieresis"),
    "Ù": ("U", "grave"), "Û": ("U", "circumflex"), "Ü": ("U", "dieresis"), "Ÿ": ("Y", "dieresis"),
}
new_cmap = {}
for ch, (base, mark) in table.items():
    for variant in (ch, ch.lower()):
        b = base if variant.isupper() else base.lower()
        name = "uni%04X" % ord(variant)
        composite(name, [(b, 0, 0), (marks[mark], center(b) - mark_center[mark], 0)], hmtx[b][0])
        new_cmap[ord(variant)] = name
for variant, b in (("Ç", "C"), ("ç", "c")):
    name = "uni%04X" % ord(variant)
    composite(name, [(b, 0, 0), ("cedilla.cap", center(b) - center("cedilla.cap"), 0)], hmtx[b][0], overlap=True)
    new_cmap[ord(variant)] = name

# Œ / œ: O with E sharing its right stem
ob, eb = bounds("O"), bounds("E")
stem = 250
for variant, (o, e) in (("Œ", ("O", "E")), ("œ", ("o", "e"))):
    dx = (ob[2] - stem) - eb[0]
    name = "uni%04X" % ord(variant)
    composite(name, [(o, 0, 0), (e, dx, 0)], dx + hmtx[e][0], overlap=True)
    new_cmap[ord(variant)] = name

# quotes
for cp, src in ((0x2019, "quotesingle"), (0x2018, "quotesingle"), (0x201C, "quotedbl"), (0x201D, "quotedbl")):
    if src in glyf:
        name = "uni%04X" % cp
        composite(name, [(src, 0, 0)], hmtx[src][0])
        new_cmap[cp] = name

# dashes from the hyphen's bar
hb = bounds("hyphen")
rsb = hmtx["hyphen"][0] - hb[2]
for cp, width in ((0x2013, 720), (0x2014, 1100)):
    name = "uni%04X" % cp
    simple_from_pen(name, lambda p, w=width: polygon(p, [(88, hb[1]), (88 + w, hb[1]), (88 + w, hb[3]), (88, hb[3])]), 88 + width + rsb)
    new_cmap[cp] = name

# ellipsis, middle dot, degree, superscript two, minus
pa = hmtx["period"][0]
composite("uni2026", [("period", 0, 0), ("period", pa, 0), ("period", 2 * pa, 0)], 3 * pa)
new_cmap[0x2026] = "uni2026"
composite("uni00B7", [("period", 0, CAP / 2 - (pb[1] + pb[3]) / 2)], pa)
new_cmap[0x00B7] = "uni00B7"
s = 0.42
composite("uni00B0", [("O", 0, CAP - s * ob[3], s)], int(s * hmtx["O"][0] + 60))
new_cmap[0x00B0] = "uni00B0"
tb = bounds("two")
s2 = 0.6
composite("uni00B2", [("two", 0, CAP - s2 * tb[3], s2)], int(s2 * hmtx["two"][0] + 40))
new_cmap[0x00B2] = "uni00B2"
composite("uni2212", [("uni2013", 0, 0)], hmtx["uni2013"][0])
new_cmap[0x2212] = "uni2212"

f.setGlyphOrder(order)
for t in f["cmap"].tables:
    if t.isUnicode():
        t.cmap.update(new_cmap)

# ── kerning: give each accented glyph its base's class ─────────────
gpos = f["GPOS"].table
added = 0
comps = [(n, glyf[n].components[0].glyphName) for n in new_cmap.values() if glyf[n].isComposite()]
for lk in gpos.LookupList.Lookup:
    for st in lk.SubTable:
        if st.LookupType == 2 and st.Format == 2:
            for cd in (st.ClassDef1, st.ClassDef2):
                for name, base in comps:
                    if base in cd.classDefs and name not in cd.classDefs:
                        cd.classDefs[name] = cd.classDefs[base]
                        added += 1
            cov = st.Coverage.glyphs
            for name, base in comps:
                if base in cov and name not in cov:
                    cov.append(name)
        elif st.LookupType == 2 and st.Format == 1:
            import copy
            cov = st.Coverage.glyphs
            base_to_new = {}
            for name, base in comps:
                base_to_new.setdefault(base, []).append(name)
            # second-glyph side: duplicate every record that names a base
            for ps in st.PairSet:
                extra = []
                for rec in ps.PairValueRecord:
                    for name in base_to_new.get(rec.SecondGlyph, []):
                        r = copy.deepcopy(rec); r.SecondGlyph = name; extra.append(r)
                ps.PairValueRecord.extend(extra); ps.PairValueCount = len(ps.PairValueRecord)
                added += len(extra)
            # first-glyph side: a new coverage entry with a copy of the base's pair set
            pairs = dict(zip(cov, st.PairSet))
            for base, names in base_to_new.items():
                if base in pairs:
                    for name in names:
                        pairs[name] = copy.deepcopy(pairs[base]); added += 1
            ordered = sorted(pairs, key=f.getGlyphID)
            st.Coverage.glyphs = ordered
            st.PairSet = [pairs[g] for g in ordered]
            st.PairSetCount = len(ordered)
print("kern classes extended:", added)

# ── name table: mark the derivative ────────────────────────────────
nm = f["name"]
nm.setName("Version 8.001; Latin accents added for akoubri.com (composed from the original strokes)", 5, 3, 1, 0x409)
nm.setName("Bayon by Danh Hong, OFL 1.1. This build adds French accented letters, OE, quotes and dashes composed from the original outlines.", 10, 3, 1, 0x409)
f.save(OUT_TTF)

# ── subset to Latin + punctuation, drop hinting, write woff2 ───────
keep = set(range(0x20, 0x7F)) | set(range(0xA0, 0x100)) | {0x152, 0x153, 0x178} | set(new_cmap)
opts = subset.Options(hinting=False, layout_features=["kern"], notdef_outline=True,
                      recalc_bounds=True, recalc_average_width=True, name_IDs=["*"], name_legacy=True,
                      drop_tables=["DSIG"])
sub = subset.Subsetter(opts)
f2 = TTFont(OUT_TTF)
sub.populate(unicodes=sorted(keep))
sub.subset(f2)
f2.flavor = "woff2"
f2.save(OUT_WOFF2)
f3 = TTFont(OUT_WOFF2)
c3 = f3.getBestCmap()
print("woff2 bytes:", os.path.getsize(OUT_WOFF2), "glyphs:", len(f3.getGlyphOrder()))
missing = "".join(ch for ch in "ÀÂÇÉÈÊËÎÏÔÙÛÜŒàâçéèêëîïôùûüœ’‘“”–—…·°²" if ord(ch) not in c3)
print("missing now:", missing or "(none)")
