"use strict";

window.addEventListener("load", () => {
  document.body.classList.add("loading");
  setTimeout(() => {
    const loader = document.getElementById("loader");
    loader.classList.add("hidden");
    document.body.classList.remove("loading");
    startHeroAnimations();
  }, 2400);
});

(function initCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W,
    H,
    dots = [],
    lines = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < 120; i++) {
    dots.push({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.6 + 0.1,
      c: Math.random() > 0.5 ? "0,180,255" : "255,94,26",
    });
  }

  function drawCanvas() {
    ctx.clearRect(0, 0, W, H);

    const grad = ctx.createRadialGradient(
      W * 0.6,
      H * 0.4,
      0,
      W * 0.6,
      H * 0.4,
      W * 0.7,
    );
    grad.addColorStop(0, "rgba(0,180,255,0.06)");
    grad.addColorStop(0.5, "rgba(255,94,26,0.03)");
    grad.addColorStop(1, "rgba(8,8,8,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    dots.forEach((d) => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0) d.x = W;
      if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H;
      if (d.y > H) d.y = 0;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${d.c},${d.a})`;
      ctx.fill();
    });

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(0,180,255,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawCanvas);
  }
  drawCanvas();
})();

(function initParticles() {
  const container = document.getElementById("particles");
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const x = Math.random() * 100;
    const delay = Math.random() * 12;
    const dur = 6 + Math.random() * 10;
    const isOrange = Math.random() > 0.7;
    p.style.cssText = `
      left: ${x}%;
      bottom: ${Math.random() * 40}%;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      background: ${isOrange ? "#ff5e1a" : "#00b4ff"};
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      box-shadow: 0 0 6px ${isOrange ? "#ff5e1a" : "#00b4ff"};
    `;
    container.appendChild(p);
  }
})();

(function initSpeedLines() {
  const container = document.getElementById("speedLines");
  if (!container) return;
  for (let i = 0; i < 12; i++) {
    const line = document.createElement("div");
    line.className = "speed-line";
    const w = 80 + Math.random() * 200;
    const delay = Math.random() * 8;
    const dur = 2 + Math.random() * 4;
    line.style.cssText = `
      width: ${w}px;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 40}%;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
    `;
    container.appendChild(line);
  }
})();

function startHeroAnimations() {
  const lines = document.querySelectorAll(".title-line");
  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add("animated"), i * 100);
    line.style.transition = `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s, opacity 0.9s ease ${i * 0.1}s`;
  });

  const delayed = document.querySelectorAll(
    ".hero-subtitle, .hero-ctas, .hero-badge",
  );
  delayed.forEach((el) => {
    const delay = parseFloat(el.getAttribute("data-delay") || 0.4) * 1000;
    setTimeout(
      () => el.classList.add("animated"),
      delay * 1000 < 100 ? delay + 400 : delay,
    );
  });
  setTimeout(() => {
    document.querySelector(".hero-subtitle")?.classList.add("animated");
    setTimeout(
      () => document.querySelector(".hero-ctas")?.classList.add("animated"),
      150,
    );
    setTimeout(() => {
      document.querySelector(".hero-stats")?.classList.add("animated");
      startHeroStatsCounter();
    }, 300);
  }, 700);
}

let heroStatsStarted = false;

function animateCounter(el, target) {
  let start = 0;
  const dur = 1600;
  el.textContent = "0";
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / dur, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = String(target);
    }
  };
  requestAnimationFrame(step);
}

function animateHeroStats() {
  document.querySelectorAll(".stat-num").forEach((el) => {
    animateCounter(el, parseInt(el.getAttribute("data-target"), 10));
  });
}

function startHeroStatsCounter() {
  if (heroStatsStarted) return;
  heroStatsStarted = true;
  document.querySelectorAll(".stat-num").forEach((el) => {
    el.textContent = "0";
  });
  animateHeroStats();
}

const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
});

const hamburger = document.querySelector(".nav-hamburger");
const mobileMenu = document.getElementById("mobileMenu");
hamburger?.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("open");
  document.body.style.overflow = mobileMenu.classList.contains("open")
    ? "hidden"
    : "";
});
mobileMenu?.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => entry.target.classList.add("animated"), delay * 1000);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

function observeCards() {
  document.querySelectorAll(".reveal-card").forEach((card, i) => {
    const siblings = Array.from(
      card.parentElement.querySelectorAll(".reveal-card"),
    );
    const idx = siblings.indexOf(card);
    card.dataset.revealDelay = idx * 0.1;
    revealObserver.observe(card);
  });
  document
    .querySelectorAll(".reveal-up")
    .forEach((el) => revealObserver.observe(el));
}
observeCards();

(function initCountdown() {
  // Target: June 14, 2026
  const target = new Date("2026-06-14T20:00:00").getTime();
  const pad = (n) => String(n).padStart(2, "0");

  function tick() {
    const now = Date.now();
    const diff = Math.max(target - now, 0);
    const days = Math.floor(diff / 864e5);
    const hours = Math.floor((diff % 864e5) / 36e5);
    const mins = Math.floor((diff % 36e5) / 6e4);
    const secs = Math.floor((diff % 6e4) / 1e3);
    document.getElementById("cdDays").textContent = pad(days);
    document.getElementById("cdHours").textContent = pad(hours);
    document.getElementById("cdMins").textContent = pad(mins);
    document.getElementById("cdSecs").textContent = pad(secs);
  }
  tick();
  setInterval(tick, 1000);
})();

(function initDragScroll() {
  const track = document.querySelector(".gallery-scroll-wrap");
  if (!track) return;
  let isDown = false,
    startX,
    scrollLeft;

  track.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  track.addEventListener("mouseleave", () => {
    isDown = false;
  });
  track.addEventListener("mouseup", () => {
    isDown = false;
  });
  track.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });
})();

(function initScrollProgress() {
  const bar = document.createElement("div");
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; z-index: 2000;
    background: linear-gradient(90deg, #00b4ff, #ff5e1a);
    width: 0%; transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);
  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / max) * 100 + "%";
  });
})();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

(function initKineticText() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );
  document
    .querySelectorAll(".section-title")
    .forEach((el) => observer.observe(el));
})();

document.querySelector(".newsletter-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = e.target.querySelector("input");
  const btn = e.target.querySelector("button");
  if (!input.value || !input.value.includes("@")) return;
  btn.textContent = "✓";
  btn.style.background = "#00b4ff";
  input.value = "";
  input.placeholder = "SUBSCRIBED!";
  setTimeout(() => {
    btn.textContent = "→";
    input.placeholder = "YOUR EMAIL";
  }, 3000);
});

document.querySelectorAll(".sponsor-item").forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.04}s`;
});

setTimeout(() => {
  document.querySelector(".hero-badge")?.classList.add("animated");
}, 2600);
