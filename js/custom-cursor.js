/**
 * Zentic 3D Glossy Badge Custom Cursor Engine (v1.0)
 * - 60/120 FPS Lerp Follower Physics
 * - Velocity-Driven Tilt & Aerodynamic Stretch
 * - Luminous Electric Purple Particle Spark Trail
 * - Radial Click Shockwave Ring & Micro-Spark Bursts
 * - Dynamic Scroll Inertia Tilt & Elastic Bounce
 * - Desktop-Only Non-Intrusive Optimization
 */

(function () {
  // Mobile / Touch check - do not initialize on touch devices
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 991);
  if (isTouch) return;

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', initZenticCursor);

  function initZenticCursor() {
    // Check if root already exists
    if (document.getElementById('zenticCursorRoot')) return;

    // ─── 1. Build DOM Structure ───
    const root = document.createElement('div');
    root.id = 'zenticCursorRoot';

    const canvas = document.createElement('canvas');
    canvas.id = 'zenticParticleCanvas';

    const glow = document.createElement('div');
    glow.id = 'zenticCursorGlow';

    const badge = document.createElement('div');
    badge.id = 'zenticCursorBadge';
    const badgeImg = document.createElement('img');
    badgeImg.src = 'assets/cursor_badge.png?v=1';
    badgeImg.alt = 'Zentic Cursor';
    badge.appendChild(badgeImg);

    const dot = document.createElement('div');
    dot.id = 'zenticCursorDot';

    root.appendChild(canvas);
    root.appendChild(glow);
    root.appendChild(badge);
    root.appendChild(dot);
    document.body.appendChild(root);

    // Canvas setup
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // ─── 2. Physics & State Variables ───
    let mouseX = -200, mouseY = -200;
    let badgeX = -200, badgeY = -200;
    let glowX = -200, glowY = -200;
    let prevMouseX = -200, prevMouseY = -200;

    let velX = 0, velY = 0;
    let currentTilt = 0;
    let currentScale = 1;
    let targetScale = 1;

    let isHoveringClickable = false;
    let isMouseDown = false;
    let isInsideWindow = false;

    // Scroll state
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let scrollVelY = 0;
    let scrollTilt = 0;

    // Particle pool
    const particles = [];
    const PARTICLE_COLORS = [
      '#FFFFFF',
      '#D700FE',
      '#B800F5',
      '#E879F9',
      '#F3E8FF',
      'rgba(215, 0, 254, 0.85)'
    ];

    // ─── 3. Event Listeners ───
    window.addEventListener('mousemove', (e) => {
      if (!isInsideWindow) {
        isInsideWindow = true;
        badge.classList.remove('z-cursor-hidden');
        dot.classList.remove('z-cursor-hidden');
        glow.classList.remove('z-cursor-hidden');
      }

      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update precision dot instantly with zero lag
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      // Spawn trail particles based on movement distance
      const dist = Math.hypot(mouseX - prevMouseX, mouseY - prevMouseY);
      if (dist > 7) {
        spawnTrailParticle(mouseX, mouseY, dist);
        prevMouseX = mouseX;
        prevMouseY = mouseY;
      }
    });

    document.addEventListener('mouseleave', () => {
      isInsideWindow = false;
      badge.classList.add('z-cursor-hidden');
      dot.classList.add('z-cursor-hidden');
      glow.classList.add('z-cursor-hidden');
    });

    document.addEventListener('mouseenter', () => {
      isInsideWindow = true;
      badge.classList.remove('z-cursor-hidden');
      dot.classList.remove('z-cursor-hidden');
      glow.classList.remove('z-cursor-hidden');
    });

    // Mousedown / Click Burst Shockwave
    window.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      document.body.classList.add('z-cursor-down');
      targetScale = 0.72;

      // 1. Spawn Shockwave Ring
      spawnShockwave(e.clientX, e.clientY);

      // 2. Spawn 360-degree Micro-Burst Sparks
      spawnClickBurst(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => {
      isMouseDown = false;
      document.body.classList.remove('z-cursor-down');
      targetScale = isHoveringClickable ? 1.25 : 1;
    });

    // Scroll Inertia Tracking
    window.addEventListener('scroll', () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      scrollVelY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      scrollTilt = Math.max(-25, Math.min(25, scrollVelY * 0.45));
    }, { passive: true });

    // Interactive Hover Elements Detection
    const interactiveSelector = 'a, button, input, textarea, select, [role="button"], .sv3-tab, .hub-logo-pill, .na-outer-border, .svc-card, .footer-link';
    
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(interactiveSelector);
      if (target) {
        isHoveringClickable = true;
        document.body.classList.add('z-cursor-hover');
        if (!isMouseDown) targetScale = 1.28;
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest(interactiveSelector);
      if (target) {
        isHoveringClickable = false;
        document.body.classList.remove('z-cursor-hover');
        if (!isMouseDown) targetScale = 1;
      }
    });

    // ─── 4. Particle Spawners ───
    function spawnTrailParticle(x, y, speed) {
      if (particles.length > 90) return; // Keep memory bounded
      const angle = Math.random() * Math.PI * 2;
      const spread = (Math.random() - 0.5) * 12;
      particles.push({
        x: x + spread,
        y: y + spread,
        vx: (Math.random() - 0.5) * 1.5 - (velX * 0.1),
        vy: (Math.random() - 0.5) * 1.5 - (velY * 0.1),
        size: Math.random() * 3.5 + 1.5,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        alpha: 0.9,
        decay: Math.random() * 0.035 + 0.02
      });
    }

    function spawnClickBurst(x, y) {
      const count = 16;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.2);
        const speed = Math.random() * 4.5 + 2.5;
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 2,
          color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
          alpha: 1,
          decay: Math.random() * 0.04 + 0.025
        });
      }
    }

    function spawnShockwave(x, y) {
      const wave = document.createElement('div');
      wave.className = 'z-shockwave';
      wave.style.left = `${x}px`;
      wave.style.top = `${y}px`;
      root.appendChild(wave);
      setTimeout(() => {
        if (wave.parentNode) wave.parentNode.removeChild(wave);
      }, 550);
    }

    // ─── 5. 60/120 FPS Main Physics Animation Loop ───
    function renderLoop() {
      // Smooth lerp follower physics
      badgeX += (mouseX - badgeX) * 0.16;
      badgeY += (mouseY - badgeY) * 0.16;

      glowX += (mouseX - glowX) * 0.10;
      glowY += (mouseY - glowY) * 0.10;

      // Calculate instantaneous velocity
      velX = mouseX - badgeX;
      velY = mouseY - badgeY;
      const speed = Math.hypot(velX, velY);

      // Dynamic tilt based on horizontal velocity and vertical scroll
      const targetTilt = Math.max(-32, Math.min(32, velX * 0.45));
      currentTilt += (targetTilt + scrollTilt - currentTilt) * 0.12;
      scrollTilt *= 0.90; // Decay scroll tilt elastically

      // Smooth scale interpolation (squish / bounce)
      currentScale += (targetScale - currentScale) * 0.18;

      // Aerodynamic stretch when moving quickly
      const stretchX = currentScale * (1 + Math.min(speed * 0.0025, 0.22));
      const stretchY = currentScale * (1 - Math.min(speed * 0.0018, 0.16));

      // Apply transforms
      if (isInsideWindow && mouseX > -100) {
        badge.style.transform = `translate3d(${badgeX.toFixed(2)}px, ${badgeY.toFixed(2)}px, 0) translate(-50%, -50%) rotate(${currentTilt.toFixed(2)}deg) scale3d(${stretchX.toFixed(3)}, ${stretchY.toFixed(3)}, 1)`;
        glow.style.transform = `translate3d(${glowX.toFixed(2)}px, ${glowY.toFixed(2)}px, 0) translate(-50%, -50%)`;
      }

      // ─── Update & Render Particles ───
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.alpha -= p.decay;
        p.size *= 0.97;

        if (p.alpha <= 0 || p.size <= 0.4) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#D700FE';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(renderLoop);
    }

    requestAnimationFrame(renderLoop);
  }
})();
