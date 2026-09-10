import { getColliderTheme, getColliderThemeCss, resolveStatsTheme } from '../../src/githubStatsTheme.js';

const WIDTH = 980;
const HEIGHT = 470;
const DETECTOR_X = 145;
const DETECTOR_Y = 350;
const CELL = 10;
const STEP = 13;
const ORBIT_PATH = 'M410 210a190 92 0 1 0 380 0a190 92 0 1 0-380 0';
const ORBIT_PATHS = [
  ORBIT_PATH,
  'M790 210a190 92 0 1 0-380 0a190 92 0 1 0 380 0',
  'M434 210a166 72 0 1 0 332 0a166 72 0 1 0-332 0',
  'M766 210a166 72 0 1 0-332 0a166 72 0 1 0 332 0',
  'M410 210C452 126 548 130 600 210C652 292 748 294 790 210C748 132 652 128 600 210C548 290 452 294 410 210',
];

function escapeXml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function truncate(value, length) {
  const text = String(value ?? '');
  return text.length > length ? `${text.slice(0, length - 1)}…` : text;
}

function compactNumber(value) {
  return new Intl.NumberFormat('en', {
    notation: Number(value) >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);
}

function experimentNumber() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function selectRandomRepos(repos, count = 2) {
  const shuffled = [...repos];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled.slice(0, count);
}

function particleSymbol(language) {
  const symbols = {
    TypeScript: 'τ',
    JavaScript: 'J',
    Python: 'π',
    Rust: 'R',
    Go: 'G',
    Java: 'λ',
    Kotlin: 'K',
    Swift: 'S',
    Ruby: 'ρ',
    PHP: 'P',
    C: 'C',
    'C++': 'C⁺',
    'C#': 'C♯',
  };
  return symbols[language] || String(language || 'Code').slice(0, 1).toUpperCase();
}

function renderDetector(days, palette) {
  return days.map((day, index) => {
    const week = Math.floor(index / 7);
    const weekday = index % 7;
    const level = day.future ? 0 : Math.min(4, Math.max(0, day.level));
    const x = DETECTOR_X + week * STEP;
    const y = DETECTOR_Y + weekday * STEP;
    const delay = ((week * 0.19 + weekday * 0.11) % 5.4).toFixed(2);
    return `<rect class="detector-cell${level > 0 ? ' detector-hit' : ''}" x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2.5" fill="${palette.detector[level]}" style="--hit-delay:${delay}s"><title>${escapeXml(day.date)} · ${day.count} detector hit${day.count === 1 ? '' : 's'}</title></rect>`;
  }).join('');
}

function renderRepoNodes(repos, palette) {
  const fallback = repos.length > 0
    ? repos.slice(0, 2)
    : [{ name: 'source-a', language: 'Code', stars: 0 }, { name: 'source-b', language: 'Code', stars: 0 }];
  const positions = [
    { x: 330, y: 210, anchor: 'middle', dx: 0, labelOffsetY: -28, color: palette.cyan },
    { x: 870, y: 210, anchor: 'middle', dx: 0, labelOffsetY: -28, color: palette.purple },
    { x: 410, y: 125, anchor: 'middle', dx: 0, labelOffsetY: -25, color: palette.yellow },
    { x: 790, y: 287, anchor: 'start', dx: 18, labelOffsetY: -4, color: palette.green },
  ];

  return fallback.map((repo, index) => {
    const position = positions[index];
    const safeName = escapeXml(truncate(repo.name, 13));
    const safeLanguage = escapeXml(truncate(repo.language || 'Code', 11));
    const symbol = escapeXml(particleSymbol(repo.language));
    return `<g class="source-node source-${index}" transform="translate(${position.x} ${position.y})" style="--source-color:${position.color}">
      <circle r="13" fill="${palette.panel}" stroke="${position.color}" stroke-width="1.5"/>
      <circle class="source-core" r="5" fill="${position.color}"/>
      <text y="3" text-anchor="middle" class="particle-symbol">${symbol}</text>
      <text x="${position.dx}" y="${position.labelOffsetY}" text-anchor="${position.anchor}" class="repo-name">${safeName}</text>
      <text x="${position.dx}" y="${position.labelOffsetY + 13}" text-anchor="${position.anchor}" class="repo-meta">${safeLanguage} · ★ ${Number(repo.stars) || 0}</text>
    </g>`;
  }).join('');
}

function renderOrbitParticles(repos, palette) {
  const colors = [palette.cyan, palette.purple, palette.yellow, palette.green];
  const sources = repos.length > 0 ? repos.slice(0, 10) : [{ language: 'Code' }, { language: 'Code' }];
  return sources.map((repo, index) => {
    const color = colors[index % colors.length];
    const radius = index < 4 ? 7 : 5.5;
    const duration = (6.8 + (index % 5) * 1.45).toFixed(2);
    const delay = (-(index * 1.37 + 0.4)).toFixed(2);
    return `<g class="moving orbit-particle">
    <circle r="${radius}" fill="${palette.panel}" stroke="${color}" stroke-width="${index < 4 ? 2 : 1.4}"/>
    <text y="3" text-anchor="middle" class="particle-symbol">${escapeXml(particleSymbol(repo.language))}</text>
    <title>${escapeXml(repo.name || 'repository')} · ${escapeXml(repo.language || 'Code')}</title>
    <animateMotion dur="${duration}s" begin="${delay}s" repeatCount="indefinite" path="${ORBIT_PATHS[index % ORBIT_PATHS.length]}"/>
  </g>`;
  }).join('');
}

function renderBeamParticles(palette) {
  return `<g class="moving beam-particles">
    <circle r="4" fill="${palette.cyan}"><animateMotion dur="2.1s" repeatCount="indefinite" path="M344 210C430 210 515 210 594 210"/></circle>
    <circle r="3" fill="${palette.cyan}"><animateMotion dur="2.1s" begin="-.72s" repeatCount="indefinite" path="M344 210C430 210 515 210 594 210"/></circle>
    <circle r="4" fill="${palette.purple}"><animateMotion dur="2.1s" begin="-.25s" repeatCount="indefinite" path="M856 210C770 210 685 210 606 210"/></circle>
    <circle r="3" fill="${palette.purple}"><animateMotion dur="2.1s" begin="-.97s" repeatCount="indefinite" path="M856 210C770 210 685 210 606 210"/></circle>
  </g>`;
}

function renderDebris(palette) {
  const paths = [
    ['M600 216Q555 270 518 339', palette.cyan, '0s'],
    ['M600 216Q585 285 603 339', palette.yellow, '-.6s'],
    ['M600 216Q635 280 684 339', palette.purple, '-1.2s'],
    ['M600 216Q688 265 765 339', palette.green, '-1.8s'],
    ['M600 216Q510 258 435 339', palette.accent, '-2.4s'],
  ];
  return `<g class="moving debris">${paths.map(([path, color, begin]) => `<circle r="3" fill="${color}"><animateMotion dur="3s" begin="${begin}" repeatCount="indefinite" path="${path}"/></circle>`).join('')}</g>`;
}

function renderExperimentPanel(profile, calendar, palette) {
  const languages = [...new Set(profile.activeRepos.map((repo) => repo.language).filter(Boolean))].slice(0, 4);
  const particleTypes = languages.length ? languages.map(particleSymbol).join(' · ') : 'C';
  const possibleDays = Math.max(1, calendar.days.filter((day) => !day.future).length);
  const collisionRate = Math.min(100, Math.round((calendar.activeDays / possibleDays) * 100));
  const barWidth = Math.max(3, Math.round(154 * collisionRate / 100));
  const rateSteps = [0, 0.25, 0.5, 0.75, 1].map((progress) => Math.round(collisionRate * progress));
  const animatedRate = rateSteps.map((value, index) => `<text x="214" y="148" text-anchor="end" class="panel-value rate-step rate-step-${index}">${value}%</text>`).join('');
  return `<g transform="translate(36 122)">
    <rect width="232" height="174" rx="16" fill="${palette.panel}" stroke="${palette.border}"/>
    <text x="18" y="25" class="panel-title">EXPERIMENT #${experimentNumber()}</text>
    <text x="18" y="52" class="panel-key">PARTICLE TYPES</text><text x="214" y="52" text-anchor="end" class="panel-value">${escapeXml(particleTypes)}</text>
    <text x="18" y="76" class="panel-key">BEAM ENERGY</text><text x="214" y="76" text-anchor="end" class="panel-value">${compactNumber(calendar.totalContributions)} commits</text>
    <text x="18" y="100" class="panel-key">STABILITY</text><text x="214" y="100" text-anchor="end" class="panel-value">${calendar.longestStreak} day streak</text>
    <text x="18" y="124" class="panel-key">SOURCES</text><text x="214" y="124" text-anchor="end" class="panel-value">${profile.activeRepos.length} active repos</text>
    <text x="18" y="148" class="panel-key">COLLISION RATE</text>${animatedRate}
    <rect x="18" y="158" width="154" height="4" rx="2" fill="${palette.grid}"/><rect class="rate-bar" x="18" y="158" width="${barWidth}" height="4" rx="2" fill="${palette.accent}"/>
  </g>`;
}

export function renderGitHubColliderSvg({ profile, calendar, theme = 'auto', accentColor, accentPalette }) {
  const themeName = resolveStatsTheme(theme);
  const palette = getColliderTheme(themeName, accentColor, accentPalette);
  const adaptiveThemeCss = getColliderThemeCss(themeName, accentColor, accentPalette);
  const safeLogin = escapeXml(truncate(profile.login, 39));
  const safeName = escapeXml(truncate(profile.name, 30));
  const repos = profile.activeRepos || [];
  const sourceRepos = selectRandomRepos(repos);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="colliderTitle colliderDesc">
  <title id="colliderTitle">Git Particle Collider for ${safeLogin} in ${themeName} mode</title>
  <desc id="colliderDesc">An animated particle accelerator maps ${calendar.totalContributions} commits into detector hits.</desc>
  <defs>
    <filter id="colliderGlow" x="-300%" y="-300%" width="700%" height="700%"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <clipPath id="colliderCard"><rect x="1" y="1" width="978" height="468" rx="26"/></clipPath>
    <style>
      ${adaptiveThemeCss}
      text{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      .kicker,.section-label,.panel-title{fill:${palette.accent};font-size:9px;font-weight:750;letter-spacing:1.8px}
      .name{fill:${palette.text};font-size:25px;font-weight:750}.handle{fill:${palette.muted};font-size:11px}.brand{fill:${palette.text};font-size:20px;font-weight:750}
      .panel-key{fill:${palette.muted};font-size:7px;font-weight:700;letter-spacing:1px}.panel-value{fill:${palette.text};font-size:8px;font-weight:700}
      .repo-name{fill:${palette.text};font-size:8px;font-weight:700}.repo-meta{fill:${palette.muted};font-size:7px}.particle-symbol{fill:${palette.text};font-size:7px;font-weight:800}
      .ring{fill:none;stroke:${palette.border}}.ring-energy{fill:none;stroke:${palette.cyan};stroke-dasharray:7 13;animation:ring-flow 3s linear infinite}.beam{fill:none;stroke-width:2;stroke-dasharray:4 8;animation:beam-flow 1.2s linear infinite}
      .source-core{animation:source-pulse 2.4s ease-in-out infinite;filter:url(#colliderGlow)}.source-1 .source-core{animation-delay:-.8s}.source-2 .source-core{animation-delay:-1.6s}
      .collision-core{animation:collision 2.1s ease-out infinite;transform-box:fill-box;transform-origin:center;filter:url(#colliderGlow)}.collision-ray{animation:ray 2.1s ease-out infinite;transform-box:fill-box;transform-origin:center}
      .detector-cell{transition:fill .2s}.detector-hit{animation:detector-hit 6s ease-out var(--hit-delay) infinite}.rate-bar{animation:rate-in 4.2s linear both;transform-box:fill-box;transform-origin:left}
      .rate-step{opacity:0;animation-duration:4.2s;animation-timing-function:step-end;animation-fill-mode:forwards}.rate-step-0{animation-name:rate-step-0}.rate-step-1{animation-name:rate-step-1}.rate-step-2{animation-name:rate-step-2}.rate-step-3{animation-name:rate-step-3}.rate-step-4{animation-name:rate-step-4}
      @keyframes ring-flow{to{stroke-dashoffset:-40}}@keyframes beam-flow{to{stroke-dashoffset:-24}}@keyframes source-pulse{50%{opacity:.45;transform:scale(.72)}}
      @keyframes collision{0%,62%,100%{opacity:.75;transform:scale(.7)}72%{opacity:1;transform:scale(1.75)}82%{opacity:.5;transform:scale(.9)}}@keyframes ray{0%,62%,100%{opacity:.08;transform:rotate(0) scale(.5)}74%{opacity:1;transform:rotate(18deg) scale(1.3)}}
      @keyframes detector-hit{0%,55%,100%{filter:none}62%{filter:url(#colliderGlow);opacity:1}70%{filter:none}}@keyframes rate-in{from{transform:scaleX(0)}to{transform:scaleX(1)}}
      @keyframes rate-step-0{0%,19.99%{opacity:1}20%,100%{opacity:0}}@keyframes rate-step-1{0%,19.99%,40%,100%{opacity:0}20%,39.99%{opacity:1}}@keyframes rate-step-2{0%,39.99%,60%,100%{opacity:0}40%,59.99%{opacity:1}}@keyframes rate-step-3{0%,59.99%,80%,100%{opacity:0}60%,79.99%{opacity:1}}@keyframes rate-step-4{0%,79.99%{opacity:0}80%,100%{opacity:1}}
      @media(prefers-reduced-motion:reduce){.moving{display:none}.ring-energy,.beam,.source-core,.collision-core,.collision-ray,.detector-hit,.rate-bar,.rate-step{animation:none}.rate-step{display:none}.rate-step-4{display:block;opacity:1}}
    </style>
  </defs>
  <g clip-path="url(#colliderCard)">
    <rect width="980" height="470" fill="${palette.background}"/>
    <g stroke="${palette.grid}" stroke-width="1" opacity=".7"><path d="M0 105H980M0 318H980"/><path d="M286 105V318M914 105V318"/></g>
    <text x="38" y="37" class="kicker">GIT PARTICLE COLLIDER / LIVE EXPERIMENT</text>
    <text x="38" y="67" class="name">${safeName}</text><text x="38" y="87" class="handle">github.com/${safeLogin}</text>
    <text x="942" y="60" text-anchor="end" class="brand"><tspan fill="${palette.accent}">@</tspan>AIAI</text>
    ${renderExperimentPanel(profile, calendar, palette)}
    <ellipse class="ring" cx="600" cy="210" rx="190" ry="92" stroke-width="8" opacity=".42"/><ellipse class="ring" cx="600" cy="210" rx="166" ry="72" stroke-width="1.5" opacity=".85"/>
    <path class="ring-energy" d="${ORBIT_PATH}" stroke-width="2"/>
    <path class="ring-energy" d="${ORBIT_PATHS[2]}" stroke="${palette.purple}" stroke-width="1.2" opacity=".55" style="animation-duration:4.7s;animation-direction:reverse"/>
    <path class="ring-energy" d="${ORBIT_PATHS[4]}" stroke="${palette.yellow}" stroke-width="1" opacity=".3" style="animation-duration:2.9s"/>
    <path class="beam" d="M344 210C430 210 515 210 594 210" stroke="${palette.cyan}"/><path class="beam" d="M856 210C770 210 685 210 606 210" stroke="${palette.purple}"/>
    ${renderRepoNodes(sourceRepos, palette)}
    ${renderOrbitParticles(repos, palette)}
    ${renderBeamParticles(palette)}
    <g transform="translate(600 210)"><g class="collision-ray" stroke="${palette.yellow}" stroke-width="2"><path d="M-34 0H34M0-34V34M-24-24L24 24M24-24L-24 24"/></g><circle class="collision-core" r="8" fill="${palette.accent}"/><circle r="2.5" fill="${palette.text}"/></g>
    <text x="600" y="250" text-anchor="middle" class="section-label">COLLISION</text>
    ${renderDebris(palette)}
    <text x="145" y="337" class="section-label">DETECTOR GRID / CONTRIBUTION GRAPH</text><text x="831" y="337" text-anchor="end" class="handle">${compactNumber(profile.activeRepoStars)} photons detected</text>
    ${renderDetector(calendar.days, palette)}
  </g>
  <rect x="1" y="1" width="978" height="468" rx="26" fill="none" stroke="${palette.border}" stroke-width="2"/>
</svg>`;
}
