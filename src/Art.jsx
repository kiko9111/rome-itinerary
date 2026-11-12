// Hand-drawn SVG illustrations of each kind of place, painted for the time of day you'll be there.
// viewBox is 400 x 160; ground line at y = 140.

const PALETTES = {
  day: { sky1: '#8fc0e3', sky2: '#f4e5c8', body: '#d2b48a', shade: '#a98457', lit: '#7a5a38', ground: '#b99a6e', water: '#6fa7c9', glow: null, sun: '#fff3c4' },
  dusk: { sky1: '#34406f', sky2: '#f39a5f', body: '#45334a', shade: '#2e2235', lit: '#f8c56d', ground: '#2a1f30', water: '#c9785a', glow: '#f8c56d', sun: '#ffd27a' },
  night: { sky1: '#0b1230', sky2: '#34407a', body: '#3a3f5c', shade: '#262a44', lit: '#ffcf6e', ground: '#0f1226', water: '#28407a', glow: '#ffcf6e', sun: '#f2f0e0' },
}

const STARS = [[30, 18], [72, 40], [118, 12], [160, 30], [212, 16], [250, 44], [292, 22], [338, 36], [372, 12], [56, 66], [384, 58], [140, 54]]

function arches(x0, x1, y, h, w, gap, fill) {
  const out = []
  for (let x = x0; x + w <= x1; x += w + gap) {
    out.push(<path key={`${x}-${y}`} d={`M${x} ${y + h} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + h} Z`} fill={fill} />)
  }
  return out
}
function windows(x0, x1, y0, rows, cols, w, h, fill) {
  const out = []
  const stepX = (x1 - x0) / cols
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out.push(<rect key={`${r}-${c}`} x={x0 + c * stepX + (stepX - w) / 2} y={y0 + r * (h + 12)} width={w} height={h} rx="1.5" fill={fill} />)
    }
  }
  return out
}
function pine(x, base, s, c) {
  return (
    <g key={`pine-${x}`}>
      <path d={`M${x} ${base} C${x + 2 * s} ${base - 20 * s} ${x - 3 * s} ${base - 34 * s} ${x + 1 * s} ${base - 46 * s}`} stroke={c} strokeWidth={3 * s} fill="none" />
      <ellipse cx={x + 1 * s} cy={base - 50 * s} rx={30 * s} ry={9 * s} fill={c} />
      <ellipse cx={x - 10 * s} cy={base - 46 * s} rx={16 * s} ry={6 * s} fill={c} />
      <ellipse cx={x + 14 * s} cy={base - 47 * s} rx={18 * s} ry={6 * s} fill={c} />
    </g>
  )
}
function cypress(x, base, h, c) {
  return <path key={`cy-${x}`} d={`M${x} ${base} C${x - 7} ${base - h * 0.4} ${x - 4} ${base - h * 0.8} ${x} ${base - h} C${x + 4} ${base - h * 0.8} ${x + 7} ${base - h * 0.4} ${x} ${base} Z`} fill={c} />
}
function domeShape(cx, baseY, r, p, lanternColor) {
  return (
    <g>
      <rect x={cx - r * 0.9} y={baseY - 18} width={r * 1.8} height="18" fill={p.body} />
      {arches(cx - r * 0.8, cx + r * 0.8, baseY - 15, 12, 7, 6, p.lit)}
      <path d={`M${cx - r} ${baseY - 18} A${r} ${r * 1.05} 0 0 1 ${cx + r} ${baseY - 18} Z`} fill={p.body} />
      <path d={`M${cx - r * 0.5} ${baseY - 18 - r * 0.86} Q${cx} ${baseY - 18 - r * 1.1} ${cx + r * 0.5} ${baseY - 18 - r * 0.86}`} stroke={p.shade} fill="none" />
      <rect x={cx - 5} y={baseY - 18 - r * 1.05 - 14} width="10" height="14" fill={lanternColor || p.body} />
      <line x1={cx} y1={baseY - 18 - r * 1.05 - 14} x2={cx} y2={baseY - 18 - r * 1.05 - 26} stroke={p.body} strokeWidth="2" />
    </g>
  )
}

const DRAW = {
  dome: (p) => (
    <g>
      <rect x="40" y="112" width="320" height="28" fill={p.shade} />
      {Array.from({ length: 22 }, (_, i) => <rect key={i} x={46 + i * 14.4} y="114" width="5" height="26" fill={p.body} />)}
      <rect x="130" y="92" width="140" height="48" fill={p.body} />
      {windows(135, 265, 98, 2, 7, 8, 10, p.lit)}
      {domeShape(200, 92, 46, p)}
    </g>
  ),
  pantheon: (p) => (
    <g>
      <rect x="150" y="70" width="190" height="70" fill={p.shade} />
      <path d="M160 70 A95 36 0 0 1 330 70 Z" fill={p.shade} />
      <path d="M90 74 L190 46 L290 74 Z" fill={p.body} />
      <rect x="90" y="74" width="200" height="8" fill={p.body} />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={96 + i * 25} y="82" width="9" height="58" fill={p.body} />)}
      <rect x="180" y="96" width="20" height="44" fill={p.lit} opacity="0.85" />
    </g>
  ),
  colosseum: (p) => (
    <g>
      <path d="M30 140 V58 Q190 36 320 48 V62 L345 70 V88 L365 96 V140 Z" fill={p.body} />
      {arches(40, 318, 62, 16, 13, 9, p.lit)}
      {arches(40, 340, 88, 18, 13, 9, p.lit)}
      {arches(40, 360, 114, 22, 13, 9, p.lit)}
      <rect x="30" y="56" width="290" height="4" fill={p.shade} />
    </g>
  ),
  ruins: (p) => (
    <g>
      {[[70, 50], [100, 50], [130, 50], [250, 80], [282, 98], [314, 112]].map(([x, top], i) => (
        <g key={i}>
          <rect x={x - 2} y={top - 6} width="20" height="6" fill={p.body} />
          <rect x={x} y={top} width="16" height={140 - top} fill={p.body} />
          {[4, 8, 12].map((d) => <line key={d} x1={x + d} y1={top + 2} x2={x + d} y2="140" stroke={p.shade} strokeWidth="1" />)}
        </g>
      ))}
      <rect x="62" y="34" width="94" height="10" fill={p.body} />
      <rect x="160" y="126" width="40" height="14" fill={p.shade} />
      <rect x="190" y="132" width="34" height="8" fill={p.body} />
      <path d="M330 140 V70 H380 V140 H366 V100 A11 11 0 0 0 344 100 V140 Z" fill={p.shade} />
    </g>
  ),
  column: (p) => (
    <g>
      <rect x="30" y="110" width="120" height="30" fill={p.shade} />
      <rect x="250" y="104" width="130" height="36" fill={p.shade} />
      {arches(256, 376, 112, 22, 12, 8, p.lit)}
      <rect x="182" y="122" width="36" height="18" fill={p.body} />
      <rect x="188" y="32" width="24" height="90" fill={p.body} />
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1="188" y1={40 + i * 10} x2="212" y2={34 + i * 10} stroke={p.shade} />)}
      <rect x="185" y="28" width="30" height="5" fill={p.body} />
      <path d="M196 28 V14 h8 V28 Z" fill={p.body} />
      <circle cx="200" cy="11" r="4" fill={p.body} />
    </g>
  ),
  fountain: (p) => (
    <g>
      <rect x="50" y="44" width="300" height="80" fill={p.shade} />
      {windows(56, 344, 54, 2, 10, 9, 12, p.lit)}
      <path d="M170 124 V74 A30 30 0 0 1 230 74 V124 Z" fill={p.body} />
      <path d="M190 124 V92 h8 v-12 h4 v12 h8 V124 Z" fill={p.shade} />
      <rect x="40" y="118" width="320" height="10" fill={p.body} />
      <ellipse cx="200" cy="138" rx="170" ry="10" fill={p.water} />
      {[[150, 1], [250, -1], [120, 1], [280, -1]].map(([x, s], i) => (
        <path key={i} d={`M200 104 Q${x + s * 10} ${96 - i * 3} ${x} 134`} stroke={p.sky2} strokeWidth="1.5" fill="none" opacity="0.8" />
      ))}
    </g>
  ),
  steps: (p) => (
    <g>
      {Array.from({ length: 7 }, (_, i) => {
        const y = 140 - i * 7
        const half = 150 - i * 12
        return <rect key={i} x={200 - half} y={y - 7} width={half * 2} height="7" fill={i % 2 ? p.body : p.shade} />
      })}
      <rect x="150" y="48" width="100" height="45" fill={p.body} />
      <rect x="146" y="22" width="22" height="71" fill={p.body} />
      <rect x="232" y="22" width="22" height="71" fill={p.body} />
      <path d="M146 22 L157 10 L168 22 Z M232 22 L243 10 L254 22 Z" fill={p.body} />
      {arches(150, 166, 30, 14, 9, 4, p.lit)}{arches(236, 252, 30, 14, 9, 4, p.lit)}
      <path d="M185 93 V70 A15 15 0 0 1 215 70 V93 Z" fill={p.lit} opacity="0.8" />
      <ellipse cx="200" cy="146" rx="34" ry="6" fill={p.water} />
    </g>
  ),
  castle: (p) => (
    <g>
      <rect x="0" y="134" width="400" height="26" fill={p.water} />
      <rect x="100" y="80" width="200" height="54" fill={p.body} />
      <rect x="150" y="48" width="100" height="32" fill={p.body} />
      {windows(155, 245, 54, 1, 6, 8, 12, p.lit)}
      <rect x="190" y="38" width="20" height="10" fill={p.body} />
      <path d="M200 16 L192 36 H208 Z M186 22 L200 28 L214 22 L200 34 Z" fill={p.body} />
      {[[100, 88], [300, 88]].map(([x], i) => <rect key={i} x={x - 4} y="84" width="8" height="50" fill={p.shade} />)}
      <rect x="0" y="122" width="400" height="6" fill={p.shade} />
      {arches(10, 400, 128, 8, 26, 30, p.water)}
    </g>
  ),
  park: (p) => (
    <g>
      <path d="M0 140 Q120 118 220 130 T400 124 V160 H0 Z" fill={p.ground} />
      {pine(80, 136, 1.15, p.body)}{pine(190, 132, 1.5, p.shade)}{pine(300, 130, 1.25, p.body)}{pine(360, 134, 0.8, p.shade)}
      <ellipse cx="250" cy="146" rx="70" ry="6" fill={p.water} />
    </g>
  ),
  view: (p) => (
    <g>
      {[[0, 112, 40], [40, 104, 30], [70, 116, 36], [106, 100, 24], [130, 110, 50], [180, 106, 30], [210, 114, 40], [250, 102, 34], [284, 112, 50], [334, 108, 66]].map(([x, y, w], i) => (
        <g key={i}><rect x={x} y={y} width={w} height={140 - y} fill={p.shade} />{windows(x + 2, x + w - 2, y + 6, 2, Math.max(1, Math.floor(w / 12)), 4, 5, p.lit)}</g>
      ))}
      <g transform="translate(-110 32) scale(0.75)">{domeShape(400, 120, 34, p)}</g>
      <g transform="translate(60 40) scale(0.45)">{domeShape(200, 150, 30, p)}</g>
      <rect x="0" y="140" width="400" height="5" fill={p.body} />
      {Array.from({ length: 34 }, (_, i) => <rect key={i} x={4 + i * 12} y="128" width="4" height="12" rx="2" fill={p.body} />)}
      <rect x="0" y="124" width="400" height="5" fill={p.body} />
    </g>
  ),
  museum: (p) => (
    <g>
      <rect x="60" y="44" width="280" height="96" fill={p.body} />
      <rect x="54" y="38" width="292" height="8" fill={p.shade} />
      {windows(66, 334, 54, 3, 9, 12, 16, p.lit)}
      <path d="M182 140 V112 A18 18 0 0 1 218 112 V140 Z" fill={p.shade} />
      <rect x="60" y="80" width="280" height="3" fill={p.shade} />
    </g>
  ),
  church: (p) => (
    <g>
      <rect x="66" y="30" width="34" height="110" fill={p.body} />
      <path d="M66 30 L83 12 L100 30 Z" fill={p.body} />
      {[40, 64, 88].map((y) => <g key={y}>{arches(70, 98, y, 14, 9, 3, p.lit)}</g>)}
      <rect x="130" y="62" width="180" height="78" fill={p.body} />
      <path d="M130 62 L220 30 L310 62 Z" fill={p.body} />
      <circle cx="220" cy="50" r="7" fill={p.lit} />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={138 + i * 31} y="70" width="6" height="70" fill={p.shade} />)}
      <path d="M206 140 V112 A14 14 0 0 1 234 112 V140 Z" fill={p.lit} opacity="0.85" />
    </g>
  ),
  trattoria: (p) => (
    <g>
      <rect x="40" y="30" width="320" height="110" fill={p.shade} />
      {windows(48, 352, 38, 2, 8, 14, 18, p.lit)}
      <path d="M40 92 H360 V104 H40 Z" fill={p.body} />
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${40 + i * 20} 104 a10 7 0 0 0 20 0`} fill={i % 2 ? p.body : p.lit} />)}
      {[110, 200, 290].map((x) => (
        <g key={x}><ellipse cx={x} cy="128" rx="20" ry="4" fill={p.body} /><rect x={x - 1.5} y="128" width="3" height="12" fill={p.body} /><rect x={x - 6} y="118" width="3" height="10" fill={p.lit} /></g>
      ))}
      {p.glow && Array.from({ length: 20 }, (_, i) => <circle key={i} cx={30 + i * 18} cy={20 + Math.sin(i / 1.6) * 5} r="2" fill={p.glow} />)}
    </g>
  ),
  market: (p) => (
    <g>
      {[[40, 'lit'], [150, 'body'], [260, 'lit']].map(([x, c]) => (
        <g key={x}>
          <path d={`M${x} 90 L${x + 50} 66 L${x + 100} 90 Z`} fill={p[c]} />
          {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${x + i * 20} 90 a10 6 0 0 0 20 0`} fill={i % 2 ? p.body : p.lit} />)}
          <rect x={x + 4} y="96" width="3" height="44" fill={p.shade} /><rect x={x + 93} y="96" width="3" height="44" fill={p.shade} />
          <rect x={x + 10} y="116" width="80" height="24" fill={p.shade} />
          {[0, 1, 2, 3].map((i) => <circle key={i} cx={x + 22 + i * 18} cy="112" r="5" fill={p.lit} />)}
        </g>
      ))}
    </g>
  ),
  street: (p) => (
    <g>
      {[[20, 50, 70], [90, 34, 60], [150, 58, 66], [216, 40, 64], [280, 54, 56], [336, 44, 64]].map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={140 - y} fill={i % 2 ? p.body : p.shade} />
          {windows(x + 4, x + w - 4, y + 10, 3, 3, 8, 14, p.lit)}
          <rect x={x + 4} y={y + 30} width={w - 8} height="2" fill={i % 2 ? p.shade : p.body} />
        </g>
      ))}
      <rect x="196" y="76" width="3" height="64" fill={p.shade} />
      <circle cx="197.5" cy="74" r="5" fill={p.glow || p.lit} />
    </g>
  ),
  keyhole: (p) => (
    <g>
      <rect x="40" y="70" width="110" height="70" fill={p.shade} rx="20" />
      <rect x="250" y="70" width="110" height="70" fill={p.shade} rx="20" />
      <path d="M140 140 V60 A60 30 0 0 1 260 60 V140 Z" fill={p.body} />
      <path d="M160 140 V70 A40 20 0 0 1 240 70 V140 Z" fill={p.shade} />
      <circle cx="200" cy="96" r="10" fill={p.lit} />
      <path d="M194 100 L190 124 H210 L206 100 Z" fill={p.lit} />
      <g transform="translate(150 38) scale(0.25)">{domeShape(200, 230, 40, { ...p, body: p.shade })}</g>
    </g>
  ),
  pyramid: (p) => (
    <g>
      <path d="M130 140 L200 28 L270 140 Z" fill={p.body} />
      <path d="M200 28 L270 140 H232 Z" fill={p.shade} />
      <rect x="276" y="86" width="104" height="54" fill={p.shade} />
      <rect x="282" y="70" width="26" height="70" fill={p.shade} /><rect x="348" y="70" width="26" height="70" fill={p.shade} />
      <path d="M314 140 V112 A14 14 0 0 1 342 112 V140 Z" fill={p.lit} opacity="0.7" />
      {cypress(70, 140, 76, p.shade)}{cypress(96, 140, 58, p.body)}
    </g>
  ),
  bridge: (p) => (
    <g>
      {[[0, 70, 60], [60, 56, 50], [110, 76, 60], [170, 62, 50], [220, 74, 70], [290, 58, 60], [350, 70, 50]].map(([x, y, w], i) => (
        <g key={i}><rect x={x} y={y} width={w} height={110 - y} fill={p.shade} />{windows(x + 4, x + w - 4, y + 8, 2, 3, 6, 8, p.lit)}</g>
      ))}
      <rect x="0" y="110" width="400" height="50" fill={p.water} />
      <rect x="40" y="100" width="320" height="10" fill={p.body} />
      {[60, 160, 260].map((x) => <path key={x} d={`M${x} 110 H${x + 80} V140 A40 26 0 0 0 ${x} 140 Z`} fill={p.body} />)}
      {[60, 160, 260].map((x) => <path key={`r${x}`} d={`M${x + 4} 150 Q${x + 40} 132 ${x + 76} 150`} stroke={p.lit} opacity="0.5" fill="none" />)}
    </g>
  ),
  appia: (p) => (
    <g>
      <path d="M0 140 Q200 120 400 140 V160 H0 Z" fill={p.ground} />
      <path d="M150 160 L196 96 H204 L250 160 Z" fill={p.body} />
      {[104, 116, 130, 146].map((y) => <line key={y} x1={200 - (y - 92) * 0.75} y1={y} x2={200 + (y - 92) * 0.75} y2={y} stroke={p.shade} />)}
      {cypress(120, 138, 70, p.shade)}{cypress(138, 132, 52, p.shade)}{cypress(270, 132, 54, p.shade)}{cypress(290, 138, 74, p.shade)}
      {pine(60, 140, 0.9, p.body)}{pine(350, 140, 1, p.body)}
      <rect x="216" y="86" width="24" height="12" fill={p.shade} />
      <path d="M216 86 A12 5 0 0 1 240 86 Z" fill={p.shade} />
    </g>
  ),
  catacomb: (p) => (
    <g>
      <rect x="0" y="0" width="400" height="160" fill={p.shade} />
      {[150, 110, 74, 44].map((w, i) => <path key={i} d={`M${200 - w} 160 V${70 + i * 10} A${w} ${w * 0.6} 0 0 1 ${200 + w} ${70 + i * 10} V160 Z`} fill={i % 2 ? p.shade : p.body} />)}
      {[[70, 80], [70, 104], [300, 80], [300, 104], [104, 120], [270, 120]].map(([x, y], i) => <rect key={i} x={x} y={y} width="30" height="10" rx="3" fill={p.shade} />)}
      <circle cx="200" cy="126" r="22" fill={p.lit} opacity="0.25" />
      <rect x="197" y="124" width="6" height="16" fill={p.sky2} /><path d="M200 112 Q205 120 200 124 Q195 120 200 112" fill={p.lit} />
    </g>
  ),
  station: (p) => (
    <g>
      <rect x="0" y="40" width="400" height="6" fill={p.shade} />
      {[40, 140, 240, 340].map((x) => <rect key={x} x={x} y="46" width="5" height="94" fill={p.shade} />)}
      <path d="M20 132 V96 Q20 86 30 86 H330 Q372 86 384 120 L388 132 Z" fill={p.body} />
      {Array.from({ length: 11 }, (_, i) => <rect key={i} x={36 + i * 26} y="96" width="18" height="12" rx="2" fill={p.lit} />)}
      <rect x="20" y="114" width="366" height="4" fill="#c0392b" />
      <rect x="0" y="136" width="400" height="4" fill={p.shade} />
      <circle cx="80" cy="134" r="4" fill={p.shade} /><circle cx="300" cy="134" r="4" fill={p.shade} />
    </g>
  ),
  monument: (p) => (
    <g>
      {Array.from({ length: 5 }, (_, i) => <rect key={i} x={30 + i * 10} y={140 - (i + 1) * 6} width={340 - i * 20} height="6" fill={i % 2 ? p.body : p.shade} />)}
      <path d="M60 110 Q200 92 340 110 V60 Q200 44 60 60 Z" fill={p.body} />
      {Array.from({ length: 16 }, (_, i) => <rect key={i} x={68 + i * 17} y={66 - Math.sin((i / 15) * Math.PI) * 8} width="6" height={42} fill={p.shade} />)}
      <rect x="56" y="52" width="40" height="58" fill={p.body} /><rect x="304" y="52" width="40" height="58" fill={p.body} />
      <path d="M62 52 l6 -16 h22 l6 16 Z M310 52 l6 -16 h22 l6 16 Z" fill={p.shade} />
      <path d="M172 104 h56 v-30 h-56 Z" fill={p.lit} opacity="0.5" />
    </g>
  ),
  theatre: (p) => (
    <g>
      <rect x="60" y="40" width="280" height="100" fill={p.body} />
      <rect x="54" y="34" width="292" height="8" fill={p.shade} />
      {arches(78, 330, 56, 34, 22, 14, p.lit)}
      {windows(70, 330, 104, 1, 8, 14, 22, p.shade)}
      <rect x="150" y="112" width="100" height="6" fill={p.shade} />
    </g>
  ),
  square: (p) => (
    <g>
      <rect x="0" y="134" width="400" height="6" fill={p.shade} />
      <g transform="translate(-90 10)">{domeShape(200, 124, 34, p)}</g>
      <g transform="translate(90 10)">{domeShape(200, 124, 34, p)}</g>
      <path d="M194 136 L197 40 L200 32 L203 40 L206 136 Z" fill={p.shade} />
      <rect x="186" y="126" width="28" height="10" fill={p.shade} />
    </g>
  ),
}

export default function Art({ kind = 'street', mode = 'day', className = '', label }) {
  const p = PALETTES[mode] || PALETTES.day
  const draw = DRAW[kind] || DRAW.street
  const id = `sky-${kind}-${mode}`
  return (
    <svg className={`art ${className}`} viewBox="0 0 400 160" preserveAspectRatio="xMidYMax slice" role="img" aria-label={label || kind}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky1} />
          <stop offset="1" stopColor={p.sky2} />
        </linearGradient>
      </defs>
      <rect width="400" height="160" fill={`url(#${id})`} />
      {mode === 'night' && STARS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 ? 1 : 1.6} fill="#fff" opacity="0.8" />)}
      {mode === 'night' && <circle cx="340" cy="30" r="11" fill={p.sun} />}
      {mode === 'day' && <circle cx="330" cy="34" r="16" fill={p.sun} opacity="0.9" />}
      {mode === 'dusk' && <circle cx="300" cy="128" r="30" fill={p.sun} opacity="0.75" />}
      {draw(p)}
      <rect y="140" width="400" height="20" fill={p.ground} opacity={kind === 'catacomb' ? 0 : 1} />
    </svg>
  )
}

// Wide skyline for the overview header.
export function Skyline({ mode = 'dusk' }) {
  const p = PALETTES[mode]
  return (
    <svg className="art skyline" viewBox="0 0 1200 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="skyline-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky1} /><stop offset="1" stopColor={p.sky2} />
        </linearGradient>
      </defs>
      <rect width="1200" height="220" fill="url(#skyline-sky)" />
      <circle cx="880" cy="170" r="54" fill={p.sun} opacity="0.7" />
      <g transform="translate(0 60)">{DRAW.colosseum(p)}</g>
      <g transform="translate(330 40) scale(1.1)">{DRAW.dome(p)}</g>
      <g transform="translate(760 60)">{DRAW.park(p)}</g>
      <g transform="translate(980 60) scale(0.9)">{DRAW.church(p)}</g>
      <rect y="200" width="1200" height="20" fill={p.ground} />
    </svg>
  )
}
