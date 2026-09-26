/**
 * Hero 3D Interactive Engine
 * - Desktop Mouse Tilt Physics with dynamic glare & depth parallax
 * - Mobile Touch Physics with responsive tilt & smooth inertia return
 * - Mobile Ambient 3D floating state (seamless idle loop)
 * - Device Gyroscope tilt support (when permitted)
 * - Scroll-driven 3D camera depth & vertical parallax
 */

document.addEventListener('DOMContentLoaded', function () {
  const scene = document.getElementById('hero3DScene');
  const wrapper = document.getElementById('hero3DWrapper');
  const card = document.getElementById('heroVideoHolder');
  const glare = document.getElementById('heroCardGlare');
  const badges = document.querySelectorAll('.hero-edit-decorations .edit-floating-badge, .mobile-only-badge');
  const heroTitle = document.querySelector('.hero-title h1');
  const bgLeft = document.querySelector('.hero-bg-left');
  const bgRight = document.querySelector('.hero-bg-right');

  if (!wrapper || !card) return;

  let targetRotX = 0;
  let targetRotY = 0;
  let curRotX = 0;
  let curRotY = 0;
  let targetScale = 1;
  let curScale = 1;
  let scrollYOffset = 0;
  let scrollPitch = 0;

  let isInteracting = false;
  let isTouchActive = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchCurrentX = 0;
  let touchCurrentY = 0;
  let touchResumeTimer = null;

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  // High-performance continuous RAF loop with fluid spring lerp
  function update3DFrame() {
    curRotX += (targetRotX - curRotX) * 0.085;
    curRotY += (targetRotY - curRotY) * 0.085;
    curScale += (targetScale - curScale) * 0.085;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    if (isInteracting || isTouchActive || scrollY > 8) {
      const finalRotX = curRotX + scrollPitch;
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

  // Desktop Mouse Physics
  function onMouseMove(e) {
    if (isTouchActive) return;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = (e.clientX - centerX) / (rect.width / 2);
    const distY = (e.clientY - centerY) / (rect.height / 2);

    const normX = Math.max(-1.4, Math.min(1.4, distX));
    const normY = Math.max(-1.4, Math.min(1.4, distY));

    isInteracting = true;
    wrapper.classList.remove('is-ambient');

    targetRotY = normX * 12;
    targetRotX = -normY * 10;
    targetScale = 1.025;

    if (glare) {
      const glareX = ((normX + 1) / 2) * 100;
      const glareY = ((normY + 1) / 2) * 100;
      glare.style.background = `radial-gradient(circle 380px at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 149, 97, 0.15) 35%, transparent 70%)`;
      glare.style.opacity = '1';
    }

    badges.forEach(b => {
      const depth = parseFloat(b.getAttribute('data-depth')) || 0.03;
      const bx = normX * depth * 80;
      const by = normY * depth * 80;
      b.style.transform = `translate3d(${bx.toFixed(1)}px, ${by.toFixed(1)}px, 0)`;
    });

    if (heroTitle) {
      heroTitle.style.transform = `perspective(800px) rotateY(${(normX * 2.2).toFixed(1)}deg) rotateX(${(-normY * 1.5).toFixed(1)}deg)`;
    }
  }

  function onMouseLeave() {
    if (isTouchActive) return;
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

  // Mobile Touch Physics (Touch Tilt & Inertia)
  function onTouchStart(e) {
    if (e.touches.length !== 1) return;
    isTouchActive = true;
    isInteracting = true;
    wrapper.classList.remove('is-ambient');
    card.classList.add('is-touch-active');
    clearTimeout(touchResumeTimer);

    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchCurrentX = touchStartX;
    touchCurrentY = touchStartY;
    targetScale = 1.03;
  }

  function onTouchMove(e) {
    if (!isTouchActive || e.touches.length !== 1) return;
    touchCurrentX = e.touches[0].clientX;
    touchCurrentY = e.touches[0].clientY;

    const diffX = touchCurrentX - touchStartX;
    const diffY = touchCurrentY - touchStartY;

    targetRotY = Math.max(-14, Math.min(14, diffX * 0.12));
    targetRotX = Math.max(-12, Math.min(12, -diffY * 0.1));

    if (glare) {
      const rect = card.getBoundingClientRect();
      const touchRelX = Math.max(0, Math.min(100, ((touchCurrentX - rect.left) / rect.width) * 100));
      const touchRelY = Math.max(0, Math.min(100, ((touchCurrentY - rect.top) / rect.height) * 100));
      glare.style.background = `radial-gradient(circle 260px at ${touchRelX.toFixed(1)}% ${touchRelY.toFixed(1)}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 149, 97, 0.2) 40%, transparent 75%)`;
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
      wrapper.classList.add('is-ambient');
    }, 1200);
  }

  card.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });

  // Mobile Gyroscope (DeviceOrientation)
  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
    window.addEventListener('deviceorientation', function (ev) {
      if (isInteracting || isTouchActive) return;
      if (ev.gamma !== null && ev.beta !== null) {
        const gyroX = Math.max(-7, Math.min(7, (ev.beta - 40) * 0.22));
        const gyroY = Math.max(-7, Math.min(7, ev.gamma * 0.22));
        curRotX += (gyroX - curRotX) * 0.05;
        curRotY += (gyroY - curRotY) * 0.05;
      }
    }, { passive: true });
  }

  // Scroll 3D Parallax & Depth Pitch
  function onScroll3D() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const heroRect = scene ? scene.getBoundingClientRect() : null;
    if (heroRect && heroRect.top < window.innerHeight && heroRect.bottom > 0) {
      scrollYOffset = scrollY * 0.12;
      scrollPitch = Math.min(10, scrollY * 0.018);
      if (bgLeft) bgLeft.style.transform = `translate3d(0, ${(scrollY * 0.16).toFixed(1)}px, 0)`;
      if (bgRight) bgRight.style.transform = `translate3d(0, ${(scrollY * -0.12).toFixed(1)}px, 0)`;
    } else {
      scrollYOffset = 0;
      scrollPitch = 0;
    }
  }
  window.addEventListener('scroll', onScroll3D, { passive: true });
});
