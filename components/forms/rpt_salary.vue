<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Salary Paid'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">
              <div class="w-1/2 sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Period End</label>
                <div v-if="rpt_salary.id" class="card-border">
                  {{ $moment(rpt_salary.period_end).format("MM-Y") }}
                </div>
                <div v-else>
                  <ClientOnly>
                    <vue-date-picker  v-model="rpt_salary.period_end" 
                    format="MM-yyyy"
                    :enable-time-picker = "false" 
                    text-input
                    teleport-center
                    month-picker></vue-date-picker>
                  </ClientOnly>
                </div>
                <p class="text-red-500">{{ field_errors.period_end }}</p>
              </div>
            </div>

            <div v-if="details.length" class="w-full flex p-1 justify-between flex-wrap">
              <div class="w-full" role="sticky">
                <table class="tacky w-full !table-auto" style="white-space:normal;">
                  <thead >
                    <tr class="sticky -top-1 !z-[2]">
                      <td colspan="19" class="!bg-slate-800 text-white font-bold">
                        Detail
                      </td>
                    </tr>
                    <tr class="sticky top-7 !z-[2]">
                      <th rowspan="2">No</th>
                      <th rowspan="2">ID</th>
                      <th rowspan="2">Nama Pekerja</th>
                      <th rowspan="2">Jabatan</th>
                      <th rowspan="2">Tmpt Lahir</th>
                      <th rowspan="2">Tgl Lahir</th>
                      <th rowspan="2">TMK</th>
                      <th rowspan="2">No KTP</th>
                      <th rowspan="2">Alamat</th>
                      <th rowspan="2">Status</th>
                      <th rowspan="2">No Rek</th>
                      <th rowspan="2">Nama Bank</th>
                      <th colspan="2">Standby <span class="text-sm">({{pointFormat((ttl_sb_gaji + ttl_sb_makan)  || 0) }})</span></th>
                      <th colspan="2">Trip <span class="text-sm">({{pointFormat((ttl_uj_gaji + ttl_uj_makan) || 0) }})</span></th>
                      <th rowspan="2">Potongan <span class="text-sm">({{pointFormat(ttl_potongan || 0) }})</span></th>
                      <th rowspan="2">U.Kerajinan <span class="text-sm">({{pointFormat(ttl_bonus || 0) }})</span></th>
                      <th rowspan="2">Grand Total <span class="text-sm">({{pointFormat((ttl_sb_gaji + ttl_sb_makan + ttl_uj_gaji + ttl_uj_makan - ttl_potongan + ttl_bonus ) || 0) }})</span></th>
                    </tr>
                    <tr class="sticky top-[60px] !z-[2]">
                      <th >SB.Gaji <span class="text-sm">({{pointFormat(ttl_sb_gaji || 0) }})</span></th>
                      <th >SB.Makan <span class="text-sm">({{pointFormat(ttl_sb_makan || 0) }})</span></th>
                      <th >UJ.Gaji <span class="text-sm">({{pointFormat(ttl_uj_gaji || 0) }})</span></th>
                      <th >UJ.Makan <span class="text-sm">({{pointFormat(ttl_uj_makan || 0) }})</span></th>
                    </tr>
                  </thead>
                  <tbody ref="to_move">
                    <template v-for="(detail, index) in details" :key="index">
                      <tr v-if="detail.p_status!='Remove'"  :data-index="index">
                        <td>{{ index + 1 }}.</td>
                        <td>{{ detail.employee_id }}</td>
                        <td>{{ detail.employee_name }}</td>
                        <td>{{ detail.employee_role }}</td>
                        <td>{{ detail.employee_birth_place }}</td>
                        <td>{{ detail.employee_birth_date ? $moment(detail.employee_birth_date).format("DD-MM-Y") : "" }}</td>
                        <td>{{ detail.employee_tmk ? $moment(detail.employee_tmk).format("DD-MM-Y") : "" }}</td>
                        <td>{{ detail.employee_ktp_no }}</td>
                        <td>{{ detail.employee_address }}</td>
                        <td>{{ detail.employee_status }}</td>
                        <td>{{ detail.employee_rek_no }}</td>
                        <td>{{ detail.employee_bank_name }}</td>
                        <td>{{ pointFormat(detail.sb_gaji) }}</td>
                        <td>{{ pointFormat(detail.sb_makan) }}</td>
                        <td>{{ pointFormat(detail.uj_gaji) }}</td>
                        <td>{{ pointFormat(detail.uj_makan) }}</td>
                        <td>{{ pointFormat(detail.nominal_cut) }}</td>
                        <td>{{ pointFormat(detail.salary_bonus_nominal) }}</td>
                        <td>{{ pointFormat(parseFloat(detail.sb_gaji) + parseFloat(detail.sb_makan) +parseFloat(detail.uj_gaji) + parseFloat(detail.uj_makan) - parseFloat(detail.nominal_cut) + parseFloat(detail.salary_bonus_nominal)) }}</td>
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
            <button v-if="!disabled" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
              Generate {{ rpt_salary.id=="" ? "& Save" : '' }}
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

const rpt_salary_temp = {
    id: "",
    period_end: new Date(),
};

const rpt_salary = ref({...rpt_salary_temp});

const token = useCookie('token');

const field_errors = ref({})


const details = ref([]);

const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();

  data_in.append("period_end", (rpt_salary.value.period_end) ? $moment(rpt_salary.value.period_end).format("Y-MM") : '');
  
  let $method = "post";

  let id = rpt_salary.value.id;
  if (id == "") {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/rpt_salary", {
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

  details.value = data.value.details;
  if(id<=0){
    rpt_salary.value.id = data.value.id;
    rpt_salary.value.created_at = data.value.created_at;
    rpt_salary.value.updated_at = data.value.updated_at;
    props.p_data.unshift(rpt_salary.value);
  }else{
    rpt_salary.value.updated_at = data.value.updated_at;

    let idx= props.p_data.map((x)=>x.id).indexOf(id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...rpt_salary.value});    
    }
  }
  // props.fnClose();
  // router.go(-1);
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

const ttl_uj_gaji = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.uj_gaji); 
  });
  return temp;
})

const ttl_uj_makan = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.uj_makan); 
  });
  return temp;
})


const ttl_potongan = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.nominal_cut); 
  });
  return temp;
})



const ttl_bonus = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.salary_bonus_nominal); 
  });
  return temp;
})


const disabled = computed(()=>{
  return (rpt_salary.value.val && rpt_salary.value.val1) || (useUtils().checkPermission('rpt_salary.val') && rpt_salary.value.val) || (useUtils().checkPermission('rpt_salary.val1') && rpt_salary.value.val1);
});


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/rpt_salary", {
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

  rpt_salary.value = data.value.data;

  let p_status = "Edit";
  if(props.is_copy){
    p_status = "Add";
    rpt_salary.value.val = 0;
    rpt_salary.value.val1 = 0;
  }

  details.value = data.value.data.details;
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    rpt_salary.value = {...rpt_salary_temp};
    details.value = [];
    field_errors.value = {};
    if(props.id!=0)
    callData();
  }
}, {
  immediate: true
});

</script>
