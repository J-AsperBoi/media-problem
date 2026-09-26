// Picks the next N unbuilt concepts that most increase portfolio diversity (greedy max-min distance), tie-break by first-guess virality.
// Usage: node tools/pick.js [N]
const fs = require('fs'), path = require('path');
const DIMS = ['structure', 'medium', 'family', 'scale', 'pace', 'emotion', 'protagonist', 'camera', 'analog'];
const F = path.join(__dirname, '..', 'output', 'LEDGER.jsonl');
const built = fs.existsSync(F) ? fs.readFileSync(F, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l)) : [];
const done = new Set(built.map(r => r.slug)), busy = new Set(fs.readdirSync(path.join(__dirname, '..', 'output')));
const all = require('../output/concepts.js');
const pool = all.filter(c => !done.has(c.slug) && !busy.has(c.slug));
const inProgress = all.filter(c => busy.has(c.slug) && !done.has(c.slug));
const dist = (a, b) => DIMS.filter(d => String(a[d]).toLowerCase() !== String(b[d]).toLowerCase()).length / DIMS.length;
const N = +process.argv[2] || 3, chosen = [], ref = [...built, ...inProgress];
for (let k = 0; k < N && pool.length; k++) {
  let best = -1, bs = -1; pool.forEach((c, i) => { const m = ref.length ? Math.min(...ref.map(r => dist(c, r))) : 1; const newStruct = !ref.some(r => r.structure === c.structure) ? 30 : 0, newAnalog = !ref.some(r => r.analog === c.analog) ? 15 : 0;
    const s = m * 100 + newStruct + newAnalog + c.vir; if (s > bs) { bs = s; best = i; } });
  const c = pool.splice(best, 1)[0]; chosen.push(c); ref.push(c);
}
console.log(JSON.stringify(chosen, null, 1));
