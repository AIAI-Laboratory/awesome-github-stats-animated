const UFO_THEMES = {
  dark: {
    background: '#070708',
    text: '#ffffff',
    muted: '#85858d',
    mutedStrong: '#b6b6bc',
    grid: '#252529',
    divider: '#242428',
    accent: '#ff3b30',
    accentSoft: '#ff6b62',
    accentDim: '#3c1110',
    inactive: '#171719',
    levels: ['#171719', '#43100e', '#7c1b16', '#bd2b24', '#ff3b30'],
    edge: ['#3b3b3f', '#1c1c1f', '#42110f'],
    ambient: ['#54120f', '#170b0b'],
    dome: '#19191c',
    shell: '#f4f4f6',
    lowerShell: '#2b2b2f',
    outline: '#09090a',
    labelBackground: '#101012',
    beamParticle: '#ffffff',
  },
  light: {
    background: '#ffffff',
    text: '#181719',
    muted: '#716d6b',
    mutedStrong: '#4e4a49',
    grid: '#d8d3ce',
    divider: '#d5d0cb',
    accent: '#ff3b30',
    accentSoft: '#ff6b62',
    accentDim: '#ffd2ce',
    inactive: '#e8e3de',
    levels: ['#e8e3de', '#fac7c1', '#f18e85', '#e4584e', '#d92e26'],
    edge: ['#c9c3bd', '#e2ddd8', '#d8a39d'],
    ambient: ['#ffffff', '#ffffff'],
    dome: '#d8e3e7',
    shell: '#ffffff',
    lowerShell: '#4a4a50',
    outline: '#242326',
    labelBackground: '#fffaf7',
    beamParticle: '#242326',
  },
};

const GARDEN_THEMES = {
  dark: {
    sky: ['#111712', '#0c120e', '#1a120f'],
    soil: ['#3c2b20', '#1c1713'],
    text: '#f7f3e8',
    muted: '#8e9b8d',
    label: '#9aa899',
    repoText: '#e8eadc',
    repoMeta: '#7e8c7d',
    grid: '#e8eadc',
    border: '#53634e',
    plotBorder: '#73513a',
    furrow: '#a47756',
    accent: '#ff7469',
    accentStrong: '#ff594f',
    fruit: '#ffb94d',
    seed: '#ffc76b',
    moon: '#ffb65c',
    trunk: '#906643',
    plants: ['#222820', '#68845b', '#83a969', '#a7c873', '#d7e58a'],
    tree: ['#526f49', '#668858', '#789b63', '#8bad6d'],
    vine: '#9fc679',
  },
  light: {
    sky: ['#ffffff', '#ffffff', '#ffffff'],
    soil: ['#eadbc9', '#dbc3a8'],
    text: '#243025',
    muted: '#657466',
    label: '#596a5a',
    repoText: '#273328',
    repoMeta: '#667467',
    grid: '#425044',
    border: '#91a187',
    plotBorder: '#b38b68',
    furrow: '#b9906c',
    accent: '#ff7469',
    accentStrong: '#ff594f',
    fruit: '#ffb94d',
    seed: '#ffc76b',
    moon: '#ffffff',
    trunk: '#805639',
    plants: ['#f6f1eb', '#5e8454', '#4f874c', '#397d42', '#286d38'],
    tree: ['#486f43', '#5f8a55', '#72a05f', '#84ad69'],
    vine: '#568b49',
  },
};

const COLLIDER_THEMES = {
  dark: {
    background: '#06090d',
    panel: '#0a1119',
    text: '#eff8ff',
    muted: '#7f909d',
    grid: '#14212d',
    border: '#21384a',
    accent: '#ff5a4f',
    cyan: '#43e2ff',
    yellow: '#ffc857',
    purple: '#ba77ff',
    green: '#63e6a3',
    detector: ['#111a22', '#193847', '#17657a', '#13a8bd', '#43e2ff'],
  },
  light: {
    background: '#ffffff',
    panel: '#ffffff',
    text: '#172027',
    muted: '#66737c',
    grid: '#e1e7eb',
    border: '#cbd5db',
    accent: '#ff5a4f',
    cyan: '#00a9c6',
    yellow: '#e19a18',
    purple: '#8753cf',
    green: '#2a9c67',
    detector: ['#edf1f3', '#cce8ee', '#86ccd8', '#35aabd', '#00a9c6'],
  },
};

export function resolveStatsTheme(theme) {
  return theme === 'light' || theme === 'auto' ? theme : 'dark';
}

export function getUfoTheme(theme, accentColor, accentPalette) {
   return getThemePalette('ufo', getAccentThemes('ufo', UFO_THEMES, accentColor, accentPalette), theme);
}

export function getGardenTheme(theme, accentColor, accentPalette) {
  return getThemePalette('garden', getAccentThemes('garden', GARDEN_THEMES, accentColor, accentPalette), theme);
}

export function getUfoThemeCss(theme, accentColor, accentPalette) {
  return getAdaptiveThemeCss('ufo', getAccentThemes('ufo', UFO_THEMES, accentColor, accentPalette), theme);
}

export function getGardenThemeCss(theme, accentColor, accentPalette) {
  return getAdaptiveThemeCss('garden', getAccentThemes('garden', GARDEN_THEMES, accentColor, accentPalette), theme);
}

export function getColliderTheme(theme, accentColor, accentPalette) {
  return getThemePalette('collider', getAccentThemes('collider', COLLIDER_THEMES, accentColor, accentPalette), theme);
}

export function getColliderThemeCss(theme, accentColor, accentPalette) {
  return getAdaptiveThemeCss('collider', getAccentThemes('collider', COLLIDER_THEMES, accentColor, accentPalette), theme);
}

export function normalizeStatsAccentColor(value) {
  const match = String(value ?? '').trim().match(/^#?([\da-f]{6})$/i);
  return match ? `#${match[1].toLowerCase()}` : null;
}

function mixHexColors(color, target, targetWeight) {
  const sourceValue = Number.parseInt(color.slice(1), 16);
  const targetValue = Number.parseInt(target.slice(1), 16);
  const weight = Math.min(1, Math.max(0, targetWeight));
  const channel = (shift) => Math.round(
    ((sourceValue >> shift) & 255) * (1 - weight) + ((targetValue >> shift) & 255) * weight,
  );
  return `#${[channel(16), channel(8), channel(0)]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')}`;
}

function applyAccentColor(style, palette, accentColor, accentPalette) {
  const background = style === 'garden' ? palette.sky[0] : palette.background;
  if (style === 'ufo') {
    return {
      ...palette,
      accent: accentColor,
      accentSoft: mixHexColors(accentColor, '#ffffff', 0.22),
      accentDim: mixHexColors(accentColor, background, 0.72),
      levels: [
        palette.inactive,
        mixHexColors(accentColor, background, 0.78),
        mixHexColors(accentColor, background, 0.56),
        mixHexColors(accentColor, background, 0.3),
        accentColor,
      ],
      edge: [palette.edge[0], palette.edge[1], mixHexColors(accentColor, background, 0.68)],
      ambient: [mixHexColors(accentColor, background, 0.66), palette.ambient[1]],
    };
  }

  if (style === 'garden') {
    const colors = accentPalette || Array(5).fill(accentColor);
    return {
      ...palette,
      accent: accentColor,
      accentStrong: mixHexColors(colors[1], '#000000', 0.1),
      fruit: colors[4],
      seed: mixHexColors(colors[4], '#ffffff', 0.2),
      plants: [
        palette.plants[0],
        mixHexColors(colors[0], background, 0.64),
        mixHexColors(colors[1], background, 0.48),
        mixHexColors(colors[2], background, 0.28),
        mixHexColors(colors[3], background, 0.08),
      ],
      tree: [0.56, 0.42, 0.27, 0.12]
        .map((weight, index) => mixHexColors(colors[index + 1], background, weight)),
      vine: mixHexColors(colors[2], background, 0.22),
    };
  }

  const colors = accentPalette || Array(5).fill(accentColor);
  const detectorColor = colors[1];
  return {
    ...palette,
    accent: accentColor,
    cyan: detectorColor,
    yellow: colors[2],
    purple: colors[3],
    green: colors[4],
    detector: [
      palette.detector[0],
      mixHexColors(detectorColor, background, 0.78),
      mixHexColors(detectorColor, background, 0.58),
      mixHexColors(detectorColor, background, 0.32),
      detectorColor,
    ],
  };
}

function getAccentThemes(style, themes, accentColor, accentPalette) {
  const normalized = normalizeStatsAccentColor(accentColor);
  if (!normalized) return themes;
  const normalizedPalette = Array.isArray(accentPalette)
    ? accentPalette.map(normalizeStatsAccentColor).filter(Boolean).slice(0, 5)
    : [];
  const palette = normalizedPalette.length === 5 ? normalizedPalette : null;
  return Object.fromEntries(
    Object.entries(themes).map(([mode, themePalette]) => [
      mode,
      applyAccentColor(style, themePalette, normalized, palette),
    ]),
  );
}

function toCssName(value) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function getThemePalette(prefix, themes, theme) {
  const resolved = resolveStatsTheme(theme);
  if (resolved !== 'auto') return themes[resolved];

  return Object.fromEntries(Object.entries(themes.dark).map(([key, value]) => {
    const cssKey = toCssName(key);
    if (Array.isArray(value)) {
      return [key, value.map((_, index) => `var(--${prefix}-${cssKey}-${index})`)];
    }
    return [key, `var(--${prefix}-${cssKey})`];
  }));
}

function themeDeclarations(prefix, palette) {
  return Object.entries(palette).flatMap(([key, value]) => {
    const cssKey = toCssName(key);
    if (Array.isArray(value)) {
      return value.map((item, index) => `--${prefix}-${cssKey}-${index}:${item}`);
    }
    return [`--${prefix}-${cssKey}:${value}`];
  }).join(';');
}

function getAdaptiveThemeCss(prefix, themes, theme) {
  if (resolveStatsTheme(theme) !== 'auto') return '';
  return `:root{${themeDeclarations(prefix, themes.dark)}}@media(prefers-color-scheme:light){:root{${themeDeclarations(prefix, themes.light)}}}`;
}
