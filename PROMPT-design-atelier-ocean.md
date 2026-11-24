# PROMPT MAX — Refonte du design d'otiumdigital.com : direction « Atelier Océan »

> À donner tel quel à un agent de code (Claude Code, Codex…) qui travaille dans le dépôt `refonte/`.
> Rôle attendu : directeur artistique + développeur front senior, exigeant sur chaque détail.

---

## 1. Mission

Refaire **entièrement le design** du site d'OTIUM (otiumdigital.com) pour qu'il soit **chaleureux, humain, haut de gamme et immédiatement rassurant pour une entreprise**.

**Source d'inspiration : walt.digital, pour l'esprit seulement.** On retient ce qui fait sa force :
- une agence qui paraît **proche et humaine** tout en restant **sérieuse** ;
- un **contraste fort** entre une couleur profonde et un fond crème ;
- des **illustrations au trait** qui racontent les services ;
- des **cartes de services claires** avec un bouton flèche rond ;
- des **valeurs illustrées**, des **preuves** (avis, logos), et un **pied de page qui invite au contact**.

**Interdiction absolue de copier Walt.** Ne reprendre ni son logo, ni sa police (Strawford), ni ses couleurs exactes (vert #062E33, menthe #4ADDA8, crème #FFFBEF), ni ses illustrations, ni ses textes, ni sa mise en page pixel pour pixel. OTIUM doit avoir **sa propre signature**, décrite ci-dessous. Si un élément ressemble trop à Walt, le changer.

---

## 2. Qui est OTIUM

- **Studio de création de sites internet conçus pour vendre.** Deux fondateurs :
  - **Abdoullah** : 15 ans de vente, stratégie et relation client ;
  - **Sidy** : développeur web et applications.
- **Promesse** : « Des sites internet conçus pour vendre ». Le site d'un client doit lui apporter des demandes, des réservations, des ventes.
- **Expertises** (une page chacune, déjà créées) :
  - création de site internet (`/creation-site-internet`) ;
  - boutique en ligne (`/site-e-commerce`) ;
  - refonte (`/refonte-site-internet`) ;
  - visibilité Google (`/referencement-google`) ;
  - accompagnement mensuel (`/accompagnement`).
- **Pages existantes à conserver** : `/studio`, `/contact` (formulaire qualifiant : besoin, secteur, budget obligatoire, échéance), `/mentions-legales`, `/confidentialite`, `/404`.
- **Cibles** :
  - entreprises de services à forte valeur ;
  - commerces et indépendants haut de gamme ;
  - marques qui vendent en ligne ;
  - PME qui veulent refaire leur site.
  - Partout dans le monde, 100 % à distance.
- **Le nom** : *otium*, en latin « le temps choisi pour penser ». Exigence de la marque : **design soigné, efficacité, simplicité**.
- **Le logo** : une planète cerclée d'un anneau (type Saturne). À garder ; seules ses couleurs peuvent être ajustées.

---

## 3. La direction artistique « Atelier Océan » (originale)

### Concept
Le calme d'un atelier au bord de l'océan : on prend le temps de penser, puis on construit quelque chose de précis.

**Motif signature : l'orbite.** L'anneau du logo devient un **trait continu** qui traverse le site. Il :
- relie les sections ;
- entoure les illustrations ;
- dessine les flèches ;
- se trace à l'écran quand on fait défiler la page.

Walt n'a pas ce motif : c'est notre identité.

### Palette (tokens CSS, à respecter strictement)
| Rôle | Nom | Valeur | Usage |
|---|---|---|---|
| Fond principal | Sable | `#F6F1E7` | Fond des pages |
| Surface | Écume | `#FFFCF6` | Cartes, formulaire |
| Encre / fond profond | Abysse | `#0A2540` | Titres, hero, bandes sombres, pied de page |
| Encre douce | Marée | `#3D5367` | Texte courant |
| Texte discret | Brume | `#7D8C99` | Légendes |
| Accent principal | Lagon | `#3BE3C8` | Boutons sur fond sombre, ronds de flèche, surlignages |
| Accent lisible sur clair | Lagon profond | `#0B7A70` | Liens et petits textes d'accent sur fond Sable (contraste AA) |
| Étincelle | Soleil | `#FFC65C` | Très rare : un point, une étoile, un mot clé |
| Filets | Dune | `#E3D9C6` | Bordures, séparateurs |

Règles :
- **un seul accent visible par écran** (Lagon) ; le Soleil n'apparaît que comme ponctuation ;
- **aucun dégradé criard** : seul un léger dégradé d'Abysse vers `#0E3A55` est autorisé dans le hero.

### Typographie (libre de droits, auto-hébergée en woff2)
- **Titres** : *Bricolage Grotesque*, licence OFL, graisses 500 à 700. Elle a du caractère, est chaleureuse et très différente de Strawford.
  - Titres principaux : 56 à 96 px sur ordinateur, interlignage 1,0, interlettrage −0,02 em.
- **Texte** : *Inter*, déjà présente dans `public/assets/fonts`. 17 à 18 px, interlignage 1,65.
- **Petits libellés** : Inter 13 px, majuscules, interlettrage 0,12 em, couleur Lagon profond.
- Échelle typographique fixe : 13 · 15 · 17 · 20 · 24 · 32 · 44 · 60 · 80 · 96.

### Illustrations (le cœur de la chaleur)
- Style : **dessin au trait continu** (une seule ligne qui ne se lève pas), trait Abysse de 1,75 px, quelques aplats Lagon, une touche de Soleil.
  - Volontairement différent des illustrations Walt, qui ont des volumes grisés et des mains « tampon ».
- **Format** : SVG en ligne, légers (moins de 6 Ko chacun), `aria-hidden` sauf s'ils portent un sens.
- **Liste à produire**, toutes originales :
  1. Hero : la planète OTIUM dont l'anneau devient un trait. Autour, en orbite, 3 « fenêtres de navigateur » stylisées (fausses pages : un titre, un bouton, une étoile d'avis). Pas de photo.
  2. Création de site : une fenêtre de navigateur et un curseur qui clique sur un bouton.
  3. Boutique en ligne : un panier dont l'anse est une orbite.
  4. Refonte : une vieille fenêtre qui se transforme en neuve, avec une flèche courbe.
  5. Visibilité Google : une loupe dont le cercle est l'anneau du logo, avec une flèche qui monte.
  6. Accompagnement : deux mains qui tiennent une petite plante dans une orbite.
  7. Le regard du vendeur : une bulle de dialogue et une poignée de main.
  8. Le développeur : des chevrons de code `</>` posés sur l'anneau.
  9. Contact et 404 : une bouteille à la mer qui flotte sur une ligne d'horizon.

### Formes et composants
- **Rayons** : cartes 20 px, boutons en pilule, champs 12 px.
- **Bouton principal** : pilule Abysse sur fond clair (Lagon sur fond sombre), texte 16 px graisse 600, suivi d'un **rond de flèche ↗** de 36 px en Lagon. Au survol, la flèche fait un quart de tour et le bouton remonte de 1 px.
- **Bouton secondaire** : contour de 1,5 px en Abysse, même rond de flèche, en version contour.
- **Carte de service** : fond Écume, filet Dune de 1 px, rayon 20 px, illustration à gauche (120 px), titre, 2 lignes de texte, rond ↗ à droite. Au survol : filet Lagon et ombre très douce (`0 18px 40px -24px rgba(10,37,64,.25)`).
- **Pastilles** (secteurs, engagements) : fond Écume, filet Dune, 14 px.
- **Ligne d'orbite** : un `path` SVG en filigrane qui serpente derrière les sections et se dessine au défilement (`stroke-dashoffset`). Désactivée si `prefers-reduced-motion`.
- **En-tête** : sur le hero sombre, en Abysse, logo et menu en blanc et bouton « Parlons-en ↗ » Lagon. En défilant, il devient fond Sable translucide flouté, avec un filet en bas.

### Mouvement (sobre)
- Apparition des blocs : fondu et montée de 12 px, 600 ms, courbe `cubic-bezier(.22,1,.36,1)`. Activée uniquement si `html.js` est présent, comme aujourd'hui.
- **Pas de carrousel automatique, pas de parallaxe lourde, pas de curseur personnalisé.**

---

## 4. Structure de l'accueil (dans cet ordre)

1. **Hero, fond Abysse**
   - Libellé : « Studio de création de sites internet ».
   - H1 : « Des sites internet conçus pour *vendre*. » Le mot « vendre » est en Lagon et souligné par un trait d'orbite dessiné à la main.
   - Deux paragraphes courts : qui on est, et ce qu'on apporte.
   - Bouton « Parler de mon projet ↗ » et lien « Nos expertises ».
   - À droite, l'illustration hero (planète, orbite, fenêtres).
   - En bas, 3 pastilles : Diagnostic offert · Les fondateurs en direct · Le site est à vous.
2. **Expertises, fond Sable** : H2 « Un studio, cinq expertises pour vendre en ligne », court texte, puis **grille 2 colonnes de cartes de services** illustrées avec ↗ (5 cartes + 1 carte « Diagnostic offert » mise en avant en Abysse).
3. **Le regard du vendeur** : 3 valeurs illustrées, sur le modèle des valeurs de Walt mais avec nos idées :
   - « Compris en 5 secondes » ;
   - « Une action claire par page » ;
   - « Des preuves qui rassurent ».
4. **Méthode** : 4 étapes sur une ligne d'orbite horizontale (sur mobile, verticale). Chaque étape est un point sur l'orbite :
   - Diagnostic (offert) ;
   - Stratégie et devis fixe ;
   - Conception ;
   - Mise en ligne puis croissance.
5. **Chiffres honnêtes**, bande Écume : **15 ans** d'expérience en vente · **24 h** pour répondre · **100 %** à distance.
   - **Aucun autre chiffre**, aucune note d'avis, aucun nombre de projets tant qu'ils ne sont pas réels.
6. **Vidéo** (fichier existant `assets/video/otium-histoire.mp4`) dans un cadre de téléphone illustré, avec la mention « Histoire illustrative ».
7. **Secteurs** en pastilles : restauration et hôtellerie, beauté et santé, immobilier, artisans d'exception, conseil et services, marques et commerces.
8. **Refonte** : liste des signes d'un site à refaire, et encadré « Diagnostic offert ».
9. **Le studio** : Abdoullah et Sidy, **sans photo**. Un monogramme dans une orbite illustrée et une illustration par fondateur (vendeur, développeur). Lien vers `/studio`.
10. **Questions fréquentes** : accordéon, une seule question ouverte à la fois (logique déjà en place).
11. **Appel final, fond Abysse**, avec l'illustration « bouteille à la mer » et le titre « Parlons de vos objectifs ↗ ».
12. **Pied de page, Abysse plus profond**
    - Grand lien « Nous contacter ↗ » ;
    - colonnes Expertises / Découvrir / Nous parler ;
    - mentions « TVA non applicable, art. 293 B du CGI », mentions légales, confidentialité.

**Emplacements prévus mais masqués tant qu'ils sont vides :**
- **Réalisations** (cartes de projets avec visuel plein cadre et titre) ;
- **Ils nous font confiance** (grille de logos séparés par des filets) ;
- **Avis clients** (note et source).

Ne les afficher **que** lorsqu'il y a de vrais projets, de vrais logos autorisés et de vrais avis vérifiables.

### Pages intérieures
- **Pages expertises** : petit hero Sable avec le fil d'Ariane, H1, illustration de l'expertise à droite et une carte « Ce que vous obtenez » ; puis approche, ce qu'on livre, méthode, questions, appel final.
- **Studio** : histoire du nom (otium), les fondateurs illustrés, les engagements.
- **Contact** : fond Sable, formulaire dans une carte Écume (rayon 20 px).
  - Garder **exactement** les mêmes champs, noms (`name`) et identifiants, sinon le Worker et `site.js` cassent.
  - Pastilles de choix rondes ; état sélectionné en Abysse avec texte blanc.

---

## 5. Contraintes non négociables

### Contenu
- **Aucun prix affiché**, nulle part : le tarif se discute au contact.
- **Aucun faux** : pas de témoignage, de note, de logo client, de chiffre ni de réalisation inventés.
- **Aucune photo des fondateurs** (choix du client) : uniquement des illustrations et des monogrammes.
- **Pas de référencement local** : aucune ville, aucune page « agence à … ». La cible est mondiale.
- **Garder tous les textes actuels** (titres, H1, meta, questions fréquentes) **sauf amélioration explicite**. Le référencement en dépend.
- Typographie française : espace insécable avant `? ! : ;` et dans « ».

### Technique (dépôt `refonte/site`)
- Site statique :
  - `build.mjs` assemble `src/pages/*.html` (front matter JSON) dans `src/layout.html`, et produit `dist/` et `sitemap.xml` ;
  - les styles sont dans `public/assets/site.css` et les scripts dans `public/assets/site.js` ;
  - le logo SVG et les icônes sont définis dans `build.mjs`.
- Production : Cloudflare Worker `otium` (`worker/index.js`). **Ne pas toucher** :
  - au formulaire `/api/contact` ;
  - aux redirections `redirects.json` ;
  - au fichier Google `googlef025c21d14ca37e2.html` ;
  - aux en-têtes de sécurité.
- **Aucune dépendance externe au chargement** : pas de CDN, pas de Google Fonts en ligne, pas de bibliothèque d'animation. Polices en woff2 dans `public/assets/fonts`, avec leurs licences OFL dans `LICENSES.txt`.
- **Performance** :
  - accueil sous 120 Ko de HTML et CSS hors polices et vidéo ;
  - aucune image de plus de 300 Ko ;
  - illustrations en SVG en ligne ;
  - Lighthouse mobile au moins 95 en performance, accessibilité, bonnes pratiques et SEO.
- **Accessibilité** :
  - contraste AA partout (attention à Lagon sur Sable : utiliser Lagon profond `#0B7A70`) ;
  - focus visible ;
  - navigation au clavier, y compris le menu mobile et les accordéons ;
  - `prefers-reduced-motion` respecté ;
  - textes alternatifs.
- **Responsive** : parfait de 360 px à 1600 px. Barre mobile en bas (« Parler de mon projet » + WhatsApp) conservée.
- **SEO** : chaque page garde un seul H1, sa balise `title`, sa meta description, sa canonique et ses données structurées.
- **L'image de partage** (`og:image`) doit être refaite dans le nouveau style, **sans prix**, et enregistrée sous un **nouveau nom de fichier** pour forcer WhatsApp et LinkedIn à la mettre à jour.

---

## 6. Méthode de travail obligatoire

1. **Lire** `refonte/README.md`, `site/README.md`, `build.mjs`, `layout.html`, `site.css`, `site.js` et toutes les pages avant de modifier quoi que ce soit.
2. **Proposer d'abord** une planche de style : palette, typographies, boutons, une carte de service, 2 illustrations, le hero sur ordinateur et sur mobile. **Attendre la validation** avant de tout dérouler.
3. Construire en local : `npm run dev`, puis http://localhost:8787.
4. **Après chaque étape** : `npm run check` (contrôle SEO bloquant) et `npm test` (21 tests du Worker), qui doivent passer.
5. **Aperçu avant publication**, toujours :
   - captures ordinateur et mobile de chaque page ;
   - poussée sur GitHub, ce qui met à jour l'aperçu Vercel caché de Google : https://otium-site-theta.vercel.app ;
   - tableau « avant → après » des textes modifiés.
6. **Ne publier qu'après un « go » explicite du client**, avec `npm run deploy`. Cette commande enchaîne construction, tests, contrôle, mise en ligne puis contrôle du site en ligne.
7. Noter la publication dans `refonte/CHANGELOG.md`.

---

## 7. Critères d'acceptation (tout doit être vrai)

- [ ] Personne ne peut dire « c'est une copie de Walt » : palette, police, illustrations, logo et textes sont différents. Seul l'esprit (chaleur, clarté, sérieux) est commun.
- [ ] Le motif d'orbite est présent et cohérent sur tout le site.
- [ ] Un dirigeant d'entreprise comprend en 5 secondes ce que fait OTIUM et comment le contacter.
- [ ] Aucun prix, aucun faux avis, aucune photo de personne, aucune ville ciblée.
- [ ] `npm run check` et `npm test` passent ; Lighthouse mobile au moins 95 sur les 4 critères.
- [ ] Contraste AA vérifié ; navigation au clavier complète ; animations coupées si mouvement réduit.
- [ ] Le formulaire de contact fonctionne toujours (envoi réel testé après publication).
- [ ] Nouvelle image de partage, sans prix, sous un nouveau nom de fichier.
- [ ] Captures et lien d'aperçu fournis **avant** toute mise en ligne.
