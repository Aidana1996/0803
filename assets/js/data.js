/* =========================================================================
   0803 — Catalog
   Single source of truth for products, collections and in-store inventory.
   No backend: inventory is derived deterministically so every page and every
   visit shows the same counts for the Santa Ana floor.
   ========================================================================= */

const STORE = {
  name: '0803 Santa Ana',
  street: '2590 Red Hill Ave',
  city: 'Santa Ana',
  state: 'CA',
  zip: '92705',
  get address() { return `${this.street}, ${this.city}, ${this.state} ${this.zip}`; },
  phone: '(714) 555-0803',
  phoneHref: 'tel:+17145550803',
  email: 'hello@0803.store',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=2590+Red+Hill+Ave+Santa+Ana+CA+92705',
  hours: [
    { day: 'Monday – Thursday', time: '10am – 7pm' },
    { day: 'Friday – Saturday', time: '10am – 8pm' },
    { day: 'Sunday', time: '11am – 6pm' }
  ]
};

const COLLECTIONS = [
  {
    id: 'studio',
    name: 'Studio',
    tagline: 'Train, stretch, repeat.',
    description: 'Compressive knits and second-skin jersey built for movement — and quiet enough to wear straight through the rest of the day.'
  },
  {
    id: 'everyday',
    name: 'Everyday',
    tagline: 'The uniform, refined.',
    description: 'Soft structure, honest fabric, shapes that hold up to being worn on repeat. The pieces you reach for without thinking.'
  },
  {
    id: 'outerwear',
    name: 'Outerwear',
    tagline: 'For the walk between.',
    description: 'Layers weighted for a California winter — light in the hand, warm on the body, cut to fall clean over everything else.'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    tagline: 'Small, considered.',
    description: 'The last five percent. Carry-alls, caps and ribbed knits finished to the same standard as the rest of the floor.'
  }
];

const SIZES_APPAREL = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SIZES_ONE = ['One Size'];
const SIZES_SOCK = ['S/M', 'L/XL'];

const PRODUCTS = [
  /* ---------------------------------------------------------------- STUDIO */
  {
    id: 'airlift-legging',
    name: 'Airlift Legging',
    price: 118,
    collection: 'studio',
    category: 'Leggings',
    shape: 'legging',
    badge: 'Best seller',
    fabric: 'Airlift — 76% recycled nylon, 24% elastane',
    rise: 'High rise · 25" inseam',
    tagline: 'Sculpting compression that disappears the second it is on.',
    description: 'Our densest knit, engineered with a bonded waistband that stays put through every hinge and jump. Four-way stretch with real recovery, so the shape you buy is the shape you keep.',
    details: ['Bonded 4" waistband, no dig', 'Squat-proof at every size', 'Hidden key pocket at back waist', 'Flatlock seams to prevent chafe'],
    care: 'Machine wash cold, hang dry. No fabric softener.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'espresso', name: 'Espresso', hex: '#4a3a30' },
      { id: 'fog', name: 'Fog', hex: '#b9b6ae' },
      { id: 'clay', name: 'Clay', hex: '#b98a72' }
    ]
  },
  {
    id: 'contour-rib-legging',
    name: 'Contour Rib Legging',
    price: 98,
    collection: 'studio',
    category: 'Leggings',
    shape: 'legging',
    fabric: 'Contour Rib — 68% nylon, 32% elastane',
    rise: 'High rise · 26" inseam',
    tagline: 'A fine rib that reads as texture, not gym kit.',
    description: 'Knit on a narrow gauge for a rib that hugs without gripping. Soft enough to sleep in, structured enough for a full class.',
    details: ['Fine 2x2 rib, opaque at stretch', 'Seamless side panels', 'Elastic-free waistband edge'],
    care: 'Machine wash cold, lay flat to dry.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'bone', name: 'Bone', hex: '#e3ddd2' },
      { id: 'sage', name: 'Sage', hex: '#98a189' }
    ]
  },
  {
    id: 'momentum-legging',
    name: 'Momentum 7/8 Legging',
    price: 108,
    collection: 'studio',
    category: 'Leggings',
    shape: 'legging',
    fabric: 'Momentum — 80% recycled polyester, 20% elastane',
    rise: 'High rise · 24" inseam',
    tagline: 'Sweat-wicking, matte finish, made to run in.',
    description: 'A lighter hand than Airlift with a matte face that sheds sweat instead of holding it. Side drop-in pockets swallow a phone without swinging.',
    details: ['Two side drop-in pockets', 'Reflective heel tab', 'Matte, quick-dry face', 'Gusseted crotch'],
    care: 'Machine wash cold, tumble dry low.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'slate', name: 'Slate', hex: '#5c6169' },
      { id: 'plum', name: 'Plum', hex: '#6b4a58' }
    ]
  },
  {
    id: 'halo-bra',
    name: 'Halo Sports Bra',
    price: 68,
    collection: 'studio',
    category: 'Bras',
    shape: 'bra',
    badge: 'Best seller',
    fabric: 'Airlift — 76% recycled nylon, 24% elastane',
    rise: 'Medium support',
    tagline: 'A clean scoop with support you forget about.',
    description: 'Cut from the same knit as the Airlift Legging so it wears as a set. Removable cups, a wide underband, and straps that stay on the shoulder.',
    details: ['Removable molded cups', 'Wide bonded underband', 'Medium support — studio, lifting, flow'],
    care: 'Machine wash cold, hang dry.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'clay', name: 'Clay', hex: '#b98a72' },
      { id: 'bone', name: 'Bone', hex: '#e3ddd2' },
      { id: 'sage', name: 'Sage', hex: '#98a189' }
    ]
  },
  {
    id: 'rib-longline-bra',
    name: 'Rib Longline Bra',
    price: 72,
    collection: 'studio',
    category: 'Bras',
    shape: 'bra',
    fabric: 'Contour Rib — 68% nylon, 32% elastane',
    rise: 'Light support',
    tagline: 'Longline, low back, wears like a top.',
    description: 'Sits an inch below the ribcage with a scooped back. Light support for flow, pilates and the walk there.',
    details: ['Longline band', 'Scoop back', 'Sewn-in cups'],
    care: 'Machine wash cold, lay flat to dry.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'bone', name: 'Bone', hex: '#e3ddd2' },
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'sage', name: 'Sage', hex: '#98a189' }
    ]
  },
  {
    id: 'featherweight-tank',
    name: 'Featherweight Tank',
    price: 58,
    collection: 'studio',
    category: 'Tops',
    shape: 'tank',
    fabric: 'Featherweight jersey — 100% Tencel modal',
    rise: 'Relaxed',
    tagline: 'The lightest thing on the floor.',
    description: 'A drapey modal tank that moves independently of the body. Long enough to cover a waistband, cut high enough at the arm to stay put.',
    details: ['Drapey modal jersey', 'Curved hem', 'Rolled arm and neck binding'],
    care: 'Machine wash cold, hang dry.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'bone', name: 'Bone', hex: '#e3ddd2' },
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'butter', name: 'Butter', hex: '#e6d3a3' }
    ]
  },
  {
    id: 'cloudset-crop-tee',
    name: 'Cloudset Crop Tee',
    price: 62,
    collection: 'studio',
    category: 'Tops',
    shape: 'tee',
    fabric: 'Cloudset — 55% pima cotton, 45% modal',
    rise: 'Cropped',
    tagline: 'Brushed inside, smooth outside.',
    description: 'A boxy crop with a dropped shoulder and a hem that lands right at the high waist. Brushed on the inside face for a hand you can feel in the fitting room.',
    details: ['Dropped shoulder', 'Brushed interior', 'Hits at high-rise waistband'],
    care: 'Machine wash cold, tumble dry low.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'bone', name: 'Bone', hex: '#e3ddd2' },
      { id: 'fog', name: 'Fog', hex: '#b9b6ae' },
      { id: 'black', name: 'Black', hex: '#16161a' }
    ]
  },
  {
    id: 'studio-flare-pant',
    name: 'Studio Flare Pant',
    price: 128,
    collection: 'studio',
    category: 'Bottoms',
    shape: 'flare',
    badge: 'New',
    fabric: 'Airlift — 76% recycled nylon, 24% elastane',
    rise: 'High rise · 33" inseam',
    tagline: 'Compression up top, kick at the floor.',
    description: 'Fitted through the hip and thigh, then released from the knee into a long clean flare. Hemmed to break over a sneaker.',
    details: ['33" inseam, designed for 5\'7"', 'Bonded waistband', 'Split hem at back'],
    care: 'Machine wash cold, hang dry.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'espresso', name: 'Espresso', hex: '#4a3a30' },
      { id: 'slate', name: 'Slate', hex: '#5c6169' }
    ]
  },
  {
    id: 'reset-bike-short',
    name: 'Reset Bike Short',
    price: 64,
    collection: 'studio',
    category: 'Bottoms',
    shape: 'short',
    fabric: 'Airlift — 76% recycled nylon, 24% elastane',
    rise: 'High rise · 8" inseam',
    tagline: 'Eight inches, no ride-up.',
    description: 'The Airlift knit cut to mid-thigh with a silicone-free gripper hem that holds without leaving a mark.',
    details: ['8" inseam', 'Gripper-free hold hem', 'Back waist pocket'],
    care: 'Machine wash cold, hang dry.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'fog', name: 'Fog', hex: '#b9b6ae' },
      { id: 'clay', name: 'Clay', hex: '#b98a72' }
    ]
  },

  /* -------------------------------------------------------------- EVERYDAY */
  {
    id: 'sunday-rib-dress',
    name: 'Sunday Rib Dress',
    price: 138,
    collection: 'everyday',
    category: 'Dresses',
    shape: 'dress',
    badge: 'Best seller',
    fabric: 'Heavy rib — 92% cotton, 8% elastane',
    rise: 'Midi length',
    tagline: 'One piece, whole day.',
    description: 'A weighted rib that skims instead of clings, with a built-in shelf bra and a midi hem that reads dressed even at 8am.',
    details: ['Built-in shelf bra', 'Midi hem, 46" from shoulder', 'Side slit', 'Heavy rib holds its shape'],
    care: 'Machine wash cold, lay flat to dry.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'espresso', name: 'Espresso', hex: '#4a3a30' },
      { id: 'bone', name: 'Bone', hex: '#e3ddd2' }
    ]
  },
  {
    id: 'weekender-wide-leg',
    name: 'Weekender Wide-Leg',
    price: 118,
    collection: 'everyday',
    category: 'Bottoms',
    shape: 'wide',
    fabric: 'Brushed twill — 68% cotton, 29% recycled poly, 3% elastane',
    rise: 'High rise · 31" inseam',
    tagline: 'Trouser lines, sweatpant feel.',
    description: 'A pressed-front wide leg in a brushed twill soft enough to travel in. Elastic hidden at the back waist so the front stays flat.',
    details: ['Hidden back elastic', 'Front seam crease', 'Deep side pockets'],
    care: 'Machine wash cold, tumble dry low, warm iron.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'bone', name: 'Bone', hex: '#e3ddd2' },
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'slate', name: 'Slate', hex: '#5c6169' }
    ]
  },
  {
    id: 'second-skin-bodysuit',
    name: 'Second-Skin Bodysuit',
    price: 88,
    collection: 'everyday',
    category: 'Tops',
    shape: 'bodysuit',
    fabric: 'Seamless nylon — 82% nylon, 18% elastane',
    rise: 'Fitted',
    tagline: 'A clean line under everything.',
    description: 'Knit in the round with no side seams. Square neck in front, scoop in back, snap gusset at the base.',
    details: ['Seamless, knit in the round', 'Square neck / scoop back', 'Snap gusset'],
    care: 'Hand wash cold, lay flat to dry.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'clay', name: 'Clay', hex: '#b98a72' },
      { id: 'bone', name: 'Bone', hex: '#e3ddd2' }
    ]
  },
  {
    id: 'boxy-pima-tee',
    name: 'Boxy Pima Tee',
    price: 52,
    collection: 'everyday',
    category: 'Tops',
    shape: 'tee',
    fabric: '100% Peruvian pima cotton, 180gsm',
    rise: 'Boxy',
    tagline: 'The white tee, done properly.',
    description: 'Long-staple pima with enough weight to hang straight off the shoulder and stay opaque after twenty washes.',
    details: ['180gsm long-staple pima', 'Ribbed neck with taped seam', 'Straight boxy body'],
    care: 'Machine wash cold, tumble dry low.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'bone', name: 'Bone', hex: '#e3ddd2' },
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'sage', name: 'Sage', hex: '#98a189' },
      { id: 'butter', name: 'Butter', hex: '#e6d3a3' }
    ]
  },
  {
    id: 'cashmere-blend-crew',
    name: 'Cashmere-Blend Crew',
    price: 168,
    collection: 'everyday',
    category: 'Knitwear',
    shape: 'sweater',
    fabric: '70% merino wool, 30% cashmere',
    rise: 'Relaxed',
    tagline: 'The one good sweater.',
    description: 'A 12-gauge crew with full-fashioned shoulders and ribbing that recovers. Warm without bulk — right for the four cold weeks Orange County gets.',
    details: ['12-gauge merino-cashmere', 'Full-fashioned shoulder', 'Rib cuff and hem'],
    care: 'Hand wash cool or dry clean. Lay flat.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'oat', name: 'Oat', hex: '#d6c9b4' },
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'plum', name: 'Plum', hex: '#6b4a58' }
    ]
  },
  {
    id: 'slip-midi-skirt',
    name: 'Slip Midi Skirt',
    price: 108,
    collection: 'everyday',
    category: 'Bottoms',
    shape: 'skirt',
    badge: 'New',
    fabric: 'Matte satin — 100% recycled polyester',
    rise: 'Mid rise · 30" length',
    tagline: 'Bias cut, no shine.',
    description: 'Cut on the bias so it swings from the hip. A matte face keeps it out of eveningwear territory — wear it with the Boxy Pima Tee and a sneaker.',
    details: ['True bias cut', 'Matte, non-reflective face', 'Covered elastic back waist'],
    care: 'Machine wash cold in a bag, hang dry.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'espresso', name: 'Espresso', hex: '#4a3a30' },
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'sage', name: 'Sage', hex: '#98a189' }
    ]
  },
  {
    id: 'lounge-jogger',
    name: 'Lounge Jogger',
    price: 98,
    collection: 'everyday',
    category: 'Bottoms',
    shape: 'jogger',
    fabric: 'Brushed fleece — 80% cotton, 20% recycled poly',
    rise: 'High rise · 28" inseam',
    tagline: 'Airport to couch, no apologies.',
    description: 'A tapered fleece jogger with a wide flat drawcord and cuffs that hold their shape instead of ballooning.',
    details: ['Brushed interior fleece', 'Flat woven drawcord', 'Tapered leg, ribbed cuff', 'Zip pocket at right thigh'],
    care: 'Machine wash cold, tumble dry low.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'fog', name: 'Fog', hex: '#b9b6ae' },
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'oat', name: 'Oat', hex: '#d6c9b4' }
    ]
  },
  {
    id: 'cropped-cardigan',
    name: 'Cropped Cardigan',
    price: 128,
    collection: 'everyday',
    category: 'Knitwear',
    shape: 'cardigan',
    fabric: 'Cotton-silk — 85% cotton, 15% silk',
    rise: 'Cropped',
    tagline: 'Buttons up, layers over.',
    description: 'A fine-gauge crop with corozo buttons and a hem that sits at the natural waist. Wears open over a tank or closed as a top.',
    details: ['Corozo buttons', 'Fine gauge, cotton-silk', 'Cropped at natural waist'],
    care: 'Hand wash cool, lay flat to dry.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'bone', name: 'Bone', hex: '#e3ddd2' },
      { id: 'butter', name: 'Butter', hex: '#e6d3a3' },
      { id: 'black', name: 'Black', hex: '#16161a' }
    ]
  },

  /* ------------------------------------------------------------- OUTERWEAR */
  {
    id: 'cloud-puffer-vest',
    name: 'Cloud Puffer Vest',
    price: 158,
    collection: 'outerwear',
    category: 'Outerwear',
    shape: 'vest',
    fabric: 'Recycled ripstop shell, recycled poly fill',
    rise: 'Cropped',
    tagline: 'Warmth where you need it, nowhere you don\'t.',
    description: 'A cropped quilted vest that layers under a coat or over a hoodie without adding a size. Packs into its own pocket.',
    details: ['Packs into left pocket', 'Recycled ripstop shell', 'Two-way front zip', 'Cropped at hip'],
    care: 'Machine wash cold, tumble dry low with dryer balls.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'bone', name: 'Bone', hex: '#e3ddd2' },
      { id: 'sage', name: 'Sage', hex: '#98a189' }
    ]
  },
  {
    id: 'ambient-half-zip',
    name: 'Ambient Half-Zip',
    price: 138,
    collection: 'outerwear',
    category: 'Outerwear',
    shape: 'halfzip',
    badge: 'Best seller',
    fabric: 'Double-knit — 62% recycled poly, 33% nylon, 5% elastane',
    rise: 'Relaxed',
    tagline: 'The morning layer.',
    description: 'A dense double-knit half-zip with thumbholes and a collar that stands on its own. Warm in the car, fine in class.',
    details: ['Thumbholes at cuff', 'Structured stand collar', 'Kangaroo hand pocket'],
    care: 'Machine wash cold, tumble dry low.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'oat', name: 'Oat', hex: '#d6c9b4' },
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'slate', name: 'Slate', hex: '#5c6169' }
    ]
  },
  {
    id: 'soft-shell-trench',
    name: 'Soft Shell Trench',
    price: 248,
    collection: 'outerwear',
    category: 'Outerwear',
    shape: 'coat',
    fabric: 'Bonded soft shell — 100% recycled polyester, DWR finish',
    rise: 'Long',
    tagline: 'Rain-ready, not raincoat.',
    description: 'A trench cut in bonded soft shell with a PFC-free water-repellent finish. Falls to mid-calf, belts at the waist, moves like a knit.',
    details: ['PFC-free DWR finish', 'Removable belt', 'Storm flap and back vent', 'Mid-calf length'],
    care: 'Machine wash cold, tumble dry low to reactivate finish.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'oat', name: 'Oat', hex: '#d6c9b4' },
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'espresso', name: 'Espresso', hex: '#4a3a30' }
    ]
  },
  {
    id: 'cropped-bomber',
    name: 'Cropped Bomber',
    price: 188,
    collection: 'outerwear',
    category: 'Outerwear',
    shape: 'jacket',
    badge: 'New',
    fabric: 'Washed nylon shell, jersey lining',
    rise: 'Cropped',
    tagline: 'Sharp shoulder, easy hem.',
    description: 'A washed nylon bomber cropped at the high hip with a defined shoulder and rib trims that stay tight.',
    details: ['Washed nylon with a dry hand', 'Rib collar, cuff and hem', 'Two welt pockets', 'Jersey-lined body'],
    care: 'Machine wash cold, hang dry.',
    sizes: SIZES_APPAREL,
    colors: [
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'sage', name: 'Sage', hex: '#98a189' },
      { id: 'bone', name: 'Bone', hex: '#e3ddd2' }
    ]
  },

  /* ----------------------------------------------------------- ACCESSORIES */
  {
    id: 'everyday-tote',
    name: 'Everyday Tote',
    price: 78,
    collection: 'accessories',
    category: 'Bags',
    shape: 'tote',
    fabric: '18oz washed cotton canvas, leather trim',
    rise: 'One size',
    tagline: 'Mat, laptop, everything else.',
    description: 'A structured canvas tote sized to swallow a yoga mat lengthwise. Interior zip pocket, leather-bound handles, flat base.',
    details: ['Fits a rolled mat', 'Interior zip pocket', 'Leather-bound handles', 'Flat reinforced base'],
    care: 'Spot clean.',
    sizes: SIZES_ONE,
    colors: [
      { id: 'bone', name: 'Bone', hex: '#e3ddd2' },
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'espresso', name: 'Espresso', hex: '#4a3a30' }
    ]
  },
  {
    id: 'ribbed-crew-sock',
    name: 'Ribbed Crew Sock — 3 Pack',
    price: 28,
    collection: 'accessories',
    category: 'Socks',
    shape: 'sock',
    fabric: 'Combed cotton blend with arch support',
    rise: 'Crew',
    tagline: 'Three pairs, no slipping.',
    description: 'A ribbed crew with a knit-in arch band and a cushioned heel. Sold in bone, black and fog.',
    details: ['Three pairs per pack', 'Knit-in arch support', 'Cushioned heel and toe'],
    care: 'Machine wash cold, tumble dry low.',
    sizes: SIZES_SOCK,
    colors: [
      { id: 'multi', name: 'Bone / Black / Fog', hex: '#c9c3b8' }
    ]
  },
  {
    id: 'studio-cap',
    name: 'Studio Cap',
    price: 42,
    collection: 'accessories',
    category: 'Hats',
    shape: 'cap',
    fabric: 'Washed cotton twill',
    rise: 'One size',
    tagline: 'Soft crown, low profile.',
    description: 'An unstructured five-panel in washed twill with a curved brim and a debossed 0803 at the back strap.',
    details: ['Unstructured five-panel', 'Adjustable metal slider', 'Debossed 0803 at back'],
    care: 'Spot clean.',
    sizes: SIZES_ONE,
    colors: [
      { id: 'black', name: 'Black', hex: '#16161a' },
      { id: 'oat', name: 'Oat', hex: '#d6c9b4' },
      { id: 'sage', name: 'Sage', hex: '#98a189' }
    ]
  },
  {
    id: 'silk-scrunchie-set',
    name: 'Silk Scrunchie Set',
    price: 24,
    collection: 'accessories',
    category: 'Hair',
    shape: 'scrunchie',
    fabric: '100% mulberry silk, 19 momme',
    rise: 'One size',
    tagline: 'Kinder to hair than the alternative.',
    description: 'Three 19-momme silk scrunchies on a soft elastic core. No crease, no snag.',
    details: ['Set of three', '19 momme mulberry silk', 'Soft-core elastic'],
    care: 'Hand wash cool, air dry.',
    sizes: SIZES_ONE,
    colors: [
      { id: 'multi', name: 'Bone / Clay / Black', hex: '#cbb3a4' }
    ]
  }
];

/* ------------------------------------------------------------------------ */
/* Inventory — deterministic per product / color / size so the floor count   */
/* a customer sees today is the same one they see tomorrow.                  */
/* ------------------------------------------------------------------------ */

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0);
}

/** Units of a given product/color/size sitting on the Santa Ana floor. */
function stockFor(productId, colorId, size) {
  const n = hashString(`${productId}::${colorId}::${size}`) % 100;
  if (n < 12) return 0;          // 12% sold out
  if (n < 26) return 1;          // low
  if (n < 40) return 2;
  if (n < 62) return 3 + (n % 2);
  return 5 + (n % 4);
}

/** Total units of a product across every color and size. */
function totalStock(product) {
  let total = 0;
  product.colors.forEach(c => product.sizes.forEach(s => { total += stockFor(product.id, c.id, s); }));
  return total;
}

/** Sizes that exist on the floor right now for a given colorway. */
function availableSizes(product, colorId) {
  return product.sizes.filter(s => stockFor(product.id, colorId, s) > 0);
}

function productById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

function collectionById(id) {
  return COLLECTIONS.find(c => c.id === id) || null;
}

function money(n) {
  return '$' + n.toFixed(0);
}
