// Christmas: evergreen, cranberry and gold glows drifting slowly, light snow,
// a string of twinkling lights along the top, pine trees with glowing bulbs in
// the lower corners, and a sleigh that crosses the sky now and then.
// All motion sits behind prefers-reduced-motion: no-preference; without it the
// snow hangs still and the sleigh rests in the sky.

// A small fixed-seed generator, so the scene is the same on every load.
let seed = 20261225
const rnd = (): number => {
  seed = (seed * 1664525 + 1013904223) % 4294967296

  return seed / 4294967296
}
const fixed = (n: number): string => n.toFixed(1)
const BULBS = ['#e5505c', '#f0b93a', '#3fbf74', '#7dbfe8']

// Snow: each flake falls from just above the top to just below the foot.
const FLAKES = 46
let flakeRules = ''
let flakes = ''
for (let i = 0; i < FLAKES; i++) {
  const x = rnd() * 1600
  const y = rnd() * 1000
  const r = 1.6 + rnd() * 3.2
  const duration = 14 + rnd() * 16
  const delay = -rnd() * duration
  const sway = -40 + rnd() * 80
  flakeRules += `.s${i}{--y:${fixed(-y - 20)}px;--x:${fixed(sway)}px;animation:fall ${fixed(duration)}s linear ${fixed(delay)}s infinite}`
  flakes += `<circle class="fl s${i}" cx="${fixed(x)}" cy="${fixed(y)}" r="${fixed(r)}" opacity="${(0.35 + rnd() * 0.45).toFixed(2)}"/>`
}

// The string of lights along the top.
let lights = ''
let wire = 'M -20 14'
for (let i = 0; i <= 20; i++) {
  const x = i * 81
  const y = 30 + (i % 2 === 0 ? 0 : 16)
  const colour = BULBS[i % BULBS.length]
  wire += ` Q ${x - 40} ${y + 14} ${x} ${y - 8}`
  lights += `<circle class="glow t${i % 4}" cx="${x}" cy="${y}" r="22" fill="${colour}"/><circle class="bulb t${i % 4}" cx="${x}" cy="${y}" r="5.5" fill="${colour}"/>`
}

// A pine: three tiers, a trunk, a gold star and bulbs that glow in turn.
const tree = (cx: number, h: number): string => {
  const top = 1000 - h
  let out = `<rect class="trunk" x="${fixed(cx - h * 0.035)}" y="${fixed(1000 - h * 0.12)}" width="${fixed(h * 0.07)}" height="${fixed(h * 0.12)}"/>`
  let bulbs = ''
  for (let k = 0; k < 3; k++) {
    const y0 = top + k * h * 0.2
    const y1 = y0 + h * 0.46
    const half = h * (0.15 + 0.085 * k)
    out += `<polygon class="pine" points="${fixed(cx)},${fixed(y0)} ${fixed(cx + half)},${fixed(y1)} ${fixed(cx - half)},${fixed(y1)}"/>`
    for (let b = 0; b < 2 + k; b++) {
      const t = 0.45 + rnd() * 0.45
      const bx = cx + (rnd() * 2 - 1) * half * t * 0.8
      const by = y0 + (y1 - y0) * t
      const n = Math.floor(rnd() * 4)
      bulbs += `<circle class="glow t${n}" cx="${fixed(bx)}" cy="${fixed(by)}" r="${fixed(h * 0.05)}" fill="${BULBS[n]}"/><circle class="bulb t${n}" cx="${fixed(bx)}" cy="${fixed(by)}" r="${fixed(h * 0.016)}" fill="${BULBS[n]}"/>`
    }
  }
  const s = h * 0.045

  return `${out}${bulbs}<circle class="glow t1" cx="${fixed(cx)}" cy="${fixed(top)}" r="${fixed(s * 2.4)}" fill="#f0b93a"/><polygon class="bulb t1" fill="#f0b93a" points="${fixed(cx)},${fixed(top - s)} ${fixed(cx + s * 0.3)},${fixed(top - s * 0.3)} ${fixed(cx + s)},${fixed(top)} ${fixed(cx + s * 0.3)},${fixed(top + s * 0.3)} ${fixed(cx)},${fixed(top + s)} ${fixed(cx - s * 0.3)},${fixed(top + s * 0.3)} ${fixed(cx - s)},${fixed(top)} ${fixed(cx - s * 0.3)},${fixed(top - s * 0.3)}"/>`
}
const treesLeft = tree(60, 250) + tree(190, 340) + tree(320, 220)
const treesRight = tree(1290, 230) + tree(1420, 350) + tree(1550, 260)

export const CHRISTMAS_SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
<radialGradient id="g1"><stop offset="0" stop-color="#1f9d5c" stop-opacity="1"/><stop offset="0.7" stop-color="#1f9d5c" stop-opacity="0"/></radialGradient>
<radialGradient id="g2"><stop offset="0" stop-color="#d0343f" stop-opacity="1"/><stop offset="0.7" stop-color="#d0343f" stop-opacity="0"/></radialGradient>
<radialGradient id="g3"><stop offset="0" stop-color="#e0a92a" stop-opacity="1"/><stop offset="0.7" stop-color="#e0a92a" stop-opacity="0"/></radialGradient>
<g id="deer">
<ellipse class="sil" cx="0" cy="26" rx="17" ry="7.5"/>
<path class="sil" d="M11 23 L21 8 L30 6 L33 10 L25 13 L19 29 Z"/>
<path class="line" d="M24 7 L22 -5 M22 -1 L17 -6 M23 2 L29 -4 M-12 30 L-23 43 M-6 32 L-9 47 M8 32 L17 45 M13 29 L27 37 M-17 24 L-22 20"/>
</g>
</defs>
<style>
.b1{opacity:.26}.b2{opacity:.20}.b3{opacity:.16}.b4{opacity:.20}
.fl{fill:#8fa9bd}
.glow{opacity:.16}.bulb{opacity:.9}.wire{stroke:#3f4f46;opacity:.45}
.pine{fill:#2f6b4a;opacity:.55}.trunk{fill:#6b4a2f;opacity:.55}
.sil{fill:#3f4f46}.line{stroke:#3f4f46;stroke-width:2.4;stroke-linecap:round;fill:none}
.sleigh{opacity:.5;transform:translate(860px,120px) rotate(-3deg)}
.nose{fill:#e5505c}
@media (prefers-color-scheme: dark){
.b1{opacity:.42}.b2{opacity:.34}.b3{opacity:.24}.b4{opacity:.30}.fl{fill:#ffffff}.wire{stroke:#a0a696;opacity:.35}.glow{opacity:.22}
.pine{fill:#12452b;opacity:.85}.trunk{fill:#3a2616;opacity:.85}
.sil{fill:#f5f0e4}.line{stroke:#f5f0e4}.sleigh{opacity:.6}
}
.b1,.b2,.b3,.b4{transform-box:fill-box;transform-origin:center}
/* A media rule reads the scene's own box: on a narrow or tall one, pull the glows and trees in from the cropped sides; on a very wide one, lift the trees and drop the lights. */
@media (max-aspect-ratio: 13/10){.treesL{transform:translate(170px,0)}.treesR{transform:translate(-170px,0)}}
@media (max-aspect-ratio: 1/1){.left{transform:translate(250px,0)}.right{transform:translate(-250px,0)}.treesL{transform:translate(480px,0) scale(.8)}.treesR{transform:translate(-160px,0) scale(.8)}}
@media (min-aspect-ratio: 2/1){.string,.sky{transform:translate(0,190px)}.treesL,.treesR{transform:translate(0,-190px)}}
.treesL,.treesR{transform-origin:800px 1000px}
@media (prefers-reduced-motion: no-preference){
.b1,.b2,.b3,.b4,.fl,.sleigh{will-change:transform}
@keyframes d1{50%{transform:translate(170px,110px) scale(1.16)}}
@keyframes d2{50%{transform:translate(-190px,120px) scale(1.14)}}
@keyframes d3{50%{transform:translate(-160px,-130px) scale(1.18)}}
@keyframes d4{50%{transform:translate(150px,-100px) scale(1.12)}}
@keyframes fall{from{transform:translate(0,var(--y))}to{transform:translate(var(--x),calc(var(--y) + 1060px))}}
@keyframes twinkle{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes shine{0%,100%{opacity:.06}50%{opacity:.36}}
@keyframes fly{0%{transform:translate(-360px,140px) rotate(-4deg)}30%{transform:translate(1900px,105px) rotate(-2deg)}100%{transform:translate(1900px,105px) rotate(-2deg)}}
@keyframes bob{50%{transform:translateY(-7px)}}
.b1{animation:d1 22s ease-in-out infinite}
.b2{animation:d2 27s ease-in-out infinite}
.b3{animation:d3 24s ease-in-out infinite}
.b4{animation:d4 30s ease-in-out infinite}
.bulb{animation:twinkle 3.2s ease-in-out infinite}
.glow{animation:shine 3.2s ease-in-out infinite}
.t1{animation-delay:-.8s}.t2{animation-delay:-1.6s}.t3{animation-delay:-2.4s}
.sleigh{animation:fly 36s linear infinite}
.team{animation:bob 1.1s ease-in-out infinite}
${flakeRules}
}
</style>
<g class="left"><ellipse class="b1" cx="192" cy="80" rx="640" ry="540" fill="url(#g1)"/></g>
<g class="right"><ellipse class="b2" cx="1472" cy="140" rx="610" ry="480" fill="url(#g2)"/></g>
<g class="right"><ellipse class="b3" cx="1248" cy="920" rx="700" ry="580" fill="url(#g3)"/></g>
<g class="left"><ellipse class="b4" cx="96" cy="860" rx="540" ry="450" fill="url(#g1)"/></g>
<g class="sky"><g class="sleigh"><g class="team">
<path class="sil" d="M4 16 C4 34 14 40 30 40 L58 40 C68 40 72 32 72 24 L72 8 C66 13 60 22 50 24 L22 24 C14 24 12 14 4 8 Z"/>
<path class="line" d="M0 50 L66 50 C76 50 81 44 79 37 M20 40 L20 50 M54 40 L54 50 M72 18 L128 22 L196 22"/>
<circle class="sil" cx="24" cy="15" r="12"/><circle class="sil" cx="46" cy="12" r="7"/><path class="sil" d="M40 8 L47 -6 L54 7 Z"/>
<use href="#deer" x="128" y="0"/><use href="#deer" x="196" y="-4"/>
<circle class="nose" cx="229" cy="5" r="3"/>
</g></g></g>
${flakes}
<g class="treesL">${treesLeft}</g>
<g class="treesR">${treesRight}</g>
<g class="string"><path class="wire" d="${wire}" fill="none" stroke-width="1.5"/>${lights}</g>
</svg>`
