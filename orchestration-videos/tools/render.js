// Usage: node tools/render.js scenes/<name>.js [outDir] [--preview]
// Scene module: module.exports = makeScene(SERIF, HAND) => { draw(ctx, t), DUR, acts?, cues? }
//   acts: [{start, end, bpm, drone}]  (bpm 0 = no beat; drone true = low sustained pad)   cues: [{t, type: 'ding'|'bonk'|'whoosh'|'pop'|'stamp'|'hit'}]
const path=require('path'),fs=require('fs'),{spawn,execFileSync}=require('child_process');
const {createCanvas,GlobalFonts}=require('@napi-rs/canvas');
const ROOT=path.join(__dirname,'..');
GlobalFonts.registerFromPath(path.join(ROOT,'fonts/InstrumentSerif-Regular.ttf'),'SERIF');
GlobalFonts.registerFromPath(path.join(ROOT,'fonts/PatrickHand-Regular.ttf'),'HAND');
const scenePath=path.resolve(process.argv[2]);const name=path.basename(scenePath,'.js');
const outDir=path.resolve(process.argv[3]&&!process.argv[3].startsWith('--')?process.argv[3]:path.join(ROOT,'output',name));
const preview=process.argv.includes('--preview');fs.mkdirSync(outDir,{recursive:true});
process.env.SCENE_SLUG=name;const scene=require(scenePath)('SERIF','HAND');const W=1080,H=1920,FPS=30,DUR=scene.DUR;
const cv=createCanvas(W,H),ctx=cv.getContext('2d');
function frameAt(t){ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;scene.draw(ctx,t);}
if(preview){
  const n=Math.min(24,Math.max(8,Math.round(DUR/2))),files=[];
  for(let i=0;i<n;i++){const t=(i+0.5)*DUR/n;frameAt(t);const f=path.join(outDir,`_p${i}.png`);fs.writeFileSync(f,cv.toBuffer('image/png'));files.push(f);}
  const cols=Math.min(8,n);const args=['-loglevel','error','-y'];files.forEach(f=>args.push('-i',f));
  const tiles=files.map((_,i)=>`[${i}]scale=270:480[s${i}]`).join(';');const inputs=files.map((_,i)=>`[s${i}]`).join('');
  const layout=files.map((_,i)=>`${(i%cols)*270}_${Math.floor(i/cols)*480}`).join('|');
  args.push('-filter_complex',`${tiles};${inputs}xstack=inputs=${n}:layout=${layout}:fill=black`,path.join(outDir,'contact_sheet.png'));
  execFileSync('ffmpeg',args);files.forEach(f=>fs.unlinkSync(f));
  console.log('preview:',path.join(outDir,'contact_sheet.png'),'| frame times:',files.map((_,i)=>((i+0.5)*DUR/n).toFixed(1)).join(', '));process.exit(0);}
(async()=>{
  const silent=path.join(outDir,'_video.mp4');
  const ff=spawn('ffmpeg',['-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgba','-s',`${W}x${H}`,'-r',String(FPS),'-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','19','-preset','medium',silent],{stdio:['pipe','inherit','inherit']});
  for(let i=0;i<Math.round(DUR*FPS);i++){frameAt(i/FPS);if(!ff.stdin.write(Buffer.from(cv.data())))await new Promise(r=>ff.stdin.once('drain',r));}
  ff.stdin.end();await new Promise(r=>ff.on('close',r));
  frameAt(Math.min(0.6,DUR*0.05));fs.writeFileSync(path.join(outDir,'poster.png'),cv.toBuffer('image/png'));
  const wav=path.join(outDir,'_audio.wav');require('./audio.js')(scene,wav);
  execFileSync('ffmpeg',['-loglevel','error','-y','-i',silent,'-i',wav,'-c:v','copy','-c:a','aac','-b:a','160k','-shortest','-movflags','+faststart',path.join(outDir,`${name}.mp4`)]);
  fs.unlinkSync(silent);fs.unlinkSync(wav);console.log('rendered:',path.join(outDir,`${name}.mp4`));
})();
