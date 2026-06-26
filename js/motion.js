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

  // Lenis smoothing fights the direct-scroll-mapped sticky zoom zones (hero / history /
  // albums) and made scrolling feel glitchy, so it is off by default. Native scrolling
  // keeps those scroll-jacked sections crisp; all GSAP/ScrollTrigger effects below work
  // on native scroll. Flip to true to re-enable buttery smooth-scroll.
  const USE_LENIS = false;
  let lenis = null;

  /* ---- fail-safe: if any setup throws, reveal everything ----------- */
  function revealAllFallback() {
    root.classList.remove('js-motion');
    finishLoader();
    if (lenis) lenis.start();
    $$('[data-reveal]').forEach((el) => { el.style.clipPath = 'none'; el.style.opacity = '1'; el.style.transform = 'none'; });
    $$('.photo').forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
  }

  /* ================================================================
     LENIS smooth scrolling (synced with ScrollTrigger + GSAP ticker)
     ================================================================ */
  if (Lenis && USE_LENIS) {
    lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      smoothTouch: false,        // native scrolling on touch — avoids mobile jank
      touchMultiplier: 1.5,
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

    if (lenis) lenis.stop();                       // briefly lock scroll during the intro

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1) dark → logo appears → logo scales slightly
    tl.to(logo, { opacity: 1, duration: 0.5 })
      .fromTo(logo, { scale: 0.95 }, { scale: 1.06, duration: 0.8, ease: 'power2.inOut' }, '<')
      .to(barWrap, { opacity: 1, duration: 0.25 }, '<')
      .to(bar, { width: '100%', duration: 0.8, ease: 'power1.inOut' }, '<')
      // 2) loader lifts — UNLOCK interaction immediately so the page never feels stuck
      .to(loader, { opacity: 0, duration: 0.55, ease: 'power2.inOut' }, '+=0.05')
      .add(() => { finishLoader(); if (lenis) lenis.start(); ScrollTrigger.refresh(); })
      // 3) hero opens with blur-to-clear + background zoom, then the entrance
      .fromTo(heroInner, { filter: 'blur(12px)', scale: 1.03 }, { filter: 'blur(0px)', scale: 1, duration: 0.9 }, '<')
      .to(spot, { scale: 1, opacity: 1, duration: 1.4, ease: 'power2.out' }, '<')
      .to(eyebrow, { opacity: 1, y: 0, duration: 0.45 }, '<+0.1')
      .to(chars, { opacity: 1, yPercent: 0, duration: 0.6, stagger: 0.04 }, '<+0.05')
      .to(words, { opacity: 1, yPercent: 0, duration: 0.45, stagger: 0.06 }, '-=0.3')
      .to(ctas, { opacity: 1, y: 0, duration: 0.45, stagger: 0.1 }, '-=0.35')   // buttons appear early
      .to(cue, { opacity: 1, duration: 0.4 }, '-=0.2');

    // hard fallback in case the timeline is interrupted
    setTimeout(() => { if (loader && !loader.classList.contains('is-done')) { finishLoader(); if (lenis) lenis.start(); } }, 2500);

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
        { clipPath: 'inset(0 -60% 100% 0)' }, { clipPath: 'inset(0 -60% 0% 0)', duration: 1.0, stagger: 0.08, ease: 'power3.out' }),
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
    const rows = $$('.tourdate');
    if (rows.length) {
      // visible by default; animates in on scroll. immediateRender:false → never stuck hidden
      gsap.from(rows, {
        y: 22, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out', immediateRender: false,
        scrollTrigger: { trigger: '.tourlist', start: 'top 85%', once: true },
      });
    }
    $$('.tourdate .btn--ticket, .topnav__cta').forEach((b) => magnetic(b, 0.25));
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

    // segment the progress slider so it reads as transitions between the pages
    const prog = $('#docProgress');
    if (prog && scenes.length > 1 && !$('.doc-progress__tick', prog)) {
      for (let i = 1; i < scenes.length; i++) {
        const tk = document.createElement('span');
        tk.className = 'doc-progress__tick';
        tk.style.left = (i / (scenes.length - 1)) * 100 + '%';
        prog.appendChild(tk);
      }
    }

    function update() {
      if (window.innerWidth <= 720) return;
      const total = stage.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -stage.getBoundingClientRect().top / total)) : 0;
      if (bar) bar.style.width = (8 + p * 92) + '%';
      let ci = scenes.findIndex((s) => s.classList.contains('is-center'));
      if (ci < 0) ci = Math.round(p * (scenes.length - 1));
      if (yearEl && labels[ci]) yearEl.textContent = labels[ci];
      if (idxEl) idxEl.textContent = String(ci + 1).padStart(2, '0');
    }
    ScrollTrigger.create({ trigger: stage, start: 'top top', end: 'bottom bottom', onUpdate: update, onRefresh: update });
    update();

    // one-time cinematic mask reveal of all scene media when the section enters
    ScrollTrigger.create({
      trigger: '#history', start: 'top 80%', once: true,
      onEnter: () => scenes.forEach((s, i) => setTimeout(() => s.classList.add('media-in'), i * 120)),
    });
  }

  /* ================================================================
     GALLERY (Moments) — mask reveal + hover overlay + FLIP lightbox
     ================================================================ */
  function setupGallery() {
    const photos = $$('.photo');
    if (!photos.length) return;
    photos.forEach((ph) => {
      const card = $('.photo__card', ph);
      if (card) {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'Відкрити: ' + (ph.dataset.tag || 'фото'));
      }
    });
    initLightbox(true);
    setupCamera();
  }

  /* ---- film camera: click the viewfinder → shutter + flash → develop the pile ---- */
  function setupCamera() {
    const moments = $('#moments'), cam = $('#filmcam'), scatter = $('#scatter');
    if (!moments || !cam || !scatter) return;
    const photos = $$('.photo', scatter);
    if (!photos.length) return;
    moments.classList.add('moments--armed');           // hide photos + reveal the camera (CSS)

    // hover: subtle tilt toward the cursor (desktop pointers only)
    if (fine) {
      photos.forEach((ph) => {
        const card = $('.photo__card', ph); if (!card) return;
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
          card.style.setProperty('--ty', (dx * 12).toFixed(1) + 'deg');
          card.style.setProperty('--tx', (-dy * 12).toFixed(1) + 'deg');
        });
        card.addEventListener('mouseleave', () => { card.style.setProperty('--tx', '0deg'); card.style.setProperty('--ty', '0deg'); });
      });
    }

    // viewport-fixed shutter blades + flash (on <body> → no transform-ancestor surprises)
    const shutter = document.createElement('div'); shutter.className = 'cam-shutter'; shutter.setAttribute('aria-hidden', 'true');
    const sT = document.createElement('span'); sT.className = 'cam-shutter__t';
    const sB = document.createElement('span'); sB.className = 'cam-shutter__b';
    const flash = document.createElement('div'); flash.className = 'cam-flash'; flash.setAttribute('aria-hidden', 'true');
    shutter.append(sT, sB); document.body.append(shutter, flash);

    let fired = false;
    function reveal() {
      if (fired) return; fired = true;
      moments.classList.add('moments--revealed');       // expands the pile so rects are correct below
      try { clickSound(); } catch (e) { /* audio is optional */ }
      const lens = $('.filmcam__lens', cam) || cam;
      const lr = lens.getBoundingClientRect(); const lcx = lr.left + lr.width / 2, lcy = lr.top + lr.height / 2;

      // shutter close → flash → open
      gsap.set([shutter, sT, sB, flash], { display: 'block' });
      gsap.set(sT, { yPercent: -101 }); gsap.set(sB, { yPercent: 101 }); gsap.set(flash, { opacity: 0 });
      gsap.timeline({ onComplete() { gsap.set([shutter, sT, sB, flash], { display: 'none' }); } })
        .to(sT, { yPercent: 0, duration: 0.1, ease: 'power2.in' }, 0)
        .to(sB, { yPercent: 0, duration: 0.1, ease: 'power2.in' }, 0)
        .to(flash, { opacity: 0.85, duration: 0.05 }, 0.1)
        .to(flash, { opacity: 0, duration: 0.32 }, 0.16)
        .to(sT, { yPercent: -101, duration: 0.18, ease: 'power2.out' }, 0.18)
        .to(sB, { yPercent: 101, duration: 0.18, ease: 'power2.out' }, 0.18);

      gsap.to(cam, { scale: 0.92, y: -8, opacity: 0.85, duration: 0.6, ease: 'power2.out', delay: 0.15 });

      // each memory develops out of the lens, arcs, rotates and lands with a soft bounce
      photos.forEach((ph, i) => {
        const pr = ph.getBoundingClientRect();
        const dx = lcx - (pr.left + pr.width / 2);
        const dy = lcy - (pr.top + pr.height / 2);
        const spin = (i % 2 ? 1 : -1) * (16 + (i * 13) % 26);
        gsap.fromTo(ph,
          { x: dx, y: dy, scale: 0.22, rotation: spin, opacity: 0, transformOrigin: '50% 50%' },
          { keyframes: [
              { opacity: 1, duration: 0.12 },
              { x: dx * 0.4, y: dy * 0.4 - 44, scale: 0.6, rotation: spin * 0.4, duration: 0.32, ease: 'power1.out' },
              { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.2)' },
            ],
            delay: 0.26 + i * 0.05,
            onComplete() { ph.style.opacity = ''; ph.style.transform = ''; },   // hand back to CSS
          });
      });
    }
    const vf = $('#filmVf') || cam;
    vf.addEventListener('click', (e) => { e.stopPropagation(); reveal(); });
    cam.addEventListener('click', reveal);
  }

  function clickSound() {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const ctx = new AC();
    const n = Math.floor(ctx.sampleRate * 0.08);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate); const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.4);   // soft shutter click
    const src = ctx.createBufferSource(); src.buffer = buf;
    const g = ctx.createGain(); g.gain.value = 0.06;            // quiet & muted-friendly
    src.connect(g); g.connect(ctx.destination); src.start();
    src.onended = () => { try { ctx.close(); } catch (e) { /* noop */ } };
  }

  /* ---- clean fullscreen lightbox: FLIP from the thumb, show the full photo --- */
  function initLightbox(animated) {
    const photos = $$('.photo');
    if (!photos.length) return;
    const navPhotos = photos.filter((ph) => { const im = $('.photo__img', ph); return im && im.tagName === 'IMG'; });
    const box = document.createElement('div');
    box.className = 'lightbox'; box.setAttribute('aria-hidden', 'true');
    const pic = document.createElement('img'); pic.className = 'lightbox__pic'; pic.alt = '';
    const cap = document.createElement('p'); cap.className = 'lightbox__cap';
    const mkBtn = (cls, txt, label) => { const b = document.createElement('button'); b.className = cls; b.type = 'button'; b.textContent = txt; b.setAttribute('aria-label', label); return b; };
    const prevB = mkBtn('lightbox__nav lightbox__nav--prev', '‹', 'Попереднє фото');
    const nextB = mkBtn('lightbox__nav lightbox__nav--next', '›', 'Наступне фото');
    const close = mkBtn('lightbox__close', 'Закрити ✕', 'Закрити');
    box.append(pic, cap, prevB, nextB, close); document.body.appendChild(box);
    let from = null, idx = -1;

    const px = (o) => ({ left: o.left + 'px', top: o.top + 'px', width: o.width + 'px', height: o.height + 'px' });
    function target() {
      const ar = (pic.naturalWidth && pic.naturalHeight) ? pic.naturalWidth / pic.naturalHeight : 0.8;
      const maxW = window.innerWidth * 0.9, maxH = window.innerHeight * 0.84;
      let w = maxW, h = w / ar; if (h > maxH) { h = maxH; w = h * ar; }
      return { left: (window.innerWidth - w) / 2, top: (window.innerHeight - h) / 2, width: w, height: h };
    }
    function load(url, cb) {
      if (pic.getAttribute('src') === url && pic.complete && pic.naturalWidth) cb();
      else { pic.onload = cb; pic.setAttribute('src', url); }
    }
    function open(ph) {
      const imgEl = $('.photo__img', ph);
      if (!imgEl || imgEl.tagName !== 'IMG') return;    // video tiles → no lightbox
      from = ph; idx = navPhotos.indexOf(ph);
      cap.textContent = ph.dataset.tag || '';
      box.classList.add('open'); box.setAttribute('aria-hidden', 'false');
      pic.style.display = 'block'; pic.style.opacity = '1';
      const r = imgEl.getBoundingClientRect();
      Object.assign(pic.style, px(r));                  // start exactly over the thumbnail
      load(imgEl.getAttribute('src'), () => {
        const t = target();
        if (animated && window.gsap) gsap.fromTo(pic, { left: r.left, top: r.top, width: r.width, height: r.height }, Object.assign({ duration: 0.55, ease: 'power3.inOut' }, t));
        else Object.assign(pic.style, px(t));
      });
      close.focus();
    }
    function go(dir) {
      if (idx < 0 || navPhotos.length < 2) return;
      idx = (idx + dir + navPhotos.length) % navPhotos.length;
      const ph = navPhotos[idx]; from = ph;
      const url = $('.photo__img', ph).getAttribute('src');
      const place = () => { Object.assign(pic.style, px(target())); cap.textContent = ph.dataset.tag || ''; if (window.gsap) gsap.fromTo(pic, { opacity: 0.15 }, { opacity: 1, duration: 0.3 }); else pic.style.opacity = '1'; };
      if (window.gsap) gsap.to(pic, { opacity: 0.15, duration: 0.15, onComplete: () => load(url, place) });
      else load(url, place);
    }
    function shut() {
      if (!from) { box.classList.remove('open'); return; }
      const r = ($('.photo__img', from) || from).getBoundingClientRect();
      const done = () => { box.classList.remove('open'); box.setAttribute('aria-hidden', 'true'); pic.style.display = 'none'; pic.style.opacity = ''; from = null; };
      if (animated && window.gsap) gsap.to(pic, { left: r.left, top: r.top, width: r.width, height: r.height, opacity: 1, duration: 0.45, ease: 'power3.inOut', onComplete: done });
      else done();
    }

    photos.forEach((ph) => {
      const hit = $('.photo__card', ph) || ph;
      hit.addEventListener('click', () => open(ph));
      hit.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(ph); } });
    });
    prevB.addEventListener('click', (e) => { e.stopPropagation(); go(-1); });
    nextB.addEventListener('click', (e) => { e.stopPropagation(); go(1); });
    close.addEventListener('click', shut);
    box.addEventListener('click', (e) => { if (e.target === box) shut(); });
    addEventListener('keydown', (e) => {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') shut();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    });
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
