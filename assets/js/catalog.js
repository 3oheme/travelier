(function () {
  var workerUrl = window.WORKER_URL;
  if (!workerUrl) return;

  fetch(workerUrl + '/plays')
    .then(function (r) { return r.json(); })
    .then(function (counts) {
      document.querySelectorAll('.card[data-id]').forEach(function (card) {
        var id = card.dataset.id;
        if (counts[id] !== undefined && counts[id] > 0) {
          var el = card.querySelector('.card__plays');
          if (el) el.textContent = '▶ ' + counts[id].toLocaleString();
        }
      });
    })
    .catch(function () {});
}());
