<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Transaction'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex justify-between flex-wrap">
        <div class="grow flex">
          <div class="m-1">
            <select class="" v-model="filter_status" >
              <option value="Undone">Undone</option>
              <option value="Done">Done</option>
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
          <button v-if="enabled_validasi" type="button" name="button" class="m-1 text-2xl "
            @click="validasi()">
            <IconsSignature />
          </button>
          <button type="button" name="button" class="m-1 text-2xl flex items-center "
            @click="downloadExcel()">
            <IconsTable2Column />  <span class="text-xs ml-1"> Download </span>
          </button>
        </div>
        <div class="flex">
          <button v-if="checkbox_arr.length > 0" type="button" name="button" class="m-1 text-xs whitespace-nowrap"
            @click="multiUnVal()">
            Multi UnVal
          </button>
        </div>
      </div>


      <TableView :thead="fields_thead" :selected="selected" @setSelected="selected = $event" :tbody="trx_trps" :fnCallData="callData" :scrolling="scrolling" @setScrollingPage="scrolling.page=$event" @doFilter="searching()"  @setCheckbox="checkbox_arr=$event" :deep_state="deep_state">
        <template #[`ritase_val`]="{item}">
          <IconsLine v-if="!item.ritase_val"/>
          <IconsCheck v-else/>
        </template>
        <template #[`ritase_val1`]="{item}">
          <IconsLine v-if="!item.ritase_val1"/>
          <IconsCheck v-else/>
        </template>
        <template #[`ritase_val2`]="{item}">
          <IconsLine v-if="!item.ritase_val2"/>
          <IconsCheck v-else/>
        </template>
        <template #[`uj_asst_opt`]="{item}">
          {{ item.uj?.asst_opt }}
        </template>
        <template #[`ritase_leave_at`]="{item}">
          {{ item.ritase_leave_at ? $moment(item.ritase_leave_at).format("DD-MM-YYYY HH:mm:ss") :'' }}
        </template>

        <template #[`rla`]="{item}">
          <div class="bg-red-700 rounded-sm" v-if="!item.ritase_leave_at">
            <IconsTimes  class="text-white text-xl font-bold"/>
          </div>
          <div class="bg-green-500 rounded-sm" v-else>
            <IconsCheck class="text-white text-xl font-bold"/>
          </div>
        </template>
        <template #[`ritase_arrive_at`]="{item}">
          {{ item.ritase_arrive_at ? $moment(item.ritase_arrive_at).format("DD-MM-YYYY HH:mm:ss") :'' }}
        </template>

        <template #[`raa`]="{item}">
          <div class="bg-red-700 rounded-sm" v-if="!item.ritase_arrive_at">
            <IconsTimes  class="text-white text-xl font-bold"/>
          </div>
          <div class="bg-green-500 rounded-sm" v-else>
            <IconsCheck class="text-white text-xl font-bold"/>
          </div>
        </template>

        <template #[`ritase_return_at`]="{item}">
          {{ item.ritase_return_at ? $moment(item.ritase_return_at).format("DD-MM-YYYY HH:mm:ss") :'' }}
        </template>
        <template #[`rra`]="{item}">
          <div class="bg-red-700 rounded-sm" v-if="!item.ritase_return_at">
            <IconsTimes  class="text-white text-xl font-bold"/>
          </div>
          <div class="bg-green-500 rounded-sm" v-else>
            <IconsCheck class="text-white text-xl font-bold"/>
          </div>
        </template>

        <template #[`ritase_till_at`]="{item}">
          {{ item.ritase_till_at ? $moment(item.ritase_till_at).format("DD-MM-YYYY HH:mm:ss") :'' }}
        </template>
        <template #[`rta`]="{item}">
          <div class="bg-red-700 rounded-sm" v-if="!item.ritase_till_at">
            <IconsTimes  class="text-white text-xl font-bold"/>
          </div>
          <div class="bg-green-500 rounded-sm" v-else>
            <IconsCheck class="text-white text-xl font-bold"/>
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

    <LazyFormsTrxTrpAbsen :show="forms_trx_trp_show" :fnClose="()=>{forms_trx_trp_show=false}" :id="forms_trx_trp_id" :p_data="trx_trps" />
    <LazyFormsTrxTrpAbsenValidasi :show="forms_trx_trp_valid_show" :fnClose="()=>{forms_trx_trp_valid_show=false}" :id="forms_trx_trp_valid_id" :p_data="trx_trps" :is_view="forms_trx_trp_is_view" @setID="forms_trx_trp_valid_id=$event" @setIndex="selected=$event"/>
    <LazyFormsTrxAbsen :show="forms_trx_absen_show" :fnClose="()=>{forms_trx_absen_show=false}" :index="forms_trx_absen_index" :p_data="trx_trps"/>
  </div>
</template>

<script setup>
const { $moment } = useNuxtApp()

import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';

definePageMeta({
  // layout: "clear",
  ssr: false,
  middleware: [
    function (to, from) {
      if (!useAuthStore().checkPermission('trp_trx.absen.views')){
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
  if(data.ritase_val2 == 1) return "!bg-blue-300"; 
  // if(data.ritase_leave_at != "" && data.ritase_arrive_at != "" && data.ritase_return_at != "" && data.ritase_till_at != "") return "!bg-blue-300"; 
  return "";
}
const addClassToTbody=(data)=>{
  data.map(e => {    
    e.class_h = checkStatus(e);
  });
  return data;
}

let deep_state = ref({
  clearCheckBox:false
});

const filter_status = ref("Undone")
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
    useMyFetch("/trx_trp/absens", {
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
},
  {
    lazy: true,        // 🔥 INI KUNCINYA
    server: false,     // 🔥 penting untuk dashboard / auth page
    default: () => ({ trx_trps: [] }),
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
const list_cost_center = ref([]);
const online_status=ref(false);

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

  const { data, error, status } = await useMyFetch("/trx_trp/absens", {
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

const forms_trx_trp_show =  ref(false);
const forms_trx_trp_id = ref(0);

const { display } = useAlertStore();

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_show.value = true;
  }
};

const forms_trx_trp_valid_show =  ref(false);
const forms_trx_trp_valid_id = ref(0);
const forms_trx_trp_is_view = ref(false);
const validasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_valid_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_valid_show.value = true;
    forms_trx_trp_is_view.value = false;
  }
};

const form_view = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_valid_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_valid_show.value = true;
    forms_trx_trp_is_view.value = true;
  }
};

const forms_trx_absen_show =  ref(false);
const forms_trx_absen_index = ref(0);
const form_absen = (index) => {
  forms_trx_absen_index.value = index;
  forms_trx_absen_show.value = true;
};

const checkbox_arr = ref([]);

const multiUnVal = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("ids", JSON.stringify(checkbox_arr.value));  
  data_in.append("_method", "PUT");

  const { data, error, status } = await useMyFetch("/trx_trp/absen/clear_valval1", {
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

  data.value.val_lists.forEach(e => {
    let idx = trx_trps.value.map((x)=>x.id).indexOf(e.id);
    if(idx>-1){
      let sd          = trx_trps.value[idx];
      sd.ritase_val   = e.ritase_val;
      sd.ritase_val1  = e.ritase_val1;
      sd.ritase_val2  = e.ritase_val2;
      sd.updated_at   = e.updated_at;
      trx_trps.value.splice(idx,1,{...sd});
    }
  });
  deep_state.value.clearCheckBox = true;
}

const fields_thead=ref([
  {key:"cb",label:"",checkbox:'id'},
  {key:"no",label:"No",isai:true},
  {key:"ritase_val",label:"Kasir",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  {key:"ritase_val1",label:"Mandor",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  {key:"ritase_val2",label:"Staff Logistik",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  {key:"id",label:"ID",filter_on:1,type:"number"},
  {key:"tanggal",label:"U.Jalan Per",type:'date',dateformat:"DD-MM-Y",filter_on:1,sort:{priority:1,type:"desc"}},
  {key:"no_pol",label:"No Pol",freeze:1,filter_on:1,type:'string'},
  {key:"rla",label:"B"},
  {key:"raa",label:"T"},
  {key:"rra",label:"K"},
  {key:"rta",label:"S"},
  {key:"ritase_leave_at",label:"Berangkat"},
  {key:"ritase_arrive_at",label:"Tiba"},
  {key:"ritase_return_at",label:"Kembali"},
  {key:"ritase_till_at",label:"Sampai"},
  {key:"ritase_note",label:"Note"},
  {key:"xto",label:"Tujuan",filter_on:1,type:'string'},
  {key:"uj_asst_opt",label:"Info",filter_on:1,type:'select',select_item:['DENGAN KERNET','TANPA KERNET']},
  {key:"tipe",label:"Tipe",filter_on:1,type:'string'},
  {key:"jenis",label:"Jenis",filter_on:1,type:"select",select_item:['TBS','TBSK','CPO','PK','LAIN','TUNGGU']},
  {key:"supir",label:"Supir",filter_on:1,type:'string'},
  {key:"kernet",label:"Kernet",filter_on:1,type:'string'},
  {key:"created_at",label:"Created At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"updated_at",label:"Updated At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"deleted_by_username",label:"Deleted By",tbl_show:0},
  {key:"deleted_at",label:"Deleted At",dateformat:"DD-MM-Y HH:mm:ss", tbl_show:0,type:'datetime',filter_on:1},
  {key:"deleted_reason",label:"Deleted Reason", tbl_show:0,type:'string',filter_on:1},
  {key:"req_deleted_by_username",label:"Req Deleted By",tbl_show:0},
  {key:"req_deleted_at",label:"Req Delete At",dateformat:"DD-MM-Y HH:mm:ss", tbl_show:0,type:'datetime',filter_on:1},
  {key:"req_deleted_reason",label:"Req Delete Reason", tbl_show:0,type:'string',filter_on:1},
]);


const enabled_view = computed(()=>{ 
  let result = selected.value > -1
  && useUtils().checkPermission('trp_trx.absen.view');
  return result;
})


const enabled_edit = computed(()=>{  
  let result = selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && [undefined,0].indexOf(dt_selected.value.req_deleted) > -1
  && [undefined,0].indexOf(dt_selected.value.ritase_val) > -1
  && useUtils().checkPermission('trp_trx.absen.modify');
  return result;
})

const enabled_validasi = computed(()=>{  
  let result = selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && [undefined,0].indexOf(dt_selected.value.req_deleted) > -1
  // && (
  //   [undefined,0].indexOf(dt_selected.value.ritase_val) > -1 && 
  //   [undefined,0].indexOf(dt_selected.value.ritase_val1) > -1
  // )
  && useUtils().checkPermissions(['trp_trx.absen.val','trp_trx.absen.val1','trp_trx.absen.val2']);
  return result;
})

const { downloadFile, viewFile } = useDownload();

const downloadExcel = async()=>{  
  inject_params();
  useCommonStore().loading_full = true;
  params.filter_status = filter_status.value;
  const { data, error, status } = await useMyFetch("/trx_trp/absen/download_excel", {
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