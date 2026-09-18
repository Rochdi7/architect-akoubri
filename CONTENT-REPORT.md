# Akoubri — Website Content Report

Factual inventory of the site as it currently stands. Everything below is taken from the actual source; nothing is invented. Prepared as input for a second AI reviewer.

**Site:** akoubri.com · **Language:** French (only) · **Stack:** React SPA, client-rendered, no prerendering
**Business:** Akoubri Architecture & Design — architecture practice, Marrakech, Morocco

---

## 1. Website purpose & positioning

A French-language showcase site ("site vitrine") for a Moroccan architecture and interior-design practice based in Marrakech, with a second office in Casablanca since January 2022.

**The core pitch, stated repeatedly:** decide from accurate images, not promises. Everything is modelled and rendered in 3D before construction, so the client arbitrates on renders rather than intentions.

Verbatim expressions of this positioning:
- Hero subheadline: *"De l'esquisse au chantier, avec des images de synthèse pour décider sur pièces plutôt que sur promesse."*
- *"Chaque projet est modélisé et rendu avant d'être construit. Vous arbitrez sur des images fidèles, pas sur des intentions."*
- Conviction #4: *"Rendre avant de bâtir"*
- Blog: *"Nous préférons perdre un arbitrage sur une image que le regretter sur un mur."*

**Secondary positioning threads:**
- Short team, one point of contact — *"7 personnes, 2 bureaux"*, *"Une équipe courte, un interlocuteur"*, *"La personne qui dessine votre projet est celle qui le suit en chantier."*
- Restraint and material honesty — *"Peu de gestes"*, *"La matière tient le budget"*, a deliberately short vocabulary of béton teinté, travertin, noyer, laiton.
- Candour as a selling point — *"Dire non quand il faut"*, *"On vous dit franchement si le projet tient debout — techniquement et budgétairement"*, and a stated refusal of purely cosmetic renovations.
- Site-first design — *"Le site d'abord"*, *"Pas de projet hors-sol."*

**Tone:** sober, technical, understated. Craft-led rather than commercial. Almost no superlatives or marketing inflation.

---

## 2. Target audience

Inferred from project types, the budget bands in the form, and the language used:

| Segment | Evidence |
|---|---|
| **Private individuals building a villa/home** | Villa Bambou ("villa familiale"); budget band "Moins de 500 000 MAD"; many testimonials are individuals |
| **Property developers (promoteurs)** | Le Sentier (4 200 m² residential + retail); Services FAQ: *"Beaucoup de promoteurs nous confient seulement la production d'images… pour une commercialisation ou un dossier d'investisseurs"* |
| **Companies needing offices/HQ** | Adostigia (1 800 m² engineering-group HQ); testimonials heading addresses *"Promoteurs, entreprises et particuliers"* |
| **Investors** | Renders pitched to *"convaincre un investisseur"* |

**Geography:** Marrakech first, Casablanca second. The Services FAQ claims all of Morocco: *"Nous suivons des chantiers partout au Maroc. Au-delà de 200 km, nous calons un rythme de visites groupées."*

**Budget bands offered in the form:** Moins de 500 000 MAD · 500 000 — 1,5 M MAD · 1,5 — 5 M MAD · Plus de 5 M MAD · À définir. This spans a wide range, from modest private work to large developments.

**Language note:** the site is French-only. No Arabic and no English, although 5 of the 24 testimonials are written in English, implying some international/expat clientele.

---

## 3. Current services

Four numbered disciplines, identical on the Homepage and Services page (single source: `src/data/projects.js`):

**01 — Architecture**
> "Conception d'immeubles résidentiels, villas et programmes tertiaires — de l'esquisse au permis de construire, puis au suivi de chantier."
> Faisabilité & esquisse · **Permis de construire** · Dossier de consultation · Suivi de chantier

**02 — Design d'intérieur**
> "Aménagement complet d'espaces de vie et de travail : plans, choix des matières, mobilier sur mesure et mise en lumière."
> Plans d'aménagement · Matériauthèque · Mobilier sur mesure · Éclairage

**03 — Images de synthèse**
> "Perspectives photoréalistes et films 3D pour arbitrer un projet, convaincre un investisseur ou lancer une commercialisation."
> Perspectives extérieures · Vues intérieures · Films & animations · Visites virtuelles

**04 — Direction artistique**
> "Identité d'un lieu : signalétique, nom, matières et palette."
> Signalétique · Palette & matières · Nommage · Supports de vente

**Mission options in the contact form (8)** — a broader list than the four disciplines: Permis de construire · Architecture · Design d'intérieur · Images de synthèse · Faisabilité & esquisse · Dossier de consultation · Suivi de chantier · Mission complète.

**A wider service list exists in `business.js`** (the Google Business Profile summary) and is **never shown on any page**: *urbanisme, études et conception, autorisations de construire, **autorisations économiques**, dossiers administratifs et techniques*, and *projets touristiques*.

**Fee model** (Services FAQ, no figures given anywhere):
> "Au pourcentage du montant des travaux pour une mission complète, ou au forfait pour une mission partielle (permis seul, intérieurs seuls, images seules). Le devis est fixé avant tout démarrage."

---

## 4. Page-by-page content summary

### `/` Home — 13 sections
1. **Hero** — video loop. H1 *"Cabinet d'architecture & design d'intérieur"*. CTAs: Voir les projets · Parler de votre projet.
2. **Marks strip** — lead line *"Quatre métiers, un seul interlocuteur"* over **five** items (see §12).
3. **Design stories** — *"Les lieux que vous imaginez, tenus jusqu'au chantier"* + 3 project tiles.
4. **Projets récents** — rotating radial wheel, 4 projects indexed 01–04.
5. **En chiffres** — *"Douze ans de projets livrés"*: 12 / 48 / 96k / 4.
6. **Portfolio** — *"Un aperçu du niveau de finition que nous visons"*.
7. **Intérieurs** — *"Les espaces que vous imaginez"*, 6-slide carousel with material captions.
8. **Convictions** — *"Ce en quoi nous croyons"*, 3 of the 6 values.
9. **Services** — *"Quatre métiers, un seul interlocuteur"*, the 4 discipline cards.
10. **Références** — *"Ce qu'en disent les maîtres d'ouvrage"*, the testimonial wall.
11. **Méthode** — *"Comment on travaille"*: Écoute · Esquisse · Développement · Chantier.
12. **FAQ** — *"Questions fréquentes"*, the 5 agency Q&As.
13. **CTA** — *"Démarrons votre projet"* + compact form (name/email/message only).

### `/projets` — index
H1 *"Projets"*. Intro: *"Résidences, sièges sociaux et maisons individuelles. Chaque projet est présenté avec ses images de synthèse et ses données de programme."* Filters: Tous · Résidentiel · Tertiaire · Villa. **No CTA on this page.**

### `/projets/:slug` — 4 detail pages
H1 = project name. Spec list: Année, Catégorie, Surface, Lieu, Mission, Statut. Three body paragraphs, gallery (first 6 images on page, rest in lightbox), sticky quote form ("Demander un devis"), and a "Projets liés" block linking all other projects.

### `/agence` — About
H1 *"Une équipe courte, un interlocuteur"*, badge *"7 personnes, 2 bureaux"*. Sections: positioning statement, the 4 stats, a 5-step timeline (2013→2025), 6 convictions, 5 FAQs. **No named people, no photographs of the team, no founder bio.**

### `/services`
H1 *"Une architecture ancrée dans le lieu, l'usage et la matière"*. Image ticker, stats as bar chart, the 4 alternating service rows, 4 FAQs, CTA form.

### `/contact`
H1 *"Parlons de votre projet"*. Full form (name, email, phone, mission, budget, message), 4 info cards (email, two phones, office address + map, hours). Closing note asks for the plan cadastral or land coordinates.

### `/journal` + `/journal/:slug` — **hidden**
H1 *"Notes d'agence"*. Six complete articles. Routes live but unlinked from header, footer and sitemap — deliberate, per code comments.

### `/mentions-legales` · `/confidentialite` · 404
Legal notice (ships with unfilled placeholders — §12), privacy policy under **loi 09-08 / CNDP**, and a 404 page.

---

## 5. Main topics & keywords currently targeted

Measured occurrences across `src/`:

| Term | Count | Note |
|---|---|---|
| villa | 31 | |
| plans | 32 | |
| Marrakech | 24 | |
| architecte | 22 | mostly inside testimonials |
| 3D / images de synthèse | 17 | a genuine differentiator |
| Maroc | 14 | |
| design d'intérieur | ~12 | always with apostrophe |
| Casablanca | 6 | |
| **permis de construire** | **5** | see §6 |
| suivi de chantier | 5 | |
| rénovation | 2 | one FAQ only |
| décoration | 1 | |
| **"design intérieur"** (no apostrophe) | **0** | |
| **maître d'œuvre** | **0** | |
| **riad** | **0** | |
| Rabat / Agadir / Tanger / Essaouira | **0** | |

**Effective themes:** contemporary architecture in Marrakech · 3D renders as a decision tool · raking light and solar design · materials (travertin, noyer, laiton, béton teinté) · site-led design · construction supervision.

**"Architecte Marrakech"** — the obvious primary commercial query — appears exactly **twice**, both as a brand string (`legalName` and schema `alternateName`). It is in no H1, no title, no meta description and no body copy.

---

## 6. Current *Permis de construire* content

This is the thinnest area relative to its commercial value. Five occurrences in total:

1. A bullet under Architecture: `Permis de construire`
2. The Architecture sentence: *"de l'esquisse au permis de construire"*
3. A dropdown option in the contact form
4. The Services fee FAQ mentioning a *"permis seul"* partial mission
5. The 2013 timeline entry: *"un premier permis de construire à Marrakech"*

**Two substantive pieces of permit content exist:**

- **Agency FAQ — timeline:** *"Comptez trois à cinq mois selon la commune : deux à trois semaines pour l'esquisse, six à huit semaines pour le dossier, puis l'instruction administrative que nous ne maîtrisons pas."*
- **A full article, `permis-de-construire-maroc`** ("Permis de construire au Maroc : le calendrier réel", 9 min) covering the five-step sequence — land title and applicable rules, note de renseignements urbanistiques, design with BET, submission to commission, response/reservations/authorisation — plus three avoidable causes of delay.

**The article is unreachable.** It is not linked from any page and not in the sitemap. There is **no permit service page** and no permit entry point anywhere in the navigation.

---

## 7. Current Architecture / construction content

The strongest and best-evidenced area.

- Four project case studies with real specifications (surface, year, location, status, mission) and three paragraphs of genuine design reasoning each.
- A four-step method: Écoute → Esquisse → Développement → Chantier.
- Six convictions covering site, restraint, materials, renders, site supervision and refusing bad briefs.
- Construction supervision described concretely: *"Visite hebdomadaire, arbitrages en direct, comptes rendus écrits."*
- Regulatory awareness present but light: *règlement d'urbanisme* appears in the process and convictions; the commission process only in the hidden article.

**Numbers claimed:** 12 années d'exercice · 48 projets livrés · 96k m² conçus · 4 villes · 7 people (3 architects, 2 interior designers, 1 3D artist, 1 site manager) · 2 offices.

---

## 8. Current *Design intérieur* content

Well covered visually, thinner as service copy.

- A dedicated discipline card with four deliverables.
- A 6-slide interiors carousel with precise material captions — e.g. *"Corniches lumineuses périphériques : la lumière vient des murs."*
- Two projects carry substantial interior narrative (Zahiya's ecru plaster/porcelain/walnut interiors; Adostigia's travertine reception and acoustically dead meeting rooms).
- Two hidden articles: the materials-library method and office acoustics.

**Gaps:** no interior-design service page, no room-by-room or typology breakdown, no before/after, no furniture or styling scope detail, no pricing signal. *Décoration* appears once; *rénovation* twice, and one of those refuses the work.

---

## 9. Current SEO / content strategy

There is essentially **no active SEO layer**.

**What exists:**
- `<html lang="fr">`, a valid robots.txt, an 11-URL sitemap.
- Per-route `<title>` set client-side via `document.title`.
- One JSON-LD `ArchitecturalService` block in `index.html` with NAP, geo, hours and `aggregateRating` 5.0/57.
- 100% image alt coverage (29/29), descriptive French.
- Exactly one H1 per page; sound heading hierarchy.

**What is missing:**
- **Per-page meta descriptions — none.** All 11 URLs share the homepage description.
- **Canonical tags — none. Hreflang — none.**
- **No prerendering/SSR.** A client-rendered SPA: the server returns one identical shell for every URL.
- `og:image` and schema `image`/`logo` are root-relative, not absolute — social previews likely show no image.
- No `og:url`, `og:site_name`, `og:locale`; `twitter:card` present but no twitter title/description/image.
- No `FAQPage` schema despite two real FAQ datasets; no `Review` nodes despite 24 real reviews; no `BreadcrumbList`; no per-project schema.
- Sitemap has no `<lastmod>`.
- Titles carry no keyword or city (*"Projets — Akoubri"*, *"Services — Akoubri"*).

**Content strategy:** six genuinely good articles were written, then deliberately hidden. Date range 2025-11-14 → 2026-07-18, one post every 6–10 weeks, all bylined "Akoubri" with no author shown in the UI. Publishing appears to have stopped.

---

## 10. Strong points

1. **Editorial quality.** The French is precise, specific and free of filler. Copy commits to real detail — two-metre loggias, perimeter light coving, acoustic ceilings — rather than generic claims.
2. **A clear, defensible differentiator.** "Render before building" is stated consistently and backed by an in-house 3D capability since 2016.
3. **Real, verbatim social proof.** 24 genuine Google reviews, unedited beyond typography, with reviewer standing shown rather than invented job titles.
4. **Honest, well-judged FAQs.** Nine Q&As answering real commercial questions — fees, timelines, team size, working with imposed contractors — including answers that decline work.
5. **Strong project case studies.** Each has genuine design reasoning, not marketing description.
6. **Six high-quality articles already written** — ~2,250 words targeting high-intent queries ("permis de construire au Maroc", "lire un devis d'architecte").
7. **Solid technical hygiene** where it exists: full alt coverage, correct heading levels, honeypot + rate-limited form, a privacy policy that accurately matches the backend.
8. **Consistent service promise** — "sous 48 heures ouvrées" appears identically in every conversion point.

---

## 11. Weak points / missing content

**Content gaps**
1. **No permit service page** despite it being a primary commercial query in Morocco.
2. **No interior-design service page**; no renovation offer (actively discouraged).
3. **No team page, no names, no faces, no credentials.** The founder, Adnane Akoubri, is named only inside two customer reviews and a LinkedIn URL.
4. **No pricing signal at all** — no ranges, no percentages, no example budgets.
5. **No city pages.** Only Marrakech and Casablanca appear anywhere.
6. **Six articles hidden**, including the only permit content.
7. **No process detail per service** — the four-step method is generic across all disciplines.
8. **Villa Bambou has one image** against 13/22/18 for the others, yet holds a full page and sitemap entry.
9. **Only 4 projects published** against 48 claimed.
10. **No client logos, awards, press or publications.**

**Trust gaps**
11. **No Ordre National des Architectes registration** anywhere — normally expected for a Moroccan practice.
12. **No professional insurance** (RC professionnelle / décennale) mentioned.
13. **Legal page ships with unfilled placeholders** (§12).
14. **Contact email is a Gmail address**, not a domain mailbox.

**Conversion gaps**
15. No consent/RGPD checkbox on any form, and no link to the privacy policy from within forms.
16. No WhatsApp link except one footer icon, despite being a primary channel in Morocco.
17. The 5.0/57 rating is asserted only in invisible markup — never displayed to users.
18. No newsletter or lead magnet.

---

## 12. Contradictions & unclear information

| # | Issue | Detail |
|---|---|---|
| 1 | **"Quatre métiers" over five items** | The homepage strip is introduced by *"Quatre métiers, un seul interlocuteur"* but lists five: Architecture, Design d'intérieur, Images de synthèse, **Suivi de chantier**, Direction artistique. |
| 2 | **"4 Villes" unevidenced** | The stat claims 4 cities; only Marrakech and Casablanca appear anywhere on the site. |
| 3 | **48 projects vs 4 published** | Partly explained by the FAQ (*"Seulement avec l'accord écrit du maître d'ouvrage"*), but 96k m² claimed against 9 520 m² shown. |
| 4 | **Legal placeholders are live** | `[RAISON SOCIALE]`, `[FORME JURIDIQUE]`, `[MONTANT] MAD`, `RC n° [NUMÉRO]`, `[NUMÉRO ICE]`, `[NUMÉRO IF]`, `[NOM DU RESPONSABLE]`, `[VILLE]` ×2, `[DATE DE MISE EN LIGNE]`. These render to visitors and are legally required in Morocco. |
| 5 | **Stale Google Fonts claim** | The privacy policy says the only external resource is Google Fonts; fonts are in fact self-hosted. The site is cleaner than its own policy admits. |
| 6 | **Service scope mismatch** | `business.js` advertises urbanisme, autorisations économiques, dossiers administratifs et techniques and projets touristiques — none appear on any page. |
| 7 | **areaServed is Marrakech only** | Schema lists one city despite a Casablanca office, a Casablanca project, and a claim to work across Morocco. |
| 8 | **aggregateRating without Review nodes** | 5.0/57 declared in markup with no `Review` markup and no visible on-page rating — a review-snippet policy risk. |
| 9 | **Two Résidentiel projects share an H2** | Le Sentier and Zahiya both render *"Résidence · Marrakech, Maroc"*. |
| 10 | **Unclear which office is primary** | NAP and schema are Marrakech-only; Casablanca appears only in the timeline and one project. Its address is never given. |
| 11 | **404 returns HTTP 200** | Client-side route only. |
| 12 | **Testimonial count vs rating** | 24 reviews shown, 57 claimed in markup. Not a contradiction, but the gap is unexplained on-page. |

---

## 13. What the website currently prioritises

**By space, prominence and effort:**

1. **Visual craft above all.** A video hero, a rotating project wheel, carousels, ink-fill heading animations, lightboxes. The site is built to be *looked at* — it behaves like a portfolio, not a lead funnel.
2. **Projects as the primary proof.** Four case studies carry the most detailed copy; both the homepage and footer route toward them.
3. **The 3D/render differentiator**, repeated in the hero, design-stories section, service 03, convictions, method and timeline.
4. **Craft credibility over commercial capture** — materials, light and detailing get far more words than fees, permits or process deliverables.
5. **Social proof** — a 24-review wall is one of the largest blocks on the homepage.
6. **Brand tone** — restraint, candour, "we say no".

**What it does *not* prioritise:** search acquisition (no meta, no canonicals, no prerender, no city or service landing pages), permit/regulatory demand, pricing transparency, personal/professional credentials, and editorial publishing (written, then hidden).

**Net:** the site reads as a *reputation and referral* asset — something to send to a prospect who already knows the practice — rather than an acquisition channel meant to be found by strangers searching for an architect.

---

## 14. Questions to clarify with the architect

**Facts to verify**
1. Which **4 cities**? Only Marrakech and Casablanca appear.
2. Are **48 projects / 96k m² / 12 years** accurate and defensible?
3. **Legal identity**: raison sociale, forme juridique, capital, RC, ICE, IF, directeur de la publication, and the competent court's city.
4. Is he **registered with the Ordre National des Architectes**? If so, the registration number — a significant trust signal currently absent.
5. Is there **professional insurance** (RC professionnelle, décennale) to state?
6. Is the **Casablanca office** a real address that should be published as a second NAP?
7. Should the contact address move from **Gmail to a domain mailbox**?
8. Is the **5.0/57 Google rating** current, and may it be displayed on-page?

**Strategy**
9. Should **permis de construire become a full service page**? It is high-intent commercial demand and currently gets five passing mentions.
10. Should the **journal be republished**? Six finished articles sit unreachable, including the only permit content.
11. Should **fee ranges or a starting price** be published, even as brackets?
12. Should the practice be **named and shown** — founder bio, photo, team? Currently the studio is anonymous.
13. Does he want **renovation work**? The FAQ actively discourages it.
14. Are **urbanisme and autorisations économiques** real services? They are advertised on Google but absent from the site.
15. Should there be **city pages** (Marrakech, Casablanca, others) or an explicit service-area page?
16. Are there **more projects that can be published**, with client consent — especially for Villa Bambou, which has one image?
17. Should the site offer **English or Arabic**? Five reviews are in English.
18. Should **WhatsApp** become a prominent contact channel?
19. What is the **priority client**: private villas, developers, or corporate interiors? The site currently addresses all three equally.

---

## 15. Complete page inventory

| # | Route | Title (client-set) | Purpose | In sitemap | H1 |
|---|---|---|---|---|---|
| 1 | `/` | Akoubri — Cabinet d'architecture & design d'intérieur | Homepage; 13 sections covering positioning, projects, stats, services, proof, method, FAQ, CTA | ✅ | Cabinet d'architecture & design d'intérieur |
| 2 | `/projets` | Projets — Akoubri | Filterable portfolio index (4 projects) | ✅ | Projets |
| 3 | `/projets/le-sentier` | Le Sentier — Akoubri | Case study — Résidentiel, Marrakech, 4 200 m², 2025, Livré, 13 images | ✅ | Le Sentier |
| 4 | `/projets/adostigia` | Adostigia — Akoubri | Case study — Tertiaire, Casablanca, 1 800 m², 2025, En chantier, 22 images | ✅ | Adostigia |
| 5 | `/projets/zahiya` | Zahiya — Akoubri | Case study — Résidentiel, Marrakech, 3 100 m², 2024, Livré, 18 images + video | ✅ | Zahiya |
| 6 | `/projets/villa-bambou` | Villa Bambou — Akoubri | Case study — Villa, périphérie de Marrakech, 420 m², 2024, Livré, **1 image** | ✅ | Villa Bambou |
| 7 | `/agence` | L'agence — Akoubri | About: team size, positioning, stats, timeline, convictions, FAQ | ✅ | Une équipe courte, un interlocuteur |
| 8 | `/services` | Services — Akoubri | The 4 disciplines, stats, 4 FAQs, CTA form | ✅ | Une architecture ancrée dans le lieu, l'usage et la matière |
| 9 | `/contact` | Contact — Akoubri | Full enquiry form + NAP, hours, map | ✅ | Parlons de votre projet |
| 10 | `/mentions-legales` | Mentions légales — Akoubri | Legal notice — **contains unfilled placeholders** | ✅ | Mentions légales |
| 11 | `/confidentialite` | Politique de confidentialité — Akoubri | Privacy policy under loi 09-08 / CNDP | ✅ | Politique de confidentialité |
| 12 | `/journal` | Journal — Notes d'agence — Akoubri | Blog index, 4 categories | ❌ **hidden** | Notes d'agence |
| 13 | `/journal/lire-un-devis-architecte` | … — Akoubri | Article — reading an architect's quote (7 min) | ❌ | post title |
| 14 | `/journal/pourquoi-rendre-avant-de-construire` | … — Akoubri | Article — why everything is rendered in 3D first (6 min) | ❌ | post title |
| 15 | `/journal/lumiere-rasante-marrakech` | … — Akoubri | Article — designing for Marrakech's raking light (8 min) | ❌ | post title |
| 16 | `/journal/materiautheque-choisir-ses-matieres` | … — Akoubri | Article — building a materials library (6 min) | ❌ | post title |
| 17 | `/journal/permis-de-construire-maroc` | … — Akoubri | Article — **the real building-permit timeline in Morocco** (9 min) | ❌ | post title |
| 18 | `/journal/silence-materiau-de-projet` | … — Akoubri | Article — office acoustics (5 min) | ❌ | post title |
| 19 | `*` | Akoubri | 404 — returns HTTP 200 | ❌ | Cette page n'existe pas |

**Totals:** 11 public indexed URLs · 7 live but hidden (blog) · 4 published projects · 6 articles · 24 testimonials · 9 FAQ entries.

**Unpublished material present in the repository:** four media folders referenced nowhere in code — `Villa K`, `Villa targa`, `farraj`, `Maison d'hôte` — plus five 3D "Spatial Stories" chapter narratives (Le Sentier, Zahiya, Villa Bambou, Adostigia, Appartement 48) that are currently rendered by no page.

---

## Appendix — key facts

**NAP:** Akoubri Architecture & Design · 2ème étage, bureau N8, Centre d'Affaires Rayane, Rue Abdelkader Mesfioui, Marrakech 40000, Maroc · akoubriarchi@gmail.com · 06 63 51 57 23 / 06 63 66 45 87 · Lun–Ven 9h–17h · 5.0★/57 reviews (markup only)

**Response promise:** "sous 48 heures ouvrées" (consistent across every conversion point)

**Stated timelines:** sketch 2–3 weeks · permit dossier 6–8 weeks · first contact to permit 3–5 months

**Fees:** % of works value (full mission) or fixed fee (partial). No figures published.
