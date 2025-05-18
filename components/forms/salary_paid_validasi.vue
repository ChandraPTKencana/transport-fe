<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Master Standby Validation'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">
              <div class="w-1/2 sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Period End</label>
                <div class="card-border">
                  {{ $moment(salary_paid.period_end).format("MM-Y") }}
                </div>
              </div>
              <div class="w-1/2 sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Period Part</label>
                <div class="card-border">
                  {{ salary_paid.period_part }}
                </div>
              </div>
            </div>

            <div v-if="details.length" class="w-full p-1">
              <div class="font-bold"> Filter Nama </div>
              <input class="" type="text" v-model="search" name="search"
                placeholder="Nama">
            </div>

            <div v-if="source.length" class="w-full flex p-1 justify-between flex-wrap">
              <div class="w-full" role="sticky">
                <table class="tacky w-full !table-auto" style="white-space:normal;">
                  <thead >
                    <tr class="sticky -top-1 !z-[2]">
                      <td colspan="12" class="!bg-slate-800 text-white font-bold">
                        Detail
                      </td>
                    </tr>
                    <tr class="sticky top-7 !z-[2]">
                      <th >No</th>
                      <th >Jabatan</th>
                      <th >Nama Pekerja</th>
                      <th >No KTP</th>
                      <!-- <th >No SIM</th> -->
                      <th >Rek No</th>
                      <th >Rek Nama</th>
                      <th >Bank Name</th>
                      <th >SB.Gaji <span class="text-sm">({{pointFormat(ttl_sb_gaji || 0) }})</span></th>
                      <th >SB.Makan <span class="text-sm">({{pointFormat(ttl_sb_makan || 0) }})</span></th>
                      <th >SB.Dinas <span class="text-sm">({{pointFormat(ttl_sb_dinas || 0) }})</span></th>
                      <!-- <th >Nominal Standby <span class="text-sm">({{pointFormat(total_standby || 0) }})</span></th> -->
                      <th >Nominal Bonus <span class="text-sm">({{pointFormat(total_bonus || 0) }})</span></th>
                      <th >Total <span class="text-sm">({{pointFormat((ttl_sb_gaji + ttl_sb_makan + ttl_sb_dinas + total_bonus) || 0) }})</span></th>
                    </tr>
                  </thead>
                  <tbody ref="to_move">
                    <template v-for="(detail, index) in source" :key="index">
                      <tr v-if="detail.p_status!='Remove'"  :data-index="index">
                        <td>{{ index + 1 }}.</td>
                        <td>{{ detail.employee?.role }}</td>
                        <td>{{ detail.employee?.name }}</td>
                        <td>{{ detail.employee?.ktp_no }}</td>
                        <!-- <td>{{ detail.employee?.sim_no }}</td> -->
                        <td>{{ detail.employee?.rek_no }}</td>
                        <td>{{ detail.employee?.rek_name }}</td>
                        <td>{{ detail.employee?.bank?.code }}</td>
                        <td>{{ pointFormat(detail.sb_gaji) }}</td>
                        <td>{{ pointFormat(detail.sb_makan) }}</td>
                        <td>{{ pointFormat(detail.sb_dinas) }}</td>
                        <!-- <td>{{ pointFormat(detail.standby_nominal) }}</td> -->
                        <td>{{ pointFormat(detail.salary_bonus_nominal) }}</td>
                        <td>{{ pointFormat(parseFloat(detail.sb_gaji) + parseFloat(detail.sb_makan) + parseFloat(detail.sb_dinas) + parseFloat(detail.salary_bonus_nominal)) }}</td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
            

          </div>
          
          <div class="w-full flex items-center justify-end">
            <div class="w-full flex flex-wrap p-3 items-center">
              <div>
                Di Validasi oleh : 
              </div>
              <div v-if="salary_paid.val1 || salary_paid.val2 || salary_paid.val3" class="border-solid border-2 w-fit p-1 bg-slate-700 text-white text-xs">
                <div v-if="salary_paid.val1">
                  App 1 : {{ salary_paid.val1_by.username}} ( {{ salary_paid.val1_at ? $moment(salary_paid.val1_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <!-- <div v-if="salary_paid.val2">
                  App 2 : {{ salary_paid.val2_by.username}} ( {{ salary_paid.val2_at ? $moment(salary_paid.val2_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="salary_paid.val3">
                  App 3 : {{ salary_paid.val3_by.username}} ( {{ salary_paid.val3_at ? $moment(salary_paid.val3_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div> -->
              </div>
            </div>

            <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
              Cancel
            </button>
            <button ref="it_val" v-if="is_view==0" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
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
  },
  is_view:{
    type:Boolean,
    required:false,
    default:false
  },
})

const salary_paid_temp = {
    id: -1,
    name: "",
    tipe: "",
    is_transition: false,
    amount:0,
    details: [],
    val1:0,
    val1_by:{ username:"" },
    val1_at:"",
    val2:0,
    val2_by:{ username:"" },
    val2_at:"",
    val3:0,
    val3_by:{ username:"" },
    val3_at:"",
};

const salary_paid = ref({...salary_paid_temp});

const token = useDynamicPathCookie('token');
const field_errors = ref({});
const it_val = ref(null);
const details = ref([]);

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

  const { data, error, status } = await useMyFetch("/salary_paid_validasi", {
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

  salary_paid.value.val1 = data.value.val1;
  salary_paid.value.val1_user = data.value.val1_user;
  salary_paid.value.val1_by = data.value.val1_by;
  salary_paid.value.val1_at = data.value.val1_at;

  salary_paid.value.val2 = data.value.val2;
  salary_paid.value.val2_user = data.value.val2_user;
  salary_paid.value.val2_by = data.value.val2_by;
  salary_paid.value.val2_at = data.value.val2_at;

  salary_paid.value.val3 = data.value.val3;
  salary_paid.value.val3_user = data.value.val3_user;
  salary_paid.value.val3_by = data.value.val3_by;
  salary_paid.value.val3_at = data.value.val3_at;

  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...salary_paid.value});    
  }


  props.fnClose();
}

const total_standby = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.standby_nominal); 
  });
  return temp;
})

const ttl_sb_gaji = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.sb_gaji); 
  });
  return temp;
})

const ttl_sb_makan = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.sb_makan); 
  });
  return temp;
})

const ttl_sb_dinas = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.sb_dinas); 
  });
  return temp;
})


const total_bonus = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.salary_bonus_nominal); 
  });
  return temp;
})

const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/salary_paid", {
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

  salary_paid.value = data.value.data;
  details.value = data.value.data.details;
}

const total_amount = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    if(e.p_status!="Remove")
    temp += parseInt(e.amount);
  });
  return temp;
})

const disabled = computed(()=>{
  return false;
  // return salary_paid.value.confirmed_by || salary_paid.value.ref_id != null;
});

const search = ref("");

const source = computed(()=>{
  if(search.value!="")  
  return details.value.filter(
    (x)=>
    x.employee.name.toLowerCase().includes(search.value.toLowerCase())
  );
  else
  return details.value;
});

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
