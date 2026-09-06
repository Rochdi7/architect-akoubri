<div align="center">

<br />

# ADOSTIGIA

### Cabinet d'architecture & design d'intérieur — Marrakech · Casablanca

*Un site vitrine pensé comme un portfolio d'architecte :*
*la matière avant l'effet, le rendu avant la promesse.*

<br />

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![React Router](https://img.shields.io/badge/Router-6.26-CA4245?style=flat-square&logo=reactrouter&logoColor=white)](https://reactrouter.com)

[![Bundle](https://img.shields.io/badge/bundle-102_KB_gzip-2ea44f?style=flat-square)](#-performance)
[![Hosting](https://img.shields.io/badge/deploy-static_%2F_Hostinger-673AB7?style=flat-square)](#-déploiement-hostinger)
[![A11y](https://img.shields.io/badge/a11y-WCAG_AA-0b7285?style=flat-square)](#-accessibilité)
[![Langue](https://img.shields.io/badge/UI-Français-blue?style=flat-square)](#)

<br />

**[Démarrer](#-démarrage-rapide)** · **[Architecture](#-architecture)** · **[Design system](#-système-de-design)** · **[Déploiement](#-déploiement-hostinger)** · **[Contribuer](#-conventions-de-code)**

<br />

</div>

---

## ✦ Le projet

Site vitrine complet pour un cabinet d'architecture marocain, présentant quatre
métiers — **architecture**, **design d'intérieur**, **images de synthèse** et
**direction artistique** — à travers neuf pages, un catalogue de projets livrés et un
journal éditorial.

La contrainte fondatrice a façonné toute l'architecture technique :
**hébergement mutualisé Hostinger, sans runtime Node**. Le site se compile donc
en HTML/CSS/JS purement statique, et l'unique brique serveur est un fichier PHP
de 200 lignes pour le formulaire de contact.

<table>
<tr>
<td width="33%" valign="top">

### 🎨 Deux systèmes de design

Une palette « argile / papier » chaude et une palette « olive » architecturale
coexistent, cloisonnées par une classe `.zv`. Rien n'est laissé au hasard :
chaque surface est une marche d'une rampe unique de 9 tons.

</td>
<td width="33%" valign="top">

### ⚡ 89 Ko de JavaScript

Zéro dépendance UI, zéro librairie d'animation, zéro framework de composants.
Les révélations au scroll tiennent en un seul `IntersectionObserver` de 43 lignes.

</td>
<td width="33%" valign="top">

### ♿ Accessible par défaut

Listbox ARIA complète, `inert` sur le tiroir fermé, doublons de marquee retirés
de l'arbre d'accessibilité, `prefers-reduced-motion` respecté partout.

</td>
</tr>
</table>

---

## ⚡ Démarrage rapide

```bash
git clone https://github.com/Rochdi7/architect-akoubri.git
cd architect-akoubri

npm install
npm run dev        # → http://localhost:5173
```

| Commande | Effet |
| :--- | :--- |
| `npm run dev` | Serveur de développement avec HMR |
| `npm run build` | Compile vers `dist/` (~1,8 s) |
| `npm run preview` | Sert le build de production en local |

> **Prérequis** — Node 18 ou supérieur. Aucune variable d'environnement,
> aucune base de données, aucun service externe à configurer.

---

## ✦ Architecture

```
index.html                  ← point d'entrée unique, polices préchargées
└── src/main.jsx            ← createRoot + BrowserRouter + les 2 feuilles de style
    └── App.jsx             ← Routes + Header + Footer + RouteEffects
        ├── components/     ← Header, Footer, ProjectCard, Showcase,
        │                     Testimonials, Select
        ├── pages/          ← les 9 composants de route
        ├── hooks/          ← useReveal
        └── data/
            ├── projects.js   ← projets, services, chiffres, témoignages
            └── posts.js      ← articles du journal

public/                     ← copié tel quel à la racine du serveur
├── media/                  ← 55 JPEG + 4 vidéos
├── fonts/                  ← 17 woff2 auto-hébergés (372 Ko)
├── api/contact.php         ← l'intégralité du backend
├── .htaccess               ← routing SPA, cache, CSP, HTTPS
├── robots.txt
└── sitemap.xml
```

### Les pages

| Route | Fichier | Contenu |
| :--- | :--- | :--- |
| `/` | `pages/Home.jsx` | 12 sections : hero vidéo, mosaïque, projets, chiffres, carrousel, valeurs, services, témoignages, process, FAQ |
| `/projets` | `pages/Projects.jsx` | Grille filtrable par catégorie |
| `/projets/:slug` | `pages/ProjectDetail.jsx` | Colonne technique collante, galerie, lightbox, formulaire de devis |
| `/agence` | `pages/Agency.jsx` | Hero scindé, chiffres, frise chronologique, convictions |
| `/services` | `pages/Services.jsx` | Bandeau défilant, graphiques, prestations, CTA |
| `/journal` | `pages/Blog.jsx` | Journal éditorial, filtrable par catégorie |
| `/journal/:slug` | `pages/BlogDetail.jsx` | Article — rendu par blocs typés |
| `/contact` | `pages/Contact.jsx` | Formulaire validé + cartes d'information |
| `*` | `pages/NotFound.jsx` | 404 |

### Trois décisions structurantes

<details>
<summary><b>Pourquoi <code>base: '/'</code> et des chemins absolus partout</b></summary>

<br />

Avec `base: './'`, les URLs relatives se résolvaient depuis la route courante.
Sur une route à deux niveaux comme `/projets/le-sentier`, un asset
`assets/index.js` était cherché dans `/projets/assets/index.js` → 404 et page
blanche.

`base: '/'` corrige les assets générés par Vite. **Les médias de `public/`
doivent suivre la même règle** : toujours `/media/...`, jamais `media/...`
ni `./media/...`.

</details>

<details>
<summary><b>Pourquoi aucun SSR — et ce que cela coûte</b></summary>

<br />

L'hébergement mutualisé n'expose pas de runtime Node. Les titres de page sont
donc posés impérativement dans `RouteEffects` (`App.jsx`), un `useEffect` sur
`pathname` qui remonte aussi le scroll.

Conséquence assumée : le serveur renvoie un `<div id="root">` vide. Google
exécute le JS et indexe correctement, mais les crawlers sociaux et la plupart
des crawlers IA ne le font pas. Un pré-rendu au build (`vite-plugin-ssg`,
`react-snap`) lèverait ce plafond sans rien changer au déploiement statique.

</details>

<details>
<summary><b>Pourquoi un chunk <code>vendor</code> séparé</b></summary>

<br />

React, ReactDOM et React Router sont isolés dans `vendor.js`. Une modification
du code applicatif n'invalide donc pas le cache du framework — et `.htaccess`
pose un cache immuable d'un an sur les fichiers empreintés.

</details>

---

## 🎨 Système de design

> [!IMPORTANT]
> **Deux systèmes de design complets coexistent dans ce dépôt.**
> C'est délibéré. Toute contribution qui l'ignore produira du code visuellement faux.

### Système A — « Argile / Papier » · `src/index.css`

Chaud, éditorial, empattements. Utilisé par le `Header`, le `Footer` et trois
sections approuvées de la page d'accueil.

| Jeton | Valeur | Usage |
| :--- | :--- | :--- |
| `--ink` | `#1c1917` | Texte, boutons pleins |
| `--paper` | `#faf8f5` | Fond principal (papier chaud, pas blanc pur) |
| `--sand` | `#f2ede6` | Sections alternées |
| `--clay` | `#b06b3a` | **Laiton** — accent, liens, filets |
| `--font-display` | Fraunces | Titres |
| `--font-body` | Inter | Textes courants |

### Système B — « Zenvira / Olive » · `src/zenvira.css`

Froid, architectural, capitales condensées. **C'est le système dominant.**

Une rampe ordonnée de 9 tons, du plus sombre au blanc :

```
#202918  ██  --zv-primary       texte, bandes sombres, boutons
#34402c  ██  --zv-muted         texte secondaire
#4b5243  ██  --zv-border-dark   filets sur fond sombre
#646662  ██  --zv-gray-400      méta, placeholders
#a1a49a  ██  --zv-gray-100      titres désaturés
#cccbc2  ██  --zv-border        filets sur fond clair
#ede9df  ██  --zv-bg-alt        panneaux, bandes alternées
#f7f4ec  ██  --zv-bg            fond de page
#ffffff  ██  --zv-white         cartes
```

Ce n'est pas une collection de teintes : **c'est une seule rampe ordonnée**.
Chaque surface, chaque filet et chaque nuance de texte du site est l'une de ces
neuf marches — jamais une teinte improvisée. C'est ce qui le fait lire comme un
système.

Polices : **Fjalla One** (display condensé, capitales) + **Poppins** — les 17
fichiers `woff2` sont auto-hébergés dans `public/fonts/`.

### 🔑 Le contrat de portée

> Les jetons `.zv` sont **opt-in**. Rien dans `zenvira.css` ne style un élément nu.
> Une section adopte le thème olive **uniquement** en portant la classe `.zv`.

```jsx
<section className="zv zv-section">   {/* olive · Fjalla + Poppins */}
<section className="section-y">        {/* argile · Fraunces + Inter */}
<section className="zv zv-dark">       {/* bande olive sombre, texte blanc */}
<section className="zv zv-alt">        {/* fond alterné #ede9df */}
```

**Sections volontairement maintenues en système A** *(marquées `PROTECTED` dans
`Home.jsx` — designs validés, ne pas restyler)* : `Header`, `Footer`,
« Projets récents », « Les espaces que vous imaginez », et le mur de témoignages.

### Langage formel

| Élément | Valeur | Note |
| :--- | :--- | :--- |
| Boutons | `border-radius: 100px` | Pilule pleine |
| Cartes | `20px` | Filet 1px, **aucune ombre** en système B |
| Panneaux | `24px 24px 0 0` | **Arrondi haut uniquement** |
| Cartes média (A) | `24px` / puits `14px` | Avec ombre |

L'arrondi haut seul est une **signature** : une colonne de panneaux empilés se
lit comme une suite continue de surfaces, et non comme des cartes détachées.

### Mouvement

```css
--ease-arch: cubic-bezier(0.22, 1, 0.36, 1);   /* l'easing maison */
--ease-soft: cubic-bezier(0.4, 0, 0.2, 1);
```

Durées : micro `140–300ms` · standard `400–620ms` · révélations `900–1200ms`.

<details>
<summary><b>Note typographique — pourquoi Fjalla One remplace Bayon</b></summary>

<br />

Le gabarit de référence utilisait **Bayon**. Bayon est une police khmère : son
sous-ensemble latin **ne contient aucune glyphe accentuée** (É À Û Ç Ô è é sont
absentes), alors que son `@font-face` déclare pourtant `U+0000–00FF`.

Résultat : le navigateur sélectionnait la police, échouait caractère par
caractère, et retombait sur une autre fonte **en plein milieu d'un mot** —
catastrophique sur un site francophone.

**Fjalla One** est la police condensée mono-graisse la plus proche disposant
d'une couverture Latin Extended complète.

</details>

<details>
<summary><b>Note typographique — les planchers de <code>clamp()</code> sur mobile</b></summary>

<br />

Le terme `vw` d'un `clamp()` ne dépassait son plancher qu'à ~688px pour `h1` et
~1111px pour `h5`. **Sur téléphone, tous les titres restaient donc figés à leur
minimum desktop** et la plage fluide ne s'exécutait jamais.

Corrigé par des surcharges explicites à `640px` et `380px` :

```css
--zv-h1: clamp(2.75rem, 6.4vw, 5.5rem);          /* 88px desktop */
@media (max-width: 640px) { --zv-h1: 2.25rem; }  /* 36px */
@media (max-width: 380px) { --zv-h1: 2rem; }     /* 32px */
```

</details>

---

## ✦ Interactions notables

### Révélation au scroll — le contrat d'animation du site

`src/hooks/useReveal.js` · **43 lignes.** Un **seul** `IntersectionObserver`
surveille tous les éléments `[data-reveal]`, ajoute `.is-visible` une fois, puis
**cesse de les observer** — le coût reste constant sur les pages longues.

```jsx
<div data-reveal className="reveal">…</div>                        {/* fondu + montée 28px */}
<div data-reveal data-reveal-delay="120" className="reveal">…</div> {/* décalage en cascade */}
<div data-reveal className="mask-reveal">…</div>                    {/* volet clip-path */}
```

Si `prefers-reduced-motion` est actif ou si l'API n'existe pas, **tout est
affiché immédiatement** — jamais masqué.

<details>
<summary><b>Le carrousel d'intérieurs — trapèzes en miroir</b></summary>

<br />

Trois panneaux : celui du centre est un rectangle, les deux latéraux sont
découpés en trapèzes **en miroir** qui penchent vers lui (`clip-path: polygon()`).

Le biseau n'est pas un ornement : les dalles se lisent comme **une coupe dans un
plan**, ce qui justifie la forme sur un site d'architecture.

Seule la dalle centrale est interactive ; les latérales portent `aria-hidden`
et une région `aria-live` annonce les changements. Navigation aux flèches ← →,
au balayage (seuil 45px) et par les pastilles. Les images voisines sont
préchargées.

Sur mobile les latérales perdent leur biseau : à cette largeur, un trapèze se
lit comme un défaut de rendu, pas comme une coupe.

</details>

<details>
<summary><b>Le mur de témoignages — défilement CSS pur</b></summary>

<br />

Trois colonnes dans une fenêtre de hauteur fixe, estompées en haut et en bas par
un `mask-image` : les cartes s'effacent au lieu d'être coupées net.

Le défilement est **entièrement en CSS** — chaque colonne contient ses cartes
**en double** et anime `translateY` de 0 à `-50%`, ce qui boucle sans raccord.
La colonne du milieu tourne en `animation-direction: reverse`, et les trois
vitesses diffèrent (46s / 58s / 52s) pour que les voisines ne défilent jamais à
l'unisson. Le survol met en pause.

Les cartes dupliquées portent `aria-hidden` — sans quoi un lecteur d'écran
annoncerait chaque citation deux fois.

Des pastilles à monogramme remplacent les portraits : inventer le visage d'un
client qui n'a jamais posé serait un mensonge.

</details>

<details>
<summary><b>Le <code>Select</code> personnalisé — listbox ARIA complète</b></summary>

<br />

`src/components/Select.jsx` · 277 lignes remplaçant le contrôle natif, dont la
popup dessinée par l'OS n'est pas stylable.

Implémente : gestion du focus, recherche au clavier avec réinitialisation à
700ms, cartographie clavier complète, fermeture au `pointerdown` extérieur,
fermeture au scroll/resize sur desktop, et une **bottom sheet sur tactile** avec
verrouillage du défilement du corps.

</details>

<details>
<summary><b>Le header — deux pièges d'accessibilité résolus</b></summary>

<br />

Deux headers distincts (desktop `lg:block`, mobile `lg:hidden`), pilules
flottantes en `backdrop-blur-xl` avec balayage dégradé de 4s. Se masque au
défilement descendant au-delà de 90px, revient à la remontée.

1. **Le tiroir mobile fermé est seulement transparent**, pas retiré du flux — il
   porte donc `inert` + `aria-hidden`, sans quoi ses 5 liens resteraient dans
   l'ordre de tabulation.

2. **Le verrouillage du corps utilise `overflowY`, pas le raccourci `overflow`** —
   le raccourci écraserait `overflow-x: clip` et transformerait `body` en
   conteneur de défilement, **tuant silencieusement `position: sticky`** sur
   tous ses descendants.

</details>

---

## ✦ Contenu

Tout le contenu du site vit dans **un seul fichier** : `src/data/projects.js`.
Ni CMS, ni base de données.

Il exporte : `projects` (4) · `services` (4) · `stats` (4) · `process` (4) ·
`testimonials` (9) · `showcase` (6) · `journey` (5) · `agencyFaq` (5).

```js
{
  slug:     'le-sentier',              // segment d'URL + nom du dossier média
  name:     'Le Sentier',
  subtitle: 'Résidence',
  category: 'Résidentiel',             // alimente le filtre de /projets
  year:     '2025',
  location: 'Marrakech, Maroc',
  surface:  '4 200 m²',
  status:   'Livré',
  mission:  'Architecture, façade, signalétique',
  excerpt:  '…',                       // 1 paragraphe, cartes
  body:     ['…', '…', '…'],           // 3 paragraphes, page détail
  cover:    '/media/le-sentier/sentier-05.jpg',
  gallery:  [ /* 13 chemins absolus */ ],
  video:    '/media/video/card-03.mp4' // optionnel
}
```

### Ajouter un projet

1. Déposer les images dans `public/media/<slug>/`.
2. Ajouter une entrée au tableau `projects`.
3. Ajouter l'URL dans `public/sitemap.xml`.

La page détail, la grille, le filtre, le footer et la navigation « projet
suivant » se mettent à jour **automatiquement**.

### Le journal · `src/data/posts.js`

Les articles vivent dans un fichier séparé : **un article n'est pas une variante
de projet**, c'est une autre entité avec une autre forme. 6 articles répartis sur
4 catégories, plus les utilitaires `getPost`, `sortedPosts` et `formatDate`.

Le `body` n'est pas un tableau de chaînes mais **une liste ordonnée de blocs
typés**, pour qu'un article puisse alterner prose, titres, citations, listes et
images sans que le moteur de rendu ait à deviner :

```js
{
  slug: 'lire-un-devis-architecte',
  title: "Lire un devis d'architecte sans se faire piéger",
  category: 'Métier',                  // parmi `categories`
  date: '2026-07-18',                  // ISO — alimente le tri
  readingTime: 7,
  author: 'Akoubri',
  excerpt: '…',
  cover: '/media/adostigia/adostigia-01.jpg',
  body: [
    { kind: 'p',     text: '…' },
    { kind: 'h2',    text: '…' },
    { kind: 'quote', text: '…' },
    { kind: 'list',  items: ['…'] },
    { kind: 'image', src: '/media/…', alt: '…', caption: '…' },
  ],
}
```

> Types de blocs : `p` · `h2` · `quote` · `list` · `image`.
> Les mêmes conventions s'appliquent — chemins médias absolus et copie française.

---

## ✦ Déploiement (Hostinger)

**1 — Construire**

```bash
npm run build
```

**2 — Téléverser le *contenu* de `dist/`** (et non le dossier lui-même) dans
`public_html/` :

```
public_html/
├── index.html
├── .htaccess          ← indispensable
├── assets/
├── media/
├── api/contact.php
├── robots.txt
└── sitemap.xml
```

> [!WARNING]
> Le gestionnaire de fichiers hPanel **masque les fichiers commençant par un
> point**. Activez « Afficher les fichiers cachés » et vérifiez que `.htaccess`
> est bien présent — sans lui, **toute URL autre que `/` renvoie une 404**.

**3 — Configurer l'e-mail** dans `public_html/api/contact.php` :

```php
$TO   = 'votre@adresse.com';
$FROM = 'no-reply@votre-domaine.com';   // doit exister dans hPanel → E-mails
```

Hostinger rejette tout envoi dont l'adresse `From` n'appartient pas au domaine.
**Créez la boîte `no-reply@` avant de tester.**

**4 — HTTPS** — activez le certificat SSL gratuit dans hPanel. La redirection
HTTP → HTTPS est déjà écrite dans `.htaccess`.

**5 — Domaine** — remplacez `akoubri.com` par le domaine réel dans
`public/sitemap.xml` et `public/robots.txt`, puis reconstruisez.

> [!NOTE]
> `vite.config.js` utilise `base: '/'`. Le site doit donc être servi **depuis la
> racine du domaine**. Un déploiement en sous-dossier demanderait de modifier
> `base`, `RewriteBase` dans `.htaccess`, **et** tous les chemins `/media/...`.

---

## ✦ Backend

L'intégralité du backend est **un fichier** : `public/api/contact.php`.
Trois formulaires y postent du JSON — `/contact`, `/projets/:slug` (devis,
préfixé `[Projet : X]`) et `/services`.

| Protection | Implémentation |
| :--- | :--- |
| Méthode | POST uniquement → `405` |
| Taille | Plafond 20 Ko → `413` |
| Honeypot | Champ `company` ; **renvoie 200** pour que le bot croie avoir réussi et ne réessaie pas |
| Limitation | 60s par IP, verrou SHA-256 en dossier temporaire → `429` |
| Injection d'en-tête | `\r`, `\n`, `%0a`, `%0d` retirés de tous les champs d'en-tête |
| Validation | Nom ≥ 2, `FILTER_VALIDATE_EMAIL`, message ≥ 20 |
| Plafonds | Nom 120 · e-mail 180 · message 5000 |
| Encodage | Sujet Base64 UTF-8, expéditeur d'enveloppe `-f` |

`.htaccess` gère par ailleurs : HTTPS forcé, réécriture SPA, gzip, cache immuable
d'un an sur les assets empreintés, `no-cache` sur le HTML, `Options -Indexes`,
refus des fichiers cachés, et un jeu complet d'en-têtes de sécurité incluant une
**CSP stricte**.

> [!CAUTION]
> La CSP impose `script-src 'self'`. **Tout script chargé depuis un CDN sera
> bloqué.** Les librairies doivent être installées via npm et empaquetées par Vite.

---

## ⚡ Performance

Build mesuré (`npm run build`, 1,55 s) :

| Fichier | Brut | Gzip |
| :--- | ---: | ---: |
| `vendor.js` | 163,7 Ko | **53,4 Ko** |
| `index.js` | 126,7 Ko | **35,3 Ko** |
| `index.css` | 64,6 Ko | **13,1 Ko** |
| `index.html` | 1,3 Ko | 0,7 Ko |
| **Total** | **356 Ko** | **≈ 102 Ko** |

**Ce qui maintient ce chiffre bas :**

- Aucune librairie UI, d'animation ou de composants — uniquement React et Router.
- Vendor React isolé dans son propre chunk, cache longue durée.
- `loading="lazy"` hors du premier écran, `fetchPriority="high"` sur les visuels LCP.
- **Les vidéos de carte ne démarrent qu'une fois visibles** (`IntersectionObserver`)
  et respectent `prefers-reduced-motion` **et** `navigator.connection.saveData` —
  une grille de clips ne décode jamais quatre vidéos simultanément sur téléphone.
- Le fond du hero est un extrait recompressé de 1,3 Mo, pas le film source.
- `width` et `height` sont posés sur **toutes** les images → aucun décalage de mise en page.

> [!TIP]
> Les images du bandeau défilant sont **volontairement non-lazy** : la piste
> étant translatée, les images hors écran n'entrent jamais en intersection et ne
> se chargeraient donc jamais.

---

## ♿ Accessibilité

- Navigation clavier complète, `:focus-visible` visible partout.
- Lightbox : `role="dialog"`, `aria-modal`, flèches ← → et `Échap`.
- Menu mobile : `aria-expanded`, `inert` sur le tiroir fermé, verrouillage du défilement.
- Filtres projets : `aria-pressed`. Carrousel : région `aria-live`.
- Cartes de marquee dupliquées retirées de l'arbre d'accessibilité.
- Cibles tactiles ≥ 44px.
- Toutes les images portent un `alt` descriptif — ou `alt=""` + `aria-hidden` si décoratives.
- **`prefers-reduced-motion` respecté partout** : révélations, carrousel,
  marquees, bandeaux et select.
- Les effets de survol sont désactivés sous `@media (hover: none)`, pour ne pas
  laisser une carte bloquée en position haute après un appui tactile.

---

## ✦ Conventions de code

1. **Copie en français** — apostrophes typographiques `'`, `&nbsp;` avant `?` et
   `!`, espace fine insécable dans les nombres (`4 200 m²`).
2. **Jetons uniquement** — `var(--zv-primary)`, **jamais** `#202918`.
3. **Choisir le thème d'abord** — la section porte-t-elle `.zv` ou non ?
4. **Ajouter `data-reveal` + `reveal`** pour l'animation au scroll.
5. **Chemins médias absolus** — `/media/...`, jamais `media/...`.
6. **Toujours poser `width` et `height`** sur les images.
7. **`loading="lazy"`** sous la ligne de flottaison — sauf dans une piste translatée.
8. **Respecter `prefers-reduced-motion`** dans toute nouvelle animation.
9. **Média décoratif** → `alt=""` + `aria-hidden="true"`.
10. **Le nouveau contenu va dans `data/projects.js`**, pas en dur dans une page.

---

## ✦ Feuille de route

- [ ] Supprimer `public/media/video/showreel.mp4` — **9,96 Mo référencés nulle part**, soit 58 % du dossier média
- [ ] Ajouter les balises Open Graph, Twitter Card, canonical et le JSON-LD `ArchitecturalService`
- [ ] Corriger `Select` : `Field` injecte `aria-invalid` / `aria-describedby`, or le composant attend `invalid` / `describedBy` — les deux props sont silencieusement perdues
- [ ] Mettre à jour `<meta name="description">` par route dans `RouteEffects`
- [ ] Générer des variantes WebP / AVIF et passer les `<img>` en `<picture>`
- [ ] Pré-rendu au build (`vite-plugin-ssg`) pour les crawlers sociaux et IA
- [ ] Renseigner les vraies coordonnées — `contact@akoubri.com` et
      `+212 6 00 00 00 00` sont des espaces réservés présents dans **quatre** fichiers
- [ ] Ajouter une error boundary — une erreur de rendu vide actuellement toute la SPA

<details>
<summary><b>Exploration — ajouter de la 3D</b></summary>

<br />

Le cabinet vend des images de synthèse : une expérience 3D sur le site ne serait
pas décorative, elle serait **la thèse du métier rendue littérale**.

Le compromis central : `three` tree-shaken pèse ~100 Ko gzip, soit **plus que le
site entier**. La règle serait donc absolue — **la 3D ne doit jamais toucher le
bundle initial** :

```js
const Viewer = lazy(() => import('./components/Model3D'));
```

Puis déclenchement au clic ou à l'intersection, exactement comme les vidéos de
carte le font déjà. À noter : la CSP interdisant les CDN, la librairie devra être
empaquetée ; et Draco/Meshopt tournant en worker, `worker-src 'self' blob:`
deviendrait probablement nécessaire.

</details>

---

## ✦ Documentation

| Fichier | Contenu |
| :--- | :--- |
| **`WEBSITE-AUDIT.md`** | Audit technique complet — architecture, design, performance, a11y, SEO, sécurité, et brief de contexte pour assistants IA |
| **`docs-DEV-NOTES.md`** | Notes de développement détaillées (français) — décisions section par section |

---

<div align="center">

<br />

**Akoubri** — *on décide sur des images, pas sur des promesses.*

<sub>React 18 · Vite 5 · Tailwind 3 · React Router 6 — sans TypeScript, sans SSR, sans dépendance superflue.</sub>

<br />

</div>
