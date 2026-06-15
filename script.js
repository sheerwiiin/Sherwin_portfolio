// ── NAVBAR: SHADOW + RESUME BUTTON REVEAL + BACK TO TOP ──
const navbar = document.getElementById('navbar');
const heroSection = document.getElementById('hero');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
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
const navLinksList = document.querySelector('.nav-links');

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
const navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', () => {
  navLinksList.classList.toggle('open');
});

// ── TYPEWRITER EFFECT ──
const roles = ['UI/UX Designer.', 'Multimedia Artist.', 'Web Developer.', 'Game Developer.'];
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
  { selector: '.hero-content', delay: 90 },
  { selector: '.about-facts', delay: 80 },
  { selector: '.skills-grid', delay: 80 },
  { selector: '.game-grid', delay: 90 },
  { selector: '.design-grid', delay: 75 },
  { selector: '.uiux-grid', delay: 75 },
  { selector: '.multimedia-grid', delay: 80 },
  { selector: '.contact-cards', delay: 80 },
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
  '.about-text > div',
  '.contact-desc',
  '.hero-scroll-hint',
  '#footer p',
];

document.querySelectorAll(soloSelectors.join(', ')).forEach(el => {
  if (!el.classList.contains('reveal')) el.classList.add('reveal');
});

// ③ Observe every .reveal on the page
const revealObserver = new IntersectionObserver(entries => {
  const groups = new Map();
  entries.filter(e => e.isIntersecting).forEach(entry => {
    const key = entry.target.parentElement || document.body;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry.target);
  });

  groups.forEach(els => {
    els.forEach((el, i) => {
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
const resumeModal = document.getElementById('resumeModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');

const openResumeTriggers = [
  document.getElementById('openResumeNav'),
  document.getElementById('openResumeHero'),
  document.getElementById('openResumeAbout'),
];

const openModal = () => {
  resumeModal.classList.add('open');
  document.body.style.overflow = 'hidden';
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

// ── GAME DEVELOPMENT: HOVER PREVIEW + CLICK TO PLAY ──
document.querySelectorAll('.game-card').forEach(card => {
  const thumb = card.querySelector('.game-video-thumb');
  const iframe = card.querySelector('.game-iframe');
  const playBtn = card.querySelector('.game-play-btn');
  if (!thumb || !iframe || !playBtn) return;

  const videoId = thumb.dataset.videoId;
  const videoStart = thumb.dataset.videoStart || '0';
  let hoverIframe = null;
  let hoverTimer = null;

  // Hover: show muted autoplay snippet
  card.addEventListener('mouseenter', () => {
    if (iframe.src) return; // already playing full video
    hoverTimer = setTimeout(() => {
      if (!hoverIframe) {
        hoverIframe = document.createElement('iframe');
        hoverIframe.className = 'game-hover-iframe';
        hoverIframe.allow = 'autoplay';
        hoverIframe.setAttribute('allowfullscreen', '');
        hoverIframe.title = 'Preview';
        thumb.appendChild(hoverIframe);
      }
      hoverIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&start=${videoStart}&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`;
    }, 350);
  });

  card.addEventListener('mouseleave', () => {
    clearTimeout(hoverTimer);
    if (hoverIframe) {
      hoverIframe.src = '';
    }
  });

  // Click play: play from beginning with sound
  playBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    clearTimeout(hoverTimer);
    // Remove hover iframe
    if (hoverIframe) {
      hoverIframe.remove();
      hoverIframe = null;
    }
    // Hide the thumbnail overlay
    thumb.style.opacity = '0';
    thumb.style.pointerEvents = 'none';
    // Load the full iframe
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&start=0&enablejsapi=1&rel=0`;
  });
});

// ── GRAPHIC DESIGN LIGHTBOX ──
const lightboxModal = document.getElementById('lightboxModal');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxSub = document.getElementById('lightboxSub');

const openLightbox = (src, title, sub) => {
  lightboxImg.src = src;
  lightboxTitle.textContent = title || '';
  lightboxSub.textContent = sub || '';
  lightboxModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightboxModal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
};

document.querySelectorAll('.design-card[data-lightbox]').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    openLightbox(
      card.dataset.lightbox,
      card.dataset.lightboxTitle,
      card.dataset.lightboxSub
    );
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);

// ── UI/UX GALLERY PANEL ──
const uiuxGallery = document.getElementById('uiuxGallery');
const galleryBackdrop = document.getElementById('galleryBackdrop');
const galleryClose = document.getElementById('galleryClose');
const galleryBody = document.getElementById('galleryBody');
const galleryCategoryLabel = document.getElementById('galleryCategoryLabel');

// ────────────────────────────────────────────────────
// ADD YOUR UI/UX IMAGES HERE
// Each array holds objects: { src: 'path/to/image.png', label: 'Caption' }
// ────────────────────────────────────────────────────
const uiuxCategories = {
  mobile: {
    label: 'Mobile App Design',
    images: [
      { src: 'assets/Mobile/AVONIC (1).png', label: 'Avonic Mobile App Screen 1' },
      { src: 'assets/Mobile/AVONIC (2).png', label: 'Avonic Mobile App Screen 2' },
      { src: 'assets/Mobile/AVONIC (3).png', label: 'Avonic Mobile App Screen 3' },
      { src: 'assets/Mobile/SPCC.png', label: 'SPCC Mobile App Interface' },
    ],
  },
  web: {
    label: 'Web Interface Design',
    images: [
      { src: 'assets/UI/Clo.png', label: 'Clo Web Platform UI' },
      { src: 'assets/UI/WEB (1).png', label: 'Web Interface Mockup 1' },
      { src: 'assets/UI/WEB (2).png', label: 'Web Interface Mockup 2' },
      { src: 'assets/UI/WEB (3).png', label: 'Web Interface Mockup 3' },
    ],
  },
  dashboard: {
    label: 'Dashboard Design',
    images: [
      { src: 'assets/Dashboard/DASHBOARD (1).png', label: 'Dashboard Overview Screen' },
      { src: 'assets/Dashboard/DASHBOARD (2).png', label: 'Analytics & Graphs View' },
      { src: 'assets/Dashboard/DASHBOARD (3).png', label: 'Data Reports View' },
    ],
  },
  redesign: {
    label: 'UI Redesign',
    images: [
      { src: 'assets/Redesign/OLD.png', label: 'Before Redesign (Old Interface)' },
      { src: 'assets/Redesign/NEW.png', label: 'After Redesign (New Modern Interface)' },
    ],
  },
};

let currentCategory = '';
let currentSlideIndex = 0;

const gallerySliderImg = document.getElementById('gallerySliderImg');
const gallerySlideIndex = document.getElementById('gallerySlideIndex');
const gallerySlideTitle = document.getElementById('gallerySlideTitle');
const gallerySlideDesc = document.getElementById('gallerySlideDesc');
const galleryThumbnails = document.getElementById('galleryThumbnails');
const galleryMain = document.getElementById('galleryMain');
const sliderPrevBtn = document.getElementById('sliderPrevBtn');
const sliderNextBtn = document.getElementById('sliderNextBtn');

const updateSlide = () => {
  const categoryData = uiuxCategories[currentCategory];
  if (!categoryData || !categoryData.images || categoryData.images.length === 0) return;

  const slide = categoryData.images[currentSlideIndex];
  
  // Fade transition on image swap
  gallerySliderImg.style.opacity = '0';
  setTimeout(() => {
    gallerySliderImg.src = slide.src;
    gallerySliderImg.alt = slide.label || 'Design Preview';
    gallerySliderImg.style.opacity = '1';
  }, 150);

  // Set slide text details
  gallerySlideIndex.textContent = `Slide ${currentSlideIndex + 1} of ${categoryData.images.length}`;
  gallerySlideTitle.textContent = slide.label || 'Untitled Screen';
  gallerySlideDesc.innerHTML = `<p>${slide.desc || 'No description placeholder provided. You can modify this in script.js later.'}</p>`;

  // Update Active Thumbnail
  const thumbs = galleryThumbnails.querySelectorAll('.uiux-thumb-item');
  thumbs.forEach((thumb, idx) => {
    thumb.classList.toggle('active', idx === currentSlideIndex);
  });
};

const openGallery = (category) => {
  currentCategory = category;
  currentSlideIndex = 0;
  
  const categoryData = uiuxCategories[category];
  if (!categoryData) return;

  galleryCategoryLabel.textContent = categoryData.label;

  // Clear existing empty state if present
  const oldEmpty = uiuxGallery.querySelector('.gallery-empty');
  if (oldEmpty) oldEmpty.remove();

  if (categoryData.images && categoryData.images.length > 0) {
    galleryMain.style.display = 'flex';
    
    // Render Thumbnails list
    galleryThumbnails.innerHTML = '';
    categoryData.images.forEach((img, index) => {
      const thumb = document.createElement('div');
      thumb.className = `uiux-thumb-item ${index === 0 ? 'active' : ''}`;
      thumb.innerHTML = `<img src="${img.src}" alt="Thumb ${index + 1}" />`;
      thumb.addEventListener('click', () => {
        currentSlideIndex = index;
        updateSlide();
      });
      galleryThumbnails.appendChild(thumb);
    });

    updateSlide();
  } else {
    // Show empty state
    galleryMain.style.display = 'none';
    const emptyState = document.createElement('div');
    emptyState.className = 'gallery-empty';
    emptyState.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      <p>No designs added yet.</p>
      <span>Add image paths in the <code>uiuxCategories</code> object in <code>script.js</code>.</span>`;
    uiuxGallery.querySelector('.uiux-gallery-content').appendChild(emptyState);
  }

  uiuxGallery.classList.add('open');
  document.body.style.overflow = 'hidden';
};

const closeGallery = () => {
  uiuxGallery.classList.remove('open');
  document.body.style.overflow = '';
};

// Prev / Next button listeners
sliderPrevBtn.addEventListener('click', () => {
  const categoryData = uiuxCategories[currentCategory];
  if (!categoryData || !categoryData.images || categoryData.images.length === 0) return;
  currentSlideIndex = (currentSlideIndex - 1 + categoryData.images.length) % categoryData.images.length;
  updateSlide();
});

sliderNextBtn.addEventListener('click', () => {
  const categoryData = uiuxCategories[currentCategory];
  if (!categoryData || !categoryData.images || categoryData.images.length === 0) return;
  currentSlideIndex = (currentSlideIndex + 1) % categoryData.images.length;
  updateSlide();
});

document.querySelectorAll('.uiux-card[data-category]').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => openGallery(card.dataset.category));
});

galleryClose.addEventListener('click', closeGallery);
galleryBackdrop.addEventListener('click', closeGallery);

// ── UI/UX INLINE CARD PREVIEW SLIDESHOWS ──
const initCardSlideshows = () => {
  document.querySelectorAll('.uiux-card[data-category]').forEach(card => {
    const category = card.dataset.category;
    const categoryData = uiuxCategories[category];
    const previewStrip = card.querySelector('.uiux-preview-strip');
    if (!categoryData || !categoryData.images || categoryData.images.length === 0 || !previewStrip) return;

    // Create slideshow container
    const slideshow = document.createElement('div');
    slideshow.className = 'uiux-card-slideshow';

    // Create slides track
    const track = document.createElement('div');
    track.className = 'uiux-card-slideshow-track';

    // Create slides
    categoryData.images.forEach((imgData, index) => {
      const slide = document.createElement('div');
      slide.className = `uiux-card-slide ${index === 0 ? 'active' : ''}`;

      // Blurred background version
      const bgImg = document.createElement('img');
      bgImg.src = imgData.src;
      bgImg.className = 'uiux-card-slide-bg';
      bgImg.alt = '';
      bgImg.loading = 'lazy';

      // Crisp foreground version
      const fgImg = document.createElement('img');
      fgImg.src = imgData.src;
      fgImg.className = 'uiux-card-slide-fg';
      fgImg.alt = imgData.label || 'Design Preview';
      fgImg.loading = 'lazy';

      slide.appendChild(bgImg);
      slide.appendChild(fgImg);
      track.appendChild(slide);
    });

    // Create dots wrapper
    const dots = document.createElement('div');
    dots.className = 'uiux-card-slideshow-dots';
    categoryData.images.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.className = `uiux-card-dot ${index === 0 ? 'active' : ''}`;
      dots.appendChild(dot);
    });

    // Hover / tap overlay text
    const overlay = document.createElement('div');
    overlay.className = 'uiux-card-slideshow-overlay';
    const imageCount = categoryData.images.length;
    overlay.innerHTML = `<span>Tap to view ${imageCount} screens</span>`;

    slideshow.appendChild(track);
    slideshow.appendChild(dots);
    slideshow.appendChild(overlay);

    // Replace old placeholder
    previewStrip.innerHTML = '';
    previewStrip.appendChild(slideshow);

    // Set up auto-play
    let activeIdx = 0;
    const slides = track.querySelectorAll('.uiux-card-slide');
    const dotEls = dots.querySelectorAll('.uiux-card-dot');

    const nextSlide = () => {
      if (slides.length <= 1) return;
      slides[activeIdx].classList.remove('active');
      dotEls[activeIdx].classList.remove('active');

      activeIdx = (activeIdx + 1) % slides.length;

      slides[activeIdx].classList.add('active');
      dotEls[activeIdx].classList.add('active');
    };

    // Stagger auto-play delays
    const staggerDelay = {
      mobile: 0,
      web: 800,
      dashboard: 1600,
      redesign: 2400
    }[category] || 0;

    if (slides.length > 1) {
      setTimeout(() => {
        setInterval(nextSlide, 3500);
      }, staggerDelay);
    }
  });
};

// Initialize card slideshow previews
initCardSlideshows();

// ── MULTIMEDIA VIDEO LIGHTBOX ──
const videoModal = document.getElementById('videoModal');
const videoModalBackdrop = document.getElementById('videoModalBackdrop');
const videoModalClose = document.getElementById('videoModalClose');
const videoIframeContainer = document.getElementById('videoIframeContainer');

const openVideoModal = (src, title, sub) => {
  if (!videoModal || !videoIframeContainer) return;

  if (src.endsWith('.mp4') || src.startsWith('assets/')) {
    // Local HTML5 video player
    videoIframeContainer.innerHTML = `
      <video src="${src}" controls autoplay playsinline style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; outline: none; border-radius: var(--radius-sm);">
        Your browser does not support the video tag.
      </video>`;
  } else {
    // External iframe (YouTube, Facebook, etc.)
    videoIframeContainer.innerHTML = `<iframe src="${src}" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" title="${title || 'Video Player'}"></iframe>`;
  }
  
  if (title) document.getElementById('videoModalTitle').textContent = title;
  if (sub) document.getElementById('videoModalSub').textContent = sub;
  
  videoModal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

const closeVideoModal = () => {
  if (!videoModal || !videoIframeContainer) return;
  videoModal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    videoIframeContainer.innerHTML = '';
  }, 300);
};

const videoCard = document.getElementById('multimedia-video-card');
if (videoCard) {
  videoCard.addEventListener('click', () => {
    const embedUrl = videoCard.dataset.videoUrl;
    openVideoModal(embedUrl, 'Video Editing', 'Cinematic cuts & storytelling');
  });
}

if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
if (videoModalBackdrop) videoModalBackdrop.addEventListener('click', closeVideoModal);

// ── GLOBAL KEYBOARD CONTROLS ──
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (resumeModal.classList.contains('open')) closeModal();
    if (lightboxModal.classList.contains('open')) closeLightbox();
    if (videoModal && videoModal.classList.contains('open')) closeVideoModal();
    if (uiuxGallery.classList.contains('open')) closeGallery();
  }
  
  if (uiuxGallery.classList.contains('open')) {
    const categoryData = uiuxCategories[currentCategory];
    if (!categoryData || !categoryData.images || categoryData.images.length === 0) return;
    
    if (e.key === 'ArrowLeft') {
      currentSlideIndex = (currentSlideIndex - 1 + categoryData.images.length) % categoryData.images.length;
      updateSlide();
    } else if (e.key === 'ArrowRight') {
      currentSlideIndex = (currentSlideIndex + 1) % categoryData.images.length;
      updateSlide();
    }
  }
});