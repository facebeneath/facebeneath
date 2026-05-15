"use strict";

const slides = document.querySelectorAll(".hero-slide");
const dotsEl = document.getElementById("slider-dots");
let current = 0;
let sliderTimer;

function goToSlide(n) {
  slides[current].classList.remove("active");
  current = (n + slides.length) % slides.length;
  slides[current].classList.add("active");
  syncDots();
}

function syncDots() {
  if (!dotsEl) return;
  dotsEl.querySelectorAll(".hero-dot").forEach((d, i) => {
    d.classList.toggle("active", i === current);
    d.setAttribute("aria-pressed", i === current ? "true" : "false");
  });
}

function buildDots() {
  if (!dotsEl || !slides.length) return;
  slides.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.className = "hero-dot" + (i === 0 ? " active" : "");
    btn.setAttribute("aria-label", "Slajd " + (i + 1));
    btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    btn.addEventListener("click", () => {
      clearInterval(sliderTimer);
      goToSlide(i);
      startTimer();
    });
    dotsEl.appendChild(btn);
  });
}

function startTimer() {
  sliderTimer = setInterval(() => goToSlide(current + 1), 5500);
}

const navbar = document.getElementById("navbar");

function onScroll() {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 60);
  updateActiveLink();
}

const navLinks = document.querySelectorAll(".nav-link");
const sections = Array.from(document.querySelectorAll("section[id]"));

function updateActiveLink() {
  const scrollY = window.scrollY + 120;
  let active = null;

  for (const sec of sections) {
    if (scrollY >= sec.offsetTop) active = sec.id;
    else break;
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === "#" + active);
  });
}

const hamburger = document.getElementById("nav-hamburger");
const navMenu = document.getElementById("nav-menu");

function initHamburger() {
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    hamburger.classList.toggle("active", open);
    hamburger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  navMenu.querySelectorAll(".nav-link, .nav-cta").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("open")) closeMenu();
  });
}

function closeMenu() {
  navMenu.classList.remove("open");
  hamburger.classList.remove("active");
  hamburger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -48px 0px" },
  );

  els.forEach((el) => io.observe(el));
}

function initStagger() {
  const groups = [".services-grid .service-card", ".brand-grid .brand-item"];
  groups.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.style.transitionDelay = i * 0.1 + "s";
    });
  });
}

function countUp(el, target, duration) {
  const start = performance.now();
  const update = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const val = Math.floor(t * target);
    el.textContent = val;
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const wrap = document.querySelector(".suppliers-stats");
  if (!wrap) return;

  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      wrap.querySelectorAll(".stat-number[data-target]").forEach((el) => {
        const target = parseInt(el.dataset.target, 10);
        delete el.dataset.target;
        countUp(el, target, 1800);
      });
    },
    { threshold: 0.3 },
  );

  io.observe(wrap);
}

function initForm() {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#cf-name");
    const phone = form.querySelector("#cf-phone");

    if (!name.value.trim() || name.value.trim().length < 2) {
      showFeedback("Unesite Vaše ime (min. 2 znaka).", "error");
      name.focus();
      return;
    }
    if (!phone.value.trim()) {
      showFeedback("Unesite broj telefona.", "error");
      phone.focus();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    const label = btn.querySelector(".btn-label");
    btn.disabled = true;
    label.textContent = "Šalje se…";

    setTimeout(() => {
      showFeedback(
        "Vaš upit je uspješno poslan! Kontaktiraćemo Vas uskoro.",
        "success",
      );
      label.textContent = "Pošalji upit";
      btn.disabled = false;
      form.reset();
    }, 1600);
  });

  function showFeedback(msg, type) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className = "form-note " + type;
    setTimeout(() => {
      feedback.textContent = "";
      feedback.className = "form-note";
    }, 5000);
  }
}

function initGallerySlider() {
  if (window.innerWidth > 640) return;

  const wrap = document.querySelector(".gallery-slider-wrap");
  const grid = document.getElementById("brand-grid");
  const dotsEl = document.getElementById("gallery-dots");
  if (!wrap || !grid || !dotsEl) return;

  const items = Array.from(grid.querySelectorAll(".brand-item"));
  if (items.length < 2) return;

  grid.classList.remove("reveal");
  grid.style.opacity = "1";
  grid.style.transform = "translateX(0)";
  grid.style.transition = "none";

  grid.classList.add("is-slider");

  let idx = 0;
  let autoTimer;
  let startX = 0;
  let startY = 0;
  let diffX = 0;
  let diffY = 0;
  let isDragging = false;
  let lockAxis = null;

  items.forEach(function (_, i) {
    const btn = document.createElement("button");
    btn.className = "gallery-slider-dot" + (i === 0 ? " active" : "");
    btn.setAttribute("aria-label", "Slika " + (i + 1));
    btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    btn.addEventListener("click", function () {
      stopAuto();
      goTo(i);
      startAuto();
    });
    dotsEl.appendChild(btn);
  });

  function goTo(n) {
    idx = (n + items.length) % items.length;
    grid.style.transition = "transform 0.45s ease-in-out";
    grid.style.transform = "translateX(-" + idx * 100 + "%)";
    dotsEl.querySelectorAll(".gallery-slider-dot").forEach(function (d, i) {
      const active = i === idx;
      d.classList.toggle("active", active);
      d.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function startAuto() {
    autoTimer = setInterval(function () {
      goTo(idx + 1);
    }, 3500);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  wrap.addEventListener(
    "touchstart",
    function (e) {
      stopAuto();
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      diffX = 0;
      diffY = 0;
      isDragging = true;
      lockAxis = null;

      grid.style.transition = "none";
    },
    { passive: true },
  );

  wrap.addEventListener(
    "touchmove",
    function (e) {
      if (!isDragging) return;
      diffX = e.touches[0].clientX - startX;
      diffY = e.touches[0].clientY - startY;

      if (!lockAxis && (Math.abs(diffX) > 6 || Math.abs(diffY) > 6)) {
        lockAxis = Math.abs(diffX) >= Math.abs(diffY) ? "h" : "v";
      }

      if (lockAxis === "h") {
        e.preventDefault();

        const offset = idx * 100;
        grid.style.transform =
          "translateX(calc(-" + offset + "% + " + diffX + "px))";
      }
    },
    { passive: false },
  );

  wrap.addEventListener(
    "touchend",
    function () {
      if (!isDragging) return;
      isDragging = false;

      if (lockAxis === "h" && Math.abs(diffX) > 40) {
        goTo(diffX < 0 ? idx + 1 : idx - 1);
      } else {
        grid.style.transition = "transform 0.35s ease-in-out";
        grid.style.transform = "translateX(-" + idx * 100 + "%)";
      }

      lockAxis = null;
      startAuto();
    },
    { passive: true },
  );

  startAuto();
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

function initParticles() {
  const container = document.getElementById("chiptuning-particles");
  if (!container) return;

  if (!document.getElementById("particle-style")) {
    const s = document.createElement("style");
    s.id = "particle-style";
    s.textContent = `
      @keyframes p-float {
        0%,100% { transform: translateY(0) scale(1);             opacity: 0.35; }
        33%      { transform: translateY(-32px) scale(1.25);      opacity: 0.8;  }
        66%      { transform: translateY(18px) translateX(12px) scale(0.85); opacity: 0.5; }
      }
    `;
    document.head.appendChild(s);
  }

  for (let i = 0; i < 22; i++) {
    const p = document.createElement("div");
    const size = (Math.random() * 2.5 + 1).toFixed(1);
    const dur = (Math.random() * 8 + 6).toFixed(1);
    const delay = (Math.random() * 6).toFixed(1);
    const alpha = (Math.random() * 0.45 + 0.1).toFixed(2);
    p.style.cssText = [
      "position:absolute",
      `width:${size}px`,
      `height:${size}px`,
      `background:rgba(200,16,46,${alpha})`,
      "border-radius:50%",
      `left:${(Math.random() * 100).toFixed(1)}%`,
      `top:${(Math.random() * 100).toFixed(1)}%`,
      `animation:p-float ${dur}s ease-in-out ${delay}s infinite`,
      `box-shadow:0 0 ${Math.round(Math.random() * 10 + 4)}px rgba(200,16,46,0.5)`,
    ].join(";");
    container.appendChild(p);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  buildDots();
  startTimer();
  initHamburger();
  initReveal();
  initStagger();
  initCounters();
  initForm();
  initParticles();
  initGallerySlider();
  onScroll();
});

window.addEventListener("scroll", onScroll, { passive: true });
