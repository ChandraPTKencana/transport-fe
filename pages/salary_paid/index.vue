<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Salary Paid'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex">
        <button v-if="useUtils().checkPermission('salary_paid.create')" type="button" name="button" class="m-1 text-2xl "
          @click="form_add()">
          <IconsPlus />
        </button>
        <button v-if="useUtils().checkPermissions(['salary_paid.modify'])" type="button" name="button" class="m-1 text-2xl "
          @click="form_edit()">
          <IconsEdit/>
        </button>
        <button v-if="useUtils().checkPermissions(['salary_paid.val1','salary_paid.val2','salary_paid.val3'])" type="button" name="button" class="m-1 text-2xl "
          @click="validasi()">
          <IconsSignature />
        </button>
        <!-- <button v-if="selected>-1 && salary_paids[selected].val1==1" type="button" name="button" class="m-1 text-2xl "
          @click="printPreview()">
          <IconsPrinterEye />
        </button> -->
        <button v-if="selected>-1 && salary_paids[selected].val1==1" type="button" name="button" class="m-1 text-2xl "
          @click="downloadExcel()">
          <IconsTable2Column />
        </button>

        <button v-if="selected>-1 && salary_paids[selected].val1==1" type="button" name="button" class="m-1 text-2xl "
          @click="downloadExcel2()">
          <IconsTableUp />
        </button>
      </div>

      <!-- <form action="#" class="w-full flex p-1">
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
      </form> -->
      <div class="w-full flex justify-center items-center grow h-0 p-1">

        <div v-if="salary_paids.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
          <table class="tacky">
            <thead>
              <tr class="sticky top-0 !z-[2]">
                <th>Logistik</th>
                <!-- <th>App 2</th>
                <th>App 3</th> -->
                <th>ID</th>
                <th>Period End</th>
                <th>Period Part</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(salary_paid, index) in salary_paids" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td>
                  <div class="flex items-center justify-center">
                    <IconsLine v-if="!salary_paid.val1"/>
                    <IconsCheck v-else/>
                  </div>
                </td>
                <!-- <td>
                  <div class="flex items-center justify-center">
                    <IconsLine v-if="!salary_paid.val2"/>
                    <IconsCheck v-else/>
                  </div>
                </td>
                <td>
                  <div class="flex items-center justify-center">
                    <IconsLine v-if="!salary_paid.val3"/>
                    <IconsCheck v-else/>
                  </div>
                </td> -->
                <td class="bold">{{ salary_paid.id }}</td>
                <td>{{ salary_paid.period_end ? $moment(salary_paid.period_end).format("MM-Y") : "" }}</td>
                <td>{{ salary_paid.period_part }}</td>
                <td>{{ salary_paid.created_at ? $moment(salary_paid.created_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
                <td>{{ salary_paid.updated_at ? $moment(salary_paid.updated_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
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
    <!-- <salary_paidsRequested :show="popup_request" :fnClose="()=>{ popup_request = false; }" @update_request_notif="request_notif = $event"/> -->
    <FormsSalaryPaid :show="forms_salary_paid_show" :fnClose="()=>{forms_salary_paid_show=false}" :id="forms_salary_paid_id" :p_data="salary_paids" :is_copy="forms_salary_paid_copy"/>
    <FormsSalaryPaidValidasi :show="forms_salary_paid_valid_show" :fnClose="()=>{forms_salary_paid_valid_show=false}" :id="forms_salary_paid_valid_id" :p_data="salary_paids"/>
    <PDFView :show="prtView" :pdfContent="pdfContent" @close="prtView=!prtView"/>
  
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
      if (!useAuthStore().checkPermission('salary_paid.views')){
        useCommonStore().loading_full = false;
        return navigateTo('/');
      }
    },
    // 'auth',
  ],
});

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();
params.sort ="created_at:desc";

const token = useDynamicPathCookie('token');
const { data: dt_async } = await useAsyncData(async () => {
  let salary_paids = [];

  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/salary_paids", {
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
    return {salary_paids};
  }
  salary_paids = data.value.data;
  return {salary_paids};
});

const salary_paids = ref(dt_async.value.salary_paids);
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
    params.like = `id:%${search.value}%,xto:%${search.value}%,tipe:%${search.value}%,jenis:%${search.value}%,harga:%${search.value}%`;
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
  if (params.page == 1) salary_paids.value = [];
  if(params.first_row) delete params.first_row;
  if(params.page > 1){
    params.first_row = JSON.stringify(salary_paids.value[0]);
  }
  const { data, error, status } = await useMyFetch("/salary_paids", {
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
    salary_paids.value = data.value.data;
    if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    salary_paids.value = [...salary_paids.value, ...data.value.data];
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

const forms_salary_paid_show =  ref(false);
const forms_salary_paid_id = ref(0);
const forms_salary_paid_copy = ref(0);
const form_add = () => {
  forms_salary_paid_id.value = 0;
  forms_salary_paid_show.value = true;
  forms_salary_paid_copy.value = false;
  // router.push({ name: 'data_salary_paid-form', query: { id: "" } });
}

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_salary_paid_id.value = salary_paids.value[selected.value].id;
    forms_salary_paid_show.value = true;
    forms_salary_paid_copy.value = false;
    // router.push({ name: 'data_salary_paid-form', query: { id: salary_paids.value[selected.value].id } });
  }
};

const form_copy = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_salary_paid_id.value = salary_paids.value[selected.value].id;
    forms_salary_paid_show.value = true;
    forms_salary_paid_copy.value = true;
    // router.push({ name: 'data_trx_trp-form', query: { id: trx_trps.value[selected.value].id } });
  }
};

const forms_salary_paid_valid_show =  ref(false);
const forms_salary_paid_valid_id = ref(0);
const validasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_salary_paid_valid_id.value = salary_paids.value[selected.value].id;
    forms_salary_paid_copy.value = false;
    forms_salary_paid_valid_show.value = true;
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
    delete_data.value = {id : salary_paids.value[selected.value].id};
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
  data_in.append("id", salary_paids.value[selected.value].id);
  data_in.append("deleted_reason", deleted_reason.value);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/salary_paid", {
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
  salary_paids.value.splice(selected.value,1);
  selected.value = -1;
  delete_box.value = false;
}

const { downloadFile, viewFile } = useDownload();

const prtView = ref(false);
const pdfContent = ref({});

const printPreview = async()=>{
  if (prtView.value==true) {
    prtView.value = false;
    return;
  }
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/salary_paid/pdf_preview", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id:salary_paids.value[selected.value].id},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  pdfContent.value = data.value;
  prtView.value = true;
}

const downloadExcel = async()=>{  
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/salary_paid/excel_download", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id:salary_paids.value[selected.value].id},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  downloadFile(data.value);
}

const downloadExcel2 = async()=>{  
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/salary_paid/excel_download2", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id:salary_paids.value[selected.value].id},
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