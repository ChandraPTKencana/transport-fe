<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Transaction'" :fn="fnClose" class="w-full flex align-items-center" style="color:white;" />

      <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
        <div class="w-full flex flex-col items-center grow overflow-auto">
          <div class="w-full flex flex-row flex-wrap">

            <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">Tanggal</label>
              <div class="grow">
                <ClientOnly>
                  <vue-date-picker  v-model="extra_money_trx.tanggal" 
                  type="datetime" 
                  format="dd-MM-yyyy"
                  :enable-time-picker = "false" 
                  text-input
                  teleport-center></vue-date-picker>
                </ClientOnly>
              </div>
              <p class="text-red-500">{{ field_errors.tanggal }}</p>
            </div>

            <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">No Pol</label>
              <input type="text" list="vehicle"  v-model="extra_money_trx.no_pol" :disabled="extra_money_trx.val==1"/>
              <datalist id="vehicle">
                <option v-for="lv in list_vehicle" :value="lv.no_pol" >{{lv.no_pol}}</option>
              </datalist>
              <p class="text-red-500">{{ field_errors.no_pol }}</p>
            </div>

            <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
              <label for="">Pekerja</label>
              <WidthMiniList :arr="list_emp" :selected="selected_employee" :pure="selected_temp_employee" @setSelected="selected_employee=$event"/>
              <p class="text-red-500">{{ field_errors.employee_id }}</p>
            </div>

            <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
              <label for="">Uang Tambahan</label>
              <WidthMiniList :arr="list_emo" :selected="selected_extra_money" :pure="selected_temp_extra_money" @setSelected="selected_extra_money=$event"/>
              <p class="text-red-500">{{ field_errors.extra_money_id }}</p>
            </div>

            <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
              <label for="">Note</label>
              <textarea v-model="extra_money_trx.note"></textarea>
              <p class="text-red-500">{{ field_errors.note }}</p>
            </div>


            
            <div class="w-full flex flex-wrap">

              <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">Cost Center Code</label>
                <input list="cost_center"  v-model="extra_money_trx.cost_center_code" @blur="blurCostCenterCode($event)" :disabled="extra_money_trx.pvr_no!=''">
                <datalist id="cost_center">
                  <option v-for="lcc in list_cost_center" :value="lcc.CostCenter">{{lcc.CostCenter +'-'+ lcc.Description}}</option>
                </datalist>
                <p class="text-red-500">{{ field_errors.cost_center_code }}</p>
              </div>

              <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                <label for="">Cost Center Desc</label>
                <div class="card-border disabled">
                  {{  extra_money_trx.cost_center_desc }}
                </div>
              </div>

              <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                <label for="">PVR No</label>
                <div class="card-border disabled">
                  {{  extra_money_trx.pvr_no }}
                </div>
              </div>

              <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">PVR Total</label>
                <div class="card-border disabled">
                  {{ pointFormat(extra_money_trx.pvr_total || 0) }}
                </div>
              </div>


              <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                <label for="">PV</label>
                <div class="card-border disabled">
                  {{  extra_money_trx.pv_no }}
                </div>
              </div>

              <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                <label for="">PV Amount</label>
                <div class="card-border disabled">
                  {{  pointFormat(extra_money_trx.pv_total) }}
                </div>
              </div>
            </div>


          </div>
        </div>
        
        <div class="w-full flex items-center justify-end">
          <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
            Cancel
          </button>
          <button v-if="!disabled" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
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
  fnLoadDBData: {
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
  list_cost_center:{
    type:Array,
    required:true,
    default:[]
  },
  online_status:{
    type:Boolean,
    required:true,
    default:false
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
    note:"",
    cost_center_code:"",
    cost_center_desc:"",
    pvr_id:"",
    pvr_no:"",
    pvr_total:0,
    pvr_complete:"",
};
let extra_money_trx_loaded = {...extra_money_trx_temp};
const extra_money_trx = ref({...extra_money_trx_temp});

const token = useCookie('token');
const field_errors = ref({})

const blurCostCenterCode=($e)=>{
  let val = $e.target.value;
  if(!val) {
    extra_money_trx.value.cost_center_code='';
    extra_money_trx.value.cost_center_desc="";
    return;
  }
  let match = props.list_cost_center.filter(
    (x)=>x.CostCenter == val
  );

  if(match.length==0){
    extra_money_trx.value.cost_center_code='112';
    extra_money_trx.value.cost_center_desc="Transport";
  }
}


const doSave = async () => {

  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("tanggal", $moment(extra_money_trx.value.tanggal).format("Y-MM-DD"));  
  data_in.append("cost_center_code", extra_money_trx.value.cost_center_code);
  data_in.append("online_status", props.online_status);
  data_in.append("no_pol", extra_money_trx.value.no_pol);
  data_in.append("note", extra_money_trx.value.note);
  data_in.append("employee_id", selected_employee.value.id);
  data_in.append("extra_money_id", selected_extra_money.value.id);

  
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

  extra_money_trx.value.updated_at = data.value.updated_at;
  if(props.id<=0){
    extra_money_trx.value.id = data.value.id;
    extra_money_trx.value.created_at = data.value.created_at;
    props.p_data.unshift(extra_money_trx.value);
  }else{
    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>=-1){
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
  return false;
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

  props.fnLoadDBData();
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
}



watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    await loadLocalDT();
    await props.fnLoadDBData();

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

watch(()=>extra_money_trx.value.cost_center_code, (newVal, oldVal) => {
  let $desc = "";
  if (newVal=="" || newVal){
    let dt = props.list_cost_center.filter(
      (x)=>x.CostCenter == extra_money_trx.value.cost_center_code
    );

    if(dt.length  > 0) 
    $desc = dt[0].Description;
    else if(extra_money_trx.value.cost_center_code == extra_money_trx_loaded.cost_center_code) 
    $desc = extra_money_trx_loaded.cost_center_desc;

    extra_money_trx.value.cost_center_desc = $desc;
  }
}, {
  deep:true,
  immediate: true
});



</script>
