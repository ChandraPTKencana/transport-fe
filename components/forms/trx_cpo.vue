<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Transaction CPO/PK'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Tanggal</label>
                <div class="grow" >
                  <ClientOnly>
                    <vue-date-picker  v-model="trx_cpo.tanggal" 
                    type="datetime" 
                    format="dd-MM-yyyy"
                    :enable-time-picker = "false" 
                    text-input
                    teleport-center></vue-date-picker>
                  </ClientOnly>
                </div>
                <p class="text-red-500">{{ field_errors.tanggal }}</p>
              </div>
              
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">To</label>
                <select v-model="trx_cpo.xto">
                  <option v-for="lt in list_to">{{lt}}</option>
                </select>
                <p class="text-red-500">{{ field_errors.xto }}</p>
              </div>

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Tipe</label>
                <select v-model="trx_cpo.tipe">
                  <option v-for="lt in list_tipe">{{lt}}</option>
                </select>
                <p class="text-red-500">{{ field_errors.tipe }}</p>
              </div>

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Harga</label>
                <div class="card-border">
                  {{ pointFormat(harga_dr_list) }}
                </div>
              </div>

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Tiket</label>
                <input type="text" list="ticket"  v-model="trx_cpo.ticket"/>
                <datalist id="ticket">
                  <option>Volvo</option>
                  <option>Saab</option>
                  <option>Mercedes</option>
                  <option>Audi</option>
                </datalist>
                <p class="text-red-500">{{ field_errors.ticket }}</p>
              </div>

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">PV</label>
                <input type="text" list="pv"  v-model="trx_cpo.pv"/>
                <datalist id="pv">
                  <option>Volvo</option>
                  <option>Saab</option>
                  <option>Mercedes</option>
                  <option>Audi</option>
                </datalist>
                <p class="text-red-500">{{ field_errors.pv }}</p>
              </div>

              

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Bruto</label>
                <input v-model="trx_cpo.bruto">
                <p class="text-red-500">{{ field_errors.bruto }}</p>
              </div>

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Tara</label>
                <input v-model="trx_cpo.tara">
                <p class="text-red-500">{{ field_errors.tara }}</p>
              </div>

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Netto</label>
                <input v-model="trx_cpo.netto">
                <p class="text-red-500">{{ field_errors.netto }}</p>
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
  fnSelect: {
    type: Function,
    required: false,
  },
  excludes: {
    type: String,
    required: false,
    // default: '',
  },
  exclude_lists: {
    type: Array,
    required: false,
    // default: '',
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
  list_ujalan:{
    type:Array,
    required:true,
    default:[]
  },
  
})

const trx_cpo_temp = {
    id: -1,
    tanggal: new Date(),
    xto: "",
    tipe: "",
    ticket: "",
    pv:"",
    bruto: 0,
    tara: 0,
    netto: 0,
};

const trx_cpo = ref({...trx_cpo_temp});




const token = useCookie('token');
const field_errors = ref({})

const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("tanggal", trx_cpo.value.tanggal);
  data_in.append("xto", trx_cpo.value.xto);
  data_in.append("tipe", trx_cpo.value.tipe);
  data_in.append("ticket", trx_cpo.value.ticket);
  data_in.append("pv", trx_cpo.value.pv);
  data_in.append("bruto", trx_cpo.value.bruto);
  data_in.append("tara", trx_cpo.value.tara);
  data_in.append("netto", trx_cpo.value.netto);
  
  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    // $method = "put";
    // data_in['id'] = id;
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/api/trx_cpo", {
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

  
  if(props.id<=0){
    trx_cpo.value.id = data.value.id;
    trx_cpo.value.created_at = data.value.created_at;
    trx_cpo.value.updated_at = data.value.updated_at;
    props.p_data.unshift(trx_cpo.value);
  }else{
    trx_cpo.value.updated_at = data.value.updated_at;

    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...trx_cpo.value});    
    }
  }
  props.fnClose();
  // router.go(-1);
}

// // const exclude_id = computed({
// //   get(){
// //     return trx_cpo.value.warehouse?.id || trx_cpo.value.warehouse_target?.id;
// //   },
// //   set(){
    
// //   }
// // })

const list_to = computed(()=>{
  return [...new Set(props.list_ujalan.map((x)=>x.xto))];
})

const list_tipe = computed(()=>{
  return [...new Set(props.list_ujalan.filter((x)=>x.xto == trx_cpo.value.xto).map((x)=>x.tipe))];
})

const harga_dr_list = computed(()=>{
  let hrg = props.list_ujalan.filter(
    (x)=>x.xto == trx_cpo.value.xto && x.tipe == trx_cpo.value.tipe
  );
  if(hrg.length  > 0) 
  return hrg[0].harga;
  else 
  return 0;
})



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




const disabled = computed(()=>{
  return false;
  // return trx_cpo.value.confirmed_by || trx_cpo.value.ref_id != null;
});

const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/api/trx_cpo_", {
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

  trx_cpo.value = data.value.data;
}




watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    trx_cpo.value = {...trx_cpo_temp};

    if(props.id!=0)
    callData();
  }
}, {
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
