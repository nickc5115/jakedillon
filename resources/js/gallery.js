// gallery.js - Gallery and lightbox functionality

const Gallery = (function() {
  // Cached DOM elements
  let galleryItems;
  let lightbox;
  let lightboxImg;
  let lightboxLoader;
  let lightboxClose;
  let lightboxCaption;
  let lightboxNext;
  let lightboxPrev;
  let lightboxCounter;
  
  // State variables
  let currentImageIndex = 0;
  let images = [];
  let captions = [];
  let isLoading = false;
  
  function init() {
    cacheElements();
    if (!galleryItems.length || !lightbox) return;
    
    collectGalleryImages();
    bindEvents();
    setupEmbeds();
  }
  
  function cacheElements() {
    galleryItems = document.querySelectorAll('.gallery-item');
    lightbox = document.getElementById('lightbox');
    lightboxImg = document.getElementById('lightbox-img');
    lightboxLoader = document.getElementById('lightbox-loader');
    lightboxClose = document.querySelector('.lightbox-close');
    lightboxCaption = document.querySelector('.lightbox-caption');
    lightboxNext = document.querySelector('.lightbox-next');
    lightboxPrev = document.querySelector('.lightbox-prev');
    lightboxCounter = document.querySelector('.lightbox-counter');
  }
  
  function collectGalleryImages() {
    // Collect all gallery images and captions
    galleryItems.forEach(item => {
      const img = item.querySelector('img');
      if (img) {
        images.push(img.src);
        captions.push(img.alt);
      }
    });
  }
  
  function bindEvents() {
    // Add event listeners to gallery items
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        openLightbox(index);
      });
      
      // Make it keyboard accessible
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });
    });
    
    // Add event listeners for lightbox controls
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightboxNext) {
      lightboxNext.addEventListener('click', showNextImage);
    }
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', showPrevImage);
    }
    
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
  }
  
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
  
  // Spotify/YouTube Embeds (auto-resize, accessible)
  function setupEmbeds() {
    document.querySelectorAll('.responsive-embed').forEach(embed => {
      const wrapper = document.createElement('div');
      wrapper.className = 'embed-wrapper';
      embed.parentNode.insertBefore(wrapper, embed);
      wrapper.appendChild(embed);
    });
  }
  
  // Public API
  return {
    init: init
  };
})();
