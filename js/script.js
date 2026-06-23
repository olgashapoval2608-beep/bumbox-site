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
    setTimeout(() => { const h = $('#history'); if (h) h.scrollIntoView({ behavior: 'auto' }); }, 600);
    setTimeout(() => warp.classList.remove('go'), 1300);
  }

  function goTo(sel) {
    const t = $(sel);
    if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  /* =================================================================
     SIDE TRACKNAV — active section + smooth anchor scroll
     ================================================================= */
  const navItems = $$('.tracknav__item');
  const sections = navItems.map((a) => $(a.getAttribute('href'))).filter(Boolean);

  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1 && $(id)) { e.preventDefault(); goTo(id); }
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

  /* =================================================================
     ALBUMS — sticky vertical→horizontal carousel
     ================================================================= */
  const scroller = $('#albumScroller');
  const track = $('#albumTrack');
  const albums = $$('.album');
  const albumsSection = $('#albums');

  function updateAlbums() {
    if (!scroller || !track || innerWidth <= 720) return;
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
    $$('.city', map).forEach((city) => {
      const show = () => {
        $('#cardCity').textContent = city.dataset.city;
        $('#cardYear').textContent = city.dataset.year;
        $('#cardVenue').textContent = city.dataset.venue;
        $('#cardGuests').textContent = city.dataset.guests;
        const mr = map.getBoundingClientRect();
        const cr = city.getBoundingClientRect();
        let x = cr.left - mr.left + cr.width / 2;
        let y = cr.top - mr.top - 12;
        // keep card inside the map
        x = Math.min(mr.width - 110, Math.max(110, x));
        card.style.left = x + 'px';
        card.style.top = y + 'px';
        card.style.transform = 'translate(-50%,-100%)';
        card.classList.add('show');
        // restart flash
        const flash = $('.map__card-flash');
        flash.style.animation = 'none'; void flash.offsetWidth; flash.style.animation = '';
      };
      city.addEventListener('mouseenter', show);
      city.addEventListener('focus', show);
      city.addEventListener('mouseleave', () => card.classList.remove('show'));
      city.addEventListener('blur', () => card.classList.remove('show'));
    });
  }

  /* =================================================================
     MOMENTS — scattered photo archive + crowd assembly
     ================================================================= */
  const scatter = $('#scatter');
  const tags = ['сцена', 'натовп', '2008', 'студія', 'тур', 'backstage', 'саундчек', 'Київ', 'live', 'архів', 'гастролі', 'фінал'];
  if (scatter) {
    const N = innerWidth <= 720 ? 8 : 14;
    for (let i = 0; i < N; i++) {
      const ph = document.createElement('figure');
      ph.className = 'photo';
      ph.dataset.tag = tags[i % tags.length];
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
      setTimeout(() => scrollTo({ top: 0, behavior: 'auto' }), 700);
      setTimeout(() => {
        rewind.classList.remove('go');
        // reset hero
        boombox.classList.remove('playing', 'vibe', 'hovering');
        if (displayEl) displayEl.classList.remove('blink');
        display.textContent = 'БУМБОКС';
        displaySub.textContent = 'stereo cassette';
        updateHeroDecompose();
      }, 1400);
    });
  }

  /* =================================================================
     HERO — sticky scroll "decompose": корпус → касета → стрічка → звук → концерт
     ================================================================= */
  const heroZone = $('#hero');
  const heroCopy = $$('.hero__eyebrow, .hero__title, .hero__lead, .hero__cta');
  const scrollCue = $('.scroll-cue');
  const decoLabel = $('#decoLabel');
  const bbHandle = $('.boombox__handle');
  const bbLeft = $('.speaker--left');
  const bbRight = $('.speaker--right');
  const bbCenter = $('.boombox__center');
  const bbBody = $('.boombox__body');
  const decoLayers = ['корпус', 'касета', 'стрічка', 'звук', 'концерт'];

  function clearDecompose() {
    [bbHandle, bbLeft, bbRight, bbCenter, bbBody].forEach((el) => {
      if (el) { el.style.transform = ''; el.style.opacity = ''; el.style.filter = ''; el.style.boxShadow = ''; }
    });
    heroCopy.forEach((el) => el.style.removeProperty('opacity'));
    if (scrollCue) scrollCue.style.removeProperty('opacity');
    if (decoLabel) decoLabel.style.opacity = '0';
  }

  function updateHeroDecompose() {
    if (!heroZone || !bbBody) return;
    if (reduceMotion || innerWidth <= 720) { clearDecompose(); return; }
    if (boombox.classList.contains('playing')) return;     // don't fight the PLAY warp
    const total = heroZone.offsetHeight - innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, scrollY / total)) : 0;
    if (p <= 0.001) { clearDecompose(); return; }

    bbHandle.style.transform = `translateY(${-p * 230}px) rotate(${-p * 6}deg)`;
    bbHandle.style.opacity = String(1 - p);
    bbLeft.style.transform = `translate(${-p * 46}vw, ${-p * 9}vh) rotate(${-p * 38}deg)`;
    bbLeft.style.opacity = String(1 - p * 0.7);
    bbCenter.style.transform = `translateY(${p * 36}vh) scale(${1 - p * 0.12})`;
    bbCenter.style.opacity = String(1 - p * 0.85);
    // the right speaker survives and swells into a concert spotlight
    bbRight.style.transform = `translate(${p * 10}vw, ${-p * 2}vh) scale(${1 + p * 0.9})`;
    bbRight.style.filter = `brightness(${1 + p * 1.4})`;
    bbRight.style.boxShadow = `0 0 ${p * 90}px ${p * 22}px rgba(245,197,24,${p * 0.55})`;
    bbBody.style.opacity = String(1 - p * 0.35);

    const copyOpacity = String(Math.max(0, 1 - p * 4));   // !important beats the fadeUp entrance animation
    heroCopy.forEach((el) => el.style.setProperty('opacity', copyOpacity, 'important'));
    if (scrollCue) scrollCue.style.setProperty('opacity', copyOpacity, 'important');
    if (decoLabel) {
      decoLabel.textContent = decoLayers[Math.min(decoLayers.length - 1, Math.floor(p * decoLayers.length))];
      decoLabel.style.opacity = p > 0.05 && p < 0.97 ? '0.85' : '0';
    }
  }

  /* =================================================================
     SINGLE SCROLL HANDLER (rAF-throttled)
     ================================================================= */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateHeroDecompose();
      updateAlbums();

      // history mini-player progress
      if (historySection && hProgress) {
        const r = historySection.getBoundingClientRect();
        const prog = Math.min(1, Math.max(0, (innerHeight - r.top) / (r.height + innerHeight)));
        hProgress.style.width = (prog * 100) + '%';
        const totalSec = 20 * 60;
        const cur = Math.floor(prog * totalSec);
        hTime.textContent = `${String(Math.floor(cur / 60)).padStart(2, '0')}:${String(cur % 60).padStart(2, '0')}`;
      }

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
  addEventListener('resize', () => { updateAlbums(); updateHeroDecompose(); });
  updateAlbums();
  updateHeroDecompose();
})();
