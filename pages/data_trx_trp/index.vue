<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Transaction'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex">
        <button type="button" name="button" class="m-1 text-2xl "
          @click="form_add()">
          <IconsPlus />
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
          @click="form_edit()">
          <IconsEdit/>
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
          @click="remove()">
          <IconsDelete />
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
          @click="validasi()">
          <IconsSignature />
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
          @click="printPreview()">
          <IconsPrinterEye />
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

        <div v-if="trx_trps.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
          <table class="tacky">
            <thead>
              <tr class="sticky top-0 !z-[2]">
                <!-- <th>No.</th> -->
                <!-- <th>Updated At</th> -->
                <th>App 1</th>
                <th>App 2</th>
                <th>ID</th>
                <th>U.Jalan Per</th>
                <th>Tujuan</th>
                <th>Tipe</th>
                <th>Jenis</th>
                <th>Amount</th>
                <th>PV No</th>
                <th>PV Total</th>

                <th>Ticket A No</th>
                <th>Ticket A Bruto</th>
                <th>Ticket A Tara</th>
                <th>Ticket A Netto</th>
                <th>Ticket A Supir</th>
                <th>Ticket A No Pol</th>
                <th>Ticket A In At</th>
                <th>Ticket A Out At</th>

                <th>Ticket B No</th>
                <th>Ticket B Bruto</th>
                <th>Ticket B Tara</th>
                <th>Ticket B Netto</th>
                <th>Ticket B Supir</th>
                <th>Ticket B No Pol</th>
                <th>Ticket B In At</th>
                <th>Ticket B Out At</th>

                <th>Supir</th>
                <th>No Pol</th>
                <!-- <th>Created User</th> -->
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(trx_trp, index) in trx_trps" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td>
                  <div class="flex items-center justify-center">
                    <IconsLine v-if="!trx_trp.val"/>
                    <IconsCheck v-else/>
                  </div>
                </td>
                <td>
                  <div class="flex items-center justify-center">
                    <IconsLine v-if="!trx_trp.val1"/>
                    <IconsCheck v-else/>
                  </div>
                </td>
                <td class="bold">{{ trx_trp.id }}</td>
                <td>{{ trx_trp.tanggal ? $moment(trx_trp.tanggal).format("DD-MM-Y") : "" }}</td>
                <td>{{ trx_trp.xto }}</td>
                <td>{{ trx_trp.tipe }}</td>
                <td>{{ trx_trp.jenis }}</td>
                <td>{{ pointFormat(trx_trp.amount) }}</td>
                <td>{{ trx_trp.pv_no }}</td>
                <td>{{ pointFormat(trx_trp.pv_total) }}</td>

                <td>{{ trx_trp.ticket_a_no }}</td>
                <td>{{ pointFormat(trx_trp.ticket_a_bruto) }}</td>
                <td>{{ pointFormat(trx_trp.ticket_a_tara) }}</td>
                <td>{{ pointFormat(trx_trp.ticket_a_netto) }}</td>
                <td>{{ trx_trp.ticket_a_supir }}</td>
                <td>{{ trx_trp.ticket_a_no_pol }}</td>
                <td>{{ trx_trp.ticket_a_in_at ? $moment(trx_trp.ticket_a_in_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
                <td>{{ trx_trp.ticket_a_out_at ? $moment(trx_trp.ticket_a_out_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>

                <td>{{ trx_trp.ticket_b_no }}</td>
                <td>{{ pointFormat(trx_trp.ticket_b_bruto) }}</td>
                <td>{{ pointFormat(trx_trp.ticket_b_tara) }}</td>
                <td>{{ pointFormat(trx_trp.ticket_b_netto) }}</td>
                <td>{{ trx_trp.ticket_b_supir }}</td>
                <td>{{ trx_trp.ticket_b_no_pol }}</td>
                <td>{{ trx_trp.ticket_b_in_at ? $moment(trx_trp.ticket_b_in_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
                <td>{{ trx_trp.ticket_b_out_at ? $moment(trx_trp.ticket_b_out_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>

                <td>{{ trx_trp.supir }}</td>
                <td>{{ trx_trp.no_pol }}</td>
                <td>{{ trx_trp.created_at ? $moment(trx_trp.created_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
                <td>{{ trx_trp.updated_at ? $moment(trx_trp.updated_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <PopupMini :type="'delete'" :show="delete_box" :data="delete_data" :fnClose="toggleDeleteBox" :fnConfirm="confirmed_delete" />
    <!-- <trx_trpsRequested :show="popup_request" :fnClose="()=>{ popup_request = false; }" @update_request_notif="request_notif = $event"/> -->
    <FormsTrxTrp :show="forms_trx_trp_show" :fnClose="()=>{forms_trx_trp_show=false}" :id="forms_trx_trp_id" :p_data="trx_trps" :list_ujalan="list_ujalan" :list_ticket="list_ticket" :list_pv="list_pv"/>
    <FormsTrxTrpValidasi :show="forms_trx_trp_valid_show" :fnClose="()=>{forms_trx_trp_valid_show=false}" :id="forms_trx_trp_valid_id" :p_data="trx_trps"/>
  
    <div v-if="prtView" class="w-full h-full flex items-center justify-center fixed top-0 left-0 z-20 p-3"
    style="background-color: rgba(255,255,255,0.9);">
      <div class="relative" style="width:95%; height: 90%;">
        <div class="absolute -top-7 right-0 bg-white"
          style="position: absolute; padding:5px 10px; border: solid 1px #ccc; border-bottom: none; border-top-right-radius: 5px;  border-top-left-radius: 5px;">
          <IconsTimes  style="color:black; cursor:pointer;" @click="printPreview()"/>
        </div>
        <iframe ref="iframe" width='100%' height='100%' :src='pdfContent.dataBase64'></iframe>
        <div
          style="position: absolute; top: 12px; right: 98px; background-color: rgba(255,255,255,0); width: 37px; height: 36px; z-index:1; cursor: pointer;"
          @click="download()">
        </div>
      </div>
    </div>
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
      // if (!useAuthStore().checkScopes(['ap-trx_trp-view']))
      //   return navigateTo('/');
      if (!useAuthStore().checkRole(["SuperAdmin","Logistic",'PabrikTransport']))
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
  useCommonStore().loading_full = true;
  let trx_trps = [];
  let list_ujalan = [];
  let list_tipe = [];
  let list_ticket = [];
  let list_pv = [];

  const [data1, data2] = await Promise.all([
    useMyFetch("/trx_trps", {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      },
      retry: 0,
    }),
    useMyFetch("/trx_load_for_trp", {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      },
      retry: 0,
    }),
  ]);

  

  if (data1.status.value !== 'error') {
    trx_trps = data1.data.value.data;
  }

  if (data1.status.value === 'error') {
    useErrorStore().trigger(data1.error);
    return { trx_trps, list_ujalan, list_tipe, list_ticket, list_pv };
  }

  if (data2.status.value !== 'error') {
    list_ujalan = data2.data.value.list_ujalan;
    list_tipe = data2.data.value.list_tipe;
    list_ticket = data2.data.value.list_ticket;
    list_pv = data2.data.value.list_pv;
  }
  useCommonStore().loading_full = false;

  return { trx_trps, list_ujalan, list_tipe, list_ticket, list_pv };
});

const trx_trps = ref(dt_async.value.trx_trps || []);
const list_ujalan = ref(dt_async.value.list_ujalan);
const list_ticket = ref(dt_async.value.list_ticket);
const list_pv = ref(dt_async.value.list_pv);


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
  if (params.page == 1) trx_trps.value = [];
  if(params.first_row) delete params.first_row;
  if(params.page > 1){
    params.first_row = JSON.stringify(trx_trps.value[0]);
  }
  const { data, error, status } = await useMyFetch("/trx_trps", {
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
    trx_trps.value = data.value.data;
    if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    trx_trps.value = [...trx_trps.value, ...data.value.data];
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

const forms_trx_trp_show =  ref(false);
const forms_trx_trp_id = ref(0);
const form_add = () => {
  forms_trx_trp_id.value = 0;
  forms_trx_trp_show.value = true;
  // router.push({ name: 'data_trx_trp-form', query: { id: "" } });
}

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_show.value = true;
    // router.push({ name: 'data_trx_trp-form', query: { id: trx_trps.value[selected.value].id } });
  }
};

const forms_trx_trp_valid_show =  ref(false);
const forms_trx_trp_valid_id = ref(0);
const validasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_valid_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_valid_show.value = true;
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
    delete_data.value = {id : trx_trps.value[selected.value].id};
    delete_box.value = true;
  }
};

const confirmed_delete = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", trx_trps.value[selected.value].id);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/trx_trp", {
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
  trx_trps.value.splice(selected.value,1);
  selected.value = -1;
  delete_box.value = false;
}

const { downloadFile, printHtml } = useDownload();

const prtView = ref(false);
const pdfContent = ref("");

const printPreview = async()=>{
  
  if (prtView.value==true) {
    prtView.value = false;
    return;
  }

  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
    return;
  } 
  
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_trp_preview_file", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id : trx_trps.value[selected.value].id},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  // pdfContent.value = data.value;
  // prtView.value = true;

  printHtml(data.value.html,318);
}

const download = ()=>{
  downloadFile(pdfContent.value);
}
</script>