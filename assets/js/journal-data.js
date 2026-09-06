/* Journal entries. Bodies are trusted HTML authored here, not user input. */
const JOURNAL = [
  {
    id: 'how-to-fit-a-legging',
    kicker: 'Fit notes',
    title: 'How a legging should actually fit',
    excerpt: 'Four things we check on every customer in the fitting room — and the one that people get wrong most often.',
    image: 'assets/img/editorial/journal-1.svg',
    date: 'August 2026',
    read: '5 min',
    body: `
      <p>Most people size a legging by how it feels in the first ten seconds. That is the least useful ten seconds. A compressive knit relaxes about four percent in the first hour on the body, then holds. So the pair that feels perfect standing still in the fitting room is usually a half size too big by lunch.</p>
      <h2>The four checks</h2>
      <h3>1. The waistband, hinged</h3>
      <p>Stand up straight and it will look fine on almost anything. Hinge forward at the hip instead. If the band gaps at the small of your back or rolls at the front, the rise is wrong for your torso — not the size.</p>
      <h3>2. The inseam, seated</h3>
      <p>Sit down and cross one leg. The inseam should stay put. If it drags across the thigh, the leg is cut too narrow for the size, and you will feel it every time you get out of the car.</p>
      <h3>3. Opacity, in daylight</h3>
      <p>We keep a window in the fitting room for this. Squat, look down, and look for the fabric going grey. Airlift holds; a lighter knit at full stretch may not, which is why we do not cut leggings from Featherweight.</p>
      <h3>4. The knee, after five minutes</h3>
      <p>Bagging at the knee within five minutes means the recovery is not there. That is a fabric problem and no size fixes it.</p>
      <blockquote>If you are between sizes in a compressive knit, go down. In a soft knit, go up.</blockquote>
      <p>That is the whole rule, and it is why we do not sell these online. Come try both.</p>`
  },
  {
    id: 'the-five-piece-week',
    kicker: 'Styling',
    title: 'The five-piece week',
    excerpt: 'What a genuinely small wardrobe looks like when everything in it is expected to do two jobs.',
    image: 'assets/img/editorial/journal-2.svg',
    date: 'July 2026',
    read: '4 min',
    body: `
      <p>We asked six customers to pull five pieces that covered a full week — studio, work, errands, one dinner. The overlap was almost total.</p>
      <h2>What came up every time</h2>
      <ul>
        <li><strong>A high-rise legging in black.</strong> Not a colour. Black. It goes under everything else on this list.</li>
        <li><strong>One knit that reads as a top.</strong> The Rib Longline Bra and the Second-Skin Bodysuit both did this job.</li>
        <li><strong>A trouser with a crease.</strong> The Weekender Wide-Leg was the piece that moved the outfit from gym to dinner.</li>
        <li><strong>One layer with structure.</strong> Almost always the Cropped Bomber or the Ambient Half-Zip.</li>
        <li><strong>Something with a hem below the knee.</strong> A midi dress or skirt, doing the work of an outfit on its own.</li>
      </ul>
      <h2>What did not come up</h2>
      <p>Prints. Statement outerwear. Anything with a logo on the leg. Nobody reached for the piece that only worked one way, which is roughly how we decide what to cut next season.</p>
      <blockquote>Two jobs or it does not get made.</blockquote>`
  },
  {
    id: 'why-a-store',
    kicker: 'The store',
    title: 'Why we opened a store before a checkout',
    excerpt: 'The honest reason there is no buy button on this site — and what happens when you reserve instead.',
    image: 'assets/img/editorial/journal-3.svg',
    date: 'June 2026',
    read: '3 min',
    body: `
      <p>Every returns policy in this category is a tax on guessing. Roughly two in five pieces of women's apparel bought online come back, mostly for fit. That is a lot of shipping, a lot of packaging, and a lot of disappointment priced into the tag.</p>
      <p>So we started at the other end. One floor at 2590 Red Hill Avenue, everything on it, and a website whose job is to get you there knowing what you want to try.</p>
      <h2>What reserving actually does</h2>
      <ul>
        <li>You pick a size and colour here. We check it against the floor, not a warehouse.</li>
        <li>The piece goes into a room under your name and stays there for 48 hours.</li>
        <li>Nothing is charged. If it does not fit, you hand it back and we put it out again.</li>
      </ul>
      <h2>What we get out of it</h2>
      <p>We find out what does not fit, in person, from the person it did not fit. That has changed three patterns already — most recently the rise on the Weekender Wide-Leg, which went up an inch after about forty fitting-room conversations.</p>
      <blockquote>A shipping label cannot tell you the rise is wrong. A customer standing in front of a mirror will.</blockquote>
      <p>Online ordering will come. It will come after we are confident you can buy your size without thinking about it.</p>`
  }
];

function journalById(id) { return JOURNAL.find(p => p.id === id) || null; }
