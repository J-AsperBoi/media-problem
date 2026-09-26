function makeScene(SERIF,HAND){const DUR=15;
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const sm=(a,b,t)=>{t=Math.max(0,Math.min(1,(t-a)/(b-a)));return t*t*(3-2*t);};
const lerp=(a,b,f)=>a+(b-a)*f;
function rr(c,x,y,w,h,r){c.beginPath();c.roundRect(x,y,w,h,r);}
function bean(c,x,y,s,o){
const bw=46*s,bh=60*s,col=o.col||'#ebe5d8',mood=o.mood||'happy',t=o.t||0;
c.save();
if(o.arms){c.strokeStyle=col;c.lineWidth=7*s;c.lineCap='round';const wv=o.wave||0;
[-1,1].forEach(sd=>{const ax=x+sd*bw*0.42,ay=y+bh*0.02;const ang=o.armsUp?(-Math.PI/2+sd*(0.5+0.35*Math.sin(wv))):(Math.PI/2+sd*(0.2+0.2*Math.sin(wv)));c.beginPath();c.moveTo(ax,ay);c.lineTo(ax+Math.cos(ang)*bw*0.55,ay+Math.sin(ang)*bw*0.55);c.stroke();});}
if(o.legs){c.strokeStyle=col;c.lineWidth=7*s;c.lineCap='round';const lg=o.legs;[-1,1].forEach(sd=>{c.beginPath();c.moveTo(x+sd*bw*0.18,y+bh*0.42);c.lineTo(x+sd*bw*0.18+Math.sin(lg)*sd*bw*0.3,y+bh*0.72);c.stroke();});}
c.fillStyle=col;rr(c,x-bw/2,y-bh/2,bw,bh,bw/2);c.fill();
if(o.phone){c.fillStyle='rgba(140,210,255,0.28)';rr(c,x-bw*0.36,y-bh*0.3,bw*0.72,bh*0.34,bw*0.2);c.fill();}
const ey=y-bh*0.14,er=bw*(mood==='panic'?0.17:0.14);const lk=o.look||[0,0];
[-1,1].forEach(sd=>{const ex=x+sd*bw*0.19;
if(mood==='glazed'){c.fillStyle='#fffdf7';c.beginPath();c.arc(ex,ey,er,0,6.283);c.fill();c.fillStyle='#1b1f27';c.beginPath();c.arc(ex,ey+er*0.2,er*0.45,0,6.283);c.fill();c.fillStyle=o.col||'#ebe5d8';c.fillRect(ex-er*1.1,ey-er*1.1,er*2.2,er*1.05);c.strokeStyle='#1b1f27';c.lineWidth=2.5*s;c.beginPath();c.moveTo(ex-er,ey-er*0.05);c.lineTo(ex+er,ey-er*0.05);c.stroke();return;}
if(mood==='dizzy'){c.strokeStyle='#1b1f27';c.lineWidth=3*s;c.beginPath();c.moveTo(ex-er*0.7,ey-er*0.7);c.lineTo(ex+er*0.7,ey+er*0.7);c.moveTo(ex+er*0.7,ey-er*0.7);c.lineTo(ex-er*0.7,ey+er*0.7);c.stroke();return;}
c.fillStyle='#fffdf7';c.beginPath();c.arc(ex,ey,er,0,6.283);c.fill();c.strokeStyle='#1b1f27';c.lineWidth=1.6*s;c.stroke();
c.fillStyle='#1b1f27';c.beginPath();c.arc(ex+lk[0]*er*0.4,ey+lk[1]*er*0.4,er*(mood==='panic'?0.38:0.5),0,6.283);c.fill();
if(mood==='greedy'){c.strokeStyle='#1b1f27';c.lineWidth=3*s;c.beginPath();c.moveTo(ex-er*1.1,ey-er*1.3+sd*er*0.5);c.lineTo(ex+er*1.1,ey-er*1.3-sd*er*0.5);c.stroke();}
if(mood==='panic'){c.strokeStyle='#1b1f27';c.lineWidth=3*s;c.beginPath();c.moveTo(ex-er,ey-er*1.6+sd*er*0.3);c.lineTo(ex+er,ey-er*1.6-sd*er*0.3);c.stroke();}});
const my=y+bh*0.14;c.strokeStyle='#1b1f27';c.fillStyle='#1b1f27';c.lineWidth=3*s;c.lineCap='round';
if(mood==='panic'){c.beginPath();c.ellipse(x,my+bh*0.03,bw*0.1,bw*0.13*(1+0.2*Math.sin(t*30)),0,0,6.283);c.fill();}
else if(mood==='dizzy'){c.beginPath();c.moveTo(x-bw*0.12,my);c.quadraticCurveTo(x-bw*0.04,my+bw*0.08,x,my);c.quadraticCurveTo(x+bw*0.04,my-bw*0.08,x+bw*0.12,my);c.stroke();}
else if(mood==='greedy'){c.beginPath();c.moveTo(x-bw*0.16,my);c.quadraticCurveTo(x+bw*0.02,my+bw*0.16,x+bw*0.18,my-bw*0.06);c.stroke();}
else{c.beginPath();c.arc(x,my-bw*0.04,bw*0.14,0.15*Math.PI,0.85*Math.PI);c.stroke();}
c.restore();}

function headline(c,lines,y,size,al,col){c.save();c.globalAlpha=al;c.textAlign='center';c.textBaseline='alphabetic';
let yy=y;lines.forEach((l,i)=>{const fz=l.size||size;if(i>0)yy+=fz*1.02;c.font=`${fz}px "${SERIF}"`;c.lineWidth=fz*0.12;c.strokeStyle='#0d1118';c.lineJoin='round';c.strokeText(l.text,540,yy);c.fillStyle=l.col||col||'#fffdf7';c.fillText(l.text,540,yy);});c.restore();}
function small(c,text,x,y,size,col,al=1,font){c.save();c.globalAlpha=al;c.font=`${size}px "${font||HAND}"`;c.textAlign='center';c.fillStyle=col;c.fillText(text,x,y);c.restore();}

const G='#4fe08a',GD='#1f7a45',GRAY='#9aa0aa',DGRAY='#5d636d',BG='#161a21',DG='#a89a6a';
const r=rng(21);
const office=[];for(let i=0;i<14;i++)office.push({x:170+(i%4)*250+(Math.floor(i/4)%2)*110+(r()-0.5)*40,y:720+Math.floor(i/4)*230+(r()-0.5)*40,ph:r()*6.28});
const hops=[0,5,2,9,6,11,7];
function blah(c,x,y,s,al){c.save();c.globalAlpha=al;c.fillStyle='#d8d4ca';rr(c,x-52*s,y-26*s,104*s,52*s,18*s);c.fill();c.fillStyle='#4a4f58';c.font=`${30*s}px "${HAND}"`;c.textAlign='center';c.fillText('blah',x,y+10*s);c.restore();}
function coin(c,x,y,rad){c.fillStyle=DG;c.beginPath();c.arc(x,y,rad,0,6.283);c.fill();c.strokeStyle='#7a6f48';c.lineWidth=2;c.stroke();}
function glow(c,x,y,rad){c.fillStyle='rgba(79,224,138,0.22)';c.beginPath();c.arc(x,y,rad*2.4,0,6.283);c.fill();c.fillStyle=G;c.beginPath();c.arc(x,y,rad,0,6.283);c.fill();}
function stamp(c,text,x,y,rot,p){if(p<=0)return;c.save();c.translate(x,y);c.rotate(rot);const sc=lerp(1.8,1,p);c.scale(sc,sc);c.globalAlpha=Math.min(1,p*2);c.font=`64px "${HAND}"`;const w=c.measureText(text).width+60;c.strokeStyle='#e8e4da';c.lineWidth=7;rr(c,-w/2,-52,w,90,12);c.stroke();c.fillStyle='#e8e4da';c.textAlign='center';c.fillText(text,0,14);c.restore();}
function maze(c,ox,oy,w,h){c.strokeStyle=DGRAY;c.lineWidth=8;c.lineCap='round';const L=[[.1,.25,.7,.25],[.3,.45,.9,.45],[.1,.65,.6,.65],[.4,.85,.9,.85],[.7,.25,.7,.45]];c.beginPath();L.forEach(([a,b,cc,d])=>{c.moveTo(ox+a*w,oy+b*h);c.lineTo(ox+cc*w,oy+d*h);});c.stroke();}
function draw(c,t){
c.fillStyle=BG;c.fillRect(0,0,1080,1920);
if(t<6){
const hopT=Math.min(hops.length-1.001,t/0.55);const hi=Math.floor(hopT),hf=sm(0.3,1,hopT-hi);
office.forEach((n,i)=>{const bal=1+0.35*Math.max(0,Math.sin(t*2.3+n.ph*3))*((i%3)===0?1:0);n.cs=bal;});
for(let k=0;k<16;k++){const a=office[(k*5)%14],b=office[(k*3+4)%14];const q=((t*1.1+k/16)%1);blah(c,lerp(a.x,b.x,q),lerp(a.y,b.y,q)-60-Math.sin(q*Math.PI)*80,0.9,Math.sin(q*Math.PI));}
for(let k=0;k<22;k++){const src=office[(k*7)%14];const ang=k*2.4+1;const q=((t*0.9+k/22)%1);coin(c,src.x+Math.cos(ang)*q*260,src.y+Math.sin(ang)*q*260,10);}
if(t<3.6){c.strokeStyle=G;c.lineCap='round';for(let h=0;h<Math.min(hi,hops.length-1);h++){const a=office[hops[h]],b=office[hops[h+1]];c.lineWidth=Math.max(2,11-h*1.6);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}
const a=office[hops[hi]],b=office[hops[Math.min(hi+1,hops.length-1)]];const bx=lerp(a.x,b.x,hf),by=lerp(a.y,b.y,hf);c.lineWidth=Math.max(2,11-hi*1.6);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(bx,by);c.stroke();}
office.forEach((n,i)=>{const hold=t<3.6&&i===hops[Math.min(hi+(hf>0.5?1:0),hops.length-1)];bean(c,n.x,n.y,1.5*n.cs,{col:GRAY,mood:'happy',arms:true,wave:t*5+n.ph,look:[Math.sin(t+n.ph),0],t});});
if(t<3.6){const a=office[hops[hi]],b=office[hops[Math.min(hi+1,hops.length-1)]];glow(c,lerp(a.x,b.x,hf),lerp(a.y,b.y,hf)-10,14);}
const hr=9+Math.floor(sm(0,3.5,t)*8);c.fillStyle='#232833';rr(c,60,1700,230,90,20);c.fill();small(c,`${hr}:00`,175,1765,64,'#b9bec8',1,SERIF);
if(t>=3.6){const p=sm(3.6,4.2,t),fall=sm(5.2,6,t);const hx=lerp(office[hops[hops.length-1]].x,540,p),hy=lerp(office[hops[hops.length-1]].y,1260,p)+fall*500;
c.fillStyle='rgba(22,26,33,0.8)';c.fillRect(0,0,1080,1920);
c.strokeStyle='#e8e4da';c.lineWidth=6;c.beginPath();c.moveTo(640,1320);c.lineTo(640,1080);c.stroke();c.fillStyle=G;c.beginPath();c.moveTo(640,1080);c.lineTo(760,1120);c.lineTo(640,1160);c.fill();
c.fillStyle='#2a303b';rr(c,240,1320,600,40,20);c.fill();
if(t>5.1){const hole=sm(5.1,5.4,t);c.fillStyle='#050608';c.beginPath();c.ellipse(540,1340,230*hole,60*hole,0,0,6.283);c.fill();}
if(t>4.2&&t<5.3){for(let k=0;k<40;k++){const q=((t-4.2)*1.3+k*0.017)%1.4;const x=540+Math.cos(k*2.39)*(80+q*420),y=900+Math.sin(k*1.7)*200+q*q*500;c.fillStyle=k%2?G:'#e8e4da';c.fillRect(x,y,14,22);}}
const s=lerp(2.6,1.4,fall);c.save();c.globalAlpha=1-sm(5.7,6,t);bean(c,hx,hy,s,{col:GRAY,mood:t>5.15?'panic':'happy',arms:true,armsUp:true,wave:t*10,look:[0,-1],t});glow(c,hx+s*34,hy-s*40,16);c.restore();
if(t<5.15)headline(c,[{text:'LEVEL COMPLETE!',col:G},{text:"We're saved!"}],360,120,sm(4.1,4.25,t));
else headline(c,[{text:'...oh no.'}],430,130,sm(5.2,5.35,t));}
else headline(c,[{text:'Can you follow'},{text:'the green?',col:G}],300,130,1);
}
else if(t<8.5){
const lt=t-6;c.fillStyle='#10131a';c.fillRect(0,0,1080,1920);maze(c,80,620,920,1000);
const x=lerp(200,330,sm(0,2.5,lt)),y=1480;bean(c,x,y,2,{col:GRAY,mood:'happy',arms:true,legs:t*3,t,look:[1,0]});glow(c,x+70,y-60,15);
c.strokeStyle='rgba(232,228,218,0.25)';c.lineWidth=4;for(let k=0;k<3;k++){c.beginPath();c.moveTo(x-90-k*30,y-40+k*30);c.lineTo(x-60-k*30,y-40+k*30);c.stroke();}
stamp(c,'NEEDS CONSENSUS',540,820,-0.08,sm(6.3,6.45,t));stamp(c,'SUBMIT FORM 27B',560,1020,0.06,sm(6.9,7.05,t));stamp(c,'WAIT FOR Q3 REVIEW',520,1220,-0.04,sm(7.5,7.65,t));
const lv=t<8?'LEVEL 2':('LEVEL '+(3+Math.floor((t-8)*10)));headline(c,[{text:lv}],360,150,1);
small(c,'(slow motion)',540,460,46,'#8a909b',1,SERIF);
}
else if(t<11.5){
const lt=t-8.5;const z=lerp(2.2,1,sm(0,0.8,lt));c.save();c.translate(540,1120);c.scale(z,z);c.translate(-540+ (1-sm(0,0.8,lt))*270,-1120+(1-sm(0,0.8,lt))*330);
const pw=440,ph=400;for(let i=0;i<6;i++){const ox=80+(i%2)*480,oy=560+Math.floor(i/2)*440;c.fillStyle='#10131a';rr(c,ox,oy,pw,ph,18);c.fill();maze(c,ox,oy,pw,ph);
const bx=ox+100+Math.sin(t*1.5)*6,by=oy+ph-70;bean(c,bx,by,1.7,{col:GRAY,mood:lt>1.5?'panic':'happy',arms:true,wave:t*4,look:[1,-0.3],t});glow(c,bx+58,by-50,13);
const say=((i*0.37+lt*0.6)%1.8)<0.9;if(lt>0.9&&say){c.fillStyle='#e8e4da';rr(c,ox+170,oy+ph-190,250,64,16);c.fill();c.fillStyle='#23262d';c.font=`36px "${HAND}"`;c.textAlign='center';c.fillText(i%2?'anyone else?':'hello??',ox+295,oy+ph-146);}}
c.fillStyle='#2a303b';c.fillRect(530,540,20,1340);for(let k=0;k<2;k++)c.fillRect(70,990+k*440,940,20);c.restore();
headline(c,[{text:"Everyone's on the same level."},{text:'Alone.',col:'#b9bec8'}],300,100,sm(8.55,8.7,t));
}
else{
const lt=t-11.5;c.fillStyle='#0f1218';rr(c,210,520,660,1080,60);c.fill();c.strokeStyle='#3a404c';c.lineWidth=6;c.stroke();
c.fillStyle='#262b35';rr(c,250,570,580,70,35);c.fill();small(c,'find people to work with',540,618,40,'#b9bec8');
c.save();c.beginPath();c.rect(230,660,620,920);c.clip();const kinds=['AD','SALE 70% OFF','you won\u2019t believe this','HOT','hot take','AD','sponsored','HOT','drama','AD'];
const off=(lt*900)%220;for(let k=0;k<7;k++){const idx=(Math.floor(lt*900/220)+k)%kinds.length;const y=660+k*220-off;c.fillStyle='#2a303b';rr(c,250,y+10,580,196,22);c.fill();
if(kinds[idx]==='HOT'){c.fillStyle='#6d6770';c.beginPath();c.ellipse(420,y+108,70,80,0,0,6.283);c.ellipse(560,y+108,70,80,0,0,6.283);c.fill();c.fillStyle='rgba(42,48,59,0.75)';c.fillRect(250,y+10,580,196);small(c,'hot',540,y+124,56,'#b9bec8');}
else small(c,kinds[idx],540,y+128,kinds[idx].length>10?52:74,'#b9bec8',1,kinds[idx].length>10?HAND:SERIF);}c.restore();
const fall=sm(12.7,13.3,t);bean(c,540,1700,2.3,{col:GRAY,mood:'glazed',phone:true,t,look:[0,-1]});
glow(c,lerp(640,820,fall),lerp(1650,1830,fall)+Math.sin(fall*Math.PI)*-60,22);
if(t<13.2)headline(c,[{text:'Searching for'},{text:'collaborators...'}],260,110,sm(11.55,11.7,t)*(1-sm(13.05,13.2,t)));
else headline(c,[{text:'The answer was here'},{text:'the whole time.',col:G}],260,110,sm(13.2,13.35,t));
if(t>14.8){c.fillStyle=`rgba(22,26,33,${sm(14.8,15,t).toFixed(2)})`;c.fillRect(0,0,1080,1920);}
}}

return {draw,DUR,acts:[{start:0,end:3.6,bpm:100},{start:3.6,end:6,bpm:128},{start:6,end:8.5,bpm:70},{start:8.5,end:11.5,bpm:140},{start:11.5,end:15,bpm:110}],cues:[{t:4.2,type:'ding'},{t:5.15,type:'whoosh'},{t:6.3,type:'stamp'},{t:6.9,type:'stamp'},{t:7.5,type:'stamp'},{t:8.5,type:'pop'},{t:11.5,type:'whoosh'},{t:12.8,type:'pop'}]};}
if(typeof module!=='undefined')module.exports=makeScene;