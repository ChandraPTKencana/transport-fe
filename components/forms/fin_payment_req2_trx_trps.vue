<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Pilih Trip yang akan dibayar'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto p-2 bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto ">

            <div class="w-full" role="sticky">
              <table class="tacky" style="white-space:normal;">
                <thead >
                  <tr class="sticky top-0 !z-[2]">
                    <th class="min-w-[50px] !w-[50px] max-w-[50px]">
                      <button type="button" name="button" class="bg-yellow-600" @click="unCheckedAll()">
                        U/Ch
                      </button>
                    </th>
                    <th class="min-w-[50px] !w-[50px] max-w-[50px] ">No</th>
                    <th>ID</th>
                    <th>No Pol</th>
                    <th>Tujuan</th>
                    <th>Info</th>
                    <th>Tipe</th>
                    <th>Jenis</th>
                    <th>Amount</th>
                    <th>Supir Name</th>
                    <th>Kernet Name</th>
                  </tr>
                </thead>
                <tbody ref="to_move">
                  <template v-for="(detail, index) in details" :key="index">
                    <tr :data-index="index">
                      <td class="tools cell">
                        <div class="w-full h-full flex items-center justify-center">
                          <input type="checkbox" :checked="isExists(detail)" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 cursor-pointer" @click="addOrRemoveFromList(detail)">
                        </div>
                      </td>
                      <td>{{ index + 1 }}.</td>
                      <td class="cell min-w-[50px] !w-[50px] max-w-[50px]">
                        <div class="w-full h-full flex items-center justify-center">
                          {{ detail.id }}
                        </div>
                      </td>
                      <td class="cell min-w-[150px] !w-[150px] max-w-[150px]">
                        <div class="w-full h-full flex items-center justify-center">
                          {{ detail.no_pol }}   
                        </div>
                      </td>
                      <td class="cell">
                        <div class="w-full h-full flex items-center justify-center">
                          {{ detail.xto }}   
                        </div>
                      </td>
                      <td class="cell">
                        <div class="w-full h-full flex items-center justify-center">
                          {{ detail.info }}   
                        </div>
                      </td>
                      <td class="cell">
                        <div class="w-full h-full flex items-center justify-center">                       
                          {{ detail.tipe }}   
                        </div>
                      </td>
                      <td class="cell">
                        <div class="w-full h-full flex items-center justify-center">                       
                          {{ detail.jenis }}   
                        </div>
                      </td>
                      <td class="cell">
                        <div class="w-full h-full flex items-center justify-center">
                          {{ pointFormat(detail.amount || 0) }}   
                        </div>
                      </td>
                      <td class="cell">
                        <div class="w-full h-full flex items-center justify-center ">                       
                          {{ detail.supir }}   
                        </div>
                      </td>
                      <td class="cell">
                        <div class="w-full h-full flex items-center justify-center ">                       
                          {{ detail.kernet }}   
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="w-full flex items-center justify-end">
            <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
              Cancel
            </button>
            <button  type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
              Select
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
  excludes: {
    type: String,
    required: false,
    // default: '',
  },
  exclude_lists: {
    type: Array,
    required: false,
    // default: '',
  },
  id:{
    type: Number,
    required: false,
    default: 0,
  },
})



const token = useDynamicPathCookie('token');

const field_errors = ref({})

const { display } = useAlertStore();


const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("trx_trps", JSON.stringify(selected_items.value));
  
  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {

    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/fin_payment_req2/trx_trp", {
    method: $method,
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
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
  
  emit('setKData',data.value.data);
  emit('setIsNew',props.id==0);
  props.fnClose();
}

const selected_items = ref([]);

const emit = defineEmits(['setKData','setIsNew']);

const isExists=(item)=>{
  const index = selected_items.value.map((x)=>x.id).indexOf(item.id);
  return index !== -1;
}

const addOrRemoveFromList=(item)=>{
  const index = selected_items.value.map((x)=>x.id).indexOf(item.id);
  if (index === -1) {
  // not exist in the list
    selected_items.value.push(item);
  }else{
    // remove from the list
    selected_items.value.splice(index, 1);
  }
};

const unCheckedAll=(item)=>{
  if (selected_items.value.length < details.value.length) {
    selected_items.value=[...details.value];
  }else{
    selected_items.value=[];
  }
};

const details=ref([]);
const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/fin_payment_req2/get_trx_trp_unprocessed", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  details.value = data.value.data;
}
watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    details.value = [];
    await callData();

    selected_items.value=[];
    // if(props.id!=0)
    // callData();
  }
}, {
  immediate: true
});



</script>
