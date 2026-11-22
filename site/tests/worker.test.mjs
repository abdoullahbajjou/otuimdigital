import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { validate, buildEmail } from '../worker/index.js';

const ok = { kind: 'projet', nom: 'Salon Lumière', email: 'a@b.fr', formule: 'Site complet (700 €)', activite: 'Institut de beauté', consent: true, elapsed: 9000 };
const env = { RESEND_API_KEY: 'k', MAIL_FROM: 'OTIUM <site@otiumdigital.com>', ASSETS: { fetch: async () => new Response('<html>', { headers: { 'Content-Type': 'text/html' } }) } };
const post = (body, origin = 'https://otiumdigital.com') => new Request('https://otiumdigital.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin, 'CF-Connecting-IP': Math.random().toString() }, body: JSON.stringify(body) });

test('validation : projet complet accepté', () => assert.equal(validate(ok).nom, 'Salon Lumière'));
test('validation : e-mail invalide refusé', () => assert.equal(validate({ ...ok, email: 'nope' }), null));
test('validation : consentement obligatoire', () => assert.equal(validate({ ...ok, consent: false }), null));
test('validation : formule inconnue refusée', () => assert.equal(validate({ ...ok, formule: 'Gratuit' }), null));
test('validation : « Autre » exige une précision', () => {
  assert.equal(validate({ ...ok, activite: 'Autre' }), null);
  assert.equal(validate({ ...ok, activite: 'Autre', activite_autre: 'Fleuriste' }).activite_autre, 'Fleuriste');
});
test('validation : question sans texte refusée', () => assert.equal(validate({ kind: 'question', nom: 'Jo', email: 'a@b.fr', consent: true, message: '' }), null));
test('anti-spam : honeypot et envoi trop rapide', () => {
  assert.deepEqual(validate({ ...ok, site_web: 'x' }), { spam: true });
  assert.deepEqual(validate({ ...ok, elapsed: 500 }), { spam: true });
});
test('e-mail construit : objet, destinataire et réponse', () => {
  const m = buildEmail(validate(ok), env.MAIL_FROM);
  assert.equal(m.to[0], 'contact@otiumdigital.com');
  assert.equal(m.reply_to, 'a@b.fr');
  assert.match(m.subject, /Projet — Site complet/);
});
test('API : origine étrangère refusée', async () => assert.equal((await worker.fetch(post(ok, 'https://evil.com'), env)).status, 403));
test('API : envoi via Resend', async () => {
  let called; globalThis.fetch = async (u, o) => { called = [u, JSON.parse(o.body)]; return new Response('{"id":"1"}', { status: 200 }); };
  const r = await worker.fetch(post(ok), env);
  assert.equal(r.status, 200); assert.equal(called[0], 'https://api.resend.com/emails'); assert.equal(called[1].reply_to, 'a@b.fr');
});
test('API : sans clé Resend → 503 (le site propose alors WhatsApp)', async () => assert.equal((await worker.fetch(post(ok), { ...env, RESEND_API_KEY: '' })).status, 503));
test('www redirige en 301 vers le domaine principal', async () => {
  const r = await worker.fetch(new Request('https://www.otiumdigital.com/contact?x=1'), env);
  assert.equal(r.status, 301); assert.equal(r.headers.get('Location'), 'https://otiumdigital.com/contact?x=1');
});
test('pages : en-têtes de sécurité ajoutés', async () => {
  const r = await worker.fetch(new Request('https://otiumdigital.com/'), env);
  assert.equal(r.headers.get('X-Content-Type-Options'), 'nosniff');
});
test("refonte : formule acceptée et site actuel dans l'e-mail", () => {
  const f = validate({ ...ok, formule: 'Refonte de mon site actuel', site_actuel: 'www.mon-salon.fr' });
  assert.match(buildEmail(f, 'x').text, /Site actuel : www.mon-salon.fr/);
});
test('vidéo : réponse partielle 206 pour Safari', async () => {
  const body = new Uint8Array(1000).map((_, i) => i % 256);
  const envV = { ...env, ASSETS: { fetch: async () => new Response(body, { status: 200, headers: { 'Content-Type': 'video/mp4' } }) } };
  const r = await worker.fetch(new Request('https://otiumdigital.com/assets/video/x.mp4', { headers: { Range: 'bytes=0-1' } }), envV);
  assert.equal(r.status, 206); assert.equal(r.headers.get('Content-Range'), 'bytes 0-1/1000');
  assert.equal((await r.arrayBuffer()).byteLength, 2);
});
test('cache : une erreur 404 n\'est jamais mise en cache', async () => {
  const env404 = { ...env, ASSETS: { fetch: async () => new Response('x', { status: 404 }) } };
  const r = await worker.fetch(new Request('https://otiumdigital.com/assets/absent.png'), env404);
  assert.equal(r.headers.get('Cache-Control'), 'no-store');
});
test('Search Console : le fichier de vérification est servi tel quel, sans redirection', async () => {
  const r = await worker.fetch(new Request('https://otiumdigital.com/googlef025c21d14ca37e2.html'), env);
  assert.equal(r.status, 200);
  assert.equal(await r.text(), 'google-site-verification: googlef025c21d14ca37e2.html');
});
test("Search Console : un autre fichier google….html n'est pas accepté", async () => {
  const r = await worker.fetch(new Request('https://otiumdigital.com/googleabc123.html'), env);
  assert.notEqual(await r.text(), 'google-site-verification: googleabc123.html');
});
