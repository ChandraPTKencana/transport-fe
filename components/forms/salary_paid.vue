<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Salary Paid'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Period End</label>
                <div v-if="salary_paid.id" class="card-border">
                  {{ $moment(salary_paid.period_end).format("MM-Y") }}
                </div>
                <div v-else>
                  <ClientOnly>
                    <vue-date-picker  v-model="salary_paid.period_end" 
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

            <div v-if="details.length" class="w-full flex p-1 2xl:overflow-hidden justify-between flex-wrap">
              <div class="w-full" role="sticky">
                <table class="tacky w-full !table-auto" style="white-space:normal;">
                  <thead >
                    <tr class="sticky -top-1 !z-[2]">
                      <td colspan="10" class="!bg-slate-800 text-white font-bold">
                        Detail
                      </td>
                    </tr>
                    <tr class="sticky top-7 !z-[2]">
                      <th >No</th>
                      <th >Nama Pekerja</th>
                      <th >No KTP</th>
                      <th >No SIM</th>
                      <th >Rek No</th>
                      <th >Rek Nama</th>
                      <th >Bank Name</th>
                      <th >Nominal Standby <span class="text-sm">({{pointFormat(total_standby || 0) }})</span></th>
                      <th >Nominal Bonus <span class="text-sm">({{pointFormat(total_bonus || 0) }})</span></th>
                      <th >Total <span class="text-sm">({{pointFormat((total_standby + total_bonus) || 0) }})</span></th>
                    </tr>
                  </thead>
                  <tbody ref="to_move">
                    <template v-for="(detail, index) in details" :key="index">
                      <tr v-if="detail.p_status!='Remove'"  :data-index="index">
                        <td>{{ index + 1 }}.</td>
                        <td>{{ detail.employee?.name }}</td>
                        <td>{{ detail.employee?.ktp_no }}</td>
                        <td>{{ detail.employee?.sim_no }}</td>
                        <td>{{ detail.employee?.rek_no }}</td>
                        <td>{{ detail.employee?.rek_name }}</td>
                        <td>{{ detail.employee?.bank_name }}</td>
                        <td>{{ pointFormat(detail.standby_nominal) }}</td>
                        <td>{{ pointFormat(detail.salary_bonus_nominal) }}</td>
                        <td>{{ pointFormat(parseFloat(detail.standby_nominal) + parseFloat(detail.salary_bonus_nominal)) }}</td>
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
              Generate {{ salary_paid.id=="" ? "& Save" : '' }}
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

const salary_paid_temp = {
    id: "",
    period_end: new Date(),
};

const salary_paid = ref({...salary_paid_temp});

const token = useCookie('token');

const field_errors = ref({})


const details = ref([]);

const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();

  data_in.append("period_end", (salary_paid.value.period_end) ? $moment(salary_paid.value.period_end).format("Y-MM") : '');
  
  let $method = "post";

  let id = salary_paid.value.id;
  if (id == "") {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/salary_paid", {
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
    salary_paid.value.id = data.value.id;
    salary_paid.value.created_at = data.value.created_at;
    salary_paid.value.updated_at = data.value.updated_at;
    props.p_data.unshift(salary_paid.value);
  }else{
    salary_paid.value.updated_at = data.value.updated_at;

    let idx= props.p_data.map((x)=>x.id).indexOf(id);
    if(idx>=-1){
      props.p_data.splice(idx,1,{...salary_paid.value});    
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

const total_bonus = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.salary_bonus_nominal); 
  });
  return temp;
})


const disabled = computed(()=>{
  return (salary_paid.value.val && salary_paid.value.val1) || (useUtils().checkPermission('salary_paid.val') && salary_paid.value.val) || (useUtils().checkPermission('salary_paid.val1') && salary_paid.value.val1);
});


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

  let p_status = "Edit";
  if(props.is_copy){
    p_status = "Add";
    salary_paid.value.val = 0;
    salary_paid.value.val1 = 0;
  }

  details.value = data.value.data.details;
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    salary_paid.value = {...salary_paid_temp};
    details.value = [];
    field_errors.value = {};
    if(props.id!=0)
    callData();
  }
}, {
  immediate: true
});

</script>
