import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { exampleStats } from '../fixtures/example-stats.js';
import { optionDefaults } from '../src/sdk.js';
import { loadTemplates, root } from './template-utils.mjs';

const outputDirectory = join(root, 'previews');
await mkdir(outputDirectory, { recursive: true });

for (const { manifest, renderer } of await loadTemplates()) {
  const svg = await renderer.render({
    ...exampleStats,
    options: optionDefaults(manifest),
  });
  const output = join(outputDirectory, `${manifest.id}.svg`);
  await writeFile(output, svg.replace(/[ \t]+$/gm, ''), 'utf8');
  console.log(`✓ ${output}`);
  if (manifest.options.theme) {
    const lightSvg = await renderer.render({ ...exampleStats, options: { ...optionDefaults(manifest), theme: 'light' } });
    const lightOutput = join(outputDirectory, `${manifest.id}-light.svg`);
    await writeFile(lightOutput, lightSvg.replace(/[ \t]+$/gm, ''), 'utf8');
    console.log(`✓ ${lightOutput}`);
  }
}
