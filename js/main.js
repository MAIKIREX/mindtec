/**
 * MINDtec · Premium Interaction Suite v2.0
 * ─────────────────────────────────────────
 * Neural canvas · Morphing nav · Blur-in reveals
 * GSAP-level scroll animations · Magnetic buttons
 * Counter animations · Kinetic marquee
 */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════
     1. NEURAL NETWORK CANVAS
     ═══════════════════════════════════════════ */
  function initNeuralCanvas() {
    var container = document.querySelector('.neuro-visual-bg');
    if (!container) return;

    var canvas = document.createElement('canvas');
    canvas.className = 'hero-canvas';
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var W, H, mx, my, mouseActive = false;
    var NODES = [];
    var NUM_NODES = 80;
    var MAX_DIST = 160;
    var MOUSE_RADIUS = 130;

    function resize() {
      var rect = container.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    function createNodes() {
      NODES = [];
      for (var i = 0; i < NUM_NODES; i++) {
        NODES.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1 + Math.random() * 3,
          alpha: 0.4 + Math.random() * 0.6,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.006 + Math.random() * 0.018,
          highlight: Math.random() > 0.72
        });
      }
    }

    function drawNode(node) {
      var pulseR = node.r + Math.sin(node.pulse) * 1;
      node.pulse += node.pulseSpeed;

      if (node.highlight) {
        var glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, pulseR * 4);
        glow.addColorStop(0, 'rgba(242, 101, 34, 0.3)');
        glow.addColorStop(0.4, 'rgba(242, 101, 34, 0.08)');
        glow.addColorStop(1, 'rgba(11, 43, 64, 0)');
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseR * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = node.highlight
        ? 'rgba(242, 101, 34, ' + (node.alpha * 0.9) + ')'
        : 'rgba(255, 153, 85, ' + (node.alpha * 0.5) + ')';
      ctx.fill();
    }

    function drawConnection(a, b, dist) {
      var t = 1 - (dist / MAX_DIST);
      var alpha = Math.pow(t, 2.2);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = 'rgba(242, 101, 34, ' + (alpha * 0.18) + ')';
      ctx.lineWidth = alpha * 0.9;
      ctx.stroke();
    }

    function updateNodes() {
      for (var i = 0; i < NODES.length; i++) {
        var n = NODES[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < -30) n.x = W + 30;
        if (n.x > W + 30) n.x = -30;
        if (n.y < -30) n.y = H + 30;
        if (n.y > H + 30) n.y = -30;

        if (mouseActive) {
          var dx2 = n.x - mx;
          var dy2 = n.y - my;
          var d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (d2 < MOUSE_RADIUS && d2 > 0) {
            var force = (MOUSE_RADIUS - d2) / MOUSE_RADIUS;
            n.vx += (dx2 / d2) * force * 0.55;
            n.vy += (dy2 / d2) * force * 0.55;
            n.alpha = Math.min(1, n.alpha + 0.02);
          }
        } else {
          n.alpha = Math.max(0.4, n.alpha - 0.005);
        }

        n.vx *= 0.996;
        n.vy *= 0.996;
        var speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed < 0.12) {
          n.vx += (Math.random() - 0.5) * 0.05;
          n.vy += (Math.random() - 0.5) * 0.05;
        }
        if (speed > 0.7) {
          n.vx *= 0.94;
          n.vy *= 0.94;
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < NODES.length; i++) {
        for (var j = i + 1; j < NODES.length; j++) {
          var dx = NODES[i].x - NODES[j].x;
          var dy = NODES[i].y - NODES[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) drawConnection(NODES[i], NODES[j], dist);
        }
      }

      for (var k = 0; k < NODES.length; k++) {
        drawNode(NODES[k]);
      }
    }

    function loop() {
      updateNodes();
      draw();
      requestAnimationFrame(loop);
    }

    container.addEventListener('mousemove', function (e) {
      var rect = container.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      mouseActive = true;
    });
    container.addEventListener('mouseleave', function () { mouseActive = false; });
    container.addEventListener('touchmove', function (e) {
      var rect = container.getBoundingClientRect();
      var t = e.touches[0];
      mx = t.clientX - rect.left;
      my = t.clientY - rect.top;
      mouseActive = true;
    }, { passive: true });
    container.addEventListener('touchend', function () { mouseActive = false; });

    window.addEventListener('resize', function () {
      resize();
      createNodes();
    });

    resize();
    createNodes();
    loop();
  }

  /* ═══════════════════════════════════════════
     2. MORPHING HAMBURGER → FULLSCREEN OVERLAY
     ═══════════════════════════════════════════ */
  function initNavOverlay() {
    var header = document.querySelector('.site-header');
    var nav = document.querySelector('#main-nav');
    var hamburger = document.querySelector('#hamburger');
    if (!header || !nav || !hamburger) return;

    // Create overlay
    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    var inner = document.createElement('div');
    inner.className = 'nav-overlay-inner';
    overlay.appendChild(inner);
    document.body.appendChild(overlay);

    // Clone links
    var links = nav.querySelectorAll('a:not(.btn), .dropdown-toggle');
    links.forEach(function (link) {
      var clone = document.createElement('a');
      clone.className = 'nav-overlay-link';
      clone.textContent = link.textContent.replace('▾', '').trim();
      clone.href = link.href || '#';
      clone.addEventListener('click', close);
      inner.appendChild(clone);
    });

    // Clone dropdown items
    var dropdownItems = nav.querySelectorAll('.dropdown-content a');
    dropdownItems.forEach(function (link) {
      var clone = document.createElement('a');
      clone.className = 'nav-overlay-link';
      clone.textContent = link.textContent.trim();
      clone.href = link.href || '#';
      clone.style.fontSize = 'clamp(1rem, 2.5vw, 1.5rem)';
      clone.style.opacity = '0.7';
      clone.addEventListener('click', close);
      inner.appendChild(clone);
    });

    // Contact button
    var contactLink = nav.querySelector('.btn');
    if (contactLink) {
      var btnClone = document.createElement('a');
      btnClone.className = 'nav-overlay-link';
      btnClone.textContent = contactLink.textContent.trim();
      btnClone.href = contactLink.href || '#';
      btnClone.style.color = 'var(--color-primary)';
      btnClone.addEventListener('click', close);
      inner.appendChild(btnClone);
    }

    function open() {
      hamburger.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      hamburger.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      hamburger.classList.contains('active') ? close() : open();
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) close();
    });
  }

  /* ═══════════════════════════════════════════
     3. HEADER SCROLL EFFECT — Glass Morph
     ═══════════════════════════════════════════ */
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var ticking = false;

    function update() {
      ticking = false;
      header.classList.toggle('scrolled', window.scrollY > 60);
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ═══════════════════════════════════════════
     4. SCROLL PROGRESS BAR
     ═══════════════════════════════════════════ */
  function initScrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          ticking = false;
          var scrollTop = window.scrollY;
          var docHeight = document.documentElement.scrollHeight - window.innerHeight;
          var pct = docHeight > 0 ? (scrollTop / docHeight) : 0;
          bar.style.transform = 'scaleX(' + pct + ')';
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════
     5. BLUR-IN SCROLL REVEALS (IntersectionObserver)
     ═══════════════════════════════════════════ */
  function initScrollReveals() {
    var targets = document.querySelectorAll(
      '.animate-on-observe'
    );

    if (!targets.length || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ═══════════════════════════════════════════
     6. COUNT-UP ANIMATION — Premium Easing
     ═══════════════════════════════════════════ */
  function initCountUp() {
    var els = document.querySelectorAll('[data-count-target]');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) {
        var t = parseFloat(el.getAttribute('data-count-target'));
        var s = el.getAttribute('data-count-suffix') || '';
        var p = el.getAttribute('data-count-prefix') || '';
        el.textContent = p + t + s;
      });
      return;
    }

    var counted = new WeakSet();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var el = entry.target;
        if (entry.isIntersecting && !counted.has(el)) {
          counted.add(el);
          animate(el);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    els.forEach(function (el) { observer.observe(el); });

    function animate(el) {
      var target = parseFloat(el.getAttribute('data-count-target'));
      var suffix = el.getAttribute('data-count-suffix') || '';
      var prefix = el.getAttribute('data-count-prefix') || '';
      var duration = parseInt(el.getAttribute('data-count-duration')) || 2200;
      var start = null;

      // Exponential ease-out for premium feel
      function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -12 * t);
      }

      function step(ts) {
        if (!start) start = ts;
        var elapsed = ts - start;
        var progress = Math.min(elapsed / duration, 1);
        var current = easeOutExpo(progress) * target;
        el.textContent = prefix + Math.floor(current) + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = prefix + target + suffix;
        }
      }

      requestAnimationFrame(step);
    }
  }

  /* ═══════════════════════════════════════════
     7. MAGNETIC BUTTON HOVER PHYSICS
     ═══════════════════════════════════════════ */
  function initMagneticButtons() {
    var buttons = document.querySelectorAll('.btn');
    if (window.matchMedia('(pointer: coarse)').matches) return;

    buttons.forEach(function (btn) {
      var strength = 0.12;
      var currentX = 0;
      var currentY = 0;
      var targetX = 0;
      var targetY = 0;
      var animating = false;

      function lerp(a, b, f) { return a + (b - a) * f; }

      function animateFrame() {
        currentX = lerp(currentX, targetX, 0.15);
        currentY = lerp(currentY, targetY, 0.15);

        btn.style.transform = 'translate(' + currentX + 'px, ' + currentY + 'px)';

        if (Math.abs(currentX - targetX) > 0.1 || Math.abs(currentY - targetY) > 0.1) {
          requestAnimationFrame(animateFrame);
        } else {
          animating = false;
          if (targetX === 0 && targetY === 0) {
            btn.style.transform = '';
          }
        }
      }

      function startAnim() {
        if (!animating) {
          animating = true;
          requestAnimationFrame(animateFrame);
        }
      }

      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        targetX = x * strength;
        targetY = y * strength;
        startAnim();
      });

      btn.addEventListener('mouseleave', function () {
        targetX = 0;
        targetY = 0;
        startAnim();
      });
    });
  }

  /* ═══════════════════════════════════════════
     8. SMOOTH SCROLL
     ═══════════════════════════════════════════ */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* ═══════════════════════════════════════════
     9. FORM VALIDATION
     ═══════════════════════════════════════════ */
  function initFormValidation() {
    var forms = document.querySelectorAll('form:not([data-no-validate])');
    if (!forms.length) return;

    forms.forEach(function (form) {
      var inputs = form.querySelectorAll('input, textarea, select');

      inputs.forEach(function (input) {
        var fb = document.createElement('span');
        fb.className = 'field-feedback';
        input.parentNode.appendChild(fb);

        input.addEventListener('blur', function () { validate(input, fb); });
        input.addEventListener('input', function () {
          if (input.classList.contains('invalid')) validate(input, fb);
        });
      });

      form.addEventListener('submit', function (e) {
        var valid = true;
        inputs.forEach(function (input) {
          var fb = input.parentNode.querySelector('.field-feedback');
          if (!validate(input, fb)) valid = false;
        });
        if (!valid) {
          e.preventDefault();
          var first = form.querySelector('.invalid');
          if (first) first.focus();
        }
      });
    });

    function validate(input, fb) {
      var val = input.value.trim();
      fb.className = 'field-feedback';

      if (input.hasAttribute('required') && val === '') {
        fb.textContent = 'Este campo es obligatorio';
        fb.classList.add('error');
        input.classList.add('invalid');
        input.classList.remove('valid');
        return false;
      }
      if (input.type === 'email' && val !== '') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          fb.textContent = 'Ingrese un email válido';
          fb.classList.add('error');
          input.classList.add('invalid');
          input.classList.remove('valid');
          return false;
        }
      }
      if (input.hasAttribute('minlength') && val.length < parseInt(input.getAttribute('minlength'))) {
        fb.textContent = 'Mínimo ' + input.getAttribute('minlength') + ' caracteres';
        fb.classList.add('error');
        input.classList.add('invalid');
        input.classList.remove('valid');
        return false;
      }

      fb.textContent = '';
      input.classList.add('valid');
      input.classList.remove('invalid');
      return true;
    }
  }

  /* ═══════════════════════════════════════════
     10. TABS
     ═══════════════════════════════════════════ */
  function initTabs() {
    document.querySelectorAll('.tabs-container').forEach(function (ct) {
      var tabs = ct.querySelectorAll('.tab-btn');
      var panels = ct.querySelectorAll('.tab-panel');
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          var target = tab.getAttribute('data-tab');
          tabs.forEach(function (t) { t.classList.remove('active'); });
          panels.forEach(function (p) { p.classList.remove('active'); });
          tab.classList.add('active');
          var panel = ct.querySelector('[data-panel="' + target + '"]');
          if (panel) panel.classList.add('active');
        });
      });
    });
  }

  /* ═══════════════════════════════════════════
     11. BACK TO TOP
     ═══════════════════════════════════════════ */
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Volver arriba');
    btn.innerHTML = '&#8593;';
    document.body.appendChild(btn);

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          ticking = false;
          btn.classList.toggle('visible', window.scrollY > 500);
        });
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ═══════════════════════════════════════════
     12. SPOTLIGHT BORDER CARDS
     ═══════════════════════════════════════════ */
  function initSpotlightCards() {
    var cards = document.querySelectorAll('.offer-card-v2');
    if (window.matchMedia('(pointer: coarse)').matches || !cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.background = 'radial-gradient(600px circle at ' + x + 'px ' + y + 'px, rgba(242, 101, 34, 0.06), rgba(255,255,255,0.04) 40%)';
        card.style.borderColor = 'rgba(242, 101, 34, 0.15)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.background = '';
        card.style.borderColor = '';
      });
    });
  }

  /* ═══════════════════════════════════════════
     13. PARALLAX HERO ORBS (subtle depth)
     ═══════════════════════════════════════════ */
  function initParallaxOrbs() {
    var hero = document.querySelector('.hero-section');
    if (!hero || window.matchMedia('(pointer: coarse)').matches) return;

    hero.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 20;
      var y = (e.clientY / window.innerHeight - 0.5) * 20;

      hero.style.setProperty('--parallax-x', x + 'px');
      hero.style.setProperty('--parallax-y', y + 'px');
    });
  }

  /* ═══════════════════════════════════════════
     BOOT
     ═══════════════════════════════════════════ */
  function boot() {
    initNeuralCanvas();
    initNavOverlay();
    initHeaderScroll();
    initScrollProgress();
    initScrollReveals();
    initCountUp();
    initMagneticButtons();
    initSmoothScroll();
    initFormValidation();
    initTabs();
    initBackToTop();
    initSpotlightCards();
    initParallaxOrbs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
