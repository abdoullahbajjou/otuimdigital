// Assemble les pages : src/pages/*.html + src/layout.html -> dist/
// Chaque page commence par un commentaire JSON : <!--{"title":"…","description":"…","path":"/…"}-->
import { readFile, writeFile, mkdir, readdir, cp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const src = join(root, 'src'), out = join(root, 'dist');
const v = Date.now().toString(36);

const logo = '<svg viewBox="0 0 64 64" fill="none" stroke-linecap="round" aria-hidden="true"><path d="M12.9 40.7C4.6 42.5 1.5 41.2 4.8 36.8c3-4.3 12.2-11.3 23.9-17.4 15-7.9 28.4-11.6 30.6-8.1 1.2 1.9-1.2 5.3-6.3 9.5" stroke="#3BE3C8" stroke-width="2.4" transform="translate(0 5)"/><circle cx="32" cy="32" r="17.5" stroke="#F2FAFF" stroke-width="3.2"/><path d="M59.1 16.7c2.3 4.4-9.9 15.4-25.8 22.9C19 46.3 7.6 49.1 4.2 46.8" stroke="#3BE3C8" stroke-width="3.4"/></svg>';

const ic = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
const icons = {
  check: ic('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  clock: ic('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  search: ic('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'),
  ghost: ic('<path d="M4 20V10a8 8 0 0116 0v10l-3-2-2.5 2-2.5-2-2.5 2L7 18z"/><circle cx="9.5" cy="10.5" r="1"/><circle cx="14.5" cy="10.5" r="1"/>'),
  phone: ic('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
  door: ic('<path d="M5 21V4a1 1 0 011-1h9l4 2v16"/><path d="M3 21h18"/><circle cx="13" cy="12" r="1"/>'),
  food: ic('<path d="M7 3v8a2 2 0 002 2v8"/><path d="M5 3v6M9 3v6"/><path d="M16 21V3c2 1 3 4 3 7s-1 3-3 3"/>'),
  scissors: ic('<circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="M8.5 8.5L20 19M8.5 15.5L20 5"/>'),
  car: ic('<path d="M3 16v-4l2-5h14l2 5v4"/><path d="M3 16h18v2H3z"/><circle cx="7.5" cy="16" r="1.5"/><circle cx="16.5" cy="16" r="1.5"/>'),
  bag: ic('<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 016 0v2"/>'),
  tool: ic('<path d="M14.5 6.5a4 4 0 00-5.3 5.3L3 18l3 3 6.2-6.2a4 4 0 005.3-5.3l-2.5 2.5-2.5-2.5z"/>'),
  user: ic('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>'),
  mobile: ic('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
  google: ic('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/><path d="M8.5 11h5"/>'),
  chat: ic('<path d="M4 5h16v11H9l-5 4z"/>'),
  key: ic('<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>'),
  hand: ic('<path d="M8 13V6a1.5 1.5 0 013 0v5"/><path d="M11 11V4.5a1.5 1.5 0 013 0V11"/><path d="M14 11V6a1.5 1.5 0 013 0v7c0 4-2.5 8-7 8-3 0-4.5-2-6-5l-1.5-3a1.5 1.5 0 012.5-1.5L8 14"/>'),
  mail: ic('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  wa: '<svg class="wa" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 00-11.2 19.6L3 29l6.6-1.7A13 13 0 1016 3zm0 23.6a10.6 10.6 0 01-5.4-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.6 10.6 0 1116 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.7 8.7 0 01-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 00-.9.4 3.6 3.6 0 00-1.1 2.7 6.3 6.3 0 001.3 3.3 14.4 14.4 0 005.5 4.9c2 .9 2.8.9 3.9.8a3.3 3.3 0 002.1-1.5 2.7 2.7 0 00.2-1.5c-.1-.2-.3-.2-.6-.4z"/></svg>',
};

const mbar = `<div class="mbar" id="mbar"><a class="btn" href="/contact">Parler de mon projet</a><a class="btn ghost wa-btn" href="https://wa.me/41779238903" rel="noopener" aria-label="Écrire sur WhatsApp">${icons.wa}</a></div>`;

const layout = await readFile(join(src, 'layout.html'), 'utf8');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(join(root, 'public'), out, { recursive: true });

const files = (await readdir(join(src, 'pages'))).filter(f => f.endsWith('.html'));
for (const f of files) {
  let raw = await readFile(join(src, 'pages', f), 'utf8');
  const m = raw.match(/^<!--(\{[\s\S]*?\})-->\s*/);
  if (!m) throw new Error('Front matter manquant : ' + f);
  const meta = JSON.parse(m[1]);
  raw = raw.slice(m[0].length);
  const jsonld = (meta.jsonld || []).map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  let html = layout
    .replace('{{body}}', raw)
    .replaceAll('{{title}}', meta.title)
    .replaceAll('{{description}}', meta.description)
    .replaceAll('{{path}}', meta.path)
    .replace('{{robots}}', meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large')
    .replace('{{jsonld}}', jsonld)
    .replace('{{bodyclass}}', meta.bodyclass || '')
    .replace('{{mbar}}', meta.nombar ? '' : mbar)
    .replaceAll('{{v}}', v)
    .replaceAll('{{logo}}', logo)
    .replace(/\{\{cur:(\w[\w-]*)\}\}/g, (_, k) => meta.current === k ? ' aria-current="page"' : '')
    .replace(/\{\{i:(\w+)\}\}/g, (_, k) => { if (!icons[k]) throw new Error('Icône inconnue ' + k); return icons[k]; });
  if (/\{\{/.test(html)) throw new Error('Variable non remplacée dans ' + f + ' : ' + html.match(/\{\{[^}]*\}\}/)[0]);
  await writeFile(join(out, f), html);
}

// Sitemap (pages indexables)
const today = new Date().toISOString().slice(0, 10);
const pages = [];
for (const f of files) {
  const meta = JSON.parse((await readFile(join(src, 'pages', f), 'utf8')).match(/^<!--(\{[\s\S]*?\})-->/)[1]);
  if (!meta.noindex && meta.path) pages.push(meta.path);
}
await writeFile(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `  <url><loc>https://otiumdigital.com${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log('OK', files.length, 'pages ->', out);
