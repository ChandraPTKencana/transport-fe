<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'Report Transaction'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex">
        <button type="button" name="button" class="m-1 text-2xl "
          @click="printPreview()">
          <IconsPrinterEye />
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
          @click="downloadExcel()">
          <IconsTable2Column />
        </button>
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
            <option value="pv_no">PV No</option>
            <option value="ticket_a_no">Ticket A No</option>
            <option value="ticket_b_no">Ticket B No</option>
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
        <template #[`susut_bruto_a`]="{item}">
          {{pointFormat(item.ticket_a_bruto)}}
        </template>
        <template #[`susut_tara_a`]="{item}">
          {{pointFormat(item.ticket_a_tara)}}
        </template>
        <template #[`susut_netto_a`]="{item}">
          {{pointFormat(item.ticket_a_netto)}}
        </template>
        <template #[`susut_bruto_b`]="{item}">
          {{pointFormat(item.ticket_b_bruto)}}
        </template>
        <template #[`susut_tara_b`]="{item}">
          {{pointFormat(item.ticket_b_tara)}}
        </template>
        <template #[`susut_netto_b`]="{item}">
          {{pointFormat(item.ticket_b_netto)}}
        </template>
        <template #[`susut_bruto_b_a`]="{item}">
          {{calculateSelisih(item.ticket_a_bruto,item.ticket_b_bruto)}}
        </template>
        <template #[`susut_tara_b_a`]="{item}">
          {{calculateSelisih(item.ticket_a_tara,item.ticket_b_tara)}}
        </template>
        <template #[`susut_netto_b_a`]="{item}">
          {{calculateSelisih(item.ticket_a_netto,item.ticket_b_netto)}}
        </template>
        <template #[`susut_bruto_b_a_persen`]="{item}">          
          {{calculateSusut(item.ticket_a_bruto,item.ticket_b_bruto)}}
        </template>
        <template #[`susut_tara_b_a_persen`]="{item}">          
          {{calculateSusut(item.ticket_a_tara,item.ticket_b_tara)}}
        </template>
        <template #[`susut_netto_b_a_persen`]="{item}">          
          {{calculateSusut(item.ticket_a_netto,item.ticket_b_netto)}}
        </template>
      </TableView>
    </div>

    <PopupMini :type="'delete'" :show="delete_box" :data="delete_data" :fnClose="toggleDeleteBox" :fnConfirm="confirmed_delete" />
  
    <div v-if="prtView" class="w-full h-full flex items-center justify-center fixed top-0 left-0 z-20 p-3"
      style="background-color: rgba(255,255,255,0.9);">
      <div class="relative" style="width:95%; height: 90%;">
        <div class="absolute -top-7 right-0 bg-white"
          style="position: absolute; padding:5px 10px; border: solid 1px #ccc; border-bottom: none; border-top-right-radius: 5px;  border-top-left-radius: 5px;">
          <IconsTimes  style="color:black; cursor:pointer;" @click="printPreview()"/>
        </div>
        <iframe ref="iframe" width='100%' height='100%' :src='pdfContent.dataBase64'></iframe>
        <div
          style="position: absolute; top: 12px; right: 88px; background-color: rgba(255,255,255,0); width: 37px; height: 36px; z-index:1; cursor: pointer;"
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
      if (!useAuthStore().checkRole(["SuperAdmin","Logistic",'Finance','Marketing', 'MIS','Accounting']))
      return navigateTo('/');

    },
    // 'auth',
  ],
});

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();
params.sort ="tanggal:desc";

const field_errors = ref({})

const token = useCookie('token');
const date = ref({
  from: "",
  to: "",
});

const { data: dt_async } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  let trx_trps = [];

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
    return { trx_trps};
  }

  useCommonStore().loading_full = false;

  return { trx_trps };
});

const trx_trps = ref(dt_async.value.trx_trps || []);


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
    params.like = `id:%${search.value}%,xto:%${search.value}%,jenis:%${search.value}%,pv_no:%${search.value}%,ticket_a_no:%${search.value}%,ticket_b_no:%${search.value}%,no_pol:%${search.value}%,supir:%${search.value}%,kernet:%${search.value}%,cost_center_code:%${search.value}%,cost_center_desc:%${search.value}%,pvr_id:%${search.value}%,pvr_no:%${search.value}%,tanggal:%${search.value}%,transition_to:%${search.value}%`;
  }
  params.sort = "";
  if (sort.value.field) {
    params.sort = sort.value.field + ":" + sort.value.by;
  }

  // params.location_id = this.data.location_id;
  //getTimezoneOffset
  params._TimeZoneOffset = new Date().getTimezoneOffset();
  //inject filter
  params.date_from = date.value.from ? $moment(date.value.from).format("YYYY-MM-DD") : "";
  params.date_to = date.value.to ? $moment(date.value.to).format("YYYY-MM-DD") : "";
};

const loadRef = ref(null);

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

const { downloadFile, viewFile } = useDownload();

const prtView = ref(false);
const pdfContent = ref("");

const printPreview = async()=>{
  if (prtView.value==true) {
    prtView.value = false;
    return;
  }
  inject_params();
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_trps_preview_file", {
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
    return;
  }
  pdfContent.value = data.value;
  prtView.value = true;
}

const downloadExcel = async()=>{  
  inject_params();
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_trps_download_excel", {
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
    return;
  }
  downloadFile(data.value);
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

const fields_thead=ref([
  {key:"status",label:"Status"},
  {key:"app1",label:"App 1"},
  {key:"app2",label:"App 2"},
  {key:"id",label:"ID"},
  {key:"tanggal",label:"U.Jalan Per",dateformat:"DD-MM-Y"},
  {key:"no_pol",label:"No Pol"},
  {key:"xto",label:"Tujuan"},
  {key:"tipe",label:"Tipe"},
  {key:"jenis",label:"Jenis"},
  {key:"amount",label:"Amount",class:" justify-end"},
  {key:"cost_center",label:"Cost Center",childs:[
    {key:"cost_center_code",label:"Code",type:'default', class:" justify-start"},
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
  {key:"transition_to",label:"Peralihan"},
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
  {key:"susut",label:"Susut",childs:[
    {key:"susut_bruto",label:"Bruto",childs:[
      {key:"susut_bruto_a",label:"Berangkat"},
      {key:"susut_bruto_b",label:"Kembali"},
      {key:"susut_bruto_b_a",label:"Selisih"},
      {key:"susut_bruto_b_a_persen",label:"%"},
    ]},
    {key:"susut_tara",label:"Tara",childs:[
      {key:"susut_tara_a",label:"Berangkat"},
      {key:"susut_tara_b",label:"Kembali"},
      {key:"susut_tara_b_a",label:"Selisih"},
      {key:"susut_tara_b_a_persen",label:"%"},
    ]},
    {key:"susut_netto",label:"Netto",childs:[
      {key:"susut_netto_a",label:"Berangkat"},
      {key:"susut_netto_b",label:"Kembali"},
      {key:"susut_netto_b_a",label:"Selisih"},
      {key:"susut_netto_b_a_persen",label:"%"},
    ]},
  ]},
  {key:"supir",label:"Supir"},
  {key:"kernet",label:"Kernet"},
  {key:"created_at",label:"Created At",dateformat:"DD-MM-Y HH:mm:ss"},
  {key:"updated_at",label:"Updated At",dateformat:"DD-MM-Y HH:mm:ss"},
]);

const calculateSusut=(a,b)=>{
  a = parseFloat(a) || 0;
  b = parseFloat(b) || 0;
  
  let diff=parseFloat(b-a);
  let bigger = diff > 0 ? b : a;

  if(bigger==0) return 0;
  let result = useUtils().round(diff / bigger * 100,2);
  if(result<0) return "("+Math.abs(result*100)/100+")";
  return result;
}

const calculateSelisih=(a,b)=>{
  a = parseFloat(a) || 0;
  b = parseFloat(b) || 0;
  
  let diff=parseFloat(b-a);
  if(diff<0) return "("+pointFormat(Math.abs(diff))+")";
  return pointFormat(diff);
}


</script>