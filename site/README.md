# OTIUM — nouveau site (thème « Bleu océan »)

Site statique + un petit Worker Cloudflare (formulaire de contact et redirection www).

## Structure
- `src/layout.html` : en-tête, pied de page, balises SEO communes.
- `src/pages/*.html` : une page par fichier (en-tête JSON : titre, description, chemin, `noindex`).
- `public/` : CSS, JS, polices (Inter / Inter Tight, licence OFL), images, favicon, robots.txt.
- `worker/index.js` : `/api/contact` (envoi via Resend), redirection `www` → domaine principal, en-têtes de sécurité et de cache.
- `build.mjs` : assemble `src` + `public` → `dist/` et génère `sitemap.xml`.
- `tests/` : tests du Worker (`npm test`).

## Commandes
- `node build.mjs` : construit `dist/`.
- `npm test` : lance les tests.
- `npx wrangler dev --port 8787` : site en local sur http://localhost:8787 (après un build).

## Activer l'envoi des e-mails du formulaire (à faire une fois)
Sans cette étape, le formulaire fonctionne quand même : il propose d'envoyer la demande par WhatsApp, déjà rédigée.
1. Créer un compte gratuit sur resend.com (3 000 e-mails par mois).
2. Dans Resend, ajouter le domaine `otiumdigital.com` et copier les enregistrements DNS indiqués dans Cloudflare (DNS > Enregistrements).
3. Créer une clé API dans Resend, puis : `npx wrangler secret put RESEND_API_KEY` (coller la clé).
4. L'expéditeur est défini dans `wrangler.jsonc` (`MAIL_FROM`) : `OTIUM <site@otiumdigital.com>`.

## Mise en ligne (uniquement après validation)
`npm run deploy` enchaîne : build → tests → contrôle avant publication (`tools/check.mjs`) → `wrangler deploy` → contrôle du site en ligne (`tools/check-live.mjs`).
Si un contrôle échoue, la publication est bloquée (ou signalée si c'est en ligne).
- `npm run check` : contrôle seul, sans publier.
- `npm run check:live` : contrôle du site en ligne seul.
- Retour arrière : `npx wrangler rollback`.

## Redirections
`redirects.json` : `"/ancienne-adresse": "/nouvelle-adresse"` (redirection 301 gérée par le Worker). À compléter dès qu'une page publiée est renommée ou supprimée. Ne jamais retirer une ligne.
