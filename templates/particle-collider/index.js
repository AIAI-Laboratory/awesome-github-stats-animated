import { normalizeTemplateInput } from '../../src/sdk.js';
import manifest from './manifest.json' with { type: 'json' };
import { renderGitHubColliderSvg } from './renderer.js';

export function render(input = {}) {
  return renderGitHubColliderSvg(normalizeTemplateInput(manifest, input));
}
