<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Vehicle'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex">
        <button type="button" name="button" class="m-1 text-2xl "
          @click="form_add()">
          <IconsPlus />
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
          @click="form_edit()">
          <IconsEdit />
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
          @click="remove()">
          <IconsDelete />
        </button>
        <!-- <button type="button" name="button" style="margin:4px; " @click="cetak()">
          <fa :icon="['fas','print']"/>
        </button> -->
      </div>
      <div class="w-full flex p-1">
        <div class="grow">
          <div class="font-bold"> Keyword </div>
          <input class="" type="text" v-model="search" name="search"
            placeholder="Keyword">
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort By </div>
          <select class="" v-model="sort.field">
            <option value=""></option>
            <option value="no_pol">No Pol</option>
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
          <button class="" type="button" name="button" @click="searching()">
            <IconsSearch class="text-2xl" />
          </button>
        </div>
      </div>
      <div class="w-full flex justify-center items-center grow h-0 p-1">

        <div v-if="vehicles.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
          <table class="tacky">
            <thead>
              <tr class="sticky top-0 !z-[2]">
                <th>No.</th>
                <th>No Pol</th>
                <!-- <th>Hak Akses</th>
                <th>Status</th> -->
                <th>Tanggal Dibuat</th>
                <th>Tanggal Diubah</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vehicle, index) in vehicles" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td>{{ index + 1 }}.</td>
                <td class="bold">{{ vehicle.no_pol }}</td>
                <!-- <td>{{ vehicle.hak_akses }}</td>
                <td>{{ vehicle.is_active ? 'Aktif' : 'Nonaktif' }}</td> -->
                <td>{{ $moment(vehicle.created_at).format("DD-MM-Y HH:mm:ss") }}</td>
                <td>{{ $moment(vehicle.updated_at).format("DD-MM-Y HH:mm:ss") }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- {{ data.greetings }} -->
      <!-- {{ vehicles }} -->
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
  <FormsVehicle :show="forms_vehicle_show" :fnClose="()=>{forms_vehicle_show=false}" :id="forms_vehicle_id" :p_data="vehicles"/>

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
  middleware: [
    function (to, from) {
      // if (!useAuthStore().checkScopes(['ap-trx_trp-view']))
      //   return navigateTo('/');
      if (!useAuthStore().checkRole(["SuperAdmin","PabrikTransport"]))
      return navigateTo('/');
    },
    // 'auth',
  ],
});


const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();


const token = useCookie('token');
const { data: vehicles } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/vehicles", {
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

const inject_params = () => {
  params.like = "";
  if (search.value != "") {
    params.like = `id:%${search.value}%,no_pol:%${search.value}%`;
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
  if (params.page == 1) vehicles.value = [];

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
    if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    vehicles.value = [...vehicles.value, ...data.value.data];
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

const forms_vehicle_show =  ref(false);
const forms_vehicle_id = ref(0);
const form_add = () => {
  forms_vehicle_id.value = 0;
  forms_vehicle_show.value = true;
}

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_vehicle_id.value = vehicles.value[selected.value].id;
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
  vehicles.value.splice(selected.value,1);
  selected.value = -1;
  delete_box.value = false;
}
</script>

<style scoped="">
/* table.sticky thead th:nth-child(2) {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
} */
</style>
