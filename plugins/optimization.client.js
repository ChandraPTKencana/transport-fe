export default defineNuxtPlugin(() => {
  if (process.client) {
    // Optimasi gambar lazy loading
    const lazyLoadImages = () => {
      const images = document.querySelectorAll('img[data-src]');
      
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    };

    // Preload critical images
    const preloadCriticalImages = () => {
      const criticalImages = document.querySelectorAll('img[data-critical]');
      criticalImages.forEach(img => {
        if (img.dataset.src) {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'image';
          preloadLink.href = img.dataset.src;
          document.head.appendChild(preloadLink);
        }
      });
    };

    // Delay non-critical resources
    const loadNonCritical = () => {
      // Load non-critical CSS
      const nonCriticalLinks = document.querySelectorAll('link[data-rel="stylesheet"]');
      nonCriticalLinks.forEach(link => {
        link.setAttribute('rel', 'stylesheet');
        link.removeAttribute('data-rel');
      });
    };

    // Jalankan optimasi
    document.addEventListener('DOMContentLoaded', () => {
      preloadCriticalImages();
      lazyLoadImages();
    });

    window.addEventListener('load', () => {
      setTimeout(loadNonCritical, 2000);
    });
  }
});