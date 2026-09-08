import {
  clamp,
  compactNumber,
  escapeXml,
  mergeOptions,
  normalizeStats,
  svgDocument,
  truncate,
} from '../../src/sdk.js';
import manifest from './manifest.json' with { type: 'json' };

const X = 92;
const Y = 302;
const STEP_X = 15;
const STEP_Y = 15;
const COLORS = ['#19191c', '#541411', '#8d201a', '#c92d25'];

function renderCells(days, accent) {
  return days.map((day, index) => {
    const week = Math.floor(index / 7);
    const weekday = index % 7;
    const level = day.future ? 0 : clamp(day.level, 0, 4);
    const phase = Math.min(3, Math.floor(week / 14));
    const color = level === 4 ? accent : COLORS[level];
    return `<rect class="day${level > 0 ? ` active phase-${phase}` : ''}" x="${X + week * STEP_X}" y="${Y + weekday * STEP_Y}" width="11" height="11" rx="3" fill="${color}" style="--cell-delay:${(index * 0.003).toFixed(3)}s"><title>${escapeXml(day.date)} · ${day.count} contributions</title></rect>`;
  }).join('');
}

function signalPath(values) {
  const totals = values.length ? values : [0, 0];
  const max = Math.max(...totals, 1);
  return totals.map((value, index) => {
    const x = X + (index / Math.max(1, totals.length - 1)) * 787;
    const y = 262 - (value / max) * 38;
    return `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
}

function renderUfo(accent) {
  return `<g class="ufo">
    <path class="beam" d="M-32 18L-86 170H86L32 18Z" fill="${accent}" opacity=".15"/>
    <path d="M-34 2C-29-27-17-39 0-39S29-27 34 2Z" fill="#17171a" stroke="#f5f5f7" stroke-width="2"/>
    <path d="M-18-4C-13-20-7-25 0-25S13-20 18-4Z" fill="${accent}"/>
    <path d="M-76 4Q0-18 76 4L59 22Q0 35-59 22Z" fill="#f5f5f7" stroke="#09090a" stroke-width="2"/>
    <path d="M-57 22Q0 34 57 22L45 31H-45Z" fill="#29292d" stroke="#f5f5f7"/>
    <g fill="${accent}"><circle class="light" cx="-48" cy="20" r="3"/><circle class="light alt" cx="48" cy="20" r="3"/><rect x="-20" y="24" width="40" height="7" rx="3.5"/></g>
  </g>`;
}

export function render(input) {
  const { profile, calendar } = normalizeStats(input);
  const options = mergeOptions(manifest, input.options);
  const accent = escapeXml(options.accent);
  const duration = clamp(options.duration, 10, 40);
  const name = escapeXml(truncate(profile.name, 32));
  const login = escapeXml(truncate(profile.login, 39));
  const body = `
    <rect width="980" height="470" rx="26" fill="${escapeXml(options.background)}"/>
    <circle cx="835" cy="20" r="190" fill="${accent}" opacity=".06"/>
    <path d="M0 194H980M245 92V194M474 92V194M703 92V194" stroke="#fff" opacity=".065"/>
    <text x="40" y="42" class="kicker">CONTRIBUTION SIGNAL / LAST 12 MONTHS</text>
    <text x="40" y="75" class="name">${name}</text><text x="40" y="96" class="muted">github.com/${login}</text>
    <text x="936" y="60" text-anchor="end" class="brand"><tspan fill="${accent}">@</tspan>AIAI</text>
    <g transform="translate(275 0)"><text y="142" class="value">${compactNumber(calendar.totalContributions)}</text><text y="164" class="label">CONTRIBUTIONS</text></g>
    <g transform="translate(500 0)"><text y="142" class="value">${calendar.currentStreak}</text><text y="164" class="label">CURRENT STREAK</text></g>
    <g transform="translate(725 0)"><text y="142" class="value">${calendar.activeDays}</text><text y="164" class="label">ACTIVE DAYS</text></g>
    <path class="signal" d="${signalPath(calendar.weeklyTotals)}" fill="none" stroke="${accent}" stroke-width="2"/>
    ${renderCells(calendar.days, accent)}
    ${renderUfo(accent)}
    <text x="40" y="448" class="kicker">COMMIT / BUILD / REPEAT</text>
    <rect x="1" y="1" width="978" height="468" rx="25" fill="none" stroke="#34343a" stroke-width="2"/>`;

  return svgDocument({
    width: manifest.width,
    height: manifest.height,
    title: `UFO Abduction stats for ${profile.login}`,
    description: `An animated UFO abducting ${calendar.totalContributions} contributions across the last year.`,
    body,
    styles: `
      text{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.kicker,.label{fill:${accent};font-size:9px;font-weight:700;letter-spacing:1.8px}.name{fill:#fff;font-size:28px;font-weight:750}.muted{fill:#898991;font-size:11px}.brand{fill:#fff;font-size:20px;font-weight:750}.value{fill:#fff;font-size:32px;font-weight:750}.day{transform-box:fill-box;transform-origin:center;animation:appear .5s ease-out var(--cell-delay) both}.active{animation:appear .5s ease-out var(--cell-delay) both,pulse 3s ease-in-out infinite}.ufo{animation:flight ${duration}s cubic-bezier(.4,0,.2,1) infinite}.beam{animation:beam ${duration}s steps(1,end) infinite}.light{animation:blink .6s steps(1,end) infinite}.alt{animation-delay:.3s}.signal{stroke-dasharray:1200;animation:draw 2.2s ease-out both}
      .phase-0{animation-delay:var(--cell-delay),1s}.phase-1{animation-delay:var(--cell-delay),4.5s}.phase-2{animation-delay:var(--cell-delay),8s}.phase-3{animation-delay:var(--cell-delay),11.5s}
      @keyframes appear{from{opacity:0;transform:scale(.2)}to{opacity:1;transform:scale(1)}}@keyframes pulse{50%{filter:drop-shadow(0 0 5px ${accent})}}@keyframes draw{from{stroke-dashoffset:1200}to{stroke-dashoffset:0}}@keyframes blink{50%{opacity:.2}}
      @keyframes flight{0%{opacity:0;transform:translate(-120px,190px)}8%,22%{opacity:1;transform:translate(190px,190px)}31%,45%{transform:translate(395px,178px)}54%,68%{transform:translate(600px,192px)}77%,91%{opacity:1;transform:translate(805px,180px)}100%{opacity:0;transform:translate(1080px,115px)}}
      @keyframes beam{0%,7%,23%,30%,46%,53%,69%,76%,92%,100%{opacity:0}8%,22%,31%,45%,54%,68%,77%,91%{opacity:.15}}
      @media(prefers-reduced-motion:reduce){.day,.active,.ufo,.beam,.light,.signal{animation:none}.ufo{transform:translate(490px,185px)}.beam{opacity:.12}}`,
  });
}
