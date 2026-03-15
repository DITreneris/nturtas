'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOURCES = [
  path.join(ROOT, 'nt-broker-ui', 'src', 'App.tsx'),
  path.join(ROOT, 'nt-broker-ui', 'src', 'components', 'TemplatesInline.tsx'),
  path.join(ROOT, 'nt-broker-ui', 'src', 'style.css'),
];

const scoreConfig = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'config', 'premium-score.json'), 'utf8')
);
const sot = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'config', 'sot.json'), 'utf8')
);

let hasFailures = false;

function pass(message) {
  console.log(`PASS: ${message}`);
}

function fail(message) {
  hasFailures = true;
  console.error(`FAIL: ${message}`);
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function collectCopyKeysFromSource(source) {
  const regex = /(?:copy|dc)\??\.([A-Za-z0-9_]+)/g;
  const sotRegex = /sot\??\.copy\??\.([A-Za-z0-9_]+)/g;
  const keys = new Set();
  let match;
  while ((match = regex.exec(source)) !== null) {
    keys.add(match[1]);
  }
  while ((match = sotRegex.exec(source)) !== null) {
    keys.add(match[1]);
  }
  return keys;
}

function validateCopyCoverage() {
  const copyKeys = Object.keys(sot.copy || {});
  const usedKeys = new Set();

  SOURCES.forEach((filePath) => {
    const content = read(filePath);
    const keys = collectCopyKeysFromSource(content);
    keys.forEach((k) => usedKeys.add(k));
  });

  const unused = copyKeys.filter(
    (key) =>
      !usedKeys.has(key) &&
      !scoreConfig.allowUnusedCopyKeys.includes(key)
  );

  const coverage = copyKeys.length
    ? (copyKeys.length - unused.length) / copyKeys.length
    : 1;

  if (coverage < scoreConfig.kpiThresholds.sotCopyCoverageMin) {
    fail(
      `SOT copy coverage per mazas (${coverage.toFixed(3)}), threshold ${scoreConfig.kpiThresholds.sotCopyCoverageMin}`
    );
  } else {
    pass(`SOT copy coverage OK (${coverage.toFixed(3)})`);
  }

  if (unused.length > 0) {
    fail(`Nenaudojami SOT copy raktai: ${unused.join(', ')}`);
  } else {
    pass('Nenaudojamu SOT copy raktu nerasta');
  }
}

function validateDesignTokens() {
  const style = read(path.join(ROOT, 'nt-broker-ui', 'src', 'style.css'));

  if (/linear-gradient/i.test(style)) {
    fail('Rastas linear-gradient style.css (style guide reikalauja solid surfaces)');
  } else {
    pass('Solid surfaces taisykle ivykdyta (linear-gradient nerasta)');
  }

  const lines = style.split(/\r?\n/);
  const propRegex = /^\s*(color|background|background-color|border|border-color|outline)\s*:\s*([^;]+);/i;
  const hexRegex = /#[0-9a-fA-F]{3,8}\b/;
  const allowedRawColors = new Set([
    '#fff',
    '#ffffff',
    '#25d366',
    '#1ebe5a',
    '#f06580',
    '#f58da5',
    '#1a1d27',
    '#1b2a4a',
    '#2a4a7a',
  ]);

  let depth = 0;
  let skipDepth = -1;
  let totalColorRules = 0;
  let tokenizedColorRules = 0;
  const rawViolations = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    const opening = (line.match(/\{/g) || []).length;
    const closing = (line.match(/\}/g) || []).length;

    if (/^:root\s*\{/.test(trimmed) || /^@media \(prefers-color-scheme:/.test(trimmed)) {
      skipDepth = depth + opening;
    }

    const propMatch = line.match(propRegex);
    if (propMatch && skipDepth !== -1 && depth >= skipDepth) {
      // skipped section
    } else if (propMatch) {
      const value = propMatch[2].trim();
      const hasColorSignal =
        value.includes('var(--') ||
        value.includes('rgba(') ||
        value.includes('rgb(') ||
        value.includes('hsl(') ||
        value.includes('transparent') ||
        value.includes('currentColor') ||
        hexRegex.test(value);
      if (!hasColorSignal) return;
      totalColorRules += 1;
      if (value.includes('var(--')) {
        tokenizedColorRules += 1;
      } else {
        const hex = value.match(hexRegex)?.[0]?.toLowerCase();
        const isAllowedRaw =
          value.includes('rgba(') ||
          value.includes('transparent') ||
          value.includes('currentColor') ||
          (hex && allowedRawColors.has(hex));
        if (!isAllowedRaw) {
          rawViolations.push(value);
        }
      }
    }

    depth += opening - closing;
    if (skipDepth !== -1 && depth < skipDepth) {
      skipDepth = -1;
    }
  });

  const coverage = totalColorRules > 0
    ? (totalColorRules - rawViolations.length) / totalColorRules
    : 1;

  if (coverage < scoreConfig.kpiThresholds.tokenizedColorCoverageMin) {
    fail(
      `Tokenized color coverage per mazas (${coverage.toFixed(3)}), threshold ${scoreConfig.kpiThresholds.tokenizedColorCoverageMin}`
    );
  } else {
    pass(`Tokenized color coverage OK (${coverage.toFixed(3)})`);
  }

  if (rawViolations.length > 0) {
    fail(`Rastos raw spalvos be tokenu (${rawViolations.length}): ${rawViolations.slice(0, 5).join(' | ')}`);
  } else {
    pass('Nera raw spalvu, kurios lauztu tokenu disciplina');
  }

  if (!/\.cta-button\s*\{[\s\S]*background:\s*var\(--accent-gold/i.test(style)) {
    fail('CTA primary nenaudoja --accent-gold tokeno');
  } else {
    pass('CTA primary naudoja --accent-gold tokena');
  }
}

function validateUxEventInstrumentation() {
  const app = read(path.join(ROOT, 'nt-broker-ui', 'src', 'App.tsx'));
  const missing = scoreConfig.requiredUxEvents.filter(
    (eventName) => !app.includes(`'${eventName}'`)
  );

  if (missing.length > 0) {
    fail(`Truksta privalomu UX eventu: ${missing.join(', ')}`);
  } else {
    pass('Privalomi UX eventai instrumentuoti');
  }
}

function validateHardcodedTextRisk() {
  const app = read(path.join(ROOT, 'nt-broker-ui', 'src', 'App.tsx'));

  const requiredBindings = [
    'copy.firstStepHint',
    'copy.footerTagline',
    'copy.activeModeLabel',
  ];

  const missing = requiredBindings.filter((binding) => !app.includes(binding));
  if (missing.length > 0) {
    fail(`Truksta privalomu SOT bindingu: ${missing.join(', ')}`);
  } else {
    pass('Kritiniai microcopy laukai bindinami is SOT');
  }
}

function run() {
  console.log('Premium quality gate start\n');
  validateCopyCoverage();
  validateDesignTokens();
  validateUxEventInstrumentation();
  validateHardcodedTextRisk();

  if (hasFailures) {
    console.error('\nPremium quality gate FAILED');
    process.exit(1);
  }

  console.log('\nPremium quality gate PASSED');
}

run();
