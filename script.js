(function () {
  const overlay = document.getElementById("overlay");
  const closeBtn = document.getElementById("closeBtn");
  const cards = document.querySelectorAll(".card");
  const logoCards = document.querySelectorAll(".card-logo");
  const lang = document.documentElement.lang || "bs";
  const aiNote = document.getElementById("aiNote");
  const hashTargets = new Set([
    "pakete",
    "paketi",
    "packages",
    "projekte",
    "projekti",
    "projects",
    "logo-design",
  ]);

  function scrollToHashTarget() {
    const hash = window.location.hash;
    if (!hash) return;

    const targetId = decodeURIComponent(hash.slice(1));
    if (!hashTargets.has(targetId)) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scrollToHashTarget, {
      once: true,
    });
  } else {
    scrollToHashTarget();
  }

  function openWith(card) {
    const name = card.dataset.name || "Package";
    const price = card.dataset.price || "";
    const tagline = card.dataset.tagline || "";
    const featuresRaw = card.dataset.features || "";
    const desc = card.querySelector(".desc")?.textContent?.trim() || tagline;

    document.getElementById("overlayName").textContent = name;
    document.getElementById("overlayPrice").textContent = price;
    document.getElementById("overlayTag").textContent = name;
    document.getElementById("overlayTagline").textContent = tagline;
    document.getElementById("overlayDesc").textContent = desc;

    const stripe = document.getElementById("overlayTag");
    stripe.className = "stripe";
    const lower = name.toLowerCase();

    if (lower.includes("basic") || lower.includes("starter"))
      stripe.classList.add("basic");
    else if (lower.includes("pro")) stripe.classList.add("pro");
    else if (lower.includes("extreme")) stripe.classList.add("extreme");

    const logoOnlyNote = overlay.querySelector(".logo-only-note");

    if (lower.includes("logo")) {
      aiNote && (aiNote.style.display = "block");
      logoOnlyNote && (logoOnlyNote.style.display = "block");
    } else {
      aiNote && (aiNote.style.display = "none");
      logoOnlyNote && (logoOnlyNote.style.display = "none");
    }

    const includedTitle = document.getElementById("includedTitle");
    const includedList = document.getElementById("includedList");

    const list = document.getElementById("overlayFeatures");
    list.innerHTML = "";
    featuresRaw
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((f) => {
        const li = document.createElement("li");
        li.innerHTML =
          '<svg width="18" height="18" viewBox="0 0 24 24" style="margin-top:3px;flex:0 0 18px" aria-hidden><path d="M20 6L9 17l-5-5" stroke="#d4a017" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><div><div>' +
          f +
          "</div></div>";
        list.appendChild(li);
      });

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    closeBtn.focus();
  }

  function closeOverlay() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }

  [...cards, ...logoCards].forEach((card) => {
    card.addEventListener("click", () => openWith(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openWith(card);
      }
    });
  });

  closeBtn?.addEventListener("click", closeOverlay);
  overlay?.addEventListener(
    "click",
    (e) => e.target === overlay && closeOverlay(),
  );
  document.addEventListener(
    "keydown",
    (e) => e.key === "Escape" && closeOverlay(),
  );

  const contactBtn = document.getElementById("contactBtn");
  if (contactBtn) {
    contactBtn.addEventListener("click", () => {
      const name = document.getElementById("overlayName")?.textContent || "";

      let subject = "";
      let body = "";

      if (lang === "en") {
        subject = "Inquiry: " + name + " package";
        body =
          "Hello,\n\nI would like to book this package: " +
          name +
          ".\n\nThank you.";
      } else if (lang === "de") {
        subject = "Anfrage: " + name + " Paket";
        body =
          "Guten Tag,\n\nIch möchte gerne dieses Paket buchen: " +
          name +
          ".\n\nVielen Dank.";
      } else {
        subject = "Upit: " + name + " paket";
        body =
          "Pozdrav,\n\nŽelio bih da uzmem ovaj paket: " + name + ".\n\nHvala.";
      }

      window.location.href =
        "mailto:facebeneath@aldindelic.de?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    });
  }

  const words = [
    "DESIGN.",
    "VISION.",
    "DEVELOPMENT.",
    "IDENTITY.",
    "LEGACY.",
    "DOMINANCE.",
    "FACEBENEATH.",
  ];

  const wordElement = document.getElementById("word");
  let index = 0;

  if (wordElement) {
    wordElement.textContent = words[0];
    wordElement.classList.add("show");

    setInterval(() => {
      wordElement.classList.remove("show");
      wordElement.classList.add("fade");

      setTimeout(() => {
        index = (index + 1) % words.length;
        wordElement.textContent = words[index];
        wordElement.classList.remove("fade");
        wordElement.classList.add("show");
      }, 800);
    }, 1900);
  }

  const typingText = "Dizajniram tvoju viziju!";
  const typingEl = document.getElementById("typing");
  let i = 0;
  const typeSpeed = 200;

  function typeLoop() {
    if (!typingEl) return;

    typingEl.textContent = typingText.slice(0, i);
    i++;

    if (i > typingText.length + 17) i = 0;
    setTimeout(typeLoop, typeSpeed);
  }

  typeLoop();

  (function () {
    const langEl = document.querySelector(".lang-select-horizontal");
    if (!langEl) return;

    const langToggle = langEl.querySelector(".lang-toggle");
    const langMenu = langEl.querySelector(".lang-menu");
    const closeOnClickLinks = langEl.querySelectorAll(
      ".mobile-menu-item, .lang-menu .lang-link",
    );
    const isMobileMenu = () => window.innerWidth <= 768;
    let lockedScrollY = 0;

    function lockBodyScroll() {
      lockedScrollY = window.scrollY || window.pageYOffset || 0;
      document.body.style.top = `-${lockedScrollY}px`;
      document.body.classList.add("mobile-menu-open");
    }

    function unlockBodyScroll() {
      const hadLock =
        document.body.classList.contains("mobile-menu-open") ||
        !!document.body.style.top;
      if (!hadLock) return;

      const restoreY = Math.abs(parseInt(document.body.style.top || "0", 10));
      document.body.classList.remove("mobile-menu-open");
      document.body.style.top = "";
      window.scrollTo(0, Number.isNaN(restoreY) ? lockedScrollY : restoreY);
    }

    function setBodyMenuState(isOpen) {
      if (isMobileMenu() && isOpen) {
        lockBodyScroll();
      } else {
        unlockBodyScroll();
      }
    }

    function closeLangMenu() {
      langEl.classList.remove("is-open");
      if (langToggle) langToggle.setAttribute("aria-expanded", "false");
      if (langMenu) langMenu.setAttribute("aria-hidden", "true");
      setBodyMenuState(false);
    }

    function toggleLangMenu() {
      const isOpen = langEl.classList.toggle("is-open");
      if (langToggle)
        langToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (langMenu)
        langMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
      setBodyMenuState(isOpen);
    }

    if (langToggle) {
      langToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleLangMenu();
      });
    }

    if (langMenu) {
      langMenu.addEventListener("click", (e) => e.stopPropagation());
    }

    closeOnClickLinks.forEach((link) => {
      link.addEventListener("click", () => closeLangMenu());
    });

    document.addEventListener("click", closeLangMenu);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLangMenu();
    });
    window.addEventListener("resize", () => {
      if (!isMobileMenu()) {
        unlockBodyScroll();
      }
    });

    let lastScroll = window.scrollY || 0;
    let ticking = false;

    function handleScroll() {
      const current = window.scrollY || 0;

      if (window.innerWidth <= 768) {
        if (current > lastScroll && current > 50) {
          langEl.classList.add("hidden");
        } else {
          langEl.classList.remove("hidden");
        }
      } else {
        langEl.classList.remove("hidden");
      }

      lastScroll = current <= 0 ? 0 : current;
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(handleScroll);
          ticking = true;
        }
      },
      { passive: true },
    );
  })();

  const counterTimers = new Map();

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const counters = entry.target.querySelectorAll(".stat-number");

        if (entry.isIntersecting) {
          counters.forEach((counter) => {
            if (counterTimers.has(counter)) {
              clearInterval(counterTimers.get(counter));
            }

            const target = parseInt(counter.getAttribute("data-target"));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
                counterTimers.delete(counter);
              } else {
                counter.textContent = Math.floor(current);
              }
            }, 16);

            counterTimers.set(counter, timer);
          });
        } else {
          counters.forEach((counter) => {
            if (counterTimers.has(counter)) {
              clearInterval(counterTimers.get(counter));
              counterTimers.delete(counter);
            }
            counter.textContent = "0";
          });
        }
      });
    },
    { threshold: 0.3 },
  );

  const statsContainer = document.querySelector(".stats-container");
  if (statsContainer) {
    statsObserver.observe(statsContainer);
  }
})();
