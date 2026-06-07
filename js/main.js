/* ============================================================
   SHIWAM KUMAR — DATA ANALYST PORTFOLIO
   Main JavaScript: Animations, Interactions, Form Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ── Initialize all modules ──
  initParticles();
  initTypingEffect();
  initScrollReveal();
  initNavbar();
  initCounters();
  initSkillBars();
  initContactForm();
  initChartAnimation();
});

/* ============================================================
   1. PARTICLE BACKGROUND (Hero Canvas)
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  const PARTICLE_COUNT = 60;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    const colors = [
      'rgba(184, 79, 230, ',   // purple
      'rgba(0, 212, 168, ',    // teal
      'rgba(224, 64, 208, ',   // pink
    ];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.1,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulseOffset: Math.random() * Math.PI * 2,
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticle(p, time) {
    const pulseFactor = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.3 + 0.7;
    const alpha = p.opacity * pulseFactor;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color + alpha + ')';
    ctx.fill();
  }

  function drawConnections(time) {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(184, 79, 230, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      drawParticle(p, time * 0.001);
    });

    drawConnections(time * 0.001);
    animationId = requestAnimationFrame(animate);
  }

  init();
  animationId = requestAnimationFrame(animate);

  window.addEventListener('resize', () => {
    resize();
  });
}

/* ============================================================
   2. TYPING EFFECT
   ============================================================ */
function initTypingEffect() {
  const element = document.getElementById('typed-text');
  if (!element) return;

  const roles = [
    'Data Analyst',
    'BI Developer',
    'Python Enthusiast',
    'Dashboard Designer',
    'SQL Expert',
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const currentRole = roles[roleIndex];

    if (isPaused) {
      isPaused = false;
      isDeleting = true;
      setTimeout(type, 800);
      return;
    }

    if (!isDeleting) {
      // Typing
      element.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentRole.length) {
        isPaused = true;
        setTimeout(type, 2000); // Pause at end
        return;
      }

      setTimeout(type, 80 + Math.random() * 40);
    } else {
      // Deleting
      element.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }

      setTimeout(type, 40);
    }
  }

  // Start after a short delay
  setTimeout(type, 1000);
}

/* ============================================================
   3. SCROLL REVEAL ANIMATIONS
   ============================================================ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Don't unobserve — keeps it simple
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  });

  reveals.forEach(el => observer.observe(el));
}

/* ============================================================
   4. NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');
  const navAnchors = document.querySelectorAll('[data-nav]');

  if (!navbar) return;

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    updateActiveNavLink();
    lastScroll = scrollY;
  }, { passive: true });

  // Hamburger toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Close mobile menu on link click
  navAnchors.forEach(anchor => {
    anchor.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Active nav link based on scroll position
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navAnchors.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  // Smooth scroll for all anchor links (with offset for fixed nav)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetEl.offsetTop - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ============================================================
   5. ANIMATED COUNTERS
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    counters.forEach(counter => {
      counter.textContent = counter.dataset.count + '+';
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = current + '+';

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }
}

/* ============================================================
   6. SKILL BAR ANIMATIONS
   ============================================================ */
function initSkillBars() {
  const chips = document.querySelectorAll('.skill-chip');
  if (!chips.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    chips.forEach(chip => chip.classList.add('animate'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger the animation
        const chips = entry.target.querySelectorAll('.skill-chip');
        chips.forEach((chip, i) => {
          setTimeout(() => {
            chip.classList.add('animate');
          }, i * 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  // Observe skill category containers
  document.querySelectorAll('.skill-category').forEach(cat => {
    observer.observe(cat);
  });
}

/* ============================================================
   7. CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check honeypot
    const honeypot = form.querySelector('[name="_gotcha"]');
    if (honeypot && honeypot.value) return;

    // Validate
    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const message = document.getElementById('contact-message');
    let isValid = true;

    // Reset errors
    [name, email, message].forEach(field => {
      field.classList.remove('error');
      field.nextElementSibling.classList.remove('visible');
    });

    if (!name.value.trim()) {
      name.classList.add('error');
      document.getElementById('name-error').classList.add('visible');
      isValid = false;
    }

    if (!email.value.trim() || !isValidEmail(email.value)) {
      email.classList.add('error');
      document.getElementById('email-error').classList.add('visible');
      isValid = false;
    }

    if (!message.value.trim()) {
      message.classList.add('error');
      document.getElementById('message-error').classList.add('visible');
      isValid = false;
    }

    if (!isValid) return;

    // Submit
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
        <circle cx="12" cy="12" r="10" stroke-dasharray="30 60"/>
      </svg>
      Sending...
    `;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        showToast('Message sent successfully! I\'ll get back to you soon. 🎉', 'success');
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      showToast('Oops! Something went wrong. Please try again or email me directly.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
        Send Message
      `;
    }
  });

  // Live validation - remove error on input
  ['contact-name', 'contact-email', 'contact-message'].forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        if (field.nextElementSibling) {
          field.nextElementSibling.classList.remove('visible');
        }
      });
    }
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/* ============================================================
   8. TOAST NOTIFICATIONS
   ============================================================ */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✅' : '❌'}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

/* ============================================================
   9. HERO CHART ANIMATION
   ============================================================ */
function initChartAnimation() {
  const chartWrapper = document.getElementById('hero-chart-bars');
  if (!chartWrapper) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Set bars to full height immediately
    chartWrapper.querySelectorAll('.chart-bar').forEach(bar => {
      const h = parseInt(bar.dataset.height, 10) || 50;
      bar.style.height = Math.round((h / 100) * 160) + 'px';
    });
    return;
  }

  // Grow bars from 0 to their data-height with staggered delays
  // Container is 190px total: 160px bars + 30px labels
  const BAR_MAX_PX = 160;

  function growBars(stagger = 0) {
    const bars = chartWrapper.querySelectorAll('.chart-bar');
    bars.forEach((bar, i) => {
      const targetPct = parseInt(bar.dataset.height, 10) || 50;
      const targetPx = Math.round((targetPct / 100) * BAR_MAX_PX);
      bar.style.height = '0px';
      setTimeout(() => {
        bar.style.transition = `height 1.2s cubic-bezier(0.16, 1, 0.3, 1)`;
        bar.style.height = targetPx + 'px';
      }, stagger + i * 60);
    });
  }

  // Trigger on first paint (hero is visible immediately)
  setTimeout(() => growBars(300), 100);

  // Periodic subtle breathing animation
  setInterval(() => {
    const bars = chartWrapper.querySelectorAll('.chart-bar');
    bars.forEach((bar, i) => {
      const base = parseInt(bar.dataset.height, 10) || 50;
      const variation = (Math.random() - 0.5) * 12;
      const newPct = Math.max(10, Math.min(90, base + variation));
      const newPx = Math.round((newPct / 100) * BAR_MAX_PX);
      bar.style.transition = `height 1.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 40}ms`;
      bar.style.height = newPx + 'px';
    });
  }, 4000);
}

/* ============================================================
   10. SPINNER CSS (injected for form loading state)
   ============================================================ */
(function injectSpinnerStyle() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .spin {
      animation: spin 1s linear infinite;
    }
  `;
  document.head.appendChild(style);
})();
