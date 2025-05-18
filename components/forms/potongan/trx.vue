<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Potongan Trx'" :fn="fnClose" class="w-100 flex align-items-center" style="color:white;" />

      <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
        <div class="w-full flex flex-col items-center grow overflow-auto">
          <div class="w-full flex flex-row flex-wrap">
            <div class="w-6/12 sm:w-3/12 md:w-2/12 lg:w-3/12 flex flex-col flex-wrap p-1">
              <label for="">Nominal Potong</label>
              <div class="w-full" >
                <InputPointFormat
                class="w-full h-full" 
                type="text" 
                :value="potongan_trx.nominal_cut || 0" 
                @input="potongan_trx.nominal_cut = $event"
                :show="show"
                :disabled="potongan_trx.trx_trp_id"
                />
              </div>
              <p class="text-red-500">{{ field_errors.ref }}</p>
            </div>
            <div class="w-full flex flex-col flex-wrap p-1">
              <label for="">Keterangan</label>
              <textarea v-model="potongan_trx.note" rows="10"> </textarea>
              <p class="text-red-500">{{ field_errors.note }}</p>
            </div>
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
  potongan_mst_id:{
    type: Number,
    required: false,
    default: 0,
  },
  p_data:{
    type:Array,
    required:true,
    default:[]
  },
})

const potongan_trx_temp = {
  id: -1,
  note: "",
  nominal_cut: "",
};

const potongan_trx = ref({...potongan_trx_temp});

const token = useDynamicPathCookie('token');
const field_errors = ref({})

const emit = defineEmits(['updateRemainingCut']);

const doSave = async () => { 
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("potongan_mst_id", props.potongan_mst_id);
  data_in.append("note", potongan_trx.value.note);
  data_in.append("nominal_cut", potongan_trx.value.nominal_cut);

  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/potongan_trx", {
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

  potongan_trx.value.updated_at = data.value.updated_at;
  
  if(props.id<=0){
    potongan_trx.value.id = data.value.id;
    potongan_trx.value.created_at = data.value.created_at;
    props.p_data.unshift(potongan_trx.value);
  }else{
    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...potongan_trx.value});    
    }
  }
  emit('updateRemainingCut',data.value.remaining_cut);
  props.fnClose();
}


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/potongan_trx", {
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

  potongan_trx.value = data.value.data;
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    potongan_trx.value = {...potongan_trx_temp};
    field_errors.value = {};
    if(props.id!=0)
    callData();
  }
}, {
  immediate: true
});

</script>
