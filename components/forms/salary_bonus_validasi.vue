<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Salary Additional Validation'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Tanggal</label>
                <div class="card-border">
                  {{ $moment(salary_bonus.tanggal).format("DD-MM-Y") }}
                </div>
              </div>

              <div class="w-full sm:w-8/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                <label for="">Pekerja</label>
                <div class="card-border">
                  <WidthMiniPart :selected="selected_employee"/>
                </div>
              </div>

              <div class="w-full sm:w-6/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Nominal</label>
                <div class="card-border">
                  {{ pointFormat(salary_bonus.nominal || 0) }}
                </div>
              </div>

              <div class="w-full sm:w-6/12 md:w-full lg:w-full flex flex-col flex-wrap p-1">
                <label for="">Note</label>
                <div class="card-border">
                  {{ salary_bonus.note }}
                </div>
              </div>

              <div class="p-1 w-full">
                <AttachmentSingle :label="'Attachment'" :value="salary_bonus.attachment_1_preview" @setFile="salary_bonus.attachment_1=$event"  @setPreview="salary_bonus.attachment_1_preview=$event"/>
              </div>
            </div>
          </div>
          
          <div class="w-full flex items-center justify-end">
            <div class="w-full flex flex-wrap p-3 items-center">
              <div>
                Di Validasi oleh : 
              </div>
              <div v-if="salary_bonus.val1 || salary_bonus.val2" class="border-solid border-2 w-fit p-1 bg-slate-700 text-white text-xs">
                <div v-if="salary_bonus.val1">
                  App 1 : {{ salary_bonus.val1_by.username}} ( {{ salary_bonus.val1_at ? $moment(salary_bonus.val1_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="salary_bonus.val2">
                  App 2 : {{ salary_bonus.val2_by.username}} ( {{ salary_bonus.val2_at ? $moment(salary_bonus.val2_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
              </div>
            </div>

            <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
              Cancel
            </button>
            <button ref="it_val" v-if="is_view==0" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
              Validasi
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
  is_view:{
    type:Boolean,
    required:false,
    default:false
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
};

const salary_bonus = ref({...salary_bonus_temp});

const token = useCookie('token');
const field_errors = ref({});
const it_val = ref(null);
const details = ref([]);


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


const doSave = async () => {
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

  const { data, error, status } = await useMyFetch("/salary_bonus_validasi", {
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


  salary_bonus.value.val = data.value.val;
  salary_bonus.value.val_user = data.value.val_user;
  salary_bonus.value.val_by = data.value.val_by;
  salary_bonus.value.val_at = data.value.val_at;

  salary_bonus.value.val1 = data.value.val1;
  salary_bonus.value.val1_user = data.value.val1_user;
  salary_bonus.value.val1_by = data.value.val1_by;
  salary_bonus.value.val1_at = data.value.val1_at;

  salary_bonus.value.val2 = data.value.val2;
  salary_bonus.value.val2_user = data.value.val2_user;
  salary_bonus.value.val2_by = data.value.val2_by;
  salary_bonus.value.val2_at = data.value.val2_at;



  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...salary_bonus.value});    
  }


  props.fnClose();
}


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

  let dt =data.value.data;

  salary_bonus.value = dt;

  selected_employee.value._.id.val=dt.employee.id;
  selected_employee.value._.name.val=dt.employee.name;
  selected_employee.value._.ktp_no.val=dt.employee.ktp_no;
  selected_employee.value._.sim_no.val=dt.employee.sim_no;

  selected_employee.value.id=dt.employee.id;
  selected_employee.value.name=dt.employee.name;
  selected_employee.value.ktp_no=(dt.employee.ktp_no || '')+" "+(dt.employee.sim_no || '');

}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    salary_bonus.value = {...salary_bonus_temp};
    if(props.is_view==false){
      setTimeout(()=>{
        it_val.value.focus();
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
