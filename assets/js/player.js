(function () {
  // ── audio player ──────────────────────────────────────────
  const audio = document.getElementById('place-audio');
  const playBtn = document.getElementById('play-btn');
  const volSlider = document.getElementById('volume-slider');
  const label = playBtn && playBtn.querySelector('.player-play__label');
  const icon = playBtn && playBtn.querySelector('.player-play__icon');

  if (audio && playBtn) {
    const PLAY_ICON = '<polygon points="0,0 16,9 0,18" fill="currentColor"/>';
    const PAUSE_ICON = '<rect x="0" y="0" width="5" height="18" fill="currentColor"/><rect x="11" y="0" width="5" height="18" fill="currentColor"/>';

    if (volSlider) {
      audio.volume = parseFloat(volSlider.value);
      volSlider.addEventListener('input', () => {
        audio.volume = parseFloat(volSlider.value);
      });
    }

    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        playBtn.classList.add('is-playing');
        playBtn.setAttribute('aria-label', 'Pause');
        if (label) label.textContent = 'PAUSE';
        if (icon) icon.innerHTML = PAUSE_ICON;
      } else {
        audio.pause();
        playBtn.classList.remove('is-playing');
        playBtn.setAttribute('aria-label', 'Play');
        if (label) label.textContent = 'PLAY';
        if (icon) icon.innerHTML = PLAY_ICON;
      }
    });
  }

  // ── map consent-gate ──────────────────────────────────────
  const mapFrame = document.querySelector('.map-frame');
  if (mapFrame) {
    const btn = mapFrame.querySelector('.map-consent__btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const lat = mapFrame.dataset.lat;
        const lng = mapFrame.dataset.lng;
        const iframe = document.createElement('iframe');
        iframe.src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
        iframe.title = mapFrame.closest('.place-map').querySelector('.sec-head__t').textContent + ' map';
        iframe.setAttribute('allowfullscreen', '');
        mapFrame.innerHTML = '';
        mapFrame.appendChild(iframe);
      });
    }
  }
}());
