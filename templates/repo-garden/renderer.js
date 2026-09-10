import { getGardenTheme, getGardenThemeCss, resolveStatsTheme } from '../../src/githubStatsTheme.js';

const WIDTH = 980;
const HEIGHT = 470;
const CELL = 9;
const STEP_X = 12.2;
const STEP_Y = 16;
const PLOT_X = 169;
const PLOT_Y = 248;
const PLOT_RIGHT = 830;
const VINE_Y = 368;

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function truncate(value, length) {
  return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}

function plantShape(level, palette) {
  const height = [0, 7, 11, 15, 20][level];
  if (level === 0) return '';

  const flower = level >= 4
    ? `<g transform="translate(0 ${-height})" fill="${palette.accent}"><circle cx="0" cy="-3" r="3"/><circle cx="3" cy="0" r="3"/><circle cx="0" cy="3" r="3"/><circle cx="-3" cy="0" r="3"/><circle r="1.8" fill="#ffe7a8"/></g>`
    : level === 3
      ? `<circle cx="0" cy="${-height}" r="3" fill="#ffb45f"/>`
      : '';

  return `<path d="M0 3V${-height}" fill="none" stroke="${palette.plants[level]}" stroke-width="2" stroke-linecap="round"/>
    <path d="M0 ${-Math.round(height * 0.42)}q-6-5-7 2 5 4 7 1M0 ${-Math.round(height * 0.7)}q6-5 7 2-5 4-7 1" fill="${palette.plants[level]}" stroke="none"/>
    ${flower}`;
}

function renderGardenPlot(days, palette) {
  return days.map((day, index) => {
    const week = Math.floor(index / 7);
    const weekday = index % 7;
    const x = PLOT_X + week * STEP_X;
    const y = PLOT_Y + weekday * STEP_Y;
    const level = day.future ? 0 : Math.min(4, Math.max(0, day.level));
    const delay = (0.5 + week * 0.045 + weekday * 0.02).toFixed(2);
    const seed = level > 0 && index % 3 === 0
      ? `<circle class="seed" cy="-28" r="1.8" fill="${palette.seed}" style="--seed-delay:${(week * 0.17 + weekday * 0.11).toFixed(2)}s"/>`
      : '';

    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
      <rect x="-${CELL / 2}" y="-${CELL / 2}" width="${CELL}" height="${CELL}" rx="2" fill="${palette.plants[level]}" opacity="${day.future ? '.22' : level === 0 ? '.6' : '.85'}"><title>${escapeXml(day.date)} · ${day.count} contribution${day.count === 1 ? '' : 's'}</title></rect>
      ${level > 0 ? `<g class="plant" style="--grow-delay:${delay}s">${plantShape(level, palette)}</g>${seed}` : ''}
    </g>`;
  }).join('');
}

function renderRepoTrees(repos, palette) {
  const visibleRepos = repos.slice(0, 4);
  const fallback = visibleRepos.length > 0 ? visibleRepos : [{ name: 'next-project', stars: 0, language: 'Code' }];
  const positions = [
    { x: 58, y: 354 },
    { x: 113, y: 360 },
    { x: 869, y: 358 },
    { x: 925, y: 352 },
  ];

  return fallback.map((repo, index) => {
    const { x, y } = positions[index];
    const height = 39 + Math.min(15, repo.stars * 3) + (index % 2) * 7;
    const fruits = Array.from({ length: Math.min(3, repo.stars) }, (_, fruitIndex) => {
      const fx = [-12, 11, 0][fruitIndex];
      const fy = [-height + 18, -height + 24, -height + 8][fruitIndex];
      return `<circle class="fruit f${fruitIndex}" cx="${fx}" cy="${fy}" r="4" fill="${palette.fruit}"/>`;
    }).join('');

    return `<g transform="translate(${x} ${y})">
      <g class="repo-tree tree-${index}">
        <path d="M0 0V${-height}" stroke="${palette.trunk}" stroke-width="6" stroke-linecap="round"/>
        <circle cx="0" cy="${-height}" r="21" fill="${palette.tree[0]}"/>
        <circle cx="-13" cy="${-height + 10}" r="15" fill="${palette.tree[1]}"/>
        <circle cx="14" cy="${-height + 11}" r="16" fill="${palette.tree[2]}"/>
        <circle cx="0" cy="${-height - 11}" r="15" fill="${palette.tree[3]}"/>
        ${fruits}
      </g>
      <text y="18" text-anchor="middle" class="repo-name">${escapeXml(truncate(repo.name, 10))}</text>
      <text y="32" text-anchor="middle" class="repo-meta">${escapeXml(truncate(repo.language, 9))} · ★ ${repo.stars}</text>
    </g>`;
  }).join('');
}

function renderFireflies(count, palette) {
  const positions = [[42, 245], [112, 222], [858, 228], [938, 242], [88, 292], [947, 302], [861, 319], [129, 269]];
  return positions.slice(0, Math.min(count, positions.length)).map(([x, y], index) => (
    `<circle class="firefly fly-${index}" cx="${x}" cy="${y}" r="2.8" fill="${palette.fruit}" filter="url(#gardenGlow)"/>`
  )).join('');
}

function vinePath(length) {
  const start = PLOT_X - 5;
  const end = Math.min(PLOT_RIGHT - 18, start + Math.max(0, length) * 30);
  const parts = [`M${start} ${VINE_Y}`];
  for (let x = start + 28; x <= end; x += 28) {
    parts.push(`Q${x - 14} ${(x - start) % 56 === 0 ? VINE_Y - 13 : VINE_Y + 11} ${x} ${VINE_Y}`);
  }
  return parts.join(' ');
}

function vineEndX(length) {
  return Math.min(PLOT_RIGHT - 18, PLOT_X - 5 + Math.max(0, length) * 30);
}

export function renderGitHubGardenSvg({ profile, calendar, theme = 'auto', accentColor, accentPalette }) {
  const themeName = resolveStatsTheme(theme);
  const palette = getGardenTheme(themeName, accentColor, accentPalette);
  const adaptiveThemeCss = getGardenThemeCss(themeName, accentColor, accentPalette);
  const safeName = escapeXml(truncate(profile.name, 30));
  const safeLogin = escapeXml(truncate(profile.login, 39));
  const repos = profile.activeRepos || [];
  const stars = profile.activeRepoStars || 0;
  const streak = calendar.longestStreak;
  const vine = vinePath(streak);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="gardenTitle gardenDesc">
  <title id="gardenTitle">Repo Gardener for ${safeLogin} in ${themeName} mode</title>
  <desc id="gardenDesc">A living contribution garden surrounded by ${repos.length} active repository trees and ${stars} glowing fruits.</desc>
  <defs>
    <linearGradient id="gardenSky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${palette.sky[0]}"/><stop offset=".52" stop-color="${palette.sky[1]}"/><stop offset="1" stop-color="${palette.sky[2]}"/></linearGradient>
    <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${palette.soil[0]}"/><stop offset="1" stop-color="${palette.soil[1]}"/></linearGradient>
    <radialGradient id="moonGlow"><stop stop-color="${palette.moon}" stop-opacity=".22"/><stop offset="1" stop-color="${palette.moon}" stop-opacity="0"/></radialGradient>
    <filter id="gardenGlow" x="-300%" y="-300%" width="700%" height="700%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <clipPath id="gardenCard"><rect x="1" y="1" width="978" height="468" rx="26"/></clipPath>
    <style>
      ${adaptiveThemeCss}
      text{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      .garden-kicker{fill:${palette.accent};font-size:9px;font-weight:700;letter-spacing:2px}
      .garden-name{fill:${palette.text};font-size:25px;font-weight:700;letter-spacing:-.5px}
      .garden-handle{fill:${palette.muted};font-size:11px}
      .garden-tag{fill:${palette.text};font-size:20px;font-weight:700;letter-spacing:1.5px}
      .metric-value{fill:${palette.text};font-size:28px;font-weight:700}
      .metric-label,.tiny-label{fill:${palette.muted};font-size:8px;font-weight:700;letter-spacing:1.5px}
      .plot-label{fill:${palette.label};font-size:9px;font-weight:700;letter-spacing:1.6px}
      .repo-name{fill:${palette.repoText};font-size:8px;font-weight:700}
      .repo-meta{fill:${palette.repoMeta};font-size:7px}
      .plant{transform-box:fill-box;transform-origin:center bottom;animation:plant-grow 14s cubic-bezier(.2,.85,.25,1) var(--grow-delay) infinite}
      .seed{animation:seed-fall 14s ease-in var(--seed-delay) infinite}
      .repo-tree{transform-box:fill-box;transform-origin:center bottom;animation:sway 4.8s ease-in-out infinite alternate}
      .tree-1{animation-delay:-1.2s}.tree-2{animation-delay:-2.4s}
      .fruit{animation:fruit-glow 3.2s ease-in-out infinite}.f1{animation-delay:-1s}.f2{animation-delay:-2s}
      .firefly{animation:firefly 4s ease-in-out infinite}.fly-1,.fly-5{animation-delay:-1.3s}.fly-2,.fly-6{animation-delay:-2.5s}.fly-3,.fly-7{animation-delay:-3.2s}
      .vine{stroke-dasharray:900;stroke-dashoffset:900;animation:vine-grow 4.5s ease-out 1.4s forwards}
      @keyframes plant-grow{0%,5%{opacity:0;transform:scaleY(.05)}14%,82%{opacity:1;transform:scaleY(1)}88%,100%{opacity:0;transform:scaleY(.08)}}
      @keyframes seed-fall{0%,5%{opacity:0;transform:translateY(-22px)}8%{opacity:1}15%{opacity:0;transform:translateY(31px)}100%{opacity:0}}
      @keyframes sway{from{transform:rotate(-1.6deg)}to{transform:rotate(1.8deg)}}
      @keyframes fruit-glow{0%,100%{opacity:.6;filter:none}50%{opacity:1;filter:url(#gardenGlow)}}
      @keyframes firefly{0%,100%{opacity:.15;transform:translate(0,0)}35%{opacity:1;transform:translate(7px,-9px)}70%{opacity:.35;transform:translate(-5px,5px)}}
      @keyframes vine-grow{to{stroke-dashoffset:0}}
      @media(prefers-reduced-motion:reduce){.plant,.seed,.repo-tree,.fruit,.firefly{animation:none}.plant{opacity:1}.seed{display:none}.vine{animation:none;stroke-dashoffset:0}}
    </style>
  </defs>
  <g clip-path="url(#gardenCard)">
    <rect width="980" height="470" fill="url(#gardenSky)"/>
    <circle cx="884" cy="-16" r="178" fill="url(#moonGlow)"/>
    <path d="M0 169H980M235 83V169M421 83V169M607 83V169M794 83V169" stroke="${palette.grid}" stroke-opacity=".12"/>
    <g>
      <text x="38" y="38" class="garden-kicker">REPO GARDENER / LAST 12 MONTHS</text>
      <text x="38" y="68" class="garden-name">${safeName}</text>
      <text x="38" y="88" class="garden-handle">github.com/${safeLogin}</text>
      <text x="940" y="62" text-anchor="end" class="garden-tag"><tspan fill="${palette.accentStrong}">@</tspan>AIAI</text>
    </g>
    <g transform="translate(260 0)"><text y="125" class="metric-value">${calendar.totalContributions}</text><text y="146" class="metric-label">SEEDS / COMMITS</text></g>
    <g transform="translate(446 0)"><text y="125" class="metric-value">${streak}</text><text y="146" class="metric-label">STREAK VINE</text></g>
    <g transform="translate(632 0)"><text y="125" class="metric-value">${repos.length}</text><text y="146" class="metric-label">ACTIVE REPOS</text></g>
    <g transform="translate(819 0)"><text y="125" class="metric-value">${stars}</text><text y="146" class="metric-label">GLOWING FRUITS</text></g>

    <text x="150" y="205" class="plot-label">THE CONTRIBUTION GARDEN</text>
    <rect x="150" y="216" width="680" height="162" rx="20" fill="url(#soil)" stroke="${palette.plotBorder}" stroke-width="1.5"/>
    <path d="M159 232H821M159 272H821M159 312H821M159 352H821" stroke="${palette.furrow}" stroke-opacity=".25"/>
    ${renderGardenPlot(calendar.days, palette)}
    <path class="vine" d="${vine}" fill="none" stroke="${palette.vine}" stroke-width="3" stroke-linecap="round"/>
    <g fill="${palette.accent}"><circle cx="${vineEndX(streak)}" cy="${VINE_Y}" r="4"/><circle cx="${vineEndX(streak) + 6}" cy="${VINE_Y - 5}" r="2.5"/></g>

    <text x="38" y="205" class="plot-label">ACTIVE REPOS</text>
    <text x="854" y="205" class="plot-label">ACTIVE REPOS</text>
    ${renderRepoTrees(repos, palette)}
    ${renderFireflies(stars, palette)}

    <g transform="translate(38 430)">
      <path d="M0 17q8-17 16 0" fill="none" stroke="${palette.vine}" stroke-width="3"/><circle cx="8" cy="5" r="3" fill="${palette.accentStrong}"/>
      <text x="27" y="14" class="garden-kicker" fill="${palette.text}">GROW / TEND / REPEAT</text>
      <text x="904" y="14" text-anchor="end" class="garden-handle">code grows when you care for it</text>
    </g>
  </g>
  <rect x="1" y="1" width="978" height="468" rx="26" fill="none" stroke="${palette.border}" stroke-width="2"/>
</svg>`;
}
