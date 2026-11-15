// The dashboard's colour field (body::before): four soft radial glows in the
// accent blue, purple, green and amber, here drifting very slowly, with one
// "ok" status dot breathing near the top-right corner. No canvas rect: the app's
// own surface-0 shows through, so the field suits light and dark alike.
// All motion sits behind prefers-reduced-motion: no-preference, as on the dashboard.
export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<defs>
<radialGradient id="f1"><stop offset="0" stop-color="#0a6cff" stop-opacity="1"/><stop offset="0.7" stop-color="#0a6cff" stop-opacity="0"/></radialGradient>
<radialGradient id="f2"><stop offset="0" stop-color="#af52de" stop-opacity="1"/><stop offset="0.7" stop-color="#af52de" stop-opacity="0"/></radialGradient>
<radialGradient id="f3"><stop class="ok" offset="0" stop-color="#34c759" stop-opacity="1"/><stop class="ok" offset="0.7" stop-color="#34c759" stop-opacity="0"/></radialGradient>
<radialGradient id="f4"><stop offset="0" stop-color="#ff9f0a" stop-opacity="1"/><stop offset="0.7" stop-color="#ff9f0a" stop-opacity="0"/></radialGradient>
<radialGradient id="halo"><stop class="ok" offset="0" stop-color="#34c759" stop-opacity="0.8"/><stop class="ok" offset="1" stop-color="#34c759" stop-opacity="0"/></radialGradient>
<linearGradient id="sheen"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="1"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
</defs>
<style>
.b1{opacity:.28}.b2{opacity:.23}.b3{opacity:.20}.b4{opacity:.15}
@media (prefers-color-scheme: dark){.b1{opacity:.46}.b2{opacity:.38}.b3{opacity:.26}.b4{opacity:.18}.ok{stop-color:#30d158}.okdot{fill:#30d158}}
.b1,.b2,.b3,.b4,.halo,.sheen{transform-box:fill-box;transform-origin:center}
.halo{opacity:.7}
.sheen{opacity:0}
/* A media rule reads the scene's own box: on a narrow or tall one, pull the glows and the dot in from the cropped sides. */
@media (max-aspect-ratio: 13/10){.status{transform:translate(-400px,0)}}
@media (min-aspect-ratio: 2/1){.status{transform:translate(0,200px)}}
@media (max-aspect-ratio: 1/1){.left{transform:translate(250px,0)}.right{transform:translate(-250px,0)}}
@media (prefers-reduced-motion: no-preference){
.b1,.b2,.b3,.b4,.halo,.sheen{will-change:transform}
@keyframes d1{50%{transform:translate(190px,120px) scale(1.18)}}
@keyframes d2{50%{transform:translate(-210px,130px) scale(1.15)}}
@keyframes d3{50%{transform:translate(-180px,-140px) scale(1.2)}}
@keyframes d4{50%{transform:translate(160px,-110px) scale(1.14)}}
@keyframes pulse{50%{transform:scale(2.3);opacity:.12}}
@keyframes sweep{0%{transform:translateX(-900px);opacity:0}12%{opacity:.16}30%{transform:translateX(2300px);opacity:0}100%{transform:translateX(2300px);opacity:0}}
.b1{animation:d1 20s ease-in-out infinite}
.b2{animation:d2 26s ease-in-out infinite}
.b3{animation:d3 23s ease-in-out infinite}
.b4{animation:d4 29s ease-in-out infinite}
.halo{animation:pulse 2.2s ease-in-out infinite}
.sheen{animation:sweep 16s ease-in-out infinite}
}
</style>
<g class="left"><ellipse class="b1" cx="192" cy="80" rx="640" ry="540" fill="url(#f1)"/></g>
<g class="right"><ellipse class="b2" cx="1472" cy="140" rx="610" ry="480" fill="url(#f2)"/></g>
<g class="right"><ellipse class="b3" cx="1248" cy="920" rx="700" ry="580" fill="url(#f3)"/></g>
<g class="left"><ellipse class="b4" cx="96" cy="860" rx="540" ry="450" fill="url(#f4)"/></g>
<g transform="skewX(-18)"><rect class="sheen" x="0" y="-200" width="420" height="1400" fill="url(#sheen)"/></g>
<g class="status">
<circle class="halo" cx="1380" cy="72" r="70" fill="url(#halo)"/>
<circle class="okdot" cx="1380" cy="72" r="16" fill="#34c759"/>
</g>
</svg>`
