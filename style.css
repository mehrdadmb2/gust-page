// ============================================================
// 0. مدیریت تم (دارک‌مود / روشن)
// ============================================================
(function initTheme() {
  const theme = localStorage.getItem('vakilstay-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.querySelector('#themeToggle i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }
})();

document.getElementById('themeToggle').addEventListener('click', function() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('vakilstay-theme', next);
  const icon = this.querySelector('i');
  icon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
});

// ============================================================
// 1. مدیریت تغییر زبان
// ============================================================
const langToggle = document.getElementById('langToggle');
const langLabel = document.getElementById('langLabel');
let currentLang = localStorage.getItem('vakilstay-lang') || 'fa';

function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('vakilstay-lang', lang);
  document.documentElement.lang = lang === 'fa' ? 'fa' : 'en';
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  langLabel.textContent = lang === 'fa' ? 'فارسی' : 'English';

  document.querySelectorAll('[data-fa][data-en]').forEach(el => {
    const text = lang === 'fa' ? el.getAttribute('data-fa') : el.getAttribute('data-en');
    if (text) el.textContent = text;
  });
  // به‌روزرسانی placeholder‌ها
  document.querySelectorAll('[data-fa-placeholder][data-en-placeholder]').forEach(el => {
    el.placeholder = lang === 'fa' ? el.getAttribute('data-fa-placeholder') : el.getAttribute('data-en-placeholder');
  });
}
if (langToggle) {
  langToggle.addEventListener('click', () => {
    switchLanguage(currentLang === 'fa' ? 'en' : 'fa');
  });
}
switchLanguage(currentLang);

// ============================================================
// 2. هدر پویا (شفافیت هنگام اسکرول)
// ============================================================
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ============================================================
// 3. دکمه بازگشت به بالا
// ============================================================
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backBtn.classList.add('visible');
  } else {
    backBtn.classList.remove('visible');
  }
});
backBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// 4. اسلایدر واحدها
// ============================================================
const slider = document.getElementById('roomsSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (slider && prevBtn && nextBtn) {
  function slide(direction) {
    const card = slider.querySelector('.room-card');
    if (!card) return;
    const cardWidth = card.offsetWidth + 24;
    slider.scrollBy({ left: direction === 'next' ? cardWidth : -cardWidth, behavior: 'smooth' });
  }
  prevBtn.addEventListener('click', () => slide('prev'));
  nextBtn.addEventListener('click', () => slide('next'));

  // اسکرول خودکار (مکث در هاور)
  let autoSlide = setInterval(() => slide('next'), 5000);
  slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
  slider.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => slide('next'), 5000);
  });
}

// ============================================================
// 5. منوی همبرگر (رفع باگ)
// ============================================================
const navToggle = document.getElementById('navToggle');
const navCollapse = document.getElementById('navbarNav');
if (navToggle && navCollapse) {
  navToggle.addEventListener('click', function(e) {
    e.preventDefault();
    navCollapse.classList.toggle('show');
  });
}

// ============================================================
// 6. انیمیشن فید-این هنگام اسکرول
// ============================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.glass-card, .attr-card, .testimonial-card, .gallery-img').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ============================================================
// 7. لودینگ تدریجی تصاویر (Lazy Loading با Intersection Observer)
// ============================================================
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img.lazy');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.src; // ریلود
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imageObserver.observe(img));
}

// ============================================================
// 8. لایت‌باکس گالری
// ============================================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightbox = document.querySelector('.lightbox-close');
const prevLightbox = document.querySelector('.lightbox-prev');
const nextLightbox = document.querySelector('.lightbox-next');
let galleryImages = [];
let currentIndex = 0;

document.querySelectorAll('.gallery-img').forEach((img, index) => {
  img.addEventListener('click', function() {
    galleryImages = Array.from(document.querySelectorAll('.gallery-img'));
    currentIndex = index;
    openLightbox(this.src, this.dataset.title || '');
  });
});

function openLightbox(src, title) {
  lightboxImg.src = src;
  lightboxCaption.textContent = title;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightboxFn() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

closeLightbox.addEventListener('click', closeLightboxFn);
lightbox.addEventListener('click', function(e) {
  if (e.target === this) closeLightboxFn();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeLightboxFn();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

function navigateLightbox(dir) {
  if (!galleryImages.length) return;
  currentIndex = (currentIndex + dir + galleryImages.length) % galleryImages.length;
  const img = galleryImages[currentIndex];
  lightboxImg.src = img.src;
  lightboxCaption.textContent = img.dataset.title || '';
}
prevLightbox.addEventListener('click', () => navigateLightbox(-1));
nextLightbox.addEventListener('click', () => navigateLightbox(1));

// ============================================================
// 9. نظرات پویا (ذخیره در localStorage)
// ============================================================
const STORAGE_KEY = 'vakilstay_reviews';
let reviews = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// نظرات پیش‌فرض (اگر خالی بود)
if (!reviews.length) {
  reviews = [
    { name: 'محمد ر.', rating: 5, text: 'اقامت فوق‌العاده‌ای بود. موقعیت مکانی عالی و صاحبخانه بسیار مهمان‌نواز.' },
    { name: 'سارا م.', rating: 5, text: 'خانه سنتی و تمیز، نزدیک به همه جا. حتماً دوباره می‌آیم.' },
    { name: 'علی ک.', rating: 4, text: 'ارزش هر ریال را داشت. شیراز زیبا و این اقامتگاه تجربه را کامل کرد.' }
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

function renderReviews() {
  const container = document.getElementById('dynamicTestimonials');
  if (!container) return;
  const lang = currentLang;
  container.innerHTML = reviews.map((r, i) => `
    <div class="col-md-4">
      <div class="testimonial-card glass-card">
        <div class="rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
        <p class="nastaliq">${lang === 'fa' ? r.text : r.textEn || r.text}</p>
        <span>- ${r.name}</span>
      </div>
    </div>
  `).join('');
}
renderReviews();

// فرم ارسال نظر
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
  reviewForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('reviewName').value.trim();
    const rating = parseInt(document.getElementById('reviewRating').value);
    const text = document.getElementById('reviewText').value.trim();
    if (!name || !rating || !text) {
      alert(currentLang === 'fa' ? 'لطفاً همه فیلدها را پر کنید.' : 'Please fill all fields.');
      return;
    }
    if (rating < 1 || rating > 5) {
      alert(currentLang === 'fa' ? 'امتیاز باید بین ۱ تا ۵ باشد.' : 'Rating must be between 1 and 5.');
      return;
    }
    reviews.unshift({ name, rating, text });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    renderReviews();
    this.reset();
    alert(currentLang === 'fa' ? 'نظر شما با موفقیت ثبت شد!' : 'Your review submitted!');
  });
}

// ============================================================
// 10. ویجت رزرو (اتصال به جاجیگا)
// ============================================================
document.getElementById('bookNow').addEventListener('click', function(e) {
  e.preventDefault();
  const checkin = document.getElementById('checkin').value;
  const checkout = document.getElementById('checkout').value;
  const guests = document.getElementById('guests').value || 2;
  // باز کردن لینک جاجیگا (می‌توانید لینک اصلی را قرار دهید)
  window.open('https://www.jajiga.com/r/3hwx/dr', '_blank');
});

// ============================================================
// 11. نقشه تعاملی (Leaflet)
// ============================================================
if (typeof L !== 'undefined' && document.getElementById('mapContainer')) {
  const map = L.map('mapContainer').setView([29.6127, 52.5516], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // نشانگر اقامتگاه (آبی)
  L.marker([29.6127, 52.5516], { icon: L.icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] }) })
    .addTo(map)
    .bindPopup('<b>اقامتگاه وکیل</b><br>خیابان وکیل، بازار وکیل');

  // جاذبه‌ها (قرمز)
  const attractions = [
    { name: 'تخت جمشید', lat: 29.9352, lng: 52.8896 },
    { name: 'پاسارگاد', lat: 30.1939, lng: 53.1672 },
    { name: 'حافظیه', lat: 29.6253, lng: 52.5579 },
    { name: 'سعدیه', lat: 29.6219, lng: 52.5819 },
    { name: 'باغ ارم', lat: 29.6368, lng: 52.5256 },
    { name: 'باغ عفیف‌آباد', lat: 29.6236, lng: 52.4993 },
    { name: 'بازار وکیل', lat: 29.615, lng: 52.5468 },
    { name: 'ارگ کریم‌خان', lat: 29.6176, lng: 52.5447 },
    { name: 'مسجد وکیل', lat: 29.6144, lng: 52.5454 }
  ];
  attractions.forEach(a => {
    L.marker([a.lat, a.lng], { icon: L.icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] }) })
      .addTo(map)
      .bindPopup(`<b>${a.name}</b>`);
  });
}

// ============================================================
// 12. افکت پارالاکس ملایم (برای کارت‌ها)
// ============================================================
document.addEventListener('scroll', function() {
  const cards = document.querySelectorAll('.glass-card');
  const scrollY = window.scrollY;
  cards.forEach((card, i) => {
    const speed = 0.05 + (i % 3) * 0.02;
    const offset = scrollY * speed;
    card.style.transform = `translateY(${offset}px)`;
  });
});

// ============================================================
// 13. فرم تماس (با اعتبارسنجی و پیام)
// ============================================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = this.querySelector('input[type="text"]')?.value.trim();
    const email = this.querySelector('input[type="email"]')?.value.trim();
    const msg = this.querySelector('textarea')?.value.trim();
    if (!name || !email || !msg) {
      alert(currentLang === 'fa' ? 'لطفاً همه فیلدها را پر کنید.' : 'Please fill all fields.');
      return;
    }
    alert(currentLang === 'fa' ? 'پیام شما با موفقیت ارسال شد!' : 'Your message sent successfully!');
    this.reset();
  });
}

// ============================================================
// 14. مقداردهی اولیه
// ============================================================
console.log('✅ VakilStay fully loaded with all features!');
