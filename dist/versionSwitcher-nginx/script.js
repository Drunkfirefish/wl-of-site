const versions={
  main:{label:"MAIN / KIMI K3",counter:"01"},
  gptversion:{label:"GPTVERSION / GPT-5 TERRA",counter:"02"},
  clauVersion:{label:"CLAUVERSION / CLAUDE OPUS 4.8",counter:"03"},
  clauV2:{label:"CLAUV2 / CLAUDE FABLE 5",counter:"04"}
};
const frame=document.querySelector("#version-frame");
const loader=document.querySelector(".frame-loader");
const stageLabel=document.querySelector("#stage-label");
const stageCounter=document.querySelector("#stage-counter");
const dock=document.querySelector(".version-dock");
const mobileMenu=document.querySelector(".mobile-menu");

function switchVersion(key){
  const version=versions[key];
  if(!version)return;
  document.querySelectorAll(".version-item").forEach(item=>{
    const active=item.dataset.version===key;
    item.classList.toggle("is-active",active);
    item.setAttribute("aria-pressed",String(active));
  });
  loader.classList.add("is-loading");
  stageLabel.textContent=version.label;
  stageCounter.textContent=version.counter;
  frame.src=`versions/${key}/index.html`;
  dock.classList.remove("is-open");
  mobileMenu?.setAttribute("aria-expanded","false");
}

document.querySelectorAll(".version-item").forEach(item=>item.addEventListener("click",()=>switchVersion(item.dataset.version)));
frame.addEventListener("load",()=>loader.classList.remove("is-loading"));
mobileMenu?.addEventListener("click",()=>{
  const open=dock.classList.toggle("is-open");
  mobileMenu.setAttribute("aria-expanded",String(open));
});

window.addEventListener("keydown",event=>{
  if(event.key<"1"||event.key>"4")return;
  const key=Object.keys(versions)[Number(event.key)-1];
  switchVersion(key);
});
