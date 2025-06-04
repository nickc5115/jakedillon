// main.js
// Jake Dillon site main JavaScript

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// Audio Player Controls
document.addEventListener('DOMContentLoaded', function() {
  const audioElement = document.getElementById('background-audio');
  const playBtn = document.getElementById('play-btn');
  const playIcon = playBtn.querySelector('i');
  const muteBtn = document.getElementById('mute-btn');
  const muteIcon = muteBtn.querySelector('i');
  const volumeSlider = document.getElementById('volume-slider');
  const progressBar = document.getElementById('progress-bar');
  const progressContainer = document.querySelector('.progress-container');
  const currentTimeElement = document.getElementById('current-time');
  const durationElement = document.getElementById('duration');
  
  // Set initial volume
  audioElement.volume = 0.7;
  
  // Auto-play audio when the page loads with browser policy considerations
  // Using a slight delay to ensure everything is properly loaded
  setTimeout(() => {
    // Try to play the audio automatically
    audioElement.play().then(() => {
      // If successful, update the play button icon
      playIcon.className = 'fas fa-pause';
    }).catch(error => {
      // Auto-play was prevented by the browser
      console.log("Auto-play was prevented by browser policy:", error);
      // We'll keep the button in play state so user knows they need to click it
      playIcon.className = 'fas fa-play';
      // Add a subtle animation to draw attention to the play button
      playBtn.classList.add('play-pulse');
      
      // Function to play audio on ANY user interaction
      const playAudioOnInteraction = () => {
        // Only attempt to play if it's still paused
        if (audioElement.paused) {
          audioElement.play().then(() => {
            playIcon.className = 'fas fa-pause';
          }).catch(err => {
            console.log("Still unable to play audio:", err);
          });
        }
        
        // Remove the pulse animation
        playBtn.classList.remove('play-pulse');
        
        // Remove all event listeners once triggered
        document.removeEventListener('click', playAudioOnInteraction);
        document.removeEventListener('touchstart', playAudioOnInteraction);
        document.removeEventListener('scroll', playAudioOnInteraction);
        document.removeEventListener('keydown', playAudioOnInteraction);
        document.removeEventListener('mousemove', playAudioOnInteraction);
      };
      
      // Add listeners for any user interaction
      document.addEventListener('click', playAudioOnInteraction, { once: true });
      document.addEventListener('touchstart', playAudioOnInteraction, { once: true });
      document.addEventListener('scroll', playAudioOnInteraction, { once: true });
      document.addEventListener('keydown', playAudioOnInteraction, { once: true });
      document.addEventListener('mousemove', playAudioOnInteraction, { once: true });
    });
  }, 1000);
  
  // Format time to MM:SS
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  
  // Update progress bar and time display
  function updateProgress() {
    const { currentTime, duration } = audioElement;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    currentTimeElement.textContent = formatTime(currentTime);
    if (!isNaN(duration)) {
      durationElement.textContent = formatTime(duration);
    }
  }
  
  // Set the audio time based on click position
  function setProgress(e) {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audioElement.duration;
    audioElement.currentTime = (clickX / width) * duration;
  }
  
  // Toggle play/pause
  function togglePlay() {
    if (audioElement.paused) {
      playIcon.className = 'fas fa-pause';
      audioElement.play();
      // Remove the pulse animation if it's there
      playBtn.classList.remove('play-pulse');
    } else {
      playIcon.className = 'fas fa-play';
      audioElement.pause();
    }
  }
  
  // Toggle mute
  function toggleMute() {
    if (audioElement.muted) {
      audioElement.muted = false;
      muteIcon.className = 'fas fa-volume-up';
      volumeSlider.value = audioElement.volume;
    } else {
      audioElement.muted = true;
      muteIcon.className = 'fas fa-volume-mute';
    }
  }
  
  // Update volume from slider
  function updateVolume() {
    audioElement.volume = volumeSlider.value;
    audioElement.muted = (volumeSlider.value === 0);
    
    // Update icon based on volume level
    if (audioElement.muted || volumeSlider.value === 0) {
      muteIcon.className = 'fas fa-volume-mute';
    } else if (volumeSlider.value < 0.5) {
      muteIcon.className = 'fas fa-volume-down';
    } else {
      muteIcon.className = 'fas fa-volume-up';
    }
  }
  
  // Event listeners
  playBtn.addEventListener('click', togglePlay);
  muteBtn.addEventListener('click', toggleMute);
  volumeSlider.addEventListener('input', updateVolume);
  volumeSlider.addEventListener('change', updateVolume);
  
  audioElement.addEventListener('timeupdate', updateProgress);
  audioElement.addEventListener('canplay', updateProgress);
  
  progressContainer.addEventListener('click', setProgress);
  
  // Handle when audio ends
  audioElement.addEventListener('ended', function() {
    playIcon.className = 'fas fa-play';
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Space bar to play/pause when not typing in an input field
    if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      togglePlay();
    }
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

// Lightbox Functionality
document.addEventListener('DOMContentLoaded', function() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxLoader = document.getElementById('lightbox-loader');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxNext = document.querySelector('.lightbox-next');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxCounter = document.querySelector('.lightbox-counter');
  
  let currentImageIndex = 0;
  const images = [];
  const captions = [];
  let isLoading = false;
  
  // Collect all gallery images and captions
  galleryItems.forEach(item => {
    const img = item.querySelector('img');
    images.push(img.src);
    captions.push(img.alt);
  });
  
  // Function to show loading indicator
  function showLoader() {
    isLoading = true;
    if (lightboxLoader) {
      lightboxLoader.style.display = 'block';
    }
  }
  
  // Function to hide loading indicator
  function hideLoader() {
    isLoading = false;
    if (lightboxLoader) {
      lightboxLoader.style.display = 'none';
    }
  }
  
  // Function to open the lightbox with a specific image
  function openLightbox(index) {
    lightbox.style.display = 'block';
    currentImageIndex = index;
    showLoader();
    
    // Set focus to the lightbox for keyboard navigation
    setTimeout(() => {
      lightbox.focus();
    }, 100);
    
    // Load the image
    lightboxImg.src = images[index];
    lightboxImg.onload = function() {
      hideLoader();
      lightboxCaption.textContent = captions[index];
      lightboxCounter.textContent = `${index + 1} / ${images.length}`;
    }
    
    lightboxImg.onerror = function() {
      hideLoader();
      lightboxCaption.textContent = "Image failed to load";
    }
    
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  }
  
  // Function to close the lightbox
  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = ''; // Re-enable scrolling
    
    // Return focus to the gallery item that was clicked
    if (currentImageIndex >= 0 && galleryItems[currentImageIndex]) {
      galleryItems[currentImageIndex].focus();
    }
  }
  
  // Function to show the next image
  function showNextImage() {
    if (isLoading) return; // Prevent changing images while one is loading
    
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showLoader();
    
    const newImg = new Image();
    newImg.src = images[currentImageIndex];
    newImg.onload = function() {
      lightboxImg.src = newImg.src;
      lightboxCaption.textContent = captions[currentImageIndex];
      lightboxCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
      hideLoader();
    };
    
    newImg.onerror = function() {
      hideLoader();
      lightboxCaption.textContent = "Image failed to load";
    };
  }
  
  // Function to show the previous image
  function showPrevImage() {
    if (isLoading) return; // Prevent changing images while one is loading
    
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    showLoader();
    
    const newImg = new Image();
    newImg.src = images[currentImageIndex];
    newImg.onload = function() {
      lightboxImg.src = newImg.src;
      lightboxCaption.textContent = captions[currentImageIndex];
      lightboxCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
      hideLoader();
    };
    
    newImg.onerror = function() {
      hideLoader();
      lightboxCaption.textContent = "Image failed to load";
    };
  }
  
  // Preload adjacent images for smoother experience
  function preloadAdjacentImages(currentIndex) {
    const totalImages = images.length;
    if (totalImages <= 1) return;
    
    // Preload next image
    const nextIndex = (currentIndex + 1) % totalImages;
    const nextImg = new Image();
    nextImg.src = images[nextIndex];
    
    // Preload previous image
    const prevIndex = (currentIndex - 1 + totalImages) % totalImages;
    const prevImg = new Image();
    prevImg.src = images[prevIndex];
  }
  
  // Add event listeners to gallery items
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
      preloadAdjacentImages(index);
    });
    
    // Make it keyboard accessible
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
        preloadAdjacentImages(index);
      }
    });
  });
  
  // Add event listeners for lightbox controls
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxClose.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      closeLightbox();
    }
  });
  
  lightboxNext.addEventListener('click', showNextImage);
  lightboxNext.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showNextImage();
    }
  });
  
  lightboxPrev.addEventListener('click', showPrevImage);
  lightboxPrev.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showPrevImage();
    }
  });
  
  // Close lightbox when clicking outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'block') {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
        e.preventDefault(); // Prevent page scrolling
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
        e.preventDefault(); // Prevent page scrolling
      }
    }
  });
  
  // Add touch swipe support for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;
  
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }
  
  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }
  
  function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance to be considered a swipe
    if (touchStartX - touchEndX > swipeThreshold) {
      showNextImage(); // Swipe left = next image
    } else if (touchEndX - touchStartX > swipeThreshold) {
      showPrevImage(); // Swipe right = previous image
    }
  }
  
  // Add swipe event listeners
  lightbox.addEventListener('touchstart', handleTouchStart, false);
  lightbox.addEventListener('touchend', handleTouchEnd, false);
});

// Background image check (no additional functionality needed)
document.addEventListener('DOMContentLoaded', function() {
  // Function to check if device is mobile (kept for potential future use)
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
  };
  
  // No additional functionality needed for the background image
  // The CSS handles the fade-in effect and positioning automatically
});

// Video background optimization (additional adjustments)
document.addEventListener('DOMContentLoaded', function() {
  // Video background optimization
  const video = document.querySelector('.video-background video');
  
  if (video) {
    // Function to check if device is mobile
    const isMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
             window.innerWidth <= 600;
    };
    
    // Function to force video positioning update
    const forceVideoUpdate = () => {
      if (isMobile()) {
        // Save the current time position
        const currentTime = video.currentTime;
        const wasPaused = video.paused;
        
        // Apply direct style
        video.style.objectPosition = '0% center';
        
        // Force a refresh of the video element
        const videoParent = video.parentElement;
        const videoClone = video.cloneNode(true);
        videoParent.removeChild(video);
        
        // Short timeout before re-adding to ensure style recalculation
        setTimeout(() => {
          videoParent.appendChild(videoClone);
          
          // Restore playback state
          if (!wasPaused) {
            videoClone.play();
          }
          videoClone.currentTime = currentTime;
          
          // Apply styles directly to the new element
          videoClone.style.objectPosition = '0% center';
        }, 50);
      }
    };
    
    // Apply force update once after initial load
    setTimeout(forceVideoUpdate, 1000);
    
    // Function to adjust video position to keep Jake visible
    const adjustVideoPosition = () => {
      if (isMobile()) {
        const screenWidth = window.innerWidth;
        const isPortrait = window.innerHeight > window.innerWidth;
        
        // Calculate position percentage based on screen size and orientation
        // The smaller the screen or in portrait mode, the more we shift to the left
        let positionX;
        
        if (isPortrait) {
          positionX = Math.min(5, 0 + (screenWidth / 100)); // 0-5% range in portrait - extreme left shift
        } else {
          positionX = Math.min(10, 5 + (screenWidth / 100)); // 5-10% range in landscape - strong left shift
        }
        
        // Apply the calculated position using inline style for maximum priority
        video.style.objectPosition = `${positionX}% center`;
        
        // Also try transformOrigin adjustment as a backup approach
        video.style.transformOrigin = '0% 50%';
        
        // Force a style recalculation to ensure changes take effect
        void video.offsetWidth;
      } else {
        // Reset for desktop
        video.style.objectPosition = '';
        video.style.transformOrigin = '';
      }
    };
    
    // Adjust on page load
    adjustVideoPosition();
    
    // Re-adjust when window resizes or orientation changes
    window.addEventListener('resize', adjustVideoPosition);
    window.addEventListener('orientationchange', adjustVideoPosition);
    
    // Function to check connection quality
    const checkConnectionSpeed = () => {
      const connection = navigator.connection || 
                         navigator.mozConnection || 
                         navigator.webkitConnection;
                         
      if (connection) {
        return connection.effectiveType || 'unknown';
      }
      return 'unknown';
    };
    
    // Optimize video playback based on device and connection
    const optimizeVideo = () => {
      if (isMobile()) {
        // For mobile devices
        if (checkConnectionSpeed() === '4g') {
          // Good connection, do nothing
        } else {
          // Slower connection, add loading class until video starts playing
          document.body.classList.add('video-loading');
        }
      }
      
      // Remove loading class when video can play
      video.addEventListener('canplay', () => {
        document.body.classList.remove('video-loading');
      });
      
      // Re-position video on orientation change to keep it centered
      window.addEventListener('resize', () => {
        if (isMobile()) {
          // Force a repaint to ensure video is properly positioned
          video.style.display = 'none';
          setTimeout(() => {
            video.style.display = '';
          }, 10);
        }
      });
    };
    
    optimizeVideo();
  }
});


