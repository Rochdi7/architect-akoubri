// Project catalogue. Image paths point at /public/media/<slug>/ and are
// referenced from the domain root. They must stay absolute: on a two-level
// route such as /projets/le-sentier a relative 'media/…' resolves to
// /projets/media/… and 404s.

const img = (folder, n, prefix) =>
  `/media/${folder}/${prefix}-${String(n).padStart(2, '0')}.jpg`;

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

export const projects = [
  {
    slug: 'le-sentier',
    name: 'Le Sentier',
    subtitle: 'Résidence',
    category: 'Résidentiel',
    year: '2025',
    location: 'Marrakech, Maroc',
    surface: '4 200 m²',
    status: 'Livré',
    mission: 'Architecture, façade, signalétique',
    excerpt:
      "Un immeuble résidentiel à socle commercial, pensé pour la lumière rasante de Marrakech. La façade alterne béton teinté terre et loggias profondes qui filtrent le soleil.",
    body: [
      "Le Sentier occupe une parcelle d'angle sur une avenue plantée de palmiers. Le programme superpose des commerces en rez-de-chaussée à trois niveaux de logements, un empilement classique que le projet cherche à rendre habitable plutôt que simplement efficace.",
      "La réponse tient dans la profondeur. Chaque étage recule derrière une loggia de deux mètres, si bien que la façade n'est jamais un plan mais une série de plans successifs. À midi, l'ombre portée protège les baies vitrées ; en fin de journée, la lumière rasante révèle la texture du béton teinté.",
      "L'entrée est traitée comme un seuil urbain : une marquise en métal sombre, un éclairage linéaire encastré, et une signalétique en laiton brossé qui capte le moindre reflet nocturne.",
    ],
    cover: img('le-sentier', 5, 'sentier'),
    gallery: range(1, 13).map((n) => img('le-sentier', n, 'sentier')),
  },
  {
    slug: 'adostigia',
    name: 'Adostigia',
    subtitle: 'Siège social',
    category: 'Tertiaire',
    year: '2025',
    location: 'Casablanca, Maroc',
    surface: '1 800 m²',
    status: 'En chantier',
    mission: "Architecture intérieure, mobilier, direction artistique",
    excerpt:
      "Le siège d'un groupe d'ingénierie : accueil en travertin, bureaux de direction en noyer, salles de réunion sourdes. Un tertiaire qui refuse la moquette grise.",
    body: [
      "Le brief tenait en une phrase : « des bureaux où l'on a envie de rester après 18 h ». Nous avons répondu par la matière plutôt que par le gadget.",
      "L'accueil pose le ton — un mur de travertin rainuré, rétroéclairé, sur lequel le logo en laiton semble flotter. Le comptoir est un monolithe de pierre claire ; rien ne dépasse, aucune arête n'est rapportée.",
      "En profondeur, les bureaux de direction basculent vers le noyer et le laiton sombre. Les salles de réunion sont traitées en absorption acoustique intégrale : plafond suspendu, textile mural, tapis épais. Le silence y est un matériau de projet.",
    ],
    cover: img('adostigia', 2, 'adostigia'),
    gallery: range(1, 22).map((n) => img('adostigia', n, 'adostigia')),
  },
  {
    slug: 'zahiya',
    name: 'Zahiya',
    subtitle: 'Résidence',
    category: 'Résidentiel',
    year: '2024',
    location: 'Marrakech, Maroc',
    surface: '3 100 m²',
    status: 'Livré',
    mission: 'Architecture, intérieurs, aménagement',
    excerpt:
      "Une résidence de standing en enduit minéral sombre, dont les intérieurs jouent au contraire la clarté : plâtre lisse, grès cérame et corniches lumineuses.",
    body: [
      "Zahiya est un exercice de contraste maîtrisé. À l'extérieur, un enduit minéral profond, presque graphite, qui absorbe la lumière et fait ressortir la végétation plantée en pied d'immeuble.",
      "À l'intérieur, tout s'inverse. Les appartements sont livrés en plâtre lisse écru, sol en grès cérame grand format, et menuiseries en noyer. Les corniches lumineuses périphériques remplacent l'éclairage central : la lumière vient des murs, jamais du plafond.",
      "Le hall d'entrée, signalé par une enseigne rétroéclairée sobre, sert de sas entre ces deux registres.",
    ],
    video: '/media/video/card-03.mp4',
    cover: img('zahiya', 12, 'zahiya'),
    gallery: range(1, 18).map((n) => img('zahiya', n, 'zahiya')),
  },
  {
    slug: 'villa-bambou',
    name: 'Villa Bambou',
    subtitle: 'Maison individuelle',
    category: 'Villa',
    year: '2024',
    location: 'Périphérie de Marrakech',
    surface: '420 m²',
    status: 'Livré',
    mission: 'Architecture, paysage, piscine',
    excerpt:
      "Une villa familiale à débords francs, orientée sur sa piscine. Les porte-à-faux en pierre claire et le sous-face en tasseaux de bois structurent l'ombre.",
    body: [
      "La villa est organisée autour d'un unique geste : deux volumes en porte-à-faux, décalés, qui projettent leur ombre sur la terrasse et la piscine.",
      "Le sous-face de ces débords est habillé de tasseaux de bois, ce qui adoucit la masse vue d'en bas et réchauffe la lumière réfléchie sur l'eau.",
      "Un rideau de bambous plantés en limite de parcelle assure l'intimité sans clôture opaque.",
    ],
    cover: '/media/villa/villa-01.jpg',
    gallery: ['/media/villa/villa-01.jpg'],
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);

export const services = [
  {
    n: '01',
    title: 'Architecture',
    text: "Conception d'immeubles résidentiels, villas et programmes tertiaires — de l'esquisse au permis de construire, puis au suivi de chantier.",
    points: ['Faisabilité & esquisse', 'Permis de construire', 'Dossier de consultation', 'Suivi de chantier'],
  },
  {
    n: '02',
    title: "Design d'intérieur",
    text: "Aménagement complet d'espaces de vie et de travail : plans, choix des matières, mobilier sur mesure et mise en lumière.",
    points: ['Plans d\'aménagement', 'Matériauthèque', 'Mobilier sur mesure', 'Éclairage'],
  },
  {
    n: '03',
    title: 'Images de synthèse',
    text: "Perspectives photoréalistes et films 3D pour arbitrer un projet, convaincre un investisseur ou lancer une commercialisation.",
    points: ['Perspectives extérieures', 'Vues intérieures', 'Films & animations', 'Visites virtuelles'],
  },
  {
    n: '04',
    title: 'Direction artistique',
    text: "Identité d'un lieu : signalétique, nom, matières et palette. Un projet se reconnaît autant à son enseigne qu'à sa façade.",
    points: ['Signalétique', 'Palette & matières', 'Nommage', 'Supports de vente'],
  },
];

export const stats = [
  { value: '12', label: "Années d'exercice" },
  { value: '48', label: 'Projets livrés' },
  { value: '96k', label: 'm² conçus' },
  { value: '4', label: 'Villes' },
];

export const process = [
  {
    n: '01',
    title: 'Écoute',
    text: "On commence par le site et par vos contraintes réelles — budget, délais, règlement d'urbanisme. Pas de projet hors-sol.",
  },
  {
    n: '02',
    title: 'Esquisse',
    text: "Deux à trois partis architecturaux, dessinés et rendus en 3D, pour arbitrer sur des images plutôt que sur des mots.",
  },
  {
    n: '03',
    title: 'Développement',
    text: "Le parti retenu devient un dossier complet : plans, coupes, façades, détails, matériaux et chiffrage.",
  },
  {
    n: '04',
    title: 'Chantier',
    text: "Suivi hebdomadaire, arbitrages en direct, réception. Un projet se juge sur ce qui sort de terre, pas sur les rendus.",
  },
];

/* Testimonials — the "wall of proof" grid. Each entry carries a `source`
   ("google" shows a G badge + 5 stars, "x" shows the X mark) so the wall
   mixes review platforms the way a real profile page would. Distributed
   round-robin into three columns that scroll at different speeds. */
export const testimonials = [
  {
    name: 'Youssef Benali',
    role: 'Promoteur, Résidence Le Sentier (Marrakech)',
    source: 'google',
    quote:
      "Calendrier et budget tenus, sans jamais rogner sur la façade. Les images de synthèse nous ont permis de commercialiser six mois avant la livraison.",
  },
  {
    name: 'Salma Amrani',
    role: 'Directrice générale, Adostigia (Casablanca)',
    source: 'x',
    quote:
      "Nous voulions des bureaux où l'on a envie de rester après 18 h. L'accueil en travertin impressionne tous nos visiteurs.",
  },
  {
    name: 'Karim Tazi',
    role: "Maître d'ouvrage, Zahiya (Marrakech)",
    source: 'google',
    quote:
      "Le contraste entre la façade sombre et les intérieurs clairs, c'était leur idée. Les acquéreurs le remarquent dès la visite.",
  },
  {
    name: 'Famille Idrissi',
    role: 'Villa Bambou (Marrakech)',
    source: 'google',
    quote:
      "Ils ont compris tout de suite comment nous voulions vivre la maison. Les porte-à-faux ombragent la piscine toute l'après-midi.",
  },
  {
    name: 'Nadia Berrada',
    role: 'Directrice, Groupe Berrada Immobilier',
    source: 'x',
    quote:
      "Trois programmes livrés ensemble. Le suivi de chantier hebdomadaire nous a évité deux reprises coûteuses.",
  },
  {
    name: 'Omar Chraibi',
    role: 'Gérant, Atelier Co (Marrakech)',
    source: 'google',
    quote:
      "Notre local commercial en rez-de-chaussée a doublé sa visibilité depuis la rue. La vitrine et l'éclairage changent tout.",
  },
  {
    name: 'Leïla Bennani',
    role: 'Architecte associée, cabinet partenaire',
    source: 'x',
    quote:
      "Des dossiers techniques propres, des détails cotés, rien à redessiner. C'est rare et ça se voit sur le chantier.",
  },
  {
    name: 'Rachid El Fassi',
    role: 'Investisseur, Casablanca',
    source: 'google',
    quote:
      "J'ai arbitré entre trois partis sur des rendus, pas sur des plans que je ne sais pas lire. La décision a été évidente.",
  },
  {
    name: 'Sofia Alaoui',
    role: 'Propriétaire, appartement Zahiya',
    source: 'google',
    quote:
      "Les corniches lumineuses au lieu du plafonnier, c'est le détail qui rend l'appartement chaleureux le soir.",
  },
];

/* Interior showcase slides for the angled-slab carousel. Each entry links
   back to its project so the centre panel is a real destination. */
export const showcase = [
  {
    src: '/media/zahiya/zahiya-01.jpg',
    title: 'Séjour, Zahiya',
    caption: 'Plâtre lisse écru, grès cérame grand format, menuiseries en noyer.',
    slug: 'zahiya',
  },
  {
    src: '/media/zahiya/zahiya-12.jpg',
    title: 'Entrée et dégagement, Zahiya',
    caption: 'Corniches lumineuses périphériques : la lumière vient des murs.',
    slug: 'zahiya',
  },
  {
    src: '/media/adostigia/adostigia-01.jpg',
    title: 'Accueil, Adostigia',
    caption: 'Travertin rainuré rétroéclairé et signalétique en laiton.',
    slug: 'adostigia',
  },
  {
    src: '/media/adostigia/adostigia-22.jpg',
    title: 'Salon d\'attente, Adostigia',
    caption: 'Panneaux de pierre claire, cimaises noires, assises en velours.',
    slug: 'adostigia',
  },
  {
    src: '/media/adostigia/adostigia-16.jpg',
    title: 'Bureau de direction, Adostigia',
    caption: 'Noyer, laiton sombre et éclairage sur rail.',
    slug: 'adostigia',
  },
  {
    src: '/media/villa/villa-01.jpg',
    title: 'Terrasse et piscine, Villa Bambou',
    caption: 'Porte-à-faux en pierre claire, sous-face en tasseaux de bois.',
    slug: 'villa-bambou',
  },
];

/* Studio timeline for the Agence page. */
export const journey = [
  {
    year: '2013',
    month: 'Mars',
    title: 'Les débuts',
    text: "Deux architectes, une table à dessin et un premier permis de construire à Marrakech. L'agence tient dans une pièce.",
  },
  {
    year: '2016',
    month: 'Septembre',
    title: 'La 3D entre au studio',
    text: "Nous internalisons les images de synthèse. Arbitrer sur des rendus fidèles plutôt que sur des plans change la conversation avec les clients.",
  },
  {
    year: '2019',
    month: 'Juin',
    title: "L'ouverture au tertiaire",
    text: "Premier siège social livré. Le vocabulaire du logement — travertin, noyer, lumière indirecte — se transpose au bureau.",
  },
  {
    year: '2022',
    month: 'Janvier',
    title: 'Bureau de Casablanca',
    text: "Une deuxième adresse pour suivre les chantiers du littoral sans multiplier les trajets.",
  },
  {
    year: '2025',
    month: 'Novembre',
    title: 'Le Sentier livré',
    text: "Quatre mille deux cents mètres carrés, commercialisés six mois avant la réception grâce aux images.",
  },
];

/* FAQ for the Agence page. */
export const agencyFaq = [
  {
    q: 'Quelle est la taille de votre équipe ?',
    a: "Sept personnes : trois architectes, deux designers d'intérieur, un infographiste 3D et une conductrice de travaux. La personne qui dessine votre projet est celle qui le suit en chantier.",
  },
  {
    q: 'Intervenez-vous sur des rénovations ?',
    a: "Oui, à condition que le programme le justifie. Nous refusons les rénovations purement cosmétiques : si le plan ne change pas, notre valeur ajoutée est faible et vous payez trop cher.",
  },
  {
    q: 'Travaillez-vous avec des entreprises imposées ?',
    a: "C'est possible. Nous préférons consulter trois entreprises sur un dossier chiffré, mais si vous avez déjà votre équipe, nous adaptons le dossier de consultation en conséquence.",
  },
  {
    q: 'Quel est le délai entre le premier contact et le permis ?',
    a: "Comptez trois à cinq mois selon la commune : deux à trois semaines pour l'esquisse, six à huit semaines pour le dossier, puis l'instruction administrative que nous ne maîtrisons pas.",
  },
  {
    q: 'Publiez-vous les projets sur lesquels vous travaillez ?',
    a: "Seulement avec l'accord écrit du maître d'ouvrage. Plusieurs projets livrés ne figurent pas sur ce site pour cette raison.",
  },
];
