<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Standby'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex">
        <button v-if="!useUtils().checkRole(['Logistic'])" type="button" name="button" class="m-1 text-2xl "
          @click="form_copy()">
          <IconsCopy />
        </button>
        <button v-if="!useUtils().checkRole(['Logistic'])" type="button" name="button" class="m-1 text-2xl "
          @click="form_add()">
          <IconsPlus />
        </button>
        <button v-if="!useUtils().checkRole(['Logistic'])" type="button" name="button" class="m-1 text-2xl "
          @click="form_edit()">
          <IconsEdit/>
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
            @click="form_view()">
            <IconsEyes/>
          </button>
        <button v-if="!useUtils().checkRole(['PabrikTransport'])" type="button" name="button" class="m-1 text-2xl "
          @click="remove()">
          <IconsDelete />
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
          @click="validasi()">
          <IconsSignature />
        </button>
      </div>

      <form action="#" class="w-full flex p-1">
        <div class="grow">
          <div class="font-bold"> Keyword </div>
          <input class="" type="text" v-model="search" name="search"
            placeholder="Keyword">
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort By </div>
          <select class="" v-model="sort.field">
            <option value=""></option>
            <option value="id">ID</option>
            <option value="name">Name</option>
            <option value="tipe">Tipe</option>
          </select>
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort Order </div>
          <select class="" v-model="sort.by">
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <div class="flex items-end pl-1">
          <button class="" type="submit" name="button" @click.prevent="searching()">
            <IconsSearch class="text-2xl" />
          </button>
        </div>
      </form>
      <div class="w-full flex justify-center items-center grow h-0 p-1">

        <div v-if="standby_msts.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
          <table class="tacky">
            <thead>
              <tr class="sticky top-0 !z-[2]">
                <th>App 1</th>
                <th>App 2</th>
                <th>ID</th>
                <th>Name</th>
                <th>Tipe</th>
                <th>Amount</th>
                <th>Peralihan</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(standby_mst, index) in standby_msts" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td>
                  <div class="flex items-center justify-center">
                    <IconsLine v-if="!standby_mst.val"/>
                    <IconsCheck v-else/>
                  </div>
                </td>
                <td>
                  <div class="flex items-center justify-center">
                    <IconsLine v-if="!standby_mst.val1"/>
                    <IconsCheck v-else/>
                  </div>
                </td>
                <td class="bold">{{ standby_mst.id }}</td>
                <td>{{ standby_mst.name }}</td>
                <td>{{ standby_mst.tipe }}</td>
                <td>{{ pointFormat(standby_mst.amount) }}</td>
                <td>{{ standby_mst.is_transition ? 'Ya' : 'Tidak' }}</td>
                <td>{{ standby_mst.created_at ? $moment(standby_mst.created_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
                <td>{{ standby_mst.updated_at ? $moment(standby_mst.updated_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <PopupMini :type="'delete'" :show="delete_box" :data="delete_data" :fnClose="toggleDeleteBox" :fnConfirm="confirmed_delete" :enabledOk="enabledOk">
      <template #footer>
        Masukkan Alasan Penghapusan:
        <div class="grow mb-5" >
          <textarea  v-model="deleted_reason"></textarea>
        </div>
      </template>
    </PopupMini>
    <FormsStandbyMst :show="forms_standby_mst_show" :fnClose="()=>{forms_standby_mst_show=false}" :id="forms_standby_mst_id" :p_data="standby_msts" :is_copy="forms_standby_mst_copy"/>
    <FormsStandbyMstValidasi :show="forms_standby_mst_valid_show" :fnClose="()=>{forms_standby_mst_valid_show=false}" :id="forms_standby_mst_valid_id" :p_data="standby_msts" :is_view="forms_trx_trp_is_view"/>
  
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
      // if (!useAuthStore().checkScopes(['ap-standby_mst-view']))
      //   return navigateTo('/');
      if (!useAuthStore().checkRole(["SuperAdmin","ViewOnly","Logistic",'PabrikTransport']))
      return navigateTo('/');

    },
    // 'auth',
  ],
});

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();
params.sort ="created_at:desc";

const token = useCookie('token');
const { data: dt_async } = await useAsyncData(async () => {
  let standby_msts = [];

  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/standby_msts", {
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
    return {standby_msts};
  }
  standby_msts = data.value.data;
  return {standby_msts};
});

const standby_msts = ref(dt_async.value.standby_msts);
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
    params.like = `id:%${search.value}%,name:%${search.value}%,amount:%${search.value}%`;
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
  if (params.page == 1) standby_msts.value = [];
  if(params.first_row) delete params.first_row;
  if(params.page > 1){
    params.first_row = JSON.stringify(standby_msts.value[0]);
  }
  const { data, error, status } = await useMyFetch("/standby_msts", {
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
    standby_msts.value = data.value.data;
    if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    standby_msts.value = [...standby_msts.value, ...data.value.data];
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

const forms_standby_mst_show =  ref(false);
const forms_standby_mst_id = ref(0);
const forms_standby_mst_copy = ref(0);
const form_add = () => {
  forms_standby_mst_id.value = 0;
  forms_standby_mst_show.value = true;
  forms_standby_mst_copy.value = false;
  // router.push({ name: 'data_standby_mst-form', query: { id: "" } });
}

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_standby_mst_id.value = standby_msts.value[selected.value].id;
    forms_standby_mst_show.value = true;
    forms_standby_mst_copy.value = false;
    // router.push({ name: 'data_standby_mst-form', query: { id: standby_msts.value[selected.value].id } });
  }
};

const form_copy = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_standby_mst_id.value = standby_msts.value[selected.value].id;
    forms_standby_mst_show.value = true;
    forms_standby_mst_copy.value = true;
    // router.push({ name: 'data_trx_trp-form', query: { id: trx_trps.value[selected.value].id } });
  }
};

const forms_standby_mst_valid_show =  ref(false);
const forms_standby_mst_valid_id = ref(0);
const forms_trx_trp_is_view = ref(false);
const validasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_standby_mst_valid_id.value = standby_msts.value[selected.value].id;
    forms_standby_mst_valid_show.value = true;
    forms_trx_trp_is_view.value = false;
  }
};

const form_view = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_standby_mst_valid_id.value = standby_msts.value[selected.value].id;
    forms_standby_mst_valid_show.value = true;
    forms_trx_trp_is_view.value = true;
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
    delete_data.value = {id : standby_msts.value[selected.value].id};
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
  data_in.append("id", standby_msts.value[selected.value].id);
  data_in.append("deleted_reason", deleted_reason.value);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/standby_mst", {
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
  standby_msts.value.splice(selected.value,1);
  selected.value = -1;
  delete_box.value = false;
}
</script>