document.addEventListener("DOMContentLoaded", function () {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = document.querySelector(".close");

  document.querySelectorAll(".galerija-wrapper img").forEach((img) => {
    img.addEventListener("click", () => {
      lightbox.style.display = "flex";
      lightboxImg.src = img.src;
      lightboxCaption.textContent = img.dataset.caption || "Bild";
      document.body.style.overflow = "hidden";
    });
  });

  const closeLightbox = () => {
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
  };

  closeBtn.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.style.display === "flex") {
      closeLightbox();
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  lightbox.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (Math.abs(touchEndX - touchStartX) > 100) {
      closeLightbox();
    }
  });
});

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
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

  navLinks.querySelectorAll("li").forEach((link, index) => {
    link.style.transitionDelay = `${index * 0.08}s`;
  });
};

const closeMenu = () => {
  if (!navLinks || !hamburger) return;
  navLinks.classList.remove("open");
  hamburger.classList.remove("active");
  document.body.classList.remove("menu-open");
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

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("open")) {
      closeMenu();
    }
  });
}

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
