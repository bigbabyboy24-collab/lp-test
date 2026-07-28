/* =========================================================
   NIHONBASHI BREWERY. 池袋店 — LP interactions
   ========================================================= */
(function () {
  'use strict';

  var header    = document.getElementById('siteHeader');
  var nav       = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var stickyCta = document.querySelector('.sticky-cta');
  var hero      = document.querySelector('.hero');

  /* ---------- モバイルメニューの開閉 ---------- */
  function closeNav() {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'メニューを開く');
  }

  navToggle.addEventListener('click', function () {
    var willOpen = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', willOpen);
    navToggle.setAttribute('aria-expanded', String(willOpen));
    navToggle.setAttribute('aria-label', willOpen ? 'メニューを閉じる' : 'メニューを開く');
  });

  // メニュー内リンクを押したら閉じる
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });

  // Esc で閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeNav();
      navToggle.focus();
    }
  });

  // PC幅に戻ったら状態をリセット
  var mq = window.matchMedia('(min-width: 761px)');
  function onBreakpointChange() {
    if (mq.matches) closeNav();
  }
  if (mq.addEventListener) {
    mq.addEventListener('change', onBreakpointChange);
  } else {
    mq.addListener(onBreakpointChange); // Safari 13 以前
  }

  /* ---------- スクロールに応じたヘッダー／固定CTA ---------- */
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;

    header.classList.toggle('is-scrolled', y > 12);

    if (stickyCta && hero) {
      // ヒーローを通り過ぎたら固定CTAを出す
      stickyCta.classList.toggle('is-visible', y > hero.offsetHeight * 0.7);
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  onScroll();

  /* ---------- スクロール表示アニメーション ---------- */
  var targets = document.querySelectorAll(
    '.section-head, .concept-copy, .concept-points li, .beer-band, .beer-card, ' +
    '.food-card, .lunch-panel, .scene-list li, .gallery-item, .party-inner > *, ' +
    '.info-table, .info-side'
  );

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduceMotion) {
    return; // 何もしない＝最初から表示された状態
  }

  Array.prototype.forEach.call(targets, function (el, i) {
    el.classList.add('reveal');
    // 同じ行のカードを少しずつ遅らせる
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

  Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
})();
