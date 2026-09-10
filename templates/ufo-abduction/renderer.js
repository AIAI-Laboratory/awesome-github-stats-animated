import { getUfoTheme, getUfoThemeCss, resolveStatsTheme } from '../../src/githubStatsTheme.js';

const WIDTH = 980;
const HEIGHT = 470;
const CELL = 11;
const GAP = 4;
const GRAPH_X = 120;
const GRAPH_Y = 276;
const GRAPH_WIDTH = 53 * (CELL + GAP) - GAP;
const ABDUCTION_WINDOWS = [
  { start: 10, end: 20 },
  { start: 27, end: 37 },
  { start: 44, end: 54 },
  { start: 61, end: 71 },
  { start: 78, end: 88 },
];

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function compactNumber(value) {
  return new Intl.NumberFormat('en', {
    notation: value >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);
}

function truncate(value, length) {
  return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}

function monthLabels(firstDate) {
  const labels = [];
  const start = new Date(`${firstDate}T00:00:00Z`);
  let previousMonth = -1;

  for (let week = 0; week < 53; week += 1) {
    const date = new Date(start.getTime() + week * 7 * 86400000);
    const month = date.getUTCMonth();
    if (month !== previousMonth && week > 0) {
      labels.push({
        x: GRAPH_X + week * (CELL + GAP),
        label: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][month],
      });
    }
    previousMonth = month;
  }

  return labels;
}

function sparklinePath(weeklyTotals) {
  const max = Math.max(...weeklyTotals, 1);
  const baseline = 235;
  const amplitude = 31;
  return weeklyTotals
    .map((value, index) => {
      const x = GRAPH_X + (index / (weeklyTotals.length - 1)) * GRAPH_WIDTH;
      const y = baseline - (value / max) * amplitude;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function shuffled(values) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function createAbductionPlan() {
  const zones = [
    { min: 0, max: 10, x: GRAPH_X + 5 * (CELL + GAP) },
    { min: 11, max: 21, x: GRAPH_X + 16 * (CELL + GAP) },
    { min: 22, max: 31, x: GRAPH_X + 27 * (CELL + GAP) },
    { min: 32, max: 42, x: GRAPH_X + 37 * (CELL + GAP) },
    { min: 43, max: 52, x: GRAPH_X + 48 * (CELL + GAP) },
  ];
  const order = shuffled(zones.map((_, index) => index));
  const phaseByZone = new Map(order.map((zoneIndex, phase) => [zoneIndex, phase]));
  const targets = order.map((zoneIndex) => zones[zoneIndex].x);
  const entryOptions = [
    { x: -150, y: 158, rotation: -8 },
    { x: WIDTH + 150, y: 145, rotation: 8 },
    { x: 170 + Math.round(Math.random() * 640), y: -90, rotation: -4 },
  ];
  const entry = entryOptions[Math.floor(Math.random() * entryOptions.length)];
  const exit = entry.x < 0
    ? { x: WIDTH + 160, y: 96, rotation: 9 }
    : { x: -160, y: 104, rotation: -9 };

  return { zones, phaseByZone, targets, entry, exit };
}

function zoneForWeek(week, zones) {
  return zones.findIndex(({ min, max }) => week >= min && week <= max);
}

function renderCells(days, plan, palette) {

  return days
    .map((day, index) => {
      const week = Math.floor(index / 7);
      const weekday = index % 7;
      const x = GRAPH_X + week * (CELL + GAP);
      const y = GRAPH_Y + weekday * (CELL + GAP);
      const delay = (0.58 + week * 0.018 + weekday * 0.012).toFixed(3);
      const level = day.future ? 0 : Math.min(4, Math.max(0, day.level));
      const zone = zoneForWeek(week, plan.zones);
      const phase = plan.phaseByZone.get(zone) ?? 0;
      const isAbducted = level > 0 && !day.future;
      const className = level > 0 ? `day active${isAbducted ? ` abduct phase-${phase}` : ''}` : 'day';
      const opacity = day.future ? 0.18 : 1;
      const drift = Math.round(plan.targets[phase] - (x + CELL / 2));
      const lift = Math.round(184 - (y + CELL / 2));
      const jitter = ((index % 5) - 2) * 2;
      return `<rect class="${className}" x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="3" fill="${palette.levels[level]}" opacity="${opacity}" style="--delay:${delay}s;--pulse:${(week * 0.11 + weekday * 0.05).toFixed(2)}s;--drift:${drift + jitter}px;--lift:${lift}px"><title>${escapeXml(day.date)} · ${day.count} contribution${day.count === 1 ? '' : 's'}</title></rect>`;
    })
    .join('');
}

function renderUfo(palette) {
  return `<g class="ufo">
    <g class="tractor-beam">
      <path d="M-34 15L-98 181H98L34 15Z" fill="${palette.accent}" opacity=".16"/>
      <path d="M-34 15L-98 181M34 15L98 181" fill="none" stroke="${palette.accentSoft}" stroke-width="1.5" stroke-dasharray="4 8" opacity=".72"/>
      <circle class="beam-particle p1" cx="-43" cy="128" r="2.5" fill="${palette.beamParticle}"/>
      <circle class="beam-particle p2" cx="31" cy="151" r="2" fill="${palette.accentSoft}"/>
      <circle class="beam-particle p3" cx="4" cy="92" r="1.8" fill="${palette.beamParticle}"/>
    </g>
    <g class="ufo-body">
      <path d="M-34 1C-30-25-18-37 0-37S30-25 34 1Z" fill="${palette.dome}" stroke="${palette.shell}" stroke-width="2"/>
      <path d="M-20-4C-15-18-9-24 0-24S15-18 20-4Z" fill="${palette.accent}"/>
      <path d="M-78 3Q0-18 78 3L61 20Q0 34-61 20Z" fill="${palette.shell}" stroke="${palette.outline}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M-61 20Q0 34 61 20L48 31H-48Z" fill="${palette.lowerShell}" stroke="${palette.shell}" stroke-width="1.5"/>
      <rect x="-22" y="23" width="44" height="8" rx="4" fill="${palette.accent}"/>
      <g fill="${palette.accent}">
        <circle class="ufo-light l1" cx="-52" cy="18" r="3"/><circle class="ufo-light l2" cx="-30" cy="23" r="3"/>
        <circle class="ufo-light l3" cx="30" cy="23" r="3"/><circle class="ufo-light l4" cx="52" cy="18" r="3"/>
      </g>
    </g>
    <g class="target-label" transform="translate(-52 -61)">
      <rect width="104" height="18" rx="9" fill="${palette.labelBackground}" stroke="${palette.accent}" stroke-opacity=".45"/>
      <text x="52" y="12" text-anchor="middle" fill="${palette.accentSoft}" font-size="7" font-weight="700" letter-spacing="1.1">COMMITS LOCKED</text>
    </g>
  </g>`;
}

function ufoFlightKeyframes(plan) {
  const positions = plan.targets.map((x, index) => ({
    x,
    y: 180 + ((index % 3) - 1) * 6,
    rotation: index % 2 === 0 ? -1 : 1,
  }));
  const frames = [
    `0%{opacity:0;transform:translate(${plan.entry.x}px,${plan.entry.y}px) rotate(${plan.entry.rotation}deg)}`,
    '4%{opacity:1}',
    `8%,10%,20%{opacity:1;transform:translate(${positions[0].x}px,${positions[0].y}px) rotate(${positions[0].rotation}deg)}`,
    `25%,27%,37%{opacity:1;transform:translate(${positions[1].x}px,${positions[1].y}px) rotate(${positions[1].rotation}deg)}`,
    `42%,44%,54%{opacity:1;transform:translate(${positions[2].x}px,${positions[2].y}px) rotate(${positions[2].rotation}deg)}`,
    `59%,61%,71%{opacity:1;transform:translate(${positions[3].x}px,${positions[3].y}px) rotate(${positions[3].rotation}deg)}`,
    `76%,78%,88%{opacity:1;transform:translate(${positions[4].x}px,${positions[4].y}px) rotate(${positions[4].rotation}deg)}`,
    `100%{opacity:0;transform:translate(${plan.exit.x}px,${plan.exit.y}px) rotate(${plan.exit.rotation}deg)}`,
  ];
  return `@keyframes ufo-flight{${frames.join('')}}`;
}

function abductionKeyframes() {
  return ABDUCTION_WINDOWS.map(({ start, end }, phase) => {
    const liftStart = start + 2;
    const vanish = end - 1;
    return `
      .day.active.abduct.phase-${phase}{animation:cell-in .48s cubic-bezier(.22,.9,.25,1.3) var(--delay) forwards,abduct-${phase} 18s cubic-bezier(.35,0,.2,1) 2.65s infinite}
      @keyframes abduct-${phase}{0%,${liftStart}%{opacity:1;transform:translate(0,0) scale(1) rotate(0)}${vanish}%{opacity:1;transform:translate(var(--drift),var(--lift)) scale(.12) rotate(150deg);filter:url(#glow)}${end}%,96%{opacity:0;transform:translate(var(--drift),var(--lift)) scale(.03) rotate(220deg)}97%{opacity:0;transform:translate(0,0) scale(.2)}100%{opacity:1;transform:translate(0,0) scale(1)}}`;
  }).join('');
}

function renderStat(x, value, label, delay) {
  return `<g transform="translate(${x} 0)"><g class="stat" style="--delay:${delay}s">
    <text y="139" class="stat-value">${escapeXml(compactNumber(value))}</text>
    <text y="161" class="stat-label">${escapeXml(label)}</text>
  </g>
  </g>`;
}

export function renderGitHubStatsSvg({ profile, calendar, theme = 'auto', accentColor, accentPalette }) {
  const themeName = resolveStatsTheme(theme);
  const palette = getUfoTheme(themeName, accentColor, accentPalette);
  const adaptiveThemeCss = getUfoThemeCss(themeName, accentColor, accentPalette);
  const safeName = escapeXml(truncate(profile.name, 32));
  const safeLogin = escapeXml(truncate(profile.login, 39));
  const labels = monthLabels(calendar.firstDate);
  const linePath = sparklinePath(calendar.weeklyTotals);
  const abductionPlan = createAbductionPlan();
  const stats = [
    renderStat(48, calendar.totalContributions, 'CONTRIBUTIONS', 0.18),
    renderStat(278, calendar.currentStreak, 'CURRENT STREAK', 0.26),
    renderStat(508, calendar.longestStreak, 'LONGEST STREAK', 0.34),
    renderStat(738, calendar.activeDays, 'ACTIVE DAYS', 0.42),
  ].join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="title desc">
  <title id="title">GitHub contribution signal for ${safeLogin} in ${themeName} mode</title>
  <desc id="desc">${calendar.totalContributions} contributions, ${calendar.currentStreak} day current streak, ${calendar.longestStreak} day longest streak, and ${calendar.activeDays} active days in the last year.</desc>
  <defs>
    <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${palette.edge[0]}"/><stop offset=".45" stop-color="${palette.edge[1]}"/><stop offset="1" stop-color="${palette.edge[2]}"/></linearGradient>
    <radialGradient id="ambient" cx="82%" cy="5%" r="75%"><stop stop-color="${palette.ambient[0]}" stop-opacity=".4"/><stop offset=".42" stop-color="${palette.ambient[1]}" stop-opacity=".14"/><stop offset="1" stop-color="${palette.background}" stop-opacity="0"/></radialGradient>
    <filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
    <clipPath id="card"><rect x="1" y="1" width="978" height="468" rx="26"/></clipPath>
    <style>
      ${adaptiveThemeCss}
      text{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      .eyebrow{fill:${palette.accentSoft};font-size:10px;font-weight:700;letter-spacing:2.2px}
      .name{fill:${palette.text};font-size:26px;font-weight:700;letter-spacing:-.6px}
      .aiai-tag{fill:${palette.text};font-size:20px;font-weight:700;letter-spacing:1.5px}
      .handle,.meta{fill:${palette.muted};font-size:12px}
      .stat{opacity:0;animation:rise .7s cubic-bezier(.2,.8,.2,1) var(--delay) forwards}
      .stat-value{fill:${palette.text};font-size:34px;font-weight:700;letter-spacing:-1px}
      .stat-label{fill:${palette.muted};font-size:9px;font-weight:700;letter-spacing:1.7px}
      .day{transform-box:fill-box;transform-origin:center;opacity:0;animation:cell-in .48s cubic-bezier(.22,.9,.25,1.3) var(--delay) forwards}
      .day.active{animation:cell-in .48s cubic-bezier(.22,.9,.25,1.3) var(--delay) forwards,heartbeat 5.8s ease-in-out calc(2.2s + var(--pulse)) infinite}
      ${abductionKeyframes()}
      .month{fill:${palette.muted};font-size:9px;font-weight:700;letter-spacing:1px}
      .trace{stroke-dasharray:1400;stroke-dashoffset:1400;animation:draw 2.2s cubic-bezier(.2,.8,.2,1) .62s forwards}
      .intro{opacity:0;animation:rise .7s cubic-bezier(.2,.8,.2,1) .08s forwards}
      .ufo{opacity:0;animation:ufo-flight 18s cubic-bezier(.45,0,.2,1) 2.65s infinite}
      .tractor-beam{opacity:0;animation:beam-on 18s linear 2.65s infinite}
      .target-label{opacity:0;animation:beam-on 18s steps(1,end) 2.65s infinite}
      .beam-particle{opacity:0;animation:particle-up 1.1s ease-in infinite}
      .beam-particle.p2{animation-delay:.3s}.beam-particle.p3{animation-delay:.65s}
      .ufo-light{animation:blink .55s steps(1,end) infinite}.ufo-light.l2{animation-delay:.14s}.ufo-light.l3{animation-delay:.28s}.ufo-light.l4{animation-delay:.42s}
      @keyframes rise{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:translateY(0)}}
      @keyframes cell-in{from{opacity:0;transform:scale(.25) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
      @keyframes heartbeat{0%,78%,100%{filter:none}84%{filter:url(#glow)}90%{filter:none}94%{filter:url(#glow)}}
      @keyframes draw{to{stroke-dashoffset:0}}
      ${ufoFlightKeyframes(abductionPlan)}
      @keyframes beam-on{0%,9%,21%,26%,38%,43%,55%,60%,72%,77%,89%,100%{opacity:0}10%,20%,27%,37%,44%,54%,61%,71%,78%,88%{opacity:.92}}
      @keyframes particle-up{0%{opacity:0;transform:translateY(35px)}30%{opacity:1}100%{opacity:0;transform:translateY(-70px)}}
      @keyframes blink{0%,48%{opacity:.2}49%,100%{opacity:1;filter:url(#glow)}}
      @media(prefers-reduced-motion:reduce){.stat,.day,.trace,.intro{animation:none;opacity:1}.trace{stroke-dashoffset:0}.ufo{display:none}}
    </style>
  </defs>
  <g clip-path="url(#card)">
    <rect width="980" height="470" fill="${palette.background}"/>
    <rect width="980" height="470" fill="url(#ambient)"/>
    <g opacity=".3" stroke="${palette.grid}" stroke-width="1">
      <path d="M0 62H980M0 184H980M0 406H980"/><path d="M230 92V176M460 92V176M690 92V176"/>
      <circle cx="910" cy="-20" r="150" fill="none"/><circle cx="910" cy="-20" r="196" fill="none"/>
    </g>
    <circle cx="912" cy="36" r="62" fill="${palette.accent}" opacity=".08" filter="url(#softGlow)"/>
    <g class="intro">
      <text x="48" y="43" class="eyebrow">CONTRIBUTION SIGNAL / LAST 12 MONTHS</text>
      <text x="48" y="74" class="name">${safeName}</text>
      <text x="48" y="94" class="handle">github.com/${safeLogin}</text>
      <g transform="translate(700 47)"><circle r="4" fill="${palette.accent}" filter="url(#glow)"/><text x="13" y="4" class="meta" fill="${palette.mutedStrong}">LIVE PUBLIC DATA</text></g>
      <text x="932" y="94" text-anchor="end" class="meta">${profile.publicRepos} public repos · ${profile.followers} followers</text>
    </g>
    <text x="932" y="69" text-anchor="end" class="aiai-tag"><tspan fill="${palette.accent}">@</tspan>AIAI</text>
    ${stats}
    <g>
      <text x="48" y="216" class="eyebrow">ACTIVITY WAVEFORM</text>
      <path d="${linePath}" fill="none" stroke="${palette.accentDim}" stroke-width="7" opacity=".5"/>
      <path class="trace" d="${linePath}" fill="none" stroke="${palette.accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle r="3.5" fill="${palette.text}" filter="url(#glow)"><animateMotion dur="7s" begin="2.1s" repeatCount="indefinite" path="${linePath}"/></circle>
    </g>
    <line x1="48" x2="932" y1="255" y2="255" stroke="${palette.divider}"/>
    ${labels.map(({ x, label }) => `<text x="${x}" y="269" class="month">${label}</text>`).join('')}
    <text x="76" y="286" class="month" text-anchor="end">SUN</text><text x="76" y="331" class="month" text-anchor="end">WED</text><text x="76" y="376" class="month" text-anchor="end">SAT</text>
    <g>${renderCells(calendar.days, abductionPlan, palette)}</g>
    ${renderUfo(palette)}
    <g transform="translate(48 430)">
      <text x="884" y="12" text-anchor="end" class="meta">commit / build / repeat</text>
    </g>
  </g>
  <rect x="1" y="1" width="978" height="468" rx="26" fill="none" stroke="url(#edge)" stroke-width="2"/>
</svg>`;
}

export function renderErrorSvg(message, username = '', theme = 'auto') {
  const palette = getUfoTheme(theme);
  const adaptiveThemeCss = getUfoThemeCss(theme);
  const safeMessage = escapeXml(truncate(message, 70));
  const safeUsername = escapeXml(truncate(username, 39));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="GitHub stats unavailable">
    <defs><style>${adaptiveThemeCss}</style></defs>
    <rect x="1" y="1" width="978" height="468" rx="26" fill="${palette.background}" stroke="${palette.edge[2]}" stroke-width="2"/>
    <circle cx="490" cy="192" r="34" fill="${palette.accent}" opacity=".12"/><path d="M490 172v27M490 211h.1" stroke="${palette.accent}" stroke-width="5" stroke-linecap="round"/>
    <text x="490" y="268" text-anchor="middle" fill="${palette.text}" font-family="Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="22" font-weight="700">Signal unavailable</text>
    <text x="490" y="296" text-anchor="middle" fill="${palette.muted}" font-family="Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="13">${safeMessage}</text>
    <text x="490" y="327" text-anchor="middle" fill="${palette.accentSoft}" font-family="Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" letter-spacing="1.5">${safeUsername ? `@${safeUsername}` : 'AIAI LABORATORY'}</text>
  </svg>`;
}
