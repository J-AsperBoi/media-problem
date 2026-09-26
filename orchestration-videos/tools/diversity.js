// Scores portfolio diversity from output/LEDGER.jsonl (one JSON object per concept).
// Usage: node tools/diversity.js                -> batch report
//        node tools/diversity.js '<json tags>'  -> checks a proposed concept for near-duplicates before building
const fs = require('fs'), path = require('path');
const F = path.join(__dirname, '..', 'output', 'LEDGER.jsonl');
const DIMS = ['structure', 'medium', 'family', 'scale', 'pace', 'emotion', 'protagonist', 'camera', 'analog'];
const rows = fs.existsSync(F) ? fs.readFileSync(F, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
const dist = (a, b) => DIMS.filter(d => String(a[d] || '').toLowerCase() !== String(b[d] || '').toLowerCase()).length / DIMS.length;
if (process.argv[2]) {
  const c = JSON.parse(process.argv[2]); const near = rows.map(r => ({ slug: r.slug, d: dist(c, r) })).sort((a, b) => a.d - b.d).slice(0, 3);
  const verdict = near.length && near[0].d < 0.5 ? 'TOO SIMILAR: change at least ' + Math.ceil((0.5 - near[0].d) * DIMS.length) + ' more dimension(s)' : 'OK: distinct enough';
  console.log(verdict); near.forEach(n => console.log(`  nearest ${n.slug}: distance ${n.d.toFixed(2)}`)); process.exit(0);
}
if (rows.length < 2) { console.log(`${rows.length} concept(s) logged; need 2+ to score.`); process.exit(0); }
let tot = 0, n = 0, pairs = []; for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) { const d = dist(rows[i], rows[j]); tot += d; n++; pairs.push([d, rows[i].slug, rows[j].slug]); }
const cover = {}; DIMS.forEach(d => cover[d] = new Set(rows.map(r => String(r[d] || '').toLowerCase())).size);
const vir = rows.filter(r => typeof r.virality === 'number'); const mv = vir.length ? vir.reduce((a, r) => a + r.virality, 0) / vir.length : 0;
const th = {}; rows.forEach(r => th[r.structure || '?'] = (th[r.structure || '?'] || 0) + 1);
console.log(`Concepts: ${rows.length}\nStructures used: ${JSON.stringify(th)}\nDiversity (mean pairwise distance, 0-1): ${(tot / n).toFixed(3)}\nAverage virality estimate: ${mv.toFixed(1)}%`);
console.log('Distinct values per dimension:', JSON.stringify(cover));
console.log('Closest pairs:'); pairs.sort((a, b) => a[0] - b[0]).slice(0, 5).forEach(p => console.log(`  ${p[1]} ~ ${p[2]}: ${p[0].toFixed(2)}`));
