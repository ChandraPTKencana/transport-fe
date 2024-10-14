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
                <label for="">ID</label>
                <div class="border-solid border-2 w-fit p-1 bg-slate-700 text-white">
                  {{ trx_trp.id }}
                </div>               
              </div>
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
                <div class="w-full flex justify-center items-center">
                  <img :src="trx_trp.img_leave" alt="">
                </div>
              </div>
            </div>

            <div class="w-full sm:w-1/2 text-center p-1">
              <div class="border-[1px] p-1">
                <div class="border-[1px] p-1">
                  <label class="font-bold">Tiba : {{ trx_trp.img_arrive_ts ? $moment(trx_trp.img_arrive_ts).format("DD-MM-YYYY HH:mm") : "" }}</label>
                  <div class="w-full flex justify-center items-center">
                    <img :src="trx_trp.img_arrive" alt="">
                  </div>
                </div>
              </div>
            </div>

            <div class="w-full sm:w-1/2 text-center p-1">
              <div class="border-[1px] p-1">
                <div class="border-[1px] p-1">
                  <label class="font-bold">Kembali : {{ trx_trp.img_return_ts ? $moment(trx_trp.img_return_ts).format("DD-MM-YYYY HH:mm") : "" }}</label>
                  <div class="w-full flex justify-center items-center">
                    <img :src="trx_trp.img_return" alt="">
                  </div>
                </div>
              </div>
            </div>

            <div class="w-full sm:w-1/2 text-center p-1">
              <div class="border-[1px] p-1">
                <div class="border-[1px] p-1">
                  <label class="font-bold">Sampai : {{ trx_trp.img_till_ts ? $moment(trx_trp.img_till_ts).format("DD-MM-YYYY HH:mm") : "" }}</label>
                  <div class="w-full flex justify-center items-center">
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
            <button v-if="useUtils().checkPermissions(['trp_trx.absen.clear_valval1']) && trx_trp.ritase_val2==0" type="button" name="button" class="w-36 m-1 bg-yellow-600" @click="clearVal()">
              Clear Val
            </button>
            <div>
              Di Validasi oleh : 
            </div>
            <div v-if="trx_trp.ritase_val || trx_trp.ritase_val1 || trx_trp.ritase_val2" class="border-solid border-2 w-fit p-1 bg-slate-700 text-white text-xs">
              <div v-if="trx_trp.ritase_val">
                App 1 : {{ trx_trp.ritase_val_by.username}} ( {{ trx_trp.ritase_val_at ? $moment(trx_trp.ritase_val_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
              </div>
              <div v-if="trx_trp.ritase_val1">
                App 2 : {{ trx_trp.ritase_val1_by.username}} ( {{ trx_trp.ritase_val1_at ? $moment(trx_trp.ritase_val1_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
              </div>
              <div v-if="trx_trp.ritase_val2">
                App 3 : {{ trx_trp.ritase_val2_by.username}} ( {{ trx_trp.ritase_val2_at ? $moment(trx_trp.ritase_val2_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
              </div>
            </div>
          </div>

          <button type="button" name="button" class="w-36 h-9 m-1 grid place-items-center" @click="loadTop()">
            <IconsCaretTop class="black"/>
          </button>
          <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
            Cancel
          </button>
          <button ref="it_val" v-if="is_view==0" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm flex flex-col items-center justify-center" @click.prevent="doSave()">
            <div> Validasi </div>            
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

    ritase_val2:0,
    ritase_val2_by:{ username:"" },
    ritase_val2_at:"",

};
const trx_trp = ref({...trx_trp_temp});

const token = useCookie('token');
const it_val = ref(null);
const save_state = ref("");
const doSave = async () => {
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
    save_state.value = "GAGAL";
    useErrorStore().trigger(error);
    return;
  }
  

  trx_trp.value.ritase_val = data.value.ritase_val;
  // trx_trp.value.ritase_val_user = data.value.ritase_val_user;
  trx_trp.value.ritase_val_by = data.value.ritase_val_by;
  trx_trp.value.ritase_val_at = data.value.ritase_val_at;

  trx_trp.value.ritase_val1 = data.value.ritase_val1;
  // trx_trp.value.ritase_val1_user = data.value.ritase_val1_user;
  trx_trp.value.ritase_val1_by = data.value.ritase_val1_by;
  trx_trp.value.ritase_val1_at = data.value.ritase_val1_at;

  trx_trp.value.ritase_val2 = data.value.ritase_val2;
  // trx_trp.value.ritase_val2_user = data.value.ritase_val2_user;
  trx_trp.value.ritase_val2_by = data.value.ritase_val2_by;
  trx_trp.value.ritase_val2_at = data.value.ritase_val2_at;


  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...trx_trp.value});    
  }
  save_state.value = "BERHASIL";

  // props.fnClose();
}

const clearVal = async () => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  
  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/trx_trp/absen/clear_valval1", {
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
  
  trx_trp.value.ritase_val = 0;
  trx_trp.value.ritase_val1 = 0;

  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...trx_trp.value});    
  }

  // props.fnClose();
}

const callData = async () => {
  save_state.value = '';

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
    document.addEventListener('keydown', keydownListener);
    if(props.is_view==false){
      setTimeout(()=>{
        it_val.value.focus();
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
*::-webkit-scrollbar {
    width: 1em;
}

*::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

*::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid slategrey;
}
</style>
