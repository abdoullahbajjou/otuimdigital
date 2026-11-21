/* OTIUM — interactions du site */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WA = '41779238903';
  $$('[data-year]').forEach(e => e.textContent = new Date().getFullYear());

  /* ---------- En-tête ---------- */
  const top = $('.top');
  const onScroll = () => top && top.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Menu mobile ---------- */
  const menu = $('#menu'), burger = $('.burger');
  const setMenu = open => {
    if (!menu) return;
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', !open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) $('a', menu).focus(); else burger.focus({ preventScroll: true });
  };
  burger && burger.addEventListener('click', () => setMenu(true));
  $('.menu-close') && $('.menu-close').addEventListener('click', () => setMenu(false));
  menu && $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => {
    if (!menu || !menu.classList.contains('open')) return;
    if (e.key === 'Escape') setMenu(false);
    if (e.key === 'Tab') { // garde le focus dans le menu
      const f = $$('a,button', menu), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Barre mobile : masquée quand le clavier est ouvert ---------- */
  const mbar = $('#mbar');
  if (mbar) {
    document.addEventListener('focusin', e => { if (e.target.matches('input,textarea')) mbar.classList.add('hide'); });
    document.addEventListener('focusout', () => mbar.classList.remove('hide'));
  }

  /* ---------- Apparitions ---------- */
  const rv = $$('.rv');
  if (reduce || !('IntersectionObserver' in window)) rv.forEach(e => e.classList.add('in'));
  else {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(e => io.observe(e));
  }

  /* ---------- FAQ : une seule question ouverte ---------- */
  const faqs = $$('.faq details');
  faqs.forEach(d => d.addEventListener('toggle', () => { if (d.open) faqs.forEach(o => o !== d && (o.open = false)); }));

  /* ---------- Constellation : planète + anneau ---------- */
  const cv = $('canvas.planet');
  if (cv) {
    const small = innerWidth < 700;
    const S = small ? 560 : 1000;
    cv.width = cv.height = S;
    const cx = cv.getContext('2d'), C = S / 2, R = S * 0.21;
    const cols = ['#3BE3C8', '#5AB8FF', '#FFD27A', '#F2FAFF'];
    let seed = 7; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const k = small ? 0.55 : 1, sz = S / 1000;
    const body = [], ring = [], dust = [];
    for (let i = 0; i < 950 * k; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * R; body.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, s: (1.8 + r() * 2.6) * sz, c: cols[(r() * (d / R > .85 ? 2 : 4)) | 0], o: .35 + r() * .65, t: r() * 6 }); }
    for (let i = 0; i < 560 * k; i++) ring.push({ a: r() * 6.283, rad: R * (1.45 + r() * .42), s: (1.3 + r() * 2.4) * sz, c: cols[(r() * 2) | 0], o: .4 + r() * .6 });
    for (let i = 0; i < 130 * k; i++) dust.push({ x: (r() - .5) * S, y: (r() - .5) * S, s: (1 + r() * 1.8) * sz, c: cols[(r() * 3) | 0], o: .15 + r() * .3 });
    const tri = (x, y, s, rot) => { cx.beginPath(); for (let j = 0; j < 3; j++) { const a = rot + j * 2.094; cx.lineTo(x + Math.cos(a) * s, y + Math.sin(a) * s); } cx.closePath(); cx.stroke(); };
    const tilt = -0.42, flat = 0.28;
    const draw = t => {
      cx.clearRect(0, 0, S, S); cx.lineWidth = 1.4 * sz + .3;
      const back = [], front = [];
      for (const p of ring) { const a = p.a + t * 0.00012, x = Math.cos(a) * p.rad, y = Math.sin(a) * p.rad * flat; (Math.sin(a) < 0 ? back : front).push([x * Math.cos(tilt) - y * Math.sin(tilt), x * Math.sin(tilt) + y * Math.cos(tilt), p]); }
      const plot = ([x, y, p]) => { cx.strokeStyle = p.c; cx.globalAlpha = p.o; tri(C + x, C + y, p.s, t * .001); };
      back.forEach(plot);
      for (const p of dust) { cx.strokeStyle = p.c; cx.globalAlpha = p.o; tri(C + p.x, C + p.y, p.s, p.x); }
      for (const p of body) { cx.strokeStyle = p.c; cx.globalAlpha = p.o * (.75 + .25 * Math.sin(t * .0015 + p.t)); tri(C + p.x, C + p.y, p.s, p.t + t * .0004); }
      front.forEach(plot);
      cx.globalAlpha = 1;
    };
    let visible = true, raf = 0;
    const loop = t => { draw(t); raf = visible ? requestAnimationFrame(loop) : 0; };
    draw(1000);
    if (!reduce) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(loop); }).observe(cv);
      document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible && !raf) raf = requestAnimationFrame(loop); });
    }
  }

  /* ---------- Vidéo : lecture muette quand elle est visible ---------- */
  const vid = $('#story-video');
  if (vid && !reduce && 'IntersectionObserver' in window) {
    let userPaused = false;
    vid.addEventListener('pause', () => { if (vid.dataset.auto !== '1') userPaused = true; vid.dataset.auto = ''; });
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !userPaused) { vid.play().catch(() => {}); }
      else if (!e.isIntersecting && !vid.paused) { vid.dataset.auto = '1'; vid.pause(); }
    }, { threshold: .6 }).observe(vid);
  }

  /* ---------- Contact ---------- */
  const tabs = $$('[role=tab]');
  const showTab = btn => {
    tabs.forEach(b => { const on = b === btn; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; $('#' + b.getAttribute('aria-controls')).hidden = !on; });
  };
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => showTab(b));
    b.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; showTab(n); n.focus(); } });
  });

  const forms = $$('.otium-form');
  if (!forms.length) return;
  const started = Date.now();
  const q = new URLSearchParams(location.search);
  if (q.get('question') !== null && tabs[1]) showTab(tabs[1]);
  const pre = (name, key) => { const el = key && $(`input[name="${name}"][data-key="${key}"]`); if (el) el.checked = true; };
  pre('formule', q.get('formule')); pre('activite', q.get('activite'));
  if (q.get('existant') !== null) { pre('formule', 'refonte'); const site = $('#p-site'); if (site) setTimeout(() => site.focus(), 300); }

  const autreWrap = $('#p-autre-wrap');
  const syncAutre = () => { const on = !!$('input[name="activite"][data-key="autre"]:checked'); if (autreWrap) autreWrap.hidden = !on; };
  $$('input[name="activite"]').forEach(i => i.addEventListener('change', syncAutre)); syncAutre();

  const emailOk = v => /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(v);
  const collect = f => {
    const d = Object.fromEntries(new FormData(f).entries());
    d.kind = f.dataset.kind; d.consent = !!f.consent.checked; return d;
  };
  const validate = (f, d) => {
    const p = f.dataset.kind === 'projet' ? 'p' : 'q', errs = [];
    const set = (id, msg, field) => { const el = $('#' + id + '-err'); if (el) el.textContent = msg || ''; if (field) field.setAttribute('aria-invalid', msg ? 'true' : 'false'); if (msg) errs.push(field || el); };
    set(p + '-nom', (d.nom || '').trim().length < 2 ? 'Indiquez un nom pour que nous puissions vous répondre.' : '', f.nom);
    set(p + '-email', !emailOk((d.email || '').trim()) ? 'Indiquez une adresse e-mail valide, par exemple nom@exemple.com.' : '', f.email);
    if (p === 'p') {
      set('p-formule', !d.formule ? 'Choisissez une formule (ou « Je ne sais pas encore »).' : '', $('#p-formule input'));
      set('p-activite', !d.activite ? 'Choisissez votre activité.' : '', $('#p-activite input'));
      set('p-autre', d.activite === 'Autre' && (d.activite_autre || '').trim().length < 2 ? 'Précisez votre activité.' : '', f.activite_autre);
    } else {
      set('q-msg', (d.message || '').trim().length < 5 ? 'Écrivez votre question.' : '', f.message);
    }
    set(p + '-consent', !d.consent ? 'Cochez la case pour que nous puissions vous répondre.' : '', f.consent);
    return errs;
  };
  const waText = d => {
    const lines = d.kind === 'projet'
      ? [`Bonjour OTIUM, je suis ${d.nom}.`, `Formule : ${d.formule || '?'}`, d.site_actuel ? `Site actuel : ${d.site_actuel}` : '', `Activité : ${d.activite === 'Autre' ? d.activite_autre : d.activite || '?'}`, d.message ? `Projet : ${d.message}` : '', `E-mail : ${d.email}`]
      : [`Bonjour OTIUM, je suis ${d.nom}.`, `Ma question : ${d.message}`, `E-mail : ${d.email}`];
    return `https://wa.me/${WA}?text=${encodeURIComponent(lines.filter(Boolean).join('\n'))}`;
  };

  forms.forEach(f => {
    const status = $('.status', f), waBtn = $('[data-wa]', f);
    f.addEventListener('input', () => { if (waBtn) waBtn.href = waText(collect(f)); });
    f.addEventListener('submit', async e => {
      e.preventDefault();
      const d = collect(f), errs = validate(f, d);
      if (errs.length) { errs[0].focus(); status.textContent = 'Il manque une information, voir en rouge ci-dessus.'; return; }
      if (d.site_web) return; // robot
      const btn = $('button[type=submit]', f); btn.disabled = true; status.textContent = 'Envoi en cours…';
      try {
        const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...d, elapsed: Date.now() - started }) });
        if (!res.ok) throw new Error(res.status);
        f.hidden = true; const tl = $('.tabs'); if (tl) tl.hidden = true;
        const done = $('#done'); done.hidden = false; done.focus();
      } catch {
        status.innerHTML = 'L\'envoi n\'a pas fonctionné. Envoyez-nous votre demande en un clic sur WhatsApp, elle est déjà rédigée : ';
        const a = document.createElement('a'); a.href = waText(d); a.className = 'link'; a.rel = 'noopener'; a.textContent = 'envoyer par WhatsApp'; status.appendChild(a);
      } finally { btn.disabled = false; }
    });
  });
})();
