import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const root = resolve(import.meta.dirname, '..');
export const templatesRoot = join(root, 'templates');

export async function loadTemplates() {
  const entries = await readdir(templatesRoot, { withFileTypes: true });
  const templates = [];

  for (const entry of entries.filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const directory = join(templatesRoot, entry.name);
    const manifest = JSON.parse(await readFile(join(directory, 'manifest.json'), 'utf8'));
    const moduleUrl = pathToFileURL(join(directory, manifest.entry || 'index.js')).href;
    const renderer = await import(`${moduleUrl}?validate=${Date.now()}`);
    templates.push({ directory, folder: entry.name, manifest, renderer });
  }

  return templates;
}
