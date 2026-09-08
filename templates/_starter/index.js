import {
  compactNumber,
  escapeXml,
  mergeOptions,
  normalizeStats,
  svgDocument,
  truncate,
} from '../../src/sdk.js';
import manifest from './manifest.json' with { type: 'json' };

const LEVEL_OPACITY = [0.08, 0.32, 0.52, 0.75, 1];

function renderDays(days, accent) {
  return days.map((day, index) => {
    const week = Math.floor(index / 7);
    const weekday = index % 7;
    const x = 88 + week * 15;
    const y = 185 + weekday * 14;
    const level = day.future ? 0 : Math.min(4, Math.max(0, day.level));
    return `<rect class="cell" x="${x}" y="${y}" width="10" height="10" rx="2" fill="${level === 0 ? '#ffffff' : accent}" opacity="${LEVEL_OPACITY[level]}" style="--delay:${(index * 0.004).toFixed(3)}s"><title>${escapeXml(day.date)} · ${day.count} contributions</title></rect>`;
  }).join('');
}

export function render(input) {
  const { profile, calendar } = normalizeStats(input);
  const options = mergeOptions(manifest, input.options);
  const name = escapeXml(truncate(profile.name, 30));
  const handle = escapeXml(truncate(profile.login, 39));
  const body = `
    <rect width="980" height="320" rx="24" fill="${escapeXml(options.background)}"/>
    <rect x="1" y="1" width="978" height="318" rx="23" fill="none" stroke="#2d2d32" stroke-width="2"/>
    <text x="48" y="48" class="kicker">GITHUB ACTIVITY / LAST 12 MONTHS</text>
    <text x="48" y="84" class="name">${name}</text>
    ${options.showHandle ? `<text x="48" y="104" class="muted">github.com/${handle}</text>` : ''}
    <g transform="translate(420 0)"><text y="76" class="value">${compactNumber(calendar.totalContributions)}</text><text y="98" class="label">COMMITS</text></g>
    <g transform="translate(615 0)"><text y="76" class="value">${calendar.currentStreak}</text><text y="98" class="label">CURRENT STREAK</text></g>
    <g transform="translate(810 0)"><text y="76" class="value">${calendar.activeDays}</text><text y="98" class="label">ACTIVE DAYS</text></g>
    <path d="M48 132H932" stroke="#fff" opacity=".08"/>
    ${renderDays(calendar.days, escapeXml(options.accent))}
    <text x="932" y="294" text-anchor="end" class="muted">Edit me → templates/_starter</text>`;

  return svgDocument({
    width: manifest.width,
    height: manifest.height,
    title: `${profile.login}'s GitHub activity`,
    description: `${calendar.totalContributions} contributions and a ${calendar.currentStreak} day current streak.`,
    body,
    styles: `
      text{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      .kicker,.label{fill:${escapeXml(options.accent)};font-size:9px;font-weight:700;letter-spacing:1.8px}
      .name{fill:#fff;font-size:28px;font-weight:750}.value{fill:#fff;font-size:30px;font-weight:750}
      .muted{fill:#85858d;font-size:11px}.cell{transform-box:fill-box;transform-origin:center;animation:enter .5s ease-out var(--delay) both}
      @keyframes enter{from{opacity:0;transform:scale(.2)}to{transform:scale(1)}}
      @media(prefers-reduced-motion:reduce){.cell{animation:none}}`,
  });
}
