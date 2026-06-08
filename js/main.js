(function () {
  'use strict';

  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.nav-drawer');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-drawer a');

  /* Scroll: nav background */
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('is-open');
      drawer.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.classList.remove('is-open');
        drawer.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* Active nav link on scroll */
  const sections = document.querySelectorAll('section[id], div[id]');
  const observerSections = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          link.classList.toggle('is-active', href === `#${id}`);
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((section) => {
    if (section.id) observerSections.observe(section);
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* Smooth scroll for data-scroll buttons */
  document.querySelectorAll('[data-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* Hero cinematic scroll parallax */
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero-content');
  const heroMedia = document.querySelector('.hero-visual__media');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (hero && heroContent && heroMedia && !prefersReducedMotion) {
    let ticking = false;

    function updateHeroParallax() {
      const rect = hero.getBoundingClientRect();
      const viewH = window.innerHeight;

      if (rect.bottom > 0 && rect.top < viewH) {
        const progress = Math.min(Math.max(-rect.top / (rect.height * 0.85), 0), 1);

        heroMedia.style.transform = `translate3d(0, ${progress * 60}px, 0) scale(${1.08 + progress * 0.04})`;
        heroContent.style.opacity = String(1 - progress * 0.85);
        heroContent.style.transform = `translate3d(0, ${progress * 40}px, 0)`;
      }

      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateHeroParallax);
          ticking = true;
        }
      },
      { passive: true }
    );

    updateHeroParallax();
  }
})();
