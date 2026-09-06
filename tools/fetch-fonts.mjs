/* Downloads the latin subsets of Jost and Cormorant Garamond from Google Fonts
   into assets/fonts/. Both are SIL Open Font License 1.1 (see OFL.txt).

   The .woff2 binaries are committed to this repo, so you only need this when
   restoring them from scratch or bumping a version.

   Run:  node tools/fetch-fonts.mjs                                          */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'assets/fonts');
mkdirSync(OUT, { recursive: true });

// A desktop UA is required, otherwise Google serves legacy .ttf instead of woff2.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
           '(KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const CSS_URL = 'https://fonts.googleapis.com/css2' +
  '?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300' +
  '&family=Jost:wght@200;300;400;500&display=swap';

// Jost and Cormorant are variable fonts, so Google returns the same file for
// every weight of a family. We keep one file per family/style.
const WANTED = [
  { family: 'Jost',               style: 'normal', out: 'jost-var.woff2' },
  { family: 'Cormorant Garamond', style: 'normal', out: 'cormorant-garamond-var.woff2' },
  { family: 'Cormorant Garamond', style: 'italic', out: 'cormorant-garamond-italic-var.woff2' }
];

const css = await (await fetch(CSS_URL, { headers: { 'User-Agent': UA } })).text();
const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{(.*?)\}/gs)]
  .map(([, subset, body]) => ({ subset, body }))
  .filter(b => b.subset === 'latin');

if (!blocks.length) {
  console.error('No latin @font-face blocks found — the Google Fonts response changed.');
  process.exit(1);
}

for (const { family, style, out } of WANTED) {
  const block = blocks.find(b =>
    b.body.includes(`font-family: '${family}'`) && b.body.includes(`font-style: ${style}`));
  if (!block) {
    console.error(`Could not find ${family} (${style}) in the Google Fonts response.`);
    process.exit(1);
  }
  const url = block.body.match(/url\((https:\/\/[^)]+\.woff2)\)/)[1];
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(resolve(OUT, out), buf);
  console.log(`${out.padEnd(38)} ${buf.length} bytes`);
}

if (!existsSync(resolve(ROOT, 'assets/css/fonts.css'))) {
  console.warn('Warning: assets/css/fonts.css is missing; the @font-face rules live there.');
}
console.log('Fonts ready.');
