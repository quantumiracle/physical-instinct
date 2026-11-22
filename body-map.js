// Humanoid body map on the home page: a 3D line-art humanoid drawn on canvas, with one hotspot per module.
// To link a module or a method to a page, add an href to its entry in MODULES below (paths are relative to the home page).
(()=>{
const MODULES=[
  {id:"brain",n:"01",en:"Brain",zh:"大脑",layer:"brain",hz:"~1–10 Hz",a:[0,1.635,.015],inset:1,side:"R",ly:.07,
    role:{en:"Slow, deliberate loop. Reads the scene and the instruction, breaks the task into steps and decides what to do next.",
          zh:"慢回路，负责理解与决策：看懂场景和指令，把任务拆成步骤，决定下一步做什么。"},
    methods:[{en:"VLM reasoning & task planning",zh:"VLM 推理与任务规划"},
             {en:"VLA: vision-language-action policies",zh:"VLA：视觉-语言-动作策略"},
             {en:"World models & world-action models",zh:"世界模型与世界-动作模型 (WAM)"}],
    train:{en:"Web-scale VLM pretraining → co-training on robot data (teleop, UMI, egocentric video) → post-training with RL or human feedback.",
           zh:"互联网规模 VLM 预训练 → 机器人数据联合训练（遥操作、UMI、第一视角视频）→ RL 或人类反馈后训练。"},
    links:[{en:"Tech Routes",zh:"技术路线",href:"robot-tech-routes/"},{en:"Models",zh:"模型",href:"robot-model-spectrum/"},{en:"Datasets",zh:"数据集",href:"robot-dataset-spectrum/"}]},
  {id:"cere",n:"02",en:"Cerebellum",zh:"小脑",layer:"cere",hz:"~50–1000 Hz",a:[0,1.548,-.07],inset:1,side:"R",ly:.17,
    role:{en:"Fast, reflexive loop. Turns intent from the brain into stable whole-body motion: keeps balance, coordinates limbs, absorbs contact.",
          zh:"快回路，负责运动与平衡：把大脑的意图变成稳定的全身动作，保持平衡、协调四肢、吸收接触冲击。"},
    methods:[{en:"Whole-body control (WBC) & MPC",zh:"全身控制 (WBC) 与 MPC"},
             {en:"RL motor policies, sim2real",zh:"强化学习运动策略与 sim2real"},
             {en:"Human motion tracking & retargeting",zh:"人体动作跟踪与重定向"}],
    train:{en:"Massively parallel RL in simulation with domain randomization, teacher→student distillation, and imitation of human mocap.",
           zh:"GPU 并行仿真中的强化学习加域随机化，教师→学生蒸馏，以及模仿人体动捕数据。"},
    links:[{en:"Sim2Real route",zh:"Sim2Real 路线",href:"robot-tech-routes/sim2real/"},{en:"Simulation",zh:"仿真",href:"robot-sim-spectrum/"},{en:"Benchmarks",zh:"评测",href:"robot-benchmark-spectrum/"}]},
  {id:"sense",n:"03",en:"Head sensors",zh:"头部感知",layer:"body",hz:"cams 30–90 fps",a:[0,1.6,.118],inset:1,side:"R",ly:.27,
    role:{en:"Eyes and inner ear: RGB, stereo or depth cameras, sometimes LiDAR, plus an IMU. Proprioception comes from joint encoders across the body.",
          zh:"眼睛与前庭：RGB、双目或深度相机，部分加 LiDAR，再加 IMU。本体感觉来自全身关节编码器。"},
    methods:[{en:"Visual representation learning",zh:"视觉表征学习"},{en:"State estimation & SLAM",zh:"状态估计与 SLAM"},{en:"Active perception (where to look)",zh:"主动感知（看哪里）"}],
    links:[{en:"Hardware",zh:"硬件",href:"robot-hardware-spectrum/"}]},
  {id:"torso",n:"04",en:"Torso & waist",zh:"躯干与腰",layer:"body",a:[-.13,1.25,.1],side:"L",ly:.26,
    role:{en:"Trunk and waist. Waist joints extend reach and let the robot bend; the torso houses compute and battery.",
          zh:"躯干与腰。腰部关节扩展够取范围、支持弯腰；躯干内放计算单元和电池。"},
    methods:[{en:"Loco-manipulation (walk while handling)",zh:"移动操作（边走边操作）"},{en:"Centroidal dynamics & balance",zh:"质心动力学与平衡"}],
    links:[]},
  {id:"arms",n:"05",en:"Arms",zh:"手臂",layer:"body",a:[-.285,1.08,.02],side:"L",ly:.44,
    role:{en:"Reach and place. Usually 7 DoF per arm, with motors packed near the shoulder to keep the arm light.",
          zh:"够取与放置。每臂通常 7 自由度，电机集中在肩部以减轻手臂惯量。"},
    methods:[{en:"Impedance / admittance control",zh:"阻抗/导纳控制"},{en:"Teleoperation & motion retargeting",zh:"遥操作与动作重定向"},{en:"Bimanual manipulation policies",zh:"双臂操作策略"}],
    links:[{en:"Benchmarks",zh:"评测",href:"robot-benchmark-spectrum/"}]},
  {id:"hands",n:"06",en:"Hands",zh:"灵巧手",layer:"body",a:[-.3,.76,.07],side:"L",ly:.62,
    role:{en:"Grasp and manipulate. From 1-DoF grippers to 20+ DoF dexterous hands, increasingly with tactile skins.",
          zh:"抓取与操作。从 1 自由度夹爪到 20+ 自由度灵巧手，越来越多配触觉皮肤。"},
    methods:[{en:"Grasping & pick-and-place policies",zh:"抓取与 pick-and-place 策略"},{en:"Dexterous in-hand RL",zh:"灵巧手在手操作 RL"},{en:"Tactile sensing & slip control",zh:"触觉感知与滑移控制"}],
    links:[{en:"Hardware · hands",zh:"硬件 · 灵巧手",href:"robot-hardware-spectrum/?q=hand"},{en:"Tech Routes",zh:"技术路线",href:"robot-tech-routes/"}]},
  {id:"act",n:"07",en:"Joint actuators",zh:"关节执行器",layer:"body",hz:"torque loop ~1–10 kHz",a:[.1,.9,0],side:"R",ly:.58,
    role:{en:"Motor, gearbox and driver at each joint: quasi-direct-drive, planetary, harmonic or linear. Torque density and backdrivability set what the controllers above can do.",
          zh:"每个关节的电机、减速器和驱动器：准直驱、行星、谐波或直线。扭矩密度和反驱性决定了上层控制能做到什么。"},
    methods:[{en:"Torque / current control",zh:"力矩/电流控制"},{en:"Actuator modeling & system ID",zh:"执行器建模与系统辨识"},{en:"Joint-level PD tracking",zh:"关节级 PD 跟踪"}],
    links:[{en:"Hardware",zh:"硬件",href:"robot-hardware-spectrum/"},{en:"Hardware insights",zh:"硬件洞察",href:"robot-hardware-insights/"}]},
  {id:"legs",n:"08",en:"Legs & feet",zh:"腿与足",layer:"body",a:[.115,.3,.02],side:"R",ly:.82,
    role:{en:"Walk, run, climb stairs and recover from pushes.",zh:"行走、奔跑、上下楼梯、抗推恢复。"},
    methods:[{en:"RL locomotion via sim2real",zh:"强化学习步态（sim2real）"},{en:"MPC & ZMP walking",zh:"MPC 与 ZMP 步行"},{en:"Perceptive terrain locomotion",zh:"感知地形的运动控制"}],
    links:[{en:"Sim2Real route",zh:"Sim2Real 路线",href:"robot-tech-routes/sim2real/"},{en:"Benchmarks",zh:"评测",href:"robot-benchmark-spectrum/"}]}
];
const T={en:{hint:"drag to rotate",methods:"Control methods",train:"How it's trained",go:"Go to",none:"Links to come",stack:"control stack"},
         zh:{hint:"拖动旋转",methods:"控制方法",train:"训练方式",go:"相关页面",none:"链接待补",stack:"控制层级"}};
const COL={brain:"#ff3df2",cere:"#3df2ff",body:"#39ff88"};
const BASE="200,255,216";

// ---------- geometry: line segments tagged with a module id ----------
const S=[];// [a,b,mod]
const seg=(a,b,m)=>S.push([a,b,m]);
const poly=(pts,m,closed)=>{for(let i=0;i<pts.length-(closed?0:1);i++)seg(pts[i],pts[(i+1)%pts.length],m)};
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],mul=(a,k)=>[a[0]*k,a[1]*k,a[2]*k];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>{const l=Math.hypot(...a)||1;return mul(a,1/l)};
function basis(d){d=norm(d);const t=Math.abs(d[1])<.9?[0,1,0]:[1,0,0];const u=norm(cross(d,t));return [u,cross(d,u)]}
function circle(c,d,r,n=12){const [u,v]=basis(d),p=[];for(let i=0;i<n;i++){const t=i/n*2*Math.PI;p.push(add(c,add(mul(u,r*Math.cos(t)),mul(v,r*Math.sin(t)))))}return p}
function limb(p,q,r1,r2,m,n=12,ribs=6){const d=sub(q,p),A=circle(p,d,r1,n),B=circle(q,d,r2,n);poly(A,m,1);poly(B,m,1);
  const mid=circle(mul(add(p,q),.5),d,(r1+r2)/2*1.04,n);poly(mid,m,1);
  for(let k=0;k<ribs;k++){const i=Math.round(k*n/ribs)%n;seg(A[i],B[i],m)}}
function ellipsoid(c,rx,ry,rz,m,lat,lon,wob=0){
  for(let i=1;i<lat;i++){const ph=-Math.PI/2+i/lat*Math.PI,ring=[];
    for(let j=0;j<24;j++){const th=j/24*2*Math.PI,w=1+wob*Math.sin(th*7+i*2.1);
      ring.push([c[0]+rx*Math.cos(ph)*Math.cos(th)*w,c[1]+ry*Math.sin(ph),c[2]+rz*Math.cos(ph)*Math.sin(th)*w])}
    poly(ring,m,1)}
  for(let j=0;j<lon;j++){const th=j/lon*2*Math.PI,mer=[];
    for(let i=0;i<=16;i++){const ph=-Math.PI/2+i/16*Math.PI,w=1+wob*Math.sin(ph*6+j*1.7);
      mer.push([c[0]+rx*Math.cos(ph)*Math.cos(th)*w,c[1]+ry*Math.sin(ph),c[2]+rz*Math.cos(ph)*Math.sin(th)*w])}
    poly(mer,m,0)}}
function sring(y,w,d,n=20,zc=0){const p=[];for(let i=0;i<n;i++){const t=i/n*2*Math.PI,c=Math.cos(t),s=Math.sin(t);
  p.push([w/2*Math.sign(c)*Math.abs(c)**.5,y,zc+d/2*Math.sign(s)*Math.abs(s)**.5])}return p}
function box(c,s,m){const [x,y,z]=c,[a,b,e]=mul(s,.5),v=[];for(const i of[-1,1])for(const j of[-1,1])for(const k of[-1,1])v.push([x+i*a,y+j*b,z+k*e]);
  [[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]].forEach(([i,j])=>seg(v[i],v[j],m))}

// head: shell, brain, cerebellum, visor
ellipsoid([0,1.585,0],.1,.125,.112,"shell",5,8);
ellipsoid([0,1.625,.012],.072,.05,.078,"brain",6,9,.07);
ellipsoid([0,1.548,-.068],.042,.024,.03,"cere",8,4);
poly([[0,1.548,-.04],[0,1.53,-.03],[0,1.49,-.035]],"cere");          // brainstem
poly([[0,1.49,-.035],[0,1.42,-.05],[0,1.25,-.085],[0,1.05,-.075],[0,.95,-.06]],"cere"); // spinal cord
{const v=[];for(let i=0;i<=12;i++){const t=-1.1+i/12*2.2;v.push([.104*Math.sin(t),1.6,.115*Math.cos(t)])}poly(v,"sense");
 const v2=v.map(p=>[p[0],p[1]-.035,p[2]]);poly(v2,"sense");seg(v[0],v2[0],"sense");seg(v[12],v2[12],"sense");
 for(const x of[-.035,.035])poly(circle([x,1.583,.112],[0,0,1],.013,10),"sense",1)}
// neck + torso
limb([0,1.4,-.01],[0,1.47,-.01],.045,.04,"torso",10,4);
const lv=[[1.40,.40,.19],[1.30,.41,.22],[1.18,.36,.21],[1.08,.29,.18],[1.0,.31,.19],[.9,.29,.17]].map(([y,w,d])=>sring(y,w,d));
lv.forEach(r=>poly(r,"torso",1));
for(let k=0;k<lv.length-1;k++)for(let i=0;i<20;i+=2)seg(lv[k][i],lv[k+1][i],"torso");
for(const s of[-1,1]){
  // arm
  const Sh=[s*.25,1.36,0],El=[s*.285,1.08,.02],Wr=[s*.295,.84,.06];
  limb(Sh,El,.052,.044,"arms");limb(El,Wr,.04,.032,"arms");
  // hand
  box([s*.298,.775,.07],[.03,.075,.075],"hands");
  for(let f=0;f<4;f++){const z=.04+f*.02;poly([[s*.298,.737,z],[s*.3,.7,z+.008],[s*.296,.672,z+.02]],"hands")}
  poly([[s*.29,.77,.108],[s*.282,.745,.13],[s*.276,.725,.138]],"hands");
  // leg
  const Hp=[s*.1,.9,0],Kn=[s*.11,.5,.02],An=[s*.11,.09,0];
  limb(Hp,Kn,.075,.056,"legs");limb(Kn,An,.052,.036,"legs");
  box([s*.11,.03,.055],[.09,.05,.23],"legs");
  // joint actuators
  for(const [p,r] of [[Sh,.066],[El,.052],[Wr,.04],[Hp,.088],[Kn,.064],[An,.046]]){
    poly(circle(p,[1,0,0],r,14),"act",1);poly(circle(p,[0,0,1],r*.8,14),"act",1)}
}
poly(sring(1.13,.33,.2,20),"act",1);// waist actuator
const HEAD=new Set(["shell","brain","cere","sense"]),HC=[0,1.585,0],HR=.135;

// ---------- DOM ----------
const sec=document.getElementById("bp");if(!sec)return;
const stage=document.getElementById("bpStage"),cv=document.getElementById("bpCv"),cx=cv.getContext("2d");
const labels=document.getElementById("bpLabels"),chips=document.getElementById("bpChips"),panel=document.getElementById("bpPanel"),stack=document.getElementById("bpStack");
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
let lang="en";try{const u=new URLSearchParams(location.search).get("lang");lang=(u==="zh"||u==="en")?u:(localStorage.getItem("robot-atlas-lang")==="zh"?"zh":"en")}catch(e){}
let sel="brain";
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const colOf=m=>COL[m.layer];

MODULES.forEach(m=>{
  const b=document.createElement("button");b.className="bp-lb "+(m.side==="L"?"l":"r");b.dataset.id=m.id;b.style.setProperty("--c",colOf(m));
  b.innerHTML=`<span class="n">${m.n}</span><span class="t">${esc(m.en)}</span><span class="z">${esc(m.zh)}</span>`;labels.appendChild(b);
  const c=document.createElement("button");c.className="bp-chip";c.dataset.id=m.id;c.style.setProperty("--c",colOf(m));
  c.innerHTML=`<i></i>${m.n} <span class="t"></span>`;chips.appendChild(c);
});
sec.addEventListener("click",e=>{const b=e.target.closest("[data-id]");if(b&&sec.contains(b)){select(b.dataset.id)}});
function select(id){sel=id;render();draw()}
function render(){
  const t=T[lang],m=MODULES.find(x=>x.id===sel);
  sec.querySelectorAll("[data-id]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.id===sel)));
  chips.querySelectorAll(".bp-chip").forEach(c=>{const x=MODULES.find(y=>y.id===c.dataset.id);c.querySelector(".t").textContent=x[lang]});
  sec.querySelector(".bp-hint").textContent=t.hint;
  sec.querySelectorAll(".bp-lang button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.v===lang)));
  stack.innerHTML=`<span class="lb">${t.stack}</span>`+["brain","cere","act"].map(id=>{const x=MODULES.find(y=>y.id===id);
    return `<button data-id="${id}" style="--c:${colOf(x)}" aria-pressed="${id===sel}">${esc(x[lang])} <small>${esc(x.hz)}</small></button>`}).join('<span class="ar">→</span>');
  const li=a=>a.map(x=>x.href?`<li><a href="${esc(x.href)}">${esc(x[lang])} ↗</a></li>`:`<li>${esc(x[lang])}</li>`).join("");
  panel.style.setProperty("--c",colOf(m));
  panel.innerHTML=`<div class="ph"><span class="tg">${m.n} // ${m.layer==="body"?(lang==="zh"?"本体":"body"):(lang==="zh"?"控制":"control")}</span>
    <h3>${esc(m[lang])} <span>${esc(lang==="zh"?m.en:m.zh)}</span></h3>${m.hz?`<span class="hz">${esc(m.hz)}</span>`:""}</div>
    <p class="role">${esc(m.role[lang])}</p>
    <div class="pc"><div><h4>${t.methods}</h4><ul>${li(m.methods)}</ul></div>
    ${m.train?`<div><h4>${t.train}</h4><p>${esc(m.train[lang])}</p></div>`:""}
    <div><h4>${t.go}</h4>${m.links.length?`<ul class="go">${li(m.links)}</ul>`:`<p class="dim">${t.none}</p>`}</div></div>`;
}
sec.querySelector(".bp-lang").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;lang=b.dataset.v;
  try{localStorage.setItem("robot-atlas-lang",lang)}catch(x){}render()});

// ---------- projection & drawing ----------
let W=0,H=0,dpr=1,wide=true,L={},yaw=0,yawOff=0,pitch=-.1,t0=performance.now(),tNow=0;
function layout(){
  const r=stage.getBoundingClientRect();W=r.width;H=r.height;dpr=Math.min(devicePixelRatio||1,2);
  cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);wide=W>=640;
  stage.classList.toggle("narrow",!wide);
  const sc=H*(wide?.86:.8)/1.75;
  L=wide?{ox:W*.37,oy:H*.5,sc,ic:[W*.655,H*.28],ir:Math.min(H*.22,W*.13)}
        :{ox:W*.34,oy:H*.52,sc,ic:[W*.75,H*.2],ir:Math.min(W*.21,H*.17)};
  labels.querySelectorAll(".bp-lb").forEach(b=>{const m=MODULES.find(x=>x.id===b.dataset.id);b.style.top=(m.ly*H)+"px"});
  MODULES.forEach(m=>{const b=labels.querySelector(`[data-id="${m.id}"]`);
    m.lp=wide?[m.side==="L"?b.offsetLeft+b.offsetWidth+4:b.offsetLeft-4,m.ly*H]:null});
}
const D=4.2,CY=.875;
// projector with the rotation precomputed once per frame
function proj(yw){const c=Math.cos(yw),s=Math.sin(yw),cp=Math.cos(pitch),sp=Math.sin(pitch),ox=L.ox,oy=L.oy,sc=L.sc;
  return p=>{const x=p[0],y=p[1]-CY,z=p[2],X=x*c+z*s,Z0=-x*s+z*c,Y=y*cp-Z0*sp,Z=y*sp+Z0*cp,k=D/(D-Z)*sc;return [ox+X*k,oy-Y*k,Z]}}
let P=proj(0);
const toInset=(q,hc,z)=>[L.ic[0]+(q[0]-hc[0])*z,L.ic[1]+(q[1]-hc[1])*z,q[2]];
const lineCol=m=>m==="brain"?COL.brain:m==="cere"?COL.cere:m===sel?COL.body:null;
// one path per (colour, depth band) instead of one stroke per segment
const NB=4,BUCKET=new Map();
function strokeSegs(list,map){
  BUCKET.forEach(a=>a.length=0);
  for(const [a,b,m] of list){const A=map(a),B=map(b),c=lineCol(m)||"base",
    zf=Math.max(0,Math.min(.999,((A[2]+B[2])/2+.25)/.5)),key=c+"|"+((zf*NB)|0);
    let arr=BUCKET.get(key);if(!arr)BUCKET.set(key,arr=[]);arr.push(A[0],A[1],B[0],B[1])}
  const path=arr=>{cx.beginPath();for(let i=0;i<arr.length;i+=4){cx.moveTo(arr[i],arr[i+1]);cx.lineTo(arr[i+2],arr[i+3])}};
  // base lines first, highlighted lines on top with a cheap two-pass glow
  for(const hot of[false,true])BUCKET.forEach((arr,key)=>{if(!arr.length)return;const [c,bk]=key.split("|"),zf=(+bk+.5)/NB,on=c!=="base";
    if(on!==hot)return;path(arr);
    if(on){cx.strokeStyle=c;cx.globalAlpha=.16*(.45+.55*zf);cx.lineWidth=4;cx.stroke();cx.globalAlpha=.45+.55*zf;cx.lineWidth=1.3}
    else{cx.strokeStyle=`rgb(${BASE})`;cx.globalAlpha=.1+.32*zf;cx.lineWidth=1}
    cx.stroke()});
  cx.globalAlpha=1}
const HS=S.filter(s=>HEAD.has(s[2]));
let anchors=[];
function draw(){
  if(!W)return;cx.clearRect(0,0,W,H);
  yaw=yawOff+(reduce?-.35:-.35+.5*Math.sin(tNow*.00025));
  // body
  P=proj(yaw);strokeSegs(S,P);
  // inset: zoomed head
  const hc=P(HC),hcR=P([HC[0],HC[1]+HR,HC[2]]),Pi=proj(yaw-1.05),hci=Pi(HC),zoom=L.ir*.78/Math.max(4,Math.abs(hc[1]-hcR[1]));
  const [ix,iy]=L.ic,ir=L.ir;
  cx.save();cx.strokeStyle="rgba(200,255,216,.28)";cx.setLineDash([3,4]);cx.lineWidth=1;
  cx.beginPath();cx.arc(hc[0],hc[1],Math.abs(hc[1]-hcR[1])*1.15,0,7);cx.stroke();
  const ang=Math.atan2(iy-hc[1],ix-hc[0]),hr=Math.abs(hc[1]-hcR[1])*1.15;
  cx.beginPath();cx.moveTo(hc[0]+hr*Math.cos(ang),hc[1]+hr*Math.sin(ang));cx.lineTo(ix-ir*Math.cos(ang),iy-ir*Math.sin(ang));cx.stroke();cx.restore();
  cx.save();cx.fillStyle="rgba(5,10,7,.88)";cx.beginPath();cx.arc(ix,iy,ir,0,7);cx.fill();
  cx.strokeStyle="rgba(200,255,216,.35)";cx.lineWidth=1;cx.stroke();cx.clip();
  const im=p=>toInset(Pi(p),hci,zoom);
  strokeSegs(HS,im);cx.restore();
  cx.fillStyle="rgba(200,255,216,.45)";cx.font="10px JetBrains Mono, monospace";cx.textAlign="center";
  cx.fillText(lang==="zh"?"细节 A · 头部侧视":"DETAIL A · HEAD, SIDE",ix,iy+ir+13);
  // anchors + leaders
  anchors=[];
  for(const m of MODULES){const p=m.inset?im(m.a):P(m.a),on=m.id===sel,c=colOf(m);anchors.push([m.id,p]);
    if(m.lp){cx.strokeStyle=c;cx.globalAlpha=on?.95:.35;cx.lineWidth=1;cx.beginPath();
      const ex=m.lp[0]+(m.side==="L"?14:-14);cx.moveTo(m.lp[0],m.lp[1]);cx.lineTo(ex,m.lp[1]);cx.lineTo(p[0],p[1]);cx.stroke()}
    cx.globalAlpha=1;cx.fillStyle="#050807";cx.strokeStyle=c;cx.lineWidth=on?2:1.2;
    const r=wide?(on?4.5:3.2):(on?9:8);cx.beginPath();cx.arc(p[0],p[1],r,0,7);cx.fill();cx.stroke();
    if(!wide){cx.fillStyle=c;cx.font="700 9px JetBrains Mono, monospace";cx.textAlign="center";cx.textBaseline="middle";cx.fillText(+m.n,p[0],p[1]+.5);cx.textBaseline="alphabetic"}
  }
}
// interaction: drag rotates, a tap near a hotspot selects it
let drag=null;
cv.addEventListener("pointerdown",e=>{drag={x:e.clientX,y:e.clientY,o:yawOff,moved:false};cv.setPointerCapture(e.pointerId)});
cv.addEventListener("pointermove",e=>{if(!drag){const r=cv.getBoundingClientRect(),h=hit(e.clientX-r.left,e.clientY-r.top);cv.style.cursor=h?"pointer":"grab";return}
  const dx=e.clientX-drag.x;if(Math.abs(dx)>4)drag.moved=true;yawOff=drag.o+dx*.01;if(reduce)draw()});
const end=e=>{if(!drag)return;if(!drag.moved){const r=cv.getBoundingClientRect(),h=hit(e.clientX-r.left,e.clientY-r.top);if(h)select(h)}drag=null};
cv.addEventListener("pointerup",end);cv.addEventListener("pointercancel",()=>{drag=null});
function hit(x,y){let best=null,bd=wide?16:20;for(const [id,p] of anchors){const d=Math.hypot(p[0]-x,p[1]-y);if(d<bd){bd=d;best=id}}return best}

let vis=false,raf=0;
let last=0;// cap at ~30 fps; the rotation is slow so more frames add nothing
const loop=t=>{raf=0;if(!vis)return;if(t-last>=32){last=t;tNow=t-t0;draw()}if(!reduce)raf=requestAnimationFrame(loop)};
new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis&&!raf)raf=requestAnimationFrame(loop)}).observe(stage);
new ResizeObserver(()=>{layout();draw()}).observe(stage);
render();
})();
