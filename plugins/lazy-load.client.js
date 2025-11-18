export default defineNuxtPlugin((nuxtApp) => {
    if (process.client) {
      // Intersection Observer untuk lazy loading components
      const lazyComponents = new Map()
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const component = lazyComponents.get(entry.target)
            if (component) {
              component.load()
              observer.unobserve(entry.target)
              lazyComponents.delete(entry.target)
            }
          }
        })
      }, {
        rootMargin: '50px', // Load 50px sebelum visible
        threshold: 0.1
      })
      
      // Register lazy component
      nuxtApp.provide('registerLazy', (element, loadFn) => {
        lazyComponents.set(element, { load: loadFn })
        observer.observe(element)
      })
    }
  })