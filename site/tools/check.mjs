// Contrôle AVANT publication : bloque la mise en ligne si quelque chose risque d'abîmer le site ou le référencement.
// Usage : node build.mjs && node tools/check.mjs   (lancé automatiquement par npm run deploy)
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const errors = [], warnings = [];
const err = m => errors.push(m), warn = m => warnings.push(m);

if (!existsSync(dist)) { console.error('✖ Le dossier dist/ est absent : lancez d\'abord « node build.mjs ».'); process.exit(1); }

async function walk(dir) { const out = []; for (const e of await readdir(dir, { withFileTypes: true })) { const p = join(dir, e.name); if (e.isDirectory()) out.push(...await walk(p)); else out.push(p); } return out; }
const files = await walk(dist);
const rel = f => '/' + relative(dist, f).replaceAll('\\', '/');
const fileSet = new Set(files.map(rel));
const pageUrl = f => { const r = rel(f).replace(/\.html$/, ''); return r === '/index' ? '/' : r; };
const exists = path => {
  const p = decodeURIComponent(path.split('#')[0].split('?')[0]);
  if (p === '/' || fileSet.has(p) || fileSet.has(p + '.html') || fileSet.has(p.replace(/\/$/, '') + '/index.html')) return true;
  return false;
};

// --- Pages HTML ---
const pages = files.filter(f => f.endsWith('.html') && !/\/google[0-9a-f]+\.html$/.test(rel(f)));
const titles = new Map(), descs = new Map(), indexable = new Set();
for (const f of pages) {
  const html = await readFile(f, 'utf8'), url = pageUrl(f), is404 = url === '/404';
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim();
  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] || '';
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (!title) err(`${url} : pas de <title>.`); else if (title.length > 65) warn(`${url} : titre long (${title.length} caractères), Google risque de le couper.`);
  if (!desc) err(`${url} : pas de meta description.`); else if (desc.length > 165) warn(`${url} : description longue (${desc.length} caractères).`);
  if (h1 !== 1) err(`${url} : ${h1} titres <h1> (il en faut exactement 1).`);
  if (!canonical) err(`${url} : pas d'adresse canonique.`); else if (!canonical.startsWith('https://otiumdigital.com')) err(`${url} : l'adresse canonique ne pointe pas vers otiumdigital.com (${canonical}).`);
  if (/\{\{\s*[\w:-]+\s*\}\}/.test(html)) err(`${url} : une variable du gabarit n'a pas été remplacée.`);
  if (/OTUIM/i.test(html)) err(`${url} : le mot « OTUIM » (faute de frappe) est présent.`);
  if (/\bTTC\b/.test(html)) err(`${url} : la mention « TTC » est présente (micro-entreprise : TVA non applicable).`);
  if (/chatgpt\.site|vercel\.app/i.test(html)) err(`${url} : un lien vers un site de test (chatgpt.site / vercel.app) est présent.`);
  if (!is404 && !robots.includes('noindex')) {
    indexable.add(url);
    if (title) titles.set(title, [...(titles.get(title) || []), url]);
    if (desc) descs.set(desc, [...(descs.get(desc) || []), url]);
  }
  // Liens internes et ressources
  for (const [, href] of html.matchAll(/(?:href|src|poster)="(\/[^"]*)"/g)) {
    if (href.startsWith('//') || href.startsWith('/api/')) continue;
    if (!exists(href)) err(`${url} : lien ou fichier introuvable → ${href}`);
  }
  // Ancres internes (#section) sur la page d'accueil
  for (const [, anchor] of html.matchAll(/href="\/#([\w-]+)"/g)) {
    const home = await readFile(join(dist, 'index.html'), 'utf8');
    if (!home.includes(`id="${anchor}"`)) err(`${url} : le lien /#${anchor} ne mène à aucune section de l'accueil.`);
  }
}
for (const [t, urls] of titles) if (urls.length > 1) err(`Titre identique sur plusieurs pages (${urls.join(', ')}) : « ${t} »`);
for (const [d, urls] of descs) if (urls.length > 1) err(`Description identique sur plusieurs pages (${urls.join(', ')}).`);
if (!indexable.has('/')) err('La page d\'accueil est marquée « ne pas indexer » !');

// --- Sitemap ---
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8').catch(() => '');
if (!sitemap) err('sitemap.xml est absent.');
const inSitemap = new Set([...sitemap.matchAll(/<loc>https:\/\/otiumdigital\.com([^<]*)<\/loc>/g)].map(m => m[1] || '/'));
for (const u of inSitemap) { if (!exists(u)) err(`Sitemap : ${u} n'existe pas.`); if (!indexable.has(u)) err(`Sitemap : ${u} est marquée « ne pas indexer », elle ne doit pas y figurer.`); }
for (const u of indexable) if (!inSitemap.has(u)) err(`Sitemap : la page indexable ${u} est absente du sitemap.`);

// --- robots.txt ---
const robotsTxt = await readFile(join(dist, 'robots.txt'), 'utf8').catch(() => '');
if (!robotsTxt) err('robots.txt est absent.');
if (/^\s*Disallow:\s*\/\s*$/m.test(robotsTxt)) err('robots.txt bloque TOUT le site (« Disallow: / ») !');
if (!/Sitemap:\s*https:\/\/otiumdigital\.com\/sitemap\.xml/.test(robotsTxt)) err('robots.txt ne référence pas le sitemap.');

// --- Fichier de vérification Google ---
const worker = await readFile(join(root, 'worker', 'index.js'), 'utf8');
const gFiles = [...worker.matchAll(/'(google[0-9a-f]+\.html)'/g)].map(m => m[1]);
if (!gFiles.length) err('Le Worker ne déclare plus le fichier de vérification Google : Search Console perdrait l\'accès.');
for (const g of gFiles) if (!fileSet.has('/' + g)) err(`Le fichier de vérification Google ${g} a disparu de public/ : ne le supprimez pas.`);
if (/X-Robots-Tag/i.test(worker)) err('Le Worker envoie un en-tête X-Robots-Tag : risque de cacher tout le site à Google.');

// --- Redirections ---
let redirects = {};
try { redirects = JSON.parse(await readFile(join(root, 'redirects.json'), 'utf8')); } catch (e) { err('redirects.json est illisible : ' + e.message); }
for (const [from, to] of Object.entries(redirects)) {
  if (from.startsWith('_')) continue;
  if (!from.startsWith('/') || typeof to !== 'string' || !to.startsWith('/')) { err(`Redirection invalide : ${from} → ${to} (les deux doivent commencer par « / »).`); continue; }
  if (from === to) err(`Redirection en boucle : ${from} → ${to}.`);
  if (redirects[to]) err(`Redirection en chaîne : ${from} → ${to} → ${redirects[to]} (pointez directement vers la destination finale).`);
  if (!exists(to)) err(`Redirection vers une page qui n'existe pas : ${from} → ${to}.`);
  if (from !== '/index.html' && exists(from) && from !== '/') err(`Redirection inutile : ${from} existe encore comme page (elle ne serait jamais affichée).`);
}

// --- Poids des fichiers ---
for (const f of files) {
  const { size } = await stat(f), r = rel(f);
  if (/\.(png|jpe?g|webp|avif|gif|svg)$/i.test(r) && size > 400_000) warn(`Image lourde : ${r} (${Math.round(size / 1024)} Ko). Compressez-la (WebP, < 300 Ko).`);
  if (/\.(mp4|webm)$/i.test(r) && size > 8_000_000) warn(`Vidéo lourde : ${r} (${(size / 1e6).toFixed(1)} Mo).`);
}

// --- Résultat ---
for (const w of warnings) console.log('⚠  ' + w);
if (errors.length) {
  for (const e of errors) console.error('✖  ' + e);
  console.error(`\n✖ ${errors.length} problème(s) : publication BLOQUÉE. Corrigez-les puis relancez.`);
  process.exit(1);
}
console.log(`✔ Contrôle OK : ${indexable.size} pages indexables, ${inSitemap.size} dans le sitemap, ${Object.keys(redirects).filter(k => !k.startsWith('_')).length} redirections, fichier Google présent.`);
