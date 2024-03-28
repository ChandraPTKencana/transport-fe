<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Ujalan Validation'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center justify-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">To</label>
                <div class="card-border">
                  {{ ujalan.xto }}
                </div>
              </div>
              
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Tipe</label>
                <div class="card-border">
                  {{ ujalan.tipe }}
                </div>
              </div>

              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Jenis</label>
                <div class="card-border">
                  {{ ujalan.jenis }}
                </div>
            </div>
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Harga</label>
                <div class="card-border">
                  {{ pointFormat(ujalan.harga||0) }}
                </div>
              </div>
            </div>

            <div class="w-full flex grow p-1 overflow-auto">
              <div role="sticky" ref="loadRef">
                <table class="tacky w-full" style="white-space:normal;">
                  <thead >
                    <tr class="sticky top-0 !z-[2]">
                      <th class="min-w-[50px] !w-[50px] max-w-[50px] ">No</th>
                      <th>Desc</th>
                      <th class="min-w-[100px] !w-[100px] max-w-[100px] ">Harga @</th>
                      <th class="min-w-[50px] !w-[50px] max-w-[50px] ">Qty</th>
                      <!-- <th class="min-w-[50px] !w-[50px] max-w-[50px] ">Status</th> -->
                    </tr>
                  </thead>
                  <tbody ref="to_move">
                    <template v-for="(detail, index) in details" :key="index">
                      <tr >
                        <td>{{ index + 1 }}.</td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.xdesc }}
                          </div>
                        </td>
                        <td class="cell bold">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ pointFormat(detail.harga||0) }}

                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ pointFormat(detail.qty||0) }}
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
            

          </div>
          
          <div class="w-full flex items-center justify-end">
            <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
              Cancel
            </button>
            <button type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
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
  }
  
})

const ujalan_temp = {
    id: -1,
    xto: "",
    tipe: "",
    // status: "Y",
    jenis: "",
    harga:0,
    details: []
};

const ujalan = ref({...ujalan_temp});

const token = useCookie('token');
const field_errors = ref({});

const details = ref([]);

const detail = ref({
  ordinal:0,
  id:-1,
  xdesc:"",
  qty:1,
  harga:0,
  // status:"",
  p_status:""
});

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

  const { data, error, status } = await useMyFetch("/ujalan_validasi", {
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


  ujalan.value.val = data.value.val;
  ujalan.value.val_user = data.value.val_user;
  ujalan.value.val_by = data.value.val_by;
  ujalan.value.val_at = data.value.val_at;


  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...ujalan.value});    
  }


  props.fnClose();
}


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/ujalan_", {
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

  ujalan.value = data.value.data;
  details.value = data.value.data.details;
}


watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
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

.box-fixed {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0px;
  left:0px;
}

.box-fixed>div {
  width: 95%;
  height: 95%;
  background-color: white;
  border: solid 1px #ccc;
  display: flex;
  flex-direction: column;
}
</style>
