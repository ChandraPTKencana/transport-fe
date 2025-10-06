<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Full Transaction'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

      <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white p-1">
        <!-- kelompok : Extra Money , Trip , Potongan, Absen, Standby -->
        <div ref="main_part" class="w-full flex flex-col items-center grow overflow-auto">
          <FormsTrxTrpFullPartUj :trx_trp="trx_trp" :p_data="p_data" :save_do="uj_save_do" :save_state="uj_save_state"/>
          <FormsTrxTrpFullPartEmt :extra_money_trxs="trx_trp.extra_money_trxs" />
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
            <div class="text-xs font-bold" v-if="save_state!=''">
              {{ save_state }}
            </div>
          </button>
          <button ref="it_unval" v-if="it_state==0" type="submit" name="button" class="w-36 m-1 bg-yellow-600 text-white  rounded-sm" @click.prevent="doUnValidate()">
            Unvalidasi
            <div class="text-xs font-bold" v-if="save_state!=''">
              {{ save_state }}
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

const uj_save_state = ref([""]);
const uj_save_do = ref([""]);

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
const it_val = ref(null);
const it_unval = ref(null);

const save_state = ref("");
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
  note:""

};


const selected_supir = ref(JSON.parse(JSON.stringify(selected_mini_temp)));
const selected_kernet = ref(JSON.parse(JSON.stringify(selected_mini_temp)));


const selected_mini_temp_uj={
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
    asst_opt:{
      tcon:"IconsPerson",
      text:"Info",
      val:"",
    },
    tipe:{
      tcon:"",
      text:"Tipe",
      val:"",
    },
    harga:{
      tcon:"IconsMoney",
      text:"Amount",
      val:"",
    },
    
  },
  id:"",
  name:"",
  title:"",
  note:""
};
const selected_uj = ref(JSON.parse(JSON.stringify(selected_mini_temp_uj)));

const doValidate = async () => {
  save_state.value = "PROSES...";
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  
  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/trx_trp_validasi", {
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
    save_state.value = "GAGAL";
    useErrorStore().trigger(error);
    return;
  }
  
  trx_trp.value.val = data.value.val;
  trx_trp.value.val_user = data.value.val_user;
  trx_trp.value.val_by = data.value.val_by;
  trx_trp.value.val_at = data.value.val_at;

  trx_trp.value.val1 = data.value.val1;
  trx_trp.value.val1_user = data.value.val1_user;
  trx_trp.value.val1_by = data.value.val1_by;
  trx_trp.value.val1_at = data.value.val1_at;

  trx_trp.value.val2 = data.value.val2;
  trx_trp.value.val2_user = data.value.val2_user;
  trx_trp.value.val2_by = data.value.val2_by;
  trx_trp.value.val2_at = data.value.val2_at;

  trx_trp.value.val3 = data.value.val3;
  trx_trp.value.val3_user = data.value.val3_user;
  trx_trp.value.val3_by = data.value.val3_by;
  trx_trp.value.val3_at = data.value.val3_at;

  trx_trp.value.val4 = data.value.val4;
  trx_trp.value.val4_user = data.value.val4_user;
  trx_trp.value.val4_by = data.value.val4_by;
  trx_trp.value.val4_at = data.value.val4_at;

  trx_trp.value.val5 = data.value.val5;
  trx_trp.value.val5_user = data.value.val5_user;
  trx_trp.value.val5_by = data.value.val5_by;
  trx_trp.value.val5_at = data.value.val5_at;

  trx_trp.value.val6 = data.value.val6;
  trx_trp.value.val6_user = data.value.val6_user;
  trx_trp.value.val6_by = data.value.val6_by;
  trx_trp.value.val6_at = data.value.val6_at;

  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...trx_trp.value});    
  }

  save_state.value = "BERHASIL";

  // props.fnClose();
}

const doUnValidate = async () => {
  save_state.value = "PROSES...";
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  
  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/trx_trp_unvalidasi", {
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
    save_state.value = "GAGAL";
    useErrorStore().trigger(error);
    return;
  }
  
  trx_trp.value.val = data.value.val;
  trx_trp.value.val_user = data.value.val_user;
  trx_trp.value.val_by = data.value.val_by;
  trx_trp.value.val_at = data.value.val_at;

  trx_trp.value.val1 = data.value.val1;
  trx_trp.value.val1_user = data.value.val1_user;
  trx_trp.value.val1_by = data.value.val1_by;
  trx_trp.value.val1_at = data.value.val1_at;

  trx_trp.value.val2 = data.value.val2;
  trx_trp.value.val2_user = data.value.val2_user;
  trx_trp.value.val2_by = data.value.val2_by;
  trx_trp.value.val2_at = data.value.val2_at;

  trx_trp.value.val3 = data.value.val3;
  trx_trp.value.val3_user = data.value.val3_user;
  trx_trp.value.val3_by = data.value.val3_by;
  trx_trp.value.val3_at = data.value.val3_at;

  trx_trp.value.val4 = data.value.val4;
  trx_trp.value.val4_user = data.value.val4_user;
  trx_trp.value.val4_by = data.value.val4_by;
  trx_trp.value.val4_at = data.value.val4_at;

  trx_trp.value.val5 = data.value.val5;
  trx_trp.value.val5_user = data.value.val5_user;
  trx_trp.value.val5_by = data.value.val5_by;
  trx_trp.value.val5_at = data.value.val5_at;

  trx_trp.value.val6 = data.value.val6;
  trx_trp.value.val6_user = data.value.val6_user;
  trx_trp.value.val6_by = data.value.val6_by;
  trx_trp.value.val6_at = data.value.val6_at;

  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...trx_trp.value});    
  }

  save_state.value = "BERHASIL";

  // props.fnClose();
}

const set_uj_dt = (dt)=>{
  let temp = JSON.parse(JSON.stringify(selected_mini_temp_uj));
  temp._.id.val = dt.id,
  temp._.xto.val = dt.xto,
  temp._.asst_opt.val = dt.asst_opt,
  temp._.tipe.val = dt.tipe,
  temp._.harga.val = pointFormat(dt.harga),

  temp.id = dt.id,
  temp.name = dt.xto,
  temp.title = (dt.asst_opt || '')+" "+(dt.tipe || '')+" "+(pointFormat(dt.harga) || ''),
  
  temp._raw = dt;
  return temp;
}

const callData = async () => {
  uj_save_state.value = [""];
  uj_save_do.value = [""];
  setTimeout(()=>{
    main_part.value.scrollTop = 0
  },1);
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_trp/full_view", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id:props.id},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }


  let dt =data.value.data;
  trx_trp.value = dt;
  selected_supir.value._.id.val=dt.supir_id;
  selected_supir.value._.name.val=dt.supir;
  selected_supir.value._.rek_no.val=dt.supir_rek_no;
  selected_supir.value._.rek_name.val=dt.supir_rek_name;

  selected_supir.value.id=dt.supir_id;
  selected_supir.value.name=dt.supir;
  selected_supir.value.rek_no=(dt.supir_rek_no || '')+" "+(dt.supir_rek_name || '');


  selected_kernet.value._.id.val=dt.kernet_id;
  selected_kernet.value._.name.val=dt.kernet;
  selected_kernet.value._.rek_no.val=dt.kernet_rek_no;
  selected_kernet.value._.rek_name.val=dt.kernet_rek_name;
  selected_kernet.value.id=dt.kernet_id;
  selected_kernet.value.name=dt.kernet;
  selected_kernet.value.rek_no=(dt.kernet_rek_no || '')+" "+(dt.kernet_rek_name || '');

  selected_uj.value = set_uj_dt(dt.uj);

  let $ttl_cut_fs =0;
  let $ttl_cut_fk =0;

  dt.potongan.forEach((e)=>{
    if(e.potongan_mst.employee_id == dt.supir_id){
      $ttl_cut_fs += parseInt(e.nominal_cut);
    }
    if(e.potongan_mst.employee_id == dt.kernet_id){
      $ttl_cut_fk += parseInt(e.nominal_cut);
    }
  })

  selected_supir.value.note="";
  selected_kernet.value.note="";
  if($ttl_cut_fs > 0 ){
    selected_supir.value.note="Telah di potong sebesar :"+useUtils().pointFormat($ttl_cut_fs);
  }
  if($ttl_cut_fk > 0 ){
    selected_kernet.value.note="Telah di potong sebesar :"+useUtils().pointFormat($ttl_cut_fk);
  }

  // trx_trp.value.uj_combine = JSON.parse(JSON.stringify(data.value.data.uj_details2));


  // trx_trp.value['uj_combine']={supir:[],kernet:[]};
  // data.value.data.uj_details2.forEach((dtl2)=>{

  //   if(dtl2.xfor == 'Kernet'){
  //     trx_trp.value.uj_combine.kernet.push(dtl2)
  //   }else{
  //     trx_trp.value.uj_combine.supir.push(dtl2)
  //   }
  // })

  
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    document.addEventListener('keydown', keydownListener);
    // if(props.it_state==1){
    //   setTimeout(()=>{
    //     it_val.value.focus();
    //   },1);
    // }
    // if(props.it_state==0){
    //   setTimeout(()=>{
    //     it_unval.value.focus();
    //   },1);
    // }
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
