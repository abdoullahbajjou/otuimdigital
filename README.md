# OTIUM — site internet (refonte « Bleu océan »)

Projet partagé entre Abdoullah et Sidy.

| Dossier | Contenu |
| --- | --- |
| `site/` | Le site : pages (`src/pages`), gabarit (`src/layout.html`), styles et scripts (`public/assets`), Worker Cloudflare (`worker/`), tests. Voir `site/README.md`. |
| `video/` | Source de la vidéo « l'histoire de Karim » (animation HTML) et le MP4. |
| `maquettes/` | Les 3 maquettes de couleurs (blanc, bleu océan, chaud). |
| `apercus/` | Captures d'écran de suivi. |

## Travailler sur le site
1. `cd site`
2. `node build.mjs` construit le site dans `site/dist/`.
3. `npm test` lance les tests.
4. Aperçu local fidèle à la production : `npx wrangler dev --port 8787` → http://localhost:8787

## Où le site est publié
- **Vercel** (aperçu de travail, non indexé par Google) : chaque envoi sur GitHub met l'aperçu à jour automatiquement.
- **otiumdigital.com** (le vrai site) : hébergé sur Cloudflare. On ne le remplace que d'un commun accord (`npm run deploy` dans `site/`).

## Méthode de travail (à respecter pour ne pas casser le référencement)
1. **Modifier** en local, une chose à la fois. Gros changement → une branche (`git switch -c nom-du-sujet`).
2. **Envoyer sur GitHub** → Vercel construit un lien de test (non indexé par Google). Vérifier sur téléphone et ordinateur.
3. **Contrôler** : `cd site && npm run check` (titres, descriptions, liens, sitemap, fichier Google, redirections…).
4. **Publier sur otiumdigital.com** : `cd site && npm run deploy`. La publication est bloquée si un contrôle échoue, puis le site en ligne est revérifié automatiquement.
5. **Noter** la publication dans `CHANGELOG.md` (date + ce qui a changé).
6. En cas de problème en ligne : `cd site && npx wrangler rollback` (retour à la version précédente).

## Les 3 règles d'or du référencement
- **Ne jamais renommer ou supprimer une page publiée sans ajouter une redirection** dans `site/redirects.json` (`"/ancienne-adresse": "/nouvelle-adresse"`). Ne jamais retirer une ligne de ce fichier.
- **Améliorer le contenu qui fonctionne, ne pas le supprimer** (voir Search Console → Performances).
- **Ne jamais mettre « noindex » sur le vrai site.** Il n'existe que sur Vercel (`site/vercel.json`). Ne jamais toucher à `site/public/googlef025c21d14ca37e2.html` ni à `robots.txt`.
- Titres et descriptions : les modifier avec parcimonie, puis attendre 2 à 4 semaines avant de juger.

## Règles d'équipe
- Une modification = un commit avec un message clair en français.
- Pour un gros changement : une branche, puis une demande de fusion (Pull Request) que l'autre relit.
- Ne jamais mettre de mot de passe ou de clé API dans le code (la clé Resend est un secret Cloudflare).
