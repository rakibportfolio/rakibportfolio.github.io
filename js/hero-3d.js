/**
 * Hero Video Playback (v2.0 - Performance)
 * Only inline video play/pause. All 3D/tilt/cursor/touch effects removed for speed.
 */
document.addEventListener('DOMContentLoaded', function () {
  var card        = document.getElementById('heroVideoHolder');
  var heroVideo   = document.getElementById('heroTrailerVideo');
  var heroPlayBtn = document.getElementById('heroPlayButton');

  if (!heroVideo || !card) return;

  function toggleInlineVideo(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (heroVideo.paused) {
      heroVideo.muted = false;
      var p = heroVideo.play();
      if (p !== undefined) {
        p.then(function() {
          if (heroPlayBtn) { heroPlayBtn.style.opacity = '0'; heroPlayBtn.style.pointerEvents = 'none'; }
          card.classList.add('is-video-playing');
        }).catch(function() {
          heroVideo.muted = true;
          heroVideo.play().then(function() {
            if (heroPlayBtn) { heroPlayBtn.style.opacity = '0'; heroPlayBtn.style.pointerEvents = 'none'; }
            card.classList.add('is-video-playing');
          }).catch(function() {});
        });
      }
    } else {
      heroVideo.pause();
      if (heroPlayBtn) { heroPlayBtn.style.opacity = '1'; heroPlayBtn.style.pointerEvents = 'auto'; }
      card.classList.remove('is-video-playing');
    }
  }

  card.addEventListener('click', toggleInlineVideo);
  heroVideo.addEventListener('click', toggleInlineVideo);
  if (heroPlayBtn) heroPlayBtn.addEventListener('click', toggleInlineVideo);

  heroVideo.addEventListener('play', function() {
    if (heroPlayBtn) { heroPlayBtn.style.opacity = '0'; heroPlayBtn.style.pointerEvents = 'none'; }
    card.classList.add('is-video-playing');
  });
  heroVideo.addEventListener('pause', function() {
    if (heroPlayBtn) { heroPlayBtn.style.opacity = '1'; heroPlayBtn.style.pointerEvents = 'auto'; }
    card.classList.remove('is-video-playing');
  });
  heroVideo.addEventListener('ended', function() {
    if (heroPlayBtn) { heroPlayBtn.style.opacity = '1'; heroPlayBtn.style.pointerEvents = 'auto'; }
    card.classList.remove('is-video-playing');
  });
});
