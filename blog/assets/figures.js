// Looping figures for blog posts. Each <canvas class="fig" data-fig="name"> is drawn at its real width and
// re-laid out for narrow screens. Colours come from the page's CSS tokens, so light and dark both work.
// Figures only animate while on screen; with reduced motion they show their final frame.
(()=>{
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const C={};
function readColors(){const s=getComputedStyle(document.documentElement);
  for(const k of["ink","muted","line","accent","bg","panel","chip","good"])C[k]=s.getPropertyValue("--"+k).trim()}
readColors();matchMedia("(prefers-color-scheme: dark)").addEventListener("change",readColors);

const clamp=x=>x<0?0:x>1?1:x,seg=(t,a,b)=>clamp((t-a)/(b-a)),ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const MONO='"JetBrains Mono",ui-monospace,monospace',DISP='"Archivo",system-ui,sans-serif';
function txt(x,c,s,X,Y,{size=12,font=MONO,weight=500,align="left",base="middle",alpha=1}={}){
  x.save();x.globalAlpha*=alpha;x.fillStyle=c;x.font=`${weight} ${size}px ${font}`;x.textAlign=align;x.textBaseline=base;x.fillText(s,X,Y);x.restore()}
function pill(x,X,Y,w,h,fill,stroke){x.beginPath();x.roundRect(X,Y,w,h,h/2);if(fill){x.fillStyle=fill;x.fill()}if(stroke){x.strokeStyle=stroke;x.lineWidth=1;x.stroke()}}
function arrowHead(x,X,Y,ang,s,c){x.save();x.fillStyle=c;x.translate(X,Y);x.rotate(ang);x.beginPath();x.moveTo(0,0);x.lineTo(-s,-s*.55);x.lineTo(-s,s*.55);x.closePath();x.fill();x.restore()}
const mix=(a,b,k)=>a+(b-a)*k;

const FIGS={
// 1. Data paradox: the deploy → data → model loop that will not start, then starts
data:{T:12,height:w=>w<480?w*1.05:Math.min(w*.62,400),draw(x,w,h,t){
  const narrow=w<480,cx=w/2,cy=narrow?h*.46:h*.44,R=Math.min(w*(narrow?.25:.2),h*.28),rn=Math.max(24,R*.27);
  const N=[{a:-90,label:"Deployment"},{a:30,label:"Real-world data"},{a:150,label:"Capable model"}];
  const P=a=>[cx+R*Math.cos(a*Math.PI/180),cy+R*Math.sin(a*Math.PI/180)];
  const p1=seg(t,0,4),p2=seg(t,4,8),p3=seg(t,8,11.4);
  // gauges: how full each node is
  const g=[ease(seg(t,8.6,11))*1, ease(seg(t,4.4,7.6))*.5+ease(seg(t,8.4,11))*.5, ease(seg(t,5.4,7.9))*.4+ease(seg(t,8.8,11.2))*.6];
  // arcs (clockwise): deploy→data, data→model, model→deploy
  const gapA=rn/R*180/Math.PI+3;
  for(let i=0;i<3;i++){const a0=N[i].a+gapA,a1=N[i].a+120-gapA,broken=i===2&&t<8;
    x.save();x.lineWidth=2;x.strokeStyle=broken?C.accent:(t>=8?C.good:C.line);
    if(broken)x.setLineDash([5,5]);x.globalAlpha=broken?.9:1;
    x.beginPath();x.arc(cx,cy,R,a0*Math.PI/180,a1*Math.PI/180);x.stroke();x.restore();
    const [ex,ey]=P(a1);arrowHead(x,ex,ey,(a1+90)*Math.PI/180,9,broken?C.accent:(t>=8?C.good:C.line))}
  // broken link label
  if(t<8){const [mx,my]=P(210),al=ease(seg(t,1.8,2.6))*(1-ease(seg(t,7.2,8)));
    txt(x,C.accent,"✕ not reliable enough",narrow?mx+12:mx-12,my,{size:narrow?10:11,align:narrow?"left":"right",alpha:al})}
  // phase 1: a particle tries model → deploy and dies halfway
  if(t<4){const pr=ease(seg(t,.4,2.1))*.5,a=150+gapA+pr*(120-2*gapA),[px,py]=P(a),j=t>2.1&&t<3.2?Math.sin(t*60)*2:0,
      al=1-seg(t,2.6,3.4);x.save();x.globalAlpha=al;x.fillStyle=C.accent;x.beginPath();x.arc(px+j,py,5,0,7);x.fill();x.restore()}
  // phase 2: proxies feed the data node
  const src=[["human video","no forces"],["simulation","sim gap"],["teleop","costly"]],sy=h-(narrow?44:40);
  const sw=narrow?(w-32)/3-6:118,sx0=cx-(sw*3+12*2)/2;
  src.forEach(([s,n],i)=>{const X=sx0+i*(sw+12),al=ease(seg(t,3.8+i*.3,4.4+i*.3))*(1-ease(seg(t,11.2,11.8)));
    x.save();x.globalAlpha=al;pill(x,X,sy-13,sw,26,C.panel,C.line);txt(x,C.ink,s,X+sw/2,sy,{size:narrow?10:11,align:"center"});
    txt(x,C.muted,n,X+sw/2,sy+24,{size:10,align:"center"});x.restore();
    // pulses up to the data node
    if(t>4.2&&t<8.4){const [dx,dy]=P(30);for(let k=0;k<2;k++){const q=((t-4.2-i*.25-k*.9)%1.8)/1.8;if(q<0)continue;
      const X0=X+sw/2,Y0=sy-14,qx=mix(X0,dx,ease(q)),qy=mix(Y0,dy+rn,ease(q));x.save();x.globalAlpha=.85*(1-q*.4);x.fillStyle=C.muted;x.beginPath();x.arc(qx,qy,3,0,7);x.fill();x.restore()}}});
  // data → model pulses during phase 2
  if(t>5.2&&t<8.4){for(let k=0;k<2;k++){const q=((t-5.2-k*.8)%1.6)/1.6,a=30+gapA+q*(120-2*gapA),[px,py]=P(a);
    x.save();x.globalAlpha=.7;x.fillStyle=C.muted;x.beginPath();x.arc(px,py,3.5,0,7);x.fill();x.restore()}}
  // phase 3: the flywheel spins up
  if(t>=8){const sp=ease(seg(t,8,11))*1.4+.35,n=4;for(let k=0;k<n;k++){const ph=((t-8)*sp*.5+k/n)%1,a=-90+ph*360,[px,py]=P(a);
    const nearNode=N.some(nd=>Math.abs(((a-nd.a+540)%360)-180)<gapA-2);if(nearNode)continue;
    x.save();x.fillStyle=C.good;x.beginPath();x.arc(px,py,4.5,0,7);x.fill();x.restore()}}
  // nodes with fill gauges
  N.forEach((nd,i)=>{const [nx,ny]=P(nd.a);x.save();x.fillStyle=C.panel;x.strokeStyle=C.line;x.lineWidth=1.5;x.beginPath();x.arc(nx,ny,rn,0,7);x.fill();x.stroke();
    if(g[i]>0){x.strokeStyle=t>=8?C.good:C.muted;x.lineWidth=4;x.beginPath();x.arc(nx,ny,rn-4,-Math.PI/2,-Math.PI/2+g[i]*2*Math.PI);x.stroke()}
    x.restore();txt(x,C.ink,Math.round(g[i]*100)+"%",nx,ny,{size:11,align:"center"});
    // bottom labels sit under the arc so it never crosses them; on narrow screens the top one moves beside its node
    const top=nd.a===-90,side=top&&narrow,ly=top?(side?ny:ny-rn-14):cy+R+18,lx=side?nx+rn+8:nx;
    txt(x,C.ink,nd.label,lx,ly,{size:narrow?12:13,font:DISP,weight:700,align:side?"left":"center"})});
  // status line
  const st=t<4?["cold start","no deployment → no data → no capable model"]:t<8?["bootstrapping","proxies help, but each misses part of the picture"]:["flywheel","deployment itself becomes the data engine"];
  txt(x,t>=8?C.good:C.accent,st[0].toUpperCase(),16,18,{size:11,weight:500});
  txt(x,C.muted,st[1],16,36,{size:narrow?10:11});
}},

// 2. Value paradox: what is easy to monetise needs little generalisation, and the way out
value:{T:11,height:w=>w<480?w*1.08:Math.min(w*.6,420),draw(x,w,h,t){
  const narrow=w<480,L=narrow?34:56,Rm=narrow?12:24,Tp=narrow?54:44,B=narrow?44:50,pw=w-L-Rm,ph=h-Tp-B;
  const X=v=>L+v*pw,Y=v=>Tp+(1-v)*ph;
  // axes
  x.strokeStyle=C.line;x.lineWidth=1.5;x.beginPath();x.moveTo(L,Tp-6);x.lineTo(L,Tp+ph);x.lineTo(L+pw+4,Tp+ph);x.stroke();
  arrowHead(x,L+pw+8,Tp+ph,0,8,C.line);arrowHead(x,L,Tp-10,-Math.PI/2,8,C.line);
  txt(x,C.muted,"generalization required →",L+pw,Tp+ph+22,{size:narrow?10:11,align:"right"});
  x.save();x.translate(narrow?14:22,Tp+ph);x.rotate(-Math.PI/2);txt(x,C.muted,"ease of monetization →",0,0,{size:narrow?10:11});x.restore();
  // trend band
  const tb=ease(seg(t,2.4,3.6));
  if(tb>0){x.save();x.strokeStyle=C.accent;x.globalAlpha=.16;x.lineWidth=narrow?26:34;x.lineCap="round";x.beginPath();
    x.moveTo(X(.06),Y(.94));x.lineTo(X(mix(.06,.95,tb)),Y(mix(.94,.06,tb)));x.stroke();x.restore()}
  // tasks (positions are illustrative)
  const pts=[["Palletizing",.1,.9],["Machine tending",.22,.78],["Warehouse picking",.38,.62],["Retail restocking",.58,.43],["Small-business tasks",.75,.27],["Household chores",.9,.11]];
  pts.forEach(([n,px,py],i)=>{const k=ease(seg(t,.3+i*.28,.7+i*.28));if(k<=0)return;
    const cxp=X(px),cyp=Y(py)-(1-k)*14;x.save();x.globalAlpha=k;x.fillStyle=i===2&&t>4.2?C.good:C.ink;x.beginPath();x.arc(cxp,cyp,5,0,7);x.fill();x.restore();
    const right=px<.55;txt(x,C.ink,n,cxp+(right?10:-10),cyp-(narrow&&!right?12:0),{size:narrow?10:12,align:right?"left":"right",alpha:k})});
  // the tension
  txt(x,C.accent,"the tension",X(.04),Y(.16),{size:narrow?10:11,alpha:ease(seg(t,3.4,4))*(1-ease(seg(t,9.8,10.4)))});
  // one task, many environments
  const e0=4.4,[_,wx,wy]=pts[2],n=narrow?6:10;
  for(let i=0;i<n;i++){const k=ease(seg(t,e0+i*.22,e0+.6+i*.22))*(1-ease(seg(t,10,10.6)));if(k<=0)continue;
    const sx=wx+(narrow?.42:.3),tx=mix(sx,.97,i/(n-1)),px=X(mix(sx,tx,k)),py=Y(wy);
    x.save();x.globalAlpha=k*.9;x.strokeStyle=C.good;x.lineWidth=1.5;x.beginPath();x.rect(px-5,py-5,10,10);x.stroke();x.restore()}
  const lk=ease(seg(t,5.2,5.8))*(1-ease(seg(t,10,10.6)));
  txt(x,C.good,"same task × 1000 environments",narrow?X(.97)+5:X(wx+.3)-6,Y(wy)-18,{size:narrow?10:11,align:narrow?"right":"left",alpha:lk});
  txt(x,C.muted,"positions are illustrative",w-Rm,14,{size:10,align:"right"});
}},

// 3. Talent paradox: smooth progress in the lab, a stream of failures in the field
talent:{T:9.5,height:w=>w<480?w*1.25:Math.min(w*.5,360),draw(x,w,h,t){
  const narrow=w<480,gap=16,pw=narrow?w-2:(w-gap)/2,ph=narrow?(h-gap)/2:h-2;
  const lab={x:1,y:1},fld=narrow?{x:1,y:ph+gap}:{x:pw+gap,y:1};
  for(const p of[lab,fld]){x.save();x.strokeStyle=C.line;x.fillStyle=C.panel;x.beginPath();x.roundRect(p.x,p.y,pw-1,ph-1,10);x.fill();x.stroke();x.restore()}
  // lab: benchmark curve climbs
  txt(x,C.muted,"LAB",lab.x+14,lab.y+18,{size:11});
  txt(x,C.ink,"benchmark success",lab.x+14,lab.y+38,{size:13,font:DISP,weight:700});
  const cx0=lab.x+18,cx1=lab.x+pw-24,cy0=lab.y+ph-28,cy1=lab.y+64,k=ease(seg(t,.3,5.5));
  x.save();x.strokeStyle=C.line;x.lineWidth=1;x.beginPath();x.moveTo(cx0,cy1);x.lineTo(cx0,cy0);x.lineTo(cx1,cy0);x.stroke();
  x.strokeStyle=C.good;x.lineWidth=2.5;x.beginPath();const f=u=>.55+.38*(1-Math.exp(-3.2*u));
  for(let i=0;i<=60*k;i++){const u=i/60,X=mix(cx0,cx1,u),Y=mix(cy0,cy1,(f(u)-.4)/.6);i?x.lineTo(X,Y):x.moveTo(X,Y)}x.stroke();x.restore();
  const v=Math.round(f(k)*100);txt(x,C.good,v+"%",cx1,cy1-4,{size:20,font:DISP,weight:700,align:"right"});
  txt(x,C.muted,k>.98?"new SOTA ✓":"training…",cx1,cy0+16,{size:10,align:"right"});
  // field: alerts keep arriving
  const mins=Math.floor(mix(133,330,seg(t,0,8.6))),clock=String(Math.floor(mins/60)).padStart(2,"0")+":"+String(mins%60).padStart(2,"0");
  txt(x,C.muted,"FIELD · "+clock,fld.x+14,fld.y+18,{size:11});
  txt(x,C.ink,"customer site, night shift",fld.x+14,fld.y+38,{size:13,font:DISP,weight:700});
  const alerts=["cable fault on axis 4","network dropped","gripper pads worn","camera calibration drift","unexpected object on belt","undocumented workflow step","line must run by 06:00"];
  const rowH=narrow?26:30,top=fld.y+56,maxRows=Math.max(3,Math.floor((ph-70)/rowH));
  const shown=alerts.filter((_,i)=>t>.6+i*1.05).length,first=Math.max(0,shown-maxRows);
  x.save();x.beginPath();x.rect(fld.x,top-2,pw,ph-(top-fld.y)-4);x.clip();
  for(let i=first;i<shown;i++){const appear=ease(seg(t,.6+i*1.05,1+i*1.05)),r=i-first,Y=top+r*rowH,last=i===alerts.length-1;
    x.save();x.globalAlpha=appear;x.translate((1-appear)*20,0);
    x.fillStyle=C.chip;x.beginPath();x.roundRect(fld.x+12,Y,pw-26,rowH-6,5);x.fill();
    x.fillStyle=C.accent;x.fillRect(fld.x+12,Y,3,rowH-6);
    txt(x,last?C.accent:C.ink,(last?"⚠ ":"• ")+alerts[i],fld.x+22,Y+(rowH-6)/2,{size:narrow?11:12});x.restore()}
  x.restore();
}},

// 4. A fleet that learns compounds; a fleet that does not stays flat
fleet:{T:9,height:w=>w<480?w*.95:Math.min(w*.5,360),draw(x,w,h,t){
  const narrow=w<480,L=narrow?30:44,Rm=narrow?10:20,Tp=28,B=narrow?56:52,pw=w-L-Rm,ph=h-Tp-B;
  const X=u=>L+u*pw,Y=v=>Tp+(1-v)*ph,k=ease(seg(t,.4,6.4));
  x.strokeStyle=C.line;x.lineWidth=1.5;x.beginPath();x.moveTo(L,Tp-4);x.lineTo(L,Tp+ph);x.lineTo(L+pw,Tp+ph);x.stroke();
  txt(x,C.muted,"time in the field →",L+pw,Tp+ph+18,{size:narrow?10:11,align:"right"});
  x.save();x.translate(narrow?12:18,Tp+ph);x.rotate(-Math.PI/2);txt(x,C.muted,"capability →",0,0,{size:narrow?10:11});x.restore();
  const flat=u=>.16+.12*Math.min(1,Math.floor(u*5)/4),learn=u=>.12+.8*(Math.exp(2.6*u)-1)/(Math.exp(2.6)-1);
  const line=(fn,c,wd,dash)=>{x.save();x.strokeStyle=c;x.lineWidth=wd;if(dash)x.setLineDash(dash);x.beginPath();
    for(let i=0;i<=100*k;i++){const u=i/100;i?x.lineTo(X(u),Y(fn(u))):x.moveTo(X(u),Y(fn(u)))}x.stroke();x.restore()};
  line(flat,C.muted,2,[5,5]);line(learn,C.good,3);
  // learning signals rise from the fleet into the curve
  const sig=["intervention","failure","new site","success"];
  for(let i=0;i<14;i++){const born=.6+i*.4,q=seg(t,born,born+1.1);if(q<=0||q>=1||born>6.6)continue;
    const u=clamp((born-.4)/6+.02),sx=X(u),sy=Tp+ph+26,ty=Y(learn(u));
    x.save();x.globalAlpha=1-q*.3;x.fillStyle=C.good;x.beginPath();x.arc(sx,mix(sy,ty,ease(q)),3,0,7);x.fill();x.restore();
    if(i%4===1&&q<.5)txt(x,C.muted,sig[(i>>2)%4],sx+6,sy-4,{size:10,alpha:1-q*2})}
  // fleet row
  const robots=Math.floor(mix(1,narrow?14:26,k));for(let i=0;i<robots;i++){const rx=X((i+.5)/(narrow?14:26));
    x.fillStyle=C.ink;x.globalAlpha=.55;x.fillRect(rx-3,Tp+ph+28,6,8);x.globalAlpha=1}
  const e=ease(seg(t,6,6.8));
  txt(x,C.good,"a fleet that learns: a compounding asset",X(.03),Y(.82),{size:narrow?10:12,alpha:e});
  txt(x,C.muted,"a fleet that does not learn: just a fleet",X(1),Y(.07),{size:narrow?10:12,align:"right",alpha:e});
}}
};

// exposed so the figures can be rendered off screen (e.g. exported as GIFs)
window.PIFigures={FIGS,colors:C,ease,seg};

// ---------- runner ----------
const figs=[...document.querySelectorAll("canvas.fig")].map(cv=>({cv,x:cv.getContext("2d"),f:FIGS[cv.dataset.fig],t0:0,vis:false,w:0,h:0})).filter(o=>o.f);
function size(o){const w=o.cv.parentElement.clientWidth,h=Math.round(o.f.height(w)),d=Math.min(devicePixelRatio||1,2);
  o.w=w;o.h=h;o.cv.style.height=h+"px";o.cv.width=w*d;o.cv.height=h*d;o.x.setTransform(d,0,0,d,0,0)}
function paint(o,t){const {x,w,h,f}=o;x.clearRect(0,0,w,h);const fade=1-ease(seg(t,f.T-.5,f.T));
  x.save();x.globalAlpha=reduce?1:Math.max(fade,ease(seg(t,0,.3)));f.draw(x,w,h,t);x.restore()}
figs.forEach(o=>{size(o);new ResizeObserver(()=>size(o)).observe(o.cv.parentElement);
  new IntersectionObserver(es=>{o.vis=es[0].isIntersecting;if(o.vis&&!o.t0)o.t0=performance.now()}).observe(o.cv)});
// ?figt=6 freezes every figure at that second, for checking layouts
const ft=parseFloat(new URLSearchParams(location.search).get("figt"));
if(reduce||ft>=0){const fr=o=>paint(o,ft>=0?Math.min(ft,o.f.T-.6):o.f.T-.6);figs.forEach(o=>{fr(o);new ResizeObserver(()=>fr(o)).observe(o.cv.parentElement)});return}
let last=0;
const loop=now=>{requestAnimationFrame(loop);if(now-last<32)return;last=now;
  for(const o of figs)if(o.vis)paint(o,((now-o.t0)/1000)%o.f.T)};
requestAnimationFrame(loop);
})();
