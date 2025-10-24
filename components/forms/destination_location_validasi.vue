<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Transaction Extra Money Validation'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">

            <div class="w-full flex flex-row flex-wrap">

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Tujuan</label>
                <div class="w-full card-border" >
                  {{ destination_location.xto }}
                </div>
              </div>

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Min Trip</label>
                <div class="w-full card-border" >
                  {{ pointFormat(destination_location.minimal_trip) }}
                </div>
              </div>

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Bonus Trip Supir</label>
                <div class="w-full card-border" >
                  {{ pointFormat(destination_location.bonus_trip_supir) }}
                </div>
              </div>

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Bonus Next Trip Supir</label>
                <div class="w-full card-border" >
                  {{ pointFormat(destination_location.bonus_next_trip_supir) }}
                </div>
              </div>

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Bonus Trip Kernet</label>
                <div class="w-full card-border" >
                  {{ pointFormat(destination_location.bonus_trip_kernet) }}
                </div>
              </div>

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Bonus Next Trip Kernet</label>
                <div class="w-full card-border" >
                  {{ pointFormat(destination_location.bonus_next_trip_kernet) }}
                </div>
              </div>
            </div>

          </div>
          
          <div class="w-full flex items-center justify-end">
            <div class="w-full flex flex-wrap p-3 items-center">
              <!-- <div>
                Di Validasi oleh : 
              </div>
              <div v-if="destination_location.val1 || destination_location.val2" class="border-solid border-2 w-fit p-1 bg-slate-700 text-white text-xs">
                <div v-if="destination_location.val1">
                  App 1 : {{ destination_location.val1_by.username}} ( {{ destination_location.val1_at ? $moment(destination_location.val1_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="destination_location.val2">
                  App 2 : {{ destination_location.val2_by.username}} ( {{ destination_location.val2_at ? $moment(destination_location.val2_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="destination_location.val3">
                  App 3 : {{ destination_location.val3_by.username}} ( {{ destination_location.val3_at ? $moment(destination_location.val3_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="destination_location.val4">
                  App 4 : {{ destination_location.val4_by.username}} ( {{ destination_location.val4_at ? $moment(destination_location.val4_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="destination_location.val5">
                  App 5 : {{ destination_location.val5_by.username}} ( {{ destination_location.val5_at ? $moment(destination_location.val5_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="destination_location.val6">
                  App 6 : {{ destination_location.val6_by.username}} ( {{ destination_location.val6_at ? $moment(destination_location.val6_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
              </div> -->
            </div>

            <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
              Cancel
            </button>
            <!-- <button ref="it_val" v-if="is_view==0" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
              Validasi
            </button> -->
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
  },
  is_view:{
    type:Boolean,
    required:false,
    default:false
  },
})

const destination_location_temp = {
    id: "",
    xto:"",
    minimal_trip:0,
    bonus_trip_supir:0,
    bonus_next_trip_supir:0,
    bonus_trip_kernet:0,
    bonus_next_trip_kernet:0,
};

const destination_location = ref({...destination_location_temp});

const token = useDynamicPathCookie('token');
const field_errors = ref({});
const it_val = ref(null);


// const doSave = async () => {
//   useCommonStore().loading_full = true;
//   field_errors.value = {};

//   const data_in = new FormData();
  
//   let $method = "post";

//   let id = props.id;
//   if (id == 0) {
//   } else {
//     // $method = "put";
//     // data_in['id'] = id;
//     data_in.append("id", id);
//     data_in.append("_method", "PUT");
//   }

//   const { data, error, status } = await useMyFetch("/destination_location_validasi", {
//     method: $method,
//     headers: {
//       'Authorization': `Bearer ${token.value}`,
//       // 'Content-Type': 'application/json',
//       'Accept': 'application/json',
//       // "Content-Type": "multipart/form-data",
//     },
//     body: data_in,
//     retry: 0,
//     // server: true
//   });
//   useCommonStore().loading_full = false;
//   if (status.value === 'error') {
//     useErrorStore().trigger(error, field_errors);
//     return;
//   }


//   destination_location.value.val = data.value.val;
//   destination_location.value.val_user = data.value.val_user;
//   destination_location.value.val_by = data.value.val_by;
//   destination_location.value.val_at = data.value.val_at;

//   destination_location.value.val1 = data.value.val1;
//   destination_location.value.val1_user = data.value.val1_user;
//   destination_location.value.val1_by = data.value.val1_by;
//   destination_location.value.val1_at = data.value.val1_at;

//   destination_location.value.val2 = data.value.val2;
//   destination_location.value.val2_user = data.value.val2_user;
//   destination_location.value.val2_by = data.value.val2_by;
//   destination_location.value.val2_at = data.value.val2_at;



//   let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
//   if(idx>-1){
//     props.p_data.splice(idx,1,{...destination_location.value});    
//   }


//   props.fnClose();
// }


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

  let dt =data.value.data;

  destination_location.value = dt;
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    if(props.is_view==false){
      setTimeout(()=>{
        it_val.value.focus();
      },1);
    }
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
