<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Employee'" :fn="fnClose" class="w-100 flex align-items-center" style="color:white;" />

      <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
        <div class="w-full flex flex-wrap flex-row grow overflow-auto items-start">
          <div class="w-full sm:w-full md:w-1/3 md:overflow-auto md:max-h-full flex flex-row flex-wrap">

            

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">Nama</label>
              <input type="text" v-model="employee.name" :disabled="employee.val_at!=''">
              <p class="text-red-500">{{ field_errors.name }}</p>
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">Jabatan</label>
              <select v-model="employee.role">
                <option value="Supir">Supir</option>
                <option value="Kernet">Kernet</option>
              </select>
              <p class="text-red-500">{{ field_errors.role }}</p>
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">No KTP</label>
              <input type="text" v-model="employee.ktp_no">
              <p class="text-red-500">{{ field_errors.ktp_no }}</p>
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">No SIM</label>
              <input type="text" v-model="employee.sim_no">
              <p class="text-red-500">{{ field_errors.sim_no }}</p>
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">Pilih Bank</label>
              <select v-model="employee.bank_id">
                <option value=""></option>
                <option v-for="bank in banks" :value="bank.id">{{ bank.code }}</option>
              </select>
              <p class="text-red-500">{{ field_errors.bank_id }}</p>
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">No Rek</label>
              <input type="text" v-model="employee.rek_no">
              <p class="text-red-500">{{ field_errors.rek_no }}</p>
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">Nama Rek</label>
              <input type="text" v-model="employee.rek_name">
              <p class="text-red-500">{{ field_errors.rek_name }}</p>
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">Phone Number</label>
              <input type="text" v-model="employee.phone_number">
              <p class="text-red-500">{{ field_errors.phone_number }}</p>
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">Tanggal Lahir</label>
              <div class="grow">
                <ClientOnly>
                  <vue-date-picker  v-model="employee.birth_date" 
                  type="datetime" 
                  format="dd-MM-yyyy"
                  :enable-time-picker = "false" 
                  text-input
                  teleport-center></vue-date-picker>
                </ClientOnly>
              </div>
              <p class="text-red-500">{{ field_errors.birth_date }}</p>
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">Tempat Lahir</label>
              <input type="text" v-model="employee.birth_place">
              <p class="text-red-500">{{ field_errors.birth_place }}</p>
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">TMK</label>
              <div class="grow">
                <ClientOnly>
                  <vue-date-picker  v-model="employee.tmk" 
                  type="datetime" 
                  format="dd-MM-yyyy"
                  :enable-time-picker = "false" 
                  text-input
                  teleport-center></vue-date-picker>
                </ClientOnly>
              </div>
              <p class="text-red-500">{{ field_errors.tmk }}</p>
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">Alamat</label>
              <textarea  v-model="employee.address"></textarea>
              <p class="text-red-500">{{ field_errors.address }}</p>
            </div>
            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">Agama</label>
              <select v-model="employee.religion">
                <option value="ISLAM">ISLAM</option>
                <option value="KRISTEN PROTESTAN">KRISTEN PROTESTAN</option>
                <option value="KRISTEN KATOLIK">KRISTEN KATOLIK</option>
                <option value="HINDU">HINDU</option>
                <option value="BUDDHA">BUDDHA</option>
                <option value="KONGHUCU">KONGHUCU</option>
              </select>
              <p class="text-red-500">{{ field_errors.religion }}</p>
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">Status</label>
              <select v-model="employee.status">
                <option value="TK/0">TK/0</option>
                <option value="TK/1">TK/1</option>
                <option value="TK/2">TK/2</option>
                <option value="TK/3">TK/3</option>
                <option value="K/0">K/0</option>
                <option value="K/1">K/1</option>
                <option value="K/2">K/2</option>
                <option value="K/3">K/3</option>
              </select>
              <p class="text-red-500">{{ field_errors.status }}</p>
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

            <div class="w-full p-2 bg-blue-400 text-white mt-4">
              Data For Mobile APP
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">Username</label>
              <input type="text" v-model="employee.username">
              <p class="text-red-500">{{ field_errors.username }}</p>
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">Password</label>
              <div class="w-full flex items-center">
                <input :type="look_pass ?'text' :'password'" class="grow rounded-tr-none rounded-br-none" v-model="employee.password">
                <div class="flex items-center justify-center bg-blue-400 cursor-pointer h-full aspect-square text-white rounded-tr-sm rounded-br-sm" @click="look_pass=!look_pass">
                  <IconsEyes v-if="look_pass"/>
                  <IconsEyesOff v-else/>
                </div>
              </div>
              <p class="text-red-500">{{ field_errors.password }}</p>
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">Confirm Password</label>
              <div class="w-full flex items-center">
                <input :type="look_pass ?'text' :'password'" class="grow rounded-tr-none rounded-br-none" v-model="employee.confirm_password">
                <div class="flex items-center justify-center bg-blue-400 cursor-pointer h-full aspect-square text-white rounded-tr-sm rounded-br-sm" @click="look_pass=!look_pass">
                  <IconsEyes v-if="look_pass"/>
                  <IconsEyesOff v-else/>
                </div>

              </div>
              <p class="text-red-500">{{ field_errors.confirm_password }}</p>
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <AttachmentSingle :label="'Photo'" :value="employee.face_loc_preview" @setFile="employee.face_loc=$event"  @setPreview="employee.face_loc_preview=$event" :can_remove="true" />
            </div>

            <div class="w-1/2 sm:w-1/2 md:w-full flex flex-col flex-wrap p-1">
              <label for="">Face Login?</label>
              <div class="card-border !flex flex-row items-center">
                <label for="checkbox" class="w-full ml-1 flex items-center"> 
                  <input id="checkbox" :checked="employee.m_face_login" v-model="employee.m_face_login" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded mr-1">
                  {{employee.m_face_login ? 'Ya' : 'Tidak'}} 
                </label>
              </div>
              <p class="text-red-500">{{ field_errors.m_face_login }}</p>
            </div>
          </div>

          <div class="p-1 w-full sm:w-full md:w-2/3 md:overflow-auto max-h-full">
              <AttachmentSingle :label="'Attachment'" :value="employee.attachment_1_preview" @setFile="employee.attachment_1=$event"  @setPreview="employee.attachment_1_preview=$event" :can_remove="true"/>
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
  bank_id: 1,
  rek_no: "",
  rek_name: "",
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

  data_in.append("name", employee.value.name);
  data_in.append("role", employee.value.role);
  data_in.append("ktp_no", employee.value.ktp_no);
  data_in.append("sim_no", employee.value.sim_no);
  data_in.append("bank_id", employee.value.bank_id);
  data_in.append("rek_no", employee.value.rek_no);
  data_in.append("rek_name", employee.value.rek_name);
  data_in.append("phone_number", employee.value.phone_number);
  data_in.append("attachment_1", employee.value.attachment_1);
  data_in.append("attachment_1_preview", employee.value.attachment_1_preview);
  data_in.append("birth_date", employee.value.birth_date ? $moment(employee.value.birth_date).format("Y-MM-DD") : "");  
  data_in.append("birth_place", employee.value.birth_place);
  data_in.append("tmk", employee.value.tmk ? $moment(employee.value.tmk).format("Y-MM-DD") : "");  
  data_in.append("address", employee.value.address);
  data_in.append("status", employee.value.status);
  data_in.append("bpjs_kesehatan", employee.value.bpjs_kesehatan);
  data_in.append("bpjs_jamsos", employee.value.bpjs_jamsos);
  data_in.append("religion", employee.value.religion);
  data_in.append("username", employee.value.username);
  if(employee.value.password) data_in.append("password", employee.value.password);
  if(employee.value.confirm_password) data_in.append("confirm_password", employee.value.confirm_password);
  data_in.append("m_face_login", employee.value.m_face_login);
  data_in.append("face_loc", employee.value.face_loc);
  data_in.append("face_loc_preview", employee.value.face_loc_preview);

  let $method = "post";

  let id = props.is_copy ? 0 : props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/employee", {
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

  let bidx = banks.value.map((x)=>x.id).indexOf(employee.value.bank_id);
  employee.value.bank = {...banks.value[bidx]};
  employee.value.updated_at = data.value.updated_at;
  
  if(id<=0){
    employee.value.id = data.value.id;
    employee.value.created_at = data.value.created_at;
    props.p_data.unshift(employee.value);
  }else{
    let idx= props.p_data.map((x)=>x.id).indexOf(id);
    if(idx>=-1){
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

const banks = ref([]);
const getBanks = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/banks", {
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
  banks.value = data.value.data;
}

watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    employee.value = {...employee_temp};
    field_errors.value = {};

    await getBanks();
    if(props.id!=0)
    await callData();
  }
}, {
  immediate: true
});

</script>
