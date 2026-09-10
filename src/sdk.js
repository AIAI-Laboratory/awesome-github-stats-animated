import { normalizeStatsAccentColor } from './githubStatsTheme.js';

export function escapeXml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function truncate(value, length) {
  const text = String(value ?? '');
  return text.length > length ? `${text.slice(0, Math.max(0, length - 1))}…` : text;
}

export function compactNumber(value) {
  const number = Number.isFinite(Number(value)) ? Number(value) : 0;
  return new Intl.NumberFormat('en', {
    notation: Math.abs(number) >= 10000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(number);
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

export function optionDefaults(manifest) {
  return Object.fromEntries(
    Object.entries(manifest.options || {}).map(([key, definition]) => [key, definition.default]),
  );
}

export function mergeOptions(manifest, options = {}) {
  const definitions = manifest.options || {};
  return Object.fromEntries(
    Object.entries(definitions).map(([key, definition]) => [
      key,
      Object.hasOwn(options, key) ? options[key] : definition.default,
    ]),
  );
}

export function normalizeStats(input = {}) {
  const profile = input.profile || {};
  const calendar = input.calendar || {};
  const days = Array.isArray(calendar.days) ? calendar.days.slice(0, 371) : [];

  while (days.length < 371) {
    days.push({ date: '', count: 0, level: 0, future: true });
  }

  return {
    profile: {
      login: String(profile.login || 'github-user'),
      name: String(profile.name || profile.login || 'GitHub User'),
      publicRepos: Number(profile.publicRepos) || 0,
      followers: Number(profile.followers) || 0,
      activeRepos: Array.isArray(profile.activeRepos) ? profile.activeRepos.slice(0, 10) : [],
      activeRepoStars: Number(profile.activeRepoStars) || 0,
    },
    calendar: {
      totalContributions: Number(calendar.totalContributions) || 0,
      currentStreak: Number(calendar.currentStreak) || 0,
      longestStreak: Number(calendar.longestStreak) || 0,
      activeDays: Number(calendar.activeDays) || 0,
      firstDate: String(calendar.firstDate || ''),
      weeklyTotals: Array.isArray(calendar.weeklyTotals) ? calendar.weeklyTotals.slice(0, 53) : [],
      days,
    },
  };
}

export function svgDocument({ width, height, title, description, body, styles = '', defs = '' }) {
  const safeTitle = escapeXml(title);
  const safeDescription = escapeXml(description);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${safeTitle}</title>
  <desc id="desc">${safeDescription}</desc>
  <defs>${defs}<style>${styles}</style></defs>
  ${body}
</svg>`;
}

export function normalizeTemplateInput(manifest, input = {}) {
  const options = mergeOptions(manifest, input.options);
  const theme = ['auto', 'dark', 'light'].includes(options.theme) ? options.theme : 'auto';
  const accent = normalizeStatsAccentColor(options.accent);
  const keys = ['particleA', 'particleB', 'particleC', 'particleD'];
  const changedPalette = keys.some((key) => manifest.options[key] && options[key] !== manifest.options[key].default);
  const custom = changedPalette || accent !== manifest.options.accent?.default;
  const palette = keys.map((key) => normalizeStatsAccentColor(options[key]));
  return {
    ...normalizeStats(input), theme,
    accentColor: custom ? accent : undefined,
    accentPalette: changedPalette && palette.every(Boolean) ? [accent, ...palette] : undefined,
  };
}
