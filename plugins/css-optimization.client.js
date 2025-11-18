export default defineNuxtPlugin(() => {
    if (process.client) {
      // Load non-critical CSS setelah page interactive
      const loadNonCriticalCSS = () => {
        // Method 1: Preload pattern
        const preloadedCSS = document.querySelectorAll('link[rel="preload"][as="style"]')
        preloadedCSS.forEach(link => {
          if (link.rel === 'preload') {
            link.rel = 'stylesheet'
            link.removeAttribute('onload')
          }
        })
        
        // Method 2: Dynamic import untuk additional CSS
        const nonCriticalCSS = document.querySelectorAll('link[data-non-critical]')
        nonCriticalCSS.forEach(link => {
          link.rel = 'stylesheet'
          link.removeAttribute('data-non-critical')
        })
      }
  
      // Load non-critical CSS ketika page stabil
      if (document.readyState === 'complete') {
        setTimeout(loadNonCriticalCSS, 2000)
      } else {
        window.addEventListener('load', () => {
          setTimeout(loadNonCriticalCSS, 2000)
        })
      }
  
      // Intersection Observer untuk component-specific CSS
      const lazyLoadComponentCSS = () => {
        const lazyComponents = document.querySelectorAll('[data-lazy-css]')
        
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const component = entry.target
              const cssFile = component.dataset.lazyCss
              
              if (cssFile) {
                const link = document.createElement('link')
                link.rel = 'stylesheet'
                link.href = cssFile
                document.head.appendChild(link)
              }
              
              observer.unobserve(component)
            }
          })
        })
  
        lazyComponents.forEach(component => observer.observe(component))
      }
  
      document.addEventListener('DOMContentLoaded', lazyLoadComponentCSS)
    }
  })