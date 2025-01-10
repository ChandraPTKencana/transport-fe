<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Ujalan'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex justify-between flex-wrap">
        <div class="grow flex">
          <div class="m-1">
            <select class="" v-model="filter_status" >
              <option value="available">Available</option>
              <option value="unapprove">Unapprove</option>
              <option value="deleted">Trash</option>
              <option value="all">All</option>
            </select>
          </div>
          <button v-if="enabled_copy" type="button" name="button" class="m-1 text-2xl "
            @click="form_copy()">
            <IconsCopy />
          </button>
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
          <button v-if="enabled_validasi" type="button" name="button" class="m-1 text-2xl "
            @click="validasi()">
            <IconsSignature />
          </button>
          <button v-if="enabled_unvalidasi" type="button" name="button" class="m-1 text-2xl "
            @click="unvalidasi()">
            <IconsSignatureOff />
          </button>
          <!-- <button v-if="enabled_print_preview" type="button" name="button" class="m-1 text-2xl "
            @click="printPreview()">
            <IconsPrinterEye />
          </button> -->
        </div>
      </div>

      <TableView :thead="fields_thead" :selected="selected" @setSelected="selected = $event" :tbody="ujalans" :fnCallData="callData" :scrolling="scrolling" @setScrollingPage="scrolling.page=$event"  @doFilter="searching()" :rowBgColor="rowBgColor">
        <template #[`val`]="{item}">
          <IconsLine v-if="!item.val"/>
          <IconsCheck v-else/>
        </template>
        <template #[`val1`]="{item}">
          <IconsLine v-if="!item.val1"/>
          <IconsCheck v-else/>
        </template>
        <!-- <template #[`harga`]="{item}">
          Rp. {{ pointFormat((parseFloat(item.total)) || 0) }}
        </template> -->
        <template #[`deleted_by_username`]="{item}">
          {{ item.deleted_by?.username }}
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

    <FormsUjalan :show="forms_ujalan_show" :fnClose="()=>{forms_ujalan_show=false}" :id="forms_ujalan_id" :p_data="ujalans" :is_copy="forms_ujalan_copy"/>
    <FormsUjalanValidasi :show="forms_ujalan_valid_show" :fnClose="()=>{forms_ujalan_valid_show=false}" :id="forms_ujalan_valid_id" :p_data="ujalans" 
      :it_state="forms_ujalan_valid_state"/>
      <!-- :is_view="forms_ujalan_is_view"  -->

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
      if (!useAuthStore().checkPermission('ujalan.views')){
        useCommonStore().loading_full = false;
        return navigateTo('/');
      }
    },
    // 'auth',
  ],
});

const rowBgColor=(data)=>{
  if(data.deleted==1) return "!bg-red-400";
  // if(data.pvr_id > 0 && data.req_deleted == 1) return "!bg-yellow-300"; 
  // if(data.pv_id > 0) return "!bg-blue-300"; 
  if(data.val == 0 || data.val1 == 0) return "!bg-gray-300"; 
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
params.sort ="tanggal:desc";

const field_errors = ref({})

// const date = ref({
//   from: "",
//   to: "",
// });

const token = useCookie('token');

const { data: dt_async } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  let ujalans = [];

  const [data1, data2] = await Promise.all([
    useMyFetch("/ujalan", {
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
    ujalans = data1.data.value.data;
  }

  if (data1.status.value === 'error') {
    useErrorStore().trigger(data1.error);
    return { ujalans };
  }

  useCommonStore().loading_full = false;
  return { ujalans };
});

const ujalans = ref(dt_async.value.ujalans || []);

const sort = ref({
  field: "tanggal",
  by: "desc"
});
const selected = ref(-1);
const dt_selected = computed(()=>{  
  return ujalans.value[selected.value];
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
    params.like = `id:%${words}%,xto:%${words}%,tipe:%${words}%,jenis:%${words}%,harga:%${words}%`;
  }
  params.sort = "";
  if (sort.value.field) {
    params.sort = sort.value.field + ":" + sort.value.by;
  }

  // params.date_from = date.value.from ? $moment(date.value.from).format("YYYY-MM-DD") : "";
  // params.date_to = date.value.to ? $moment(date.value.to).format("YYYY-MM-DD") : "";
  params.filter_model = JSON.stringify(useCommonStore()._tv.filter_model);
};

const callData = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  scrolling.value.may_get_data = false;
  params.page = scrolling.value.page;
  if (params.page == 1) ujalans.value = [];
  if(params.first_row) delete params.first_row;
  if(params.page > 1){
    params.first_row = JSON.stringify(ujalans.value[0]);
  }
  params.filter_status = filter_status.value;

  const { data, error, status } = await useMyFetch("/ujalan", {
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
    ujalans.value = data.value.data;
  } else if (scrolling.value.page > 1) {
    ujalans.value = [...ujalans.value, ...data.value.data];
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

const forms_ujalan_show =  ref(false);
const forms_ujalan_id = ref(0);
const forms_ujalan_copy = ref(0);
// const forms_ujalan_is_view = ref(false);
const forms_ujalan_valid_state = ref(-1);

const form_add = () => {
  forms_ujalan_id.value = 0;
  // forms_ujalan_is_view.value = false;
  forms_ujalan_valid_state.value = -1;
  forms_ujalan_copy.value = false;
  forms_ujalan_show.value = true;
}

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_ujalan_id.value = ujalans.value[selected.value].id;
    // forms_ujalan_is_view.value = false;
    forms_ujalan_valid_state.value = -1;
    forms_ujalan_copy.value = false;
    forms_ujalan_show.value = true;
  }
};

const form_copy = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_ujalan_id.value = ujalans.value[selected.value].id;
    // forms_ujalan_is_view.value = false;
    forms_ujalan_valid_state.value = -1;
    forms_ujalan_copy.value = true;
    forms_ujalan_show.value = true;
  }
};

const forms_ujalan_valid_show =  ref(false);
const forms_ujalan_valid_id = ref(0);
const validasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_ujalan_valid_id.value = ujalans.value[selected.value].id;
    // forms_ujalan_is_view.value = false;
    forms_ujalan_valid_state.value = 1;
    forms_ujalan_copy.value = false;
    forms_ujalan_valid_show.value = true;
  }
};

const unvalidasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_ujalan_valid_id.value = ujalans.value[selected.value].id;
    // forms_ujalan_is_view.value = false;
    forms_ujalan_valid_state.value = 0;
    forms_ujalan_copy.value = false;
    forms_ujalan_valid_show.value = true;
  }
};

const form_view = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_ujalan_valid_id.value = ujalans.value[selected.value].id;
    // forms_ujalan_is_view.value = true;
    forms_ujalan_copy.value = false;
    forms_ujalan_valid_state.value = -1;
    forms_ujalan_valid_show.value = true;
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
    delete_data.value = {id : ujalans.value[selected.value].id, "tujuan":ujalans.value[selected.value].xto};
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
  data_in.append("id", ujalans.value[selected.value].id);  
  data_in.append("deleted_reason", deleted_reason.value);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/ujalan", {
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

  let old = {...ujalans.value[selected.value]};
  old['deleted'] = data.value.deleted;
  old['deleted_user'] = data.value.deleted_user;
  old['deleted_at'] = data.value.deleted_at;
  old['deleted_by'] = data.value.deleted_by;
  old['deleted_reason'] = data.value.deleted_reason;

  if(filter_status.value!='all'){
    ujalans.value.splice(selected.value,1);
  }else{
    ujalans.value.splice(selected.value,1,{...old});
  }

  selected.value = -1;
  delete_box.value = false;
}

const { printHtml } = useDownload();

// const printPreview = async()=>{

//   if (selected.value == -1) {
//     display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
//     return;
//   } 
  
//   useCommonStore().loading_full = true;
//   const { data, error, status } = await useMyFetch("/ujalan_preview_file", {
//     method: 'get',
//     headers: {
//       'Authorization': `Bearer ${token.value}`,
//       'Accept': 'application/json'
//     },
//     params: {id : ujalans.value[selected.value].id},
//     retry: 0,
//   });
//   useCommonStore().loading_full = false;

//   if (status.value === 'error') {
//     useErrorStore().trigger(error);
//     return;
//   }

//   printHtml(data.value.html,318);
// }

const fields_thead=ref([
  {key:"no",label:"No",isai:true},
  {key:"val",label:"App 1",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  {key:"val1",label:"App 2",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  {key:"id",label:"ID",filter_on:1,type:"number"},
  {key:"xto",label:"Tujuan",freeze:1,filter_on:1,type:'string'},
  {key:"asst_opt",label:"Info",filter_on:1,type:'string'},
  {key:"tipe",label:"Tipe",filter_on:1,type:'string'},
  {key:"jenis",label:"Jenis",filter_on:1,type:"select",select_item:['TBS','TBSK','CPO','PK','LAIN']},
  {key:"harga",label:"Harga",class:" justify-end",type:'number'},
  {key:"note_for_remarks",label:"Ket.U.Remarks",filter_on:1,type:'string'},
  {key:"transition_from",label:"Pengalihan",filter_on:1,type:"select",select_item:useCommonStore().list_pabrik},
  {key:"created_at",label:"Created At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"updated_at",label:"Updated At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"deleted_by_username",label:"Deleted By",tbl_show:1},
  {key:"deleted_at",label:"Deleted At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1, tbl_show:1},
  {key:"deleted_reason",label:"Deleted Reason", tbl_show:1,type:'string',filter_on:1},
]);

const enabled_copy = computed(()=>{  
  let result = selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && useUtils().checkPermission('ujalan.create');
  return result;
})

const enabled_add = computed(()=>{  
  let result = ['available','all','unapprove'].indexOf(filter_status.value) > -1  
  && useUtils().checkPermission('ujalan.create');
  return result;
})

const enabled_edit = computed(()=>{  
  let result = selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  &&  (
        useUtils().checkPermission('ujalan.val') && [undefined,0].indexOf(dt_selected.value.val) > -1 || 
        useUtils().checkPermission('ujalan.val1') && [undefined,0].indexOf(dt_selected.value.val1) > -1
      )
  && useUtils().checkPermissions(['ujalan.modify','ujalan.detail.modify','ujalan.detail2.modify']);
  return result;
})

const enabled_validasi = computed(()=>{  
  let result = selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && (
    useUtils().checkPermission('ujalan.val') && [undefined,0].indexOf(dt_selected.value.val) > -1 || 
    useUtils().checkPermission('ujalan.val1') && [undefined,0].indexOf(dt_selected.value.val1) > -1
  );
  return result;
})


const enabled_unvalidasi = computed(()=>{  
  let result = selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && (
    useUtils().checkPermission('ujalan.unval') && [1].indexOf(dt_selected.value.val) > -1 || 
    useUtils().checkPermission('ujalan.unval1') && [1].indexOf(dt_selected.value.val1) > -1
  );
  return result;
})

const enabled_remove = computed(()=>{  
  let result = selected.value > -1
  && useUtils().checkPermission('ujalan.remove') 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1;
  return result;
})

// const enabled_print_preview = computed(()=>{
//   let result = useUtils().checkPermission('ujalan.preview_file') 
//   && selected.value > -1 
//   && [undefined,0].indexOf(dt_selected.value.deleted) > -1
//   && dt_selected.value.val == 1;
//   return result;
// })

</script>