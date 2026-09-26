function makeScene(SERIF,HAND){
const DUR=15;
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const sm=(a,b,t)=>{t=Math.max(0,Math.min(1,(t-a)/(b-a)));return t*t*(3-2*t);};
const lerp=(a,b,f)=>a+(b-a)*f;
const r1=rng(7);
const crowd=[];for(let row=0;row<4;row++)for(let i=0;i<9;i++)crowd.push({x:90+i*112+(row%2)*50+(r1()-0.5)*20,y:1300+row*120,s:1.05+row*0.12,ph:r1()});
const body=[];const r2=rng(11);
const segD=(px,py,ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay;let u=((px-ax)*dx+(py-ay)*dy)/(dx*dx+dy*dy);u=Math.max(0,Math.min(1,u));return Math.hypot(ax+u*dx-px,ay+u*dy-py);};
function inBody(x,y){return Math.hypot(x-540,y-560)<120||(x>405&&x<675&&y>700&&y<1150)||segD(x,y,405,730,250,1110)<50||segD(x,y,675,730,850,1130)<50||segD(x,y,475,1150,445,1600)<62||segD(x,y,605,1150,635,1600)<62||(x>515&&x<565&&y>660&&y<710);}
let guard=0;while(body.length<260&&guard<40000){guard++;const x=180+r2()*740,y=420+r2()*1200;if(!inBody(x,y))continue;if(body.some(b=>Math.hypot(b.x-x,b.y-y)<34))continue;body.push({x,y,ph:r2(),hand:Math.hypot(x-850,y-1140)<85,head:Math.hypot(x-540,y-560)<125});}

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

function draw(c,t){
c.fillStyle='#151b26';c.fillRect(0,0,1080,1920);
if(t<2.6){
const p=sm(0,0.25,t),ding=sm(0.35,0.55,t);
c.save();c.translate(540,1150);const punch=1+0.08*Math.max(0,1-(t-0.35)/0.4)*(t>0.35?1:0);c.scale(punch,punch);
if(t>0.35){c.strokeStyle=`rgba(95,208,138,${(0.7*(1-sm(0.35,1.6,t))).toFixed(2)})`;c.lineWidth=10;for(let k=0;k<14;k++){const a=k/14*6.283,r0=260,r1=r0+120*ding;c.beginPath();c.moveTo(Math.cos(a)*r0,Math.sin(a)*r0-60);c.lineTo(Math.cos(a)*r1,Math.sin(a)*r1-60);c.stroke();}}
c.fillStyle='#1f3a2e';rr(c,-330,190,660,40,20);c.fill();
bean(c,0,0,4.4*p,{mood:t>0.35?'happy':'happy',arms:true,armsUp:t>0.35,wave:t*8,look:[0.6,-0.5],t});
c.fillStyle='#2a3448';rr(c,-110,-120,220,34,14);c.fill();
const vx=150,vy=-190+(t>0.35?-30:40);c.fillStyle='#5fd08a';rr(c,vx-22,vy-60,44,100,12);c.fill();c.fillStyle='#d9f7e4';c.fillRect(vx-26,vy-72,52,18);
c.restore();
if(t>0.35)small(c,'DING!',780,760,90,'#5fd08a',1-sm(1.2,1.8,t));
c.fillStyle='#2a3448';rr(c,380,560,320,70,35);c.fill();small(c,'Jan 13, 2020',540,610,46,'#ebe5d8',1,SERIF);
headline(c,[{text:'The COVID vaccine',size:88},{text:'was designed in',size:88},{text:'2 days.',size:190,col:'#5fd08a'}],230,92,1);
}
else if(t<5.6){
const lt=t-2.6,cyc=Math.floor(lt/0.75),f=(lt%0.75)/0.75;const labs=['patents','export bans','misinformation','who pays?'];const years=['2020','2021','2022','2023'];
small(c,years[Math.min(3,cyc)],540,1500,380,'rgba(235,229,216,0.07)',1,SERIF);
const wallX=790;c.fillStyle='#8f2a24';rr(c,wallX,820,70,620,10);c.fill();c.fillStyle='#b3302a';for(let k=0;k<6;k++){rr(c,wallX+6,840+k*100,58,80,6);c.fill();}
c.save();c.translate(wallX+35,780);c.rotate(-0.05);c.fillStyle='#fffdf7';c.font=`76px "${HAND}"`;const lw=c.measureText(labs[Math.min(3,cyc)]).width+50;rr(c,-lw/2,-70,lw,96,18);c.fill();c.fillStyle='#b3302a';c.textAlign='center';c.fillText(labs[Math.min(3,cyc)],0,0);c.restore();
let x,mood='happy';if(f<0.55){x=lerp(170,wallX-120,sm(0,0.55,f));}else{x=wallX-120-160*Math.sin(sm(0.55,1,f)*Math.PI*0.5);mood='dizzy';}
const y=1180;bean(c,x,y,3.2,{mood,arms:true,legs:f<0.55?t*30:0.01,t,look:[1,0]});
c.fillStyle='#5fd08a';rr(c,x+70,y-40,34,76,10);c.fill();
if(f>0.55){for(let k=0;k<5;k++){const a=t*10+k*1.256;small(c,'★',x+Math.cos(a)*110,y-170+Math.sin(a)*30,44,'#f2c14e');}if(f<0.7)small(c,'BONK',wallX-60,720,70,'#f2c14e',1-sm(0.55,0.75,f));}
headline(c,[{text:'Getting it to everyone'},{text:'took years.'}],270,104,sm(2.6,2.75,t));
}
else if(t<8.8){
const lt=t-5.6;const grow=sm(0,2.6,lt);
c.fillStyle='#9fd8ff';c.save();c.globalAlpha=0.85+0.15*Math.sin(t*14);rr(c,160,520,760,120,24);c.fill();c.restore();small(c,'the feed',540,600,64,'#151b26',1,HAND);
crowd.forEach((b,i)=>{const bob=Math.sin(t*9)*10;bean(c,b.x,b.y+bob,b.s,{mood:'happy',arms:true,armsUp:true,wave:t*9,phone:true,look:[0,-1],t});});
for(let k=0;k<36;k++){const q=(t*0.9+k/36)%1;const src=crowd[k%crowd.length];const cx=lerp(src.x,540,q),cy=lerp(src.y-40,1000,q)-Math.sin(q*Math.PI)*120;c.fillStyle='#f2c14e';c.beginPath();c.arc(cx,cy,12,0,6.283);c.fill();c.strokeStyle='#b8862a';c.lineWidth=2;c.stroke();}
const fs=lerp(2.2,6.4,grow);bean(c,540,1000,fs,{col:'#f2c14e',mood:'greedy',arms:true,wave:t*2,look:[0.3,0.2],t});
c.fillStyle='#fffdf7';rr(c,640,760,380,86,18);c.fill();small(c,'+9 new billionaires',830,818,50,'#8a5516');
headline(c,[{text:'The poorest countries'},{text:'got 0.2% of the doses.',col:'#f2c14e'}],270,98,sm(5.6,5.75,t));
small(c,'Source: People\u2019s Vaccine Alliance, May 2021',540,1830,34,'rgba(235,229,216,0.55)',1,SERIF);
}
else{
const lt=t-8.8;const z=lerp(2.3,1,sm(0,1.3,lt)),cx=lerp(540,560,sm(0,1.3,lt)),cy=lerp(600,1020,sm(0,1.3,lt));
const dim=t>12.2?lerp(1,0.35,sm(12.2,12.8,t)):1;
c.save();c.translate(540,960);c.scale(z,z);c.translate(-cx,-cy);c.globalAlpha=dim;
const glow=0.55+0.45*Math.sin(t*12);c.fillStyle='#2a2f38';rr(c,760,1200,240,210,14);c.fill();c.fillStyle='#3a404c';rr(c,748,1178,264,30,10);c.fill();
c.strokeStyle=`rgba(255,${(90-50*glow)|0},40,${(0.6+0.4*glow).toFixed(2)})`;c.lineWidth=10;c.beginPath();c.ellipse(880,1190,90,12,0,0,6.283);c.stroke();
for(let k=0;k<5;k++){const q=((t*1.2)+k/5)%1;const sx=lerp(850,675,q),sy=lerp(1130,730,q);c.fillStyle=`rgba(255,90,74,${(1-q*1.2).toFixed(2)})`;c.beginPath();c.arc(sx,sy,9,0,6.283);c.fill();}
body.forEach(b=>{const bob=b.hand?Math.sin(t*40+b.ph*9)*3:Math.sin(t*9)*4;
bean(c,b.x,b.y+bob,0.62,{mood:b.hand?'panic':'happy',col:b.hand?'#ffb3a6':'#ebe5d8',arms:!b.hand,armsUp:true,wave:t*9,phone:b.head,look:b.hand?[0,0]:[0,-1],t});});
if(lt>1.2)small(c,'!!!',860,1030,60,'#ff5a4a',Math.min(1,(lt-1.2)*3));
c.restore();c.globalAlpha=1;
if(t<12.2)headline(c,[{text:'The body knew.'},{text:'The head was scrolling.',col:'#9fd8ff'}],250,104,sm(10.1,10.3,t)*(1-sm(12,12.2,t)));
if(t>=12.2){headline(c,[{text:'The problem was'},{text:'never the virus.'}],760,120,sm(12.2,12.4,t));
if(t>13.4){const p=sm(13.4,13.55,t);headline(c,[{text:'It was us.',col:'#ff6a5a'}],1180,lerp(260,200,p),p);}}
if(t>14.75){c.fillStyle=`rgba(255,253,247,${sm(14.75,15,t).toFixed(2)})`;c.fillRect(0,0,1080,1920);}
}}
return {draw,DUR,acts:[{start:0,end:2.6,bpm:100},{start:2.6,end:5.6,bpm:140},{start:5.6,end:8.8,bpm:120},{start:8.8,end:15,bpm:90}],cues:[{t:0.35,type:'ding'},{t:3.01,type:'bonk'},{t:3.76,type:'bonk'},{t:4.51,type:'bonk'},{t:5.26,type:'bonk'},{t:8.8,type:'whoosh'},{t:13.4,type:'hit'}]};}
if(typeof module!=='undefined')module.exports=makeScene;
