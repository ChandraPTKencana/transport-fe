<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Transaction'" />
    <div class="w-full flex grow flex-col overflow-auto h-0 bg-gray-100">
      <div class="w-full flex justify-between flex-wrap">
        <div class="grow flex flex-wrap justify-between">
          
          <div class="flex font-bold">
            <!-- <button class="whitespace-nowrap rounded-none m-1" @click="submenu='ongoing'" :class="submenu=='ongoing' ? 'text-white bg-blue-600' : 'text-gray-500 bg-white'"> On Going </button> -->
            <!-- <button class="whitespace-nowrap rounded-none m-1" @click="submenu='unverified'" :class="submenu=='unverified' ? 'text-white bg-blue-600' : 'text-gray-500 bg-white'"> Unverified List </button> -->
            <!-- <button class="whitespace-nowrap rounded-none m-1" @click="submenu='history'" :class="submenu=='history' ? 'text-white bg-blue-600' : 'text-gray-500 bg-white'">History </button> -->
          </div>
        </div>
      </div>
      <!-- <SubTrxTrpRitaseHistory :show="submenu=='history'" ></SubTrxTrpRitaseHistory> -->
      <LazySubTrxTrpRitaseUnverified :show="submenu=='unverified'" />
    </div>

    <!-- <trx_trpsRequested :show="popup_request" :fnClose="()=>{ popup_request = false; }" @update_request_notif="request_notif = $event"/> -->
  </div>
</template>

<script setup>
const { $moment } = useNuxtApp()
import { storeToRefs } from 'pinia';

import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';

const { pointFormat } = useUtils();

definePageMeta({
  // layout: "clear",
  ssr: false,
  middleware: [
    function (to, from) {
      if (!useAuthStore().checkPermission('trp_trx.ritase.views')){
        useCommonStore().loading_full = false;
        return navigateTo('/');
      }
    },
    // 'auth',
  ],
});

const submenu = ref("unverified");

</script>