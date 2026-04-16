(function () {
  "use strict";

  var GA_ID = "G-MQ5PXKPBES";
  var STORAGE_KEY = "fb_cookie_consent";
  var CONSENT_VERSION = "1.1";

  var i18n = {
    de: {
      bannerTitle: "Wir respektieren Ihre Privatsphäre",
      bannerText:
        "Diese Website verwendet Cookies. Notwendige Cookies sind für den technischen Betrieb erforderlich und werden stets gesetzt. " +
        "Analyse-Cookies (Google Analytics) werden ausschließlich nach Ihrer ausdrücklichen Einwilligung aktiviert.",
      acceptAll: "Alle akzeptieren",
      rejectOptional: "Nur notwendige",
      settings: "Cookie-Einstellungen",
      modalTitle: "Cookie-Einstellungen",
      modalIntro:
        "Hier legen Sie fest, welche Cookies Sie zulassen. Ihre Entscheidung können Sie jederzeit ändern oder widerrufen.",
      withdrawNote:
        "Sie können Ihre Einwilligung jederzeit über den Button unten links widerrufen.",
      necessaryTitle: "Notwendige Cookies",
      necessaryDesc:
        "Technisch erforderlich für die Grundfunktionen der Website (z. B. Sitzungsverwaltung). Diese Cookies können nicht deaktiviert werden.",
      alwaysActive: "Immer aktiv",
      analyticsTitle: "Analyse-Cookies",
      analyticsDesc:
        "Google Analytics (Mess-ID: G-MQ5PXKPBES) erfasst anonymisierte Nutzungsdaten ausschließlich zur Verbesserung unseres Angebots. Eine Weitergabe an Dritte zu Werbezwecken findet nicht statt. IP-Adressen werden anonymisiert.",
      savePrefs: "Einstellungen speichern",
      privacyLink: "Datenschutzerklärung",
      cookieLink: "Cookie-Richtlinie",
      manageBtn: "Cookie-Einstellungen",
      privacyUrl: "/privacy.html",
      cookieUrl: "/privacy.html#cookies",
    },
    en: {
      bannerTitle: "We Respect Your Privacy",
      bannerText:
        "This website uses cookies. Necessary cookies are required for the technical operation of the site and are always active. " +
        "Analytics cookies (Google Analytics) are only enabled with your explicit consent.",
      acceptAll: "Accept All",
      rejectOptional: "Necessary Only",
      settings: "Cookie Settings",
      modalTitle: "Cookie Settings",
      modalIntro:
        "Choose which cookies you allow. You can change or withdraw your preferences at any time.",
      withdrawNote:
        "You can withdraw your consent at any time via the button in the bottom-left corner.",
      necessaryTitle: "Necessary Cookies",
      necessaryDesc:
        "Technically required for the basic functions of the website (e.g. session management). These cookies cannot be disabled.",
      alwaysActive: "Always active",
      analyticsTitle: "Analytics Cookies",
      analyticsDesc:
        "Google Analytics (Measurement ID: G-MQ5PXKPBES) collects anonymised usage data solely to improve our services. Data is not shared with third parties for advertising. IP addresses are anonymised.",
      savePrefs: "Save Preferences",
      privacyLink: "Privacy Policy",
      cookieLink: "Cookie Policy",
      manageBtn: "Cookie Settings",
      privacyUrl: "/privacyen.html",
      cookieUrl: "/privacyen.html#cookies",
    },
    bs: {
      bannerTitle: "Poštujemo Vašu privatnost",
      bannerText:
        "Ova web stranica koristi kolačiće. Neophodni kolačići su uvijek aktivni jer su potrebni za tehnički rad stranice. " +
        "Analitički kolačići (Google Analytics) aktiviraju se isključivo uz Vaš izričit pristanak.",
      acceptAll: "Prihvati sve",
      rejectOptional: "Samo neophodni",
      settings: "Postavke kolačića",
      modalTitle: "Postavke kolačića",
      modalIntro:
        "Ovdje odabirete koje kolačiće želite dozvoliti. Svoju odluku možete promijeniti ili povući u bilo kojem trenutku.",
      withdrawNote:
        "Pristanak možete povući u bilo kojem trenutku putem dugmeta u donjem lijevom uglu.",
      necessaryTitle: "Neophodni kolačići",
      necessaryDesc:
        "Tehnički neophodni za osnovno funkcioniranje web stranice (npr. upravljanje sesijom). Ovi kolačići ne mogu se isključiti.",
      alwaysActive: "Uvijek aktivni",
      analyticsTitle: "Analitički kolačići",
      analyticsDesc:
        "Google Analytics (Mjerni ID: G-MQ5PXKPBES) prikuplja anonimne podatke o korišćenju stranice isključivo radi poboljšanja naših usluga. Podaci se ne dijele s trećim stranama u reklamne svrhe. IP adrese se anonimiziraju.",
      savePrefs: "Spremi postavke",
      privacyLink: "Politika privatnosti",
      cookieLink: "Politika kolačića",
      manageBtn: "Postavke kolačića",
      privacyUrl: "/privacy.html",
      cookieUrl: "/privacy.html#cookies",
    },
  };

  function getLang() {
    var lang = (document.documentElement.lang || "de").toLowerCase();
    if (lang.startsWith("en")) return "en";
    if (lang.startsWith("bs") || lang.startsWith("hr") || lang.startsWith("sr"))
      return "bs";
    return "de";
  }

  function getConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setConsent(analytics) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          analytics: !!analytics,
          timestamp: new Date().toISOString(),
          version: CONSENT_VERSION,
        }),
      );
    } catch (e) {}
  }

  function loadGA() {
    if (window._fbGaLoaded) return;
    window._fbGaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
  }

  function buildBanner(t) {
    var el = document.createElement("div");
    el.id = "fb-cookie-banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "fb-cookie-title");
    el.innerHTML =
      '<div class="fb-cookie-inner">' +
      '<div class="fb-cookie-text">' +
      '<h2 id="fb-cookie-title" class="fb-cookie-title">' +
      t.bannerTitle +
      "</h2>" +
      '<p class="fb-cookie-desc">' +
      t.bannerText +
      "</p>" +
      '<div class="fb-cookie-links">' +
      '<a href="' +
      t.privacyUrl +
      '" class="fb-cookie-link">' +
      t.privacyLink +
      "</a>" +
      '<span class="fb-cookie-sep" aria-hidden="true">·</span>' +
      '<a href="' +
      t.cookieUrl +
      '" class="fb-cookie-link">' +
      t.cookieLink +
      "</a>" +
      "</div>" +
      "</div>" +
      '<div class="fb-cookie-actions">' +
      '<button id="fb-cookie-accept" class="fb-btn fb-btn-primary">' +
      t.acceptAll +
      "</button>" +
      '<button id="fb-cookie-reject" class="fb-btn fb-btn-secondary">' +
      t.rejectOptional +
      "</button>" +
      '<button id="fb-cookie-settings-btn" class="fb-btn fb-btn-ghost">' +
      t.settings +
      "</button>" +
      "</div>" +
      "</div>";
    return el;
  }

  function buildModal(t) {
    var el = document.createElement("div");
    el.id = "fb-cookie-modal";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "fb-modal-title");
    el.innerHTML =
      '<div class="fb-modal-backdrop" id="fb-modal-backdrop"></div>' +
      '<div class="fb-modal-box" role="document">' +
      '<h2 id="fb-modal-title" class="fb-modal-title">' +
      t.modalTitle +
      "</h2>" +
      '<p class="fb-modal-intro">' +
      t.modalIntro +
      "</p>" +
      '<p class="fb-modal-withdraw">' +
      t.withdrawNote +
      "</p>" +
      '<div class="fb-cookie-row">' +
      '<div class="fb-cookie-row-info">' +
      "<strong>" +
      t.necessaryTitle +
      "</strong>" +
      "<span>" +
      t.necessaryDesc +
      "</span>" +
      "</div>" +
      '<span class="fb-always-active" aria-label="' +
      t.alwaysActive +
      '">' +
      t.alwaysActive +
      "</span>" +
      "</div>" +
      '<div class="fb-cookie-row">' +
      '<div class="fb-cookie-row-info">' +
      "<strong>" +
      t.analyticsTitle +
      "</strong>" +
      "<span>" +
      t.analyticsDesc +
      "</span>" +
      "</div>" +
      '<label class="fb-toggle" aria-label="' +
      t.analyticsTitle +
      '">' +
      '<input type="checkbox" id="fb-analytics-toggle">' +
      '<span class="fb-toggle-track"><span class="fb-toggle-thumb"></span></span>' +
      "</label>" +
      "</div>" +
      '<div class="fb-modal-actions">' +
      '<button id="fb-modal-save" class="fb-btn fb-btn-primary">' +
      t.savePrefs +
      "</button>" +
      "</div>" +
      "</div>";
    return el;
  }

  function openModal(modal) {
    var consent = getConsent();
    var toggle = document.getElementById("fb-analytics-toggle");
    if (toggle) toggle.checked = consent ? !!consent.analytics : false;
    modal.classList.add("fb-modal-visible");
    var save = document.getElementById("fb-modal-save");
    if (save)
      setTimeout(function () {
        save.focus();
      }, 80);
  }

  function closeModal(modal) {
    modal.classList.remove("fb-modal-visible");
  }

  function bindModal(modal, onSave) {
    document
      .getElementById("fb-modal-backdrop")
      .addEventListener("click", function () {
        closeModal(modal);
      });
    document
      .getElementById("fb-modal-save")
      .addEventListener("click", function () {
        var analytics = !!document.getElementById("fb-analytics-toggle")
          .checked;
        setConsent(analytics);
        if (analytics) loadGA();
        closeModal(modal);
        onSave();
      });
  }

  function hideBanner(banner) {
    banner.classList.remove("fb-cookie-visible");
    banner.classList.add("fb-cookie-hidden");
    setTimeout(function () {
      if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    }, 450);
  }

  function injectManageButton(t) {
    if (document.getElementById("fb-cookie-manage")) return;

    var btn = document.createElement("button");
    btn.id = "fb-cookie-manage";
    btn.textContent = t.manageBtn;
    btn.setAttribute("aria-label", t.manageBtn);
    document.body.appendChild(btn);

    btn.addEventListener("click", function () {
      var modal = document.getElementById("fb-cookie-modal");
      if (!modal) {
        modal = buildModal(t);
        document.body.appendChild(modal);
        bindModal(modal, function () {});
        document.addEventListener("keydown", function escHandler(e) {
          if (e.key === "Escape") {
            closeModal(modal);
          }
        });
      }
      openModal(modal);
    });
  }

  function init() {
    var lang = getLang();
    var t = i18n[lang] || i18n.de;

    var stored = getConsent();
    if (stored && stored.version === CONSENT_VERSION) {
      if (stored.analytics) loadGA();
      injectManageButton(t);
      return;
    }

    var banner = buildBanner(t);
    var modal = buildModal(t);
    document.body.appendChild(banner);
    document.body.appendChild(modal);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add("fb-cookie-visible");
      });
    });

    document
      .getElementById("fb-cookie-accept")
      .addEventListener("click", function () {
        setConsent(true);
        loadGA();
        hideBanner(banner);
        injectManageButton(t);
      });

    document
      .getElementById("fb-cookie-reject")
      .addEventListener("click", function () {
        setConsent(false);
        hideBanner(banner);
        injectManageButton(t);
      });

    document
      .getElementById("fb-cookie-settings-btn")
      .addEventListener("click", function () {
        openModal(modal);
      });

    bindModal(modal, function () {
      hideBanner(banner);
      injectManageButton(t);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal(modal);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
