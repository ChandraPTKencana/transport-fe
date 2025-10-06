<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Full Transaction'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

      <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white p-1">
        <div ref="main_part" class="w-full flex flex-col items-center grow overflow-auto" >
          <FormsTrxTrpFullPartUj :trx_trp="trx_trp"/>
          <FormsTrxTrpFullPartAbsen :trx_trp="trx_trp"/>
          <FormsTrxTrpFullPartTicket :trx_trp="trx_trp"/>
          <FormsTrxTrpFullPartStt :standby_trxs="trx_trp.standby_trxs" :p_data="p_data" :save_do="stt_save_do" :save_state="stt_save_state"/>
          <!-- kelompok : Extra Money , Trip , Potongan, Absen, Standby -->
        </div>
        <div class="w-full flex items-center justify-end">
          <button type="button" name="button" class="w-36 h-9 m-1 grid place-items-center" @click="loadTop()">
            <IconsCaretTop class="black"/>
          </button>
          <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
            Cancel
          </button>
          <!-- <button ref="it_val" v-if="it_state==1" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doValidate()">
            Validasi
            <div class="text-xs font-bold" v-if="stt_save_state!=''">
              {{ stt_save_state }}
            </div>
          </button>
          <button ref="it_unval" v-if="it_state==0" type="submit" name="button" class="w-36 m-1 bg-yellow-600 text-white  rounded-sm" @click.prevent="doUnValidate()">
            Unvalidasi
            <div class="text-xs font-bold" v-if="stt_save_state!=''">
              {{ stt_save_state }}
            </div>
          </button> -->
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
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
const { pointFormat } = useUtils();

const main_part = ref(null);

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
  standby_trx:{
    type: Object,
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

const trx_trp_temp = {
    id: -1,
    tanggal: new Date(),
    payment_method:{
      name:""
    },
    id_uj: -1,
    xto: "",
    tipe: "",
    jenis:"",
    amount: 0,
    pv_id: -1,
    pv_no:"",
    pv_total:0,
    supir: "",
    kernet: "",
    no_pol: '',
    val:0,
    val_by:{ username:"" },
    val_at:"",
    val1:0,
    val1_by:{ username:"" },
    val1_at:"",
    val2:0,
    val2_by:{ username:"" },
    val2_at:"",
    val3:0,
    val3_by:{ username:"" },
    val3_at:"",
    val4:0,
    val4_by:{ username:"" },
    val4_at:"",
    val5:0,
    val5_by:{ username:"" },
    val5_at:"",
    val6:0,
    val6_by:{ username:"" },
    val6_at:"",
    ritase_val:0,
    ritase_val_by:{ username:"" },
    ritase_val_at:"",
    ritase_val1:0,
    ritase_val1_by:{ username:"" },
    ritase_val1_at:"",
    ritase_val2:0,
    ritase_val2_by:{ username:"" },
    ritase_val2_at:"",
    cost_center_code:"",
    cost_center_desc:"",
    pvr_id:"",
    pvr_no:"",
    pvr_total:"",
    pvr_had_detail:"",
    uj_combine:{supir:[],kernet:[]}
};
const trx_trp = ref({...trx_trp_temp});

const token = useDynamicPathCookie('token');

const stt_save_state = ref([]);
const stt_save_do = ref([]);


const callData = async () => {
  if(!props.standby_trx.trx_trp_id) {
    props.fnClose();
    return;
  }
  setTimeout(()=>{
    main_part.value.scrollTop = 0
  },1);
  stt_save_state.value = [];
  stt_save_do.value = [];
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/standby_trx/full_view", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {trx_trp_id:props.standby_trx.trx_trp_id},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }


  let dt =data.value.data;
  trx_trp.value = dt;

  trx_trp.value.standby_trxs.forEach((x)=>{
    stt_save_state.value.push("");
    stt_save_do.value.push("");
  })


}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    document.addEventListener('keydown', keydownListener);    
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
