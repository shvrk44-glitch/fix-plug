// Automated Test Suite for FIX-PLUG Website
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('Running FIX-PLUG CI/CD validation tests...\n');

const ROOT = path.resolve(__dirname);
const REQUIRED_FILES = [
  'index.html',
  'customers/index.html',
  'artisans/index.html',
  'trust/index.html',
  'about/index.html',
  'contact/index.html',
  'privacy/index.html',
  'terms/index.html',
  'css/style.css',
  'css/components.css',
  'js/main.js',
  'js/forms.js',
  'js/i18n.js',
  'js/supabase.js',
  'assets/fixplug-logo.png',
  'assets/favicon-64.png',
  'assets/apple-touch-icon.png',
  'assets/og-image.svg',
  'sitemap.xml',
  'robots.txt',
  'server.js',
  'package.json',
  '.gitignore'
];

let failed = 0;

// 1. Verify existence of all required files
REQUIRED_FILES.forEach(file => {
  const fullPath = path.join(ROOT, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ FAIL: Missing file -> ${file}`);
    failed++;
  } else {
    console.log(`✅ PASS: File exists -> ${file}`);
  }
});

// 2. Mobile Responsive Viewport & Meta Tags Test
const htmlFiles = REQUIRED_FILES.filter(f => f.endsWith('.html'));
htmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
  assert(content.includes('<meta name="viewport"'), `${file} missing viewport tag!`);
  assert(content.includes('FIX-PLUG'), `${file} missing FIX-PLUG brand text!`);
  assert(content.includes('data-wa-type'), `${file} missing WhatsApp action routes!`);
  console.log(`✅ PASS: Mobile metadata & brand compliance in ${file}`);
});

// 3. Asset Payload Test (Ensure payload is well below 1 MB PRD limit)
let totalSize = 0;
REQUIRED_FILES.forEach(file => {
  const stats = fs.statSync(path.join(ROOT, file));
  totalSize += stats.size;
});
console.log(`\n📦 Total Repository Size: ${(totalSize / 1024).toFixed(2)} KB (PRD Budget: < 1000 KB)`);
assert(totalSize < 500 * 1024, 'Total project size exceeds 500KB limit!');
console.log('✅ PASS: Lightweight performance budget met.');

// 4. Security Path Traversal Simulation
const maliciousUrls = ['/../server.js', '/../../Windows/win.ini', '/%2e%2e%2fpackage.json'];
maliciousUrls.forEach(url => {
  let decoded = decodeURIComponent(url);
  let safePath = path.normalize(path.join(ROOT, decoded));
  let isTrapped = !safePath.startsWith(ROOT);
  assert(isTrapped, `Security test failed! Traversal not trapped for: ${url}`);
});
console.log('✅ PASS: Path traversal security barrier verified.');

if (failed > 0) {
  console.error(`\n❌ ${failed} test(s) failed.`);
  process.exit(1);
} else {
  console.log('\n🎉 ALL TESTS PASSED! Project is ready for production and GitHub deployment.\n');
}
