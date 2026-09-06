> Notes de développement historiques, conservées telles quelles.
> Voir [README.md](README.md) pour la vue d'ensemble du projet.

# Akoubri — site vitrine d'architecture

Site React (Vite) pour un cabinet d'architecture et de design d'intérieur.
Construit pour tourner sur un **hébergement mutualisé Hostinger** : sortie
100 % statique, plus un unique script PHP pour le formulaire de contact.

---

## Démarrer

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # génère dist/
npm run preview    # prévisualise le build
```

---

## Déploiement sur Hostinger (mutualisé)

1. **Construire**

   ```bash
   npm run build
   ```

2. **Téléverser** — via hPanel → *Gestionnaire de fichiers*, ou en FTP.
   Copiez **le contenu de `dist/`** (et non le dossier lui-même) dans
   `public_html/` :

   ```
   public_html/
     index.html
     .htaccess          ← indispensable (routing SPA)
     assets/
     media/
     api/contact.php
     robots.txt
     sitemap.xml
   ```

   > Le gestionnaire de fichiers masque les fichiers commençant par un point.
   > Activez « Afficher les fichiers cachés » pour vérifier que `.htaccess`
   > est bien présent — sans lui, toute URL autre que `/` renvoie une 404.

3. **Configurer l'e-mail** — ouvrez `public_html/api/contact.php` et
   renseignez en haut du fichier :

   ```php
   $TO   = 'votre@adresse.com';
   $FROM = 'no-reply@votre-domaine.com';   // doit exister dans hPanel → E-mails
   ```

   Hostinger rejette les envois dont l'adresse `From` n'appartient pas au
   domaine. Créez la boîte `no-reply@` avant de tester.

4. **HTTPS** — activez le certificat SSL gratuit dans hPanel. La redirection
   HTTP → HTTPS est déjà écrite dans `.htaccess`.

5. **Sitemap** — remplacez `akoubri.com` par le domaine réel dans
   `public/sitemap.xml` et `public/robots.txt`, puis reconstruisez.

### Déploiement dans un sous-dossier

`vite.config.js` utilise `base: './'`, donc le site fonctionne aussi depuis
`public_html/site/`. Dans ce cas, ajustez `RewriteBase` dans `.htaccess` :

```apache
RewriteBase /site/
RewriteRule ^ site/index.html [L]
```

---

## Structure

```
public/
  media/
    le-sentier/   13 vues — façades, entrée, commerces
    adostigia/    22 vues — accueil, bureaux, salles de réunion
    zahiya/       18 vues — intérieurs livrés + façades
    villa/         1 vue  — villa avec piscine
    video/
      showreel.mp4     film source (82 s) — page projet Zahiya
      hero-loop.mp4    14 s, muet — fond du hero
      hero-poster.jpg  affiche du hero (aucune image blanche au chargement)
      card-03.mp4      8 s, muet — carte projet Zahiya
  api/contact.php  handler du formulaire (PHP mail)
  .htaccess        routing SPA, cache, en-têtes de sécurité
src/
  data/projects.js   catalogue projets, services, process, chiffres
  hooks/useReveal.js observer de révélation au scroll
  components/        Header, Footer, ProjectCard, Showcase, Testimonials
  pages/             Home, Projects, ProjectDetail, Agency, Services,
                     Contact, NotFound
  index.css          tokens de design + primitives
```

### Ajouter un projet

Tout passe par `src/data/projects.js` :

1. Déposez les images dans `public/media/<slug>/`.
2. Ajoutez une entrée au tableau `projects`.
3. La page détail, la grille, le footer et la navigation « projet suivant »
   se mettent à jour automatiquement.

Ajoutez aussi l'URL dans `public/sitemap.xml`.

---

## Système de design

Palette tirée des rendus eux-mêmes — travertin, plâtre chaud, noyer, et le
laiton de la signalétique Akoubri. Tous les jetons sont dans `:root`
(`src/index.css`) :

| Jeton | Valeur | Usage |
|---|---|---|
| `--paper` | `#faf8f5` | fond principal (papier chaud, pas blanc pur) |
| `--sand` | `#f2ede6` | sections alternées |
| `--ink` | `#1c1917` | texte, boutons pleins |
| `--clay` | `#b06b3a` | accent, liens, filets |
| `--font-display` | Fraunces | titres |
| `--font-body` | Inter | textes |

**Animations** — reprises de CodeSommet et retimbrées :

| Classe | Effet |
|---|---|
| `.reveal` / `.mask-reveal` | fondu + montée, volet vertical (via `data-reveal`) |
| `.nav-sweep` | balayage dégradé de 4 s sur la pilule d'en-tête |
| `.media-card` | carte projet blanche qui se soulève au survol |
| `.slab` | panneaux biseautés du carrousel d'intérieurs |
| `.panel-dark` / `.on-dark*` | cartes et textes posés sur la bande sombre |
| `.faq-pill` | accordéon qui se soulève à l'ouverture |
| `.footer-card` / `.footer-wordmark` | carte sombre du pied de page et nom géant rogné |
| `.wall-col` | colonnes de témoignages qui défilent verticalement |
| `.rail` | marquee infini du bandeau métiers |

Toutes sont neutralisées sous `prefers-reduced-motion`, et les effets de
survol sont désactivés sous `@media (hover: none)` pour ne pas laisser une
carte bloquée en position haute après un appui.

### La page Agence

Reprend une série de gabarits fournis par le client, transposés dans la
palette du site (aucune couleur du modèle n'a été conservée) :

- **Hero scindé** — panneau sombre arrondi portant le texte, rendu plein
  cadre à côté ; empilé panneau-sur-image sous `lg`.
- **Bandeau de chiffres** — filets verticaux entre les colonnes, réduits à
  une grille 2×2 sur mobile.
- **Paire d'images décalée** avec fiche projet flottante.
- **Frise verticale** — titre collant à gauche, règle et pastilles à droite.
- **Bande sombre « Nos convictions »** — six cartes à icône ronde.
- **FAQ scindée** — titre et bouton à gauche, accordéons à droite.

> **Piège Tailwind :** un modificateur d'opacité ne s'applique pas à une
> couleur `var()`. `text-[var(--paper)]/75` ne produit **aucune règle** et le
> texte disparaît sur fond sombre. Utilisez les classes `.on-dark`,
> `.on-dark-soft`, `.on-dark-muted` et `.panel-dark` (rgba explicites).

### Le pied de page

Carte sombre arrondie, détachée des bords de la page, contenant le logo, la
présentation, les réseaux sociaux et trois colonnes de liens. Le nom de
l'agence est posé en très grand le long du bas et **rogné par la carte** :
c'est un bandeau imprimé, pas un titre — d'où le `aria-hidden` et l'absence
de retour à la ligne.

Sa taille est exprimée en `cqw` (container query units) et non en `vw`, pour
qu'il garde le même rapport à la carte quelle que soit la largeur de
l'écran ; une règle `@supports not` retombe sur `vw` là où les container
queries ne sont pas gérées.

### Le carrousel d'intérieurs

Trois panneaux : celui du centre est un rectangle, les deux latéraux sont
découpés en trapèzes **en miroir** qui penchent vers lui (`clip-path:
polygon(...)`). Le biseau n'est pas un ornement — les dalles se lisent comme
une coupe dans un plan, ce qui justifie la forme sur un site d'architecture.

Seule la dalle centrale est interactive ; les deux latérales sont des
aperçus des images voisines et portent `aria-hidden`, pour qu'un lecteur
d'écran n'annonce qu'une image à la fois. Navigation aux flèches ← →
lorsque le carrousel a le focus, au balayage sur mobile, et par les pastilles.
Les images voisines sont préchargées à chaque changement.

Sur mobile les trois dalles restent visibles, mais les latérales se
réduisent à des bandes de 52–72 px et **perdent leur biseau** : à cette
largeur un trapèze se lit comme un défaut de rendu, pas comme une coupe.
Le titre passe au centre, les flèches disparaissent (le balayage et les
pastilles suffisent) et la légende quitte l'image — trop petite pour la
porter — pour se placer sous le carrousel.

### Le mur de témoignages

Trois colonnes de cartes qui défilent verticalement dans une fenêtre de
hauteur fixe (`30rem`, `34rem` à partir de md). Un `mask-image` estompe le
haut et le bas : les cartes s'effacent au lieu d'être coupées net.

Le défilement est purement CSS — chaque colonne contient ses cartes **en
double** et anime `translateY` de 0 à `-50 %`, ce qui boucle sans raccord.
La colonne du milieu tourne en `animation-direction: reverse` pour que les
colonnes voisines ne défilent pas au même rythme. Le survol met en pause.

Les colonnes 2 et 3 sont masquées sous `md` / `lg` : un téléphone n'affiche
qu'une seule colonne, en pleine largeur (la carte de `20rem` déborderait
sinon un écran de 360 px).

Chaque témoignage porte un champ `source` : `google` affiche la pastille G
et cinq étoiles, `x` affiche la marque X sans notation.

### Le hero

Vidéo plein cadre (`hero-loop.mp4` — muette, en boucle, `object-cover`) sur
toute la hauteur du viewport (`100svh`). Le texte est posé dessus en blanc,
tenu lisible par un dégradé sombre lesté vers le bas : le rendu reste net en
haut de l'image, le contraste ne se joue que sous le texte. Un dernier
dégradé raccorde le bas du hero au fond papier de la section suivante.

Les deux boutons du site perdant leur contraste sur fond vidéo, le hero
utilise leurs variantes claires : `.btn-light` (fond papier) et
`.btn-on-dark` (contour translucide, `backdrop-blur`).

Une affiche (`hero-poster.jpg`) est affichée tant que la vidéo n'est pas
prête, et le reste si la lecture automatique est refusée (mode économie de
données, batterie faible) — la section n'est jamais vide.

> Le film source est une visite de **Zahiya** et porte un filigrane
> « ZAHIYA RESIDENCE » incrusté. Les extraits qui en sont tirés ne doivent
> donc illustrer que Zahiya — sur une autre fiche projet, le filigrane
> désignerait le mauvais bâtiment.

---

## Performance

- Build : ~77 kB gzip (vendor + app + CSS).
- Vendor React isolé dans son propre chunk (cache longue durée).
- Images `loading="lazy"` hors du premier écran, `fetchPriority="high"` sur les
  visuels LCP.
- Le showreel complet (9,5 Mo) est en `preload="none"` avec affiche : il ne
  se télécharge qu'au clic.
- Le fond du hero est un extrait recompressé de 1,3 Mo, pas le film source.
- Les vidéos de carte ne démarrent qu'une fois visibles (IntersectionObserver)
  et respectent `navigator.connection.saveData`.

### Optimisation d'images recommandée

Les JPEG livrés font 60–240 Ko chacun. Pour aller plus loin, convertissez-les
en WebP avant de construire :

```bash
# nécessite cwebp (libwebp)
for f in public/media/*/*.jpg; do cwebp -q 82 "$f" -o "${f%.jpg}.webp"; done
```

Puis remplacez les `<img>` par des `<picture>` avec source WebP.

---

## Accessibilité

- Navigation clavier complète, `:focus-visible` visible partout.
- Lightbox : `role="dialog"`, `aria-modal`, flèches ← → et `Échap`.
- Menu mobile : `aria-expanded`, verrouillage du défilement.
- Filtres projets : `aria-pressed`.
- Toutes les images portent un `alt` descriptif (ou `aria-hidden` si décoratives).
