import { normalizeStatsAccentColor } from '../../src/githubStatsTheme.js';

const escapeXml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[c]);
const shorten = (value, length) => {
  const text = String(value ?? '');
  return escapeXml(text.length > length ? `${text.slice(0, length - 1)}…` : text);
};
const number = (value) => Math.max(0, Number(value) || 0);
const format = (value) => new Intl.NumberFormat('en', {
  notation: number(value) >= 10000 ? 'compact' : 'standard', maximumFractionDigits: 1,
}).format(number(value));
const THEMES = {
  dark: { background: '#0b0d0f', text: '#ecedef', muted: '#93999e', line: '#2a2f33', dot: '#2c3237', signal: '#858e95' },
  light: { background: '#ffffff', text: '#20262b', muted: '#687078', line: '#e0e4e7', dot: '#e4e8eb', signal: '#717b83' },
};
const variables = (palette) => Object.entries(palette).map(([key, value]) => `--science-${key}:${value}`).join(';');

export function renderGitHubScienceSvg({ profile, calendar, theme = 'auto', accentColor }) {
  const accent = normalizeStatsAccentColor(accentColor) || '#ff5a4f';
  const mode = theme === 'dark' || theme === 'light' ? theme : 'auto';
  const colors = THEMES[mode === 'light' ? 'light' : 'dark'];
  const themeCss = `:root{${variables(colors)}}${mode === 'auto' ? `@media(prefers-color-scheme:light){:root{${variables(THEMES.light)}}}` : ''}`;
  const days = (calendar.days || []).slice(0, 371);
  const weeks = Array.from({ length: 53 }, (_, week) => days.slice(week * 7, week * 7 + 7)
    .reduce((sum, day) => sum + (day.future ? 0 : number(day.count)), 0));
  const peak = Math.max(1, ...weeks);
  const path = weeks.map((total, index) => `${index ? 'L' : 'M'}${302 + index * 12} ${(265 - total / peak * 58).toFixed(1)}`).join(' ');
  const observed = days.filter((day) => !day.future).length;
  const density = Math.min(100, Math.round(number(calendar.activeDays) / Math.max(1, observed) * 100));
  const stats = [
    ['CONTRIBUTIONS', calendar.totalContributions, 'Σ'], ['CURRENT STREAK', calendar.currentStreak, 'd'],
    ['LONGEST STREAK', calendar.longestStreak, 'd'], ['ACTIVE DAYS', calendar.activeDays, 'd'],
  ];
  const cells = days.map((day, index) => {
    const level = day.future ? 0 : Math.round(Math.min(4, number(day.level)));
    const x = 92 + Math.floor(index / 7) * 16;
    const y = 330 + (index % 7) * 12;
    return `<g><circle cx="${x}" cy="${y}" r="3" fill="var(--science-dot)" opacity="${day.future ? '.3' : '1'}"/>${level ? `<circle cx="${x}" cy="${y}" r="${2.2 + level * .28}" fill="${accent}" opacity="${(.2 + level * .2).toFixed(2)}"/>` : ''}<title>${escapeXml(day.date)}: ${number(day.count)} contributions</title></g>`;
  }).join('');
  const monthLabels = [];
  let previousMonth = '';
  days.forEach((day, index) => {
    if (index % 7 || day.future || !/^\d{4}-\d{2}-\d{2}$/.test(day.date)) return;
    const month = day.date.slice(0, 7);
    if (month === previousMonth) return;
    previousMonth = month;
    const label = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][Number(day.date.slice(5, 7)) - 1];
    const x = 92 + Math.floor(index / 7) * 16;
    if (monthLabels.length && x - monthLabels.at(-1).x < 42) return;
    monthLabels.push({ x, label });
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="980" height="470" viewBox="0 0 980 470" role="img" aria-labelledby="science-title science-desc">
  <title id="science-title">Field Notes — GitHub activity of ${escapeXml(profile.login)}</title>
  <desc id="science-desc">${number(calendar.totalContributions)} contributions, ${number(calendar.activeDays)} active days, ${number(calendar.currentStreak)} day current streak. Weekly activity trace and daily contribution dot matrix. Motion is decorative; values remain fixed.</desc>
  <defs><style>
    ${themeCss}
    text{font-family:ui-monospace,SFMono-Regular,Consolas,"Liberation Mono",monospace;fill:var(--science-text)}
    .micro{font-size:9px;letter-spacing:1.5px;fill:var(--science-muted)}.meta{font-size:10px;fill:var(--science-muted)}
    .name{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:25px;font-weight:600;letter-spacing:-.6px}
    .value{font-size:32px;letter-spacing:-1.5px}.rule{stroke:var(--science-line);fill:none}.accent{fill:${accent}}
    .trace{fill:none;stroke:var(--science-signal);stroke-width:1.3;stroke-linejoin:round;stroke-linecap:round}
    .live{animation:breathe 5s ease-in-out infinite}.traveller{fill:${accent};stroke:var(--science-background);stroke-width:2}
    @keyframes breathe{0%,100%{opacity:1}50%{opacity:.4}}
    @media(prefers-reduced-motion:reduce){.live{animation:none}.traveller{display:none}}
  </style><clipPath id="science-clip"><rect x="1" y="1" width="978" height="468" rx="16"/></clipPath></defs>
  <g clip-path="url(#science-clip)">
    <rect width="980" height="470" fill="var(--science-background)"/>
    <path class="rule" d="M36 91H944M36 174H944M36 286H944M36 428H944"/>
    <path d="M37 29V43M30 36H44" stroke="${accent}" stroke-width="1.5"/>
    <text x="57" y="40" class="micro">FIELD NOTES / GITHUB OBSERVATORY</text>
    <text x="36" y="74" class="name">${shorten(profile.name || profile.login, 34)}</text>
    <text x="944" y="39" text-anchor="end" class="meta"><tspan class="accent">@</tspan>AIAI</text>
    <text x="944" y="70" text-anchor="end" class="meta">/${shorten(profile.login, 39)}</text>
    ${stats.map(([label, value, unit], index) => {
      const x = 36 + index * 232;
      return `${index ? `<path class="rule" d="M${x - 18} 109V156"/>` : ''}<text x="${x}" y="118" class="micro">${label}</text><text x="${x}" y="154" class="value">${format(value)}</text><text x="${x + 172}" y="151" class="meta">${unit}</text>`;
    }).join('')}
    <text x="36" y="202" class="micro">01 / ACTIVITY TRACE</text>
    <text x="36" y="232" font-size="21">${density}<tspan class="meta"> % active days</tspan></text>
    <text x="36" y="257" class="meta">${observed} days observed</text>
    <path class="rule" d="M278 192V271M302 207H926M302 236H926M302 265H926" stroke-dasharray="2 5"/>
    <text x="926" y="199" text-anchor="end" class="micro">WEEKLY CONTRIBUTIONS</text>
    <path class="trace" d="${path}"/>
    <circle class="traveller" r="4"><animateMotion path="${path}" dur="18s" repeatCount="indefinite" calcMode="linear"/></circle>
    <text x="36" y="307" class="micro">02 / CONTRIBUTION FIELD</text>
    ${monthLabels.map(({ x, label }) => `<text x="${x}" y="319" class="micro" style="font-size:7px;letter-spacing:.7px">${label}</text>`).join('')}
    <text x="36" y="333" class="micro" style="font-size:7px">SUN</text><text x="36" y="369" class="micro" style="font-size:7px">WED</text><text x="36" y="405" class="micro" style="font-size:7px">SAT</text>
    ${cells}
    <circle cx="40" cy="449" r="2.5" class="accent live"/><text x="53" y="452" class="micro">PUBLIC ACTIVITY</text>
    <text x="280" y="452" class="meta">${format(profile.publicRepos)} repos · ${format(profile.followers)} followers</text>
    <text x="770" y="452" class="micro">LOW</text>
    ${[0, 1, 2, 3, 4].map((level) => `<circle cx="${810 + level * 17}" cy="449" r="3" fill="${level ? accent : 'var(--science-dot)'}" opacity="${level ? .2 + level * .2 : 1}"/>`).join('')}
    <text x="900" y="452" class="micro">HIGH</text>
  </g><rect x=".5" y=".5" width="979" height="469" rx="16" class="rule"/>
</svg>`;
}
