<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Transaction'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex justify-between flex-wrap">
        <div class="grow flex">
          <div class="m-1">
            <select class="" v-model="filter_status" >
              <option value="ticket_not_done">Undone</option>
              <option value="ticket_done">Done</option>
              <option value="deleted">Trash</option>
              <option value="all">All</option>
              <option value="req_deleted">Req Delete</option>
            </select>
          </div>

          <button v-if="enabled_edit" type="button" name="button" class="m-1 text-2xl "
            @click="form_edit()">
            <IconsEdit/>
          </button>
          <button v-if="selected > -1" type="button" name="button" class="m-1 text-2xl "
            @click="form_view()">
            <IconsEyes/>
          </button>
          <button  v-if="enabled_approve_void " type="button" name="button" class="m-1 text-2xl "
            @click="approveVoid()">
            <IconsVoid />
          </button>
          <button v-if="enabled_validasi" type="button" name="button" class="m-1 text-2xl "
            @click="validasi()">
            <IconsSignature />
          </button>
          
        </div>
        <div class="flex">
          <button type="button" name="button" class="m-1 text-2xl "
            @click="cogs_show=true">
            <IconsCog />
          </button>
          <div class="m-1 card-border cursor-pointer" @click="online_status = !online_status">
            <span class="text-xs">Mode</span> : <span class="font-bold" :class="online_status?'text-green-600' : 'text-red-600'">{{ online_status ? "ONLINE" : "OFFLINE" }} </span>
          </div>
        </div>
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
      

      <TableView :thead="fields_thead" :selected="selected" @setSelected="selected = $event" :tbody="trx_trps" :fnCallData="callData" :scrolling="scrolling" @setScrollingPage="scrolling.page=$event"  @doFilter="searching()">
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

        <template #[`deleted_by_username`]="{item}">
          {{ item.deleted_by?.username }}
        </template>

        <template #[`req_deleted_by_username`]="{item}">
          {{ item.req_deleted_by?.username }}
        </template>
      </TableView>
    </div>

    <PopupMini :type="'custome'" :show="req_deleted_box" :data="req_deleted_data" :fnClose="toggleReqDeleteBox" :fnConfirm="confirmedReqDeleted">      
      <template #words>
        Data akan diproses dan <b>tidak dapat dibatalkan lagi</b>, apakah Anda menyetujui permintaan penghapusan data berikut?
      </template>
    </PopupMini>
    <!-- <trx_trpsRequested :show="popup_request" :fnClose="()=>{ popup_request = false; }" @update_request_notif="request_notif = $event"/> -->
    <FormsTrxTrpTicket :show="forms_trx_trp_show" :fnClose="()=>{forms_trx_trp_show=false}" :fnLoadDBData="fnLoadDBData" :id="forms_trx_trp_id" :p_data="trx_trps" :list_ticket="list_ticket" :online_status="online_status"/>
    <FormsTrxTrpTicketValidasi :show="forms_trx_trp_valid_show" :fnClose="()=>{forms_trx_trp_valid_show=false}" :id="forms_trx_trp_valid_id" :p_data="trx_trps" :is_view="forms_trx_trp_is_view"/>
    <FormsTrxAbsen :show="forms_trx_absen_show" :fnClose="()=>{forms_trx_absen_show=false}" :index="forms_trx_absen_index" :p_data="trx_trps"/>

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

definePageMeta({
  // layout: "clear",
  middleware: [
    function (to, from) {
      // if (!useAuthStore().checkScopes(['ap-trx_trp-view']))
      //   return navigateTo('/');
      if (!useAuthStore().checkRole(["SuperAdmin","ViewOnly","Logistic",'PabrikTransport']))
      return navigateTo('/');

    },
    // 'auth',
  ],
});

const checkStatus=(data)=>{
  if(data.deleted==1) return "!bg-red-400";
  if(data.req_deleted == 1) return "!bg-yellow-300"; 
  if((["CPO","PK"].indexOf(data.jenis)>-1 && (data.ticket_a_id!="" && data.ticket_b_bruto!="" && data.ticket_b_tara!="" && data.ticket_b_netto !="" && data.ticket_b_in_at!="" && data.ticket_b_out_at!="")) ||
    (data.jenis=="TBS" && (data.ticket_a_id!="" && data.ticket_b_id!="")) ||
    (data.jenis=="TBSK" && data.ticket_b_id!="")) return "!bg-blue-300"; 
  return "";
}
const addClassToTbody=(data)=>{
  data.map(e => {    
    e.class_h = checkStatus(e);
  });
  return data;
}


const filter_status = ref("ticket_not_done")
watch(()=>filter_status.value,(newval)=>{
  fields_thead.value.map((x)=>{
    let in_list=["deleted_by_username","deleted_at","deleted_reason","req_deleted_by_username","req_deleted_at","req_deleted_reason"].indexOf(x.key) > -1;
    if(["all","deleted","req_deleted"].indexOf(newval) > -1){
      if( in_list )
        x.tbl_show =  1; 
    }else{
      if( in_list )
        x.tbl_show =  0; 
    }
    return x;
  });


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
const role = useCookie('role'); // useCookie new hook in nuxt 3
const checkRole=(list)=>{
  return (list).includes(role.value);
};
const { data: dt_async } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  let trx_trps = [];
  // let list_ticket = [];

  const [data1, data2] = await Promise.all([
    useMyFetch("/trx_trps", {
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
    // return { trx_trps, list_ticket};
    return { trx_trps };
  }

  // if (data2.status.value !== 'error') {
  //   list_ticket = data2.data.value.list_ticket;
  // }
  useCommonStore().loading_full = false;

  // return { trx_trps, list_ticket };
  return { trx_trps };
});

const trx_trps = ref(dt_async.value.trx_trps || []);
// const list_ticket = ref(dt_async.value.list_ticket);
const list_ticket = ref([]);
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

  list_ticket.value = data.value.list_ticket;
}

const sort = ref({
  field: "tanggal",
  by: "desc"
});
const selected = ref(-1);
const dt_selected = computed(()=>{  
  return trx_trps.value[selected.value];
})

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

const router = useRouter();

const forms_trx_trp_show =  ref(false);
const forms_trx_trp_id = ref(0);

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
const forms_trx_trp_is_view = ref(false);
const validasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_valid_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_valid_show.value = true;
    forms_trx_trp_is_view.value = false;
  }
};

const form_view = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_valid_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_valid_show.value = true;
    forms_trx_trp_is_view.value = true;
  }
};

const forms_trx_absen_show =  ref(false);
const forms_trx_absen_index = ref(0);
const form_absen = (index) => {
  forms_trx_absen_index.value = index;
  forms_trx_absen_show.value = true;
};

const req_deleted_data = ref({});
const req_deleted_box = ref(false);
const req_deleted_reason = ref("");
const toggleReqDeleteBox = async()=>{  
  if (req_deleted_box.value) {
    req_deleted_box.value = false;
  }
};

const approveVoid = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    req_deleted_reason.value = '';
    req_deleted_data.value = {
      id : trx_trps.value[selected.value].id, 
      "no pol":trx_trps.value[selected.value].no_pol, 
      "tujuan":trx_trps.value[selected.value].xto,
      "permintaan":trx_trps.value[selected.value].req_deleted_by?.username,
      "alasan":trx_trps.value[selected.value].req_deleted_reason,
    };
    req_deleted_box.value = true;
  }
};

const confirmedReqDeleted = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", trx_trps.value[selected.value].id);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/trx_trp_approve_req_delete", {
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

  let old = {...trx_trps.value[selected.value]};
  old['deleted'] = data.value.deleted;
  old['deleted_user'] = data.value.deleted_user;
  old['deleted_at'] = data.value.deleted_at;
  old['deleted_by'] = data.value.deleted_by;
  old['deleted_reason'] = data.value.deleted_reason;
  old['class_h'] = checkStatus(old);
  if(filter_status.value!='all'){
    trx_trps.value.splice(selected.value,1);
  }else{
    trx_trps.value.splice(selected.value,1,{...old});
  }
  selected.value = -1;
  req_deleted_box.value = false;
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


const fields_thead=ref([
  {key:"no",label:"No",isai:true},
  {key:"val",label:"App 1",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  {key:"val1",label:"App 2",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  {key:"val2",label:"App 3",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  {key:"id",label:"ID",filter_on:1,type:"number"},
  {key:"tanggal",label:"U.Jalan Per",type:'date',dateformat:"DD-MM-Y",filter_on:1,sort:{priority:1,type:"desc"}},
  {key:"no_pol",label:"No Pol",freeze:1,filter_on:1,type:'string'},
  {key:"xto",label:"Tujuan",filter_on:1,type:'string'},
  {key:"tipe",label:"Tipe",filter_on:1,type:'string'},
  {key:"jenis",label:"Jenis",filter_on:1,type:"select",select_item:['TBS','TBSK','CPO','PK']},
  {key:"amount",label:"Amount",class:" justify-end",filter_on:1,type:"number"},
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
  {key:"supir",label:"Supir",filter_on:1,type:'string'},
  {key:"kernet",label:"Kernet",filter_on:1,type:'string'},
  {key:"created_at",label:"Created At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"updated_at",label:"Updated At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"deleted_by_username",label:"Deleted By",tbl_show:0},
  {key:"deleted_at",label:"Deleted At",dateformat:"DD-MM-Y HH:mm:ss", tbl_show:0,type:'datetime',filter_on:1},
  {key:"deleted_reason",label:"Deleted Reason", tbl_show:0,type:'string',filter_on:1},
  {key:"req_deleted_by_username",label:"Req Deleted By",tbl_show:0},
  {key:"req_deleted_at",label:"Req Delete At",dateformat:"DD-MM-Y HH:mm:ss", tbl_show:0,type:'datetime',filter_on:1},
  {key:"req_deleted_reason",label:"Req Delete Reason", tbl_show:0,type:'string',filter_on:1},
]);


const enabled_edit = computed(()=>{  
  let result = selected.value > -1 
  && dt_selected.value.deleted == 0
  && dt_selected.value.req_deleted == 0
  && dt_selected.value.val2 == 0;
  return result;
})

const enabled_validasi = computed(()=>{  
  let result = !checkRole(['PabrikTransport']) 
  && selected.value > -1 
  && dt_selected.value.deleted == 0
  && dt_selected.value.req_deleted == 0
  && dt_selected.value.val2 == 0;
  return result;
})

const enabled_approve_void = computed(()=>{  
  let result = !checkRole(['PabrikTransport']) 
  && selected.value > -1 
  && dt_selected.value.deleted == 0
  && dt_selected.value.req_deleted == 1
  && dt_selected.value.val2 == 0;
  return result;
})
</script>