<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Potongan'" :fn="fnClose" class="w-full flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-slate-200">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full p-1">
              <div class="w-full flex flex-row flex-wrap bg-white">
                <div class="w-full flex flex-col flex-wrap p-1">
                  <label for="">Kejadian</label>
                  <textarea v-model="potongan_mst.kejadian" rows="10" :disabled="disabled"> </textarea>
                  <p class="text-red-500">{{ field_errors.kejadian }}</p>
                </div>
  
                <div class="w-full sm:w-9/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                  <label for="">Pekerja</label>
                  <WidthMiniList :arr="list_emp" :selected="selected_employee" :pure="selected_mini_temp" @setSelected="selected_employee=$event" :disabled="disabled2"/>
                  <p class="text-red-500">{{ field_errors.employee_id }}</p>
                </div>
               
                <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                  <label for="">No Pol</label>
                  <input type="text" list="vehicle"  v-model="potongan_mst.no_pol" :disabled="disabled2"/>
                  <datalist id="vehicle">
                    <option v-for="lv in list_vehicle" :value="lv.no_pol" >{{lv.no_pol}}</option>
                  </datalist>
                  <p class="text-red-500">{{ field_errors.no_pol }}</p>
                </div>
  
  
                <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                  <label for="">Nominal</label>
                  <div class="w-full" >
                    <InputPointFormat
                    class="w-full h-full" 
                    type="text" 
                    :value="potongan_mst.nominal || 0" 
                    @input="potongan_mst.nominal = $event"
                    :show="show" 
                    :disabled="disabled2"/>
                  </div>
                  <p class="text-red-500">{{ field_errors.ref }}</p>
                </div>
  
                <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                  <label for="">Nominal Potong</label>
                  <div class="w-full" >
                    <InputPointFormat
                    class="w-full h-full" 
                    type="text" 
                    :value="potongan_mst.nominal_cut || 0" 
                    @input="potongan_mst.nominal_cut = $event"
                    :show="show" 
                    :disabled="disabled"/>
                  </div>
                  <p class="text-red-500">{{ field_errors.ref }}</p>
                </div>

                <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                  <label for="">Sisa Potongan</label>
                  <div class="card-border">
                    {{useUtils().pointFormat(potongan_mst.remaining_cut)}}
                  </div>
                </div>
  
  
                <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                  <label for="">Status</label>
                  <select v-model="potongan_mst.status" :disabled="disabled">
                    <option value="Open">Open</option>
                    <option value="Close Clear">Close Clear</option>
                    <option value="Close UnClear">Close UnClear</option>
                  </select>
                  <p class="text-red-500">{{ field_errors.ref }}</p>
                </div>

                <div class="w-full flex flex-col flex-wrap p-1">
                  <AttachmentSingle :label="'Lampiran Pertama'" :value="potongan_mst.attachment_1_preview" @setFile="potongan_mst.attachment_1=$event"  @setPreview="potongan_mst.attachment_1_preview=$event" :can_remove="!disabled2"/>
                  <p class="text-red-500">{{ field_errors.attachment_1 }}</p>
                </div>

                <div class="w-full flex flex-col flex-wrap p-1">
                  <AttachmentSingle :label="'Lampiran Lanjutan'" :value="potongan_mst.attachment_2_preview" @setFile="potongan_mst.attachment_2=$event"  @setPreview="potongan_mst.attachment_2_preview=$event" :can_remove="!disabled"/>
                  <p class="text-red-500">{{ field_errors.attachment_2 }}</p>
                </div>

  
                <div class="w-full flex flex-row flex-wrap p-1 justify-end">
                  <button v-if="!disabled" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
                    Save 
                  </button>
                </div>

              </div>
            </div>
            
            <div v-if="disabled" class="w-full h-full p-1">
              <FormsPotonganPart :id="id" :show="show" @updateRemainingCut="potongan_mst.remaining_cut=$event" :is_view="is_view"/>
            </div>

          </div>
          
          <div class="w-full flex items-center justify-end bg-white">
            <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
              Close
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
  is_view:{
    type:Boolean,
    required:false,
    default:false
  },
})

const potongan_mst_temp = {
    id: -1,
    kejadian:"",
    employee:{
      id: -1,
      name: '',
    },
    no_pol: '',
    
    nominal:0,
    nominal_cut:0,
    remaining_cut:0,
    status:"Open",
    attachment_1:"",
    attachment_1_preview:"",
    attachment_2:"",
    attachment_2_preview:"",
    val_at:""
};
const details = ref([]);

const detail = ref({
  ordinal:0,
  id:"",
  tanggal: new Date(),
  note:"",
  p_status:""
});

let potongan_mst_loaded = JSON.parse(JSON.stringify(potongan_mst_temp));
const potongan_mst = ref(JSON.parse(JSON.stringify(potongan_mst_temp)));

const token = useCookie('token');
const field_errors = ref({})


const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("kejadian", potongan_mst.value.kejadian);
  data_in.append("nominal", potongan_mst.value.nominal);
  data_in.append("nominal_cut", potongan_mst.value.nominal_cut);
  data_in.append("status", potongan_mst.value.status);
  
  data_in.append("employee_id", selected_employee.value.id);
  data_in.append("no_pol", potongan_mst.value.no_pol);

  data_in.append("attachment_1", potongan_mst.value.attachment_1);
  data_in.append("attachment_1_preview", potongan_mst.value.attachment_1_preview);
  data_in.append("attachment_2", potongan_mst.value.attachment_2);
  data_in.append("attachment_2_preview", potongan_mst.value.attachment_2_preview);

  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/potongan_mst", {
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

  potongan_mst.value.employee.id      = selected_employee.value.id;
  potongan_mst.value.employee.name    = selected_employee.value.name;

  potongan_mst.value.remaining_cut = data.value.remaining_cut;
  potongan_mst.value.updated_at = data.value.updated_at;
  if(props.id<=0){
    potongan_mst.value.id = data.value.id;
    potongan_mst.value.created_at = data.value.created_at;
    props.p_data.unshift(potongan_mst.value);
  }else{
    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...potongan_mst.value});    
    }
  }
  props.fnClose();
}

const selected_mini_temp={
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
};

const selected_employee = ref(JSON.parse(JSON.stringify(selected_mini_temp)));

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
    
    results.push(JSON.parse(JSON.stringify(temp)));
  });
  return results;
})

const disabled = computed(()=>{
  return potongan_mst.value.val1==1 || props.is_view;
  // return potongan_mst.value.confirmed_by || potongan_mst.value.ref_id != null;
});

const disabled2 = computed(()=>{
  return potongan_mst.value.val_at!="" || props.is_view;
  // return potongan_mst.value.confirmed_by || potongan_mst.value.ref_id != null;
});

const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/potongan_mst", {
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

  let dt =data.value.data;
  potongan_mst.value = dt;
  potongan_mst_loaded = {...dt};

  selected_employee.value._.id.val=dt.employee?.id;
  selected_employee.value._.name.val=dt.employee?.name;
  selected_employee.value._.rek_no.val=dt.employee?.rek_no;
  selected_employee.value._.rek_name.val=dt.employee?.rek_name;

  selected_employee.value.id=dt.employee?.id;
  selected_employee.value.name=dt.employee?.name;
  selected_employee.value.rek_no=(dt.employee?.rek_no || '')+" "+(dt.employee?.rek_name || '');

}

const list_potongan_mst = ref([]);
const list_xto = ref([]);
const list_vehicle = ref([]);
const list_employee = ref([]);

const loadLocalDT = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/potongan_mst_load_local", {
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

  list_potongan_mst.value = data.value.list_potongan_mst;
  list_xto.value = data.value.list_xto;
  list_vehicle.value = data.value.list_vehicle;
  list_employee.value = data.value.list_employee;
}


watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    if(!props.is_view) await loadLocalDT();

    potongan_mst.value = JSON.parse(JSON.stringify(potongan_mst_temp));
    selected_employee.value = JSON.parse(JSON.stringify(selected_mini_temp));
    
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
