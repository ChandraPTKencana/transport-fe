<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Finance Payment Request'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex  justify-evenly">
              <!-- <button type="button" name="button" class="m-1 text-2xl "
                @click="downloadExcel()">
                <IconsTable2Column />
              </button>-->
              
                <div v-if="fin_payment_req2.status=='CLOSE'" class="w-full flex p-2">
                  Batch No : {{ fin_payment_req2.batch_no }}
                </div>
  
                <button v-show="detailStatus('TRANSFER_PROCESS') && ['SUCCESS','SET BATCH'].indexOf(fin_payment_req2.status)>-1" type="button" name="button" class="m-1 " :disabled="fin_payment_req2.status=='CLOSE'"
                  @click="frmBatchNo()">
                  Batch No : {{ fin_payment_req2.batch_no }}
                </button>
  
                <button v-show="detailStatus('TRANSFER_PROCESS') && fin_payment_req2.steps['SET_BATCH']==1" type="button" name="button" class="m-1 bg-violet-600 text-white"
                  @click="setPaidDone()">
                  Set Paid Done
                </button>
  
                <button v-show="detailStatus('') || detailStatus('READY')" type="button" name="button" class="flex justify-center items-center m-1 text-2xl "
                  @click="form_add_trx_trp()">
                  <IconsPlus /> <span class="text-sm"> TRIP </span> 
                </button>

                <button v-show="detailStatus('') || detailStatus('READY')" type="button" name="button" class="flex justify-center items-center m-1 text-2xl "
                  @click="form_add_extra_money_trx()">
                  <IconsPlus /> <span class="text-sm"> EM </span> 
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
            <div class="w-full flex flex-wrap gap-2 px-1 items-center">
          
              <div class="flex flex-col">
                <div v-if="fin_payment_req2.steps['EMPTY']>-1" class="p-3 flex items-center justify-center border-2 rounded-lg " :class="fin_payment_req2.steps['EMPTY']==0?'border-gray-500 bg-gray-300 text-black':'border-red-500 bg-red-300 text-red-800'">
                  EMPTY
                </div>
                <div v-if="fin_payment_req2.steps['READY']>-1" class="p-3 flex items-center justify-center border-2 rounded-lg" :class="fin_payment_req2.steps['READY']==0?'border-gray-500 bg-gray-300':'border-green-500 bg-green-300 text-green-800'">
                  READY
                </div>
              </div>
              <div v-if="fin_payment_req2.steps['SEND']>-1" class="p-3 flex items-center justify-center border-2 rounded-lg" :class="fin_payment_req2.steps['SEND']==0?'border-gray-500 bg-gray-300':'border-green-500 bg-green-300 text-green-800'">
                SEND
              </div>
              <div class="flex flex-col">
                <div v-if="fin_payment_req2.steps['FAILED']>-1" class="p-3 flex items-center justify-center border-2 rounded-lg " :class="fin_payment_req2.steps['FAILED']==0?'border-gray-500 bg-gray-300 text-black':'border-red-500 bg-red-300 text-red-800'">
                  FAILED
                </div>
                <div v-if="fin_payment_req2.steps['SUCCESS']>-1" class="p-3 flex items-center justify-center border-2 rounded-lg" :class="fin_payment_req2.steps['SUCCESS']==0?'border-gray-500 bg-gray-300':'border-green-500 bg-green-300 text-green-800'">
                  SUCCESS
                </div>
              </div>
              
              <div v-if="fin_payment_req2.steps['SET_BATCH']>-1" class="p-3 flex items-center justify-center border-2 rounded-lg" :class="fin_payment_req2.steps['SET_BATCH']==0?'border-gray-500 bg-gray-300':'border-green-500 bg-green-300 text-green-800'">
                SET BATCH
              </div>
              <div v-if="fin_payment_req2.steps['SET_PAID_DONE']>-1" class="p-3 flex items-center justify-center border-2 rounded-lg" :class="fin_payment_req2.steps['SET_PAID_DONE']==0?'border-gray-500 bg-gray-300':'border-green-500 bg-green-300 text-green-800'">
                SET PAID DONE
              </div>
              <div v-if="fin_payment_req2.steps['SET_PAID_DONE']==1" class="w-32 p-3 flex items-center justify-center border-2 rounded-lg border-blue-500 bg-blue-300">
                CLOSE
              </div>


            </div>
            <div class="w-full flex p-1 overflow-auto flex-wrap">
              <div class="w-full" role="sticky">
                <table class="tacky w-full !table-auto" style="white-space:normal;">
                  <thead >
                  <tr class="sticky top-0 !z-[2]">
                    <td :colspan="18" class="!bg-slate-800 text-white font-bold">
                      List Transaksi
                    </td>
                  </tr>
                  <tr class="sticky top-7 !z-[2]">
                    <th class="min-w-[50px] !w-[50px] max-w-[50px] ">No</th>
                    <th class="min-w-[50px] !w-[50px] max-w-[50px] ">ID</th>
                    <th>Source</th>
                    <th>Source ID</th>
                    <th>Tujuan</th>
                    <th>Produk</th>
                    <th class="min-w-[75px] !w-[75px] max-w-[75px] ">No Pol</th>
                    <th>Jabatan</th>
                    <th>Nama</th>
                    <th>Jumlah <br> ({{ pointFormat( total_nominal || 0) }})  </th>
                    <th>Potongan <br> ({{ pointFormat( total_potongan_trx_ttl) }})</th>
                    <th></th>
                    <th>No Rek</th>
                    <th>Nama Di Bank</th>
                    <th>Nominal Transfer <br> ({{ pointFormat(total_jumlah || 0) }})</th>
                    <th>Status </th>
                    <th>Aksi </th>
                    <th>Alasan Gagal </th>
                  </tr>
                </thead>
                  <tbody ref="to_move">
                    <template v-for="(detail, index) in fin_payment_req2.details" :key="index">
                      <!-- <tr v-if="detail.p_status!='Remove'"  :data-index="index" draggable="true" @dragstart="handleDragStart($event,index)" @dragover.prevent @drop="handleDrop($event,index)"> -->
                      <tr>
                        <td class="cell min-w-[50px] !w-[50px] max-w-[50px]">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.no }}
                          </div>
                        </td>
                        <td class="cell min-w-[50px] !w-[50px] max-w-[50px]">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.id }}
                          </div>
                        </td>
                        <td class="cell min-w-[50px] !w-[50px] max-w-[50px]">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.source }}
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-center p-2">
                            <!-- {{ detail.jabatan !='KERNET' ? detail.trx_trp_id :''  }}    -->

                            <div class="pointer p-0 bg-red-500 text-white rounded flex items-center justify-center">
                              <span class="px-2">
                                {{ detail.source_id }} 
                              </span>
                              <IconsTimes v-show="detailStatus('') || detailStatus('READY')" @click.prevent="deleteRec(detail.id,detail.source,detail.source_id)" class="cursor-pointer text-3xl font-bold p-0 border-l-2 border-red-300"/>
                            </div>
                            
                          </div>
                        </td>
                        <td class="cell min-w-[150px] !w-[150px] max-w-[150px]">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.jabatan !='KERNET' ? detail.tujuan :''  }}   
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.jabatan !='KERNET' ? detail.produk :''  }}    
                          </div>
                        </td>
                        
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.jabatan !='KERNET' ? detail.no_pol :''  }}   
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.jabatan }}   
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.nama }}   
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-end p-2">                       
                            {{ pointFormat(detail.nom_source || 0) }}   
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-end p-2">                       
                            {{ pointFormat(detail.nom_potongan_trxs) }}   
                          </div>
                        </td>
                        <td>
                          <div class="w-full h-full flex items-center justify-end p-2">                         
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.rek_no }}   
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-center">
                            {{ detail.rek_name }}   
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-end p-1">
                            {{ pointFormat(detail.nom_final || 0) }}  
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-end p-1">
                            {{detail.status}}  
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-end p-1">
                            <button v-if="detail.status=='INQUIRY_FAILED'" class="bg-yellow-400 rounded" @click.prevent="renewData(detail.id,index)">
                              Renew Data
                            </button>
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-end p-1">
                            {{detail.failed_reason}}  
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
          </div>
        </form>
    </div>
  </section>
  <LazyFormsFinPaymentReq2TrxTrps :show="forms_fin_payment_req2_trx_trp_show" :fnClose="()=>{forms_fin_payment_req2_trx_trp_show=false}" :id="fin_payment_req2.id" @setKData="fin_payment_req2=$event" @setIsNew="($event)=>{if($event)p_data.unshift(fin_payment_req2)}"/>
  <LazyFormsFinPaymentReq2ExtraMoneys :show="forms_fin_payment_req2_extra_money_trx_show" :fnClose="()=>{forms_fin_payment_req2_extra_money_trx_show=false}" :id="fin_payment_req2.id" @setKData="fin_payment_req2=$event" @setIsNew="($event)=>{if($event)p_data.unshift(fin_payment_req2)}"/>
  <div v-show="frm_show_batch" class="bg-white w-[250px] sm:w-1/2 md:w-1/3 lg:w-1/4 fixed z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-slate-700 shadow-2xl shadow-black p-2">
    <label for="">Select Batch No</label>
    <select v-model="batch_no">
      <option v-for="n in 5" :value="n-1">{{ n-1 }}</option>
    </select>
    <div class="flex justify-end pt-2">
      <button type="button" class="bg-blue-500 text-white" @click="saveBatchNo()">Save</button>
      <button type="button" class="bg-yellow-500 text-white ml-2" @click="frm_show_batch=false">Cancel</button>
    </div>
  </div>

</template>

<script setup>

const { $moment } = useNuxtApp()
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
})

const fin_payment_req2_temp = {
  id: 0,
  batch_no:0,
  details: [],
  steps:{
    "EMPTY":-1,
    "READY":-1,
    "SEND":-1,
    "FAILED":-1,
    "SUCCESS":-1,
    "SET_BATCH":-1,
    "SET_PAID_DONE":-1,
  }
};

const fin_payment_req2 = ref({...fin_payment_req2_temp});

const token = useDynamicPathCookie('token');


const total_nominal = computed(()=>{
  let temp = 0;

  fin_payment_req2.value.details.forEach(e => {
    temp += parseInt(e.nom_source); 
  });
  
  return temp;
})

const total_potongan_trx_ttl = computed(()=>{
  let temp = 0;

  fin_payment_req2.value.details.forEach(e => {
    temp += parseInt(e.nom_potongan_trxs);
  });
  
  return temp;
})

const total_extra_money_trx_ttl = computed(()=>{
  let temp = 0;

  fin_payment_req2.value.details.forEach(e => {
    temp += parseInt(e.extra_money_trx_ttl);
  });
  
  return temp;
})

const total_jumlah = computed(()=>{
  let temp = 0;

  fin_payment_req2.value.details.forEach(e => {
    temp += parseInt(e.nom_final); 
  });
  
  return temp;
})

const detailStatus = (v)=>{
  let lngt = fin_payment_req2.value.details.length;
  if(lngt==0){
    return v=='';
  }
  return fin_payment_req2.value.details.filter((x)=>x.status==v).length == fin_payment_req2.value.details.length ? true : false;
};

const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/fin_payment_req2", {
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

  fin_payment_req2.value = data.value.data;

  let p_status = "Edit";
  if(props.is_copy){
    p_status = "Add";
    fin_payment_req2.value.val = 0;
    fin_payment_req2.value.val1 = 0;
  }

  // details.value = data.value.data.details; 
}
const { downloadFile, viewFile } = useDownload();

const downloadExcel = async()=>{  
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/fin_payment_req2/download_view", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id:fin_payment_req2.value.id},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  downloadFile(data.value);
}
const field_errors = ref({})

const sendCSV = ref(false);

const genCSVandSend = async () => {

  if(sendCSV.value) return;
  sendCSV.value = true;
  
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("id", fin_payment_req2.value.id);
  data_in.append("_method", "PUT");

  let $method = "post";

  const { data, error, status } = await useMyFetch("/fin_payment_req2/gen_csv_and_send_mandiri", {
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

  fin_payment_req2.value.details.forEach((x)=>{
    x.status="INQUIRY_PROCESS";
  });

  fin_payment_req2.value.steps = data.value.steps;
  // trx_trps.value.splice(selected.value,1);
  // selected.value = -1;
  // show_confirm.value = false;
  // pop_show.value = false;
}

const getUpdate = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("id", fin_payment_req2.value.id);
  data_in.append("_method", "PUT");

  let $method = "post";

  const { data, error, status } = await useMyFetch("/fin_payment_req2/get_update", {
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
    let idx = fin_payment_req2.value.details.map((x)=>x.id).indexOf(dt.id);
    if(idx>-1){
      fin_payment_req2.value.details[idx].status = dt.status;
      fin_payment_req2.value.details[idx].failed_reason = dt.failed_reason;
    }
  });

  fin_payment_req2.value.status=data.value.status;
  fin_payment_req2.value.steps=data.value.steps;

  // console.log(data.value.details);
  // console.log(details.value);

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
  data_in.append("id", fin_payment_req2.value.id);
  data_in.append("_method", "PUT");

  let $method = "post";

  const { data, error, status } = await useMyFetch("/fin_payment_req2/set_to_ready", {
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

  fin_payment_req2.value.details.forEach(el => {
    el.status             = "READY";    
  });

  fin_payment_req2.value.status='READY';

  fin_payment_req2.value.steps = data.value.steps;
}

const renewData = async (id,idx) => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("detail_id", id);
  data_in.append("_method", "PUT");

  let $method = "post";

  const { data, error, status } = await useMyFetch("/fin_payment_req2_dtl/renew_data", {
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

  
  fin_payment_req2.value.details[idx].rek_no            = data.value.employee_rek_no;
  fin_payment_req2.value.details[idx].rek_name          = data.value.employee_rek_name;
  fin_payment_req2.value.details[idx].bank_code         = data.value.employee_bank_code;
  fin_payment_req2.value.details[idx].status            = data.value.status;
  fin_payment_req2.value.details[idx].failed_reason     = data.value.failed_reason;
  fin_payment_req2.value.steps                          = data.value.steps;
  
  display({ show: true, status: "Success", message: "Data Berhasil Diperbaharui" });
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    if(props.id==0)
    fin_payment_req2.value = {...fin_payment_req2_temp};
    // details.value = [];

    if(props.id!=0)
    callData();
  }
}, {
  immediate: true
});

// watch(() => props.id, (newVal, oldVal) => {
//   if (oldVal==0 && newVal != 0){
//     console.log('oldVal',oldVal);
//     console.log('newVal',newVal);
//     props.p_data.push(fin_payment_req2.value);
//     // fin_payment_req2.value = {...fin_payment_req2_temp};
//     // // details.value = [];

//     // if(props.id!=0)
//     // callData();
//   }
// }, {
//   // immediate: true
// });




const forms_fin_payment_req2_trx_trp_show =  ref(false);
const form_add_trx_trp = () => {
  forms_fin_payment_req2_trx_trp_show.value = true;
}

const forms_fin_payment_req2_extra_money_trx_show =  ref(false);
const form_add_extra_money_trx = () => {
  forms_fin_payment_req2_extra_money_trx_show.value = true;
}

const deleteRec = async (id,source,source_id) => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  if(source=='TRIP'){
    data_in.append("trx_trp_id", source_id);
  }else{
    data_in.append("extra_money_trx_id", source_id);
  }
  data_in.append("_method", "DELETE");

  let $method = "post";

  const { data, error, status } = await useMyFetch("/fin_payment_req2_dtl/delete_data", {
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

  fin_payment_req2.value.details = fin_payment_req2.value.details.filter((x)=>{return x.source_id!=source_id});

  fin_payment_req2.value.steps = data.value.steps;
  // fin_payment_req2.value.details[idx].rek_no             = data.value.employee_rek_no;
  // fin_payment_req2.value.details[idx].rek_name           = data.value.employee_rek_name;
  // fin_payment_req2.value.details[idx].bank_code          = data.value.employee_bank_code;
  // fin_payment_req2.value.details[idx].status             = data.value.status;
  // fin_payment_req2.value.details[idx].failed_reason      = data.value.failed_reason;
  
  // display({ show: true, status: "Success", message: "Data Berhasil Diperbaharui" });
}


const frm_show_batch=ref(false);
const batch_no = ref(0);
const frmBatchNo=()=>{
  frm_show_batch.value = true;
  batch_no.value = fin_payment_req2.value.batch_no;
}

const saveBatchNo = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("id", fin_payment_req2.value.id);
  data_in.append("batch_no", batch_no.value);
  data_in.append("_method", "PUT");

  let $method = "post";

  const { data, error, status } = await useMyFetch("/fin_payment_req2/set_batch_no", {
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

  fin_payment_req2.value.batch_no = batch_no.value;
  fin_payment_req2.value.steps = data.value.steps;
  
  let idx= props.p_data.map((x)=>x.id).indexOf(fin_payment_req2.value.id);
  if(idx>-1){
    props.p_data.splice(idx,1,{...fin_payment_req2.value});    
  }
  frm_show_batch.value = false;

  display({ show: true, status: "Success", message: "No Batch Berhasil Diperbaharui" });
}

const setPaidDone = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("id", fin_payment_req2.value.id);
  data_in.append("_method", "PUT");

  let $method = "post";

  const { data, error, status } = await useMyFetch("/fin_payment_req2/set_paid_done", {
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

  fin_payment_req2.value.status = 'CLOSE';
  fin_payment_req2.value.steps = data.value.steps;
  fin_payment_req2.value.details.forEach((x)=>{
    x.status="DONE";
  });

  let idx= props.p_data.map((x)=>x.id).indexOf(fin_payment_req2.value.id);
  if(idx>-1){
    props.p_data.splice(idx,1,{...fin_payment_req2.value});    
  }

  display({ show: true, status: "Success", message: "PAID IS DONE" });
}
</script>
