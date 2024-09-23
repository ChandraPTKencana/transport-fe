<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Potongan'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex">
        <iframe src="/upload" title="" style="width:100%; height:100%;"></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $moment } = useNuxtApp()
import { storeToRefs } from 'pinia';

import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';

useCommonStore().loading_full = false;

definePageMeta({
  // layout: "clear",
  middleware: [
    function (to, from) {
      // if (!useAuthStore().checkPermission('potongan_mst.views')){
      //   useCommonStore().loading_full = false;
      //   return navigateTo('/');
      // }
    },
    // 'auth',
  ],
});
</script>