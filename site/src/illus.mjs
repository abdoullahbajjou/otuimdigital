// OTIUM — illustrations « Atelier Océan » (SVG en ligne, originales).
// Style : trait continu 1,75 px, aplat Lagon décalé de quelques pixels (effet d'impression), un point Soleil.
// Usage dans une page : {{il:nom}} ou {{il:nom-light}} (trait clair, pour fond Abysse).
const ECU = '#FFFCF6', LAG = '#3BE3C8', SUN = '#FFC65C', SAB = '#F6F1E7', ABY = '#0A2540', ABY2 = '#0E3A55';
const st = (c, w = 1.75) => `stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const plus = (x, y, c = LAG) => `<path d="M${x - 4} ${y}h8M${x} ${y - 4}v8" ${st(c)}/>`;
const svg = (vb, body) => `<svg class="il" viewBox="${vb}" fill="none" aria-hidden="true" focusable="false">${body}</svg>`;
const star = (x, y, ink) => `<path d="M${x} ${y - 6}l1.8 3.9 4.2.5-3.1 2.9.8 4.2-3.7-2.1-3.7 2.1.8-4.2-3.1-2.9 4.2-.5z" fill="${SUN}" stroke="${ink}" stroke-width="1.2" stroke-linejoin="round"/>`;

const draw = {
  // Création de site : fenêtre + curseur qui clique
  creation: free => svg('0 0 128 112', `
    <rect x="18" y="20" width="96" height="70" rx="10" fill="${LAG}"/>
    <rect x="12" y="14" width="96" height="70" rx="10" fill="${ECU}" ${st(ABY)}/>
    <path d="M12 28h96" ${st(ABY)}/>
    <circle cx="21" cy="21" r="1.8" fill="${ABY}"/><circle cx="28" cy="21" r="1.8" fill="${ABY}"/><circle cx="35" cy="21" r="1.8" fill="${ABY}"/>
    <path d="M24 41h40M24 50h58M24 58h44" ${st(ABY)}/>
    <rect x="24" y="66" width="32" height="9" rx="4.5" fill="${LAG}" ${st(ABY)}/>
    <path d="M58 70l12 28 4-11 11-4z" fill="${ECU}" ${st(ABY)}/>
    <path d="M85 96c9 5 20 3 27-6" ${st(free)}/>
    <circle cx="114" cy="12" r="4" fill="${SUN}"/>${plus(6, 100)}`),
  // Boutique : panier dont l'anse est une orbite
  boutique: free => svg('0 0 128 112', `
    <path d="M36 42h76l-10 36H46z" fill="${LAG}"/>
    <path d="M30 36h76l-10 36H40z" fill="${ECU}" ${st(ABY)}/>
    <path d="M8 22h14l18 50" ${st(free)}/>
    <path d="M44 36c0-30 46-30 46 0" ${st(free)}/>
    <path d="M52 50h38M56 60h30" ${st(ABY)}/>
    <circle cx="48" cy="88" r="6" fill="${ECU}" ${st(ABY)}/><circle cx="90" cy="88" r="6" fill="${ECU}" ${st(ABY)}/>
    <path d="M40 72c-6 0-8 8 0 8h58" ${st(free)}/>
    <circle cx="112" cy="18" r="4" fill="${SUN}"/>${plus(118, 98)}`),
  // Refonte : l'ancienne fenêtre (pointillés) devient neuve
  refonte: free => svg('0 0 128 112', `
    <rect x="8" y="34" width="46" height="36" rx="6" ${st(free)} stroke-dasharray="3 5"/>
    <path d="M17 48h22M17 57h14" ${st(free)} stroke-dasharray="3 5"/>
    <path d="M30 26C42 4 78 2 90 26" ${st(free)}/><path d="M83 23l7 3 2-7" ${st(free)}/>
    <rect x="58" y="48" width="62" height="48" rx="8" fill="${LAG}"/>
    <rect x="52" y="42" width="62" height="48" rx="8" fill="${ECU}" ${st(ABY)}/>
    <path d="M52 53h62" ${st(ABY)}/>
    <circle cx="59" cy="47.5" r="1.6" fill="${ABY}"/><circle cx="65" cy="47.5" r="1.6" fill="${ABY}"/>
    <path d="M61 64h30M61 72h40" ${st(ABY)}/><rect x="61" y="78" width="22" height="7" rx="3.5" fill="${LAG}" ${st(ABY, 1.5)}/>
    <circle cx="112" cy="30" r="4" fill="${SUN}"/>${plus(14, 96)}`),
  // Visibilité Google : loupe dont le verre porte l'anneau du logo
  visibilite: free => svg('0 0 128 112', `
    <circle cx="58" cy="50" r="31" fill="${LAG}"/>
    <path d="M74 66l24 26" stroke="${free}" stroke-width="9" stroke-linecap="round"/>
    <circle cx="52" cy="44" r="31" fill="${ECU}" ${st(ABY)}/>
    <path d="M36 57l11-10 8 6 13-17" stroke="${ABY}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><path d="M60 36h8v8" stroke="${ABY}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="52" cy="44" rx="47" ry="12" transform="rotate(-18 52 44)" ${st(free)}/>
    <circle cx="101" cy="95" r="3.5" fill="${LAG}"/>
    <circle cx="108" cy="16" r="4" fill="${SUN}"/>${plus(14, 96)}`),
  // Accompagnement : une plante qui pousse dans une orbite
  accompagnement: free => svg('0 0 128 112', `
    <circle cx="70" cy="52" r="28" fill="${LAG}"/>
    <ellipse cx="64" cy="62" rx="56" ry="14" transform="rotate(-12 64 62)" ${st(free)}/>
    <path d="M47 76h34l-5 24H52z" fill="${ECU}" ${st(ABY)}/>
    <path d="M44 76h40" ${st(ABY)}/>
    <path d="M64 76c0-14-1-26 1-40" ${st(ABY)}/>
    <path d="M64 58c-15-1-21-11-19-20 10 0 19 8 19 20z" fill="${ECU}" ${st(ABY)}/>
    <path d="M65 46c12-2 18-10 16-19-9 0-16 7-16 19z" fill="${ECU}" ${st(ABY)}/>
    <circle cx="104" cy="22" r="4" fill="${SUN}"/>${plus(16, 30)}`),
  // Compris en 5 secondes : chronomètre
  chrono: free => svg('0 0 128 112', `
    <circle cx="70" cy="62" r="34" fill="${LAG}"/>
    <circle cx="64" cy="56" r="34" fill="${ECU}" ${st(ABY)}/>
    <path d="M58 14h12M64 14v8M90 30l5-5" ${st(free)}/>
    <path d="M64 56V36" ${st(ABY)}/><path d="M64 56l14 8" ${st(ABY)}/>
    <circle cx="64" cy="56" r="3" fill="${ABY}"/>
    <path d="M64 26a30 30 0 0 1 26 15" ${st(ABY)} stroke-dasharray="2 5"/>
    <circle cx="112" cy="20" r="4" fill="${SUN}"/>${plus(14, 98)}`),
  // Une action claire : gros bouton et curseur
  clic: free => svg('0 0 128 112', `
    <rect x="18" y="38" width="96" height="34" rx="17" fill="${LAG}"/>
    <rect x="12" y="32" width="96" height="34" rx="17" fill="${ECU}" ${st(ABY)}/>
    <path d="M30 49h40" ${st(ABY)}/><path d="M80 43l8 6-8 6" ${st(ABY)}/>
    <path d="M70 60l12 28 4-11 11-4z" fill="${ECU}" ${st(ABY)}/>
    <path d="M64 22l-4-8M78 20l2-9M90 26l7-6" ${st(free)}/>
    <circle cx="112" cy="94" r="4" fill="${SUN}"/>${plus(16, 96)}`),
  // Des preuves qui rassurent : avis 5 étoiles
  avis: free => svg('0 0 128 112', `
    <rect x="20" y="26" width="96" height="62" rx="12" fill="${LAG}"/>
    <rect x="14" y="20" width="96" height="62" rx="12" fill="${ECU}" ${st(ABY)}/>
    ${star(30, 40, ABY)}${star(46, 40, ABY)}${star(62, 40, ABY)}${star(78, 40, ABY)}${star(94, 40, ABY)}
    <path d="M26 56h70M26 66h48" ${st(ABY)}/>
    <circle cx="100" cy="86" r="11" fill="${LAG}" ${st(ABY)}/><path d="M95 86l4 4 7-8" ${st(ABY)}/>
    <circle cx="116" cy="12" r="4" fill="${SUN}"/>${plus(10, 100)}`),
  // Le vendeur : deux bulles de conversation
  vendeur: free => svg('0 0 128 112', `
    <path d="M20 22h64a10 10 0 0 1 10 10v26a10 10 0 0 1-10 10H46l-14 12V68H20a10 10 0 0 1-10-10V32a10 10 0 0 1 10-10z" fill="${ECU}" ${st(ABY)}/>
    <path d="M24 38h52M24 50h36" ${st(ABY)}/>
    <path d="M72 58h34a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8h-4v10l-12-10H72a8 8 0 0 1-8-8V66a8 8 0 0 1 8-8z" fill="${LAG}" ${st(ABY)}/>
    <circle cx="80" cy="74" r="2" fill="${ABY}"/><circle cx="89" cy="74" r="2" fill="${ABY}"/><circle cx="98" cy="74" r="2" fill="${ABY}"/>
    <circle cx="112" cy="16" r="4" fill="${SUN}"/>`),
  // Le développeur : chevrons de code sur l'anneau
  developpeur: free => svg('0 0 128 112', `
    <rect x="26" y="30" width="80" height="56" rx="10" fill="${LAG}"/>
    <rect x="20" y="24" width="80" height="56" rx="10" fill="${ECU}" ${st(ABY)}/>
    <path d="M46 42l-10 10 10 10M74 42l10 10-10 10M64 38l-8 28" stroke="${ABY}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="60" cy="54" rx="56" ry="13" transform="rotate(-14 60 54)" ${st(free)}/>
    <circle cx="112" cy="16" r="4" fill="${SUN}"/>${plus(14, 98)}`),
  // Bouteille à la mer (contact, 404, appel final)
  bouteille: free => svg('0 0 160 112', `
    <path d="M4 84c14-8 26-8 40 0s26 8 40 0 26-8 40 0 22 8 32 2" ${st(free)}/>
    <path d="M14 98c14-6 24-6 36 0s24 6 36 0" ${st(free)} opacity=".5"/>
    <g transform="rotate(-24 82 56)">
      <rect x="56" y="44" width="54" height="26" rx="12" fill="${LAG}" transform="translate(5 5)"/>
      <rect x="56" y="44" width="54" height="26" rx="12" fill="${ECU}" ${st(ABY)}/>
      <path d="M110 51h10v12h-10" fill="${ECU}" ${st(ABY)}/><rect x="120" y="53" width="7" height="8" rx="2" fill="${SUN}" ${st(ABY, 1.5)}/>
      <path d="M66 52c8 3 22 3 32 0v10c-10 3-24 3-32 0z" fill="${SAB}" ${st(ABY, 1.5)}/>
    </g>
    <circle cx="140" cy="18" r="5" fill="${SUN}"/>${plus(22, 26)}${plus(116, 12, free)}`),
  // Hero : planète OTIUM, anneau-trait, trois fenêtres en orbite (fond Abysse)
  hero: () => {
    const INK = ABY;
    const win = (x, y, w, h, rot, inner) => `<g transform="translate(${x} ${y}) rotate(${rot})">
      <rect x="7" y="7" width="${w}" height="${h}" rx="12" fill="${LAG}"/>
      <rect width="${w}" height="${h}" rx="12" fill="${ECU}" ${st(INK, 2)}/>
      <path d="M0 22h${w}" ${st(INK, 2)}/>
      <circle cx="12" cy="11" r="2.4" fill="${INK}"/><circle cx="21" cy="11" r="2.4" fill="${INK}"/><circle cx="30" cy="11" r="2.4" fill="${INK}"/>${inner}</g>`;
    const ring = 'rotate(-14 300 285)';
    return `<svg class="il il-hero" viewBox="0 0 600 560" fill="none" aria-hidden="true" focusable="false">
      <defs><clipPath id="hero-planet"><circle cx="300" cy="285" r="120"/></clipPath></defs>
      <path d="M-10 520c70 30 170 10 210-60" ${st(SAB, 1.5)} opacity=".35"/>
      <g transform="${ring}"><ellipse cx="300" cy="285" rx="262" ry="60" ${st(SAB, 2)}/></g>
      <circle cx="314" cy="299" r="120" fill="${LAG}"/>
      <circle cx="300" cy="285" r="120" fill="${ABY2}" ${st(SAB, 2)}/>
      <g clip-path="url(#hero-planet)" opacity=".55"><path d="M170 236c80 24 180 24 260 0M168 300c84 26 180 26 264 0M190 360c70 20 150 20 220 0" ${st(SAB, 1.5)}/></g>
      <circle cx="262" cy="228" r="9" fill="${SUN}"/>
      <g transform="${ring}"><path class="ring-front" d="M38 285a262 60 0 0 0 524 0" ${st(SAB, 2)}/></g>
      ${win(28, 92, 178, 118, -7, `<rect x="16" y="36" width="96" height="8" rx="4" fill="${INK}"/><path d="M16 58h140M16 70h110" ${st(INK, 2)}/><rect x="16" y="84" width="58" height="18" rx="9" fill="${LAG}" ${st(INK, 2)}/>`)}
      ${win(402, 56, 164, 108, 6, `${star(22, 46, INK)}${star(42, 46, INK)}${star(62, 46, INK)}${star(82, 46, INK)}${star(102, 46, INK)}<path d="M16 68h132M16 80h96" ${st(INK, 2)}/><circle cx="138" cy="90" r="6" fill="${LAG}" ${st(INK, 2)}/>`)}
      ${win(380, 392, 184, 116, -4, `<path d="M18 92l34-22 24 12 40-34 30 4" ${st(INK, 2.4)}/><path d="M134 44h14v14" ${st(INK, 2.4)}/><path d="M18 100h150" ${st(INK, 1.5)} opacity=".4"/>`)}
      <path d="M86 214l14 32 5-12 12-5z" fill="${ECU}" ${st(INK, 2)}/>
      <circle cx="548" cy="236" r="5" fill="${SUN}"/><circle cx="74" cy="410" r="4" fill="${LAG}"/>
      ${plus(212, 58)}${plus(536, 330, SAB)}${plus(120, 488, SAB)}
    </svg>`;
  },
  // Soulignement d'orbite sous un mot
  swash: () => `<svg class="swash" viewBox="0 0 220 26" fill="none" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M3 17C55 7 140 3 205 9c9 1 12 7 4 10-12 4-30-2-24-7" stroke="${SUN}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  // Flèche ↗ des boutons
  arrow: () => `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="M4 12L12 4M5.5 4H12v6.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

export function illus(name) {
  const light = name.endsWith('-light'), key = light ? name.slice(0, -6) : name;
  if (!draw[key]) throw new Error('Illustration inconnue : ' + name);
  return draw[key](light ? SAB : ABY);
}
