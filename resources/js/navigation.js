// navigation.js - Navigation functionality, hamburger menu, and sticky navigation

const Navigation = (function() {
  // Cached DOM elements
  let mobileNav;
  let hamburgerMenu;
  let navLinks;
  let header;

  function init() {
    cacheElements();
    bindEvents();
  }

  function cacheElements() {
    mobileNav = document.getElementById('mobile-nav');
    hamburgerMenu = document.getElementById('hamburger-menu');
    navLinks = document.querySelector('.nav-links');
    header = document.querySelector('.header');
  }

  function bindEvents() {
    // Hamburger menu toggle
    if (hamburgerMenu) {
      hamburgerMenu.addEventListener('click', toggleMobileMenu);
      
      // Keyboard navigation for hamburger
      hamburgerMenu.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleMobileMenu();
        }
      });
    }

    // Close mobile menu when clicking a link
    if (mobileNav) {
      mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileNav.classList.remove('open');
        });
      });
      
      // Close mobile menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') mobileNav.classList.remove('open');
      });
    }

    // Sticky nav on scroll
    window.addEventListener('scroll', stickyNavHandler);
  }

  function toggleMobileMenu() {
    if (mobileNav) {
      mobileNav.classList.toggle('open');
    }
  }

  function stickyNavHandler() {
    if (!navLinks || !header) return;
    
    if (window.scrollY >= header.offsetTop + header.offsetHeight) {
      navLinks.classList.add('sticky-nav');
    } else {
      navLinks.classList.remove('sticky-nav');
    }
  }

  // Public API
  return {
    init: init
  };
})();
