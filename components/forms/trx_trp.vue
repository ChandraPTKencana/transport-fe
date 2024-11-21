<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Transaction'" :fn="fnClose" class="w-full flex align-items-center" style="color:white;" />

      <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
        <div class="w-full flex flex-col items-center grow overflow-auto">
          <div class="w-full flex flex-row flex-wrap">

            <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">U.Jalan Per</label>
              <div class="grow" v-if="trx_trp.val!==1">
                <ClientOnly>
                  <vue-date-picker  v-model="trx_trp.tanggal" 
                  type="datetime" 
                  format="dd-MM-yyyy"
                  :enable-time-picker = "false" 
                  text-input
                  teleport-center></vue-date-picker>
                </ClientOnly>
              </div>
              <div class="grow" v-else>
                <div class="card-border disabled" :class="trx_trp.pvr_no!='' ? 'unselectable':''">
                  {{ trx_trp.tanggal ? $moment(trx_trp.tanggal).format("DD-MM-YYYY") : "" }}
                </div>
              </div>
              <p class="text-red-500">{{ field_errors.tanggal }}</p>
            </div>

            <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">Jenis</label>
              <select v-model="trx_trp.jenis" :disabled="trx_trp.val==1">
                <option value="TBS">TBS</option>
                <option value="TBSK">TBSK</option>
                <option value="CPO">CPO</option>
                <option value="PK">PK</option>
              </select>
              <p class="text-red-500">{{ field_errors.jenis }}</p>
            </div>

            <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">Payment Method</label>
              <select v-model="trx_trp.payment_method_id" :disabled="trx_trp.val==1">
                <option v-for="pm in list_payment_methods" :value="pm.id">{{pm.name}}</option>
              </select>
              <p class="text-red-500">{{ field_errors.payment_method_id }}</p>
            </div>

            <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">No Pol</label>
              <input type="text" list="vehicle"  v-model="trx_trp.no_pol" :disabled="trx_trp.val==1"/>
              <datalist id="vehicle">
                <option v-for="lv in list_vehicle" :value="lv.no_pol" >{{lv.no_pol}}</option>
              </datalist>
              <p class="text-red-500">{{ field_errors.no_pol }}</p>
            </div>

            <div v-if="trx_trp.jenis!=''" class="w-full flex flex-wrap">
              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Uang Jalan</label>
                <WidthMiniList :arr="list_uj_mst" :selected="selected_uj" :pure="selected_mini_temp_uj" @setSelected="selected_uj=$event" :disabled="trx_trp_loaded.supir_id > 1 || trx_trp.val1==1"/>
                <p class="text-red-500">{{ field_errors.id_uj }}</p>
              </div>
            </div>

            <div v-if="selected_uj._raw?.asst_opt" class="w-full flex flex-wrap">
              <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                <label for="">Supir</label>
                <WidthMiniList :arr="list_emp" :selected="selected_supir" :pure="selected_mini_temp" @setSelected="selected_supir=$event" :disabled="trx_trp_loaded.supir_id > 1 || trx_trp.val1==1"/>
                <p class="text-red-500">{{ field_errors.supir_id }}</p>
              </div>
  
              <div v-show="selected_uj._raw?.asst_opt=='DENGAN KERNET'" class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                <label for="">Kernet</label>
                <WidthMiniList :arr="list_emp" :selected="selected_kernet" :pure="selected_mini_temp" @setSelected="selected_kernet=$event" :disabled="trx_trp_loaded.kernet_id > 1 || trx_trp.val1==1"/>
                <p class="text-red-500">{{ field_errors.kernet_id }}</p>
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

const trx_trp_temp = {
  id: -1,
  tanggal: new Date(),
  id_uj: -1,
  xto: "",
  tipe: "",
  jenis:"",
  amount: 0,
  pv_id: -1,
  pv_no:"",
  pv_total:0,

  supir_id: "",
  supir: "",
  kernet_id: "",
  kernet: "",
  no_pol: '',
  cost_center_code:"",
  cost_center_desc:"",
  pvr_id:"",
  pvr_no:"",
  pvr_total:0,
  pvr_had_detail:"",
  transition_target:"",
  transition_type:"",
  payment_method_id:2,
  payment_method:{
    id:0,
    name:"",
  },
  uj:{}
};
let trx_trp_loaded = {...trx_trp_temp};
const trx_trp = ref({...trx_trp_temp});

const token = useCookie('token');
const field_errors = ref({})

const doSave = async () => {
  
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("tanggal", $moment(trx_trp.value.tanggal).format("Y-MM-DD"));  
  data_in.append("jenis", trx_trp.value.jenis);
  data_in.append("id_uj", selected_uj.value.id);
  data_in.append("payment_method_id", trx_trp.value.payment_method_id);

  data_in.append("no_pol", trx_trp.value.no_pol);
  data_in.append("supir_id", selected_supir.value.id);
  data_in.append("kernet_id", selected_kernet.value.id);
  
  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/trx_trp", {
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

  trx_trp.value.supir           = selected_supir.value.name;
  trx_trp.value.supir_rek_no    = selected_supir.value._.rek_no.val;
  trx_trp.value.supir_rek_name  = selected_supir.value._.rek_name.val;

  trx_trp.value.kernet          = selected_kernet.value.name;
  trx_trp.value.kernet_rek_no   = selected_kernet.value._.rek_no.val;
  trx_trp.value.kernet_rek_name = selected_kernet.value._.rek_name.val;
  
  trx_trp.value.uj              = selected_uj.value._raw;
  let pm_idx = list_payment_methods.value.map((x)=>x.id).indexOf(trx_trp.value.payment_method_id);
  trx_trp.value.payment_method  = {...list_payment_methods.value[pm_idx]};

  trx_trp.value.updated_at = data.value.updated_at;
  if(props.id<=0){
    trx_trp.value.id = data.value.id;
    trx_trp.value.created_at = data.value.created_at;
    props.p_data.unshift(trx_trp.value);
  }else{
    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...trx_trp.value});    
    }
  }
  props.fnClose();
}

const list_uj = computed(()=>{
  let jenisF = trx_trp.value.jenis == 'TBSK' ? 'TBS' : trx_trp.value.jenis;
  return list_ujalan.value.filter((x)=>x.jenis==jenisF);
})

const selected_mini_temp={
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

const selected_supir = ref(JSON.parse(JSON.stringify(selected_mini_temp)));
const selected_kernet = ref(JSON.parse(JSON.stringify(selected_mini_temp)));

const list_emp = computed(()=>{
  let results = [];
  list_employee.value.forEach((x,y)=>{
    let temp = JSON.parse(JSON.stringify(selected_mini_temp));
    temp._.id.val = x.id,
    temp._.name.val = x.name,
    temp._.rek_no.val = x.rek_no,
    temp._.rek_name.val = x.rek_name,

    temp.id = x.id,
    temp.name = x.name,
    temp.title = (x.rek_no || '')+" "+(x.rek_name || ''),
    temp.note = createPotonganNote(x),

    temp._raw = x;
    results.push(JSON.parse(JSON.stringify(temp)));
  });
  return results;
})


const selected_mini_temp_uj={
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
    asst_opt:{
      tcon:"IconsPerson",
      text:"Info",
      val:"",
    },
    tipe:{
      tcon:"",
      text:"Tipe",
      val:"",
    },
    harga:{
      tcon:"IconsMoney",
      text:"Amount",
      val:"",
    },
    
  },
  id:"",
  name:"",
  title:"",
  note:""
};

const selected_uj = ref(JSON.parse(JSON.stringify(selected_mini_temp_uj)));

const set_uj_dt = (dt)=>{
  let temp = JSON.parse(JSON.stringify(selected_mini_temp_uj));
  temp._.id.val = dt.id,
  temp._.xto.val = dt.xto,
  temp._.asst_opt.val = dt.asst_opt,
  temp._.tipe.val = dt.tipe,
  temp._.harga.val = pointFormat(dt.harga),

  temp.id = dt.id,
  temp.name = dt.xto,
  temp.title = (dt.asst_opt || '')+" "+(dt.tipe || '')+" "+(pointFormat(dt.harga) || ''),
  
  temp._raw = dt;
  return temp;
}

const list_uj_mst = computed(()=>{
  let results = [];
  list_uj.value.forEach((x,y)=>{
    results.push(JSON.parse(JSON.stringify(set_uj_dt(x))));
  });
  return results;
})

const createPotonganNote = (x)=>{
  return x.potongan ? "Akan ada potong sebesar :"+useUtils().pointFormat(x.potongan.nominal_cut) : '';
  // +", Dari sisa potongan :"+useUtils().pointFormat(x.potongan.remaining_cut) : "";
}

const disabled = computed(()=>{
  return false;
  // return trx_trp.value.confirmed_by || trx_trp.value.ref_id != null;
});

const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_trp", {
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
  trx_trp.value = dt;
  trx_trp_loaded = {...dt};
  
  selected_supir.value._.id.val=dt.supir_id;
  selected_supir.value._.name.val=dt.supir;
  selected_supir.value._.rek_no.val=dt.supir_rek_no;
  selected_supir.value._.rek_name.val=dt.supir_rek_name;

  selected_supir.value.id=dt.supir_id;
  selected_supir.value.name=dt.supir;
  selected_supir.value.rek_no=(dt.supir_rek_no || '')+" "+(dt.supir_rek_name || '');

  selected_kernet.value._.id.val=dt.kernet_id;
  selected_kernet.value._.name.val=dt.kernet;
  selected_kernet.value._.rek_no.val=dt.kernet_rek_no;
  selected_kernet.value._.rek_name.val=dt.kernet_rek_name;

  selected_kernet.value.id=dt.kernet_id;
  selected_kernet.value.name=dt.kernet;
  selected_kernet.value.rek_no=(dt.kernet_rek_no || '')+" "+(dt.kernet_rek_name || '');

  selected_uj.value = set_uj_dt(dt.uj)

  let $ttl_cut_fs =0;
  let $ttl_cut_fk =0;

  dt.potongan.forEach((e)=>{
    if(e.potongan_mst.employee_id == dt.supir_id){
      $ttl_cut_fs += parseInt(e.nominal_cut);
    }
    if(e.potongan_mst.employee_id == dt.kernet_id){
      $ttl_cut_fk += parseInt(e.nominal_cut);
    }
  })

  if($ttl_cut_fs > 0 ){
    selected_supir.value.note="Telah di potong sebesar :"+useUtils().pointFormat($ttl_cut_fs);
  }
  if($ttl_cut_fk > 0 ){
    selected_kernet.value.note="Telah di potong sebesar :"+useUtils().pointFormat($ttl_cut_fk);
  }
  props.fnLoadDBData();
}

const list_ujalan = ref([]);
const list_vehicle = ref([]);
const list_employee = ref([]);
const list_payment_methods = ref([]);

const loadLocalDT = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_load_for_local", {
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

  list_ujalan.value = data.value.list_ujalan;
  list_vehicle.value = data.value.list_vehicle;
  list_employee.value = data.value.list_employee;
  list_payment_methods.value = data.value.list_payment_methods;
}



watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    await loadLocalDT();
    await props.fnLoadDBData();

    trx_trp.value = {...trx_trp_temp};
    trx_trp_loaded = {...trx_trp_temp};
    selected_supir.value = JSON.parse(JSON.stringify(selected_mini_temp));
    selected_kernet.value = JSON.parse(JSON.stringify(selected_mini_temp));
    selected_uj.value = JSON.parse(JSON.stringify(selected_mini_temp_uj));

    field_errors.value = {};
    if(props.id!=0)
    callData();
  }
}, {
  immediate: true
});

watch(()=>selected_uj.value._raw, (newVal, oldVal) => {
  if(newVal &&
    Object.keys(newVal).length === 0 &&
    newVal.constructor === Object){
      selected_supir.value = JSON.parse(JSON.stringify(selected_mini_temp));
      selected_kernet.value = JSON.parse(JSON.stringify(selected_mini_temp));
      trx_trp.value.transition_target = "";
      trx_trp.value.transition_type = "";
  } else if (newVal.asst_opt && newVal.asst_opt == 'TANPA KERNET') {
      selected_kernet.value = JSON.parse(JSON.stringify(selected_mini_temp));
      if(newVal.transition_from){
        trx_trp.value.transition_target = newVal.transition_from;
        trx_trp.value.transition_type = "From";
      }
  }
}, {
  deep:true,
  immediate: true
});

</script>
