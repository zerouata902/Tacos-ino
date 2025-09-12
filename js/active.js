(function ($) {
    'use strict';

    var browserWindow = $(window);
    var treadingPost = $('.treading-post-area');

    // :: 1.0 Preloader Active Code
    browserWindow.on('load', function () {
        $('.preloader').fadeOut('slow', function () {
            $(this).remove();
        });
    });

    // :: 2.0 Nav Active Code
    if ($.fn.classyNav) {
        $('#buenoNav').classyNav();
    }

    // :: 3.0 Sticky Active Code
    if ($.fn.sticky) {
        $("#sticker").sticky({
            topSpacing: 0
        });
    }

    // :: 4.0 niceSelect Active Code
    if ($.fn.niceSelect) {
        $("select").niceSelect();
    }

    // :: 5.0 Video Active Code
    if ($.fn.magnificPopup) {
        $('.img-zoom').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true
            }
        });
    }

    // :: 6.0 Sliders Active Code
    if ($.fn.owlCarousel) {

        var welcomeSlide = $('.hero-post-slides');
        var videoSlides = $('.video-slides');
        var albumSlides = $('.albums-slideshow');

        welcomeSlide.owlCarousel({
            items: 3,
            margin: 30,
            loop: true,
            nav: true,
            navText: ['Prev', 'Next'],
            dots: false,
            autoplay: true,
            center: true,
            autoplayTimeout: 7000,
            smartSpeed: 1000,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                992: {
                    items: 3
                }
            }
        });

        welcomeSlide.on('translate.owl.carousel', function () {
            var slideLayer = $("[data-animation]");
            slideLayer.each(function () {
                var anim_name = $(this).data('animation');
                $(this).removeClass('animated ' + anim_name).css('opacity', '0');
            });
        });

        welcomeSlide.on('translated.owl.carousel', function () {
            var slideLayer = welcomeSlide.find('.owl-item.active').find("[data-animation]");
            slideLayer.each(function () {
                var anim_name = $(this).data('animation');
                $(this).addClass('animated ' + anim_name).css('opacity', '1');
            });
        });

        $("[data-delay]").each(function () {
            var anim_del = $(this).data('delay');
            $(this).css('animation-delay', anim_del);
        });

        $("[data-duration]").each(function () {
            var anim_dur = $(this).data('duration');
            $(this).css('animation-duration', anim_dur);
        });
    }

// :: 7.0 ScrollUp Active Code
if ($.fn.scrollUp) {
    browserWindow.scrollUp({
        scrollSpeed: 1500,
        scrollText: '<i class="fa fa-angle-up"></i>'
    });
}
    // :: 8.0 Tooltip Active Code
    if ($.fn.tooltip) {
        $('[data-toggle="tooltip"]').tooltip()
    }

    // :: 9.0 Prevent Default a Click
    $('a[href="#"]').on('click', function ($) {
        $.preventDefault();
    });

    // :: 10.0 Wow Active Code
    if (browserWindow.width() > 767) {
        new WOW().init();
    }

    // :: 11.0 niceScroll Active Code
    if ($.fn.niceScroll) {
        $("#treadingPost").niceScroll();
    }


    // :: 12.0 Toggler Active Code
    $('#toggler').on('click', function () {
        treadingPost.toggleClass('on');
    });
    $('.close-icon').on('click', function () {
        treadingPost.removeClass('on');
    });
  
})(jQuery);



function hidePreloader(duration = 3000) {
    const preloader = document.getElementById("preloader");

    if (!preloader) return;

    setTimeout(() => {
      preloader.style.opacity = "0";
      preloader.style.transition = "opacity 0.5s ease";

      setTimeout(() => {
        preloader.style.display = "none";
      }, 500); // الوقت ديال fade-out
    }, duration); // المدة قبل مايخفي preloader (مثلاً 3000 = 3 ثواني)
  }

  // تنادي على الفنكسيون بعد ما تحمل الصفحة
  window.addEventListener("load", () => {
    hidePreloader(1000); // تقدر تبدل الرقم
  });




let cart = [];
let selectedLatLng = null;
let restaurantLatLng = [30.347447, -9.492622];
let map, customerMarker;

const arabicPhrases = ["", ""];
let currentIndex = 0;
const arabicText = document.getElementById("arabic-text");

function updateArabicText() {
  arabicText.textContent = arabicPhrases[currentIndex];
  currentIndex = (currentIndex + 1) % arabicPhrases.length;
}

updateArabicText();
setInterval(updateArabicText, 1600);

// ✅ إضافة منتج للسلة
function addToCart(name, price, image) {
  let item = cart.find(i => i.name === name);
  if (item) {
    item.qty += 1;
  } else {
    cart.push({ name, price, image, qty: 1 });
  }
  updateTotal();
  updateCartCount(); // 🆕 تحديث البادج

  // 🆕 إخفاء العناصر الزائدة عند الإضافة
  hideExtras();
}

// ✅ تحديث المجموع
function updateTotal() {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById("total").innerText = "Total: " + total + " DH";
}

// ✅ تحديث البادج ديال عدد العناصر + هتزاز
function updateCartCount() {
  const cartBadge = document.getElementById("cart-count");
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  if (totalItems > 0) {
    cartBadge.textContent = totalItems;
    cartBadge.style.display = "inline-block";

    // 🆕 أنيمشن الهتزاز
    cartBadge.classList.add("shake");
    setTimeout(() => cartBadge.classList.remove("shake"), 300);
  } else {
    cartBadge.style.display = "none";
  }
}

// ✅ عرض صفحة السلة فقط إذا فيها عناصر
function goToCartPage() {
  if (cart.length === 0) {
    alert("🛒 السلة فارغة");
    return;
  }

  document.getElementById("cart-page").style.display = "block";
  showCartItems();
}

// ✅ عرض العناصر داخل السلة
function showCartItems() {
  const container = document.getElementById("cart-items");
  container.innerHTML = "";

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}">
      <div class="info">
        <strong>${item.name} ×${item.qty}</strong>
        <p>${item.price * item.qty} DH</p>
        <div class="qty-controls">
          <button onclick="changeQty(${index}, 1)">+</button>
          <button onclick="changeQty(${index}, -1)">-</button>
          <button onclick="removeItem(${index})">🗑️</button>
        </div>
      </div>`;
    container.appendChild(div);
  });

  updateTotal();
}

// ✅ تغيير أو حذف العناصر
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  showCartItems();
  updateTotal();
  updateCartCount(); // 🆕 تحديث البادج
}

function removeItem(index) {
  cart.splice(index, 1);
  showCartItems();
  updateTotal();
  updateCartCount(); // 🆕 تحديث البادج
}

// ====== إضافة: تعريف نصف قطر التوصيل (بالمتر)
const deliveryRadius = 4000; // 1000 متر

// ====== إضافة: حساب المسافة بين نقطتين LatLng
function getDistance(latlng1, latlng2) {
  const R = 6371000; // نصف قطر الأرض بالمتر
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(latlng2.lat - latlng1.lat);
  const dLng = toRad(latlng2.lng - latlng1.lng);
  const lat1 = toRad(latlng1.lat);
  const lat2 = toRad(latlng2.lat);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  return d; // بالمتر
}

// ✅ عرض اختيارات الطلب (مطعم / توصيل)
function showOrderOptions() {
  if (cart.length === 0) {
    alert("🛒 السلة فارغة");
    return;
  }
  document.getElementById("order-options").style.display = "block";
}

// ✅ اختيار نوع الطلب
function selectOption(type) {
  if (cart.length === 0) {
    alert("🛒 السلة فارغة");
    return;
  }

  document.getElementById("order-options").style.display = "none";
  document.getElementById("order-button").style.display = "none";

  if (type === "delivery") {
    document.getElementById("map-container").style.display = "block";
    initMap();
  } else {
    document.getElementById("map-container").style.display = "none";
    sendWhatsAppOrder(); // مباشرة بدون خريطة
  }
}

// ✅ تهيئة الخريطة عند التوصيل فقط
function initMap() {
  if (window.mapInitialized) return;
  window.mapInitialized = true;

  map = L.map('map').setView(restaurantLatLng, 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  // أيقونة المطعم (دائرية بالصورة)
  const restaurantIcon = L.divIcon({
    html: '<div class="restaurant-icon"><img src="images/Logotime.png" alt="Restaurant"></div>',
    className: '',
    iconSize: [50, 50],
    iconAnchor: [25, 50]
  });

  L.marker(restaurantLatLng, { icon: restaurantIcon })
    .addTo(map)
    .bindPopup("📍 من فضلك حدد موقعك بدقة")
    .openPopup();

  // دائرة التوصيل
  L.circle(restaurantLatLng, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.2,
    radius: deliveryRadius
  }).addTo(map);

  // أيقونة الزبون (Font Awesome رجل واقف)
  const customerIcon = L.divIcon({
    html: '<div class="customer-icon"><i class="fas fa-male"></i></div>',
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  // حدث عند الضغط على الخريطة
  map.on("click", function (e) {
    const dist = getDistance(e.latlng, { lat: restaurantLatLng[0], lng: restaurantLatLng[1] });
    if (dist > deliveryRadius) {
      alert("🛑 الموقع خارج منطقة التوصيل");
      return;
    }

    selectedLatLng = e.latlng;

    if (customerMarker) {
      customerMarker.setLatLng(selectedLatLng);
    } else {
      customerMarker = L.marker(selectedLatLng, { icon: customerIcon })
        .addTo(map)
        .bindPopup("✅ يعطيك الصحة، الموقع تسجّل ")
        .openPopup();
    }

    document.getElementById("send-order-button").style.display = "block";
  });

  setTimeout(() => {
    map.invalidateSize();
  }, 300);
}

// ✅ إرسال الطلب للواتساب
function sendWhatsAppOrder() {
  if (document.getElementById("map-container").style.display === "block" && !selectedLatLng) {
    alert("🛑 من فضلك حدد موقعك على الخريطة أولاً.");
    return;
  }

  let message = "🍽️ **تفاصيل الطلب**\n\n";
  cart.forEach(item => {
    message += ` ✓ ${item.name} ×${item.qty}: ${item.price * item.qty} DH\n`;
  });

  message += `\n💰 **المجموع:** ${cart.reduce((sum, i) => sum + i.price * i.qty, 0)} DH`;

  if (selectedLatLng) {
    message += `\n\n📍 **الموقع:** https://www.google.com/maps?q=${selectedLatLng.lat},${selectedLatLng.lng}`;
    message += `\n🧾 راك فالأمان! غادي نجيو تال عند باب دارك  `;
  }

  const url = "https://wa.me/212687902690?text=" + encodeURIComponent(message);
  window.open(url, "_blank");

  document.getElementById("map-container").style.display = "none";
  document.getElementById("send-order-button").style.display = "none";
}

// ✅ إظهار/إخفاء المزيد من العناصر لكل كاتيجوري
function toggleItems(button) {
  const category = button.closest('.category');
  const extras = category.querySelectorAll('.item.extra');

  const isHidden = extras[0]?.classList.contains('hidden');

  extras.forEach(item => {
    item.classList.toggle('hidden');
  });

  button.textContent = isHidden ? 'إخفاء المزيد' : 'اكتشف المزيد';
}

// ✅ إخفاء العناصر الزائدة أوتوماتيكياً عند الضغط على أي منتج
function showCategory(categoryId) {
  const sections = document.querySelectorAll('.category-section');

  // نخفي كل الأقسام الأخرى
  sections.forEach(section => {
    if (section.id !== categoryId) {
      section.classList.remove('show');
      setTimeout(() => {
        section.style.display = 'none';
      }, 500);
    }
  });

  // نظهر القسم المختار
  const selectedSection = document.getElementById(categoryId);
  if (selectedSection) {
    selectedSection.style.display = 'block';

    setTimeout(() => {
      selectedSection.classList.add('show');
    }, 50);

    // نخلي القسم وسط الشاشة
    const topOffset = selectedSection.offsetTop - (window.innerHeight / 2) + (selectedSection.offsetHeight / 2);
    window.scrollTo({
      top: topOffset,
      behavior: 'smooth'
    });

    // نخفي العناصر الزائدة
    selectedSection.querySelectorAll('.item.extra').forEach(extra => {
      extra.classList.add('hidden');
    });
    selectedSection.querySelectorAll('.show-more-btn').forEach(btn => {
      btn.textContent = 'اكتشف المزيد';
    });
  }
}

// ✅ إخفاء صفحة السلة
function hideCartPage() {
  document.getElementById("cart-page").style.display = "none";
}

// ✅ سلايدر تعليقات الزبناء
function initCustomerReviewsSlider() {
  const swiper = new Swiper('.mySwiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    grabCursor: true,
    direction: 'horizontal',
    rtl: false,
    breakpoints: {
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initCustomerReviewsSlider();
});

// ✅ تغيير اللغة
function switchLang(lang) {
  document.querySelectorAll('[data-fr]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) el.textContent = text;
  });
}







