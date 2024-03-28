<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Ujalan'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex">
        <button type="button" name="button" class="m-1 text-2xl "
          @click="form_add()">
          <IconsPlus />
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
          @click="form_edit()">
          <IconsEdit v-if="selected==-1 || ujalans[selected].ref_id == null && ujalans[selected].confirmed_by == null"/>
          <IconsEyes v-else />
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
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
            <option value="xto">To</option>
            <option value="jenis">Jenis</option>
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

        <div v-if="ujalans.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
          <table class="tacky">
            <thead>
              <tr class="sticky top-0 !z-[2]">
                <!-- <th>No.</th> -->
                <!-- <th>Updated At</th> -->
                <th>App 1</th>
                <th>ID</th>
                <th>To</th>
                <th>Tipe</th>
                <!-- <th>Status</th> -->
                <th>Jenis</th>
                <th>Harga</th>
                <!-- <th>Created User</th> -->
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ujalan, index) in ujalans" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td>
                  <div class="flex items-center justify-center">
                    <IconsLine v-if="!ujalan.val"/>
                    <IconsCheck v-else/>
                  </div>
                </td>
                <td class="bold">{{ ujalan.id }}</td>
                <td>{{ ujalan.xto }}</td>
                <td>{{ ujalan.tipe }}</td>
                <!-- <td>{{ ujalan.status }}</td> -->
                <td>{{ ujalan.jenis }}</td>
                <td>{{ pointFormat(ujalan.harga) }}</td>
                <td>{{ ujalan.created_at ? $moment(ujalan.created_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
                <td>{{ ujalan.updated_at ? $moment(ujalan.updated_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <PopupMini :type="'delete'" :show="delete_box" :data="delete_data" :fnClose="toggleDeleteBox" :fnConfirm="confirmed_delete" />
    <!-- <ujalansRequested :show="popup_request" :fnClose="()=>{ popup_request = false; }" @update_request_notif="request_notif = $event"/> -->
    <FormsUjalan :show="forms_ujalan_show" :fnClose="()=>{forms_ujalan_show=false}" :id="forms_ujalan_id" :p_data="ujalans"/>
    <FormsUjalanValidasi :show="forms_ujalan_valid_show" :fnClose="()=>{forms_ujalan_valid_show=false}" :id="forms_ujalan_valid_id" :p_data="ujalans"/>
  
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
      // if (!useAuthStore().checkScopes(['ap-ujalan-view']))
      //   return navigateTo('/');
      if (!useAuthStore().checkRole(["SuperAdmin","Logistic"]))
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
  let ujalans = [];

  useCommonStore().loading_full = true;
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
  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return {ujalans};
  }
  ujalans = data.value.data;
  return {ujalans};
});

const ujalans = ref(dt_async.value.ujalans);
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
    params.like = `id:%${search.value}%,warehouse_name:%${search.value}%,warehouse_source_name:%${search.value}%,warehouse_target_name:%${search.value}%,item_name:%${search.value}%,status:%${search.value}%,type:%${search.value}%`;
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
  if (params.page == 1) ujalans.value = [];
  if(params.first_row) delete params.first_row;
  if(params.page > 1){
    params.first_row = JSON.stringify(ujalans.value[0]);
  }
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
    useErrorStore().trigger(error);
    return;
  }

  if (scrolling.value.page == 1) {
    ujalans.value = data.value.data;
    if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    ujalans.value = [...ujalans.value, ...data.value.data];
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

const forms_ujalan_show =  ref(false);
const forms_ujalan_id = ref(0);
const form_add = () => {
  forms_ujalan_id.value = 0;
  forms_ujalan_show.value = true;
  // router.push({ name: 'data_ujalan-form', query: { id: "" } });
}

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_ujalan_id.value = ujalans.value[selected.value].id;
    forms_ujalan_show.value = true;
    // router.push({ name: 'data_ujalan-form', query: { id: ujalans.value[selected.value].id } });
  }
};

const forms_ujalan_valid_show =  ref(false);
const forms_ujalan_valid_id = ref(0);
const validasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_ujalan_valid_id.value = ujalans.value[selected.value].id;
    forms_ujalan_valid_show.value = true;
  }
};

const delete_data = ref({});
const delete_box = ref(false);

const toggleDeleteBox = async()=>{  
  if (delete_box.value) {
    delete_box.value = false;
  }
};

const remove = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    delete_data.value = {id : ujalans.value[selected.value].id};
    delete_box.value = true;
  }
};

const confirmed_delete = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", ujalans.value[selected.value].id);  
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
  ujalans.value.splice(selected.value,1);
  selected.value = -1;
  delete_box.value = false;
}
</script>