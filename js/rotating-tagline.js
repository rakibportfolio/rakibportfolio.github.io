/**
 * Rotating Tagline Strip — 3D Flip Engine (v1.0)
 * Cycles through: Videos That Engage. / Marketing That Converts. / Automations That Scale.
 * Animation: 3D rotateX flip, glassmorphism pill, icon swap, dot indicator
 */

(function () {
  'use strict';

  const SLIDES = [
    {
      text: 'Videos That Engage.',
      icon: '<svg class="rtl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>',
    },
    {
      text: 'Marketing That Converts.',
      icon: '<svg class="rtl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    },
    {
      text: 'Automations That Scale.',
      icon: '<svg class="rtl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>',
    },
  ];

  const INTERVAL_MS = 2400;   // time each slide shows
  const FLIP_MS     = 500;    // flip animation duration (must match CSS)

  let currentIdx = 0;
  let isAnimating = false;
  let autoTimer   = null;

  // DOM refs
  let slotA, slotB, pillA, pillB, iconA, iconB, textA, textB, dots;
  let activeSlot = 'A';  // which slot is currently visible

  function init () {
    slotA  = document.getElementById('rtlSlotA');
    slotB  = document.getElementById('rtlSlotB');
    pillA  = document.getElementById('rtlPillA');
    pillB  = document.getElementById('rtlPillB');
    iconA  = document.getElementById('rtlIconA');
    iconB  = document.getElementById('rtlIconB');
    textA  = document.getElementById('rtlTextA');
    textB  = document.getElementById('rtlTextB');
    dots   = document.querySelectorAll('.rtl-dot');

    if (!slotA || !slotB) return; // section not in DOM

    // Seed first slide
    setSlotContent('A', 0);
    updateDots(0);

    // Start auto-cycle
    autoTimer = setInterval(nextSlide, INTERVAL_MS);

    // Pause on hover
    const stage = document.getElementById('rtlStage');
    if (stage) {
      stage.addEventListener('mouseenter', () => clearInterval(autoTimer));
      stage.addEventListener('mouseleave', () => {
        clearInterval(autoTimer);
        autoTimer = setInterval(nextSlide, INTERVAL_MS);
      });
    }

    // Dot click
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.idx, 10);
        if (idx === currentIdx || isAnimating) return;
        clearInterval(autoTimer);
        flipTo(idx);
        autoTimer = setInterval(nextSlide, INTERVAL_MS);
      });
    });

    // Mobile touch swipe
    let touchStartX = 0;
    const wrap = document.getElementById('rtlPerspWrap');
    if (wrap) {
      wrap.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
      wrap.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
          clearInterval(autoTimer);
          if (dx < 0) {
            nextSlide();
          } else {
            flipTo((currentIdx - 1 + SLIDES.length) % SLIDES.length);
          }
          autoTimer = setInterval(nextSlide, INTERVAL_MS);
        }
      }, { passive: true });
    }
  }

  function nextSlide () {
    flipTo((currentIdx + 1) % SLIDES.length);
  }

  function flipTo (nextIdx) {
    if (isAnimating || nextIdx === currentIdx) return;
    isAnimating = true;

    const inSlot   = activeSlot === 'A' ? 'B' : 'A';
    const outSlot  = activeSlot;

    // Prepare incoming slot with next slide content (while hidden)
    setSlotContent(inSlot, nextIdx);

    // Position incoming slot below (rotated down)
    setSlotClass(inSlot, 'rtl-slot-next');
    // Force reflow so transition starts from correct position
    void document.getElementById('rtlSlot' + inSlot.toUpperCase()).offsetHeight;

    // Animate OUT: outgoing slot flips up
    setSlotClass(outSlot, 'rtl-slot-transitioning-out');

    // Small delay then animate IN
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSlotClass(inSlot, 'rtl-slot-transitioning-in');
      });
    });

    // After animation ends, snap to final classes
    setTimeout(() => {
      setSlotClass(outSlot, 'rtl-slot-next');
      setSlotClass(inSlot,  'rtl-slot-active');

      currentIdx = nextIdx;
      activeSlot = inSlot;
      updateDots(currentIdx);
      isAnimating = false;
    }, FLIP_MS + 60);
  }

  function setSlotContent (slot, idx) {
    const data   = SLIDES[idx];
    const iconEl = slot === 'A' ? iconA : iconB;
    const textEl = slot === 'A' ? textA : textB;
    iconEl.innerHTML = data.icon;
    textEl.textContent = data.text;
  }

  function setSlotClass (slot, className) {
    const el = slot === 'A' ? slotA : slotB;
    // Remove all state classes then add the new one
    el.classList.remove(
      'rtl-slot-active',
      'rtl-slot-next',
      'rtl-slot-transitioning-out',
      'rtl-slot-transitioning-in'
    );
    el.classList.add(className);
  }

  function updateDots (idx) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('rtl-dot-active', i === idx);
    });
  }

  // Init after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
