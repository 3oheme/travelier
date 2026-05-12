(function () {
  const btn = document.querySelector('.site-header__ham');
  const nav = document.getElementById('site-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', function () {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    btn.classList.toggle('is-open');
    nav.classList.toggle('is-open');
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('is-open');
      nav.classList.remove('is-open');
    });
  });
}());
