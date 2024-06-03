<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Transaction'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">
              
              <div class="w-full sm:w-3/12 flex px-2 py-3">                
                <div class="w-full flex flex-wrap ring-1 ring-gray-500 p-2 relative">
                  
                  <div class="absolute bg-white -top-3"> Peralihan </div>
                  
                  <div class="w-6/12 flex flex-col flex-wrap p-1">
                    <label for="">Tujuan</label>
                    <select v-model="standby_trx.transition_target">
                      <option value=""></option>
                      <option value="KPN">KPN</option>
                      <option value="KAS">KAS</option>
                      <option value="KUS">KUS</option>
                      <option value="ARP">ARP</option>
                      <option value="KAP">KAP</option>
                      <option value="SMP">SMP</option>
                    </select>
                    <p class="text-red-500">{{ field_errors.transition_target }}</p>
                  </div>

                  <div class="w-6/12 flex flex-col flex-wrap p-1">
                    <label for="">Tipe</label>
                    <select v-model="standby_trx.transition_type" :disabled="standby_trx.pvr_no!=''">
                      <option value=""></option>
                      <option value="From">Dari</option>
                      <option value="To">Ke</option>
                    </select>
                    <p class="text-red-500">{{ field_errors.transition_type }}</p>
                  </div>

                </div>
              </div>


              <div class="w-full sm:w-9/12 flex px-2 py-3">                
                <div class="w-full flex flex-wrap ring-1 ring-gray-500 p-2 relative">
                  
                  <div class="absolute bg-white -top-3"> Standby </div>

                  <div class="w-6/12 sm:w-2/12 flex flex-col flex-wrap p-1">
                    <label for="">ID</label>
                    <input type="text" list="standby_mst"  v-model="standby_trx.standby_mst_id" :disabled="standby_trx.pvr_no!=''"/>
                    <datalist id="standby_mst">
                      <option v-for="lsm in list_standby_mst" :value="lsm.id" >{{lsm.name +'-'+ lsm.tipe + '-' + pointFormat(lsm.amount || 0)}}</option>
                    </datalist>
                    <p class="text-red-500">{{ field_errors.standby_mst_id }}</p>
                  </div>
    
                  <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                    <label for="">Name</label>
                    <div class="card-border disabled">
                      {{ standby_trx.standby_mst_?.name }}
                    </div>
                  </div>
    
                  <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                    <label for="">Type</label>
                    <div class="card-border disabled">
                      {{ standby_trx.standby_mst_?.tipe }}
                    </div>
                  </div>
    
                  <div class="w-6/12 sm:w-2/12 flex flex-col flex-wrap p-1">
                    <label for="">Amount</label>
                    <div class="card-border disabled">
                      {{ pointFormat(standby_trx.standby_mst_?.amount) }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="w-full flex flex-wrap">
                <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                  <label for="">Supir</label>
                  <input type="text" list="supir"  v-model="standby_trx.supir" :disabled="standby_trx.pvr_no!=''"/>
                  <datalist id="supir">
                    <option v-for="lk in list_supir" :value="lk.name" >{{lk.name}}</option>
                  </datalist>
                  <p class="text-red-500">{{ field_errors.supir }}</p>
                </div>
  
                <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                  <label for="">Kernet</label>
                  <input type="text" list="kernet"  v-model="standby_trx.kernet" :disabled="standby_trx.pvr_no!=''"/>
                  <datalist id="kernet">
                    <option v-for="lk in list_kernet" :value="lk.name" >{{lk.name}}</option>
                  </datalist>
                  <p class="text-red-500">{{ field_errors.kernet }}</p>
                </div>
  
                <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                  <label for="">No Pol</label>
                  <input type="text" list="vehicle"  v-model="standby_trx.no_pol" :disabled="standby_trx.pvr_no!=''"/>
                  <datalist id="vehicle">
                    <option v-for="lv in list_vehicle" :value="lv.no_pol" >{{lv.no_pol}}</option>
                  </datalist>
                  <p class="text-red-500">{{ field_errors.no_pol }}</p>
                </div>
            
                <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                  <label for="">Tujuan</label>
                  <input type="text" list="xto"  v-model="standby_trx.xto" :disabled="standby_trx.pvr_no!=''"/>
                  <datalist id="xto">
                    <option v-for="lx in list_xto" >{{lx}}</option>
                  </datalist>
                  <p class="text-red-500">{{ field_errors.xto }}</p>
                </div>
  
                <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                  <label for="">Note For Remarks</label>
                  <textarea v-model="standby_trx.note_for_remarks" :disabled="standby_trx.pvr_no!=''"> </textarea>
                  <p class="text-red-500">{{ field_errors.note_for_remarks }}</p>
                </div>
                <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                  <label for="">Referensi</label>
                  <input type="text" v-model="standby_trx.ref" :disabled="standby_trx.pvr_no!=''"/>
                  <p class="text-red-500">{{ field_errors.ref }}</p>
                </div>
              </div>


              <div class="w-full sm:w-6/12 md:w-6/12 lg:w-4/12 flex px-2 py-3">                
                <div class="w-full flex flex-wrap ring-1 ring-gray-500 p-2 relative">
                  <div class="absolute bg-white -top-3"> Cost Center </div>
                  <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                    <label for=""> Code</label>
                    <input list="cost_center"  v-model="standby_trx.cost_center_code" :disabled="standby_trx.pvr_no!=''">
                    <datalist id="cost_center">
                      <option v-for="lcc in list_cost_center" :value="lcc.CostCenter">{{lcc.CostCenter +'-'+ lcc.Description}}</option>
                    </datalist>
                    <p class="text-red-500">{{ field_errors.cost_center_code }}</p>
                  </div>

                  <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                    <label for="">Desc</label>
                    <div class="card-border disabled">
                      {{  standby_trx.cost_center_desc }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="w-full sm:w-6/12 md:w-6/12 lg:w-4/12 flex px-2 py-3">                
                <div class="w-full flex flex-wrap ring-1 ring-gray-500 p-2 relative">
                  <div class="absolute bg-white -top-3"> PVR </div>
                    <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                    <label for="">No</label>
                    <div class="card-border disabled">
                      {{  standby_trx.pvr_no }}
                    </div>
                  </div>

                  <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                    <label for="">Total</label>
                    <div class="card-border disabled">
                      {{ pointFormat(standby_trx.pvr_total || 0) }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="w-full sm:w-6/12 md:w-6/12 lg:w-4/12 flex px-2 py-3">                
                <div class="w-full flex flex-wrap ring-1 ring-gray-500 p-2 relative">
                  <div class="absolute bg-white -top-3"> PV </div>
                  
                  <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                    <label for="">No</label>
                    <div class="card-border disabled">
                      {{ standby_trx.pv_no }}
                    </div>
                  </div>

                  <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                    <label for="">Total</label>
                    <div class="card-border disabled">
                      {{  pointFormat(standby_trx.pv_total) }}
                    </div>
                  </div>
                  
                </div>
              </div>

              <div class="w-full flex grow p-1 overflow-auto 2xl:overflow-hidden justify-between flex-wrap">
                <div class="w-full" role="sticky">
                  <table class="tacky w-full !table-auto" style="white-space:normal;">
                    <thead >
                      <tr class="sticky -top-1 !z-[2]">
                        <td :colspan="!disabled  ? 4 : 3" class="!bg-slate-800 text-white font-bold">
                          Detail Transaction
                        </td>
                      </tr>
                      <tr class="sticky top-7 !z-[2]">
                        <th v-if="!disabled" class="!min-w-[30px] !w-[30px] !max-w-[30px] ">
                          <!-- <button type="button" name="button" class="bg-yellow-600" @click="insertDefault()">
                            In
                          </button> -->
                        </th> 
                        <th class="!min-w-[50px] !w-[50px] !max-w-[50px] ">No</th>
                        <th class="!min-w-[150px] !w-[150px] !max-w-[150px] ">Tanggal</th>
                        <th class="!min-w-[200px] !w-[200px] !max-w-[200px] ">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody ref="to_move">
                      <template v-for="(detail, index) in details" :key="index">
                        <!-- <tr v-if="detail.p_status!='Remove'"  :data-index="index" draggable="true" @dragstart="handleDragStart($event,index)" @dragover.prevent @drop="handleDrop($event,index)"> -->
                        <tr v-if="detail.p_status!='Remove'"  :data-index="index">
                          <td v-if="!disabled" class="tools cell">
                            <div class="w-full h-full flex items-center justify-center">
                              <button  type="button" name="button"
                                @click="showAction($event, index)">
                                <IconsTools />
                              </button>
                            </div>
                          </td>
                          <td>{{ index + 1 }}.</td>
                          <td class="cell">
                            <div class="w-full h-full flex items-center justify-center relative">
                              <ClientOnly>
                                  <vue-date-picker  v-model="detail.tanggal" 
                                  type="datetime" 
                                  format="dd-MM-yyyy"
                                  :enable-time-picker = "false" 
                                  text-input
                                  teleport-center></vue-date-picker>
                                </ClientOnly>
                            </div>
                          </td>
                          <td class="cell">
                            <div class="w-full h-full flex items-center justify-center">
                              <textarea :disabled="disabled" class="p-1 w-full" v-model="detail.note" cols="7" rows="2"></textarea>
                            </div>
                          </td>
                        </tr>
                      </template>
                      
                      <tr v-if="!disabled">
                        <td class="tools cell">
                          <button type="button" name="button" @click="addList()">
                            <IconsPlus />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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

  <ToolsPopup :show="tools_popup" :coor="coor" :fn="closeToolsPopup" :data="details" :data_index="row" @replyAct="replyAction($event)" />

</template>

<script setup>

const { $moment } = useNuxtApp()
import { storeToRefs } from 'pinia';

import { useAuthStore } from '~/store/auth';
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

const standby_trx_temp = {
    id: -1,
    transition_target:"",
    transition_type:"",

    standby_mst_id: "",
    standby_mst_:{
      name: "",
      tipe: "",
      amount:0,
    },

    supir: "",
    kernet: "",
    no_pol: '',
    xto: "",
    note_for_remarks: "",
    ref: "",
    
    cost_center_code:"",
    cost_center_desc:"",

    pvr_id: "",
    pvr_no:"",
    pvr_total:0,
    pvr_had_detail:0,

    pv_id: "",
    pv_no:"",
    pv_total:0,
    pv_datetime:"",

    rv_id: "",
    rv_no:"",
    rv_total:0,
    rv_had_detail:"",

    details: [],

};
const details = ref([]);

const detail = ref({
  ordinal:0,
  id:"",
  tanggal: new Date(),
  note:"",
  p_status:""
});

let standby_trx_loaded = {...standby_trx_temp};
const standby_trx = ref({...standby_trx_temp});

const token = useCookie('token');
const field_errors = ref({})

const { display } = useAlertStore();

const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("transition_target", standby_trx.value.transition_target);
  data_in.append("transition_type", standby_trx.value.transition_type);
  data_in.append("standby_mst_id", standby_trx.value.standby_mst_id);
  
  data_in.append("supir", standby_trx.value.supir);
  data_in.append("kernet", standby_trx.value.kernet);
  data_in.append("no_pol", standby_trx.value.no_pol);

  data_in.append("xto", standby_trx.value.xto);
  data_in.append("note_for_remarks", standby_trx.value.note_for_remarks);
  data_in.append("ref", standby_trx.value.ref);
  data_in.append("cost_center_code", standby_trx.value.cost_center_code);

  data_in.append("online_status", props.online_status);

  let tDetails = [...details.value];
  tDetails = tDetails.map(x=>{
    x.tanggal = $moment(x.tanggal).format("Y-MM-DD")
    return x;
  });
  data_in.append("details", JSON.stringify(tDetails));
  
  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/standby_trx", {
    method: $method,
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json',
      // "Content-Type": "multipart/form-data",
    },
    body: data_in,
    retry: 0,
    // server: true
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error, field_errors);
    return;
  }


  standby_trx.value.updated_at = data.value.updated_at;
  if(props.id<=0){
    standby_trx.value.id = data.value.id;
    standby_trx.value.created_at = data.value.created_at;
    props.p_data.unshift(standby_trx.value);
  }else{
    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...standby_trx.value});    
    }
  }
  props.fnClose();
}

const list_supir = computed(()=>{
  return [...new Set(list_employee.value.filter((x)=>x.role=="Supir"))];
})

const list_kernet = computed(()=>{
  return [...new Set(list_employee.value.filter((x)=>x.role=="Kernet"))];
})

const disabled = computed(()=>{
  return false;
  // return standby_trx.value.confirmed_by || standby_trx.value.ref_id != null;
});

const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/standby_trx", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    params: {id:props.id},
    // body: {
    //   sort: "updated_at:desc"
    // },
    retry: 0,
    // server: true
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  standby_trx.value = data.value.data;
  standby_trx_loaded = {...data.value.data};

  let p_status = "Edit";
  details.value = data.value.data.details.map((x)=>{
    x["p_status"]= p_status;
    x["key"] = x["ordinal"];
    return x;
  });

}

const list_standby_mst = ref([]);
const list_xto = ref([]);
const list_vehicle = ref([]);
const list_employee = ref([]);

const loadLocalDT = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/standby_trx_load_local", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      // 'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // params: {id:props.id},
    // body: {
    //   sort: "updated_at:desc"
    // },
    retry: 0,
    // server: true
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  list_standby_mst.value = data.value.list_standby_mst;
  list_xto.value = data.value.list_xto;
  list_vehicle.value = data.value.list_vehicle;
  list_employee.value = data.value.list_employee;
}
const row = ref(-1);
const tools_popup = ref(false);
const coor = ref({
  left:0,
  top:0
});
const showAction=(e, index)=>{
  row.value = index;
  tools_popup.value = true;
  coor.value = { left: e.clientX, top: e.clientY };
};

const addList=()=>{
  details.value.push({
    ...detail.value,
    p_status: "Add",
    // item: { ...this.item },
  });
};
const closeToolsPopup=()=>{
  tools_popup.value = false;
};

const replyAction=(act = "")=>{
  if (act == "insert") {
    details.value.splice(row.value, 0, {
      ...detail.value,
      p_status: "Add",
      // item: { ...this.item },
    });
  } else if (act == "delete") {
    // let item_id = details.value[row.value].key;
    // let el_index = exclude_lists.value.indexOf(item_id);
    // if (el_index > -1)
    //   exclude_lists.value.splice(el_index, 1);

    if (details.value[row.value].p_status == "Edit")
      details.value[row.value].p_status = "Remove";
    else
      details.value.splice(row.value, 1);
    
  } else if(act=="move_top"){
    let old = details.value[row.value];
    details.value.splice(row.value,1);
    details.value.splice(row.value - 1,0,{...old});
  } else if(act=="move_bottom"){
    let old = details.value[row.value];
    details.value.splice(row.value,1);
    details.value.splice(row.value + 1,0,{...old});
  }
  tools_popup.value = false;
};

watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    await loadLocalDT();
    await props.fnLoadDBData();
    field_errors.value = {};
    standby_trx.value = {...standby_trx_temp};
      details.value = [];

    if(props.id!=0)
      callData();
  }
}, {
  immediate: true
});

let temp_standby_mst_={
  name: "",
  tipe: "",
  amount:0,
};

watch(()=>standby_trx.value.standby_mst_id, (newVal, oldVal) => {

  if (newVal=="" || newVal!=""){
    let filters = list_standby_mst.value.filter( x =>x.id == newVal );
    if(filters.length  > 0) {
      standby_trx.value.standby_mst_    = {...filters[0]};
    }
    else if(standby_trx.value.standby_mst_id == standby_trx_loaded.standby_mst_id) {
      standby_trx.value.standby_mst_    = {...standby_trx_loaded.standby_mst_};
    }else{
      standby_trx.value.standby_mst_= {...temp_standby_mst_};
    }
  }
}, {
  // deep:true,
  // immediate: true
});

watch(()=>standby_trx.value.cost_center_code, (newVal, oldVal) => {
  let $desc = "";

  if(newVal==""){
    standby_trx.value.cost_center_desc = "";
  }

  if (newVal){
    let dt = props.list_cost_center.filter(
      (x)=>x.CostCenter == newVal
    );

    if(dt.length  > 0) 
    standby_trx.value.cost_center_desc = dt[0].Description;
    else if(standby_trx.value.cost_center_code == standby_trx_loaded.cost_center_code) 
    standby_trx.value.cost_center_desc = standby_trx_loaded.cost_center_desc;
  }
}, {
  deep:true,
  immediate: true
});

</script>
<style scoped="">
/* table.sticky thead th:nth-child(2) {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
}

table.sticky thead tr {
  top: 0;
} */

.box-fixed {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0px;
  left:0px;
}

.box-fixed>div {
  width: 95%;
  height: 95%;
  background-color: white;
  border: solid 1px #ccc;
  display: flex;
  flex-direction: column;
}
</style>
