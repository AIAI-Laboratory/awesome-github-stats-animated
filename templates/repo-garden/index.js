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

const PLOT_X = 169;
const PLOT_Y = 248;
const STEP_X = 12.2;
const STEP_Y = 16;

function plant(level, leaf, accent) {
  if (level === 0) return '';
  const height = [0, 7, 11, 15, 20][level];
  const bloom = level === 4
    ? `<g transform="translate(0 ${-height})" fill="${accent}"><circle cy="-3" r="3"/><circle cx="3" r="3"/><circle cy="3" r="3"/><circle cx="-3" r="3"/><circle r="1.6" fill="#ffe7a8"/></g>`
    : level === 3 ? `<circle cy="${-height}" r="3" fill="#ffb45f"/>` : '';
  return `<path d="M0 3V${-height}" stroke="${leaf}" stroke-width="2" stroke-linecap="round"/><path d="M0 ${-Math.round(height * .45)}q-6-5-7 2 5 4 7 1M0 ${-Math.round(height * .72)}q6-5 7 2-5 4-7 1" fill="${leaf}"/>${bloom}`;
}

function renderPlot(days, leaf, accent) {
  return days.map((day, index) => {
    const week = Math.floor(index / 7);
    const weekday = index % 7;
    const level = day.future ? 0 : clamp(day.level, 0, 4);
    const x = PLOT_X + week * STEP_X;
    const y = PLOT_Y + weekday * STEP_Y;
    return `<g transform="translate(${x.toFixed(1)} ${y})"><rect x="-4.5" y="-4.5" width="9" height="9" rx="2" fill="${level ? leaf : '#222820'}" opacity="${level ? .45 + level * .12 : .58}"><title>${escapeXml(day.date)} · ${day.count} contributions</title></rect>${level ? `<g class="plant" style="--delay:${(.45 + index * .006).toFixed(3)}s">${plant(level, leaf, accent)}</g>` : ''}</g>`;
  }).join('');
}

function renderTrees(repos, leaf, accent) {
  const fallback = repos.length ? repos.slice(0, 4) : [{ name: 'new-repo', language: 'Code', stars: 0 }];
  const positions = [{ x: 58, y: 354 }, { x: 113, y: 360 }, { x: 869, y: 358 }, { x: 925, y: 352 }];
  return fallback.map((repo, index) => {
    const { x, y } = positions[index];
    const height = 41 + Math.min(13, Number(repo.stars) || 0);
    const fruits = Array.from({ length: Math.min(3, Number(repo.stars) || 0) }, (_, fruit) => `<circle class="fruit" cx="${[-11, 11, 0][fruit]}" cy="${-height + [18, 23, 8][fruit]}" r="3.5" fill="${accent}" style="--fruit-delay:${fruit * -.8}s"/>`).join('');
    return `<g transform="translate(${x} ${y})"><g class="tree" style="--tree-delay:${index * -.7}s"><path d="M0 0V${-height}" stroke="#906643" stroke-width="6" stroke-linecap="round"/><circle cy="${-height}" r="20" fill="#526f49"/><circle cx="-13" cy="${-height + 10}" r="14" fill="#668858"/><circle cx="14" cy="${-height + 11}" r="15" fill="${leaf}"/><circle cy="${-height - 11}" r="14" fill="${leaf}"/>${fruits}</g><text y="18" text-anchor="middle" class="repo">${escapeXml(truncate(repo.name, 10))}</text><text y="31" text-anchor="middle" class="meta">${escapeXml(truncate(repo.language || 'Code', 8))} · ★ ${Number(repo.stars) || 0}</text></g>`;
  }).join('');
}

function vinePath(streak) {
  const start = 164;
  const end = Math.min(812, start + Math.max(0, streak) * 24);
  const commands = [`M${start} 368`];
  for (let x = start + 28; x <= end; x += 28) commands.push(`Q${x - 14} ${x % 56 ? 379 : 355} ${x} 368`);
  return { path: commands.join(' '), end };
}

export function render(input) {
  const { profile, calendar } = normalizeStats(input);
  const options = mergeOptions(manifest, input.options);
  const accent = escapeXml(options.accent);
  const leaf = escapeXml(options.leaf);
  const { path, end } = vinePath(calendar.longestStreak);
  const body = `
    <rect width="980" height="470" rx="26" fill="${escapeXml(options.background)}"/>
    <circle cx="875" cy="0" r="190" fill="#ffb65c" opacity=".07"/>
    <path d="M0 169H980M235 83V169M445 83V169M655 83V169M820 83V169" stroke="#fff" opacity=".07"/>
    <text x="38" y="38" class="kicker">REPO GARDENER / LAST 12 MONTHS</text><text x="38" y="68" class="name">${escapeXml(truncate(profile.name, 30))}</text><text x="38" y="88" class="meta">github.com/${escapeXml(truncate(profile.login, 39))}</text><text x="940" y="62" text-anchor="end" class="brand"><tspan fill="${accent}">@</tspan>AIAI</text>
    <g transform="translate(260)"><text y="125" class="value">${compactNumber(calendar.totalContributions)}</text><text y="146" class="label">SEEDS / COMMITS</text></g><g transform="translate(450)"><text y="125" class="value">${calendar.longestStreak}</text><text y="146" class="label">STREAK VINE</text></g><g transform="translate(630)"><text y="125" class="value">${profile.activeRepos.length}</text><text y="146" class="label">ACTIVE REPOS</text></g><g transform="translate(800)"><text y="125" class="value">${compactNumber(profile.activeRepoStars)}</text><text y="146" class="label">GLOWING FRUITS</text></g>
    <text x="38" y="205" class="label">ACTIVE REPOS</text><text x="150" y="205" class="label">THE CONTRIBUTION GARDEN</text><text x="854" y="205" class="label">ACTIVE REPOS</text>
    <rect x="150" y="216" width="680" height="162" rx="20" fill="#251b16" stroke="#73513a" stroke-width="1.5"/><path d="M159 232H821M159 272H821M159 312H821M159 352H821" stroke="#a47756" opacity=".18"/>
    ${renderPlot(calendar.days, leaf, accent)}
    <path class="vine" d="${path}" fill="none" stroke="${leaf}" stroke-width="3" stroke-linecap="round"/><circle cx="${end}" cy="368" r="4" fill="${accent}"/>
    ${renderTrees(profile.activeRepos, leaf, accent)}
    <text x="38" y="446" class="kicker">GROW / TEND / REPEAT</text><text x="942" y="446" text-anchor="end" class="meta">code grows when you care for it</text>
    <rect x="1" y="1" width="978" height="468" rx="25" fill="none" stroke="#53634e" stroke-width="2"/>`;

  return svgDocument({
    width: manifest.width,
    height: manifest.height,
    title: `Repo Garden for ${profile.login}`,
    description: `A living contribution garden with ${profile.activeRepos.length} active repository trees.`,
    body,
    styles: `
      text{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.kicker{fill:${accent};font-size:9px;font-weight:700;letter-spacing:1.8px}.name{fill:#f7f3e8;font-size:25px;font-weight:750}.brand{fill:#f7f3e8;font-size:20px;font-weight:750}.value{fill:#f7f3e8;font-size:28px;font-weight:750}.label{fill:#94a293;font-size:8px;font-weight:700;letter-spacing:1.5px}.meta{fill:#839082;font-size:8px}.repo{fill:#e8eadc;font-size:8px;font-weight:700}.plant{transform-box:fill-box;transform-origin:center bottom;animation:grow 12s cubic-bezier(.2,.85,.25,1) var(--delay) infinite}.tree{transform-box:fill-box;transform-origin:center bottom;animation:sway 4s ease-in-out var(--tree-delay) infinite alternate}.fruit{animation:glow 2.8s ease-in-out var(--fruit-delay) infinite}.vine{stroke-dasharray:800;animation:vine 4s ease-out both}
      @keyframes grow{0%,5%{opacity:0;transform:scaleY(.05)}16%,84%{opacity:1;transform:scaleY(1)}92%,100%{opacity:0;transform:scaleY(.08)}}@keyframes sway{from{transform:rotate(-1.5deg)}to{transform:rotate(1.7deg)}}@keyframes glow{50%{opacity:.45;filter:drop-shadow(0 0 5px ${accent})}}@keyframes vine{from{stroke-dashoffset:800}to{stroke-dashoffset:0}}
      @media(prefers-reduced-motion:reduce){.plant,.tree,.fruit,.vine{animation:none}.plant{opacity:1}}`,
  });
}
