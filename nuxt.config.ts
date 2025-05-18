// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path';
export default defineNuxtConfig({
  // rootDir : "",
  runtimeConfig: {
    public: {
      baseURL: process.env.MY_API_ADDR,
    },
  },
  app:{
    baseURL:process.env.ROUTER_BASE || '/',
    head: {
      title: "App-Genkagromas",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { hid: "description", name: "description", content: "" },
        { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
        { 'http-equiv': 'Pragma', content: 'no-cache' },
        { 'http-equiv': 'Expires', content: '0' }
      ],
      link: [
        // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        {
          rel: "icon",
          type: "image/png",
          href: "/logistik/favicon.png"
        }
      ]
    }
  },
  // ssr: true,
  ssr: false,
  devtools: { enabled: true },
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
    },
  },
  build: {
    transpile: ['@vuepic/vue-datepicker']
  },
  modules: [
    // ...
    '@pinia/nuxt',
  ],
  
  nitro: {
    routeRules: {
      // "/api/**": { proxy: 'http://127.0.0.1:8000/api/internal/**' },
      "/api/**": { proxy: 'http://127.0.0.1/transport-be/a9p/**' },
      // "/api/**": { proxy: 'https://genkagromas.com/api/a9p/**' },
      // "^/stok/api/**": { proxy: 'http://127.0.0.1/api/a9p/**' },
      // "/stok/api/**": { proxy: 'http://127.0.0.1/api/a9p/**' }
      // '/proxy/example': { proxy: 'http://39.98.58.238:8594' },
      // "/proxy/**": { proxy: '/api/**' },
    }
  },
  experimental: {
    payloadExtraction: false
  },
  components: [{ path: "~/components", global: true }]
  // proxy: {
  //   '/api/': {
  //     target: process.env.API_URL,
  //     pathRewrite: { '^/api/': '/' },
  //     // changeOrigin:true 
  //   }
  // },
})
