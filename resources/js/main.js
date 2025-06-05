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
  const audio = document.getElementById('audio-player');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const playPauseIcon = playPauseBtn.querySelector('i');
  const progressBar = document.getElementById('progress-bar');
  const currentTimeEl = document.getElementById('current-time');
  const durationEl = document.getElementById('duration');
  const muteBtn = document.getElementById('mute-btn');
  const muteIcon = muteBtn.querySelector('i');
  const volumeSlider = document.getElementById('volume-slider');

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

  volumeSlider.addEventListener('input', function () {
    audio.volume = volumeSlider.value;
    audio.muted = audio.volume === 0;
    muteIcon.className = audio.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
  });

  // Initialize
  if (audio.readyState >= 1) {
    durationEl.textContent = formatTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);
  }
  currentTimeEl.textContent = formatTime(audio.currentTime);
  volumeSlider.value = audio.volume;
});
