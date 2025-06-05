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

document.addEventListener('DOMContentLoaded', function () {
  const playPauseBtn = document.getElementById('play-pause-btn');
  if (playPauseBtn) {
    playPauseBtn.classList.add('pulse');
    playPauseBtn.addEventListener('click', function () {
      playPauseBtn.classList.remove('pulse');
    });
  }

  // Only add event listeners if all audio player elements exist
  const audio = document.getElementById('audio-player');
  const playPauseIcon = playPauseBtn ? playPauseBtn.querySelector('i') : null;
  const progressBar = document.getElementById('progress-bar');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');
  const muteBtn = document.getElementById('mute-btn');
  const muteIcon = muteBtn ? muteBtn.querySelector('i') : null;

  if (audio && playPauseBtn && playPauseIcon && progressBar && currentTimeEl && durationEl && muteBtn && muteIcon) {
    function formatTime(time) {
      const min = Math.floor(time / 60);
      const sec = Math.floor(time % 60).toString().padStart(2, '0');
      return `${min}:${sec}`;
    }

    audio.addEventListener('loadedmetadata', function () {
      durationEl.textContent = formatTime(audio.duration);
      progressBar.max = Math.floor(audio.duration);
    });

    audio.addEventListener('timeupdate', function () {
      currentTimeEl.textContent = formatTime(audio.currentTime);
      progressBar.value = Math.floor(audio.currentTime);
    });

    playPauseBtn.addEventListener('click', function () {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('play', function () {
      playPauseIcon.classList.remove('fa-play');
      playPauseIcon.classList.add('fa-pause');
    });
    audio.addEventListener('pause', function () {
      playPauseIcon.classList.remove('fa-pause');
      playPauseIcon.classList.add('fa-play');
    });

    progressBar.addEventListener('input', function () {
      audio.currentTime = progressBar.value;
    });

    muteBtn.addEventListener('click', function () {
      audio.muted = !audio.muted;
      muteIcon.className = audio.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    });

    // Initialize
    if (audio.readyState >= 1) {
      durationEl.textContent = formatTime(audio.duration);
      progressBar.max = Math.floor(audio.duration);
    }
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }

  // Audio player footer visibility detection
  const audioPlayerContainer = document.querySelector('.audio-player-container');
  const footer = document.querySelector('.site-footer');
  
  if (audioPlayerContainer && footer) {
    // Function to check if footer is in viewport and update player visibility
    function updatePlayerVisibility() {
      const footerRect = footer.getBoundingClientRect();
      // Check if any part of the footer is visible in the viewport
      const isFooterVisible = (
        footerRect.top < window.innerHeight && 
        footerRect.bottom > 0
      );
      
      if (isFooterVisible) {
        // When footer is visible, hide the audio player
        audioPlayerContainer.classList.add('hidden');
      } else {
        // When footer is not visible, show the audio player
        audioPlayerContainer.classList.remove('hidden');
      }
    }
    
    // Run on scroll events with throttling for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(function() {
          updatePlayerVisibility();
          scrollTimeout = null;
        }, 10); // Throttle to improve performance
      }
    });
    
    // Also run on resize events
    window.addEventListener('resize', updatePlayerVisibility);
    
    // Run once on page load after a slight delay to ensure DOM is fully processed
    setTimeout(updatePlayerVisibility, 100);
    
    // Also use IntersectionObserver as a backup method
    const footerObserver = new IntersectionObserver(
      (entries) => {
        updatePlayerVisibility();
      },
      {
        root: null,
        threshold: [0, 0.1, 0.5, 1.0] // Multiple thresholds for better detection
      }
    );
    
    footerObserver.observe(footer);
  }
});
