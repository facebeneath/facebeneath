const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const lightboxClose = document.getElementById("lightboxClose");
const galleryItems = document.querySelectorAll(".gallery-grid img");

if (lightbox && lightboxImg && galleryItems.length) {
  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      lightbox.style.display = "flex";
      lightboxImg.src = item.src;
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", () => {
      lightbox.style.display = "none";
    });
  }

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.style.display = "none";
    }
  });
}

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.style.display === "flex";
    mobileMenu.style.display = isOpen ? "none" : "flex";
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.style.display = "none";
    });
  });
}

const header = document.querySelector(".site-header");

if (header) {
  const mobileQuery = window.matchMedia("(max-width: 960px)");
  let lastScrollY = window.scrollY;
  let ticking = false;
  let isCollapsed = header.classList.contains("is-scrolled");

  const applyHeaderState = () => {
    ticking = false;
    if (!mobileQuery.matches) {
      if (isCollapsed) {
        header.classList.remove("is-scrolled");
        isCollapsed = false;
      }
      lastScrollY = window.scrollY;
      return;
    }

    const currentY = window.scrollY;
    const scrollingDown = currentY > lastScrollY;
    const pastThreshold = currentY > 10;

    const nextCollapsed = scrollingDown && pastThreshold;

    if (nextCollapsed !== isCollapsed) {
      header.classList.toggle("is-scrolled", nextCollapsed);
      isCollapsed = nextCollapsed;
    }

    lastScrollY = currentY;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(applyHeaderState);
    }
  };

  applyHeaderState();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", applyHeaderState);
}

const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  revealItems.forEach((item) => observer.observe(item));
}

const countUps = document.querySelectorAll(".count-up");

if (countUps.length) {
  const statsSection = document.querySelector(".stats-section");
  let hasRun = false;

  const runCountUps = () => {
    countUps.forEach((el) => {
      const target = parseFloat(el.dataset.target || "0");
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const suffix = el.dataset.suffix || "";
      const duration = 1200;
      const startTime = performance.now();

      const animate = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = target * progress;
        el.textContent = `${value.toFixed(decimals)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    });
  };

  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRun) {
            hasRun = true;
            runCountUps();
          }
        });
      },
      { threshold: 0.4 },
    );

    statsObserver.observe(statsSection);
  } else {
    runCountUps();
  }
}
