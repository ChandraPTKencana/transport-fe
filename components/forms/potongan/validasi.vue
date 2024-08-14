<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Transaction Standby Validation'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full p-1">
              <div class="w-full flex flex-row flex-wrap bg-white">
                <div class="w-full flex flex-col flex-wrap p-1">
                  <label for="">Kejadian</label>
                  <div class="card-border">
                    {{ potongan_mst.kejadian }}
                  </div>
                </div>
  
                <div class="w-full sm:w-9/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                  <label for="">Pekerja</label>
                  <div class="card-border">
                    <WidthMiniPart :selected="selected_employee"/>
                  </div>
                </div>
               
                <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                  <label for="">No Pol</label>
                  <div class="card-border">
                    {{ potongan_mst.no_pol }}
                  </div>
                </div>
  
  
                <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                  <label for="">Nominal</label>

                  <div class="card-border">
                    {{ useUtils().pointFormat(potongan_mst.nominal) }}
                  </div>
                </div>
  
                <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                  <label for="">Nominal Potong</label>
                  <div class="card-border">
                    {{ useUtils().pointFormat(potongan_mst.nominal_cut) }}
                  </div>
                </div>

                <!-- <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                  <label for="">Sisa Potongan</label>
                  <div class="card-border">
                    {{useUtils().pointFormat(potongan_mst.remaining_cut)}}
                  </div>
                </div>
  
  
                <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                  <label for="">Status</label>
                  <div class="card-border">
                    {{potongan_mst.status}}
                  </div>
                </div> -->

                
                <div class="w-full flex flex-col flex-wrap p-1">
                  <AttachmentSingle :label="'Lampiran Pertama'" :value="potongan_mst.attachment_1_preview" @setFile="potongan_mst.attachment_1=$event"  @setPreview="potongan_mst.attachment_1_preview=$event"/>
                </div>

                <div class="w-full flex flex-col flex-wrap p-1">
                  <AttachmentSingle :label="'Lampiran Lanjutan'" :value="potongan_mst.attachment_2_preview" @setFile="potongan_mst.attachment_2=$event"  @setPreview="potongan_mst.attachment_2_preview=$event"/>
                </div>
              </div>
            </div>
          </div>
          
          <div class="w-full flex items-center justify-end">
            <div class="w-full flex flex-wrap p-3 items-center">
              <div>
                Di Validasi oleh : 
              </div>
              <div v-if="potongan_mst.val || potongan_mst.val1 || potongan_mst.val2" class="border-solid border-2 w-fit p-1 bg-slate-700 text-white text-xs">
                <div v-if="potongan_mst.val">
                  App 1 : {{ potongan_mst.val_by.username}} ( {{ potongan_mst.val_at ? $moment(potongan_mst.val_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="potongan_mst.val1">
                  App 2 : {{ potongan_mst.val1_by.username}} ( {{ potongan_mst.val1_at ? $moment(potongan_mst.val1_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
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

  val:0,
  val_by:{ username:"" },
  val_at:"",
  val1:0,
  val1_by:{ username:"" },
  val1_at:"",
  val2:0,
  val2_by:{ username:"" },
  val2_at:"",
};

const potongan_mst = ref({...potongan_mst_temp});

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
  id:-1,
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

  const { data, error, status } = await useMyFetch("/potongan_mst_validasi", {
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

  potongan_mst.value.val = data.value.val;
  potongan_mst.value.val_user = data.value.val_user;
  potongan_mst.value.val_by = data.value.val_by;
  potongan_mst.value.val_at = data.value.val_at;

  potongan_mst.value.val1 = data.value.val1;
  potongan_mst.value.val1_user = data.value.val1_user;
  potongan_mst.value.val1_by = data.value.val1_by;
  potongan_mst.value.val1_at = data.value.val1_at;


  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...potongan_mst.value});    
  }


  props.fnClose();
}


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

  selected_employee.value._.id.val=dt.employee?.id;
  selected_employee.value._.name.val=dt.employee?.name;
  selected_employee.value._.rek_no.val=dt.employee?.rek_no;
  selected_employee.value._.rek_name.val=dt.employee?.rek_name;

  selected_employee.value.id=dt.employee?.id;
  selected_employee.value.name=dt.employee?.name;
  selected_employee.value.rek_no=(dt.employee?.rek_no || '')+" "+(dt.employee?.rek_name || '');

}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
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
