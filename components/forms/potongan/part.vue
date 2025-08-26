<template>
  <div class="w-full h-full flex flex-col bg-white">
    
    <div class="w-full flex grow flex-col">
      <div class="w-full flex">
        
        <button v-if="!is_view && useUtils().checkPermission('potongan_trx.create')" type="button" name="button" class="m-1 text-2xl "
          @click="form_add()">
          <IconsPlus />
        </button>
        <button v-if="!is_view && useUtils().checkPermissions(['potongan_trx.modify']) && selected > -1" type="button" name="button" class="m-1 text-2xl "
          @click="form_edit()">
          <IconsEdit/>
        </button>
        <button v-if="useUtils().checkPermission('potongan_trx.remove')" type="button" name="button" class="m-1 text-2xl "
          @click="remove()">
          <IconsDelete />
        </button>
        <button v-if="!is_view && useUtils().checkPermissions(['potongan_trx.val','potongan_trx.val1'])" type="button" name="button" class="m-1 text-2xl "
          @click="validasi()">
          <IconsSignature />
        </button>

        <button type="button" name="button" class="m-1 text-2xl "
          @click="reCalculate()">
          <IconsCalculator />
        </button>
      </div>

      <form action="#" class="w-full flex p-1">
        <div class="grow">
          <div class="font-bold"> Keyword </div>
          <input class="" type="text" v-model="search" name="search"
            placeholder="Keyword">
        </div>

        <div class="flex items-end pl-1">
          <button class="" type="submit" name="button" @click.prevent="searching()">
            <IconsSearch class="text-2xl" />
          </button>
        </div>
      </form>
      <div class="w-full flex justify-center items-center grow p-1">

        <div v-if="potongan_trxs.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
          <table class="tacky">
            <thead>
              <tr class="sticky top-0 !z-[2]">
                <th>App 1</th>
                <th>App 2</th>
                <th>ID</th>
                <th>ID Trx Trp</th>
                <th>Nominal Potong</th>
                <th>Note</th>
                <th>Created At</th>
                <th>Updated At</th>
                <!-- <th>Deleted At</th>
                <th>Deleted By</th>
                <th>Deleted Reason</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(potongan_trx, index) in potongan_trxs" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td :class="potongan_trx.deleted ? '!bg-red-500' :''">
                  <div class="flex items-center justify-center">
                    <IconsLine v-if="!potongan_trx.val"/>
                    <IconsCheck v-else/>
                  </div>
                </td>
                <td :class="potongan_trx.deleted ? '!bg-red-500' :''">
                  <div class="flex items-center justify-center">
                    <IconsLine v-if="!potongan_trx.val1"/>
                    <IconsCheck v-else/>
                  </div>
                </td>
                <td :class="potongan_trx.deleted ? '!bg-red-500' :''" class="bold">{{ potongan_trx.id }}</td>
                <td :class="potongan_trx.deleted ? '!bg-red-500' :''">{{ potongan_trx.trx_trp_id }}</td>
                <td :class="potongan_trx.deleted ? '!bg-red-500' :''">{{ pointFormat(potongan_trx.nominal_cut) }}</td>
                <td :class="potongan_trx.deleted ? '!bg-red-500' :''">{{ potongan_trx.note }}</td>
                <td :class="potongan_trx.deleted ? '!bg-red-500' :''">{{ potongan_trx.created_at ? $moment(potongan_trx.created_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
                <td :class="potongan_trx.deleted ? '!bg-red-500' :''">{{ potongan_trx.updated_at ? $moment(potongan_trx.updated_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
                <!-- <td :class="potongan_trx.deleted ? '!bg-red-500' :''">{{ potongan_trx.deleted_at ? $moment(potongan_trx.deleted_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
                <td :class="potongan_trx.deleted ? '!bg-red-500' :''">{{ potongan_trx.deleted_by?.username }}</td>
                <td :class="potongan_trx.deleted ? '!bg-red-500' :''">{{ potongan_trx.deleted_reason }}</td> -->

              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- <PopupMini :type="'delete'" :show="delete_box" :data="delete_data" :fnClose="toggleDeleteBox" :fnConfirm="confirmed_delete" :enabledOk="enabledOk">
      <template #footer>
        Masukkan Alasan Penghapusan:
        <div class="grow mb-5" >
          <textarea  v-model="deleted_reason"></textarea>
        </div>
      </template>
    </PopupMini> -->
    <FormsPotonganTrx :show="forms_potongan_trx_show" :fnClose="()=>{forms_potongan_trx_show=false}" :id="forms_potongan_trx_id" :potongan_mst_id="props.id" :p_data="potongan_trxs" @updateRemainingCut="$emit('updateRemainingCut',$event)"/>
    <FormsPotonganTrxValidasi :show="forms_potongan_trx_valid_show" :fnClose="()=>{forms_potongan_trx_valid_show=false}" :id="forms_potongan_trx_valid_id" :p_data="potongan_trxs"/>
  
  </div>
</template>

<script setup>
const { $moment } = useNuxtApp()
import { storeToRefs } from 'pinia';

import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';


const props = defineProps({
  show:{
    type: Boolean,
    required: true,
    default: false,
  },
  id:{
    type: Number,
    required: false,
    default: 0,
  },
  is_view:{
    type:Boolean,
    required:false,
    default:false
  },
})

const { pointFormat } = useUtils();

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();
params.sort ="created_at:desc";

const token = useDynamicPathCookie('token');
// const { data: dt_async } = await useAsyncData(async () => {
//   let potongan_trxs = [];

//   useCommonStore().loading_full = true;
//   const { data, error, status } = await useMyFetch("/potongan_trxs", {
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
//     useErrorStore().trigger(error);
//     return {potongan_trxs};
//   }
//   potongan_trxs = data.value.data;
//   return {potongan_trxs};
// });

// const potongan_trxs = ref(dt_async.value.potongan_trxs);
const potongan_trxs = ref([]);
// const popup_request = ref(false);

const search = ref("");
const sort = ref({
  field: "created_at",
  by: "desc"
});
const selected = ref(-1);
const scrolling = ref({
  page: 1,
  is_last_record: false,
  scrollLeft: 0,
  may_get_data: true
});

const inject_params = () => {
  params.like = "";
  if (search.value != "") {
    params.like = `id:%${search.value}%,employee_name:%${search.value}%,no_pol:%${search.value}%,info:%${search.value}%,status:%${search.value}%`;
  }
  params.sort = "";
  if (sort.value.field) {
    params.sort = sort.value.field + ":" + sort.value.by;
  }
};

const loadRef = ref(null);

const callData = async () => {
  useCommonStore().loading_full = true;
  scrolling.value.may_get_data = false;
  params.page = scrolling.value.page;
  if (params.page == 1) potongan_trxs.value = [];
  if(params.first_row) delete params.first_row;
  if(params.page > 1){
    params.first_row = JSON.stringify(potongan_trxs.value[0]);
  }
  params.potongan_mst_id = props.id;
  const { data, error, status } = await useMyFetch("/potongan_trxs", {
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
    useErrorStore().trigger(error);
    return;
  }

  if (scrolling.value.page == 1) {
    potongan_trxs.value = data.value.data;
    if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    potongan_trxs.value = [...potongan_trxs.value, ...data.value.data];
  }
  if (data.value.data.length == 0) {
    scrolling.value.is_last_record = true;
  }
}

const loadMore = async () => {

  if (!scrolling.value.may_get_data) return;
  let parent = loadRef.value;

  if (parent.scrollLeft != scrolling.value.scrollLeft) {
    scrolling.value.scrollLeft = parent.scrollLeft;
    return;
  }

  if (scrolling.value.is_last_record) return;

  let stuck = Math.round(parent.scrollTop) + parent.clientHeight >= parent.scrollHeight - 1 ? true : false;
  if (!stuck) return;

  scrolling.value.page++;
  await callData();

}

const searching = () => {
  scrolling.value.page = 1;
  scrolling.value.is_last_record = false;
  inject_params();
  callData();
}

const forms_potongan_trx_show =  ref(false);
const forms_potongan_trx_id = ref(0);
const forms_potongan_trx_copy = ref(0);
const form_add = () => {
  forms_potongan_trx_id.value = 0;
  forms_potongan_trx_show.value = true;
  forms_potongan_trx_copy.value = false;
  // router.push({ name: 'data_potongan_trx-form', query: { id: "" } });
}

const { display } = useAlertStore();

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_potongan_trx_id.value = potongan_trxs.value[selected.value].id;
    forms_potongan_trx_show.value = true;
    forms_potongan_trx_copy.value = false;
    // router.push({ name: 'data_potongan_trx-form', query: { id: potongan_trxs.value[selected.value].id } });
  }
};

const form_copy = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_potongan_trx_id.value = potongan_trxs.value[selected.value].id;
    forms_potongan_trx_show.value = true;
    forms_potongan_trx_copy.value = true;
    // router.push({ name: 'data_trx_trp-form', query: { id: trx_trps.value[selected.value].id } });
  }
};

const forms_potongan_trx_valid_show =  ref(false);
const forms_potongan_trx_valid_id = ref(0);
const validasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_potongan_trx_valid_id.value = potongan_trxs.value[selected.value].id;
    forms_potongan_trx_valid_show.value = true;
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
    delete_data.value = {id : potongan_trxs.value[selected.value].id};
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
  data_in.append("id", potongan_trxs.value[selected.value].id);
  data_in.append("deleted_reason", deleted_reason.value);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/potongan_trx", {
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
  potongan_trxs.value.splice(selected.value,1);
  selected.value = -1;
  delete_box.value = false;
}

const emit = defineEmits(['updateRemainingCut']);
const reCalculate = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("potongan_mst_id", props.id);

  const { data, error, status } = await useMyFetch("/potongan_trx_recalculate", {
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
  emit('updateRemainingCut',data.value.remaining_cut);
}

watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    // await loadLocalDT();

    // potongan_mst.value = {...potongan_mst_temp};
    // selected_supir.value = JSON.parse(JSON.stringify(selected_mini_temp));
    
    // details.value = [];
    
    // field_errors.value = {};
    if(props.id!=0)
      callData();
  }
}, {
  immediate: true
});
</script>