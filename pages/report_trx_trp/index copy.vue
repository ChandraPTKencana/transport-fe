<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'Report Transaction'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex">
        <!-- <button type="button" name="button" class="m-1 text-2xl "
          @click="pdfPreview()">
          <IconsPrinterEye />
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
          @click="downloadExcel()">
          <IconsTable2Column />
        </button> -->

        <div class="flex flex-wrap p-1">
          <button type="button" name="button" class="m-1 text-2xl flex items-center "
            @click="pdfPreview('reportSusutPDF')">
            <IconsPrinterEye /> <span class="text-xs ml-1"> PDF </span>
          </button>
          <button type="button" name="button" class="m-1 text-2xl flex items-center "
            @click="downloadExcel('reportSusutExcel')">
            <IconsTable2Column />  <span class="text-xs ml-1"> Excel </span>
          </button>
        </div>

        <!-- <div class="flex flex-wrap p-1">
          <button type="button" name="button" class="m-1 text-2xl flex items-center "
            @click="pdfPreview('reportPVPDF')">
            <IconsPrinterEye /> <span class="text-xs ml-1"> PV </span>
          </button>
          <button type="button" name="button" class="m-1 text-2xl flex items-center "
            @click="downloadExcel('reportPVExcel')">
            <IconsTable2Column />  <span class="text-xs ml-1"> PV </span>
          </button>
        </div> -->

        <!-- <button type="button" name="button" class="m-1 text-2xl "
          @click="lookUj()">
          <IconsEyes />
        </button> -->
      </div>

      <!-- <form action="#" class="w-full flex flex-wrap text-xs">
        <div class="w-6/12 p-1 sm:w-4/12 md:w-3/12 lg:w-2/12 flex flex-col">
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
        <div class="w-6/12 p-1 sm:w-4/12 md:w-3/12 lg:w-2/12 flex flex-col">
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
        <div class="w-6/12 p-1 sm:w-4/12 md:w-2/12 lg:w-4/12 flex flex-col">
          <div class="font-bold"> Keyword </div>
          <input class="flex-grow" type="text" v-model="search" name="search"
            placeholder="Keyword">
        </div>
        <div class="w-6/12 p-1 sm:w-4/12 md:w-1/12 lg:w-2/12 flex flex-col">
          <div class="font-bold"> Sort By </div>
          <select class="flex-grow" v-model="sort.field">
            <option value=""></option>
            <option value="id">ID</option>
            <option value="xto">To</option>
            <option value="jenis">Jenis</option>
            <option value="tipe">Tipe</option>
          </select>
        </div>
        <div class="w-6/12 p-1 sm:w-4/12 md:w-2/12 lg:w-1/12 flex flex-col">
          <div class="font-bold"> Sort Order </div>
          <select class="flex-grow" v-model="sort.by">
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <div class="w-2/12 md:w-1/12 lg:w-1/12 p-1 flex items-end">
          <button class="" type="submit" name="button" @click.prevent="searching()">
            <IconsSearch class="text-2xl" />
          </button>
        </div>
      </form> -->
      <TableView :thead="fields_thead" :selected="selected" @setSelected="selected = $event" :tbody="trx_trps" :fnCallData="callData" :scrolling="scrolling" @setScrollingPage="scrolling.page=$event" @doFilter="searching()">
        <template #[`status`]="{item}">
          <div class="text-white text-xs px-2 py-1 rounded-lg" :class="checkStatus(item) ? 'bg-green-600' : 'bg-red-600' ">
            {{checkStatus(item) ? "Done" : "Not Done" }}
          </div>
        </template>
        <template #[`val`]="{item}">
          <IconsLine v-if="!item.val"/>
          <IconsCheck v-else/>
        </template>
        <template #[`val1`]="{item}">
          <IconsLine v-if="!item.val1"/>
          <IconsCheck v-else/>
        </template>
        <template #[`pvr_had_detail`]="{item}">
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
          <IconsTimes  style="color:black; cursor:pointer;" @click="pdfPreview()"/>
        </div>
        <iframe ref="iframe" width='100%' height='100%' :src='pdfContent.dataBase64'></iframe>
        <div
          style="position: absolute; top: 12px; right: 88px; background-color: rgba(255,255,255,0); width: 37px; height: 36px; z-index:1; cursor: pointer;"
          @click="download()">
        </div>
      </div>
    </div>  


    <div v-show="pop_show" class="w-full h-full fixed top-0 left-0 bg-gray-100 bg-opacity-80 flex items-center justify-center z-10">
      <div class="w-full sm:w-10/12 md:w-8/12 lg:w-6/12 bg-white flex flex-col border-solid border-gray-200 max-w-full max-h-full" style="border-width: 1px;">
        <HeaderPopup :title="'Detail Information'" :fn="()=>{pop_show = false, show_confirm = false}" class="w-100 flex align-items-center"
          style="color:white;" />
        <div class="p-1 flex flex-wrap overflow-auto items-start">
          <div class="w-full sm:w-1/2  flex flex-wrap">
            <div class="flex flex-col m-2">
              <span class="text-xs">
                To
              </span>
              <div class="">
                {{ ujalan.xto }}
                <!-- {{ $moment(trx_trp.tanggal).format("DD-MM-YYYY") }} -->
              </div>
            </div>
  
            <div class="flex flex-col m-2">
              <span class="text-xs">
                Tipe
              </span>
              <div class="">
                {{ ujalan.tipe }}
              </div>
            </div>
  
            <div class="flex flex-col m-2">
              <span class="text-xs">
                Jenis
              </span>
              <div class="">
                {{ ujalan.jenis }}
              </div>
            </div>

  
            <!-- <div class="flex flex-col m-2">
              <span class="text-xs">
                Harga
              </span>
              <div class="">
                {{pointFormat(total_harga) }}
              </div>
            </div> -->
  
            <div class="flex flex-col m-2">
              <span class="text-xs">
                Ket. Untuk Remarks
              </span>
              <div class="">
                {{ ujalan.note_for_remarks }}
              </div>
            </div>
  
            
          </div>
          <div class="w-full sm:w-1/2  text-sm flex justify-center">
            <table class="border border-collapse border-black">
              <tr>
                <th colspan="4" class="bg-blue-400"> List Uang Jalan </th>
              </tr>
              <tr v-for="duj in ujalan.details">
                <td class="p-1"> {{ duj.ordinal }}. </td>
                <td class="p-1">{{ duj.xdesc }} {{ duj.qty<=1 ? '' : pointFormat(duj.qty || 0) + ' x Rp.' + pointFormat(duj.harga || 0)}}  </td>
                <td class="p-1">= Rp.</td>
                <td class="text-right p-1">{{pointFormat(duj.qty * duj.harga)}}</td>
              </tr>
              <tr class="border-t-black border-dashed" style="border-top-width:1px;">
                <th colspan="2" class="text-right">Total</th>
                <th class="p-1 text-right" >Rp.</th>
                <th class="p-1 text-right"> {{ pointFormat(ujalan.harga) }} </th>
              </tr>
            </table>
          </div>

          <div class="w-full mt-2 text-sm flex justify-center">
            <table class="border border-collapse border-black">
              <tr>
                <th colspan="5" class="bg-blue-400"> List PVR </th>
              </tr>
              <tr v-for="duj in ujalan.details2">
                <td class="p-1"> {{ duj.ordinal }}. </td>
                <td class="p-1"> {{ duj.ac_account_code }} </td>
                <td class="p-1"> {{ duj.description }} {{ duj.qty<=1 ? '' : pointFormat(duj.qty || 0) + ' x Rp.' + pointFormat(duj.amount || 0)}}  </td>
                <td class="p-1">= Rp.</td>
                <td class="text-right p-1">{{pointFormat(duj.qty * duj.amount)}}</td>
              </tr>
              <tr class="border-t-black border-dashed" style="border-top-width:1px;">
                <th colspan="2" class="text-right">Total</th>
                <th class="p-1 text-right" >Rp.</th>
                <th class="p-1 text-right"> {{ pointFormat(total_harga2) }} </th>
              </tr>
            </table>
          </div>
        </div>
        <div class="flex p-1 justify-end flex-wrap">
          <button class="rounded m-1" @click="pop_show = false"> Cancel </button>
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
  ssr: false,
  middleware: [
    function (to, from) {
      if (!useAuthStore().checkPermission('trp_trx.report.views')){
        useCommonStore().loading_full = false;
        return navigateTo('/');
      }

    },
    // 'auth',
  ],
});

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();
params.sort ="tanggal:desc";

const field_errors = ref({})

const token = useDynamicPathCookie('token');
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
},
  {
    lazy: true,        // 🔥 INI KUNCINYA
    server: false,     // 🔥 penting untuk dashboard / auth page
  });

const trx_trps = ref(dt_async.value.trx_trps || []);


// const search = ref("");
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
  let words = JSON.parse(JSON.stringify(useCommonStore()._tv.global_keyword));
  if (words != "") {
    params.like = `id:%${words}%,xto:%${words}%,jenis:%${words}%,pv_no:%${words}%,ticket_a_no:%${words}%,ticket_b_no:%${words}%,no_pol:%${words}%,supir:%${words}%,kernet:%${words}%,cost_center_code:%${words}%,cost_center_desc:%${words}%,pvr_no:%${words}%,tanggal:%${words}%,transition_target:%${words}%`;
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
  params.filter_model = JSON.stringify(useCommonStore()._tv.filter_model);
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
  useCommonStore()._tv.filter_box = false;

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

const pdfPreview = async($link="")=>{
  if (prtView.value==true) {
    prtView.value = false;
    return;
  }
  inject_params();
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_trps/"+$link, {
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

const downloadExcel = async($link="")=>{  
  inject_params();
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_trps/"+$link, {
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
  {key:"status",label:"Status",filter_on:1,sort_off:1,type:"select",select_item:['Undone','Done']},
  {key:"val",label:"App 1",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  {key:"val1",label:"App 2",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  {key:"id",label:"ID",filter_on:1,type:"number"},
  {key:"tanggal",label:"U.Jalan Per",type:'date',dateformat:"DD-MM-Y",filter_on:1,sort:{priority:1,type:"desc"}},
  {key:"no_pol",label:"No Pol",filter_on:1,type:'string'},
  {key:"xto",label:"Tujuan",filter_on:1,type:'string'},
  {key:"tipe",label:"Tipe",filter_on:1,type:'string'},
  {key:"jenis",label:"Jenis",filter_on:1,type:"select",select_item:['TBS','TBSK','CPO','PK']},
  {key:"amount",label:"Amount",class:" justify-end",filter_on:1,type:"number"},
  {key:"cost_center",label:"Cost Center",childs:[
    {key:"cost_center_code",label:"Code", class:" justify-start",filter_on:1,type:'string'},
    {key:"cost_center_desc",label:"Desc",filter_on:1,type:'string'},
  ]},
  {key:"pvr",label:"PVR",childs:[
    {key:"pvr_no",label:"No",filter_on:1,type:'string'},
    {key:"pvr_total",label:"Total",filter_on:1,type:'number'},
    {key:"pvr_had_detail",label:"Completed",filter_on:1,type:"select",select_item:[{k:'1',v:'Completed'},{k:'0',v:'Uncompleted'}]},
  ]},
  {key:"pv",label:"PV",childs:[
    {key:"pv_datetime",label:"Date",type:'date',dateformat:"DD-MM-Y",filter_on:1},
    {key:"pv_no",label:"No",filter_on:1,type:'string'},
    {key:"pv_total",label:"Total",filter_on:1,type:'number'},
  ]},
  {key:"transition_target",label:"Peralihan",filter_on:1,type:"select",select_item:useCommonStore().list_pabrik},
  {key:"ticket_a",label:"Ticket A",childs:[
    {key:"ticket_a_no",label:"No",filter_on:1,type:'string'},
    {key:"ticket_a_bruto",label:"Bruto",filter_on:1,type:'number'},
    {key:"ticket_a_tara",label:"Tara",filter_on:1,type:'number'},
    {key:"ticket_a_netto",label:"Netto",filter_on:1,type:'number'},
    {key:"ticket_a_supir",label:"Supir",filter_on:1,type:'string'},
    {key:"ticket_a_no_pol",label:"No Pol",filter_on:1,type:'string'},
    {key:"ticket_a_in_at",label:"In At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
    {key:"ticket_a_out_at",label:"Out At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  ]},
  {key:"ticket_b",label:"Ticket B",childs:[
    {key:"ticket_b_no",label:"No",filter_on:1,type:'string'},
    {key:"ticket_b_bruto",label:"Bruto",filter_on:1,type:'number'},
    {key:"ticket_b_tara",label:"Tara",filter_on:1,type:'number'},
    {key:"ticket_b_netto",label:"Netto",filter_on:1,type:'number'},
    {key:"ticket_b_supir",label:"Supir",filter_on:1,type:'string'},
    {key:"ticket_b_no_pol",label:"No Pol",filter_on:1,type:'string'},
    {key:"ticket_b_in_at",label:"In At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
    {key:"ticket_b_out_at",label:"Out At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
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
  {key:"supir",label:"Supir",filter_on:1,type:'string'},
  {key:"kernet",label:"Kernet",filter_on:1,type:'string'},
  {key:"created_at",label:"Created At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"updated_at",label:"Updated At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
]);

const calculateSusut=(a,b)=>{
  a = parseFloat(a) || 0;
  b = parseFloat(b) || 0;
  
  let diff=parseFloat(b-a);
  let bigger = diff > 0 ? b : a;

  if(bigger==0) return 0;
  let result = useUtils().round(diff / a * 100,2);
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



const pop_show =  ref(false);

const ujalan_temp = {
    id: -1,
    xto: "",
    tipe: "",
    // status: "Y",
    jenis: "",
    harga:0,
    note_for_remarks:"",
    details: [],
    details2: [],
};

const ujalan = ref({...ujalan_temp});
const lookUj = async()=>{
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } 

  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/ujalan_", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id:trx_trps.value[selected.value].id_uj},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error, field_errors);
    return;
  }
  ujalan.value = data.value.data;
  
  pop_show.value = true;  
}


const total_harga2 = computed(()=>{
  let temp = 0;
  ujalan.value.details2.forEach(e => {
    if(e.p_status!="Remove")
    temp += e.qty * e.amount;
  });
  return temp;
})
</script>