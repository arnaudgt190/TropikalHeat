/* =========================================================
   TROPIKAL HEAT · CONTENU DU SITE
   Modifie les textes, prix et liens ici : pas besoin de toucher
   au HTML ni au CSS. Les [CROCHETS] sont à compléter.
   ========================================================= */
window.CONTENT = {
  marque: {
    nom: "Tropikal Heat",
    slogan: "Feel the heat",
    baseline: "Archipel // Culture // Vibration",
    email: "contact@tropikalheat.com",
    /* Adresse du script Google (Apps Script) qui reçoit précommandes, messages et inscriptions */
    formulaire: "https://script.google.com/macros/s/AKfycbwQsh4y664ixW-r9-txINHaNzYIUaTvSaLtTL0_vy2gVPen3EPbfHqrFqtJbVyLvuro/exec",
    instagram: "https://instagram.com/tropikalheat",
    tiktok: "https://tiktok.com/@tropikalheat",
    instagramDM: "https://ig.me/m/tropikalheat",
    ville: "Le Gosier, Guadeloupe"
  },

    accueil: {
    surtitre: "Streetwear né en Guadeloupe",
    titre: "Le soleil de l'archipel, à porter tous les jours.",
    texte: "Tropikal Heat, c'est la chaleur des îles cousue dans un streetwear propre, pensé pour la vie de tous les jours. Des pièces imprimées en Guadeloupe.",
    bouton: "Découvrir l'édition KARUKERA",
    reassurance: ["Livraison gratuite au Gosier, à Pointe-à-Pitre et aux Abymes", "Tailles S à L", "Impression DTF réalisée en Guadeloupe"],
    bandeau: ["Édition limitée", "Streetwear des îles", "Feel the heat", "Karukera", "Made in Guadeloupe", "Précommande ouverte", "Vibration", "L'île aux belles eaux"]
  },

  edition: {
    nom: "KARUKERA",
    numero: "Édition 01",
    accroche: "L'île aux belles eaux.",
    texte: "Karukera, c'est le nom que les Kalinagos donnaient à la Guadeloupe. Pour ma première édition, je lui rends hommage : le soleil qui se lève sur le corail, la vague, les hibiscus. Un dos illustré façon gravure, le monogramme TH au cœur.",
    stock: 50,
    /* Une ligne par t-shirt : nom, photo du carrousel et prix.
       Change le prix des versions dégradées ici si besoin. */
    /* Prix de lancement : valable pour les N premières pièces précommandées
       (le compteur lit les précommandes du Google Sheet). actif: false pour l'arrêter. */
    lancement: { actif: true, pieces: 20 },
    variantes: [
      { id: "noir-degrade",  nom: "Noir · dos en dégradé",     mockup: "assets/lookbook/mockup-noir-TH-contour.webp",  prix: "45 €", prixLancement: "39,99 €" },
      { id: "blanc-degrade", nom: "Blanc · dos en dégradé",    mockup: "assets/lookbook/mockup-blanc-TH-contour.webp", prix: "45 €", prixLancement: "39,99 €" },
      { id: "noir",          nom: "Noir · impression blanche", mockup: "assets/lookbook/mockup-noir-basique.webp",     prix: "40 €", prixLancement: "34,99 €" },
      { id: "blanc",         nom: "Blanc · impression noire",  mockup: "assets/lookbook/mockup-blanc-basique.webp",    prix: "40 €", prixLancement: "34,99 €" }
    ],
    /* Bandeau de la Boutique (le message du prix de lancement s'ajoute devant) */
    bandeauBoutique: ["Feel the heat", "Précommande ouverte"],
    prix: "À partir de 40 €",
    tailles: ["S", "M", "L"],
    /* Livraison (uniquement en Guadeloupe, pas d'envoi par la poste).
       Règle : moins de 10 km depuis Le Gosier = gratuit, puis 3 € par tranche de 10 km.
       Les distances (km) sont des estimations par la route : corrige-les si besoin. */
    livraison: {
      gratuitSousKm: 10,
      prixParTranche: 3,
      trancheKm: 10,
      communes: [
        { nom: "Le Gosier", km: 3 },
        { nom: "Pointe-à-Pitre", km: 8 },
        { nom: "Les Abymes", km: 9 },
        { nom: "Sainte-Anne", km: 15 },
        { nom: "Baie-Mahault", km: 17 },
        { nom: "Petit-Bourg", km: 22 },
        { nom: "Morne-à-l'Eau", km: 23 },
        { nom: "Lamentin", km: 26 },
        { nom: "Saint-François", km: 27 },
        { nom: "Le Moule", km: 28 },
        { nom: "Goyave", km: 30 },
        { nom: "Petit-Canal", km: 30 },
        { nom: "Port-Louis", km: 37 },
        { nom: "Sainte-Rose", km: 38 },
        { nom: "Capesterre-Belle-Eau", km: 40 },
        { nom: "Anse-Bertrand", km: 42 },
        { nom: "Deshaies", km: 55 },
        { nom: "Trois-Rivières", km: 55 },
        { nom: "Basse-Terre", km: 58 },
        { nom: "Gourbeyre", km: 58 },
        { nom: "Saint-Claude", km: 60 },
        { nom: "Baillif", km: 62 },
        { nom: "Vieux-Fort", km: 62 },
        { nom: "Pointe-Noire", km: 68 },
        { nom: "Vieux-Habitants", km: 70 },
        { nom: "Bouillante", km: 72 }
      ]
    },
    details: [
      "Coton 190 g/m², coupe unisexe",
      "Monogramme TH au cœur 6 cm · dos 27 × 36 cm",
      "Impression DTF réalisée en Guadeloupe",
      "Livraison gratuite au Gosier, à Pointe-à-Pitre et aux Abymes, à partir de 3 € ailleurs en Guadeloupe",
      "Édition limitée à 50 pièces, dont les 20 premières au prix de lancement",
      "Livraison en Guadeloupe uniquement pour l'instant (pas encore d'envoi en Martinique, en Guyane ni en métropole)"
    ],
    precommande: {
      titre: "Précommande ouverte",
      texte: "Réserve ta pièce avant la sortie officielle ! Livraison offerte au Gosier, à Pointe-à-Pitre et aux Abymes, et à partir de 3 € ailleurs en Guadeloupe.",
      /* Colle ici ton lien de paiement Stripe ou SumUp quand il est prêt.
         Tant qu'il est vide, le bouton ouvre le petit formulaire de précommande. */
      lienPaiement: "",
      merci: "Merci ! Ta précommande est bien reçue 🔥 Je te recontacte très vite pour le paiement et la livraison. Ta pièce est à toi dès réception du paiement."
    }
  },

  univers: {
    titre: "Un univers, pas juste un vêtement.",
    intro: "Tropikal Heat est né d'une idée simple : porter ce qu'on aime de nos îles, sans cliché. Le soleil qui tape, la mer qui gronde, les fleurs qui débordent des jardins. On en fait des vêtements qu'on a envie de porter tous les jours.",
    piliers: [
      { titre: "Archipel", texte: "Chaque édition raconte un lieu, une histoire, un nom de chez nous." },
      { titre: "Culture",  texte: "Des visuels travaillés comme des gravures, entre héritage et street." },
      { titre: "Vibration",texte: "Le rythme, la chaleur et l'énergie de la Guadeloupe." }
    ],
    signature: "Arnaud, fondateur de Tropikal Heat",
    fondateur: {
      prenom: "Arnaud",
      texte: "J'ai lancé Tropikal Heat avec mes propres moyens, ici en Guadeloupe, avec une envie simple : porter la chaleur de nos îles avec style. Du logo au site web, chaque détail est pensé et fait ici.",
      appel: "Je veux que cette marque aille loin, et ça commence avec vous."
    }
  },

  inscription: {
    titre: "Sois prévenu de la sortie",
    texte: "Laisse ton prénom et ton email : tu seras le premier informé de l'ouverture des ventes, des prochaines éditions et des drops.",
    bouton: "Je m'inscris",
    merci: "C'est noté ! Tu seras parmi les premiers prévenus.",
    mentions: "En t'inscrivant, tu acceptes de recevoir les emails de Tropikal Heat. Tu peux te désinscrire à tout moment."
  },

  contact: {
    titre: "Je t'écoute",
    texte: "Une question sur une taille, une précommande, une collab ? Écris-moi, je te réponds sous 24 à 48 h.",
    sujets: ["Précommande", "Question sur une taille", "Collaboration", "Autre"]
  }
};
