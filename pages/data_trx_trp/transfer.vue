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
                  Tgl Terima U.Jalan
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
                  Nama Supir
                </span>
                <div class="flex items-center justify-center">
                  <IconsTruckDriver class="mr-1"/>
                  <span class="to_hl" :data-real="tt.supir">
                    {{ tt.supir }}
                  </span>
                </div>
              </div>
    
              <div v-if="tt.kernet" class="flex flex-col m-2">
                <span class="text-xs">
                  Nama Kernet
                </span>
                <div class="flex items-center justify-center">
                  <IconsTruckDriverOutline class="mr-1"/>
                  <span class="to_hl" :data-real="tt.kernet">
                    {{ tt.kernet }}
                  </span>
                </div>
              </div>
    
              <div class="flex flex-col m-2">
                <span class="text-xs">
                  Tujuan
                </span>
                <div class="flex items-center justify-center">
                  <IconsLocationOn class="mr-1"/>
                  {{ tt.xto }}
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
                  {{ trx_trp.id }}
                </div>
              </div>
  
              <div class="flex flex-col m-1 border-solid border-l-4 border-blue-400 px-2 py-1 bg-gray-200">
                <span class="text-xs font-bold">
                  Tgl Terima U.Jalan
                </span>
                <div class="">
                  {{ $moment(trx_trp.tanggal).format("DD-MM-YYYY") }}
                </div>
              </div>
    
              <div class="flex flex-col m-1 border-solid border-l-4 border-blue-400 px-2 py-1 bg-gray-200">
                <span class="text-xs font-bold">
                  Nomor Kendaraan
                </span>
                <div class="">
                  {{ trx_trp.no_pol }}
                </div>
              </div>
    
              <div class="flex flex-row flex-wrap m-1 border-solid border-l-4 border-blue-400 px-2 py-1 bg-gray-200">
                <div class="flex flex-col">
                  <span class="text-xs font-bold">
                    Nama Supir
                  </span>
                  <div class="">
                    {{ trx_trp.supir }}
                  </div>
                </div>
                <div class="flex flex-col pl-2">
                  <span class="text-xs font-bold">
                    No rek
                  </span>
                  <div class="">
                    {{ trx_trp.supir_rek_no }}
                  </div>
                </div>
              </div>
  
              <div v-if="trx_trp.kernet" class="flex flex-row flex-wrap m-1 border-solid border-l-4 border-blue-400 px-2 py-1 bg-gray-200">
                <div class="flex flex-col">
                  <span class="text-xs font-bold">
                    Nama Kernet
                  </span>
                  <div class="">
                    {{ trx_trp.kernet }}
                  </div>
                </div>
                <div class="flex flex-col pl-2">
                  <span class="text-xs font-bold">
                    No rek
                  </span>
                  <div class="">
                    {{ trx_trp.kernet_rek_no }}
                  </div>
                </div>
              </div>
    
              <div class="flex flex-col m-1 border-solid border-l-4 border-blue-400 px-2 py-1 bg-gray-200">
                <span class="text-xs font-bold">
                  Tujuan
                </span>
                <div class="">
                  {{ trx_trp.xto }}
                </div>
              </div>
    
              <div class="flex flex-col m-1 border-solid border-l-4 border-blue-400 px-2 py-1 bg-gray-200">
                <span class="text-xs font-bold">
                  Tipe
                </span>
                <div class="">
                  {{ trx_trp.tipe }}
                </div>
              </div>
    
              <div class="flex flex-col m-1 border-solid border-l-4 border-blue-400 px-2 py-1 bg-gray-200">
                <span class="text-xs font-bold">
                  Jenis
                </span>
                <div class="">
                  {{ trx_trp.jenis }}
                </div>
              </div>
  
              <div v-if="trx_trp.transition_type=='From'" class="flex flex-col m-1 border-solid border-l-4 border-blue-400 px-2 py-1 bg-gray-200">
                <span class="text-xs font-bold">
                  Pengalihan
                </span>
                <div class="">
                  {{ trx_trp.transition_target }}
                </div>
              </div>
            </div>

            <div class="w-full flex flex-wrap justify-center">

              <div v-if="trx_trp.val" class="flex flex-col m-2 ring-1 ring-gray-400 p-1 text-center justify-center items-center rounded text-xs">
                <span class="text-xs font-bold">
                  App Kasir
                </span>
                
                <div>
                  ( {{trx_trp.val_by.username}} )
                </div>
                <div class="text-xs">
                  {{ $moment(trx_trp.val_at).format("DD-MM-YYYY HH:mm:ss") }}
                </div>
              </div>

              <div v-if="trx_trp.val1" class="flex flex-col m-2 ring-1 ring-gray-400 p-1 text-center justify-center items-center rounded text-xs">
                <span class="text-xs font-bold">
                  App Mandor
                </span>
                
                <div>
                  ( {{trx_trp.val1_by.username}} )
                </div>
                <div class="text-xs">
                  {{ $moment(trx_trp.val1_at).format("DD-MM-YYYY HH:mm:ss") }}
                </div>
              </div>

              <div v-if="trx_trp.val2" class="flex flex-col m-2 ring-1 ring-gray-400 p-1 text-center justify-center items-center rounded text-xs">
                <span class="text-xs font-bold">
                  App KTU/W
                </span>
                
                <div>
                  ( {{trx_trp.val2_by.username}} )
                </div>
                <div class="text-xs">
                  {{ $moment(trx_trp.val2_at).format("DD-MM-YYYY HH:mm:ss") }}
                </div>
              </div>

              <div v-if="trx_trp.val3" class="flex flex-col m-2 ring-1 ring-gray-400 p-1 text-center justify-center items-center rounded text-xs">
                <span class="text-xs font-bold">
                  App Marketing
                </span>
                
                <div>
                  ( {{trx_trp.val3_by.username}} )
                </div>
                <div class="text-xs">
                  {{ $moment(trx_trp.val3_at).format("DD-MM-YYYY HH:mm:ss") }}
                </div>
              </div>

              <div v-if="trx_trp.val4" class="flex flex-col m-2 ring-1 ring-gray-400 p-1 text-center justify-center items-center rounded text-xs">
                <span class="text-xs font-bold">
                  App Logistik
                </span>
                
                <div>
                  ( {{trx_trp.val4_by.username}} )
                </div>
                <div class="text-xs">
                  {{ $moment(trx_trp.val4_at).format("DD-MM-YYYY HH:mm:ss") }}
                </div>
              </div>

              <div v-if="trx_trp.val5" class="flex flex-col m-2 ring-1 ring-gray-400 p-1 text-center justify-center items-center rounded text-xs">
                <span class="text-xs font-bold">
                  App SPV Logistik
                </span>
                
                <div>
                  ( {{trx_trp.val5_by.username}} )
                </div>
                <div class="text-xs">
                  {{ $moment(trx_trp.val5_at).format("DD-MM-YYYY HH:mm:ss") }}
                </div>
              </div>
            </div>
            
          </div>
          <div class="w-full sm:w-1/2  text-sm flex justify-center">
            <table class="border border-collapse border-black">
              <tr>
                <th colspan="4" class="bg-blue-400"> List Uang Jalan </th>
              </tr>
              <tr v-for="duj in trx_trp.details_uj">
                <td class="p-1"> {{ duj.ordinal }}. </td>
                <td class="p-1">{{ duj.xdesc }} {{ duj.qty<=1 ? '' : pointFormat(duj.qty || 0) + ' x Rp.' + pointFormat(duj.harga || 0)}}  </td>
                <td class="p-1">= Rp.</td>
                <td class="text-right p-1">{{pointFormat(duj.qty * duj.harga)}}</td>
              </tr>
              <tr class="border-t-black border-dashed" style="border-top-width:1px;">
                <th colspan="2" class="text-right">Total</th>
                <th class="p-1 text-right" >Rp.</th>
                <th class="p-1 text-right"> {{ pointFormat(trx_trp.amount) }} </th>
              </tr>
              <tr v-if="potongan_supir(trx_trp) > 0" class="text-red-500 font-bold">
                <td colspan="2" class="text-right">Potongan Supir</td>
                <td class="p-1 text-right" >Rp.</td>
                <td class="p-1 text-right"> {{ pointFormat(potongan_supir(trx_trp)) }} </td>
              </tr>
              <tr v-if="potongan_kernet(trx_trp) > 0" class="text-red-500 font-bold">
                <td colspan="2" class="text-right">Potongan Kernet</td>
                <td class="p-1 text-right" >Rp.</td>
                <td class="p-1 text-right"> {{ pointFormat(potongan_kernet(trx_trp)) }} </td>
              </tr>

              <tr v-if="potongan(trx_trp) > 0" class="text-red-500 font-bold">
                <td colspan="2" class="text-right">Total Potongan</td>
                <td class="p-1 text-right" >Rp.</td>
                <td class="p-1 text-right"> {{ pointFormat(potongan(trx_trp)) }} </td>
              </tr>
              <tr v-if="potongan(trx_trp) > 0" class="font-bold">
                <td colspan="2" class="text-right">Total Diterima</td>
                <td class="p-1 text-right" >Rp.</td>
                <td class="p-1 text-right"> {{ pointFormat(trx_trp.amount-potongan(trx_trp)) }} </td>
              </tr>
            </table>
          </div>

          <div class="w-full sm:w-1/2 h-full">
            <img  v-if="trx_trp.trx_absens?.length > 0" class="w-full" :src="trx_trp.trx_absens[0].gambar">
            <div v-else class="flex flex-col justify-center items-center px-2 py-8 border border-gray-700 bg-gray-300">
              <IconsImage />
              Tidak Ada Foto Berangkat
            </div>
          </div>

          <div v-for="ttemt in trx_trp.extra_money_trxs" class="w-full border-solid border-l-4 border-blue-400 px-2 py-1 bg-gray-200 mt-2 flex flex-row flex-wrap">
            <div class="flex flex-col mr-5">
              <span class="text-xs font-bold">
                EM#ID
              </span>
              <div class="">
                {{ ttemt.id }}
              </div>
            </div>
            <div class="flex flex-col mr-5">
              <span class="text-xs font-bold">
                Nama Penerima
              </span>
              <div class="">
                {{ ttemt.employee?.name }}
              </div>
            </div>
            <div class="flex flex-col mr-5">
              <span class="text-xs font-bold">
                No rek
              </span>
              <div class="">
                {{ ttemt.employee?.rek_no }}
              </div>
            </div>
            <div class="flex flex-col mr-5">
              <span class="text-xs font-bold">
                Tanggal
              </span>
              <div class="">
                {{ ttemt.tanggal }}
              </div>
            </div>
            <div class="flex flex-col mr-5">
              <span class="text-xs font-bold">
                Tujuan
              </span>
              <div class="">
                {{ ttemt.extra_money?.xto }}
              </div>
            </div>
            <div class="flex flex-col mr-5">
              <span class="text-xs font-bold">
                Desc
              </span>
              <div class="">
                {{ ttemt.extra_money?.description }}
              </div>
            </div>

            <div class="flex flex-col mr-5">
              <span class="text-xs font-bold">
                Total
              </span>
              <div class="">
                {{ pointFormat(ttemt.extra_money?.nominal * ttemt.extra_money?.qty)  }}
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
      if (!useAuthStore().checkPermission('trp_trx.transfer.views')){
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
  let trx_trps = [];

  const [data1, data2] = await Promise.all([
    useMyFetch("/trx_trp/transfers", {
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
    return { trx_trps };
  }

  useCommonStore().loading_full = false;
  trx_trps = data1.data.value.data;

  return { trx_trps };
});
const trx_trps = ref(dt_async.value.trx_trps || []);

const field_errors = ref({})

// const trx_trps = ref(dt_async.value.trx_trps || []);
// const trx_trps = ref([]);
const trx_trp = ref({
  id: -1,
  tanggal: new Date(),
  xto: "",
  tipe: "",
  jenis:"",
  amount: 0,

  supir: "",
  kernet: "",
  no_pol: '',
  details_uj:[]
})
const selected = ref(-1);
const search = ref("");
const callDetail = async (dt) => {
  useCommonStore().loading_full = true;

  const { data, error, status } = await useMyFetch("/trx_trp/transfer/detail", {
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

  trx_trp.value = data.value.data;  
}


// const callData = async () => {
//   useCommonStore().loading_full = true;
//   field_errors.value = {};

//   if (params.page == 1) trx_trps.value = [];
//   if(params.first_row) delete params.first_row;
//   if(params.page > 1){
//     params.first_row = JSON.stringify(trx_trps.value[0]);
//   }
//   params.filter_status = 'mandor_trx_unverified';

//   const { data, error, status } = await useMyFetch("/trx_trps", {
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

//   trx_trps.value = data.value.data;
  
// }


const doTransfer = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("id", trx_trp.value.id);
  data_in.append("_method", "PUT");

  let $method = "post";

  const { data, error, status } = await useMyFetch("/trx_trp/transfer", {
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

  trx_trps.value.splice(selected.value,1);
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
  return trx_trps.value.filter(x=>x.no_pol.toLowerCase().includes(search.value.toLowerCase()) || x.supir.toLowerCase().includes(search.value.toLowerCase()) || x.kernet.toLowerCase().includes(search.value.toLowerCase()));
  return trx_trps.value;
})

const potongan= (trx_trp)=>{
  if(trx_trp.potongan && trx_trp.potongan.length > 0)
      return trx_trp.potongan.map((x)=>parseInt(x.nominal_cut)).reduce((prev,curr)=>{prev+=curr; return prev;})
  return 0;
};

const potongan_supir= (trx_trp)=>{
  if(trx_trp.potongan && trx_trp.potongan.length > 0){
    let filter = trx_trp.potongan.filter((x)=>x.potongan_mst.employee_id == trx_trp.supir_id);
    if(filter.length == 0) return 0;

    let map = filter.map((x)=>parseInt(x.nominal_cut));
    if(map.length == 0) return 0;

    return map.reduce((prev,curr)=>{prev+=curr; return prev;})
  }
  return 0;
};

const potongan_kernet= (trx_trp)=>{
  if(trx_trp.potongan && trx_trp.potongan.length > 0){
    let filter = trx_trp.potongan.filter((x)=>x.potongan_mst.employee_id == trx_trp.kernet_id);
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
    var index = real.toLowerCase().indexOf(text.toLowerCase());
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