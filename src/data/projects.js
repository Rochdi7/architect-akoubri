/* Project catalogue.
 *
 * Every image path points at /public/media/projets/ and must stay absolute:
 * on a two-level route such as /projets/le-sentier a relative 'media/…'
 * resolves to /projets/media/… and 404s.
 *
 * ── Rules this file follows ───────────────────────────────────────────────
 * 1. Descriptions state only what the renders actually show. Where a caption
 *    is burned into the source image or video ("Façade principale", "RDC,
 *    Salle de réunion", "Apt 36 — 54,42 m²"), it is used verbatim.
 * 2. Factual metadata that could not be verified is `null` and renders as
 *    « À confirmer » rather than being invented. Location is the exception:
 *    the owner confirmed on 2026-09-15 that every project is in Marrakech.
 * 3. Alt text describes the visible frame and is unique per image. No
 *    keyword stuffing; nothing is claimed that cannot be seen.
 *
 * See MEDIA-INVENTORY.md for the full audit behind these choices.
 */

const M = '/media/projets';

/* Helper: an image entry is { src, alt, caption? }. `caption` is only set
   where the detail page shows one, so a missing caption is not a gap. */
const img = (src, alt, caption) => ({ src: `${M}/${src}`, alt, caption });

export const projects = [
  /* ── 1. Adostigia ─────────────────────────────────────────────────────
     Evidence: the ADOSTIGIA wordmark appears in relief on the backlit
     dark-marble reception panel in several renders, and as the title card
     of the walkthrough video. Program read from the rooms themselves.   */
  {
    slug: 'adostigia',
    name: 'Adostigia',
    subtitle: 'Aménagement de bureaux',
    category: 'Tertiaire',
    year: null,
    location: 'Marrakech, Maroc',
    surface: null,
    status: null,
    mission: "Architecture intérieure et images de synthèse",
    excerpt:
      "Des bureaux organisés autour d'un accueil signé : un panneau de marbre sombre rétroéclairé porte la marque, entouré de pierre claire cannelée. En profondeur, les bureaux de direction et les salles de réunion passent au bois foncé.",
    body: [
      "Le projet se lit en deux registres. À l'accueil, tout est clair : panneaux de pierre à fines cannelures verticales, sol en grand format, éclairage en corniche et sur rail noir. Le seul contraste est le panneau de marbre veiné sombre qui porte l'enseigne, détaché du mur par une ligne de lumière.",
      "Les espaces de travail inversent la palette. Les bureaux de direction sont doublés de bois foncé du sol au plafond, avec des niches d'étagères éclairées et un plan de travail noir mat. Les salles de réunion reprennent ce bois, une table en marbre sombre et un plafond en caisson.",
      "Entre les deux, une circulation étroite entièrement lambrissée, éclairée par une ligne de corniche et une cloison vitrée à bandes sablées qui laisse filtrer la lumière des salles sans donner la vue.",
    ],
    video: `${M}/akoubri_adostigia-walkthrough.mp4`,
    videoPoster: `${M}/akoubri_adostigia-poster.webp`,
    videoCaption: "Parcours intérieur — circulation, salles de réunion et sanitaires",
    cover: `${M}/akoubri_adostigia-reception-01.webp`,
    coverAlt:
      "Accueil Adostigia : enseigne en relief sur panneau de marbre sombre rétroéclairé, murs de pierre claire cannelée et fauteuils ronds",
    hover: `${M}/akoubri_adostigia-reception-desk-02.webp`,
    gallery: [
      img('akoubri_adostigia-reception-01.webp',
        "Accueil Adostigia : enseigne en relief sur panneau de marbre sombre rétroéclairé, murs de pierre claire cannelée et fauteuils ronds",
        "Accueil — l'enseigne détachée du mur par une ligne de lumière"),
      img('akoubri_adostigia-reception-desk-02.webp',
        "Banque d'accueil monolithique en pierre claire devant le panneau de marbre, sous une suspension à pendeloques de cuivre",
        "Banque d'accueil et suspension en cuivre"),
      img('akoubri_adostigia-reception-lounge-03.webp',
        "Vue d'ensemble de l'accueil avec banque en pierre, banquette courbe et grande fenêtre voilée",
        "L'accueil dans son ensemble"),
      img('akoubri_adostigia-director-office-16.webp',
        "Bureau de direction lambrissé de bois foncé, niches d'étagères éclairées et plan de travail noir",
        "Bureau de direction — bois foncé et niches éclairées"),
      img('akoubri_adostigia-meeting-room-09.webp',
        "Salle de réunion avec table en marbre sombre, fauteuils cuir et écran de projection",
        "Salle de réunion"),
      img('akoubri_adostigia-corridor-04.webp',
        "Circulation étroite entièrement lambrissée de bois foncé, éclairée par une corniche lumineuse, avec une plante en pot au fond"),
      img('akoubri_adostigia-meeting-room-glass-05.webp',
        "Cloison vitrée à bandes sablées séparant la circulation d'une salle de réunion éclairée"),
      img('akoubri_adostigia-reception-seating-06.webp',
        "Coin d'attente de l'accueil : deux fauteuils ronds, guéridons bas et grande toile abstraite"),
      img('akoubri_adostigia-director-office-07.webp',
        "Bureau de direction vu depuis l'entrée, fauteuil de direction en cuir noir et écran de projection au fond"),
      img('akoubri_adostigia-director-office-08.webp',
        "Bureau de direction avec bibliothèque éclairée, panneau de marbre veiné et assises basses en cuir clair"),
      img('akoubri_adostigia-meeting-room-12.webp',
        "Salle de réunion vue en plongée, table en marbre sombre et huit fauteuils"),
      img('akoubri_adostigia-meeting-room-13.webp',
        "Salle de réunion avec suspension à globes, écran de projection et cloison vitrée à bandes"),
      img('akoubri_adostigia-director-office-11.webp',
        "Bureau de direction : plan de travail noir, fauteuils clairs et grande fenêtre voilée"),
      img('akoubri_adostigia-director-office-desk-14.webp',
        "Plan de travail noir vu en plongée, avec écran, lampe articulée et caisson en bois"),
      img('akoubri_adostigia-waiting-lounge-15.webp',
        "Salon d'attente : canapé courbe en tissu clair, table basse ovale et paroi de pierre cannelée"),
      img('akoubri_adostigia-meeting-room-17.webp',
        "Salle de réunion sous une suspension à globes, table en marbre et bibliothèque éclairée au fond"),
      img('akoubri_adostigia-ceiling-detail-18.webp',
        "Détail de plafond : rail d'éclairage noir encastré dans un faux plafond clair"),
      img('akoubri_adostigia-director-office-19.webp',
        "Bureau de direction en plongée, plan noir, bibliothèque éclairée et fauteuils clairs"),
      img('akoubri_adostigia-reception-lounge-20.webp',
        "Accueil vu depuis le salon d'attente, enseigne rétroéclairée et banquette courbe"),
      img('akoubri_adostigia-meeting-room-21.webp',
        "Salle de réunion ouverte sur un bureau de direction, double table en marbre"),
      img('akoubri_adostigia-waiting-lounge-22.webp',
        "Salon d'attente : canapé courbe clair, diptyque abstrait et paroi de pierre claire cannelée"),
      img('akoubri_adostigia-lighting-detail-10.webp',
        "Détail : suspension circulaire à globes de verre sur un panneau de bois foncé encadré de lumière"),
    ],
  },

  /* ── 2. Farraj — Conserverie Faraj ────────────────────────────────────
     Not a villa. The program is read from the captions burned into the
     narrated tour: plan de masse, hall d'entrée, bureaux, salle de
     réunion, hangar de réception des olives, pont bascule, atelier de
     maintenance, zone de traitement. The FARAJ olive-tree mark appears on
     the signage throughout. No photographs exist for this project — every
     still below is a frame extracted from that video.                   */
  {
    slug: 'farraj',
    name: 'Farraj',
    subtitle: 'Conserverie — unité industrielle',
    category: 'Industriel',
    year: null,
    location: 'Marrakech, Maroc',
    surface: null,
    status: null,
    mission: 'Architecture, plan de masse, film 3D',
    excerpt:
      "Une unité de conserverie d'olives : bâtiment administratif, hangar de réception, atelier de maintenance et zone de traitement, organisés sur un plan de masse en L autour d'une vaste aire de manœuvre.",
    body: [
      "Le programme est industriel avant d'être représentatif. Le plan de masse répartit les fonctions sur une parcelle rectangulaire : l'administration en pignon sur l'entrée, le hangar de réception des olives en longueur, l'atelier de maintenance et la zone de traitement à l'arrière, un champ de panneaux solaires en limite.",
      "Le bâtiment administratif est traité sobrement : hall d'entrée blanc avec l'enseigne en relief, bureaux et salle de réunion en rez-de-chaussée, bureau du directeur et secrétariat à l'étage. Les menuiseries sombres et les stores à lamelles cadrent la plaine environnante.",
      "Les volumes de production assument leur fonction — bardage métallique nervuré pour le hangar, enduit terre pour l'atelier — et c'est la signalétique de marque, reprise à chaque seuil, qui donne son unité à l'ensemble.",
    ],
    video: `${M}/akoubri_farraj-conserverie-tour.mp4`,
    videoPoster: `${M}/akoubri_farraj-poster.webp`,
    videoCaption: "Visite commentée de l'unité — du plan de masse aux zones de production",
    cover: `${M}/akoubri_farraj-vue-aerienne-10.webp`,
    coverAlt:
      "Vue aérienne de la conserverie Farraj : bâtiments disposés en L autour d'une aire de manœuvre, champ de panneaux solaires en limite de parcelle",
    hover: `${M}/akoubri_farraj-hall-entree-02.webp`,
    gallery: [
      img('akoubri_farraj-vue-aerienne-10.webp',
        "Vue aérienne de la conserverie Farraj : bâtiments disposés en L autour d'une aire de manœuvre, champ de panneaux solaires en limite de parcelle",
        "Vue aérienne de l'unité"),
      img('akoubri_farraj-plan-de-masse-01.webp',
        "Plan de masse en vue aérienne : hangar en longueur, bâtiment administratif, aire de manœuvre et panneaux solaires",
        "Plan de masse"),
      img('akoubri_farraj-hall-entree-02.webp',
        "Hall d'entrée de l'administration : enseigne FARAJ en relief sur mur blanc, assises d'attente et escalier",
        "Hall d'entrée — administration"),
      img('akoubri_farraj-hangar-reception-olives-06.webp',
        "Hangar de réception des olives : bardage métallique nervuré, portes sectionnelles ouvertes sur les caisses de récolte, palmiers en avant-plan",
        "Hangar 1 — réception des olives"),
      img('akoubri_farraj-salle-reunion-04.webp',
        "Salle de réunion de la conserverie : table en bois, dix fauteuils et logo Farraj encadré au mur",
        "Salle de réunion"),
      img('akoubri_farraj-bureau-directeur-05.webp',
        "Bureau du directeur à l'étage : lambris de bois, canapé clair et fenêtres en bandeau ouvertes sur la plaine",
        "Bureau du directeur"),
      img('akoubri_farraj-bureau-03.webp',
        "Bureau administratif en rez-de-chaussée, poste de travail et fenêtres à stores donnant sur les palmiers"),
      img('akoubri_farraj-pont-bascule-07.webp',
        "Pont bascule : camion semi-remorque sur la plateforme de pesage, signalétique Farraj et bordures de sécurité jaunes",
        "Pont bascule"),
      img('akoubri_farraj-atelier-maintenance-08.webp',
        "Atelier de maintenance en enduit terre, porte sectionnelle noire ouverte sur les engins",
        "Atelier de maintenance"),
      img('akoubri_farraj-zone-traitement-09.webp',
        "Zone de traitement à la soude et citernes de réserve d'eau industrielle, avec cuves métalliques et panneaux de signalisation",
        "Zone de traitement et réserve d'eau"),
    ],
  },

  /* ── 3. Le Sentier ───────────────────────────────────────
     Every source render was opened and classified before naming. The set
     splits in two: apartment interiors (living rooms, kitchens, bedrooms,
     bathrooms) and the rooftop amenity level (pool, bar, firepit). There
     is no façade render in the batch. Several rooftop frames show the
     snow-capped Atlas on the horizon. Two CAD plans are labelled
     « Apt 36 — 54,42 m² » and apartments 47/48.                       */
  {
    slug: 'le-sentier',
    name: 'Le Sentier',
    subtitle: 'Résidence — appartements et toiture-terrasse',
    category: 'Résidentiel',
    year: null,
    location: 'Marrakech, Maroc',
    surface: null,
    status: null,
    mission: 'Architecture intérieure, toiture-terrasse, plans',
    excerpt:
      "Des appartements livrés dans une gamme claire — grès cérame grand format, corniches lumineuses et menuiseries en bois — couronnés par une toiture-terrasse à piscine à débordement face à l'Atlas.",
    body: [
      "Les appartements suivent une seule règle d'éclairage : la lumière vient des murs et des plafonds, jamais d'un point central. Corniches lumineuses périphériques, rails noirs encastrés et appliques sphériques en laiton dessinent les volumes sans les écraser.",
      "La distribution est compacte. Un couloir lambrissé de bois clair dessert les chambres ; il s'élargit en entrée, où un panneau de pierre claire rétroéclairé et une niche TV suspendue tiennent lieu de seuil entre le dégagement et le séjour.",
      "Les cuisines sont ouvertes ou en cuisine-couloir selon la typologie : façades sable mat, plan de travail noir, crédence en marbre veiné éclairée par-dessous, et une table haute en marbre sombre qui sert d'îlot et de coin repas. Les salles d'eau reprennent le travertin clair, en vasque monolithe et miroir rétroéclairé.",
      "Le toit est le geste collectif du projet. Une piscine à débordement à revêtement de pierre verte, bordée d'une terrasse en bois, occupe la plus grande longueur ; un bar en marbre sombre sous pergola, des banquettes autour d'un brasero et des voiles d'ombrage complètent le niveau. Au fond, par-dessus la palmeraie, l'Atlas enneigé ferme la vue.",
    ],
    cover: `${M}/akoubri_le-sentier-toiture-piscine-atlas-01.webp`,
    coverAlt:
      "Toiture-terrasse du Sentier : piscine à débordement bordée d'une terrasse en bois et de bains de soleil, palmiers et chaîne de l'Atlas enneigée à l'horizon",
    hover: `${M}/akoubri_le-sentier-sejour-01.webp`,
    gallery: [
      img('akoubri_le-sentier-toiture-piscine-atlas-01.webp',
        "Toiture-terrasse du Sentier : piscine à débordement bordée d'une terrasse en bois et de bains de soleil, palmiers et chaîne de l'Atlas enneigée à l'horizon",
        "Toiture-terrasse — la piscine face à l'Atlas"),
      img('akoubri_le-sentier-sejour-01.webp',
        "Séjour d'appartement : banquette d'angle claire, tables basses rondes, appliques sphériques en laiton et grande baie voilée",
        "Séjour type"),
      img('akoubri_le-sentier-toiture-piscine-crepuscule-03.webp',
        "Piscine de la toiture-terrasse au crépuscule, éclairage immergé, parasols repliés et palmiers se détachant sur un ciel bleu nuit",
        "La piscine au crépuscule"),
      img('akoubri_le-sentier-cuisine-comptoir-09.webp',
        "Cuisine ouverte à façades sable, crédence en marbre veiné rétroéclairée et table haute en marbre sombre",
        "Cuisine — crédence en marbre veiné"),
      img('akoubri_le-sentier-toiture-brasero-07.webp',
        "Salon de plein air sur le toit : banquettes basses autour d'un brasero circulaire allumé, sous des voiles d'ombrage tendues",
        "Salon de plein air et brasero"),
      img('akoubri_le-sentier-chambre-18.webp',
        "Chambre en tons sable : tête de lit capitonnée, suspensions sphériques en laiton et dressing vitré éclairé",
        "Chambre type"),
      img('akoubri_le-sentier-toiture-bar-pergola-06.webp',
        "Bar de toiture en marbre sombre sous une pergola en bois à lames, tabourets hauts éclairés et bassin à lame d'eau en arrière-plan",
        "Le bar sous pergola"),
      img('akoubri_le-sentier-sejour-terrasse-03.webp',
        "Séjour ouvert sur une loggia plantée, mur TV en pierre claire rétroéclairée et enfilade vers le couloir",
        "Séjour et loggia"),
      img('akoubri_le-sentier-toiture-piscine-debordement-04.webp',
        "Lame d'eau du débordement de la piscine sur un parement de marbre sombre, éclairage immergé et haie basse éclairée",
        "Le débordement en marbre sombre"),
      img('akoubri_le-sentier-salle-eau-22.webp',
        "Salle d'eau en travertin clair : vasque monolithe en pierre, miroir rétroéclairé à angles arrondis et douche à l'italienne vitrée",
        "Salle d'eau — travertin et robinetterie noire"),
      img('akoubri_le-sentier-entree-cuisine-06.webp',
        "Entrée d'appartement lambrissée de bois clair, niche TV suspendue et cuisine ouverte en second plan",
        "Entrée — le seuil entre dégagement et séjour"),
      img('akoubri_le-sentier-toiture-piscine-jour-02.webp',
        "Piscine de toiture en plein jour, bains de soleil alignés sur la terrasse en bois et sommets enneigés de l'Atlas au loin",
        "La piscine au soleil"),
      img('akoubri_le-sentier-sejour-02.webp',
        "Séjour d'appartement vu depuis l'entrée, banquette d'angle et tapis gris sur sol en grès cérame clair"),
      img('akoubri_le-sentier-sejour-couloir-04.webp',
        "Séjour et couloir en enfilade, mur TV en pierre claire rétroéclairée et plantes en pot"),
      img('akoubri_le-sentier-couloir-05.webp',
        "Couloir de distribution lambrissé de bois clair, corniche lumineuse continue et cadre au fond"),
      img('akoubri_le-sentier-cuisine-07.webp',
        "Cuisine à façades sable et bois, plan de travail noir et crédence en marbre veiné"),
      img('akoubri_le-sentier-cuisine-08.webp',
        "Cuisine vue de face : colonnes de fours encastrés et hotte intégrée sous un bandeau de bois cannelé"),
      img('akoubri_le-sentier-cuisine-couloir-10.webp',
        "Cuisine-couloir avec table haute en marbre sombre et sortie sur la loggia plantée"),
      img('akoubri_le-sentier-chambre-11.webp',
        "Chambre avec tête de lit capitonnée, banc de pied de lit et salle d'eau attenante visible par l'enfilade"),
      img('akoubri_le-sentier-chambre-12.webp',
        "Chambre claire ouverte sur une salle d'eau vitrée, suspensions fines et rideaux toute hauteur"),
      img('akoubri_le-sentier-chambre-degagement-13.webp',
        "Chambre et son dégagement : toile encadrée, plante en pot et parquet foncé"),
      img('akoubri_le-sentier-chambre-14.webp',
        "Chambre en tons sable avec suspensions en laiton de part et d'autre du lit"),
      img('akoubri_le-sentier-chambre-dressing-15.webp',
        "Chambre avec dressing ouvert derrière une claustra en bois foncé et grande toile abstraite"),
      img('akoubri_le-sentier-chambre-salle-eau-16.webp',
        "Chambre et salle d'eau attenante, vasque en bois clair et miroir rétroéclairé"),
      img('akoubri_le-sentier-salle-eau-17.webp',
        "Salle d'eau en travertin, vasque monolithe et douche vitrée éclairée par une imposte"),
      img('akoubri_le-sentier-chambre-dressing-19.webp',
        "Chambre avec dressing vitré éclairé, banc de pied de lit et parquet foncé"),
      img('akoubri_le-sentier-chambre-tv-20.webp',
        "Chambre avec meuble TV suspendu en bois et dressing vitré en enfilade"),
      img('akoubri_le-sentier-sejour-salle-eau-21.webp',
        "Séjour et salle d'eau invités en enfilade, vasque en travertin et miroir rétroéclairé"),
      img('akoubri_le-sentier-salle-eau-23.webp',
        "Salle d'eau compacte : vasque en travertin, miroir rétroéclairé et robinetterie noire"),
      img('akoubri_le-sentier-salle-eau-detail-24.webp',
        "Détail de la vasque monolithe en travertin et de sa tablette en bois"),
      img('akoubri_le-sentier-toiture-piscine-nuit-05.webp',
        "Piscine de toiture éclairée à la nuit tombée, haie éclairée et brasero allumé au fond"),
      img('akoubri_le-sentier-toiture-bar-piscine-08.webp',
        "Bar sous pergola et lame d'eau de la piscine en plein jour, assises en rotin sous parasols"),
      img('akoubri_le-sentier-toiture-salon-09.webp',
        "Salon de toiture en rotin le long de la piscine, parasols repliés et local technique en enduit terre"),
      img('akoubri_le-sentier-toiture-terrasse-aerien-01.webp',
        "Vue aérienne de la toiture-terrasse : piscine, pergola, voiles d'ombrage et terrasses privatives plantées aux étages inférieurs",
        "Vue aérienne du niveau terrasse"),
      img('akoubri_le-sentier-plan-appartement-36.webp',
        "Plan coté de l'appartement 36, 54,42 m² : chambre, salon, kitchenette, salle de bains et terrasse filante",
        "Appartement 36 — 54,42 m²"),
      img('akoubri_le-sentier-plan-appartement-47-48.webp',
        "Plan coté des appartements 47 et 48 avec leur distribution",
        "Appartements 47 et 48"),
    ],
  },
  /* ── 4. Zahiya — Zahiya Residence ─────────────────────────────────────
     Evidence: "ZAHIYA RESIDENCE" illuminated signage over the entrance,
     and the same watermark burned into both video loops. Those two clips
     were previously mis-filed as generic site chrome (video/hero-loop.mp4
     and video/card-03.mp4); they belong here.                           */
  {
    slug: 'zahiya',
    name: 'Zahiya',
    subtitle: 'Résidence à socle commercial',
    category: 'Résidentiel',
    year: null,
    location: 'Marrakech, Maroc',
    surface: null,
    status: null,
    mission: 'Architecture, intérieurs, signalétique',
    excerpt:
      "Une résidence en enduit minéral sombre posée sur un socle de commerces. À l'intérieur, la palette s'inverse : plâtre écru, corniches lumineuses et menuiseries en noyer.",
    body: [
      "L'immeuble joue sur un seul contraste, tenu jusqu'au bout. À l'extérieur, un enduit minéral profond, presque graphite, qui absorbe la lumière et fait ressortir la végétation plantée en pied d'immeuble. Les baies sont cadrées de menuiseries noires et les loggias creusées dans la masse.",
      "L'entrée est traitée comme un seuil : un bandeau de bardage vertical sombre porte l'enseigne « ZAHIYA RESIDENCE » en lettres lumineuses, et le hall s'ouvre directement sur l'escalier.",
      "À l'intérieur, tout s'éclaircit. Les appartements sont livrés en plâtre lisse écru, sol en grès cérame gris grand format, menuiseries et portes en noyer. Les corniches lumineuses périphériques remplacent l'éclairage central : la lumière vient des murs.",
      "Une seconde campagne d'images explore des finitions plus riches — crédences en marbre veiné, salle d'eau en zellige noir et blanc, salons doublés de bois cannelé et escaliers à garde-corps pleins.",
    ],
    video: `${M}/akoubri_zahiya-facade-loop.mp4`,
    videoPoster: `${M}/akoubri_zahiya-facade-loop-poster.webp`,
    videoCaption: "La façade et son socle commercial",
    secondaryVideo: `${M}/akoubri_zahiya-living-room-loop.mp4`,
    secondaryVideoPoster: `${M}/akoubri_zahiya-living-room-loop-poster.webp`,
    secondaryVideoCaption: "Séjour livré — corniches lumineuses et menuiseries en noyer",
    cover: `${M}/akoubri_zahiya-entrance-signage-01.webp`,
    coverAlt:
      "Entrée de la résidence Zahiya au crépuscule : enseigne lumineuse sur bardage vertical sombre, façade en enduit minéral et arbre en avant-plan",
    hover: `${M}/akoubri_zahiya-facade-dusk-02.webp`,
    gallery: [
      img('akoubri_zahiya-entrance-signage-01.webp',
        "Entrée de la résidence Zahiya au crépuscule : enseigne lumineuse sur bardage vertical sombre, façade en enduit minéral et arbre en avant-plan",
        "L'entrée et son enseigne"),
      img('akoubri_zahiya-facade-dusk-02.webp',
        "Façade de Zahiya au crépuscule : enduit minéral sombre, loggias creusées et palmiers, fenêtres éclairées",
        "La façade au crépuscule"),
      img('akoubri_zahiya-facade-shops-04.webp',
        "Façade d'angle de Zahiya sur le socle commercial : vitrines éclairées en rez-de-chaussée, logements aux étages",
        "Le socle commercial"),
      img('akoubri_zahiya-living-dining-07.webp',
        "Séjour et salle à manger d'un appartement Zahiya, table ovale en bois, suspension linéaire et corniches lumineuses",
        "Séjour et salle à manger"),
      img('akoubri_zahiya-entrance-hall-08.webp',
        "Dégagement d'appartement avec corniches lumineuses, console en noyer et miroir carré",
        "Dégagement — la lumière vient des murs"),
      img('akoubri_zahiya-bathroom-zellige-34.webp',
        "Salle d'eau en zellige noir et blanc, sol en damier ocre et blanc, douche à l'italienne et murs en enduit terre",
        "Salle d'eau en zellige"),
      img('akoubri_zahiya-kitchen-marble-35.webp',
        "Cuisine en L avec crédence et plan de travail en marbre veiné, suspensions en verre ambré et porte cintrée",
        "Cuisine — crédence en marbre veiné"),
      img('akoubri_zahiya-facade-street-03.webp',
        "Façade de Zahiya vue de la rue, enduit minéral sombre et menuiseries noires"),
      img('akoubri_zahiya-living-room-05.webp',
        "Séjour livré : canapé d'angle beige, meuble TV suspendu et sol en grès cérame gris"),
      img('akoubri_zahiya-living-dining-06.webp',
        "Séjour ouvert sur la salle à manger, murs en plâtre écru et portes en noyer"),
      img('akoubri_zahiya-dining-room-09.webp',
        "Salle à manger avec table ronde en bois, six chaises claires et console en noyer"),
      img('akoubri_zahiya-kitchen-10.webp',
        "Cuisine équipée en façades blanches et bois, plan de travail sombre et sortie sur loggia"),
      img('akoubri_zahiya-bedroom-11.webp',
        "Chambre en tons clairs, lit en lin, suspensions basses et armoire en bois"),
      img('akoubri_zahiya-bedroom-12.webp',
        "Chambre avec tête de lit cannelée, chevets ronds et lampes à abat-jour"),
      img('akoubri_zahiya-bedroom-wardrobe-13.webp',
        "Chambre avec penderie en bois et écran mural, ouverture sur la loggia"),
      img('akoubri_zahiya-bathroom-14.webp',
        "Salle de bains en grès beige, meuble vasque en bois, douche vitrée et fenêtre"),
      img('akoubri_zahiya-bedroom-15.webp',
        "Chambre claire avec grande baie voilée et tapis en fibres naturelles"),
      img('akoubri_zahiya-living-room-16.webp',
        "Séjour avec canapé d'angle, table basse ronde et enfilade vers le couloir"),
      img('akoubri_zahiya-interior-17.webp',
        "Intérieur d'appartement livré, murs écrus et sol en grès cérame"),
      img('akoubri_zahiya-exterior-18.webp',
        "Façade de Zahiya en enduit sombre avec loggias et végétation basse"),
      img('akoubri_zahiya-exterior-19.webp',
        "Volume d'angle de Zahiya, jeu de retraits et de loggias"),
      img('akoubri_zahiya-exterior-20.webp',
        "Façade de Zahiya vue en contre-plongée, menuiseries noires et enduit minéral"),
      img('akoubri_zahiya-exterior-21.webp',
        "Façade latérale de Zahiya et plantations en pied d'immeuble"),
      img('akoubri_zahiya-exterior-22.webp',
        "Ensemble bâti de Zahiya vu depuis la voie, socle commercial et étages de logements"),
      img('akoubri_zahiya-salon-23.webp',
        "Salon doublé de bois cannelé, canapé beige et baie ouverte sur une loggia plantée"),
      img('akoubri_zahiya-salon-24.webp',
        "Salon avec cuisine ouverte, îlot en marbre sombre et appliques en verre"),
      img('akoubri_zahiya-salon-25.webp',
        "Salon en tons sable, diptyque encadré et rideaux toute hauteur"),
      img('akoubri_zahiya-salon-26.webp',
        "Séjour avec mur TV en bois cannelé et banquette d'angle capitonnée"),
      img('akoubri_zahiya-salon-27.webp',
        "Séjour ouvert sur la loggia, palmier en pot et rideaux voilés"),
      img('akoubri_zahiya-salon-28.webp',
        "Salon vu depuis l'entrée, mur cannelé pleine hauteur et sol en marbre clair"),
      img('akoubri_zahiya-kitchen-29.webp',
        "Cuisine ouverte à façades sable, crédence en marbre et table haute en marbre sombre"),
      img('akoubri_zahiya-bedroom-30.webp',
        "Chambre avec tête de lit capitonnée, suspensions sphériques et dressing derrière une claustra"),
      img('akoubri_zahiya-bedroom-31.webp',
        "Chambre en tons chauds, dressing ouvert éclairé et grande toile de paysage"),
      img('akoubri_zahiya-staircase-32.webp',
        "Cage d'escalier à garde-corps plein, enduit clair et éclairage en corniche"),
      img('akoubri_zahiya-staircase-33.webp',
        "Escalier de la résidence vu depuis le palier, main courante en bois"),
      img('akoubri_zahiya-bathroom-37.webp',
        "Salle d'eau en enduit terre avec zellige noir et blanc, vasque sur pied en bois et échelle porte-serviettes"),
      img('akoubri_zahiya-interior-36.webp',
        "Intérieur d'appartement Zahiya, enfilade éclairée par les corniches"),
    ],
  },

  /* ── 5. Maison d'hôte ─────────────────────────────────────────────────
     A guesthouse, architecturally distinct from everything else in the
     catalogue: cork wall panels, split-bamboo and timber-beam ceilings,
     arched white headboard niches, zellige and patterned cement floors,
     dry-stone walling, rattan and macramé. The bungalow rooms are kept
     visible as their own thread rather than merged into the bedrooms.   */
  {
    slug: 'maison-dhote',
    name: "Maison d'hôte",
    subtitle: 'Hébergement touristique',
    category: 'Hospitalité',
    year: null,
    location: 'Marrakech, Maroc',
    surface: null,
    status: null,
    mission: 'Architecture intérieure et aménagement',
    excerpt:
      "Une maison d'hôte et ses bungalows, tenus par un vocabulaire de matières naturelles : liège mural, plafonds en bambou fendu, zellige, pierre sèche et vannerie.",
    body: [
      "Le projet ne cherche pas le contraste mais la continuité. Les chambres sont doublées de panneaux de liège, dont le grain tient lieu de décor, et couvertes de plafonds en bambou fendu portés par des poutres apparentes. Une arche blanche peinte derrière chaque lit fait office de tête de lit.",
      "Le salon marocain reprend le même registre en plus dense : murs de liège, lustre en laiton ajouré, banquettes basses et coussins tissés à rayures rouges.",
      "Les salles d'eau assument la couleur. Murs en enduit terre ocre, colonnes de zellige noir et blanc, sols en carreaux de ciment à damier ocre, noir et blanc, robinetterie noire ou laiton.",
      "La terrasse haute est le point de rassemblement : une banquette filante court le long d'un mur en pierre sèche, sous une charpente de bambou et une claustra de tiges qui filtre la lumière rasante.",
    ],
    cover: `${M}/akoubri_maison-dhote-terrace-lounge-07.webp`,
    coverAlt:
      "Terrasse de la maison d'hôte : banquette filante le long d'un mur en pierre sèche, plafond de bambou et suspensions en fibres tressées",
    hover: `${M}/akoubri_maison-dhote-bungalow-bedroom-01.webp`,
    gallery: [
      img('akoubri_maison-dhote-terrace-lounge-07.webp',
        "Terrasse de la maison d'hôte : banquette filante le long d'un mur en pierre sèche, plafond de bambou et suspensions en fibres tressées",
        "La terrasse — pierre sèche et bambou"),
      img('akoubri_maison-dhote-bungalow-bedroom-01.webp',
        "Chambre de bungalow : mur de liège, arche blanche en tête de lit, plafond en bambou fendu et bureau en bois",
        "Bungalow — chambre au mur de liège"),
      img('akoubri_maison-dhote-bungalow-bedroom-02.webp',
        "Chambre de bungalow avec penderie en bois cannelé, macramé mural et fauteuil en rotin",
        "Bungalow — rangements et coin salon"),
      img('akoubri_maison-dhote-salon-marocain-11.webp',
        "Salon marocain : murs de liège, lustre en laiton ajouré, banquettes basses et coussins tissés à rayures rouges",
        "Salon marocain"),
      img('akoubri_maison-dhote-bathroom-zellige-05.webp',
        "Salle d'eau en enduit terre ocre, colonne de zellige noir et blanc, sol en damier et vasque sur pied en bois",
        "Salle d'eau — zellige et carreaux de ciment"),
      img('akoubri_maison-dhote-bedroom-cork-08.webp',
        "Chambre en liège et plâtre écru, miroir ovale, fauteuil en rotin et suspension en fibres",
        "Chambre — le liège comme décor"),
      img('akoubri_maison-dhote-bathroom-zellige-19.webp',
        "Salle d'eau avec douche vitrée, zellige noir et blanc et sol en carreaux de ciment ocre",
        "Salle d'eau"),
      img('akoubri_maison-dhote-bedroom-cork-10.webp',
        "Chambre au mur de liège avec arche blanche, suspension en fibres tressées et grand miroir ovale"),
      img('akoubri_maison-dhote-bedroom-03.webp',
        "Chambre claire avec tête de lit arquée, appliques en osier et poutres apparentes"),
      img('akoubri_maison-dhote-bedroom-04.webp',
        "Chambre avec penderie en bois, macramé mural et chaise en rotin"),
      img('akoubri_maison-dhote-bedroom-06.webp',
        "Chambre en enduit écru, lit bas et plafond en bambou fendu"),
      img('akoubri_maison-dhote-bedroom-09.webp',
        "Chambre avec arche blanche en tête de lit et suspensions en osier"),
      img('akoubri_maison-dhote-bedroom-14.webp',
        "Chambre en tons sable, tapis tissé et fenêtre voilée"),
      img('akoubri_maison-dhote-bedroom-15.webp',
        "Chambre avec assise en rotin, plaid tissé et mur en liège"),
      img('akoubri_maison-dhote-bedroom-wardrobe-16.webp',
        "Chambre et son dressing ouvert en bois cannelé"),
      img('akoubri_maison-dhote-kitchen-13.webp',
        "Cuisine en marbre veiné, porte cintrée noire et suspensions en verre ambré"),
      img('akoubri_maison-dhote-bathroom-17.webp',
        "Salle de bains en enduit clair, vasque en bois et douche vitrée"),
      img('akoubri_maison-dhote-interior-12.webp',
        "Intérieur de la maison d'hôte, murs en enduit et mobilier en fibres naturelles"),
      img('akoubri_maison-dhote-interior-18.webp',
        "Espace commun de la maison d'hôte, banquettes basses et vannerie"),
    ],
  },

  /* ── 6. Villa ────────────────────────────────────────────
     Three separate villas, one render each. They were briefly conflated
     while two folders held the same file; the owner confirmed they are
     three distinct projects and the media now matches.                 */
  {
    slug: 'villa',
    name: 'Villa',
    subtitle: 'Maison individuelle',
    category: 'Villa',
    year: null,
    location: 'Marrakech, Maroc',
    surface: null,
    status: null,
    mission: 'Architecture, piscine, paysage',
    excerpt:
      "Une maison à deux niveaux dont l'étage est porté en porte-à-faux au-dessus de la terrasse, sous-face habillée de tasseaux de bois, ouverte sur une piscine bordée de bambous.",
    body: [
      "Le projet tient en un seul geste : un volume supérieur en pierre claire qui avance largement au-dessus du rez-de-chaussée vitré, et dont la sous-face en tasseaux de bois réchauffe la lumière réfléchie par l'eau.",
      "Le débord fait l'ombre. La terrasse et la piscine reçoivent une ombre portée une grande partie de la journée, ce qui rend l'espace extérieur praticable sans ajouter de pergola.",
      "Un rideau de bambous planté en limite de parcelle assure l'intimité sans clôture opaque.",
    ],
    cover: `${M}/akoubri_villa-piscine-01.webp`,
    coverAlt:
      "Villa contemporaine à étage en porte-à-faux, sous-face en tasseaux de bois, ouverte sur une piscine bordée de bambous",
    gallery: [
      img('akoubri_villa-piscine-01.webp',
        "Villa contemporaine à étage en porte-à-faux, sous-face en tasseaux de bois, ouverte sur une piscine bordée de bambous",
        "Le porte-à-faux et la piscine"),
    ],
  },
  {
    slug: 'villa-k',
    name: 'Villa K',
    subtitle: 'Maison individuelle',
    category: 'Villa',
    year: null,
    location: 'Marrakech, Maroc',
    surface: null,
    status: null,
    mission: 'Architecture',
    excerpt:
      "Une villa jumelée en pierre claire, dont l'escalier hélicoïdal se lit de l'extérieur à travers une baie vitrée toute hauteur.",
    body: [
      "Deux entités symétriques partagent un mur mitoyen et se distinguent par leurs décrochements : chaque volume avance ou recule d'un demi-niveau, ce qui évite l'effet de barre et donne à chaque logement son propre angle.",
      "La faille vitrée centrale est le sujet de la façade. Elle monte sur toute la hauteur et laisse voir l'escalier hélicoïdal en bois, qui devient un élément de composition extérieure plutôt qu'un simple organe de distribution.",
      "Le parement de pierre claire, les sous-faces en bois et l'éclairage linéaire encastré sous les débords soulignent l'horizontale à la tombée du jour.",
    ],
    cover: `${M}/akoubri_villa-k-exterieur-01.webp`,
    coverAlt:
      "Villa K au crépuscule : villa jumelée en pierre claire, escalier hélicoïdal en bois visible à travers une baie vitrée toute hauteur",
    gallery: [
      img('akoubri_villa-k-exterieur-01.webp',
        "Villa K au crépuscule : villa jumelée en pierre claire, escalier hélicoïdal en bois visible à travers une baie vitrée toute hauteur",
        "L'escalier hélicoïdal derrière la faille vitrée"),
    ],
  },
  {
    slug: 'villa-targa',
    name: 'Villa Targa',
    subtitle: 'Maison individuelle',
    category: 'Villa',
    year: null,
    location: 'Marrakech, Maroc',
    surface: null,
    status: null,
    mission: 'Architecture',
    excerpt:
      "Une villa d'angle à volumes décalés, dont la tour en pierre sombre et les jambages lumineux toute hauteur marquent l'entrée.",
    body: [
      "Le projet s'organise en volumes cubiques décalés : un balcon couvert en avancée à gauche, un volume en retrait à droite, et entre les deux une tour verticale qui tient l'angle.",
      "Cette tour est parementée de pierre sombre éclatée, encadrée de fines menuiseries dorées filant du sol à l'acrotère. C'est le seul point sombre de la composition, et il sert de repère depuis la rue.",
      "L'éclairage architectural souligne les sous-faces, les linteaux et le muret de clôture, ce qui détache les volumes les uns des autres à la nuit tombée.",
    ],
    cover: `${M}/akoubri_villa-targa-exterieur-01.webp`,
    coverAlt:
      "Villa Targa au crépuscule : volumes cubiques décalés, tour d'angle en pierre sombre et jambages vitrés éclairés, jardin planté en pied de façade",
    gallery: [
      img('akoubri_villa-targa-exterieur-01.webp',
        "Villa Targa au crépuscule : volumes cubiques décalés, tour d'angle en pierre sombre et jambages vitrés éclairés, jardin planté en pied de façade",
        "La tour d'angle et ses jambages lumineux"),
    ],
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);

/* Studio showreel — the agency film (logo, then a satellite zoom onto
   Morocco). It belongs to no single project, so it lives here. */
export const showreel = {
  src: `${M}/akoubri_studio-showreel.mp4`,
  poster: `${M}/akoubri_studio-showreel-poster.webp`,
};

export const services = [
  {
    n: '01',
    title: 'Architecture',
    text: "Conception de résidences, de villas et de programmes tertiaires ou industriels — de l'esquisse au permis de construire, puis au suivi de chantier.",
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

/* Domaines d'intervention — remplace l'ancienne rangée de chiffres
   (« 12 années », « 48 projets », « 96k m² », « 4 villes »), invérifiable.
   Chaque entrée correspond à une famille de projets réellement présente
   dans le catalogue ci-dessus, donc rien n'y est affirmé à tort.
   `value` est le mot mis en avant, `label` la ligne de légende — la même
   forme que l'ancien tableau, pour que les trois pages qui l'affichent
   n'aient pas à changer de structure. */
export const practice = [
  { value: 'Résidentiel', label: 'Immeubles de logements et maisons individuelles' },
  { value: 'Tertiaire', label: "Aménagement de bureaux et sièges d'entreprise" },
  { value: 'Industriel', label: 'Unités de production et bâtiments techniques' },
  { value: 'Hospitalité', label: "Maisons d'hôte et hébergement touristique" },
];

/* Compat : trois pages importaient `stats`. Le tableau porte désormais des
   intitulés qualitatifs plutôt que des chiffres non vérifiés. */
export const stats = practice;

/* Parcours de l'agence — les jalons datés précédemment publiés (2013, 2016,
   2019, 2022, 2025) n'ont pas pu être vérifiés et sont retirés. La page
   Agence affiche à la place les étapes de travail (`process`). */
export const journey = [];

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

/* Testimonials — the named quotes previously published here could not be
   verified against any source and have been withdrawn pending real
   reviews from the studio. The component reads this array, so supplying
   genuine entries here is all that is needed to bring the wall back. */
export const testimonials = [];

/* Interior showcase slides for the angled-slab carousel. */
export const showcase = [
  {
    src: `${M}/akoubri_le-sentier-toiture-piscine-atlas-01.webp`,
    title: 'Toiture-terrasse, Le Sentier',
    caption: "Piscine à débordement et terrasse en bois face à la chaîne de l'Atlas.",
    slug: 'le-sentier',
  },
  {
    src: `${M}/akoubri_zahiya-living-dining-07.webp`,
    title: 'Séjour, Zahiya',
    caption: 'Plâtre écru, corniches lumineuses et menuiseries en noyer.',
    slug: 'zahiya',
  },
  {
    src: `${M}/akoubri_adostigia-reception-01.webp`,
    title: 'Accueil, Adostigia',
    caption: 'Marbre sombre rétroéclairé et pierre claire cannelée.',
    slug: 'adostigia',
  },
  {
    src: `${M}/akoubri_maison-dhote-salon-marocain-11.webp`,
    title: "Salon marocain, Maison d'hôte",
    caption: 'Murs de liège, laiton ajouré et tissages à rayures.',
    slug: 'maison-dhote',
  },
  {
    src: `${M}/akoubri_zahiya-bathroom-zellige-34.webp`,
    title: "Salle d'eau, Zahiya",
    caption: 'Zellige noir et blanc sur enduit terre, sol en damier.',
    slug: 'zahiya',
  },
  {
    src: `${M}/akoubri_farraj-hangar-reception-olives-06.webp`,
    title: 'Hangar de réception, Farraj',
    caption: "Bardage métallique nervuré et portes sectionnelles sur l'aire de manœuvre.",
    slug: 'farraj',
  },
];

/* FAQ for the Agence page. */
export const agencyFaq = [
  {
    q: 'Quels types de programmes traitez-vous ?',
    a: "Du logement collectif à socle commercial, des maisons individuelles, des aménagements de bureaux et des bâtiments industriels. Les projets présentés sur ce site couvrent ces quatre familles.",
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
    q: 'Pouvez-vous intervenir uniquement sur les images 3D ?',
    a: "Bien sûr. Plusieurs projets nous sont confiés uniquement pour la production d'images ou de films à partir de plans existants, pour une commercialisation ou un dossier d'investisseurs.",
  },
  {
    q: 'Publiez-vous les projets sur lesquels vous travaillez ?',
    a: "Seulement avec l'accord du maître d'ouvrage. Plusieurs projets livrés ne figurent pas sur ce site pour cette raison.",
  },
];
