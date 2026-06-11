// ── NAVBAR: SHADOW + RESUME BUTTON REVEAL + BACK TO TOP ──
const navbar      = document.getElementById('navbar');
const heroSection = document.getElementById('hero');
const backToTop   = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollY  = window.scrollY;
  const pastHero = scrollY > heroSection.offsetHeight * 0.75;
  navbar.classList.toggle('scrolled', scrollY > 10);
  navbar.classList.toggle('past-hero', pastHero);
  backToTop.classList.toggle('visible', scrollY > 400);
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── NAVBAR: ACTIVE LINK HIGHLIGHT ──
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

const updateActiveLink = () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
};
window.addEventListener('scroll', updateActiveLink, { passive: true });

// ── NAVBAR: SMOOTH SCROLL ──
navLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      navLinksList.classList.remove('open');
    }
  });
});

// ── MOBILE MENU TOGGLE ──
const navToggle  = document.getElementById('navToggle');
const navLinksList = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinksList.classList.toggle('open');
});

// ── TYPEWRITER EFFECT ──
const roles = ['Game Developer.', 'Graphic Designer.', 'UI/UX Designer.'];
const typewriterEl = document.getElementById('typewriter');
let roleIndex = 0, charIndex = 0, isDeleting = false;

const type = () => {
  const current = roles[roleIndex];
  typewriterEl.textContent = isDeleting
    ? current.slice(0, charIndex - 1)
    : current.slice(0, charIndex + 1);
  isDeleting ? charIndex-- : charIndex++;

  if (!isDeleting && charIndex === current.length) {
    isDeleting = true;
    setTimeout(type, 1900);
    return;
  }
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }
  setTimeout(type, isDeleting ? 58 : 100);
};
type();

// ── SCROLL REVEAL — EVERYTHING ──

// ① Groups whose direct children stagger one after another
const staggerGroups = [
  { selector: '.hero-content',  delay: 90  },
  { selector: '.about-facts',   delay: 80  },
  { selector: '.skills-grid',   delay: 80  },
  { selector: '.game-grid',     delay: 90  },
  { selector: '.design-grid',   delay: 75  },
  { selector: '.uiux-grid',     delay: 75  },
  { selector: '.contact-cards', delay: 80  },
];

staggerGroups.forEach(({ selector, delay }) => {
  const group = document.querySelector(selector);
  if (!group) return;
  [...group.children].forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * delay}ms`;
  });
});

// ② Individual elements that animate on their own (no stagger)
const soloSelectors = [
  '.section-label',
  '.section-title',
  '.section-subtitle',
  '.about-text p',
  '.about-text > div',   // button row inside about
  '.contact-desc',
  '.hero-scroll-hint',
  '#footer p',
];

document.querySelectorAll(soloSelectors.join(', ')).forEach(el => {
  if (!el.classList.contains('reveal')) el.classList.add('reveal');
});

// ③ Observe every .reveal on the page
const revealObserver = new IntersectionObserver(entries => {
  // Group same-callback entries by parent so sibling cards
  // that scroll in together stay in sync.
  const groups = new Map();
  entries.filter(e => e.isIntersecting).forEach(entry => {
    const key = entry.target.parentElement || document.body;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry.target);
  });

  groups.forEach(els => {
    els.forEach((el, i) => {
      // Only override delay for non-hero, non-pre-staggered elements
      if (!el.style.transitionDelay) {
        el.style.transitionDelay = `${i * 60}ms`;
      }
      el.classList.add('visible');
      revealObserver.unobserve(el);
    });
  });
}, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── RESUME MODAL ──
const resumeModal   = document.getElementById('resumeModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose    = document.getElementById('modalClose');

const openResumeTriggers = [
  document.getElementById('openResumeNav'),
  document.getElementById('openResumeHero'),
  document.getElementById('openResumeAbout'),
];

const openModal = () => {
  resumeModal.classList.add('open');
  document.body.style.overflow = 'hidden'; // prevent background scroll
};

const closeModal = () => {
  resumeModal.classList.remove('open');
  document.body.style.overflow = '';
};

openResumeTriggers.forEach(btn => {
  if (btn) btn.addEventListener('click', openModal);
});

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && resumeModal.classList.contains('open')) {
    closeModal();
  }
});