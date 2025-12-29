<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'Report Transaction'" />
    <div class="w-full flex grow flex-col overflow-auto h-0 bg-gray-200 justify-center items-center p-2">
      <div class="bg-white p-2 max-w-[350px] max-h-full overflow-auto">
        <form action="#" class="w-full flex flex-col sm:flex-row flex-wrap text-xs">
          <div class="w-full p-1 flex flex-col">
            <div class="font-bold"> Tipe </div>
            <select v-model="type">
              <option value="header">Header</option>
              <option value="detail">Detail</option>
            </select>
          </div>
          <div class="w-full p-1 flex flex-col">
            <div class="font-bold"> Jenis </div>
            <select v-model="jenis">
              <option value=""></option>
              <option value="UJ">Uang Jalan</option>
              <option value="SB">Uang Standby</option>
            </select>
          </div>
          <div class="w-full sm:w-1/2 p-1 flex flex-col">
            <div class="font-bold"> Tgl Dari </div>
            <ClientOnly>
              <vue-date-picker  v-model="date.from" 
              type="datetime" 
              format="dd-MM-yyyy" 
              :enable-time-picker = "false" 
              text-input
              teleport-center
              ></vue-date-picker>
            </ClientOnly>
            <p class="text-red-500">{{ field_errors.date_from }}</p>
          </div>
          <div class="w-full sm:w-1/2 p-1 flex flex-col">
            <div class="font-bold"> Tgl Sampai </div>
            <ClientOnly>
              <vue-date-picker  v-model="date.to" 
              type="datetime" 
              format="dd-MM-yyyy" 
              :enable-time-picker = "false" 
              text-input
              teleport-center
              ></vue-date-picker>
            </ClientOnly>
            <p class="text-red-500">{{ field_errors.date_to }}</p>
          </div>
          <div class="w-full p-1 flex flex-col">
            <div class="font-bold"> Lokasi </div>
            <SelectMulti :arr="list_xto"/>
          </div>
          <div class="w-full p-1 flex flex-col">
            <div class="font-bold"> Nama </div>
            <SelectMulti :arr="list_employee"/>
          </div>
          <div class="w-full p-1 flex flex-col">
            <div class="font-bold"> No Pol </div>
            <SelectMulti :arr="list_vehicle"/>
          </div>

          
          <div class="w-full p-1 flex items-end justify-end">
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
      if (!useAuthStore().checkPermission('report.ast_n_driver.views')){
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
  let list_xto = [];
  let list_vehicle = [];
  let list_employee = [];

  const [data1, data2] = await Promise.all([
    useMyFetch("/report/ast_n_driver/load_data", {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      },
      retry: 0,
    }),
  ]);

  if (data1.status.value !== 'error') {
    list_xto = data1.data.value.list_xto;
    list_employee = data1.data.value.list_employee;
    list_vehicle = data1.data.value.list_vehicle;
  }
  
  if (data1.status.value === 'error') {
    useErrorStore().trigger(data1.error);
  }

  useCommonStore().loading_full = false;

  return { list_xto ,list_employee,list_vehicle};
},
  {
    lazy: true,        // 🔥 INI KUNCINYA
    server: false,
    default: () => ({ list_xto: [],list_employee: [],list_vehicle: [] }),     // 🔥 penting untuk dashboard / auth page
  });



const list_xto = ref([]);
const list_employee = ref([]);
const list_vehicle = ref([]);

watch(
  () => dt_async.value?.list_xto,
  (val) => {
    if (val) {
      val.forEach(e => {
        list_xto.value.push({
          id:e,
          name:e,
          title:'',
          checked:false
        })
      });
    }
  },
  { immediate: true }
);

watch(
  () => dt_async.value?.list_employee,
  (val) => {
    if (val) {
      val.forEach(e => {
        list_employee.value.push({
          id:e.id,
    name:e.name,
    title:e.role,
    checked:false
        })
      });
    }
  },
  { immediate: true }
);

watch(
  () => dt_async.value?.list_vehicle,
  (val) => {
    if (val) {
      val.forEach(e => {
        list_vehicle.value.push({
          id:e.id,
    name:e.no_pol,
    title:'',
    checked:false
        })
      });
    }
  },
  { immediate: true }
);


const type = ref("header");
const jenis = ref("");

const inject_params = () => {
  params._TimeZoneOffset = new Date().getTimezoneOffset();
  params.date_from = date.value.from ? $moment(date.value.from).format("YYYY-MM-DD") : "";
  params.date_to = date.value.to ? $moment(date.value.to).format("YYYY-MM-DD") : "";
  params.list_xto = JSON.stringify(list_xto.value.filter((x)=>x.checked).map((x)=>x.id));
  params.list_employee = JSON.stringify(list_employee.value.filter((x)=>x.checked).map((x)=>x.id));
  params.list_vehicle = JSON.stringify(list_vehicle.value.filter((x)=>x.checked).map((x)=>x.id));
  params.type = type.value;
  params.jenis = jenis.value;
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
  const { data, error, status } = await useMyFetch("/report/ast_n_driver/pdf_preview", {
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
  const { data, error, status } = await useMyFetch("/report/ast_n_driver/excel_download", {
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

<style scoped>
.dp__input_wrap{
  height: auto;
}</style>