// ============================================================
// 1. اسلایدر پس‌زمینه (حذف شد چون الگوی ثابت داریم)
// ============================================================

// ============================================================
// 2. مدیریت تغییر زبان
// ============================================================
const langToggle = document.getElementById('langToggle');
const langLabel = document.getElementById('langLabel');
let currentLang = 'fa';

function switchLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === 'fa' ? 'fa' : 'en';
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  langLabel.textContent = lang === 'fa' ? 'فارسی' : 'English';

  document.querySelectorAll('[data-fa][data-en]').forEach(el => {
    const text = lang === 'fa' ? el.getAttribute('data-fa') : el.getAttribute('data-en');
    if (text) el.textContent = text;
  });
}
if (langToggle) {
  langToggle.addEventListener('click', () => {
    switchLanguage(currentLang === 'fa' ? 'en' : 'fa');
  });
}

// ============================================================
// 3. اسلایدر واحدها
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
}

// ============================================================
// 4. منوی همبرگر
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
// 5. انیمیشن فید-این هنگام اسکرول
// ============================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.glass-card, .attr-card, .testimonial-card').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ============================================================
// 6. فرم تماس
// ============================================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const msg = currentLang === 'fa' ? 'پیام شما با موفقیت ارسال شد!' : 'Your message sent successfully!';
    alert(msg);
    this.reset();
  });
}

// ============================================================
// 7. مقداردهی اولیه
// ============================================================
switchLanguage('fa');
