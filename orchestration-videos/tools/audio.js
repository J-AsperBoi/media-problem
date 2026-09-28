// Tempo-matched scratch soundtrack: kick on beats, hat on offbeats, per-act BPM, plus sound-effect cues.
// It exists so pacing can be judged; real music gets added in an editor.
// Drone acts accept optional {cut:true} (hard start/stop, no fades) and {gain:0..1} (volume, e.g. 0.15 for near-silence).
const fs=require('fs');
module.exports=function(scene,out){
  const SR=44100,DUR=scene.DUR,N=Math.round(SR*DUR),buf=new Float32Array(N);
  const acts=scene.acts||[{start:0,end:DUR,bpm:110}];let seed=1;const rnd=()=>((seed=(seed*16807)%2147483647)/2147483647)*2-1;
  const add=(t0,len,fn)=>{const s=Math.floor(t0*SR);for(let i=0;i<len*SR&&s+i<N;i++)buf[s+i]+=fn(i/SR);};
  acts.forEach(a=>{if(!a.drone)return;const len=a.end-a.start;add(a.start,len,x=>{const sw=a.cut?Math.min(1,x/0.01)*Math.min(1,(len-x)/0.01):Math.min(1,x/2)*Math.min(1,(len-x)/1.5);return sw*0.22*(a.gain??1)*(Math.sin(2*Math.PI*41*x)+0.6*Math.sin(2*Math.PI*61.5*x)+0.3*Math.sin(2*Math.PI*82*x+Math.sin(x*0.7)));});});
  acts.forEach(a=>{if(!a.bpm)return;const b=60/a.bpm;for(let t=a.start;t<a.end-0.01;t+=b){
    add(t,0.25,x=>Math.sin(2*Math.PI*(55+90*Math.exp(-x*30))*x)*Math.exp(-x*14)*0.7);
    add(t+b/2,0.06,x=>rnd()*Math.exp(-x*60)*0.18);}});
  const fx={ding:x=>(Math.sin(2*Math.PI*1760*x)+0.5*Math.sin(2*Math.PI*2640*x))*Math.exp(-x*5)*0.35,
    bonk:x=>Math.sin(2*Math.PI*(180-120*x)*x)*Math.exp(-x*18)*0.8,whoosh:x=>rnd()*Math.sin(Math.PI*Math.min(1,x/0.5))*0.25,
    pop:x=>Math.sin(2*Math.PI*(600+800*x)*x)*Math.exp(-x*40)*0.5,stamp:x=>(rnd()*0.6+Math.sin(2*Math.PI*90*x))*Math.exp(-x*25)*0.8,
    hit:x=>(rnd()*0.4+Math.sin(2*Math.PI*45*x))*Math.exp(-x*6)*0.9};
  const len={ding:1.2,bonk:0.3,whoosh:0.5,pop:0.12,stamp:0.3,hit:1.5};
  (scene.cues||[]).forEach(c=>fx[c.type]&&add(c.t,len[c.type],fx[c.type]));
  let peak=0;for(const v of buf)peak=Math.max(peak,Math.abs(v));const g=peak>0.95?0.95/peak:1;
  const b=Buffer.alloc(44+N*2);b.write('RIFF',0);b.writeUInt32LE(36+N*2,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);
  b.writeUInt32LE(SR,24);b.writeUInt32LE(SR*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(N*2,40);
  for(let i=0;i<N;i++)b.writeInt16LE(Math.max(-32767,Math.min(32767,Math.round(buf[i]*g*32767))),44+i*2);fs.writeFileSync(out,b);};
