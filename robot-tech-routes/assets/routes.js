// Shared language switch for Tech Routes pages. Same key and order as the rest of the site: ?lang= → saved → English.
(()=>{
const root=document.documentElement;
const titles={en:root.dataset.titleEn||document.title,zh:root.dataset.titleZh||document.title};
const seg=document.getElementById("fLang");
function setLang(l){
  const L=l==="zh"?"zh":"en";
  root.lang=L==="zh"?"zh-CN":"en";
  document.body.classList.toggle("zh",L==="zh");
  document.title=titles[L];
  document.querySelectorAll("[data-en][data-zh]").forEach(el=>{el.textContent=el.dataset[L]});
  if(seg)seg.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.v===L)));
}
let L0=new URLSearchParams(location.search).get("lang");
if(L0!=="zh"&&L0!=="en"){L0=null;try{L0=localStorage.getItem("robot-atlas-lang")}catch(e){}}
setLang(L0==="zh"?"zh":"en");
if(seg)seg.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
  try{localStorage.setItem("robot-atlas-lang",b.dataset.v)}catch(x){}
  try{const u=new URL(location.href);u.searchParams.set("lang",b.dataset.v);history.replaceState(null,"",u)}catch(x){}
  setLang(b.dataset.v);});
})();
