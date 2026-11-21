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

## Règles d'équipe
- Une modification = un commit avec un message clair en français.
- Pour un gros changement : une branche, puis une demande de fusion (Pull Request) que l'autre relit.
- Ne jamais mettre de mot de passe ou de clé API dans le code.
