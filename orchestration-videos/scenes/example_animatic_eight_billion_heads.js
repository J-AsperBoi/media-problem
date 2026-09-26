// EXAMPLE ANIMATIC (quick tier). Rough, stick figures, hand-drawn boil, real camera moves, shot slates.
// Concept: "Eight billion heads." Metaphor family: body/biology. Topology: field of vectors -> aligned flow.
// Orchestration ratio shown literally as a meter: total effort vs. net progress.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const DUR = 24, BG = '#161a21', G = '#4fe08a';
  const r = L.rng(5); const crowd = [];
  for (let i = 0; i < 70; i++) crowd.push({ x: 140 + r() * 800, y: 700 + r() * 900, a: r() * Math.PI * 2, ph: r() });
  const heading = (p, t) => { const align = L.sm(16, 20, t); const chaos = p.a + Math.sin(t * 1.3 + p.ph * 9) * 0.8; return L.lerp(chaos, -Math.PI / 2, align); };
  function meter(ctx, t) { const vs = crowd.map(p => { const h = heading(p, t); return [Math.cos(h), Math.sin(h)]; }); const o = L.orchestration(vs);
    ctx.fillStyle = '#232833'; ctx.fillRect(140, 470, 800, 26); ctx.fillStyle = '#9aa0aa'; ctx.fillRect(140, 470, 800, 26);
    ctx.fillStyle = G; ctx.fillRect(140, 510, 800 * o.ratio, 26);
    L.label(ctx, 'total effort', 140, 460, 32, { align: 'left', col: '#9aa0aa' }); L.label(ctx, 'net progress ' + Math.round(o.ratio * 100) + '%', 140, 575, 32, { align: 'left', col: G }); }
  const shots = [
    { start: 0, end: 5, draw(ctx, lt) { // SC1 close on one head, dolly out
      ctx.save(); L.camera(ctx, [[0, [540, 1000, 3.2]], [5, [540, 1100, 1.6]]], lt);
      L.stick(ctx, 540, 1100, 2, { mood: 'happy', t: lt, boil: 1, pose: { armL: 2.4 + Math.sin(lt * 8) * 0.3, armR: 2.4 - Math.sin(lt * 8) * 0.3 } }); ctx.restore();
      L.title(ctx, ['You are one head.'], 330, 110, { alpha: L.sm(0.2, 0.6, lt) }); L.slate(ctx, 'SC1  CLOSE  DOLLY OUT'); } },
    { start: 5, end: 11, draw(ctx, lt, d, t) { // SC2 wide: every head points somewhere else
      ctx.save(); L.camera(ctx, [[0, [540, 1150, 1.6]], [6, [540, 1150, 1]]], lt);
      crowd.forEach((p, i) => { const h = heading(p, t); L.stick(ctx, p.x, p.y, 0.55, { mood: 'happy', t, seed: i, boil: 1, pose: { lean: Math.cos(h) * 0.6 } });
        L.sketchLine(ctx, p.x, p.y - 70, p.x + Math.cos(h) * 60, p.y - 70 + Math.sin(h) * 60, { w: 3, col: '#9aa0aa', seed: i }); }); ctx.restore();
      meter(ctx, t); L.title(ctx, ['Eight billion heads.', { text: 'Every one pulling.', col: '#9aa0aa' }], 250, 96, { alpha: L.sm(0.2, 0.6, lt) }); L.slate(ctx, 'SC2  WIDE  PULL BACK'); } },
    { start: 11, end: 16, draw(ctx, lt, d, t) { // SC3 whip to the meter, hard stop
      ctx.save(); L.camera(ctx, [[0, [540, 1150, 1]], [0.5, [540, 900, 1.15, 0.03]], [5, [540, 900, 1.15, 0]]], lt);
      crowd.forEach((p, i) => { const h = heading(p, t); L.stick(ctx, p.x, p.y, 0.55, { mood: lt > 2 ? 'glazed' : 'bored', t, seed: i, boil: 1 }); }); ctx.restore();
      meter(ctx, t); L.title(ctx, ['So much effort.', { text: 'So little distance.', col: '#9aa0aa' }], 250, 96, { alpha: L.sm(0.2, 0.6, lt) }); L.slate(ctx, 'SC3  WHIP  HOLD'); } },
    { start: 16, end: 24, draw(ctx, lt, d, t) { // SC4 alignment: heads turn together, color blooms, crowd moves as one
      const move = L.sm(20, 24, t) * 260; ctx.save(); L.camera(ctx, [[0, [540, 1150, 1]], [8, [540, 900, 0.85]]], lt);
      crowd.forEach((p, i) => { const h = heading(p, t); const c = L.sm(16.5 + p.ph * 3, 18 + p.ph * 3, t);
        L.stick(ctx, p.x, p.y - move, 0.55, { mood: c > 0.5 ? 'awe' : 'happy', col: c > 0.5 ? G : '#e8e4da', t, seed: i, boil: 1, pose: { legs: Math.sin(t * 8 + i) * c } });
        L.sketchLine(ctx, p.x, p.y - 70 - move, p.x + Math.cos(h) * 60, p.y - 70 - move + Math.sin(h) * 60, { w: 3, col: c > 0.5 ? G : '#9aa0aa', seed: i }); }); ctx.restore();
      meter(ctx, t); L.title(ctx, ['Same heads.', { text: 'Pointed together.', col: G }], 250, 96, { alpha: L.sm(0.3, 0.7, lt) }); L.slate(ctx, 'SC4  WIDE  CRANE UP'); } },
  ];
  function draw(ctx, t) { ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920); L.shots(ctx, shots, t); L.grain(ctx, t); }
  return { draw, DUR, acts: [{ start: 0, end: 11, bpm: 92 }, { start: 11, end: 16, bpm: 0 }, { start: 16, end: 24, bpm: 118 }],
    cues: [{ t: 5, type: 'whoosh' }, { t: 11, type: 'hit' }, { t: 16.2, type: 'ding' }] };
}
module.exports = makeScene;
