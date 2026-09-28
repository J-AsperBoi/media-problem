// Automatic render checks ("lint"): watches every piece of text a film draws and flags problems
// BEFORE anyone watches it. Plain-English guide: see tools/README.md.
// Usage: node tools/lint.js scenes/<name>.js [more scenes...]   (or: node tools/lint.js --all)
// Exit code 1 if any ERROR (used to block a render), 0 if only warnings.
const path = require('path'), fs = require('fs');
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const ROOT = path.join(__dirname, '..');
GlobalFonts.registerFromPath(path.join(ROOT, 'fonts/InstrumentSerif-Regular.ttf'), 'SERIF');
GlobalFonts.registerFromPath(path.join(ROOT, 'fonts/PatrickHand-Regular.ttf'), 'HAND');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8'));

// Rules (numbers from CLAUDE.md §8 and research/VIRAL_STRUCTURES.md)
const MIN_PX = 44;                           // smallest readable text on a phone
const SAFE = { x0: 80, x1: 900, y0: 220, y1: 1500 };  // x1=900: TikTok's right-hand buttons start ~915
const MAX_NUMBERS = 2;                       // at most two numbers on screen
const BANNED = /\b(virus|viral infection|pandemic|covid|coronavirus|ransomware|malware|worm|hack(ed|er|ing)?|bacteri\w*|antibiotic\w*|penicillin|vaccin\w*|solar storm|geomagnetic|moloch|sheeple|wake up)\b/i;
const EXEMPT = new Set([cfg.ctaLine, 'scan to join']);  // end-card boilerplate from tools/lib.js

function lintScene(scenePath) {
  const name = path.basename(scenePath, '.js');
  process.env.SCENE_SLUG = name;
  delete require.cache[require.resolve(path.resolve(scenePath))];
  const scene = require(path.resolve(scenePath))('SERIF', 'HAND');
  const cv = createCanvas(1080, 1920), ctx = cv.getContext('2d');
  const seen = [];   // every visible text draw: {t, text, px, x0, x1, y}
  let now = 0;
  for (const fn of ['fillText', 'strokeText']) {
    const orig = ctx[fn].bind(ctx);
    ctx[fn] = (text, x, y, ...rest) => {
      try {
        const m = ctx.getTransform(), scale = Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));
        const px = (parseFloat((ctx.font.match(/([\d.]+)px/) || [])[1]) || 10) * scale;
        const w = ctx.measureText(String(text)).width * scale;
        const sx = m.a * x + m.c * y + m.e, sy = m.b * x + m.d * y + m.f;
        const al = ctx.textAlign, x0 = al === 'center' ? sx - w / 2 : (al === 'right' || al === 'end') ? sx - w : sx;
        if (ctx.globalAlpha >= 0.5 && sy > 0 && sy < 1920 && x0 + w > 0 && x0 < 1080 && fn === 'fillText')
          seen.push({ t: now, text: String(text).trim(), px, x0, x1: x0 + w, y: sy });
      } catch (e) { }
      return orig(text, x, y, ...rest);
    };
  }
  for (let t = 0; t < scene.DUR; t += 0.25) {           // sample 4 frames per second
    now = +t.toFixed(2); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; scene.draw(ctx, t);
  }
  const vis = seen.filter(s => s.text && !EXEMPT.has(s.text) && !(s.y > 1800 && s.x0 < 120)); // skip corner slates
  const uniq = (arr, key) => { const m = new Map(); arr.forEach(a => { const k = key(a); if (!m.has(k)) m.set(k, a); }); return [...m.values()]; };
  const out = { name, errors: [], warnings: [] };

  const small = uniq(vis.filter(s => s.px < MIN_PX - 0.5), s => s.text);
  if (small.length) out.warnings.push(`TEXT TOO SMALL (<${MIN_PX}px on a phone): ` + small.slice(0, 6).map(s => `"${s.text.slice(0, 28)}" ${s.px.toFixed(0)}px @${s.t}s`).join(' · ') + (small.length > 6 ? ` · +${small.length - 6} more` : ''));
  const outside = uniq(vis.filter(s => s.px >= MIN_PX && (s.x0 < SAFE.x0 - 2 || s.x1 > SAFE.x1 + 2 || s.y < SAFE.y0 || s.y > SAFE.y1 + 40)), s => s.text);
  if (outside.length) out.warnings.push(`OUTSIDE SAFE ZONE (may be hidden by app buttons): ` + outside.slice(0, 5).map(s => `"${s.text.slice(0, 24)}" x${s.x0.toFixed(0)}–${s.x1.toFixed(0)} y${s.y.toFixed(0)} @${s.t}s`).join(' · ') + (outside.length > 5 ? ` · +${outside.length - 5} more` : ''));
  const nums = new Map();
  vis.filter(s => s.px >= 30).forEach(s => (s.text.match(/\d[\d,.]*\s?%?/g) || []).forEach(n => { n = n.replace(/[.,]$/, '').trim(); if (!nums.has(n)) nums.set(n, s); }));
  if (nums.size > MAX_NUMBERS) out.warnings.push(`MORE THAN ${MAX_NUMBERS} NUMBERS ON SCREEN (${nums.size}): ` + [...nums.entries()].slice(0, 8).map(([n, s]) => `${n} ("${s.text.slice(0, 20)}")`).join(', '));
  const all = vis.map(s => s.text).join(' | ');
  const banned = uniq(vis.filter(s => BANNED.test(s.text)), s => s.text);
  if (banned.length) out.errors.push(`NAMES THE THREAT / BANNED WORD: ` + banned.slice(0, 4).map(s => `"${s.text}" @${s.t}s`).join(' · '));
  if (/\b(AI|frontier|routed|routing)\b/i.test(all) && !/illustrative/i.test(all)) out.errors.push('AI-SPEED VERSION SHOWN WITHOUT AN "illustrative" LABEL');
  return out;
}

const args = process.argv.slice(2);
const files = args[0] === '--all'
  ? fs.readdirSync(path.join(ROOT, 'scenes')).filter(f => f.endsWith('.js') && !f.startsWith('example_')).map(f => path.join(ROOT, 'scenes', f))
  : args;
let errs = 0;
if (files.length > 1) {                                   // one process per film keeps memory low
  const { spawnSync } = require('child_process');
  for (const f of files) { const r = spawnSync(process.execPath, [__filename, f], { encoding: 'utf8' }); process.stdout.write(r.stdout || ''); if (r.status) errs++; }
  process.exit(errs ? 1 : 0);
}
for (const f of files) {
  let r; try { r = lintScene(f); } catch (e) { console.log(`ERROR  ${path.basename(f)}: scene crashed: ${e.message}`); errs++; continue; }
  const tag = r.errors.length ? 'FAIL' : r.warnings.length ? 'WARN' : 'OK  ';
  console.log(`${tag}  ${r.name}`); r.errors.forEach(e => console.log('   ✗ ' + e)); r.warnings.forEach(w => console.log('   ! ' + w));
  errs += r.errors.length;
}
process.exit(errs ? 1 : 0);
