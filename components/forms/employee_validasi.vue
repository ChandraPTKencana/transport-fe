<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Master Standby Validation'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-wrap flex-row grow overflow-auto items-start">
            <div class="w-full sm:w-full md:w-1/3 md:overflow-auto md:max-h-full flex flex-row flex-wrap">

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">Name</label>
                <div class="card-border">
                  {{ employee.name }}
                </div>
              </div>
              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">Role</label>
                <div class="card-border">
                  {{ employee.role }}
                </div>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">No KTP</label>
                <div class="card-border">
                  {{ employee.ktp_no }}
                </div>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">No SIM</label>
                <div class="card-border">
                  {{ employee.sim_no }}
                </div>
              </div>
              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">Nama SIM</label>
                <div class="card-border">
                  {{ employee.sim_name }}
                </div>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">Bank Code</label>
                <div class="card-border">
                  {{ employee.bank?.code }}
                </div>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">No Rek</label>
                <div class="card-border">
                  {{ employee.rek_no }}
                </div>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">Nama Rek</label>
                <div class="card-border">
                  {{ employee.rek_name }}
                </div>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">Phone Number</label>
                <div class="card-border">
                  {{ employee.phone_number }}
                </div>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">Tanggal Lahir</label>
                <div class="card-border">
                  {{ $moment(employee.birth_date).format("DD-MM-YYYY") }}
                </div>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">Tempat Lahir</label>
                <div class="card-border">
                  {{ employee.birth_place }}
                </div>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">TMK</label>
                <div class="card-border">
                  {{ $moment(employee.tmk).format("DD-MM-YYYY") }}
                </div>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">Alamat</label>
                <div class="card-border">
                  {{ employee.address }}
                </div>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">Agama</label>
                <div class="card-border">
                  {{ employee.religion }}
                </div>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">Status</label>
                <div class="card-border">
                  {{ employee.status }}
                </div>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">BPJS Kesehatan</label>
                <div class="card-border">
                  {{ pointFormat(employee.bpjs_kesehatan) }}
                </div>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">BPJS Jamsos</label>
                <div class="card-border">
                  {{ pointFormat(employee.bpjs_jamsos) }}
                </div>
              </div>

              <div class="w-full p-2 bg-blue-400 text-white mt-4">
                Data For Mobile APP
              </div>
  
              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">Username</label>
                <div class="card-border">
                  {{ employee.username }}
                </div>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <AttachmentSingleV1 :show="show" :label="'Photo'" :link="employee.face_loc_preview" @setFile="employee.face_loc=$event"  @setPreview="employee.face_loc_preview=$event"/>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">Face Login?</label>
                <div class="card-border">
                  {{employee.m_face_login ? 'Ya' : 'Tidak'}}
                </div>
              </div>

              <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
                <label for="">Pekerja Dari</label>
                <div class="card-border">
                  {{ employee.workers_from }}
                </div>
              </div>

            </div>


            <div class="p-1 w-full sm:w-full md:w-2/3 md:overflow-auto max-h-full">
              <AttachmentSingleV1 :show="show" :label="'Attachment'" :link="employee.attachment_1_preview" @setFile="employee.attachment_1=$event"  @setPreview="employee.attachment_1_preview=$event"/>
            </div>
          </div>
          
          <div class="w-full flex items-center justify-end">
            <div class="w-full flex flex-wrap p-3 items-center">
              <div>
                Di Validasi oleh : 
              </div>
              <div v-if="employee.val" class="border-solid border-2 w-fit p-1 bg-slate-700 text-white text-xs">
                <div v-if="employee.val">
                  App 1 : {{ employee.val_by.username}} ( {{ employee.val_at ? $moment(employee.val_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
              </div>
            </div>

            <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
              Cancel
            </button>
            <button ref="it_val" v-if="it_state==1" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doValidate()">
              Validasi
            </button>
            <button ref="it_unval" v-if="it_state==0" type="submit" name="button" class="w-36 m-1 bg-yellow-600 text-white  rounded-sm" @click.prevent="doUnValidate()">
              Unvalidasi
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
  it_state:{
    type:Number,
    required:false,
    default:-1
  },
})

const employee_temp = {
    id: -1,
    name: "",
    tipe: "",
    is_transition: false,
    amount:0,
    details: [],
    val:0,
    val_by:{ username:"" },
    val_at:"",
    val1:0,
    val1_by:{ username:"" },
    val1_at:"",
    attachment_1:"",
    attachment_1_preview:"",
};

const employee = ref({...employee_temp});

const token = useDynamicPathCookie('token');
const field_errors = ref({});
const it_val = ref(null);
const it_unval = ref(null);
const details = ref([]);

const doValidate = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  
  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    // $method = "put";
    // data_in['id'] = id;
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/employee_validasi", {
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


  employee.value.val = data.value.val;
  employee.value.val_user = data.value.val_user;
  employee.value.val_by = data.value.val_by;
  employee.value.val_at = data.value.val_at;

  // employee.value.val1 = data.value.val1;
  // employee.value.val1_user = data.value.val1_user;
  // employee.value.val1_by = data.value.val1_by;
  // employee.value.val1_at = data.value.val1_at;


  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>-1){
    props.p_data.splice(idx,1,{...employee.value});    
  }


  props.fnClose();
}

const doUnValidate = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  
  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    // $method = "put";
    // data_in['id'] = id;
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/employee_unvalidasi", {
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


  employee.value.val = data.value.val;
  employee.value.val_user = data.value.val_user;
  employee.value.val_by = data.value.val_by;
  employee.value.val_at = data.value.val_at;

  // employee.value.val1 = data.value.val1;
  // employee.value.val1_user = data.value.val1_user;
  // employee.value.val1_by = data.value.val1_by;
  // employee.value.val1_at = data.value.val1_at;


  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>-1){
    props.p_data.splice(idx,1,{...employee.value});    
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

  employee.value = data.value.data;
  details.value = data.value.data.details;
}

const total_amount = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    if(e.p_status!="Remove")
    temp += parseInt(e.amount);
  });
  return temp;
})

const disabled = computed(()=>{
  return false;
  // return employee.value.confirmed_by || employee.value.ref_id != null;
});

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    employee.value = {...employee_temp}; // mgkn karna file gambar
    if(props.it_state==1){
      setTimeout(()=>{
        it_val.value.focus();
      },1);
    }
    if(props.it_state==0){
      setTimeout(()=>{
        it_unval.value.focus();
      },1);
    }
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
