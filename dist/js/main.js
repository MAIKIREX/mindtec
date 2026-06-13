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
     1. NEURAL NETWORK CANVAS — Desktop + Mobile
     ═══════════════════════════════════════════ */

  /**
   * Creates a self-contained neural canvas inside `container`.
   * @param {Element} container  - DOM element that will host the canvas
   * @param {Object}  opts       - { numNodes, maxDist, speed, isBg }
   *   isBg = true  →  canvas covers the full container as a background layer
   *                    (pointer-events: none, reduced opacity overlay)
   */
  function createNeuralCanvas(container, opts) {
    opts = opts || {};
    var NUM_NODES   = opts.numNodes  || 80;
    var MAX_DIST    = opts.maxDist   || 160;
    var SPEED       = opts.speed     || 0.35;
    var IS_BG       = opts.isBg      || false;
    var MOUSE_RADIUS = 130;

    var canvas = document.createElement('canvas');
    canvas.className = IS_BG ? 'hero-canvas hero-canvas-bg' : 'hero-canvas';
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var W, H, mx, my, mouseActive = false;
    var NODES = [];

    function resize() {
      var rect = container.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width  || window.innerWidth;
      H = rect.height || window.innerHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + 'px';
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
          vx: (Math.random() - 0.5) * SPEED,
          vy: (Math.random() - 0.5) * SPEED,
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
          var d2  = Math.sqrt(dx2 * dx2 + dy2 * dy2);
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
        if (speed > 0.7) { n.vx *= 0.94; n.vy *= 0.94; }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < NODES.length; i++) {
        for (var j = i + 1; j < NODES.length; j++) {
          var dx   = NODES[i].x - NODES[j].x;
          var dy   = NODES[i].y - NODES[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) drawConnection(NODES[i], NODES[j], dist);
        }
      }
      for (var k = 0; k < NODES.length; k++) { drawNode(NODES[k]); }
    }

    function loop() { updateNodes(); draw(); requestAnimationFrame(loop); }

    /* Interaction — mouse + touch */
    if (!IS_BG) {
      container.addEventListener('mousemove', function (e) {
        var rect = container.getBoundingClientRect();
        mx = e.clientX - rect.left;
        my = e.clientY - rect.top;
        mouseActive = true;
      });
      container.addEventListener('mouseleave', function () { mouseActive = false; });
    }
    /* Touch drag always active for both modes */
    container.addEventListener('touchmove', function (e) {
      var rect = container.getBoundingClientRect();
      var t = e.touches[0];
      mx = t.clientX - rect.left;
      my = t.clientY - rect.top;
      mouseActive = true;
    }, { passive: true });
    container.addEventListener('touchend', function () { mouseActive = false; });

    window.addEventListener('resize', function () { resize(); createNodes(); });

    resize();
    createNodes();
    loop();
  }

  /* ── Desktop canvas (inside .neuro-visual-bg card or .hero-proof-card) */
  function initNeuralCanvas() {
    var containers = document.querySelectorAll('.neuro-visual-bg, .hero-proof-card');
    for (var i = 0; i < containers.length; i++) {
      createNeuralCanvas(containers[i], { numNodes: 80, maxDist: 160, speed: 0.35, isBg: false });
    }
  }

  /* ── Mobile/tablet canvas (full hero background) */
  function initMobileHeroCanvas() {
    var mobileContainer = document.getElementById('hero-mobile-canvas');
    var heroSection     = document.querySelector('.hero-section');
    if (!mobileContainer || !heroSection) return;

    /* Give the mobile container the full hero dimensions */
    function syncSize() {
      var rect = heroSection.getBoundingClientRect();
      mobileContainer.style.width  = rect.width  + 'px';
      mobileContainer.style.height = rect.height + 'px';
    }
    syncSize();
    window.addEventListener('resize', syncSize, { passive: true });

    /* Fewer nodes on mobile for performance */
    var isMobile = window.innerWidth <= 768;
    createNeuralCanvas(mobileContainer, {
      numNodes: isMobile ? 45 : 60,
      maxDist:  isMobile ? 120 : 140,
      speed:    0.28,
      isBg:     true
    });
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

    // Clone navigation elements in order
    var navChildren = nav.children;
    Array.prototype.forEach.call(navChildren, function (item) {
      if (item.classList.contains('dropdown')) {
        // Create collapsible mobile container
        var dropdownContainer = document.createElement('div');
        dropdownContainer.className = 'mobile-dropdown-container';

        // Toggle button
        var toggle = document.createElement('button');
        toggle.className = 'nav-overlay-link mobile-dropdown-toggle';
        toggle.innerHTML = 'Soluciones <span class="arrow">▾</span>';
        dropdownContainer.appendChild(toggle);

        // Content wrapper (accordion body)
        var content = document.createElement('div');
        content.className = 'mobile-dropdown-content';

        // Clone desktop mega menu columns into the mobile content wrapper
        var cols = item.querySelectorAll('.mega-menu-col');
        cols.forEach(function (col) {
          var mobileCol = document.createElement('div');
          mobileCol.className = 'mobile-mega-col';

          var title = col.querySelector('.mega-menu-title');
          if (title) {
            var colTitle = document.createElement('div');
            colTitle.className = 'mobile-mega-title';
            colTitle.textContent = title.textContent;
            mobileCol.appendChild(colTitle);
          }

          var links = col.querySelectorAll('a');
          links.forEach(function (link) {
            var mobileLink = document.createElement('a');
            mobileLink.className = 'mobile-mega-link';
            mobileLink.textContent = link.textContent.trim();
            mobileLink.href = link.href || '#';
            mobileLink.addEventListener('click', close);
            mobileCol.appendChild(mobileLink);
          });

          content.appendChild(mobileCol);
        });

        dropdownContainer.appendChild(content);
        inner.appendChild(dropdownContainer);

        // Toggle action
        toggle.addEventListener('click', function () {
          var isOpen = dropdownContainer.classList.contains('active');
          if (isOpen) {
            dropdownContainer.classList.remove('active');
            content.style.maxHeight = null;
          } else {
            dropdownContainer.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        });
      } else if (item.tagName === 'A') {
        var clone = document.createElement('a');
        clone.className = item.classList.contains('btn') ? 'nav-overlay-link btn-mobile' : 'nav-overlay-link';
        clone.textContent = item.textContent.trim();
        clone.href = item.href || '#';
        if (item.classList.contains('btn')) {
          clone.style.color = 'var(--color-primary)';
        }
        clone.addEventListener('click', close);
        inner.appendChild(clone);
      }
    });

    function open() {
      hamburger.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      hamburger.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      
      var dropdownContainer = inner.querySelector('.mobile-dropdown-container');
      var content = inner.querySelector('.mobile-dropdown-content');
      if (dropdownContainer && content) {
        dropdownContainer.classList.remove('active');
        content.style.maxHeight = null;
      }
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
    // Collect all potential animatable cards and containers
    var selector = '.animate-on-observe, .premium-card-white, .premium-grid-3 > div, .premium-grid-5 > div, .comparison-table-wrapper';
    var rawTargets = document.querySelectorAll(selector);
    var targets = [];

    for (var i = 0; i < rawTargets.length; i++) {
      var el = rawTargets[i];
      // Exclude layouts or components that might be nested helper divs
      if (el.classList.contains('premium-grid-3') || el.classList.contains('premium-grid-5')) continue;

      if (!el.classList.contains('animate-on-observe')) {
        el.classList.add('animate-on-observe');
      }
      targets.push(el);
    }

    if (!targets.length || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    /* Assign directional reveal variants for visual variety */
    var revealClasses = ['reveal-left', 'reveal-right', 'reveal-scale', 'reveal-rotate'];
    var revealIndex = 0;
    targets.forEach(function (el) {
      /* Don't override if it already has a reveal class */
      var hasReveal = revealClasses.some(function(c) { return el.classList.contains(c); });
      if (!hasReveal) {
        /* Alternate directions for natural variety */
        el.classList.add(revealClasses[revealIndex % revealClasses.length]);
        revealIndex++;
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

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
    }, { threshold: 0.1 });

    els.forEach(function (el) { observer.observe(el); });

    function animate(el) {
      var target = parseFloat(el.getAttribute('data-count-target'));
      var suffix = el.getAttribute('data-count-suffix') || '';
      var prefix = el.getAttribute('data-count-prefix') || '';
      
      // Snappier duration for small values to prevent long periods showing 0
      var defaultDuration = target <= 5 ? 600 : 1600;
      var duration = parseInt(el.getAttribute('data-count-duration')) || defaultDuration;
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
        el.textContent = prefix + Math.round(current) + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = prefix + target + suffix;
          onCountComplete(el);
        }
      }

      requestAnimationFrame(step);
    }

    /* After count finishes, add glow effect */
    function onCountComplete(el) {
      el.classList.add('counted-glow');
      var trustItem = el.closest('.trust-item');
      if (trustItem) {
        trustItem.classList.add('is-counted');
      }
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
     14. TEXT HIGHLIGHT SYSTEM — Key Phrase Animation
     ═══════════════════════════════════════════ */
  function initTextHighlights() {
    var highlightConfig = [
      /* Hero */
      { selector: '.hero-subtitle', phrases: ['neurociencia, IA y validación en terreno', 'realmente hace, piensa y siente', 'cerrar la brecha entre la junta directiva y el punto de compra', 'ojos neutrales en el anaquel', 'sensibilidad y el precio óptimo', 'métodos cualitativos tradicionales', 'neurociencia y biometría aplicada', 'decisiones de alto nivel con certidumbre', 'diseño de servicios y optimización', 'reducir el riesgo de sus lanzamientos'] },
      /* Problem section */
      { selector: '.problem-section .section-header p, .problem-section p', phrases: ['un error de posicionamiento', 'capital irrecuperable', 'juez y parte', 'conflicto de intereses implícito', 'subsidiar la ineficiencia', 'recolectando evidencia física innegable', 'sensibilidad al precio', 'elasticidad de la demanda', 'dinámicas de consumo locales', 'sesgos racionales del consumidor'] },
      /* Modern quote */
      { selector: '.modern-quote p:first-child', phrases: ['evidencia correcta'] },
      { selector: '.modern-quote p:last-child', phrases: ['calidad de la inteligencia'] },
      /* Offer section */
      { selector: '.offer-final-statement', phrases: ['ahorro de tiempo directivo', 'reducción de riesgo', 'tranquilidad de decidir'] },
      /* Why Us */
      { selector: '.feature:nth-child(1) p', phrases: ['lo que realmente determina'] },
      { selector: '.feature:nth-child(2) p', phrases: ['señales que los métodos tradicionales nunca detectan'] },
      { selector: '.feature:nth-child(3) p', phrases: ['proteger sus resultados financieros'] },
      /* CTA */
      { selector: '.cta-content-v2 h2', phrases: ['Deciden con inteligencia', 'Retome el control del canal', 'Valide científicamente su elasticidad'] },
      { selector: '.cta-subtitle', phrases: ['3 ideas de aplicación inmediata', 'sesión de mapeo estratégico', 'sesión de diagnóstico estratégico'] },
      /* Testimonial & general callouts */
      { selector: '.testimonial-card p:first-of-type, .premium-card-white p', phrases: ['precio 18% mayor sin perder volumen', 'estructura de margen', 'trazabilidad georreferenciada'] },
    ];

    highlightConfig.forEach(function (config) {
      var elements = document.querySelectorAll(config.selector);
      elements.forEach(function (el) {
        config.phrases.forEach(function (phrase) {
          var regex = new RegExp('(' + phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
          if (el.innerHTML.indexOf('text-highlight-mark') === -1 && regex.test(el.textContent)) {
            el.innerHTML = el.innerHTML.replace(regex, '<span class="text-highlight-mark">$1</span>');
          }
        });
      });
    });

    /* Animate highlights on scroll entry */
    var marks = document.querySelectorAll('.text-highlight-mark');
    if (!marks.length || !('IntersectionObserver' in window)) return;

    var highlightObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          highlightObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -100px 0px' });

    marks.forEach(function (mark) {
      highlightObserver.observe(mark);
    });
  }

  /* ═══════════════════════════════════════════
     15. HERO TEXT REVEAL — Cinematic Line-by-Line
     ═══════════════════════════════════════════ */
  function initHeroTextReveal() {
    var heroTitles = document.querySelectorAll('.hero-content h1, .hero-title');
    heroTitles.forEach(function (heroH1) {
      if (heroH1.querySelector('.hero-line')) return; // Avoid double processing

      var text = heroH1.textContent.trim();
      /* Split by colon or period for natural line breaks */
      var parts = text.split(/(?<=[:.]\s?)/);
      if (parts.length < 2) {
        /* Fallback: split roughly in half */
        var words = text.split(' ');
        if (words.length > 3) {
          var mid = Math.ceil(words.length / 2);
          parts = [words.slice(0, mid).join(' ') + ' ', words.slice(mid).join(' ')];
        } else {
          parts = [text];
        }
      }

      heroH1.innerHTML = '';
      parts.forEach(function (part) {
        var span = document.createElement('span');
        span.className = 'hero-line';
        span.textContent = part;
        heroH1.appendChild(span);
      });
    });
  }

  /* ═══════════════════════════════════════════
     16. WHY US BAR — Scroll-Driven Growth
     ═══════════════════════════════════════════ */
  function initWhyUsBar() {
    var bar = document.querySelector('.why-visual-bar');
    if (!bar || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          bar.classList.add('is-growing');
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(bar);
  }

  /* ═══════════════════════════════════════════
     17. SECTION PARALLAX — Subtle Depth on Scroll
     ═══════════════════════════════════════════ */
  function initSectionParallax() {
    /* Apply subtle parallax to hero visual and other visual elements */
    var heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual || window.matchMedia('(pointer: coarse)').matches) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          ticking = false;
          var scrollY = window.scrollY;
          var windowH = window.innerHeight;
          /* Only parallax while hero is visible */
          if (scrollY < windowH * 1.5) {
            var translateY = scrollY * 0.08;
            heroVisual.style.transform = 'translateY(' + translateY + 'px)';
          }
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════
     BOOT
     ═══════════════════════════════════════════ */
  function boot() {
    initNeuralCanvas();
    initMobileHeroCanvas();
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
    initTextHighlights();
    initHeroTextReveal();
    initWhyUsBar();
    initSectionParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
