(function () {
  const overlay = document.getElementById("overlay");
  const closeBtn = document.getElementById("closeBtn");
  const overlayPanel = overlay?.querySelector(".panel");
  const body = document.body;
  const cards = document.querySelectorAll(".card");
  const logoCards = document.querySelectorAll(".card-logo");
  const lang = document.documentElement.lang || "bs";
  const aiNote = document.getElementById("aiNote");
  let lockedScrollY = 0;
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

  function setShareFabHidden(hidden) {
    document.dispatchEvent(
      new CustomEvent("sharefab:visibility", {
        detail: { hidden },
      }),
    );
  }

  function isDirectCardAction(target) {
    return Boolean(target?.closest?.(".card-direct-link"));
  }

  function lockPageScroll() {
    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    body.classList.add("overlay-open");
    body.style.position = "fixed";
    body.style.top = `-${lockedScrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
  }

  function unlockPageScroll() {
    body.classList.remove("overlay-open");
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    window.scrollTo(0, lockedScrollY);
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
    const isIdentity = card.classList.contains("card--identity");
    const isLegacy = card.classList.contains("card--legacy");
    const isMostWanted = card.classList.contains("card--most-wanted");
    const isDominance = card.classList.contains("card--dominance");
    const isLogoPackage = card.classList.contains("card--logo-package");

    overlayPanel?.classList.toggle("panel--identity", isIdentity);
    overlayPanel?.classList.toggle("panel--legacy", isLegacy);
    overlayPanel?.classList.toggle("panel--most-wanted", isMostWanted);
    overlayPanel?.classList.toggle("panel--dominance", isDominance);
    overlayPanel?.classList.toggle("panel--logo-package", isLogoPackage);

    if (isIdentity) stripe.classList.add("identity");
    else if (isLegacy) stripe.classList.add("legacy");
    else if (isMostWanted) stripe.classList.add("wanted");
    else if (isDominance) stripe.classList.add("dominance");
    else if (isLogoPackage) stripe.classList.add("logo");
    else if (lower.includes("basic") || lower.includes("starter"))
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
          '<svg width="18" height="18" viewBox="0 0 24 24" style="margin-top:3px;flex:0 0 18px;color:inherit" aria-hidden><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><div><div>' +
          f +
          "</div></div>";
        list.appendChild(li);
      });

    overlay.scrollTop = 0;
    if (overlayPanel) {
      overlayPanel.scrollTop = 0;
    }

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    lockPageScroll();
    setShareFabHidden(true);

    requestAnimationFrame(() => {
      overlay.scrollTop = 0;
      if (overlayPanel) {
        overlayPanel.scrollTop = 0;
      }
    });

    closeBtn?.focus();
  }

  function closeOverlay(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    overlay?.classList.remove("open");
    overlay?.setAttribute("aria-hidden", "true");
    unlockPageScroll();
    setShareFabHidden(false);
  }

  [...cards, ...logoCards].forEach((card) => {
    card.addEventListener("click", (e) => {
      if (isDirectCardAction(e.target)) return;
      openWith(card);
    });
    card.addEventListener("keydown", (e) => {
      if (isDirectCardAction(e.target)) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openWith(card);
      }
    });
  });

  closeBtn?.addEventListener("click", closeOverlay);
  closeBtn?.addEventListener("touchend", closeOverlay, { passive: false });
  overlayPanel?.addEventListener("click", (e) => e.stopPropagation());
  overlay?.addEventListener(
    "click",
    (e) => e.target === overlay && closeOverlay(e),
  );
  document.addEventListener(
    "keydown",
    (e) => e.key === "Escape" && closeOverlay(),
  );

  const contactBtn = document.getElementById("contactBtn");
  if (contactBtn) {
    contactBtn.addEventListener("click", () => {
      const name = document.getElementById("overlayName")?.textContent || "";
      const price = document.getElementById("overlayPrice")?.textContent || "";

      let message = "";

      if (lang === "en") {
        message =
          "Hello, I would like to book the " +
          name +
          " package" +
          (price ? " (" + price + ")" : "") +
          ". Please contact me with the next steps.";
      } else if (lang === "de") {
        message =
          "Hallo, ich möchte gerne das Paket " +
          name +
          (price ? " (" + price + ")" : "") +
          " buchen. Bitte melden Sie sich bei mir mit den nächsten Schritten.";
      } else {
        message =
          "Pozdrav, želim rezervisati paket " +
          name +
          (price ? " (" + price + ")" : "") +
          ". Molim vas da mi pošaljete naredne korake.";
      }

      window.open(
        "https://wa.me/4917682183126?text=" + encodeURIComponent(message),
        "_blank",
        "noopener",
      );
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
      langMenu.addEventListener("click", (e) => {
        if (e.target === langMenu) {
          closeLangMenu();
        } else {
          e.stopPropagation();
        }
      });
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
      const delta = current - lastScroll;
      const isMenuOpen = langEl.classList.contains("is-open");

      if (window.innerWidth <= 768) {
        if (!isMenuOpen && current > lastScroll && current > 50) {
          langEl.classList.add("hidden");
        } else {
          langEl.classList.remove("hidden");
        }
      } else {
        if (isMenuOpen || current <= 40 || delta < -4) {
          langEl.classList.remove("hidden");
        } else if (delta > 4 && current > 120) {
          langEl.classList.add("hidden");
        }
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

  const revealTargets = document.querySelectorAll(
    ".hero, .about, .package-block-header, .card, .project-card, .redesign, .services-info, .process-step, .stat-item, .logo-link, .footer, .fb-parallax-section-inner",
  );

  if (revealTargets.length) {
    document.body.classList.add("js-motion");

    revealTargets.forEach((element, elementIndex) => {
      element.classList.add("reveal-luxury");
      let delay = Math.min(elementIndex * 45, 220);

      if (
        element.classList.contains("card") &&
        element.closest(".package-block--dominance")
      ) {
        delay += 120;
      }

      element.style.transitionDelay = `${delay}ms`;
    });

    const heroSection = document.querySelector(".hero");
    heroSection?.classList.add("is-visible");

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.18,
          rootMargin: "0px 0px -8% 0px",
        },
      );

      revealTargets.forEach((element) => {
        if (!element.classList.contains("is-visible")) {
          revealObserver.observe(element);
        }
      });
    } else {
      revealTargets.forEach((element) => element.classList.add("is-visible"));
    }
  }

  (function initShareFab() {
    const shareFab = document.getElementById("shareFab");
    if (!shareFab) return;

    const shareTrigger = document.getElementById("shareFabTrigger");
    const shareBackdrop = document.getElementById("shareFabBackdrop");
    const shareOrbit = document.getElementById("shareFabOrbit");
    const shareItems = shareFab.querySelectorAll("[data-share-item]");
    let isOpen = false;
    let isHidden = false;

    function syncFabInteractivity(hidden) {
      if (hidden) {
        shareTrigger?.setAttribute("tabindex", "-1");
      } else {
        shareTrigger?.removeAttribute("tabindex");
      }

      shareItems.forEach((item) => {
        if (hidden) {
          item.setAttribute("tabindex", "-1");
        } else {
          item.removeAttribute("tabindex");
        }
      });
    }

    function setShareFabVisibility(hidden) {
      if (isHidden === hidden) return;

      if (hidden && isOpen) {
        setShareOpen(false);
      }

      isHidden = hidden;
      shareFab.classList.toggle("is-hidden", hidden);
      shareFab.setAttribute("aria-hidden", hidden ? "true" : "false");
      syncFabInteractivity(hidden);
      enforceIndependentPin();
    }

    function enforceIndependentPin() {
      const isMobile = window.innerWidth <= 768;
      const navEl = document.querySelector(".lang-select-horizontal");
      const navMenuOpen = navEl && navEl.classList.contains("is-open");
      const computed = window.getComputedStyle(shareFab);
      const desktopBottom =
        computed.getPropertyValue("--share-fab-bottom-desktop").trim() ||
        "24px";
      const mobileBottom =
        computed.getPropertyValue("--share-fab-bottom-mobile").trim() ||
        "calc(16px + env(safe-area-inset-bottom, 0px))";
      const set = (prop, val) =>
        shareFab.style.setProperty(prop, val, "important");
      set("position", "fixed");
      set("left", "auto");
      set("right", isMobile ? "16px" : "24px");
      set("top", "auto");
      set("bottom", isMobile ? mobileBottom : desktopBottom);
      set("z-index", "2147483000");
      set("opacity", navMenuOpen ? "0" : "1");
      set("visibility", navMenuOpen ? "hidden" : "visible");
      set("display", "block");
      shareFab.style.overflow = "visible";
      shareFab.style.pointerEvents =
        !isHidden && isOpen && !navMenuOpen ? "auto" : "none";
    }

    function updateItemStagger(openState) {
      shareItems.forEach((item, index) => {
        const stagger = openState
          ? index * 48
          : (shareItems.length - index - 1) * 34;
        item.style.transitionDelay = `${stagger}ms`;
      });
    }

    function setShareOpen(openState) {
      if (isOpen === openState) return;

      isOpen = openState;
      updateItemStagger(openState);
      shareFab.classList.toggle("is-open", openState);
      document.body.classList.toggle("share-fab-open", openState);
      enforceIndependentPin();

      shareTrigger?.setAttribute("aria-expanded", openState ? "true" : "false");
      shareTrigger?.setAttribute(
        "aria-label",
        openState ? "Share-Menü schließen" : "Share-Menü öffnen",
      );
      shareOrbit?.setAttribute("aria-hidden", openState ? "false" : "true");

      if (shareBackdrop) {
        shareBackdrop.tabIndex = openState ? 0 : -1;
      }
    }

    shareTrigger?.addEventListener("click", (event) => {
      event.stopPropagation();
      setShareOpen(!isOpen);
    });

    shareBackdrop?.addEventListener("click", () => {
      setShareOpen(false);
      shareTrigger?.focus();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen) {
        setShareOpen(false);
        shareTrigger?.focus();
      }
    });

    shareItems.forEach((item) => {
      item.addEventListener("click", () => {
        setShareOpen(false);
      });
    });

    document.addEventListener("sharefab:visibility", (event) => {
      setShareFabVisibility(Boolean(event.detail?.hidden));
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 0) {
        setShareOpen(false);
      }
      enforceIndependentPin();
    });

    let pinTicking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (pinTicking) return;
        pinTicking = true;
        window.requestAnimationFrame(() => {
          enforceIndependentPin();
          pinTicking = false;
        });
      },
      { passive: true },
    );

    window.addEventListener("pageshow", enforceIndependentPin);
    window.addEventListener("orientationchange", enforceIndependentPin);

    if (shareFab.parentElement !== document.body) {
      document.body.appendChild(shareFab);
    }

    syncFabInteractivity(false);
    enforceIndependentPin();

    const navWatcher = document.querySelector(".lang-select-horizontal");
    if (navWatcher) {
      new MutationObserver(enforceIndependentPin).observe(navWatcher, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }
  })();

  /* ── Hero video subtle scroll parallax ────────────────── */
  (function () {
    const wrap = document.querySelector(".hero-video-wrap");
    if (!wrap || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    /* skip parallax on mobile — avoids layout bugs on small screens */
    if (window.innerWidth <= 768) return;

    let ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          /* re-check width on each frame in case of orientation change */
          if (window.innerWidth <= 768) {
            wrap.style.transform = "";
            ticking = false;
            return;
          }
          const rect = wrap.getBoundingClientRect();
          const viewH = window.innerHeight;
          /* only animate while section is visible */
          if (rect.bottom > 0 && rect.top < viewH) {
            const progress = -rect.top / viewH; /* 0 at top, ~1 at bottom */
            const shift = Math.max(-30, Math.min(30, progress * 28));
            wrap.style.transform = "translateY(" + shift + "px)";
          }
          ticking = false;
        });
      },
      { passive: true },
    );
  })();

  (function initCinematicTitles() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const titleEls = document.querySelectorAll(
      ".cinematic-title[data-cinematic-text]",
    );
    if (!titleEls.length) return;

    const vectors = [
      { x: -180, y: -110, z: 320, rx: -38, ry: 22, angle: -18 },
      { x: 168, y: -94, z: 260, rx: 28, ry: -18, angle: 22 },
      { x: -150, y: 86, z: 280, rx: 22, ry: 28, angle: 164 },
      { x: 176, y: 96, z: 340, rx: -24, ry: -24, angle: 198 },
      { x: -228, y: 12, z: 300, rx: -8, ry: 40, angle: 0 },
      { x: 224, y: -8, z: 300, rx: 8, ry: -40, angle: 180 },
      { x: -40, y: -144, z: 360, rx: -44, ry: 8, angle: -90 },
      { x: 34, y: 142, z: 320, rx: 40, ry: -10, angle: 90 },
    ];

    titleEls.forEach((titleEl) => {
      const sourceText =
        titleEl.dataset.cinematicText || titleEl.textContent || "";
      const text = sourceText.trim();
      if (!text || titleEl.dataset.cinematicReady === "true") return;

      titleEl.setAttribute("aria-label", text);
      titleEl.textContent = "";

      let letterIndex = 0;
      text.split(" ").forEach((word) => {
        const wordEl = document.createElement("span");
        wordEl.className = "cinematic-title__word";
        wordEl.setAttribute("aria-hidden", "true");

        [...word].forEach((char) => {
          const vector = vectors[letterIndex % vectors.length];
          const jitterX = ((letterIndex * 13) % 27) - 13;
          const jitterY = ((letterIndex * 17) % 23) - 11;
          const blur = 10 + (letterIndex % 4) * 2;
          const curveX = Math.round(vector.x * 0.28 + jitterX);
          const curveY = Math.round(vector.y * 0.32 + jitterY);
          const letterEl = document.createElement("span");

          letterEl.className = "cinematic-title__letter";
          letterEl.textContent = char;
          letterEl.style.setProperty("--letter-index", String(letterIndex));
          letterEl.style.setProperty("--from-x", `${vector.x + jitterX}px`);
          letterEl.style.setProperty("--from-y", `${vector.y + jitterY}px`);
          letterEl.style.setProperty("--from-z", `${vector.z}px`);
          letterEl.style.setProperty("--curve-x", `${curveX}px`);
          letterEl.style.setProperty("--curve-y", `${curveY}px`);
          letterEl.style.setProperty("--rot-x", `${vector.rx}deg`);
          letterEl.style.setProperty("--rot-y", `${vector.ry}deg`);
          letterEl.style.setProperty("--trail-angle", `${vector.angle}deg`);
          letterEl.style.setProperty("--letter-blur", `${blur}px`);
          letterEl.style.setProperty(
            "--start-scale",
            `${0.44 + (letterIndex % 3) * 0.08}`,
          );

          wordEl.appendChild(letterEl);
          letterIndex += 1;
        });

        titleEl.appendChild(wordEl);
      });

      titleEl.dataset.cinematicReady = "true";

      const panel = titleEl.closest("[data-cinematic-depth]");
      if (
        panel &&
        !prefersReducedMotion &&
        window.matchMedia("(pointer: fine)").matches
      ) {
        let rafId = 0;
        const reset = () => {
          panel.style.setProperty("--parallax-x", "0");
          panel.style.setProperty("--parallax-y", "0");
          titleEl.style.setProperty("--parallax-x", "0");
          titleEl.style.setProperty("--parallax-y", "0");
        };

        panel.addEventListener("pointermove", (event) => {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            const rect = panel.getBoundingClientRect();
            const px = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
            const py = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
            titleEl.style.setProperty("--parallax-x", px.toFixed(2));
            titleEl.style.setProperty("--parallax-y", py.toFixed(2));
          });
        });

        panel.addEventListener("pointerleave", reset);
      }

      const host = panel || titleEl;
      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        host.classList.add("is-active");
        return;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            host.classList.add("is-active");
            obs.unobserve(entry.target);
          });
        },
        {
          threshold: 0.34,
          rootMargin: "0px 0px -12% 0px",
        },
      );

      observer.observe(host);
    });
  })();

  (function initFbCarousel() {
    var carousels = document.querySelectorAll("[data-fb-carousel]");
    if (!carousels.length) return;

    var reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    carousels.forEach(function (carousel) {
      var viewport = carousel.querySelector(".fb-carousel__viewport");
      var track = carousel.querySelector(".fb-carousel__track");
      var slides = Array.from(carousel.querySelectorAll(".fb-carousel__slide"));
      var prevBtn = carousel.querySelector(".fb-carousel__arrow--prev");
      var nextBtn = carousel.querySelector(".fb-carousel__arrow--next");
      var dotsContainer = carousel.querySelector(".fb-carousel__dots");
      var counter = carousel.querySelector(".fb-carousel__counter");

      if (!track || !slides.length) return;

      var total = slides.length;
      var current = 0;
      var autoplayTimer = null;
      var autoplayResumeTimer = null;
      var AUTOPLAY_DELAY = 2000;
      var AUTOPLAY_RESUME_DELAY = 2000;

      var dots = [];
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.className = "fb-carousel__dot";
        dot.setAttribute("role", "tab");
        dot.setAttribute("type", "button");
        dot.setAttribute("aria-label", "Slide " + (i + 1) + " von " + total);
        dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
        dot.addEventListener("click", function () {
          goTo(i);
          pauseAutoplayAfterInteraction();
        });
        if (dotsContainer) dotsContainer.appendChild(dot);
        dots.push(dot);
      });

      function goTo(index) {
        current = ((index % total) + total) % total;
        track.style.transform = "translateX(-" + current * 100 + "%)";
        updateUI();
      }

      function next() {
        goTo(current + 1);
      }
      function prev() {
        goTo(current - 1);
      }

      function updateUI() {
        dots.forEach(function (d, i) {
          d.classList.toggle("is-active", i === current);
          d.setAttribute("aria-selected", String(i === current));
        });

        if (counter) {
          counter.textContent = current + 1 + " / " + total;
        }

        slides.forEach(function (slide, i) {
          slide.setAttribute("aria-hidden", String(i !== current));
        });

        if (prevBtn) prevBtn.disabled = false;
        if (nextBtn) nextBtn.disabled = false;
      }

      if (prevBtn) {
        prevBtn.addEventListener("click", function () {
          prev();
          pauseAutoplayAfterInteraction();
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          next();
          pauseAutoplayAfterInteraction();
        });
      }

      viewport.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          prev();
          pauseAutoplayAfterInteraction();
        } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          next();
          pauseAutoplayAfterInteraction();
        } else if (e.key === "Home") {
          e.preventDefault();
          goTo(0);
          pauseAutoplayAfterInteraction();
        } else if (e.key === "End") {
          e.preventDefault();
          goTo(total - 1);
          pauseAutoplayAfterInteraction();
        }
      });

      var touchStartX = 0;
      var touchStartY = 0;
      var isSwiping = false;
      var isHorizontalSwipe = false;
      var SWIPE_THRESHOLD = 40;

      viewport.addEventListener(
        "touchstart",
        function (e) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          isSwiping = true;
          isHorizontalSwipe = false;
        },
        { passive: true },
      );

      viewport.addEventListener(
        "touchmove",
        function (e) {
          if (!isSwiping) return;
          var dxRaw = e.touches[0].clientX - touchStartX;
          var dyRaw = e.touches[0].clientY - touchStartY;
          var dx = Math.abs(dxRaw);
          var dy = Math.abs(dyRaw);

          if (!isHorizontalSwipe && dx > dy && dx > 6) {
            isHorizontalSwipe = true;
          }

          if (isHorizontalSwipe) {
            e.preventDefault();
            return;
          }

          if (dy > dx) {
            isSwiping = false;
          }
        },
        { passive: false },
      );

      viewport.addEventListener(
        "touchend",
        function (e) {
          if (!isSwiping && !isHorizontalSwipe) return;
          var diff = touchStartX - e.changedTouches[0].clientX;
          if (Math.abs(diff) >= SWIPE_THRESHOLD) {
            diff > 0 ? next() : prev();
            pauseAutoplayAfterInteraction();
          }
          isSwiping = false;
          isHorizontalSwipe = false;
        },
        { passive: true },
      );

      viewport.addEventListener(
        "touchcancel",
        function () {
          isSwiping = false;
          isHorizontalSwipe = false;
        },
        { passive: true },
      );

      var mouseStartX = 0;
      var isDragging = false;

      viewport.addEventListener("mousedown", function (e) {
        mouseStartX = e.clientX;
        isDragging = true;
        track.classList.add("is-dragging");
        e.preventDefault();
      });

      window.addEventListener("mouseup", function (e) {
        if (!isDragging) return;
        var diff = mouseStartX - e.clientX;
        if (Math.abs(diff) >= SWIPE_THRESHOLD) {
          diff > 0 ? next() : prev();
          pauseAutoplayAfterInteraction();
        }
        isDragging = false;
        track.classList.remove("is-dragging");
      });

      window.addEventListener("mousemove", function () {});

      function startAutoplay() {
        if (reducedMotion) return;
        clearInterval(autoplayTimer);
        autoplayTimer = setInterval(next, AUTOPLAY_DELAY);
      }

      function stopAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }

      function clearAutoplayResumeTimer() {
        if (!autoplayResumeTimer) return;
        clearTimeout(autoplayResumeTimer);
        autoplayResumeTimer = null;
      }

      function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
      }

      function pauseAutoplayAfterInteraction() {
        stopAutoplay();
        clearAutoplayResumeTimer();
        autoplayResumeTimer = window.setTimeout(function () {
          startAutoplay();
        }, AUTOPLAY_RESUME_DELAY);
      }

      carousel.addEventListener("mouseenter", function () {
        clearAutoplayResumeTimer();
        stopAutoplay();
      });
      carousel.addEventListener("mouseleave", function () {
        clearAutoplayResumeTimer();
        startAutoplay();
      });
      carousel.addEventListener("focusin", function () {
        clearAutoplayResumeTimer();
        stopAutoplay();
      });
      carousel.addEventListener("focusout", function () {
        clearAutoplayResumeTimer();
        startAutoplay();
      });

      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                startAutoplay();
              } else {
                stopAutoplay();
              }
            });
          },
          { threshold: 0.25 },
        );
        io.observe(carousel);
      } else {
        startAutoplay();
      }

      goTo(0);
    });
  })();

  (function initParallaxBg() {
    var sections = document.querySelectorAll(".fb-parallax-section");
    if (!sections.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    sections.forEach(function (section) {
      if (section.querySelector(".fb-parallax-bg")) return;
      var bg = document.createElement("div");
      bg.className = "fb-parallax-bg";
      bg.setAttribute("aria-hidden", "true");
      section.insertBefore(bg, section.firstChild);
    });

    var ticking = false;

    function updateParallax() {
      var vh = window.innerHeight;
      sections.forEach(function (section) {
        var bg = section.querySelector(".fb-parallax-bg");
        if (!bg) return;
        var rect = section.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= vh) return;
        var sectionMidY = rect.top + rect.height / 2;
        var distFromCenter = sectionMidY - vh / 2;

        var shift = -(distFromCenter * 0.28);
        bg.style.transform = "translateY(" + shift.toFixed(1) + "px)";
      });
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateParallax);
      },
      { passive: true },
    );

    updateParallax();
  })();

  (function initElectricEffect() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var sections = document.querySelectorAll(
      ".fb-parallax-section, .logo-link",
    );
    if (!sections.length) return;

    sections.forEach(function (section) {
      var pos = window.getComputedStyle(section).position;
      if (pos === "static") section.style.position = "relative";
      section.style.overflow = "hidden";
    });

    var allData = [];
    var rafId = 0;

    function generateBolt(x1, y1, x2, y2, disp, depth) {
      if (depth === 0)
        return [
          [x1, y1],
          [x2, y2],
        ];
      var mx = (x1 + x2) / 2 + (Math.random() - 0.5) * disp;
      var my = (y1 + y2) / 2 + (Math.random() - 0.5) * disp;
      return generateBolt(x1, y1, mx, my, disp * 0.52, depth - 1).concat(
        generateBolt(mx, my, x2, y2, disp * 0.52, depth - 1).slice(1),
      );
    }

    function spawnBolt(data) {
      var w = data.canvas.width,
        h = data.canvas.height;
      if (w === 0 || h === 0) return;
      var x1,
        y1,
        x2,
        y2,
        edge = Math.floor(Math.random() * 4),
        t = Math.random();
      if (edge === 0) {
        x1 = t * w;
        y1 = 0;
        x2 = Math.random() * w;
        y2 = h * (0.25 + Math.random() * 0.55);
      } else if (edge === 1) {
        x1 = t * w;
        y1 = h;
        x2 = Math.random() * w;
        y2 = h * (0.2 + Math.random() * 0.55);
      } else if (edge === 2) {
        x1 = 0;
        y1 = t * h;
        x2 = w * (0.25 + Math.random() * 0.55);
        y2 = Math.random() * h;
      } else {
        x1 = w;
        y1 = t * h;
        x2 = w * (0.2 + Math.random() * 0.55);
        y2 = Math.random() * h;
      }
      var disp = Math.min(w, h) * (0.13 + Math.random() * 0.13);
      var pts = generateBolt(x1, y1, x2, y2, disp, 7);
      data.bolts.push({
        pts: pts,
        alpha: 0.82 + Math.random() * 0.18,
        decay: 0.026 + Math.random() * 0.024,
        width: 0.9 + Math.random() * 1.3,
        isMain: true,
      });
      if (Math.random() > 0.35) {
        var bi = Math.floor(pts.length * (0.3 + Math.random() * 0.35)),
          mp = pts[bi];
        data.bolts.push({
          pts: generateBolt(
            mp[0],
            mp[1],
            mp[0] + (Math.random() - 0.5) * w * 0.32,
            mp[1] + (Math.random() - 0.5) * h * 0.28,
            disp * 0.46,
            5,
          ),
          alpha: 0.45 + Math.random() * 0.3,
          decay: 0.044 + Math.random() * 0.028,
          width: 0.35 + Math.random() * 0.55,
          isMain: false,
        });
      }
      startLoop();
    }

    function scheduleSpawn(data) {
      setTimeout(
        function () {
          if (data.active) spawnBolt(data);
          scheduleSpawn(data);
        },
        700 + Math.random() * 1000,
      );
    }

    function resizeCanvas(data) {
      data.canvas.width = data.section.offsetWidth;
      data.canvas.height = data.section.offsetHeight;
    }

    sections.forEach(function (section) {
      var canvas = document.createElement("canvas");
      canvas.className = "fb-electric-canvas";
      canvas.setAttribute("aria-hidden", "true");
      section.appendChild(canvas);
      var data = {
        canvas: canvas,
        section: section,
        bolts: [],
        active: false,
        spawnerStarted: false,
      };
      allData.push(data);

      /* Defer resize so the footer has its final dimensions on all devices */
      requestAnimationFrame(function () {
        resizeCanvas(data);
      });

      if ("IntersectionObserver" in window) {
        new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              data.active = entry.isIntersecting;
              /* Guard: only start one spawner loop per section ever */
              if (data.active && !data.spawnerStarted) {
                data.spawnerStarted = true;
                scheduleSpawn(data);
              }
            });
          },
          { threshold: 0.01 },
        ).observe(section);
      } else {
        data.active = true;
        data.spawnerStarted = true;
        scheduleSpawn(data);
      }
    });

    window.addEventListener(
      "resize",
      function () {
        allData.forEach(resizeCanvas);
      },
      { passive: true },
    );

    function drawBolt(ctx, bolt) {
      if (!bolt.pts.length) return;
      ctx.save();
      ctx.globalAlpha = bolt.alpha;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      ctx.strokeStyle = bolt.isMain
        ? "rgba(12,203,236,0.35)"
        : "rgba(100,220,255,0.20)";
      ctx.lineWidth = bolt.isMain ? bolt.width * 6 : bolt.width * 3;
      ctx.beginPath();
      ctx.moveTo(bolt.pts[0][0], bolt.pts[0][1]);
      for (var i = 1; i < bolt.pts.length; i++)
        ctx.lineTo(bolt.pts[i][0], bolt.pts[i][1]);
      ctx.stroke();

      ctx.strokeStyle = bolt.isMain ? "#0ccbec" : "rgba(120,230,255,0.75)";
      ctx.lineWidth = bolt.width;
      ctx.beginPath();
      ctx.moveTo(bolt.pts[0][0], bolt.pts[0][1]);
      for (var j = 1; j < bolt.pts.length; j++)
        ctx.lineTo(bolt.pts[j][0], bolt.pts[j][1]);
      ctx.stroke();

      if (bolt.isMain) {
        ctx.strokeStyle = "rgba(255,255,255,0.80)";
        ctx.lineWidth = bolt.width * 0.22;
        ctx.beginPath();
        ctx.moveTo(bolt.pts[0][0], bolt.pts[0][1]);
        for (var k = 1; k < bolt.pts.length; k++)
          ctx.lineTo(bolt.pts[k][0], bolt.pts[k][1]);
        ctx.stroke();
      }
      ctx.restore();
    }

    function startLoop() {
      if (rafId) return;
      rafId = requestAnimationFrame(loop);
    }

    function loop() {
      var anyAlive = false;
      allData.forEach(function (data) {
        data.bolts = data.bolts.filter(function (b) {
          return b.alpha > 0.01;
        });
        if (!data.bolts.length) {
          var ctx = data.canvas.getContext("2d");
          if (ctx) ctx.clearRect(0, 0, data.canvas.width, data.canvas.height);
          return;
        }
        anyAlive = true;
        var ctx = data.canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, data.canvas.width, data.canvas.height);
        data.bolts.forEach(function (bolt) {
          drawBolt(ctx, bolt);
          bolt.alpha -= bolt.decay;
        });
      });
      if (anyAlive) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = 0;
      }
    }
  })();
})();
