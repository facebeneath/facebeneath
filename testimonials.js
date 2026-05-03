(function () {
  "use strict";

  var GOOGLE_G_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ' +
    'width="14" height="14" aria-hidden="true">' +
    '<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92' +
    'c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>' +
    '<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77' +
    "c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84" +
    'C3.99 20.53 7.7 23 12 23z"/>' +
    '<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43' +
    '.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>' +
    '<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15' +
    "C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84" +
    'c.87-2.6 3.3-4.53 6.16-4.53z"/>' +
    "</svg>";

  function injectGoogleG(container) {
    container.querySelectorAll(".fb-tc__badge-g").forEach(function (el) {
      el.innerHTML = GOOGLE_G_SVG;
      el.classList.add("fb-has-svg");
    });
  }

  function cloneSet(originalCards, grid) {
    var frag = document.createDocumentFragment();
    originalCards.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      injectGoogleG(clone);
      frag.appendChild(clone);
    });
    grid.appendChild(frag);
  }

  function startLoop(grid, section, originalCards) {
    var GAP = 20;
    var SPEED = 72;

    var cardWidth = originalCards[0].getBoundingClientRect().width || 300;
    var oneSetWidth = originalCards.length * (cardWidth + GAP);

    var minTotal = Math.max(window.innerWidth * 3, oneSetWidth * 3);
    var currentTotal = oneSetWidth;
    while (currentTotal < minTotal) {
      cloneSet(originalCards, grid);
      currentTotal += oneSetWidth;
    }

    var pos = 0;
    var paused = false;
    var lastTime = null;
    var rafId = null;

    function tick(now) {
      if (!paused) {
        if (lastTime !== null) {
          var dt = (now - lastTime) / 1000;
          pos -= SPEED * dt;
          if (pos <= -oneSetWidth) {
            pos += oneSetWidth;
          }
          grid.style.transform = "translateX(" + pos.toFixed(2) + "px)";
        }
        lastTime = now;
      } else {
        lastTime = null;
      }
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    section.addEventListener("mouseenter", function () {
      paused = true;
    });
    section.addEventListener("mouseleave", function () {
      paused = false;
    });

    var resumeTimer = null;
    section.addEventListener(
      "touchstart",
      function () {
        paused = true;
        clearTimeout(resumeTimer);
      },
      { passive: true },
    );
    section.addEventListener(
      "touchend",
      function () {
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(function () {
          paused = false;
        }, 2000);
      },
      { passive: true },
    );

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        paused = true;
        cancelAnimationFrame(rafId);
        var clones = grid.querySelectorAll('[aria-hidden="true"]');
        clones.forEach(function (el) {
          el.parentNode.removeChild(el);
        });
        injectGoogleG(section);
        startLoop(grid, section, originalCards);
      }, 300);
    });
  }

  function initMarquee() {
    var grids = document.querySelectorAll(".fb-testimonials__grid");
    if (!grids.length) return;

    grids.forEach(function (grid) {
      var section = grid.closest(".fb-testimonials");
      if (!section) return;

      var originalCards = Array.from(
        grid.querySelectorAll(".fb-tc:not([aria-hidden])"),
      );
      if (originalCards.length < 1) return;

      injectGoogleG(section);

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          startLoop(grid, section, originalCards);
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMarquee);
  } else {
    initMarquee();
  }
})();
