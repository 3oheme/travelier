(function () {
  const audio   = document.getElementById('place-audio');
  const playBtn = document.getElementById('play-btn');
  const volSlider = document.getElementById('volume-slider');
  const label   = playBtn && playBtn.querySelector('.player-play__label');
  const icon    = playBtn && playBtn.querySelector('.player-play__icon');
  const playsEl = document.getElementById('place-plays');

  // ── play count ────────────────────────────────────────────
  const placeId = window.location.pathname.split('/').filter(Boolean)[1];
  const workerUrl = window.WORKER_URL;
  let counted = false;

  function showCount(n) {
    if (playsEl) playsEl.textContent = n.toLocaleString() + ' plays';
  }

  if (placeId && workerUrl) {
    fetch(workerUrl + '/plays/' + placeId)
      .then(function (r) { return r.json(); })
      .then(function (d) { showCount(d.plays); })
      .catch(function () {});
  }

  // ── audio player ──────────────────────────────────────────
  if (audio && playBtn) {
    const PLAY_ICON  = '<polygon points="0,0 16,9 0,18" fill="currentColor"/>';
    const PAUSE_ICON = '<rect x="0" y="0" width="5" height="18" fill="currentColor"/><rect x="11" y="0" width="5" height="18" fill="currentColor"/>';

    if (volSlider) {
      audio.volume = parseFloat(volSlider.value);
      volSlider.addEventListener('input', function () {
        audio.volume = parseFloat(volSlider.value);
      });
    }

    playBtn.addEventListener('click', function () {
      if (audio.paused) {
        audio.play();
        playBtn.classList.add('is-playing');
        playBtn.setAttribute('aria-label', 'Pause');
        if (label) label.textContent = 'PAUSE';
        if (icon) icon.innerHTML = PAUSE_ICON;

        // increment once per page load
        if (!counted && placeId && workerUrl) {
          counted = true;
          fetch(workerUrl + '/plays/' + placeId, { method: 'POST' })
            .then(function (r) { return r.json(); })
            .then(function (d) { showCount(d.plays); })
            .catch(function () {});
        }
      } else {
        audio.pause();
        playBtn.classList.remove('is-playing');
        playBtn.setAttribute('aria-label', 'Play');
        if (label) label.textContent = 'PLAY';
        if (icon) icon.innerHTML = PLAY_ICON;
      }
    });
  }
}());
