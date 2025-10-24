<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Transaction'" :fn="fnClose" class="w-full flex align-items-center" style="color:white;" />

      <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
        <div class="w-full flex flex-col items-center grow overflow-auto">
          <div class="w-full flex flex-row flex-wrap">
            <div class="w-full sm:w-3/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">Trx Trp #ID</label>
              <input v-model="extra_money_trx.prev_trx_trp_id" :disabled="disabled">
              <p class="text-red-500">{{ field_errors.prev_trx_trp_id }}</p>
            </div>
            <div class="w-6/12 sm:w-3/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">Tanggal</label>
              <div class="grow">
                <div v-if="disabled" class="card-border">
                  {{ $moment(extra_money_trx.tanggal).format("DD-MM-Y") }}
                </div>
                <div v-else>
                  <ClientOnly>
                    <vue-date-picker  v-model="extra_money_trx.tanggal" 
                    type="datetime" 
                    format="dd-MM-yyyy"
                    :enable-time-picker = "false" 
                    text-input
                    teleport-center></vue-date-picker>
                  </ClientOnly>
                </div>
              </div>
              <p class="text-red-500">{{ field_errors.tanggal }}</p>
            </div>
            <div class="w-6/12 sm:w-3/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">Payment Method</label>
              <select v-model="extra_money_trx.payment_method_id" :disabled="disabled">
                <option v-for="pm in list_payment_methods" :value="pm.id">{{pm.name}}</option>
              </select>
              <p class="text-red-500">{{ field_errors.payment_method_id }}</p>
            </div>
            <div class="w-6/12 sm:w-3/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">No Pol</label>
              <input type="text" list="vehicle"  v-model="extra_money_trx.no_pol" :disabled="disabled "/>
              <datalist id="vehicle">
                <option v-for="lv in list_vehicle" :value="lv.no_pol" >{{lv.no_pol}}</option>
              </datalist>
              <p class="text-red-500">{{ field_errors.no_pol }}</p>
            </div>

            <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
              <label for="">Pekerja</label>
              <WidthMiniList :arr="list_emp" :selected="selected_employee" :pure="selected_temp_employee" @setSelected="selected_employee=$event" :disabled="disabled"/>
              <p class="text-red-500">{{ field_errors.employee_id }}</p>
            </div>

            <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
              <label for="">Uang Tambahan</label>
              <WidthMiniList :arr="list_emo" :selected="selected_extra_money" :pure="selected_temp_extra_money" @setSelected="selected_extra_money=$event" :disabled="disabled"/>
              <p class="text-red-500">{{ field_errors.extra_money_id }}</p>
            </div>

            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">Note For Remarks</label>
              <textarea v-model="extra_money_trx.note_for_remarks" :disabled="disabled"></textarea>
              <p class="text-red-500">{{ field_errors.note_for_remarks }}</p>
            </div>
            
            <div class="p-1 w-full sm:w-full md:w-1/2 md:overflow-auto max-h-full">
              <AttachmentSingle :label="'Attachment'" :value="extra_money_trx.attachment_1_preview" @setFile="extra_money_trx.attachment_1=$event"  @setPreview="extra_money_trx.attachment_1_preview=$event" :can_remove="!disabled" :disabled="disabled"/>
            </div>

            <div class="p-1 w-full sm:w-full md:w-1/2 md:overflow-auto max-h-full">
              <AttachmentSingle :label="'Attachment'" :value="extra_money_trx.attachment_2_preview" @setFile="extra_money_trx.attachment_2=$event"  @setPreview="extra_money_trx.attachment_2_preview=$event" :can_remove="true"/>
            </div>
          </div>
        </div>
        
        <div class="w-full flex items-center justify-end">
          <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
            Cancel
          </button>
          <button type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
            Save
          </button>
        </div>
      </form>
    </div>
  </section>

</template>

<script setup>

const { $moment } = useNuxtApp()
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import { useAlertStore } from '~/store/alert';
const { pointFormat } = useUtils();


const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  fnClose: {
    type: Function,
    required: false,
  },
  
  id:{
    type: Number,
    required: false,
    default: 0,
  },
  p_data:{
    type:Array,
    required:true,
    default:[]
  },  
})

const extra_money_trx_temp = {
    id: -1,
    tanggal: new Date(),
    employee:{
      id:0,
    },
    extra_money:{
      id:0,
    },

    pv_id: -1,
    pv_no:"",
    pv_total:0,

    no_pol: '',
    note_for_remarks:"",
    cost_center_code:"",
    cost_center_desc:"",
    pvr_id:"",
    pvr_no:"",
    pvr_total:0,
    pvr_complete:"",
    payment_method_id:2,
    payment_method:{
      id:0,
      name:"",
    },
    prev_trx_trp_id:"",
    attachment_1:"",
    attachment_1_preview:"",
    attachment_2:"",
    attachment_2_preview:"",
};
let extra_money_trx_loaded = {...extra_money_trx_temp};
const extra_money_trx = ref({...extra_money_trx_temp});
const list_payment_methods = ref([]);
const token = useDynamicPathCookie('token');
const field_errors = ref({})

const doSave = async () => {

  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("tanggal", $moment(extra_money_trx.value.tanggal).format("Y-MM-DD"));  
  data_in.append("no_pol", extra_money_trx.value.no_pol);
  data_in.append("prev_trx_trp_id", extra_money_trx.value.prev_trx_trp_id);
  data_in.append("note_for_remarks", extra_money_trx.value.note_for_remarks);
  data_in.append("employee_id", selected_employee.value.id);
  data_in.append("extra_money_id", selected_extra_money.value.id);
  data_in.append("payment_method_id", extra_money_trx.value.payment_method_id);
  data_in.append("attachment_1", extra_money_trx.value.attachment_1);
  data_in.append("attachment_1_preview", extra_money_trx.value.attachment_1_preview);
  data_in.append("attachment_2", extra_money_trx.value.attachment_2);
  data_in.append("attachment_2_preview", extra_money_trx.value.attachment_2_preview);

  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/extra_money_trx", {
    method: $method,
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
    },
    body: data_in,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error, field_errors);
    return;
  }

  extra_money_trx.value.employee        = JSON.parse(JSON.stringify(selected_employee.value._raw));

  extra_money_trx.value.extra_money     = JSON.parse(JSON.stringify(selected_extra_money.value._raw));

  let pm_idx = list_payment_methods.value.map((x)=>x.id).indexOf(extra_money_trx.value.payment_method_id);
  extra_money_trx.value.payment_method  = {...list_payment_methods.value[pm_idx]};

  extra_money_trx.value.updated_at = data.value.updated_at;
  if(props.id<=0){
    extra_money_trx.value.id = data.value.id;
    extra_money_trx.value.created_at = data.value.created_at;
    props.p_data.unshift(extra_money_trx.value);
  }else{
    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>-1){
      props.p_data.splice(idx,1,{...extra_money_trx.value});    
    }
  }
  props.fnClose();
}

const selected_temp_extra_money={
  _raw:{},
  _:{
    id:{
      tcon:"IconsBaselineNumbers",
      text:"ID",
      val:"",
    },
    xto:{
      tcon:"IconsLocationOn",
      text:"Tujuan",
      val:"",
    },
    description:{
      tcon:"",
      text:"Deskripsi",
      val:"",
    },
    total:{
      tcon:"",
      text:"Total",
      val:"",
    },
  },
  id:"",
  name:"",
  title:"",
  note:""
};

const selected_temp_employee={
  _raw:{},
  _:{
    id:{
      tcon:"IconsBaselineNumbers",
      text:"ID",
      val:"",
    },
    name:{
      tcon:"IconsPerson",
      text:"Nama",
      val:"",
    },
    rek_no:{
      tcon:"IconsNumber",
      text:"No Rek",
      val:"",
    },
    rek_name:{
      tcon:"IconsCreditCard",
      text:"Nama Rek",
      val:"",
    },
  },
  id:"",
  name:"",
  title:"",
  note:""
};

const selected_employee = ref(JSON.parse(JSON.stringify(selected_temp_employee)));
const selected_extra_money = ref(JSON.parse(JSON.stringify(selected_temp_extra_money)));

const list_emp = computed(()=>{
  let results = [];
  list_employee.value.forEach((x,y)=>{
    let temp = JSON.parse(JSON.stringify(selected_temp_employee));
    temp._.id.val = x.id,
    temp._.name.val = x.name,
    temp._.rek_no.val = x.rek_no,
    temp._.rek_name.val = x.rek_name,

    temp.id = x.id,
    temp.name = x.name,
    temp.title = (x.rek_no || '')+" "+(x.rek_name || ''),

    
    temp._raw = x;
    results.push(JSON.parse(JSON.stringify(temp)));
  });
  return results;
})


const list_emo = computed(()=>{
  let results = [];
  list_extra_money.value.forEach((x,y)=>{
    let temp = JSON.parse(JSON.stringify(selected_temp_extra_money));
    temp._.id.val = x.id,
    temp._.xto.val = x.xto,
    temp._.description.val = x.description,
    temp._.total.val = pointFormat(x.total),

    temp.id = x.id,
    temp.name = x.xto,
    temp.title = (pointFormat(x.total) || '')+" "+(x.description || ''),

    
    temp._raw = x;
    results.push(JSON.parse(JSON.stringify(temp)));
  });
  return results;
})


const disabled = computed(()=>{
  return (extra_money_trx.value.val1) ? true : false;
});

const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/extra_money_trx", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id:props.id},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  let dt =data.value.data;
  extra_money_trx.value = dt;
  extra_money_trx_loaded = {...dt};
  
  selected_employee.value._raw=dt.employee;

  selected_employee.value._.id.val=dt.employee.id;
  selected_employee.value._.name.val=dt.employee.name;
  selected_employee.value._.rek_no.val=dt.employee_rek_no;
  selected_employee.value._.rek_name.val=dt.employee_rek_name;

  selected_employee.value.id=dt.employee.id;
  selected_employee.value.name=dt.employee.name;
  selected_employee.value.rek_no=(dt.employee_rek_no || '')+" "+(dt.employee_rek_name || '');

  selected_extra_money.value._raw=dt.extra_money;
  
  selected_extra_money.value._.id.val=dt.extra_money.id;
  selected_extra_money.value._.xto.val=dt.extra_money.xto;
  selected_extra_money.value._.description.val=dt.extra_money.description;
  selected_extra_money.value._.total.val=pointFormat(dt.extra_money.total);

  selected_extra_money.value.id=dt.extra_money.id;
  selected_extra_money.value.name=dt.extra_money.xto;
  selected_extra_money.value.title=(pointFormat(dt.extra_money.total) || '')+" "+(dt.extra_money.description || '');

}

const list_vehicle = ref([]);
const list_employee = ref([]);
const list_extra_money = ref([]);

const loadLocalDT = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/extra_money_trx_load_local", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  list_vehicle.value = data.value.list_vehicle;
  list_employee.value = data.value.list_employee;
  list_extra_money.value = data.value.list_extra_money;
  list_payment_methods.value = data.value.list_payment_methods;
}



watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    await loadLocalDT();

    extra_money_trx.value = {...extra_money_trx_temp};
    extra_money_trx_loaded = {...extra_money_trx_temp};
    selected_employee.value = JSON.parse(JSON.stringify(selected_temp_employee));
    selected_extra_money.value = JSON.parse(JSON.stringify(selected_temp_extra_money));

    field_errors.value = {};
    if(props.id!=0)
    callData();
  }
}, {
  immediate: true
});

</script>
