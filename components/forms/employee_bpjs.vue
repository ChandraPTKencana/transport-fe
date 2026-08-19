<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Employee'" :fn="fnClose" class="w-100 flex align-items-center" style="color:white;" />

      <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
        <div class="w-full flex flex-wrap flex-row grow overflow-auto items-start">
          <div class="w-full sm:w-full md:w-1/3 md:overflow-auto md:max-h-full flex flex-row flex-wrap">

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">Name</label>
                <div class="card-border bg-gray-100">
                  {{ employee.name }}
                </div>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">No KTP</label>
                <div class="card-border bg-gray-100">
                  {{ employee.ktp_no }}
                </div>
              </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">BPJS Kesehatan</label>
              <div class="w-full" >
                <InputPointFormat
                class="w-full h-full p-1" 
                type="text" 
                :value="employee.bpjs_kesehatan || 0" 
                @input="employee.bpjs_kesehatan = $event"/>
              </div>
              <p class="text-red-500">{{ field_errors.bpjs_kesehatan }}</p>
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">BPJS Jamsos</label>
              <div class="w-full" >
                <InputPointFormat
                class="w-full h-full p-1" 
                type="text" 
                :value="employee.bpjs_jamsos || 0" 
                @input="employee.bpjs_jamsos = $event"/>
              </div>
              <p class="text-red-500">{{ field_errors.bpjs_jamsos }}</p>
            </div>
           
            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">Pekerja Dari</label>
              <div class="card-border  bg-gray-100">
                {{ employee.workers_from }}
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
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
const { $moment } = useNuxtApp()

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

const look_pass = ref(0);

const employee_temp = {
  id: -1,
  name: "",
  role: "Supir",
  ktp_no: "",
  sim_no: "",
  sim_name: "",
  bank_id: 1,
  rek_no: "",
  rek_name: "",
  workers_from:"",
  phone_number: "",
  attachment_1:"",
  attachment_1_preview:"",
  birth_date: new Date(),
  birth_place:"",
  bpjs_kesehatan:0,
  bpjs_jamsos:0,
  tmk: new Date(),
  address:"",
  status:"TK/0",
  val_at:"",
  religion:"ISLAM",
  username:"",
  password:"",
  confirm_password:"",
  face_loc:"",
  face_loc_preview:"",
  m_face_login:0
};

const employee = ref({...employee_temp});

const token = useDynamicPathCookie('token');
const field_errors = ref({})

const doSave = async () => { 
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();

  data_in.append("bpjs_kesehatan", employee.value.bpjs_kesehatan);
  data_in.append("bpjs_jamsos", employee.value.bpjs_jamsos);

  let $method = "post";

  let id = props.is_copy ? 0 : props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/employee/save_bpjs", {
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

  employee.value.val2 = data.value.val2;
  employee.value.val2_user = data.value.val2_user;
  employee.value.val2_by = data.value.val2_by;
  employee.value.val2_at = data.value.val2_at;

  employee.value.updated_at = data.value.updated_at;
  
  if(id<=0){
    employee.value.id = data.value.id;
    employee.value.created_at = data.value.created_at;
    props.p_data.unshift(employee.value);
  }else{
    let idx= props.p_data.map((x)=>x.id).indexOf(id);
    if(idx>-1){
      props.p_data.splice(idx,1,{...employee.value});    
    }
  }
  props.fnClose();
}


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/employee", {
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
    employee.value.val = 0;
  }

  employee.value = data.value.data;
}

watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    employee.value = {...employee_temp};
    field_errors.value = {};

    if(props.id!=0)
    await callData();
  }
}, {
  immediate: true
});

</script>
