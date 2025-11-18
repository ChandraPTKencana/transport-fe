export default defineNuxtPlugin((nuxtApp) => {
    if (process.client) {
      // Preload likely next routes
      const preloadLikelyRoutes = () => {
        const routes = ['/about', '/contact', '/products']
        
        routes.forEach(route => {
          const link = document.createElement('link')
          link.rel = 'prefetch'
          link.href = route
          link.as = 'document'
          document.head.appendChild(link)
        })
      }
  
      // Preload setelah page load
      window.addEventListener('load', () => {
        setTimeout(preloadLikelyRoutes, 2000)
      })
    }
  })