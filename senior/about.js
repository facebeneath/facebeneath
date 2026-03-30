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
