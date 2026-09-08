import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { exampleStats } from '../fixtures/example-stats.js';
import { loadTemplates } from './template-utils.mjs';

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const VERSION_PATTERN = /^\d+\.\d+\.\d+$/;
const FORBIDDEN = [
  { pattern: /<script[\s>]/i, label: '<script>' },
  { pattern: /\son[a-z]+\s*=/i, label: 'inline event handler' },
  { pattern: /(?:href|src)\s*=\s*["']https?:\/\//i, label: 'external asset URL' },
  { pattern: /javascript\s*:/i, label: 'javascript: URL' },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const templates = await loadTemplates();
const ids = new Set();

for (const template of templates) {
  const { manifest, renderer, folder, directory } = template;
  assert(ID_PATTERN.test(manifest.id), `${folder}: manifest.id must use kebab-case`);
  assert(folder === '_starter' || folder === manifest.id, `${folder}: folder must match manifest.id`);
  assert(!ids.has(manifest.id), `${folder}: duplicate template id`);
  ids.add(manifest.id);
  assert(typeof manifest.name === 'string' && manifest.name.length >= 2, `${folder}: name is required`);
  assert(typeof manifest.description === 'string' && manifest.description.length >= 20, `${folder}: description is too short`);
  assert(VERSION_PATTERN.test(manifest.version), `${folder}: version must be semver`);
  assert(manifest.entry === './index.js', `${folder}: entry must be ./index.js`);
  assert(Number.isInteger(manifest.width) && manifest.width >= 320 && manifest.width <= 1600, `${folder}: invalid width`);
  assert(Number.isInteger(manifest.height) && manifest.height >= 160 && manifest.height <= 900, `${folder}: invalid height`);
  assert(Array.isArray(manifest.tags) && manifest.tags.length > 0, `${folder}: tags are required`);
  assert(typeof manifest.options === 'object' && manifest.options !== null, `${folder}: options object is required`);
  assert(typeof renderer.render === 'function', `${folder}: index.js must export render()`);
  await stat(join(directory, 'README.md'));

  const svg = await renderer.render({ ...exampleStats, options: {} });
  assert(typeof svg === 'string' && /^<svg[\s>]/.test(svg), `${folder}: render() must return an SVG string`);
  assert(svg.includes(`width="${manifest.width}"`), `${folder}: SVG width must match manifest`);
  assert(svg.includes(`height="${manifest.height}"`), `${folder}: SVG height must match manifest`);
  assert(svg.includes('<title'), `${folder}: SVG needs an accessible title`);
  assert(svg.includes('<desc'), `${folder}: SVG needs an accessible description`);
  assert(Buffer.byteLength(svg) <= 500_000, `${folder}: SVG exceeds 500 KB`);
  for (const rule of FORBIDDEN) {
    assert(!rule.pattern.test(svg), `${folder}: output contains forbidden ${rule.label}`);
  }
  console.log(`✓ ${manifest.id} (${Buffer.byteLength(svg)} bytes)`);
}

console.log(`Validated ${templates.length} templates.`);
