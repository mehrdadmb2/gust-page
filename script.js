(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const state = {
    lang: localStorage.getItem("vakilstay-lang") || "fa",
    theme: localStorage.getItem("vakilstay-theme") || "dark",
    roomFilter: "all",
    attractionCategory: "all",
    attractionQuery: "",
    map: null,
    markers: [],
    lightboxIndex: 0,
    deferredInstall: null,
    guestCount: 2
  };

  const roomData = [
    {
      id: 1, title: "واحد ۱", capacity: 4, badge: "خانوادگی",
      description: "یک‌خوابه، مناسب خانواده و سفرهای چندنفره.",
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900&auto=format&fit=crop",
      amenities: ["یک تخت دبل + سه تخت تکی", "آشپزخانه کامل", "تلویزیون و مبلمان"],
      link: "https://www.jajiga.com/r/3hwx/dr",
      accent: "gold"
    },
    {
      id: 2, title: "واحد ۲", capacity: 3, badge: "آرام",
      description: "فضایی جمع‌وجور و مناسب اقامت سه‌نفره نزدیک جاذبه‌ها.",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&auto=format&fit=crop",
      amenities: ["یک تخت دبل + دو تخت تکی", "کولر آبی", "بالکن"],
      link: "https://www.jajiga.com/r/3i6c/dr",
      accent: "terracotta"
    },
    {
      id: 3, title: "واحد ۳", capacity: 2, badge: "دو نفره",
      description: "انتخابی دنج برای زوج‌ها یا سفرهای دوستانه.",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&auto=format&fit=crop",
      amenities: ["یک تخت دبل + یک تخت تکی", "اسپیلت", "کتری برقی"],
      link: "https://www.jajiga.com/r/3hqd/dr",
      accent: "green"
    },
    {
      id: 4, title: "واحد ۴", capacity: 2, badge: "نزدیک بازار",
      description: "گزینه‌ای جمع‌وجور با دسترسی مناسب به بافت تاریخی.",
      image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=900&auto=format&fit=crop",
      amenities: ["یک تخت دبل", "اسپیلت", "یخچال و کابینت"],
      link: "https://www.jajiga.com/r/3hwz/dr",
      accent: "turquoise"
    }
  ];

  const attractionData = [
    {id:"persepolis", name:"تخت جمشید", category:"outside", categoryLabel:"خارج شهر", distance:"حدود ۶۰ کیلومتر", lat:29.9352, lng:52.8896, icon:"fa-landmark", accent:"#a7782f", tags:["تاریخی","سفر یک‌روزه"], text:"مهم‌ترین سفر تاریخی خارج از شهر برای بسیاری از مسافران شیراز."},
    {id:"pasargadae", name:"پاسارگاد", category:"outside", categoryLabel:"خارج شهر", distance:"حدود ۱۳۰ کیلومتر", lat:30.1939, lng:53.1672, icon:"fa-monument", accent:"#9a6548", tags:["تاریخی","خارج شهر"], text:"برای یک برنامه‌ی کامل‌تر تاریخی، می‌تواند یک روز جداگانه داشته باشد."},
    {id:"hafez", name:"حافظیه", category:"poetry", categoryLabel:"ادبی", distance:"حدود ۳ کیلومتر", lat:29.6253, lng:52.5579, icon:"fa-feather-pointed", accent:"#7c5a52", tags:["حافظ","شب‌گردی"], text:"برای ترکیب شعر، فضای باغ و یک توقف آرام در برنامه‌ی روزانه."},
    {id:"saadi", name:"سعدیه", category:"poetry", categoryLabel:"ادبی", distance:"حدود ۴ کیلومتر", lat:29.6219, lng:52.5819, icon:"fa-book-open", accent:"#84654b", tags:["سعدی","فرهنگ"], text:"یکی از انتخاب‌های فرهنگی مهم در شرق شیراز."},
    {id:"eram", name:"باغ ارم", category:"garden", categoryLabel:"باغ", distance:"حدود ۵ کیلومتر", lat:29.6368, lng:52.5256, icon:"fa-tree", accent:"#4f8055", tags:["باغ ایرانی","عکس"], text:"برای تجربه‌ی آرام‌تر شهر و معماری باغ ایرانی انتخاب مناسبی است."},
    {id:"afifabad", name:"باغ عفیف‌آباد", category:"garden", categoryLabel:"باغ", distance:"حدود ۷ کیلومتر", lat:29.6236, lng:52.4993, icon:"fa-leaf", accent:"#4b7751", tags:["باغ","موزه"], text:"ترکیبی از باغ و معماری تاریخی در بخش جنوبی‌تر شهر."},
    {id:"vakil", name:"بازار وکیل", category:"history", categoryLabel:"تاریخی", distance:"حدود ۲۰۰ متر", lat:29.6150, lng:52.5468, icon:"fa-shop", accent:"#b0802c", tags:["بازار","پیاده"], text:"برای خرید، قدم‌زدن و شروع شناخت بافت تاریخی شیراز."},
    {id:"citadel", name:"ارگ کریم‌خان", category:"history", categoryLabel:"تاریخی", distance:"حدود ۵۰۰ متر", lat:29.6176, lng:52.5447, icon:"fa-fort-awesome", accent:"#8d6e63", tags:["زندیه","معماری"], text:"یکی از شاخص‌ترین بناهای زندیه در مرکز شهر."},
    {id:"mosque", name:"مسجد وکیل", category:"history", categoryLabel:"تاریخی", distance:"حدود ۳۰۰ متر", lat:29.6144, lng:52.5454, icon:"fa-mosque", accent:"#4e7e82", tags:["وکیل","معماری"], text:"نمونه‌ای مهم از معماری مجموعه‌ی وکیل در بافت تاریخی."}
  ];

  const galleryData = [
    {title:"فضای اقامتگاه", description:"تصویر اصلی پروژه", image:"cover.jpeg"},
    {title:"واحد اقامتی", description:"نمای نمونه‌ی فضای اقامت", image:"https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1400&auto=format&fit=crop"},
    {title:"بافت شهری و بازار", description:"برای نمایش جاذبه‌ها در کارت‌ها", image:"https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1400&auto=format&fit=crop"},
    {title:"جزئیات فضای داخلی", description:"نمایی گرم برای معرفی اقامت", image:"https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1400&auto=format&fit=crop"}
  ];

  const reviewKey = "vakilstay_reviews_v2";
  const defaultReviews = [
    {name:"محمد ر.",rating:5,text:"اقامت فوق‌العاده‌ای بود؛ موقعیت مکانی برای گشت‌وگذار در بافت تاریخی واقعاً عالی است."},
    {name:"سارا م.",rating:5,text:"فضا تمیز و آرام بود و نزدیک بودن به بازار وکیل برای ما خیلی کاربردی بود."},
    {name:"علی ک.",rating:4,text:"برای یک سفر چندروزه به شیراز انتخاب خوبی بود و امکان دسترسی به جاذبه‌ها خیلی کمک کرد."}
  ];

  const planTemplates = {
    history: {
      1: [["صبح","بازار وکیل + مسجد وکیل"],["عصر","ارگ کریم‌خان + مجموعه وکیل"],["شب","قدم‌زدن در بافت تاریخی"]],
      2: [["صبح","بازار وکیل + مسجد وکیل"],["عصر","ارگ کریم‌خان + مجموعه وکیل"],["شب","حافظیه"]],
      3: [["صبح","بازار وکیل + ارگ کریم‌خان"],["عصر","تخت جمشید (روز خارج شهر)"],["شب","حافظیه"]],
      4: [["صبح","بافت تاریخی + مسجد وکیل"],["عصر","پاسارگاد یا تخت جمشید"],["شب","حافظیه + پیاده‌روی آرام"]]
    },
    poetry: {
      1: [["صبح","باغ ارم"],["عصر","حافظیه"],["شب","شعر و قدم‌زدن آرام"]],
      2: [["صبح","باغ ارم"],["عصر","حافظیه"],["شب","سعدیه"]],
      3: [["صبح","باغ ارم"],["عصر","سعدیه"],["شب","حافظیه"]],
      4: [["صبح","باغ ارم + موزه"],["عصر","سعدیه"],["شب","حافظیه + بافت تاریخی"]]
    },
    food: {
      1: [["صبح","بازار وکیل"],["عصر","چرخش در بافت تاریخی"],["شب","کشف غذاهای محلی"]],
      2: [["صبح","بازار وکیل"],["عصر","مجموعه وکیل"],["شب","محله‌گردی و غذا"]],
      3: [["صبح","بازار وکیل"],["عصر","باغ ارم"],["شب","حافظیه + تجربه غذایی"]],
      4: [["صبح","بازار وکیل"],["عصر","باغ عفیف‌آباد"],["شب","بافت تاریخی و غذای محلی"]]
    }
  };

  function applyTheme(theme = state.theme) {
    state.theme = theme;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("vakilstay-theme", theme);
    const icon = $("#themeButton i");
    if (icon) icon.className = theme === "light" ? "fa-solid fa-sun" : theme === "garden" ? "fa-solid fa-tree" : "fa-solid fa-moon";
  }

  function cycleTheme() {
    const next = state.theme === "dark" ? "light" : state.theme === "light" ? "garden" : "dark";
    applyTheme(next);
    toast(next === "dark" ? "تم شب زعفرانی فعال شد." : next === "light" ? "تم روشنِ کاهگلی فعال شد." : "تم باغ ایرانی فعال شد.");
  }

  function setupLanguageButton() {
    const button = $("#languageButton");
    if (!button) return;
    button.addEventListener("click", () => {
      state.lang = state.lang === "fa" ? "en" : "fa";
      localStorage.setItem("vakilstay-lang", state.lang);
      if (state.lang === "en") {
        toast("نسخه‌ی انگلیسی در معماری داده‌ها آماده است؛ محتوای اصلی این نسخه فارسی طراحی شده.");
      } else {
        toast("زبان فارسی فعال است.");
      }
    });
  }

  function setupNavigation() {
    const header = $("#siteHeader");
    const menu = $("#mainNav");
    const menuButton = $("#mobileMenuButton");

    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 24);
      $("#backTop")?.classList.toggle("visible", window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, {passive:true});
    onScroll();

    menuButton?.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    $$("#mainNav a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        menuButton?.setAttribute("aria-expanded", "false");
        if (menuButton) menuButton.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });

    $("#backTop")?.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));
    $("#themeButton")?.addEventListener("click", cycleTheme);
    $("#footerTheme")?.addEventListener("click", cycleTheme);
  }

  function setupReveal() {
    const elements = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      elements.forEach(el => el.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:0.12});
    elements.forEach(el => observer.observe(el));
  }

  function setupCounters() {
    const counters = $$("[data-counter]");
    if (!("IntersectionObserver" in window)) {
      counters.forEach(el => el.textContent = toFaDigits(el.dataset.counter));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.counter || 0);
        let start = 0;
        const duration = 850;
        const t0 = performance.now();
        const tick = now => {
          const p = Math.min(1,(now-t0)/duration);
          const eased = 1-Math.pow(1-p,3);
          el.textContent = toFaDigits(Math.round(start+(target-start)*eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    }, {threshold:.7});
    counters.forEach(el => observer.observe(el));
  }

  function toFaDigits(value) {
    return String(value).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
  }

  function setupClock() {
    const update = () => {
      const now = new Date();
      $("#localTime").textContent = new Intl.DateTimeFormat("fa-IR", {hour:"2-digit",minute:"2-digit"}).format(now);
      $("#todayDate").textContent = new Intl.DateTimeFormat("fa-IR", {weekday:"long",day:"numeric",month:"long"}).format(now);
      $("#footerYear").textContent = now.getFullYear();
    };
    update();
    setInterval(update, 30000);
  }

  async function loadWeather() {
    const temp = $("#weatherTemp");
    const desc = $("#weatherDescription");
    const feels = $("#weatherFeels");
    const stateEl = $("#weatherState");
    const icon = $("#weatherIcon i");

    try {
      const url = "https://api.open-meteo.com/v1/forecast?latitude=29.5918&longitude=52.5837&current=temperature_2m,apparent_temperature,weather_code,is_day&timezone=Asia%2FTehran";
      const response = await fetch(url, {headers:{accept:"application/json"}});
      if (!response.ok) throw new Error("Weather request failed");
      const data = await response.json();
      const current = data.current;
      temp.textContent = Math.round(current.temperature_2m);
      desc.textContent = weatherLabel(current.weather_code);
      feels.textContent = `احساس دما: ${Math.round(current.apparent_temperature)}°C`;
      stateEl.textContent = current.is_day ? "روز شیراز" : "شب شیراز";
      icon.className = `fa-solid ${weatherIcon(current.weather_code, current.is_day)}`;
    } catch {
      stateEl.textContent = "آب‌وهوا در دسترس نیست";
      desc.textContent = "اطلاعات لحظه‌ای بارگذاری نشد";
      feels.textContent = "لطفاً چند لحظه بعد دوباره تلاش کنید";
      icon.className = "fa-solid fa-cloud";
    }
  }

  function weatherLabel(code) {
    const map = {
      0:"آسمان صاف",1:"عمدتاً صاف",2:"نیمه‌ابری",3:"ابری",45:"مه‌آلود",48:"مه یخ‌زن",
      51:"نم‌نم باران",53:"بارش خفیف",55:"بارش مداوم",61:"باران",63:"باران متوسط",65:"باران شدید",
      71:"برف",73:"برف متوسط",75:"برف شدید",80:"رگبار",81:"رگبار متوسط",82:"رگبار شدید",
      95:"رعدوبرق",96:"رعدوبرق و تگرگ",99:"رعدوبرق شدید"
    };
    return map[code] || "شرایط متغیر";
  }

  function weatherIcon(code,isDay) {
    if (code === 0) return isDay ? "fa-sun" : "fa-moon";
    if ([1,2].includes(code)) return isDay ? "fa-cloud-sun" : "fa-cloud-moon";
    if ([3,45,48].includes(code)) return "fa-cloud";
    if ([51,53,55,61,63,65,80,81,82].includes(code)) return "fa-cloud-rain";
    if ([71,73,75].includes(code)) return "fa-snowflake";
    return "fa-cloud-bolt";
  }

  function renderRooms() {
    const host = $("#roomsGrid");
    const filter = state.roomFilter;
    const rooms = roomData.filter(room => filter === "all" || room.capacity === Number(filter));
    $("#roomsEmpty")?.classList.toggle("hidden", rooms.length > 0);

    host.innerHTML = rooms.map(room => `
      <article class="room-card">
        <div class="room-image">
          <img src="${room.image}" alt="${room.title}" loading="lazy">
          <span class="room-badge">${room.badge}</span>
        </div>
        <div class="room-body">
          <h3>${room.title}</h3>
          <p>${room.description}</p>
          <div class="room-meta">
            <span class="meta-pill"><i class="fa-solid fa-users"></i> ظرفیت ${toFaDigits(room.capacity)} نفر</span>
            <span class="meta-pill"><i class="fa-solid fa-mug-hot"></i> اقامت</span>
          </div>
          <div class="room-amenities">
            ${room.amenities.map(item => `<div class="room-amenity"><i class="fa-solid fa-check"></i><span>${item}</span></div>`).join("")}
          </div>
          <div class="room-actions">
            <a class="primary-button" href="${room.link}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> رزرو</a>
            <button class="room-photo-button" data-gallery-index="${room.id-1}" aria-label="دیدن تصویر ${room.title}"><i class="fa-solid fa-image"></i></button>
          </div>
        </div>
      </article>
    `).join("");

    $$(".room-photo-button", host).forEach(btn => btn.addEventListener("click", () => {
      openLightbox(Number(btn.dataset.galleryIndex) % galleryData.length);
    }));
  }

  function setupRoomFilters() {
    $$(".room-filters [data-room-filter]").forEach(button => {
      button.addEventListener("click", () => {
        $$(".room-filters [data-room-filter]").forEach(b => b.classList.remove("active"));
        button.classList.add("active");
        state.roomFilter = button.dataset.roomFilter;
        renderRooms();
      });
    });
  }

  function renderAttractions() {
    const host = $("#attractionsGrid");
    const q = state.attractionQuery.trim().toLowerCase();
    const filtered = attractionData.filter(item => {
      const categoryOk = state.attractionCategory === "all" || item.category === state.attractionCategory;
      const textOk = !q || `${item.name} ${item.categoryLabel} ${item.tags.join(" ")}`.toLowerCase().includes(q);
      return categoryOk && textOk;
    });

    host.innerHTML = filtered.map(item => `
      <article class="attraction-card" style="--accent:${item.accent}">
        <div class="attraction-top">
          <div class="attraction-symbol"><i class="fa-solid ${item.icon}"></i></div>
          <span class="attraction-distance">${item.distance}</span>
        </div>
        <h3>${item.name}</h3>
        <p>${item.text}</p>
        <div class="attraction-tags">
          ${item.tags.map(tag => `<span class="attraction-tag">${tag}</span>`).join("")}
        </div>
        <div class="attraction-actions">
          <button class="small-button" data-attraction-focus="${item.id}"><i class="fa-solid fa-map-location-dot"></i> روی نقشه</button>
          <a class="small-button" href="https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}" target="_blank" rel="noopener"><i class="fa-solid fa-route"></i> مسیریابی</a>
        </div>
      </article>
    `).join("");

    $$("[data-attraction-focus]", host).forEach(btn => {
      btn.addEventListener("click", () => {
        switchView("map");
        focusMarker(btn.dataset.attractionFocus);
      });
    });
  }

  function setupAttractionFilters() {
    const input = $("#attractionSearch");
    input?.addEventListener("input", () => {
      state.attractionQuery = input.value;
      renderAttractions();
    });

    $$("#categoryPills [data-category]").forEach(btn => {
      btn.addEventListener("click", () => {
        $$("#categoryPills [data-category]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.attractionCategory = btn.dataset.category;
        renderAttractions();
      });
    });

    $$(".view-tab").forEach(tab => tab.addEventListener("click", () => switchView(tab.dataset.view)));
  }

  function switchView(view) {
    $$(".view-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.view === view));
    $("#attractionsGrid").classList.toggle("hidden", view !== "cards");
    $("#attractionsMapPanel").classList.toggle("hidden", view !== "map");
    if (view === "map") {
      initMap();
      setTimeout(() => state.map?.invalidateSize(), 100);
    }
  }

  function initMap() {
    if (state.map || !window.L) return;
    state.map = L.map("map", {zoomControl:true}).setView([29.6155,52.5480], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom:19,
      attribution:"© OpenStreetMap contributors"
    }).addTo(state.map);

    const residence = L.marker([29.6127,52.5516]).addTo(state.map);
    residence.bindPopup("<strong>VakilStay</strong><br>اقامتگاه وکیل · قلب بافت تاریخی شیراز");

    state.markers = attractionData.map(item => {
      const marker = L.marker([item.lat,item.lng]).addTo(state.map);
      marker.bindPopup(`<strong>${item.name}</strong><br><span style="font-family:Vazirmatn">${item.distance}</span>`);
      marker.__itemId = item.id;
      return marker;
    });
  }

  function focusMarker(id) {
    initMap();
    const marker = state.markers.find(m => m.__itemId === id);
    if (!marker || !state.map) return;
    state.map.setView(marker.getLatLng(), 15, {animate:true});
    marker.openPopup();
  }

  function fitAllMarkers() {
    initMap();
    const all = state.markers.slice();
    if (window.L) all.push(L.marker([29.6127,52.5516], {opacity:0}));
    if (!all.length) return;
    const group = L.featureGroup(all);
    state.map.fitBounds(group.getBounds().pad(.16));
  }

  function locateMe() {
    if (!navigator.geolocation) {
      toast("مرورگر شما موقعیت مکانی را پشتیبانی نمی‌کند.");
      return;
    }
    navigator.geolocation.getCurrentPosition(pos => {
      initMap();
      state.map.setView([pos.coords.latitude,pos.coords.longitude], 14, {animate:true});
      L.circleMarker([pos.coords.latitude,pos.coords.longitude], {
        radius:8,color:"#247c73",fillColor:"#247c73",fillOpacity:.8
      }).addTo(state.map).bindPopup("موقعیت فعلی شما").openPopup();
    }, () => toast("دسترسی به موقعیت مکانی داده نشد."));
  }

  function setupMapActions() {
    $("#fitAllMarkers")?.addEventListener("click", fitAllMarkers);
    $("#locateMe")?.addEventListener("click", locateMe);
  }

  function renderPlan() {
    const days = Number($("#tripDays").value);
    const style = $("#tripStyle").value;
    const pace = $("#tripPace").value;
    const template = planTemplates[style][days] || planTemplates.history[2];
    const paceHint = pace === "slow" ? "ریتم آرام: زمان آزاد بیشتری برای توقف و استراحت در نظر بگیرید."
      : pace === "full" ? "ریتم پُرگردش: فاصله‌ها و انرژی روز را در نظر بگیرید."
      : "ریتم متعادل: ترکیب مناسب بین جاذبه، استراحت و جابه‌جایی.";

    const plan = Array.from({length:days}, (_,i) => {
      const base = template.map(slot => [...slot]);
      if (i > 0) {
        if (style === "history" && i === 1) base[1][1] = "تخت جمشید";
        if (style === "poetry" && i === 1) base[1][1] = "سعدیه";
        if (style === "food" && i === 1) base[1][1] = "باغ ارم";
      }
      return base;
    });

    $("#planResult").innerHTML = plan.map((day,i) => `
      <div class="plan-day">
        <div class="plan-day-head">
          <strong>روز ${toFaDigits(i+1)}</strong>
          <span>${pace === "slow" ? "آرام" : pace === "full" ? "پُرگردش" : "متعادل"}</span>
        </div>
        <div class="plan-slots">
          ${day.map(slot => `<div class="plan-slot"><span>${slot[0]}</span><strong>${slot[1]}</strong></div>`).join("")}
        </div>
      </div>
    `).join("") + `<div class="plan-hint"><i class="fa-solid fa-info-circle"></i> ${paceHint} ساعات و شرایط بازدید را قبل از حرکت بررسی کنید.</div>`;
  }

  function setupPlanner() {
    $("#generatePlan")?.addEventListener("click", renderPlan);
    $("#openTripPlanner")?.addEventListener("click", () => {
      $("#plannerModal").classList.remove("hidden");
      $("#plannerModal").setAttribute("aria-hidden","false");
      $("#modalPlanHost").innerHTML = `
        <div class="planner-card">
          <div class="planner-control"><label>مدت</label><select id="modalDays"><option value="1">۱ روز</option><option value="2" selected>۲ روز</option><option value="3">۳ روز</option></select></div>
          <div class="planner-control"><label>سبک</label><select id="modalStyle"><option value="history">تاریخ و معماری</option><option value="poetry">شعر و باغ</option><option value="food">بازار و محلی</option></select></div>
          <button class="primary-button full-button" id="modalGenerate">ساخت برنامه</button>
          <div id="modalPlanOutput" class="plan-result"></div>
        </div>
      `;
      $("#modalGenerate").addEventListener("click", () => {
        const days = Number($("#modalDays").value);
        const style = $("#modalStyle").value;
        const template = planTemplates[style][days];
        $("#modalPlanOutput").innerHTML = template.map((slot,i) => `
          <div class="plan-day"><div class="plan-day-head"><strong>${slot[0]}</strong><span>${slot[1]}</span></div></div>
        `).join("");
      });
    });
  }

  function readReviews() {
    try {
      const saved = JSON.parse(localStorage.getItem(reviewKey));
      return Array.isArray(saved) && saved.length ? saved : defaultReviews.slice();
    } catch {
      return defaultReviews.slice();
    }
  }

  function safeText(value,max=300) {
    return String(value || "").replace(/[<>]/g,"").slice(0,max);
  }

  function renderReviews() {
    const reviews = readReviews();
    $("#reviewsList").innerHTML = reviews.map(review => `
      <article class="review-card">
        <div class="stars">${"★".repeat(review.rating)}${"☆".repeat(5-review.rating)}</div>
        <p>${safeText(review.text)}</p>
        <span class="review-author">— ${safeText(review.name,40)}</span>
      </article>
    `).join("");
    const avg = reviews.reduce((sum,r) => sum + Number(r.rating || 0),0) / reviews.length;
    $("#averageRating").textContent = avg.toFixed(1).replace(".", "٫");
    $("#reviewCount").textContent = `${toFaDigits(reviews.length)} تجربه`;
  }

  function setupReviewForm() {
    $("#reviewForm")?.addEventListener("submit", e => {
      e.preventDefault();
      const name = safeText($("#reviewName").value,40);
      const rating = Number($("#reviewRating").value);
      const text = safeText($("#reviewText").value,300);
      if (!name || !text || rating < 1 || rating > 5) {
        toast("نام، امتیاز و متن نظر را کامل کنید.");
        return;
      }
      const reviews = readReviews();
      reviews.unshift({name,rating,text});
      localStorage.setItem(reviewKey, JSON.stringify(reviews.slice(0,20)));
      e.target.reset();
      renderReviews();
      toast("نظر شما در همین مرورگر ثبت شد.");
    });
  }

  function setupBookingCalculator() {
    const inEl = $("#checkIn");
    const outEl = $("#checkOut");
    const countEl = $("#guestCount");
    const nightEl = $("#nightCount");
    const statusEl = $("#bookingStatus");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth()+1).padStart(2,"0");
    const dd = String(today.getDate()).padStart(2,"0");
    const min = `${yyyy}-${mm}-${dd}`;
    inEl.min = min;
    outEl.min = min;

    function update() {
      if (!inEl.value || !outEl.value) {
        nightEl.textContent = "--";
        statusEl.textContent = "تاریخ را انتخاب کنید";
        return;
      }
      const a = new Date(`${inEl.value}T00:00:00`);
      const b = new Date(`${outEl.value}T00:00:00`);
      const nights = Math.round((b-a)/86400000);
      if (nights <= 0) {
        nightEl.textContent = "—";
        statusEl.textContent = "خروج باید بعد از ورود باشد";
        return;
      }
      nightEl.textContent = toFaDigits(nights);
      statusEl.textContent = nights === 1 ? "یک شب اقامت" : `${toFaDigits(nights)} شب اقامت`;
    }
    inEl?.addEventListener("change", () => {
      if (inEl.value) outEl.min = inEl.value;
      update();
    });
    outEl?.addEventListener("change", update);

    $$(".guest-stepper button").forEach(btn => {
      btn.addEventListener("click", () => {
        state.guestCount = Math.min(8, Math.max(1, state.guestCount + (btn.dataset.step === "up" ? 1 : -1)));
        countEl.textContent = toFaDigits(state.guestCount);
      });
    });
  }

  function setupContactForm() {
    $("#contactForm")?.addEventListener("submit", e => {
      e.preventDefault();
      const name = encodeURIComponent($("#contactName").value.trim());
      const email = encodeURIComponent($("#contactEmail").value.trim());
      const message = encodeURIComponent($("#contactMessage").value.trim());
      const subject = encodeURIComponent(`پیام از سایت VakilStay - ${decodeURIComponent(name)}`);
      const body = encodeURIComponent(`نام: ${decodeURIComponent(name)}\nایمیل: ${decodeURIComponent(email)}\n\n${decodeURIComponent(message)}`);
      window.location.href = `mailto:info@vakilstay.com?subject=${subject}&body=${body}`;
      toast("برنامه‌ی ایمیل دستگاه شما برای ارسال پیام آماده شد.");
    });
  }

  function setupShare() {
    const share = async () => {
      const data = {title:"VakilStay | اقامتگاه وکیل",text:"اقامت و راهنمای سفر در شیراز",url:location.href};
      try {
        if (navigator.share) await navigator.share(data);
        else {
          await navigator.clipboard.writeText(location.href);
          toast("لینک سایت کپی شد.");
        }
      } catch {}
    };
    $("#shareButton")?.addEventListener("click", share);
    $("#footerShare")?.addEventListener("click", share);
  }

  function setupModals() {
    $$("[data-close-modal]").forEach(btn => btn.addEventListener("click", () => closeModal(btn.dataset.closeModal)));
    $$(".modal-backdrop").forEach(backdrop => {
      backdrop.addEventListener("click", e => { if (e.target === backdrop) backdrop.classList.add("hidden"); });
    });
    document.addEventListener("keydown", e => {
      if (e.key !== "Escape") return;
      $$(".modal-backdrop:not(.hidden)").forEach(m => m.classList.add("hidden"));
    });
  }

  function closeModal(id) {
    $("#" + id)?.classList.add("hidden");
  }

  function openLightbox(index) {
    state.lightboxIndex = index;
    const item = galleryData[index];
    $("#lightboxImage").src = item.image;
    $("#lightboxImage").alt = item.title;
    $("#lightboxTitle").textContent = item.title;
    $("#lightboxDescription").textContent = item.description;
    $("#lightboxModal").classList.remove("hidden");
  }

  function moveLightbox(step) {
    state.lightboxIndex = (state.lightboxIndex + step + galleryData.length) % galleryData.length;
    openLightbox(state.lightboxIndex);
  }

  function setupLightbox() {
    $("#lightboxPrev")?.addEventListener("click", () => moveLightbox(-1));
    $("#lightboxNext")?.addEventListener("click", () => moveLightbox(1));
    document.addEventListener("keydown", e => {
      if ($("#lightboxModal").classList.contains("hidden")) return;
      if (e.key === "ArrowLeft") moveLightbox(-1);
      if (e.key === "ArrowRight") moveLightbox(1);
    });
  }

  function setupInstallPrompt() {
    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      state.deferredInstall = e;
      $("#installApp")?.classList.remove("hidden");
    });
    $("#installApp")?.addEventListener("click", async () => {
      if (!state.deferredInstall) return;
      state.deferredInstall.prompt();
      await state.deferredInstall.userChoice;
      state.deferredInstall = null;
    });
  }

  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(el.__timer);
    el.__timer = setTimeout(() => el.classList.remove("show"), 2800);
  }

  // Initialize
  applyTheme(state.theme);
  setupLanguageButton();
  setupNavigation();
  setupReveal();
  setupCounters();
  setupClock();
  loadWeather();
  renderRooms();
  setupRoomFilters();
  renderAttractions();
  setupAttractionFilters();
  setupMapActions();
  setupPlanner();
  renderPlan();
  renderReviews();
  setupReviewForm();
  setupBookingCalculator();
  setupContactForm();
  setupShare();
  setupModals();
  setupLightbox();
  setupInstallPrompt();

  // Keep external images useful even if one source fails.
  document.addEventListener("error", e => {
    if (e.target?.tagName === "IMG" && e.target.dataset.fallback !== "done") {
      e.target.dataset.fallback = "done";
      e.target.src = "cover.jpeg";
    }
  }, true);

  window.VakilStay = {
    roomData,
    attractionData,
    cycleTheme,
    switchView,
    fitAllMarkers
  };

})();
