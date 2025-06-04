// main.js
// Jake Dillon site main JavaScript

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// Load events from JSON file
document.addEventListener('DOMContentLoaded', function() {
  // Add cache-busting timestamp to prevent the browser from using cached data
  const timestamp = new Date().getTime();
  fetch(`resources/events.json?t=${timestamp}`, {
    cache: 'no-store' // Force a network request, don't use any cache
  })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(events => {
      const eventsContainer = document.getElementById('events-container');
      eventsContainer.innerHTML = '';
      events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card animate-on-scroll';
        // If ticketLink exists and is not null, show the ticket link, otherwise show "Free Event"
        const ticketLinkHtml = (event.ticketLink && event.ticketLink !== null)
          ? `<a href="${event.ticketLink}" target="_blank" class="event-ticket-link">Get Tickets</a>`
          : '<span class="no-tickets">Free Event</span>';
        eventCard.innerHTML = `
          <div class="event-date">${event.date}</div>
          <h3 class="event-title">${event.title}</h3>
          <div class="event-time">${event.time}</div>
          <div class="event-location">${event.location}</div>
          <p class="event-description">${event.description}</p>
          ${ticketLinkHtml}
        `;
        eventsContainer.appendChild(eventCard);
        
        // When dynamically adding elements, we need to observe them separately
        // since the main observer might already have been initialized
        setTimeout(() => {
          // Try to observe with existing observer or create a new one just for this card
          if (window.scrollAnimationObserver) {
            window.scrollAnimationObserver.observe(eventCard);
          } else {
            const cardObserver = new IntersectionObserver((entries, obs) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('in-view');
                  obs.unobserve(entry.target);
                }
              });
            }, { threshold: 0.1 });
            cardObserver.observe(eventCard);
          }
        }, 100);
      });
    })
    .catch(error => {
      console.error('Error loading events:', error);
      document.getElementById('events-container').innerHTML = 
        '<p class="error-message">Sorry, there was an error loading events. Please try again later.</p>';
    });
});



// Hamburger menu toggle
const hamburger = document.getElementById('hamburger-menu');
const mobileNav = document.getElementById('mobile-nav');
hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') mobileNav.classList.remove('open');
});

// Sticky nav on scroll (only after header)
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('.header');
function stickyNavHandler() {
  if (window.scrollY >= header.offsetTop + header.offsetHeight) {
    navLinks.classList.add('sticky-nav');
  } else {
    navLinks.classList.remove('sticky-nav');
  }
}
window.addEventListener('scroll', stickyNavHandler);

// Footer year auto-update
document.addEventListener('DOMContentLoaded', function() {
  var yearSpan = document.getElementById('footer-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

// 4. Animated Social Icons in Footer
const socialLinks = document.querySelectorAll('.footer-social-links a');
socialLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    link.classList.add('icon-animate');
  });
  link.addEventListener('mouseleave', () => {
    link.classList.remove('icon-animate');
  });
});

// 7. Animate elements on scroll (simple fade-in)
document.addEventListener('DOMContentLoaded', function() {
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
    const checkInitialVisibility = () => {
      document.querySelectorAll('.animate-on-scroll:not(.in-view)').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('in-view');
        }
      });
    };
    
    checkInitialVisibility();
    
    // Gallery image progressive loading animation
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
      galleryItems.forEach((item, index) => {
        // Add staggered delay for nice cascade effect
        item.style.transitionDelay = `${index * 100}ms`;
      });
    }
  }, 100);
});

// 9. Spotify/YouTube Embeds (auto-resize, accessible)
function makeEmbedsResponsive() {
  document.querySelectorAll('.responsive-embed').forEach(embed => {
    const wrapper = document.createElement('div');
    wrapper.className = 'embed-wrapper';
    embed.parentNode.insertBefore(wrapper, embed);
    wrapper.appendChild(embed);
  });
}
document.addEventListener('DOMContentLoaded', makeEmbedsResponsive);

// 10. Accessibility Improvements
// Add ARIA labels to nav links and hamburger
const navLinksA = document.querySelectorAll('.nav-links a, #mobile-nav a');
navLinksA.forEach(link => {
  if (!link.hasAttribute('aria-label')) {
    link.setAttribute('aria-label', link.textContent.trim());
  }
});
const hamburgerBtn = document.getElementById('hamburger-menu');
hamburgerBtn.setAttribute('aria-label', 'Open navigation menu');
hamburgerBtn.setAttribute('tabindex', '0');
hamburgerBtn.setAttribute('role', 'button');

// Keyboard navigation for hamburger
hamburgerBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    hamburgerBtn.click();
  }
});


