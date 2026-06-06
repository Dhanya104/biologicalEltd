/* =============================================
   MEDICLINIC – script.js
   Handles: navbar, AOS, carousel, cart, form
============================================= */

// ── NAVBAR SCROLL EFFECT ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── SEARCH BAR TOGGLE ──
const searchBtn = document.getElementById('searchBtn');
const searchBar = document.getElementById('searchBar');
const searchInput = document.getElementById('searchInput');
searchBtn.addEventListener('click', () => {
  searchBar.classList.toggle('active');
  if (searchBar.classList.contains('active')) searchInput.focus();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') searchBar.classList.remove('active');
});

// ── SIMPLE AOS (Animate on Scroll) ──
function initAOS() {
  const items = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || 0);
        setTimeout(() => {
          entry.target.classList.add('aos-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(item => observer.observe(item));
}
initAOS();

// ── REVIEWS CAROUSEL ──
const track      = document.getElementById('reviewsTrack');
const dotsWrap   = document.getElementById('reviewDots');
const cards      = track ? track.querySelectorAll('.review-card') : [];
let currentSlide = 0;
let slidesPerView = getSlidesPerView();
let totalSlides   = Math.max(0, cards.length - slidesPerView);
let autoSlide;

function getSlidesPerView() {
  return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
}

function buildDots() {
  dotsWrap.innerHTML = '';
  const count = totalSlides + 1;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === currentSlide ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  }
}

function goToSlide(index) {
  currentSlide = Math.max(0, Math.min(index, totalSlides));
  const cardWidth = cards[0] ? cards[0].offsetWidth + 20 : 0;
  track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  resetAutoSlide();
}

function startAutoSlide() {
  autoSlide = setInterval(() => {
    goToSlide(currentSlide >= totalSlides ? 0 : currentSlide + 1);
  }, 4500);
}

function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

document.getElementById('prevReview')?.addEventListener('click', () => goToSlide(currentSlide - 1));
document.getElementById('nextReview')?.addEventListener('click', () => goToSlide(currentSlide + 1));

window.addEventListener('resize', () => {
  slidesPerView = getSlidesPerView();
  totalSlides   = Math.max(0, cards.length - slidesPerView);
  currentSlide  = 0;
  buildDots();
  goToSlide(0);
});

if (cards.length > 0) {
  buildDots();
  startAutoSlide();
}

// ── CART FUNCTIONALITY ──
let cartCount = 0;
const cartCountEl = document.getElementById('cartCount');
const cartToast   = document.getElementById('cartToast');
let toastTimeout;

function addToCart(btn, name) {
  cartCount++;
  cartCountEl.textContent = cartCount;

  // Button feedback
  btn.textContent = '✔ Added!';
  btn.style.background = 'var(--primary)';
  btn.style.color = 'white';
  btn.style.borderColor = 'var(--primary)';
  setTimeout(() => {
    btn.textContent = '+ Add To Cart';
    btn.style.background = '';
    btn.style.color = '';
    btn.style.borderColor = '';
  }, 2000);

  // Toast notification
  clearTimeout(toastTimeout);
  cartToast.textContent = `🛒 "${name}" added to cart!`;
  cartToast.classList.add('show');
  toastTimeout = setTimeout(() => cartToast.classList.remove('show'), 3000);
}

// Make addToCart globally accessible
window.addToCart = addToCart;

// Floating cart click – scroll to shop
document.getElementById('floatingCart')?.addEventListener('click', () => {
  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
});

// ── CONTACT FORM ──
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmessage').value.trim();
  const success = document.getElementById('formSuccess');

  if (!name || !email || !message) {
    alert('Please fill in all required fields.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Simulate sending
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    this.reset();
    btn.textContent = 'Send Message';
    btn.disabled = false;
    success.classList.add('show');
    setTimeout(() => success.classList.remove('show'), 5000);
  }, 1200);
});

// ── ACTIVE NAV LINK ON SCROLL ──
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--primary)' : '';
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => sectionObserver.observe(s));

// ── SMOOTH LAZY LOADING ──
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  img.addEventListener('load', () => {
    img.style.animation = 'fadeIn .4s ease';
  });
});
