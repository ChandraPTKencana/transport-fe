<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Transaction'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex justify-between flex-wrap">
        <div class="grow flex">
          <button type="button" name="button" class="m-1 text-2xl "
          @click="form_add()">
          <IconsPlus />
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
          @click="form_edit()">
          <IconsEdit/>
        </button>
        <button  v-if="!checkRole(['PabrikTransport'])" type="button" name="button" class="m-1 text-2xl "
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
        <button type="button" name="button" class="m-1 text-2xl "
          @click="cogs_show=true">
          <IconsCog />
        </button>
        </div>
        <div class="flex">
          <button type="button" name="button" class="m-1 text-xs whitespace-nowrap"
            @click="generatePVR()">
            Gen/Update PVR
          </button>
          <button type="button" name="button" class="m-1 text-xs whitespace-nowrap"
            @click="updatePV()">
            Update PV
          </button>
          <div class="m-1 card-border cursor-pointer" @click="online_status = !online_status">
            <span class="text-xs">Mode</span> : <span class="font-bold" :class="online_status?'text-green-600' : 'text-red-600'">{{ online_status ? "ONLINE" : "OFFLINE" }} </span>
          </div>
        </div>
      </div>

      <form action="#" class="w-full flex p-1">
        <div >
          <div class="font-bold"> Tgl Dari </div>
          <ClientOnly>
            <vue-date-picker  v-model="date.from" 
            type="datetime" 
            format="dd-MM-yyyy" 
            :enable-time-picker = "false" 
            text-input
            teleport-center></vue-date-picker>
          </ClientOnly>
          <p class="text-red-500">{{ field_errors.date_from }}</p>
        </div>

        <div >
          <div class="font-bold"> Tgl Sampai </div>
          <ClientOnly>
            <vue-date-picker  v-model="date.to" 
            type="datetime" 
            format="dd-MM-yyyy" 
            :enable-time-picker = "false" 
            text-input
            teleport-center></vue-date-picker>
          </ClientOnly>
          <p class="text-red-500">{{ field_errors.date_to }}</p>
        </div>
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
      

      <TableView :thead="fields_thead" :selected="selected" @setSelected="selected = $event" :tbody="trx_trps" :fnCallData="callData" :scrolling="scrolling" @setScrollingPage="scrolling.page=$event">
        <template #[`status`]="{item}">
          <div class="text-white text-xs px-2 py-1 rounded-lg" :class="checkStatus(item) ? 'bg-green-600' : 'bg-red-600' ">
            {{checkStatus(item) ? "Done" : "Not Done" }}
          </div>
        </template>
        <template #[`absen`]="{item,index}">
          <IconsImage v-if="item.trx_absens && item.trx_absens.length > 0" class="cursor-pointer" @click="form_absen(index)"/>
        </template>
        <template #[`app1`]="{item}">
          <IconsLine v-if="!item.val"/>
          <IconsCheck v-else/>
        </template>
        <template #[`app2`]="{item}">
          <IconsLine v-if="!item.val1"/>
          <IconsCheck v-else/>
        </template>
        <template #[`pvr_completed`]="{item}">
          <IconsLine v-if="!item.pvr_had_detail"/><IconsCheck v-else/>
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
    <!-- <trx_trpsRequested :show="popup_request" :fnClose="()=>{ popup_request = false; }" @update_request_notif="request_notif = $event"/> -->
    <FormsTrxTrp :show="forms_trx_trp_show" :fnClose="()=>{forms_trx_trp_show=false}" :fnLoadDBData="fnLoadDBData" :id="forms_trx_trp_id" :p_data="trx_trps" :list_ticket="list_ticket" :list_pv="list_pv" :list_cost_center="list_cost_center" :online_status="online_status"/>
    <FormsTrxTrpValidasi :show="forms_trx_trp_valid_show" :fnClose="()=>{forms_trx_trp_valid_show=false}" :id="forms_trx_trp_valid_id" :p_data="trx_trps"/>
    <FormsTrxAbsen :show="forms_trx_absen_show" :fnClose="()=>{forms_trx_absen_show=false}" :index="forms_trx_absen_index" :p_data="trx_trps"/>
  
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


    <div v-if="cogs_show" class="w-full h-full flex items-center justify-center fixed top-0 left-0 z-20 p-3"
    style="background-color: rgba(255,255,255,0.9);">
      <div class="relative" style="width:95%; height: 90%;">
        <div class="absolute -top-7 right-0 bg-white"
          style="position: absolute; padding:5px 10px; border: solid 1px #ccc; border-bottom: none; border-top-right-radius: 5px;  border-top-left-radius: 5px;">
          <IconsTimes  style="color:black; cursor:pointer;" @click="cogs_show=false"/>
        </div>
        <div class="w-full h-full flex flex-col items-center justify-content-center bg-white">
          <div class="w-full p-1">
            <div class="w-full p-1 bg-gray-200">
              <div class="w-full text-blue-600 font-bold">
                Set Date For Load Data
              </div>
              <div class="w-full grid grid-cols-2 grid-rows-1 gap-1">
                
                <div class="flex flex-col flex-wrap p-1">
                  <label for="">From</label>
                  <div class="grow" >
                    <ClientOnly>
                      <vue-date-picker  v-model="loadDBData.from" 
                      type="datetime" 
                      format="dd-MM-yyyy"
                      :enable-time-picker = "false"
                      :clearable="false" 
                      text-input
                      teleport-center @closed="handleDate('from')"></vue-date-picker>
                    </ClientOnly>
                  </div>
                </div>
                
                <div class="flex flex-col flex-wrap p-1">
                  <label for="">To</label>
                    <div class="grow" >
                    <ClientOnly>
                      <vue-date-picker  v-model="loadDBData.to" 
                      type="datetime" 
                      format="dd-MM-yyyy"
                      :enable-time-picker = "false"
                      :clearable="false" 
                      text-input
                      teleport-center @closed="handleDate('to')"></vue-date-picker>
                    </ClientOnly>
                  </div>
                </div>
              </div>

            </div>

          </div>
          

        </div>
        <div
          style="position: absolute; top: 12px; right: 98px; background-color: rgba(255,255,255,0); width: 37px; height: 36px; z-index:1; cursor: pointer;"
          @click="cogs_show=false">
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
params.sort ="tanggal:desc";

const field_errors = ref({})

const date = ref({
  from: "",
  to: "",
});

const token = useCookie('token');
const role = useCookie('role'); // useCookie new hook in nuxt 3
const checkRole=(list)=>{
  return (list).includes(role.value);
};
const { data: dt_async } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  let trx_trps = [];
  // let list_ticket = [];
  // let list_pv = [];

  const [data1, data2] = await Promise.all([
    useMyFetch("/trx_trps", {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      },
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
    trx_trps = data1.data.value.data;
  }

  if (data1.status.value === 'error') {
    useErrorStore().trigger(data1.error);
    // return { trx_trps, list_ticket, list_pv };
    return { trx_trps };
  }

  // if (data2.status.value !== 'error') {
  //   list_ticket = data2.data.value.list_ticket;
  //   list_pv = data2.data.value.list_pv;
  // }
  useCommonStore().loading_full = false;

  // return { trx_trps, list_ticket, list_pv };
  return { trx_trps };
});

const trx_trps = ref(dt_async.value.trx_trps || []);
// const list_ticket = ref(dt_async.value.list_ticket);
// const list_pv = ref(dt_async.value.list_pv);
const list_cost_center = ref([]);
const list_ticket = ref([]);
const list_pv = ref([]);
const online_status=ref(false);
const fnLoadDBData = async (jenis,transition_target="") => {
  useCommonStore().loading_full = true;
  let from = loadDBData.value.from ? $moment(loadDBData.value.from).format("Y-MM-DD") : "";
  let to = loadDBData.value.to ? $moment(loadDBData.value.to).format("Y-MM-DD") : "";
  const { data, error, status } = await useMyFetch("/trx_load_for_trp", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {jenis,"online_status":online_status.value,from,to,transition_target},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  list_cost_center.value = data.value.list_cost_center;
  list_ticket.value = data.value.list_ticket;
  list_pv.value = data.value.list_pv;
}

const search = ref("");
const sort = ref({
  field: "tanggal",
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
    params.like = `id:%${search.value}%,xto:%${search.value}%,jenis:%${search.value}%,pv_no:%${search.value}%,ticket_a_no:%${search.value}%,ticket_b_no:%${search.value}%,no_pol:%${search.value}%,supir:%${search.value}%,kernet:%${search.value}%,cost_center_code:%${search.value}%,cost_center_desc:%${search.value}%,pvr_id:%${search.value}%,pvr_no:%${search.value}%,tanggal:%${search.value}%,transition_target:%${search.value}%`;
  }
  params.sort = "";
  if (sort.value.field) {
    params.sort = sort.value.field + ":" + sort.value.by;
  }

  params.date_from = date.value.from ? $moment(date.value.from).format("YYYY-MM-DD") : "";
  params.date_to = date.value.to ? $moment(date.value.to).format("YYYY-MM-DD") : "";

};



const callData = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

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
    useErrorStore().trigger(error, field_errors);
    return;
  }

  if (scrolling.value.page == 1) {
    trx_trps.value = data.value.data;
  } else if (scrolling.value.page > 1) {
    trx_trps.value = [...trx_trps.value, ...data.value.data];
  }
  if (data.value.data.length == 0) {
    scrolling.value.is_last_record = true;
  }
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

const forms_trx_absen_show =  ref(false);
const forms_trx_absen_index = ref(0);
const form_absen = (index) => {
  forms_trx_absen_index.value = index;
  forms_trx_absen_show.value = true;
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
    delete_data.value = {id : trx_trps.value[selected.value].id};
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
  data_in.append("id", trx_trps.value[selected.value].id);  
  data_in.append("deleted_reason", deleted_reason.value);  
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


const checkStatus=(data)=>{
  if(
    data.pv_id<=0 ||
    (["CPO","PK"].indexOf(data.jenis)>-1 && (data.ticket_a_id<=0 || data.ticket_b_bruto<=0 || data.ticket_b_tara<=0 || data.ticket_b_netto <=0 || data.ticket_b_in_at==""|| data.ticket_b_out_at=="")) ||
    (data.jenis=="TBS" && (data.ticket_a_id<=0 || data.ticket_b_id<=0)) ||
    (data.jenis=="TBSK" && data.ticket_b_id<=0)
  ) return 0;
  return 1;
}

const cogs_show=ref(false);

const loadDBData = ref({
  from: new Date().setDate(new Date().getDate() - 3),
  to:new Date(),
})

const handleDate = (source)=>{
  if(source=='from'){
    if(loadDBData.value.from-loadDBData.value.to>0){
      loadDBData.value.from = loadDBData.value.to;
    }
  }else{
    if(loadDBData.value.to-loadDBData.value.from<0){
      loadDBData.value.to = loadDBData.value.from;
    }
  }
}

const generatePVR = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", trx_trps.value[selected.value].id);  
  data_in.append("online_status", online_status.value);  

  const { data, error, status } = await useMyFetch("/trx_trp_do_gen_pvr", {
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
  let dt = trx_trps.value[selected.value];
  dt.pvr_id = data.value.pvr_id;
  dt.pvr_no = data.value.pvr_no;
  dt.pvr_total = data.value.pvr_total;
  dt.pvr_had_detail = data.value.pvr_had_detail;
  dt.updated_at = data.value.updated_at;

  trx_trps.value.splice(selected.value,1,{...dt});
  selected.value = -1;

  display({ show: true, status: "Success", message: "Generate Or Update PVR Done" });
}

const updatePV = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("online_status", online_status.value);  

  const { data, error, status } = await useMyFetch("/trx_trp_do_update_pv", {
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

  data.value.data.forEach(e => {
    let idx = trx_trps.value.map((x)=>x.id).indexOf(e.id);
    if(idx !== -1) {
      let dt = trx_trps.value[idx];
      dt.pv_id = e.pv_id;
      dt.pv_no = e.pv_no;
      dt.pv_total = e.pv_total;
      dt.pv_datetime = e.pv_datetime;
      dt.updated_at = e.updated_at;
      
      trx_trps.value.splice(idx,1,{...dt});
    }
    
  });


  display({ show: true, status: "Success", message: "Update PV Done" });
}

const fields_thead=ref([
  {key:"status",label:"Status"},
  {key:"app1",label:"App 1"},
  {key:"app2",label:"App 2"},
  {key:"id",label:"ID"},
  {key:"absen",label:"Absen"},
  {key:"tanggal",label:"U.Jalan Per",dateformat:"DD-MM-Y"},
  {key:"no_pol",label:"No Pol"},
  {key:"xto",label:"Tujuan"},
  {key:"tipe",label:"Tipe"},
  {key:"jenis",label:"Jenis"},
  {key:"amount",label:"Amount",class:" justify-end"},
  {key:"cost_center",label:"Cost Center",childs:[
    {key:"cost_center_code",label:"Code",type:'string', class:" justify-start"},
    {key:"cost_center_desc",label:"Desc"},
  ]},
  {key:"pvr",label:"PVR",childs:[
    {key:"pvr_no",label:"No"},
    {key:"pvr_total",label:"Total"},
    {key:"pvr_completed",label:"Completed"},
  ]},
  {key:"pv",label:"PV",childs:[
    {key:"pv_datetime",label:"Date",dateformat:"DD-MM-Y"},
    {key:"pv_no",label:"No"},
    {key:"pv_total",label:"Total"},
  ]},
  {key:"transition_target",label:"Peralihan"},
  {key:"ticket_a",label:"Ticket A",childs:[
    {key:"ticket_a_no",label:"No"},
    {key:"ticket_a_bruto",label:"Bruto"},
    {key:"ticket_a_tara",label:"Tara"},
    {key:"ticket_a_netto",label:"Netto"},
    {key:"ticket_a_supir",label:"Supir"},
    {key:"ticket_a_no_pol",label:"No Pol"},
    {key:"ticket_a_in_at",label:"In At",dateformat:"DD-MM-Y HH:mm:ss"},
    {key:"ticket_a_out_at",label:"Out At",dateformat:"DD-MM-Y HH:mm:ss"},
  ]},
    {key:"ticket_b",label:"Ticket B",childs:[
      {key:"ticket_b_no",label:"No"},
      {key:"ticket_b_bruto",label:"Bruto"},
      {key:"ticket_b_tara",label:"Tara"},
      {key:"ticket_b_netto",label:"Netto"},
      {key:"ticket_b_supir",label:"Supir"},
      {key:"ticket_b_no_pol",label:"No Pol"},
      {key:"ticket_b_in_at",label:"In At",dateformat:"DD-MM-Y HH:mm:ss"},
      {key:"ticket_b_out_at",label:"Out At",dateformat:"DD-MM-Y HH:mm:ss"},
    ]},
  {key:"supir",label:"Supir"},
  {key:"kernet",label:"Kernet"},
  {key:"created_at",label:"Created At",dateformat:"DD-MM-Y HH:mm:ss"},
  {key:"updated_at",label:"Updated At",dateformat:"DD-MM-Y HH:mm:ss"},
]);

</script>