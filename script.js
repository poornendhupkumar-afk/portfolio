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

// Node-graph canvas — subtle drifting nodes connected by lines, behind the profile photo
const nodeCanvas = document.getElementById('nodeGraph');
const prefersReducedMotionForGraph = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (nodeCanvas) {
  const ctx = nodeCanvas.getContext('2d');
  let nodes = [];
  let width = 0;
  let height = 0;
  let animId = null;

  function resize() {
    const rect = nodeCanvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    nodeCanvas.width = width * window.devicePixelRatio;
    nodeCanvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function makeNodes() {
    const count = Math.max(10, Math.floor((width * height) / 9000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 1.5 + Math.random() * 1.5
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });

    const maxDist = Math.min(width, height) * 0.28;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.35;
          ctx.strokeStyle = `rgba(217, 146, 62, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(217, 146, 62, 0.55)';
      ctx.fill();
    });

    animId = requestAnimationFrame(step);
  }

  function init() {
    resize();
    makeNodes();
    if (animId) cancelAnimationFrame(animId);
    if (!prefersReducedMotionForGraph) {
      step();
    } else {
      // Draw a single static frame for reduced-motion users
      step();
      cancelAnimationFrame(animId);
    }
  }

  init();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });
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