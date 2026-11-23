// Contrôle APRÈS publication, sur le vrai site otiumdigital.com.
// Usage : node tools/check-live.mjs   (lancé automatiquement à la fin de npm run deploy)
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const BASE = 'https://otiumdigital.com';
const root = fileURLToPath(new URL('..', import.meta.url));
const errors = [];
const get = (path, opts = {}) => fetch(BASE + path, { redirect: 'manual', headers: { 'Cache-Control': 'no-cache' }, ...opts });

const sitemap = await (await get('/sitemap.xml')).text();
const urls = [...sitemap.matchAll(/<loc>https:\/\/otiumdigital\.com([^<]*)<\/loc>/g)].map(m => m[1] || '/');
if (!urls.length) errors.push('Le sitemap en ligne est vide ou illisible.');

for (const u of urls) {
  const r = await get(u);
  const body = await r.text();
  if (r.status !== 200) { errors.push(`${u} répond ${r.status} au lieu de 200.`); continue; }
  if (/noindex/i.test(r.headers.get('x-robots-tag') || '')) errors.push(`${u} : en-tête « noindex » envoyé, Google va retirer la page !`);
  if (/<meta name="robots" content="[^"]*noindex/i.test(body)) errors.push(`${u} : balise « noindex » dans la page !`);
}

const robots = await (await get('/robots.txt')).text();
if (/^\s*Disallow:\s*\/\s*$/m.test(robots)) errors.push('robots.txt bloque tout le site en ligne !');

const worker = await readFile(join(root, 'worker', 'index.js'), 'utf8');
for (const [, g] of worker.matchAll(/'(google[0-9a-f]+\.html)'/g)) {
  const r = await get('/' + g), t = await r.text();
  if (r.status !== 200 || t.trim() !== `google-site-verification: ${g}`) errors.push(`Le fichier Google ${g} ne répond plus correctement (${r.status}).`);
}

const www = await fetch('https://www.otiumdigital.com/', { redirect: 'manual' });
if (www.status !== 301 || !(www.headers.get('location') || '').startsWith(BASE)) errors.push(`www.otiumdigital.com ne redirige pas en 301 vers ${BASE} (${www.status}).`);

const redirects = JSON.parse(await readFile(join(root, 'redirects.json'), 'utf8'));
for (const [from, to] of Object.entries(redirects)) {
  if (from.startsWith('_')) continue;
  const r = await get(from);
  if (r.status !== 301 || new URL(r.headers.get('location') || '', BASE).pathname !== to) errors.push(`Redirection ${from} → ${to} ne fonctionne pas en ligne (${r.status}).`);
}

const missing = await get('/cette-page-n-existe-pas-' + Date.now());
if (missing.status !== 404) errors.push(`Une page inexistante répond ${missing.status} au lieu de 404.`);

if (errors.length) {
  for (const e of errors) console.error('✖  ' + e);
  console.error(`\n✖ ${errors.length} problème(s) EN LIGNE. Pour revenir à la version précédente : npx wrangler rollback`);
  process.exit(1);
}
console.log(`✔ Site en ligne OK : ${urls.length} pages en 200 et indexables, robots.txt, fichier Google, www et redirections vérifiés.`);
