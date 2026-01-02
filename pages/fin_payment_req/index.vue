<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Payment Req'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex">

        <button type="button" name="button" class="m-1 text-2xl "
          @click="form_add()">
          <IconsPlus />
        </button>

        <button type="button" name="button" class="m-1 text-2xl "
          @click="form_view()">
          <IconsEdit />
        </button>

        <button type="button" name="button" class="m-1 text-2xl "
          @click="validasi()">
          <IconsSignature />
        </button>
      </div>

      <form action="#" class="w-full flex ">
        <div class="w-full p-1 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col">
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
        <div class="w-full p-1 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col">
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
        <div class="grow p-1">
          <div class="font-bold"> Keyword </div>
          <input class="" type="text" v-model="search" name="search"
            placeholder="Keyword">
        </div>
        
        <div class="flex items-end p-1">
          <button class="" type="submit" name="button" @click.prevent="searching()">
            <IconsSearch class="text-2xl" />
          </button>
        </div>
      </form>
      <div class="w-full flex justify-center items-center grow h-0 p-1">

        <div v-if="fin_payment_reqs.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
          <table class="tacky">
            <thead>
              <tr class="sticky top-0 !z-[2]">
                <th>App</th>
                <!-- <th>No</th> -->
                <th>ID</th>
                <th>Status</th>
                <th>Batch no</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(fin_payment_req, index) in fin_payment_reqs" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td>
                  <div class="flex items-center justify-center">
                    <IconsLine v-if="!fin_payment_req.val"/>
                    <IconsCheck v-else/>
                  </div>
                </td>
                <!-- <td>{{ index + 1 }}</td> -->
                <td class="bold">{{ fin_payment_req.id }}</td>
                <td class="bold">{{ fin_payment_req.status }}</td>
                <td class="bold">{{ fin_payment_req.batch_no }}</td>
                <!-- <td>{{ pointFormat(fin_payment_req.harga) }}</td> -->
                <td>{{ fin_payment_req.created_at ? $moment(fin_payment_req.created_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
                <td>{{ fin_payment_req.updated_at ? $moment(fin_payment_req.updated_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
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
    <!-- <LazyFormsFinPaymentReqTrxTrps :show="forms_fin_payment_req_show" :fnClose="()=>{forms_fin_payment_req_show=false}" :id="forms_fin_payment_req_id" :p_data="fin_payment_reqs"/> -->
    <!-- <LazyFormsFinPaymentReqView :show="forms_fin_payment_req_view_show" :fnClose="()=>{forms_fin_payment_req_view_show=false}" :id="forms_fin_payment_req_view_id"/> -->
    <LazyFormsFinPaymentReqValidasi :show="forms_fin_payment_req_valid_show" :fnClose="()=>{forms_fin_payment_req_valid_show=false}" :id="forms_fin_payment_req_valid_id" :p_data="fin_payment_reqs"/>
    <LazyFormsFinPaymentReq :show="forms_fin_payment_req_show" :fnClose="()=>{forms_fin_payment_req_show=false}" :id="forms_fin_payment_req_id" :p_data="fin_payment_reqs"/>
  
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
      // if (!useAuthStore().checkScopes(['ap-fin_payment_req-view']))
      //   return navigateTo('/');
      if (!useAuthStore().checkRole(["SuperAdmin","Finance"]))
      return navigateTo('/');

    },
    // 'auth',
  ],
});

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();
params.sort ="created_at:desc";

const token = useDynamicPathCookie('token');
const { data: dt_async } = await useAsyncData(async () => {
  let fin_payment_reqs = [];

  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/fin_payment_reqs", {
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
    return {fin_payment_reqs};
  }
  fin_payment_reqs = data.value.data;
  return {fin_payment_reqs};
},
  {
    lazy: true,        // 🔥 INI KUNCINYA
    server: false,
    default: () => ({ fin_payment_reqs: [] }),     // 🔥 penting untuk dashboard / auth page
  });

const fin_payment_reqs = ref([]);

watch(
  () => dt_async.value?.fin_payment_reqs,
  (val) => {
    if (val) {
      fin_payment_reqs.value = [...val]; // clone agar aman
    }
  },
  { immediate: true }
);
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
const field_errors = ref({})

const date = ref({
  from: "",
  to: "",
});

const inject_params = () => {
  params.like = "";
  if (search.value != "") {
    params.like = `id:%${search.value}%,status:%${search.value}%`;
  }
  params.sort = "";
  if (sort.value.field) {
    params.sort = sort.value.field + ":" + sort.value.by;
  }

  params.date_from = date.value.from ? $moment(date.value.from).format("YYYY-MM-DD") : "";
  params.date_to = date.value.to ? $moment(date.value.to).format("YYYY-MM-DD") : "";
};

const loadRef = ref(null);

const callData = async () => {
  useCommonStore().loading_full = true;
  scrolling.value.may_get_data = false;
  params.page = scrolling.value.page;
  if (params.page == 1) fin_payment_reqs.value = [];
  if(params.first_row) delete params.first_row;
  if(params.page > 1){
    params.first_row = JSON.stringify(fin_payment_reqs.value[0]);
  }
  const { data, error, status } = await useMyFetch("/fin_payment_reqs", {
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
    fin_payment_reqs.value = data.value.data;
    if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    fin_payment_reqs.value = [...fin_payment_reqs.value, ...data.value.data];
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

const router = useRouter();

const forms_fin_payment_req_show =  ref(false);
const forms_fin_payment_req_id = ref(0);
const forms_fin_payment_req_copy = ref(0);
const form_add = () => {
  forms_fin_payment_req_id.value = 0;
  forms_fin_payment_req_show.value = true;
  forms_fin_payment_req_copy.value = false;
  // router.push({ name: 'data_fin_payment_req-form', query: { id: "" } });
}

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

// const forms_fin_payment_req_view_show =  ref(false);
// const forms_fin_payment_req_view_id = ref(0);
const form_view = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_fin_payment_req_id.value = fin_payment_reqs.value[selected.value].id;
    forms_fin_payment_req_show.value = true;
  }
};

const forms_fin_payment_req_valid_show =  ref(false);
const forms_fin_payment_req_valid_id = ref(0);
const validasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_fin_payment_req_valid_id.value = fin_payment_reqs.value[selected.value].id;
    forms_fin_payment_req_valid_show.value = true;
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
    delete_data.value = {id : fin_payment_reqs.value[selected.value].id};
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
  data_in.append("id", fin_payment_reqs.value[selected.value].id);
  data_in.append("deleted_reason", deleted_reason.value);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/fin_payment_req", {
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
  fin_payment_reqs.value.splice(selected.value,1);
  selected.value = -1;
  delete_box.value = false;
}
</script>