// ============================================================
// 1. راه‌اندازی صحنه Three.js (پس‌زمینه سه‌بعدی)
// ============================================================
const container = document.getElementById('three-container');
const scene = new THREE.Scene();
scene.background = null; // شفاف

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// ===== نورپردازی =====
const ambientLight = new THREE.AmbientLight(0x404060);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffeedd, 1.2);
dirLight.position.set(2, 5, 3);
scene.add(dirLight);

const backLight = new THREE.PointLight(0x4466ff, 0.5);
backLight.position.set(-3, 1, -5);
scene.add(backLight);

// ===== ایجاد اشکال سه‌بعدی (نمادهای شیراز) =====
const group = new THREE.Group();

// 1. ستون‌های تخت جمشید (۴ ستون با سرستون گاو)
function createPersepolisColumn(x, z, scale = 1) {
  const colGroup = new THREE.Group();
  // پایه
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6 * scale, 0.7 * scale, 0.3 * scale, 12),
    new THREE.MeshStandardMaterial({ color: 0xcdb28c, roughness: 0.7, metalness: 0.1 })
  );
  base.position.y = -0.3 * scale;
  colGroup.add(base);
  // بدنه
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4 * scale, 0.5 * scale, 2.5 * scale, 12),
    new THREE.MeshStandardMaterial({ color: 0xe8d5b0, roughness: 0.6 })
  );
  shaft.position.y = 0.8 * scale;
  colGroup.add(shaft);
  // سرستون (دو سر گاو)
  const bullHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.3 * scale, 8, 6),
    new THREE.MeshStandardMaterial({ color: 0xc9a96e, roughness: 0.4, metalness: 0.3 })
  );
  bullHead.position.set(0.4 * scale, 1.8 * scale, 0);
  colGroup.add(bullHead);
  const bullHead2 = bullHead.clone();
  bullHead2.position.set(-0.4 * scale, 1.8 * scale, 0);
  colGroup.add(bullHead2);
  // تاج
  const crown = new THREE.Mesh(
    new THREE.ConeGeometry(0.5 * scale, 0.4 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x8b7a5a, roughness: 0.5 })
  );
  crown.position.y = 2.1 * scale;
  colGroup.add(crown);

  colGroup.position.set(x, 0, z);
  return colGroup;
}

// قرار دادن ستون‌ها به صورت دایره‌وار
const positions = [
  [-2.5, -2.5], [2.5, -2.5], [-2.5, 2.5], [2.5, 2.5],
  [0, -3.5], [-3.5, 0], [3.5, 0], [0, 3.5]
];
positions.forEach(([x, z]) => {
  const col = createPersepolisColumn(x * 0.6, z * 0.6, 0.7 + Math.random() * 0.2);
  group.add(col);
});

// 2. گنبد (نماد مسجد وکیل)
const dome = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
  new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.3, metalness: 0.2, transparent: true, opacity: 0.6 })
);
dome.position.set(3.2, -0.5, 2.8);
dome.scale.set(1, 0.7, 1);
group.add(dome);

// 3. گل نیلوفر (نماد باغ‌ها)
function createLotus(x, z) {
  const lotus = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    const petal = new THREE.Mesh(
      new THREE.ConeGeometry(0.15, 0.5, 6),
      new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.4 })
    );
    petal.rotation.z = (i / 8) * Math.PI * 2;
    petal.position.set(Math.sin((i / 8) * Math.PI * 2) * 0.25, 0, Math.cos((i / 8) * Math.PI * 2) * 0.25);
    lotus.add(petal);
  }
  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 6, 6),
    new THREE.MeshStandardMaterial({ color: 0xffd700 })
  );
  lotus.add(center);
  lotus.position.set(x, -1.2, z);
  return lotus;
}
group.add(createLotus(-3, -2.8));
group.add(createLotus(3.8, -2.2));

// 4. حافظ و سعدی (دو مکعب با رنگ طلا)
const hafez = new THREE.Mesh(
  new THREE.BoxGeometry(0.6, 1.2, 0.4),
  new THREE.MeshStandardMaterial({ color: 0xc9a96e, roughness: 0.3, metalness: 0.5 })
);
hafez.position.set(-1.8, 0.2, 3.5);
group.add(hafez);

const saadi = new THREE.Mesh(
  new THREE.BoxGeometry(0.6, 1.2, 0.4),
  new THREE.MeshStandardMaterial({ color: 0xb87333, roughness: 0.3, metalness: 0.4 })
);
saadi.position.set(1.8, 0.2, -3.5);
group.add(saadi);

// اضافه کردن گروه به صحنه
scene.add(group);

// ===== انیمیشن چرخش و پارالاکس =====
let mouseX = 0, mouseY = 0;
let targetRotX = 0, targetRotY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
});

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  group.rotation.z = scrollY * 0.3;
});

function animate() {
  requestAnimationFrame(animate);

  // چرخش آرام به دنبال ماوس
  targetRotX += (mouseX - targetRotX) * 0.05;
  targetRotY += (mouseY - targetRotY) * 0.05;
  group.rotation.y += targetRotX * 0.01;
  group.rotation.x += targetRotY * 0.01;

  renderer.render(scene, camera);
}
animate();

// ===== ریسایز =====
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================================
// 2. مدیریت تغییر زبان (مشابه قبل)
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
langToggle.addEventListener('click', () => {
  switchLanguage(currentLang === 'fa' ? 'en' : 'fa');
});

// ============================================================
// 3. اسلایدر واحدها
// ============================================================
const slider = document.getElementById('roomsSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function slide(direction) {
  const cardWidth = slider.querySelector('.room-card').offsetWidth + 24;
  slider.scrollBy({ left: direction === 'next' ? cardWidth : -cardWidth, behavior: 'smooth' });
}
prevBtn.addEventListener('click', () => slide('prev'));
nextBtn.addEventListener('click', () => slide('next'));

// ============================================================
// 4. منوی همبرگر
// ============================================================
document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('navbarNav').classList.toggle('show');
});

// ============================================================
// 5. انیمیشن فید-این
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
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert(currentLang === 'fa' ? 'پیام شما با موفقیت ارسال شد!' : 'Your message sent successfully!');
  this.reset();
});

// ============================================================
// 7. مقداردهی اولیه
// ============================================================
switchLanguage('fa');
