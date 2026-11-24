// OTIUM — illustrations « Atelier Océan » : trait continu, aplat Lagon décalé (effet d'impression), touche Soleil.
(() => {
  const INK = '#0A2540', ECU = '#FFFCF6', LAG = '#3BE3C8', SUN = '#FFC65C', SAB = '#F6F1E7', ABY2 = '#0E3A55';
  const st = (c = INK, w = 1.75) => `stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
  const plus = (x, y, c = LAG) => `<path d="M${x - 4} ${y}h8M${x} ${y - 4}v8" ${st(c, 1.75)}/>`;

  const A = {
    // Création de site : fenêtre + curseur qui clique
    creation: () => `<svg viewBox="0 0 128 112" fill="none" aria-hidden="true">
      <rect x="18" y="20" width="96" height="70" rx="10" fill="${LAG}"/>
      <rect x="12" y="14" width="96" height="70" rx="10" fill="${ECU}" ${st()}/>
      <path d="M12 28h96" ${st()}/>
      <circle cx="21" cy="21" r="1.8" fill="${INK}"/><circle cx="28" cy="21" r="1.8" fill="${INK}"/><circle cx="35" cy="21" r="1.8" fill="${INK}"/>
      <path d="M24 41h40M24 50h58M24 58h44" ${st()}/>
      <rect x="24" y="66" width="32" height="9" rx="4.5" fill="${LAG}" ${st()}/>
      <path d="M58 70l12 28 4-11 11-4z" fill="${ECU}" ${st()}/>
      <path d="M85 96c9 5 20 3 27-6" ${st()}/>
      <circle cx="114" cy="12" r="4" fill="${SUN}"/>${plus(6, 100)}
    </svg>`,
    // Visibilité Google : loupe dont le cercle porte l'anneau du logo
    visibilite: () => `<svg viewBox="0 0 128 112" fill="none" aria-hidden="true">
      <circle cx="58" cy="50" r="31" fill="${LAG}"/>
      <path d="M74 66l24 26" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
      <circle cx="52" cy="44" r="31" fill="${ECU}" ${st()}/>
      <path d="M36 57l11-10 8 6 13-17" ${st()}/><path d="M60 36h8v8" ${st()}/>
      <ellipse cx="52" cy="44" rx="47" ry="12" transform="rotate(-18 52 44)" ${st()}/>
      <circle cx="101" cy="95" r="3.5" fill="${LAG}"/>
      <circle cx="108" cy="16" r="4" fill="${SUN}"/>${plus(14, 96)}
    </svg>`,
    // Boutique en ligne : panier dont l'anse est une orbite
    boutique: () => `<svg viewBox="0 0 128 112" fill="none" aria-hidden="true">
      <path d="M36 42h76l-10 36H46z" fill="${LAG}"/>
      <path d="M30 36h76l-10 36H40z" fill="${ECU}" ${st()}/>
      <path d="M8 22h14l18 50" ${st()}/>
      <path d="M44 36c0-30 46-30 46 0" ${st()}/>
      <path d="M52 50h38M56 60h30" ${st()}/>
      <circle cx="48" cy="88" r="6" fill="${ECU}" ${st()}/><circle cx="90" cy="88" r="6" fill="${ECU}" ${st()}/>
      <path d="M40 72c-6 0-8 8 0 8h58" ${st()}/>
      <circle cx="112" cy="18" r="4" fill="${SUN}"/>${plus(118, 98)}
    </svg>`,
    // Hero (fond Abysse) : planète OTIUM, anneau-trait, trois fenêtres en orbite
    hero: () => {
      const win = (x, y, w, h, rot, inner) => `<g transform="translate(${x} ${y}) rotate(${rot})">
        <rect x="7" y="7" width="${w}" height="${h}" rx="12" fill="${LAG}"/>
        <rect width="${w}" height="${h}" rx="12" fill="${ECU}" ${st(INK, 2)}/>
        <path d="M0 22h${w}" ${st(INK, 2)}/>
        <circle cx="12" cy="11" r="2.4" fill="${INK}"/><circle cx="21" cy="11" r="2.4" fill="${INK}"/><circle cx="30" cy="11" r="2.4" fill="${INK}"/>
        ${inner}</g>`;
      const star = (x, y) => `<path d="M${x} ${y - 6}l1.8 3.9 4.2.5-3.1 2.9.8 4.2-3.7-2.1-3.7 2.1.8-4.2-3.1-2.9 4.2-.5z" fill="${SUN}" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>`;
      const ring = 'rotate(-14 300 285)';
      return `<svg viewBox="0 0 600 560" fill="none" aria-hidden="true">
        <defs><clipPath id="pl"><circle cx="300" cy="285" r="120"/></clipPath></defs>
        <path d="M-10 520c70 30 170 10 210-60" ${st(SAB, 1.5)} opacity=".35"/>
        <g transform="${ring}"><ellipse cx="300" cy="285" rx="262" ry="60" ${st(SAB, 2)}/></g>
        <circle cx="314" cy="299" r="120" fill="${LAG}"/>
        <circle cx="300" cy="285" r="120" fill="${ABY2}" ${st(SAB, 2)}/>
        <g clip-path="url(#pl)" opacity=".55">
          <path d="M170 236c80 24 180 24 260 0M168 300c84 26 180 26 264 0M190 360c70 20 150 20 220 0" ${st(SAB, 1.5)}/>
        </g>
        <circle cx="262" cy="228" r="9" fill="${SUN}"/>
        <g transform="${ring}"><path d="M38 285a262 60 0 0 0 524 0" ${st(SAB, 2)}/></g>
        ${win(28, 92, 178, 118, -7, `<rect x="16" y="36" width="96" height="8" rx="4" fill="${INK}"/><path d="M16 58h140M16 70h110" ${st(INK, 2)}/><rect x="16" y="84" width="58" height="18" rx="9" fill="${LAG}" ${st(INK, 2)}/>`)}
        ${win(402, 56, 164, 108, 6, `<g>${star(22, 46)}${star(42, 46)}${star(62, 46)}${star(82, 46)}${star(102, 46)}</g><path d="M16 68h132M16 80h96" ${st(INK, 2)}/><circle cx="138" cy="90" r="6" fill="${LAG}" ${st(INK, 2)}/>`)}
        ${win(380, 392, 184, 116, -4, `<path d="M18 92l34-22 24 12 40-34 30 4" ${st(INK, 2.4)}/><path d="M134 44h14v14" ${st(INK, 2.4)}/><path d="M18 100h150" ${st(INK, 1.5)} opacity=".4"/>`)}
        <path d="M86 214l14 32 5-12 12-5z" fill="${ECU}" ${st(INK, 2)}/>
        <circle cx="548" cy="236" r="5" fill="${SUN}"/><circle cx="74" cy="410" r="4" fill="${LAG}"/>
        ${plus(212, 58, LAG)}${plus(536, 330, SAB)}${plus(120, 488, SAB)}
      </svg>`;
    },
    // Soulignement d'orbite sous un mot
    swash: () => `<svg viewBox="0 0 220 26" fill="none" preserveAspectRatio="none" aria-hidden="true"><path d="M3 17C55 7 140 3 205 9c9 1 12 7 4 10-12 4-30-2-24-7" stroke="${SUN}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    arrow: () => `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12L12 4M5.5 4H12v6.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    logo: (light) => `<svg viewBox="0 0 64 64" fill="none" stroke-linecap="round" aria-hidden="true"><path d="M12.9 40.7C4.6 42.5 1.5 41.2 4.8 36.8c3-4.3 12.2-11.3 23.9-17.4 15-7.9 28.4-11.6 30.6-8.1 1.2 1.9-1.2 5.3-6.3 9.5" stroke="${LAG}" stroke-width="2.6" transform="translate(0 5)"/><circle cx="32" cy="32" r="17.5" stroke="${light ? SAB : INK}" stroke-width="3.4"/><path d="M59.1 16.7c2.3 4.4-9.9 15.4-25.8 22.9C19 46.3 7.6 49.1 4.2 46.8" stroke="${LAG}" stroke-width="3.6"/></svg>`,
  };
  document.querySelectorAll('[data-illus]').forEach(el => { const [k, v] = el.dataset.illus.split(':'); el.innerHTML = A[k](v === 'light'); });
})();
