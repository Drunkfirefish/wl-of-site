document.documentElement.classList.remove('no-js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- nav theme + scrolled state ---------- */
const nav = document.getElementById('siteNav');
nav.classList.add('nav--light');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const theme = entry.target.dataset.nav || 'light';
      nav.classList.toggle('nav--dark', theme === 'dark');
      nav.classList.toggle('nav--light', theme !== 'dark');
    });
  },
  { rootMargin: '-72px 0px -85% 0px' }
);
document.querySelectorAll('[data-nav]').forEach((s) => navObserver.observe(s));

const onScroll = () => nav.classList.toggle('nav--scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- motion ---------- */
if (window.gsap && window.ScrollTrigger && !reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('#progressBar', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.4 },
  });

  gsap.fromTo(
    '.hero__title [data-line]',
    { yPercent: 110 },
    { yPercent: 0, duration: 1.4, ease: 'power4.out', stagger: 0.12, delay: 0.15 }
  );
  gsap.fromTo(
    '.hero__spectrum span',
    { scaleX: 0 },
    { scaleX: 1, duration: 1.6, ease: 'power3.inOut', delay: 0.7 }
  );
  gsap.to('.hero .hero__copy [data-reveal]', {
    opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.5,
  });

  document.querySelectorAll('[data-parallax]').forEach((img) => {
    const amount = parseFloat(img.dataset.parallax) || 8;
    gsap.fromTo(
      img,
      { yPercent: -Math.abs(amount), scale: 1.18 },
      {
        yPercent: Math.abs(amount),
        scale: 1.18,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('figure'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });

  document.querySelectorAll('[data-clip]').forEach((clip) => {
    gsap.fromTo(
      clip,
      { clipPath: 'inset(12% 8% 12% 8% round 4px)', opacity: 0.35 },
      {
        clipPath: 'inset(0% 0% 0% 0% round 4px)',
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: { trigger: clip, start: 'top 82%' },
      }
    );
  });

  document.querySelectorAll('section:not(.hero), .footer').forEach((scope) => {
    const items = scope.querySelectorAll('[data-reveal]');
    if (!items.length) return;
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 1.05,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: scope, start: 'top 72%' },
    });
  });

  document.querySelectorAll('.plot').forEach((plot, i) => {
    gsap.from(plot, {
      opacity: 0,
      y: 26,
      duration: 0.9,
      ease: 'power3.out',
      delay: i * 0.09,
      scrollTrigger: { trigger: '.matrix__chart', start: 'top 75%' },
    });
  });

  gsap.from('.finale__spectrum span', {
    scaleY: 0,
    transformOrigin: '50% 100%',
    duration: 1.1,
    ease: 'power3.out',
    stagger: 0.08,
    scrollTrigger: { trigger: '.finale__spectrum', start: 'top 85%' },
  });
} else {
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
  const bar = document.getElementById('progressBar');
  if (bar) {
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    }, { passive: true });
  }
}
