#!/usr/bin/env node
/* Static-site "build": validate JS syntax, vendored libraries and key wiring.
   This project has no bundler — `npm run build` runs these checks so broken
   JS or missing assets fail loudly instead of silently breaking the page. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const errors = [];
const ok = [];

function read(p) { return fs.readFileSync(path.join(root, p), 'utf8'); }
function exists(p) { return fs.existsSync(path.join(root, p)); }

// 1) syntax-check our own scripts
for (const f of ['js/script.js', 'js/motion.js']) {
  if (!exists(f)) { errors.push(`missing script: ${f}`); continue; }
  try { new vm.Script(read(f), { filename: f }); ok.push(`syntax ok: ${f}`); }
  catch (e) { errors.push(`syntax error in ${f}: ${e.message}`); }
}

// 2) vendored libraries present and non-trivial
for (const f of ['js/vendor/gsap.min.js', 'js/vendor/ScrollTrigger.min.js', 'js/vendor/lenis.min.js']) {
  if (!exists(f)) { errors.push(`missing vendor lib: ${f}`); continue; }
  if (fs.statSync(path.join(root, f)).size < 2000) errors.push(`vendor lib looks empty: ${f}`);
  else ok.push(`vendor ok: ${f}`);
}

// 3) index.html references the scripts + local assets it needs
if (!exists('index.html')) { errors.push('missing index.html'); }
else {
  const html = read('index.html');
  for (const ref of ['js/vendor/gsap.min.js', 'js/vendor/ScrollTrigger.min.js', 'js/vendor/lenis.min.js', 'js/script.js', 'js/motion.js']) {
    if (!html.includes(ref)) errors.push(`index.html does not reference ${ref}`);
  }
  // every local asset referenced by src="assets/..." must exist
  const re = /(?:src|href)="(assets\/[^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    if (!exists(m[1])) errors.push(`referenced asset missing: ${m[1]}`);
  }
  ok.push('index.html references checked');
}

console.log(ok.map((s) => '  ✓ ' + s).join('\n'));
if (errors.length) {
  console.error('\nBUILD FAILED:\n' + errors.map((e) => '  ✗ ' + e).join('\n'));
  process.exit(1);
}
console.log('\nBUILD OK — static site validated.');
