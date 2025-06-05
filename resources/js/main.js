// main.js - Core initialization and entry point
// Jake Dillon site main JavaScript

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing site modules');

  // Initialize modules
  Navigation.init();
  Events.init();
  Animations.init();
  Gallery.init();
  Accessibility.init();
  
  // Footer year auto-update
  const yearSpan = document.getElementById('footer-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

// Smooth scrolling for anchor links - core functionality used throughout the site
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});
