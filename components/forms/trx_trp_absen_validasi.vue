<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Transaction Validation'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

      <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
        <div class="w-full flex flex-col items-center grow overflow-auto">
          <div class="w-full">
            <div class="w-full flex flex-wrap p-3 items-center text-xs">
              <div>
                <label for="">U.jalan Per</label>
                <div class="border-solid border-2 w-fit p-1 bg-slate-700 text-white">
                  {{ trx_trp.tanggal ? $moment(trx_trp.tanggal).format("DD-MM-YYYY") : "" }}
                </div>               
              </div>
              <div>
                <label for="">Jenis</label>
                <div class="border-solid border-2 w-fit p-1 bg-slate-700 text-white">
                  {{ trx_trp.jenis }}
                </div>               
              </div>

              <div>
                <label for="">Supir</label>
                <div class="border-solid border-2 w-fit p-1 bg-slate-700 text-white">
                  {{ trx_trp.supir }}
                </div>               
              </div>

              <div v-if="trx_trp.kernet">
                <label for="">Kernet</label>
                <div class="border-solid border-2 w-fit p-1 bg-slate-700 text-white">
                  {{ trx_trp.kernet }}
                </div>               
              </div>
              <div>
                <label for="">No Pol</label>
                <div class="border-solid border-2 w-fit p-1 bg-slate-700 text-white">
                  {{ trx_trp.no_pol }}
                </div>               
              </div>

              <div>
                <label for="">Tujuan</label>
                <div class="border-solid border-2 w-fit p-1 bg-slate-700 text-white">
                  {{ trx_trp.xto }}
                </div>               
              </div>

              <div>
                <label for="">Tipe</label>
                <div class="border-solid border-2 w-fit p-1 bg-slate-700 text-white">
                  {{ trx_trp.tipe }}
                </div>               
              </div>
            </div>
          </div>

          <div class="w-full flex flex-wrap items-center grow overflow-auto">
            <div class="w-full sm:w-1/2 text-center p-1">
              <div class="border-[1px] p-1">
                <label class="font-bold">Berangkat : {{ trx_trp.img_leave_ts ? $moment(trx_trp.img_leave_ts).format("DD-MM-YYYY HH:mm") : "" }}</label>
                <div>
                  <img :src="trx_trp.img_leave" alt="">
                </div>
              </div>
            </div>

            <div class="w-full sm:w-1/2 text-center p-1">
              <div class="border-[1px] p-1">
                <div class="border-[1px] p-1">
                  <label class="font-bold">Tiba : {{ trx_trp.img_arrive_ts ? $moment(trx_trp.img_arrive_ts).format("DD-MM-YYYY HH:mm") : "" }}</label>
                  <div>
                    <img :src="trx_trp.img_arrive" alt="">
                  </div>
                </div>
              </div>
            </div>

            <div class="w-full sm:w-1/2 text-center p-1">
              <div class="border-[1px] p-1">
                <div class="border-[1px] p-1">
                  <label class="font-bold">Kembali : {{ trx_trp.img_return_ts ? $moment(trx_trp.img_return_ts).format("DD-MM-YYYY HH:mm") : "" }}</label>
                  <div>
                    <img :src="trx_trp.img_return" alt="">
                  </div>
                </div>
              </div>
            </div>

            <div class="w-full sm:w-1/2 text-center p-1">
              <div class="border-[1px] p-1">
                <div class="border-[1px] p-1">
                  <label class="font-bold">Sampai : {{ trx_trp.img_till_ts ? $moment(trx_trp.img_till_ts).format("DD-MM-YYYY HH:mm") : "" }}</label>
                  <div>
                    <img :src="trx_trp.img_till" alt="">
                  </div>
                </div>
              </div>
            </div>

            <div class="w-full p-1">
              <label for=""> Note </label>
              <div class="card-border">
                {{ trx_trp.ritase_note }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="w-full flex items-center justify-end">
          <div class="w-full flex flex-wrap p-3 items-center">
            <div>
              Di Validasi oleh : 
            </div>
            <div v-if="trx_trp.ritase_val || trx_trp.ritase_val1 || trx_trp.ritase_val2 || trx_trp.ritase_val3 || trx_trp.ritase_val4 || trx_trp.ritase_val5" class="border-solid border-2 w-fit p-1 bg-slate-700 text-white text-xs">
              <div v-if="trx_trp.ritase_val">
                App 1 : {{ trx_trp.ritase_val_by.username}} ( {{ trx_trp.ritase_val_at ? $moment(trx_trp.ritase_val_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
              </div>
              <div v-if="trx_trp.ritase_val1">
                App 2 : {{ trx_trp.ritase_val1_by.username}} ( {{ trx_trp.ritase_val1_at ? $moment(trx_trp.ritase_val1_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
              </div>
            </div>
          </div>
          <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
            Cancel
          </button>
          <button v-if="is_view==0" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
            Validasi
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
  is_view:{
    type:Boolean,
    required:false,
    default:false
  },
})

const trx_trp_temp = {
  id: -1,
    tanggal: new Date(),
    id_uj: -1,
    xto: "",
    tipe: "",
    jenis:"",
    amount: 0,

    img_leaves:[],
    img_leave:"",
    img_arrive:"",
    img_return:"",
    img_till:"",

    img_leave_file:"",
    img_arrive_file:"",
    img_return_file:"",
    img_till_file:"",
    
    img_leave_ts:"",
    img_arrive_ts:"",
    img_return_ts:"",
    img_till_ts:"",

    ritase_note:"",
    ritase_val:0,
    ritase_val_by:{ username:"" },
    ritase_val_at:"",
    ritase_val1:0,
    ritase_val1_by:{ username:"" },
    ritase_val1_at:"",
};
const trx_trp = ref({...trx_trp_temp});

const token = useCookie('token');

const doSave = async () => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  
  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/trx_trp/absen/validasi", {
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
  

  trx_trp.value.ritase_val = data.value.ritase_val;
  trx_trp.value.ritase_val_user = data.value.ritase_val_user;
  trx_trp.value.ritase_val_by = data.value.ritase_val_by;
  trx_trp.value.ritase_val_at = data.value.ritase_val_at;

  trx_trp.value.ritase_val1 = data.value.ritase_val1;
  trx_trp.value.ritase_val1_user = data.value.ritase_val1_user;
  trx_trp.value.ritase_val1_by = data.value.ritase_val1_by;
  trx_trp.value.ritase_val1_at = data.value.ritase_val1_at;



  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...trx_trp.value});    
  }

  props.fnClose();
}

const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_trp/absen", {
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

  trx_trp.value = data.value.data;
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    callData();
  }
}, {
  immediate: true
});
</script>
