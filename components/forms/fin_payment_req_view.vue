<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Finance Payment Request'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex ">
              <button type="button" name="button" class="m-1 text-2xl "
                @click="downloadExcel()">
                <IconsTable2Column />
              </button>

              <button v-show="show_send==1" type="button" name="button" class="m-1 text-2xl "
                @click="genCSVandSend()">
                <IconsSend />
              </button>

              <button v-show="show_send==0" type="button" name="button" class="m-1 text-2xl "
                @click="getUpdate()">
                <IconsRefresh />
              </button>
            </div>
            <div class="w-full flex p-1 2xl:overflow-hidden justify-between flex-wrap">
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
                    <th>Tujuan</th>
                    <th>Produk</th>
                    <th>No Trx</th>
                    <th class="min-w-[75px] !w-[75px] max-w-[75px] ">No Pol</th>
                    <th>Jabatan</th>
                    <th>Nama</th>
                    <th>Jumlah <br> ({{ pointFormat( total_nominal || 0) }})  </th>
                    <th>Potongan <br> ({{ pointFormat( total_potongan_trx_ttl) }})</th>
                    <th>ExtraMoney <br> ({{ pointFormat( total_extra_money_trx_ttl) }})</th>
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
                    <template v-for="(detail, index) in details" :key="index">
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
                            {{ detail.jabatan !='KERNET' ? detail.trx_trp_id :''  }}   
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
                            {{ pointFormat(detail.nominal || 0) }}   
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-end p-2">                       
                            {{ pointFormat(detail.potongan_trx_ttl) }}   
                          </div>
                        </td>
                        <td class="cell">
                          <div class="w-full h-full flex items-center justify-end p-2">                       
                            {{ pointFormat(detail.extra_money_trx_ttl) }}   
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
                            {{ pointFormat(detail.jumlah || 0) }}  
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
  // p_data:{
  //   type:Array,
  //   required:true,
  //   default:[]
  // },
})

const fin_payment_req_temp = {
    id: -1,
    details: [],
};

const fin_payment_req = ref({...fin_payment_req_temp});

const token = useDynamicPathCookie('token');

const details = ref([]);


const total_nominal = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseInt(e.nominal); 
  });
  
  return temp;
})

const total_potongan_trx_ttl = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseInt(e.potongan_trx_ttl);
  });
  
  return temp;
})

const total_extra_money_trx_ttl = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseInt(e.extra_money_trx_ttl);
  });
  
  return temp;
})

const total_jumlah = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseInt(e.jumlah); 
  });
  
  return temp;
})

const show_send = computed(()=>{
  let showit = 0;

  details.value.every(e => {
    if(e.status=='READY') {
      showit = 1;
      return false;
    }else if(e.status=='INQUIRY_FAILED'){
      showit = 2;
      return false;
    }
    return true;
  });
  
  return showit;
})

const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/fin_payment_req", {
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

  fin_payment_req.value = data.value.data;

  let p_status = "Edit";
  if(props.is_copy){
    p_status = "Add";
    fin_payment_req.value.val = 0;
    fin_payment_req.value.val1 = 0;
  }

  details.value = data.value.data.details; 
}
const { downloadFile, viewFile } = useDownload();

const downloadExcel = async()=>{  
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/fin_payment_req/download_view", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id:props.id},
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
const genCSVandSend = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("id", props.id);
  data_in.append("_method", "PUT");

  let $method = "post";

  const { data, error, status } = await useMyFetch("/fin_payment_req/gen_csv_and_send_mandiri", {
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
  display({ show: true, status: "Success", message: "Kirim Ke Mandiri Berhasil" });

  details.value.forEach((x)=>{
    x.status="INQUIRY_PROCESS";
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
  data_in.append("id", props.id);
  data_in.append("_method", "PUT");

  let $method = "post";

  const { data, error, status } = await useMyFetch("/fin_payment_req/get_update", {
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
      details.value[idx].status = dt.status;
      details.value[idx].failed_reason = dt.failed_reason;
    }
  });

  console.log(data.value.details);
  console.log(details.value);

  
  

  // details.value.forEach((x)=>{
  //   x.status="INQUIRY_PROCESS";
  // });
  // trx_trps.value.splice(selected.value,1);
  // selected.value = -1;
  // show_confirm.value = false;
  // pop_show.value = false;

}

const renewData = async (id,idx) => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  data_in.append("detail_id", id);
  data_in.append("_method", "PUT");

  let $method = "post";

  const { data, error, status } = await useMyFetch("/fin_payment_req_dtl/renew_data", {
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

  
  details.value[idx].rek_no             = data.value.employee_rek_no;
  details.value[idx].rek_name           = data.value.employee_rek_name;
  details.value[idx].bank_code          = data.value.employee_bank_code;
  details.value[idx].status             = data.value.status;
  details.value[idx].failed_reason      = data.value.failed_reason;
  
  display({ show: true, status: "Success", message: "Data Berhasil Diperbaharui" });
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    fin_payment_req.value = {...fin_payment_req_temp};
    details.value = [];

    if(props.id!=0)
    callData();
  }
}, {
  immediate: true
});

</script>
