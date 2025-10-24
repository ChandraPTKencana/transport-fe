<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Transaction'" :fn="fnClose" class="w-full flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Tujuan</label>
                <input type="text" list="xto"  v-model="destination_location.xto"/>
                <p class="text-red-500">{{ field_errors.xto }}</p>
              </div>

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Min Trip</label>
                <div class="w-full" >
                  <InputPointFormat
                  class="w-full h-full p-1" 
                  type="text" 
                  :value="destination_location.minimal_trip || 0" 
                  @input="destination_location.minimal_trip = $event"/>
                </div>
                <p class="text-red-500">{{ field_errors.minimal_trip }}</p>
              </div>

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Bonus Trip Supir</label>
                <div class="w-full" >
                  <InputPointFormat
                  class="w-full h-full p-1" 
                  type="text" 
                  :value="destination_location.bonus_trip_supir || 0" 
                  @input="destination_location.bonus_trip_supir = $event"/>
                </div>
                <p class="text-red-500">{{ field_errors.bonus_trip_supir }}</p>
              </div>

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Bonus Next Trip Supir</label>
                <div class="w-full" >
                  <InputPointFormat
                  class="w-full h-full p-1" 
                  type="text" 
                  :value="destination_location.bonus_next_trip_supir || 0" 
                  @input="destination_location.bonus_next_trip_supir = $event"/>
                </div>
                <p class="text-red-500">{{ field_errors.bonus_next_trip_supir }}</p>
              </div>

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Bonus Trip Kernet</label>
                <div class="w-full" >
                  <InputPointFormat
                  class="w-full h-full p-1" 
                  type="text" 
                  :value="destination_location.bonus_trip_kernet || 0" 
                  @input="destination_location.bonus_trip_kernet = $event"/>
                </div>
                <p class="text-red-500">{{ field_errors.bonus_trip_kernet }}</p>
              </div>

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Bonus Next Trip Kernet</label>
                <div class="w-full" >
                  <InputPointFormat
                  class="w-full h-full p-1" 
                  type="text" 
                  :value="destination_location.bonus_next_trip_kernet || 0" 
                  @input="destination_location.bonus_next_trip_kernet = $event"/>
                </div>
                <p class="text-red-500">{{ field_errors.bonus_next_trip_kernet }}</p>
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
  is_copy: {
    type: [Boolean,Number],
    required: true,
    default: false,
  },
})

const destination_location_temp = {
    id: -1,
    xto: "",
    minimal_trip: 1,
    bonus_trip_supir:0,
    bonus_next_trip_supir:0,
    bonus_trip_kernet:0,
    bonus_next_trip_kernet:0,
};

let destination_location_loaded = {...destination_location_temp};
const destination_location = ref({...destination_location_temp});

const token = useDynamicPathCookie('token');
const field_errors = ref({})

const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("xto", destination_location.value.xto);
  data_in.append("minimal_trip", destination_location.value.minimal_trip);
  data_in.append("bonus_trip_supir", destination_location.value.bonus_trip_supir);
  data_in.append("bonus_next_trip_supir", destination_location.value.bonus_next_trip_supir);
  data_in.append("bonus_trip_kernet", destination_location.value.bonus_trip_kernet);
  data_in.append("bonus_next_trip_kernet", destination_location.value.bonus_next_trip_kernet);
  
  let $method = "post";

  let id = props.is_copy ? 0 : props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/destination_location", {
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


  destination_location.value.updated_at = data.value.updated_at;
  if(id<=0){
    destination_location.value.id = data.value.id;
    destination_location.value.created_at = data.value.created_at;
    props.p_data.unshift(destination_location.value);
  }else{
    let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
    if(idx>-1){
      props.p_data.splice(idx,1,{...destination_location.value});    
    }
  }
  props.fnClose();
}

const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/destination_location", {
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

  // if(props.is_copy){
  //   destination_location.value.val = 0;
  //   destination_location.value.val1 = 0;
  // }

  let dt =data.value.data;
  destination_location.value = dt;
  destination_location_loaded = {...dt};
}

watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    destination_location.value = {...destination_location_temp};    
    field_errors.value = {};
    if(props.id!=0)
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
</style>
