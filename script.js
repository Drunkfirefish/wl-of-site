// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.philosophy-item, .brand-card, .contact-item');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
});

// Brand card hover effects
const brandCards = document.querySelectorAll('.brand-card');
brandCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'transform 0.3s ease';
    });
});

// Product showcase parallax effect
window.addEventListener('scroll', () => {
    const showcases = document.querySelectorAll('.product-showcase');
    showcases.forEach(showcase => {
        const rect = showcase.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;

        if (scrollPercent > 0 && scrollPercent < 1) {
            const bg = showcase.querySelector('.showcase-bg');
            if (bg) {
                bg.style.transform = `scale(${1 + scrollPercent * 0.1})`;
            }
        }
    });
});

// Brand dot interactive effects
const brandDots = document.querySelectorAll('.brand-dot');
brandDots.forEach(dot => {
    dot.addEventListener('mouseenter', function() {
        const brandName = this.getAttribute('data-brand');
        this.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)';
    });

    dot.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
});

// Preload animations
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('威莱品牌矩阵网站加载完成');

    // Add stagger animation to philosophy items
    const philosophyItems = document.querySelectorAll('.philosophy-item');
    philosophyItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // Add entrance animation to brand cards
    const cards = document.querySelectorAll('.brand-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
});

// Dynamic color theme based on scroll position
let currentBrand = null;
const brandSections = [
    { element: '.walch', color: '#0066cc' },
    { element: '.na', color: '#2d5016' },
    { element: '.lamama', color: '#ff9ec1' },
    { element: '.jinghua', color: '#8b6f47' },
    { element: '.fangyoumei', color: '#6b4c9a' }
];

window.addEventListener('scroll', () => {
    brandSections.forEach(section => {
        const element = document.querySelector(section.element);
        if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                if (currentBrand !== section.color) {
                    currentBrand = section.color;
                    // Subtle color hint in navbar
                    const logo = document.querySelector('.logo');
                    if (logo) {
                        logo.style.transition = 'color 0.5s ease';
                        logo.style.color = section.color;
                        setTimeout(() => {
                            logo.style.color = '';
                        }, 2000);
                    }
                }
            }
        }
    });
});

// Enhanced scroll progress indicator
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #0066cc, #8b6f47, #ff9ec1, #2d5016, #6b4c9a);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
};

createScrollProgress();

// Easter egg: Brand matrix visualization on triple click
let clickCount = 0;
let clickTimer = null;

document.addEventListener('click', () => {
    clickCount++;

    if (clickCount === 1) {
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 500);
    }

    if (clickCount === 3) {
        clearTimeout(clickTimer);
        clickCount = 0;

        // Create a subtle visual effect
        const body = document.body;
        const originalBg = body.style.background;
        body.style.transition = 'background 1s ease';
        body.style.background = 'linear-gradient(135deg, #0066cc10 0%, #8b6f4710 25%, #ff9ec110 50%, #2d501610 75%, #6b4c9a10 100%)';

        setTimeout(() => {
            body.style.background = originalBg;
        }, 2000);
    }
});

// Performance optimization: Lazy load showcase backgrounds
const lazyLoadShowcases = () => {
    const showcases = document.querySelectorAll('.product-showcase');

    const showcaseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                showcaseObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '50px'
    });

    showcases.forEach(showcase => {
        showcaseObserver.observe(showcase);
    });
};

lazyLoadShowcases();

// Add smooth momentum scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Analytics placeholder (for future integration)
const trackBrandView = (brandName) => {
    console.log(`Brand viewed: ${brandName}`);
    // Future: Send to analytics service
};

// Track brand card views
const trackObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const brandName = entry.target.querySelector('.brand-name')?.textContent;
            if (brandName) {
                trackBrandView(brandName);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.brand-card').forEach(card => {
    trackObserver.observe(card);
});