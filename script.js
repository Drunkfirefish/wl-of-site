(function () {
  var loader = document.getElementById("loader");

  if (!window.gsap || !window.ScrollTrigger) {
    document.documentElement.classList.add("no-motion");
    if (loader) loader.remove();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var entered = false;
  function enter() {
    if (entered) return;
    entered = true;
    if (reduced) {
      if (loader) loader.remove();
      return;
    }
    gsap.timeline()
      .to("#loaderBar", { scaleX: 1, duration: 1.0, ease: "power2.inOut" })
      .to(loader, { yPercent: -100, duration: 0.9, ease: "power3.inOut", onComplete: function () { loader.remove(); } })
      .to(".hero h1 .row > span", { y: 0, duration: 1.2, stagger: 0.14, ease: "power4.out" }, "-=0.45")
      .from(".hero .kicker, .hero .sub, .hero-brands a", { opacity: 0, y: 26, duration: 0.9, stagger: 0.05, ease: "power3.out" }, "-=0.8");
  }
  if (document.readyState === "complete") enter();
  else {
    window.addEventListener("load", enter);
    setTimeout(enter, 3500);
  }

  if (reduced) {
    document.querySelectorAll(".rv, .axis-nodes a").forEach(function (el) {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
    var f = document.getElementById("axisFill");
    if (f) f.style.transform = "scaleX(1)";
    return;
  }

  gsap.utils.toArray(".rv").forEach(function (el, i) {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
      delay: (i % 4) * 0.06,
      scrollTrigger: { trigger: el, start: "top 88%" }
    });
  });

  gsap.utils.toArray(".sec-head .rule").forEach(function (el) {
    gsap.from(el, { scaleX: 0, duration: 1.4, ease: "power3.inOut", scrollTrigger: { trigger: el, start: "top 90%" } });
  });

  gsap.to("#navProgress", {
    scaleX: 1, ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 }
  });

  gsap.to(".hero .bg img", {
    yPercent: 10, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });

  gsap.to("#axisFill", {
    scaleX: 1, ease: "none",
    scrollTrigger: { trigger: ".axis-wrap", start: "top 75%", end: "top 25%", scrub: 0.6 }
  });
  gsap.to(".axis-nodes a", {
    opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
    scrollTrigger: { trigger: ".axis-nodes", start: "top 82%" }
  });

  gsap.utils.toArray(".plx").forEach(function (img) {
    gsap.fromTo(img, { yPercent: -9 }, {
      yPercent: 9, ease: "none",
      scrollTrigger: { trigger: img.closest("figure, .fig, section") || img, start: "top bottom", end: "bottom top", scrub: true }
    });
  });

  gsap.utils.toArray(".big-no").forEach(function (el) {
    gsap.fromTo(el, { yPercent: 24 }, {
      yPercent: -14, ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true }
    });
  });

  var railLinks = document.querySelectorAll(".rail a");
  gsap.utils.toArray(".chapter").forEach(function (sec, i) {
    ScrollTrigger.create({
      trigger: sec,
      start: "top 55%",
      end: "bottom 55%",
      onToggle: function (self) {
        if (self.isActive && railLinks[i]) {
          railLinks.forEach(function (l) { l.classList.remove("active"); });
          railLinks[i].classList.add("active");
        }
      }
    });
  });

  gsap.from(".matrix .row", {
    opacity: 0, y: 30, duration: 0.8, stagger: 0.08, ease: "power3.out",
    scrollTrigger: { trigger: ".matrix .table", start: "top 85%" }
  });
})();
