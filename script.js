// ============================================================
// 1. مدیریت تغییر زبان (فارسی / انگلیسی)
// ============================================================
const langToggle = document.getElementById('langToggle');
const langLabel = document.getElementById('langLabel');
let currentLang = 'fa'; // 'fa' یا 'en'

function switchLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === 'fa' ? 'fa' : 'en';
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  langLabel.textContent = lang === 'fa' ? 'فارسی' : 'English';

  // تغییر تمام المان‌های دارای data-fa و data-en
  document.querySelectorAll('[data-fa][data-en]').forEach(el => {
    const text = lang === 'fa' ? el.getAttribute('data-fa') : el.getAttribute('data-en');
    if (text) el.textContent = text;
  });

  // تغییر placeholder ها (اگر نیاز باشد)
  document.querySelectorAll('input, textarea').forEach(el => {
    if (el.hasAttribute('data-fa-placeholder') && el.hasAttribute('data-en-placeholder')) {
      el.placeholder = lang === 'fa' ? el.getAttribute('data-fa-placeholder') : el.getAttribute('data-en-placeholder');
    }
  });
}

langToggle.addEventListener('click', () => {
  const nextLang = currentLang === 'fa' ? 'en' : 'fa';
  switchLanguage(nextLang);
});

// ============================================================
// 2. اسلایدر واحدها (با دکمه‌های قبلی/بعدی)
// ============================================================
const slider = document.getElementById('roomsSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function slide(direction) {
  const cardWidth = slider.querySelector('.room-card').offsetWidth + 24; // +gap
  const scrollAmount = direction === 'next' ? cardWidth : -cardWidth;
  slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

prevBtn.addEventListener('click', () => slide('prev'));
nextBtn.addEventListener('click', () => slide('next'));

// پیمایش خودکار (هر ۵ ثانیه)
let autoSlide = setInterval(() => slide('next'), 5000);
slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
slider.addEventListener('mouseleave', () => {
  autoSlide = setInterval(() => slide('next'), 5000);
});

// ============================================================
// 3. منوی همبرگر (موبایل)
// ============================================================
const navToggle = document.getElementById('navToggle');
const navCollapse = document.getElementById('navbarNav');
navToggle.addEventListener('click', () => {
  navCollapse.classList.toggle('show');
});

// ============================================================
// 4. انیمیشن فید-این هنگام اسکرول
// ============================================================
const fadeElements = document.querySelectorAll('.room-card, .attr-card, .testimonial-card, .gallery-img, .about .col-lg-6');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

fadeElements.forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ============================================================
// 5. فرم تماس (اعتبارسنجی ساده)
// ============================================================
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert(currentLang === 'fa' ? 'پیام شما با موفقیت ارسال شد!' : 'Your message sent successfully!');
  this.reset();
});

// ============================================================
// 6. (اختیاری) کلیک روی تصاویر گالری برای بزرگ‌نمایی
// ============================================================
document.querySelectorAll('.gallery-img').forEach(img => {
  img.addEventListener('click', function() {
    const src = this.src;
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;justify-content:center;align-items:center;cursor:pointer;';
    const bigImg = document.createElement('img');
    bigImg.src = src;
    bigImg.style.maxWidth = '90%';
    bigImg.style.maxHeight = '90%';
    bigImg.style.borderRadius = '16px';
    overlay.appendChild(bigImg);
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});

// ============================================================
// 7. مقداردهی اولیه زبان (فارسی)
// ============================================================
switchLanguage('fa');
