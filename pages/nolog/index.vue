<template>
  <div class="w-full h-full flex flex-col">
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

         
          <button v-if="enabled_view" type="button" name="button" class="m-1 text-2xl "
            @click="form_view()">
            <IconsEyes/>
          </button>
        </div>
      </div>

      <TableView :thead="fields_thead" :selected="selected" @setSelected="selected = $event" :tbody="trx_trps" :fnCallData="callData" :scrolling="scrolling" @setScrollingPage="scrolling.page=$event" @doFilter="searching()">
        <template #[`absen`]="{item,index}">
          <IconsImage v-if="item.trx_absens && item.trx_absens.length > 0" class="cursor-pointer" @click="form_absen(index)"/>
        </template>
        <template #[`created_at`]="{item}">
          <div class="text-xs w-full text-center">
            {{$moment(item.created_at).format("DD-MM-YYYY")}} <br>
            {{$moment(item.created_at).format("HH:mm")}}
          </div>
        </template>
        <template #[`val`]="{item}">
          <IconsTimes v-if="!item.val"/>
          <div class="text-xs" v-else>
            {{item.val_by?.username}} <br>
            {{$moment(item.val_at).format("DD/MM")}} <br>
            {{$moment(item.val_at).format("HH:mm")}}
          </div>
        </template>
        <template #[`val1`]="{item}">
          <IconsTimes v-if="!item.val1"/>
          <div class="text-xs" v-else>
            {{item.val1_by?.username}} <br>
            {{$moment(item.val1_at).format("DD/MM")}} <br>
            {{$moment(item.val1_at).format("HH:mm")}}
          </div>
        </template>
        <template #[`val2`]="{item}">
          <IconsTimes v-if="!item.val2"/>
          <div class="text-xs" v-else>
            {{item.val2_by?.username}} <br>
            {{$moment(item.val2_at).format("DD/MM")}} <br>
            {{$moment(item.val2_at).format("HH:mm")}}
          </div>
        </template>
        <template #[`val3`]="{item}">
          <IconsCheck v-if="['TBS','TBSK'].indexOf(item.jenis) > -1"/>
          <IconsTimes v-else-if="!item.val3"/>
          <div class="text-xs" v-else>
            {{item.val3_by?.username}} <br>
            {{$moment(item.val3_at).format("DD/MM")}} <br>
            {{$moment(item.val3_at).format("HH:mm")}}
          </div>
        </template>
        <template #[`val4`]="{item}">
          <IconsTimes v-if="!item.val4"/>
          <div class="text-xs" v-else>
            {{item.val4_by?.username}} <br>
            {{$moment(item.val4_at).format("DD/MM")}} <br>
            {{$moment(item.val4_at).format("HH:mm")}}
          </div>
        </template>
        <template #[`val5`]="{item}">
          <IconsTimes v-if="!item.val5"/>
          <div class="text-xs" v-else>
            {{item.val5_by?.username}} <br>
            {{$moment(item.val5_at).format("DD/MM")}} <br>
            {{$moment(item.val5_at).format("HH:mm")}}
          </div>
        </template>
        <template #[`val6`]="{item}">
          <IconsTimes v-if="!item.val6"/>
          <div class="text-xs" v-else>
            {{item.val6_by?.username}} <br>
            {{$moment(item.val6_at).format("DD/MM")}} <br>
            {{$moment(item.val6_at).format("HH:mm")}}
          </div>
        </template>
        <template #[`uj_asst_opt`]="{item}">
          {{ item.uj?.asst_opt }}
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

    <FormsTrxTrpNolog :show="forms_trx_trp_valid_show" :fnClose="()=>{forms_trx_trp_valid_show=false}" :id="forms_trx_trp_valid_id" />
  </div>
</template>

<script setup>
const { $moment } = useNuxtApp()

import { useAuthStore } from '~/store/auth';
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';

definePageMeta({
  layout: "clear",
  middleware: [
    function (to, from) {
      // if (!useAuthStore().checkPermission('trp_trx.views')){
      //   useCommonStore().loading_full = false;
      //   return navigateTo('/');
      // }

    },
    // 'auth',
  ],
});

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

const { data: dt_async } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  let trx_trps = [];
  let pabrik_name = "";

  const [data1, data2] = await Promise.all([
    useMyFetch("/trx_trp_nologs", {
      method: 'get',
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
    pabrik_name = data1.data.value.pabrik_name;
  }

  if (data1.status.value === 'error') {
    useErrorStore().trigger(data1.error);
    return { trx_trps,pabrik_name };
  }

  useCommonStore().loading_full = false;

  return { trx_trps,pabrik_name };
});

const trx_trps = ref(dt_async.value.trx_trps || []);
const pabrik_name = ref(dt_async.value.pabrik_name || "");
const list_cost_center = ref([]);
const online_status=ref(false);


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
    params.like = `id:%${words}%,xto:%${words}%,jenis:%${words}%,pv_no:%${words}%,ticket_a_no:%${words}%,ticket_b_no:%${words}%,no_pol:%${words}%,supir:%${words}%,kernet:%${words}%,cost_center_code:%${words}%,cost_center_desc:%${words}%,pvr_no:%${words}%,tanggal:%${words}%,transition_target:%${words}%,uj_asst_opt:%${words}%`;
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

  const { data, error, status } = await useMyFetch("/trx_trp_nologs", {
    method: 'get',
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

const { display } = useAlertStore();
const forms_trx_trp_valid_show =  ref(false);
const forms_trx_trp_valid_id = ref(0);

const form_view = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_valid_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_valid_show.value = true;
  }
};

const fields_thead=ref([
  {key:"no",label:"No",isai:true},
  {key:"created_at",label:"Created At",type:'datetime',dateformat:"DD-MM-Y HH:mm",filter_on:1,class:"text-xs"},
  {key:"val",label:pabrik_name.value,childs:[
    {key:"val",label:"Kasir",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
    {key:"val1",label:"Mandor",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
    {key:"val2",label:"KTU/W",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
    {key:"val3",label:"Marketing",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
    {key:"val5",label:"SPV Logistik",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
    {key:"val6",label:"MGR Logistik",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
    {key:"val4",label:"Logistik",filter_on:1,type:"select",select_item:[{k:'1',v:'Approve'},{k:'0',v:'Unapprove'}]},
  ]},
  {key:"jenis",label:"Jenis",filter_on:1,type:"select",select_item:['TBS','TBSK','CPO','PK','LAIN']},
  {key:"id",label:"ID",filter_on:1,type:"number"},
  // {key:"absen",label:"Absen"},
  {key:"tanggal",label:"U.Jalan Per",type:'date',dateformat:"DD-MM-Y",filter_on:1,sort:{priority:1,type:"desc"}},
  {key:"no_pol",label:"No Pol",freeze:1,filter_on:1,type:'string'},
  {key:"xto",label:"Tujuan",filter_on:1,type:'string'},
  {key:"uj_asst_opt",label:"Info",filter_on:1,type:'select',select_item:['DENGAN KERNET','TANPA KERNET']},
  {key:"tipe",label:"Tipe",filter_on:1,type:'string'},
  {key:"amount",label:"Amount",class:" justify-end",filter_on:1,type:"number"},
  {key:"transition",label:"Peralihan",childs:[
    {key:"transition_type",label:"Type",type:'select', filter_on:1,select_item:['To','From']},
    {key:"transition_target",label:"Target",type:'select',filter_on:1,select_item:useCommonStore().list_pabrik},
  ]},
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
  {key:"updated_at",label:"Updated At",type:'datetime',dateformat:"DD-MM-Y HH:mm:ss",filter_on:1},
  {key:"deleted_by_username",label:"Deleted By",tbl_show:0},
  {key:"deleted_at",label:"Deleted At",dateformat:"DD-MM-Y HH:mm:ss", tbl_show:0,type:'datetime',filter_on:1},
  {key:"deleted_reason",label:"Deleted Reason", tbl_show:0,type:'string',filter_on:1},
  {key:"req_deleted_by_username",label:"Req Deleted By",tbl_show:0},
  {key:"req_deleted_at",label:"Req Delete At",dateformat:"DD-MM-Y HH:mm:ss", tbl_show:0,type:'datetime',filter_on:1},
  {key:"req_deleted_reason",label:"Req Delete Reason", tbl_show:0,type:'string',filter_on:1},
]);


const enabled_view = computed(()=>{ 
  let result = selected.value > -1;
  return result;
})

</script>