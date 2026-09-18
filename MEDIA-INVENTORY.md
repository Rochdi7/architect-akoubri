# Akoubri — Media inventory & audit

Generated during the media rework of 2026-09-15. This file is the record of what
every media file actually shows, where it is used, and what could not be verified.

**Source of truth rule:** photographs are the source of truth for *visual*
interpretation. Only owner-confirmed data is used for *factual* claims. Anything
unverifiable is marked "À confirmer" rather than invented.

---

## Safety checkpoints

| Item | Location |
|---|---|
| Full copy of original `public/media` | scratchpad `BACKUP/media-original-20260915-233414` (163 MB) |
| Git tag before any change | `pre-media-rework-checkpoint` |
| Originals on disk | **untouched** — all conversions wrote *new* files to `public/media/projets/` |

The 31 deleted files (`le-sentier/sentier-*.jpg`, `zahiya/zahiya-*.jpg`) were
recovered with `git checkout --` from HEAD; they were unstaged working-tree
deletions, fully present in the commit tree.

---

## Owner-confirmed facts

- **All projects are located in Marrakech.** (Confirmed by owner, 2026-09-15.)
- Agency statistics and studio timeline: replaced with qualitative copy — the
  numeric claims could not be verified.
- **Villa, Villa K and Villa Targa are three separate projects**, not one.
  (Confirmed by owner, 2026-09-16.) All three are published.

---

## Per-project inventory

### 1. Adostigia — corporate interior *(priority 1)*

| | |
|---|---|
| Images | 22 renders (1280×720) |
| Video | 1 × walkthrough, 55 s, with audio |
| Program | Reception, director's offices, meeting rooms, corridor, WC |
| Evidence | ADOSTIGIA logo on backlit dark-marble reception wall; logo title card in video |
| Hero | `akoubri_adostigia-reception-01.webp` — the branded reception, the one frame that names the project |
| Card | `akoubri_adostigia-reception-desk-02.webp` |
| Video use | Detail page, after the still sequence |

Visible materials: pale stone/travertin-look wall panelling with fine vertical
reeding, dark veined marble feature panel, walnut-tone timber, warm cove
lighting, black track spots, large-format stone floor tiles.

### 2. Farraj — Conserverie Faraj, olive processing facility *(priority 2)*

| | |
|---|---|
| Images | 0 photographs on disk |
| Video | 1 × narrated tour, 127 s |
| Stills | 10 extracted from the video (labelled by the video's own captions) |
| Program | Administration building, offices, meeting room, director's office, olive reception hangar, weighbridge, maintenance workshop, soda treatment zone, water cisterns, solar array |

**This is not a villa.** The video's own French captions establish the program:
"Plan de masse faraj conserverie", "RDC Hall d'entrée", "RDC, Bureau 2/3",
"RDC, Salle de réunion", "Etage, Bureau directeur 1", "Etage, Bureau
secretaire", "Hangar 1 : Reception des olives", "Pont bascule", "Atelier de
maintenance", "Zone traitement de soude & citerne Reserve d'eau".

The FARAJ brand mark (an olive tree in relief, "Conserverie FARAJ") appears on
signage throughout.

| Hero | `akoubri_farraj-vue-aerienne-10.webp` — aerial of the whole site |
| Card | Video with poster (`akoubri_farraj-poster.webp`) |

### 3. Le Sentier — residential building *(priority 3)*

| | |
|---|---|
| Images | 50 files; 34 renders selected + 2 floor plans |
| Video | none |
| Program | Apartments + a rooftop amenity level |
| Evidence | Plans labelled "Apt 36 — 54,42 m²" and apartments 47/48 |

**Correction made during this work.** A first pass named seven files
`…-facade-…` on the assumption that the low-numbered sources were façades.
Opening them proved they are **apartment interiors**; the batch contains **no
façade render at all**. Every file was then opened individually and renamed
from what it actually shows. The error was caught by rendering the page and
looking at it — filename and string checks had passed clean.

The set splits in two:

- **Interiors** — living rooms, a panelled corridor, open and galley kitchens
  with veined-marble splashbacks, bedrooms, travertine shower rooms.
- **Rooftop** — an infinity pool in green stone with a dark-marble spill wall,
  a bar under a slatted pergola, a firepit lounge under shade sails, and an
  aerial of the whole terrace level. Several frames show the **snow-capped
  Atlas** on the horizon, consistent with the owner-confirmed Marrakech
  location.

| Hero | `akoubri_le-sentier-toiture-piscine-atlas-01.webp` — the pool with the Atlas behind |
| Card | same |
| Plans | native resolution, WebP q92 — text stays legible (verified by 1:1 crop) |

All 50 files carry **unique** perceptual hashes: the `N(1)`/`N(2)` variants are
different renders, not duplicates. The rooftop shots live entirely among those
variants, which is why the first pass missed them.

### 4. Zahiya — Zahiya Residence *(priority 4)*

| | |
|---|---|
| Images | 17 photographic renders + 20 newer PNG renders = 37 used |
| Video | 2 (façade loop, living-room loop) |
| Program | Apartments over ground-floor retail ("Atelier Co" shopfronts), lobby, staircases |
| Evidence | "ZAHIYA RESIDENCE" illuminated signage over the entrance, and the same watermark burned into both videos |

Two distinct render batches: an earlier photographic set (1280×853, dark
mineral façade, warm interiors) and a newer set (1536×1024, marble kitchens,
zellige bathroom, reeded-timber salons).

| Hero | `akoubri_zahiya-facade-loop.mp4` (poster: façade) |
| Card | `akoubri_zahiya-entrance-signage-01.webp` |
| Videos | **Both belong to Zahiya** — they were previously mis-filed under `video/hero-loop.mp4` and `video/card-03.mp4` and used as generic site chrome |

### 5. Maison d'hôte — guesthouse *(priority 5)*

| | |
|---|---|
| Images | 20 on disk, 19 unique (1 exact duplicate) |
| Video | none |
| Program | Bungalow guest rooms, bedrooms, bathrooms, Moroccan salon, roof terrace, kitchen |

Architecturally distinct from every other project: **cork wall panels**, **split
bamboo and timber-beam ceilings**, **arched white headboard niches**, **zellige
and patterned cement floor tiling**, **dry-stone walling**, rattan and macramé.

Bungalow imagery is explicitly represented in the gallery and not merged into
the generic bedroom sequence.

| Hero | `akoubri_maison-dhote-terrace-lounge-07.webp` — the stone-wall roof terrace under a bamboo canopy |
| Card | same |

### 6–8. Three separate villas

The owner confirmed these are **three distinct projects**, one render each:

| Project | What the render shows |
|---|---|
| **Villa** | Two-storey house, upper floor cantilevered over the terrace, timber-battened soffit, pool edged with bamboo |
| **Villa K** | Semi-detached pair in pale stone, a helical timber stair read from outside through a full-height glazed slot |
| **Villa Targa** | Corner house in offset volumes, dark split-stone tower with full-height lit glazing reveals |

Previously the catalogue held a single "Villa Bambou" with an invented
narrative. All three are now described only from what is visible.

---

## Duplicates found

| Files | Relationship |
|---|---|
| `Maison d'hote/…22.30.17.jpeg` ≡ `…22.30.18.jpeg` | identical MD5 |
| `zahiya/zahiya-02.jpg` ≡ `zahiya/zahiya-05.jpg` | identical MD5 |

Duplicates are **not deleted** — each is simply converted once.

The earlier `Villa K` ≡ `Villa targa` duplicate **no longer exists**: the
correct Villa K render was supplied during this work, so the three villa
folders now hold three different images.

---

## Unresolved — needs owner input

**Resolved.** Villa K and Villa Targa were briefly indistinguishable because
both folders held the same file. The correct Villa K render was supplied during
this work, so all three villas are now published as separate projects.

**Still outstanding — factual metadata.** Year, surface and status are `null`
for every project and render as « À confirmer ». Supplying them is a data-only
change in `src/data/projects.js`; no code or media work is needed.

---

## Optimisation settings

| Content | Setting | Result |
|---|---|---|
| Photographs | WebP q82, max 2048 px wide | ~10 % of original size |
| CAD floor plans | WebP q92, native resolution | text legibility preserved (verified at 1:1) |
| Video | H.264 CRF 28 (28→30 for silent loops), `+faststart`, 1280 px | large reduction; silent loops stripped of audio |
| Posters | WebP q82 from a representative frame | every video has one |

Lossless WebP was tested for the plans and rejected: at 2.8 MB it is *larger*
than the source JPEG.
