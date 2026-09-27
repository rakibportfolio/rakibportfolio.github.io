/**
 * ================================================================
 * SERVICES SECTION & CUSTOM 3D CURSOR INTERACTIVITY
 * Smooth orb cursor follower + 3D card tilt & spotlight
 * ================================================================
 */

(function () {
  'use strict';

  // Only run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initCustomCursor();
    init3DCards();
  }

  /* ─────────────────────────────────────────────────────────────
     1. CUSTOM GLOWING DUAL-LAYER CURSOR
     ───────────────────────────────────────────────────────────── */
  function initCustomCursor() {
    // Disable on touch / mobile screens
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches || window.innerWidth < 768) {
      return;
    }

    let orb = document.getElementById('cursorOrb');
    let trail = document.getElementById('cursorTrail');

    if (!orb || !trail) {
      // Create if not already in DOM
      if (!orb) {
        orb = document.createElement('div');
        orb.id = 'cursorOrb';
        document.body.appendChild(orb);
      }
      if (!trail) {
        trail = document.createElement('div');
        trail.id = 'cursorTrail';
        document.body.appendChild(trail);
      }
    }

    let mouseX = -100;
    let mouseY = -100;
    let orbX = -100;
    let orbY = -100;
    let trailX = -100;
    let trailY = -100;
    let isVisible = false;

    window.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        orb.style.opacity = '1';
        trail.style.opacity = '1';
        orbX = mouseX;
        orbY = mouseY;
        trailX = mouseX;
        trailY = mouseY;
      }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      isVisible = false;
      orb.style.opacity = '0';
      trail.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function () {
      isVisible = true;
      orb.style.opacity = '1';
      trail.style.opacity = '1';
    });

    // Mousedown / mouseup punch animation
    window.addEventListener('mousedown', function () {
      document.body.classList.add('cursor-click');
    });
    window.addEventListener('mouseup', function () {
      document.body.classList.remove('cursor-click');
    });

    // Hover detection for clickable items
    const hoverSelector = 'a, button, input, textarea, select, [role="button"], .svc-card, .rtl-pill, .button, .button-03, .nav-link, .video-player-trigger';
    
    document.addEventListener('mouseover', function (e) {
      const target = e.target.closest(hoverSelector);
      if (target) {
        document.body.classList.add('cursor-hover');
      }
    }, { passive: true });

    document.addEventListener('mouseout', function (e) {
      const target = e.target.closest(hoverSelector);
      if (target) {
        document.body.classList.remove('cursor-hover');
      }
    }, { passive: true });

    // Smooth physics loop with lerp (linear interpolation)
    function renderCursor() {
      if (isVisible) {
        // Fast response for inner orb
        orbX += (mouseX - orbX) * 0.45;
        orbY += (mouseY - orbY) * 0.45;
        orb.style.transform = `translate3d(${orbX}px, ${orbY}px, 0) translate(-50%, -50%)`;

        // Smooth trailing delayed response for outer ring
        trailX += (mouseX - trailX) * 0.16;
        trailY += (mouseY - trailY) * 0.16;
        trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;
      }

      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);
  }

  /* ─────────────────────────────────────────────────────────────
     2. 3D CARD PERSPECTIVE TILT & SPOTLIGHT EFFECT
     ───────────────────────────────────────────────────────────── */
  function init3DCards() {
    const cards = document.querySelectorAll('.svc-card');
    if (!cards.length) return;

    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return;

    cards.forEach(card => {
      let bounds = null;
      let rafId = null;

      function updateBounds() {
        bounds = card.getBoundingClientRect();
      }

      function handleMouseMove(e) {
        if (!bounds) updateBounds();

        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

        // Set spotlight coordinates for radial gradient
        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);

        // Compute normalized coordinates [-1, 1]
        const normX = (x / bounds.width) * 2 - 1;
        const normY = (y / bounds.height) * 2 - 1;

        // 3D rotation angles (max 10deg)
        const rotX = -normY * 9;
        const rotY = normX * 9;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(12px) scale3d(1.015, 1.015, 1.015)`;
        });
      }

      function handleMouseEnter() {
        updateBounds();
        card.style.transition = 'transform 0.1s ease-out, box-shadow 0.35s ease, border-color 0.35s ease';
      }

      function handleMouseLeave() {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.35s ease, border-color 0.35s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
        bounds = null;
      }

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mousemove', handleMouseMove, { passive: true });
      card.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('resize', () => { bounds = null; }, { passive: true });
    });
  }

})();
