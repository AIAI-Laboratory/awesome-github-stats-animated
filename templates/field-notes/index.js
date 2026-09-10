import { normalizeTemplateInput } from '../../src/sdk.js';
import manifest from './manifest.json' with { type: 'json' };
import { renderGitHubScienceSvg } from './renderer.js';

export function render(input = {}) {
  return renderGitHubScienceSvg(normalizeTemplateInput(manifest, input));
}
