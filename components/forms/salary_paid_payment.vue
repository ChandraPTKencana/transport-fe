<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Master Standby Validation'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex ">
              <!-- <button type="button" name="button" class="m-1 text-2xl "
                @click="downloadExcel()">
                <IconsTable2Column />
              </button> -->
                <button v-show="detailStatus('TRANSFER_PROCESS')" type="button" name="button" class="m-1 bg-violet-600 text-white"
                  @click="setPaidDone()">
                  Set Paid Done
                </button>

                <button v-show="detailStatus('READY')" type="button" name="button" class="m-1 text-2xl "
                  @click="genCSVandSend()">
                  <IconsSend />
                </button>
  
                <button v-show="detailStatus('INQUIRY_PROCESS')" type="button" name="button" class="m-1 text-2xl "
                  @click="getUpdate()">
                  <IconsCloudDownload />
                </button> 

                <button v-show="detailStatus('INQUIRY_PROCESS')" type="button" name="button" class="m-1 text-2xl "
                  @click="setToReady()">
                  <IconsHistory />
                </button>
            </div>
            
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
                      <td colspan="15" class="!bg-slate-800 text-white font-bold">
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
                      <th >Nominal Bonus <span class="text-sm">({{pointFormat(total_bonus || 0) }})</span></th>
                      <th >Total <span class="text-sm">({{pointFormat((ttl_sb_gaji + ttl_sb_makan + ttl_sb_dinas + total_bonus) || 0) }})</span></th>
                      <th> Status </th>
                      <th> Aksi </th>
                      <th> Alasan Gagal </th>
                    </tr>
                  </thead>
                  <tbody ref="to_move">
                    <template v-for="(detail, index) in source" :key="index">
                      <tr v-if="detail.p_status!='Remove'"  :data-index="index">
                        <td>{{ index + 1 }}.</td>
                        <td>{{ detail.employee_role }}</td>
                        <td>{{ detail.employee_name }}</td>
                        <td>{{ detail.employee_ktp_no }}</td>
                        <!-- <td>{{ detail.employee?.sim_no }}</td> -->
                        <td>{{ detail.employee_rek_no }}</td>
                        <td>{{ detail.employee_rek_name }}</td>
                        <td>{{ detail.employee_bank_code }}</td>
                        <td>{{ pointFormat(detail.sb_gaji) }}</td>
                        <td>{{ pointFormat(detail.sb_makan) }}</td>
                        <td>{{ pointFormat(detail.sb_dinas) }}</td>
                        <td>{{ pointFormat(detail.salary_bonus_nominal) }}</td>
                        <td>{{ pointFormat(detail.payment_total) }}</td>
                        <!-- <td>{{ pointFormat(parseFloat(detail.sb_gaji) + parseFloat(detail.sb_makan) + parseFloat(detail.sb_dinas) + parseFloat(detail.salary_bonus_nominal)) }}</td> -->
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-end p-1">
                            {{detail.payment_status}}  
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-end p-1">
                            <button v-if="detail.payment_status=='INQUIRY_FAILED'" class="bg-yellow-400 rounded" @click.prevent="renewData(detail.id,index)">
                              Renew Data
                            </button>
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-end p-1">
                            {{detail.payment_failed_reason}}  
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
const { display } = useAlertStore();

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

//   const { data, error, status } = await useMyFetch("/salary_paid_validasi", {
//     method: $method,
//     headers: {
//       'Authorization': `Bearer ${token.value}`,
//       'Accept': 'application/json',
//     },
//     body: data_in,
//     retry: 0,
//   });
//   useCommonStore().loading_full = false;
//   if (status.value === 'error') {
//     useErrorStore().trigger(error, field_errors);
//     return;
//   }

//   salary_paid.value.val1 = data.value.val1;
//   salary_paid.value.val1_user = data.value.val1_user;
//   salary_paid.value.val1_by = data.value.val1_by;
//   salary_paid.value.val1_at = data.value.val1_at;

//   salary_paid.value.val2 = data.value.val2;
//   salary_paid.value.val2_user = data.value.val2_user;
//   salary_paid.value.val2_by = data.value.val2_by;
//   salary_paid.value.val2_at = data.value.val2_at;

//   salary_paid.value.val3 = data.value.val3;
//   salary_paid.value.val3_user = data.value.val3_user;
//   salary_paid.value.val3_by = data.value.val3_by;
//   salary_paid.value.val3_at = data.value.val3_at;

//   let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
//   if(idx>-1){
//     props.p_data.splice(idx,1,{...salary_paid.value});    
//   }


//   props.fnClose();
// }


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


const detailStatus = (v)=>{
  let lngt = details.value.length;
  if(lngt==0){
    return v=='';
  }
  return details.value.filter((x)=>x.payment_status==v).length == details.value.length ? true : false;
};

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


const show_send = computed(()=>{
  let showit = 0;

  details.value.every(e => {
    if(e.payment_status=='READY') {
      showit = 1;
      return false;
    }else if(e.payment_status=='INQUIRY_FAILED'){
      showit = 2;
      return false;
    }
    return true;
  });
  
  return showit;
})

const sendCSV = ref(false);

const genCSVandSend = async () => {

  if(sendCSV.value) return;
  sendCSV.value = true;

  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("id", salary_paid.value.id);
  data_in.append("_method", "PUT");

  let $method = "post";

  const { data, error, status } = await useMyFetch("/salary_paid/gen_csv_and_send_mandiri", {
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
  sendCSV.value = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error, field_errors);
    return;
  }
  display({ show: true, status: "Success", message: "Kirim Ke Mandiri Berhasil" });

  details.value.forEach((x)=>{
    x.payment_status="INQUIRY_PROCESS";
  });
  // trx_trps.value.splice(selected.value,1);
  // selected.value = -1;
  // show_confirm.value = false;
  // pop_show.value = false;

}


const getUpdate = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("id", salary_paid.value.id);
  data_in.append("_method", "PUT");

  let $method = "post";

  const { data, error, status } = await useMyFetch("/salary_paid/get_update", {
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

  display({ show: true, status: "Success", message: "Update Data Berhasil" });

  data.value.details.forEach((dt)=>{
    // x.status="INQUIRY_PROCESS";
    let idx = details.value.map((x)=>x.id).indexOf(dt.id);
    if(idx>-1){
      details.value[idx].payment_status = dt.payment_status;
      details.value[idx].payment_failed_reason = dt.payment_failed_reason;
    }
  });

  console.log(data.value.details);
  console.log(details.value);

  salary_paid.value.payment_status='WAIT';
  

  // details.value.forEach((x)=>{
  //   x.status="INQUIRY_PROCESS";
  // });
  // trx_trps.value.splice(selected.value,1);
  // selected.value = -1;
  // show_confirm.value = false;
  // pop_show.value = false;

}

const setToReady = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("id", salary_paid.value.id);
  data_in.append("_method", "PUT");

  let $method = "post";

  const { data, error, status } = await useMyFetch("/salary_paid/set_to_ready", {
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

  display({ show: true, status: "Success", message: "Update Data Berhasil" });

  details.value.forEach(el => {
    el.payment_status             = "READY";    
  });

  salary_paid.value.payment_status='OPEN';
}

const renewData = async (id,idx) => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("detail_id", id);
  data_in.append("_method", "PUT");

  let $method = "post";

  const { data, error, status } = await useMyFetch("/salary_paid_dtl/renew_data", {
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

  
  details.value[idx].rek_no                 = data.value.employee_rek_no;
  details.value[idx].rek_name               = data.value.employee_rek_name;
  details.value[idx].bank_code              = data.value.employee_bank_code;
  details.value[idx].payment_status         = data.value.payment_status;
  details.value[idx].payment_failed_reason  = data.value.payment_failed_reason;
  
  display({ show: true, status: "Success", message: "Data Berhasil Diperbaharui" });
}


watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    if(props.id==0)
    salary_paid.value = {...salary_paid_temp};
    details.value = [];

    if(props.id!=0)
    callData();
  }
}, {
  immediate: true
});

const setPaidDone = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("id", salary_paid.value.id);
  data_in.append("_method", "PUT");

  let $method = "post";

  const { data, error, status } = await useMyFetch("/salary_paid/set_paid_done", {
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

  fin_payment_req.value.payment_status = 'CLOSE';
  details.value.forEach((x)=>{
    x.payment_status="DONE";
  });

  let idx= props.p_data.map((x)=>x.id).indexOf(salary_paid.value.id);
  if(idx>-1){
    props.p_data.splice(idx,1,{...salary_paid.value});    
  }

  display({ show: true, status: "Success", message: "PAID IS DONE" });
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
</style>
