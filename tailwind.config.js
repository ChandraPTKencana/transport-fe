/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    './composables/**/*.{js,ts}',
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    './app.vue',
    './error.vue'
  ],
   // Hapus utilities yang tidak digunakan
   corePlugins: {
    float: false,
    clear: false,
    skew: false,
    // ... non-critical utilities
  },
  theme: {
    extend: {},
  },
  plugins: [],
}

