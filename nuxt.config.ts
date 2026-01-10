import { resolve } from 'path';

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      baseURL: process.env.MY_API_ADDR,
    },
  },
  image: {
    provider: 'static'
  },
  app: {
    baseURL: process.env.ROUTER_BASE || '/',
    buildAssetsDir: '_nuxt/',
    head: {
      title: "App-Genkagromas",
      htmlAttrs: {
        lang: 'id',
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { hid: "description", name: "description", content: "Aplikasi Logistik" },
        { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
        { 'http-equiv': 'Pragma', content: 'no-cache' },
        { 'http-equiv': 'Expires', content: '0' }
        // Preload critical resources
        // { name: "theme-color", content: "#ffffff" }
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/logistik/favicon.png"
        },
        // Preconnect untuk optimasi
        // {
        //   rel: "preconnect",
        //   href: "https://fonts.gstatic.com",
        //   crossorigin: ""
        // }
         // Preload critical fonts
        //  {
        //   rel: "preload",
        //   href: "/fonts/critical-font.woff2",
        //   as: "font",
        //   type: "font/woff2",
        //   crossorigin: ""
        // }
      ],
      script: [
        // Inline critical scripts
      ]
    }
  },
  
  ssr: false,
  devtools: { enabled: false },
  
  alias: {
    '@': resolve(__dirname, '/'),
  },
  
  css: [
    '~/assets/main.scss'
  ],
  
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      cssnano: process.env.MY_NODE_ENV === 'production' ? { preset: 'default' } : false
    },
  },
  
  build: {
    transpile: ['@vuepic/vue-datepicker'],
    // Optimasi build
    optimizeCSS: true,
    // Nonaktifkan sourcemap di production
    cssSourceMap: false,
    // Reduce bundle size
    extractCSS: false, 
    // extractCSS: {
    //   ignoreOrder: true
    // }
  },
  
  modules: [
    '@pinia/nuxt',
    '@nuxt/image' // Untuk optimasi gambar
  ],
  
  nitro: {
    routeRules: {
      "/api/**": { proxy: 'http://127.0.0.1/transport-be/a9p/**' },
      
      // Optimasi cache untuk static assets
      '/_nuxt/**': { 
        headers: { 
          'Cache-Control': 'public, max-age=31536000, immutable' ,
          'X-Content-Type-Options': 'nosniff'
        } 
      },
      '/logistik/**': { 
        headers: { 
          'Cache-Control': 'public, max-age=31536000' 
        } 
      },
      '/**': {
        headers: {
          'Cache-Control': 'public, max-age=3600' // 1 hour for HTML
        }
      }
    },
    
    // Optimasi prerender
    prerender: {
      crawlLinks: false,
      routes: ['/']
    }
  },
  
  experimental: {
    payloadExtraction: true, // Aktifkan untuk optimasi
    inlineSSRStyles: false
  },
  
  components: [{ 
    path: "~/components", 
    global: true,
    // pathPrefix: false 
  }],
  
  // OPTIMASI TAMBAHAN UNTUK NUXT 3:
  // sourcemap: process.env.MY_NODE_ENV !== 'production', // Nonaktifkan sourcemap di production
  sourcemap: false, // Nonaktifkan sourcemap di production
  
  // Optimasi kompilasi
  typescript: {
    typeCheck: false, // Nonaktifkan type check saat build untuk performa
    tsConfig: {
      compilerOptions: {
        incremental: false // Reduce memory usage
      }
    }
  },
  vue: {
    compilerOptions: {
      hoistStatic: true,
      cacheHandlers: true
    }
  },
  // vite: {
  //   build: {
  //     rollupOptions: {
  //       output: {
  //         manualChunks: {
  //           'vue-vendor': ['vue', '@vue/runtime-core'],
  //           'pinia-vendor': ['pinia'],
  //           'ui-vendor': ['@vuepic/vue-datepicker'],
  //           'utils': ['lodash', 'axios']
  //         }
  //       }
  //     }
  //   }
  // }
  // vite: {
  //   build: {
  //     rollupOptions: {
  //       output: {
  //         manualChunks: (id) => {
  //           // Vendor chunks
  //           if (id.includes('node_modules')) {
  //             if (id.includes('vue')) return 'vue-vendor'
  //             if (id.includes('pinia')) return 'state-vendor'
  //             if (id.includes('datepicker')) return 'ui-vendor'
  //             return 'vendor'
  //           }
            
  //           // Route-based chunks
  //           if (id.includes('pages/') && !id.includes('pages/index')) {
  //             return 'pages'
  //           }
  //         }
  //       },
  //       // Tree shaking yang lebih agresif
  //       treeshake: {
  //         preset: 'recommended',
  //         moduleSideEffects: false
  //       }
  //     },
  //     // Optimasi chunk size
  //     chunkSizeWarningLimit: 1000,
  //     target: 'es2015'
  //   }
  // }
})