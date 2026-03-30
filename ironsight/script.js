const entryScreen = document.getElementById("entry-screen");
const site = document.getElementById("site");
const target = document.getElementById("enterTarget");
const skip = document.getElementById("skip");
const flash = document.getElementById("flash");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

target.addEventListener("click", (e) => {
  const rect = target.getBoundingClientRect();

  for (let i = 0; i < 120; i++) {
    const smoke = document.createElement("div");
    smoke.className = "smoke";

    const x = (Math.random() - 0.5) * window.innerWidth;
    const y = -Math.random() * window.innerHeight;

    smoke.style.setProperty("--x", `${x}px`);
    smoke.style.setProperty("--y", `${y}px`);

    smoke.style.left = `${rect.width / 2}px`;
    smoke.style.top = `${rect.height / 2}px`;

    target.appendChild(smoke);

    setTimeout(() => smoke.remove(), 2500);
  }
});

function enterSite() {
  document.body.classList.remove("entry-active");

  if (target) target.classList.add("hit");
  if (flash) flash.classList.add("active");
  if (entryScreen) entryScreen.classList.add("shake");

  setTimeout(() => {
    if (entryScreen) entryScreen.classList.add("exit");
  }, 200);

  setTimeout(() => {
    if (entryScreen) entryScreen.style.display = "none";
    if (site) {
      site.style.visibility = "visible";
      site.style.opacity = "1";
      site.style.pointerEvents = "auto";
    }
    document.body.style.overflowY = "auto";
  }, 900);
}

if (target) target.addEventListener("click", enterSite);
if (skip) skip.addEventListener("click", enterSite);
if (entryScreen) {
  entryScreen.addEventListener("click", () => {
    entryScreen.classList.add("exit");
    document.body.classList.remove("entry-active");
    site.style.visibility = "visible";
    site.style.opacity = "1";
    site.style.pointerEvents = "auto";
  });
}

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

function closeAllModals() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.style.display = "none";
  });
}

function resetPackages() {
  document.querySelectorAll(".package").forEach((pkg) => {
    pkg.classList.remove("active");
  });
}

function resetSafetyCards() {
  document.querySelectorAll(".safety-card").forEach((card) => {
    card.classList.remove("active");
    const content = card.querySelector(".safety-content");
    if (content) content.style.maxHeight = "0px";
  });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const targetId = link.getAttribute("href").slice(1);

    if (navLinks.classList.contains("active"))
      navLinks.classList.remove("active");

    closeAllModals();
    resetPackages();
    resetSafetyCards();

    if (targetId === "site") {
      if (entryScreen) {
        entryScreen.style.display = "flex";
        entryScreen.classList.remove("exit");
        document.body.classList.add("entry-active");
        site.style.visibility = "hidden";
        site.style.opacity = "0";
        site.style.pointerEvents = "none";
        window.scrollTo({ top: 0, behavior: "smooth" });

        if (target) target.classList.remove("hit");
        if (flash) flash.classList.remove("active");

        target.addEventListener("click", enterSite, { once: true });
        skip.addEventListener("click", enterSite, { once: true });
      }
      return;
    }

    if (targetId === "kontakt") {
      const kontaktSection = document.getElementById("kontakt");
      if (kontaktSection) kontaktSection.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (targetId === "pakete") {
      const paketeSection = document.getElementById("pakete");
      if (paketeSection) {
        paketeSection.scrollIntoView({ behavior: "smooth" });
        const firstPackage = paketeSection.querySelector(".package");
        if (firstPackage) firstPackage.classList.add("active");
      }
      return;
    }

    if (targetId === "booking") {
      const bookingModal = document.getElementById("bookingModal");
      if (bookingModal) bookingModal.style.display = "block";
      return;
    }
  });
});

document.querySelectorAll(".package").forEach((pkg) => {
  pkg.addEventListener("click", () => {
    pkg.classList.toggle("active");
    document.querySelectorAll(".package").forEach((p) => {
      if (p !== pkg) p.classList.remove("active");
    });
  });
});

document.querySelectorAll(".safety-card").forEach((card) => {
  const content = card.querySelector(".safety-content");

  card.addEventListener("click", () => {
    document.querySelectorAll(".safety-card").forEach((c) => {
      const cContent = c.querySelector(".safety-content");
      if (c !== card) {
        c.classList.remove("active");
        if (cContent) cContent.style.maxHeight = "0px";
      }
    });

    if (card.classList.contains("active")) {
      card.classList.remove("active");
      if (content) content.style.maxHeight = "0px";
    } else {
      card.classList.add("active");
      if (content) content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

const modals = document.querySelectorAll(".modal");

modals.forEach((modal) => {
  const closeBtn = modal.querySelector(".close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
});

window.addEventListener("click", (e) => {
  modals.forEach((modal) => {
    if (e.target === modal) modal.style.display = "none";
  });
});

const hero = document.querySelector(".hero");
const nextSection = document.querySelector(".section-next");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  if (hero) hero.style.backgroundPositionY = `${scrollY * 0.4}px`;
  if (nextSection) {
    const sectionTop = nextSection.offsetTop;
    const windowHeight = window.innerHeight;
    if (scrollY + windowHeight > sectionTop) {
      const offset = scrollY + windowHeight - sectionTop;
      nextSection.style.backgroundPositionY = `${-offset * 0.3}px`;
    }
  }
});

const scrollElements = document.querySelectorAll(".scroll-reveal");

function handleScrollReveal() {
  scrollElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight - 100 && rect.bottom > 0) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", handleScrollReveal);
window.addEventListener("load", handleScrollReveal);

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("click", () => item.classList.toggle("active"));
});

const statNumbers = document.querySelectorAll(".stat-number");
const statsSection = document.querySelector(".stats-section");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function formatStatValue(value, suffix) {
  return `${value}${suffix || ""}`;
}

function resetStatCounters() {
  statNumbers.forEach((stat) => {
    const suffix = stat.dataset.suffix || "";
    stat.textContent = formatStatValue(0, suffix);
    stat.dataset.running = "false";
  });
}

function animateStatCounter(stat, delay = 0) {
  const target = Number(stat.dataset.target || 0);
  const suffix = stat.dataset.suffix || "";

  if (Number.isNaN(target) || target <= 0) {
    stat.textContent = formatStatValue(target, suffix);
    return;
  }

  stat.dataset.running = "true";

  setTimeout(() => {
    const duration = 2000;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      stat.textContent = formatStatValue(current, suffix);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        stat.dataset.running = "false";
      }
    }

    requestAnimationFrame(update);
  }, delay);
}

if (statsSection && statNumbers.length) {
  resetStatCounters();

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!prefersReducedMotion) {
            statNumbers.forEach((stat, index) => {
              const isRunning = stat.dataset.running === "true";
              if (!isRunning) {
                animateStatCounter(stat, index * 120);
              }
            });
          } else {
            statNumbers.forEach((stat) => {
              const target = Number(stat.dataset.target || 0);
              const suffix = stat.dataset.suffix || "";
              stat.textContent = formatStatValue(target, suffix);
            });
          }
        } else {
          resetStatCounters();
        }
      });
    },
    { threshold: 0.4 },
  );

  statsObserver.observe(statsSection);
}

const bookingModal = document.getElementById("bookingModal");
const bookingButtons = document.querySelectorAll(
  'a[href="#booking"], .btn.primary',
);

bookingButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (bookingModal) bookingModal.style.display = "block";
  });
});

if (document.body.classList.contains("entry-active")) {
  navToggle.style.display = "none";
}

function enterSite() {
  document.body.classList.remove("entry-active");
  navToggle.style.display = "flex";
}

function enterSite() {
  document.body.classList.remove("entry-active");

  if (window.innerWidth <= 768) {
    navToggle.style.display = "flex";
  }

  if (target) target.classList.add("hit");
  if (flash) flash.classList.add("active");
  if (entryScreen) entryScreen.classList.add("shake");

  setTimeout(() => {
    if (entryScreen) entryScreen.classList.add("exit");
  }, 200);

  setTimeout(() => {
    if (entryScreen) entryScreen.style.display = "none";
    if (site) {
      site.style.visibility = "visible";
      site.style.opacity = "1";
      site.style.pointerEvents = "auto";
    }
    document.body.style.overflowY = "auto";
  }, 900);
}
