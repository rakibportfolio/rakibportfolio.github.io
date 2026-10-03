/**
 * Hero 3D Card + Video Controller (v4.0 - Scroll Zoom + Enhanced 3D)
 * - New: scroll-based scale/zoom-in on mobile
 * - Enhanced: smooth 3D tilt on desktop (mouse/pointer)
 * - Enhanced: gyroscope tilt on mobile
 * - Preserved: click-to-play inline video logic
 */
(function () {
  'use strict';

  /* ── DOM refs ────────────────────────────────────────── */
  var scene     = document.getElementById('hero3DScene');
  var wrapper   = document.getElementById('hero3DWrapper');
  var card      = document.getElementById('heroVideoHolder');
  var glare     = document.getElementById('heroCardGlare');
  var heroVideo = document.getElementById('heroTrailerVideo');
  var heroPlayBtn = document.getElementById('heroPlayButton');

  if (!card || !heroVideo) return;

  /* ── Autoplay muted loop on page load ───────────────── */
  heroVideo.muted = true;
  heroVideo.setAttribute('muted', '');
  heroVideo.setAttribute('playsinline', '');
  heroVideo.setAttribute('webkit-playsinline', 'true');
  heroVideo.setAttribute('x5-playsinline', 'true');
  heroVideo.setAttribute('loop', '');

  // Start loading the video
  heroVideo.load();

  var autoplayStarted = false;
  function tryAutoplay() {
    if (autoplayStarted) return;
    heroVideo.muted = true;
    var p = heroVideo.play();
    if (p !== undefined) {
      p.then(function () {
        autoplayStarted = true;
        if (heroPlayBtn) {
          heroPlayBtn.style.opacity = '0';
          heroPlayBtn.style.pointerEvents = 'none';
        }
        card.classList.add('is-video-playing');
      }).catch(function () {
        // autoplay blocked – keep play button visible
      });
    }
  }

  // Try autoplay as soon as data is available
  heroVideo.addEventListener('loadeddata', tryAutoplay);
  heroVideo.addEventListener('canplay', tryAutoplay);
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(tryAutoplay, 400);
  });

  /* ── Click to toggle sound on/off (not pause) ─────── */
  function toggleSound(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (heroVideo.paused) {
      heroVideo.muted = false;
      var p = heroVideo.play();
      if (p !== undefined) {
        p.then(function () {
          if (heroPlayBtn) { heroPlayBtn.style.opacity = '0'; heroPlayBtn.style.pointerEvents = 'none'; }
          card.classList.add('is-video-playing');
        }).catch(function () {
          heroVideo.muted = true;
          heroVideo.play().catch(function () {});
        });
      }
    } else {
      // Toggle mute instead of pause
      heroVideo.muted = !heroVideo.muted;
    }
  }

  card.addEventListener('click', toggleSound);
  if (heroPlayBtn) heroPlayBtn.addEventListener('click', toggleSound);

  heroVideo.addEventListener('play', function () {
    if (heroPlayBtn) { heroPlayBtn.style.opacity = '0'; heroPlayBtn.style.pointerEvents = 'none'; }
    card.classList.add('is-video-playing');
  });
  heroVideo.addEventListener('pause', function () {
    if (heroPlayBtn) { heroPlayBtn.style.opacity = '1'; heroPlayBtn.style.pointerEvents = 'auto'; }
    card.classList.remove('is-video-playing');
  });
  heroVideo.addEventListener('ended', function () {
    heroVideo.currentTime = 0;
    heroVideo.play().catch(function () {});
  });

  /* ── Helpers ─────────────────────────────────────────── */
  var isMobile = ('ontouchstart' in window) || (window.innerWidth <= 900);

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function lerp(a, b, t)    { return a + (b - a) * t; }

  /* ─────────────────────────────────────────────────────── */
  /*  COMPONENT 1: SCROLL-BASED ZOOM IN  (mobile + desktop) */
  /* ─────────────────────────────────────────────────────── */
  var scrollZoomActive = true;
  var currentScale  = 1;
  var targetScale   = 1;
  var rafScrollId   = null;
  // Current 3D rotation state (for composition with 3D tilt)
  var baseRotX = 0; var baseRotY = 0; // From 3D tilt
  var scrollRotX = 0; var scrollRotY = 0; // From scroll

  function getScrollProgress() {
    if (!scene) return 0;
    var rect = scene.getBoundingClientRect();
    var vH   = window.innerHeight;
    // 0 = card centre at bottom of viewport, 1 = card centre at top
    var centre = rect.top + rect.height / 2;
    // Progress: 0 when card is just entering viewport, 1 when fully passed
    var progress = 1 - clamp(centre / vH, 0, 1);
    return progress;
  }

  function applyScrollZoom() {
    var progress = getScrollProgress();
    // Scale: starts at 0.82 when first visible, grows to 1.04 when centred, back to 1 when leaving
    // Peak at progress ~0.5
    var peak = 0.5;
    var scaleVal;
    if (progress < peak) {
      // entering: 0.82 → 1.06
      scaleVal = lerp(0.82, 1.06, progress / peak);
    } else {
      // leaving: 1.06 → 0.96
      scaleVal = lerp(1.06, 0.96, (progress - peak) / (1 - peak));
    }
    targetScale = clamp(scaleVal, 0.75, 1.1);
  }

  // RAF loop for smooth scroll zoom
  function scrollZoomLoop() {
    currentScale = lerp(currentScale, targetScale, 0.1);

    var tX = baseRotX + scrollRotX;
    var tY = baseRotY + scrollRotY;

    if (wrapper) {
      wrapper.style.transform =
        'perspective(1200px)' +
        ' rotateX(' + tX + 'deg)' +
        ' rotateY(' + tY + 'deg)' +
        ' scale3d(' + currentScale + ',' + currentScale + ',1)';
    }

    rafScrollId = requestAnimationFrame(scrollZoomLoop);
  }

  window.addEventListener('scroll', applyScrollZoom, { passive: true });
  applyScrollZoom();
  scrollZoomLoop();

  /* ─────────────────────────────────────────────────────── */
  /*  COMPONENT 2: DESKTOP MOUSE 3D TILT                     */
  /* ─────────────────────────────────────────────────────── */
  if (!isMobile && scene) {
    var targetRotX = 0; var targetRotY = 0;
    var MAX_X = 12; var MAX_Y = 16;

    scene.addEventListener('mousemove', function (e) {
      var rect = scene.getBoundingClientRect();
      var cx   = rect.left + rect.width  / 2;
      var cy   = rect.top  + rect.height / 2;
      var dx   = (e.clientX - cx) / (rect.width  / 2);
      var dy   = (e.clientY - cy) / (rect.height / 2);

      targetRotY =  clamp(dx * MAX_Y, -MAX_Y, MAX_Y);
      targetRotX = -clamp(dy * MAX_X, -MAX_X, MAX_X);

      // Glare follows cursor
      if (glare) {
        var gx = clamp(((e.clientX - rect.left) / rect.width)  * 100, 0, 100);
        var gy = clamp(((e.clientY - rect.top)  / rect.height) * 100, 0, 100);
        glare.style.background =
          'radial-gradient(circle at ' + gx + '% ' + gy + '%, ' +
          'rgba(255,255,255,0.14) 0%, transparent 65%)';
        glare.style.opacity = '1';
      }
    }, { passive: true });

    scene.addEventListener('mouseleave', function () {
      targetRotX = 0; targetRotY = 0;
      if (glare) { glare.style.opacity = '0'; }
    });

    // Blend tilt into base rotation (via RAF)
    (function tiltLoop() {
      baseRotX = lerp(baseRotX, targetRotX, 0.08);
      baseRotY = lerp(baseRotY, targetRotY, 0.08);
      requestAnimationFrame(tiltLoop);
    })();
  }

  /* ─────────────────────────────────────────────────────── */
  /*  COMPONENT 3: MOBILE GYROSCOPE 3D TILT                  */
  /* ─────────────────────────────────────────────────────── */
  if (isMobile && window.DeviceOrientationEvent) {
    var gyroTargetX = 0; var gyroTargetY = 0;
    var gyroBaseSet = false; var baseGamma = 0; var baseBeta = 0;

    window.addEventListener('deviceorientation', function (e) {
      if (!gyroBaseSet && e.gamma !== null) {
        baseGamma = e.gamma;
        baseBeta  = e.beta;
        gyroBaseSet = true;
      }
      if (e.gamma === null) return;
      var relGamma = e.gamma - baseGamma;
      var relBeta  = e.beta  - baseBeta;
      gyroTargetY = clamp(relGamma * 0.4, -10, 10);
      gyroTargetX = clamp(relBeta  * 0.3, -8, 8);
    }, { passive: true });

    // Blend gyro into base rotation
    (function gyroLoop() {
      baseRotX = lerp(baseRotX, gyroTargetX, 0.07);
      baseRotY = lerp(baseRotY, gyroTargetY, 0.07);
      requestAnimationFrame(gyroLoop);
    })();
  }

  /* ─────────────────────────────────────────────────────── */
  /*  COMPONENT 4: GLARE SHIMMER (always on)                 */
  /* ─────────────────────────────────────────────────────── */
  if (glare && isMobile) {
    // Ambient glare shimmer on mobile (no mouse)
    var t = 0;
    (function glareLoop() {
      t += 0.008;
      var gx = 50 + Math.sin(t) * 30;
      var gy = 50 + Math.cos(t * 0.7) * 25;
      glare.style.background =
        'radial-gradient(circle at ' + gx + '% ' + gy + '%, ' +
        'rgba(255,255,255,0.09) 0%, transparent 60%)';
      glare.style.opacity = '0.7';
      requestAnimationFrame(glareLoop);
    })();
  }

})();
