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

              <div>
                <label for="">Info</label>
                <div class="border-solid border-2 w-fit p-1 bg-slate-700 text-white">
                  {{ trx_trp.uj?.asst_opt }}
                </div>               
              </div>
            </div>
          </div>

          <div class="w-full flex flex-wrap items-center grow overflow-auto">
            <div class="w-full sm:w-1/2 text-center p-1">
              <div class="border-[1px] p-1">
                <label class="font-bold">Timbang Masuk </label>
                <!-- <ClientOnly>
                  <vue-date-picker  v-model="trx_trp.img_arrive_ts" 
                  type="datetime" 
                  format="dd-MM-yyyy HH:mm" 
                  :enable-time-picker = "true" 
                  text-input
                  teleport-center
                  class="flex-grow"
                  placeholder="Waktu Tiba"></vue-date-picker>
                </ClientOnly>
                <p class="text-red-500">{{ field_errors.img_arrive_ts }}</p>              -->
                <AttachmentSingleV1 :show="show" :label="''" :link="trx_trp.timbang_a_img_in_preview" :blob_file="trx_trp.timbang_a_img_in" @setFile="trx_trp.timbang_a_img_in=$event"  @setPreview="trx_trp.timbang_a_img_in_preview=$event" :can_remove="true" />
                <p class="text-red-500">{{ field_errors.timbang_a_img_in }}</p>             
              </div>
            </div>

            <div class="w-full sm:w-1/2 text-center p-1">
              <div class="border-[1px] p-1">
                <label class="font-bold">Timbang Keluar </label>
                <!-- <ClientOnly>
                  <vue-date-picker  v-model="trx_trp.img_arrive_ts" 
                  type="datetime" 
                  format="dd-MM-yyyy HH:mm" 
                  :enable-time-picker = "true" 
                  text-input
                  teleport-center
                  class="flex-grow"
                  placeholder="Waktu Tiba"></vue-date-picker>
                </ClientOnly>
                <p class="text-red-500">{{ field_errors.img_arrive_ts }}</p>              -->
                <AttachmentSingleV1 :show="show" :label="''" :link="trx_trp.timbang_a_img_out_preview" :blob_file="trx_trp.timbang_a_img_out" @setFile="trx_trp.timbang_a_img_out=$event"  @setPreview="trx_trp.timbang_a_img_out_preview=$event" :can_remove="true" />
                <p class="text-red-500">{{ field_errors.timbang_a_img_out }}</p>             
              </div>
            </div>

            <div class="w-full sm:w-1/2 text-center p-1">
              <div class="border-[1px] p-1">
                <label class="font-bold">Timbang Masuk </label>
                <!-- <ClientOnly>
                  <vue-date-picker  v-model="trx_trp.img_arrive_ts" 
                  type="datetime" 
                  format="dd-MM-yyyy HH:mm" 
                  :enable-time-picker = "true" 
                  text-input
                  teleport-center
                  class="flex-grow"
                  placeholder="Waktu Tiba"></vue-date-picker>
                </ClientOnly>
                <p class="text-red-500">{{ field_errors.img_arrive_ts }}</p>              -->
                <AttachmentSingleV1 :show="show" :label="''" :link="trx_trp.timbang_b_img_in_preview" :blob_file="trx_trp.timbang_b_img_in" @setFile="trx_trp.timbang_b_img_in=$event"  @setPreview="trx_trp.timbang_b_img_in_preview=$event" :can_remove="true" />
                <p class="text-red-500">{{ field_errors.timbang_b_img_in }}</p>             
              </div>
            </div>

            <div class="w-full sm:w-1/2 text-center p-1">
              <div class="border-[1px] p-1">
                <label class="font-bold">Timbang Keluar </label>
                <!-- <ClientOnly>
                  <vue-date-picker  v-model="trx_trp.img_arrive_ts" 
                  type="datetime" 
                  format="dd-MM-yyyy HH:mm" 
                  :enable-time-picker = "true" 
                  text-input
                  teleport-center
                  class="flex-grow"
                  placeholder="Waktu Tiba"></vue-date-picker>
                </ClientOnly>
                <p class="text-red-500">{{ field_errors.img_arrive_ts }}</p>              -->

                <AttachmentSingleV1 :show="show" :label="''" :link="trx_trp.timbang_b_img_out_preview" :blob_file="trx_trp.timbang_b_img_out" @setFile="trx_trp.timbang_b_img_out=$event"  @setPreview="trx_trp.timbang_b_img_out_preview=$event" :can_remove="true" />
                <p class="text-red-500">{{ field_errors.timbang_b_img_out }}</p>             
              </div>
            </div>

            <div class="w-full p-1">
              <label for=""> Note </label>
              <textarea v-model="trx_trp.timbang_note"></textarea>
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

    timbang_a_img_in:"",
    timbang_a_img_out:"",
    timbang_b_img_in:"",
    timbang_b_img_out:"",

    timbang_a_img_in_preview:"",
    timbang_a_img_out_preview:"",
    timbang_b_img_in_preview:"",
    timbang_b_img_out_preview:"",
    
    timbang_a_img_in_ts:"",
    timbang_a_img_out_ts:"",
    timbang_b_img_in_ts:"",
    timbang_b_img_out_ts:"",

    timbang_note:""
};
const trx_trp = ref({...trx_trp_temp});
const field_errors = ref({})

const token = useDynamicPathCookie('token');

const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_trp/timbang_info", {
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
    trx_trp.value = {...trx_trp_temp};

    callData();
  }
}, {
  immediate: true
});


const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("timbang_a_img_in", trx_trp.value.timbang_a_img_in);
  data_in.append("timbang_a_img_in_exists", trx_trp.value.timbang_a_img_in ? true : false);
  data_in.append("timbang_a_img_in_preview", trx_trp.value.timbang_a_img_in_preview);
  // data_in.append("timbang_a_img_in_ts", (trx_trp.value.timbang_a_img_in_ts) ? $moment(trx_trp.value.timbang_a_img_in_ts).format("YYYY-MM-DD HH:mm") : '');

  data_in.append("timbang_a_img_out", trx_trp.value.timbang_a_img_out);
  data_in.append("timbang_a_img_out_exists", trx_trp.value.timbang_a_img_out ? true : false);
  data_in.append("timbang_a_img_out_preview", trx_trp.value.timbang_a_img_out_preview);
  // data_in.append("timbang_a_img_out_ts", (trx_trp.value.timbang_a_img_out_ts) ? $moment(trx_trp.value.timbang_a_img_out_ts).format("YYYY-MM-DD HH:mm") : '');

  data_in.append("timbang_b_img_in", trx_trp.value.timbang_b_img_in);
  data_in.append("timbang_b_img_in_exists", trx_trp.value.timbang_b_img_in ? true : false);
  data_in.append("timbang_b_img_in_preview", trx_trp.value.timbang_b_img_in_preview);
  // data_in.append("timbang_b_img_in_ts", (trx_trp.value.timbang_b_img_in_ts) ? $moment(trx_trp.value.timbang_b_img_in_ts).format("YYYY-MM-DD HH:mm") : '');
  
  data_in.append("timbang_b_img_out", trx_trp.value.timbang_b_img_out);
  data_in.append("timbang_b_img_out_exists", trx_trp.value.timbang_b_img_out ? true : false);
  data_in.append("timbang_b_img_out_preview", trx_trp.value.timbang_b_img_out_preview);
  // data_in.append("timbang_b_img_out_ts", (trx_trp.value.timbang_b_img_out_ts) ? $moment(trx_trp.value.timbang_b_img_out_ts).format("YYYY-MM-DD HH:mm") : '');
  
  data_in.append("timbang_note", trx_trp.value.timbang_note);

  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/trx_trp/timbang_info", {
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

  // trx_trp.value.ritase_leave_at   = trx_trp.value.img_leave_ts;
  // trx_trp.value.ritase_arrive_at  = trx_trp.value.img_arrive_ts;
  // trx_trp.value.ritase_return_at  = trx_trp.value.img_return_ts;
  // trx_trp.value.ritase_till_at    = trx_trp.value.img_till_ts;

  trx_trp.value.timbang_a_img_in_exists = trx_trp.value.timbang_a_img_in ? true : false;
  trx_trp.value.timbang_a_img_out_exists = trx_trp.value.timbang_a_img_out ? true : false;
  trx_trp.value.timbang_b_img_in_exists = trx_trp.value.timbang_b_img_in ? true : false;
  trx_trp.value.timbang_b_img_out_exists = trx_trp.value.timbang_b_img_out ? true : false;

  trx_trp.value.updated_at = data.value.updated_at;
  if(props.id<=0){
    trx_trp.value.id = data.value.id;
    trx_trp.value.created_at = data.value.created_at;
    props.p_data.unshift(trx_trp.value);
  }else{
    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>-1){
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
