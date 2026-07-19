const brandContent = {
  walch: { index: "01 / PROTECT", title: "威露士", english: "Walch", text: "以明确、可靠的日常防护，建立每一次清洗的安心起点。", tag: "日常洁净 · 衣物防护" },
  na: { index: "02 / NOURISH", title: "Na", english: "奈十八本", text: "把日常消耗的部分，慢慢养回来。给忙碌生活留出更自然的照料节奏。", tag: "自然感 · 日常修护" },
  lamama: { index: "03 / EMBRACE", title: "Lamama", english: "柔软呵护", text: "留一层轻柔给亲近的日常，让每一次触碰都有安心的包裹感。", tag: "柔软感 · 亲密日常" },
  seika: { index: "04 / COMFORT", title: "菁华", english: "Seika", text: "从贴近肌肤的细节出发，让洁净之后的舒适持续发生。", tag: "温柔舒适 · 细节照料" },
  centralin: { index: "05 / REFINE", title: "纺优美", english: "Centralin", text: "让衣物成为抵达之前的第一印象，以香气与质感完成个人表达。", tag: "衣物香氛 · 质感焕新" }
};

const momentContent = {
  commute: { index: "MOMENT / 01", title: "通勤之后，", emphasis: "洗去城市的靠近。", text: "从高频接触到衣物气味，让回到家的第一件事，成为重新掌握自己节奏的仪式。", brands: ["威露士", "菁华", "纺优美"] },
  sport: { index: "MOMENT / 02", title: "运动之后，", emphasis: "让轻快留在身上。", text: "针对汗水与高频穿着的织物，以清爽洁净与贴肤舒适，恢复轻盈状态。", brands: ["威露士", "Na", "菁华"] },
  home: { index: "MOMENT / 03", title: "家居周末，", emphasis: "收纳一室柔软。", text: "床品、毛巾、家居服，在完整的洗护步骤里，变成对家的触感记忆。", brands: ["Lamama", "菁华", "纺优美"] },
  occasion: { index: "MOMENT / 04", title: "重要场合，", emphasis: "让气味先替你抵达。", text: "让衣物的顺滑、垂坠与香气，成为无需言说却被记住的第一印象。", brands: ["Na", "Lamama", "纺优美"] }
};

const detail = document.querySelector("#matrix-detail");
function showBrand(key) {
  const brand = brandContent[key];
  detail.innerHTML = `<p class="detail-index">${brand.index}</p><h3>${brand.title} <em>${brand.english}</em></h3><p>${brand.text}</p><span class="detail-tag">${brand.tag}</span>`;
  document.querySelectorAll(".matrix-point").forEach((point) => point.classList.toggle("selected", point.dataset.brand === key));
  document.querySelectorAll(".brand-card").forEach((card) => card.classList.toggle("highlight", card.dataset.card === key));
}

document.querySelectorAll(".matrix-point, [data-detail]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.brand || button.dataset.detail;
    showBrand(key);
    if (button.dataset.detail) document.querySelector("#matrix").scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

document.querySelectorAll("[data-moment]").forEach((button) => {
  button.addEventListener("click", () => {
    const moment = momentContent[button.dataset.moment];
    document.querySelectorAll("[data-moment]").forEach((tab) => { tab.classList.toggle("active", tab === button); tab.setAttribute("aria-selected", String(tab === button)); });
    document.querySelector("#moment-board").innerHTML = `<p class="moment-index">${moment.index}</p><h3>${moment.title}<br /><em>${moment.emphasis}</em></h3><p class="moment-text">${moment.text}</p><div class="moment-route">${moment.brands.map((brand, index) => `<span class="route-dot dot-${index}"></span><b>${brand}</b>${index < 2 ? "<i></i>" : ""}`).join("")}</div>`;
  });
});

document.querySelectorAll("[data-scroll]").forEach((button) => button.addEventListener("click", () => document.querySelector(button.dataset.scroll).scrollIntoView({ behavior: "smooth" })));

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("is-visible"); }), { threshold: 0.15 });
document.querySelectorAll(".reveal, .brand-card, .statement-copy, .moments-top, .moment-board").forEach((element) => observer.observe(element));
