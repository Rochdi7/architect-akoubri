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
        "Salon d'accueil : enseigne rétroéclairée sur panneau de marbre sombre, fauteuils ronds crème et beurre, guéridons ronds et palmiers en pot",
        "Le salon sous l'enseigne"),
      img('akoubri_adostigia-corridor-04.webp',
        'Accueil vu de biais : banque en pierre claire, jardinière basse, banquette courbe et fenêtre voilée à droite',
        "L'accueil vu de biais"),
      img('akoubri_adostigia-meeting-room-glass-05.webp',
        'Circulation étroite entièrement lambrissée de bois foncé, éclairée par une corniche lumineuse, toile encadrée et plante en pot au fond',
        'Circulation — lambris et corniche lumineuse'),
      img('akoubri_adostigia-reception-seating-06.webp',
        "Accueil vu depuis l'entrée : enseigne sur marbre sombre, banque en pierre, banquette courbe et grande fenêtre voilée",
        "L'accueil depuis l'entrée"),
      img('akoubri_adostigia-director-office-07.webp',
        "Cloison vitrée à bandes sablées séparant la circulation d'une salle éclairée, encadrement de bois foncé",
        'La cloison vitrée à bandes sablées'),
      img('akoubri_adostigia-director-office-08.webp',
        "Accueil avec enseigne rétroéclairée, fauteuils ronds clairs, banque en pierre et plantes de part et d'autre",
        "L'accueil et ses fauteuils ronds"),
      img('akoubri_adostigia-meeting-room-12.webp',
        "Salle de réunion vue en plongée, table en marbre sombre et huit fauteuils",
        'Salle de réunion vue en plongée'),
      img('akoubri_adostigia-meeting-room-13.webp',
        "Salle de réunion avec suspension à globes, écran de projection et cloison vitrée à bandes",
        'Salle de réunion — suspension à globes'),
      img('akoubri_adostigia-director-office-11.webp',
        "Bureau de direction : plan de travail noir, fauteuils clairs et grande fenêtre voilée",
        'Direction — plan noir et fenêtre voilée'),
      img('akoubri_adostigia-director-office-desk-14.webp',
        "Plan de travail noir vu en plongée, avec écran, lampe articulée et caisson en bois",
        'Détail du plan de travail'),
      img('akoubri_adostigia-waiting-lounge-15.webp',
        'Écran de projection déroulé au plafond, vu en contre-plongée au-dessus de la table de réunion',
        "Détail — l'écran de projection au plafond"),
      img('akoubri_adostigia-meeting-room-17.webp',
        "Salle de réunion sous une suspension à globes, table en marbre et bibliothèque éclairée au fond",
        'Réunion — table en marbre et bibliothèque'),
      img('akoubri_adostigia-ceiling-detail-18.webp',
        "Bureau de direction lambrissé : plan noir, panneau de marbre veiné, fauteuils clairs et rail d'éclairage noir au plafond",
        'Direction — le rail noir au plafond'),
      img('akoubri_adostigia-director-office-19.webp',
        "Bureau de direction en plongée, plan noir, bibliothèque éclairée et fauteuils clairs",
        'Bureau de direction en plongée'),
      img('akoubri_adostigia-reception-lounge-20.webp',
        'Bureau de direction avec plan noir, fauteuil de direction, assises basses claires et bibliothèque éclairée sur le mur de marbre',
        'Direction — le coin réception du bureau'),
      img('akoubri_adostigia-meeting-room-21.webp',
        "Salle de réunion ouverte sur un bureau de direction, double table en marbre",
        'Réunion ouverte sur la direction'),
      img('akoubri_adostigia-waiting-lounge-22.webp',
        "Salon d'attente : canapé courbe clair, diptyque abstrait et paroi de pierre claire cannelée",
        "Salon d'attente — canapé courbe et diptyque"),
      img('akoubri_adostigia-lighting-detail-10.webp',
        'Poste de direction vu en plongée : plan noir, caisson en bois, fauteuil de direction en cuir et écran',
        'Le poste de direction en plongée'),
    ],
  },

  /* ── 2. Farraj — Conserverie Faraj ─────────────────────────────
     Not a villa. The owner supplied 16 high-resolution renders on
     2026-09-18, which replaced the stills previously extracted from the
     narrated tour. Signage in the renders is explicit: « Conserverie FARAJ
     — ADMINISTRATION / Bureaux · Accueil · Gestion » on the office block,
     « MAGASIN DE STOCKAGE » and « MOSQUÉE » on the annex. The narrated
     tour is kept as the project film.                                   */
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
      "Une unité de conserverie d'olives organisée en L : administration en enduit terre, hangar de production en bardage sombre, magasin et mosquée, le tout autour d'une vaste aire de manœuvre.",
    body: [
      "Le programme est industriel avant d'être représentatif, et le plan de masse le dit : les fonctions se répartissent en L sur une parcelle agricole, administration en pignon sur l'entrée, hangar de production en longueur, annexes et champ de panneaux solaires à l'arrière. Entre les deux branches, une aire de manœuvre dimensionnée pour les semi-remorques.",
      "Le bâtiment administratif est le seul geste architectural assumé : deux volumes en enduit terre décalés, l'étage en porte-à-faux au-dessus du rez-de-chaussée, séparés par une faille verticale en bois cannelé qui marque l'entrée. Les bandeaux vitrés en angle et le garde-corps en verre déposé donnent aux bureaux une vue sur la plaine.",
      "Les volumes de production assument leur fonction : bardage métallique nervuré vertical pour le hangar, enduit terre à toiture à quatre pans pour le magasin de stockage et la mosquée. C'est la signalétique de marque — l'olivier en relief, répété à chaque seuil sur des totems blancs — qui donne son unité à l'ensemble.",
      "Un carport photovoltaïque couvre le stationnement du personnel : il produit et il ombrage, ce qui dans la plaine de Marrakech compte autant l'un que l'autre.",
    ],
    video: `${M}/akoubri_farraj-conserverie-tour.mp4`,
    videoPoster: `${M}/akoubri_farraj-administration-entree-01.webp`,
    videoCaption: "Visite commentée de l'unité — du plan de masse aux zones de production",
    cover: `${M}/akoubri_farraj-administration-entree-01.webp`,
    coverAlt:
      "Bâtiment administratif de la conserverie Faraj : deux volumes en enduit terre, étage en porte-à-faux, faille d'entrée en bois cannelé et totem « Conserverie FARAJ — Administration »",
    hover: `${M}/akoubri_farraj-vue-aerienne-03.webp`,
    gallery: [
      img('akoubri_farraj-administration-entree-01.webp',
        "Bâtiment administratif de la conserverie Faraj : deux volumes en enduit terre, étage en porte-à-faux, faille d'entrée en bois cannelé et totem « Conserverie FARAJ — Administration »",
        "Administration — l'entrée et son totem"),
      img('akoubri_farraj-vue-aerienne-03.webp',
        "Vue aérienne de la conserverie Faraj : bâtiments disposés en L autour d'une aire de manœuvre, champ de panneaux solaires et parcelles agricoles alentour",
        "Plan de masse vu du ciel"),
      img('akoubri_farraj-hangar-cour-05.webp',
        "Hangar de production en bardage métallique sombre et bâtiment administratif en enduit terre, séparés par l'aire de manœuvre pavée et une rangée de palmiers",
        "Le hangar et l'aire de manœuvre"),
      img('akoubri_farraj-administration-angle-02.webp',
        "Bâtiment administratif vu d'angle : bandeaux vitrés en retour, garde-corps en verre déposé et carport solaire à l'arrière-plan",
        "L'administration vue d'angle"),
      img('akoubri_farraj-magasin-mosquee-07.webp',
        "Annexe en enduit terre à toiture à quatre pans abritant le magasin de stockage, porte ouverte sur les rayonnages, et la mosquée signalée par son totem",
        "Magasin de stockage et mosquée"),
      img('akoubri_farraj-carport-solaire-10.webp',
        "Carport photovoltaïque couvrant le stationnement du personnel, haie taillée en fond et palmier devant l'administration",
        "Carport photovoltaïque"),
      img('akoubri_farraj-vue-aerienne-crepuscule-04.webp',
        "Vue aérienne rapprochée de l'unité : administration, hangar et champ de panneaux solaires alignés sur la parcelle",
        "L'unité vue du ciel de plus près"),
      img('akoubri_farraj-hangar-administration-06.webp',
        "Le hangar de production et l'administration vus depuis l'aire de manœuvre, totems de marque échelonnés le long de la façade",
        "Hangar et administration depuis l'aire de manœuvre"),
      img('akoubri_farraj-magasin-mosquee-08.webp',
        "Annexe magasin et mosquée en enduit terre, portes bois et massif planté en pied de façade",
        "L'annexe en enduit terre"),
      img('akoubri_farraj-administration-parking-09.webp',
        "Administration vue depuis le stationnement, carport solaire à gauche et hangar en bardage à droite",
        "L'administration depuis le stationnement"),
      img('akoubri_farraj-carport-solaire-11.webp',
        "Carport photovoltaïque et véhicules du personnel, palmier et angle de l'administration à droite",
        'Le carport et le stationnement du personnel'),
      img('akoubri_farraj-administration-parking-12.webp',
        "Administration et stationnement ombragé en fin de journée, massifs de romarin en pied de façade",
        'Stationnement ombragé en fin de journée'),
      img('akoubri_farraj-entree-portail-13.webp',
        "Portail d'entrée du site, haie taillée et administration en second plan derrière les palmiers",
        "Le portail d'entrée du site"),
      img('akoubri_farraj-entree-portail-14.webp',
        "Entrée de la conserverie vue depuis la voie, portail métallique sombre et clôture végétalisée",
        "L'entrée vue depuis la voie"),
      img('akoubri_farraj-site-paysage-15.webp',
        "L'unité dans son paysage agricole : la ligne bâtie basse se détache sur l'horizon, champs au premier plan",
        "L'unité dans la plaine"),
      img('akoubri_farraj-site-paysage-16.webp',
        "Vue lointaine de la conserverie depuis les champs, semi-remorque à quai sur la droite",
        'La conserverie vue des champs'),
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
        'Salle de bains en travertin : baignoire encastrée dans un bloc de pierre, miroir rétroéclairé à angles arrondis, WC suspendu et douche vitrée',
        'Salle de bains — la baignoire en travertin'),
      img('akoubri_le-sentier-entree-cuisine-06.webp',
        "Entrée d'appartement lambrissée de bois clair, niche TV suspendue et cuisine ouverte en second plan",
        "Entrée — le seuil entre dégagement et séjour"),
      img('akoubri_le-sentier-toiture-piscine-jour-02.webp',
        "Piscine de toiture en plein jour, bains de soleil alignés sur la terrasse en bois et sommets enneigés de l'Atlas au loin",
        "La piscine au soleil"),
      img('akoubri_le-sentier-sejour-02.webp',
        "Séjour d'appartement vu depuis l'entrée, banquette d'angle et tapis gris sur sol en grès cérame clair",
        "Séjour vu depuis l'entrée"),
      img('akoubri_le-sentier-sejour-couloir-04.webp',
        "Séjour et couloir en enfilade, mur TV en pierre claire rétroéclairée et plantes en pot",
        'Le mur TV en pierre rétroéclairée'),
      img('akoubri_le-sentier-couloir-05.webp',
        "Couloir de distribution lambrissé de bois clair, corniche lumineuse continue et cadre au fond",
        'Couloir — bois clair et corniche continue'),
      img('akoubri_le-sentier-cuisine-07.webp',
        "Cuisine à façades sable et bois, plan de travail noir et crédence en marbre veiné",
        'Cuisine — façades sable et plan noir'),
      img('akoubri_le-sentier-cuisine-08.webp',
        "Cuisine vue de face : colonnes de fours encastrés et hotte intégrée sous un bandeau de bois cannelé",
        'Cuisine de face — fours et bandeau cannelé'),
      img('akoubri_le-sentier-cuisine-couloir-10.webp',
        "Cuisine-couloir avec table haute en marbre sombre et sortie sur la loggia plantée",
        'Cuisine-couloir et sortie sur la loggia'),
      img('akoubri_le-sentier-chambre-11.webp',
        "Chambre avec tête de lit capitonnée, banc de pied de lit et salle d'eau attenante visible par l'enfilade",
        "Chambre et salle d'eau en enfilade"),
      img('akoubri_le-sentier-chambre-12.webp',
        "Chambre claire ouverte sur une salle d'eau vitrée, suspensions fines et rideaux toute hauteur",
        "Chambre ouverte sur une salle d'eau vitrée"),
      img('akoubri_le-sentier-chambre-degagement-13.webp',
        "Chambre et son dégagement : toile encadrée, plante en pot et parquet foncé",
        'Chambre et son dégagement'),
      img('akoubri_le-sentier-chambre-14.webp',
        "Chambre en tons sable avec suspensions en laiton de part et d'autre du lit",
        'Chambre — suspensions en laiton'),
      img('akoubri_le-sentier-chambre-dressing-15.webp',
        "Chambre avec dressing ouvert derrière une claustra en bois foncé et grande toile abstraite",
        'Le dressing derrière la claustra'),
      img('akoubri_le-sentier-chambre-salle-eau-16.webp',
        "Chambre et salle d'eau attenante, vasque en bois clair et miroir rétroéclairé",
        'Chambre — vasque en bois et miroir rétroéclairé'),
      img('akoubri_le-sentier-salle-eau-17.webp',
        'Chambre en tons sable : tête de lit capitonnée sous une corniche lumineuse, suspensions sphériques, banc de pied de lit et grande baie voilée',
        'Chambre — suspensions sphériques et corniche'),
      img('akoubri_le-sentier-chambre-dressing-19.webp',
        "Chambre avec dressing vitré éclairé, banc de pied de lit et parquet foncé",
        'Chambre — le dressing vitré éclairé'),
      img('akoubri_le-sentier-chambre-tv-20.webp',
        "Chambre avec meuble TV suspendu en bois et dressing vitré en enfilade",
        'Chambre — meuble TV suspendu'),
      img('akoubri_le-sentier-sejour-salle-eau-21.webp',
        "Séjour et salle d'eau invités en enfilade, vasque en travertin et miroir rétroéclairé",
        "La salle d'eau invités en enfilade"),
      img('akoubri_le-sentier-salle-eau-23.webp',
        "Salle d'eau compacte : vasque en travertin, miroir rétroéclairé et robinetterie noire",
        "Salle d'eau compacte"),
      img('akoubri_le-sentier-salle-eau-detail-24.webp',
        "Détail de la vasque monolithe en travertin et de sa tablette en bois",
        'Détail — la vasque monolithe'),
      img('akoubri_le-sentier-toiture-piscine-nuit-05.webp',
        "Piscine de toiture éclairée à la nuit tombée, haie éclairée et brasero allumé au fond",
        'Toiture — la piscine à la nuit tombée'),
      img('akoubri_le-sentier-toiture-bar-piscine-08.webp',
        "Bar sous pergola et lame d'eau de la piscine en plein jour, assises en rotin sous parasols",
        "Le bar et la lame d'eau en plein jour"),
      img('akoubri_le-sentier-toiture-salon-09.webp',
        'Bar de toiture sous une pergola à lames de bois, comptoir en marbre sombre rétroéclairé et tabourets cannelés face à la piscine au crépuscule',
        'Le bar de toiture au crépuscule'),
      img('akoubri_le-sentier-toiture-terrasse-aerien-01.webp',
        "Vue aérienne de la toiture-terrasse : piscine, pergola, voiles d'ombrage et terrasses privatives plantées aux étages inférieurs",
        "Vue aérienne du niveau terrasse"),
      img('akoubri_le-sentier-plan-appartement-36.webp',
        "Séjour d'appartement avec cuisine ouverte : linéaire en bois clair, crédence en marbre, îlot noir, banquette d'angle claire et diptyque encadré",
        'Séjour et cuisine ouverte — appartement type'),
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
        'Chambre livrée : écran mural, penderie en bois et tête de lit claire sous une corniche lumineuse',
        "Chambre — l'écran et la penderie"),
      img('akoubri_zahiya-living-dining-07.webp',
        "Séjour et salle à manger d'un appartement Zahiya, table ovale en bois, suspension linéaire et corniches lumineuses",
        "Séjour et salle à manger"),
      img('akoubri_zahiya-entrance-hall-08.webp',
        "Dégagement d'appartement avec corniches lumineuses, console en noyer et miroir carré",
        "Dégagement — la lumière vient des murs"),
      img('akoubri_zahiya-bathroom-zellige-34.webp',
        "Séjour livré : écran mural, meuble bas en bois, plante en pot et enfilade vers l'entrée en enduit clair",
        "Séjour — l'enfilade vers l'entrée"),
      img('akoubri_zahiya-kitchen-marble-35.webp',
        "Salle à manger : table ronde claire et six chaises, console en bois clair et suspension à tiges fines",
        "Salle à manger — table ronde et console"),
      img('akoubri_zahiya-facade-street-03.webp',
        'Chambre claire avec écran mural, penderie en bois et porte-fenêtre ouvrant sur la loggia',
        'Chambre ouverte sur la loggia'),
      img('akoubri_zahiya-living-room-05.webp',
        "Séjour livré : canapé d'angle beige, meuble TV suspendu et sol en grès cérame gris",
        'Séjour livré'),
      img('akoubri_zahiya-living-dining-06.webp',
        'Cuisine équipée : façades bois et blanches, plan noir, four encastré, lave-linge et porte de service vitrée',
        'Cuisine — plan noir et façades bois'),
      img('akoubri_zahiya-dining-room-09.webp',
        "Salle à manger avec table ronde en bois, six chaises claires et console en noyer",
        'Salle à manger — table ronde et console en noyer'),
      img('akoubri_zahiya-kitchen-10.webp',
        'Salle à manger et cuisine en enfilade : table ronde claire, console en bois et loggia plantée au fond',
        'Salle à manger et loggia en enfilade'),
      img('akoubri_zahiya-bedroom-11.webp',
        "Chambre en tons clairs, lit en lin, suspensions basses et armoire en bois",
        'Chambre en tons clairs'),
      img('akoubri_zahiya-bedroom-12.webp',
        'Salle de bains en grès beige : meuble vasque suspendu, miroir encadré de bois, WC et douche vitrée éclairée par une fenêtre',
        'Salle de bains — meuble vasque suspendu'),
      img('akoubri_zahiya-bedroom-wardrobe-13.webp',
        "Chambre avec penderie en bois et écran mural, ouverture sur la loggia",
        'Chambre avec penderie et écran mural'),
      img('akoubri_zahiya-bathroom-14.webp',
        "Séjour livré vu depuis la salle à manger : banquette d'angle claire, écran mural et enfilade vers les chambres",
        'Séjour depuis la salle à manger'),
      img('akoubri_zahiya-bedroom-15.webp',
        "Chambre claire avec grande baie voilée et tapis en fibres naturelles",
        'Chambre — la grande baie voilée'),
      img('akoubri_zahiya-living-room-16.webp',
        "Séjour avec canapé d'angle, table basse ronde et enfilade vers le couloir",
        'Séjour et enfilade vers le couloir'),
      img('akoubri_zahiya-interior-17.webp',
        "Intérieur d'appartement livré, murs écrus et sol en grès cérame",
        'Appartement livré — murs écrus'),
      img('akoubri_zahiya-exterior-18.webp',
        "Façade de Zahiya en enduit sombre avec loggias et végétation basse",
        'Enduit sombre et loggias'),
      img('akoubri_zahiya-exterior-19.webp',
        "Volume d'angle de Zahiya, jeu de retraits et de loggias",
        "Le volume d'angle"),
      img('akoubri_zahiya-exterior-20.webp',
        "Façade de Zahiya vue en contre-plongée, menuiseries noires et enduit minéral",
        'La façade en contre-plongée'),
      img('akoubri_zahiya-exterior-21.webp',
        "Façade latérale de Zahiya et plantations en pied d'immeuble",
        'Façade latérale et plantations'),
      img('akoubri_zahiya-exterior-22.webp',
        "Ensemble bâti de Zahiya vu depuis la voie, socle commercial et étages de logements",
        "L'ensemble bâti vu depuis la voie"),
      img('akoubri_zahiya-salon-23.webp',
        "Séjour en enduit clair : écran mural, banquette d'angle claire, table basse ronde et porte en bois vers le couloir",
        'Séjour — la banquette d’angle'),
      img('akoubri_zahiya-salon-24.webp',
        "Salon avec cuisine ouverte, îlot en marbre sombre et appliques en verre",
        'Salon et cuisine ouverte — îlot en marbre'),
      img('akoubri_zahiya-salon-25.webp',
        'Chambre en tons sable : tête de lit capitonnée, chevets en bois et lampes à abat-jour, penderie pleine hauteur',
        'Chambre — tête de lit capitonnée'),
      img('akoubri_zahiya-salon-26.webp',
        "Séjour avec mur TV en bois cannelé et banquette d'angle capitonnée",
        "Séjour — mur TV cannelé et banquette d'angle"),
      img('akoubri_zahiya-salon-27.webp',
        "Séjour ouvert sur la loggia, palmier en pot et rideaux voilés",
        'Séjour ouvert sur la loggia'),
      img('akoubri_zahiya-salon-28.webp',
        "Salon vu depuis l'entrée, mur cannelé pleine hauteur et sol en marbre clair",
        "Salon vu depuis l'entrée"),
      img('akoubri_zahiya-kitchen-29.webp',
        "Cuisine ouverte à façades sable, crédence en marbre et table haute en marbre sombre",
        'Cuisine ouverte et table haute en marbre'),
      img('akoubri_zahiya-bedroom-30.webp',
        'Chambre claire : tête de lit cannelée, chevet en bois et lampe à abat-jour, porte-fenêtre voilée',
        'Chambre — tête de lit cannelée et chevet'),
      img('akoubri_zahiya-bedroom-31.webp',
        'Chambre avec écran mural sur panneau de bois, penderie intégrée et lit clair',
        "Chambre — l'écran sur panneau de bois"),
      img('akoubri_zahiya-staircase-32.webp',
        "Palier d'étage : porte d'ascenseur métallique, toile encadrée sur enduit clair et plantes en pot",
        "Palier — l'ascenseur et sa toile"),
      img('akoubri_zahiya-staircase-33.webp',
        "Hall de la résidence : bloc de boîtes aux lettres, départ d'escalier à garde-corps plein et plantes en pot",
        "Hall — boîtes aux lettres et départ d'escalier"),
      img('akoubri_zahiya-bathroom-37.webp',
        'Chambre avec écran mural, penderie en bois et porte-fenêtre ouvrant sur la loggia',
        'Chambre — porte-fenêtre sur loggia'),
      img('akoubri_zahiya-interior-36.webp',
        'Salle de bains en grès beige : meuble vasque suspendu, miroir encadré de bois, WC et fenêtre en imposte',
        'Salle de bains — la fenêtre en imposte'),
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
        'Chambre en enduit clair : armoire en bois devant une arche blanche, porte cintrée et petit tapis tissé au pied du lit',
        "Chambre — l'armoire devant l'arche"),
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
        'Terrasse couverte : longue banquette basse blanche sous un plafond de bambou, mur de pierre sèche, poufs sculptés et plantes en pot',
        'La terrasse — banquette blanche sous le bambou'),
      img('akoubri_maison-dhote-bathroom-zellige-19.webp',
        "Salle d'eau avec douche vitrée, zellige noir et blanc et sol en carreaux de ciment ocre",
        "Salle d'eau"),
      img('akoubri_maison-dhote-bedroom-cork-10.webp',
        'Terrasse de toit : banquettes blanches le long des murs, table basse et chaises en rotin, tapis à motifs et ciel ouvert',
        'La terrasse de toit et ses banquettes'),
      img('akoubri_maison-dhote-bedroom-03.webp',
        'Terrasse sous pergola de bois : banquette blanche contre un mur de pierre sèche, table et chaises en rotin, sol en terre cuite',
        'Terrasse — la pergola et le mur de pierre'),
      img('akoubri_maison-dhote-bedroom-04.webp',
        "Chambre avec penderie en bois, macramé mural et chaise en rotin",
        'Chambre — penderie en bois et macramé'),
      img('akoubri_maison-dhote-bedroom-06.webp',
        'Chambre en enduit écru : porte cintrée en bois, encadrement de zellige bleu et fauteuil bas près de la fenêtre voilée',
        'Chambre — la porte cintrée et son zellige'),
      img('akoubri_maison-dhote-bedroom-09.webp',
        "Terrasse couverte vue dans sa longueur : banquette d'angle blanche, suspensions noires sous le plafond de bambou et mur de pierre sèche",
        'La terrasse dans sa longueur'),
      img('akoubri_maison-dhote-bedroom-14.webp',
        'Cuisine en façades claires, crédence et fond en marbre veiné, étagères suspendues et four encastré',
        'Cuisine — la crédence en marbre veiné'),
      img('akoubri_maison-dhote-bedroom-15.webp',
        "Chambre avec assise en rotin, plaid tissé et mur en liège",
        'Chambre — assise en rotin et mur de liège'),
      img('akoubri_maison-dhote-bedroom-wardrobe-16.webp',
        'Cuisine avec porte-fenêtre cintrée noire, plan en marbre, hotte encastrée et réfrigérateur en fin de linéaire',
        'Cuisine — la porte cintrée à contre-jour'),
      img('akoubri_maison-dhote-kitchen-13.webp',
        'Salon marocain : banquettes basses en U garnies de coussins rouges, table basse ronde, plafond de bois et lustre en verre',
        'Salon marocain — les coussins rouges'),
      img('akoubri_maison-dhote-bathroom-17.webp',
        "Chambre en enduit clair : arche blanche en tête de lit, macramé mural, fauteuil en rotin et lustre en verre",
        "Chambre — l'arche et le macramé"),
      img('akoubri_maison-dhote-interior-12.webp',
        'Chambre avec claustra de bois en tête de lit, arche blanche, macramé mural et miroir ovale',
        'Chambre — la claustra en tête de lit'),
      img('akoubri_maison-dhote-interior-18.webp',
        'Chambre claire : arche blanche en tête de lit, claustra de bois, fauteuils en rotin et tabourets tressés',
        'Chambre — arche blanche et fauteuils en rotin'),
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

/* Testimonials — the "wall of proof" grid, sourced from the studio's Google
   Business Profile (5,0 ★ / 57 avis, relevé en septembre 2026).

   Every entry below is a real review: `name` is the reviewer's Google display
   name and `quote` is their own wording, edited only to fix typography and to
   end on a clean sentence where Google truncated the text behind its "More"
   link. Nothing here is written by the studio — inventing a review, or
   finishing someone's sentence for them, misrepresents a named customer and
   breaches Google's review policies.

   `role` carries the reviewer's public Google standing (review count, Local
   Guide badge) rather than a job title, because a Google review exposes no
   employer or role. `source` is "google" throughout; the component's "x"
   branch stays in place for a future platform but is unused for now.

   Distributed round-robin into three columns that scroll at different
   speeds. */
export const testimonials = [
  {
    name: 'Khaoula Janane',
    role: 'Avis Google · 2 avis',
    source: 'google',
    quote:
      "Je recommande vivement cet architecte. Très professionnel, à l'écoute de mes besoins et force de proposition. Le projet a été réalisé avec beaucoup de créativité, de rigueur et dans le respect des délais. La communication a toujours été fluide et le résultat est à la hauteur de mes attentes.",
  },
  {
    name: 'Khalid Chafni',
    role: 'Local Guide · 18 avis',
    source: 'google',
    quote:
      "Une excellente expérience. Professionnalisme, créativité et rigueur du début à la fin. Un architecte de confiance qui propose des solutions modernes et parfaitement adaptées aux besoins de ses clients. Je recommande sans hésitation.",
  },
  {
    name: 'Abderrahmane',
    role: 'Avis Google',
    source: 'google',
    quote:
      "Excellente expérience. Architecte très professionnel, compétent et à l'écoute de ses clients. Son travail est soigné, créatif et réalisé avec beaucoup de sérieux. Je suis entièrement satisfait du résultat et je le recommande vivement.",
  },
  {
    name: 'Ahmed Elka',
    role: 'Avis Google',
    source: 'google',
    quote:
      "Très bonne expérience avec Akoubri Architecture & Design. Une équipe sérieuse, professionnelle et à l'écoute. Le travail est soigné, les propositions sont modernes et les détails sont vraiment bien étudiés. Un accompagnement de qualité du début à la fin.",
  },
  {
    name: 'Lil Mowgli',
    role: 'Avis Google · 2 avis',
    source: 'google',
    quote:
      "Excellent architect! Adnane Akoubri is professional, creative, and easy to work with. He pays great attention to detail and delivers high-quality designs. I highly recommend his services!",
  },
  {
    name: 'sofiane laamiri',
    role: 'Avis Google · 8 avis',
    source: 'google',
    quote:
      "Une excellente expérience du début à la fin. Un architecte sérieux, professionnel et surtout très à l'écoute de ses clients. Il a su comprendre parfaitement nos besoins, proposer de très bonnes idées et apporter des solutions à chaque étape du projet.",
  },
  {
    name: 'Youssef Boutalat',
    role: 'Avis Google · 2 avis',
    source: 'google',
    quote:
      "J'ai beaucoup apprécié son professionnalisme et sa disponibilité. Il a su comprendre mes besoins et proposer des solutions modernes et bien pensées. Le projet a été mené proprement, dans les délais et sans dépasser le budget. Une excellente expérience, je recommande fortement.",
  },
  {
    name: 'Hamza mansouri',
    role: 'Avis Google · 2 avis',
    source: 'google',
    quote:
      "Rien à dire. Il a été patient du début à la fin. J'ai demandé plusieurs modifications et il les a faites jusqu'à ce que tout soit comme je voulais. Merci pour le sérieux.",
  },
  {
    name: 'abderrahman tizari',
    role: 'Avis Google',
    source: 'google',
    quote:
      "Un architecte très compétent, à l'écoute et professionnel. Les plans ont été réalisés avec précision et créativité, tout en respectant le budget et les délais. Je recommande vivement.",
  },
  {
    name: 'taha benamar',
    role: 'Avis Google · 3 avis',
    source: 'google',
    quote:
      "Très bonne expérience avec cet architecte. Professionnalisme, écoute et créativité au rendez-vous. Un travail soigné et de qualité. Je recommande vivement !",
  },
  {
    name: 'Abdesamad Touassa',
    role: 'Avis Google · 4 avis',
    source: 'google',
    quote:
      "Architecte sérieux, compétent et très professionnel. Une excellente écoute et un accompagnement de qualité du début à la fin. Je recommande sans hésitation.",
  },
  {
    name: 'Abdourahman Ridha',
    role: 'Avis Google · 3 avis',
    source: 'google',
    quote:
      "I had a really good experience with Akoubri Architecture & Design. They were professional, easy to work with and really listened to what I was looking for. I was impressed with their ideas and the attention they put into the details.",
  },
  {
    name: 'Soufiane Ben saidi',
    role: 'Avis Google',
    source: 'google',
    quote:
      "Très satisfait de la prestation. Architecte sérieux, créatif et attentif aux détails. Les délais ont été respectés et le résultat est à la hauteur de mes attentes. Je recommande vivement.",
  },
  {
    name: 'Younes Jamali',
    role: 'Avis Google',
    source: 'google',
    quote:
      "Très bon architecte si vous souhaitez le consulter pour vos projets immobiliers. On s'est senti à l'écoute et le travail livré était de très bonne qualité, je conseille vivement.",
  },
  {
    name: 'aziz kech',
    role: 'Avis Google · 4 avis',
    source: 'google',
    quote:
      "Akoubri Architecture & Design (Adnane) is highly professional, creative, and attentive to detail. Excellent communication throughout the process, and they truly listen to their clients' needs and ideas. Very reliable and committed to quality. Highly recommended!",
  },
  {
    name: 'Jihane bh',
    role: 'Avis Google',
    source: 'google',
    quote:
      "Très bon architecte, à l'écoute et professionnel. Il m'a bien accompagné et conseillé tout au long de mon projet, je le recommande sans hésiter.",
  },
  {
    name: 'Youssef Jaoudat',
    role: 'Avis Google · 4 avis',
    source: 'google',
    quote:
      "Très bonne expérience avec cet architecte. À l'écoute, professionnel et sérieux, avec une bonne communication tout au long du projet. Je recommande.",
  },
  {
    name: 'Anas Naciri',
    role: 'Avis Google · 2 avis',
    source: 'google',
    quote:
      "Je recommande vivement cet architecte : professionnel, réactif et très impliqué. Une collaboration de qualité et un suivi irréprochable.",
  },
  {
    name: 'zikou karouali',
    role: 'Avis Google · 6 avis',
    source: 'google',
    quote:
      "Excellent architecte, très professionnel, à l'écoute et réactif. Travail de qualité, respect des délais et excellent accompagnement tout au long du projet. Je recommande vivement.",
  },
  {
    name: 'Nasser Chebcheb',
    role: 'Avis Google',
    source: 'google',
    quote:
      "Très bonne expérience malgré la distance. Architecte professionnel, à l'écoute et de bon conseil. Je recommande.",
  },
  {
    name: 'Yassine Rabbaa',
    role: 'Avis Google · 13 avis',
    source: 'google',
    quote:
      "Je recommande fortement Monsieur Akoubri. Nous avons réalisé plusieurs projets, tout s'est bien déroulé.",
  },
  {
    name: 'mohamed atellah',
    role: 'Avis Google · 2 avis',
    source: 'google',
    quote:
      "One of the best architects in Marrakech, and also very professional work. And very welcoming at the office.",
  },
  {
    name: 'Laila Manar',
    role: 'Avis Google · 2 avis',
    source: 'google',
    quote:
      "Un ingénieur vraiment professionnel. Il était toujours disponible, prenait le temps de répondre à chacune de mes questions. Service excellent.",
  },
  {
    name: 'Nabil Khalouqi',
    role: 'Local Guide · 23 avis',
    source: 'google',
    quote:
      "Excellent service, thank you.",
  },
];

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
    src: `${M}/akoubri_farraj-hangar-cour-05.webp`,
    title: 'Hangar de production, Farraj',
    caption: "Bardage métallique nervuré et administration en enduit terre, de part et d'autre de l'aire de manœuvre.",
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
