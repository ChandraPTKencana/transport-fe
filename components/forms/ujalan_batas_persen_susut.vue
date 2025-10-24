<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Batas Persen Susut'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">

              <div class="w-full sm:w-8/12 md:w-6/12 lg:w-5/12 flex flex-col flex-wrap p-1">
                <label for="">To</label>
                <div class="card-border disabled">
                  {{ ujalan.xto }}
                </div>
              </div>

              <div class="w-1/2 sm:w-4/12 md:w-3/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                <label for="">Jenis</label>
                <div class="card-border disabled">
                  {{ ujalan.jenis }}
                </div>
              </div>

              <!-- <div class="w-1/2 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                <label for="">Trip Bonus Supir</label>
                <div class="card-border disabled">
                  {{ pointFormat(ujalan.bonus_trip_supir||0) }}
                </div>
              </div> -->

              <div class="w-1/2 sm:w-4/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                <label for="">Trip Bonus Supir</label>
                <div class="w-full" >
                  <InputPointFormat
                    class="w-full h-full p-1" 
                    type="text" 
                    :value="ujalan.bonus_trip_supir || 0" 
                    @input="ujalan.bonus_trip_supir = $event" :disabled="!useUtils().checkPermissions(['ujalan.create','ujalan.modify']) || disabled"/>
                </div>
                <p class="text-red-500">{{ field_errors.bonus_trip_supir }}</p>
              </div>

              <div class="w-1/2 sm:w-3/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                <label for="">Trip Bonus Kernet</label>
                <div class="w-full" >
                  <InputPointFormat
                    class="w-full h-full p-1" 
                    type="text" 
                    :value="ujalan.bonus_trip_kernet || 0" 
                    @input="ujalan.bonus_trip_kernet = $event" :disabled="!useUtils().checkPermissions(['ujalan.create','ujalan.modify']) || disabled"/>
                </div>
                <p class="text-red-500">{{ field_errors.bonus_trip_kernet }}</p>
              </div>

              <div class="w-1/2 sm:w-3/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                <label for="">Asal Peralihan</label>
                <div class="card-border disabled">
                  {{ ujalan.transition_from }}
                </div>
              </div>
              
              <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                <label for="">Tipe</label>
                <div class="card-border disabled">
                  {{ ujalan.tipe }}
                </div>
              </div>

              <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                <label for="">Ket. Untuk Remarks</label>
                <div class="card-border disabled">
                  {{ ujalan.note_for_remarks }}
                </div>
              </div>

              <div class="w-1/2 sm:w-3/12 md:w-2/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                <label for="">Batas % Susut</label>
                <div class="w-full" >
                  <!-- <InputPointFormat
                    class="w-full h-full p-1" 
                    type="text" 
                    :value="ujalan.batas_persen_susut || 0" 
                    @input="ujalan.batas_persen_susut = $event"/> -->
                  <input v-model="ujalan.batas_persen_susut">
                </div>
                <p class="text-red-500">{{ field_errors.batas_persen_susut }}</p>
              </div>

              <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                <label for="">Dest. Location</label>
                <WidthMiniList :arr="list_dest_loc" :selected="selected_destination_location" :pure="selected_temp_destination_location" @setSelected="selected_destination_location=$event" :disabled="disabled"/>
                <p class="text-red-500">{{ field_errors.destination_location_id }}</p>
              </div>

            </div>
          </div>
          
          <div class="w-full flex items-center justify-end">
            <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
              Cancel
            </button>
            <button v-if="!disabled" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
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

const ujalan_temp = {
    id: -1,
    xto: "",
    km_range:0,
    bonus_trip_supir:0,
    bonus_trip_kernet:0,
    batas_persen_susut:'',
    tipe: "",
    // status: "Y",
    jenis: "",
    harga:0,
    note_for_remarks:"",
    transition_from:"",
};

const ujalan = ref({...ujalan_temp});

const token = useDynamicPathCookie('token');

const field_errors = ref({})

const doSave = async () => {
  
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("batas_persen_susut", ujalan.value.batas_persen_susut);
  data_in.append("bonus_trip_supir", ujalan.value.bonus_trip_supir);
  data_in.append("bonus_trip_kernet", ujalan.value.bonus_trip_kernet);
  data_in.append("destination_location_id", selected_destination_location.value.id);
  
  let $method = "post";

  let id = props.is_copy ? 0 : props.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/ujalan/batas_persen_susut", {
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

  ujalan.value.destination_location     = JSON.parse(JSON.stringify(selected_destination_location.value._raw));

  
  if(id<=0){
    ujalan.value.id = data.value.id;
    ujalan.value.created_at = data.value.created_at;
    ujalan.value.updated_at = data.value.updated_at;
    props.p_data.unshift(ujalan.value);
  }else{
    ujalan.value.updated_at = data.value.updated_at;

    let idx= props.p_data.map((x)=>x.id).indexOf(id);
    if(idx>-1){
      props.p_data.splice(idx,1,{...ujalan.value});    
    }
  }
  props.fnClose();
  // router.go(-1);
}

const disabled = computed(()=>{
  return false;
  // return (ujalan.value.val && ujalan.value.val1) || (useUtils().checkPermission('ujalan.val') && ujalan.value.val) || (useUtils().checkPermissions('ujalan.val1') && ujalan.value.val1);
});

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
  let dt =data.value.data;

  let p_status = "Edit";
  if(props.is_copy){
    p_status = "Add";
    ujalan.value.val = 0;
    ujalan.value.val1 = 0;
  }

  selected_destination_location.value._raw=dt.destination_location;
  
  selected_destination_location.value._.id.val=dt.destination_location.id;
  selected_destination_location.value._.xto.val=dt.destination_location.xto;
  selected_destination_location.value._.min_trip.val=pointFormat(dt.destination_location.min_trip);
  selected_destination_location.value._.bonus_trip_supir.val=pointFormat(dt.destination_location.bonus_trip_supir);
  selected_destination_location.value._.bonus_next_trip_supir.val=pointFormat(dt.destination_location.bonus_next_trip_supir);
  selected_destination_location.value._.bonus_trip_kernet.val=pointFormat(dt.destination_location.bonus_trip_kernet);
  selected_destination_location.value._.bonus_next_trip_kernet.val=pointFormat(dt.destination_location.bonus_next_trip_kernet);

  selected_destination_location.value.id=dt.destination_location.id;
  selected_destination_location.value.name=dt.destination_location.xto;
  selected_destination_location.value.title=(pointFormat(dt.destination_location.total) || '');
  
}

const selected_temp_destination_location={
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
    min_trip:{
      tcon:"",
      text:"Min Trip",
      val:"",
    },
    bonus_trip_supir:{
      tcon:"",
      text:"Bonus Trip Supir",
      val:"",
    },
    bonus_next_trip_supir:{
      tcon:"",
      text:"Bonus Next Trip Supir",
      val:"",
    },
    bonus_trip_kernet:{
      tcon:"",
      text:"Bonus Trip Kernet",
      val:"",
    },
    bonus_next_trip_kernet:{
      tcon:"",
      text:"Bonus Next Trip Kernet",
      val:"",
    },
  },
  id:"",
  name:"",
  title:"",
  note:""
};

const selected_destination_location = ref(JSON.parse(JSON.stringify(selected_temp_destination_location)));
const list_destination_location = ref([]);

const loadLocalDT = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/ujalan/load_local", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  list_destination_location.value = data.value.list_destination_location;
}


const list_dest_loc = computed(()=>{
  let results = [];
  list_destination_location.value.forEach((x,y)=>{
    let temp = JSON.parse(JSON.stringify(selected_temp_destination_location));
    temp._.id.val = x.id,
    temp._.xto.val = x.xto,
    temp._.min_trip.val = pointFormat(x.minimal_trip),
    temp._.bonus_trip_supir.val = pointFormat(x.bonus_trip_supir),
    temp._.bonus_next_trip_supir.val = pointFormat(x.bonus_next_trip_supir),
    temp._.bonus_trip_kernet.val = pointFormat(x.bonus_trip_kernet),
    temp._.bonus_next_trip_kernet.val = pointFormat(x.bonus_next_trip_kernet),

    temp.id = x.id,
    temp.name = x.xto,
    temp.title = "Min Trip:"+(pointFormat(x.minimal_trip) || '')+" | Bonus Trip Supir:"+(pointFormat(x.bonus_trip_supir) || '')+" | Bonus Next Trip Supir:"+(pointFormat(x.bonus_next_trip_supir) || '')+" | Bonus Trip Kernet:"+(pointFormat(x.bonus_trip_kernet) || '')+" | Bonus Next Trip Kernet:"+(pointFormat(x.bonus_next_trip_kernet) || ''),

    temp._raw = x;
    results.push(JSON.parse(JSON.stringify(temp)));
  });
  return results;
})


watch(() => props.show, async(newVal, oldVal) => {
  if (newVal == true){
    await loadLocalDT();

    ujalan.value = {...ujalan_temp};
    selected_destination_location.value = JSON.parse(JSON.stringify(selected_temp_destination_location));

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
