'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SCORE_CONFIG_PATH = path.join(ROOT, 'config', 'premium-score.json');
const UX_EVENTS_FILE = process.env.UX_EVENTS_FILE || '';

const scoreConfig = JSON.parse(fs.readFileSync(SCORE_CONFIG_PATH, 'utf8'));

let hasFailures = false;

function pass(message) {
  console.log(`PASS: ${message}`);
}

function fail(message) {
  hasFailures = true;
  console.error(`FAIL: ${message}`);
}

function readEvents(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];

  if (raw.startsWith('[')) {
    return JSON.parse(raw);
  }

  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

function computeMetrics(events) {
  const totalGenerate = events.filter((e) => e.eventName === 'generate_clicked').length;
  const totalCopied = events.filter((e) => e.eventName === 'output_copied' || e.eventName === 'output_copied_first').length;
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

function validateThresholds(metrics) {
  const t = scoreConfig.kpiThresholds;
  if (metrics.ttfcP75Seconds > t.ttfcP75SecondsMax) {
    fail(`TTFC p75 ${metrics.ttfcP75Seconds.toFixed(2)}s > ${t.ttfcP75SecondsMax}s`);
  } else {
    pass(`TTFC p75 OK (${metrics.ttfcP75Seconds.toFixed(2)}s)`);
  }

  if (metrics.generateToCopyRate < t.generateToCopyRateMin) {
    fail(`generate_to_copy_rate ${metrics.generateToCopyRate.toFixed(3)} < ${t.generateToCopyRateMin}`);
  } else {
    pass(`generate_to_copy_rate OK (${metrics.generateToCopyRate.toFixed(3)})`);
  }

  if (metrics.templateAssistRate < t.templateAssistRateMin) {
    fail(`template_assist_rate ${metrics.templateAssistRate.toFixed(3)} < ${t.templateAssistRateMin}`);
  } else {
    pass(`template_assist_rate OK (${metrics.templateAssistRate.toFixed(3)})`);
  }

  if (metrics.sessionRestoreRate < t.sessionRestoreRateMin) {
    fail(`session_restore_rate ${metrics.sessionRestoreRate.toFixed(3)} < ${t.sessionRestoreRateMin}`);
  } else {
    pass(`session_restore_rate OK (${metrics.sessionRestoreRate.toFixed(3)})`);
  }
}

function run() {
  console.log('UX KPI gate start\n');
  if (!UX_EVENTS_FILE) {
    pass('UX_EVENTS_FILE nepaduotas - slenksciu tikrinimas skipinamas (lokalus rezimas)');
    process.exit(0);
  }

  const absolute = path.isAbsolute(UX_EVENTS_FILE)
    ? UX_EVENTS_FILE
    : path.join(ROOT, UX_EVENTS_FILE);

  if (!fs.existsSync(absolute)) {
    fail(`Nerastas UX event failas: ${absolute}`);
  } else {
    const events = readEvents(absolute);
    const metrics = computeMetrics(events);
    validateThresholds(metrics);
  }

  if (hasFailures) {
    console.error('\nUX KPI gate FAILED');
    process.exit(1);
  }
  console.log('\nUX KPI gate PASSED');
}

run();
