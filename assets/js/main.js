document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     Theme Toggle (Light Default / Dark Toggle)
     ========================================================================== */
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  // Check for saved theme preference (Fresh Light is default for VERDURE Bowl Cafe)
  const savedTheme = localStorage.getItem('verdure_theme');
  
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcons('dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcons('light');
  }
  
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('verdure_theme', newTheme);
      updateThemeIcons(newTheme);
    });
  });
  
  function updateThemeIcons(theme) {
    themeToggles.forEach(toggle => {
      const icon = toggle.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'ph ph-sun';
        } else {
          icon.className = 'ph ph-moon';
        }
      }
    });
  }

  /* ==========================================================================
     RTL Toggle
     ========================================================================== */
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  const htmlTag = document.documentElement;
  
  // Check saved RTL state
  const savedRTL = localStorage.getItem('campusly_rtl');
  if (savedRTL === 'true') {
    htmlTag.setAttribute('dir', 'rtl');
    document.body.classList.add('rtl');
  }
  
  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isRTL = htmlTag.getAttribute('dir') === 'rtl';
      if (isRTL) {
        htmlTag.removeAttribute('dir');
        document.body.classList.remove('rtl');
        localStorage.setItem('campusly_rtl', 'false');
      } else {
        htmlTag.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl');
        localStorage.setItem('campusly_rtl', 'true');
      }
    });
  });

  /* ==========================================================================
     Mobile Navigation Drawer
     ========================================================================== */
  const hamburger = document.querySelector('.hamburger');
  const navDrawer = document.querySelector('.nav-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const drawerClose = document.querySelector('.drawer-close');
  
  function openDrawer() {
    if (navDrawer) navDrawer.classList.add('open');
    if (drawerOverlay) drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  
  function closeDrawer() {
    if (navDrawer) navDrawer.classList.remove('open');
    if (drawerOverlay) drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  if (hamburger) hamburger.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  /* ==========================================================================
     Form Validation
     ========================================================================== */
  const forms = document.querySelectorAll('.validate-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      
      inputs.forEach(input => {
        // Reset state
        input.classList.remove('error', 'success');
        const container = input.closest('.password-input-wrap') || input;
        const errorMsg = container.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('form-error-msg')) {
          errorMsg.style.display = 'none';
        }
        
        // Validation logic
        if (!input.value.trim()) {
          showError(input, 'This field is required');
          isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          showError(input, 'Please enter a valid email');
          isValid = false;
        } else if (input.type === 'password' && input.value.length < 8) {
          showError(input, 'Password must be at least 8 characters');
          isValid = false;
        } else if (input.name === 'confirm_password') {
          const pwd = form.querySelector('input[name="password"]');
          if (pwd && input.value !== pwd.value) {
            showError(input, 'Passwords do not match');
            isValid = false;
          }
        } else if (input.type === 'checkbox' && !input.checked) {
          showError(input, 'You must accept the terms');
          isValid = false;
        } else {
          input.classList.add('success');
        }
      });
      
      if (isValid) {
        // Show success state (mocking submission)
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Success!';
        btn.style.backgroundColor = 'var(--success)';
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.backgroundColor = '';
          form.reset();
          inputs.forEach(i => i.classList.remove('success'));
        }, 3000);
      }
    });
  });
  
  function showError(input, message) {
    input.classList.add('error');
    const container = input.closest('.password-input-wrap') || input;
    const errorMsg = container.nextElementSibling;
    if (errorMsg && errorMsg.classList.contains('form-error-msg')) {
      errorMsg.textContent = message;
      errorMsg.style.display = 'block';
    } else {
      // Create error msg if it doesn't exist
      const msg = document.createElement('span');
      msg.className = 'form-error-msg';
      msg.textContent = message;
      msg.style.display = 'block';
      container.parentNode.insertBefore(msg, container.nextSibling);
    }
  }
  
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /* ==========================================================================
     Password Visibility Toggle
     ========================================================================== */
  const passwordToggles = document.querySelectorAll('.password-toggle');
  passwordToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const wrap = btn.closest('.password-input-wrap');
      if (!wrap) return;
      const input = wrap.querySelector('input');
      if (!input) return;
      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isPassword ? 'ph ph-eye-slash' : 'ph ph-eye';
      }
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });

  /* ==========================================================================
     Back To Top Button
     ========================================================================== */
  function initBackToTop() {
    let btn = document.getElementById('back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'back-to-top';
      btn.className = 'back-to-top';
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-label', 'Back to top');
      btn.setAttribute('title', 'Back to top');
      btn.innerHTML = '<i class="ph-bold ph-arrow-up"></i>';
      document.body.appendChild(btn);
    }

    let ticking = false;
    const toggleVisible = () => {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(toggleVisible);
        ticking = true;
      }
    }, { passive: true });

    toggleVisible();

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  initBackToTop();

});

/* ==========================================================================
   Premium UI layer: scroll reveal, sticky nav, counters, interactive modules
   ========================================================================== */
(function () {
  'use strict';

  // Flag JS availability so CSS can switch fade-ups to scroll-triggered reveals
  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.animate-fade-up');
    if (!items.length) return;

    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Navbar scroll state ---------- */
  function initNavbar() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    var ticking = false;
    function apply() {
      navbar.classList.toggle('scrolled', window.scrollY > 24);
      ticking = false;
    }
    apply();
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(apply);
      }
    }, { passive: true });
  }

  /* ---------- Animated stat counters ---------- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);

      if (reduceMotion) {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
        return;
      }

      var duration = 1500;
      var start = null;

      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(run);
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { obs.observe(el); });
  }

  onReady(function () {
    initReveal();
    initNavbar();
    initCounters();
  });
})();

/* ==========================================================================
   Interactive: Admissions Readiness Scorecard (index.html)
   ========================================================================== */
(function () {
  'use strict';

  function init() {
    var root = document.getElementById('scorecard');
    if (!root) return;

    var dial = root.querySelector('.dial-value');
    var numberEl = root.querySelector('.dial-number');
    var tierEl = root.querySelector('.score-tier');
    var noteEl = root.querySelector('.score-note');
    var resetBtn = root.querySelector('.quiz-reset');
    var steps = Array.prototype.slice.call(root.querySelectorAll('.quiz-step'));

    var CIRC = 2 * Math.PI * 82; // r = 82 in the markup
    if (dial) {
      dial.setAttribute('stroke-dasharray', CIRC);
      dial.setAttribute('stroke-dashoffset', CIRC);
    }

    var tiers = [
      {
        min: 0,
        label: 'Select your bowl layers',
        note: 'Pick your favorite base, protein, and toppings to calculate your personalized macro balance and bowl style.'
      },
      {
        min: 1,
        label: 'Crisp Garden Refresh',
        note: 'Light, hydrating, and micronutrient-dense. We recommend pairing your crisp greens with Lemon Herb Vinaigrette and our 3-Bowl Starter Plan.'
      },
      {
        min: 45,
        label: 'Balanced Harvest Bowl',
        note: 'Ideal harmony of complex sprouted grains, clean protein, and prebiotic fiber. Perfect for sustained midday energy without an afternoon crash.'
      },
      {
        min: 65,
        label: 'High-Protein Fuel Bowl',
        note: 'Packed with 38g–45g of bioavailable protein and slow-burning carbohydrates. Recommended for active training days and our 5-Bowl Workweek Plan.'
      },
      {
        min: 82,
        label: 'Ultimate Superfood Powerhouse',
        note: 'Maximum nutrient density, omega-3 healthy fats, and double harvest crunch. Best paired with our Performance Plus weekly subscription.'
      }
    ];

    function tierFor(score) {
      var chosen = tiers[0];
      tiers.forEach(function (t) { if (score >= t.min) chosen = t; });
      return chosen;
    }

    function readScore() {
      var total = 0;
      var answered = 0;
      var breakdown = {};

      steps.forEach(function (step) {
        var selected = step.querySelector('.chip.selected');
        var key = step.getAttribute('data-metric');
        var weight = parseFloat(step.getAttribute('data-weight') || '20');
        if (selected) {
          answered++;
          var v = parseFloat(selected.getAttribute('data-value')); // 0..1
          total += v * weight;
          breakdown[key] = v;
        } else {
          breakdown[key] = 0;
        }
      });

      return { score: Math.round(total), answered: answered, breakdown: breakdown };
    }

    function render() {
      var result = readScore();
      var score = result.score;

      if (dial) {
        dial.setAttribute('stroke-dashoffset', CIRC - (CIRC * score) / 100);
      }

      if (numberEl) {
        var from = parseInt(numberEl.textContent, 10) || 0;
        animateNumber(numberEl, from, score);
      }

      var tier = result.answered === 0 ? tiers[0] : tierFor(score);
      if (tierEl) tierEl.textContent = tier.label;
      if (noteEl) noteEl.textContent = tier.note;

      // Sub-metric bars
      root.querySelectorAll('[data-bar]').forEach(function (bar) {
        var key = bar.getAttribute('data-bar');
        var pct = Math.round((result.breakdown[key] || 0) * 100);
        var fill = bar.querySelector('i');
        var label = bar.querySelector('[data-bar-value]');
        if (fill) fill.style.width = pct + '%';
        if (label) label.textContent = pct + '%';
      });
    }

    function animateNumber(el, from, to) {
      var duration = 600;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(from + (to - from) * eased);
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    root.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var row = chip.closest('.chip-row');
        if (row) {
          row.querySelectorAll('.chip').forEach(function (c) {
            c.classList.remove('selected');
            c.setAttribute('aria-pressed', 'false');
          });
        }
        chip.classList.add('selected');
        chip.setAttribute('aria-pressed', 'true');
        render();
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        root.querySelectorAll('.chip').forEach(function (c) {
          c.classList.remove('selected');
          c.setAttribute('aria-pressed', 'false');
        });
        render();
      });
    }

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ==========================================================================
   Interactive: Application Timeline Explorer (home2.html)
   ========================================================================== */
(function () {
  'use strict';

  var PHASES = [
    {
      id: 'harvest',
      tab: 'Step 01',
      tag: 'Step 01 - Dawn Farm Harvest',
      title: 'Organic produce harvested within 120 miles and delivered at dawn',
      copy: 'Every morning at 5:00 AM, our culinary team receives crates of sun-ripened heirloom vegetables, hydroponic baby greens, and fragrant culinary herbs straight from partner family farms.',
      items: [
        ['100% Certified Organic', 'Zero synthetic pesticides, waxes, or chemical preservatives on any leaf.'],
        ['Peak-ripeness picking', 'Produce is harvested 24 hours before it hits your bowl for maximum vitamin retention.'],
        ['Triple-washed in filtered water', 'Gently chilled and spun crisp so every bite snaps with garden freshness.']
      ],
      stat: ['120 Miles', 'maximum farm-to-kitchen harvest radius']
    },
    {
      id: 'bases',
      tab: 'Step 02',
      tag: 'Step 02 - Greens & Grain Bases',
      title: 'Nutrient-dense leafy greens and warm sprouted ancient grains',
      copy: 'Build your bowl on a foundation of massaged Tuscan baby kale, peppery wild arugula, steaming sprouted tri-color quinoa, organic farro, or forbidden black heirloom rice.',
      items: [
        ['Sprouted ancient grains', 'Soaked and steam-cooked in vegetable herb broth for superior digestibility.'],
        ['Half-and-half flexibility', 'Combine crisp cold greens with warm hearty grains at no extra charge.'],
        ['Low-carb alternatives', 'Swap any grain for golden turmeric-roasted cauliflower rice.']
      ],
      stat: ['12g+ Fiber', 'of prebiotic plant fiber in every bowl base']
    },
    {
      id: 'proteins',
      tab: 'Step 03',
      tag: 'Step 03 - Clean Proteins',
      title: 'Pasture-raised poultry, wild-caught seafood, and sprouted plant proteins',
      copy: 'Our proteins are marinated in cold-pressed olive oil, fresh citrus zest, and crushed herbs, then seared over open-flame char grills to lock in tenderness and flavor.',
      items: [
        ['Humanely raised & wild-caught', 'Antibiotic-free rosemary chicken, wild Alaskan salmon, and grass-fed sirloin.'],
        ['Artisan plant proteins', 'Organic maple-tamari glazed tofu and oven-baked pistachio-herb chickpea falafel.'],
        ['Verified macro portions', 'Every serving delivers 24g to 45g of complete, bioavailable protein.']
      ],
      stat: ['42g Protein', 'average clean protein in performance bowls']
    },
    {
      id: 'toppings',
      tab: 'Step 04',
      tag: 'Step 04 - Superfood Crunch',
      title: 'Layered textures, fermented pickles, and omega-rich superseeds',
      copy: 'We balance creamy, tangy, and crunchy elements in every bowl—from Hass avocado and whipped sheep feta to house-pickled daikon, toasted pepitas, and hemp hearts.',
      items: [
        ['Gut-friendly ferments', 'House-pickled red onions, ginger, and kimchi to nourish microbiome diversity.'],
        ['Roasted seasonal roots', 'Caramelized sweet potatoes, charred broccoli florets, and heirloom beets.'],
        ['Superseed boosters', 'Toasted pumpkin seeds, chia, hemp hearts, and crispy spiced chickpeas.']
      ],
      stat: ['30+ Plants', 'available to diversify your weekly gut microbiome']
    },
    {
      id: 'dressings',
      tab: 'Step 05',
      tag: 'Step 05 - Cold-Pressed Dressings',
      title: 'Small-batch botanical dressings blended fresh every morning',
      copy: 'We never use refined seed oils, gums, or cane sugar. Every vinaigrette, tahini, and cashew crema is emulsified in-house with cold-pressed extra-virgin olive and avocado oils.',
      items: [
        ['Zero industrial seed oils', '100% cold-pressed extra-virgin olive oil, avocado oil, and raw sesame oil.'],
        ['Whole-food emulsifiers', 'Creaminess comes from organic stone-ground tahini, soaked cashews, and avocado.'],
        ['Custom toss or side cup', 'Tossed light, medium, or packed separately for 4-day meal plan freshness.']
      ],
      stat: ['99.4%', 'subscriber satisfaction & flavor rating']
    }
  ];

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function init() {
    var root = document.getElementById('timeline-explorer');
    if (!root) return;

    var tabsWrap = root.querySelector('.tl-tabs');
    var panel = root.querySelector('.tl-panel');
    var progress = root.querySelector('.tl-progress i');
    if (!tabsWrap || !panel) return;

    // Build tabs
    PHASES.forEach(function (phase, i) {
      var btn = document.createElement('button');
      btn.className = 'tl-tab' + (i === 0 ? ' active' : '');
      btn.textContent = phase.tab;
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.addEventListener('click', function () { select(i); });
      tabsWrap.appendChild(btn);
    });

    function select(index) {
      var phase = PHASES[index];

      tabsWrap.querySelectorAll('.tl-tab').forEach(function (t, i) {
        t.classList.toggle('active', i === index);
        t.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });

      if (progress) {
        progress.style.width = ((index + 1) / PHASES.length) * 100 + '%';
      }

      var itemsHtml = phase.items.map(function (item) {
        return '<div class="tl-item">' +
          '<i class="ph-fill ph-check-circle mark"></i>' +
          '<p><strong>' + esc(item[0]) + '</strong>' + esc(item[1]) + '</p>' +
          '</div>';
      }).join('');

      panel.innerHTML =
        '<div>' +
          '<span class="tl-phase-tag">' + esc(phase.tag) + '</span>' +
          '<h3>' + esc(phase.title) + '</h3>' +
          '<p style="color: var(--text-muted);">' + esc(phase.copy) + '</p>' +
          '<div class="stat-item" style="text-align: start; padding: 0; margin-top: var(--spacing-4);">' +
            '<div class="stat-value" style="font-size: 2.4rem;"><bdi dir="ltr">' + esc(phase.stat[0]) + '</bdi></div>' +
            '<div class="stat-label" style="letter-spacing: 0.06em;">' + esc(phase.stat[1]) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="tl-list">' + itemsHtml + '</div>';

      panel.classList.remove('swap');
      void panel.offsetWidth; // restart the entrance animation
      panel.classList.add('swap');
    }

    select(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ==========================================================================
   Interactive: FAQ Accordion (contact.html)
   ========================================================================== */
(function () {
  'use strict';

  function init() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    function close(item) {
      var panel = item.querySelector('.faq-a');
      var btn = item.querySelector('.faq-q');
      if (!panel || !item.classList.contains('open')) return;
      panel.style.height = panel.scrollHeight + 'px';
      void panel.offsetHeight; // lock the current height before collapsing
      panel.style.height = '0px';
      item.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }

    function open(item) {
      var panel = item.querySelector('.faq-a');
      var btn = item.querySelector('.faq-q');
      if (!panel) return;
      panel.style.height = panel.scrollHeight + 'px';
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }

    items.forEach(function (item) {
      var btn = item.querySelector('.faq-q');
      var panel = item.querySelector('.faq-a');
      if (!btn || !panel) return;

      // Let an open panel grow with its content once the transition settles.
      panel.addEventListener('transitionend', function (e) {
        if (e.propertyName === 'height' && item.classList.contains('open')) {
          panel.style.height = 'auto';
        }
      });

      btn.addEventListener('click', function () {
        if (item.classList.contains('open')) {
          close(item);
          return;
        }
        items.forEach(close); // one answer open at a time
        open(item);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
