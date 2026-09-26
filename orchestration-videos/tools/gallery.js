// Builds output/index.html: the hero first, then animatics sorted by score, with the diversity report.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const OUT = path.join(__dirname, '..', 'output');
const items = fs.readdirSync(OUT).filter(d => fs.existsSync(path.join(OUT, d, `${d}.mp4`))).map(d => {
  const notes = fs.existsSync(path.join(OUT, d, 'notes.md')) ? fs.readFileSync(path.join(OUT, d, 'notes.md'), 'utf8') : '';
  return { d, notes, score: +((notes.match(/Overall:\s*([\d.]+)/i) || [])[1] || 0), vir: +((notes.match(/Virality:\s*([\d.]+)\s*%/i) || [])[1] || 0), hero: false };
}).sort((a, b) => (b.vir - a.vir) || (b.score - a.score));
let div = ''; try { div = execFileSync('node', [path.join(__dirname, 'diversity.js')]).toString(); } catch (e) {}
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html><meta charset=utf-8><title>Overnight portfolio</title><style>body{font-family:system-ui;background:#111;color:#eee;margin:24px}.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px}.hero{grid-column:1/-1;display:grid;grid-template-columns:minmax(280px,420px) 1fr;gap:24px;border:1px solid #4fe08a;border-radius:16px;padding:16px}video{width:100%;border-radius:12px;background:#000}pre{white-space:pre-wrap;font-size:12px;color:#bbb;max-height:260px;overflow:auto}</style><h1>Overnight portfolio (${items.length})</h1><pre>${esc(div)}</pre><div class=g>${items.map(i => `<div class="${i.hero ? 'hero' : ''}"><div><h3>${i.hero ? 'HERO: ' : ''}${esc(i.d)}${i.vir ? ' · ' + i.vir + '% viral' : ''}${i.score ? ' · ' + i.score + '/10' : ''}</h3><video src="${i.d}/${i.d}.mp4" poster="${i.d}/poster.png" controls loop playsinline></video></div><pre>${esc(i.notes)}</pre></div>`).join('')}</div>`);
console.log('gallery:', path.join(OUT, 'index.html'));
