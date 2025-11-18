<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Vehicle'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex justify-between flex-wrap">
        <div class="grow flex">
          <div class="m-1">
            <select class="" v-model="filter_status" >
              <option value="available">Available</option>
              <!-- <option value="unapprove">Unapprove</option> -->
              <option value="deleted">Trash</option>
              <option value="all">All</option>
            </select>
          </div>
          <!-- <button v-if="enabled_copy" type="button" name="button" class="m-1 text-2xl "
            @click="form_copy()">
            <IconsCopy />
          </button> -->
          <button v-if="enabled_add" type="button" name="button" class="m-1 text-2xl "
            @click="form_add()">
            <IconsPlus />
          </button>
          <button v-if="enabled_edit" type="button" name="button" class="m-1 text-2xl "
            @click="form_edit()">
            <IconsEdit/>
          </button>
          <button  v-if="enabled_remove" type="button" name="button" class="m-1 text-2xl "
            @click="remove()">
            <IconsDelete />
          </button>
          <!-- <button v-if="selected > -1" type="button" name="button" class="m-1 text-2xl "
            @click="form_view()">
            <IconsEyes/>
          </button>
          
          <button v-if="enabled_validasi" type="button" name="button" class="m-1 text-2xl "
            @click="validasi()">
            <IconsSignature />
          </button> -->
          <!-- <button v-if="enabled_print_preview" type="button" name="button" class="m-1 text-2xl "
            @click="printPreview()">
            <IconsPrinterEye />
          </button> -->
        </div>
      </div>
      <TableView :thead="fields_thead" :selected="selected" @setSelected="selected = $event" :tbody="vehicles" :fnCallData="callData" :scrolling="scrolling" @setScrollingPage="scrolling.page=$event"  @doFilter="searching()" :rowBgColor="rowBgColor">
        <template #[`val`]="{item}">
          <IconsLine v-if="!item.val"/>
          <IconsCheck v-else/>
        </template>
        <template #[`val1`]="{item}">
          <IconsLine v-if="!item.val1"/>
          <IconsCheck v-else/>
        </template>

        <template #[`bank_code`]="{item}">
          {{ item.bank?.code }}
        </template>
        <template #[`attachment_1_type`]="{item}">
          <TypeIcon :value="item.attachment_1_type"/>
        </template>
        <!-- <template #[`harga`]="{item}">
          Rp. {{ pointFormat((parseFloat(item.total)) || 0) }}
        </template> -->
        <template #[`deleted_by_username`]="{item}">
          {{ item.deleted_by?.username }}
        </template>
      </TableView>
    </div>
  </div>
  <LazyPopupMini :type="'delete'" :show="delete_box" :data="delete_data" :fnClose="toggleDeleteBox" :fnConfirm="confirmed_delete" :enabledOk="enabledOk">
    <template #footer>
      Masukkan Alasan Penghapusan:
      <div class="grow mb-5" >
        <textarea  v-model="deleted_reason"></textarea>
      </div>
    </template>
  </LazyPopupMini>
  <LazyFormsVehicle :show="forms_vehicle_show" :fnClose="()=>{forms_vehicle_show=false}" :id="forms_vehicle_id" :p_data="vehicles"/>

</template>

<script setup>
const { $moment } = useNuxtApp()
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';

definePageMeta({
  // layout: "clear",
  ssr: false,
  middleware: [
    function (to, from) {
      if (!useAuthStore().checkPermission('vehicle.views')){
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
  if(data.val == 0) return "!bg-gray-300"; 
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


const token = useDynamicPathCookie('token');
const { data: vehicles } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/vehicles", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {filter_status},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return [];
  }

  return data.value.data;
});


const search = ref("");
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
  return vehicles.value[selected.value];
})

const inject_params = () => {
  params.like = "";
  let words = JSON.parse(JSON.stringify(useCommonStore()._tv.global_keyword));
  if (words != "") {
    params.like = `id:%${words}%,no_pol:%${words}%`;
  }
  params.sort = "";
  if (sort.value.field) {
    params.sort = sort.value.field + ":" + sort.value.by;
  }
  params.filter_model = JSON.stringify(useCommonStore()._tv.filter_model);

};

const callData = async () => {
  useCommonStore().loading_full = true;
  scrolling.value.may_get_data = false;
  params.page = scrolling.value.page;
  if (params.page == 1) vehicles.value = [];
  params.filter_status = filter_status.value;

  const { data, error, status } = await useMyFetch("/vehicles", {
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
    vehicles.value = data.value.data;
    // if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    vehicles.value = [...vehicles.value, ...data.value.data];
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

const forms_vehicle_show =  ref(false);
const forms_vehicle_id = ref(0);
const forms_vehicle_is_view = ref(false);

const form_add = () => {
  forms_vehicle_id.value = 0;
  forms_vehicle_is_view.value = false;
  forms_vehicle_show.value = true;
}

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_vehicle_id.value = vehicles.value[selected.value].id;
    forms_vehicle_is_view.value = false;
    forms_vehicle_show.value = true;
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
    delete_data.value = {id : vehicles.value[selected.value].id};
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
  data_in.append("id", vehicles.value[selected.value].id);
  data_in.append("deleted_reason", deleted_reason.value);
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/vehicle", {
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

  let old = {...vehicles.value[selected.value]};
  old['deleted'] = data.value.deleted;
  old['deleted_user'] = data.value.deleted_user;
  old['deleted_at'] = data.value.deleted_at;
  old['deleted_by'] = data.value.deleted_by;
  old['deleted_reason'] = data.value.deleted_reason;
  
  if(filter_status.value!='all'){
    vehicles.value.splice(selected.value,1);
  }else{
    vehicles.value.splice(selected.value,1,{...old});
  }
  selected.value = -1;
  delete_box.value = false;
}


const fields_thead=ref([
  {key:"no",label:"No",isai:true},
  {key:"id",label:"ID",filter_on:1,type:"number"},
  {key:"no_pol",label:"No Pol",filter_on:1,type:'string',sort:{priority:1,type:"asc"}},
  {key:"created_at",label:"Created At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"updated_at",label:"Updated At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"deleted_by_username",label:"Deleted By",tbl_show:1},
  {key:"deleted_at",label:"Deleted At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1, tbl_show:1},
  {key:"deleted_reason",label:"Deleted Reason", tbl_show:1,type:'string',filter_on:1},
]);

// const enabled_copy = computed(()=>{  
//   let result = selected.value > -1 
//   && [undefined,0].indexOf(dt_selected.value.deleted) > -1
//   && useUtils().checkPermission('employee.create');
//   return result;
// })

const enabled_add = computed(()=>{  
  let result = ['available','all','unapprove'].indexOf(filter_status.value) > -1  
  && useUtils().checkPermission('vehicle.create');
  return result;
})

const enabled_edit = computed(()=>{  
  let result = selected.value > -1 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1
  && useUtils().checkPermissions(['vehicle.modify']);
  return result;
})

// const enabled_validasi = computed(()=>{  
//   let result = selected.value > -1 
//   && [undefined,0].indexOf(dt_selected.value.deleted) > -1
//   && (
//     useUtils().checkPermission('employee.val') && [undefined,0].indexOf(dt_selected.value.val) > -1 || 
//     useUtils().checkPermission('employee.val1') && [undefined,0].indexOf(dt_selected.value.val1) > -1
//   );
//   return result;
// })

const enabled_remove = computed(()=>{  
  let result = selected.value > -1
  && useUtils().checkPermission('vehicle.remove') 
  && [undefined,0].indexOf(dt_selected.value.deleted) > -1;
  return result;
})
</script>

<style scoped="">
/* table.sticky thead th:nth-child(2) {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
} */
</style>
