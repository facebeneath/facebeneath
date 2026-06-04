(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    initHeroCanvas();
    initSideCanvases();
    initSectionCanvases();
    initScrollAnimations();
    initCounters();
    initPortfolioFilter();
    initTestimonials();
    initFAQ();
    initFileUpload();
    initQuoteForm();
    initContactForm();
    initCapabilityBars();
    initBackToTop();
    initChatWidget();
    initActiveNavLink();
    initSmoothScrollCTA();
  });

  function initNavbar() {
    const navbar = $("#navbar");
    const hamburger = $("#hamburger");
    const navMenu = $("#navMenu");

    if (!navbar) return;

    const onScroll = () => {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (hamburger && navMenu) {
      hamburger.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");
        hamburger.classList.toggle("open", isOpen);
        hamburger.setAttribute("aria-expanded", String(isOpen));
        document.body.style.overflow = isOpen ? "hidden" : "";
      });

      $$(".nav-link", navMenu).forEach((link) => {
        link.addEventListener("click", () => {
          navMenu.classList.remove("open");
          hamburger.classList.remove("open");
          hamburger.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });

      document.addEventListener("click", (e) => {
        if (
          navMenu.classList.contains("open") &&
          !navMenu.contains(e.target) &&
          !hamburger.contains(e.target)
        ) {
          navMenu.classList.remove("open");
          hamburger.classList.remove("open");
          hamburger.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      });
    }
  }

  function initActiveNavLink() {
    const sections = $$("section[id], footer");
    const navLinks = $$(".nav-link:not(.nav-cta)");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((l) => {
              l.classList.toggle("active", l.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { threshold: 0.35 },
    );

    sections.forEach((s) => observer.observe(s));
  }

  function initSmoothScrollCTA() {
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const target = document.getElementById(a.getAttribute("href").slice(1));
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      });
    });
  }

  function initHeroCanvas() {
    const canvas = $("#heroCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let W, H, particles;
    const COUNT = 80;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,98,0,${p.alpha})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,98,0,${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    };

    draw();
  }

  function initSideCanvases() {
    ["canvasLeft", "canvasRight"].forEach((id) => {
      const canvas = document.getElementById(id);
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      let W, H;
      const COUNT = 35;

      const resize = () => {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener("resize", resize, { passive: true });

      const particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.55 + 0.2,
      }));

      const draw = () => {
        ctx.clearRect(0, 0, W, H);

        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,98,0,${p.alpha})`;
          ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(255,98,0,${0.13 * (1 - dist / 90)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        requestAnimationFrame(draw);
      };

      draw();
    });
  }

  function initSectionCanvases() {
    document.querySelectorAll(".sec-canvas").forEach((canvas) => {
      const ctx = canvas.getContext("2d");
      const section = canvas.parentElement;
      let W, H;
      const COUNT = 35;

      const resize = () => {
        W = canvas.width = canvas.offsetWidth || 220;
        H = canvas.height = section.offsetHeight || 600;
      };

      // Delay first resize so layout is fully computed
      requestAnimationFrame(() => {
        resize();
        particles.forEach((p) => {
          p.x = Math.random() * W;
          p.y = Math.random() * H;
        });
      });

      window.addEventListener("resize", resize, { passive: true });

      const particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * 220,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.55 + 0.2,
      }));

      const draw = () => {
        ctx.clearRect(0, 0, W, H);

        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,98,0,${p.alpha})`;
          ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(255,98,0,${0.13 * (1 - dist / 90)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        requestAnimationFrame(draw);
      };

      draw();
    });
  }

  function initScrollAnimations() {
    const els = $$("[data-animate]");
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    els.forEach((el) => observer.observe(el));
  }

  function initCounters() {
    const nums = $$(".hs-num[data-target]");
    if (!nums.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const dur = 1600;
          const start = performance.now();

          const step = (now) => {
            const pct = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - pct, 3); // ease-out cubic
            el.textContent = Math.floor(ease * target);
            if (pct < 1) requestAnimationFrame(step);
            else el.textContent = target;
          };

          requestAnimationFrame(step);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );

    nums.forEach((n) => observer.observe(n));
  }

  function initPortfolioFilter() {
    const btns = $$(".pf-btn");
    const items = $$(".pf-item");
    if (!btns.length) return;

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;

        items.forEach((item) => {
          const match = filter === "all" || item.dataset.cat === filter;
          if (match) {
            item.classList.remove("hidden");
            // Re-trigger animate
            item.classList.remove("animated");
            requestAnimationFrame(() => item.classList.add("animated"));
          } else {
            item.classList.add("hidden");
          }
        });
      });
    });
  }

  function initTestimonials() {
    const track = $("#testiTrack");
    const prev = $("#testiPrev");
    const next = $("#testiNext");
    const dotsEl = $("#testiDots");
    if (!track) return;

    const cards = $$(".testi-card", track);
    let current = 0;
    let autoTimer = null;
    let perView = getPerView();

    function getPerView() {
      return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    }

    const total = Math.ceil(cards.length / getPerView());

    if (dotsEl) {
      for (let i = 0; i < total; i++) {
        const dot = document.createElement("button");
        dot.className = "testi-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Slide ${i + 1}`);
        dot.addEventListener("click", () => goTo(i));
        dotsEl.appendChild(dot);
      }
    }

    function goTo(idx) {
      perView = getPerView();
      const maxIdx = Math.max(0, cards.length - perView);
      const slide = Math.min(idx * perView, maxIdx);
      const cardW = cards[0].offsetWidth + 24; // gap 24px
      track.style.transform = `translateX(-${slide * cardW}px)`;
      current = idx;
      $$(".testi-dot", dotsEl).forEach((d, i) =>
        d.classList.toggle("active", i === idx),
      );
    }

    function next_() {
      goTo((current + 1) % total);
    }
    function prev_() {
      goTo((current - 1 + total) % total);
    }

    if (next)
      next.addEventListener("click", () => {
        clearAuto();
        next_();
      });
    if (prev)
      prev.addEventListener("click", () => {
        clearAuto();
        prev_();
      });

    function startAuto() {
      autoTimer = setInterval(next_, 5000);
    }
    function clearAuto() {
      clearInterval(autoTimer);
    }

    startAuto();

    track.addEventListener("mouseenter", clearAuto);
    track.addEventListener("mouseleave", startAuto);

    let touchStartX = 0;
    track.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true },
    );
    track.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        clearAuto();
        dx < 0 ? next_() : prev_();
      }
    });

    window.addEventListener("resize", () => goTo(0), { passive: true });
  }

  function initFAQ() {
    const items = $$(".faq-item");
    items.forEach((item) => {
      const btn = $(".faq-q", item);
      const answer = $(".faq-a", item);
      if (!btn || !answer) return;

      btn.addEventListener("click", () => {
        const isOpen = item.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(isOpen));
        answer.style.maxHeight = isOpen ? answer.scrollHeight + "px" : "0";

        items.forEach((other) => {
          if (other !== item && other.classList.contains("open")) {
            other.classList.remove("open");
            $(".faq-q", other).setAttribute("aria-expanded", "false");
            $(".faq-a", other).style.maxHeight = "0";
          }
        });
      });
    });
  }

  function initFileUpload() {
    const zone = $("#fileDropZone");
    const input = $("#fileInput");
    const listEl = $("#fileList");
    if (!zone || !input) return;

    const ALLOWED = [
      ".step",
      ".stp",
      ".stl",
      ".pdf",
      ".dwg",
      ".iges",
      ".igs",
      ".dxf",
    ];
    const MAX_SIZE = 50 * 1024 * 1024; // 50 MB
    let selectedFiles = [];

    zone.addEventListener("click", (e) => {
      if (e.target === input) return;
      input.click();
    });

    input.addEventListener("change", () => {
      addFiles([...input.files]);
      input.value = "";
    });

    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () =>
      zone.classList.remove("drag-over"),
    );
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("drag-over");
      addFiles([...e.dataTransfer.files]);
    });

    function addFiles(files) {
      files.forEach((file) => {
        const ext = "." + file.name.split(".").pop().toLowerCase();
        if (!ALLOWED.includes(ext)) {
          showFileError(`Dateiformat "${ext}" wird nicht unterstützt.`);
          return;
        }
        if (file.size > MAX_SIZE) {
          showFileError(`"${file.name}" ist zu groß (max. 50 MB).`);
          return;
        }
        if (
          selectedFiles.some(
            (f) => f.name === file.name && f.size === file.size,
          )
        )
          return;
        selectedFiles.push(file);
      });
      renderFileList();
    }

    function renderFileList() {
      if (!listEl) return;
      listEl.innerHTML = "";
      selectedFiles.forEach((file, idx) => {
        const li = document.createElement("li");
        li.className = "file-item";

        const name = document.createElement("span");
        name.className = "file-item-name";
        name.title = file.name;
        name.textContent = file.name;

        const size = document.createElement("span");
        size.className = "file-item-size";
        size.textContent = formatBytes(file.size);

        const rm = document.createElement("button");
        rm.className = "file-remove";
        rm.textContent = "×";
        rm.type = "button";
        rm.setAttribute("aria-label", `${file.name} entfernen`);
        rm.addEventListener("click", (e) => {
          e.stopPropagation();
          selectedFiles.splice(idx, 1);
          renderFileList();
        });

        li.append(name, size, rm);
        listEl.appendChild(li);
      });
    }

    function showFileError(msg) {
      const existing = zone.querySelector(".file-err-msg");
      if (existing) existing.remove();
      const p = document.createElement("p");
      p.className = "file-err-msg form-err";
      p.style.padding = "4px 16px 12px";
      p.textContent = msg;
      zone.appendChild(p);
      setTimeout(() => p.remove(), 4000);
    }

    window._getSelectedFiles = () => selectedFiles;
  }

  function initQuoteForm() {
    const form = $("#quoteForm");
    const success = $("#quoteSuccess");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      const name = $("#qName");
      const nameE = $("#qNameErr");
      if (!name.value.trim()) {
        showErr(nameE, "Bitte geben Sie Ihren Namen ein.");
        valid = false;
      } else {
        clearErr(nameE);
      }

      const email = $("#qEmail");
      const emailE = $("#qEmailErr");
      if (!isValidEmail(email.value)) {
        showErr(emailE, "Bitte geben Sie eine gültige E-Mail-Adresse ein.");
        valid = false;
      } else {
        clearErr(emailE);
      }

      const mat = $("#qMaterial");
      const matE = $("#qMaterialErr");
      if (!mat.value) {
        showErr(matE, "Bitte wählen Sie ein Material aus.");
        valid = false;
      } else {
        clearErr(matE);
      }

      const qty = $("#qQty");
      const qtyE = $("#qQtyErr");
      if (!qty.value || parseInt(qty.value, 10) < 1) {
        showErr(qtyE, "Bitte geben Sie eine gültige Stückzahl ein.");
        valid = false;
      } else {
        clearErr(qtyE);
      }

      const desc = $("#qDesc");
      const descE = $("#qDescErr");
      if (desc.value.trim().length < 10) {
        showErr(descE, "Bitte beschreiben Sie Ihr Projekt (min. 10 Zeichen).");
        valid = false;
      } else {
        clearErr(descE);
      }

      const priv = $("#qPrivacy");
      const privE = $("#qPrivacyErr");
      if (!priv.checked) {
        showErr(privE, "Bitte stimmen Sie der Datenschutzerklärung zu.");
        valid = false;
      } else {
        clearErr(privE);
      }

      if (!valid) return;

      const btn = form.querySelector('button[type="submit"]');
      setLoading(btn, true);

      setTimeout(() => {
        setLoading(btn, false);
        form.hidden = true;
        if (success) {
          success.removeAttribute("hidden");
          success.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 1400);
    });
  }

  function initContactForm() {
    const form = $("#contactForm");
    const success = $("#contactSuccess");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#cName", form);
      const email = $("#cEmail", form);
      const msg = $("#cMsg", form);

      if (
        !name.value.trim() ||
        !isValidEmail(email.value) ||
        msg.value.trim().length < 5
      ) {
        name.style.borderColor = name.value.trim() ? "" : "var(--orange)";
        email.style.borderColor = isValidEmail(email.value)
          ? ""
          : "var(--orange)";
        msg.style.borderColor =
          msg.value.trim().length >= 5 ? "" : "var(--orange)";
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      setLoading(btn, true);

      setTimeout(() => {
        setLoading(btn, false);
        form.reset();
        if (success) {
          success.removeAttribute("hidden");
          setTimeout(() => success.setAttribute("hidden", ""), 6000);
        }
      }, 1200);
    });
  }

  function initCapabilityBars() {
    const bars = $$(".cap-fill[data-w]");
    if (!bars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.w + "%";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );

    bars.forEach((b) => observer.observe(b));
  }

  function initBackToTop() {
    const btn = $("#btt");
    if (!btn) return;

    const toggle = () => {
      if (window.scrollY > 400) {
        btn.removeAttribute("hidden");
      } else {
        btn.setAttribute("hidden", "");
      }
    };

    window.addEventListener("scroll", toggle, { passive: true });
    toggle();

    btn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }

  function initChatWidget() {
    const chatBtn = $("#chatBtn");
    const chatPopup = $("#chatPopup");
    const chatClose = $("#chatClose");
    const chatInput = $("#chatInput");
    const chatSend = $("#chatSend");
    const cpBody = chatPopup ? chatPopup.querySelector(".cp-body") : null;
    if (!chatBtn || !chatPopup) return;

    chatBtn.addEventListener("click", () => {
      const isHidden = chatPopup.hasAttribute("hidden");
      if (isHidden) {
        chatPopup.removeAttribute("hidden");
        chatBtn.querySelector(".chat-badge")?.remove();
      } else {
        chatPopup.setAttribute("hidden", "");
      }
    });

    if (chatClose) {
      chatClose.addEventListener("click", () =>
        chatPopup.setAttribute("hidden", ""),
      );
    }

    const botReplies = [
      "Vielen Dank für Ihre Nachricht! Ein Mitarbeiter meldet sich innerhalb von 24h.",
      "Ich leite Ihre Anfrage gerne weiter. Nutzen Sie auch unser Anfrageformular.",
      "Haben Sie eine CAD-Datei? Dann laden Sie diese bitte über unser Angebotsformular hoch.",
      "Für dringende Anfragen erreichen Sie uns telefonisch: +49 711 123 456 78.",
    ];
    let replyIdx = 0;

    const sendMsg = () => {
      if (!chatInput || !chatInput.value.trim()) return;
      const text = sanitizeText(chatInput.value.trim());
      addMsg(text, "user");
      chatInput.value = "";

      setTimeout(() => {
        addMsg(botReplies[replyIdx % botReplies.length], "bot");
        replyIdx++;
      }, 900);
    };

    if (chatSend) chatSend.addEventListener("click", sendMsg);
    if (chatInput)
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendMsg();
      });

    function addMsg(text, type) {
      if (!cpBody) return;
      const div = document.createElement("div");
      div.className = `cp-msg ${type}`;
      const p = document.createElement("p");
      p.textContent = text;
      const ts = document.createElement("span");
      ts.textContent = "Gerade eben";
      div.append(p, ts);
      cpBody.appendChild(div);
      cpBody.scrollTop = cpBody.scrollHeight;
    }
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim());
  }

  function showErr(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.style.display = "block";
    el.closest(".form-group")
      ?.querySelector("input, select, textarea")
      ?.classList.add("input-error");
  }

  function clearErr(el) {
    if (!el) return;
    el.textContent = "";
    el.style.display = "none";
    el.closest(".form-group")
      ?.querySelector("input, select, textarea")
      ?.classList.remove("input-error");
  }

  function setLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
      btn.dataset.originalText =
        btn.querySelector("span")?.textContent || btn.textContent;
      const span = btn.querySelector("span");
      if (span) span.textContent = "Wird gesendet…";
      btn.disabled = true;
      btn.style.opacity = ".7";
    } else {
      const span = btn.querySelector("span");
      if (span && btn.dataset.originalText)
        span.textContent = btn.dataset.originalText;
      btn.disabled = false;
      btn.style.opacity = "";
    }
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  }

  function sanitizeText(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const style = document.createElement("style");
  style.textContent = `
    .input-error {
      border-color: #ff5252 !important;
      box-shadow: 0 0 0 3px rgba(255,82,82,.12) !important;
    }
    .form-err { display: none; }
  `;
  document.head.appendChild(style);
})();
