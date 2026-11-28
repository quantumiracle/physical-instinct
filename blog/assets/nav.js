// Posts are in English; only the site navigation follows the shared language setting (?lang= → saved → English).
(()=>{
let l=new URLSearchParams(location.search).get("lang");
if(l!=="zh"&&l!=="en"){l=null;try{l=localStorage.getItem("robot-atlas-lang")}catch(e){}}
const L=l==="zh"?"zh":"en";
document.querySelectorAll("[data-en][data-zh]").forEach(el=>{el.textContent=el.dataset[L]});
})();
