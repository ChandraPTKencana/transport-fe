<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Transaction'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex justify-between flex-wrap">
        <div class="grow flex">
          <div class="m-1">
            <select class="" v-model="filter_status" >
              <option value="trx_not_done">Undone</option>
              <option value="trx_done">Done</option>
              <option value="deleted">Trash</option>
              <option value="all">All</option>
              <option value="req_deleted">Req Delete</option>
            </select>
          </div>

          <button v-if="enabled_add" type="button" name="button" class="m-1 text-2xl "
            @click="form_add()">
            <IconsPlus />
          </button>
          <button v-if="enabled_edit" type="button" name="button" class="m-1 text-2xl "
            @click="form_edit()">
            <IconsEdit/>
          </button>
          <button v-if="selected > -1" type="button" name="button" class="m-1 text-2xl "
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
          <button v-if="enabled_print_preview" type="button" name="button" class="m-1 text-2xl "
            @click="printPreview()">
            <IconsPrinterEye />
          </button>
        </div>
        <!-- <div  class="flex">

          <button v-if="useUtils().checkPermission('standby_trx.generate_pvr')" type="button" name="button" class="m-1 text-xs whitespace-nowrap"
            @click="generatePVR()">
            Gen/Update PVR
          </button>
          <button v-if="useUtils().checkPermission('standby_trx.get_pv')" type="button" name="button" class="m-1 text-xs whitespace-nowrap"
            @click="updatePV()">
            Update PV
          </button>
          <div v-if="useUtils().checkPermissions(['standby_trx.create','standby_trx.modify'])" class="m-1 card-border cursor-pointer" @click="online_status = !online_status">
            <span class="text-xs">Mode</span> : <span class="font-bold" :class="online_status?'text-green-600' : 'text-red-600'">{{ online_status ? "ONLINE" : "OFFLINE" }} </span>
          </div>
        </div> -->
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
            <option value="created_at">Tgl Dibuat</option>
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
      

      <TableView :thead="fields_thead" :selected="selected" @setSelected="selected = $event" :tbody="standby_trxs" :fnCallData="callData" :scrolling="scrolling" @setScrollingPage="scrolling.page=$event"  @doFilter="searching()">
        <template #[`val`]="{item}">
          <IconsLine v-if="!item.val"/>
          <IconsCheck v-else/>
        </template>
        <template #[`val1`]="{item}">
          <IconsLine v-if="!item.val1"/>
          <IconsCheck v-else/>
        </template>
        <template #[`val2`]="{item}">
          <IconsLine v-if="!item.val2"/>
          <IconsCheck v-else/>
        </template>
        <template #[`detail_dates`]="{item}">
          <div v-for="itdtl in item.details" class="btn p-1 rounded-sm text-white text-xs mr-1 relative" :class="[itdtl.attachment_1_type ? 'bg-green-600' : 'bg-red-500',itdtl.be_paid ? '' : 'unpaid']" >
            <div class="relative z-[1]">
              {{ $moment(itdtl.tanggal).format("DD-MM") }}
            </div>
          </div>
          <!-- {{item.details.map((x)=>$moment(x.tanggal).format("DD-MM-YYYY")).join(" , ")}} -->
        </template>
        <template #[`standby_mst_name`]="{item}">
          {{item.standby_mst_?.name}}
        </template>
        <template #[`standby_mst_type`]="{item}">
          {{item.standby_mst_?.tipe}}
        </template>
        <template #[`salary_paid`]="{item}">
          {{ (item.salary_paid) ? $moment(item.salary_paid?.period_end).format("MM-Y") + '['+item.salary_paid?.period_part+']' : "" }}
        </template>
        <template #[`standby_mst_amount`]="{item}">
          Rp. {{ pointFormat(item.standby_mst_?.amount || 0) }}
        </template>
        <template #[`sb_total`]="{item}">
          Rp. {{ pointFormat(item.standby_mst_?.amount * item.details_count || 0) }}
        </template>
        <template #[`pvr_had_detail`]="{item}">
          <IconsLine v-if="!item.pvr_had_detail"/><IconsCheck v-else/>
        </template>
        <template #[`deleted_by_username`]="{item}">
          {{ item.deleted_by?.username }}
        </template>

        <template #[`req_deleted_by_username`]="{item}">
          {{ item.req_deleted_by?.username }}
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

    <PopupMini :type="'custome'" :show="approve_void_box" :data="approve_void_data" :fnClose="toggleApproveVoidBox" :fnConfirm="confirmedApproveVoid">      
      <template #words>
        Data akan diproses dan <b>tidak dapat dibatalkan lagi</b>, apakah Anda menyetujui permintaan penghapusan data berikut?
      </template>
    </PopupMini>

    <!-- <FormsStandbyTrx :show="forms_standby_trx_show" :fnClose="()=>{forms_standby_trx_show=false}" :fnLoadDBData="fnLoadDBData" :id="forms_standby_trx_id" :p_data="standby_trxs" :list_cost_center="list_cost_center" :online_status="online_status"/> -->
    <FormsStandbyTrx :show="forms_standby_trx_show" :fnClose="()=>{forms_standby_trx_show=false}" :id="forms_standby_trx_id" :p_data="standby_trxs"/>
    <FormsStandbyTrxValidasi :show="forms_standby_trx_valid_show" :fnClose="()=>{forms_standby_trx_valid_show=false}" :id="forms_standby_trx_valid_id" :p_data="standby_trxs" :it_state="forms_standby_trx_valid_state" @setID="forms_standby_trx_valid_id=$event" @setIndex="selected=$event"/>
      <!-- :is_view="forms_standby_trx_is_view" -->
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
      if (!useAuthStore().checkPermission('standby_trx.views')){
        useCommonStore().loading_full = false;
        return navigateTo('/');
      }
    },
    // 'auth',
  ],
});

const checkStatus=(data)=>{
  if(data.deleted==1) return "!bg-red-400";
  if((data.pvr_id > 0 || data.salary_paid_id > 0) && data.req_deleted == 1) return "!bg-yellow-300"; 
  if(data.pv_id > 0 || data.salary_paid_id > 0) return "!bg-blue-300"; 
  return "";
}
const addClassToTbody=(data)=>{
  data.map(e => {    
    e.class_h = checkStatus(e);
  });
  return data;
}


const filter_status = ref("trx_not_done")
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
  let standby_trxs = [];

  const [data1, data2] = await Promise.all([
    useMyFetch("/standby_trxs", {
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
    standby_trxs = addClassToTbody(data1.data.value.data);
  }

  if (data1.status.value === 'error') {
    useErrorStore().trigger(data1.error);
    return { standby_trxs };
  }

  useCommonStore().loading_full = false;
  return { standby_trxs };
});

const standby_trxs = ref(dt_async.value.standby_trxs || []);
// const list_cost_center = ref([]);
// const online_status=ref(false);
// const fnLoadDBData = async () => {
//   useCommonStore().loading_full = true;
//   const { data, error, status } = await useMyFetch("/standby_trx_load_sqlsrv", {
//     method: 'get',
//     headers: {
//       'Authorization': `Bearer ${token.value}`,
//       'Accept': 'application/json'
//     },
//     // params: {"online_status":online_status.value},
//     retry: 0,
//   });
//   useCommonStore().loading_full = false;

//   if (status.value === 'error') {
//     useErrorStore().trigger(error);
//     return;
//   }

//   list_cost_center.value = data.value.list_cost_center;
// }

const sort = ref({
  field: "tanggal",
  by: "desc"
});
const selected = ref(-1);
const dt_selected = computed(()=>{  
  return standby_trxs.value[selected.value];
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
    params.like = `id:%${words}%,transition_target:%${words}%,transition_type:%${words}%,standby_mst_name:%${words}%,standby_mst_type:%${words}%,supir:%${words}%,kernet:%${words}%,no_pol:%${words}%,xto:%${words}%,pvr_no:%${words}%,pv_no:%${words}%,pvr_no:%${words}%,tanggal:%${words}%,transition_target:%${words}%,cost_center_code:%${words}%`;
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
  if (params.page == 1) standby_trxs.value = [];
  if(params.first_row) delete params.first_row;
  if(params.page > 1){
    params.first_row = JSON.stringify(standby_trxs.value[0]);
  }
  params.filter_status = filter_status.value;

  const { data, error, status } = await useMyFetch("/standby_trxs", {
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
    standby_trxs.value = addClassToTbody(data.value.data);
  } else if (scrolling.value.page > 1) {
    standby_trxs.value = [...standby_trxs.value, ...addClassToTbody(data.value.data)];
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

const forms_standby_trx_show =  ref(false);
const forms_standby_trx_id = ref(0);
const forms_standby_trx_valid_state = ref(-1);
const form_add = () => {
  forms_standby_trx_id.value = 0;
  forms_standby_trx_valid_state.value = -1;
  forms_standby_trx_show.value = true;
}

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_standby_trx_id.value = standby_trxs.value[selected.value].id;
    forms_standby_trx_valid_state.value = -1;
    forms_standby_trx_show.value = true;
  }
};

const forms_standby_trx_valid_show =  ref(false);
const forms_standby_trx_valid_id = ref(0);
// const forms_standby_trx_is_view = ref(false);
const validasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_standby_trx_valid_id.value = standby_trxs.value[selected.value].id;
    forms_standby_trx_valid_state.value = 1;
    forms_standby_trx_valid_show.value = true;
    // forms_standby_trx_is_view.value = false;
  }
};

const unvalidasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_standby_trx_valid_id.value = standby_trxs.value[selected.value].id;
    forms_standby_trx_valid_state.value = 0;
    forms_standby_trx_valid_show.value = true;
    // forms_standby_trx_is_view.value = false;
  }
};

const form_view = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_standby_trx_valid_id.value = standby_trxs.value[selected.value].id;
    forms_standby_trx_valid_state.value = -1;
    forms_standby_trx_valid_show.value = true;
    // forms_standby_trx_is_view.value = true;
  }
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
    delete_data.value = {id : standby_trxs.value[selected.value].id, "no pol":standby_trxs.value[selected.value].no_pol, "tujuan":standby_trxs.value[selected.value].xto};
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
  data_in.append("id", standby_trxs.value[selected.value].id);  
  data_in.append("deleted_reason", deleted_reason.value);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/standby_trx", {
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

  let old = {...standby_trxs.value[selected.value]};
  old['deleted'] = data.value.deleted;
  old['deleted_user'] = data.value.deleted_user;
  old['deleted_at'] = data.value.deleted_at;
  old['deleted_by'] = data.value.deleted_by;
  old['deleted_reason'] = data.value.deleted_reason;
  old['class_h'] = checkStatus(old);
  if(filter_status.value!='all'){
    standby_trxs.value.splice(selected.value,1);
  }else{
    standby_trxs.value.splice(selected.value,1,{...old});
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
    req_deleted_data.value = {id : standby_trxs.value[selected.value].id, "no pol":standby_trxs.value[selected.value].no_pol, "tujuan":standby_trxs.value[selected.value].xto};
    req_deleted_box.value = true;
  }
};

const approve_void_data = ref({});
const approve_void_box = ref(false);
const approve_void_reason = ref("");
const toggleApproveVoidBox = async()=>{  
  if (approve_void_box.value) {
    approve_void_box.value = false;
  }
};

const approveVoid = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    approve_void_reason.value = '';
    approve_void_data.value = {
      id : standby_trxs.value[selected.value].id, 
      "no pol":standby_trxs.value[selected.value].no_pol, 
      "tujuan":standby_trxs.value[selected.value].xto,
      "permintaan":standby_trxs.value[selected.value].approve_void_by?.username,
      "alasan":standby_trxs.value[selected.value].approve_void_reason,
    };
    approve_void_box.value = true;
  }
};

const confirmedApproveVoid = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", standby_trxs.value[selected.value].id);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/standby_trx_approve_void", {
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

  let old = {...standby_trxs.value[selected.value]};
  old['deleted'] = data.value.deleted;
  old['deleted_user'] = data.value.deleted_user;
  old['deleted_at'] = data.value.deleted_at;
  old['deleted_by'] = data.value.deleted_by;
  old['deleted_reason'] = data.value.deleted_reason;
  old['class_h'] = checkStatus(old);
  if(filter_status.value!='all'){
    standby_trxs.value.splice(selected.value,1);
  }else{
    standby_trxs.value.splice(selected.value,1,{...old});
  }
  selected.value = -1;
  approve_void_box.value = false;
}

watch(()=>req_deleted_reason.value,(newval)=>{
  if( newval.trim().length > 0 ) enabledOk1.value = true;
  else enabledOk1.value = false;
}, {
  immediate: false
})

const confirmedReqDeleted = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", standby_trxs.value[selected.value].id);  
  data_in.append("req_deleted_reason", req_deleted_reason.value);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/standby_trx_req_delete", {
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
  let old = {...standby_trxs.value[selected.value]};
  old['req_deleted'] = data.value.req_deleted;
  old['req_deleted_user'] = data.value.req_deleted_user;
  old['req_deleted_by'] = data.value.req_deleted_by;
  old['req_deleted_at'] = data.value.req_deleted_at;
  old['req_deleted_reason'] = data.value.req_deleted_reason;
  old['class_h'] = checkStatus(old);
  if(filter_status.value!='all'){
    standby_trxs.value.splice(selected.value,1);
  }else{
    standby_trxs.value.splice(selected.value,1,{...old});
  }
  selected.value = -1;
  req_deleted_box.value = false;
}

const { printHtml } = useDownload();

const printPreview = async()=>{

  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
    return;
  } 
  
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/standby_trx_preview_file", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id : standby_trxs.value[selected.value].id},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  printHtml(data.value.html,318);
}


// const generatePVR = async() => {
//   useCommonStore().loading_full = true;

//   const data_in = new FormData();
//   // data_in.append("id", standby_trxs.value[selected.value].id);  
//   data_in.append("online_status", online_status.value);  

//   const { data, error, status } = await useMyFetch("/standby_trx_do_gen_pvr", {
//     method: "post",
//     headers: {
//       'Authorization': `Bearer ${token.value}`,
//       'Accept': 'application/json',
//     },
//     body: data_in,
//     retry: 0,
//   });
//   useCommonStore().loading_full = false;
//   if (status.value === 'error') {
//     useErrorStore().trigger(error);
//     return;
//   }

//   data.value.forEach(e => {
//     let idx = standby_trxs.value.map((x)=>x.id).indexOf(e.id);
//     if(idx !== -1) {
//       let dt = standby_trxs.value[idx];
//       dt.pvr_id = e.pvr_id;
//       dt.pvr_no = e.pvr_no;
//       dt.pvr_total = e.pvr_total;
//       dt.pvr_had_detail = e.pvr_had_detail;
//       dt.updated_at = e.updated_at;
      
//       standby_trxs.value.splice(idx,1,{...dt});
//     }
    
//   });

//   display({ show: true, status: "Success", message: "Generate Or Update PVR Done" });
// }

// const updatePV = async() => {
//   useCommonStore().loading_full = true;

//   const data_in = new FormData();
//   data_in.append("online_status", online_status.value);  

//   const { data, error, status } = await useMyFetch("/standby_trx_do_update_pv", {
//     method: "post",
//     headers: {
//       'Authorization': `Bearer ${token.value}`,
//       'Accept': 'application/json',
//     },
//     body: data_in,
//     retry: 0,
//   });
//   useCommonStore().loading_full = false;
//   if (status.value === 'error') {
//     useErrorStore().trigger(error);
//     return;
//   }

//   data.value.data.forEach(e => {
//     let idx = standby_trxs.value.map((x)=>x.id).indexOf(e.id);
//     if(idx !== -1) {
//       let dt = standby_trxs.value[idx];
//       dt.pv_id = e.pv_id;
//       dt.pv_no = e.pv_no;
//       dt.pv_total = e.pv_total;
//       dt.pv_datetime = e.pv_datetime;
//       dt.updated_at = e.updated_at;
      
//       standby_trxs.value.splice(idx,1,{...dt});
//     }
    
//   });

//   display({ show: true, status: "Success", message: "Update PV Done" });
// }

const fields_thead=ref([
  {key:"no",label:"No",isai:true},
  {key:"val",label:"App 1",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  {key:"val1",label:"App 2",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  {key:"val2",label:"App 3",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  {key:"id",label:"ID",filter_on:1,type:"number"},
  {key:"no_pol",label:"No Pol",freeze:1,filter_on:1,type:'string'},
  {key:"detail_dates",label:"Detail Dates",type:'string'},
  {key:"salary_paid",label:"Salary Paid",type:'string'},
  {key:"standby_trx_dtl_tanggal",label:"Detail Date",type:'date',dateformat:"DD-MM-Y",filter_on:1, tbl_show:0,sort_off:1},
  {key:"supir",label:"Supir",filter_on:1,type:'string'},
  {key:"supir_rek_no",label:"No Rek Supir",filter_on:1,type:'string'},
  {key:"supir_rek_name",label:"Nama Rek Supir",filter_on:1,type:'string'},
  {key:"kernet",label:"Kernet",filter_on:1,type:'string'},
  {key:"kernet_rek_no",label:"No Rek Kernet",filter_on:1,type:'string'},
  {key:"kernet_rek_name",label:"Nama Rek Kernet",filter_on:1,type:'string'},
  {key:"xto",label:"Tujuan",filter_on:1,type:'string'},
  {key:"standby_mst_name",label:"Nama Standby",filter_on:1,type:'string'},
  {key:"standby_mst_type",label:"Tipe Standby",filter_on:1,type:'string'},
  {key:"standby_mst_amount",label:"Nilai SB",class:" justify-end",type:'number'},
  {key:"details_count",label:"Jlh SB",class:" justify-end",type:'number'},
  {key:"sb_total",label:"Total SB",class:" justify-end",type:'number'},
  {key:"note_for_remarks",label:"Note untuk Remarks"},
  {key:"trx_trp_id",label:"Trx Trp"},
  {key:"transition_target",label:"Pengalihan",filter_on:1,type:"select",select_item:useCommonStore().list_pabrik},
  {key:"transition_type",label:"Tipe Pengalihan",type:"select",select_item:[{k:'From',v:'Dari'},{k:'To',v:'Ke'}]},
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
  ]},
  {key:"created_at",label:"Created At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"updated_at",label:"Updated At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"deleted_by_username",label:"Deleted By",tbl_show:0},
  {key:"deleted_at",label:"Deleted At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1, tbl_show:0},
  {key:"deleted_reason",label:"Deleted Reason", tbl_show:0,type:'string',filter_on:1},
  {key:"req_deleted_by_username",label:"Req Deleted By",tbl_show:0},
  {key:"req_deleted_at",label:"Req Delete At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1, tbl_show:0},
  {key:"req_deleted_reason",label:"Req Delete Reason", tbl_show:0,type:'string',filter_on:1},
]);


const enabled_add = computed(()=>{  
  let result = ['trx_not_done','all'].indexOf(filter_status.value) > -1  
  && useUtils().checkPermission('standby_trx.create');
  return result;
})

const enabled_edit = computed(()=>{  
  let result = selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && [undefined,0].indexOf(dt_selected.value.req_deleted) > -1
  && [undefined,0].indexOf(dt_selected.value.val) > -1
  && [undefined,""].indexOf(dt_selected.value.pvr_id) > -1
  && useUtils().checkPermission('standby_trx.modify');
  return result;
})

const enabled_validasi = computed(()=>{  
  let result = selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && [undefined,0].indexOf(dt_selected.value.req_deleted) > -1
  && (
    (
      [undefined,""].indexOf(dt_selected.value.pvr_id) > -1 && 
      (
        useUtils().checkPermission('standby_trx.val') && [undefined,0].indexOf(dt_selected.value.val) > -1 || 
        useUtils().checkPermission('standby_trx.val1') && [undefined,0].indexOf(dt_selected.value.val1) > -1
      )
    )|| 
    (
      dt_selected.value.pvr_id > -1 &&  useUtils().checkPermission('standby_trx.val2') && [undefined,0].indexOf(dt_selected.value.val2) > -1
    )
  );
  return result;
})

const enabled_unvalidasi = computed(()=>{  
  let result = selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && [undefined,0].indexOf(dt_selected.value.req_deleted) > -1
  && (
    (
      [undefined,"",null].indexOf(dt_selected.value.salary_paid_id) > -1 && 
      (
        useUtils().checkPermission('standby_trx.unval') && [1].indexOf(dt_selected.value.val) > -1 || 
        useUtils().checkPermission('standby_trx.unval1') && [1].indexOf(dt_selected.value.val1) > -1 || 
        useUtils().checkPermission('standby_trx.unval2') && [1].indexOf(dt_selected.value.val2) > -1
      )
    )
  );
  return result;
})

const enabled_remove = computed(()=>{  
  let result = useUtils().checkPermission('standby_trx.remove') 
  && selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && [undefined,0].indexOf(dt_selected.value.req_deleted) > -1
  && [undefined,""].indexOf(dt_selected.value.pvr_id) > -1;
  return result;
})

const enabled_void = computed(()=>{  
  let result = useUtils().checkPermission('standby_trx.request_remove') 
  && selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && [undefined,0].indexOf(dt_selected.value.req_deleted) > -1
  && dt_selected.value.pvr_id != '';
  return result;
})

const enabled_approve_void = computed(()=>{  
  let result = useUtils().checkPermission('standby_trx.approve_request_remove')
  && selected.value > -1 
  && dt_selected.value.deleted == 0
  && dt_selected.value.req_deleted == 1
  && dt_selected.value.val2 == 0;
  return result;
})

const enabled_print_preview = computed(()=>{
  let result = useUtils().checkPermission('standby_trx.preview_file') 
  && selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && [undefined,0].indexOf(dt_selected.value.req_deleted) > -1
  && dt_selected.value.val == 1;
  return result;
})

</script>

<style scoped>
  .unpaid::before{
    content: "";
    position: absolute;
    width: 109%;
    height: 2px;
    background-color: black;
    top:50%;
    left:-1.5px;
    rotate: 30deg;
    opacity: 100%;
    z-index: 0;
  }

  .unpaid::after{
    content: "";
    position: absolute;
    width: 109%;
    height: 2px;
    background-color: black;
    top:50%;
    left:-1.5px;
    rotate: -30deg;
    opacity: 100%;
    z-index: 0;
  }
</style>