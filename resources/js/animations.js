// animations.js - All animation and scroll effects

const Animations = (function() {
  function init() {
    initScrollAnimations();
    initSocialIconAnimations();
  }
  
  function initScrollAnimations() {
    console.log('Initializing scroll animations');
    
    // Initialize after a short delay to ensure elements are loaded
    setTimeout(() => {
      const animatedEls = document.querySelectorAll('.animate-on-scroll');
      console.log('Found animate elements:', animatedEls.length);
      
      if (animatedEls.length > 0) {
        // Create the observer and store it in window for other scripts to access
        window.scrollAnimationObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              obs.unobserve(entry.target);
              console.log('Element in view:', entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        animatedEls.forEach(el => window.scrollAnimationObserver.observe(el));
      }
      
      // Add in-view class to elements already in viewport on page load
      checkInitialVisibility();
      
      // Gallery image progressive loading animation
      initGalleryAnimations();
    }, 100);
  }
  
  function checkInitialVisibility() {
    document.querySelectorAll('.animate-on-scroll:not(.in-view)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('in-view');
      }
    });
  }
  
  function initGalleryAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
      galleryItems.forEach((item, index) => {
        // Add staggered delay for nice cascade effect
        item.style.transitionDelay = `${index * 100}ms`;
      });
    }
  }
  
  function initSocialIconAnimations() {
    // Animated Social Icons in Footer
    const socialLinks = document.querySelectorAll('.footer-social-links a');
    socialLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.classList.add('icon-animate');
      });
      link.addEventListener('mouseleave', () => {
        link.classList.remove('icon-animate');
      });
    });
  }
  
  // Public API
  return {
    init: init
  };
})();
