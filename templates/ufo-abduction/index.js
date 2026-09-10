import { normalizeTemplateInput } from '../../src/sdk.js';
import manifest from './manifest.json' with { type: 'json' };
import { renderGitHubStatsSvg } from './renderer.js';

export function render(input = {}) {
  return renderGitHubStatsSvg(normalizeTemplateInput(manifest, input));
}
