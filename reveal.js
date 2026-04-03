(() => {
  const isMobile = window.matchMedia("(max-width: 768px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function applyReveal() {
    if (!isMobile.matches) {
      return;
    }

    const marker = document.querySelector(".reveal-start");
    const elements = Array.from(
      document.querySelectorAll(
        "body *:not(script):not(style):not(footer):not(footer *):not(.overlay):not(.overlay *):not(.whatsapp-btn):not(.share-fab):not(.share-fab *):not(.lang-select-horizontal):not(.up):not(.up *):not(svg):not(svg *)",
      ),
    ).filter((el) => {
      if (!marker) return true;
      return (
        el === marker ||
        marker.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING
      );
    });

    if (reduceMotion.matches) {
      elements.forEach((el) =>
        el.classList.add("reveal-on-mobile", "is-visible"),
      );
      return;
    }

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) =>
        el.classList.add("reveal-on-mobile", "is-visible"),
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.1,
      },
    );

    elements.forEach((el) => {
      el.classList.add("reveal-on-mobile");
      observer.observe(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyReveal);
  } else {
    applyReveal();
  }
})();
