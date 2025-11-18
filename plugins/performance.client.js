export default defineNuxtPlugin((nuxtApp) => {
    if (process.client) {
      // Preload critical resources
      const preloadCriticalResources = () => {
        const criticalImages = document.querySelectorAll('img[data-critical]')
        criticalImages.forEach(img => {
          const src = img.getAttribute('data-src') || img.src
          if (src) {
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'image'
            link.href = src
            document.head.appendChild(link)
          }
        })
      }
  
      // Lazy load non-critical images
      const lazyLoadNonCritical = () => {
        const lazyImages = document.querySelectorAll('img[data-lazy-src]')
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target
              img.src = img.dataset.lazySrc
              img.classList.remove('lazy')
              imageObserver.unobserve(img)
            }
          })
        })
  
        lazyImages.forEach(img => imageObserver.observe(img))
      }
  
      // Defer non-critical CSS
      const loadNonCriticalCSS = () => {
        const nonCriticalLinks = document.querySelectorAll('link[data-rel="non-critical"]')
        nonCriticalLinks.forEach(link => {
          link.rel = 'stylesheet'
          link.removeAttribute('data-rel')
        })
      }
  
      // Execute optimizations
      document.addEventListener('DOMContentLoaded', () => {
        preloadCriticalResources()
        lazyLoadNonCritical()
      })
  
      window.addEventListener('load', () => {
        // Load non-critical CSS after page load
        setTimeout(loadNonCriticalCSS, 3000)
      })
    }
  })