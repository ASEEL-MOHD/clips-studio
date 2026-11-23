(function(){
  'use strict';

  /* ---------------------------------------------------------
     Edit these once; every matching element on the page updates.
     --------------------------------------------------------- */
  var SITE = {
    brand:     'Your Roastery',
    founder:   'The founder',
    whatsapp:  '000000000000',          // country code + number, digits only
    phoneText: '+00 00000 00000',
    email:     'hello@example.com',
    instagram: 'yourhandle',
    timezone:  'Asia/Kolkata',
    tzLabel:   'IST',
    services: [
      'Pop-up bars & live roasts', 'Tasting sessions', 'Cupping & green grading',
      'Barista training', 'Sourcing + menu builds', 'Roast profiling & QC',
      'Origin & processing support', 'Farm to cup consulting'
    ],
    defaultMsg: "Hi, I'd like to order coffee."
  };

  var FINE   = window.matchMedia('(pointer:fine)').matches;
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$ = function(s){ return document.querySelectorAll(s); };

  /* brand + contact details */
  $$('.js-brand').forEach(function(el){ el.textContent = SITE.brand; });
  $$('.js-founder').forEach(function(el){ el.textContent = SITE.founder; });
  $$('.js-phone').forEach(function(el){ el.textContent = SITE.phoneText; });
  $$('.js-email').forEach(function(el){ el.textContent = SITE.email; el.href = 'mailto:' + SITE.email; });
  $$('.js-ig').forEach(function(el){ el.href = 'https://www.instagram.com/' + SITE.instagram; el.target = '_blank'; el.rel = 'noopener'; });
  $$('.js-ig-text').forEach(function(el){ el.textContent = '@' + SITE.instagram; });
  $$('.js-year').forEach(function(el){ el.textContent = new Date().getFullYear(); });
  $$('.js-tz').forEach(function(el){ el.textContent = SITE.tzLabel; });
  document.title = SITE.brand;

  /* top-strip ticker: services list + "Book a session", duplicated for a seamless loop */
  var track = document.getElementById('tickerTrack');
  if(track){
    var once = '<a href="#" class="book-session js-wa" data-wa-msg="Hi, I\'d like to book a session.">' +
      '<span class="blob b1"></span><span class="blob b2"></span><span class="blob b3"></span>' +
      '<span class="bs-text">Book a session &rarr;</span></a>' +
      SITE.services.map(function(s){
        var span = document.createElement('span'); span.textContent = s; return span.outerHTML;
      }).join('');
    track.innerHTML = once + once;
  }

  /* WhatsApp links */
  $$('.js-wa').forEach(function(a){
    var msg = a.getAttribute('data-wa-msg') || SITE.defaultMsg;
    a.href = 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(msg);
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* exact header height for padding/scroll offsets */
  var header = document.getElementById('siteHeader');
  if(header){
    var setH = function(){ document.documentElement.style.setProperty('--nav-h', header.offsetHeight + 'px'); };
    setH();
    new ResizeObserver(setH).observe(header);
  }

  /* live clock */
  $$('.js-clock').forEach(function(el){
    function tick(){ el.textContent = new Date().toLocaleTimeString('en-GB',{timeZone:SITE.timezone,hour12:false}); }
    tick(); setInterval(tick, 1000);
  });

  /* mobile menu */
  var btn = document.getElementById('menuToggle'), menu = document.getElementById('mobileMenu');
  if(btn && menu){
    var root = document.documentElement;
    var close = function(){ root.classList.remove('menu-open'); btn.setAttribute('aria-expanded','false'); };
    btn.addEventListener('click', function(){
      var open = !root.classList.contains('menu-open');
      root.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', close); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
    window.addEventListener('resize', function(){ if(window.innerWidth > 860) close(); });
  }

  /* reveals */
  requestAnimationFrame(function(){ $$('.rv-hero').forEach(function(n){ n.classList.add('in'); }); });
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.16, rootMargin:'0px 0px -8% 0px'});
  $$('.rv').forEach(function(n){ io.observe(n); });

  /* magnetic buttons (mouse/trackpad only) */
  if(FINE && !REDUCE){
    $$('.magnetic').forEach(function(el){
      var tx=0, ty=0, cx=0, cy=0, running=false;
      function loop(){
        cx += (tx-cx)*.18; cy += (ty-cy)*.18;
        el.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
        if(Math.abs(tx-cx) > .05 || Math.abs(ty-cy) > .05) requestAnimationFrame(loop); else running = false;
      }
      function kick(){ if(!running){ running = true; requestAnimationFrame(loop); } }
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width/2)) * .32;
        ty = (e.clientY - (r.top + r.height/2)) * .32;
        kick();
      });
      el.addEventListener('mouseleave', function(){ tx = 0; ty = 0; kick(); });
    });
  }

  /* red glow drifting down through Process -> Story */
  var gTrack = document.getElementById('glowTrack'), glow = document.getElementById('glow');
  if(!REDUCE && gTrack && glow){
    var mx=0, my=0, nx=0, ny=0;
    if(FINE){
      gTrack.addEventListener('mousemove', function(e){
        var r = gTrack.getBoundingClientRect();
        mx = (e.clientX - (r.left + r.width/2)) * .12;
        my = (e.clientY - r.top) * .05;
      });
      gTrack.addEventListener('mouseleave', function(){ mx = 0; my = 0; });
    }
    (function frame(){
      requestAnimationFrame(frame);
      var r = gTrack.getBoundingClientRect();
      if(r.bottom < -200 || r.top > window.innerHeight + 200){ glow.style.opacity = 0; return; }
      var p = Math.max(0, Math.min(1, (window.innerHeight * .35 - r.top) / r.height));
      var op = p < .08 ? p / .08 : p > .85 ? (1 - p) / .15 : 1;
      nx += (mx - nx) * .08; ny += (my - ny) * .08;
      var topPx = p * Math.max(0, r.height - (glow.offsetHeight || 400));
      glow.style.opacity = (Math.max(0, Math.min(1, op)) * .95).toFixed(2);
      glow.style.transform = 'translate(calc(-50% + ' + nx.toFixed(1) + 'px),' + (topPx + ny).toFixed(1) + 'px)';
    })();
  }
})();
