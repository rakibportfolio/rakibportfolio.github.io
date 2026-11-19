/**
 * ============================================================================
 * CLEAN IN / OUT SCROLL BLUR REVEAL ENGINE
 * Zentic Media (zenticmedia.com)
 *
 * Implements:
 * 1. Clean Blur Fade-In (12px blur -> 0px)
 * 2. Blur Reveal for Headings & Titles
 * 3. Defocus Animation for Media & Showcases
 * 4. Smooth In-and-Out scroll triggers (triggers on entering, resets on leaving)
 * 5. Staggered cadence for card grids
 * 6. ZERO Glass Sheen / NO reflection bars
 * ============================================================================
 */
(function () {
  'use strict';

  // Check user preference for reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  function initCleanScrollAnimation() {
    // 1. Hero Entrance on Page Load
    initHeroEntrance();

    // 2. Selectors for Section Titles & Headings
    var headingSelectors = [
      'h2',
      'h3',
      '.section-title-wrap',
      '.section-title-block',
      '.heading-02',
      '.heading-03',
      '.g-svc-title',
      '.fwk-title',
      '.tools-title',
      '.pf-title',
      '.ap-h2',
      '.why-title',
      '.hiw-title',
      '.new-faq-title',
      '.svc-h1',
      '.svc-sec-h2',
      '.svc-ctitle',
      '.stepped-title',
      '.stepped-heading',
      '.direct-channels-title',
      '.step-prompt-title',
      '.card-name-title',
      '.blog-card-title',
      '.blog-header',
      '.article-title'
    ];

    // 3. Selectors for Cards & Content Containers
    var cardSelectors = [
      // Homepage
      '.g-svc-card',
      '.pf-card',
      '.why-card',
      '.ap-card',
      '.fwk-3d-card',
      '.fwk-panel',
      '.hiw-step',
      '.new-faq-item',
      '.new-faq-cta',
      '.lead-receipt-card',
      '.direct-card',
      '.step-pane',
      // Services Page
      '.svc-card',
      '.svc-stat',
      '.svc-cta-box',
      // Portfolio Page
      '.pf-stats-card',
      '.pf-card-item',
      '.pf-pipe-card',
      // Case Studies Page
      '.fm-stat-card',
      '.cyber-sat-card',
      '.stepped-row',
      '.stepped-console-card',
      // Hire Video Editor Page
      '.stat-card',
      '.terms-switch-card',
      '.hud-stepper',
      // Blog Hub & Articles
      '.blog-card',
      '.guide-card',
      '.article-container'
    ];

    // 4. Selectors for Video / Media Showcases
    var mediaSelectors = [
      '.showcase-video-wrap',
      '.pf-card-portrait',
      '.saas-video-preview',
      '.saas-brand-preview',
      '.saas-web-preview',
      '.fwk-visual'
    ];

    // 5. Staggered Grid Containers
    var containerSelectors = [
      '.why-grid',
      '.pf-grid-2col',
      '.pf-grid',
      '.hiw-timeline',
      '.new-faq-list',
      '.blog-grid',
      '.direct-cards-grid',
      '.svc-bento',
      '.stepped-list-container',
      '.ap-orbit-wrap'
    ];

    containerSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (c) {
        c.classList.add('apple-stagger');
      });
    });

    // Tag Headings
    var observedHeadings = [];
    headingSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (el.closest('.hero-section') || el.closest('.hero-spotlight-wrap') || el.classList.contains('hero-headline-clean') || el.closest('.svc-hero')) {
          return;
        }
        if (!el.classList.contains('apple-reveal-heading') && !el.classList.contains('blur-reveal')) {
          el.classList.add('apple-reveal-heading');
          observedHeadings.push(el);
        }
      });
    });

    // Tag Cards
    var observedCards = [];
    cardSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (el.closest('.card-wrap') || el.classList.contains('card-wrap')) {
          return;
        }
        if (!el.classList.contains('apple-reveal-card')) {
          el.classList.add('apple-reveal-card');
          observedCards.push(el);
        }
      });
    });

    // Tag Media
    var observedMedia = [];
    mediaSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (!el.classList.contains('apple-defocus-media') && !el.classList.contains('defocus-animation')) {
          el.classList.add('apple-defocus-media');
          observedMedia.push(el);
        }
      });
    });

    // 6. IntersectionObserver for Smooth In-and-Out Animation
    if ('IntersectionObserver' in window) {
      var inOutObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            var el = entry.target;
            if (entry.isIntersecting) {
              // IN animation
              var parent = el.parentElement;
              var delay = 0;
              if (parent && el.classList.contains('apple-reveal-card')) {
                var siblings = Array.prototype.filter.call(parent.children, function (ch) {
                  return ch.classList.contains('apple-reveal-card');
                });
                var idx = siblings.indexOf(el);
                if (idx > 0) {
                  delay = Math.min(idx * 120, 600);
                }
              }

              if (delay > 0) {
                setTimeout(function () {
                  el.classList.add('is-revealed');
                }, delay);
              } else {
                el.classList.add('is-revealed');
              }
            } else {
              // OUT animation: when scrolled completely away, reset so it re-triggers when scrolled back
              el.classList.remove('is-revealed');
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -40px 0px',
          threshold: 0.1
        }
      );

      var allElements = observedHeadings.concat(observedCards, observedMedia);
      allElements.forEach(function (el) {
        inOutObserver.observe(el);
      });
    } else {
      // Fallback
      var allElements = observedHeadings.concat(observedCards, observedMedia);
      allElements.forEach(function (el) {
        el.classList.add('is-revealed');
      });
    }
  }

  // ─── HERO ENTRANCE ─────────────────────────────────────────
  function initHeroEntrance() {
    var hero = document.querySelector('.hero-section') || 
               document.querySelector('.hero-spotlight-wrap') || 
               document.querySelector('.svc-hero') || 
               document.querySelector('.hero');
    if (!hero) return;

    var badge = hero.querySelector('.hero-rating-badge') || 
                hero.querySelector('.trusted_wrap') || 
                hero.querySelector('.badge-pill') || 
                hero.querySelector('.svc-badge') ||
                hero.querySelector('.hero-chip') ||
                hero.querySelector('.blog-header-badge');
    if (badge) badge.classList.add('apple-hero-badge');

    var title = hero.querySelector('h1') || 
                hero.querySelector('.hero-headline-clean') || 
                hero.querySelector('.hero-title') ||
                hero.querySelector('.hero-h1') ||
                hero.querySelector('.svc-h1');
    if (title) title.classList.add('apple-hero-title');

    var sub = hero.querySelector('.hero-subheadline-clean') || 
              hero.querySelector('.hero-desc') || 
              hero.querySelector('.hero-sub') ||
              hero.querySelector('.svc-sub');
    if (sub) sub.classList.add('apple-hero-subtitle');

    var btns = hero.querySelector('.hero-buttons-group') || 
               hero.querySelector('.hero-cta-group') || 
               hero.querySelector('.btn-group') ||
               hero.querySelector('.svc-hero-btns');
    if (btns) btns.classList.add('apple-hero-actions');

    var video = document.getElementById('heroVideoHolder') || 
                hero.querySelector('.hero-3d-scene') || 
                hero.querySelector('.hero-video-box') ||
                hero.querySelector('.hero-background-block');
    if (video) video.classList.add('apple-hero-video');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCleanScrollAnimation);
  } else {
    initCleanScrollAnimation();
  }
})();
