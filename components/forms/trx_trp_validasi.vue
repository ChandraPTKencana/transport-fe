<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Transaction Validation'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

      <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
        <div class="w-full flex flex-col items-center grow overflow-auto">
          <div class="w-full flex flex-row flex-wrap">

            <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">U.Jalan Per</label>
              <div class="card-border">
                {{ trx_trp.tanggal ? $moment(trx_trp.tanggal).format("DD-MM-YYYY") : "" }}
              </div>
            </div>

            <div class="w-6/12 sm:w-2/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">Jenis</label>
              <div class="card-border">
                {{ trx_trp.jenis }}
              </div>
            </div>
            <div class="w-6/12 sm:w-4/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
              <label for="">Payment Method</label>
              <div class="card-border">
                {{ trx_trp.payment_method.name }}
              </div>
            </div>

            <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
              <label for="">No Pol</label>
              <div class="card-border">
                {{ trx_trp.no_pol }}
              </div>
            </div>

            <div v-if="trx_trp.jenis!=''" class="w-full flex flex-wrap">
              <div class="w-full sm:w-6/12 flex flex-col flex-wrap p-1">
                <label for="">Uang Jalan</label>
                <div class="card-border">
                  <WidthMiniPart :selected="selected_uj"/>
                </div>
              </div>
              <div class="w-full sm:w-6/12 flex flex-col flex-wrap p-1">
                <label for="">Note For Remarks</label>
                <div class="card-border">
                  {{ trx_trp.note_for_remarks }}
                </div>
              </div>
            </div>


            <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
              <label for="">Supir</label>
              <div class="card-border">
                <WidthMiniPart :selected="selected_supir"/>
              </div>
            </div>

            <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
              <label for="">Kernet</label>
              <div class="card-border">
                <WidthMiniPart :selected="selected_kernet"/>
              </div>
            </div>

            <div class="w-full flex flex-col flex-wrap p-1 bg-yellow-300 font-bold mt-5 text-red-900">
              Informasi Pembayaran ( Harap di baca sebelum melakukan unvalidasi )
            </div>

            <div class="w-full md:w-4/12 flex  flex-wrap">
              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Sudah dibayarkan ?</label>
                <div class="card-border">
                  {{ trx_trp.received_payment ? "Ya" : "Tidak" }}
                </div>
              </div>
            </div>
            <div class="w-full sm:w-6/12 md:w-4/12 flex flex-wrap flex-col p-1">
              <label for="">Duitku Supir</label>
              <div class="card-border !flex flex-row flex-wrap">
                <div class="w-4/12 flex-col">
                  <div class="font-bold">ID</div>
                  <div>{{ trx_trp.duitku_supir_disburseId }}</div>
                </div>
                <div class="w-4/12 flex-col pl-1">
                  <div class="font-bold">Inquery</div>
                  <div>{{ trx_trp.duitku_supir_inv_res_desc }}</div>
                </div>
                <div class="w-4/12 flex-col pl-1">
                  <div class="font-bold">Transfer</div>
                  <div>{{ trx_trp.duitku_supir_trf_res_desc }}</div>
                </div>
              </div>
            </div>
            <div class="w-full sm:w-6/12 md:w-4/12 flex flex-wrap flex-col p-1">
              <label for="">Duitku Kernet</label>
              <div class="card-border !flex flex-row flex-wrap">
                <div class="w-4/12 flex-col">
                  <div class="font-bold">ID</div>
                  <div>{{ trx_trp.duitku_kernet_disburseId }}</div>
                </div>
                <div class="w-4/12 flex-col pl-1">
                  <div class="font-bold">Inquery</div>
                  <div>{{ trx_trp.duitku_kernet_inv_res_desc }}</div>
                </div>
                <div class="w-4/12 flex-col pl-1">
                  <div class="font-bold">Transfer</div>
                  <div>{{ trx_trp.duitku_kernet_trf_res_desc }}</div>
                </div>
              </div>
            </div>

            <div class="w-full sm:w-6/12 md:w-6/12 flex flex-wrap flex-col p-1">
              <label for="">Cost Center</label>
              <div class="card-border !flex flex-row flex-wrap">
                <div class="w-6/12 flex-col">
                  <div class="font-bold">Code</div>
                  <div>{{ trx_trp.cost_center_code }}</div>
                </div>
                <div class="w-6/12 flex-col pl-1">
                  <div class="font-bold">Desc</div>
                  <div>{{ trx_trp.cost_center_desc }}</div>
                </div>
              </div>
            </div>


            <div class="w-full sm:w-6/12 md:w-3/12 flex flex-wrap flex-col p-1">
              <label for="">PVR</label>
              <div class="card-border !flex flex-row flex-wrap">
                <div class="w-6/12 flex-col">
                  <div class="font-bold">No</div>
                  <div>{{ trx_trp.pvr_no }}</div>
                </div>
                <div class="w-6/12 flex-col pl-1">
                  <div class="font-bold">Total</div>
                  <div>{{ pointFormat(trx_trp.pvr_total || 0) }}</div>
                </div>
              </div>
            </div>

            <div class="w-full sm:w-6/12 md:w-3/12 flex flex-wrap flex-col p-1">
              <label for="">PV</label>
              <div class="card-border !flex flex-row flex-wrap">
                <div class="w-6/12 flex-col">
                  <div class="font-bold">No</div>
                  <div>{{ trx_trp.pv_no }}</div>
                </div>
                <div class="w-6/12 flex-col pl-1">
                  <div class="font-bold">Amount</div>
                  <div>{{ pointFormat(trx_trp.pv_total || 0) }}</div>
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
            <div v-if="trx_trp.val || trx_trp.val1 || trx_trp.val2 || trx_trp.val3 || trx_trp.val4 || trx_trp.val5 || trx_trp.val6" class="border-solid border-2 w-fit p-1 bg-slate-700 text-white text-xs">
              <div v-if="trx_trp.val">
                Kasir : {{ trx_trp.val_by.username}} ( {{ trx_trp.val_at ? $moment(trx_trp.val_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
              </div>
              <div v-if="trx_trp.val1">
                Mandor : {{ trx_trp.val1_by.username}} ( {{ trx_trp.val1_at ? $moment(trx_trp.val1_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
              </div>
              <div v-if="trx_trp.val2">
                KTU/W : {{ trx_trp.val2_by.username}} ( {{ trx_trp.val2_at ? $moment(trx_trp.val2_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
              </div>
              <div v-if="trx_trp.val3">
                Marketing : {{ trx_trp.val3_by.username}} ( {{ trx_trp.val3_at ? $moment(trx_trp.val3_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
              </div>
              <div v-if="trx_trp.val4">
                Logistik : {{ trx_trp.val4_by.username}} ( {{ trx_trp.val4_at ? $moment(trx_trp.val4_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
              </div>
              <div v-if="trx_trp.val5">
                SPV Logistik : {{ trx_trp.val5_by.username}} ( {{ trx_trp.val5_at ? $moment(trx_trp.val5_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
              </div>
              <div v-if="trx_trp.val6">
                MGR Logistik : {{ trx_trp.val6_by.username}} ( {{ trx_trp.val6_at ? $moment(trx_trp.val6_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
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
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
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
    cost_center_code:"",
    cost_center_desc:"",
    pvr_id:"",
    pvr_no:"",
    pvr_total:"",
    pvr_had_detail:"",
};
const trx_trp = ref({...trx_trp_temp});

const token = useCookie('token');
const it_val = ref(null);
const it_unval = ref(null);

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

  props.fnClose();
}

const doUnValidate = async () => {
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

  props.fnClose();
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
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_trp", {
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

}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
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
