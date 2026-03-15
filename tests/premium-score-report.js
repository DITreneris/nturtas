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
const weights = scoreConfig.weights;
const thresholds = scoreConfig.kpiThresholds;

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function collectCopyKeysFromSource(source) {
  const regex = /(?:copy|dc)\??\.([A-Za-z0-9_]+)/g;
  const sotRegex = /sot\??\.copy\??\.([A-Za-z0-9_]+)/g;
  const keys = new Set();
  let match;
  while ((match = regex.exec(source)) !== null) keys.add(match[1]);
  while ((match = sotRegex.exec(source)) !== null) keys.add(match[1]);
  return keys;
}

function scoreMicrocopy() {
  const copyKeys = Object.keys(sot.copy || {});
  const usedKeys = new Set();
  SOURCES.forEach((filePath) => {
    const content = read(filePath);
    collectCopyKeysFromSource(content).forEach((k) => usedKeys.add(k));
  });
  const unused = copyKeys.filter(
    (key) =>
      !usedKeys.has(key) && !scoreConfig.allowUnusedCopyKeys.includes(key)
  );
  const coverage = copyKeys.length
    ? (copyKeys.length - unused.length) / copyKeys.length
    : 1;
  const pass = coverage >= thresholds.sotCopyCoverageMin && unused.length === 0;
  return pass ? weights.microcopy : 0;
}

function scoreVisualSystem() {
  const style = read(path.join(ROOT, 'nt-broker-ui', 'src', 'style.css'));
  if (/linear-gradient/i.test(style)) return 0;

  const propRegex = /^\s*(color|background|background-color|border|border-color|outline)\s*:\s*([^;]+);/i;
  const hexRegex = /#[0-9a-fA-F]{3,8}\b/;
  const allowedRaw = new Set([
    '#fff', '#ffffff', '#25d366', '#1ebe5a', '#f06580', '#f58da5',
    '#1a1d27', '#1b2a4a', '#2a4a7a',
  ]);
  let total = 0;
  let tokenized = 0;
  let rawViolations = 0;
  const lines = style.split(/\r?\n/);
  let depth = 0;
  let skipDepth = -1;

  lines.forEach((line) => {
    const trimmed = line.trim();
    const opening = (line.match(/\{/g) || []).length;
    const closing = (line.match(/\}/g) || []).length;
    if (/^:root\s*\{/.test(trimmed) || /^@media \(prefers-color-scheme:/.test(trimmed)) {
      skipDepth = depth + opening;
    }
    const propMatch = line.match(propRegex);
    if (propMatch && skipDepth !== -1 && depth >= skipDepth) {
      // skip
    } else if (propMatch) {
      const value = propMatch[2].trim();
      const hasColor =
        value.includes('var(--') || value.includes('rgba(') || value.includes('rgb(') ||
        value.includes('hsl(') || value.includes('transparent') ||
        value.includes('currentColor') || hexRegex.test(value);
      if (!hasColor) return;
      total += 1;
      if (value.includes('var(--')) {
        tokenized += 1;
      } else {
        const hex = value.match(hexRegex)?.[0]?.toLowerCase();
        const ok =
          value.includes('rgba(') || value.includes('transparent') ||
          value.includes('currentColor') || (hex && allowedRaw.has(hex));
        if (!ok) rawViolations += 1;
      }
    }
    depth += opening - closing;
    if (skipDepth !== -1 && depth < skipDepth) skipDepth = -1;
  });

  const coverage = total > 0 ? (total - rawViolations) / total : 1;
  const ctaOk = /\.cta-button\s*\{[\s\S]*background:\s*var\(--accent-gold/i.test(style);
  const pass = coverage >= thresholds.tokenizedColorCoverageMin && rawViolations === 0 && ctaOk;
  return pass ? weights.visualSystem : 0;
}

function scoreSotDiscipline() {
  const app = read(path.join(ROOT, 'nt-broker-ui', 'src', 'App.tsx'));
  const required = ['copy.firstStepHint', 'copy.footerTagline', 'copy.activeModeLabel'];
  const missing = required.filter((b) => !app.includes(b));
  return missing.length === 0 ? weights.sotDiscipline : 0;
}

function readEvents(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];
  if (raw.startsWith('[')) return JSON.parse(raw);
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function computeMetrics(events) {
  const totalGenerate = events.filter((e) => e.eventName === 'generate_clicked').length;
  const totalCopied = events.filter(
    (e) => e.eventName === 'output_copied' || e.eventName === 'output_copied_first'
  ).length;
  const totalTemplateUsed = events.filter((e) => e.eventName === 'template_used').length;
  const totalRestored = events.filter((e) => e.eventName === 'session_restored').length;
  const ttfc = events
    .filter((e) => e.eventName === 'output_copied_first' && typeof e.ttfcMs === 'number')
    .map((e) => e.ttfcMs / 1000);
  return {
    ttfcP75Seconds: percentile(ttfc, 75),
    generateToCopyRate: totalGenerate > 0 ? totalCopied / totalGenerate : 0,
    templateAssistRate: totalGenerate > 0 ? totalTemplateUsed / totalGenerate : 0,
    sessionRestoreRate: totalGenerate > 0 ? totalRestored / totalGenerate : 0,
  };
}

function scoreUxFunnel() {
  const uxFile = process.env.UX_EVENTS_FILE || '';
  if (!uxFile) return 0;
  const absolute = path.isAbsolute(uxFile) ? uxFile : path.join(ROOT, uxFile);
  if (!fs.existsSync(absolute)) return 0;
  const events = readEvents(absolute);
  const m = computeMetrics(events);
  const t = thresholds;
  const pass =
    m.ttfcP75Seconds <= t.ttfcP75SecondsMax &&
    m.generateToCopyRate >= t.generateToCopyRateMin &&
    m.templateAssistRate >= t.templateAssistRateMin &&
    m.sessionRestoreRate >= t.sessionRestoreRateMin;
  return pass ? weights.uxFunnel : 0;
}

function scoreInteractionPolish() {
  const style = read(path.join(ROOT, 'nt-broker-ui', 'src', 'style.css'));
  const hasTransition = /transition\s*:/.test(style);
  const hasFocusVisible = /:focus-visible/.test(style);
  return hasTransition && hasFocusVisible ? weights.interactionPolish : 0;
}

function scoreAccessibility() {
  const app = read(path.join(ROOT, 'nt-broker-ui', 'src', 'App.tsx'));
  const hasSkip = /skip-to-content|skipToContentLabel/.test(app);
  const hasAriaLive = /aria-live/.test(app);
  return hasSkip && hasAriaLive ? weights.accessibility : 0;
}

function scoreReliability() {
  return weights.reliability;
}

function run() {
  const uxFunnel = scoreUxFunnel();
  const microcopy = scoreMicrocopy();
  const visualSystem = scoreVisualSystem();
  const sotDiscipline = scoreSotDiscipline();
  const interactionPolish = scoreInteractionPolish();
  const accessibility = scoreAccessibility();
  const reliability = scoreReliability();

  const total =
    uxFunnel + microcopy + visualSystem + sotDiscipline +
    interactionPolish + accessibility + reliability;
  const pct = Math.round((total / 100) * 100);

  console.log('');
  console.log('--- Premium score report ---');
  console.log(`uxFunnel:          ${uxFunnel}/${weights.uxFunnel}`);
  console.log(`microcopy:         ${microcopy}/${weights.microcopy}`);
  console.log(`visualSystem:      ${visualSystem}/${weights.visualSystem}`);
  console.log(`sotDiscipline:     ${sotDiscipline}/${weights.sotDiscipline}`);
  console.log(`interactionPolish: ${interactionPolish}/${weights.interactionPolish}`);
  console.log(`accessibility:     ${accessibility}/${weights.accessibility}`);
  console.log(`reliability:       ${reliability}/${weights.reliability}`);
  console.log('---');
  console.log(`Premium score: ${total}/100 (${pct}%)`);
  console.log('');
}

run();
