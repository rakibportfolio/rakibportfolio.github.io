/**
 * Hero 3D Interactive Engine
 * - Desktop Mouse Tilt Physics (dynamic glare, multi-depth badges, 3D title)
 * - Mobile Scroll 3D Dynamic Tilt (mimics desktop hover during scrolling on mobile)
 * - Mobile Touch Drag Physics with spring inertia return
 * - Mobile Ambient 3D floating state (seamless idle figure-8 loop)
 * - Device Gyroscope tilt support (when permitted)
 * - Pure Inline Video Playback (no modal popup, direct click-to-play with sound)
 */

document.addEventListener('DOMContentLoaded', function () {
  const scene = document.getElementById('hero3DScene');
  const wrapper = document.getElementById('hero3DWrapper');
  const card = document.getElementById('heroVideoHolder');
  const glare = document.getElementById('heroCardGlare');
  const heroVideo = document.getElementById('heroTrailerVideo');
  const heroPlayBtn = document.getElementById('heroPlayButton');
  const badges = document.querySelectorAll('.hero-edit-decorations .edit-floating-badge, .mobile-only-badge');
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
  let scrollYOffset = 0;

  let isInteracting = false;
  let isTouchActive = false;
  let isScrolling = false;
  let scrollSettleTimer = null;
  let touchResumeTimer = null;

  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  let touchStartX = 0;
  let touchStartY = 0;

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 991);

  // ─── 60/120 FPS Continuous Physics Engine (Spring Lerp) ───
  function update3DFrame() {
    curRotX += (targetRotX - curRotX) * 0.088;
    curRotY += (targetRotY - curRotY) * 0.088;
    curScale += (targetScale - curScale) * 0.088;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    if (isInteracting || isTouchActive || isScrolling || scrollY > 6) {
      const finalRotX = curRotX;
      const finalRotY = curRotY;
      const finalTransY = scrollYOffset;
      wrapper.style.transform = `perspective(1200px) rotateX(${finalRotX.toFixed(2)}deg) rotateY(${finalRotY.toFixed(2)}deg) translateY(${finalTransY.toFixed(1)}px) scale3d(${curScale.toFixed(3)}, ${curScale.toFixed(3)}, ${curScale.toFixed(3)})`;
    } else if (!wrapper.classList.contains('is-ambient')) {
      if (Math.abs(curRotX) < 0.05 && Math.abs(curRotY) < 0.05 && Math.abs(curScale - 1) < 0.005) {
        wrapper.style.transform = '';
        wrapper.classList.add('is-ambient');
      } else {
        wrapper.style.transform = `perspective(1200px) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg) scale3d(${curScale.toFixed(3)}, ${curScale.toFixed(3)}, ${curScale.toFixed(3)})`;
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

    const normX = Math.max(-1.4, Math.min(1.4, distX));
    const normY = Math.max(-1.4, Math.min(1.4, distY));

    isInteracting = true;
    wrapper.classList.remove('is-ambient');

    targetRotY = normX * 13;
    targetRotX = -normY * 11;
    targetScale = 1.028;

    if (glare) {
      const glareX = ((normX + 1) / 2) * 100;
      const glareY = ((normY + 1) / 2) * 100;
      glare.style.background = `radial-gradient(circle 380px at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(255, 255, 255, 0.38) 0%, rgba(255, 149, 97, 0.18) 35%, transparent 70%)`;
      glare.style.opacity = '1';
    }

    badges.forEach(b => {
      const depth = parseFloat(b.getAttribute('data-depth')) || 0.03;
      const bx = normX * depth * 85;
      const by = normY * depth * 85;
      b.style.transform = `translate3d(${bx.toFixed(1)}px, ${by.toFixed(1)}px, 0)`;
    });

    if (heroTitle) {
      heroTitle.style.transform = `perspective(800px) rotateY(${(normX * 2.5).toFixed(1)}deg) rotateX(${(-normY * 1.8).toFixed(1)}deg)`;
    }
  }

  function onMouseLeave() {
    if (isTouchActive || isTouchDevice) return;
    isInteracting = false;
    targetRotX = 0;
    targetRotY = 0;
    targetScale = 1;

    if (glare) {
      glare.style.opacity = '0';
    }

    badges.forEach(b => {
      b.style.transform = '';
    });

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

  // ─── Mobile Scroll 3D Dynamic Tilt (Mimics Desktop Hover on Mobile Scroll) ───
  function onScroll3D() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDelta = scrollY - lastScrollY;
    lastScrollY = scrollY;

    const heroRect = card.getBoundingClientRect();
    const vh = window.innerHeight || 800;

    // Is the hero card anywhere in view?
    if (heroRect.top < vh && heroRect.bottom > 0) {
      isScrolling = true;
      wrapper.classList.remove('is-ambient');

      // Normalized position of card center relative to viewport center: -1.0 to +1.0
      const cardCenterY = heroRect.top + heroRect.height / 2;
      const normY = Math.max(-1.2, Math.min(1.2, (cardCenterY - vh / 2) / (vh / 2)));

      // Parallax vertical offset
      scrollYOffset = scrollY * 0.12;

      // On Mobile / Touch Devices: Dynamic 3D tilt during scroll
      if (isTouchDevice || window.innerWidth <= 991) {
        // As you scroll down (normY becomes negative): tilts forward; scrolling up: tilts backward
        // Add scroll velocity impulse for physical momentum
        const tiltX = -normY * 12 + Math.max(-8, Math.min(8, scrollDelta * 0.22));
        const tiltY = Math.sin(normY * Math.PI) * 7;

        targetRotX = Math.max(-16, Math.min(16, tiltX));
        targetRotY = Math.max(-12, Math.min(12, tiltY));
        targetScale = 1.02;

        // Dynamic Glare Sheen sweep across card during scroll
        if (glare) {
          const glareProgressY = Math.max(10, Math.min(90, ((normY + 1) / 2) * 100));
          const glareProgressX = Math.max(15, Math.min(85, 50 + Math.sin(normY * 3.5) * 35));
          glare.style.background = `radial-gradient(circle 300px at ${glareProgressX.toFixed(1)}% ${glareProgressY.toFixed(1)}%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 149, 97, 0.22) 38%, transparent 72%)`;
          glare.style.opacity = '0.9';
        }

        // Parallax badges on mobile scroll
        badges.forEach(b => {
          const depth = parseFloat(b.getAttribute('data-depth')) || 0.03;
          const by = -normY * depth * 75;
          const bx = Math.sin(normY * 2) * depth * 50;
          b.style.transform = `translate3d(${bx.toFixed(1)}px, ${by.toFixed(1)}px, 0)`;
        });

        // 3D Title depth on mobile scroll
        if (heroTitle) {
          heroTitle.style.transform = `perspective(800px) rotateX(${(-normY * 3).toFixed(1)}deg) rotateY(${(tiltY * 0.25).toFixed(1)}deg)`;
        }
      } else {
        // On desktop, subtle scroll pitch into distance
        curRotX += (Math.min(9, scrollY * 0.016) - curRotX) * 0.1;
      }

      // Background visual layers parallax
      if (bgLeft) bgLeft.style.transform = `translate3d(0, ${(scrollY * 0.16).toFixed(1)}px, 0)`;
      if (bgRight) bgRight.style.transform = `translate3d(0, ${(scrollY * -0.12).toFixed(1)}px, 0)`;

      // Debounced settle back to ambient float when scrolling stops
      clearTimeout(scrollSettleTimer);
      scrollSettleTimer = setTimeout(() => {
        isScrolling = false;
        if (!isInteracting && !isTouchActive) {
          targetRotX = 0;
          targetRotY = 0;
          targetScale = 1;
          if (glare) glare.style.opacity = '0';
          wrapper.classList.add('is-ambient');
        }
      }, 220);
    } else {
      scrollYOffset = 0;
    }
  }
  window.addEventListener('scroll', onScroll3D, { passive: true });

  // ─── Mobile Touch Drag Physics (1:1 responsive touch tilt) ───
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
    targetScale = 1.03;
  }

  function onTouchMove(e) {
    if (!isTouchActive || e.touches.length !== 1) return;
    const curX = e.touches[0].clientX;
    const curY = e.touches[0].clientY;

    const diffX = curX - touchStartX;
    const diffY = curY - touchStartY;

    targetRotY = Math.max(-15, Math.min(15, diffX * 0.14));
    targetRotX = Math.max(-14, Math.min(14, -diffY * 0.12));

    if (glare) {
      const rect = card.getBoundingClientRect();
      const touchRelX = Math.max(0, Math.min(100, ((curX - rect.left) / rect.width) * 100));
      const touchRelY = Math.max(0, Math.min(100, ((curY - rect.top) / rect.height) * 100));
      glare.style.background = `radial-gradient(circle 260px at ${touchRelX.toFixed(1)}% ${touchRelY.toFixed(1)}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 149, 97, 0.25) 40%, transparent 75%)`;
      glare.style.opacity = '1';
    }
  }

  function onTouchEnd() {
    if (!isTouchActive) return;
    isTouchActive = false;
    card.classList.remove('is-touch-active');
    targetRotX = 0;
    targetRotY = 0;
    targetScale = 1;

    if (glare) {
      glare.style.opacity = '0';
    }

    touchResumeTimer = setTimeout(() => {
      isInteracting = false;
      if (!isScrolling) {
        wrapper.classList.add('is-ambient');
      }
    }, 1400);
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
