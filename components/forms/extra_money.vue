<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Transaction'" :fn="fnClose" class="w-full flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Tujuan</label>
                <input type="text" list="xto"  v-model="extra_money.xto"/>
                <datalist id="xto">
                  <option v-for="lx in list_xto" >{{lx}}</option>
                </datalist>
                <p class="text-red-500">{{ field_errors.xto }}</p>
              </div>

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Jenis</label>
                <select v-model="extra_money.jenis">
                  <option value="PK">PK</option>
                  <option value="CPO">CPO</option>
                  <option value="TBS">TBS</option>
                  <option value="TBS">TBSK</option>
                </select>
                <p class="text-red-500">{{ field_errors.jenis }}</p>
              </div>

              <div class="w-full sm:w-3/12 flex px-2 py-3">                
                <div class="w-full flex flex-wrap ring-1 ring-gray-500 p-2 relative items-end">
                  
                  <div class="absolute bg-white -top-3"> Peralihan </div>
                  
                  <div  class="w-6/12 flex flex-col flex-wrap p-1">
                    <select v-model="extra_money.transition_type">
                      <option value=""></option>
                      <option value="From">Dari</option>
                      <option value="To">Ke</option>
                    </select>
                    <p class="text-red-500">{{ field_errors.transition_type }}</p>
                  </div>

                  <div class="w-6/12 flex flex-col flex-wrap p-1">
                    <select v-model="extra_money.transition_target">
                      <option value=""></option>
                      <option v-for="v in useCommonStore().list_pabrik" :value="v">{{ v }}</option>
                    </select>
                    <p class="text-red-500">{{ field_errors.transition_target }}</p>
                  </div>

                </div>
              </div>

              <div class="w-full sm:w-12/12 flex px-2 py-3">                
                <div class="w-full flex flex-wrap ring-1 ring-gray-500 p-2 relative items-start">
                  
                  <div class="absolute bg-white -top-3"> Account </div>
                  
                  <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                    <label for="">Info</label>
                    <WidthMiniList :arr="list_ac_acc" :selected="selected_acc" :pure="selected_mini_temp" @setSelected="selected_acc=$event"/>
                    <p class="text-red-500">{{ field_errors.ac_account_id }}</p>
                  </div>

                  <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                    <label for="">Deskripsi</label>
                    <textarea v-model="extra_money.description"></textarea>
                    <p class="text-red-500">{{ field_errors.description }}</p>
                  </div>

                  

                  <div class="w-full sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                    <label for="">Nominal</label>
                    <div class="w-full" >
                      <InputPointFormat
                      class="w-full h-full p-1" 
                      type="text" 
                      :value="extra_money.nominal || 0" 
                      @input="extra_money.nominal = $event"/>
                    </div>
                    <p class="text-red-500">{{ field_errors.nominal }}</p>
                  </div>

                  <div class="w-full sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                    <label for="">Qty</label>
                    <div class="w-full" >
                      <InputPointFormat
                      class="w-full h-full p-1" 
                      type="text" 
                      :value="extra_money.qty || 0" 
                      @input="extra_money.qty = $event"/>
                    </div>
                    <p class="text-red-500">{{ field_errors.qty }}</p>
                  </div>

                  <div class="w-full sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                    <label for="">Total</label>
                    <div class="w-full card-border" >
                      {{ pointFormat(extra_money.nominal * extra_money.qty) }}
                    </div>
                  </div>


                  

                </div>
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
  is_copy: {
    type: [Boolean,Number],
    required: true,
    default: false,
  },
})

const extra_money_temp = {
    id: -1,
    xto: "",
    jenis: "",
    transition_target:"",
    transition_type:"",
    
    ac_account_id:"",
    ac_account_code:"",
    ac_account_name:"",
    description:"",
    nominal: 0,
    qty:1,
};
const details = ref([]);

const detail = ref({
  ordinal:0,
  id:"",
  tanggal: new Date(),
  note:"",
  p_status:""
});

let extra_money_loaded = {...extra_money_temp};
const extra_money = ref({...extra_money_temp});

const token = useCookie('token');
const field_errors = ref({})

const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("xto", extra_money.value.xto);
  data_in.append("jenis", extra_money.value.jenis);
  data_in.append("transition_target", extra_money.value.transition_target);
  data_in.append("transition_type", extra_money.value.transition_type);
  data_in.append("ac_account_id", selected_acc.value.id);
  
  data_in.append("description", extra_money.value.description);
  data_in.append("nominal", extra_money.value.nominal);
  data_in.append("qty", extra_money.value.qty);

  
  let $method = "post";

  let id = props.is_copy ? 0 : props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/extra_money", {
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

  extra_money.value.ac_account_id   = selected_acc.value._.id.val;
  extra_money.value.ac_account_name   = selected_acc.value._.name.val;
  extra_money.value.ac_account_code   = selected_acc.value._.code.val;

  extra_money.value.updated_at = data.value.updated_at;
  if(id<=0){
    extra_money.value.id = data.value.id;
    extra_money.value.created_at = data.value.created_at;
    props.p_data.unshift(extra_money.value);
  }else{
    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...extra_money.value});    
    }
  }
  props.fnClose();
}

const selected_mini_temp={
  _:{
    id:{
      tcon:"",
      text:"ID",
      val:"",
    },
    code:{
      tcon:"",
      text:"Code",
      val:"",
    },
    name:{
      tcon:"",
      text:"Name",
      val:"",
    },
  },
  id:"",
  name:"",
  title:"",
};

const selected_acc = ref(JSON.parse(JSON.stringify(selected_mini_temp)));

const list_ac_acc = computed(()=>{
  let results = [];
  list_accs.value.forEach((x,y)=>{
    let temp = JSON.parse(JSON.stringify(selected_mini_temp));
    temp._.id.val = x.AccountID, 
    temp._.name.val = x.AccountName,
    temp._.code.val = x.AccountCode,

    temp.id = x.AccountID,
    temp.name = x.AccountCode,
    temp.title = x.AccountName,
    
    results.push(JSON.parse(JSON.stringify(temp)));
  });
  return results;
})

const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/extra_money", {
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

  if(props.is_copy){
    extra_money.value.val = 0;
    extra_money.value.val1 = 0;
  }

  let dt =data.value.data;
  extra_money.value = dt;
  extra_money_loaded = {...dt};

  selected_acc.value._.id.val=dt.ac_account_id;
  selected_acc.value._.name.val=dt.ac_account_name;
  selected_acc.value._.code.val=dt.ac_account_code;

  selected_acc.value.id=dt.ac_account_id;
  selected_acc.value.name=dt.ac_account_code;
  selected_acc.value.title=dt.ac_account_name;
}

const list_xto = ref([]);
const list_accs = ref([]);

const loadLocalDT = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/extra_money_load_local", {
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

  list_xto.value = data.value.list_xto;
}

const loadAccs = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/extra_money_load_sqlsrv", {
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

  list_accs.value = data.value.list_accs;
}

watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    await loadLocalDT();
    await loadAccs();

    extra_money.value = {...extra_money_temp};
    selected_acc.value = JSON.parse(JSON.stringify(selected_mini_temp));
    
    details.value = [];
    
    field_errors.value = {};
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
</style>
