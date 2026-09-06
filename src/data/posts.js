// Journal — editorial content for /journal and /journal/:slug.
//
// Kept apart from projects.js because a post is a different entity with a
// different shape, not a variation on a project. Same conventions apply:
// media paths are absolute from the domain root (a relative 'media/…' on the
// two-level route /journal/:slug would resolve to /journal/media/… and 404),
// and all copy is French with typographic apostrophes.
//
// `body` is an ordered block list rather than an array of strings, so a post
// can interleave prose, headings, pull quotes, lists and images without the
// renderer having to guess. Block kinds: 'p' | 'h2' | 'quote' | 'list' | 'image'.

export const categories = ['Architecture', "Design d'intérieur", 'Images de synthèse', 'Métier'];

export const posts = [
  {
    slug: 'lire-un-devis-architecte',
    title: "Lire un devis d'architecte sans se faire piéger",
    category: 'Métier',
    date: '2026-07-18',
    readingTime: 7,
    author: 'Akoubri',
    excerpt:
      "Honoraires au pourcentage, au forfait, à la vacation : trois façons de facturer la même mission. Ce qu'il faut vérifier avant de signer, ligne par ligne.",
    cover: '/media/adostigia/adostigia-01.jpg',
    body: [
      {
        kind: 'p',
        text: "Un devis d'architecte se lit mal parce qu'il décrit un travail intellectuel dont le volume n'est pas encore connu. Deux agences peuvent chiffrer la même villa à 6 % et à 11 % sans que l'une soit malhonnête : elles ne vendent simplement pas le même périmètre.",
      },
      { kind: 'h2', text: 'Le pourcentage ne veut rien dire seul' },
      {
        kind: 'p',
        text: "Un taux d'honoraires s'applique au montant des travaux. Tant que ce montant est une hypothèse, le taux est une hypothèse. Demandez systématiquement sur quelle enveloppe il porte, et si cette enveloppe inclut les lots techniques, la cuisine, les extérieurs et les honoraires des bureaux d'études.",
      },
      {
        kind: 'p',
        text: "Un taux bas sur une enveloppe optimiste coûte plus cher qu'un taux honnête sur une enveloppe réaliste. C'est la première asymétrie à corriger quand vous comparez deux propositions.",
      },
      { kind: 'h2', text: 'Les six lignes à vérifier' },
      {
        kind: 'list',
        items: [
          "Le périmètre exact : esquisse seule, permis, ou mission complète jusqu'à la réception.",
          "Le nombre d'allers-retours inclus avant que les modifications deviennent facturables.",
          "Qui paie les bureaux d'études structure, fluides et thermique.",
          "Le nombre de visites de chantier, et ce qui se passe si le chantier s'allonge.",
          "Les images de synthèse : combien, à quelle définition, et pour quel usage.",
          "Les conditions d'arrêt du projet, et le solde dû à chaque phase.",
        ],
      },
      {
        kind: 'image',
        src: '/media/adostigia/adostigia-08.jpg',
        alt: "Plans et échantillons de matières posés sur une table de réunion",
        caption: 'Une phase de conception se mesure en arbitrages, pas en heures.',
      },
      { kind: 'h2', text: 'La ligne que personne ne lit' },
      {
        kind: 'p',
        text: "C'est celle des modifications. Un projet évolue toujours — c'est normal et sain. Ce qui pose problème, c'est un devis qui reste muet sur le sujet : à la troisième version des plans, la discussion devient commerciale au lieu de rester architecturale.",
      },
      {
        kind: 'quote',
        text: "Un bon devis n'est pas le moins cher, c'est celui qui vous dit à l'avance ce qui coûtera plus cher.",
      },
      { kind: 'h2', text: 'Ce que nous faisons' },
      {
        kind: 'p',
        text: "Nous chiffrons au pourcentage pour une mission complète et au forfait pour une mission partielle. Le devis liste les phases, les livrables et le nombre d'itérations inclus. Il est fixé avant tout démarrage, et il ne bouge pas si le chantier prend du retard pour une raison qui ne nous incombe pas.",
      },
    ],
  },
  {
    slug: 'pourquoi-rendre-avant-de-construire',
    title: 'Pourquoi nous rendons tout en 3D avant de construire',
    category: 'Images de synthèse',
    date: '2026-06-02',
    readingTime: 6,
    author: 'Akoubri',
    excerpt:
      "Une image de synthèse n'est pas un argument de vente. C'est un outil d'arbitrage qui déplace les mauvaises surprises de la phase chantier vers la phase conception, là où elles ne coûtent presque rien.",
    cover: '/media/adostigia/adostigia-22.jpg',
    body: [
      {
        kind: 'p',
        text: "Un plan se lit. Une perspective se comprend. La différence paraît anodine jusqu'au jour où un maître d'ouvrage découvre, mur monté, que la hauteur sous plafond qu'il avait validée sur une coupe ne correspond pas à ce qu'il avait en tête.",
      },
      { kind: 'h2', text: "Corriger sur l'image coûte mille fois moins cher" },
      {
        kind: 'p',
        text: "Déplacer une baie vitrée dans un fichier prend une heure. La déplacer sur un chantier engage une reprise de linteau, un ajustement d'étanchéité, un nouveau vitrage et deux semaines de décalage. Le rendu ne rend pas le projet plus beau : il rend les erreurs négociables.",
      },
      {
        kind: 'image',
        src: '/media/zahiya/zahiya-12.jpg',
        alt: "Séjour rendu en images de synthèse, lumière de fin de journée",
        caption: 'Zahiya — étude de lumière rasante sur le séjour, avant validation des baies.',
      },
      { kind: 'h2', text: 'Ce qu’une image doit montrer honnêtement' },
      {
        kind: 'p',
        text: "Une perspective flatteuse qui ment sur la lumière est un piège commercial. Nous calons systématiquement l'éclairage sur la latitude réelle, l'orientation réelle et l'heure annoncée. Si un séjour est sombre en janvier à 17 h, l'image le montre.",
      },
      {
        kind: 'list',
        items: [
          "L'orientation et la course du soleil au lieu du projet.",
          'Les hauteurs réelles, sans objectif grand-angle qui étire la pièce.',
          'Le mobilier à ses dimensions réelles, pas à une échelle réduite.',
          'Les matières telles qu’elles seront commandées, pas une version idéalisée.',
        ],
      },
      {
        kind: 'quote',
        text: "Nous préférons perdre un arbitrage sur une image que le regretter sur un mur.",
      },
      { kind: 'h2', text: 'Et pour la commercialisation' },
      {
        kind: 'p',
        text: "Les mêmes fichiers servent ensuite au dossier investisseurs, aux supports de vente et aux visites virtuelles. C'est le seul cas où un travail de conception se rentabilise deux fois : une fois pour décider, une fois pour convaincre.",
      },
    ],
  },
  {
    slug: 'lumiere-rasante-marrakech',
    title: 'Concevoir pour la lumière rasante de Marrakech',
    category: 'Architecture',
    date: '2026-04-24',
    readingTime: 8,
    author: 'Akoubri',
    excerpt:
      "À cette latitude, le soleil n'est pas un agrément : c'est une contrainte structurante. Loggias profondes, brise-soleil et béton teinté — comment la façade du Sentier a été calée sur la course du soleil.",
    cover: '/media/le-sentier/sentier-05.jpg',
    body: [
      {
        kind: 'p',
        text: "Marrakech impose deux régimes de lumière opposés. À midi, en été, le soleil tombe presque à la verticale et brûle tout ce qui n'est pas protégé. En fin de journée, il rase et révèle la moindre texture. Une façade qui ignore l'un des deux régimes est ratée la moitié de la journée.",
      },
      { kind: 'h2', text: 'La profondeur plutôt que le verre teinté' },
      {
        kind: 'p',
        text: "La réponse la plus simple au surchauffage n'est pas un vitrage performant : c'est de l'ombre. Sur Le Sentier, chaque étage recule derrière une loggia de deux mètres. La façade n'est jamais un plan mais une série de plans successifs, et l'ombre portée fait le travail que le verre ferait mal et cher.",
      },
      {
        kind: 'image',
        src: '/media/le-sentier/sentier-09.jpg',
        alt: 'Loggias profondes en béton teinté sur la façade du Sentier',
        caption: "Deux mètres de retrait : l'ombre portée protège la baie sans obstruer la vue.",
      },
      { kind: 'h2', text: 'Le béton teinté, choisi pour la fin de journée' },
      {
        kind: 'p',
        text: "Un béton gris standard devient terne dès que la lumière faiblit. Le béton teinté terre, lui, se réchauffe à mesure que le soleil descend. C'est un choix fait pour 18 h, pas pour la photo de midi — et c'est précisément pourquoi l'immeuble tient visuellement toute la journée.",
      },
      {
        kind: 'quote',
        text: "On ne dessine pas une façade au Maroc, on dessine ses ombres.",
      },
      { kind: 'h2', text: 'Trois règles que nous appliquons systématiquement' },
      {
        kind: 'list',
        items: [
          "Protéger par la géométrie avant de protéger par le vitrage : c'est moins cher et cela ne vieillit pas.",
          "Traiter les ouvertures ouest avec plus de sévérité que les ouvertures sud : le soleil rasant entre plus loin.",
          "Vérifier chaque parti en rendu solaire aux quatre saisons avant de figer les plans.",
        ],
      },
      {
        kind: 'p',
        text: "Ces règles ne produisent pas un style. Elles produisent des bâtiments confortables en août, ce qui est une exigence plus difficile et plus utile.",
      },
    ],
  },
  {
    slug: 'materiautheque-choisir-ses-matieres',
    title: 'Constituer une matériauthèque qui tient dans le temps',
    category: "Design d'intérieur",
    date: '2026-03-11',
    readingTime: 6,
    author: 'Akoubri',
    excerpt:
      "Travertin, noyer, laiton brossé : trois matières qui vieillissent bien, et la méthode que nous suivons pour les arbitrer avec un maître d'ouvrage sans y passer six mois.",
    cover: '/media/adostigia/adostigia-16.jpg',
    body: [
      {
        kind: 'p',
        text: "Le choix des matières est le moment où un projet d'intérieur devient concret, et aussi celui où il s'enlise le plus souvent. La cause est toujours la même : on présente trop d'options, trop tôt, sans hiérarchie.",
      },
      { kind: 'h2', text: 'Trois familles, pas trente échantillons' },
      {
        kind: 'p',
        text: "Nous présentons systématiquement trois univers complets plutôt qu'un catalogue. Chacun est cohérent de bout en bout : sol, mur, plan de travail, quincaillerie, textile. Le maître d'ouvrage arbitre entre trois ambiances, pas entre deux cents références.",
      },
      {
        kind: 'image',
        src: '/media/adostigia/adostigia-11.jpg',
        alt: 'Mur de travertin rainuré rétroéclairé et comptoir en pierre claire',
        caption: 'Travertin rainuré et rétroéclairage : la matière fait le décor, rien n’est rapporté.',
      },
      { kind: 'h2', text: 'La question qui tranche : comment cela vieillit-il ?' },
      {
        kind: 'p',
        text: "Une matière se choisit sur son état à dix ans, pas à la livraison. Le laiton brossé se patine et gagne ; un chrome brillant se raye et perd. Le noyer massif se répare ; un placage fin ne se répare pas. Le travertin se recharge ; un composite se remplace.",
      },
      {
        kind: 'list',
        items: [
          'Se répare-t-elle localement, ou faut-il tout remplacer ?',
          "Se patine-t-elle dans le bon sens, ou se dégrade-t-elle ?",
          "Est-elle disponible au Maroc, ou faut-il l'importer à chaque reprise ?",
          'Supporte-t-elle un entretien ordinaire, sans produit spécifique ?',
        ],
      },
      {
        kind: 'quote',
        text: "Une matière chère qui se répare coûte moins cher qu'une matière économique qui se remplace.",
      },
      {
        kind: 'p',
        text: "Ce filtre élimine la moitié des candidats en une réunion. Ce qui reste est un jeu de matières que l'on peut défendre devant un client dix ans après la livraison.",
      },
    ],
  },
  {
    slug: 'permis-de-construire-maroc',
    title: 'Permis de construire au Maroc : le calendrier réel',
    category: 'Métier',
    date: '2026-01-29',
    readingTime: 9,
    author: 'Akoubri',
    excerpt:
      "Entre le dépôt du dossier et l'autorisation, il se passe rarement ce qui était prévu. Les étapes, les délais observés et les trois causes de retard que l'on peut éviter en amont.",
    cover: '/media/le-sentier/sentier-02.jpg',
    body: [
      {
        kind: 'p',
        text: "La question revient à chaque premier rendez-vous : « combien de temps pour le permis ? ». La réponse honnête est qu'un dossier bien préparé passe en quelques mois, et qu'un dossier mal préparé peut ne jamais passer. La différence se joue avant le dépôt.",
      },
      { kind: 'h2', text: 'Les étapes, dans l’ordre' },
      {
        kind: 'list',
        items: [
          'Vérification du titre foncier et du règlement d’urbanisme applicable à la parcelle.',
          'Note de renseignements urbanistiques : ce que la parcelle autorise réellement.',
          'Conception et mise au point du dossier avec les bureaux d’études.',
          'Dépôt en commission, puis passage devant les services concernés.',
          'Réponse, réserves éventuelles, reprise du dossier, autorisation.',
        ],
      },
      { kind: 'h2', text: 'Les trois causes de retard évitables' },
      {
        kind: 'p',
        text: "La première est un dossier incomplet déposé pour « gagner du temps ». Il n'en fait jamais gagner : il remet le projet en file d'attente. La deuxième est un écart entre le projet dessiné et ce que le règlement autorise — hauteur, emprise, recul, stationnement. La troisième est l'absence des bureaux d'études au moment du dépôt.",
      },
      {
        kind: 'image',
        src: '/media/le-sentier/sentier-11.jpg',
        alt: "Immeuble résidentiel en cours d'étude, vue d'angle",
        caption: "Le règlement d'urbanisme décide de la volumétrie avant l'architecte.",
      },
      {
        kind: 'quote',
        text: "Un mois passé à vérifier ce que la parcelle autorise en économise six en commission.",
      },
      { kind: 'h2', text: 'Ce que nous faisons en amont' },
      {
        kind: 'p',
        text: "Nous ne dessinons rien avant d'avoir lu le règlement applicable et vérifié l'emprise autorisée. C'est une phase peu spectaculaire, sans image à montrer, et c'est elle qui détermine si le calendrier annoncé sera tenu.",
      },
      {
        kind: 'p',
        text: "Les délais varient d'une commune à l'autre. Nous annonçons une fourchette observée sur nos propres dossiers dans la ville concernée, jamais une moyenne nationale qui ne veut rien dire.",
      },
    ],
  },
  {
    slug: 'silence-materiau-de-projet',
    title: 'Le silence est un matériau de projet',
    category: "Design d'intérieur",
    date: '2025-11-14',
    readingTime: 5,
    author: 'Akoubri',
    excerpt:
      "Dans un plateau de bureaux, l'acoustique décide du confort bien avant la couleur des murs. Ce que nous avons appris en traitant les salles de réunion du siège Adostigia en absorption intégrale.",
    cover: '/media/adostigia/adostigia-14.jpg',
    body: [
      {
        kind: 'p',
        text: "On juge un bureau sur ce qu'on y voit, on l'endure sur ce qu'on y entend. Un plateau bien dessiné mais réverbérant devient invivable en trois semaines, et personne ne sait nommer le problème : on dit simplement qu'on s'y sent fatigué.",
      },
      { kind: 'h2', text: "L'ennemi n'est pas le bruit, c'est la réverbération" },
      {
        kind: 'p',
        text: "Une conversation à deux mètres n'est pas gênante. Ce qui fatigue, c'est la même conversation renvoyée par un plafond dur, un sol dur et une baie vitrée. Le cerveau traite deux fois le même signal, décalé. Le remède n'est pas d'isoler davantage, c'est d'absorber.",
      },
      {
        kind: 'image',
        src: '/media/adostigia/adostigia-19.jpg',
        alt: 'Salle de réunion traitée en absorption acoustique, textile mural et tapis épais',
        caption: 'Plafond suspendu, textile mural, tapis épais : trois surfaces, une seule intention.',
      },
      {
        kind: 'list',
        items: [
          'Le plafond en premier : c’est la plus grande surface disponible et la plus efficace.',
          'Le textile mural ensuite, sur le mur opposé à la source principale.',
          'Le tapis en dernier : il traite les pas plus que les voix.',
        ],
      },
      {
        kind: 'quote',
        text: "Une salle de réunion réussie ne s'entend pas de l'extérieur, et ne se réverbère pas à l'intérieur.",
      },
      {
        kind: 'p',
        text: "Sur le siège Adostigia, les salles de réunion ont été traitées en absorption intégrale. Le budget consacré au plafond acoustique a été pris sur celui de la décoration murale — un arbitrage que le client a validé après une simple écoute comparative sur site.",
      },
    ],
  },
];

export const getPost = (slug) => posts.find((p) => p.slug === slug);

/* Posts newest first. The stored `date` is ISO so it sorts lexicographically,
   but comparing Date objects keeps the intent obvious to the next reader. */
export const sortedPosts = [...posts].sort(
  (a, b) => new Date(b.date) - new Date(a.date)
);

/* 'jeudi 18 juillet 2026' style is too long for cards; the reference uses a
   short numeric-free form. Intl handles the French month names. */
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
