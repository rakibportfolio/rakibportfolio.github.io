/**
 * Hero 3D Interactive Engine (v1.4)
 * - Desktop Mouse Tilt Physics (dynamic glare, multi-depth badges, 3D perspective)
 * - Mobile Scroll 3D Dynamic Tilt (punchy perspective, velocity response, sustained depth)
 * - Mobile Touch Drag 3D Physics (1:1 finger tracking tilt & interactive glare)
 * - Gyroscope device tilt support (for mobile orientation)
 * - Pure Inline Video Playback (zero lag, no popup modal, toggle in-place with audio)
 */

document.addEventListener('DOMContentLoaded', function () {
  const scene = document.getElementById('hero3DScene');
  const wrapper = document.getElementById('hero3DWrapper');
  const card = document.getElementById('heroVideoHolder');
  const glare = document.getElementById('heroCardGlare');
  const heroVideo = document.getElementById('heroTrailerVideo');
  const heroPlayBtn = document.getElementById('heroPlayButton');
  const heroTitle = document.querySelector('.hero-title h1');
  const bgLeft = document.querySelector('.hero-bg-left');
  const bgRight = document.querySelector('.hero-bg-right');

  if (!wrapper || !card) return;

  // 3D Physics State
  let targetRotX = 0;
  let targetRotY = 0;
  let curRotX = 0;
  let curRotY = 0;
  let targetScale = 1;
  let curScale = 1;
  let targetGlareOpacity = 0;
  let curGlareOpacity = 0;

  let isInteracting = false;
  let isTouchActive = false;
  let isScrolling = false;
  let scrollSettleTimer = null;
  let touchResumeTimer = null;

  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  let touchStartX = 0;
  let touchStartY = 0;

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 991);
  const perspectiveVal = isTouchDevice ? 650 : 1100;

  // ─── 60/120 FPS High-Performance Smooth Physics Loop ───
  function update3DFrame() {
    const diffX = Math.abs(targetRotX - curRotX);
    const diffY = Math.abs(targetRotY - curRotY);
    const diffS = Math.abs(targetScale - curScale);
    const diffG = Math.abs(targetGlareOpacity - curGlareOpacity);

    // Only update style when actively in motion or interacting
    if (diffX > 0.02 || diffY > 0.02 || diffS > 0.002 || diffG > 0.01 || isInteracting || isTouchActive || isScrolling) {
      curRotX += (targetRotX - curRotX) * 0.12;
      curRotY += (targetRotY - curRotY) * 0.12;
      curScale += (targetScale - curScale) * 0.12;
      curGlareOpacity += (targetGlareOpacity - curGlareOpacity) * 0.12;

      wrapper.style.transform = `perspective(${perspectiveVal}px) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg) scale3d(${curScale.toFixed(3)}, ${curScale.toFixed(3)}, ${curScale.toFixed(3)})`;
      if (glare) {
        glare.style.opacity = curGlareOpacity.toFixed(2);
      }
    } else if (!isInteracting && !isTouchActive && !isScrolling && (window.pageYOffset || document.documentElement.scrollTop) < 20) {
      // Return to ambient loop only when sitting at the absolute top of the page
      if (!wrapper.classList.contains('is-ambient')) {
        wrapper.style.transform = '';
        wrapper.classList.add('is-ambient');
      }
    }

    requestAnimationFrame(update3DFrame);
  }
  requestAnimationFrame(update3DFrame);

  // ─── Desktop Mouse Hover Physics ───
  function onMouseMove(e) {
    if (isTouchActive || isTouchDevice) return;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = (e.clientX - centerX) / (rect.width / 2);
    const distY = (e.clientY - centerY) / (rect.height / 2);

    const normX = Math.max(-1.3, Math.min(1.3, distX));
    const normY = Math.max(-1.3, Math.min(1.3, distY));

    isInteracting = true;
    wrapper.classList.remove('is-ambient');

    targetRotY = normX * 14;
    targetRotX = -normY * 12;
    targetScale = 1.03;
    targetGlareOpacity = 0.85;

    if (glare) {
      const glareX = ((normX + 1) / 2) * 100;
      const glareY = ((normY + 1) / 2) * 100;
      glare.style.background = `radial-gradient(circle 380px at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 149, 97, 0.2) 35%, transparent 70%)`;
    }

    if (heroTitle) {
      heroTitle.style.transform = `perspective(800px) rotateY(${(normX * 2.8).toFixed(1)}deg) rotateX(${(-normY * 2.0).toFixed(1)}deg)`;
    }
  }

  function onMouseLeave() {
    if (isTouchActive || isTouchDevice) return;
    isInteracting = false;
    targetRotX = 0;
    targetRotY = 0;
    targetScale = 1;
    targetGlareOpacity = 0;

    if (heroTitle) {
      heroTitle.style.transform = '';
    }
  }

  if (scene) {
    scene.addEventListener('mousemove', onMouseMove);
    scene.addEventListener('mouseleave', onMouseLeave);
    const heroSec = document.querySelector('.hero-section');
    if (heroSec) heroSec.addEventListener('mouseleave', onMouseLeave);
  }

  // ─── Mobile Scroll 3D Dynamic Tilt (Punchy & Sustained like PC Hover) ───
  function onScroll3D() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDelta = scrollY - lastScrollY;
    lastScrollY = scrollY;

    const heroRect = card.getBoundingClientRect();
    const vh = window.innerHeight || 800;

    // Is the hero card in viewport?
    if (heroRect.top < vh && heroRect.bottom > 0) {
      isScrolling = true;
      wrapper.classList.remove('is-ambient');

      // Normalized position of card center relative to viewport center: -1.0 (top) to +1.0 (bottom)
      const cardCenterY = heroRect.top + heroRect.height / 2;
      const normY = Math.max(-1.0, Math.min(1.0, (cardCenterY - vh / 2) / (vh / 2)));

      if (isTouchDevice || window.innerWidth <= 991) {
        // Mobile 3D Scroll Tilt:
        // As you scroll down (card travels up, normY becomes negative), card tilts backwards/up
        // Scroll velocity impulse gives realistic physical weight
        const impulse = Math.max(-9, Math.min(9, scrollDelta * 0.28));
        const tiltX = -normY * 16 + impulse;
        const tiltY = Math.sin(normY * Math.PI) * 9.5;

        targetRotX = Math.max(-19, Math.min(19, tiltX));
        targetRotY = Math.max(-14, Math.min(14, tiltY));
        targetScale = 1.025;

        // Dynamic Glare Sheen sweep across card during mobile scroll
        if (glare) {
          const glareProgressY = Math.max(10, Math.min(90, ((normY + 1) / 2) * 100));
          const glareProgressX = Math.max(15, Math.min(85, 50 + Math.sin(normY * 3.2) * 35));
          glare.style.background = `radial-gradient(circle 320px at ${glareProgressX.toFixed(1)}% ${glareProgressY.toFixed(1)}%, rgba(255, 255, 255, 0.48) 0%, rgba(255, 149, 97, 0.25) 38%, transparent 72%)`;
          targetGlareOpacity = Math.max(0.3, Math.min(0.95, Math.abs(normY) * 0.9 + 0.2));
        }

        // When scrolling settles on mobile, sustain the natural perspective of its position
        clearTimeout(scrollSettleTimer);
        scrollSettleTimer = setTimeout(() => {
          isScrolling = false;
          // Sustain the realistic perspective for where the card currently rests on the screen!
          targetRotX = Math.max(-15, Math.min(15, -normY * 13));
          targetRotY = Math.sin(normY * Math.PI) * 7.5;
          targetScale = 1.0;
          targetGlareOpacity = Math.max(0, Math.min(0.6, Math.abs(normY) * 0.6));
        }, 160);
      } else {
        // Desktop subtle scroll pitch
        curRotX += (Math.min(9, scrollY * 0.016) - curRotX) * 0.1;
      }

      // Background visual layers parallax
      if (bgLeft) bgLeft.style.transform = `translate3d(0, ${(scrollY * 0.16).toFixed(1)}px, 0)`;
      if (bgRight) bgRight.style.transform = `translate3d(0, ${(scrollY * -0.12).toFixed(1)}px, 0)`;
    } else {
      isScrolling = false;
    }
  }
  window.addEventListener('scroll', onScroll3D, { passive: true });

  // ─── Mobile Touch Drag Physics (1:1 responsive touch tilt on card) ───
  function onTouchStart(e) {
    if (e.touches.length !== 1) return;
    isTouchActive = true;
    isInteracting = true;
    wrapper.classList.remove('is-ambient');
    card.classList.add('is-touch-active');
    clearTimeout(touchResumeTimer);
    clearTimeout(scrollSettleTimer);

    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    targetScale = 1.035;
  }

  function onTouchMove(e) {
    if (!isTouchActive || e.touches.length !== 1) return;
    const curX = e.touches[0].clientX;
    const curY = e.touches[0].clientY;

    const diffX = curX - touchStartX;
    const diffY = curY - touchStartY;

    targetRotY = Math.max(-18, Math.min(18, diffX * 0.18));
    targetRotX = Math.max(-16, Math.min(16, -diffY * 0.15));

    if (glare) {
      const rect = card.getBoundingClientRect();
      const touchRelX = Math.max(0, Math.min(100, ((curX - rect.left) / rect.width) * 100));
      const touchRelY = Math.max(0, Math.min(100, ((curY - rect.top) / rect.height) * 100));
      glare.style.background = `radial-gradient(circle 280px at ${touchRelX.toFixed(1)}% ${touchRelY.toFixed(1)}%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 149, 97, 0.28) 40%, transparent 75%)`;
      targetGlareOpacity = 0.9;
    }
  }

  function onTouchEnd() {
    if (!isTouchActive) return;
    isTouchActive = false;
    card.classList.remove('is-touch-active');
    targetScale = 1;
    targetGlareOpacity = 0;

    touchResumeTimer = setTimeout(() => {
      isInteracting = false;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY < 20 && !isScrolling) {
        targetRotX = 0;
        targetRotY = 0;
        wrapper.classList.add('is-ambient');
      }
    }, 1000);
  }

  card.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });

  // ─── Inline Hero Video Playback (Strictly In-Place, No Modal Popup) ───
  if (heroVideo && card) {
    function toggleInlineVideo(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (heroVideo.paused) {
        heroVideo.muted = false;
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            if (heroPlayBtn) {
              heroPlayBtn.style.opacity = '0';
              heroPlayBtn.style.pointerEvents = 'none';
            }
            card.classList.add('is-video-playing');
          }).catch(() => {
            // Fallback for browsers requiring initial muted playback
            heroVideo.muted = true;
            heroVideo.play().then(() => {
              if (heroPlayBtn) {
                heroPlayBtn.style.opacity = '0';
                heroPlayBtn.style.pointerEvents = 'none';
              }
              card.classList.add('is-video-playing');
            }).catch(() => {});
          });
        }
      } else {
        heroVideo.pause();
        if (heroPlayBtn) {
          heroPlayBtn.style.opacity = '1';
          heroPlayBtn.style.pointerEvents = 'auto';
        }
        card.classList.remove('is-video-playing');
      }
    }

    card.addEventListener('click', toggleInlineVideo);
    heroVideo.addEventListener('click', toggleInlineVideo);
    if (heroPlayBtn) {
      heroPlayBtn.addEventListener('click', toggleInlineVideo);
    }

    heroVideo.addEventListener('play', () => {
      if (heroPlayBtn) {
        heroPlayBtn.style.opacity = '0';
        heroPlayBtn.style.pointerEvents = 'none';
      }
      card.classList.add('is-video-playing');
    });

    heroVideo.addEventListener('pause', () => {
      if (heroPlayBtn) {
        heroPlayBtn.style.opacity = '1';
        heroPlayBtn.style.pointerEvents = 'auto';
      }
      card.classList.remove('is-video-playing');
    });

    heroVideo.addEventListener('ended', () => {
      if (heroPlayBtn) {
        heroPlayBtn.style.opacity = '1';
        heroPlayBtn.style.pointerEvents = 'auto';
      }
      card.classList.remove('is-video-playing');
    });
  }
});
