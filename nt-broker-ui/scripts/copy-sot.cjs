'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', '..');
const configDir = path.join(root, 'config');
const destDir = path.join(__dirname, '..', 'public', 'config');

const srcLt = path.join(configDir, 'sot.json');

if (!fs.existsSync(srcLt)) {
  console.error('copy-sot: root config/sot.json not found. SOT is required for build.');
  process.exit(1);
}
fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(srcLt, path.join(destDir, 'sot.lt.json'));
console.log('copy-sot: copied config/sot.json to public/config/sot.lt.json');

const locales = ['en', 'es'];
for (const locale of locales) {
  const src = path.join(configDir, `sot.${locale}.json`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(destDir, `sot.${locale}.json`));
    console.log(`copy-sot: copied config/sot.${locale}.json to public/config/sot.${locale}.json`);
  }
}
