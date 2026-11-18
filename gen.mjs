// Draws "One Day: 17 November 2026" — a 1024x1024 front page of the day's world news.
// It writes poster.svg and poster.html; the browser render of poster.html is entry.png.
import { writeFileSync } from 'node:fs';

const PAPER = '#F5EFE3';
const CARD = '#FCF8F0';
const INK = '#161310';
const MUTED = '#6A6154';
const RED = '#A63229';
const BLUE = '#1C3A56';
const GOLD = '#B98A2F';

const W = 1024;
const M = 32;
const GAP = 12;
const CELL = (W - 2 * M - 2 * GAP) / 3; // 312
const col = (c) => M + c * (CELL + GAP);
const row = (r) => M + r * (CELL + GAP);

// Icons are drawn in a 100x100 box, one per story.
const icons = {
  summit: `
    <g stroke="${INK}" stroke-width="5" stroke-linecap="round" fill="none">
      <path d="M8 84 H92" stroke-width="4" opacity="0.45"/>
      <path d="M28 84 V40 M72 84 V40"/>
      <path d="M18 40 H38 M62 40 H82"/>
      <path d="M61 30 H83 L83 8 H61 Z" fill="${BLUE}" stroke="none"/>
      <path d="M20 22 H44 V14 H20 Z" fill="${RED}" stroke="none"/>
    </g>
    <path d="M50 46 l4 12 12 0 -10 8 4 12 -10-8 -10 8 4-12 -10-8 12 0 Z" fill="${GOLD}"/>`,
  drone: `
    <g stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round">
      <path d="M32 68 L68 32 M32 32 L68 68"/>
      <circle cx="32" cy="32" r="10" fill="${PAPER}"/>
      <circle cx="68" cy="32" r="10" fill="${PAPER}"/>
      <circle cx="32" cy="68" r="10" fill="${PAPER}"/>
      <circle cx="68" cy="68" r="10" fill="${PAPER}"/>
    </g>
    <rect x="40" y="40" width="20" height="20" rx="5" fill="${RED}"/>
    <path d="M84 66 A22 22 0 0 1 84 90" stroke="${RED}" stroke-width="4" fill="none"/>
    <circle cx="50" cy="86" r="5" fill="${INK}"/>
    <path d="M14 88 H40" stroke="${INK}" stroke-width="3" opacity="0.4"/>`,
  bridge: `
    <g stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round">
      <path d="M4 72 H96"/>
      <path d="M14 72 V40 M50 72 V18 M86 72 V40"/>
      <path d="M14 40 L50 18 L86 40" stroke-width="4"/>
      <path d="M4 84 H96" stroke-width="3" opacity="0.45"/>
    </g>
    <path d="M44 60 L34 52 M56 60 L66 52" stroke="${RED}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="76" cy="16" r="6" fill="${RED}"/>`,
  chip: `
    <rect x="24" y="24" width="52" height="52" rx="6" fill="none" stroke="${INK}" stroke-width="5"/>
    <rect x="40" y="40" width="20" height="20" rx="3" fill="${INK}"/>
    <g stroke="${INK}" stroke-width="4" stroke-linecap="round">
      <path d="M36 24 V10 M50 24 V10 M64 24 V10 M36 76 V90 M50 76 V90 M64 76 V90"/>
      <path d="M24 36 H10 M24 50 H10 M24 64 H10"/>
    </g>
    <path d="M84 62 L84 30 M76 40 L84 28 L92 40" stroke="${GOLD}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  outage: `
    <g stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round">
      <rect x="16" y="58" width="30" height="26" rx="3"/>
      <rect x="54" y="42" width="30" height="42" rx="3"/>
      <path d="M30 58 V46 M54 42 V30"/>
    </g>
    <path d="M20 22 L46 44" stroke="${RED}" stroke-width="7" stroke-linecap="round"/>
    <path d="M46 22 L20 44" stroke="${RED}" stroke-width="7" stroke-linecap="round"/>
    <path d="M68 24 L92 34" stroke="${MUTED}" stroke-width="4" stroke-linecap="round" stroke-dasharray="6 7"/>`,
  aid: `
    <g stroke="${INK}" stroke-width="5" fill="none">
      <path d="M10 46 H58 V74 H10 Z"/>
      <path d="M58 54 H76 L88 66 V74 H58 Z"/>
      <circle cx="26" cy="80" r="7" fill="${PAPER}"/>
      <circle cx="72" cy="80" r="7" fill="${PAPER}"/>
    </g>
    <path d="M20 32 H46 M33 20 V44" stroke="${RED}" stroke-width="6" stroke-linecap="round"/>`,
  climate: `
    <g stroke="${BLUE}" stroke-width="5" fill="none">
      <circle cx="32" cy="50" r="24"/>
      <ellipse cx="32" cy="50" rx="10" ry="24"/>
      <path d="M8 42 H56 M8 58 H56"/>
    </g>
    <g fill="${INK}">
      <rect x="62" y="52" width="12" height="34" rx="2"/>
      <rect x="78" y="38" width="12" height="48" rx="2"/>
    </g>
    <path d="M62 30 C72 20 82 20 92 30" stroke="${GOLD}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  resign: `
    <g stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round">
      <path d="M22 84 V24"/>
      <path d="M22 26 H78 V50 H22" fill="${BLUE}" stroke-width="4"/>
    </g>
    <circle cx="70" cy="72" r="12" fill="${PAPER}" stroke="${INK}" stroke-width="4"/>
    <path d="M70 64 V72 L76 76" stroke="${RED}" stroke-width="4"/>`,
};

const stories = [
  {
    kicker: 'ASIA · DIPLOMACY',
    icon: 'summit',
    lines: ['TRUMP LANDS', 'IN MANILA'],
    fact: 'ASEAN summit first; Putin–Xi–Trump talks in Shenzhen on Thursday, protests fill Manila',
  },
  {
    kicker: 'MIDDLE EAST · WAR',
    icon: 'drone',
    lines: ['IRAN HITS', 'US RADAR POST'],
    fact: 'Drone strike on a US site in Bahrain; third carrier group arrives; tankers burn in Hormuz',
  },
  {
    kicker: 'EUROPE · UKRAINE',
    icon: 'bridge',
    lines: ['CRIMEA BRIDGE', 'DAMAGED'],
    fact: 'Kyiv’s largest drone raid of the war: 2,000+ downed, refineries hit, 17 air alerts in a day',
  },
  {
    kicker: 'MARKETS',
    icon: 'chip',
    lines: ['NVIDIA BEATS', 'AND LIFTS'],
    fact: 'Revenue ahead and guidance raised; shares recover after CEO Jensen Huang’s sudden exit',
  },
  {
    kicker: 'TECHNOLOGY',
    icon: 'outage',
    lines: ['BANKS AND', 'AIRLINES DOWN'],
    fact: 'Chase blames a software bug; United halts flights 90 minutes; FAA ground stop fallout',
  },
  {
    kicker: 'MIDDLE EAST · GAZA',
    icon: 'aid',
    lines: ['AID PLEDGES', 'UNMET'],
    fact: 'Israel falls short on ceasefire deliveries; food, tents and medical supplies run short',
  },
  {
    kicker: 'CLIMATE',
    icon: 'climate',
    lines: ['DATA CENTRES', 'OUT-EMIT NATIONS'],
    fact: 'Study: 403 US hyperscale sites emit as much carbon as Denmark; COP31 weighs AI’s power use',
  },
  {
    kicker: 'ASIA · POLITICS',
    icon: 'resign',
    lines: ['MONGOLIA’S', 'PRESIDENT QUITS'],
    fact: 'Khurelsukh steps down after corruption accusations; a caretaker takes the office',
  },
];

function titleCell() {
  return `
  <g transform="translate(${col(0)} ${row(0)})">
    <rect width="${CELL}" height="${CELL}" fill="${INK}"/>
    <text x="22" y="46" font-family="Helvetica Neue, Helvetica, Arial" font-size="12.5" letter-spacing="3.2" fill="${RED}" font-weight="700">TUESDAY</text>
    <text x="22" y="118" font-family="Georgia, Times New Roman, serif" font-size="54" font-weight="700" fill="${PAPER}">17 NOV</text>
    <text x="22" y="176" font-family="Georgia, Times New Roman, serif" font-size="54" font-weight="700" fill="${PAPER}">2026</text>
    <rect x="22" y="196" width="58" height="4" fill="${RED}"/>
    <text x="22" y="230" font-family="Helvetica Neue, Helvetica, Arial" font-size="16" letter-spacing="2.1" fill="${PAPER}">WORLD NEWS</text>
    <text x="22" y="254" font-family="Helvetica Neue, Helvetica, Arial" font-size="16" letter-spacing="2.1" fill="${PAPER}">IN ONE IMAGE</text>
    <text x="22" y="284" font-family="Helvetica Neue, Helvetica, Arial" font-size="10.5" fill="#9C9285">The day, in eight stories</text>
  </g>`;
}

function wrap(text, budget) {
  const out = [];
  let line = '';
  for (const word of text.split(' ')) {
    if (line && (line + ' ' + word).length > budget) {
      out.push(line);
      line = word;
    } else {
      line = line ? line + ' ' + word : word;
    }
  }
  if (line) out.push(line);
  return out;
}

function storyCell(story, index) {
  const slot = index + 1;
  const c = slot % 3;
  const r = Math.floor(slot / 3);
  let head = story.lines.flatMap((line) => wrap(line, 13));
  let size = 26;
  let lead = 29;
  if (head.length > 2) {
    head = story.lines.flatMap((line) => wrap(line, 16));
    size = 22;
    lead = 25;
  }
  const headTop = 172;
  const factTop = headTop + (head.length - 1) * lead + 26;
  const facts = wrap(story.fact, 43);
  return `
  <g transform="translate(${col(c)} ${row(r)})">
    <rect width="${CELL}" height="${CELL}" fill="${CARD}"/>
    <rect width="${CELL}" height="3" fill="${RED}" opacity="0.85"/>
    <text x="18" y="34" font-family="Helvetica Neue, Helvetica, Arial" font-size="10.5" letter-spacing="2.2" fill="${RED}" font-weight="700">${story.kicker}</text>
    <g transform="translate(${(CELL - 112) / 2} 44) scale(1.12)">${icons[story.icon]}</g>
    ${head
      .map(
        (line, i) =>
          `<text x="18" y="${headTop + i * lead}" font-family="Georgia, Times New Roman, serif" font-size="${size}" font-weight="700" fill="${INK}">${line}</text>`,
      )
      .join('')}
    ${facts
      .map(
        (line, i) =>
          `<text x="18" y="${factTop + i * 15}" font-family="Helvetica Neue, Helvetica, Arial" font-size="12" fill="${MUTED}">${line}</text>`,
      )
      .join('')}
  </g>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">
  <rect width="${W}" height="${W}" fill="${PAPER}"/>
  ${titleCell()}
  ${stories.map(storyCell).join('\n')}
</svg>`;

writeFileSync(new URL('./poster.svg', import.meta.url), svg);
writeFileSync(
  new URL('./poster.html', import.meta.url),
  `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;width:${W}px;height:${W}px;overflow:hidden;background:${PAPER}}</style></head><body>${svg}</body></html>`,
);
console.log(`wrote poster.svg and poster.html (${stories.length} stories)`);
