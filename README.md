# Tropikal Heat · site web

Site vitrine et précommandes de la marque Tropikal Heat (tropikalheat.com).
HTML, CSS et JavaScript, sans framework ni dépendance.

## Structure

```
index.html       Accueil
karukera.html    Édition 01 KARUKERA : variantes, tailles, précommande
univers.html     L'univers de la marque
contact.html     Formulaire de contact
css/style.css    Tout le design (palette, typos, mises en page)
js/content.js    TOUT le contenu : textes, prix, liens  ← à modifier ici
js/main.js       Logique : en-tête, pied de page, variantes, précommande
assets/          Emblème, monogramme, visuels du dos, polices
```

## Modifier le contenu

Tout se change dans `js/content.js` : textes, prix, tailles, réseaux, email.
Les valeurs entre [crochets] sont à compléter (ex. la signature sur la page Univers).

## Précommande

- Tant que `edition.precommande.lienPaiement` est vide, le bouton « Je précommande »
  ouvre un email prérempli (variante, taille, prix) vers contact@tropikalheat.com.
- Quand tu crées un lien de paiement (Stripe Payment Links, SumUp…), colle-le dans
  `lienPaiement` : le bouton ouvrira directement la page de paiement.

## Ajouter une édition

1. Ajoute ses visuels dans `assets/`.
2. Duplique `karukera.html` et le bloc `edition` de `content.js`.

## Mettre en ligne

Site statique : il fonctionne sur GitHub Pages, Netlify ou Vercel (gratuits).
Relie ensuite tropikalheat.com dans les réglages DNS de ton registraire.

## Couleurs

Mangue #FF9A1F · Corail #F2484A · Hibiscus #E5175F · Noir #000000 · Blanc #FFFFFF
Typos : Pirata One (titres), Oswald (labels), Public Sans (texte)
