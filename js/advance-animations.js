/**
 * ============================================================
 * ADVANCED 3D TILT & NEON LASER BORDER SWEEP ENGINE
 * Inspired by: Apple, Linear.app, Stripe, Reflect
 * ============================================================
 */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    return;
  }

  function init3DAnimations() {
    // 1. Target groups containing cards
    var cardGroupSelectors = [
      '.marquee-testimonial',
      '.proof-slider-mask',
      '.faq-accordion-block',
      '.pricing-table-container',
      '.pricing-card-wrap',
      '.review-card-col',
      '.framework-cards-wrap',
      '.services-container',
      '.services-grid'
    ];

    // Card selectors for individual matching
    var cardSelectors = [
      '.proof-card',
      '.proof-card.v2',
      '.pricing-card',
      '.accordion',
      '.review-card',
      '.framework-step-card',
      '.fwk-card',
      '.service-card-item',
      '.sv3-card',
      '.step-card-block',
      '.showcase-video-wrap',
      '.testimonial-card-block',
      '.service-tab-pane'
    ];

    // Section title selectors
    var headingSelectors = [
      '.section-title-wrap',
      '.section-title-block',
      '.heading-02',
      '.heading-05',
      '.gradient-divider-wrap',
      '.sv3-title',
      '.sv3-h2',
      '.fwk-title',
      '.pricing',
      '.footer-title',
      '.tools-title'
    ];

    // Mark groups
    cardGroupSelectors.forEach(function (groupSel) {
      document.querySelectorAll(groupSel).forEach(function (groupEl) {
        groupEl.classList.add('stagger-3d');
      });
    });

    // Setup cards with 3D reveal classes, laser beams, and glass sheens
    cardSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (card) {
        if (!card.classList.contains('reveal-3d-card')) {
          card.classList.add('reveal-3d-card');

          // Inject Neon Laser Beam perimeter element if not present
          if (!card.querySelector('.card-laser-beam')) {
            var laser = document.createElement('div');
            laser.className = 'card-laser-beam';
            laser.setAttribute('aria-hidden', 'true');
            card.appendChild(laser);
          }

          // Inject Specular Glass Sheen element if not present
          if (!card.querySelector('.card-sheen-ray')) {
            var sheen = document.createElement('div');
            sheen.className = 'card-sheen-ray';
            sheen.setAttribute('aria-hidden', 'true');
            card.appendChild(sheen);
          }

          // Attach interactive 3D mouse tilt tracking (active only once revealed)
          setup3DCardTilt(card);
        }
      });
    });

    // Setup Headings with 3D emergence and laser flare
    headingSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (heading) {
        if (!heading.classList.contains('reveal-heading')) {
          heading.classList.add('reveal-heading');

          // Inject laser flare line under heading
          if (!heading.querySelector('.heading-laser-line')) {
            var line = document.createElement('div');
            line.className = 'heading-laser-line';
            line.setAttribute('aria-hidden', 'true');
            heading.appendChild(line);
          }
        }
      });
    });

    // 2. High-Performance IntersectionObserver
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              obs.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -40px 0px',
          threshold: 0.12
        }
      );

      // Observe cards
      document.querySelectorAll('.reveal-3d-card').forEach(function (card) {
        var rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setTimeout(function () {
            card.classList.add('is-revealed');
          }, 80);
        } else {
          observer.observe(card);
        }
      });

      // Observe headings
      document.querySelectorAll('.reveal-heading').forEach(function (heading) {
        var rect = heading.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setTimeout(function () {
            heading.classList.add('is-revealed');
          }, 50);
        } else {
          observer.observe(heading);
        }
      });
    } else {
      // Fallback
      document.querySelectorAll('.reveal-3d-card, .reveal-heading').forEach(function (el) {
        el.classList.add('is-revealed');
      });
    }
  }

  // Interactive 3D Mouse Tilt Physics
  function setup3DCardTilt(card) {
    var isHovered = false;
    var rafId = null;

    card.addEventListener('mouseenter', function () {
      if (!card.classList.contains('is-revealed')) return;
      isHovered = true;
      card.classList.add('is-tilt-active');
    });

    card.addEventListener('mousemove', function (e) {
      if (!isHovered || !card.classList.contains('is-revealed')) return;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(function () {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((centerY - y) / centerY) * 7.5; // Max 7.5 deg
        var rotateY = ((x - centerX) / centerX) * 7.5; // Max 7.5 deg

        card.style.transform =
          'perspective(1000px) rotateX(' +
          rotateX.toFixed(2) +
          'deg) rotateY(' +
          rotateY.toFixed(2) +
          'deg) translate3d(0, -6px, 14px) scale3d(1.01, 1.01, 1)';
      });
    });

    card.addEventListener('mouseleave', function () {
      isHovered = false;
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale3d(1, 1, 1)';
      setTimeout(function () {
        if (!isHovered) {
          card.classList.remove('is-tilt-active');
        }
      }, 150);
    });
  }

  // ─── Hero Dynamic Word Rotator (Ultra-Modern Capsule) ───────
  function initHeroWordRotator() {
    var capsule = document.getElementById('heroWordCapsule') || document.querySelector('.hero-word-capsule') || document.querySelector('.hero-word-pill');
    var words = capsule ? capsule.querySelectorAll('.hero-rot-word, .hero-dynamic-word') : [];
    if (!capsule || words.length === 0) return;

    var currentIndex = 0;

    // Measure the text content width of a word element
    function measureTextWidth(wordEl) {
      var span = document.createElement('span');
      var compFont = window.getComputedStyle(wordEl);
      span.style.cssText = [
        'position:fixed', 'visibility:hidden', 'pointer-events:none',
        'opacity:0', 'transform:none', 'left:-9999px', 'top:-9999px',
        'white-space:nowrap', 'display:inline-block',
        'font-family:' + (compFont.fontFamily || 'Inter, sans-serif'),
        'font-weight:700',
        'font-size:' + (compFont.fontSize || '1.1rem'),
        'letter-spacing:-0.01em'
      ].join(';');
      span.textContent = wordEl.textContent.trim();
      document.body.appendChild(span);
      var w = span.offsetWidth;
      document.body.removeChild(span);
      return w;
    }

    function setCapsuleWidth(wordEl) {
      if (window.innerWidth <= 768) {
        capsule.style.width = window.innerWidth <= 520 ? '118px' : '132px';
        return;
      }
      var w = measureTextWidth(wordEl);
      var buffer = 34;
      var minWidth = 165;
      capsule.style.width = Math.max(minWidth, Math.round(w + buffer)) + 'px';
    }

    // Show first word immediately
    words[0].classList.add('is-active');
    setTimeout(function () {
      setCapsuleWidth(words[0]);
    }, 120);

    // Recalculate on resize
    window.addEventListener('resize', function () {
      setCapsuleWidth(words[currentIndex]);
    }, { passive: true });

    // Rotate every 2.6s
    setInterval(function () {
      var current = words[currentIndex];
      current.classList.remove('is-active');
      current.classList.add('is-exiting');

      setTimeout(function () {
        current.classList.remove('is-exiting');
      }, 500);

      currentIndex = (currentIndex + 1) % words.length;
      var next = words[currentIndex];

      setCapsuleWidth(next);

      setTimeout(function () {
        next.classList.add('is-active');
      }, 50);
    }, 2600);
  }

  // Watch Demo button smooth scroll to video
  function initWatchDemo() {
    var watchDemoBtn = document.getElementById('heroWatchDemoBtn');
    if (watchDemoBtn) {
      watchDemoBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var videoHolder = document.getElementById('heroVideoHolder');
        if (videoHolder) {
          videoHolder.scrollIntoView({ behavior: 'smooth', block: 'center' });
          var vid = videoHolder.querySelector('video');
          if (vid) {
            vid.muted = false;
            vid.play().catch(function () {});
          }
        }
      });
    }
  }

  // Initialize
  function start() {
    init3DAnimations();
    initHeroWordRotator();
    initWatchDemo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

