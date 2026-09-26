// Verifies finished films: mp4 exists, duration matches DUR, only red/green are saturated, end card present.
// Usage: node tools/verify.js [slug ...]   (default: every output/<slug>/<slug>.mp4)
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'output');
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(OUT).filter(d => fs.existsSync(path.join(OUT, d, d + '.mp4')));
const hue = (r, g, b) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (!d) return [0, 0];
  let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h = (h * 60 + 360) % 360; return [h, d / mx]; };
(async () => { const res = [];
  for (const s of slugs) {
    const mp4 = path.join(OUT, s, s + '.mp4'), r = { slug: s, ok: true, notes: [] };
    if (!fs.existsSync(mp4)) { res.push({ ...r, ok: false, notes: ['no mp4'] }); continue; }
    const dur = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4]).toString();
    let DUR = null; try { process.env.SCENE_SLUG = s; DUR = require(path.join(ROOT, 'scenes', s + '.js'))('SERIF', 'HAND').DUR; } catch (e) { r.notes.push('scene load failed'); }
    r.dur = dur; if (DUR && Math.abs(dur - DUR) > 0.15) { r.ok = false; r.notes.push(`duration ${dur} != DUR ${DUR}`); }
    let stray = 0, px = 0;
    for (let i = 0; i < 12; i++) { const t = (i + 0.5) * dur / 12, f = path.join('/tmp', `_v_${s}_${i}.png`);
      execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-ss', String(t), '-i', mp4, '-frames:v', '1', '-vf', 'scale=216:384', f]);
      const img = await loadImage(f), c = createCanvas(216, 384), x = c.getContext('2d'); x.drawImage(img, 0, 0); const d = x.getImageData(0, 0, 216, 384).data;
      for (let p = 0; p < d.length; p += 4) { const [h, sat] = hue(d[p], d[p + 1], d[p + 2]); px++; if (sat > 0.45 && Math.max(d[p], d[p + 1], d[p + 2]) > 90 && !(h < 20 || h > 340) && !(h > 120 && h < 165)) stray++; }
      fs.unlinkSync(f); }
    r.strayPct = +(100 * stray / px).toFixed(2); if (r.strayPct > 0.5) { r.ok = false; r.notes.push(`saturated non-red/green pixels ${r.strayPct}%`); }
    const f = path.join('/tmp', `_v_${s}_end.png`); execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-sseof', '-1.5', '-i', mp4, '-frames:v', '1', f]);
    const img = await loadImage(f), c = createCanvas(1080, 1920), x = c.getContext('2d'); x.drawImage(img, 0, 0); const q = x.getImageData(340, 760, 400, 400).data; fs.unlinkSync(f);
    let light = 0, dark = 0; for (let p = 0; p < q.length; p += 4) (q[p] > 200 ? light++ : q[p] < 60 ? dark++ : 0);
    r.qr = light > 20000 && dark > 20000; if (!r.qr) { r.ok = false; r.notes.push('no QR in last 1.5s'); }
    res.push(r); console.log(`${r.ok ? 'PASS' : 'FAIL'} ${s} dur=${dur.toFixed(2)} stray=${r.strayPct}% qr=${r.qr} ${r.notes.join('; ')}`);
  }
})();
