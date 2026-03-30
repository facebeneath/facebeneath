document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight - 100 && rect.bottom > 0;
  }

  const serviceCards = document.querySelectorAll(".service-card");

  function animateCards() {
    serviceCards.forEach((card, index) => {
      if (isInViewport(card)) {
        if (index % 2 === 0) {
          card.classList.add("visible-left");
          card.classList.remove("visible-right");
        } else {
          card.classList.add("visible-right");
          card.classList.remove("visible-left");
        }
      } else {
        card.classList.remove("visible-left", "visible-right");
      }
    });
  }

  window.addEventListener("scroll", animateCards);

  window.addEventListener("load", animateCards);

  const serviceBtns = document.querySelectorAll(".service-btn");
  const serviceModal = new bootstrap.Modal(
    document.getElementById("serviceModal"),
  );
  const modalTitle = document.getElementById("serviceModalLabel");
  const modalBody = document.getElementById("serviceModalBody");

  const services = {
    winter: {
      title: "Winterdienst",
      content: `
        <p>Unser professioneller Winterdienst sorgt für sichere Wege und Zufahrten während der gesamten Wintersaison.</p>
        <h5>Leistungen:</h5>
        <ul>
          <li>Schneeräumung von Gehwegen, Parkplätzen und Zufahrten</li>
          <li>Streudienst gemäß gesetzlicher Vorschriften</li>
          <li>Zuverlässiger Einsatz bei Schnee und Glätte</li>
        </ul>
        <p>Wir stellen sicher, dass Ihre Immobilie jederzeit sicher und begehbar bleibt – auch bei starkem Wintereinbruch.</p>
      `,
    },
    green: {
      title: "Grünpflege & Heckenschnitt",
      content: `
        <p>Gepflegte Grünflächen sind die Visitenkarte jeder Immobilie.</p>
        <h5>Leistungen:</h5>
        <ul>
          <li>Hecken- und Strauchschnitt</li>
          <li>Rückschnitt von Bäumen und Ästen</li>
          <li>Pflege von Grünanlagen und Außenbereichen</li>
        </ul>
        <p>Sauber, fachgerecht und saisonal angepasst – für ein ordentliches Erscheinungsbild.</p>
      `,
    },
    leaf: {
      title: "Laubentsorgung & Grundstücksreinigung",
      content: `
        <p>Wir kümmern uns um saubere und sichere Außenflächen.</p>
        <h5>Leistungen:</h5>
        <ul>
          <li>Laubentfernung</li>
          <li>Reinigung von Höfen, Wegen und Parkflächen</li>
          <li>Entsorgung von Grünabfällen</li>
        </ul>
        <p>Ideal für Herbst, Frühjahr und regelmäßige Objektpflege.</p>
      `,
    },
    general: {
      title: "Allgemeine Hausmeisterdienste",
      content: `
        <p>Zuverlässige Betreuung Ihrer Immobilie aus einer Hand.</p>
        <h5>Leistungen:</h5>
        <ul>
          <li>Kontrollgänge</li>
          <li>Kleine Instandhaltungsarbeiten</li>
          <li>Koordination von Ordnung und Sauberkeit</li>
        </ul>
        <p>Wir sorgen dafür, dass alles funktioniert – schnell, diskret und zuverlässig.</p>
      `,
    },
    outdoor: {
      title: "Pflege von Außenanlagen",
      content: `
        <p>Ordnung und Sauberkeit im Außenbereich erhöhen den Wert jeder Immobilie.</p>
        <h5>Leistungen:</h5>
        <ul>
          <li>Regelmäßige Pflege von Außenflächen</li>
          <li>Reinigung von Zugangsbereichen</li>
          <li>Sichtkontrollen und Pflegearbeiten</li>
        </ul>
      `,
    },
  };

  serviceBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const serviceKey = this.getAttribute("data-service");
      const service = services[serviceKey];
      if (service) {
        modalTitle.textContent = service.title;
        modalBody.innerHTML = service.content;
        serviceModal.show();
      }
    });
  });

  // Counter animation for stats
  const statsNumbers = document.querySelectorAll(".stats-number");
  let animatingNow = false;

  function animateCounters() {
    const statsSection = document.getElementById("stats");
    if (!statsSection || animatingNow) return;

    const rect = statsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    if (isVisible) {
      animatingNow = true;

      statsNumbers.forEach((element) => {
        const target = parseInt(element.getAttribute("data-target"));
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const steps = 50;
        const stepDuration = duration / steps;

        function updateCounter() {
          current += increment;
          if (current >= target) {
            element.textContent = target.toLocaleString("de-DE");
          } else {
            element.textContent = Math.floor(current).toLocaleString("de-DE");
            setTimeout(updateCounter, stepDuration);
          }
        }

        updateCounter();
      });

      setTimeout(() => {
        animatingNow = false;
      }, 2000);
    }
  }

  window.addEventListener("scroll", animateCounters);
  window.addEventListener("load", animateCounters);

  // Back to Top Button
  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // CTA Buttons Smooth Scroll
  document.querySelectorAll('.cta-buttons a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.getAttribute("href") !== "tel:") {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
});

const collapse = document.getElementById("navbarNav");
const brand = document.querySelector(".navbar-brand");

collapse.addEventListener("show.bs.collapse", () => {
  brand.classList.add("d-none");
});

collapse.addEventListener("hidden.bs.collapse", () => {
  brand.classList.remove("d-none");
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    const bsCollapse = bootstrap.Collapse.getInstance(collapse);
    if (bsCollapse) bsCollapse.hide();
  });
});
