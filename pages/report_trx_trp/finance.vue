<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Transaction'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex justify-between flex-wrap">
        <div class="grow flex">
          <div class="m-1">
            <select class="" v-model="filter_status" >
              <option value="pv_not_done">Undone</option>
              <option value="pv_done">Done</option>
              <option value="deleted">Trash</option>
              <option value="all">All</option>
              <option value="req_deleted">Req Delete</option>
            </select>
          </div>

          <button type="button" name="button" class="m-1 text-2xl flex items-center "
            @click="pdfPreview()">
            <IconsPrinterEye /> <span class="text-xs ml-1"> PDF </span>
          </button>
          <button type="button" name="button" class="m-1 text-2xl flex items-center "
            @click="downloadExcel()">
            <IconsTable2Column />  <span class="text-xs ml-1"> Excel </span>
          </button>
          <button type="button" name="button" class="m-1 text-2xl "
            @click="lookUj()">
            <IconsEyes />
          </button>
        </div>
      </div>

      <TableView :thead="fields_thead" :selected="selected" @setSelected="selected = $event" :tbody="trx_trps" :fnCallData="callData" :scrolling="scrolling" @setScrollingPage="scrolling.page=$event" @doFilter="searching()">
        <template #[`absen`]="{item,index}">
          <IconsImage v-if="item.trx_absens && item.trx_absens.length > 0" class="cursor-pointer" @click="form_absen(index)"/>
        </template>
        <template #[`val`]="{item}">
          <IconsLine v-if="!item.val"/>
          <IconsCheck v-else/>
        </template>
        <template #[`val1`]="{item}">
          <IconsLine v-if="!item.val1"/>
          <IconsCheck v-else/>
        </template>
        <template #[`val2`]="{item}">
          <IconsLine v-if="!item.val2"/>
          <IconsCheck v-else/>
        </template>
        <template #[`val3`]="{item}">
          <IconsLine v-if="!item.val3"/>
          <IconsCheck v-else/>
        </template>
        <template #[`val4`]="{item}">
          <IconsLine v-if="!item.val4"/>
          <IconsCheck v-else/>
        </template>
        <template #[`val5`]="{item}">
          <IconsLine v-if="!item.val5"/>
          <IconsCheck v-else/>
        </template>
        <template #[`payment_method_name`]="{item}">
          {{ item.payment_method?.name }}
        </template>
        <template #[`pvr_had_detail`]="{item}">
          <IconsLine v-if="!item.pvr_had_detail"/><IconsCheck v-else/>
        </template>
        <template #[`deleted_by_username`]="{item}">
          {{ item.deleted_by?.username }}
        </template>
        <template #[`req_deleted_by_username`]="{item}">
          {{ item.req_deleted_by?.username }}
        </template>
      </TableView>
    </div>
  </div>

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
</template>

<script setup>
const { $moment } = useNuxtApp()

import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';

definePageMeta({
  // layout: "clear",
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

const { pointFormat } = useUtils();

const checkStatus=(data)=>{
  if(data.deleted==1) return "!bg-red-400";
  if(data.pvr_id > 0 && data.req_deleted == 1) return "!bg-yellow-300"; 
  if(data.pv_id > 0) return "!bg-blue-300"; 
  return "";
}
const addClassToTbody=(data)=>{
  data.map(e => {    
    e.class_h = checkStatus(e);
  });
  return data;
}


const filter_status = ref("pv_not_done")
watch(()=>filter_status.value,(newval)=>{
  searching();
}, {
  immediate: false
})

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();
params.sort ="tanggal:desc";

const field_errors = ref({})

const date = ref({
  from: "",
  to: "",
});

const token = useCookie('token');
const { data: dt_async } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  let trx_trps = [];

  const [data1, data2] = await Promise.all([
    useMyFetch("/trx_trps/dataFin", {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      },
      params:{filter_status},
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
    trx_trps = addClassToTbody(data1.data.value.data);
  }

  if (data1.status.value === 'error') {
    useErrorStore().trigger(data1.error);
    return { trx_trps };
  }

  useCommonStore().loading_full = false;

  return { trx_trps };
});

const trx_trps = ref(dt_async.value.trx_trps || []);

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

  params.date_from = date.value.from ? $moment(date.value.from).format("YYYY-MM-DD") : "";
  params.date_to = date.value.to ? $moment(date.value.to).format("YYYY-MM-DD") : "";
  params.filter_model = JSON.stringify(useCommonStore()._tv.filter_model);
  params.filter_status = filter_status.value;
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
  params.filter_status = filter_status.value;

  const { data, error, status } = await useMyFetch("/trx_trps/dataFin", {
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
    trx_trps.value = addClassToTbody(data.value.data);
  } else if (scrolling.value.page > 1) {
    trx_trps.value = [...trx_trps.value, ...addClassToTbody(data.value.data)];
  }
  if (data.value.data.length == 0) {
    scrolling.value.is_last_record = true;
  }
  
  useCommonStore()._tv.filter_box = false;
}

const searching = () => {
  selected.value = -1;
  scrolling.value.page = 1;
  scrolling.value.is_last_record = false;
  inject_params();
  callData();
}

const fields_thead=ref([
  {key:"no",label:"No",isai:true},
  {key:"val",label:"APP",childs:[
    {key:"val",label:"Kasir",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
    {key:"val1",label:"Mandor",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
    {key:"val2",label:"KTU/W",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
    {key:"val3",label:"Marketing",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
    {key:"val4",label:"Logistik",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
    {key:"val5",label:"SPV Logistik",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  ]},
  {key:"id",label:"ID",filter_on:1,type:"number"},
  {key:"absen",label:"Absen"},
  {key:"tanggal",label:"U.Jalan Per",type:'date',dateformat:"DD-MM-Y",filter_on:1,sort:{priority:1,type:"desc"}},
  {key:"no_pol",label:"No Pol",freeze:1,filter_on:1,type:'string'},
  {key:"xto",label:"Tujuan",filter_on:1,type:'string'},
  {key:"tipe",label:"Tipe",filter_on:1,type:'string'},
  {key:"jenis",label:"Jenis",filter_on:1,type:"select",select_item:['TBS','TBSK','CPO','PK']},
  {key:"amount",label:"Amount",class:" justify-end",filter_on:1,type:"number"},
  {key:"cost_center",label:"Cost Center",childs:[
    {key:"cost_center_code",label:"Code",type:'string', class:" justify-start",filter_on:1},
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
  {key:"supir",label:"Supir",filter_on:1,type:'string'},
  {key:"supir_rek_no",label:"No Rek Supir",filter_on:1,type:'string'},
  {key:"supir_rek_name",label:"Nama Rek Supir",filter_on:1,type:'string'},
  {key:"kernet",label:"Kernet",filter_on:1,type:'string'},
  {key:"kernet_rek_no",label:"No Rek Kernet",filter_on:1,type:'string'},
  {key:"kernet_rek_name",label:"Nama Rek Kernet",filter_on:1,type:'string'},
  {key:"payment_method_name",label:"Payment Method Name",type:'string'},
  {key:"created_at",label:"Created At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"updated_at",label:"Updated At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"deleted_by_username",label:"Deleted By",tbl_show:0},
  {key:"deleted_at",label:"Deleted At",dateformat:"DD-MM-Y HH:mm:ss", tbl_show:0,type:'datetime',filter_on:1},
  {key:"deleted_reason",label:"Deleted Reason", tbl_show:0,type:'string',filter_on:1},
  {key:"req_deleted_by_username",label:"Req Deleted By",tbl_show:0},
  {key:"req_deleted_at",label:"Req Delete At",dateformat:"DD-MM-Y HH:mm:ss", tbl_show:0,type:'datetime',filter_on:1},
  {key:"req_deleted_reason",label:"Req Delete Reason", tbl_show:0,type:'string',filter_on:1},
]);

const { downloadFile, viewFile } = useDownload();

const prtView = ref(false);
const pdfContent = ref("");

const pdfPreview = async()=>{
  if (prtView.value==true) {
    prtView.value = false;
    return;
  }
  inject_params();
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_trps/reportFinPDF", {
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
  const { data, error, status } = await useMyFetch("/trx_trps/reportFinExcel", {
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