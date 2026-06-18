// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

if (navToggle && navMobile) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close mobile nav when a link is clicked
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Terminal typing effect — cycles through a few real lines about Poornendhu
const typedLineEl = document.getElementById('typedLine');
const prefersReducedMotionForType = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typedLineEl) {
  const lines = [
    'whoami',
    'Poornendhu P Kumar',
    'cat interests.txt',
    'AI/ML, Cybersecurity, Python',
    'status --current',
    'Interning at ZERO2DEV'
  ];

  if (prefersReducedMotionForType) {
    typedLineEl.textContent = lines[1];
  } else {
    let lineIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = lines[lineIndex];

      if (!deleting) {
        charIndex++;
        typedLineEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
        setTimeout(tick, 45);
      } else {
        charIndex--;
        typedLineEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          lineIndex = (lineIndex + 1) % lines.length;
          setTimeout(tick, 300);
          return;
        }
        setTimeout(tick, 22);
      }
    }

    tick();
  }
}

// Reveal sections on scroll (subtle, respects reduced motion)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealEls = document.querySelectorAll('.section, .hero');
  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
}

// Active nav link highlight while scrolling
const sections = document.querySelectorAll('main .section, main .hero');
const navAnchors = document.querySelectorAll('.nav-links a');

if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => {
    if (s.id) navObserver.observe(s);
  });
}