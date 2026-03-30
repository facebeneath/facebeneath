const pages = {
  relax: {
    title: "Relaxmassage",
    price: "30 min — 25€ · 60 min — 50€",
    desc: `Sanfte und beruhigende Ganzkörpermassage. Sie ist ideal zur Entspannung nach einem stressigen Tag, reduziert Verspannungen und verbessert den Schlaf. Enthält sanfte Dehnungstechniken und individuell angepassten Druck.`,
    image: "relax.jpg",
    features: [],
  },
  sport: {
    title: "Sportmassage",
    price: "30 min — 25€ · 60 min — 50€",
    desc: `Intensivere Massage, die sich auf die Muskeln konzentriert, die Sie beim Training am meisten beanspruchen. Hilft bei der Regeneration, löst verspannte Muskeln und verringert das Verletzungsrisiko. Empfohlen vor/nach Wettkämpfen oder intensivem Training.`,
    image: "sport.webp",
    features: [],
  },
  bein: {
    title: "Beinmassage",
    price: "30 min — 25€ · 60 min — 50€",
    desc: `Gezielte Massage von Beinen und Füßen. Verbessert die Durchblutung, reduziert Müdigkeit und Schwellungen. Ideal für Personen, die lange stehen, intensive Trainingseinheiten absolvieren oder häufig reisen.`,
    image: "bein.jpg",
    features: [],
  },
  sculpt: {
    title: "Anti-Falten Gesichtsmassage",
    price: "30 min — 40€",
    desc: `Diese exklusive Gesichtsbehandlung kombiniert Techniken aus Jawline Sculpting, Face Gym und Face Resculpting.
Durch gezielte manuelle Bewegungen werden Gesichtsmuskeln aktiviert, die Durchblutung verbessert und das Gewebe gestrafft.`,
    image: "antifalten.jpg",
    features: [
      "Sichtbar gestraffte Gesichtszüge",
      "Definierte Jawline & Wangenknochen",
      "Verbesserte Durchblutung und Hautglanz",
      "Entspannung der Gesichtsmuskulatur",
    ],
  },
};

const slides = document.querySelectorAll(".slide");
const texts = document.querySelectorAll(".slide-text");
let currentSlide = 0;

setInterval(() => {
  slides[currentSlide].classList.remove("active");
  texts[currentSlide].classList.remove("active");
  slides[currentSlide].classList.add("exit");

  currentSlide = (currentSlide + 1) % slides.length;

  slides[currentSlide].classList.add("active");
  texts[currentSlide].classList.add("active");

  slides.forEach((slide, idx) => {
    if (idx !== currentSlide) slide.classList.remove("exit");
  });
}, 3000);

const detail = document.getElementById("detail");
const titleEl = document.getElementById("detail-title");
const descEl = document.getElementById("detail-desc");
const priceEl = document.getElementById("detail-price");
const featuresEl = document.getElementById("detail-features");
const imageEl = document.getElementById("detail-image");
const backBtn = document.getElementById("back-btn");
const socialButtons = document.querySelector(".social-buttons");

document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", () => {
    const page = pages[card.dataset.id];
    if (!page) return;

    titleEl.textContent = page.title;
    descEl.textContent = page.desc;
    priceEl.textContent = page.price;
    imageEl.src = page.image;
    imageEl.alt = page.title;

    featuresEl.innerHTML = "";
    page.features.forEach((f) => {
      const span = document.createElement("span");
      span.className = "chip";
      span.textContent = f;
      featuresEl.appendChild(span);
    });

    detail.classList.add("open");
    detail.setAttribute("aria-hidden", "false");
    if (socialButtons) socialButtons.classList.add("hidden");
  });
});

function closeDetail() {
  detail.classList.remove("open");
  detail.setAttribute("aria-hidden", "true");
  if (socialButtons) socialButtons.classList.remove("hidden");
}

if (backBtn) {
  backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeDetail();
  });
}
detail.addEventListener("click", (e) => {
  if (e.target === detail) closeDetail();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && detail.classList.contains("open")) closeDetail();
});

const form = document.getElementById("booking-form");
const message = document.getElementById("form-message");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);

    message.textContent = "Formular wird gesendet...";
    message.className = "sending";
    message.style.opacity = 1;

    fetch(form.action, {
      method: form.method,
      body: data,
      headers: { Accept: "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          message.textContent =
            "Danke für Ihre Buchung! Wir werden uns bald bei Ihnen melden.";
          message.className = "success";
          form.reset();
        } else {
          message.textContent =
            "Ups, etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.";
          message.className = "error";
        }
        fadeOutMessage();
      })
      .catch(() => {
        message.textContent =
          "Ups, etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.";
        message.className = "error";
        fadeOutMessage();
      });
  });
}

function fadeOutMessage() {
  setTimeout(() => {
    let op = 1;
    const timer = setInterval(() => {
      if (op <= 0.05) {
        clearInterval(timer);
        message.style.opacity = 0;
        message.textContent = "";
      }
      message.style.opacity = op;
      op -= 0.05;
    }, 50);
  }, 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  const socialButtons = document.querySelector(".social-buttons");
  const menuImagesByHref = {
    "": "m1.jpg",
    "index.html": "m1.jpg",
    "video.html": "video.jpg",
    "galerie.html": "galery.jpg",
    "zertifikate.html": "zertifikat.jpg",
    "uber-mich.html": "forrest.webp",
  };

  const isMobileMenu = () => window.matchMedia("(max-width: 1024px)").matches;

  const setMenuBackground = (key) => {
    if (!navLinks || !isMobileMenu()) return;
    const image = menuImagesByHref[key] || menuImagesByHref[""];
    if (!image) return;
    navLinks.style.setProperty("--menu-bg-image", `url("${image}")`);
  };

  const getHrefKey = (href) => {
    if (!href) return "";
    try {
      const url = new URL(href, window.location.href);
      return url.pathname.split("/").pop();
    } catch {
      return "";
    }
  };

  const openMenu = () => {
    if (!navLinks || !hamburger) return;
    if (navLinks.classList.contains("open")) return;
    const currentPage = window.location.pathname.split("/").pop();
    setMenuBackground(currentPage);
    hamburger.classList.add("active");
    navLinks.classList.add("open");
    document.body.classList.add("menu-open");
    if (socialButtons) socialButtons.classList.add("hidden");

    navLinks.querySelectorAll("li").forEach((link, index) => {
      link.style.transitionDelay = `${index * 0.08}s`;
    });
  };

  const closeMenu = () => {
    if (!navLinks || !hamburger) return;
    navLinks.classList.remove("open");
    hamburger.classList.remove("active");
    document.body.classList.remove("menu-open");
    if (socialButtons) socialButtons.classList.remove("hidden");
  };

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      if (navLinks.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.addEventListener("click", (e) => {
      if (e.target === navLinks) closeMenu();
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      const hrefKey = getHrefKey(link.getAttribute("href"));
      link.addEventListener("click", () => setMenuBackground(hrefKey));
    });
  }
});

const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = lightbox.querySelector(".close");

  document.querySelectorAll(".galerija-wrapper img").forEach((img) => {
    img.addEventListener("click", () => {
      lightbox.style.display = "flex";
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = img.dataset.caption || "";
    });
  });

  if (closeBtn)
    closeBtn.addEventListener("click", () => (lightbox.style.display = "none"));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.style.display = "none";
  });
}

const slider = document.querySelector(".testimonials-slider");
const track = document.querySelector(".testimonials-track");
const testimonials = document.querySelectorAll(".testimonial");

let index = 0;
let autoSlideInterval = null;

function isMobile() {
  return window.innerWidth < 1024;
}

function slideTo(i) {
  const width = slider.offsetWidth;
  track.style.transform = `translateX(-${i * width}px)`;
}

function next() {
  index = (index + 1) % testimonials.length;
  slideTo(index);
}

function prev() {
  index = (index - 1 + testimonials.length) % testimonials.length;
  slideTo(index);
}

function startAutoSlide() {
  if (autoSlideInterval) return;
  autoSlideInterval = setInterval(next, 4000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = null;
}

function handleMode() {
  index = 0;
  slideTo(0);

  if (isMobile()) {
    startAutoSlide();
  } else {
    stopAutoSlide();
  }
}

window.addEventListener("resize", handleMode);

const nextBtn = document.getElementById("nextTestimonial");
const prevBtn = document.getElementById("prevTestimonial");

if (nextBtn) nextBtn.addEventListener("click", next);
if (prevBtn) prevBtn.addEventListener("click", prev);

handleMode();

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    } else {
      entry.target.classList.remove("visible");
    }
  });
}, observerOptions);

document
  .querySelectorAll(".scroll-reveal, .scroll-reveal-item")
  .forEach((el) => {
    observer.observe(el);
  });
