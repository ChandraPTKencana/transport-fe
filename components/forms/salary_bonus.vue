<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Salary Additional'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Tipe</label>
                <select v-model="salary_bonus.type" :disabled="disabled">
                  <option value="Lainnya">Lainnya</option>
                  <option value="Kerajinan">Kerajinan</option>
                </select>
                <p class="text-red-500">{{ field_errors.type }}</p>
              </div>

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Tanggal</label>
                <div v-if="disabled" class="card-border">
                  {{ $moment(salary_bonus.tanggal).format("DD-MM-Y") }}
                </div>
                <div v-else>
                  <ClientOnly>
                    <vue-date-picker  v-model="salary_bonus.tanggal" 
                    type="datetime"
                    format="dd-MM-yyyy"
                    :enable-time-picker = "false" 
                    text-input
                    teleport-center></vue-date-picker>
                  </ClientOnly>
                </div>
                <p class="text-red-500">{{ field_errors.tanggal }}</p>
              </div>

              <div class="w-full sm:w-8/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                <label for="">Pekerja</label>
                <WidthMiniList :arr="list_emp" :selected="selected_employee" :pure="selected_mini_temp" @setSelected="selected_employee=$event" :disabled="disabled"/>
                <p class="text-red-500">{{ field_errors.employee_id }}</p>
              </div>

              <div class="w-full sm:w-6/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Nominal</label>
                <div>
                  <InputPointFormat
                  class="w-full h-full p-1" 
                  type="text" 
                  :value="salary_bonus.nominal || 0" 
                  @input="salary_bonus.nominal = $event" :disabled="disabled"/>
                </div>
                <p class="text-red-500">{{ field_errors.nominal }}</p>
              </div>

              <div class="w-full sm:w-6/12 md:w-full lg:w-full flex flex-col flex-wrap p-1">
                <label for="">Note</label>
                <div>
                  <textarea v-model="salary_bonus.note" :disabled="disabled"></textarea>
                </div>
                <p class="text-red-500">{{ field_errors.nominal }}</p>
              </div>

              <div class="p-1 w-full">
                <AttachmentSingle :label="'Attachment'" :value="salary_bonus.attachment_1_preview" @setFile="salary_bonus.attachment_1=$event"  @setPreview="salary_bonus.attachment_1_preview=$event" :can_remove="true"/>
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
  is_copy: {
    type: [Boolean,Number],
    required: true,
    default: false,
  },
  
})

const salary_bonus_temp = {
    id: "",
    tanggal: new Date(),
    type:"Kerajinan",
    nominal:0,
    note:"",
    attachment_1:"",
    attachment_1_preview:"",
    attachment_1_type:"",    
};

const salary_bonus = ref({...salary_bonus_temp});

const token = useDynamicPathCookie('token');

const field_errors = ref({})


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
    ktp_no:{
      tcon:"IconsNumber",
      text:"No KTP",
      val:"",
    },
    sim_no:{
      tcon:"IconsCreditCard",
      text:"No SIM",
      val:"",
    },
  },
  id:"",
  name:"",
  title:"",
};

const selected_employee = ref(JSON.parse(JSON.stringify(selected_mini_temp)));
const list_employee = ref([]);

const loadLocalDT = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/salary_bonus_load_local", {
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

  list_employee.value = data.value.list_employee;
}


const list_emp = computed(()=>{
  let results = [];
  list_employee.value.forEach((x,y)=>{
    let temp = JSON.parse(JSON.stringify(selected_mini_temp));
    temp._.id.val = x.id,
    temp._.name.val = x.name,
    temp._.ktp_no.val = x.ktp_no,
    temp._.sim_no.val = x.sim_no,

    temp.id = x.id,
    temp.name = x.name,
    temp.title = (x.ktp_no || '')+" "+(x.sim_no || ''),
    
    results.push(JSON.parse(JSON.stringify(temp)));
  });
  return results;
})

const details = ref([]);

const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();

  data_in.append("type", salary_bonus.value.type);
  data_in.append("tanggal", (salary_bonus.value.tanggal) ? $moment(salary_bonus.value.tanggal).format("Y-MM-DD") : '');
  data_in.append("employee_id", selected_employee.value.id);
  data_in.append("nominal", salary_bonus.value.nominal);
  data_in.append("note", salary_bonus.value.note);
  data_in.append("attachment_1", salary_bonus.value.attachment_1);
  data_in.append("attachment_1_preview", salary_bonus.value.attachment_1_preview);
  
  let $method = "post";

  let id = salary_bonus.value.id;
  if (id == "") {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/salary_bonus", {
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

  salary_bonus.value.employee = {
    name: selected_employee.value._.name.val,
    ktp_no: selected_employee.value._.ktp_no.val,
    sim_no: selected_employee.value._.sim_no.val,
  };

  salary_bonus.value.attachment_1_type = data.value.attachment_1_type;

  details.value = data.value.details;
  if(id<=0){
    salary_bonus.value.id = data.value.id;
    salary_bonus.value.created_at = data.value.created_at;
    salary_bonus.value.updated_at = data.value.updated_at;
    props.p_data.unshift(salary_bonus.value);
  }else{
    salary_bonus.value.updated_at = data.value.updated_at;

    let idx= props.p_data.map((x)=>x.id).indexOf(id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...salary_bonus.value});    
    }
  }
  
  props.fnClose();
  // router.go(-1);
}

const disabled = computed(()=>{
  return (salary_bonus.value.val1) ? true : false;
});


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/salary_bonus", {
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
    salary_bonus.value.val = 0;
    salary_bonus.value.val1 = 0;
  }

  let dt = data.value.data;
  salary_bonus.value = dt;

  selected_employee.value._.id.val=dt.employee.id;
  selected_employee.value._.name.val=dt.employee.name;
  selected_employee.value._.ktp_no.val=dt.employee.ktp_no;
  selected_employee.value._.sim_no.val=dt.employee.sim_no;

  selected_employee.value.id=dt.employee.id;
  selected_employee.value.name=dt.employee.name;
  selected_employee.value.ktp_no=(dt.employee.ktp_no || '')+" "+(dt.employee.sim_no || '');

}

watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    await loadLocalDT();
    salary_bonus.value = {...salary_bonus_temp};
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
