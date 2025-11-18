<template>
  <div>
    <!-- <NuxtWelcome /> -->

    <!-- Critical Above-the-Fold CSS -->
    

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script setup>

onMounted(() => {
  // Reveal non-critical content setelah load
  setTimeout(() => {
    const nonCriticalElements = document.querySelectorAll('.non-critical')
    nonCriticalElements.forEach(el => {
      el.style.opacity = '1'
      el.style.visibility = 'visible'
    })
  }, 100)
})

// import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
// import { useAlertStore } from '~/store/alert'

// const { display } = useAlertStore();
// const { show, status, message } = storeToRefs(useAlertStore());

// if (process.client) {
//     window.addEventListener('click', (e) => {
//         const target = e.target;
//         if (target instanceof Element) {
//             // Now TypeScript knows that target is an Element
//             if (document?.getElementById('alert')?.contains(target)) {
//             } else {
//                 show.value = false;
//             }
//         }
//     });
// }
</script>
<style>
  /* Critical styles untuk LCP element */
  .lcp-element {
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
  }
  
  /* Minimal styles untuk initial render */
  body {
    font-family: system-ui, -apple-system, sans-serif;
    margin: 0;
    padding: 0;
  }
  
  #__nuxt {
    min-height: 100vh;
  }
  
  /* Sembunyikan non-critical elements sementara */
  .non-critical {
    opacity: 0;
    visibility: hidden;
  }
</style>