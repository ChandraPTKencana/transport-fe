<template>
  <div class="w-full h-full flex flex-col relative">
    <Header :title="'List Transaction'" />
    <section class="grow flex flex-col">
      <div class="w-full flex items-center p-1">
          <div class="grow">
            <input class="flex-grow" type="text" v-model="search" name="search"
              placeholder="Keyword">
          </div>
      </div>

      <div class="grow overflow-auto h-0">
        <div v-for="(tt,idx) in filtered_data" class="p-1 grow">
          <div class="bg-white flex py-2 justify-between">
  
            <div class="flex flex-wrap">
              <div class="flex items-center justify-center m-2 text-xs">
                <div class="bg-blue-400 p-2 font-bold text-white">
                  {{ tt.id }}
                </div>
              </div>

              <div class="flex flex-col m-2">
                <span class="text-xs">
                  Tgl Terima Uang
                </span>
                <div class="flex items-center justify-center">
                  <IconsCalendar class="mr-1"/>
                  {{ $moment(tt.tanggal).format("DD-MM-YYYY") }}
                </div>
              </div>
    
              <div class="flex flex-col m-2">
                <span class="text-xs">
                  Nomor Kendaraan
                </span>
                <div class="flex items-center justify-center">
                  <IconsCarTag class="mr-1"/>
                  <span class="to_hl" :data-real="tt.no_pol">
                    {{ tt.no_pol }}
                  </span>
                </div>
              </div>
    
              <div class="flex flex-col m-2">
                <span class="text-xs">
                  Nama Pekerja
                </span>
                <div class="flex items-center justify-center">
                  <IconsTruckDriver class="mr-1"/>
                  <span class="to_hl" :data-real="tt.employee?.name">
                    {{ tt.employee?.name }}
                  </span>
                </div>
              </div>
    
              <div class="flex flex-col m-2">
                <span class="text-xs">
                  Tujuan
                </span>
                <div class="flex items-center justify-center">
                  <IconsLocationOn class="mr-1"/>
                  {{ tt.extra_money.xto }}
                </div>
              </div>
            </div>  
            <button class="bg-blue-500 text-white rounded" @click="pop_verified(idx,tt)"> Detail </button>
          </div>
        </div>
      </div>
    </section>

    <div v-show="pop_show" class="w-full h-full fixed top-0 left-0 bg-gray-100 bg-opacity-80 flex items-center justify-center z-10">
      <div class="w-full sm:w-10/12 md:w-10/12 lg:w-8/12 bg-white flex flex-col border-solid border-gray-200 max-w-full max-h-full overflow-auto" style="border-width: 1px;">
        <HeaderPopup :title="'Detail Information'" :fn="()=>{pop_show = false, show_confirm = false}" class="w-100 flex align-items-center"
          style="color:white;" />
        <div class="p-1 flex flex-wrap overflow-auto items-start">
          <div class="w-full flex flex-wrap">
            <div class="w-full flex flex-wrap">

              <div class="flex flex-col m-2 border-solid border-l-4 border-blue-400 px-2 bg-gray-200">
                <span class="text-xs font-bold">
                  ID
                </span>
                <div class="">
                  {{ extra_money_trx.id }}
                </div>
              </div>
  
              <div class="flex flex-col m-1 border-solid border-l-4 border-blue-400 px-2 py-1 bg-gray-200">
                <span class="text-xs font-bold">
                  Tgl Terima Uang
                </span>
                <div class="">
                  {{ $moment(extra_money_trx.tanggal).format("DD-MM-YYYY") }}
                </div>
              </div>
    
              <div class="flex flex-col m-1 border-solid border-l-4 border-blue-400 px-2 py-1 bg-gray-200">
                <span class="text-xs font-bold">
                  Nomor Kendaraan
                </span>
                <div class="">
                  {{ extra_money_trx.no_pol }}
                </div>
              </div>
    
              <div class="flex flex-row flex-wrap m-1 border-solid border-l-4 border-blue-400 px-2 py-1 bg-gray-200">
                <div class="flex flex-col">
                  <span class="text-xs font-bold">
                    Nama Pekerja
                  </span>
                  <div class="">
                    {{ extra_money_trx.employee?.name }}
                  </div>
                </div>
                <div class="flex flex-col pl-2">
                  <span class="text-xs font-bold">
                    No rek
                  </span>
                  <div class="">
                    {{ extra_money_trx.employee_rek_no }}
                  </div>
                </div>
              </div>
  
              <div class="flex flex-col m-1 border-solid border-l-4 border-blue-400 px-2 py-1 bg-gray-200">
                <span class="text-xs font-bold">
                  Tujuan
                </span>
                <div class="">
                  {{ extra_money_trx.extra_money.xto }}
                </div>
              </div>
    
              <div class="flex flex-col m-1 border-solid border-l-4 border-blue-400 px-2 py-1 bg-gray-200">
                <span class="text-xs font-bold">
                  Jenis
                </span>
                <div class="">
                  {{ extra_money_trx.extra_money.jenis }}
                </div>
              </div>
  
              <div v-if="extra_money_trx.extra_money.transition_type=='From'" class="flex flex-col m-1 border-solid border-l-4 border-blue-400 px-2 py-1 bg-gray-200">
                <span class="text-xs font-bold">
                  Pengalihan
                </span>
                <div class="">
                  {{ extra_money_trx.extra_money.transition_target }}
                </div>
              </div>

              <div class="flex flex-col m-1 border-solid border-l-4 border-blue-400 px-2 py-1 bg-gray-200">
                <span class="text-xs font-bold">
                  Nominal Dibayarkan
                </span>
                <div class="">
                  {{ pointFormat(extra_money_trx.extra_money.total) }}
                </div>
              </div>
            </div>

            <div class="w-full flex flex-wrap justify-center">

              <div v-if="extra_money_trx.val" class="flex flex-col m-2 ring-1 ring-gray-400 p-1 text-center justify-center items-center rounded text-xs">
                <span class="text-xs font-bold">
                  App Kasir
                </span>
                
                <div>
                  ( {{extra_money_trx.val_by.username}} )
                </div>
                <div class="text-xs">
                  {{ $moment(extra_money_trx.val_at).format("DD-MM-YYYY HH:mm:ss") }}
                </div>
              </div>

              <div v-if="extra_money_trx.val1" class="flex flex-col m-2 ring-1 ring-gray-400 p-1 text-center justify-center items-center rounded text-xs">
                <span class="text-xs font-bold">
                  App Mandor
                </span>
                
                <div>
                  ( {{extra_money_trx.val1_by.username}} )
                </div>
                <div class="text-xs">
                  {{ $moment(extra_money_trx.val1_at).format("DD-MM-YYYY HH:mm:ss") }}
                </div>
              </div>

              <div v-if="extra_money_trx.val2" class="flex flex-col m-2 ring-1 ring-gray-400 p-1 text-center justify-center items-center rounded text-xs">
                <span class="text-xs font-bold">
                  App KTU/W
                </span>
                
                <div>
                  ( {{extra_money_trx.val2_by.username}} )
                </div>
                <div class="text-xs">
                  {{ $moment(extra_money_trx.val2_at).format("DD-MM-YYYY HH:mm:ss") }}
                </div>
              </div>

              <div v-if="extra_money_trx.val3" class="flex flex-col m-2 ring-1 ring-gray-400 p-1 text-center justify-center items-center rounded text-xs">
                <span class="text-xs font-bold">
                  App Marketing
                </span>
                
                <div>
                  ( {{extra_money_trx.val3_by.username}} )
                </div>
                <div class="text-xs">
                  {{ $moment(extra_money_trx.val3_at).format("DD-MM-YYYY HH:mm:ss") }}
                </div>
              </div>

              <div v-if="extra_money_trx.val4" class="flex flex-col m-2 ring-1 ring-gray-400 p-1 text-center justify-center items-center rounded text-xs">
                <span class="text-xs font-bold">
                  App Logistik
                </span>
                
                <div>
                  ( {{extra_money_trx.val4_by.username}} )
                </div>
                <div class="text-xs">
                  {{ $moment(extra_money_trx.val4_at).format("DD-MM-YYYY HH:mm:ss") }}
                </div>
              </div>

              <div v-if="extra_money_trx.val5" class="flex flex-col m-2 ring-1 ring-gray-400 p-1 text-center justify-center items-center rounded text-xs">
                <span class="text-xs font-bold">
                  App SPV Logistik
                </span>
                
                <div>
                  ( {{extra_money_trx.val5_by.username}} )
                </div>
                <div class="text-xs">
                  {{ $moment(extra_money_trx.val5_at).format("DD-MM-YYYY HH:mm:ss") }}
                </div>
              </div>
            </div>
            
          </div>

        </div>

        <div v-show="!show_confirm" class="flex p-1 justify-end flex-wrap">
          <button class="rounded m-1" @click="pop_show = false"> Cancel </button>
          <button class="rounded m-1 text-white bg-blue-500" @click="show_confirm = true"> Transfer </button>
        </div>
        <div v-show="show_confirm" class="flex p-1 justify-center flex-wrap bg-yellow-100">
          <div class="w-full text-center">
            Akan dilakukan Transfer dengan data diatas. Apakah Informasi Diatas Sudah Benar Dan Tepat? 
          </div>
          <button class="rounded m-1 bg-white" @click="show_confirm = false, pop_show = false"> Tidak </button>
          <button class="rounded m-1 text-white bg-blue-500" @click="doTransfer()"> Ya </button>
        </div>
      </div>

    </div>

    <GAPIN :show="timeout_pin" @setTimeout="timeout_pin=$event"/>
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
  middleware: [
    function (to, from) {
      if (!useAuthStore().checkPermission('extra_money_trx.transfer.views')){
        useCommonStore().loading_full = false;
        return navigateTo('/');
      }
    },
    // 'auth',
  ],
});
const token = useCookie('token');

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();
params.sort ="tanggal:desc";

const { data: dt_async } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  let extra_money_trxs = [];

  const [data1, data2] = await Promise.all([
    useMyFetch("/extra_money_trx/transfers", {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      },
      // params:{filter_status},
      retry: 0,
    }),
  ]);

  if (data1.status.value === 'error') {
    useErrorStore().trigger(data1.error);
    return { extra_money_trxs };
  }

  useCommonStore().loading_full = false;
  extra_money_trxs = data1.data.value.data;

  return { extra_money_trxs };
});
const extra_money_trxs = ref(dt_async.value.extra_money_trxs || []);

const field_errors = ref({})

// const extra_money_trxs = ref(dt_async.value.extra_money_trxs || []);
// const extra_money_trxs = ref([]);
const extra_money_trx = ref({
  id: -1,
  tanggal: new Date(),
  extra_money:{
    xto: "",
    tipe: "",
    jenis:"",
    amount: 0,
  },

  employee: "",
  kernet: "",
  no_pol: '',
  details_uj:[]
})
const selected = ref(-1);
const search = ref("");
const callDetail = async (dt) => {
  useCommonStore().loading_full = true;

  const { data, error, status } = await useMyFetch("/extra_money_trx/transfer/detail", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id:dt.id},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error, field_errors);
    return;
  }

  extra_money_trx.value = data.value.data;  
}


// const callData = async () => {
//   useCommonStore().loading_full = true;
//   field_errors.value = {};

//   if (params.page == 1) extra_money_trxs.value = [];
//   if(params.first_row) delete params.first_row;
//   if(params.page > 1){
//     params.first_row = JSON.stringify(extra_money_trxs.value[0]);
//   }
//   params.filter_status = 'mandor_trx_unverified';

//   const { data, error, status } = await useMyFetch("/extra_money_trxs", {
//     method: 'get',
//     headers: {
//       'Authorization': `Bearer ${token.value}`,
//       'Accept': 'application/json'
//     },
//     params: params,
//     retry: 0,
//   });
//   useCommonStore().loading_full = false;

//   if (status.value === 'error') {
//     useErrorStore().trigger(error, field_errors);
//     return;
//   }

//   extra_money_trxs.value = data.value.data;
  
// }


const doTransfer = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("id", extra_money_trx.value.id);
  data_in.append("_method", "PUT");

  let $method = "post";

  const { data, error, status } = await useMyFetch("/extra_money_trx/transfer", {
    method: $method,
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json',
      // "Content-Type": "multipart/form-data",
    },
    body: data_in,
    retry: 0,
    // server: true
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error, field_errors);
    return;
  }

  extra_money_trxs.value.splice(selected.value,1);
  selected.value = -1;
  show_confirm.value = false;
  pop_show.value = false;

}

const pop_show =  ref(false);
const pop_id = ref(0);
const show_confirm = ref(false);
const { display } = useAlertStore();

const pop_verified = (idx,dt) => {
    selected.value = idx;
    pop_id.value = dt;
    pop_show.value = true;
    callDetail(dt);
};

const filtered_data = computed(()=>{  
  if(search.value!="")
  return extra_money_trxs.value.filter(x=>x.no_pol.toLowerCase().includes(search.value.toLowerCase()) || x.employee.toLowerCase().includes(search.value.toLowerCase()) || x.kernet.toLowerCase().includes(search.value.toLowerCase()));
  return extra_money_trxs.value;
})

const potongan= (extra_money_trx)=>{
  if(extra_money_trx.potongan && extra_money_trx.potongan.length > 0)
      return extra_money_trx.potongan.map((x)=>parseInt(x.nominal_cut)).reduce((prev,curr)=>{prev+=curr; return prev;})
  return 0;
};

const potongan_employee= (extra_money_trx)=>{
  if(extra_money_trx.potongan && extra_money_trx.potongan.length > 0){
    let filter = extra_money_trx.potongan.filter((x)=>x.potongan_mst.employee_id == extra_money_trx.employee_id);
    if(filter.length == 0) return 0;

    let map = filter.map((x)=>parseInt(x.nominal_cut));
    if(map.length == 0) return 0;

    return map.reduce((prev,curr)=>{prev+=curr; return prev;})
  }
  return 0;
};

const potongan_kernet= (extra_money_trx)=>{
  if(extra_money_trx.potongan && extra_money_trx.potongan.length > 0){
    let filter = extra_money_trx.potongan.filter((x)=>x.potongan_mst.employee_id == extra_money_trx.kernet_id);
    if(filter.length == 0) return 0;

    let map = filter.map((x)=>parseInt(x.nominal_cut));
    if(map.length == 0) return 0;

    return map.reduce((prev,curr)=>{prev+=curr; return prev;})
  }
  return 0;
};

const highlight=()=>{
  let text = search.value;
  document.querySelectorAll(".to_hl").forEach((x)=>{
    let real = x.dataset.real;
    var innerHTML = x.innerHTML;
    var index = real?.toLowerCase().indexOf(text.toLowerCase());
    if (index > -1 && text!="") { 
     innerHTML = real.substring(0,index) + "<span class='highlight'>" + real.substring(index,index+text.length) + "</span>" + real.substring(index + text.length);
     x.innerHTML = innerHTML;
    }else{
     x.innerHTML = innerHTML = real;
    }
  })
}

watch(() => filtered_data, (newVal, oldVal) => {
  setTimeout(()=>{ highlight(); },0)
}, {
  deep:true,
  immediate: true
});


const timeout_pin = ref(0);


</script>
<style>
.highlight {
  background-color: yellow;
}
</style>