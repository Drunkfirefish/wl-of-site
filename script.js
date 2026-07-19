/**
 * 衣物洗护矩阵品牌网站 - 交互逻辑
 * 功能：品牌导航、平滑滚动、视差效果、悬停动画、响应式菜单、懒加载、加载动画
 */

(function() {
  'use strict';

  // ==================== 工具函数 ====================

  /**
   * 节流函数 - 优化高频事件性能
   */
  function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return func.apply(this, args);
      }
    };
  }

  /**
   * 防抖函数 - 延迟执行
   */
  function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  /**
   * 错误处理包装器
   */
  function safeExecute(func, errorMsg) {
    try {
      return func();
    } catch (error) {
      console.error(`${errorMsg}:`, error);
      return null;
    }
  }

  // ==================== 页面加载动画 ====================

  class PageLoader {
    constructor() {
      this.isLoaded = false;
      this.init();
    }

    init() {
      safeExecute(() => {
        // 添加加载样式
        this.injectStyles();

        // 创建加载器
        this.createLoader();

        // 监听页面加载完成
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => this.onLoad());
        } else {
          this.onLoad();
        }

        // 确保在窗口完全加载后移除加载器
        window.addEventListener('load', () => this.onLoad());
      }, '页面加载器初始化失败');
    }

    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .page-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          transition: opacity 0.6s ease, visibility 0.6s ease;
        }
        .page-loader.hidden {
          opacity: 0;
          visibility: hidden;
        }
        .loader-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #f0f0f0;
          border-top: 3px solid #1a1a1a;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        body.loading {
          overflow: hidden;
        }
      `;
      document.head.appendChild(style);
    }

    createLoader() {
      const loader = document.createElement('div');
      loader.className = 'page-loader';
      loader.innerHTML = '<div class="loader-spinner"></div>';
      document.body.appendChild(loader);
      document.body.classList.add('loading');
      this.loaderEl = loader;
    }

    onLoad() {
      if (this.isLoaded) return;
      this.isLoaded = true;

      setTimeout(() => {
        if (this.loaderEl) {
          this.loaderEl.classList.add('hidden');
          document.body.classList.remove('loading');

          // 移除加载器元素
          setTimeout(() => {
            if (this.loaderEl && this.loaderEl.parentNode) {
              this.loaderEl.parentNode.removeChild(this.loaderEl);
            }
          }, 600);
        }
      }, 500);
    }
  }

  // ==================== 导航栏控制 ====================

  class Navigation {
    constructor() {
      this.nav = document.querySelector('.nav');
      this.navLinks = document.querySelectorAll('.nav-links a');
      this.lastScrollY = window.scrollY;
      this.init();
    }

    init() {
      safeExecute(() => {
        // 滚动时导航栏样式变化
        window.addEventListener('scroll', throttle(() => this.onScroll(), 100));

        // 平滑滚动到对应品牌区域
        this.setupSmoothScroll();

        // 激活当前可见区域的导航链接
        this.setupActiveLink();

        // 响应式菜单
        this.setupMobileMenu();
      }, '导航栏初始化失败');
    }

    onScroll() {
      const currentScrollY = window.scrollY;

      if (!this.nav) return;

      // 滚动超过100px时添加阴影
      if (currentScrollY > 100) {
        this.nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
      } else {
        this.nav.style.boxShadow = 'none';
      }

      // 向下滚动时隐藏导航栏（可选功能）
      // if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
      //   this.nav.style.transform = 'translateY(-100%)';
      // } else {
      //   this.nav.style.transform = 'translateY(0)';
      // }

      this.lastScrollY = currentScrollY;
    }

    setupSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = anchor.getAttribute('href');

          if (targetId === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }

          const target = document.querySelector(targetId);
          if (target) {
            const navHeight = this.nav ? this.nav.offsetHeight : 0;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }

    setupActiveLink() {
      const sections = document.querySelectorAll('section[id]');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            this.setActiveLink(id);
          }
        });
      }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -60% 0px'
      });

      sections.forEach(section => observer.observe(section));
    }

    setActiveLink(activeId) {
      this.navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${activeId}`) {
          link.style.color = '#1a1a1a';
          link.style.fontWeight = '600';
        } else {
          link.style.color = '#666';
          link.style.fontWeight = '500';
        }
      });
    }

    setupMobileMenu() {
      // 创建移动端菜单按钮
      const navContainer = document.querySelector('.nav-container');
      if (!navContainer) return;

      const menuBtn = document.createElement('button');
      menuBtn.className = 'mobile-menu-btn';
      menuBtn.innerHTML = '☰';
      menuBtn.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #1a1a1a;
      `;

      navContainer.appendChild(menuBtn);

      // 移动端样式
      const style = document.createElement('style');
      style.textContent = `
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block !important;
          }
          .nav-links {
            position: fixed;
            top: 0;
            right: -100%;
            width: 70%;
            max-width: 300px;
            height: 100vh;
            background: white;
            flex-direction: column;
            padding: 80px 30px;
            box-shadow: -5px 0 20px rgba(0,0,0,0.1);
            transition: right 0.3s ease;
            z-index: 999;
          }
          .nav-links.active {
            right: 0;
          }
          .nav-links a {
            font-size: 18px;
            padding: 15px 0;
          }
          .mobile-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 998;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
          }
          .mobile-overlay.active {
            opacity: 1;
            visibility: visible;
          }
        }
      `;
      document.head.appendChild(style);

      // 创建遮罩层
      const overlay = document.createElement('div');
      overlay.className = 'mobile-overlay';
      document.body.appendChild(overlay);

      const navLinks = document.querySelector('.nav-links');

      // 切换菜单
      menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
      });

      // 点击遮罩关闭
      overlay.addEventListener('click', () => {
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
      });

      // 点击链接后关闭菜单
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('active');
          overlay.classList.remove('active');
        });
      });
    }
  }

  // ==================== 视差滚动效果 ====================

  class ParallaxEffect {
    constructor() {
      this.heroBg = document.querySelector('.hero-bg');
      this.heroContent = document.querySelector('.hero-content');
      this.init();
    }

    init() {
      safeExecute(() => {
        if (!this.heroBg) return;

        window.addEventListener('scroll', throttle(() => {
          requestAnimationFrame(() => this.animate());
        }, 16)); // ~60fps
      }, '视差效果初始化失败');
    }

    animate() {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // 背景图片视差
      if (this.heroBg && scrollY < windowHeight) {
        const parallaxSpeed = 0.5;
        this.heroBg.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
      }

      // 内容淡出效果
      if (this.heroContent && scrollY < windowHeight) {
        const opacity = 1 - (scrollY / windowHeight) * 1.5;
        const translateY = scrollY * 0.3;
        this.heroContent.style.opacity = Math.max(0, opacity);
        this.heroContent.style.transform = `translateY(${translateY}px)`;
      }
    }
  }

  // ==================== 品牌卡片悬停动画 ====================

  class BrandCardAnimations {
    constructor() {
      this.cards = document.querySelectorAll('.brand-card');
      this.init();
    }

    init() {
      safeExecute(() => {
        this.cards.forEach((card, index) => {
          // 鼠标移动时的3D倾斜效果
          card.addEventListener('mousemove', (e) => this.onMouseMove(e, card));

          // 鼠标离开时重置
          card.addEventListener('mouseleave', () => this.onMouseLeave(card));

          // 入场动画延迟
          card.style.opacity = '0';
          card.style.transform = 'translateY(30px)';
          card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100 + index * 100);
        });
      }, '品牌卡片动画初始化失败');
    }

    onMouseMove(e, card) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    }

    onMouseLeave(card) {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
  }

  // ==================== 图片懒加载 ====================

  class LazyLoadImages {
    constructor() {
      this.images = document.querySelectorAll('img[src]');
      this.init();
    }

    init() {
      safeExecute(() => {
        // 为每个图片添加加载状态
        this.images.forEach(img => {
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.6s ease';

          // 图片加载完成后显示
          if (img.complete) {
            this.onImageLoad(img);
          } else {
            img.addEventListener('load', () => this.onImageLoad(img));
            img.addEventListener('error', () => this.onImageError(img));
          }
        });

        // 使用Intersection Observer实现懒加载
        this.setupIntersectionObserver();
      }, '图片懒加载初始化失败');
    }

    setupIntersectionObserver() {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      this.images.forEach(img => {
        // 只对未加载的图片应用懒加载
        if (!img.complete) {
          imageObserver.observe(img);
        }
      });
    }

    loadImage(img) {
      // 图片已经有src属性，确保它被加载
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    }

    onImageLoad(img) {
      img.style.opacity = '1';
    }

    onImageError(img) {
      console.warn('图片加载失败:', img.src);
      img.style.opacity = '0.3';
      img.alt = '图片加载失败';
    }
  }

  // ==================== 滚动显示动画 ====================

  class ScrollReveal {
    constructor() {
      this.elements = document.querySelectorAll('.fade-in');
      this.init();
    }

    init() {
      safeExecute(() => {
        const observerOptions = {
          threshold: 0.15,
          rootMargin: '0px 0px -80px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');

              // 为子元素添加交错动画
              this.addStaggerAnimation(entry.target);
            }
          });
        }, observerOptions);

        this.elements.forEach(el => observer.observe(el));
      }, '滚动显示动画初始化失败');
    }

    addStaggerAnimation(parent) {
      const children = parent.querySelectorAll('.brand-card, .product-card, .brand-features li');
      children.forEach((child, index) => {
        child.style.transitionDelay = `${index * 0.1}s`;
      });
    }
  }

  // ==================== 滚动提示动画 ====================

  class ScrollIndicator {
    constructor() {
      this.indicator = document.querySelector('.hero-scroll');
      this.init();
    }

    init() {
      safeExecute(() => {
        if (!this.indicator) return;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
          .hero-scroll {
            animation: bounce 2s infinite;
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateX(-50%) translateY(0);
            }
            40% {
              transform: translateX(-50%) translateY(-10px);
            }
            60% {
              transform: translateX(-50%) translateY(-5px);
            }
          }
        `;
        document.head.appendChild(style);

        // 滚动时淡出
        window.addEventListener('scroll', throttle(() => {
          const scrollY = window.scrollY;
          const opacity = 1 - (scrollY / 300);
          this.indicator.style.opacity = Math.max(0, opacity);
        }, 50));

        // 点击滚动到下一个区域
        this.indicator.addEventListener('click', () => {
          const firstSection = document.querySelector('#overview');
          if (firstSection) {
            firstSection.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }, '滚动提示初始化失败');
    }
  }

  // ==================== 性能监控 ====================

  class PerformanceMonitor {
    constructor() {
      this.init();
    }

    init() {
      safeExecute(() => {
        // 监控页面加载性能
        window.addEventListener('load', () => {
          if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`页面加载时间: ${loadTime}ms`);
          }
        });

        // 监控FPS（可选，用于调试）
        if (window.location.search.includes('debug=true')) {
          this.monitorFPS();
        }
      }, '性能监控初始化失败');
    }

    monitorFPS() {
      let lastTime = performance.now();
      let frames = 0;

      const measureFPS = () => {
        frames++;
        const currentTime = performance.now();

        if (currentTime >= lastTime + 1000) {
          const fps = Math.round((frames * 1000) / (currentTime - lastTime));
          console.log(`FPS: ${fps}`);
          frames = 0;
          lastTime = currentTime;
        }

        requestAnimationFrame(measureFPS);
      };

      requestAnimationFrame(measureFPS);
    }
  }

  // ==================== 初始化所有模块 ====================

  function initializeApp() {
    // 页面加载动画
    new PageLoader();

    // 等待DOM完全加载后初始化其他模块
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initModules);
    } else {
      initModules();
    }
  }

  function initModules() {
    safeExecute(() => {
      // 导航栏
      new Navigation();

      // 视差效果
      new ParallaxEffect();

      // 品牌卡片动画
      new BrandCardAnimations();

      // 图片懒加载
      new LazyLoadImages();

      // 滚动显示动画
      new ScrollReveal();

      // 滚动提示
      new ScrollIndicator();

      // 性能监控
      new PerformanceMonitor();

      console.log('网站交互功能初始化完成 ✓');
    }, '应用初始化失败');
  }

  // 启动应用
  initializeApp();

})();
