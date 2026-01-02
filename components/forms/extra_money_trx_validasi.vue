<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Transaction Extra Money Trx Validation'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">

            <div class="w-full flex flex-row flex-wrap">
              <div class="w-full sm:w-3/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                <label for="">Trx Trp #ID</label>
                <div class="card-border">
                  {{ extra_money_trx.prev_trx_trp_id }}
                </div>
              </div>
              <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                <label for="">Tanggal</label>
                <div class="card-border">
                  {{ $moment(extra_money_trx.tanggal).format("DD-MM-YYYY") }}
                </div>
              </div>
              <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                <label for="">Payment Method</label>
                <div class="card-border">
                  {{ extra_money_trx.payment_method.name }}
                </div>
              </div>
              <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                <label for="">No Pol</label>
                <div class="card-border">
                  {{extra_money_trx.no_pol}}
                </div>
                
              </div>

              <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                <label for="">Pekerja</label>
                <div class="card-border">
                  <WidthMiniPart :selected="selected_employee"/>
                </div>
              </div>

              <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                <label for="">Uang Tambahan</label>
                <div class="card-border">
                  <WidthMiniPart :selected="selected_extra_money"/>
                </div>
              </div>

              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Note For Remarks</label>
                <textarea disabled="disabled" v-model="extra_money_trx.note_for_remarks"></textarea>
                <p class="text-red-500">{{ field_errors.note_for_remarks }}</p>
              </div>

              <div class="w-full flex">
                <div class="p-1 w-full sm:w-full md:w-1/2 md:overflow-auto max-h-full">
                  <AttachmentSingleV1  :label="'Attachment'" :show="show" :link="extra_money_trx.attachment_1_preview" />
                  
                </div>
  
                <div class="p-1 w-full sm:w-full md:w-1/2 md:overflow-auto max-h-full">
                  <AttachmentSingleV1  :label="'Attachment'" :show="show" :link="extra_money_trx.attachment_2_preview" />
                  <!-- <AttachmentSingle :label="'Attachment'" :value="extra_money_trx.attachment_2_preview"/> -->
                </div>
              </div>

              <div class="w-full flex flex-wrap">

                <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                  <label for="">Cost Center Code</label>
                  <div class="card-border disabled">
                    {{  extra_money_trx.cost_center_code  }}
                  </div>
                </div>

                <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                  <label for="">Cost Center Desc</label>
                  <div class="card-border disabled">
                    {{  extra_money_trx.cost_center_desc }}
                  </div>
                </div>

                <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                  <label for="">PVR No</label>
                  <div class="card-border disabled">
                    {{  extra_money_trx.pvr_no }}
                  </div>
                </div>

                <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                  <label for="">PVR Total</label>
                  <div class="card-border disabled">
                    {{ pointFormat(extra_money_trx.pvr_total || 0) }}
                  </div>
                </div>


                <div class="w-6/12 sm:w-8/12 flex flex-col flex-wrap p-1">
                  <label for="">PV</label>
                  <div class="card-border disabled">
                    {{  extra_money_trx.pv_no }}
                  </div>
                </div>

                <div class="w-6/12 sm:w-4/12 flex flex-col flex-wrap p-1">
                  <label for="">PV Amount</label>
                  <div class="card-border disabled">
                    {{  pointFormat(extra_money_trx.pv_total) }}
                  </div>
                </div>
              </div>


              </div>

          </div>
          
          <div class="w-full flex items-center justify-end">
            <div class="w-full flex flex-wrap p-3 items-center">
              <div>
                Di Validasi oleh : 
              </div>
              <div v-if="extra_money_trx.val1 || extra_money_trx.val2 || extra_money_trx.val3 || extra_money_trx.val4 || extra_money_trx.val5 || extra_money_trx.val6" class="border-solid border-2 w-fit p-1 bg-slate-700 text-white text-xs">
                <div v-if="extra_money_trx.val1">
                  Kasir : {{ extra_money_trx.val1_by.username}} ( {{ extra_money_trx.val1_at ? $moment(extra_money_trx.val1_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="extra_money_trx.val2">
                  Mandor : {{ extra_money_trx.val2_by.username}} ( {{ extra_money_trx.val2_at ? $moment(extra_money_trx.val2_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="extra_money_trx.val3">
                  KTU/W : {{ extra_money_trx.val3_by.username}} ( {{ extra_money_trx.val3_at ? $moment(extra_money_trx.val3_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="extra_money_trx.val4">
                  Logistik : {{ extra_money_trx.val4_by.username}} ( {{ extra_money_trx.val4_at ? $moment(extra_money_trx.val4_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="extra_money_trx.val5">
                  SPV Logistik : {{ extra_money_trx.val5_by.username}} ( {{ extra_money_trx.val5_at ? $moment(extra_money_trx.val5_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="extra_money_trx.val6">
                  MGR Logistik : {{ extra_money_trx.val6_by.username}} ( {{ extra_money_trx.val6_at ? $moment(extra_money_trx.val6_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
              </div>
            </div>

            <button type="button" name="button" class="w-36 h-9 m-1 grid place-items-center" @click="loadTop()">
              <IconsCaretTop class="black"/>
            </button>
            <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
              Cancel
            </button>
            <button ref="it_val" v-if="it_state==1" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doValidate()">
              Validasi
              <div class="text-xs font-bold" v-if="save_state!=''">
                {{ save_state }}
              </div>
            </button>
            <button ref="it_unval" v-if="it_state==0" type="submit" name="button" class="w-36 m-1 bg-yellow-600 text-white  rounded-sm" @click.prevent="doUnValidate()">
              Unvalidasi
              <div class="text-xs font-bold" v-if="save_state!=''">
                {{ save_state }}
              </div>
            </button>
            <button type="button" name="button" class="w-36 h-9 m-1 grid place-items-center" @click="loadDown()">
              <IconsCaretDown class="black"/>
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
  // is_view:{
  //   type:Boolean,
  //   required:false,
  //   default:false
  // },
  it_state:{
    type:Number,
    required:false,
    default:-1
  },
})

const extra_money_trx_temp = {
  id: -1,
  tanggal: new Date(),
  employee:{
    id:0,
  },
  extra_money_trx:{
    id:0,
    attachment_1_preview:'',
    attachment_2_preview:'',
  },
  payment_method:{
    name:""
  },
  pv_id: -1,
  pv_no:"",
  pv_total:0,

  no_pol: '',
  note:"",
  cost_center_code:"",
  cost_center_desc:"",
  pvr_id:"",
  pvr_no:"",
  pvr_total:0,
  pvr_complete:"",
};

const extra_money_trx = ref({...extra_money_trx_temp});

const token = useDynamicPathCookie('token');
const field_errors = ref({});
const it_val = ref(null);
const it_unval = ref(null);
const details = ref([]);

const selected_temp_extra_money={
  _raw:{},
  _:{
    id:{
      tcon:"IconsBaselineNumbers",
      text:"ID",
      val:"",
    },
    xto:{
      tcon:"IconsLocationOn",
      text:"Tujuan",
      val:"",
    },
    description:{
      tcon:"",
      text:"Deskripsi",
      val:"",
    },
    total:{
      tcon:"",
      text:"Total",
      val:"",
    },
  },
  id:"",
  name:"",
  title:"",
  note:""
};

const selected_temp_employee={
  _raw:{},
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
  note:""
};

let keydownListener = (event)=>{
  // console.log(event.key)
  if(event.key =='ArrowUp'){
    loadTop();
  }
  if(event.key =='ArrowDown'){
    loadDown();
  }
};

// onMounted(async()=>{
//   document.addEventListener('keydown', keydownListener);
// })

onBeforeUnmount(()=>{
  document.removeEventListener('keydown', keydownListener);
})



const selected_employee = ref(JSON.parse(JSON.stringify(selected_temp_employee)));
const selected_extra_money = ref(JSON.parse(JSON.stringify(selected_temp_extra_money)));

const save_state = ref("");

const doValidate = async () => {
  save_state.value = "PROSES...";
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

  const { data, error, status } = await useMyFetch("/extra_money_trx_validasi", {
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
    save_state.value = "GAGAL";
    useErrorStore().trigger(error, field_errors);
    return;
  }

  extra_money_trx.value.val1 = data.value.val1;
  extra_money_trx.value.val1_user = data.value.val1_user;
  extra_money_trx.value.val1_by = data.value.val1_by;
  extra_money_trx.value.val1_at = data.value.val1_at;

  extra_money_trx.value.val2 = data.value.val2;
  extra_money_trx.value.val2_user = data.value.val2_user;
  extra_money_trx.value.val2_by = data.value.val2_by;
  extra_money_trx.value.val2_at = data.value.val2_at;

  extra_money_trx.value.val3 = data.value.val3;
  extra_money_trx.value.val3_user = data.value.val3_user;
  extra_money_trx.value.val3_by = data.value.val3_by;
  extra_money_trx.value.val3_at = data.value.val3_at;

  extra_money_trx.value.val4 = data.value.val4;
  extra_money_trx.value.val4_user = data.value.val4_user;
  extra_money_trx.value.val4_by = data.value.val4_by;
  extra_money_trx.value.val4_at = data.value.val4_at;

  extra_money_trx.value.val5 = data.value.val5;
  extra_money_trx.value.val5_user = data.value.val5_user;
  extra_money_trx.value.val5_by = data.value.val5_by;
  extra_money_trx.value.val5_at = data.value.val5_at;

  extra_money_trx.value.val6 = data.value.val6;
  extra_money_trx.value.val6_user = data.value.val6_user;
  extra_money_trx.value.val6_by = data.value.val6_by;
  extra_money_trx.value.val6_at = data.value.val6_at;


  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>-1){
    props.p_data.splice(idx,1,{...extra_money_trx.value});    
  }

  save_state.value = "BERHASIL";
  // props.fnClose();
}

const doUnValidate = async () => {
  save_state.value = "PROSES...";
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  // data_in.append("tanggal", $moment(trx_trp.value.tanggal).format("Y-MM-DD"));
  // data_in.append("tipe", trx_trp.value.tipe);
  
  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/extra_money_trx_unvalidasi", {
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
    save_state.value = "GAGAL";
    useErrorStore().trigger(error);
    return;
  }

  extra_money_trx.value.val1 = data.value.val1;
  extra_money_trx.value.val1_user = data.value.val1_user;
  extra_money_trx.value.val1_by = data.value.val1_by;
  extra_money_trx.value.val1_at = data.value.val1_at;

  extra_money_trx.value.val2 = data.value.val2;
  extra_money_trx.value.val2_user = data.value.val2_user;
  extra_money_trx.value.val2_by = data.value.val2_by;
  extra_money_trx.value.val2_at = data.value.val2_at;

  extra_money_trx.value.val3 = data.value.val3;
  extra_money_trx.value.val3_user = data.value.val3_user;
  extra_money_trx.value.val3_by = data.value.val3_by;
  extra_money_trx.value.val3_at = data.value.val3_at;

  extra_money_trx.value.val4 = data.value.val4;
  extra_money_trx.value.val4_user = data.value.val4_user;
  extra_money_trx.value.val4_by = data.value.val4_by;
  extra_money_trx.value.val4_at = data.value.val4_at;

  extra_money_trx.value.val5 = data.value.val5;
  extra_money_trx.value.val5_user = data.value.val5_user;
  extra_money_trx.value.val5_by = data.value.val5_by;
  extra_money_trx.value.val5_at = data.value.val5_at;

  extra_money_trx.value.val6 = data.value.val6;
  extra_money_trx.value.val6_user = data.value.val6_user;
  extra_money_trx.value.val6_by = data.value.val6_by;
  extra_money_trx.value.val6_at = data.value.val6_at;


  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>-1){
    props.p_data.splice(idx,1,{...extra_money_trx.value});    
  }

  save_state.value = "BERHASIL";
}


const callData = async () => {
  save_state.value = '';

  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/extra_money_trx", {
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

  extra_money_trx.value = dt;
  selected_employee.value._raw=dt.employee;

  selected_employee.value._.id.val=dt.employee.id;
  selected_employee.value._.name.val=dt.employee.name;
  selected_employee.value._.rek_no.val=dt.employee_rek_no;
  selected_employee.value._.rek_name.val=dt.employee_rek_name;

  selected_employee.value.id=dt.employee.id;
  selected_employee.value.name=dt.employee.name;
  selected_employee.value.rek_no=(dt.employee_rek_no || '')+" "+(dt.employee_rek_name || '');

  selected_extra_money.value._raw=dt.extra_money;

  selected_extra_money.value._.id.val=dt.extra_money.id;
  selected_extra_money.value._.xto.val=dt.extra_money.xto;
  selected_extra_money.value._.description.val=dt.extra_money.description;
  selected_extra_money.value._.total.val=pointFormat(dt.extra_money.total);

  selected_extra_money.value.id=dt.extra_money.id;
  selected_extra_money.value.name=dt.extra_money.xto;
  selected_extra_money.value.title=(pointFormat(dt.extra_money.total) || '')+" "+(dt.extra_money.description || '');

}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    document.addEventListener('keydown', keydownListener);
    extra_money_trx.value = {...extra_money_trx_temp};
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
  }else{
    document.removeEventListener('keydown', keydownListener);
  }
}, {
  immediate: true
});


const emit = defineEmits(['setID','setIndex']);

const loadDown=()=>{
  let $idx = props.p_data.map((x)=>x.id).indexOf(props.id);
  if($idx==props.p_data.length-1){
    return;
  }
  $idx++;
  emit('setID',props.p_data[$idx].id);
  emit('setIndex',$idx);
  setTimeout(()=>{
    callData();
  },100);
};

const loadTop=()=>{
  let $idx = props.p_data.map((x)=>x.id).indexOf(props.id);
  if($idx==0){
    return;
  }
  $idx--;
  emit('setID',props.p_data[$idx].id);
  emit('setIndex',$idx);
  setTimeout(()=>{
    callData();
  },100);
};
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
