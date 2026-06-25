/* =================================================================
   БУМБОКС — interactions
   ================================================================= */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(pointer: coarse)').matches;

  /* ---------- page in ---------- */
  window.addEventListener('load', () => document.body.classList.remove('is-loading'));

  /* =================================================================
     CUSTOM CURSOR + sound wave
     ================================================================= */
  if (!isTouch) {
    const cursor = $('.cursor');
    const dot = $('.cursor__dot');
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;

    addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    addEventListener('mousedown', () => cursor.classList.add('is-click'));
    addEventListener('mouseup', () => cursor.classList.remove('is-click'));

    (function loop() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();

    // hover state on interactive elements
    $$('a,button,[data-cursor],.album__open,.item,.city').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hover');
        dot.textContent = el.getAttribute('data-cursor') || '▶';
      });
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  /* =================================================================
     THE PLAY BUTTON — display sequence + speaker→spotlight warp
     ================================================================= */
  const boombox = $('#boombox');
  const playBtn = $('#playBtn');
  const displayEl = $('#display');
  const display = $('#displayText');
  const displaySub = $('#displaySub');
  const playHint = $('#playHint');
  const warp = $('.warp');

  // mobile: the spec wants a tap-friendly label
  if ((isTouch || innerWidth <= 720) && playHint) playHint.textContent = 'Торкнись PLAY';

  if (playBtn) {
    playBtn.addEventListener('mouseenter', () => {
      if (boombox.classList.contains('playing')) return;
      boombox.classList.add('vibe', 'hovering');   // speakers vibrate + faint sound wave
      if (displayEl) displayEl.classList.add('blink');
      display.textContent = 'PLAY';                // display blinks PLAY
    });
    playBtn.addEventListener('mouseleave', () => {
      if (boombox.classList.contains('playing')) return;
      boombox.classList.remove('vibe', 'hovering');
      if (displayEl) displayEl.classList.remove('blink');
      display.textContent = 'БУМБОКС';
    });
    playBtn.addEventListener('click', startStory);
  }

  function flashWave() {
    boombox.classList.remove('wave');
    void boombox.offsetWidth;        // restart animation
    boombox.classList.add('wave');
  }

  function startStory() {
    if (boombox.classList.contains('playing')) { goTo('#history'); return; }
    boombox.classList.remove('hovering');
    if (displayEl) displayEl.classList.remove('blink');
    boombox.classList.add('playing', 'vibe');
    flashWave();

    const seq = [
      ['PLAY', 'press'],
      ['TRACK 01', 'history'],
      ['ІСТОРІЯ', '2004 → ∞'],
      ['2004 →', 'сьогодні'],
    ];
    let i = 0;
    display.textContent = 'PLAY';
    displaySub.textContent = 'rec';
    const tick = setInterval(() => {
      if (i >= seq.length) {
        clearInterval(tick);
        warpToHistory();
        return;
      }
      display.textContent = seq[i][0];
      displaySub.textContent = seq[i][1];
      flashWave();
      i++;
    }, reduceMotion ? 120 : 520);
  }

  function warpToHistory() {
    if (reduceMotion) { goTo('#history'); return; }
    // position warp circle over the right speaker
    const sp = $('#warpSpeaker').getBoundingClientRect();
    warp.style.left = (sp.left + sp.width / 2) + 'px';
    warp.style.top = (sp.top + sp.height / 2) + 'px';
    warp.classList.remove('go'); void warp.offsetWidth; warp.classList.add('go');
    // jump instantly while the warp covers the screen (hero is now a tall sticky zone)
    setTimeout(() => { const h = $('#history'); if (!h) return; if (window.__lenis) window.__lenis.scrollTo(h, { immediate: true }); else h.scrollIntoView({ behavior: 'auto' }); }, 600);
    setTimeout(() => warp.classList.remove('go'), 1300);
  }

  function goTo(sel) {
    const t = $(sel);
    if (!t) return;
    if (window.__lenis && !reduceMotion) { window.__lenis.scrollTo(t, { offset: -4 }); return; }
    t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  /* =================================================================
     SIDE TRACKNAV — active section + smooth anchor scroll
     ================================================================= */
  const navItems = $$('.topnav__item');
  const sections = navItems.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const topnav = $('#topnav');
  const burger = $('#navBurger');

  const navList = $('#navList');
  function setMenu(open) {
    if (!topnav || !burger) return;
    topnav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
    if (open && navList) { const first = navList.querySelector('a'); if (first) first.focus(); }
  }
  function closeMenu() {
    if (!topnav || !topnav.classList.contains('open')) return;
    const focusInside = navList && navList.contains(document.activeElement);
    setMenu(false);
    if (focusInside && burger) burger.focus();   // return focus to the trigger
  }
  if (burger) burger.addEventListener('click', () => setMenu(!topnav.classList.contains('open')));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1 && $(id)) { e.preventDefault(); goTo(id); closeMenu(); }
    })
  );

  if ('IntersectionObserver' in window) {
    const navObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const id = '#' + en.target.id;
          navItems.forEach((n) => n.classList.toggle('is-active', n.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach((s) => navObs.observe(s));
  }

  /* =================================================================
     REVEAL ON SCROLL
     ================================================================= */
  if ('IntersectionObserver' in window) {
    const revObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.18 });
    $$('.reveal').forEach((el) => revObs.observe(el));
  } else {
    $$('.reveal').forEach((el) => el.classList.add('in'));
  }

  /* =================================================================
     HISTORY — band-photo parallax + mini-player scroll progress
     ================================================================= */
  const bandphoto = $('#bandphoto');
  if (bandphoto && !isTouch) {
    bandphoto.addEventListener('mousemove', (e) => {
      const r = bandphoto.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      $$('.bandphoto__layer', bandphoto).forEach((l) => {
        const d = +l.dataset.depth || 0;
        l.style.transform = `translate(${-px * d}px,${-py * d}px) scale(1.06)`;
      });
    });
    bandphoto.addEventListener('mouseleave', () =>
      $$('.bandphoto__layer', bandphoto).forEach((l) => (l.style.transform = '')));
  }

  const historySection = $('#history');
  const hProgress = $('#historyProgress');
  const hTime = $('#historyTime');

  /* ===== History — horizontal timeline driven by vertical scroll (sticky pin) ===== */
  const docStage = $('#docStage');
  const docTrack = $('#docTrack');
  const docProgress = $('#docProgress');
  function updateHistoryTrack() {
    if (!docStage || !docTrack) return;
    if (innerWidth <= 720 || reduceMotion) { docTrack.style.transform = ''; if (docProgress) docProgress.style.width = ''; return; }
    const scenes = $$('.doc-scene', docTrack);
    if (!scenes.length) return;
    const total = docStage.offsetHeight - innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -docStage.getBoundingClientRect().top / total)) : 0;
    const n = scenes.length;
    const center = (el) => el.offsetLeft + el.offsetWidth / 2;
    // SNAP easing: hold each mini-page centered, then quickly advance to the next one
    // ("із кожним скролом роби по центру одразу міні сторінку")
    const fp = p * (n - 1);
    const i = Math.min(n - 2, Math.floor(fp));
    const local = fp - i;
    const HOLD = 0.45;                                     // dwell on the centered card for ~45% of each step
    let e = local <= HOLD ? 0 : (local - HOLD) / (1 - HOLD);
    e = e * e * e * (e * (e * 6 - 15) + 10);              // smootherstep → distinct hold + snap to next
    const target = center(scenes[i]) + (center(scenes[i + 1]) - center(scenes[i])) * e;
    docTrack.style.transform = `translateX(${-(target - innerWidth / 2)}px)`;
    if (docProgress) docProgress.style.width = Math.max(10, p * 100) + '%';
    // center highlight → triggers reveal of leaving/new-member animations
    const mid = innerWidth / 2;
    let best = null, bd = Infinity;
    scenes.forEach((s) => { const r = s.getBoundingClientRect(); const d = Math.abs(r.left + r.width / 2 - mid); if (d < bd) { bd = d; best = s; } });
    scenes.forEach((s) => s.classList.toggle('is-center', s === best));
  }

  /* =================================================================
     ALBUMS — sticky vertical→horizontal carousel
     ================================================================= */
  const scroller = $('#albumScroller');
  const track = $('#albumTrack');
  const albums = $$('.album');
  const albumsSection = $('#albums');

  function updateAlbums() {
    if (!scroller || !track || innerWidth <= 720 || reduceMotion) return;
    const rect = scroller.getBoundingClientRect();
    const total = scroller.offsetHeight - innerHeight;
    let p = -rect.top / total;            // 0 → 1 through the sticky zone
    p = Math.min(1, Math.max(0, p));

    // map progress so album 1 is centered at p=0 and the last album at p=1
    const first = albums[0], last = albums[albums.length - 1];
    const startCenter = first.offsetLeft + first.offsetWidth / 2;
    const endCenter = last.offsetLeft + last.offsetWidth / 2;
    const targetCenter = startCenter + (endCenter - startCenter) * p;
    track.style.transform = `translateX(${-(targetCenter - innerWidth / 2)}px)`;

    // center detection
    const mid = innerWidth / 2;
    let best = null, bestDist = Infinity;
    albums.forEach((al) => {
      const r = al.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const dist = Math.abs(c - mid);
      if (dist < bestDist) { bestDist = dist; best = al; }
    });
    albums.forEach((al) => al.classList.toggle('is-center', al === best));
  }

  // album mood → section background
  $$('.album__open').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mood = btn.closest('.album').dataset.mood;
      albumsSection.classList.remove('mood-warm', 'mood-red', 'mood-cold', 'mood-yellow');
      albumsSection.classList.add('mood-' + mood);
    });
  });

  /* =================================================================
     TOURS — city hover card
     ================================================================= */
  const map = $('#tourMap');
  const card = $('#cityCard');
  if (map && card) {
    const cardImg = $('#cardImg'), cardVideo = $('#cardVideo');
    let pinned = null;                                  // city pinned by tap/click (touch + click-to-keep)

    function setMedia(city) {
      const raw = city.dataset.media || '';
      const sep = raw.indexOf(':');
      const type = sep > 0 ? raw.slice(0, sep) : '';
      const src = sep > 0 ? raw.slice(sep + 1) : '';
      if (type === 'video' && src) {
        if (cardVideo.getAttribute('src') !== src) cardVideo.setAttribute('src', src);
        cardVideo.style.display = 'block'; cardImg.style.display = 'none';
        const pr = cardVideo.play(); if (pr && pr.catch) pr.catch(() => {});
      } else if (type === 'img' && src) {
        if (cardImg.getAttribute('src') !== src) cardImg.setAttribute('src', src);
        cardImg.style.display = 'block'; cardVideo.style.display = 'none'; cardVideo.pause();
      } else {
        cardImg.style.display = 'none'; cardVideo.style.display = 'none'; cardVideo.pause();
      }
    }

    const show = (city) => {
      $('#cardCity').textContent = city.dataset.city;
      $('#cardYear').textContent = city.dataset.year;
      $('#cardVenue').textContent = city.dataset.venue;
      $('#cardGuests').textContent = city.dataset.guests;
      setMedia(city);
      card.classList.add('show');                       // show first so it is measurable
      // position with flip + clamp so the card is NEVER clipped by the map edges
      const mr = map.getBoundingClientRect();
      const cr = city.getBoundingClientRect();
      const px = cr.left - mr.left + cr.width / 2;       // pin x within the map
      const pinTop = cr.top - mr.top;                    // pin top within the map
      const cw = card.offsetWidth, ch = card.offsetHeight;
      let top = pinTop - 16 - ch;                        // prefer above the pin
      if (top < 8) top = pinTop + 24;                    // not enough room → flip below
      top = Math.max(8, Math.min(mr.height - ch - 8, top));
      let left = Math.max(8, Math.min(mr.width - cw - 8, px - cw / 2));
      card.style.left = left + 'px';
      card.style.top = top + 'px';
      card.style.transform = 'none';
    };
    const conceal = () => { card.classList.remove('show'); cardVideo.pause(); };
    const hide = () => { conceal(); pinned = null; };

    $$('.city', map).forEach((city) => {
      city.addEventListener('mouseenter', () => { if (!pinned) show(city); });
      city.addEventListener('mouseleave', () => { if (!pinned) conceal(); });
      city.addEventListener('focus', () => show(city));
      city.addEventListener('blur', () => { if (!pinned) conceal(); });
      // tap / click pins the card open (essential on touch, where there is no hover)
      city.addEventListener('click', (e) => {
        e.stopPropagation();
        if (pinned === city) { hide(); } else { show(city); pinned = city; }
      });
    });
    // dismiss a pinned card when tapping outside the map
    addEventListener('click', (e) => { if (pinned && !map.contains(e.target)) hide(); });
  }

  /* =================================================================
     MOMENTS — scattered photo archive + crowd assembly
     ================================================================= */
  const scatter = $('#scatter');
  const tags = ['сцена', 'натовп', '2004', 'гурт', 'тур', 'backstage', 'саундчек', 'Київ', 'live', 'архів', 'гастролі', 'фінал'];
  const momentPhotos = ['concert-big', 'crowd-people', 'band-full', 'concert-club', 'concert-festival',
    'history-2004-trio', 'history-inna', 'portrait-khlivniuk', 'history-khlivniuk-army', 'portrait-samoylo',
    'concert-big', 'concert-festival', 'crowd-people', 'band-full'];
  if (scatter) {
    const N = innerWidth <= 720 ? 8 : 14;
    for (let i = 0; i < N; i++) {
      const ph = document.createElement('figure');
      ph.className = 'photo';
      ph.dataset.tag = tags[i % tags.length];
      ph.style.backgroundImage = `url(assets/${momentPhotos[i % momentPhotos.length]}.jpg)`;
      ph.style.backgroundSize = 'cover';
      ph.style.backgroundPosition = 'center';
      if (innerWidth > 720) {
        const left = 4 + Math.random() * 80;
        const top = 2 + Math.random() * 64;
        const rot = (Math.random() * 24 - 12).toFixed(1);
        ph.style.left = left + '%';
        ph.style.top = top + '%';
        ph.style.setProperty('--rot', rot + 'deg');
        ph.style.transform = `rotate(${rot}deg)`;
        ph.dataset.rot = rot;
        ph.dataset.speed = (0.04 + Math.random() * 0.12).toFixed(3);
      }
      // hover "comes alive"
      ph.addEventListener('mouseenter', () => ph.classList.add('live'));
      ph.addEventListener('mouseleave', () => ph.classList.remove('live'));
      scatter.appendChild(ph);
    }
  }

  // merch archive strip — real backstage/concert frames
  const archiveImgs = ['concert-festival', 'crowd-people', 'concert-club', 'band-full', 'concert-big', 'history-banner'];
  $$('.archive__ph').forEach((el, i) => {
    el.style.backgroundImage = `url(assets/${archiveImgs[i % archiveImgs.length]}.jpg)`;
  });

  // build crowd (silhouette of dots that light up)
  const crowd = $('#crowd');
  if (crowd) {
    const dots = innerWidth <= 720 ? 180 : 480;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < dots; i++) {
      const d = document.createElement('span');
      d.className = 'crowd__dot';
      d.style.transitionDelay = (Math.random() * 1.1).toFixed(2) + 's';
      d.style.height = (14 + Math.random() * 20) + 'px';
      d.style.opacity = '0';
      // a few dots stay dark (no lighter) for realism
      if (Math.random() < 0.18) d.style.setProperty('--lighter', '0');
      frag.appendChild(d);
    }
    crowd.appendChild(frag);
  }

  const finale = $('#momentsFinale');
  const thanks = $('.moments__thanks');
  if ('IntersectionObserver' in window && crowd) {
    const fObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        crowd.classList.toggle('lit', en.isIntersecting);
        if (thanks) thanks.classList.toggle('in', en.isIntersecting);
      });
    }, { threshold: 0.4 });
    fObs.observe(finale);
  }

  /* =================================================================
     FOOTER — PLAY AGAIN rewind
     ================================================================= */
  const again = $('#playAgain');
  const rewind = $('.rewind');
  if (again) {
    again.addEventListener('click', () => {
      if (reduceMotion) { scrollTo({ top: 0 }); return; }
      rewind.classList.add('go');
      setTimeout(() => { if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true }); else scrollTo({ top: 0, behavior: 'auto' }); }, 700);
      setTimeout(() => {
        rewind.classList.remove('go');
        // reset hero
        boombox.classList.remove('playing', 'vibe', 'hovering');
        if (displayEl) displayEl.classList.remove('blink');
        display.textContent = 'БУМБОКС';
        displaySub.textContent = 'stereo cassette';
        bbTakeover = false; boombox.style.transform = ''; boombox.style.animation = '';
        updateHeroZoom();
      }, 1400);
    });
  }

  /* =================================================================
     HERO — scroll-zoom into the cassette → TRACK 01 / ІСТОРІЯ
     ================================================================= */
  const heroZone = $('#hero');
  const heroCopy = $$('.hero__eyebrow, .hero__title, .hero__lead, .hero__cta');
  const scrollCue = $('.scroll-cue');
  const cassettePhoto = $('.cassette__photo');
  let bbTakeover = false;
  const REST_T = 'perspective(1400px) rotateX(6deg) rotateY(-7deg)';

  const heroPhoto = $('.hero-photo');
  const heroIntro = $('#heroIntro');
  const cassetteWindow = $('.cassette__window');

  // Anchor the growing photo to the cassette window so it literally emerges FROM the cassette.
  // ("треба щоб фото з касети з'являлось а не просто так")
  function setHeroPhotoOrigin() {
    if (!cassetteWindow || !heroPhoto) return;
    const r = cassetteWindow.getBoundingClientRect();
    if (!r.width) return;
    const cx = ((r.left + r.width / 2) / innerWidth) * 100;
    const cy = ((r.top + r.height / 2) / innerHeight) * 100;
    heroPhoto.style.transformOrigin = `${cx.toFixed(2)}% ${cy.toFixed(2)}%`;
  }

  function resetHero() {
    heroCopy.forEach((el) => el.style.removeProperty('opacity'));
    if (scrollCue) scrollCue.style.removeProperty('opacity');
    if (heroPhoto) { heroPhoto.style.opacity = '0'; heroPhoto.style.transform = ''; }
    if (heroIntro) heroIntro.style.opacity = '0';
    if (bbTakeover) { boombox.style.opacity = '1'; boombox.style.filter = ''; }
  }

  function updateHeroZoom() {
    if (!heroZone || !boombox) return;
    if (reduceMotion || innerWidth <= 720) { if (bbTakeover) boombox.style.transform = REST_T; resetHero(); return; }
    if (boombox.classList.contains('playing')) return;     // PLAY handles its own transition
    const total = heroZone.offsetHeight - innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0;
    if (p <= 0.001) { if (bbTakeover) boombox.style.transform = REST_T; resetHero(); return; }
    if (!bbTakeover) { setHeroPhotoOrigin(); boombox.style.animation = 'none'; bbTakeover = true; }   // capture cassette position, then take over the entrance animation
    // boombox grows a little, then fades as the photo takes over
    const k = Math.min(1, p * 2.5);                        // flatten the tilt early
    boombox.style.transform = `perspective(${1400 + p * 4000}px) rotateX(${6 * (1 - k)}deg) rotateY(${-7 * (1 - k)}deg) scale(${1 + p * 1.4})`;
    boombox.style.opacity = String(Math.max(0, 1 - p / 0.5));
    // ONE photo grows continuously from cassette size → full screen (eased, no jump)
    if (heroPhoto) {
      const g = Math.min(1, p / 0.8);                      // constant-rate growth → full by 80% (gradual, no jump)
      heroPhoto.style.transform = `scale(${0.1 + 0.9 * g})`;
      heroPhoto.style.opacity = String(Math.min(1, p / 0.12));
    }
    // TRACK 01 intro text appears once the photo fills the screen
    if (heroIntro) heroIntro.style.opacity = String(Math.max(0, (p - 0.7) / 0.25));
    const op = String(Math.max(0, 1 - p * 5));             // !important beats the fadeUp entrance animation
    heroCopy.forEach((el) => el.style.setProperty('opacity', op, 'important'));
    if (scrollCue) scrollCue.style.setProperty('opacity', op, 'important');
    // mini-player timer follows the zoom
    if (hProgress) hProgress.style.width = (p * 100) + '%';
    if (hTime) { const s = Math.floor(p * 1200); hTime.textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }   // 00:00 → 20:00 as you scroll into TRACK 01
  }

  /* =================================================================
     SINGLE SCROLL HANDLER (rAF-throttled)
     ================================================================= */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateHeroZoom();
      updateHistoryTrack();
      updateAlbums();

      // moments photo drift
      if (scatter && innerWidth > 720) {
        const r = scatter.getBoundingClientRect();
        const off = (innerHeight - r.top);
        $$('.photo', scatter).forEach((ph) => {
          const sp = +ph.dataset.speed || 0;
          ph.style.transform = `translateY(${-off * sp}px) rotate(${ph.dataset.rot}deg)`;
        });
      }
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { updateAlbums(); updateHeroZoom(); updateHistoryTrack(); });
  updateAlbums();
  updateHeroZoom();
  updateHistoryTrack();
})();
