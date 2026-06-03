(function () {
  const audio     = document.getElementById('place-audio');
  const playBtn   = document.getElementById('play-btn');
  const volSlider = document.getElementById('volume-slider');
  const label     = playBtn && playBtn.querySelector('.player-play__label');
  const icon      = playBtn && playBtn.querySelector('.player-play__icon');
  const canvas    = playBtn && playBtn.querySelector('.player-play__viz');
  const playsEl   = document.getElementById('place-plays');

  // ── play count ────────────────────────────────────────────
  const placeId   = window.location.pathname.split('/').filter(Boolean)[1];
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

  // ── visualizer ────────────────────────────────────────────
  let analyser, dataArray, rafId, audioCtx;
  let sourceConnected = false;
  let useFallback = false;

  function setupAudioContext() {
    if (sourceConnected) return;
    sourceConnected = true;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    } catch (e) {
      // Cross-origin audio without CORS headers — animate with sine fallback
      useFallback = true;
    }
  }

  function drawBars(getHeight) {
    if (!canvas) return;
    const ctx  = canvas.getContext('2d');
    const W    = canvas.width;
    const H    = canvas.height;
    const N    = 20;
    const gap  = 2;
    const barW = Math.floor((W - (N - 1) * gap) / N);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#000000';
    for (let i = 0; i < N; i++) {
      const barH = Math.max(2, Math.round(getHeight(i) * H));
      ctx.fillRect(i * (barW + gap), H - barH, barW, barH);
    }
  }

  function drawReal() {
    rafId = requestAnimationFrame(drawReal);
    analyser.getByteFrequencyData(dataArray);
    const step = Math.floor(dataArray.length / 20);
    drawBars(function (i) { return dataArray[i * step] / 255; });
  }

  function drawFallback() {
    rafId = requestAnimationFrame(drawFallback);
    const t = Date.now() / 1000;
    drawBars(function (i) {
      return 0.25 + 0.55 * Math.abs(Math.sin(t * (0.8 + i * 0.18) + i * 1.3));
    });
  }

  function startViz() {
    if (!canvas) return;
    if (label) label.style.display = 'none';
    if (icon)  icon.style.display  = 'none';
    canvas.style.display = 'block';
    useFallback ? drawFallback() : drawReal();
  }

  function stopViz() {
    if (!canvas) return;
    cancelAnimationFrame(rafId);
    canvas.style.display = 'none';
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    if (label) label.style.display = '';
    if (icon)  icon.style.display  = '';
  }

  // ── audio player ──────────────────────────────────────────
  if (audio && playBtn) {
    if (volSlider) {
      audio.volume = parseFloat(volSlider.value);
      volSlider.addEventListener('input', function () {
        audio.volume = parseFloat(volSlider.value);
      });
    }

    playBtn.addEventListener('click', function () {
      if (audio.paused) {
        setupAudioContext();
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        audio.play();
        playBtn.classList.add('is-playing');
        playBtn.setAttribute('aria-label', 'Pause');
        startViz();

        if (!counted && placeId) {
          counted = true;
          if (typeof window.sa_event === 'function') window.sa_event('play_' + placeId);
          if (workerUrl) {
            fetch(workerUrl + '/plays/' + placeId, { method: 'POST' })
              .then(function (r) { return r.json(); })
              .then(function (d) { showCount(d.plays); })
              .catch(function () {});
          }
        }
      } else {
        audio.pause();
        playBtn.classList.remove('is-playing');
        playBtn.setAttribute('aria-label', 'Play');
        stopViz();
      }
    });
  }
}());
