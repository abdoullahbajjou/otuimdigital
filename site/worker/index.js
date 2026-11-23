// OTIUM — Worker Cloudflare : sert le site statique + reçoit le formulaire de contact.
// Secrets attendus (wrangler secret put) : RESEND_API_KEY. Variable : MAIL_FROM (ex. "OTIUM <site@otiumdigital.com>").
const ORIGINS = new Set(['https://otiumdigital.com', 'https://www.otiumdigital.com']);
const TO = 'contact@otiumdigital.com';
const FORMULES = ['Vitrine (499 €)', 'Site complet (700 €)', 'E-commerce (1 200 €)', 'Je ne sais pas encore', 'Refonte de mon site actuel'];
const ACTIVITES = ['Restaurant / café', 'Institut de beauté', 'Chauffeur privé / VTC', 'Librairie', 'Boutique / commerce', 'Artisan', 'Indépendant / profession libérale', 'Autre'];
import REDIRECTS from '../redirects.json' with { type: 'json' };

const hits = new Map(); // limite simple, par instance

export function redirectFor(path) {
  if (path.startsWith('/_')) return null;
  const clean = path.length > 1 ? path.replace(/\/+$/, '') : path;
  const to = REDIRECTS[clean] ?? REDIRECTS[path];
  return typeof to === 'string' && to.startsWith('/') && to !== clean ? to : null;
}
// Google Search Console (méthode « fichier HTML ») — ne pas supprimer, sinon la propriété est perdue.
const GOOGLE_VERIFICATION = ['googlef025c21d14ca37e2.html'];

const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
const str = (v, max) => (typeof v === 'string' ? v.trim() : '').slice(0, max);
const emailOk = v => /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(v);

export function validate(d) {
  if (!d || typeof d !== 'object' || Array.isArray(d)) return null;
  if (d.site_web) return { spam: true };
  if (typeof d.elapsed === 'number' && d.elapsed < 2500) return { spam: true };
  const f = { kind: d.kind === 'question' ? 'question' : 'projet', nom: str(d.nom, 100), email: str(d.email, 254), telephone: str(d.telephone, 40), site_actuel: str(d.site_actuel, 200), message: str(d.message, 3000) };
  if (f.nom.length < 2 || /[\r\n]/.test(f.nom) || !emailOk(f.email) || d.consent !== true) return null;
  if (f.kind === 'projet') {
    f.formule = str(d.formule, 40); f.activite = str(d.activite, 60); f.activite_autre = str(d.activite_autre, 80);
    if (!FORMULES.includes(f.formule) || !ACTIVITES.includes(f.activite)) return null;
    if (f.activite === 'Autre' && f.activite_autre.length < 2) return null;
  } else if (f.message.length < 5) return null;
  return f;
}

export function buildEmail(f, from) {
  const act = f.activite === 'Autre' ? `Autre : ${f.activite_autre}` : f.activite;
  const subject = f.kind === 'projet' ? `[OTIUM] Projet — ${f.formule} — ${act}` : `[OTIUM] Question — ${f.nom}`;
  const text = [
    f.kind === 'projet' ? 'Nouvelle demande de projet' : 'Nouvelle question', '',
    `Nom : ${f.nom}`, `E-mail : ${f.email}`, `Téléphone / WhatsApp : ${f.telephone || '—'}`, `Site actuel : ${f.site_actuel || '—'}`,
    ...(f.kind === 'projet' ? [`Formule : ${f.formule}`, `Activité : ${act}`] : []),
    '', 'Message :', f.message || '—',
  ].join('\n');
  return { from, to: [TO], reply_to: f.email, subject, text };
}

async function contact(request, env) {
  const origin = request.headers.get('Origin');
  const self = new URL(request.url).origin; // même origine que la page (utile aussi en local)
  if (!ORIGINS.has(origin) && origin !== self) return json({ error: 'Origine non autorisée.' }, 403);
  if (!(request.headers.get('Content-Type') || '').startsWith('application/json')) return json({ error: 'Format non pris en charge.' }, 415);
  const raw = await request.text();
  if (raw.length > 16000) return json({ error: 'Message trop long.' }, 413);
  let d; try { d = JSON.parse(raw); } catch { return json({ error: 'Données illisibles.' }, 400); }
  const f = validate(d);
  if (!f) return json({ error: 'Vérifiez les champs du formulaire.' }, 422);
  if (f.spam) return json({ ok: true });
  const ip = request.headers.get('CF-Connecting-IP') || 'x', now = Date.now(), win = 3600000;
  const list = (hits.get(ip) || []).filter(t => now - t < win); list.push(now); hits.set(ip, list);
  if (list.length > 6) return json({ error: 'Trop de demandes, réessayez plus tard.' }, 429);
  if (!env.RESEND_API_KEY || !env.MAIL_FROM) return json({ error: 'Envoi indisponible.' }, 503);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(buildEmail(f, env.MAIL_FROM)),
  });
  if (!res.ok) return json({ error: 'Envoi refusé par le service.' }, 502);
  return json({ ok: true });
}

// Lecture par morceaux (requêtes « Range ») : indispensable pour lire les vidéos sur iPhone/Safari.
export async function withRange(request, res) {
  const range = request.headers.get('Range');
  if (!range || res.status !== 200 || request.method !== 'GET') return res;
  const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!m) return res;
  const buf = await res.arrayBuffer(), size = buf.byteLength;
  let start = m[1] === '' ? Math.max(0, size - Number(m[2])) : Number(m[1]);
  let end = m[1] !== '' && m[2] !== '' ? Math.min(Number(m[2]), size - 1) : size - 1;
  if (m[1] === '' && m[2] === '') return new Response(buf, res);
  if (start >= size || start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  const h = new Headers(res.headers);
  h.set('Content-Range', `bytes ${start}-${end}/${size}`); h.set('Content-Length', String(end - start + 1)); h.set('Accept-Ranges', 'bytes');
  return new Response(buf.slice(start, end + 1), { status: 206, headers: h });
}

const SECURITY = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-Frame-Options': 'SAMEORIGIN',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'www.otiumdigital.com') { url.hostname = 'otiumdigital.com'; return Response.redirect(url.toString(), 301); }
    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return json({ error: 'Méthode non autorisée.' }, 405);
      try { return await contact(request, env); } catch { return json({ error: 'Erreur temporaire.' }, 500); }
    }
    if (url.pathname.startsWith('/api/')) return json({ error: 'Introuvable.' }, 404);
    // Redirections permanentes (fichier redirects.json) : les anciennes adresses ne sont jamais perdues.
    const to = redirectFor(url.pathname);
    if (to) return Response.redirect(new URL(to + url.search, url).toString(), 301);
    // Fichiers de vérification Google (Search Console) : servis tels quels à leur adresse exacte, sans redirection.
    // Seuls les fichiers listés ici sont acceptés (sinon n'importe qui pourrait revendiquer le site).
    const g = url.pathname.slice(1);
    if (GOOGLE_VERIFICATION.includes(g)) {
      return new Response(`google-site-verification: ${g}`, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
    }
    let res = await env.ASSETS.fetch(request);
    res = await withRange(request, res);
    const out = new Response(res.body, res);
    for (const [k, v] of Object.entries(SECURITY)) out.headers.set(k, v);
    if (out.status >= 400) out.headers.set('Cache-Control', 'no-store');
    else if (url.pathname.startsWith('/assets/')) out.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    else if ((out.headers.get('Content-Type') || '').includes('text/html')) out.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    return out;
  },
};
