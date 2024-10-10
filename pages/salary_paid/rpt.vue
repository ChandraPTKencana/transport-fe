<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Salary Paid'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex">
        <button v-if="useUtils().checkPermission('rpt_salary.create')" type="button" name="button" class="m-1 text-2xl "
          @click="form_add()">
          <IconsPlus />
        </button>
        <button v-if="useUtils().checkPermissions(['rpt_salary.modify'])" type="button" name="button" class="m-1 text-2xl "
          @click="form_edit()">
          <IconsEdit/>
        </button>
        <button v-if="useUtils().checkPermissions(['rpt_salary.val1','rpt_salary.val2','rpt_salary.val3'])" type="button" name="button" class="m-1 text-2xl "
          @click="validasi()">
          <IconsSignature />
        </button>
        <!-- <button v-if="selected>-1 && rpt_salarys[selected].val1==1" type="button" name="button" class="m-1 text-2xl "
          @click="printPreview()">
          <IconsPrinterEye />
        </button> -->
        <button v-if="selected>-1 && rpt_salarys[selected].val1==1" type="button" name="button" class="m-1 text-2xl "
          @click="downloadExcel()">
          <IconsTable2Column />
        </button>
      </div>

      <div class="w-full flex justify-center items-center grow h-0 p-1">

        <div v-if="rpt_salarys.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
          <table class="tacky">
            <thead>
              <tr class="sticky top-0 !z-[2]">
                <th>Logistik</th>
                <th>ID</th>
                <th>Period End</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rpt_salary, index) in rpt_salarys" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td>
                  <div class="flex items-center justify-center">
                    <IconsLine v-if="!rpt_salary.val1"/>
                    <IconsCheck v-else/>
                  </div>
                </td>
                <td class="bold">{{ rpt_salary.id }}</td>
                <td>{{ rpt_salary.period_end ? $moment(rpt_salary.period_end).format("MM-Y") : "" }}</td>
                <td>{{ rpt_salary.created_at ? $moment(rpt_salary.created_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
                <td>{{ rpt_salary.updated_at ? $moment(rpt_salary.updated_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
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
    <FormsRptSalary :show="forms_rpt_salary_show" :fnClose="()=>{forms_rpt_salary_show=false}" :id="forms_rpt_salary_id" :p_data="rpt_salarys" :is_copy="forms_rpt_salary_copy"/>
    <FormsRptSalaryValidasi :show="forms_rpt_salary_valid_show" :fnClose="()=>{forms_rpt_salary_valid_show=false}" :id="forms_rpt_salary_valid_id" :p_data="rpt_salarys"/>
  
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
      if (!useAuthStore().checkPermission('rpt_salary.views')){
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

const token = useCookie('token');
const { data: dt_async } = await useAsyncData(async () => {
  let rpt_salarys = [];

  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/rpt_salarys", {
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
    return {rpt_salarys};
  }
  rpt_salarys = data.value.data;
  return {rpt_salarys};
});

const rpt_salarys = ref(dt_async.value.rpt_salarys);
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
  if (params.page == 1) rpt_salarys.value = [];
  if(params.first_row) delete params.first_row;
  if(params.page > 1){
    params.first_row = JSON.stringify(rpt_salarys.value[0]);
  }
  const { data, error, status } = await useMyFetch("/rpt_salarys", {
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
    rpt_salarys.value = data.value.data;
    if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    rpt_salarys.value = [...rpt_salarys.value, ...data.value.data];
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

const forms_rpt_salary_show =  ref(false);
const forms_rpt_salary_id = ref(0);
const forms_rpt_salary_copy = ref(0);
const form_add = () => {
  forms_rpt_salary_id.value = 0;
  forms_rpt_salary_show.value = true;
  forms_rpt_salary_copy.value = false;
  // router.push({ name: 'data_rpt_salary-form', query: { id: "" } });
}

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_rpt_salary_id.value = rpt_salarys.value[selected.value].id;
    forms_rpt_salary_show.value = true;
    forms_rpt_salary_copy.value = false;
    // router.push({ name: 'data_rpt_salary-form', query: { id: rpt_salarys.value[selected.value].id } });
  }
};

const form_copy = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_rpt_salary_id.value = rpt_salarys.value[selected.value].id;
    forms_rpt_salary_show.value = true;
    forms_rpt_salary_copy.value = true;
    // router.push({ name: 'data_trx_trp-form', query: { id: trx_trps.value[selected.value].id } });
  }
};

const forms_rpt_salary_valid_show =  ref(false);
const forms_rpt_salary_valid_id = ref(0);
const validasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_rpt_salary_valid_id.value = rpt_salarys.value[selected.value].id;
    forms_rpt_salary_valid_show.value = true;
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
    delete_data.value = {id : rpt_salarys.value[selected.value].id};
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
  data_in.append("id", rpt_salarys.value[selected.value].id);
  data_in.append("deleted_reason", deleted_reason.value);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/rpt_salary", {
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
  rpt_salarys.value.splice(selected.value,1);
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
  const { data, error, status } = await useMyFetch("/rpt_salary/pdf_preview", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id:rpt_salarys.value[selected.value].id},
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
  const { data, error, status } = await useMyFetch("/rpt_salary/excel_download", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id:rpt_salarys.value[selected.value].id},
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