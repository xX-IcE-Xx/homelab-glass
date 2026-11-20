// Christmas: a slim string of capped glass bulbs hugging the top edge, a moon
// in the top-right sky (a pale, low winter sun in light mode) with a small
// sleigh and team that glides across it now and then and rests on it, a few
// dim stars at the sides at night, snow in three depths, and two snowy groves
// of layered pines (snow on the boughs, a garland of glowing bulbs, a gold
// star) on soft drifts in the lower corners, with a lit cottage tucked among
// the left ones. Soft evergreen, cranberry and moonlit glows sit at the
// edges; the middle, where the words are, stays quiet.
// The still frame is the picture: all motion sits behind
// prefers-reduced-motion: no-preference. Without it the snow hangs where it is
// drawn (the flakes over the reading column all but vanish), the bulbs and
// stars rest lit, the smoke rests over the chimney and the sleigh rests on the
// moon.

// A small fixed-seed generator, so the scene is the same on every load.
let seed = 20261225
const rnd = (): number => {
  seed = (seed * 1664525 + 1013904223) % 4294967296

  return seed / 4294967296
}
const between = (lo: number, hi: number): number => lo + rnd() * (hi - lo)
const f = (n: number): string => n.toFixed(1)
const g = (n: number): string => String(Math.round(n))
const COLOURS = ['R', 'Y', 'G', 'B']
const pick = (): string => COLOURS[Math.floor(rnd() * COLOURS.length)] ?? 'R'

// ---- The string of lights ------------------------------------------------
// Shallow swags between hooks just above the top edge; each bulb is a small
// capped glass drop with a soft glow, drawn once per colour and placed with
// <use>. The whole string sits in the top 25 units, behind the header. On a
// wide window the string is shrunk back to its 16:10 size, so a mirrored copy
// hangs off each end (x -300 and 1980, where the hook heights match) to carry
// it to both edges.
const HOOK_GAP = 120
const SAG = 8
let wire = ''
let lights = ''
for (let i = 0; -300 + i * HOOK_GAP < 1900; i++) {
  const x0 = -300 + i * HOOK_GAP
  const x1 = x0 + HOOK_GAP
  const y0 = -2 + (i % 2) * 2
  const y1 = -2 + ((i + 1) % 2) * 2
  const cx = (x0 + x1) / 2
  const cy = (y0 + y1) / 2 + SAG * 2
  wire += `M${f(x0)} ${f(y0)}Q${f(cx)} ${f(cy)} ${f(x1)} ${f(y1)}`
  for (const t of [0.25, 0.5, 0.75]) {
    const bx = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1
    const by = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1
    const tilt = (t - 0.5) * -22 + (rnd() * 2 - 1) * 7
    lights += `<use href="#l${pick()}" class="tw t${Math.floor(rnd() * 4)}" transform="translate(${f(bx)} ${f(by)}) rotate(${f(tilt)}) scale(.68)"/>`
  }
}
// The bulbs are <use> clones, so only plain class selectors reach inside
// them (".L .halo" would not): the halo carries its own class, bh.
const bulbDef = (c: string): string =>
  `<g id="l${c}"><circle cx="0" cy="12" r="13" fill="url(#g${c})" class="bh"/><rect class="cap" x="-2.6" y="-1" width="5.2" height="5.6" rx="1"/><path class="c${c}" d="M-3.6 4.4C-6 8-5.6 14-2.4 17.6C-1.2 19 1.2 19 2.4 17.6C5.6 14 6 8 3.6 4.4Z"/><ellipse class="hi" cx="-1.6" cy="9" rx="1" ry="2.6"/></g>`

// ---- A pine ---------------------------------------------------------------
// Four tiers of scalloped boughs, snow lying in soft caps on the scallops
// (flat underneath, mounded on top, wider or narrower and tilted a little
// differently on each tier, heavier on some, none on others), a garland of
// bulbs draped across the lower three, a trunk and a star. wk narrows a tree;
// tl is the trunk's length (a short one stays tucked under the boughs).
const tree = (cx: number, base: number, h: number, wk = 1, tl = 0.17): string => {
  const top = base - h
  const tiers: [number, number, number][] = [
    [0.0, 0.31, 0.12],
    [0.14, 0.5, 0.19],
    [0.31, 0.69, 0.26],
    [0.48, 0.88, 0.33],
  ]
  const trunkW = h * 0.07
  let boughs = ''
  let snow = ''
  let garland = ''
  let bulbs = ''
  // Bottom tier first, so each upper tier lies over the one below.
  for (let k = tiers.length - 1; k >= 0; k--) {
    const [a, b, w] = tiers[k] ?? [0, 0, 0]
    const y0 = top + h * a
    const y1 = top + h * b
    const dy = y1 - y0
    const hw = h * w * wk
    const n = 3 + k
    const tipY = (x: number): number => y1 + dy * 0.1 * (1 - ((x - cx) / hw) ** 2)
    // Bough outline: down the right side, along the scallops, up the left.
    let d = `M${g(cx)} ${g(y0)}C${g(cx + hw * 0.18)} ${g(y0 + dy * 0.45)} ${g(cx + hw * 0.62)} ${g(y1 - dy * 0.12)} ${g(cx + hw)} ${g(y1)}`
    // How much snow this tier carries, and how often a scallop goes bare.
    const load = between(0.45, 1.25)
    const bare = k === 0 ? 0.45 : between(0.1, 0.35)
    // This tier's cap width and the way its caps lean.
    const ws = between(0.72, 1.08)
    const lean = between(-0.035, 0.035) * dy
    const lift = dy * 0.05
    for (let s = 0; s < n; s++) {
      const xa = cx + hw - (2 * hw * s) / n
      const xb = cx + hw - (2 * hw * (s + 1)) / n
      const xm = (xa + xb) / 2
      const top2 = Math.min(tipY(xa), tipY(xb))
      d += `Q${g(xm)} ${g(top2 - dy * 0.16)} ${g(xb)} ${g(tipY(xb))}`
      if (rnd() < bare) continue
      // One cap lying on this scallop, narrower than it, a little off
      // centre: an almost flat underside on the bough and a mound on top
      // whose crown drifts to one side, its depth varying scallop to scallop.
      const ins = between(0.78, 0.9)
      const span = Math.min(between(0.62, 0.95) * ws, 0.98)
      const shift = between(-0.08, 0.08) * (xa - xb)
      const ma = cx + (xm - cx) * ins + shift
      const half = ((xa - xb) * ins * span) / 2
      const ia = ma + half
      const ib = ma - half
      const th = load * between(0.55, 1.2)
      const ya = tipY(ia) - lift + lean
      const yb = tipY(ib) - lift - lean
      const ym = (ya + yb) / 2
      const crown = ym - dy * (0.05 + 0.06 * th)
      snow += `M${g(ia)} ${g(ya)}Q${g(ma)} ${g(ym - dy * 0.04)} ${g(ib)} ${g(yb)}C${g(ib + half * between(0.05, 0.5))} ${g(crown)} ${g(ia - half * between(0.05, 0.5))} ${g(crown)} ${g(ia)} ${g(ya)}Z`
    }
    d += `C${g(cx - hw * 0.62)} ${g(y1 - dy * 0.12)} ${g(cx - hw * 0.18)} ${g(y0 + dy * 0.45)} ${g(cx)} ${g(y0)}Z`
    boughs = `<path class="pine" d="${d}"/>` + boughs
    if (k > 0) {
      // A garland draped across the tier, high on the left, low on the right.
      const gx0 = cx - hw * 0.62
      const gy0 = y0 + dy * 0.5
      const gx1 = cx + hw * 0.66
      const gy1 = y0 + dy * 0.66
      const gcx = cx
      const gcy = y0 + dy * 0.98
      garland += `M${g(gx0)} ${g(gy0)}Q${g(gcx)} ${g(gcy)} ${g(gx1)} ${g(gy1)}`
      const count = 2 + k
      for (let i = 0; i < count; i++) {
        const t = (i + 0.5) / count
        const bx = (1 - t) * (1 - t) * gx0 + 2 * (1 - t) * t * gcx + t * t * gx1
        const by = (1 - t) * (1 - t) * gy0 + 2 * (1 - t) * t * gcy + t * t * gy1
        const c = pick()
        const ph = Math.floor(rnd() * 4)
        bulbs += `<circle class="halo th t${ph}" cx="${g(bx)}" cy="${g(by)}" r="${g(h * 0.04)}" fill="url(#g${c})"/><circle class="c${c} tw t${ph}" cx="${g(bx)}" cy="${g(by)}" r="${f(h * 0.011)}"/>`
      }
    }
  }
  const trunk = `<rect class="trunk" x="${g(cx - trunkW / 2)}" y="${g(top + h * 0.84)}" width="${g(trunkW)}" height="${g(h * tl)}"/>`
  // A five-point star with a gold glow behind it.
  const sr = h * 0.045
  let star = ''
  for (let p = 0; p < 10; p++) {
    const ang = -Math.PI / 2 + (p * Math.PI) / 5
    const r = p % 2 === 0 ? sr : sr * 0.42
    star += `${p === 0 ? 'M' : 'L'}${g(cx + r * Math.cos(ang))} ${g(top - sr * 0.15 + r * Math.sin(ang))}`
  }

  return `${trunk}${boughs}<path class="bsnow" d="${snow}"/><path class="garl" d="${garland}"/>${bulbs}<circle class="sglow p${Math.floor(rnd() * 3)}" cx="${g(cx)}" cy="${g(top)}" r="${g(sr * 3.2)}" fill="url(#gY)"/><path class="star" d="${star}Z"/>`
}
// A pine further back: a cooler, quieter green, so where it overlaps the
// front ones the two stay apart.
const backTree = (cx: number, base: number, h: number, wk = 1, tl = 0.17): string => `<g class="back">${tree(cx, base, h, wk, tl)}</g>`

// ---- The cottage ----------------------------------------------------------
// A small cottage with a snowy roof, a chimney with smoke resting over it, two
// warm lit windows and a door, and its light spilling on the snow.
const cottage = (x: number, base: number, w: number): string => {
  const hw = w * 0.5
  const eave = base - hw
  const ridgeY = eave - w * 0.42
  const win = (wx: number): string =>
    `<circle class="wglow" cx="${f(wx)}" cy="${f(eave + hw * 0.38)}" r="${f(w * 0.26)}"/><rect class="win" x="${f(wx - w * 0.075)}" y="${f(eave + hw * 0.22)}" width="${f(w * 0.15)}" height="${f(hw * 0.32)}"/><path class="mull" d="M${f(wx)} ${f(eave + hw * 0.22)}V${f(eave + hw * 0.54)}M${f(wx - w * 0.075)} ${f(eave + hw * 0.38)}H${f(wx + w * 0.075)}"/>`

  return (
    `<ellipse class="spill" cx="${f(x + w * 0.5)}" cy="${f(base + 4)}" rx="${f(w * 0.85)}" ry="${f(w * 0.12)}"/>` +
    `<rect class="chim" x="${f(x + w * 0.66)}" y="${f(ridgeY + w * 0.08)}" width="${f(w * 0.11)}" height="${f(w * 0.3)}"/>` +
    `<rect class="wall" x="${f(x)}" y="${f(eave)}" width="${f(w)}" height="${f(hw + 6)}"/>` +
    `<path class="roof" d="M${f(x - w * 0.1)} ${f(eave + 2)}L${f(x + w * 0.5)} ${f(ridgeY - 2)}L${f(x + w * 1.1)} ${f(eave + 2)}Z"/>` +
    `<path class="rsnow" d="M${f(x - w * 0.12)} ${f(eave + 3)}L${f(x + w * 0.5)} ${f(ridgeY - 4)}L${f(x + w * 1.12)} ${f(eave + 3)}Q${f(x + w * 0.8)} ${f(eave - 1)} ${f(x + w * 0.5)} ${f(eave + 2)}Q${f(x + w * 0.2)} ${f(eave - 2)} ${f(x - w * 0.12)} ${f(eave + 3)}Z"/>` +
    `<rect class="rsnow" x="${f(x + w * 0.65)}" y="${f(ridgeY + w * 0.05)}" width="${f(w * 0.13)}" height="${f(w * 0.05)}" rx="1.5"/>` +
    win(x + w * 0.24) +
    win(x + w * 0.76) +
    `<rect class="door" x="${f(x + w * 0.43)}" y="${f(eave + hw * 0.3)}" width="${f(w * 0.14)}" height="${f(hw * 0.72)}"/>` +
    `<circle class="smoke m0" cx="${f(x + w * 0.72)}" cy="${f(ridgeY - w * 0.02)}" r="${f(w * 0.06)}"/>` +
    `<circle class="smoke m1" cx="${f(x + w * 0.68)}" cy="${f(ridgeY - w * 0.17)}" r="${f(w * 0.085)}"/>` +
    `<circle class="smoke m2" cx="${f(x + w * 0.75)}" cy="${f(ridgeY - w * 0.36)}" r="${f(w * 0.11)}"/>`
  )
}

// ---- The corners ----------------------------------------------------------
// Each grove stands on its own soft drift, so on a narrow or wide window the
// whole corner moves in as one piece. No rim lines: the drifts fade in from
// above, so nothing draws a line through the foot text. The right grove
// stands high enough that the status text sits on open snow below it.
const groveLeft =
  `<path class="drift back" d="M-80 1000V940C-10 926 70 932 150 942C220 950 280 956 340 966C380 972 420 984 450 1000Z"/>` +
  backTree(22, 950, 250, 0.9) +
  tree(266, 930, 184, 0.8) +
  `<g transform="translate(222 0)">${cottage(0, 958, 50)}</g>` +
  tree(108, 954, 375) +
  `<path class="drift" d="M-80 1000V966C0 954 90 958 170 966C240 972 300 972 360 980C400 985 430 992 450 1000Z"/>`
const groveRight =
  `<path class="drift back" d="M1680 1000V936C1620 926 1550 930 1480 940C1420 948 1360 958 1300 974C1270 982 1250 992 1240 1000Z"/>` +
  backTree(1543, 938, 236, 0.78, 0.05) +
  tree(1478, 948, 352, 0.98, 0.05) +
  tree(1376, 954, 196, 1, 0.05) +
  `<path class="drift" d="M1680 1000V950C1610 942 1540 946 1470 954C1410 960 1360 968 1310 984C1290 990 1275 995 1268 1000Z"/>`

// A low, soft band of snow along the whole foot, under the message box, so the
// two drifts read as one snowy ground.
const GROUND = `<path class="drift low" d="M-400 1000V990C-100 984 200 992 500 988C800 984 1100 992 1400 987C1600 984 1800 988 2000 990V1000Z"/>`

// ---- The night sky ----------------------------------------------------------
// Dark mode only: a sparse scatter of dim stars at the sides, none over the
// reading column (x 320-1413 at 1440 by 900) or the moon.
let stars = ''
for (let i = 0; i < 30; i++) {
  const left = rnd() < 0.5
  const x = left ? between(6, 300) : between(1424, 1594)
  const y = left ? between(380, 560) : between(290, 560)
  if (!left && Math.hypot(x - 1530, y - 215) < 120) continue
  const tw = rnd() < 0.5 ? ` k${i % 3}` : ''
  stars += `<circle class="st${tw}" cx="${f(x)}" cy="${f(y)}" r="${f(rnd() < 0.15 ? 1.4 : between(0.6, 1))}" opacity="${between(0.3, 0.6).toFixed(2)}"/>`
}

// ---- Snow -----------------------------------------------------------------
// Three depths: far flakes small, faint and slow; near ones larger and
// quicker; a few soft out-of-focus flakes at the edges. Near flakes keep to
// the sides. Flakes drawn over the reading column get the class rc, which
// rests almost invisible; those just left of it get ew, which does the same
// on wide windows (where the column reaches further left in scene units).
// The motion rules give both their opacity back.
type Layer = { n: number; r: [number, number]; o: [number, number]; s: [number, number]; cls: string; edge: number }
const LAYERS: Layer[] = [
  { n: 52, r: [0.9, 1.6], o: [0.35, 0.55], s: [28, 38], cls: 'fl far', edge: 0.3 },
  { n: 30, r: [1.8, 2.8], o: [0.5, 0.75], s: [19, 26], cls: 'fl mid', edge: 0.6 },
  { n: 14, r: [3.2, 4.6], o: [0.7, 0.9], s: [13, 17], cls: 'fl near', edge: 1 },
  { n: 8, r: [9, 15], o: [0.35, 0.55], s: [16, 22], cls: 'bok', edge: 1 },
]
const edgeX = (): number => (rnd() < 0.5 ? rnd() * 300 : 1420 + rnd() * 180)
let flakeRules = ''
let flakes = ''
let fi = 0
for (const L of LAYERS) {
  for (let i = 0; i < L.n; i++, fi++) {
    const x = rnd() < L.edge ? edgeX() : rnd() * 1600
    const y = 70 + rnd() * 880
    const r = L.r[0] + rnd() * (L.r[1] - L.r[0])
    const o = L.o[0] + rnd() * (L.o[1] - L.o[0])
    const dur = L.s[0] + rnd() * (L.s[1] - L.s[0])
    const sway = -50 + rnd() * 100
    const reading = x > 312 && x < 1420 && y < 975
    const early = x > 180 && x <= 312 && y < 975
    flakeRules += `.s${fi}{--y:${g(-y - 30)}px;--x:${g(sway)}px;animation:fall ${g(dur)}s linear ${g(-rnd() * dur)}s infinite${reading || early ? `;opacity:${o.toFixed(2)}` : ''}}`
    const fill = L.cls === 'bok' ? ' fill="url(#bk)"' : ''
    flakes += `<circle class="${L.cls}${reading ? ' rc' : early ? ' ew' : ''} s${fi}" cx="${g(x)}" cy="${g(y)}" r="${f(r)}" opacity="${o.toFixed(2)}"${fill}/>`
  }
}

// ---- The moon and the sleigh ------------------------------------------------
// The moon sits in the open sky right of the reading column, below the
// header and the first message. The sleigh and team (drawn facing right at
// about 210 by 80, flipped here to fly right to left, small) rest silhouetted
// across it; in motion they glide in from the right edge, cross the moon and
// fade out before they reach the column.
const MX = 1530
const MY = 215
const MR = 44
const deer = (x: number, y: number, stride: number): string =>
  `<g transform="translate(${x} ${y})"><ellipse class="sil" cx="0" cy="0" rx="15" ry="6.2"/><path class="sil" d="M9-2.5C13-8 15-13 17.5-16.5L24-16.8C26.4-16.6 26.4-13.6 24-12.6L19.6-11.5C17.4-8 14.6-2 12.4 2.6Z"/><path class="line" d="M18-16.5L15-27M16.2-21.5L11.4-24.6M16.8-24.6L13.6-29.6M20.4-16.6L22-27M21.2-21.6L26-25.2M10 3L${18 + stride} 7.5L${24 + stride} 6M7.6 4L${13 + stride} 10.6L${19 + stride} 11.6M-10 2.6L${-19 - stride} 7L${-25 - stride} 5M-8 4.2L${-14 - stride} 10.4L${-21 - stride} 10.6M-14-2.6L-18.6-6.4"/></g>`
const SLEIGH =
  `<path class="sil" d="M2 10C-2 10-3 15-1 20L6 38C8 43 12 45 19 45L58 45C66 45 72 40 74 33C75 29 78 27 82 29C80 22 72 23 68 30L66 32L24 32C19 32 17 28 17 22C17 14 10 10 2 10Z"/>` +
  `<path class="line" d="M-6 53L68 53C80 53 88 47 86 39C85 35 81 34 79 37M14 45L14 53M54 45L54 53"/>` +
  `<circle class="sil" cx="10" cy="14" r="11"/><path class="sil" d="M24 32C22 18 28 8 38 8C46 8 50 16 50 32Z"/><circle class="sil" cx="40" cy="4" r="6.4"/><path class="sil" d="M34 1C36-8 42-12 48-10C44-8 44-4 46 0Z"/>` +
  `<path class="line thin" d="M48 22L120 18L180 12"/>` +
  deer(120, 18, 0) +
  deer(180, 12, 3)
const crater = (dx: number, dy: number, r: number): string =>
  `<circle class="crat" cx="${MX + dx}" cy="${MY + dy}" r="${r}" fill="url(#cra)"/>`
const MOON =
  `<circle cx="${MX}" cy="${MY}" r="170" fill="url(#mGlow)"/>` +
  `<circle class="ring" cx="${MX}" cy="${MY}" r="${MR * 2.1}" fill="url(#mGlow)"/>` +
  `<circle cx="${MX}" cy="${MY}" r="${MR}" fill="url(#mDisc)"/>` +
  crater(-14, -12, 11) +
  crater(14, 7, 7.5) +
  crater(-5, 19, 6) +
  crater(19, -16, 4.5) +
  crater(-25, 7, 5) +
  `<g class="sleigh"><g transform="translate(${MX - 3} ${MY + 4}) scale(-.38 .38) translate(-100 -10)"><g class="team">${SLEIGH}</g></g></g>`

// ---- Placement --------------------------------------------------------------
// A media rule reads the scene's own box. On a narrow one the sides are cut
// away, so each grove slides in from its side and shrinks a little, and the
// moon (with its sleigh) steps in, then goes once the reading column would
// reach it. On a wide one the top and foot are cut, so the lights, moon and
// sky come down and the groves come up; the lights shrink back to the size
// they have at 16:10, since the crop would enlarge them.
const narrow: [string, number, number][] = [
  ['3/2', 55, 1],
  ['4/3', 135, 0.95],
  ['6/5', 205, 0.92],
  ['21/20', 280, 0.88],
  ['9/10', 345, 0.84],
  ['4/5', 400, 0.8],
  ['7/10', 450, 0.75],
  ['3/5', 500, 0.7],
  ['1/2', 550, 0.64],
]
const wide: [string, number, number, number][] = [
  ['17/10', 45, 0.92, 0.94],
  ['19/10', 100, 0.84, 0.84],
  ['11/5', 155, 0.75, 0.73],
  ['5/2', 200, 0.66, 0.64],
  ['14/5', 240, 0.6, 0.57],
  ['16/5', 280, 0.54, 0.5],
]
let placement = ''
for (const [ratio, dx, k] of narrow) {
  placement += `@media (max-aspect-ratio: ${ratio}){.cl{transform:translate(${dx}px,0) scale(${k})}.cr{transform:translate(${-dx}px,0) scale(${k * 0.92})}.gl{transform:translate(${dx}px,0)}.gr{transform:translate(${-dx}px,0)}}`
}
placement += `@media (max-aspect-ratio: 3/2){.mo{transform:translate(-34px,0) scale(.9)}}@media (max-aspect-ratio: 7/5){.mo{display:none}}`
for (const [ratio, dy, k, lk] of wide) {
  placement += `@media (min-aspect-ratio: ${ratio}){.cl{transform:translate(0,${-dy}px) scale(${k})}.cr{transform:translate(0,${-dy}px) scale(${k})}.T{transform:translate(0,${dy}px)}.B{transform:translate(0,${-dy}px)}.L{transform:scale(${lk})}}`
}

const grad = (id: string, c: string): string =>
  `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity=".9"/><stop offset=".3" stop-color="${c}" stop-opacity=".4"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`
const field = (id: string, c: string): string =>
  `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="1"/><stop offset=".7" stop-color="${c}" stop-opacity="0"/></radialGradient>`

export const CHRISTMAS_SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
${field('fG', '#1f9d5c')}${field('fR', '#c8303e')}${field('fB', '#3f86c8')}${field('fW', '#e8b54a')}
${grad('gR', '#ff4d5e')}${grad('gY', '#ffc23d')}${grad('gG', '#3fd17f')}${grad('gB', '#6cb8ff')}
<radialGradient id="bk"><stop offset="0" class="bk0" stop-opacity=".9"/><stop offset=".55" class="bk0" stop-opacity=".45"/><stop offset="1" class="bk0" stop-opacity="0"/></radialGradient>
<radialGradient id="warm"><stop offset="0" stop-color="#ffc56a" stop-opacity=".9"/><stop offset=".35" stop-color="#ffb04a" stop-opacity=".35"/><stop offset="1" stop-color="#ff9a3a" stop-opacity="0"/></radialGradient>
<radialGradient id="mDisc" cx=".42" cy=".38" r=".66"><stop offset="0" class="md0"/><stop offset=".7" class="md1"/><stop offset="1" class="md2"/></radialGradient>
<radialGradient id="mGlow"><stop offset="0" class="mg0"/><stop offset=".35" class="mg1"/><stop offset="1" class="mg2"/></radialGradient>
<radialGradient id="cra" cx=".45" cy=".42"><stop offset="0" class="q0"/><stop offset=".7" class="q1"/><stop offset="1" class="q2"/></radialGradient>
<linearGradient id="pineL" x1=".75" y1="0" x2=".2" y2="1"><stop offset="0" stop-color="#003d16"/><stop offset="1" stop-color="#077a32"/></linearGradient>
<linearGradient id="pineD" x1=".75" y1="0" x2=".2" y2="1"><stop offset="0" stop-color="#0b2918"/><stop offset="1" stop-color="#1b5233"/></linearGradient>
<linearGradient id="pineLb" x1=".75" y1="0" x2=".2" y2="1"><stop offset="0" stop-color="#123f37"/><stop offset="1" stop-color="#2b6858"/></linearGradient>
<linearGradient id="pineDb" x1=".75" y1="0" x2=".2" y2="1"><stop offset="0" stop-color="#081d16"/><stop offset="1" stop-color="#103425"/></linearGradient>
<linearGradient id="driftL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset=".22" stop-color="#ffffff" stop-opacity=".85"/><stop offset=".5" stop-color="#eef3f6"/><stop offset="1" stop-color="#d6e1e9"/></linearGradient>
<linearGradient id="driftD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9d8e2" stop-opacity="0"/><stop offset=".25" stop-color="#c9d8e2" stop-opacity=".3"/><stop offset=".6" stop-color="#9fb4c2" stop-opacity=".16"/><stop offset="1" stop-color="#9fb4c2" stop-opacity=".1"/></linearGradient>
${bulbDef('R')}${bulbDef('Y')}${bulbDef('G')}${bulbDef('B')}
</defs>
<style>
.f1{opacity:.16}.f2{opacity:.08}.f3{opacity:.16}.f4{opacity:.14}
.cR{fill:#d01f35}.cY{fill:#e09a0c}.cG{fill:#17914a}.cB{fill:#2a7cd0}
.halo{opacity:.3;--h:.3}.bh{opacity:.22}.hi{fill:#ffffff;opacity:.7}.cap{fill:#5d6a61}
.L{opacity:.82;transform-origin:800px 0}.Lx{display:none}
.wire{stroke:#2b4135;opacity:.6;stroke-width:1;fill:none}
.pine{fill:url(#pineL)}.trunk{fill:#5e4330}.bsnow{fill:#ffffff}
.back .pine{fill:url(#pineLb)}.back .trunk{fill:#6f5a4a}
.garl{fill:none;stroke:#c9962a;stroke-width:1.2;opacity:.7}
.star{fill:#e2a51c}.sglow{opacity:.42}
.drift{fill:url(#driftL)}.drift.back{opacity:.75}
.fl{fill:#9fb5c6}.bk0{stop-color:#a9bfcf}.rc{opacity:.06}@media (min-aspect-ratio: 17/10){.ew{opacity:.06}.Lx{display:inline}}
.md0{stop-color:#fff4d6}.md1{stop-color:#ffd88c}.md2{stop-color:#f6b257}
.mg0{stop-color:#ffc96a;stop-opacity:.6}.mg1{stop-color:#ffcf7a;stop-opacity:.24}.mg2{stop-color:#ffd88a;stop-opacity:0}
.ring{opacity:.9}.crat{display:none}.q0{stop-color:#b8ae94;stop-opacity:.5}.q1{stop-color:#b8ae94;stop-opacity:.25}.q2{stop-color:#b8ae94;stop-opacity:0}
.st{display:none}
.sil{fill:#26342c}.line{stroke:#26342c;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;fill:none}.thin{stroke-width:1.2}
.sleigh{opacity:.82}
.wall{fill:#8f6a5c}.roof{fill:#6b4e44}.chim{fill:#7a5c50}.door{fill:#5e443b}.rsnow{fill:#ffffff}
.win{fill:#f2bd68}.mull{stroke:#8f6a5c;stroke-width:1}
.wglow{fill:url(#warm);opacity:.4}.spill{fill:url(#warm);opacity:.22}
.smoke{fill:#ffffff;opacity:.5}.m1{opacity:.34}.m2{opacity:.2}
@media (prefers-color-scheme: dark){
.f1{opacity:.22}.f2{opacity:.08}.f3{opacity:.2}.f4{opacity:.08}
.cR{fill:#ff6b78}.cY{fill:#ffd261}.cG{fill:#5fe39a}.cB{fill:#8fd0ff}
.halo{opacity:.6;--h:.6}.cap{fill:#8d9a90}
.L{opacity:.68}.bh{opacity:.4}
.wire{stroke:#93a397;opacity:.45}
.pine{fill:url(#pineD)}.trunk{fill:#2e2016}.bsnow{fill:#c9d3d6;opacity:.85}
.back{opacity:.85}.back .pine{fill:url(#pineDb)}.back .trunk{fill:#21180f}.back .bsnow{opacity:.6}
.garl{stroke:#d9ab45;opacity:.55}.star{fill:#f4c64a}.sglow{opacity:.5}
.drift{fill:url(#driftD)}.drift.back{opacity:.7}
.fl{fill:#f4f8fb}.bk0{stop-color:#ffffff}
.md0{stop-color:#fdf9ee}.md1{stop-color:#ece6d4}.md2{stop-color:#cfc8b2}
.mg0{stop-color:#c9d6ee;stop-opacity:.3}.mg1{stop-color:#c9d6ee;stop-opacity:.1}.mg2{stop-color:#c9d6ee;stop-opacity:0}
.ring{opacity:.8}.crat{display:inline}
.st{display:inline;fill:#e8edf7}
.sil{fill:#08120d}.line{stroke:#08120d}.sleigh{opacity:.92}
.wall{fill:#1c2621}.roof{fill:#121a16}.chim{fill:#25302a}.door{fill:#0e1411}.rsnow{fill:#c9d6de}
.win{fill:#ffc86b}.mull{stroke:#1c2621}
.wglow{opacity:.75}.spill{opacity:.4}
.smoke{fill:#8a98a6;opacity:.3}.m1{opacity:.2}.m2{opacity:.12}
}
.f1,.f2,.f3,.f4{transform-box:fill-box;transform-origin:center}
.cl{transform-origin:0 1000px}.cr{transform-origin:1600px 1000px}.mo{transform-origin:${MX}px ${MY}px}
${placement}
@media (prefers-reduced-motion: no-preference){
.f1,.f2,.f3,.f4,.sleigh{will-change:transform}
@keyframes d1{50%{transform:translate(110px,70px) scale(1.1)}}
@keyframes d2{50%{transform:translate(-120px,80px) scale(1.08)}}
@keyframes d3{50%{transform:translate(90px,-80px) scale(1.12)}}
@keyframes d4{50%{transform:translate(-100px,-60px) scale(1.1)}}
@keyframes fall{from{transform:translate(0,var(--y))}to{transform:translate(var(--x),calc(var(--y) + 1080px))}}
@keyframes twinkle{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes hglow{0%,100%{opacity:var(--h)}50%{opacity:calc(var(--h) * .45)}}
@keyframes starglow{0%,100%{opacity:.32}50%{opacity:.6}}
@keyframes glint{0%,100%{opacity:.55}50%{opacity:.22}}
@keyframes fly{0%{transform:translate(118px,26px);opacity:0}5%{opacity:1}10%{transform:translate(0,0)}14%{opacity:1}20%{transform:translate(-40px,-12px);opacity:0}100%{transform:translate(-40px,-12px);opacity:0}}
@keyframes bob{50%{transform:translateY(-8px)}}
@keyframes rise{0%{transform:translate(0,0) scale(.7);opacity:0}20%{opacity:.4}100%{transform:translate(8px,-26px) scale(1.6);opacity:0}}
.f1{animation:d1 34s ease-in-out infinite}
.f2{animation:d2 40s ease-in-out infinite}
.f3{animation:d3 37s ease-in-out infinite}
.f4{animation:d4 44s ease-in-out infinite}
.tw{animation:twinkle 4.4s ease-in-out infinite}.th{animation:hglow 4.4s ease-in-out infinite}
.t1{animation-duration:5.2s;animation-delay:-1.3s}.t2{animation-duration:3.8s;animation-delay:-2.1s}.t3{animation-duration:6s;animation-delay:-3.6s}
.sglow{animation:starglow 5.5s ease-in-out infinite}.p1{animation-duration:4.4s;animation-delay:-2s}.p2{animation-duration:6.8s;animation-delay:-4s}
.k0{animation:glint 5.4s ease-in-out infinite}.k1{animation:glint 7s ease-in-out -2.5s infinite}.k2{animation:glint 8.2s ease-in-out -5s infinite}
.smoke{transform-box:fill-box;transform-origin:center;animation:rise 9s ease-out infinite}.m1{animation-delay:-3s}.m2{animation-delay:-6s}
.sleigh{animation:fly 50s ease-in-out 0s infinite}
.team{animation:bob 4.6s ease-in-out infinite}
${flakeRules}
}
</style>
<g class="T"><g class="gl"><ellipse class="f1" cx="180" cy="60" rx="620" ry="460" fill="url(#fG)"/></g></g>
<g class="T"><g class="gr"><ellipse class="f2" cx="1500" cy="60" rx="520" ry="380" fill="url(#fR)"/></g></g>
<g class="cl"><ellipse class="f3" cx="110" cy="900" rx="560" ry="420" fill="url(#fG)"/><ellipse class="f4" cx="170" cy="760" rx="260" ry="220" fill="url(#fW)"/></g>
<g class="cr"><ellipse class="f3" cx="1500" cy="900" rx="560" ry="420" fill="url(#fB)"/><ellipse class="f4" cx="1500" cy="760" rx="260" ry="220" fill="url(#fW)"/></g>
<g class="T">${stars}<g class="mo">${MOON}</g></g>
${flakes}
<g class="B">${GROUND}</g>
<g class="cl">${groveLeft}</g>
<g class="cr">${groveRight}</g>
<g class="T"><g class="L"><g id="lS"><path class="wire" d="${wire}"/>${lights}</g><use class="Lx" href="#lS" transform="matrix(-1 0 0 1 -600 0)"/><use class="Lx" href="#lS" transform="matrix(-1 0 0 1 3960 0)"/></g></g>
</svg>`
