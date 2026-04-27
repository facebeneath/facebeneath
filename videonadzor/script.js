const header = document.querySelector(".header");
const parallaxSections = document.querySelectorAll(".parallax");
const mobileQuery = window.matchMedia("(max-width: 850px)");
let ticking = false;

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 30);
  requestParallaxUpdate();
});

window.addEventListener("resize", requestParallaxUpdate);

if (typeof mobileQuery.addEventListener === "function") {
  mobileQuery.addEventListener("change", requestParallaxUpdate);
} else if (typeof mobileQuery.addListener === "function") {
  mobileQuery.addListener(requestParallaxUpdate);
}

function requestParallaxUpdate() {
  if (ticking) {
    return;
  }

  ticking = true;
  window.requestAnimationFrame(() => {
    applyMobileParallax();
    ticking = false;
  });
}

function applyMobileParallax() {
  if (!mobileQuery.matches) {
    parallaxSections.forEach((section) => {
      section.style.backgroundPosition = "";
    });
    return;
  }

  parallaxSections.forEach((section) => {
    const speed = 0.32;
    const offset = (window.scrollY - section.offsetTop) * speed;
    section.style.backgroundPosition = `center calc(50% + ${offset}px)`;
  });
}

requestParallaxUpdate();

const heroSlides = document.querySelectorAll(".hero-bg-slide");
let heroSlideIndex = 0;
let heroSliderTimer = null;

function nextHeroSlide() {
  heroSlides[heroSlideIndex].classList.remove("active");
  heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
  heroSlides[heroSlideIndex].classList.add("active");
}

function startHeroSlider() {
  if (heroSlides.length <= 1 || heroSliderTimer) {
    return;
  }
  heroSliderTimer = window.setInterval(nextHeroSlide, 1500);
}

function stopHeroSlider() {
  if (!heroSliderTimer) {
    return;
  }
  window.clearInterval(heroSliderTimer);
  heroSliderTimer = null;
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopHeroSlider();
    return;
  }
  startHeroSlider();
});

startHeroSlider();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const fadeEls = document.querySelectorAll(".fade-in");

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

fadeEls.forEach((el) => fadeObserver.observe(el));

const hamburger = document.getElementById("hamburger");
const mainNav = document.getElementById("main-nav");

function openMenu() {
  mainNav.classList.add("open");
  hamburger.classList.add("open");
  hamburger.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  mainNav.classList.remove("open");
  hamburger.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
}

hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  if (mainNav.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

document.addEventListener("click", (e) => {
  if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
    closeMenu();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMenu();
    closeLightbox();
  }
});

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxBackdrop = document.getElementById("lightbox-backdrop");

let savedScrollY = 0;
let currentScale = 1;
let lastDist = null;

function openLightbox(src, alt) {
  savedScrollY = window.scrollY;
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  currentScale = 1;
  lightboxImg.style.transform = "scale(1)";
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox.classList.contains("open")) return;
  lightbox.classList.remove("open");
  document.body.style.overflow = "";

  setTimeout(() => {
    window.scrollTo({ top: savedScrollY, behavior: "instant" });
  }, 260);
}

document.querySelectorAll(".lightbox-trigger").forEach((img) => {
  img.addEventListener("click", () => openLightbox(img.src, img.alt));
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxBackdrop.addEventListener("click", closeLightbox);

lightboxImg.addEventListener(
  "touchstart",
  (e) => {
    if (e.touches.length === 2) {
      lastDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
    }
  },
  { passive: true },
);

lightboxImg.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length !== 2 || lastDist === null) return;
    e.preventDefault();
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY,
    );
    currentScale = Math.min(Math.max(currentScale * (dist / lastDist), 0.5), 5);
    lightboxImg.style.transform = `scale(${currentScale})`;
    lastDist = dist;
  },
  { passive: false },
);

lightboxImg.addEventListener(
  "touchend",
  () => {
    lastDist = null;
  },
  { passive: true },
);

const cookieBanner = document.getElementById("cookie-banner");
const cookieAccept = document.getElementById("cookie-accept");

if (cookieBanner && !localStorage.getItem("cookie-accepted")) {
  setTimeout(() => cookieBanner.classList.add("show"), 800);
}

if (cookieAccept) {
  cookieAccept.addEventListener("click", () => {
    localStorage.setItem("cookie-accepted", "1");
    cookieBanner.classList.remove("show");
  });
}
