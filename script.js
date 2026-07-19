const brandInfo = {
  walch: {index:"01 / PROTECT",name:"威露士",english:"Walch",desc:"以科学验证的抗菌配方，建立每一次洗涤的安全防护起点。专注于高频洁净需求，日常型的可靠伙伴。",tags:["日常洁净","衣物防护","高效抗菌"],color:"#0B3D8F"},
  na: {index:"02 / NOURISH",name:"Na 奈十八本",english:"Na",desc:"从18种本草植物精萃中提取力量，以自然的修护节奏呵护衣物纤维与肌肤感受。",tags:["植萃修护","温和配方","本草香调"],color:"#C47230"},
  lamama: {index:"03 / EMBRACE",name:"Lamama",english:"Lamama",desc:"专为家庭与婴幼儿设计的温柔洗护，以低敏配方守护每一件贴近肌肤的衣物。",tags:["低敏温和","家庭专用","柔软呵护"],color:"#C47A7A"},
  jinghua: {index:"04 / REFINE",name:"菁华",english:"Seika",desc:"高浓缩精华配方，兼具深度洁净与奢华护理，以珍稀植物提取修护受损纤维。",tags:["高浓精萃","奢华护理","持久留香"],color:"#C9A45A"},
  fangyoumei: {index:"05 / SOFTEN",name:"纺优美",english:"Centralin",desc:"专注衣物的感官终章，以香氛、柔顺与垂坠感完成属于你的衣物表达与生活美学。",tags:["多层香氛","织物柔顺","消除静电"],color:"#7B6BA0"}
};

const occasionContent = {
  commute: {index:"MOMENT / 01",title:"通勤之后，",emphasis:"洗去城市的靠近。",text:"从地铁到写字楼，衣物吸附的不只是气味。以可靠的清洁力与轻盈的留香，恢复回到家之后的自我节奏。",brands:[{name:"威露士",color:"#0B3D8F"},{name:"菁华",color:"#0D1B3E"},{name:"纺优美",color:"#7B6BA0"}]},
  sport: {index:"MOMENT / 02",title:"运动之后，",emphasis:"让轻快留在身上。",text:"针对汗水与高频穿着的织物，以清爽洁净与贴肤舒适，迅速恢复衣物的轻盈状态。",brands:[{name:"威露士",color:"#0B3D8F"},{name:"Na",color:"#C47230"},{name:"菁华",color:"#C9A45A"}]},
  home: {index:"MOMENT / 03",title:"家居周末，",emphasis:"收纳一室柔软。",text:"床品、毛巾、家居服，在完整的洗护步骤里，变成对家的触感记忆与温柔陪伴。",brands:[{name:"Lamama",color:"#C47A7A"},{name:"Na",color:"#C47230"},{name:"纺优美",color:"#7B6BA0"}]},
  occasion: {index:"MOMENT / 04",title:"重要场合，",emphasis:"让气味先替你抵达。",text:"让衣物的顺滑、垂坠与香气，成为无需言说却被记住的第一印象与个人表达。",brands:[{name:"菁华",color:"#C9A45A"},{name:"纺优美",color:"#7B6BA0"},{name:"Na",color:"#C47230"}]}
};

// Nav scroll
const nav = document.getElementById("site-nav");
window.addEventListener("scroll",()=>{nav.classList.toggle("scrolled",window.scrollY>60)});

// Reveal observer
const ro = new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("is-visible")})},{threshold:.1});
document.querySelectorAll(".reveal").forEach(el=>ro.observe(el));

// Spectrum chart points
const sp = document.getElementById("spectrum-info");
const si = sp.querySelector(".si-inner");
document.querySelectorAll(".chart-point").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const key = btn.dataset.brandInfo;
    const b = brandInfo[key];
    document.querySelectorAll(".chart-point").forEach(p=>p.classList.remove("active"));
    btn.classList.add("active");
    si.style.animation="none";
    si.offsetHeight;
    si.style.animation="fadeSlide .4s ease";
    si.innerHTML=`<p class="si-index label">${b.index}</p><h3 class="si-name">${b.name} <em style="font:500 .38em/1.4 var(--mono);letter-spacing:.08em;opacity:.65;display:block;margin-top:4px">${b.english}</em></h3><p class="si-desc">${b.desc}</p><div class="si-tags">${b.tags.map(t=>`<span class="si-tag" style="background:${b.color}15;color:${b.color}">${t}</span>`).join("")}</div>`;
  });
});

// Occasion tabs
const op = document.getElementById("occ-panel");
document.querySelectorAll(".occ-tab").forEach(tab=>{
  tab.addEventListener("click",()=>{
    document.querySelectorAll(".occ-tab").forEach(t=>{t.classList.remove("active");t.setAttribute("aria-selected","false")});
    tab.classList.add("active");tab.setAttribute("aria-selected","true");
    const o = occasionContent[tab.dataset.occ];
    op.classList.add("fading");
    setTimeout(()=>{
      op.innerHTML=`<div class="occ-text"><p class="occ-index">${o.index}</p><h3>${o.title}<br><em>${o.emphasis}</em></h3><p>${o.text}</p></div><div class="occ-brands">${o.brands.map((b,i)=>`${i>0?'<span class="occ-plus">+</span>':''}<a href="#${b.name==="威露士"?"walch":b.name==="菁华"?"jinghua":b.name==="纺优美"?"fangyoumei":b.name==="Na"?"na":"lamama"}" class="occ-brand-pill" style="--c:${b.color}">${b.name}</a>`).join("")}</div>`;
      op.classList.remove("fading");
    },150);
  });
});

// Smooth scroll nav
document.querySelectorAll(".nav-links a,.hero-explore,.nav-cta,.closing-back,.bs-link,.occ-brand-pill").forEach(a=>{
  a.addEventListener("click",e=>{
    const href=a.getAttribute("href");
    if(href&&href.startsWith("#")){e.preventDefault();const t=document.querySelector(href);if(t)t.scrollIntoView({behavior:"smooth",block:"center"})}
  });
});
