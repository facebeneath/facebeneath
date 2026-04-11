/* ================================================================
   LUXURY JS — Hausmeisterservice Markus Weber
   Cinematic Animations & Premium Interactions
================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ============================================================
  // AMBIENT PARTICLE SYSTEM
  // ============================================================
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    });

    class Particle {
      constructor() { this.reset(true); }
      reset(initial) {
        this.x  = Math.random() * W;
        this.y  = initial ? Math.random() * H : (Math.random() > 0.5 ? -4 : H + 4);
        this.r  = Math.random() * 1.4 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.a  = Math.random() * 0.5 + 0.08;
        this.gold = Math.random() > 0.6;
        this.pulse = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        this.pulse += 0.012;
        const breathing = Math.sin(this.pulse) * 0.3;
        this.currentA = Math.max(0, this.a + breathing);
        if (this.x < -5 || this.x > W + 5 || this.y < -5 || this.y > H + 5) this.reset(false);
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.gold
          ? `rgba(201,168,76,${this.currentA})`
          : `rgba(200,195,188,${this.currentA * 0.38})`;
        ctx.fill();
      }
    }

    const N = window.innerWidth < 768 ? 70 : 130;
    const particles = Array.from({ length: N }, () => new Particle());

    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(loop);
    }
    loop();
  }

  // ============================================================
  // NAVBAR: SCROLL SHRINK
  // ============================================================
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.pageYOffset > 80);
  }, { passive: true });

  // ============================================================
  // SMOOTH ANCHOR SCROLL
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Mobile nav: collapse on link click
  const collapseEl = document.getElementById('navbarNav');
  const brandEl    = document.querySelector('.navbar-brand');
  if (collapseEl) {
    collapseEl.addEventListener('show.bs.collapse', () => { if (brandEl) brandEl.classList.add('d-none'); });
    collapseEl.addEventListener('hidden.bs.collapse', () => { if (brandEl) brandEl.classList.remove('d-none'); });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const bs = bootstrap.Collapse.getInstance(collapseEl);
        if (bs) bs.hide();
      });
    });
  }

  // ============================================================
  // INTERSECTION OBSERVER: SCROLL REVEAL
  // ============================================================
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-fade').forEach(el => fadeObserver.observe(el));

  // ============================================================
  // SERVICE CARDS: STAGGERED ENTRANCE
  // ============================================================
  const cardRowObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.luxury-card');
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('visible'), i * 110);
        });
        cardRowObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06 });

  const servicesRow = document.querySelector('#services .row');
  if (servicesRow) cardRowObserver.observe(servicesRow);

  // ============================================================
  // 3D TILT ON SERVICE CARDS
  // ============================================================
  document.querySelectorAll('.luxury-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      if (window.innerWidth < 768) return;
      const { left, top, width, height } = this.getBoundingClientRect();
      const rx = ((e.clientY - top  - height / 2) / height) * 10;
      const ry = ((e.clientX - left - width  / 2) / width)  * -10;
      this.style.transform = `translateY(-10px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });

  // ============================================================
  // SERVICE MODAL
  // ============================================================
  const modalEl    = document.getElementById('serviceModal');
  const modalTitle = document.getElementById('serviceModalLabel');
  const modalBody  = document.getElementById('serviceModalBody');

  if (modalEl) {
    const serviceModal = new bootstrap.Modal(modalEl);

    const services = {
      winter: {
        title: 'Winterdienst',
        content: `
          <p>Unser professioneller Winterdienst sorgt f&uuml;r sichere Wege und Zufahrten w&auml;hrend der gesamten Wintersaison.</p>
          <h5>Leistungen:</h5>
          <ul>
            <li>Schneer&auml;umung von Gehwegen, Parkpl&auml;tzen und Zufahrten</li>
            <li>Streudienst gem&auml;&szlig; gesetzlicher Vorschriften</li>
            <li>Zuverl&auml;ssiger Einsatz bei Schnee und Gl&auml;tte</li>
          </ul>
          <p>Wir stellen sicher, dass Ihre Immobilie jederzeit sicher und begehbar bleibt.</p>
        `
      },
      green: {
        title: 'Grünpflege & Heckenschnitt',
        content: `
          <p>Gepflegte Gr&uuml;nfl&auml;chen sind die Visitenkarte jeder Immobilie.</p>
          <h5>Leistungen:</h5>
          <ul>
            <li>Hecken- und Strauchschnitt</li>
            <li>R&uuml;ckschnitt von B&auml;umen und &Auml;sten</li>
            <li>Pflege von Gr&uuml;nanlagen und Au&szlig;enbereichen</li>
          </ul>
          <p>Sauber, fachgerecht und saisonal angepasst.</p>
        `
      },
      leaf: {
        title: 'Hausmeisterservice',
        content: `
          <p>Wir kuemmern uns um saubere und sichere Aussenflaechen.</p>
          <h5>Leistungen:</h5>
          <ul>
            <li>Laubentfernung</li>
            <li>Reinigung von H&ouml;fen, Wegen und Parkfl&auml;chen</li>
            <li>Entsorgung von Gr&uuml;nabf&auml;llen</li>
          </ul>
          <p>Ideal f&uuml;r Herbst, Fr&uuml;hjahr und regelm&auml;&szlig;ige Objektpflege.</p>
        `
      },
      general: {
        title: 'Allgemeine Hausmeisterdienste',
        content: `
          <p>Zuverl&auml;ssige Betreuung Ihrer Immobilie aus einer Hand.</p>
          <h5>Leistungen:</h5>
          <ul>
            <li>Kontrollg&auml;nge</li>
            <li>Kleine Instandhaltungsarbeiten</li>
            <li>Koordination von Ordnung und Sauberkeit</li>
          </ul>
          <p>Wir sorgen daf&uuml;r, dass alles funktioniert.</p>
        `
      },
      outdoor: {
        title: 'Reinigung & Pflegearbeiten',
        content: `
          <p>Ordnung und Sauberkeit im Aussenbereich erhoehen den Wert jeder Immobilie.</p>
          <h5>Leistungen:</h5>
          <ul>
            <li>Regelm&auml;&szlig;ige Pflege von Au&szlig;enfl&auml;chen</li>
            <li>Reinigung von Zugangsbereichen</li>
            <li>Sichtkontrollen und Pflegearbeiten</li>
          </ul>
        `
      }
    };

    document.querySelectorAll('.service-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const key = this.getAttribute('data-service');
        const svc = services[key];
        if (svc && modalTitle && modalBody) {
          modalTitle.textContent = svc.title;
          modalBody.innerHTML = svc.content;
          serviceModal.show();
        }
      });
    });
  }

  // ============================================================
  // ANIMATED STATS COUNTER
  // ============================================================
  const statsNumbers = document.querySelectorAll('.stats-number');
  let statsAnimated = false;

  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function animateCounters() {
    if (statsAnimated) return;
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
      statsAnimated = true;
      statsNumbers.forEach(el => {
        const target   = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2200;
        const start    = performance.now();
        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutQuart(progress);
          el.textContent = Math.floor(eased * target).toLocaleString('de-DE');
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString('de-DE');
        }
        requestAnimationFrame(tick);
      });
    }
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters();

  // ============================================================
  // BACK TO TOP
  // ============================================================
  const bttBtn = document.getElementById('backToTop');
  if (bttBtn) {
    window.addEventListener('scroll', () => {
      bttBtn.classList.toggle('show', window.pageYOffset > 450);
    }, { passive: true });
    bttBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================================
  // HERO PARALLAX (subtle background drift)
  // ============================================================
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const y = window.pageYOffset;
      heroSection.style.backgroundPositionY = `calc(center + ${y * 0.3}px)`;
    }, { passive: true });
  }

  // ============================================================
  // GALLERY: LIGHTBOX-STYLE HOVER DEPTH
  // ============================================================
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function () {
      this.style.zIndex = '2';
    });
    item.addEventListener('mouseleave', function () {
      this.style.zIndex = '';
    });
  });

});