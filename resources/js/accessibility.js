// accessibility.js - Accessibility enhancements

const Accessibility = (function() {
  function init() {
    addAriaLabels();
    enhanceKeyboardNavigation();
  }
  
  function addAriaLabels() {
    // Add ARIA labels to nav links
    const navLinksA = document.querySelectorAll('.nav-links a, #mobile-nav a');
    navLinksA.forEach(link => {
      if (!link.hasAttribute('aria-label')) {
        link.setAttribute('aria-label', link.textContent.trim());
      }
    });
    
    // Add ARIA attributes to hamburger
    const hamburgerBtn = document.getElementById('hamburger-menu');
    if (hamburgerBtn) {
      hamburgerBtn.setAttribute('aria-label', 'Open navigation menu');
      hamburgerBtn.setAttribute('tabindex', '0');
      hamburgerBtn.setAttribute('role', 'button');
    }
  }
  
  function enhanceKeyboardNavigation() {
    // Already implemented in navigation.js and gallery.js
    // This function is a placeholder for any additional keyboard navigation enhancements
  }
  
  // Public API
  return {
    init: init
  };
})();
