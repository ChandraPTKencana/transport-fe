<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Transaction'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex justify-between flex-wrap">
        <div class="grow flex">
          <div class="m-1">
            <select class="" v-model="filter_status" >
              <option value="ticket_not_done">Undone</option>
              <option value="ticket_done">Done</option>
              <option value="deleted">Trash</option>
              <option value="all">All</option>
              <option value="req_deleted">Req Delete</option>
            </select>
          </div>

          <button v-if="enabled_edit" type="button" name="button" class="m-1 text-2xl "
            @click="form_edit()">
            <IconsEdit/>
          </button>
          <button v-if="enabled_view" type="button" name="button" class="m-1 text-2xl "
            @click="form_view()">
            <IconsEyes/>
          </button>
          <button  v-if="enabled_approve_void " type="button" name="button" class="m-1 text-2xl "
            @click="approveVoid()">
            <IconsVoid />
          </button>
          <button v-if="enabled_validasi" type="button" name="button" class="m-1 text-2xl "
            @click="validasi()">
            <IconsSignature />
          </button>
          <button v-if="enabled_unvalidasi" type="button" name="button" class="m-1 text-2xl "
            @click="unvalidasi()">
            <IconsSignatureOff />
          </button>
          <button type="button" name="button" class="m-1 text-2xl flex items-center "
            @click="downloadExcel()">
            <IconsTable2Column />  <span class="text-xs ml-1"> Download </span>
          </button>
        </div>
        <div class="flex">

          <button v-if="checkbox_arr.length > 0 && useUtils().checkPermission('trp_trx.ticket.unval_ticket')" type="button" name="button" class="m-1 text-xs whitespace-nowrap grid grid-cols-2"
            @click="multi_unval_ticket_box=true">
            <IconsSignatureOff />
            <IconsSignatureOff />
            <IconsSignatureOff />
            <IconsSignatureOff />
          </button>

          <button v-if="checkbox_arr.length > 0" type="button" name="button" class="m-1 text-xs whitespace-nowrap"
            @click="multi_clear_ticket_box=true">
            Multi Clear Ticket
          </button>

          <button v-if="checkbox_arr.length > 0" type="button" name="button" class="m-1 text-xs whitespace-nowrap grid grid-cols-2"
            @click="multi_val_ticket_box=true">
            <IconsSignature />
            <IconsSignature />
            <IconsSignature />
            <IconsSignature />
          </button>

          <button type="button" name="button" class="m-1 text-xs whitespace-nowrap"
            @click="checkTicket()">
            Check Tickets
          </button>
          
          <button type="button" name="button" class="m-1 text-2xl "
            @click="cogs_show=true">
            <IconsCog />
          </button>

          <button type="button" name="button" class="m-1 text-xs whitespace-nowrap"
            @click="frm_update_ticket = true">
            Update Ticket
          </button>

          <!-- <div class="m-1 card-border cursor-pointer" @click="online_status = !online_status">
            <span class="text-xs">Mode</span> : <span class="font-bold" :class="online_status?'text-green-600' : 'text-red-600'">{{ online_status ? "ONLINE" : "OFFLINE" }} </span>
          </div> -->
        </div>
      </div>

      <!-- <form action="#" class="w-full flex flex-wrap text-xs">
        <div class="w-6/12 p-1 sm:w-4/12 md:w-3/12 lg:w-2/12 flex flex-col">
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
        <div class="w-6/12 p-1 sm:w-4/12 md:w-3/12 lg:w-2/12 flex flex-col">
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
        <div class="w-6/12 p-1 sm:w-4/12 md:w-2/12 lg:w-4/12 flex flex-col">
          <div class="font-bold"> Keyword </div>
          <input class="flex-grow" type="text" v-model="search" name="search"
            placeholder="Keyword">
        </div>
        <div class="w-6/12 p-1 sm:w-4/12 md:w-1/12 lg:w-2/12 flex flex-col">
          <div class="font-bold"> Sort By </div>
          <select class="flex-grow" v-model="sort.field">
            <option value=""></option>
            <option value="id">ID</option>
            <option value="xto">To</option>
            <option value="jenis">Jenis</option>
            <option value="tipe">Tipe</option>
          </select>
        </div>
        <div class="w-6/12 p-1 sm:w-4/12 md:w-2/12 lg:w-1/12 flex flex-col">
          <div class="font-bold"> Sort Order </div>
          <select class="flex-grow" v-model="sort.by">
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <div class="w-2/12 md:w-1/12 lg:w-1/12 p-1 flex items-end">
          <button class="" type="submit" name="button" @click.prevent="searching()">
            <IconsSearch class="text-2xl" />
          </button>
        </div>
      </form> -->
      

      <TableView :thead="fields_thead" :selected="selected" @setSelected="selected = $event" :tbody="trx_trps" :fnCallData="callData" :scrolling="scrolling" @setScrollingPage="scrolling.page=$event"  @doFilter="searching()" @setCheckbox="checkbox_arr=$event" :deep_state="deep_state">
        <template #[`absen`]="{item,index}">
          <IconsImage v-if="item.trx_absens && item.trx_absens.length > 0" class="cursor-pointer" @click="form_absen(index)"/>
        </template>
        <template #[`val`]="{item}">
          <IconsLine v-if="!item.val"/>
          <IconsCheck v-else/>
        </template>
        <template #[`val1`]="{item}">
          <IconsLine v-if="!item.val1"/>
          <IconsCheck v-else/>
        </template>
        <template #[`val_ticket`]="{item}">
          <IconsLine v-if="!item.val_ticket"/>
          <IconsCheck v-else/>
        </template>
        <template #[`uj_asst_opt`]="{item}">
          {{ item.uj?.asst_opt }}
        </template>
        <!-- <template #[`susut_bruto_a`]="{item}">
          {{pointFormat(item.ticket_a_bruto)}}
        </template>
        <template #[`susut_tara_a`]="{item}">
          {{pointFormat(item.ticket_a_tara)}}
        </template>
        <template #[`susut_netto_a`]="{item}">
          {{pointFormat(item.ticket_a_netto)}}
        </template>
        <template #[`susut_bruto_b`]="{item}">
          {{pointFormat(item.ticket_b_bruto)}}
        </template>
        <template #[`susut_tara_b`]="{item}">
          {{pointFormat(item.ticket_b_tara)}}
        </template>
        <template #[`susut_netto_b`]="{item}">
          {{pointFormat(item.ticket_b_netto)}}
        </template> -->
        <template #[`salary_paid`]="{item}">
          {{ (item.salary_paid) ? $moment(item.salary_paid?.period_end).format("MM-Y") + '['+item.salary_paid?.period_part+']' : "" }}
        </template>

        <template #[`susut_bruto_b_a`]="{item}">
          {{calculateSelisih(item.ticket_a_bruto,item.ticket_b_bruto)}}
        </template>
        <template #[`susut_tara_b_a`]="{item}">
          {{calculateSelisih(item.ticket_a_tara,item.ticket_b_tara)}}
        </template>
        <template #[`susut_netto_b_a`]="{item}">
          {{calculateSelisih(item.ticket_a_netto,item.ticket_b_netto)}}
        </template>
        <template #[`susut_bruto_b_a_persen`]="{item}">          
          {{calculateSusut(item.ticket_a_bruto,item.ticket_b_bruto)}}
        </template>
        <template #[`susut_tara_b_a_persen`]="{item}">          
          {{calculateSusut(item.ticket_a_tara,item.ticket_b_tara)}}
        </template>
        <template #[`susut_netto_b_a_persen`]="{item}">          
          {{calculateSusut(item.ticket_a_netto,item.ticket_b_netto)}}
        </template>


        <template #[`status_batas_susut`]="{item}">
          <div class="btn p-1 rounded-sm text-white text-xs mr-1 relative" :class="[item.uj && item.uj.status_batas_susut == 'Terisi'? 'bg-green-600' : 'bg-red-500']">
            <div class="relative z-[1]">
              {{ item.uj?.status_batas_susut }}
            </div>
          </div>
        </template>

        <template #[`deleted_by_username`]="{item}">
          {{ item.deleted_by?.username }}
        </template>

        <template #[`req_deleted_by_username`]="{item}">
          {{ item.req_deleted_by?.username }}
        </template>
      </TableView>
    </div>

    <LazyPopupMini :type="'custome'" :show="req_deleted_box" :data="req_deleted_data" :fnClose="toggleReqDeleteBox" :fnConfirm="confirmedReqDeleted">      
      <template #words>
        Data akan diproses dan <b>tidak dapat dibatalkan lagi</b>, apakah Anda menyetujui permintaan penghapusan data berikut?
      </template>
      <template #footer>
          Alasan Tambahan:
        <div class="grow mb-5" >
          <textarea  v-model="reason_adder"></textarea>
        </div>
      </template>
    </LazyPopupMini>

    <LazyPopupMini :type="'custome'" :show="multi_clear_ticket_box" :fnClose="()=>multi_clear_ticket_box=false" :fnConfirm="multiClearTicket" >
      <template #words>
        Ticket akan <b class="text-red-500">dibersihkan</b> sesuai dengan data-data yang telah di pilih, yakin untuk melanjutkan ?
      </template>
    </LazyPopupMini>

    <LazyPopupMini :type="'custome'" :show="multi_val_ticket_box" :fnClose="()=>multi_val_ticket_box=false" :fnConfirm="multiVal" > 
      <template #words>
        Ticket akan <b class="text-red-500">divalidasi</b> sesuai dengan data-data yang telah di pilih, yakin untuk melanjutkan ?
      </template>
    </LazyPopupMini>

    <LazyPopupMini :type="'custome'" :show="multi_unval_ticket_box" :fnClose="()=>multi_unval_ticket_box=false" :fnConfirm="multiUnval" > 
      <template #words>
        Ticket akan <b class="text-red-500">di unvalidasi</b> sesuai dengan data-data yang telah di pilih, yakin untuk melanjutkan ?
      </template>
    </LazyPopupMini>
    <!-- <trx_trpsRequested :show="popup_request" :fnClose="()=>{ popup_request = false; }" @update_request_notif="request_notif = $event"/> -->
    <!-- <FormsTrxTrpTicket :show="forms_trx_trp_show" :fnClose="()=>{forms_trx_trp_show=false}" :fnLoadDBData="fnLoadDBData" :id="forms_trx_trp_id" :p_data="trx_trps" :list_ticket="list_ticket" :online_status="online_status"/> -->
    <LazyFormsTrxTrpTicket :show="forms_trx_trp_show" :fnClose="()=>{forms_trx_trp_show=false}" :fnLoadDBData="fnLoadDBData" :id="forms_trx_trp_id" :p_data="trx_trps" :list_ticket="list_ticket"/>
    <LazyFormsTrxTrpTicketValidasi :show="forms_trx_trp_valid_show" :fnClose="()=>{forms_trx_trp_valid_show=false}" :id="forms_trx_trp_valid_id" :p_data="trx_trps" :it_state="forms_trx_trp_valid_state" />
      <!-- :is_view="forms_trx_trp_is_view" -->
    <LazyFormsTrxAbsen :show="forms_trx_absen_show" :fnClose="()=>{forms_trx_absen_show=false}" :index="forms_trx_absen_index" :p_data="trx_trps"/>
    <LazyFormsTrxTrpTicketOver :show="forms_trx_check_show" :fnClose="()=>{forms_trx_check_show=false}"/>

    <div v-if="cogs_show" class="w-full h-full flex items-center justify-center fixed top-0 left-0 z-20 p-3"
    style="background-color: rgba(255,255,255,0.9);">
      <div class="relative" style="width:95%; height: 90%;">
        <div class="absolute -top-7 right-0 bg-white"
          style="position: absolute; padding:5px 10px; border: solid 1px #ccc; border-bottom: none; border-top-right-radius: 5px;  border-top-left-radius: 5px;">
          <IconsTimes  style="color:black; cursor:pointer;" @click="cogs_show=false"/>
        </div>
        <div class="w-full h-full flex flex-col items-center justify-content-center bg-white">
          <div class="w-full p-1">
            <div class="w-full p-1 bg-gray-200">
              <div class="w-full text-blue-600 font-bold">
                Set Date For Load Data
              </div>
              <div class="w-full grid grid-cols-2 grid-rows-1 gap-1">
                
                <div class="flex flex-col flex-wrap p-1">
                  <label for="">From</label>
                  <div class="grow" >
                    <ClientOnly>
                      <vue-date-picker  v-model="loadDBData.from" 
                      type="datetime" 
                      format="dd-MM-yyyy"
                      :enable-time-picker = "false"
                      :clearable="false" 
                      text-input
                      teleport-center @closed="handleDate('from')"></vue-date-picker>
                    </ClientOnly>
                  </div>
                </div>
                
                <div class="flex flex-col flex-wrap p-1">
                  <label for="">To</label>
                    <div class="grow" >
                    <ClientOnly>
                      <vue-date-picker  v-model="loadDBData.to" 
                      type="datetime" 
                      format="dd-MM-yyyy"
                      :enable-time-picker = "false"
                      :clearable="false" 
                      text-input
                      teleport-center @closed="handleDate('to')"></vue-date-picker>
                    </ClientOnly>
                  </div>
                </div>
              </div>

            </div>

          </div>
          

        </div>
        <div
          style="position: absolute; top: 12px; right: 98px; background-color: rgba(255,255,255,0); width: 37px; height: 36px; z-index:1; cursor: pointer;"
          @click="cogs_show=false">
        </div>
      </div>
    </div>


    <div v-if="frm_update_ticket" class="w-full h-full flex items-center justify-center fixed top-0 left-0 z-10 p-3"
    style="background-color: rgba(255,255,255,0.9);">
      <div class="relative" style="border: solid 1px #ccc;">
        <div class="absolute -top-7 right-0 bg-white"
          style="position: absolute; padding:5px 10px; border: solid 1px #ccc; border-bottom: none; border-top-right-radius: 5px;  border-top-left-radius: 5px;">
          <IconsTimes  style="color:black; cursor:pointer;" @click="frm_update_ticket=false"/>
        </div>
        <div class="w-full h-full flex flex-col items-center justify-content-center bg-white">
          <div class="w-full p-1">
            <div class="w-full p-1">
              <div class="w-full text-gray-600 font-bold text-center">
                Set Mobil Yang Tidak Di Izinkan Untuk Di Update Tiketnya
              </div>
              <div class="w-full flex my-2">
                <div class="text-gray-600">
                  Data Luar:
                </div>
                <div class="flex mx-2" v-for="lp in useCommonStore().list_pabrik.filter((ex)=>ex!=company_code)">
                  <label class="flex cursor-pointer">
                    <input type="checkbox" :value="lp" v-model="pabriks" class="mr-1"> {{ lp }}
                  </label>
                </div>
              </div>
              <div class="w-full">
                <SelectMulti :arr="list_vehicle"/>
                <div class="w-full grid grid-cols-2 gap-1 p-1 mt-5">
                  
                  <button type="button" name="button" class="bg-blue-500 text-white"
                    @click="updateTicket()">
                    Set &amp; Update
                  </button>
                  <button type="button" name="button" class="bg-white"
                    @click="frm_update_ticket=false">
                    Close
                  </button>

                </div>
              </div>

            </div>

          </div>
          

        </div>
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
const { pointFormat } = useUtils();

definePageMeta({
  // layout: "clear",
  ssr: false,
  middleware: [
    function (to, from) {
      if (!useAuthStore().checkPermission('trp_trx.ticket.views')){
        useCommonStore().loading_full = false;
        return navigateTo('/');
      }
    },
    // 'auth',
  ],
});

const checkStatus=(data)=>{
  if(data.deleted==1) return "!bg-red-400";
  if(data.req_deleted == 1) return "!bg-yellow-300"; 
  // if(data.val_ticket == 1 && (
  //   ( ["CPO","PK"].indexOf(data.jenis)>-1 && (data.ticket_a_id!="" && data.ticket_b_bruto!="" && data.ticket_b_tara!="" && data.ticket_b_netto !="" && data.ticket_b_in_at!="" && data.ticket_b_out_at!="")) ||
  //   ( data.jenis=="TBS" && (data.ticket_a_id!="" && data.ticket_b_id!="") ) ||
  //   ( data.jenis=="TBSK" && data.ticket_b_id!="") ||
  //     data.ticket_note != ""
  //   )
  // ) return "!bg-blue-300"; 
  if(data.val_ticket == 1) return "!bg-blue-300"; 
  return "";
}
const addClassToTbody=(data)=>{
  data.map(e => {    
    e.class_h = checkStatus(e);
  });
  return data;
}

const company_code = useDynamicPathCookie('company_code');
const pabriks = ref([]);
let deep_state = ref({
  clearCheckBox:false
});

const filter_status = ref("ticket_not_done")
watch(()=>filter_status.value,(newval)=>{
  // fields_thead.value.map((x)=>{
  //   let in_list=["deleted_by_username","deleted_at","deleted_reason","req_deleted_by_username","req_deleted_at","req_deleted_reason"].indexOf(x.key) > -1;
  //   if(["all","deleted","req_deleted"].indexOf(newval) > -1){
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
params.sort ="tanggal:desc";

const field_errors = ref({})

const date = ref({
  from: "",
  to: "",
});

const token = useDynamicPathCookie('token');
const { data: dt_async } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  let trx_trps = [];
  let list_vehicle = [];
  let vehicles_allowed = [];
  // let list_ticket = [];

  const [data1, data2,data3] = await Promise.all([
    useMyFetch("/trx_trp_tickets", {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      },
      params:{filter_status},
      retry: 0,
    }),
    useMyFetch("/vehicles_available", {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      },
      retry: 0,
    }),
    useMyFetch("/temp_data/vehiclesAllowedUpdateTicket", {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      },
      retry: 0,
    }),
  ]);

  

  if (data1.status.value !== 'error') {
    trx_trps = addClassToTbody(data1.data.value.data);
  }

  if (data1.status.value === 'error') {
    useErrorStore().trigger(data1.error);
    // return { trx_trps, list_ticket};
    return { trx_trps };
  }

  if (data2.status.value !== 'error') {
    list_vehicle = data2.data.value.data;
  }

  if (data3.status.value !== 'error') {
    vehicles_allowed = data3.data.value.data;
  }
  useCommonStore().loading_full = false;

  return { trx_trps, list_vehicle , vehicles_allowed};
  // return { trx_trps };
},
  {
    lazy: true,        // 🔥 INI KUNCINYA
    server: false,
    default: () => ({ trx_trps: [],list_vehicle:[] , vehicles_allowed:[] }),     // 🔥 penting untuk dashboard / auth page
  });

const trx_trps = ref([]);

watch(
  () => dt_async.value?.trx_trps,
  (val) => {
    if (val) {
      trx_trps.value = [...val]; // clone agar aman
    }
  },
  { immediate: true }
);

const list_vehicle = ref([]);
// dt_async.value.list_vehicle.forEach(e => {
//   list_vehicle.value.push({
//     id:e.id,
//     name:e.no_pol,
//     title:'',
//     checked:dt_async.value.vehicles_allowed.indexOf(e.id) > -1 ? true : false
//   })
// });


watch(
  () => dt_async.value?.list_vehicle,
  (val) => {
    if (val) {
      val.forEach(e => {
        list_vehicle.value.push({
          id:e.id,
          name:e.no_pol,
          title:'',
          checked:dt_async.value.vehicles_allowed.indexOf(e.id) > -1 ? true : false
        })
      });
    }
  },
  { immediate: true }
);

// const list_vehicle = ref(dt_async.value.list_vehicle || []);
// const list_ticket = ref(dt_async.value.list_ticket);
const list_ticket = ref([]);
// const online_status=ref(false);
const fnLoadDBData = async (jenis,transition_target="") => {
  useCommonStore().loading_full = true;
  let from = loadDBData.value.from ? $moment(loadDBData.value.from).format("Y-MM-DD") : "";
  let to = loadDBData.value.to ? $moment(loadDBData.value.to).format("Y-MM-DD") : "";
  const { data, error, status } = await useMyFetch("/trx_load_for_trp", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {jenis,from,to,transition_target},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  list_ticket.value = data.value.list_ticket;
}

const sort = ref({
  field: "tanggal",
  by: "desc"
});
const selected = ref(-1);
const dt_selected = computed(()=>{  
  return trx_trps.value[selected.value];
})

const scrolling = ref({
  page: 1,
  is_last_record: false,
  scrollLeft: 0,
  may_get_data: true
});

const inject_params = () => {
  params.like = "";
  let words = JSON.parse(JSON.stringify(useCommonStore()._tv.global_keyword));
  if (words != "") {
    params.like = `id:%${words}%,xto:%${words}%,jenis:%${words}%,pv_no:%${words}%,ticket_a_no:%${words}%,ticket_b_no:%${words}%,no_pol:%${words}%,supir:%${words}%,kernet:%${words}%,cost_center_code:%${words}%,cost_center_desc:%${words}%,pvr_no:%${words}%,tanggal:%${words}%,transition_target:%${words}%,uj_asst_opt:%${words}%`;
  }
  params.sort = "";
  if (sort.value.field) {
    params.sort = sort.value.field + ":" + sort.value.by;
  }

  params.date_from = date.value.from ? $moment(date.value.from).format("YYYY-MM-DD") : "";
  params.date_to = date.value.to ? $moment(date.value.to).format("YYYY-MM-DD") : "";
  
  params.filter_model = JSON.stringify(useCommonStore()._tv.filter_model);
};



const callData = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  scrolling.value.may_get_data = false;
  params.page = scrolling.value.page;
  if (params.page == 1) trx_trps.value = [];
  if(params.first_row) delete params.first_row;
  if(params.page > 1){
    params.first_row = JSON.stringify(trx_trps.value[0]);
  }
  params.filter_status = filter_status.value;

  const { data, error, status } = await useMyFetch("/trx_trp_tickets", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: params,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  scrolling.value.may_get_data = true;

  if (status.value === 'error') {
    useErrorStore().trigger(error, field_errors);
    return;
  }

  if (scrolling.value.page == 1) {
    trx_trps.value = addClassToTbody(data.value.data);
  } else if (scrolling.value.page > 1) {
    trx_trps.value = [...trx_trps.value, ...addClassToTbody(data.value.data)];
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

const router = useRouter();

const forms_trx_trp_show =  ref(false);
const forms_trx_trp_id = ref(0);

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

const forms_trx_trp_valid_state = ref(1);

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_valid_state.value = -1;
    forms_trx_trp_show.value = true;
    // router.push({ name: 'data_trx_trp-form', query: { id: trx_trps.value[selected.value].id } });
  }
};

const forms_trx_trp_valid_show =  ref(false);
const forms_trx_trp_valid_id = ref(0);
// const forms_trx_trp_is_view = ref(false);
const validasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_valid_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_valid_state.value = 1;
    forms_trx_trp_valid_show.value = true;
    // forms_trx_trp_is_view.value = false;
  }
};

const unvalidasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_valid_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_valid_state.value = 0;
    forms_trx_trp_valid_show.value = true;
    // forms_trx_trp_is_view.value = false;
  }
};

const form_view = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_valid_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_valid_state.value = -1;
    forms_trx_trp_valid_show.value = true;
    // forms_trx_trp_is_view.value = true;
  }
};

const forms_trx_absen_show =  ref(false);
const forms_trx_absen_index = ref(0);
const form_absen = (index) => {
  forms_trx_absen_index.value = index;
  forms_trx_absen_show.value = true;
};

const req_deleted_data = ref({});
const req_deleted_box = ref(false);
const req_deleted_reason = ref("");
const toggleReqDeleteBox = async()=>{  
  if (req_deleted_box.value) {
    req_deleted_box.value = false;
  }
};

const multi_clear_ticket_box = ref(false);
const multi_val_ticket_box = ref(false);
const multi_unval_ticket_box = ref(false);

const reason_adder = ref("");
const approveVoid = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    req_deleted_reason.value = '';
    reason_adder.value = '';
    req_deleted_data.value = {
      id : trx_trps.value[selected.value].id, 
      "no pol":trx_trps.value[selected.value].no_pol, 
      "tujuan":trx_trps.value[selected.value].xto,
      "permintaan":trx_trps.value[selected.value].req_deleted_by?.username,
      "alasan":trx_trps.value[selected.value].req_deleted_reason,
    };
    req_deleted_box.value = true;
  }
};

const confirmedReqDeleted = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", trx_trps.value[selected.value].id);  
  data_in.append("_method", "DELETE");
  data_in.append("reason_adder", reason_adder.value);  

  const { data, error, status } = await useMyFetch("/trx_trp_approve_req_delete", {
    method: "post",
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
    },
    body: data_in,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  let old = {...trx_trps.value[selected.value]};
  old['deleted'] = data.value.deleted;
  old['deleted_user'] = data.value.deleted_user;
  old['deleted_at'] = data.value.deleted_at;
  old['deleted_by'] = data.value.deleted_by;
  old['deleted_reason'] = data.value.deleted_reason;
  old['class_h'] = checkStatus(old);
  if(filter_status.value!='all'){
    trx_trps.value.splice(selected.value,1);
  }else{
    trx_trps.value.splice(selected.value,1,{...old});
  }
  selected.value = -1;
  req_deleted_box.value = false;
}

const multiVal = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("ids", JSON.stringify(checkbox_arr.value));  
  data_in.append("_method", "PUT");

  const { data, error, status } = await useMyFetch("/trx_trp_val_tickets", {
    method: "post",
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
    },
    body: data_in,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  multi_val_ticket_box.value = false;
  data.value.val_lists.forEach(e => {
    let idx = trx_trps.value.map((x)=>x.id).indexOf(e.id);
    if(idx>-1){
      let sd = trx_trps.value[idx];
      sd.val_ticket = e.val_ticket;
      sd.val_ticket_by = e.val_ticket_by;
      sd.val_ticket_at = e.val_ticket_at;
      sd.updated_at = e.updated_at;
      trx_trps.value.splice(idx,1,{...sd});
    }
  });
  deep_state.value.clearCheckBox = true;
}

const multiUnval = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("ids", JSON.stringify(checkbox_arr.value));  
  data_in.append("_method", "PUT");

  const { data, error, status } = await useMyFetch("/trx_trp_unval_tickets", {
    method: "post",
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
    },
    body: data_in,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  multi_unval_ticket_box.value = false;
  data.value.val_lists.forEach(e => {
    let idx = trx_trps.value.map((x)=>x.id).indexOf(e.id);
    if(idx>-1){
      let sd = trx_trps.value[idx];
      sd.val_ticket = e.val_ticket;
      sd.val_ticket_by = e.val_ticket_by;
      sd.val_ticket_at = e.val_ticket_at;
      sd.updated_at = e.updated_at;
      trx_trps.value.splice(idx,1,{...sd});
    }
  });
  deep_state.value.clearCheckBox = true;
}

const multiClearTicket = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("ids", JSON.stringify(checkbox_arr.value));  
  data_in.append("_method", "PUT");

  const { data, error, status } = await useMyFetch("/trx_trp_clear_tickets", {
    method: "post",
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
    },
    body: data_in,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  multi_clear_ticket_box.value = false;

  data.value.clear_lists.forEach(e => {
    let idx = trx_trps.value.map((x)=>x.id).indexOf(e.id);
    if(idx>-1){
      let sd = trx_trps.value[idx];
      sd.ticket_a_id = e.ticket_a_id;
      sd.ticket_a_no = e.ticket_a_no;
      sd.ticket_b_id = e.ticket_b_id;
      sd.ticket_b_no = e.ticket_b_no;
      sd.updated_at = e.updated_at;
      trx_trps.value.splice(idx,1,{...sd});
    }
  });

  deep_state.value.clearCheckBox = true;
}

const forms_trx_check_show =  ref(false);
const checkTicket = (index) => {
  forms_trx_check_show.value = true;
};


const cogs_show=ref(false);

const loadDBData = ref({
  from: new Date().setDate(new Date().getDate() - 3),
  to:new Date(),
})

const handleDate = (source)=>{
  if(source=='from'){
    if(loadDBData.value.from-loadDBData.value.to>0){
      loadDBData.value.from = loadDBData.value.to;
    }
  }else{
    if(loadDBData.value.to-loadDBData.value.from<0){
      loadDBData.value.to = loadDBData.value.from;
    }
  }
}

const updateTicket = async() => {
  useCommonStore().loading_full = true;
  const data_in = new FormData();
  data_in.append("vehicles",JSON.stringify(list_vehicle.value.filter((x)=>x.checked).map((x)=>x.id)));
  data_in.append("pabriks",JSON.stringify(pabriks.value));
  const { data, error, status } = await useMyFetch("/trx_trp_do_update_ticket", {
    method: "post",
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
    },
    body: data_in,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  data.value.data.forEach(e => {
    let idx = trx_trps.value.map((x)=>x.id).indexOf(e.id);
    if(idx !== -1) {
      let dt = trx_trps.value[idx];
      dt.ticket_a_id = e.ticket_a_id;
      dt.ticket_a_no = e.ticket_a_no;
      dt.ticket_a_bruto = e.ticket_a_bruto;
      dt.ticket_a_tara = e.ticket_a_tara;
      dt.ticket_a_netto = e.ticket_a_netto;
      dt.ticket_a_supir = e.ticket_a_supir;
      dt.ticket_a_no_pol = e.ticket_a_no_pol;
      dt.ticket_a_in_at = e.ticket_a_in_at;
      dt.ticket_a_out_at = e.ticket_a_out_at;

      dt.ticket_b_id = e.ticket_b_id;
      dt.ticket_b_no = e.ticket_b_no;
      dt.ticket_b_bruto = e.ticket_b_bruto;
      dt.ticket_b_tara = e.ticket_b_tara;
      dt.ticket_b_netto = e.ticket_b_netto;
      dt.ticket_b_supir = e.ticket_b_supir;
      dt.ticket_b_no_pol = e.ticket_b_no_pol;
      dt.ticket_b_in_at = e.ticket_b_in_at;
      dt.ticket_b_out_at = e.ticket_b_out_at;
      dt.updated_at = e.updated_at;
      
      trx_trps.value.splice(idx,1,{...dt});
    }
    
  });

  display({ show: true, status: "Success", message: "Update PV Done" });
}

const checkbox_arr = ref([]);

const fields_thead=ref([
  {key:"cb",label:"",checkbox:'id'},
  {key:"no",label:"No",isai:true},
  // {key:"val",label:"App 1",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  // {key:"val1",label:"App 2",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  {key:"val_ticket",label:"Logistik",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  {key:"id",label:"ID",filter_on:1,type:"number",sort:{priority:1,type:"desc"}},
  {key:"status_batas_susut",label:"Batas Susut",type:'string'},
  {key:"tanggal",label:"U.Jalan Per",type:'date',dateformat:"DD-MM-Y",filter_on:1},
  {key:"no_pol",label:"No Pol",freeze:1,filter_on:1,type:'string'},
  {key:"xto",label:"Tujuan",filter_on:1,type:'string'},
  {key:"uj_asst_opt",label:"Info",filter_on:1,type:'select',select_item:['DENGAN KERNET','TANPA KERNET']},
  {key:"tipe",label:"Tipe",filter_on:1,type:'string'},
  {key:"jenis",label:"Jenis",filter_on:1,type:'string'},
  // {key:"jenis",label:"Jenis",filter_on:1,type:"select",select_item:['TBS','TBSK','CPO','PK','LAIN','TUNGGU']},
  {key:"amount",label:"Amount",class:" justify-end",filter_on:1,type:"number"},
  {key:"transition",label:"Peralihan",childs:[
    {key:"transition_type",label:"Type",type:'select', filter_on:1,select_item:['To','From']},
    {key:"transition_target",label:"Target",type:'select',filter_on:1,select_item:useCommonStore().list_pabrik},
  ]},
  {key:"ticket_a",label:"Ticket A",childs:[
    {key:"ticket_a_no",label:"No",filter_on:1,type:'string'},
    {key:"ticket_a_bruto",label:"Bruto",filter_on:1,type:'number'},
    {key:"ticket_a_tara",label:"Tara",filter_on:1,type:'number'},
    {key:"ticket_a_netto",label:"Netto",filter_on:1,type:'number'},
    {key:"ticket_a_supir",label:"Supir",filter_on:1,type:'string'},
    {key:"ticket_a_no_pol",label:"No Pol",filter_on:1,type:'string'},
    {key:"ticket_a_in_at",label:"In At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
    {key:"ticket_a_out_at",label:"Out At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  ]},
  {key:"ticket_b",label:"Ticket B",childs:[
    {key:"ticket_b_no",label:"No",filter_on:1,type:'string'},
    {key:"ticket_b_bruto",label:"Bruto",filter_on:1,type:'number'},
    {key:"ticket_b_tara",label:"Tara",filter_on:1,type:'number'},
    {key:"ticket_b_netto",label:"Netto",filter_on:1,type:'number'},
    {key:"ticket_b_supir",label:"Supir",filter_on:1,type:'string'},
    {key:"ticket_b_no_pol",label:"No Pol",filter_on:1,type:'string'},
    {key:"ticket_b_in_at",label:"In At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
    {key:"ticket_b_out_at",label:"Out At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  ]},
  {key:"susut",label:"Susut",childs:[
    {key:"susut_bruto",label:"Bruto",childs:[
      // {key:"susut_bruto_a",label:"Berangkat"},
      // {key:"susut_bruto_b",label:"Kembali"},
      {key:"susut_bruto_b_a",label:"Selisih"},
      {key:"susut_bruto_b_a_persen",label:"%"},
    ]},
    {key:"susut_tara",label:"Tara",childs:[
      // {key:"susut_tara_a",label:"Berangkat"},
      // {key:"susut_tara_b",label:"Kembali"},
      {key:"susut_tara_b_a",label:"Selisih"},
      {key:"susut_tara_b_a_persen",label:"%"},
    ]},
    {key:"susut_netto",label:"Netto",childs:[
      // {key:"susut_netto_a",label:"Berangkat"},
      // {key:"susut_netto_b",label:"Kembali"},
      {key:"susut_netto_b_a",label:"Selisih"},
      {key:"susut_netto_b_a_persen",label:"%"},
    ]},
  ]},
  {key:"salary_paid",label:"Salary Paid",type:'string'},
  {key:"supir",label:"Supir",filter_on:1,type:'string'},
  {key:"kernet",label:"Kernet",filter_on:1,type:'string'},
  {key:"created_at",label:"Created At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"updated_at",label:"Updated At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"pv_no",label:"PV No",type:'string'},
  {key:"deleted_by_username",label:"Deleted By",tbl_show:1},
  {key:"deleted_at",label:"Deleted At",dateformat:"DD-MM-Y HH:mm:ss", tbl_show:1,type:'datetime',filter_on:1},
  {key:"deleted_reason",label:"Deleted Reason", tbl_show:1,type:'string',filter_on:1},
  {key:"req_deleted_by_username",label:"Req Deleted By",tbl_show:1},
  {key:"req_deleted_at",label:"Req Delete At",dateformat:"DD-MM-Y HH:mm:ss", tbl_show:1,type:'datetime',filter_on:1},
  {key:"req_deleted_reason",label:"Req Delete Reason", tbl_show:1,type:'string',filter_on:1},
]);

const enabled_view = computed(()=>{ 
  let result = selected.value > -1
  && useUtils().checkPermission('trp_trx.ticket.view');
  return result;
})

const enabled_edit = computed(()=>{  
  let result = selected.value > -1 
  && dt_selected.value.deleted == 0
  && dt_selected.value.req_deleted == 0
  && dt_selected.value.val_ticket == 0
  && useUtils().checkPermission('trp_trx.ticket.modify');
  return result;
})

const enabled_validasi = computed(()=>{  
  let result = selected.value > -1 
  && dt_selected.value.deleted == 0
  && dt_selected.value.req_deleted == 0
  && dt_selected.value.val_ticket == 0
  && useUtils().checkPermission('trp_trx.ticket.val_ticket');
  return result;
})

const enabled_unvalidasi = computed(()=>{  
  let result = selected.value > -1 
  && dt_selected.value.deleted == 0
  && dt_selected.value.req_deleted == 0
  && dt_selected.value.val_ticket == 1
  && useUtils().checkPermission('trp_trx.ticket.unval_ticket');
  return result;
})

const enabled_approve_void = computed(()=>{
  let result = selected.value > -1 
  && dt_selected.value.deleted == 0
  && dt_selected.value.req_deleted == 1
  && dt_selected.value.val_ticket == 0
  && useUtils().checkPermission('trp_trx.approve_request_remove');
  return result;
})

const frm_update_ticket=ref(false);


const calculateSusut=(a,b)=>{
  a = parseFloat(a) || 0;
  b = parseFloat(b) || 0;
  
  let diff=parseFloat(b-a);
  let bigger = diff > 0 ? b : a;

  if(bigger==0) return 0;
  let result = useUtils().round(diff / a * 100,2);
  if(result<0) return "("+Math.abs(result*100)/100+")";
  return result;
}

const calculateSelisih=(a,b)=>{
  a = parseFloat(a) || 0;
  b = parseFloat(b) || 0;
  
  let diff=parseFloat(b-a);
  if(diff<0) return "("+pointFormat(Math.abs(diff))+")";
  return pointFormat(diff);
}

const { downloadFile, viewFile } = useDownload();

const downloadExcel = async()=>{  
  inject_params();
  useCommonStore().loading_full = true;
  params.filter_status = filter_status.value;
  const { data, error, status } = await useMyFetch("/trx_trp_tickets/download_excel", {
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