<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'Report Transaction'" />
    <div class="w-full flex grow flex-col overflow-auto h-0 bg-gray-200 justify-center items-center p-2">
      
      <div class="bg-white p-2">
        <form action="#" class="w-full flex flex-col sm:flex-row flex-wrap text-xs">
          <div class="w-full p-1 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col">
            <div class="font-bold"> Tgl Dari </div>
            <ClientOnly>
              <vue-date-picker  v-model="date.from" 
              type="datetime" 
              format="dd-MM-yyyy" 
              :enable-time-picker = "false" 
              text-input
              teleport-center
              class="flex-grow"></vue-date-picker>
            </ClientOnly>
            <p class="text-red-500">{{ field_errors.date_from }}</p>
          </div>
          <div class="w-full p-1 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col">
            <div class="font-bold"> Tgl Sampai </div>
            <ClientOnly>
              <vue-date-picker  v-model="date.to" 
              type="datetime" 
              format="dd-MM-yyyy" 
              :enable-time-picker = "false" 
              text-input
              teleport-center
              class="flex-grow"></vue-date-picker>
            </ClientOnly>
            <p class="text-red-500">{{ field_errors.date_to }}</p>
          </div>
          <div class="w-full p-1 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col">
            <div class="font-bold"> Lokasi </div>
            <input type="text" list="locations"  v-model="location"/>
              <datalist id="locations">
                <option v-for="loc in locations" :value="loc" >{{loc}}</option>
              </datalist>
          </div>
          <div class="w-full p-1 sm:w-12/12 md:w-12/12 lg:w-3/12 flex items-end justify-end">
            <button class="flex items-center justify-center m-1" type="submit" name="button" @click.prevent="printPreview()">
              <div><IconsPrinterEye class="text-2xl"/></div>
              <div class="text-left m-1">Download PDF</div>
            </button>

            <button class="flex items-center justify-center m-1" type="submit" name="button" @click.prevent="downloadExcel()">
              <div><IconsTable2Column class="text-2xl"/></div>
              <div class="text-left m-1">Download Excel</div>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <LazyPDFView :show="prtView" :pdfContent="pdfContent" @close="prtView=!prtView"/>
</template>

<script setup>
const { $moment } = useNuxtApp()

import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';

definePageMeta({
  // layout: "clear",
  ssr: false,
  middleware: [
    function (to, from) {
      if (!useAuthStore().checkPermission('report.ramp.views')){
        useCommonStore().loading_full = false;
        return navigateTo('/');
      }
    },
    // 'auth',
  ],
});

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();
params.sort ="tanggal:desc";

const field_errors = ref({})

const token = useDynamicPathCookie('token');
const date = ref({
  from: "",
  to: "",
});


const { data: dt_async } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  let locations = [];

  const [data1, data2] = await Promise.all([
    useMyFetch("/report/ramp/get_locations", {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      },
      retry: 0,
    }),
  ]);

  if (data1.status.value !== 'error') {
    locations = data1.data.value.list_xto;
  }

  if (data1.status.value === 'error') {
    useErrorStore().trigger(data1.error);
    return { locations};
  }

  useCommonStore().loading_full = false;

  return { locations };
},
  {
    lazy: true,        // 🔥 INI KUNCINYA
    server: false,
    default: () => ({ locations: [] }),     // 🔥 penting untuk dashboard / auth page
  });

const locations = ref([]);
watch(
  () => dt_async.value?.locations,
  (val) => {
    if (val) {
      locations.value = [...val]; // clone agar aman
    }
  },
  { immediate: true }
);

const location = ref("");

const inject_params = () => {
  params._TimeZoneOffset = new Date().getTimezoneOffset();
  params.date_from = date.value.from ? $moment(date.value.from).format("YYYY-MM-DD") : "";
  params.date_to = date.value.to ? $moment(date.value.to).format("YYYY-MM-DD") : "";
  params.location = location.value;
};


const { downloadFile, viewFile } = useDownload();

const prtView = ref(false);
const pdfContent = ref({});

const printPreview = async()=>{
  if (prtView.value==true) {
    prtView.value = false;
    return;
  }
  inject_params();
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/report/ramp/pdf_preview", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: params,
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  pdfContent.value = data.value;
  prtView.value = true;
}

const downloadExcel = async()=>{  
  inject_params();
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/report/ramp/excel_download", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: params,
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  downloadFile(data.value);
}

</script>