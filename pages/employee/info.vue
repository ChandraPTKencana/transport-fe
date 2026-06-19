<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Employee'" />
    <div class="w-full flex justify-between flex-wrap">
      <div class="grow flex flex-wrap">
        <div class="w-1/2 xs:w-5/12 sm:w-5/12 md:w-5/12 p-1 flex flex-col">
            <div class="font-bold"> Tgl Dari </div>
            <ClientOnly>
              <vue-date-picker  v-model="tanggal.from" 
              type="datetime" 
              format="dd-MM-yyyy" 
              :enable-time-picker = "false" 
              text-input
              teleport-center
              ></vue-date-picker>
            </ClientOnly>
            <p class="text-red-500">{{ field_errors.tanggal_from }}</p>
        </div>
        <div class="w-1/2 xs:w-5/12 sm:w-5/12 md:w-5/12 p-1 flex flex-col">
          <div class="font-bold"> Tgl Sampai </div>
          <ClientOnly>
            <vue-date-picker  v-model="tanggal.to" 
            type="datetime" 
            format="dd-MM-yyyy" 
            :enable-time-picker = "false" 
            text-input
            teleport-center
            ></vue-date-picker>
          </ClientOnly>
          <p class="text-red-500">{{ field_errors.tanggal_to }}</p>
        </div>
        <div class="w-full xs:w-2/12 sm:w-2/12 md:w-2/12 p-1 flex flex-row-reverse sm:flex-row justify-end items-end">
          <button type="button" style="height: 38px;" name="button" class="w-1/2 flex items-center justify-center sm:mr-1" 
          @click.prevent="searching()">
            <IconsSearch class="text-xl"/> 
          </button>
          <button type="button" style="height: 38px;" name="button" class="w-1/2 flex items-center justify-center mr-1 sm:mr-0"
            @click="downloadExcel()">
            <IconsTable2Column />  <span class="text-xs ml-1"></span>
          </button>
        </div>

      </div>
    </div>
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <table class="border-collapse border border-slate-400">
        <thead class="sticky top-0 !z-[1]">
          <tr>
            <th class="border ring-1 ring-inset ring-slate-300 px-4 py-2 bg-slate-600 text-white">Nama</th>
            <th class="border ring-1 ring-inset ring-slate-300 px-4 py-2 bg-slate-600 text-white">Lokasi</th>
            <th class="border ring-1 ring-inset ring-slate-300 px-4 py-2 bg-slate-600 text-white">Gaji</th>
            <th class="border ring-1 ring-inset ring-slate-300 px-4 py-2 bg-slate-600 text-white">Makan</th>
            <th class="border ring-1 ring-inset ring-slate-300 px-4 py-2 bg-slate-600 text-white">Dinas</th>
            <th class="border ring-1 ring-inset ring-slate-300 px-4 py-2 bg-slate-600 text-white">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in employees">
            <td class="border border-slate-300 px-4 py-2">
              <span class="text-gray-600 text-xs"> ({{ v.employee.role }}) </span> 
              {{ v.employee.name }}  
              <span class="text-gray-600 text-xs"> [#{{ v.employee.id }}] </span> 
            </td>
            <td class="border border-slate-300 px-4 py-2"> 
              <div v-for="vv in v.location"> {{ vv.xto }} <span class="text-gray-600 text-xs"> [#{{ vv.id }}] </span> {{ v.location.length > 1 ? "," : ""  }} </div>
            </td>
            <td class="border border-slate-300 px-4 py-2">{{ pointFormat(v.gaji) }}</td>
            <td class="border border-slate-300 px-4 py-2">{{ pointFormat(v.makan) }}</td>
            <td class="border border-slate-300 px-4 py-2">{{ pointFormat(v.dinas) }}</td>
            <td class="border border-slate-300 px-4 py-2">{{ pointFormat(v.total) }}</td>
          </tr>
        </tbody>
      </table>

      

      <!-- {{ data.greetings }} -->
      <!-- {{ employees }} -->
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
const { pointFormat } = useUtils();

definePageMeta({
  // layout: "clear",
  ssr: false,
  middleware: [
    function (to, from) {
      if (!useAuthStore().checkPermission('employee.views')){
        useCommonStore().loading_full = false;
        return navigateTo('/');
      }
    },
    // 'auth',
  ],
});
const field_errors = ref({})

const today = new Date();

// tanggal 1, dua bulan yang lalu
const startDate = new Date(
  today.getFullYear(),
  today.getMonth() - 1,
  1
);

const tanggal = ref({
  from: startDate,
  to: today,
});

const rowBgColor=(data)=>{
  if(data.deleted==1) return "!bg-red-400";
  // if(data.pvr_id > 0 && data.req_deleted == 1) return "!bg-yellow-300"; 
  // if(data.pv_id > 0) return "!bg-blue-300"; 
  // if(data.val == 0 || data.val1 == 0) return "!bg-gray-300"; 
  return "";
}

const filter_status = ref("available")
watch(()=>filter_status.value,(newval)=>{
  // fields_thead.value.map((x)=>{
  //   let in_list=["deleted_by_username","deleted_at","deleted_reason"].indexOf(x.key) > -1;
  //   if(["all","deleted"].indexOf(newval) > -1){
  //     if( in_list )
  //       x.tbl_show =  1; 
  //   }else{
  //     if( in_list )
  //       x.tbl_show =  0; 
  //   }
  //   return x;
  // });

  searching();
}, {
  immediate: false
})

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();
params.tanggal_from = tanggal.value.from ? $moment(tanggal.value.from).format("YYYY-MM-DD") : "";
params.tanggal_to = tanggal.value.to ? $moment(tanggal.value.to).format("YYYY-MM-DD") : "";
params.filter_status = filter_status.value;

const token = useDynamicPathCookie('token');
const { data: dt_async } = await useAsyncData(async () => {
  let employees = [];
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/employees/info", {
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
    return [];
  }

  employees = data.value.data;
  return {employees};
},
  {
    lazy: true,        // 🔥 INI KUNCINYA
    server: false,
    default: () => ({ employees: [] }),     // 🔥 penting untuk dashboard / auth page
  });
  const employees = ref([]);

watch(
  () => dt_async.value?.employees,
  (val) => {
    if (val) {
      employees.value = [...val]; // clone agar aman
    }
  },
  { immediate: true }
);


const sort = ref({
  field: "",
  by: "desc"
});
const selected = ref(-1);
const scrolling = ref({
  page: 1,
  is_last_record: false,
  scrollLeft: 0,
  may_get_data: true
});

const dt_selected = computed(()=>{  
  return employees.value[selected.value];
})

const inject_params = () => {
  params.tanggal_from = tanggal.value.from ? $moment(tanggal.value.from).format("YYYY-MM-DD") : "";
  params.tanggal_to = tanggal.value.to ? $moment(tanggal.value.to).format("YYYY-MM-DD") : "";
};

const loadRef = ref(null);

const callData = async () => {
  useCommonStore().loading_full = true;
  scrolling.value.may_get_data = false;
  params.page = scrolling.value.page;
  if (params.page == 1) employees.value = [];
  params.filter_status = filter_status.value;
  const { data, error, status } = await useMyFetch("/employees/info", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    params: params,
    // body: {
    //   sort: "updated_at:desc"
    // },
    retry: 0,
    // server: true
  });
  useCommonStore().loading_full = false;
  scrolling.value.may_get_data = true;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  if (scrolling.value.page == 1) {
    employees.value = data.value.data;
    if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    employees.value = [...employees.value, ...data.value.data];
  }
  if (data.value.data.length == 0) {
    scrolling.value.is_last_record = true;
  }
  useCommonStore()._tv.filter_box = false;
}

const searching = () => {
  selected.value = -1;
  scrolling.value.page = 1;
  scrolling.value.is_last_record = false;
  inject_params();
  callData();
}

const { downloadFile, viewFile } = useDownload();

const downloadExcel = async()=>{  
  inject_params();
  useCommonStore().loading_full = true;
  params.filter_status = filter_status.value;
  const { data, error, status } = await useMyFetch("/employees/info_excel", {
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

<style scoped="">
/* table.sticky thead th:nth-child(2) {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
} */
</style>
