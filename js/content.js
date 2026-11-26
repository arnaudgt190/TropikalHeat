/* =========================================================
   TROPIKAL HEAT · CONTENU DU SITE
   Modifie les textes, prix et liens ici : pas besoin de toucher
   au HTML ni au CSS. Les [CROCHETS] sont à compléter.
   ========================================================= */
window.CONTENT = {
  marque: {
    nom: "Tropikal Heat",
    slogan: "Feel the heat",
    baseline: "Archipel // Culture // 971",
    email: "contact@tropikalheat.com",
    instagram: "https://instagram.com/tropikalheat",
    tiktok: "https://tiktok.com/@tropikalheat",
    ville: "Le Gosier, Guadeloupe"
  },

  accueil: {
    surtitre: "Streetwear né en Guadeloupe",
    titre: "Le soleil de l'archipel, à porter tous les jours.",
    texte: "Tropikal Heat, c'est la chaleur des îles cousue dans un streetwear propre, pensé pour la vie de tous les jours. Des pièces imprimées en Guadeloupe.",
    bouton: "Découvrir l'édition KARUKERA",
    bandeau: ["Édition limitée", "Imprimé en Guadeloupe", "Feel the heat", "Karukera", "Made in Guadeloupe", "Précommande ouverte", "971", "Streetwear des îles", "L'île aux belles eaux"]
  },

  edition: {
    nom: "KARUKERA",
    numero: "Édition 01",
    accroche: "L'île aux belles eaux.",
    texte: "Karukera, c'est le nom que les Kalinagos donnaient à la Guadeloupe. Pour notre première édition, on lui rend hommage : le soleil qui se lève sur le corail, la vague, les hibiscus. Un dos illustré façon gravure, le monogramme TH au cœur.",
    stock: 50,
    variantes: [
      { id: "noir-degrade",  nom: "Noir · dos en dégradé",       image: "assets/lookbook/dos-degrade-noir.webp",  fond: "#0b0b0b", clair: false },
      { id: "blanc-degrade", nom: "Blanc · dos en dégradé",      image: "assets/lookbook/dos-degrade-blanc.webp", fond: "#f4f1ec", clair: true },
      { id: "noir",          nom: "Noir · impression blanche",   image: "assets/lookbook/dos-nb-noir.webp",       fond: "#0b0b0b", clair: false },
      { id: "blanc",         nom: "Blanc · impression noire",    image: "assets/lookbook/dos-nb-blanc.webp",      fond: "#f4f1ec", clair: true }
    ],
    prix: "40 €",
    tailles: ["S", "M", "L"],
    details: [
      "Coton 190 g/m², coupe unisexe",
      "Monogramme TH au cœur 6 cm · dos 27 × 40 cm",
      "Impression DTF réalisée en Guadeloupe",
      "Édition limitée à 50 pièces"
    ],
    precommande: {
      titre: "Précommande ouverte",
      texte: "Réserve ta pièce avant la sortie officielle. Remise en main propre en Guadeloupe ou envoi.",
      /* Colle ici ton lien de paiement Stripe ou SumUp quand il est prêt.
         Tant qu'il est vide, le bouton ouvre un email de précommande. */
      lienPaiement: ""
    }
  },

  univers: {
    titre: "Un univers, pas juste un t-shirt.",
    intro: "Tropikal Heat est né d'une idée simple : porter ce qu'on aime de nos îles, sans cliché. Le soleil qui tape, la mer qui gronde, les fleurs qui débordent des jardins. On en fait des vêtements qu'on a envie de porter tous les jours.",
    piliers: [
      { titre: "Archipel", texte: "Chaque édition raconte un lieu, une histoire, un nom de chez nous." },
      { titre: "Culture",  texte: "Des visuels travaillés comme des gravures, entre héritage et street." },
      { titre: "Vibration",texte: "Pensé, dessiné et imprimé en Guadeloupe. On fait vivre le local." }
    ],
    signature: "Arnaud, fondateur de Tropikal Heat"
  },

  contact: {
    titre: "On parle ?",
    texte: "Une question sur une taille, une précommande, une collab ? Écris-nous, on répond vite.",
    sujets: ["Précommande", "Question sur une taille", "Collaboration", "Autre"]
  }
};
