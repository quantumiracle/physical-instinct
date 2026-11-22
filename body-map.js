// Humanoid body map on the home page: a hidden-line drawing of the Unitree G1 (29-DoF URDF, BSD-3), one hotspot per module.
// Geometry: assets/g1/g1-mesh.bin, simplified from unitreerobotics/unitree_ros g1_description at the URDF zero pose.
// Frame: metres, x = robot's left, y = up (feet at 0), z = forward. Anchors (a) are in that frame; brain/cere are set from the head mesh.
// To link a module or a method to a page, add an href to its entry in MODULES below (paths are relative to the home page).
(()=>{
const MODULES=[
  {id:"brain",n:"01",en:"Brain",zh:"大脑",layer:"brain",hz:"~1–10 Hz",a:null,inset:1,side:"R",
    role:{en:"Slow, deliberate loop. Reads the scene and the instruction, breaks the task into steps and decides what to do next.",
          zh:"慢回路，负责理解与决策：看懂场景和指令，把任务拆成步骤，决定下一步做什么。"},
    methods:[{en:"VLM reasoning & task planning",zh:"VLM 推理与任务规划"},
             {en:"VLA: vision-language-action policies",zh:"VLA：视觉-语言-动作策略"},
             {en:"World models & world-action models",zh:"世界模型与世界-动作模型 (WAM)"}],
    train:{en:"Web-scale VLM pretraining → co-training on robot data (teleop, UMI, egocentric video) → post-training with RL or human feedback.",
           zh:"互联网规模 VLM 预训练 → 机器人数据联合训练（遥操作、UMI、第一视角视频）→ RL 或人类反馈后训练。"},
    links:[{en:"Tech Routes",zh:"技术路线",href:"robot-tech-routes/"},{en:"Models",zh:"模型",href:"robot-model-spectrum/"},{en:"Datasets",zh:"数据集",href:"robot-dataset-spectrum/"}]},
  {id:"cere",n:"02",en:"Cerebellum",zh:"小脑",layer:"cere",hz:"~50–1000 Hz",a:null,inset:1,side:"R",
    role:{en:"Fast, reflexive loop. Turns intent from the brain into stable whole-body motion: keeps balance, coordinates limbs, absorbs contact.",
          zh:"快回路，负责运动与平衡：把大脑的意图变成稳定的全身动作，保持平衡、协调四肢、吸收接触冲击。"},
    methods:[{en:"Whole-body control (WBC) & MPC",zh:"全身控制 (WBC) 与 MPC"},
             {en:"RL motor policies, sim2real",zh:"强化学习运动策略与 sim2real"},
             {en:"Human motion tracking & retargeting",zh:"人体动作跟踪与重定向"}],
    train:{en:"Massively parallel RL in simulation with domain randomization, teacher→student distillation, and imitation of human mocap.",
           zh:"GPU 并行仿真中的强化学习加域随机化，教师→学生蒸馏，以及模仿人体动捕数据。"},
    links:[{en:"Sim2Real route",zh:"Sim2Real 路线",href:"robot-tech-routes/sim2real/"},{en:"Simulation",zh:"仿真",href:"robot-sim-spectrum/"},{en:"Benchmarks",zh:"评测",href:"robot-benchmark-spectrum/"}]},
  {id:"sense",n:"03",en:"Head sensors",zh:"头部感知",layer:"body",hz:"cams 30–90 fps",a:[.018,1.266,.06],inset:1,side:"R",
    role:{en:"Eyes and inner ear: RGB, stereo or depth cameras, sometimes LiDAR, plus an IMU. Proprioception comes from joint encoders across the body.",
          zh:"眼睛与前庭：RGB、双目或深度相机，部分加 LiDAR，再加 IMU。本体感觉来自全身关节编码器。"},
    methods:[{en:"Visual representation learning",zh:"视觉表征学习"},{en:"State estimation & SLAM",zh:"状态估计与 SLAM"},{en:"Active perception (where to look)",zh:"主动感知（看哪里）"}],
    links:[{en:"Hardware",zh:"硬件",href:"robot-hardware-spectrum/"}]},
  {id:"torso",n:"04",en:"Torso & waist",zh:"躯干与腰",layer:"body",a:[-.07,1.0,.085],side:"L",
    role:{en:"Trunk and waist. Waist joints extend reach and let the robot bend; the torso houses compute and battery.",
          zh:"躯干与腰。腰部关节扩展够取范围、支持弯腰；躯干内放计算单元和电池。"},
    methods:[{en:"Loco-manipulation (walk while handling)",zh:"移动操作（边走边操作）"},{en:"Centroidal dynamics & balance",zh:"质心动力学与平衡"}],
    links:[]},
  {id:"arms",n:"05",en:"Arms",zh:"手臂",layer:"body",a:[-.15,.98,0],side:"L",
    role:{en:"Reach and place. Usually 7 DoF per arm, with motors packed near the shoulder to keep the arm light.",
          zh:"够取与放置。每臂通常 7 自由度，电机集中在肩部以减轻手臂惯量。"},
    methods:[{en:"Impedance / admittance control",zh:"阻抗/导纳控制"},{en:"Teleoperation & motion retargeting",zh:"遥操作与动作重定向"},{en:"Bimanual manipulation policies",zh:"双臂操作策略"}],
    links:[{en:"Benchmarks",zh:"评测",href:"robot-benchmark-spectrum/"}]},
  {id:"hands",n:"06",en:"Hands",zh:"灵巧手",layer:"body",a:[-.15,.88,.27],side:"L",
    role:{en:"Grasp and manipulate. From 1-DoF grippers to 20+ DoF dexterous hands, increasingly with tactile skins.",
          zh:"抓取与操作。从 1 自由度夹爪到 20+ 自由度灵巧手，越来越多配触觉皮肤。"},
    methods:[{en:"Grasping & pick-and-place policies",zh:"抓取与 pick-and-place 策略"},{en:"Dexterous in-hand RL",zh:"灵巧手在手操作 RL"},{en:"Tactile sensing & slip control",zh:"触觉感知与滑移控制"}],
    links:[{en:"Hardware · hands",zh:"硬件 · 灵巧手",href:"robot-hardware-spectrum/?q=hand"},{en:"Tech Routes",zh:"技术路线",href:"robot-tech-routes/"}]},
  {id:"act",n:"07",en:"Joint actuators",zh:"关节执行器",layer:"body",hz:"torque loop ~1–10 kHz",a:[.116,.659,0],side:"R",
    role:{en:"Motor, gearbox and driver at each joint: quasi-direct-drive, planetary, harmonic or linear. Torque density and backdrivability set what the controllers above can do.",
          zh:"每个关节的电机、减速器和驱动器：准直驱、行星、谐波或直线。扭矩密度和反驱性决定了上层控制能做到什么。"},
    methods:[{en:"Torque / current control",zh:"力矩/电流控制"},{en:"Actuator modeling & system ID",zh:"执行器建模与系统辨识"},{en:"Joint-level PD tracking",zh:"关节级 PD 跟踪"}],
    links:[{en:"Hardware",zh:"硬件",href:"robot-hardware-spectrum/"},{en:"Hardware insights",zh:"硬件洞察",href:"robot-hardware-insights/"}]},
  {id:"legs",n:"08",en:"Legs & feet",zh:"腿与足",layer:"body",a:[.12,.2,0],side:"R",
    role:{en:"Walk, run, climb stairs and recover from pushes.",zh:"行走、奔跑、上下楼梯、抗推恢复。"},
    methods:[{en:"RL locomotion via sim2real",zh:"强化学习步态（sim2real）"},{en:"MPC & ZMP walking",zh:"MPC 与 ZMP 步行"},{en:"Perceptive terrain locomotion",zh:"感知地形的运动控制"}],
    links:[{en:"Sim2Real route",zh:"Sim2Real 路线",href:"robot-tech-routes/sim2real/"},{en:"Benchmarks",zh:"评测",href:"robot-benchmark-spectrum/"}]}
];
const T={en:{hint:"drag to rotate",methods:"Control methods",train:"How it's trained",go:"Go to",none:"Links to come",stack:"control stack"},
         zh:{hint:"拖动旋转",methods:"控制方法",train:"训练方式",go:"相关页面",none:"链接待补",stack:"控制层级"}};
const COL={brain:"#ff3df2",cere:"#3df2ff",body:"#39ff88"};

// ---------- DOM ----------
const sec=document.getElementById("bp");if(!sec)return;
const stage=document.getElementById("bpStage"),cv=document.getElementById("bpCv"),cx=cv.getContext("2d"),msg=document.getElementById("bpMsg");
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
function select(id){sel=id;render();restyle();draw()}
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

// G1 revolute joints at the zero pose: position (m) and axis, in the page frame
const JOINTS=[[0.064,0.690,0.000,1,0,0],[0.116,0.659,0.000,0,0.174,0.985],[0.116,0.541,0.046,0,0.985,-0.174],[0.119,0.353,0.000,1,0,0],[0.119,0.053,0.000,1,0,0],[0.119,0.035,0.000,0,0,1],[-0.064,0.690,0.000,1,0,0],[-0.116,0.659,0.000,0,0.174,0.985],[-0.116,0.541,0.046,0,0.985,-0.174],[-0.119,0.353,0.000,1,0,0],[-0.119,0.053,0.000,1,0,0],[-0.119,0.035,0.000,0,0,1],[0.000,0.792,0.000,0,1,0],[0.000,0.836,-0.004,0,0,1],[0.000,0.836,-0.004,1,0,0],[0.100,1.084,0.000,0.961,0.276,0],[0.141,1.081,0.000,0,0,1],[0.147,0.978,0.000,0,1,0],[0.147,0.898,0.016,1,0,0],[0.149,0.888,0.116,0,0,1],[0.149,0.888,0.154,1,0,0],[0.149,0.887,0.200,0,1,0],[-0.100,1.084,0.000,0.961,-0.276,0],[-0.141,1.081,0.000,0,0,1],[-0.147,0.978,0.000,0,1,0],[-0.147,0.898,0.016,1,0,0],[-0.149,0.888,0.116,0,0,1],[-0.149,0.888,0.154,1,0,0],[-0.149,0.887,0.200,0,1,0]];
const THREE_URL="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js",MESH_URL="assets/g1/g1-mesh.bin";
const BG="#060b08",H_ROBOT=1.29;

// ---------- layout ----------
let W=0,H=0,dpr=1,wide=true,L={},yawOff=0,t0=performance.now(),tNow=0,ready=false;
let THREE,renderer,scene,robot,cam,icam,mats={},actGroup,headC,anchors=[];
function layout(){
  const r=stage.getBoundingClientRect();W=r.width;H=r.height;dpr=Math.min(devicePixelRatio||1,2);
  cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);wide=W>=640;
  stage.classList.toggle("narrow",!wide);
  const vh=H*(wide?.96:.92),vw=vh*.7,ox=wide?W*.37:W*.36;
  L={main:{x:ox-vw/2,y:(H-vh)/2,w:vw,h:vh},ic:wide?[W*.655,H*.27]:[W*.75,H*.19],ir:wide?Math.min(H*.21,W*.125):Math.min(W*.2,H*.16)};
  if(renderer){renderer.setPixelRatio(dpr);renderer.setSize(W,H,false)}
  placeLabels();
}
// labels sit beside their anchors' resting height, pushed apart so they never overlap
function placeLabels(){
  if(!wide||!ready)return;
  const saved=robot.rotation.y;robot.rotation.y=yawAt(0);robot.updateMatrixWorld();
  for(const side of["L","R"]){const ms=MODULES.filter(m=>m.side===side).map(m=>({m,y:screenOf(m)[1]})).sort((a,b)=>a.y-b.y);
    let prev=-1e9;for(const o of ms){o.y=Math.max(o.y,prev+46,24);prev=o.y}
    const over=prev-(H-24);if(over>0)ms.forEach(o=>o.y-=over);
    ms.forEach(({m,y})=>{const b=labels.querySelector(`[data-id="${m.id}"]`);b.style.top=y+"px";
      m.lp=[side==="L"?b.offsetLeft+b.offsetWidth+4:b.offsetLeft-4,y]})}
  robot.rotation.y=saved;robot.updateMatrixWorld();
}
const yawAt=t=>yawOff+(reduce?-.45:-.45+.45*Math.sin(t*.00022));

// ---------- 3D ----------
function screenOf(m){
  const inset=!!m.inset,c=inset?icam:cam,R=inset?{x:L.ic[0]-L.ir,y:L.ic[1]-L.ir,w:2*L.ir,h:2*L.ir}:L.main;
  const v=new THREE.Vector3(...m.a).applyMatrix4(robot.matrixWorld).project(c);
  return [R.x+(v.x+1)/2*R.w,R.y+(1-v.y)/2*R.h]}
function ellipsoidLines(c,rx,ry,rz,lat,lon,wob=0){const out=[],P=(ph,th,w)=>[c[0]+rx*Math.cos(ph)*Math.cos(th)*w,c[1]+ry*Math.sin(ph),c[2]+rz*Math.cos(ph)*Math.sin(th)*w];
  for(let i=1;i<lat;i++){const ph=-Math.PI/2+i/lat*Math.PI;for(let j=0;j<24;j++){const a=j/24*2*Math.PI,b=(j+1)/24*2*Math.PI;
    out.push(...P(ph,a,1+wob*Math.sin(a*7+i*2.1)),...P(ph,b,1+wob*Math.sin(b*7+i*2.1)))}}
  for(let j=0;j<lon;j++){const th=j/lon*2*Math.PI;for(let i=0;i<16;i++){const a=-Math.PI/2+i/16*Math.PI,b=a+Math.PI/16;
    out.push(...P(a,th,1+wob*Math.sin(a*6+j*1.7)),...P(b,th,1+wob*Math.sin(b*6+j*1.7)))}}
  return out}
function hullMat(){return new THREE.ShaderMaterial({side:THREE.BackSide,transparent:true,uniforms:{c:{value:new THREE.Color()},a:{value:1},w:{value:.003}},
  vertexShader:"uniform float w;void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position+normal*w,1.);}",
  fragmentShader:"uniform vec3 c;uniform float a;void main(){gl_FragColor=vec4(c,a);}"})}
async function init(){
  try{
    THREE=await import(THREE_URL);
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  }catch(e){msg.textContent=lang==="zh"?"3D 视图需要 WebGL，下面的模块列表仍可使用。":"The 3D view needs WebGL; the module list below still works.";return}
  const buf=await fetch(MESH_URL).then(r=>r.arrayBuffer()).catch(()=>null);
  if(!buf){msg.textContent=lang==="zh"?"模型加载失败。":"The model failed to load.";return}
  renderer.setClearColor(0,0);renderer.setScissorTest(true);
  renderer.domElement.className="bp-gl";stage.insertBefore(renderer.domElement,cv);
  scene=new THREE.Scene();robot=new THREE.Group();scene.add(robot);
  cam=new THREE.PerspectiveCamera(16,.7,.1,30);cam.position.set(0,.95,5.3);cam.lookAt(0,.64,0);
  icam=new THREE.PerspectiveCamera(16,1,.01,10);
  const fill=new THREE.MeshBasicMaterial({color:0x08130d,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1,side:THREE.DoubleSide});
  // mesh file: "G1M1", count, then per part: name[8], nv, nf, Int16 xyz (mm), Uint16 faces; blocks padded to 4 bytes
  const dv=new DataView(buf),n=dv.getUint32(4,true);let o=8;
  for(let i=0;i<n;i++){
    const name=new TextDecoder().decode(new Uint8Array(buf,o,8)).replace(/\0+$/,""),nv=dv.getUint32(o+8,true),nf=dv.getUint32(o+12,true);o+=16;
    const V=new Int16Array(buf,o,nv*3);o+=nv*6+(nv*6)%4;const F=new Uint16Array(buf,o,nf*3);o+=nf*6+(nf*6)%4;
    const pos=new Float32Array(nv*3);for(let k=0;k<pos.length;k++)pos[k]=V[k]/1000;
    const geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.BufferAttribute(pos,3));geo.setIndex(new THREE.BufferAttribute(new Uint16Array(F),1));
    geo.computeVertexNormals();
    const line=new THREE.LineBasicMaterial({transparent:true}),hull=hullMat();mats[name]={line,hull};
    robot.add(new THREE.Mesh(geo,fill),new THREE.Mesh(geo,hull),new THREE.LineSegments(new THREE.EdgesGeometry(geo,32),line));
  }
  // brain + cerebellum inside the helmet, drawn through it; spinal cord down the back
  // the helmet cavity of the G1 head link spans y 1.24–1.32 m, z −0.066…0.074 m
  headC=[0,1.272,.004,.17];
  const nerve=(pts,col,op)=>{const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));
    const l=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:op,depthTest:false}));l.renderOrder=5;robot.add(l);return l};
  const bC=[0,1.291,.008],cC=[0,1.256,-.038];
  nerve(ellipsoidLines(bC,.054,.03,.056,6,9,.07),COL.brain,.95);
  nerve(ellipsoidLines(cC,.028,.013,.019,7,4),COL.cere,.95);
  const sp=[[0,1.245,-.03],[0,1.17,-.02],[0,1.06,-.06],[0,.95,-.06],[0,.84,-.04]],sl=[];
  for(let i=0;i<sp.length-1;i++)sl.push(...sp[i],...sp[i+1]);nerve(sl,COL.cere,.55);
  MODULES.find(m=>m.id==="brain").a=bC;MODULES.find(m=>m.id==="cere").a=cC;
  // joint actuators: one ring per revolute joint, around its real axis
  actGroup=new THREE.Group();const am=new THREE.LineBasicMaterial({color:"#ffcc4d",transparent:true,opacity:.95,depthTest:false});
  for(const [x,y,z,ax,ay,az] of JOINTS){const r=y<.75?.052:.04,pts=[],a=new THREE.Vector3(ax,ay,az).normalize(),
      u=new THREE.Vector3().crossVectors(a,Math.abs(ay)<.9?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0)).normalize(),v=new THREE.Vector3().crossVectors(a,u);
    for(let k=0;k<=24;k++){const t=k/24*2*Math.PI;pts.push(x+r*(u.x*Math.cos(t)+v.x*Math.sin(t)),y+r*(u.y*Math.cos(t)+v.y*Math.sin(t)),z+r*(u.z*Math.cos(t)+v.z*Math.sin(t)))}
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));const l=new THREE.Line(g,am);l.renderOrder=6;actGroup.add(l)}
  robot.add(actGroup);
  ready=true;msg.textContent="";stage.classList.add("ready");restyle();layout();draw();placeLabels();draw();// the inset camera is placed by draw(), so labels go after it
}
function restyle(){
  if(!ready)return;
  const dimBody=sel==="brain"||sel==="cere"||sel==="act";
  for(const [k,{line,hull}] of Object.entries(mats)){const on=k===sel;
    line.color.set(on?COL.body:"#c8ffd8");line.opacity=on?1:(dimBody?.32:.5);
    hull.uniforms.c.value.set(on?COL.body:"#c8ffd8");hull.uniforms.a.value=on?1:(dimBody?.45:.75)}
  actGroup.visible=sel==="act";
}
function draw(){
  if(!W)return;cx.clearRect(0,0,W,H);
  if(!ready)return;
  robot.rotation.y=yawAt(tNow);robot.updateMatrixWorld();
  const M=L.main,[ix,iy]=L.ic,ir=L.ir;
  renderer.setViewport(M.x,H-M.y-M.h,M.w,M.h);renderer.setScissor(M.x,H-M.y-M.h,M.w,M.h);cam.aspect=M.w/M.h;cam.updateProjectionMatrix();renderer.render(scene,cam);
  // detail inset: the head from the side, so brain and cerebellum separate
  const hc=new THREE.Vector3(headC[0],headC[1],headC[2]).applyMatrix4(robot.matrixWorld),d=headC[3]*.6/Math.tan(8*Math.PI/180),ang=robot.rotation.y+1.15;
  icam.position.set(hc.x+d*Math.sin(ang),hc.y+d*.12,hc.z+d*Math.cos(ang));icam.lookAt(hc);icam.aspect=1;icam.updateProjectionMatrix();
  renderer.setViewport(ix-ir,H-iy-ir,2*ir,2*ir);renderer.setScissor(ix-ir,H-iy-ir,2*ir,2*ir);renderer.render(scene,icam);
  // round the inset: paint the square's corners with the section background, then frame it
  cx.fillStyle=BG;cx.beginPath();cx.rect(ix-ir-1,iy-ir-1,2*ir+2,2*ir+2);cx.arc(ix,iy,ir,0,7);cx.fill("evenodd");
  cx.strokeStyle="rgba(200,255,216,.35)";cx.lineWidth=1;cx.beginPath();cx.arc(ix,iy,ir,0,7);cx.stroke();
  // callout from the head to the inset
  const hs=screenOf({a:[headC[0],headC[1],headC[2]]}),hr=Math.max(10,L.main.h*headC[3]/H_ROBOT/1.08*.62);
  cx.save();cx.strokeStyle="rgba(200,255,216,.28)";cx.setLineDash([3,4]);cx.beginPath();cx.arc(hs[0],hs[1],hr,0,7);cx.stroke();
  const ang2=Math.atan2(iy-hs[1],ix-hs[0]);cx.beginPath();cx.moveTo(hs[0]+hr*Math.cos(ang2),hs[1]+hr*Math.sin(ang2));cx.lineTo(ix-ir*Math.cos(ang2),iy-ir*Math.sin(ang2));cx.stroke();cx.restore();
  cx.fillStyle="rgba(200,255,216,.45)";cx.font="10px JetBrains Mono, monospace";cx.textAlign="center";
  cx.fillText(lang==="zh"?"细节 A · 头部侧视":"DETAIL A · HEAD, SIDE",ix,iy+ir+13);
  // anchors + leaders
  anchors=[];
  for(const m of MODULES){const p=screenOf(m),on=m.id===sel,c=colOf(m);anchors.push([m.id,p]);
    if(wide&&m.lp){cx.strokeStyle=c;cx.globalAlpha=on?.95:.35;cx.lineWidth=1;cx.beginPath();
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

let vis=false,raf=0,started=false,last=0;// cap at ~30 fps; the rotation is slow so more frames add nothing
const loop=t=>{raf=0;if(!vis)return;if(t-last>=32){last=t;tNow=t-t0;draw()}if(!reduce)raf=requestAnimationFrame(loop)};
// load three.js and the mesh only when the section comes near the viewport
new IntersectionObserver(es=>{if(es[0].isIntersecting&&!started){started=true;init()}},{rootMargin:"300px"}).observe(stage);
new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis&&!raf)raf=requestAnimationFrame(loop)}).observe(stage);
new ResizeObserver(()=>{layout();draw()}).observe(stage);
render();
})();
