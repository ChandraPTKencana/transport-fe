<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Check Absen'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
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
                <label class="font-bold">Berangkat </label>
                <ClientOnly>
                  <vue-date-picker  v-model="trx_trp.img_leave_ts" 
                  type="datetime" 
                  format="dd-MM-yyyy HH:mm" 
                  :enable-time-picker = "true" 
                  text-input
                  teleport-center
                  class="flex-grow"
                  placeholder="Waktu Berangkat"></vue-date-picker>
                </ClientOnly>
                <p class="text-red-500">{{ field_errors.img_leave_ts }}</p>             
                <AttachmentSingle :value="trx_trp.img_leave" @setFile="trx_trp.img_leave_file=$event"  @setPreview="trx_trp.img_leave=$event" :can_remove="true"/>
                <p class="text-red-500">{{ field_errors.img_leave }}</p>             

                
                <div v-if="trx_trp.img_leaves.length > 1" class="flex flex-wrap">
                  <div v-for="il in trx_trp.img_leaves" class="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 p-1">
                    <img class="w-full cursor-pointer" :src="il.gambar" @click="trx_trp.img_leave=il.gambar,trx_trp.img_leave_file=''">
                  </div>
                </div>
              </div>
            </div>

            <div class="w-full sm:w-1/2 text-center p-1">
              <div class="border-[1px] p-1">
                <label class="font-bold">Tiba </label>
                <ClientOnly>
                  <vue-date-picker  v-model="trx_trp.img_arrive_ts" 
                  type="datetime" 
                  format="dd-MM-yyyy HH:mm" 
                  :enable-time-picker = "true" 
                  text-input
                  teleport-center
                  class="flex-grow"
                  placeholder="Waktu Tiba"></vue-date-picker>
                </ClientOnly>
                <p class="text-red-500">{{ field_errors.img_arrive_ts }}</p>             
                <AttachmentSingle :value="trx_trp.img_arrive" @setFile="trx_trp.img_arrive_file=$event"  @setPreview="trx_trp.img_arrive=$event" :can_remove="true"/>
                <p class="text-red-500">{{ field_errors.img_arrive }}</p>             
              </div>
            </div>

            <div class="w-full sm:w-1/2 text-center p-1">
              <div class="border-[1px] p-1">
                <label class="font-bold">Kembali </label>
                <ClientOnly>
                  <vue-date-picker  v-model="trx_trp.img_return_ts" 
                  type="datetime" 
                  format="dd-MM-yyyy HH:mm" 
                  :enable-time-picker = "true" 
                  text-input
                  teleport-center
                  class="flex-grow"
                  placeholder="Waktu Kembali"></vue-date-picker>
                </ClientOnly>
                <p class="text-red-500">{{ field_errors.img_return_ts }}</p>             
                <AttachmentSingle :value="trx_trp.img_return" @setFile="trx_trp.img_return_file=$event"  @setPreview="trx_trp.img_return=$event" :can_remove="true"/>
                <p class="text-red-500">{{ field_errors.img_return }}</p>             
              </div>
            </div>

            <div class="w-full sm:w-1/2 text-center p-1">
              <div class="border-[1px] p-1">
                <label class="font-bold">Sampai </label>
                <ClientOnly>
                  <vue-date-picker  v-model="trx_trp.img_till_ts" 
                  type="datetime" 
                  format="dd-MM-yyyy HH:mm" 
                  :enable-time-picker = "true" 
                  text-input
                  teleport-center
                  class="flex-grow"
                  placeholder="Waktu Sampai"></vue-date-picker>
                </ClientOnly>
                <p class="text-red-500">{{ field_errors.img_till_ts }}</p>             
                <AttachmentSingle :value="trx_trp.img_till" @setFile="trx_trp.img_till_file=$event"  @setPreview="trx_trp.img_till=$event" :can_remove="true"/>
                <p class="text-red-500">{{ field_errors.img_till }}</p>             
              </div>
            </div>

            <div class="w-full p-1">
              <label for=""> Note </label>
              <textarea v-model="trx_trp.ritase_note"></textarea>
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
  p_data:{
    type:Array,
    required:true,
    default:[]
  },
  id:{
    type: Number,
    required: false,
    default: 0,
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

    ritase_note:""
};
const trx_trp = ref({...trx_trp_temp});
const field_errors = ref({})

const token = useCookie('token');

const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_trp/absen", {
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

  trx_trp.value = data.value.data;
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    callData();
  }
}, {
  immediate: true
});


const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  if(trx_trp.value.img_leave){
    let idx = trx_trp.value.img_leaves.map((x)=>x.gambar).indexOf(trx_trp.value.img_leave); 
    if(idx==-1){
      data_in.append('img_leave', "ada");
    }else{
      data_in.append('img_leave', trx_trp.value.img_leaves[idx]['id']);
    }
  }else{
    data_in.append('img_leave', "");
  }

  data_in.append("img_leave_file", trx_trp.value.img_leave_file);
  data_in.append("img_leave_ts", (trx_trp.value.img_leave_ts) ? $moment(trx_trp.value.img_leave_ts).format("YYYY-MM-DD HH:mm") : '');

  data_in.append("img_arrive", trx_trp.value.img_arrive ? "ada" : "");
  data_in.append("img_arrive_file", trx_trp.value.img_arrive_file);
  data_in.append("img_arrive_ts", (trx_trp.value.img_arrive_ts) ? $moment(trx_trp.value.img_arrive_ts).format("YYYY-MM-DD HH:mm") : '');

  data_in.append("img_return", trx_trp.value.img_return ? "ada" : "");
  data_in.append("img_return_file", trx_trp.value.img_return_file);
  data_in.append("img_return_ts", (trx_trp.value.img_return_ts) ? $moment(trx_trp.value.img_return_ts).format("YYYY-MM-DD HH:mm") : '');
  
  data_in.append("img_till", trx_trp.value.img_till ? "ada" : "");
  data_in.append("img_till_file", trx_trp.value.img_till_file);
  data_in.append("img_till_ts", (trx_trp.value.img_till_ts) ? $moment(trx_trp.value.img_till_ts).format("YYYY-MM-DD HH:mm") : '');
  data_in.append("ritase_note", trx_trp.value.ritase_note);

  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/trx_trp/absen", {
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

  trx_trp.value.ritase_leave_at   = trx_trp.value.img_leave_ts;
  trx_trp.value.ritase_arrive_at  = trx_trp.value.img_arrive_ts;
  trx_trp.value.ritase_return_at  = trx_trp.value.img_return_ts;
  trx_trp.value.ritase_till_at    = trx_trp.value.img_till_ts;

  trx_trp.value.updated_at = data.value.updated_at;
  if(props.id<=0){
    trx_trp.value.id = data.value.id;
    trx_trp.value.created_at = data.value.created_at;
    props.p_data.unshift(trx_trp.value);
  }else{
    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...trx_trp.value});    
    }
  }
  props.fnClose();
}

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
