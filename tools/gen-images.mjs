/* Generates every image the site uses as a self-contained SVG.
   Run:  node tools/gen-images.mjs                                        */
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_P = resolve(ROOT, 'assets/img/products');
const OUT_E = resolve(ROOT, 'assets/img/editorial');
mkdirSync(OUT_P, { recursive: true });
mkdirSync(OUT_E, { recursive: true });

/* ----------------------------------------------------------- color utils */
const hex2rgb = h => {
  const s = h.replace('#', '');
  return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16));
};
const rgb2hex = ([r, g, b]) =>
  '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

function rgb2hsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  const d = max - min;
  if (d) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [h * 360, s, l];
}
function hsl2rgb([h, s, l]) {
  h = ((h % 360) + 360) % 360 / 360;
  if (!s) { const v = l * 255; return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = t => {
    t = (t + 1) % 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
}
const hsl = (h, s, l) => rgb2hex(hsl2rgb([h, s, l]));
const shade = (hexv, dl, ds = 0) => {
  const [h, s, l] = rgb2hsl(hex2rgb(hexv));
  return hsl(h, Math.max(0, Math.min(1, s + ds)), Math.max(0, Math.min(1, l + dl)));
};

/* Backdrop tuned against the garment so light pieces still read. */
function backdrop(hexv) {
  const [h, s, l] = rgb2hsl(hex2rgb(hexv));
  const hue = s < 0.06 ? 34 : h;          // neutral garments get a warm sand ground
  const sat = Math.min(0.16, Math.max(0.05, s * 0.45));
  const top = l > 0.68 ? 0.80 : 0.925;
  const bot = top - 0.085;
  return [hsl(hue, sat, top), hsl(hue, sat * 0.9, bot)];
}

/* ------------------------------------------------------------- silhouettes */
/* All drawn in a 1000 x 1250 box. */
const SHAPES = {
  legging: () => ({
    body: 'M382 232 C372 300 360 350 358 400 C356 470 372 560 385 700 C396 830 402 960 404 1078 L470 1078 C474 950 480 840 490 720 L500 660 L510 720 C520 840 526 950 530 1078 L596 1078 C598 960 604 830 615 700 C628 560 644 470 642 400 C640 350 628 300 618 232 Z',
    lines: ['M358 316 C440 300 560 300 642 316']
  }),
  flare: () => ({
    body: 'M382 232 C372 300 360 350 358 400 C356 480 372 560 372 640 C366 760 350 920 338 1090 L448 1090 C464 930 474 800 486 700 L500 640 L514 700 C526 800 536 930 552 1090 L662 1090 C650 920 634 760 628 640 C628 560 644 480 642 400 C640 350 628 300 618 232 Z',
    lines: ['M358 316 C440 300 560 300 642 316']
  }),
  short: () => ({
    body: 'M382 232 C372 300 360 350 358 400 C357 470 366 560 372 700 L476 700 C484 640 492 600 500 578 C508 600 516 640 524 700 L628 700 C634 560 643 470 642 400 C640 350 628 300 618 232 Z',
    lines: ['M358 316 C440 300 560 300 642 316']
  }),
  jogger: () => ({
    body: 'M372 232 C358 300 344 360 342 420 C340 500 360 600 372 720 C384 840 392 960 394 1040 L396 1078 L474 1078 L476 1040 C480 940 486 830 492 720 L500 660 L508 720 C514 830 520 940 524 1040 L526 1078 L604 1078 L606 1040 C608 960 616 840 628 720 C640 600 660 500 658 420 C656 360 642 300 628 232 Z',
    lines: ['M342 312 C440 296 560 296 658 312', 'M396 1040 L474 1040', 'M526 1040 L604 1040']
  }),
  wide: () => ({
    body: 'M378 232 C366 300 356 360 354 420 C350 540 344 760 336 1090 L480 1090 C484 820 490 620 494 500 L500 440 L506 500 C510 620 516 820 520 1090 L664 1090 C656 760 650 540 646 420 C644 360 634 300 622 232 Z',
    lines: ['M354 320 C440 304 560 304 646 320', 'M430 340 L406 1090', 'M570 340 L594 1090']
  }),
  skirt: () => ({
    body: 'M396 240 C386 300 380 360 372 440 C356 600 336 800 318 1000 C400 1032 600 1032 682 1000 C664 800 644 600 628 440 C620 360 614 300 604 240 Z',
    lines: ['M378 300 C440 288 560 288 622 300', 'M520 300 C560 560 600 800 640 1014']
  }),
  dress: () => ({
    body: 'M402 258 C440 276 560 276 598 258 C604 320 608 372 610 420 C616 520 628 700 644 1010 C548 1042 452 1042 356 1010 C372 700 384 520 390 420 C392 372 396 320 402 258 Z',
    extra: '<rect x="404" y="176" width="20" height="96" rx="10"/><rect x="576" y="176" width="20" height="96" rx="10"/>',
    lines: ['M398 380 C450 392 550 392 602 380']
  }),
  tank: () => ({
    body: 'M396 260 C428 268 466 292 500 292 C534 292 572 268 604 260 C602 330 618 356 632 392 C640 500 644 660 646 772 C552 794 448 794 354 772 C356 660 360 500 368 392 C382 356 398 330 396 260 Z',
    lines: []
  }),
  bodysuit: () => ({
    body: 'M396 260 C428 268 466 292 500 292 C534 292 572 268 604 260 C602 330 618 356 632 392 C642 500 646 610 636 706 C628 772 612 806 592 826 C566 802 534 788 500 786 C466 788 434 802 408 826 C388 806 372 772 364 706 C354 610 358 500 368 392 C382 356 398 330 396 260 Z',
    lines: ['M368 470 C440 486 560 486 632 470']
  }),
  tee: () => ({
    body: 'M388 268 C420 258 452 288 500 288 C548 288 580 258 612 268 L716 316 C702 374 690 412 678 448 L632 430 C634 560 638 680 640 800 C546 824 454 824 360 800 C362 680 366 560 370 424 L338 436 C326 404 314 372 300 320 Z',
    lines: []
  }),
  sweater: () => ({
    body: 'M386 268 C420 258 452 290 500 290 C548 290 580 258 614 268 L706 320 C726 470 738 610 744 752 L670 768 C666 600 662 520 656 452 C656 600 660 720 662 830 C552 856 448 856 338 830 C340 720 344 600 344 452 C340 500 336 560 332 676 L260 660 C264 580 274 470 294 320 Z',
    lines: ['M338 806 C448 830 552 830 662 806', 'M262 636 L738 636']
  }),
  cardigan: () => ({
    body: 'M386 268 C420 258 452 290 500 290 C548 290 580 258 614 268 L706 320 C726 460 738 580 742 712 L668 728 C664 548 660 494 656 450 C656 580 660 680 662 780 C552 806 448 806 338 780 C340 680 344 580 344 450 C340 494 336 548 332 652 L260 636 C264 560 274 460 294 320 Z',
    lines: ['M500 292 L500 792'],
    dots: [[500, 380], [500, 470], [500, 560], [500, 650]]
  }),
  halfzip: () => ({
    body: 'M382 262 C416 250 452 286 500 286 C548 286 584 250 618 262 L710 316 C730 470 742 610 748 756 L674 772 C666 562 662 502 658 454 C658 606 662 726 664 838 C552 864 448 864 336 838 C338 726 342 606 342 454 C338 502 334 562 330 678 L256 662 C260 580 270 470 290 316 Z',
    extra: '<path d="M452 268 C476 236 524 236 548 268 C536 296 464 296 452 268 Z"/>',
    lines: ['M500 286 L500 470', 'M336 812 C448 838 552 838 664 812']
  }),
  jacket: () => ({
    body: 'M382 262 C416 250 452 288 500 288 C548 288 584 250 618 262 L710 316 C730 460 742 570 746 706 L672 722 C666 552 662 496 658 452 C658 580 662 676 664 772 C552 800 448 800 336 772 C338 676 342 580 342 452 C338 496 334 552 330 656 L256 640 C260 560 270 460 290 316 Z',
    lines: ['M500 300 L500 786', 'M336 742 C448 768 552 768 664 742', 'M262 618 L338 604', 'M738 618 L662 604']
  }),
  coat: () => ({
    body: 'M380 258 C414 246 452 284 500 284 C548 284 586 246 620 258 L716 314 C736 470 750 630 756 800 L680 816 C672 580 668 512 664 462 C664 660 670 880 676 1078 C552 1106 448 1106 324 1078 C330 880 336 660 336 462 C332 512 328 580 324 704 L250 690 C254 590 264 470 284 314 Z',
    lines: ['M500 296 L500 1094', 'M330 660 L670 660'],
    dots: [[470, 430], [470, 520]]
  }),
  vest: () => ({
    body: 'M398 266 C430 258 460 290 500 290 C540 290 570 258 602 266 C590 320 620 372 648 412 C656 520 660 650 660 790 C552 818 448 818 340 790 C340 650 344 520 352 412 C380 372 410 320 398 266 Z',
    lines: ['M500 292 L500 804', 'M348 466 C448 486 552 486 652 466', 'M344 566 C448 586 552 586 656 566', 'M342 666 C448 686 552 686 658 666']
  }),
  bra: () => ({
    body: 'M352 470 C352 420 366 392 400 380 C440 366 470 384 500 404 C530 384 560 366 600 380 C634 392 648 420 648 470 C648 520 646 552 644 578 C548 600 452 600 356 578 C354 552 352 520 352 470 Z',
    strokes: [{ d: 'M392 386 C374 338 348 294 326 250', w: 16 }, { d: 'M608 386 C626 338 652 294 674 250', w: 16 }],
    lines: ['M356 534 C452 556 548 556 644 534']
  }),
  longbra: () => ({
    body: 'M352 452 C352 402 366 374 400 362 C440 348 470 366 500 386 C530 366 560 348 600 362 C634 374 648 402 648 452 C648 540 646 610 642 664 C548 686 452 686 358 664 C354 610 352 540 352 452 Z',
    strokes: [{ d: 'M392 368 C374 320 348 276 326 232', w: 16 }, { d: 'M608 368 C626 320 652 276 674 232', w: 16 }],
    lines: ['M356 512 C452 534 548 534 644 512', 'M356 592 C452 614 548 614 644 592']
  }),
  tote: () => ({
    body: 'M316 462 L684 462 L708 934 C709 958 692 976 668 976 L332 976 C308 976 291 958 292 934 Z',
    strokes: [{ d: 'M396 466 C396 356 442 306 500 306 C558 306 604 356 604 466', w: 22 }],
    lines: ['M292 560 L708 560']
  }),
  sock: () => ({
    body: 'M424 300 L576 300 L576 556 C576 598 590 622 622 638 L714 684 C744 699 744 742 714 756 L524 814 C472 830 424 794 424 748 Z',
    lines: ['M424 352 L576 352', 'M424 392 L576 392']
  }),
  cap: () => ({
    body: 'M296 636 C296 486 386 392 500 392 C614 392 704 486 704 636 Z',
    extra: '<path d="M292 630 L704 630 C796 630 856 674 850 708 C700 720 396 720 292 706 Z"/>',
    lines: ['M500 396 L500 630']
  }),
  scrunchie: () => ({
    body: '',
    strokes: [
      { d: 'M420 520 m-96 0 a96 68 0 1 0 192 0 a96 68 0 1 0 -192 0', w: 54 },
      { d: 'M580 660 m-96 0 a96 68 0 1 0 192 0 a96 68 0 1 0 -192 0', w: 54 },
      { d: 'M500 810 m-96 0 a96 68 0 1 0 192 0 a96 68 0 1 0 -192 0', w: 54 }
    ]
  })
};


/* Hand-measured bounds per shape, used to fit each garment into the frame. */
const BOUNDS = {
  legging:[358,232,642,1078], flare:[338,232,662,1090], short:[358,232,642,700],
  jogger:[342,232,658,1078], wide:[336,232,664,1090], skirt:[318,240,682,1032],
  dress:[356,176,644,1042], tank:[354,258,646,794], bodysuit:[354,258,646,830],
  tee:[284,256,716,824], sweater:[256,256,744,856], cardigan:[258,256,742,806],
  halfzip:[252,234,748,864], jacket:[254,248,746,800], coat:[244,244,756,1106],
  vest:[340,256,660,818], bra:[318,242,682,600], longbra:[318,224,682,686],
  tote:[292,294,708,976], sock:[424,296,746,822], cap:[292,390,850,722],
  scrunchie:[306,436,698,894]
};
/* Target frame the garment is fitted into (with a scale ceiling so a sock
   never ends up the same visual weight as a full-length coat). */
function fitTransform(shapeKey) {
  const b = BOUNDS[shapeKey];
  if (!b) return '';
  const [x0, y0, x1, y1] = b;
  const w = x1 - x0, h = y1 - y0;
  const TX = 152, TY = 158, TW = 696, TH = 944, MAX = 1.52;
  const k = Math.min(TW / w, TH / h, MAX);
  const dx = TX + (TW - w * k) / 2 - x0 * k;
  const dy = TY + (TH - h * k) / 2 - y0 * k;
  return `translate(${dx.toFixed(1)} ${dy.toFixed(1)}) scale(${k.toFixed(4)})`;
}

const grain = id => `
    <filter id="grain-${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.055"/></feComponentTransfer>
    </filter>`;

function productSvg(product, color, key) {
  const shapeKey = product.id === 'rib-longline-bra' ? 'longbra' : product.shape;
  const shape = (SHAPES[shapeKey] || SHAPES.tee)();
  const [bgTop, bgBot] = backdrop(color.hex);
  const [, , l] = rgb2hsl(hex2rgb(color.hex));
  const lightGarment = l > 0.6;
  const fillTop = shade(color.hex, lightGarment ? 0.04 : 0.06);
  const fillBot = shade(color.hex, lightGarment ? -0.07 : -0.05);
  const lineColor = lightGarment ? shade(color.hex, -0.16) : shade(color.hex, 0.14);
  const strokes = (shape.strokes || [])
    .map(s => `<path d="${s.d}" fill="none" stroke="url(#g-${key})" stroke-width="${s.w}" stroke-linecap="round"/>`)
    .join('');
  const lines = (shape.lines || [])
    .map(d => `<path d="${d}" fill="none" stroke="${lineColor}" stroke-width="3" stroke-linecap="round" opacity=".5"/>`)
    .join('');
  const dots = (shape.dots || [])
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${lineColor}" opacity=".65"/>`)
    .join('');
  const body = shape.body ? `<path d="${shape.body}" fill="url(#g-${key})"/>` : '';
  const shadowSrc = shape.body
    ? `<path d="${shape.body}" fill="#2b2118" opacity=".13" transform="translate(18 22)" filter="url(#blur-${key})"/>`
    : '';
  const extra = shape.extra ? shape.extra.replace(/<(path|rect)/g, `<$1 fill="url(#g-${key})"`) : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1250" width="1000" height="1250" role="img" aria-label="${product.name} in ${color.name}">
  <defs>
    <linearGradient id="bg-${key}" x1="0" y1="0" x2=".3" y2="1">
      <stop offset="0" stop-color="${bgTop}"/><stop offset="1" stop-color="${bgBot}"/>
    </linearGradient>
    <radialGradient id="glow-${key}" cx=".5" cy=".32" r=".62">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".55"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="g-${key}" x1=".15" y1="0" x2=".85" y2="1">
      <stop offset="0" stop-color="${fillTop}"/><stop offset=".55" stop-color="${color.hex}"/><stop offset="1" stop-color="${fillBot}"/>
    </linearGradient>
    <filter id="blur-${key}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16"/>
    </filter>${grain(key)}
  </defs>
  <rect width="1000" height="1250" fill="url(#bg-${key})"/>
  <ellipse cx="500" cy="400" rx="520" ry="440" fill="url(#glow-${key})"/>
  <g transform="${fitTransform(shapeKey)}">
    ${shadowSrc}
    ${body}${extra}${strokes}${lines}${dots}
  </g>
  <rect width="1000" height="1250" filter="url(#grain-${key})" opacity=".9"/>
</svg>`;
}

/* Fabric close-up used as the second gallery frame. */
function detailSvg(product, color, key) {
  const [bgTop] = backdrop(color.hex);
  const c = color.hex;
  const light = shade(c, 0.09);
  const dark = shade(c, -0.09);
  const rows = [];
  for (let i = -6; i < 46; i++) {
    rows.push(`<path d="M${-100 + i * 34} 1300 L${180 + i * 34} -50" stroke="${i % 2 ? light : dark}" stroke-width="15" opacity=".55"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1250" width="1000" height="1250" role="img" aria-label="${product.name} fabric detail">
  <defs>
    <radialGradient id="d-${key}" cx=".35" cy=".28" r=".9">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".38"/><stop offset="1" stop-color="#000000" stop-opacity=".26"/>
    </radialGradient>${grain('d' + key)}
  </defs>
  <rect width="1000" height="1250" fill="${c}"/>
  <g>${rows.join('')}</g>
  <rect width="1000" height="1250" fill="url(#d-${key})"/>
  <rect width="1000" height="1250" fill="${bgTop}" opacity=".05"/>
  <rect width="1000" height="1250" filter="url(#grain-d${key})" opacity=".9"/>
</svg>`;
}

/* ------------------------------------------------------- editorial images */
/* Abstract draped-cloth compositions: layered smooth folds, no stock photos. */
function editorialSvg({ w, h, key, palette, seed = 1, folds = 6 }) {
  let s = seed * 9301;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const layers = [];
  for (let i = 0; i < folds; i++) {
    const t = i / (folds - 1 || 1);
    const baseY = h * (0.30 + 0.62 * t);
    const amp = h * (0.10 + 0.10 * rnd());
    const p1 = w * (0.18 + 0.2 * rnd());
    const p2 = w * (0.55 + 0.25 * rnd());
    const col = palette[i % palette.length];
    layers.push(
      `<path d="M0 ${baseY + amp * 0.4} C ${p1} ${baseY - amp} ${p2} ${baseY + amp} ${w} ${baseY - amp * 0.5} L ${w} ${h} L 0 ${h} Z" fill="${col}" opacity="${(0.95 - i * 0.06).toFixed(2)}"/>`
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="0803 campaign imagery">
  <defs>
    <linearGradient id="sky-${key}" x1="0" y1="0" x2=".4" y2="1">
      <stop offset="0" stop-color="${palette[0]}"/><stop offset="1" stop-color="${palette[1]}"/>
    </linearGradient>
    <radialGradient id="sun-${key}" cx=".68" cy=".22" r=".55">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".7"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>${grain(key)}
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sky-${key})"/>
  <ellipse cx="${w * 0.68}" cy="${h * 0.22}" rx="${w * 0.5}" ry="${h * 0.34}" fill="url(#sun-${key})"/>
  ${layers.join('\n  ')}
  <rect width="${w}" height="${h}" filter="url(#grain-${key})" opacity=".9"/>
</svg>`;
}

/* ------------------------------------------------------------------- run */
const dataSrc = readFileSync(resolve(ROOT, 'assets/js/data.js'), 'utf8');
const PRODUCTS = new Function(`${dataSrc}; return PRODUCTS;`)();

let count = 0;
for (const p of PRODUCTS) {
  for (const c of p.colors) {
    const key = `${p.id}-${c.id}`.replace(/[^a-z0-9-]/gi, '');
    writeFileSync(resolve(OUT_P, `${p.id}--${c.id}.svg`), productSvg(p, c, key));
    count++;
  }
  const c0 = p.colors[0];
  writeFileSync(resolve(OUT_P, `${p.id}--detail.svg`), detailSvg(p, c0, `${p.id}`.replace(/[^a-z0-9-]/gi, '')));
  count++;
}

const sand = ['#efe7db', '#e3d7c6', '#d3c3ad', '#bfa98f', '#a68a6d', '#8c7156'];
const dusk = ['#e6dfd6', '#cfc6bd', '#adaaa4', '#8b8a86', '#65666a', '#41434a'];
const sage = ['#eeeee6', '#dfe1d4', '#c7ccb8', '#aab199', '#8c9679', '#6f7a5e'];
const clay = ['#f3e9e2', '#e8d5c8', '#d9b9a5', '#c49a83', '#a97a62', '#8a5f4a'];

const editorials = [
  ['hero', 1800, 2100, sand, 3, 7],
  ['hero-secondary', 1400, 1750, dusk, 5, 6],
  ['collection-studio', 1200, 1500, dusk, 11, 5],
  ['collection-everyday', 1200, 1500, sand, 13, 5],
  ['collection-outerwear', 1200, 1500, sage, 17, 5],
  ['collection-accessories', 1200, 1500, clay, 19, 5],
  ['story-wide', 2000, 1120, sand, 23, 6],
  ['store-wide', 2000, 1120, clay, 29, 6],
  ['journal-1', 1200, 900, sage, 31, 5],
  ['journal-2', 1200, 900, clay, 37, 5],
  ['journal-3', 1200, 900, dusk, 41, 5],
  ['fit-wide', 2000, 1000, sage, 43, 6]
];
for (const [name, w, h, palette, seed, folds] of editorials) {
  writeFileSync(resolve(OUT_E, `${name}.svg`), editorialSvg({ w, h, key: name, palette, seed, folds }));
  count++;
}

console.log(`generated ${count} svg files`);
