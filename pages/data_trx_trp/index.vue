<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Transaction'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex justify-between flex-wrap">
        <div class="grow flex">
          <div class="m-1">
            <select class="" v-model="filter_status" >
              <option value="pv_not_done">Undone</option>
              <option value="pv_done">Done</option>
              <option value="deleted">Trash</option>
              <option value="all">All</option>
              <option value="req_deleted">Req Delete</option>
            </select>
          </div>

          <button v-if="enabled_add" type="button" name="button" class="m-1 text-2xl "
            @click="form_add()">
            <IconsPlus />
          </button>
          <!-- <button v-if="enabled_edit" type="button" name="button" class="m-1 text-2xl "
            @click="form_edit()">
            <IconsEdit/> dihapus karna ada fitur kunci supir atau kernet
          </button> -->
          <button v-if="enabled_view" type="button" name="button" class="m-1 text-2xl "
            @click="form_view()">
            <IconsEyes/>
          </button>
          <button  v-if="enabled_remove" type="button" name="button" class="m-1 text-2xl "
            @click="remove()">
            <IconsDelete />
          </button>
          <button  v-if="enabled_void" type="button" name="button" class="m-1 text-2xl "
            @click="for_remove()">
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

          <button v-if="enabled_print_preview" type="button" name="button" class="m-1 text-2xl "
            @click="printPreview()">
            <IconsPrinterEye />
          </button>

          <button v-if="enabled_print_preview_bt" type="button" name="button" class="m-1 text-2xl "
            @click="printPreviewBT()">
            <IconsPrinterEye />
          </button>

          <button v-if="checkbox_arr.length > 0 && useUtils().checkPermissions(['trp_trx.val','trp_trx.val1','trp_trx.val2','trp_trx.val3','trp_trx.val4','trp_trx.val5','trp_trx.val6'])" type="button" name="button" class="m-1 text-xs whitespace-nowrap grid grid-cols-2"
            @click="multi_val_ticket_box=true">
            <IconsSignature />
            <IconsSignature />
            <IconsSignature />
            <IconsSignature />
          </button>
        </div>
        <div class="flex">
          <button v-if="useUtils().checkPermission('trp_trx.generate_pvr')" type="button" name="button" class="m-1 text-xs whitespace-nowrap"
            @click="generatePVR()">
            Gen/Update PVR
          </button>
          <button  v-if="useUtils().checkPermission('trp_trx.generate_pv')" type="button" name="button" class="m-1 text-xs whitespace-nowrap"
            @click="generatePV()">
            Gen/Update PV
          </button>
          <!-- <button  v-if="useUtils().checkPermission('trp_trx.get_pv')" type="button" name="button" class="m-1 text-xs whitespace-nowrap"
            @click="updatePV()">
            Update PV
          </button> -->
          <div v-if="useUtils().checkPermissions(['trp_trx.generate_pvr','trp_trx.generate_pv','trp_trx.get_pv'])" class="m-1 card-border cursor-pointer" @click="online_status = !online_status">
            <span class="text-xs">Mode</span> : <span class="font-bold" :class="online_status?'text-green-600' : 'text-red-600'">{{ online_status ? "ONLINE" : "OFFLINE" }} </span>
          </div>
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
      

      <TableView :thead="fields_thead" :selected="selected" @setSelected="selected = $event" :tbody="trx_trps" :fnCallData="callData" :scrolling="scrolling" @setScrollingPage="scrolling.page=$event" @doFilter="searching()" @setCheckbox="checkbox_arr=$event" :deep_state="deep_state">
        <template #[`id`]="{item}">
          {{item.id}}<span v-if="item.potongan && item.potongan.length > 0">*</span>
        </template>
        <template #[`absen`]="{item,index}">
          <IconsImage v-if="item.trx_absens && item.trx_absens.length > 0" class="cursor-pointer" @click="form_absen(index)"/>
        </template>
        <template #[`val`]="{item}">
          <IconsLine v-if="!item.val"/>
          <IconsCheck v-else/>
        </template>
        <template #[`val1`]="{item}">
          <div class="w-full flex flex-col items-center justify-center">
            <IconsLine v-if="!item.val1"/>
            <IconsCheck v-else/>
            <div class="text-xs" v-if="item.absen_not_done && item.absen_not_done.length > 0"> 
              {{ item.absen_not_done.join(",") }}
            </div>
          </div>
        </template>
        <template #[`val2`]="{item}">
          <IconsLine v-if="!item.val2"/>
          <IconsCheck v-else/>
        </template>
        <template #[`val3`]="{item}">
          <IconsLine v-if="!item.val3"/>
          <IconsCheck v-else/>
        </template>
        <template #[`val4`]="{item}">
          <IconsLine v-if="!item.val4"/>
          <IconsCheck v-else/>
        </template>
        <template #[`val5`]="{item}">
          <IconsLine v-if="!item.val5"/>
          <IconsCheck v-else/>
        </template>
        <template #[`val6`]="{item}">
          <IconsLine v-if="!item.val6"/>
          <IconsCheck v-else/>
        </template>
        <template #[`uj_xto`]="{item}">
          {{ item.uj?.xto }}
        </template>
        <template #[`uj_asst_opt`]="{item}">
          {{ item.uj?.asst_opt }}
        </template>
        <template #[`uj_tipe`]="{item}">
          {{ item.uj?.tipe }}
        </template>
        <template #[`uj_harga`]="{item}">
          {{ pointFormat(item.uj?.harga) }}
        </template>
        <template #[`payment_method_name`]="{item}">
          {{ item.payment_method?.name }}
        </template>
        <template #[`received_payment`]="{item}">
          {{ item.received_payment?"Ya":"Tidak" }}
        </template>
        <template #[`pvr_had_detail`]="{item}">
          <IconsLine v-if="!item.pvr_had_detail"/><IconsCheck v-else/>
        </template>
        <template #[`pv_complete`]="{item}">
          <IconsLine v-if="!item.pv_complete"/><IconsCheck v-else/>
        </template>
        <template #[`deleted_by_username`]="{item}">
          {{ item.deleted_by?.username }}
        </template>

        <template #[`req_deleted_by_username`]="{item}">
          {{ item.req_deleted_by?.username }}
        </template>

        <template #[`supir`]="{item}">
          {{ item.supir }} 
          <span v-if="item.potongan && item.potongan.length > 0 && item.potongan.map((ii)=>ii.potongan_mst.employee_id).indexOf(item.supir_id) > -1">
            *
          </span>
        </template>

        <template #[`kernet`]="{item}">
          {{ item.kernet }} 
          <span v-if="item.potongan && item.potongan.length > 0 && item.potongan.map((ii)=>ii.potongan_mst.employee_id).indexOf(item.kernet_id) > -1">
            *
          </span>
        </template>
      </TableView>
    </div>

    <PopupMini :type="'delete'" :show="delete_box" :data="delete_data" :fnClose="toggleDeleteBox" :fnConfirm="confirmed_delete" :enabledOk="enabledOk" >
      <template #footer>
        Masukkan Alasan Penghapusan:
        <div class="grow mb-5" >
          <textarea  v-model="deleted_reason"></textarea>
        </div>
      </template>
    </PopupMini>

    <PopupMini :type="'custome'" :show="multi_val_ticket_box" :fnClose="()=>multi_val_ticket_box=false" :fnConfirm="multiVal" > 
      <template #words>
        Ticket akan <b class="text-red-500">divalidasi</b> sesuai dengan data-data yang telah di pilih, yakin untuk melanjutkan ?
      </template>
    </PopupMini>

    <PopupMini :type="'custome'" :show="req_deleted_box" :data="req_deleted_data" :fnClose="toggleReqDeleteBox" :fnConfirm="confirmedReqDeleted" :enabledOk="enabledOk1" >
      
      <template #words>
        Data akan diproses dan <b>tidak dapat dibatalkan lagi</b>, yakin untuk melanjutkan ?
      </template>
      <template #footer>
          Masukkan Alasan Permintaan Penghapusan:
        <div class="grow mb-5" >
          <textarea  v-model="req_deleted_reason"></textarea>
        </div>
      </template>
    </PopupMini>
    <FormsTrxTrp :show="forms_trx_trp_show" :fnClose="()=>{forms_trx_trp_show=false}" :fnLoadDBData="fnLoadDBData" :id="forms_trx_trp_id" :p_data="trx_trps" :list_cost_center="list_cost_center" :online_status="online_status"/>
    <FormsTrxTrpValidasi :show="forms_trx_trp_valid_show" :fnClose="()=>{forms_trx_trp_valid_show=false}" :id="forms_trx_trp_valid_id" :p_data="trx_trps" 
      :it_state="forms_trx_trp_valid_state"/>
      <!-- :is_view="forms_trx_trp_is_view" -->
    <FormsTrxAbsen :show="forms_trx_absen_show" :fnClose="()=>{forms_trx_absen_show=false}" :index="forms_trx_absen_index" :p_data="trx_trps"/>
  </div>
</template>

<script setup>
const { $moment } = useNuxtApp()

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
      if (!useAuthStore().checkPermission('trp_trx.views')){
        useCommonStore().loading_full = false;
        return navigateTo('/');
      }

    },
    // 'auth',
  ],
});

let deep_state = ref({
  clearCheckBox:false
});

const checkStatus=(data)=>{
  if(data.deleted==1) return "!bg-red-400";
  if(data.pvr_id > 0 && data.req_deleted == 1) return "!bg-yellow-300"; 
  if(data.absen_not_done && data.absen_not_done.length > 0) return "!bg-gray-300"; 
  if(data.pv_id > 0) return "!bg-blue-300"; 
  return "";
}
const addClassToTbody=(data)=>{
  data.map(e => {    
    e.class_h = checkStatus(e);
  });
  return data;
}


const filter_status = ref("pv_not_done")
watch(()=>filter_status.value,(newval)=>{
  fields_thead.value.map((x)=>{
    let in_list=["deleted_by_username","deleted_at","deleted_reason","req_deleted_by_username","req_deleted_at","req_deleted_reason"].indexOf(x.key) > -1;
    if(["all","deleted","req_deleted"].indexOf(newval) > -1){
      if( in_list )
        x.tbl_show =  1; 
    }else{
      if( in_list )
        x.tbl_show =  0; 
    }
    return x;
  });


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

  const [data1, data2] = await Promise.all([
    useMyFetch("/trx_trps", {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      },
      params:{filter_status},
      retry: 0,
    }),
    // useMyFetch("/trx_load_for_trp", {
    //   method: 'get',
    //   headers: {
    //     'Authorization': `Bearer ${token.value}`,
    //     'Accept': 'application/json'
    //   },
    //   retry: 0,
    // }),
  ]);

  

  if (data1.status.value !== 'error') {
    trx_trps = addClassToTbody(data1.data.value.data);
  }

  if (data1.status.value === 'error') {
    useErrorStore().trigger(data1.error);
    return { trx_trps };
  }

  useCommonStore().loading_full = false;

  return { trx_trps };
});

const trx_trps = ref(dt_async.value.trx_trps || []);
const list_cost_center = ref([]);
const online_status=ref(false);
const fnLoadDBData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_load_cost_center", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {"online_status":online_status.value},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  list_cost_center.value = data.value.list_cost_center;
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

  const { data, error, status } = await useMyFetch("/trx_trps", {
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

const forms_trx_trp_valid_state = ref(1);

const forms_trx_trp_show =  ref(false);
const forms_trx_trp_id = ref(0);
const form_add = () => {
  forms_trx_trp_id.value = 0;
  forms_trx_trp_valid_state.value = -1;
  forms_trx_trp_show.value = true;
}

const { display } = useAlertStore();

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_valid_state.value = -1;
    forms_trx_trp_show.value = true;
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
  }
};

const unvalidasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_valid_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_valid_state.value = 0;
    forms_trx_trp_valid_show.value = true;
  }
};

const form_view = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_valid_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_valid_state.value = -1;
    forms_trx_trp_valid_show.value = true;
  }
};

const forms_trx_absen_show =  ref(false);
const forms_trx_absen_index = ref(0);
const form_absen = (index) => {
  forms_trx_absen_index.value = index;
  forms_trx_absen_show.value = true;
};

const enabledOk = ref(false);
const delete_data = ref({});
const delete_box = ref(false);
const deleted_reason = ref("");
const toggleDeleteBox = async()=>{  
  if (delete_box.value) {
    delete_box.value = false;
  }
};

const remove = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    deleted_reason.value = '';
    delete_data.value = {id : trx_trps.value[selected.value].id, "no pol":trx_trps.value[selected.value].no_pol, "tujuan":trx_trps.value[selected.value].xto};
    delete_box.value = true;
  }
};

watch(()=>deleted_reason.value,(newval)=>{
  if( newval.trim().length > 0 ) enabledOk.value = true;
  else enabledOk.value = false;
}, {
  immediate: false
})

const confirmed_delete = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", trx_trps.value[selected.value].id);  
  data_in.append("deleted_reason", deleted_reason.value);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/trx_trp", {
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
  delete_box.value = false;
}



const enabledOk1 = ref(false);
const req_deleted_data = ref({});
const req_deleted_box = ref(false);
const req_deleted_reason = ref("");
const toggleReqDeleteBox = async()=>{  
  if (req_deleted_box.value) {
    req_deleted_box.value = false;
  }
};

const for_remove = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    req_deleted_reason.value = '';
    req_deleted_data.value = {id : trx_trps.value[selected.value].id, "no pol":trx_trps.value[selected.value].no_pol, "tujuan":trx_trps.value[selected.value].xto};
    req_deleted_box.value = true;
  }
};

watch(()=>req_deleted_reason.value,(newval)=>{
  if( newval.trim().length > 0 ) enabledOk1.value = true;
  else enabledOk1.value = false;
}, {
  immediate: false
})

const confirmedReqDeleted = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", trx_trps.value[selected.value].id);  
  data_in.append("req_deleted_reason", req_deleted_reason.value);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/trx_trp_req_delete", {
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
  old['req_deleted'] = data.value.req_deleted;
  old['req_deleted_user'] = data.value.req_deleted_user;
  old['req_deleted_by'] = data.value.req_deleted_by;
  old['req_deleted_at'] = data.value.req_deleted_at;
  old['req_deleted_reason'] = data.value.req_deleted_reason;
  old['class_h'] = checkStatus(old);
  if(filter_status.value!='all'){
    trx_trps.value.splice(selected.value,1);
  }else{
    trx_trps.value.splice(selected.value,1,{...old});
  }
  selected.value = -1;
  req_deleted_box.value = false;
}

const checkbox_arr = ref([]);
const multi_val_ticket_box = ref(false);

const multiVal = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("ids", JSON.stringify(checkbox_arr.value));  
  data_in.append("_method", "PUT");

  const { data, error, status } = await useMyFetch("/trx_trp_validasis", {
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

      sd.val = e.val;
      sd.val_by = e.val_by;
      sd.val_at = e.val_at;

      sd.val1 = e.val1;
      sd.val1_by = e.val1_by;
      sd.val1_at = e.val1_at;

      sd.val2 = e.val2;
      sd.val2_by = e.val2_by;
      sd.val2_at = e.val2_at;

      sd.val3 = e.val3;
      sd.val3_by = e.val3_by;
      sd.val3_at = e.val3_at;

      sd.val4 = e.val4;
      sd.val4_by = e.val4_by;
      sd.val4_at = e.val4_at;

      sd.val5 = e.val5;
      sd.val5_by = e.val5_by;
      sd.val5_at = e.val5_at;

      sd.val6 = e.val6;
      sd.val6_by = e.val6_by;
      sd.val6_at = e.val6_at;

      sd.updated_at = e.updated_at;
      trx_trps.value.splice(idx,1,{...sd});
    }
  });
  deep_state.value.clearCheckBox = true;
}

const { printHtml } = useDownload();

const printPreview = async()=>{
  
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
    return;
  } 
  
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_trp_preview_file", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id : trx_trps.value[selected.value].id},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  printHtml(data.value.html,318);
}


const printPreviewBT = async()=>{
  
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
    return;
  } 
  
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_trp_preview_file_bt", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id : trx_trps.value[selected.value].id},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  printHtml(data.value.html,318);
}

const generatePVR = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  // data_in.append("id", trx_trps.value[selected.value].id);  
  data_in.append("online_status", online_status.value);  

  const { data, error, status } = await useMyFetch("/trx_trp_do_gen_pvr", {
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

  data.value.forEach(e => {
    let idx = trx_trps.value.map((x)=>x.id).indexOf(e.id);
    if(idx !== -1) {
      let dt = trx_trps.value[idx];
      dt.pvr_id = e.pvr_id;
      dt.pvr_no = e.pvr_no;
      dt.pvr_total = e.pvr_total;
      dt.pvr_had_detail = e.pvr_had_detail;
      dt.updated_at = e.updated_at;
      
      trx_trps.value.splice(idx,1,{...dt});
    }
    
  });

  display({ show: true, status: "Success", message: "Generate Or Update PVR Done" });
}

const generatePV = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  // data_in.append("id", trx_trps.value[selected.value].id);  
  data_in.append("online_status", online_status.value);  

  const { data, error, status } = await useMyFetch("/trx_trp_do_gen_pv", {
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

  data.value.forEach(e => {
    let idx = trx_trps.value.map((x)=>x.id).indexOf(e.id);
    if(idx !== -1) {
      let dt = trx_trps.value[idx];
      dt.pv_id = e.pv_id;
      dt.pv_no = e.pv_no;
      dt.pv_total = e.pv_total;
      dt.pv_datetime = e.pv_datetime;
      dt.pv_complete = e.pv_complete;
      dt.updated_at = e.updated_at;
      
      trx_trps.value.splice(idx,1,{...dt});
    }
    
  });

  display({ show: true, status: "Success", message: "Generate Or Update PV Done" });
}

const updatePV = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("online_status", online_status.value);  

  const { data, error, status } = await useMyFetch("/trx_trp_do_update_pv", {
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
      dt.pv_id = e.pv_id;
      dt.pv_no = e.pv_no;
      dt.pv_total = e.pv_total;
      dt.pv_datetime = e.pv_datetime;
      dt.updated_at = e.updated_at;
      
      trx_trps.value.splice(idx,1,{...dt});
    }
    
  });

  display({ show: true, status: "Success", message: "Update PV Done" });
}

const fields_thead=ref([
  {key:"cb",label:"",checkbox:'id'},
  {key:"no",label:"No",isai:true},
  {key:"val",label:"APP",childs:[
    {key:"val",label:"Kasir",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
    {key:"val1",label:"Mandor",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
    {key:"val2",label:"KTU/W",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
    {key:"val3",label:"Marketing",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
    {key:"val4",label:"Logistik",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
    {key:"val5",label:"SPV Logistik",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
    {key:"val6",label:"MGR Logistik",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  ]},
  {key:"id",label:"ID",filter_on:1,type:"number",sort:{priority:2,type:"desc"}},
  {key:"absen",label:"Absen"},
  {key:"tanggal",label:"U.Jalan Per",type:'date',dateformat:"DD-MM-Y",filter_on:1,sort:{priority:1,type:"desc"}},
  {key:"no_pol",label:"No Pol",freeze:1,filter_on:1,type:'string'},
  {key:"uj_xto",label:"Tujuan",filter_on:1,type:'string'},
  {key:"uj_asst_opt",label:"Info",filter_on:1,type:'select',select_item:['DENGAN KERNET','TANPA KERNET']},
  {key:"uj_tipe",label:"Tipe",filter_on:1,type:'string'},
  {key:"jenis",label:"Jenis",filter_on:1,type:"select",select_item:['TBS','TBSK','CPO','PK','LAIN','TUNGGU']},
  {key:"uj_harga",label:"Amount",class:" justify-end",filter_on:1,type:"number"},
  {key:"transition",label:"Peralihan",childs:[
    {key:"transition_type",label:"Type",type:'select', filter_on:1,select_item:['To','From']},
    {key:"transition_target",label:"Target",type:'select',filter_on:1,select_item:useCommonStore().list_pabrik},
  ]},
  {key:"cost_center",label:"Cost Center",childs:[
    {key:"cost_center_code",label:"Code",type:'string', class:" justify-start",filter_on:1},
    {key:"cost_center_desc",label:"Desc",filter_on:1,type:'string'},
  ]},
  {key:"pvr",label:"PVR",childs:[
    {key:"pvr_no",label:"No",filter_on:1,type:'string'},
    {key:"pvr_total",label:"Total",filter_on:1,type:'number'},
    {key:"pvr_had_detail",label:"Completed",filter_on:1,type:"select",select_item:[{k:'1',v:'Completed'},{k:'0',v:'Uncompleted'}]},
  ]},
  {key:"pv",label:"PV",childs:[
    {key:"pv_datetime",label:"Date",type:'date',dateformat:"DD-MM-Y",filter_on:1},
    {key:"pv_no",label:"No",filter_on:1,type:'string'},
    {key:"pv_total",label:"Total",filter_on:1,type:'number'},
    {key:"pv_complete",label:"Completed",filter_on:1,type:"select",select_item:[{k:'1',v:'Completed'},{k:'0',v:'Uncompleted'}]},
  ]},
  {key:"supir",label:"Supir",filter_on:1,type:'string'},
  {key:"supir_rek_no",label:"No Rek Supir",filter_on:1,type:'string'},
  {key:"supir_rek_name",label:"Nama Rek Supir",filter_on:1,type:'string'},
  {key:"kernet",label:"Kernet",filter_on:1,type:'string'},
  {key:"kernet_rek_no",label:"No Rek Kernet",filter_on:1,type:'string'},
  {key:"kernet_rek_name",label:"Nama Rek Kernet",filter_on:1,type:'string'},
  {key:"payment_method_name",label:"Payment Method Name",type:'string'},
  {key:"received_payment",label:"Sudah Dibayarkan?",type:'string'},
  {key:"duitku_supir_disburseId",label:"ID Duitku Supir",type:'string'},
  {key:"duitku_supir_inv_res_desc",label:"Ket Inquery Duitku Supir",type:'string'},
  {key:"duitku_supir_trf_res_desc",label:"Ket Pengiriman Duitku Supir",type:'string'},
  {key:"duitku_kernet_disburseId",label:"ID Duitku Kernet",type:'string'},
  {key:"duitku_kernet_inv_res_desc",label:"Ket Inquery Duitku Kernet",type:'string'},
  {key:"duitku_kernet_trf_res_desc",label:"Ket Pengiriman Duitku Kernet",type:'string'},
  {key:"created_at",label:"Created At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"updated_at",label:"Updated At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"deleted_by_username",label:"Deleted By",tbl_show:0},
  {key:"deleted_at",label:"Deleted At",dateformat:"DD-MM-Y HH:mm:ss", tbl_show:0,type:'datetime',filter_on:1},
  {key:"deleted_reason",label:"Deleted Reason", tbl_show:0,type:'string',filter_on:1},
  {key:"req_deleted_by_username",label:"Req Deleted By",tbl_show:0},
  {key:"req_deleted_at",label:"Req Delete At",dateformat:"DD-MM-Y HH:mm:ss", tbl_show:0,type:'datetime',filter_on:1},
  {key:"req_deleted_reason",label:"Req Delete Reason", tbl_show:0,type:'string',filter_on:1},
]);

const enabled_add = computed(()=>{  
  let result = ['pv_not_done','all'].indexOf(filter_status.value) > -1
  && useUtils().checkPermission('trp_trx.create');
  return result;
})

const enabled_view = computed(()=>{ 
  let result = selected.value > -1
  && useUtils().checkPermission('trp_trx.view');
  return result;
})

const enabled_edit = computed(()=>{  
  let result = selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && [undefined,0].indexOf(dt_selected.value.req_deleted) > -1
  && [undefined,0].indexOf(dt_selected.value.val4) > -1
  && [undefined,""].indexOf(dt_selected.value.pvr_id) > -1
  && useUtils().checkPermission('trp_trx.modify');
  return result;
})

const enabled_validasi = computed(()=>{  
  let result = selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && [undefined,0].indexOf(dt_selected.value.req_deleted) > -1
  // && [undefined,0].indexOf(dt_selected.value.val) > -1
  && (
    (
      [undefined,""].indexOf(dt_selected.value.pvr_id) > -1
      && 
      useUtils().checkPermissions(['trp_trx.val','trp_trx.val1','trp_trx.val2'])
    )
    ||
    ( dt_selected.value.val3 == 0 && useUtils().checkPermissions(['trp_trx.val3']) ) ||
    ( dt_selected.value.val4 == 0 && useUtils().checkPermissions(['trp_trx.val4']) ) ||
    ( dt_selected.value.val5 == 0 && useUtils().checkPermissions(['trp_trx.val5']) ) ||
    ( dt_selected.value.val6 == 0 && useUtils().checkPermissions(['trp_trx.val6']) )
  );
  return result;
})

const enabled_unvalidasi = computed(()=>{  
  let result = selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && [undefined,0].indexOf(dt_selected.value.req_deleted) > -1
  // && [undefined,0].indexOf(dt_selected.value.val) > -1
  && (
    ( dt_selected.value.val1 == 1 && useUtils().checkPermissions(['trp_trx.unval1']) ) ||
    ( dt_selected.value.val2 == 1 && useUtils().checkPermissions(['trp_trx.unval2']) ) ||
    ( dt_selected.value.val3 == 1 && useUtils().checkPermissions(['trp_trx.unval3']) ) ||
    ( dt_selected.value.val4 == 1 && useUtils().checkPermissions(['trp_trx.unval4']) ) ||
    ( dt_selected.value.val5 == 1 && useUtils().checkPermissions(['trp_trx.unval5']) ) ||
    ( dt_selected.value.val6 == 1 && useUtils().checkPermissions(['trp_trx.unval6']) )
  );
  return result;
})

const enabled_remove = computed(()=>{  
  let result = selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && [undefined,0].indexOf(dt_selected.value.req_deleted) > -1
  && [undefined,""].indexOf(dt_selected.value.pvr_id) > -1
  && useUtils().checkPermission('trp_trx.remove');
  return result;
})

const enabled_void = computed(()=>{  
  let result = selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && [undefined,0].indexOf(dt_selected.value.req_deleted) > -1
  && dt_selected.value.pvr_id != ''
  && useUtils().checkPermission('trp_trx.request_remove');
  return result;
})

const enabled_print_preview = computed(()=>{ 
  let result = selected.value > -1 
  && dt_selected.value.val == 1
  && useUtils().checkPermission('trp_trx.preview_file');
  return result;
})

const enabled_print_preview_bt = computed(()=>{ 
  let result = selected.value > -1 
  && dt_selected.value.payment_method_id == 2
  && dt_selected.value.received_payment == 1
  && useUtils().checkPermission('trp_trx.preview_file');
  return result;
})
</script>