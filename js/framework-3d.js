// Framework 3D Tab System
(function () {
  function initFramework() {
    var btns = document.querySelectorAll('[data-fwk-tab]');
    var panels = document.querySelectorAll('[data-fwk-panel]');
    var dots = document.querySelectorAll('[data-fwk-dot]');
    var current = 0;

    if (!btns.length) return;

    function activateTab(idx) {
      if (idx === current) return;

      // Exit current panel
      var oldPanel = panels[current];
      oldPanel.classList.remove('is-active');
      oldPanel.classList.add('is-exiting');
      setTimeout(function () { oldPanel.classList.remove('is-exiting'); }, 600);

      // Deactivate old btn & dot
      btns[current].classList.remove('is-active');
      btns[current].setAttribute('aria-selected', 'false');
      if (dots[current]) dots[current].classList.remove('is-active');

      current = idx;

      // Activate new
      panels[current].classList.add('is-active');
      btns[current].classList.add('is-active');
      btns[current].setAttribute('aria-selected', 'true');
      if (dots[current]) dots[current].classList.add('is-active');

      // Re-trigger bar animations by resetting them
      panels[current].querySelectorAll('.fwk-bar-fill, .fwk-col-bar').forEach(function (el) {
        el.style.animation = 'none';
        void el.offsetWidth; // reflow
        el.style.animation = '';
      });
    }

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activateTab(parseInt(btn.getAttribute('data-fwk-tab')));
      });
    });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        activateTab(parseInt(dot.getAttribute('data-fwk-dot')));
      });
    });

    // Auto-advance every 6 seconds
    var autoTimer = setInterval(function () {
      activateTab((current + 1) % btns.length);
    }, 6000);

    // Pause on hover
    var arena = document.querySelector('.fwk-arena');
    if (arena) {
      arena.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
      arena.addEventListener('mouseleave', function () {
        autoTimer = setInterval(function () {
          activateTab((current + 1) % btns.length);
        }, 6000);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFramework);
  } else {
    initFramework();
  }
})();
