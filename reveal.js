(() => {
  // Scroll-reveal on mobile is disabled: applying opacity:0 to all body
  // descendants caused elements (pricing cards, sections) to get permanently
  // stuck invisible when IntersectionObserver failed to fire on iOS Safari.
  // The reveal-luxury system in script.js handles desktop reveal animations.
  // Elements are visible by default; no hidden states are added on mobile.
})();
