// events.js - Events loading and display

const Events = (function() {
  // Cached DOM elements
  let eventsContainer;
  
  function init() {
    cacheElements();
    loadEvents();
  }
  
  function cacheElements() {
    eventsContainer = document.getElementById('events-container');
  }
  
  function loadEvents() {
    if (!eventsContainer) {
      console.error("Events container not found!");
      return;
    }
    
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
        displayEvents(events);
      })
      .catch(error => {
        console.error('Error loading events:', error);
        eventsContainer.innerHTML = 
          '<p class="error-message">Sorry, there was an error loading events. Please try again later.</p>';
      });
  }
  
  function displayEvents(events) {
    if (!eventsContainer) return;
    
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
  }
  
  // Public API
  return {
    init: init
  };
})();
