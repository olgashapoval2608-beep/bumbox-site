/* =================================================================
   БУМБОКС — MOTION LAYER
   Lenis smooth scroll + GSAP/ScrollTrigger premium motion design.
   Progressive enhancement: degrades gracefully if libs are missing
   or prefers-reduced-motion is set. Coexists with js/script.js
   (which still drives the cassette zoom, history translateX, etc.).
   ================================================================= */
(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const loader = $('#loader');

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches && window.innerWidth > 1024;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const Lenis = window.Lenis;
  const hasGSAP = !!gsap && !!ScrollTrigger;

  function finishLoader() { if (loader) loader.classList.add('is-done'); }

  /* ---- minimal mode: reduced motion or missing libs ---------------- */
  if (reduceMotion || !hasGSAP) {
    finishLoader();
    try { initLightbox(false); } catch (e) { /* lightbox is content, never fatal */ }
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  root.classList.add('js-motion');

  let lenis = null;

  /* ---- fail-safe: if any setup throws, reveal everything ----------- */
  function revealAllFallback() {
    root.classList.remove('js-motion');
    finishLoader();
    if (lenis) lenis.start();
    $$('[data-reveal]').forEach((el) => { el.style.clipPath = 'none'; el.style.opacity = '1'; el.style.transform = 'none'; });
    $$('.photo').forEach((el) => { el.style.clipPath = 'none'; });
  }

  /* ================================================================
     LENIS smooth scrolling (synced with ScrollTrigger + GSAP ticker)
     ================================================================ */
  if (Lenis) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---- helpers ----------------------------------------------------- */
  function splitChars(el) {
    const text = el.textContent;
    el.textContent = '';
    const frag = document.createDocumentFragment();
    [...text].forEach((ch) => {
      const s = document.createElement('span');
      s.className = 'hero__char';
      s.textContent = ch === ' ' ? ' ' : ch;
      frag.appendChild(s);
    });
    el.appendChild(frag);
    return $$('.hero__char', el);
  }

  function splitWords(el) {
    const out = [];
    const nodes = [...el.childNodes];
    el.textContent = '';
    nodes.forEach((node) => {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach((p) => {
          if (p === '') return;
          if (/^\s+$/.test(p)) { el.appendChild(document.createTextNode(p)); return; }
          const w = document.createElement('span'); w.className = 'hero__word'; w.textContent = p;
          el.appendChild(w); out.push(w);
        });
      } else {
        const w = document.createElement('span'); w.className = 'hero__word';
        w.appendChild(node); el.appendChild(w); out.push(w);
      }
    });
    return out;
  }

  function magnetic(el, strength) {
    if (!fine || !el) return;
    strength = strength || 0.3;
    const qx = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
    const qy = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });
    el.addEventListener('mousemove', (e) => {
      const b = el.getBoundingClientRect();
      qx((e.clientX - (b.left + b.width / 2)) * strength);
      qy((e.clientY - (b.top + b.height / 2)) * strength);
    });
    el.addEventListener('mouseleave', () => { qx(0); qy(0); });
  }

  /* ================================================================
     LOADER + HERO ENTRANCE
     ================================================================ */
  function setupLoaderAndHero() {
    const heroInner = $('.hero__inner');
    const titleEl = $('.hero__title');
    const leadEl = $('.hero__lead');
    const eyebrow = $('.hero__eyebrow');
    const ctas = $$('.hero__cta .btn');
    const spot = $('.hero__spot');
    const cue = $('.scroll-cue');
    const logo = $('.loader__logo');
    const barWrap = $('.loader__bar');
    const bar = $('.loader__bar i');

    const chars = titleEl ? splitChars(titleEl) : [];
    const words = leadEl ? splitWords(leadEl) : [];

    // hidden entrance states (rest CSS keeps these visible if JS never runs)
    if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 14 });
    if (chars.length) gsap.set(chars, { opacity: 0, yPercent: 115 });
    if (words.length) gsap.set(words, { opacity: 0, yPercent: 60 });
    if (ctas.length) gsap.set(ctas, { opacity: 0, y: 26 });
    if (cue) gsap.set(cue, { opacity: 0 });
    if (spot) gsap.set(spot, { scale: 1.18, opacity: 0.55 });

    if (lenis) lenis.stop();                       // lock scroll during the intro

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete() { finishLoader(); if (lenis) lenis.start(); ScrollTrigger.refresh(); },
    });

    // 1) dark → logo appears → logo scales slightly
    tl.to(logo, { opacity: 1, duration: 0.6 })
      .fromTo(logo, { scale: 0.95 }, { scale: 1.07, duration: 1.05, ease: 'power2.inOut' }, '<')
      .to(barWrap, { opacity: 1, duration: 0.3 }, '<')
      .to(bar, { width: '100%', duration: 1.0, ease: 'power1.inOut' }, '<')
      // 2) loader lifts; hero opens with blur-to-clear + background zoom
      .to(loader, { opacity: 0, duration: 0.7, ease: 'power2.inOut' }, '+=0.12')
      .fromTo(heroInner, { filter: 'blur(14px)', scale: 1.04 }, { filter: 'blur(0px)', scale: 1, duration: 1.15 }, '<')
      .to(spot, { scale: 1, opacity: 1, duration: 1.8, ease: 'power2.out' }, '<')
      // 3) hero entrance: eyebrow, title letters, subtitle words, buttons
      .to(eyebrow, { opacity: 1, y: 0, duration: 0.5 }, '-=0.8')
      .to(chars, { opacity: 1, yPercent: 0, duration: 0.7, stagger: 0.045 }, '-=0.55')
      .to(words, { opacity: 1, yPercent: 0, duration: 0.5, stagger: 0.07 }, '-=0.35')
      .to(ctas, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 }, '-=0.5')   // buttons appear early
      .to(cue, { opacity: 1, duration: 0.5 }, '-=0.2');

    // hard fallback in case the timeline is interrupted
    setTimeout(() => { if (loader && !loader.classList.contains('is-done')) { finishLoader(); if (lenis) lenis.start(); } }, 4500);

    // hero mouse parallax (spot + copy) — never touches the boombox (script.js owns it)
    if (fine) {
      const layers = [{ el: spot, d: 26 }, { el: titleEl, d: 11 }, { el: leadEl, d: 7 }, { el: $('.hero__cta'), d: 5 }].filter((o) => o.el);
      const qx = layers.map((o) => gsap.quickTo(o.el, 'x', { duration: 0.7, ease: 'power3' }));
      const qy = layers.map((o) => gsap.quickTo(o.el, 'y', { duration: 0.7, ease: 'power3' }));
      const hero = $('#hero');
      hero.addEventListener('mousemove', (e) => {
        const cx = e.clientX / window.innerWidth - 0.5;
        const cy = e.clientY / window.innerHeight - 0.5;
        layers.forEach((o, i) => { qx[i](-cx * o.d); qy[i](-cy * o.d); });
      });
      hero.addEventListener('mouseleave', () => layers.forEach((o, i) => { qx[i](0); qy[i](0); }));
    }
  }

  /* ================================================================
     CURSOR-FOLLOW LIGHT (desktop only)
     ================================================================ */
  function setupCursorLight() {
    if (!fine) return;
    const light = $('#cursorLight');
    if (!light) return;
    const qx = gsap.quickTo(light, 'x', { duration: 0.5, ease: 'power3' });
    const qy = gsap.quickTo(light, 'y', { duration: 0.5, ease: 'power3' });
    addEventListener('mousemove', (e) => { qx(e.clientX); qy(e.clientY); light.classList.add('is-on'); }, { passive: true });
    addEventListener('mouseleave', () => light.classList.remove('is-on'));
  }

  /* ================================================================
     NAV — glass on scroll + sliding indicator + mobile stagger
     ================================================================ */
  function setupNav() {
    const topnav = $('#topnav');
    const list = $('#navList');
    const indicator = $('#navIndicator');
    if (!topnav || !list) return;

    const setGlass = () => topnav.classList.toggle('scrolled', window.scrollY > 40);
    addEventListener('scroll', setGlass, { passive: true });
    setGlass();

    function moveIndicator() {
      const active = list.querySelector('.topnav__item.is-active');
      if (!indicator || !active || window.innerWidth <= 820) { if (indicator) gsap.to(indicator, { opacity: 0, duration: 0.2 }); return; }
      const lr = list.getBoundingClientRect(), ar = active.getBoundingClientRect();
      gsap.to(indicator, { left: ar.left - lr.left, width: ar.width, opacity: 1, duration: 0.45, ease: 'power3.out' });
    }
    const mo = new MutationObserver(moveIndicator);
    $$('.topnav__item', list).forEach((it) => mo.observe(it, { attributes: true, attributeFilter: ['class'] }));
    addEventListener('resize', moveIndicator);
    setTimeout(moveIndicator, 400);

    // staggered link reveal when the mobile menu opens
    const burger = $('#navBurger');
    if (burger) {
      burger.addEventListener('click', () => {
        if (topnav.classList.contains('open')) {
          gsap.fromTo($$('#navList .topnav__item'),
            { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out', delay: 0.08, overwrite: true });
        }
      });
    }
  }

  /* ================================================================
     ALBUMS — clip-path reveal + 3D tilt + magnetic buttons
     ================================================================ */
  function setupAlbums() {
    const albums = $$('.album');
    if (!albums.length) return;
    albums.forEach((a) => a.setAttribute('data-reveal', 'album'));
    ScrollTrigger.create({
      trigger: '#albums', start: 'top 72%', once: true,
      onEnter: () => gsap.fromTo('[data-reveal="album"]',
        { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.0, stagger: 0.08, ease: 'power3.out' }),
    });
    if (fine) {
      albums.forEach((a) => {
        const cover = $('.album__cover', a);
        if (!cover) return;
        a.addEventListener('mousemove', (e) => {
          const r = a.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          a.classList.add('tilt');
          gsap.to(cover, { rotateY: px * 12, rotateX: -py * 12, scale: 1.05, transformPerspective: 800, duration: 0.4, ease: 'power2.out' });
        });
        a.addEventListener('mouseleave', () => { a.classList.remove('tilt'); gsap.to(cover, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.5, ease: 'power3.out' }); });
      });
    }
    $$('.album__open').forEach((b) => magnetic(b, 0.35));
  }

  /* ================================================================
     CONCERTS / TOURS — bg parallax + staggered posters + magnetic
     ================================================================ */
  function setupConcerts() {
    const tours = $('#tours');
    if (tours) {
      const par = document.createElement('div');
      par.className = 'tours__parallax'; par.setAttribute('aria-hidden', 'true');
      tours.insertBefore(par, tours.firstChild);
      gsap.fromTo(par, { yPercent: -8 }, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: tours, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
    const posters = $$('.poster');
    posters.forEach((p) => p.setAttribute('data-reveal', 'poster'));
    if (posters.length) {
      ScrollTrigger.create({
        trigger: '.posters', start: 'top 82%', once: true,
        onEnter: () => gsap.fromTo('[data-reveal="poster"]',
          { clipPath: 'inset(0 0 100% 0)', y: 28 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 0.9, stagger: 0.14, ease: 'power3.out' }),
      });
    }
    $$('.poster .btn--solid, .topnav__cta').forEach((b) => magnetic(b, 0.3));
  }

  /* ================================================================
     HISTORY — documentary HUD (active year + progress) + parallax
     (the horizontal translateX itself stays in script.js)
     ================================================================ */
  function setupHistory() {
    const stage = $('#docStage'), track = $('#docTrack');
    if (!stage || !track) return;
    const scenes = $$('.doc-scene', track);
    const bar = $('#docProgressBar'), yearEl = $('#docYear'), idxEl = $('#docIndex');
    const labels = scenes.map((s) => { const c = s.querySelector('.scene__chip'); return c ? c.textContent.replace('▶', '').trim() : ''; });

    function update() {
      if (window.innerWidth <= 720) return;
      const total = stage.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -stage.getBoundingClientRect().top / total)) : 0;
      if (bar) bar.style.width = (8 + p * 92) + '%';
      let ci = scenes.findIndex((s) => s.classList.contains('is-center'));
      if (ci < 0) ci = Math.round(p * (scenes.length - 1));
      if (yearEl && labels[ci]) yearEl.textContent = labels[ci];
      if (idxEl) idxEl.textContent = String(ci + 1).padStart(2, '0');
      const mid = window.innerWidth / 2;
      scenes.forEach((s) => {
        if (s.classList.contains('is-center')) s.classList.add('seen');
        const body = s.querySelector('.scene__body');
        if (body) { const r = s.getBoundingClientRect(); body.style.setProperty('--par', ((r.left + r.width / 2 - mid) * 0.05).toFixed(1) + 'px'); }
      });
    }
    ScrollTrigger.create({ trigger: stage, start: 'top top', end: 'bottom bottom', onUpdate: update, onRefresh: update });
    update();
  }

  /* ================================================================
     GALLERY (Moments) — mask reveal + hover overlay + FLIP lightbox
     ================================================================ */
  function setupGallery() {
    const photos = $$('.photo');
    if (!photos.length) return;
    photos.forEach((ph) => {
      if (!$('.photo__overlay', ph)) {
        const ov = document.createElement('span'); ov.className = 'photo__overlay'; ov.setAttribute('aria-hidden', 'true');
        ph.appendChild(ov);
      }
      ph.setAttribute('tabindex', '0');
      ph.setAttribute('role', 'button');
    });
    ScrollTrigger.batch('.photo', {
      start: 'top 90%',
      onEnter: (batch) => gsap.to(batch, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, stagger: 0.08, ease: 'power3.out', overwrite: 'auto', onStart() { batch.forEach((b) => b.classList.add('revealed')); } }),
    });
    initLightbox(true);
  }

  /* ---- FLIP lightbox: expand from origin, return to place --------- */
  function initLightbox(animated) {
    const photos = $$('.photo');
    if (!photos.length) return;
    const box = document.createElement('div');
    box.className = 'lightbox'; box.setAttribute('aria-hidden', 'true');
    const img = document.createElement('div'); img.className = 'lightbox__img';
    const close = document.createElement('button'); close.className = 'lightbox__close'; close.type = 'button';
    close.textContent = 'Закрити ✕'; close.setAttribute('aria-label', 'Закрити');
    box.appendChild(img); box.appendChild(close); document.body.appendChild(box);
    let from = null;

    function target() {
      const maxW = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.84 * 0.8);
      const w = maxW, h = w * 1.25;                  // keep the 4:5 polaroid ratio
      return { left: (window.innerWidth - w) / 2, top: (window.innerHeight - h) / 2, width: w, height: h };
    }
    function open(ph) {
      const bg = ph.style.backgroundImage; if (!bg) return;
      from = ph;
      const r = ph.getBoundingClientRect();
      img.style.display = 'block';
      img.style.backgroundImage = bg;
      box.classList.add('open'); box.setAttribute('aria-hidden', 'false');
      if (window.__lenis) window.__lenis.stop();
      if (animated && window.gsap) {
        gsap.fromTo(img, { left: r.left, top: r.top, width: r.width, height: r.height },
          { left: target().left, top: target().top, width: target().width, height: target().height, duration: 0.6, ease: 'power3.inOut' });
      } else { Object.assign(img.style, withPx(target())); }
    }
    function shut() {
      if (!from) { box.classList.remove('open'); return; }
      const r = from.getBoundingClientRect();
      const done = () => { box.classList.remove('open'); box.setAttribute('aria-hidden', 'true'); img.style.display = 'none'; if (window.__lenis) window.__lenis.start(); from = null; };
      if (animated && window.gsap) gsap.to(img, { left: r.left, top: r.top, width: r.width, height: r.height, duration: 0.5, ease: 'power3.inOut', onComplete: done });
      else done();
    }
    function withPx(o) { return { left: o.left + 'px', top: o.top + 'px', width: o.width + 'px', height: o.height + 'px' }; }

    photos.forEach((ph) => {
      ph.addEventListener('click', () => open(ph));
      ph.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(ph); } });
    });
    close.addEventListener('click', shut);
    box.addEventListener('click', (e) => { if (e.target === box) shut(); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && box.classList.contains('open')) shut(); });
  }

  /* ================================================================
     FOOTER — cinematic fade + parallax beam + social hover
     ================================================================ */
  function setupFooter() {
    const footer = $('#footer');
    if (!footer) return;
    footer.setAttribute('data-reveal', 'footer');
    gsap.fromTo(footer, { opacity: 0, y: 46, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: footer, start: 'top 82%', once: true } });
    const beam = $('.footer__beam', footer);
    if (beam) gsap.fromTo(beam, { yPercent: -20 }, { yPercent: 30, ease: 'none', scrollTrigger: { trigger: footer, start: 'top bottom', end: 'bottom top', scrub: true } });
    $$('.footer__social .ctrl--social').forEach((b) => magnetic(b, 0.25));
  }

  /* ================================================================
     RUN
     ================================================================ */
  try {
    setupCursorLight();
    setupLoaderAndHero();
    setupNav();
    setupAlbums();
    setupConcerts();
    setupHistory();
    setupGallery();
    setupFooter();
    requestAnimationFrame(() => ScrollTrigger.refresh());
    addEventListener('load', () => ScrollTrigger.refresh());
  } catch (err) {
    console.error('[motion] init failed, revealing content:', err);
    revealAllFallback();
  }
})();
