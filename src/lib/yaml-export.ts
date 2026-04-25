// ============================================================
// Vex — Cross the line.
// YAML Export — Generate YAML snippet for GitHub PR submission
// ============================================================

import type { SubmitFormData } from './form-validation';

/**
 * Generate a YAML-formatted payload entry for GitHub PR submission.
 */
export function exportToYAML(data: SubmitFormData): string {
  const lines: string[] = [];

  lines.push('# Vex Payload Submission');
  lines.push('# Copy this YAML into a new file under /payloads/');
  lines.push('---');
  lines.push('');

  // Escape YAML special chars in payload
  const escapedPayload = data.payload
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');

  lines.push(`payload: "${escapedPayload}"`);
  lines.push(`description: "${data.description}"`);
  lines.push(`category: ${data.category}`);
  lines.push(`context: ${data.context}`);
  lines.push(`difficulty: ${data.difficulty}`);
  lines.push(`character_count: ${data.payload.length}`);

  // Tags
  if (data.tags.length > 0) {
    lines.push('tags:');
    data.tags.forEach((tag) => lines.push(`  - ${tag}`));
  } else {
    lines.push('tags: []');
  }

  // WAF bypass
  if (data.wafBypass.length > 0) {
    lines.push('waf_bypass:');
    data.wafBypass.forEach((waf) => lines.push(`  - ${waf}`));
  } else {
    lines.push('waf_bypass:');
    lines.push('  - generic');
  }

  // Browsers
  lines.push('browsers:');
  data.browsers.forEach((b) => lines.push(`  - ${b}`));

  // Contributor info
  lines.push(`contributor: "${data.contributor}"`);
  if (data.githubUsername) {
    lines.push(`github_username: "${data.githubUsername}"`);
  }

  lines.push(`date_added: "${new Date().toISOString().split('T')[0]}"`);
  lines.push('');

  return lines.join('\n');
}
