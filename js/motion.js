/* =================================================================
   БУМБОКС — MOTION LAYER
   Smooth scroll, responsive refinements, and the cassette-to-history
   transition. Progressive enhancement over the existing static site.
   ================================================================= */
(function () {
  'use strict';

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia && matchMedia('(pointer: fine)').matches && innerWidth > 1024;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const Lenis = window.Lenis;
  const historyPhotoUrl = 'assets/history-banner.jpg';

  let lenis = null;
  let scrollLocked = false;
  let journeyRunning = false;
  let journeyDone = false;
  let syntheticScrollTick = 0;

  installRefinementStyles();
  if (!reduceMotion && gsap) root.classList.add('js-motion');
  finishLoader();
  setupLenis();
  setupNavigation();
  setupPlayJourney();
  setupMotionEnhancements();
  setupMoments();

  function installRefinementStyles() {
    const style = document.createElement('style');
    style.id = 'bumbox-motion-refinements';
    style.textContent = `
html,body{max-width:100%;overflow-x:clip}
html.lenis,html.lenis body{height:auto}
.lenis.lenis-smooth{scroll-behavior:auto!important}
.lenis.lenis-stopped{overflow:hidden}
body.scroll-locked,body.nav-locked{overflow:hidden;touch-action:none}
.js-motion .boombox,.js-motion .hero__eyebrow,.js-motion .hero__title,.js-motion .hero__lead,.js-motion .hero__cta,.js-motion .scroll-cue{animation:none;opacity:1}
.btn,.topnav__cta,.ctrl,.mtab,.album__open,.footer__again{transition:transform .25s var(--ease),box-shadow .3s var(--ease),background .3s var(--ease),color .3s var(--ease),border-color .3s var(--ease)}
.btn:active,.topnav__cta:active,.ctrl:active,.mtab:active,.album__open:active,.footer__again:active{transform:translateY(1px) scale(.985)}
.topnav{transition:background .35s var(--ease),box-shadow .35s var(--ease),backdrop-filter .35s var(--ease)}
.topnav.scrolled{background:rgba(7,7,7,.76);box-shadow:0 10px 32px rgba(0,0,0,.42);backdrop-filter:blur(15px) saturate(1.15);-webkit-backdrop-filter:blur(15px) saturate(1.15)}
.topnav__actions{flex-shrink:0}.topnav__cta{position:relative;z-index:64;flex-shrink:0}
.hero{overflow:hidden}.hero-photo{background-image:url('${historyPhotoUrl}');background-position:center;background-size:cover}
.hero.hero--history-settled .hero-photo{opacity:1!important;transform:scale(1)!important;border-radius:0!important;transform-origin:50% 50%!important}
.hero.hero--history-settled .hero-intro{opacity:1!important}
.hero.hero--history-settled .boombox,.hero.hero--history-settled .hero__eyebrow,.hero.hero--history-settled .hero__title,.hero.hero--history-settled .hero__lead,.hero.hero--history-settled .hero__cta,.hero.hero--history-settled .scroll-cue,.hero.hero--history-settled .deco-label{opacity:0!important;pointer-events:none!important;visibility:hidden!important}
.tr__photo.is-flying{overflow:hidden;will-change:left,top,width,height,border-width,border-radius,box-shadow;transform:none!important;backface-visibility:hidden;contain:layout paint}
.tr__photo.is-flying .tr__img{background-image:url('${historyPhotoUrl}');background-position:center;background-size:cover}
.tr__photo.is-flying .tr__develop{opacity:0!important}.tr__photo.is-flying .tr__grain{will-change:opacity}
.tr__cassette .tr__reel::after{animation:spin .85s linear infinite}
.motion-reveal{will-change:transform,opacity}.motion-parallax{will-change:transform}.tourdate,.poster,.mcard{transform:translateZ(0)}
@media (pointer:fine){.tourdate:hover{transform:translateY(-3px);background:rgba(245,197,24,.075);box-shadow:0 16px 38px rgba(0,0,0,.28)}.poster:hover,.mcard:hover{transform:translateY(-6px)}}
@media (max-width:960px){.container{width:min(100% - 28px,var(--maxw))}.display-h{font-size:clamp(2.4rem,13vw,5.2rem)}.lead-p{font-size:clamp(1rem,4.8vw,1.28rem)}}
@media (max-width:820px){.topnav{padding:max(.55rem,env(safe-area-inset-top)) max(.75rem,env(safe-area-inset-right)) .55rem max(.75rem,env(safe-area-inset-left));gap:.6rem}.topnav__logo{font-size:1.15rem}.topnav__cta{min-height:38px;font-size:.64rem;padding:.52em .72em;max-width:44vw;overflow:hidden;text-overflow:ellipsis}.topnav__burger{width:42px;height:42px;flex:0 0 42px}.topnav__list{z-index:63}.hero__inner{padding-inline:max(16px,4vw)}.hero__cta{width:min(100%,380px);gap:.65rem}.hero__cta .btn{flex:1 1 100%;width:100%;padding-inline:1rem}.boombox{width:min(92vw,390px);max-width:100%}.tr__deck{width:min(540px,90vw)!important}.track-tag{letter-spacing:.24em}.miniplayer{width:min(100%,360px);padding:.8rem}.timeline__list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem 0}.timeline__tape{display:none}.timeline__list li{min-width:0}.doc-scene{width:min(100%,92vw);padding:1.25rem;border-radius:10px;gap:1.1rem}.doc-scene .scene__media,.doc-scene .bandphoto,.scene__videos,.scene__stack{max-width:min(100%,360px);max-height:none}.member-cards--row{flex-wrap:wrap}.member-cards--row .member-card{flex:1 1 120px}.member-card:hover .mc__img{transform:scale(1.35) translateY(-3px)}.album{width:min(92vw,380px);margin-inline:auto}.album__cover{max-width:min(235px,70vw)}.album__vinyl{left:50%;top:12%;width:76%;height:76%;transform:translateX(-3%)}.album.is-center .album__vinyl{left:50%}.map{width:min(100%,96vw)}.tourdate{grid-template-columns:74px 1fr;grid-template-areas:'d c' 'd v' 'd co' 't t';gap:.16rem .8rem;padding:1rem .2rem}.tourdate__d{grid-area:d}.tourdate__c{grid-area:c}.tourdate__v{grid-area:v}.tourdate__co{grid-area:co}.tourdate .btn--ticket{grid-area:t;justify-self:stretch;min-height:44px;margin-top:.55rem}.merch__filters{justify-content:flex-start;flex-wrap:nowrap;overflow-x:auto;padding:0 1rem 1rem;margin-inline:-1rem;scrollbar-width:none}.merch__filters::-webkit-scrollbar{display:none}.mtab{flex:0 0 auto}.merch__grid{grid-template-columns:1fr;gap:1rem}.mcard,.mcard--donate{grid-column:1/-1;border-radius:10px}.donate__btn{align-self:stretch}.scatter{width:min(100%,92vw)}.filmcam{width:min(82vw,330px)}.moments__quote{padding-block:10vh}.footer__social{width:100%;display:grid;grid-template-columns:1fr;gap:.75rem}.ctrl--social{justify-content:center;min-height:44px}.footer__complete{width:min(100%,90vw)}}
@media (max-width:430px){.topnav__cta{font-size:.58rem;max-width:42vw}.topnav__logo{font-size:1rem}.boombox{width:94vw}.hero__lead{max-width:25ch}.display__text{font-size:.68rem}.ctrl--play{padding:.62em .82em}.timeline__list{grid-template-columns:repeat(2,minmax(0,1fr))}.doc-scene{padding:1rem}.scene__title{font-size:clamp(1.7rem,10vw,2.5rem)}.album__cover{max-width:210px}.map__legend{font-size:.55rem}.mcard__media{padding:14px 10px}.moments__title{font-size:clamp(2.35rem,16vw,4.2rem)}}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto!important}.loader,.tr,.cursor-light{display:none!important}.motion-reveal,.motion-parallax{opacity:1!important;transform:none!important}.hero.hero--history-settled .hero-photo,.hero.hero--history-settled .hero-intro{display:none!important}}
`;
    document.head.appendChild(style);
  }

  function finishLoader() {
    const loader = $('#loader');
    const done = () => {
      if (loader) loader.classList.add('is-done');
      body.classList.remove('is-loading');
    };
    if (!loader) { done(); return; }
    if (!gsap || reduceMotion) {
      addEventListener('load', done, { once: true });
      setTimeout(done, 900);
      return;
    }
    gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: done })
      .to($('.loader__logo', loader), { opacity: 1, scale: 1.04, duration: 0.45 })
      .to($('.loader__bar', loader), { opacity: 1, duration: 0.18 }, '<')
      .to($('.loader__bar i', loader), { width: '100%', duration: 0.62, ease: 'power1.inOut' }, '<+0.05')
      .to(loader, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, '+=0.08');
    setTimeout(done, 2600);
  }

  function setupLenis() {
    if (reduceMotion || !Lenis) return;
    lenis = new Lenis({
      duration: finePointer ? 1.08 : 0.82,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.86,
      smoothTouch: false,
      touchMultiplier: 1.08,
    });
    window.__lenis = lenis;
    lenis.on('scroll', () => {
      if (ScrollTrigger) ScrollTrigger.update();
      if (!syntheticScrollTick) {
        syntheticScrollTick = requestAnimationFrame(() => {
          syntheticScrollTick = 0;
          dispatchEvent(new Event('scroll'));
        });
      }
    });
    if (gsap) {
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  function setupNavigation() {
    const nav = $('#topnav');
    const burger = $('#navBurger');
    if (!nav) return;
    const setGlass = () => nav.classList.toggle('scrolled', scrollY > 38);
    addEventListener('scroll', setGlass, { passive: true });
    setGlass();

    const syncMenu = () => {
      const open = nav.classList.contains('open');
      body.classList.toggle('nav-locked', open);
      if (!lenis) return;
      if (open) lenis.stop();
      else if (!scrollLocked) lenis.start();
    };
    new MutationObserver(syncMenu).observe(nav, { attributes: true, attributeFilter: ['class'] });
    if (burger) burger.addEventListener('click', () => requestAnimationFrame(syncMenu));

    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href="#hero"]');
      if (!link) return;
      const hero = $('#hero');
      if (hero) hero.classList.remove('hero--history-settled');
      journeyDone = false;
    }, true);
  }

  function setupMotionEnhancements() {
    if (reduceMotion) {
      $$('.reveal').forEach((el) => el.classList.add('in'));
      return;
    }
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const introPieces = ['.hero__eyebrow', '.boombox', '.hero__title', '.hero__lead', '.hero__cta']
      .map((selector) => $(selector)).filter(Boolean);
    gsap.from(introPieces, {
      opacity: 0,
      y: 26,
      scale: 0.985,
      duration: 0.78,
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.25,
      clearProps: 'opacity,transform',
    });

    $$('.albums__title,.tours__head,.tourlist__head,.merch__head,.moments__head,.footer__sub').forEach((el) => {
      el.classList.add('motion-reveal');
      gsap.from(el, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 84%', once: true },
      });
    });

    const cards = $$('.poster,.tourdate,.mcard');
    if (cards.length) {
      gsap.set(cards, { opacity: 0, y: 30 });
      ScrollTrigger.batch(cards, {
        interval: 0.08,
        batchMax: 8,
        start: 'top 88%',
        onEnter: (batch) => gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.62,
          stagger: 0.055,
          ease: 'power3.out',
          overwrite: true,
        }),
        once: true,
      });
    }

    $$('.doc-scene').forEach((scene, index) => {
      ScrollTrigger.create({
        trigger: scene,
        start: 'top 86%',
        once: true,
        onEnter: () => setTimeout(() => scene.classList.add('media-in'), Math.min(index, 5) * 70),
      });
    });

    if (finePointer) {
      $$('.history__bg,.moments__bg,.footer__beam').forEach((el) => {
        el.classList.add('motion-parallax');
        gsap.to(el, {
          yPercent: el.classList.contains('footer__beam') ? 18 : 10,
          ease: 'none',
          scrollTrigger: { trigger: el.closest('.section') || el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });
      $$('.btn,.topnav__cta,.album__open,.footer__again,.ctrl--social').forEach((el) => {
        const qx = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
        const qy = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });
        el.addEventListener('mousemove', (event) => {
          const r = el.getBoundingClientRect();
          qx((event.clientX - (r.left + r.width / 2)) * 0.18);
          qy((event.clientY - (r.top + r.height / 2)) * 0.22);
        });
        el.addEventListener('mouseleave', () => { qx(0); qy(0); });
      });
    }

    requestAnimationFrame(() => ScrollTrigger.refresh());
    addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }

  function setupPlayJourney() {
    const play = $('#playBtn');
    if (!play) return;
    play.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      if (journeyRunning) return;
      if (journeyDone) { settleAtHistoryFrame(); return; }
      runCassetteJourney();
    }, true);

    const again = $('#playAgain');
    if (again) {
      again.addEventListener('click', () => {
        const hero = $('#hero');
        if (hero) hero.classList.remove('hero--history-settled');
        journeyDone = false;
      }, true);
    }

    addEventListener('scroll', () => {
      const hero = $('#hero');
      if (!hero || !hero.classList.contains('hero--history-settled') || journeyRunning) return;
      const end = heroEndScroll();
      if (end > 100 && scrollY < end - 100) hero.classList.remove('hero--history-settled');
    }, { passive: true });
  }

  function runCassetteJourney() {
    const play = $('#playBtn');
    const boombox = $('#boombox');
    const hero = $('#hero');
    const display = $('#display');
    const displayText = $('#displayText');
    const displaySub = $('#displaySub');
    const cassetteWindow = $('.cassette__window');
    if (!gsap || reduceMotion || !boombox || !cassetteWindow) {
      journeyDone = true;
      settleAtHistoryFrame();
      return;
    }

    journeyRunning = true;
    journeyDone = true;
    if (play) play.setAttribute('aria-disabled', 'true');
    if (hero) hero.classList.add('tr-playing');
    boombox.classList.add('playing', 'vibe');
    if (display) display.classList.add('glow');
    if (displayText) displayText.textContent = 'TRACK 01';
    if (displaySub) displaySub.textContent = 'історія';
    lockScroll(true);
    scrollImmediate(0);
    cassetteSound('motor');

    const layer = document.createElement('div');
    layer.className = 'tr';
    layer.id = 'playTr';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = '<div class="tr__vignette"></div><div class="tr__spot"></div><div class="tr__deck"><div class="tr__well"></div><div class="tr__cassette"><div class="tr__photo"><div class="tr__img"></div><div class="tr__develop"></div><div class="tr__grain"></div></div><div class="tr__casbody"></div><span class="tr__reel tr__reel--l"></span><span class="tr__reel tr__reel--r"></span><div class="tr__label">TRACK 01 — BUMBOX 20</div></div><div class="tr__door"></div></div>';
    body.appendChild(layer);

    const q = (selector) => layer.querySelector(selector);
    const vignette = q('.tr__vignette');
    const spot = q('.tr__spot');
    const deck = q('.tr__deck');
    const cassette = q('.tr__cassette');
    const photo = q('.tr__photo');
    const develop = q('.tr__develop');
    const img = q('.tr__img');
    const grain = q('.tr__grain');
    const door = q('.tr__door');
    if (img) img.style.backgroundImage = `url("${historyPhotoUrl}")`;

    const cr = cassetteWindow.getBoundingClientRect();
    const dr = deck.getBoundingClientRect();
    const startScale = Math.max(0.16, Math.min(0.52, (cr.width * 1.42) / Math.max(1, dr.width)));
    const startX = cr.left + cr.width / 2 - innerWidth / 2;
    const startY = cr.top + cr.height / 2 - innerHeight / 2;
    const mobile = innerWidth <= 720;
    const speed = mobile ? 0.82 : 1;

    gsap.set(deck, { xPercent: -50, yPercent: -50, x: startX, y: startY, scale: startScale, opacity: 0, rotateX: 5 });
    gsap.set([vignette, spot], { opacity: 0 });
    gsap.set(boombox, { transformPerspective: 1400, rotationX: 6, rotationY: -7, scale: 1, opacity: 1 });

    gsap.timeline({ defaults: { ease: 'power3.inOut' } })
      .to(vignette, { opacity: 1, duration: 0.55 * speed }, 0)
      .to(spot, { opacity: 1, duration: 0.55 * speed }, 0)
      .to(boombox, { rotationX: 0, rotationY: 0, scale: mobile ? 1.04 : 1.16, duration: 0.55 * speed, ease: 'power3.out' }, 0)
      .to(deck, { opacity: 1, x: 0, y: 0, scale: 1, rotateX: 0, duration: 0.72 * speed, ease: 'power3.inOut' }, 0.36 * speed)
      .to(boombox, { opacity: 0, duration: 0.4 * speed, ease: 'power2.in' }, 0.62 * speed)
      .to(door, { rotateX: 90, duration: 0.56 * speed, ease: 'power3.inOut' }, 1.02 * speed)
      .add(() => cassetteSound('click'), 1.08 * speed)
      .to(door, { opacity: 0, duration: 0.22 * speed, ease: 'power1.in' }, 1.54 * speed)
      .to(cassette, { y: mobile ? '-56%' : '-64%', duration: 0.9 * speed, ease: 'power2.out' }, 1.46 * speed)
      .add(() => cassetteSound('click'), 2.25 * speed)
      .to(photo, { y: mobile ? '-110%' : '-122%', duration: 0.98 * speed, ease: 'power2.out' }, 2.62 * speed)
      .to(develop, { opacity: 0, duration: 0.88 * speed, ease: 'power1.inOut' }, 2.88 * speed)
      .fromTo(img, { filter: 'brightness(.24) contrast(1.25) saturate(.72) blur(2.5px)' }, { filter: 'brightness(1) contrast(1) saturate(1) blur(0px)', duration: 0.9 * speed, ease: 'power1.inOut' }, 2.88 * speed)
      .to(grain, { opacity: 0.2, duration: 0.6 * speed, ease: 'power1.out' }, 3.05 * speed)
      .add(() => flyPhotoToHistory(layer, photo), 3.82 * speed);
  }

  function flyPhotoToHistory(layer, photo) {
    const rect = photo.getBoundingClientRect();
    layer.appendChild(photo);
    photo.classList.add('is-flying');
    const img = $('.tr__img', photo);
    if (img) img.style.backgroundImage = `url("${historyPhotoUrl}")`;
    gsap.set(photo, { clearProps: 'transform' });
    Object.assign(photo.style, {
      position: 'fixed',
      left: rect.left + 'px',
      top: rect.top + 'px',
      width: rect.width + 'px',
      height: rect.height + 'px',
      right: 'auto',
      bottom: 'auto',
      margin: '0',
      zIndex: '5',
      transform: 'none',
      transformOrigin: '50% 50%',
    });

    gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: () => finishJourney(layer) })
      .to(photo, {
        left: 0,
        top: 0,
        width: innerWidth,
        height: innerHeight,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRadius: 0,
        boxShadow: '0 0 0 rgba(0,0,0,0)',
        duration: innerWidth <= 720 ? 0.9 : 1.12,
      }, 0)
      .to($('.tr__grain', photo), { opacity: 0.04, duration: 0.55, ease: 'power2.out' }, 0.08);
  }

  function finishJourney(layer) {
    settleAtHistoryFrame();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const boombox = $('#boombox');
        const hero = $('#hero');
        const display = $('#display');
        const play = $('#playBtn');
        if (layer) layer.remove();
        if (boombox) {
          boombox.classList.remove('playing', 'vibe', 'hovering');
          gsap.set(boombox, { clearProps: 'opacity,transform,rotationX,rotationY,scale' });
        }
        if (hero) hero.classList.remove('tr-playing');
        if (display) display.classList.remove('glow', 'blink');
        if (play) play.removeAttribute('aria-disabled');
        journeyRunning = false;
        lockScroll(false);
        if (ScrollTrigger) ScrollTrigger.refresh();
      });
    });
  }

  function settleAtHistoryFrame() {
    const hero = $('#hero');
    const heroPhoto = $('.hero-photo');
    if (heroPhoto) heroPhoto.style.setProperty('background-image', `url("${historyPhotoUrl}")`, 'important');
    if (hero) hero.classList.add('hero--history-settled');
    scrollImmediate(heroEndScroll());
    const hProgress = $('#historyProgress');
    const hTime = $('#historyTime');
    if (hProgress) hProgress.style.width = '100%';
    if (hTime) hTime.textContent = '20:00';
  }

  function heroEndScroll() {
    const hero = $('#hero');
    return hero ? Math.max(0, hero.offsetHeight - innerHeight) : 0;
  }

  function scrollImmediate(y) {
    if (lenis && !reduceMotion) lenis.scrollTo(y, { immediate: true, force: true });
    else scrollTo({ top: y, behavior: 'auto' });
    dispatchEvent(new Event('scroll'));
    if (ScrollTrigger) ScrollTrigger.update();
  }

  const blockScroll = (event) => event.preventDefault();
  const blockKeys = (event) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar'].includes(event.key)) {
      event.preventDefault();
    }
  };

  function lockScroll(on) {
    if (on === scrollLocked) return;
    scrollLocked = on;
    body.classList.toggle('scroll-locked', on);
    if (lenis) {
      if (on) lenis.stop();
      else if (!body.classList.contains('nav-locked')) lenis.start();
    }
    const method = on ? 'addEventListener' : 'removeEventListener';
    window[method]('wheel', blockScroll, { passive: false });
    window[method]('touchmove', blockScroll, { passive: false });
    window[method]('keydown', blockKeys, { passive: false });
  }

  let audioContext = null;
  function cassetteSound(kind) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioContext = audioContext || new AC();
      const ctx = audioContext;
      const now = ctx.currentTime;
      if (kind === 'click') {
        const count = Math.floor(ctx.sampleRate * 0.045);
        const buffer = ctx.createBuffer(1, count, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < count; i += 1) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / count, 3.2);
        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        gain.gain.value = 0.055;
        source.buffer = buffer;
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start(now);
        return;
      }
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 54;
      filter.type = 'lowpass';
      filter.frequency.value = 280;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.12);
      gain.gain.linearRampToValueAtTime(0.018, now + 1.4);
      gain.gain.linearRampToValueAtTime(0, now + 3.0);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 3.05);
      cassetteSound('click');
    } catch (error) {
      // Audio is optional and must never block the visual transition.
    }
  }

  function setupMoments() {
    const moments = $('#moments');
    const cam = $('#filmcam');
    const scatter = $('#scatter');
    if (!moments || !cam || !scatter || reduceMotion) return;
    const photos = () => $$('.photo', scatter);
    if (!photos().length) return;
    moments.classList.add('moments--armed');

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      moments.classList.add('moments--revealed');
      if (!gsap) return;
      const lens = $('.filmcam__lens', cam) || cam;
      const lr = lens.getBoundingClientRect();
      const cx = lr.left + lr.width / 2;
      const cy = lr.top + lr.height / 2;
      photos().forEach((photo, index) => {
        const r = photo.getBoundingClientRect();
        gsap.fromTo(photo, {
          x: cx - (r.left + r.width / 2),
          y: cy - (r.top + r.height / 2),
          scale: 0.24,
          opacity: 0,
          rotation: index % 2 ? 14 : -14,
        }, {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.72,
          delay: 0.2 + index * 0.035,
          ease: 'back.out(1.16)',
          onComplete: () => { photo.style.opacity = ''; photo.style.transform = ''; },
        });
      });
    };

    const vf = $('#filmVf') || cam;
    vf.addEventListener('click', (event) => { event.stopPropagation(); reveal(); });
    cam.addEventListener('click', reveal);
  }
})();
