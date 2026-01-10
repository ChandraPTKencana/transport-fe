<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Salary Report Validation'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Period End</label>
                <div class="card-border">
                  {{ $moment(rpt_salary.period_end).format("MM-Y") }}
                </div>
              </div>
              <div v-if="details.length" class="w-full sm:w-6/12 md:w-4/12 lg:w-4/12 p-1">
                <div class="font-bold"> Filter Nama </div>
                <input class="" type="text" v-model="search" name="search"
                  placeholder="Nama">
              </div>
            </div>
  

            <div v-if="source.length" class="w-full flex p-1 justify-between flex-wrap">
              <div class="w-full" role="sticky">
                <table class="tacky w-full !table-auto" style="white-space:normal;">
                  <thead >
                    <tr class="sticky -top-1 !z-[2]">
                      <td colspan="46" class="!bg-slate-800 text-white font-bold">
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
                      <th rowspan="2">Nama Rek</th>
                      <th rowspan="2">Nama Bank</th>
                      <th colspan="3">Standby 1 <span class="text-sm">({{pointFormat(table_datas.standby_1_ttl) }})</span></th>
                      <th rowspan="2">Potongan 1 <span class="text-sm">({{pointFormat(table_datas.perubahaan_lainnya_1_ttl) }})</span></th>
                      <th rowspan="2">Periode 1 <span class="text-sm">({{pointFormat(table_datas.periode_1_ttl) }})</span></th>
                      <th colspan="3">Standby 2 <span class="text-sm">({{pointFormat(table_datas.standby_2_ttl) }})</span></th>
                      <th rowspan="2">Potongan 2 <span class="text-sm">({{pointFormat(table_datas.perubahaan_lainnya_2_ttl) }})</span></th>
                      <th rowspan="2">U.Kerajinan <span class="text-sm">({{pointFormat(table_datas.perubahaan_kerajinan_ttl) }})</span></th>
                      <th colspan="3">Bonus Trip <span class="text-sm">({{pointFormat(table_datas.bonus_trip_ttl) }})</span></th>
                      <th rowspan="2">Periode 2 <span class="text-sm">({{pointFormat(table_datas.periode_2_ttl) }})</span></th>
                      <th rowspan="2">Potongan Manual <span class="text-sm">({{pointFormat(table_datas.potongan_manual_ttl) }})</span></th>
                      <th rowspan="2">Periode 2 setelah potongan <span class="text-sm">({{pointFormat(table_datas.periode_2_ttl_stlh_pot) }})</span></th>
                      <th rowspan="2">Periode 1+2 <span class="text-sm">({{pointFormat(table_datas.periode_ttl) }})</span></th>
                      <th colspan="4">Trip <span class="text-sm">({{pointFormat(table_datas.trip_umum_ttl) }})</span></th>
                      <th colspan="4">Trip Lain <span class="text-sm">({{pointFormat(table_datas.trip_lain_ttl) }})</span></th>
                      <th colspan="3" class="whitespace-nowrap">Trip Tunggu <span class="text-sm">({{pointFormat(table_datas.trip_tunggu_ttl) }})</span></th>
                      <th rowspan="2">Potongan Trip <span class="text-sm">({{pointFormat(table_datas.potongan_trip) }})</span></th>
                      <th rowspan="2">Total <span class="text-sm">({{pointFormat(table_datas.total) }})</span></th>
                      <th rowspan="2">BPJS Kesehatan <span class="text-sm">({{pointFormat(table_datas.bpjs_kesehatan_ttl) }})</span></th>
                      <th rowspan="2">BPJS Jamsos <span class="text-sm">({{pointFormat(table_datas.bpjs_jamsos_ttl) }})</span></th>
                      <th rowspan="2">Grand Total <span class="text-sm">({{pointFormat(table_datas.total_grand) }})</span></th>
                    </tr>
                    <tr class="sticky top-[60px] !z-[2]">
                      <th >Gaji <span class="text-sm">({{pointFormat(table_datas.standby_1_gaji) }})</span></th>
                      <th >Makan <span class="text-sm">({{pointFormat(table_datas.standby_1_makan) }})</span></th>
                      <th >Dinas <span class="text-sm">({{pointFormat(table_datas.standby_1_dinas) }})</span></th>
                      <th >Gaji <span class="text-sm">({{pointFormat(table_datas.standby_2_gaji) }})</span></th>
                      <th >Makan <span class="text-sm">({{pointFormat(table_datas.standby_2_makan) }})</span></th>
                      <th >Dinas <span class="text-sm">({{pointFormat(table_datas.standby_2_dinas) }})</span></th>
                      <th >Gaji <span class="text-sm">({{pointFormat(table_datas.bonus_trip_gaji) }})</span></th>
                      <th >Dinas <span class="text-sm">({{pointFormat(table_datas.bonus_trip_dinas) }})</span></th>
                      <th >Potongan <span class="text-sm">({{pointFormat(bonus_trip_perubahaan || 0) }} )</span></th>
                      <th >Jmlh <span class="text-sm">({{pointFormat(table_datas.trip_jumlah) }})</span></th>
                      <th >Gaji <span class="text-sm">({{pointFormat(table_datas.trip_umum_gaji) }})</span></th>
                      <th >Makan <span class="text-sm">({{pointFormat(table_datas.trip_umum_makan) }})</span></th>
                      <th >Dinas <span class="text-sm">({{pointFormat(table_datas.trip_umum_dinas) }})</span></th>
                      <th >Jmlh <span class="text-sm">({{pointFormat(table_datas.trip_lain_jlh) }})</span></th>
                      <th >Gaji <span class="text-sm">({{pointFormat(table_datas.trip_lain_gaji) }})</span></th>
                      <th >Makan <span class="text-sm">({{pointFormat(table_datas.trip_lain_makan) }})</span></th>
                      <th >Dinas <span class="text-sm">({{pointFormat(table_datas.trip_lain_dinas) }})</span></th>
                      <th >Jmlh <span class="text-sm">({{pointFormat(table_datas.trip_tunggu_jlh) }})</span></th>
                      <th >Gaji <span class="text-sm">({{pointFormat(table_datas.trip_tunggu_gaji) }})</span></th>
                      <th >Dinas <span class="text-sm">({{pointFormat(table_datas.trip_tunggu_dinas) }})</span></th>                  
                    </tr>
                  </thead>
                  <tbody ref="to_move">
                    <template v-for="(detail, index) in source" :key="index">
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
                        <td>{{ detail.employee_rek_name }}</td>
                        <td>{{ detail.employee_bank_name }}</td>
                        <td>{{ pointFormat(detail.sb_gaji) }}</td>
                        <td>{{ pointFormat(detail.sb_makan) }}</td>
                        <td>{{ pointFormat(detail.sb_dinas) }}</td>
                        <td>{{ pointFormat(detail.salary_bonus_nominal) }}</td>
                        <td>{{ pointFormat(detail.periode_1_ttl) }}</td>
                        <td>{{ pointFormat(detail.sb_gaji_2) }}</td>
                        <td>{{ pointFormat(detail.sb_makan_2) }}</td>
                        <td>{{ pointFormat(detail.sb_dinas_2) }}</td>
                        <td>{{ pointFormat(detail.salary_bonus_nominal_2) }}</td>
                        <td>{{ pointFormat(detail.kerajinan) }}</td>
                        <td>{{ pointFormat(detail.bonus_trip_gaji) }}</td>
                        <td>{{ pointFormat(detail.bonus_trip_dinas) }}</td>
                        <td>{{ pointFormat(detail.salary_bonus_bonus_trip) }}</td>
                        <td>{{ pointFormat(detail.periode_2_ttl) }}</td>
                        <td>{{ pointFormat(detail.potongan_manual) }}</td>
                        <td>{{ pointFormat(detail.periode_2_ttl_stlh_pot) }}</td>
                        <td>{{ pointFormat(detail.periode_ttl) }}</td>
                        <td>{{ pointFormat(detail.trip_jumlah) }}</td>
                        <td>{{ pointFormat(detail.uj_gaji) }}</td>
                        <td>{{ pointFormat(detail.uj_makan) }}</td>
                        <td>{{ pointFormat(detail.uj_dinas) }}</td>
                        <td>{{ pointFormat(detail.trip_lain) }}</td>
                        <td>{{ pointFormat(detail.trip_lain_gaji) }}</td>
                        <td>{{ pointFormat(detail.trip_lain_makan) }}</td>
                        <td>{{ pointFormat(detail.trip_lain_dinas) }}</td>
                        <td>{{ pointFormat(detail.trip_tunggu) }}</td>
                        <td>{{ pointFormat(detail.trip_tunggu_gaji) }}</td>
                        <td>{{ pointFormat(detail.trip_tunggu_dinas) }}</td>
                        <td>{{ pointFormat(detail.nominal_cut) }}</td>
                        <td>{{ pointFormat(detail.total) }}</td>
                        <td>{{ pointFormat(detail.employee_bpjs_kesehatan) }}</td>
                        <td>{{ pointFormat(detail.employee_bpjs_jamsos) }}</td>
                        <td>{{ pointFormat(detail.total_grand) }}</td>                      
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
              <div v-if="rpt_salary.val1 || rpt_salary.val2 || rpt_salary.val3" class="border-solid border-2 w-fit p-1 bg-slate-700 text-white text-xs">
                <div v-if="rpt_salary.val1">
                  App 1 : {{ rpt_salary.val1_by.username}} ( {{ rpt_salary.val1_at ? $moment(rpt_salary.val1_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <!-- <div v-if="rpt_salary.val2">
                  App 2 : {{ rpt_salary.val2_by.username}} ( {{ rpt_salary.val2_at ? $moment(rpt_salary.val2_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="rpt_salary.val3">
                  App 3 : {{ rpt_salary.val3_by.username}} ( {{ rpt_salary.val3_at ? $moment(rpt_salary.val3_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
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

const rpt_salary_temp = {
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

const rpt_salary = ref({...rpt_salary_temp});

const token = useDynamicPathCookie('token');
const field_errors = ref({});
const it_val = ref(null);
const details = ref([]);
const table_datas = ref([]);

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

  const { data, error, status } = await useMyFetch("/rpt_salary_validasi", {
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

  rpt_salary.value.val1 = data.value.val1;
  rpt_salary.value.val1_user = data.value.val1_user;
  rpt_salary.value.val1_by = data.value.val1_by;
  rpt_salary.value.val1_at = data.value.val1_at;

  rpt_salary.value.val2 = data.value.val2;
  rpt_salary.value.val2_user = data.value.val2_user;
  rpt_salary.value.val2_by = data.value.val2_by;
  rpt_salary.value.val2_at = data.value.val2_at;

  rpt_salary.value.val3 = data.value.val3;
  rpt_salary.value.val3_user = data.value.val3_user;
  rpt_salary.value.val3_by = data.value.val3_by;
  rpt_salary.value.val3_at = data.value.val3_at;

  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>-1){
    props.p_data.splice(idx,1,{...rpt_salary.value});    
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

const ttl_sb_gaji_2 = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.sb_gaji_2); 
  });
  return temp;
})

const ttl_sb_makan_2 = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.sb_makan_2); 
  });
  return temp;
})

const ttl_sb_dinas_2 = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.sb_dinas_2); 
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

const ttl_uj_dinas = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.uj_dinas); 
  });
  return temp;
})

const ttl_bonus_trip = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.trip_lain); 
  });
  return temp;
})

const ttl_lain = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.trip_lain); 
  });
  return temp;
})
const ttl_lain_gaji = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.trip_lain_gaji); 
  });
  return temp;
})
const ttl_lain_makan = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.trip_lain_makan); 
  });
  return temp;
})

const ttl_lain_dinas = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.trip_lain_dinas); 
  });
  return temp;
})

const ttl_tunggu = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.trip_tunggu); 
  });
  return temp;
})

const ttl_tunggu_gaji = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.trip_tunggu_gaji); 
  });
  return temp;
})

const ttl_tunggu_dinas = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.trip_tunggu_dinas); 
  });
  return temp;
})

const ttl_bonus_jmlh = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.trip_cpo)+ parseFloat(e.trip_pk)+parseFloat(e.trip_tbs) +parseFloat(e.trip_tbsk);
  });
  return temp;
})

const ttl_bonus_gaji = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.trip_cpo_bonus_gaji)+ parseFloat(e.trip_pk_bonus_gaji)+parseFloat(e.trip_tbs_bonus_gaji) +parseFloat(e.trip_tbsk_bonus_gaji);
  });
  return temp;
})

const ttl_bonus_dinas = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.trip_cpo_bonus_dinas)+ parseFloat(e.trip_pk_bonus_dinas)+parseFloat(e.trip_tbs_bonus_dinas) +parseFloat(e.trip_tbsk_bonus_dinas);
  });
  return temp;
})


const ttl_bpjs_kesehatan = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.employee_bpjs_kesehatan); 
  });
  return temp;
})

const ttl_bpjs_jamsos = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.employee_bpjs_jamsos); 
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

const ttl_bonus_2 = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.salary_bonus_nominal_2); 
  });
  return temp;
})

const ttl_kerajinan = computed(()=>{
  let temp = 0;

  details.value.forEach(e => {
    temp += parseFloat(e.kerajinan); 
  });
  return temp;
})

const standby_1 = computed(()=>{
  return (ttl_sb_gaji.value + ttl_sb_makan.value + ttl_sb_dinas.value) || 0;
})

const ttl_periode_1 = computed(()=>{
  return (standby_1.value + ttl_bonus.value) || 0;
})

const standby_2 = computed(()=>{
  return (ttl_sb_gaji_2.value + ttl_sb_makan_2.value + ttl_sb_dinas_2.value) || 0;
})

const ttl_periode_2 = computed(()=>{
  return (standby_2.value + ttl_bonus_2.value + ttl_kerajinan.value) || 0;
})

const ttl_periode = computed(()=>{
  return (ttl_periode_1.value + ttl_periode_2.value) || 0;
})

const trip = computed(()=>{
  return (ttl_uj_gaji.value + ttl_uj_makan.value + ttl_uj_dinas.value) || 0;
})

const _lain_ = computed(()=>{
  return (ttl_lain_gaji.value + ttl_lain_makan.value + ttl_lain_dinas.value) || 0;
})

const _tunggu_ = computed(()=>{
  return (ttl_tunggu_gaji.value + ttl_tunggu_dinas.value) || 0;
})

const bonus_trip = computed(()=>{
  return (ttl_bonus_gaji.value + ttl_bonus_dinas.value) || 0;
})

const total = computed(()=>{
  return (trip.value + _lain_.value + _tunggu_.value + bonus_trip.value - ttl_potongan.value) || 0;
})

const total_grand = computed(()=>{
  return (ttl_periode.value +  total.value - ttl_bpjs_kesehatan.value - ttl_bpjs_jamsos.value) || 0;
})

const cal_periode_1 = (dtl)=>{
  return parseFloat(dtl.sb_gaji) + parseFloat(dtl.sb_makan) + parseFloat(dtl.sb_dinas) + parseFloat(dtl.salary_bonus_nominal);
}

const cal_periode_2 = (dtl)=>{
  return parseFloat(dtl.sb_gaji_2) + parseFloat(dtl.sb_makan_2) + parseFloat(dtl.sb_dinas_2) + parseFloat(dtl.salary_bonus_nominal_2) + parseFloat(dtl.kerajinan)  +
  parseFloat(dtl.trip_cpo_bonus_gaji) + parseFloat(dtl.trip_cpo_bonus_dinas) +
  parseFloat(dtl.trip_pk_bonus_gaji) + parseFloat(dtl.trip_pk_bonus_dinas) +
  parseFloat(dtl.trip_tbs_bonus_gaji) + parseFloat(dtl.trip_tbs_bonus_dinas) +
  parseFloat(dtl.trip_tbsk_bonus_gaji) + parseFloat(dtl.trip_tbsk_bonus_dinas) +
  parseFloat(dtl.salary_bonus_bonus_trip);
}

const cal_periode = (dtl)=>{
  return cal_periode_1(dtl)+cal_periode_2(dtl);
}

const cal_total = (dtl)=>{
  return parseFloat(dtl.uj_gaji) + parseFloat(dtl.uj_makan) + parseFloat(dtl.uj_dinas) + 
  parseFloat(dtl.trip_lain_gaji) + parseFloat(dtl.trip_lain_makan) + parseFloat(dtl.trip_lain_dinas) +
  parseFloat(dtl.trip_tunggu_gaji) + parseFloat(dtl.trip_tunggu_dinas)  -
  parseFloat(dtl.nominal_cut);
}

const cal_total_grand = (dtl)=>{
  return cal_periode(dtl)  + cal_total(dtl) - parseFloat(dtl.employee_bpjs_kesehatan) - parseFloat(dtl.employee_bpjs_jamsos);
}

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
  details.value = data.value.data.details;

  // remake details
  let all_data = {
    details : data.value.data.details,
    standby_1_ttl : 0,
    standby_1_gaji : 0,
    standby_1_makan : 0,
    standby_1_dinas : 0,
    perubahaan_lainnya_1_ttl:0,
    periode_1_ttl:0,
    standby_2_ttl : 0,
    standby_2_gaji : 0,
    standby_2_makan : 0,
    standby_2_dinas : 0,
    perubahaan_lainnya_2_ttl:0,
    perubahaan_kerajinan_ttl:0,
    periode_2_ttl:0,
    potongan_manual_ttl:0,
    periode_2_ttl_stlh_pot:0,
    periode_ttl:0,
    trip_umum_ttl : 0,
    trip_umum_gaji : 0,
    trip_umum_makan : 0,
    trip_umum_dinas : 0,
    trip_lain_ttl : 0,
    trip_lain_jlh : 0,
    trip_lain_gaji : 0,
    trip_lain_makan : 0,
    trip_lain_dinas : 0,
    trip_tunggu_ttl : 0,
    trip_tunggu_jlh : 0,
    trip_tunggu_gaji : 0,
    trip_tunggu_dinas : 0,
    bonus_trip_ttl : 0,
    trip_jumlah : 0,
    bonus_trip_gaji : 0,
    bonus_trip_dinas : 0,
    bonus_trip_perubahaan : 0,
    potongan_trip : 0,
    total : 0,
    bpjs_kesehatan_ttl : 0,
    bpjs_jamsos_ttl : 0,
    total_grand : 0,
  };


  all_data.details.forEach(x=>{
    x.periode_1_ttl=parseFloat(x.sb_gaji)+parseFloat(x.sb_makan)+parseFloat(x.sb_dinas)+parseFloat(x.salary_bonus_nominal);

    x.trip_jumlah = x.trip_cpo + x.trip_pk + x.trip_tbs + x.trip_tbsk;
    x.bonus_trip_gaji = parseFloat(x.trip_cpo_bonus_gaji) + parseFloat(x.trip_pk_bonus_gaji) + parseFloat(x.trip_tbs_bonus_gaji) + parseFloat(x.trip_tbsk_bonus_gaji);
    x.bonus_trip_dinas = parseFloat(x.trip_cpo_bonus_dinas) + parseFloat(x.trip_pk_bonus_dinas) + parseFloat(x.trip_tbs_bonus_dinas) + parseFloat(x.trip_tbsk_bonus_dinas);

    x.periode_2_ttl=parseFloat(x.sb_gaji_2)+parseFloat(x.sb_makan_2)+parseFloat(x.sb_dinas_2)+parseFloat(x.salary_bonus_nominal_2)+parseFloat(x.kerajinan)
    +parseFloat(x.bonus_trip_gaji)+parseFloat(x.bonus_trip_dinas) + parseFloat(x.salary_bonus_bonus_trip);
    
    x.periode_2_ttl_stlh_pot=x.periode_2_ttl-parseFloat(x.potongan_manual); 

    x.periode_ttl = x.periode_1_ttl +  x.periode_2_ttl_stlh_pot;
    
    x.total = parseFloat(x.uj_gaji) + parseFloat(x.uj_makan)+ parseFloat(x.uj_dinas)
    + parseFloat(x.trip_lain_gaji)+ parseFloat(x.trip_lain_makan)+ parseFloat(x.trip_lain_dinas)
    + parseFloat(x.trip_tunggu_gaji) + parseFloat(x.trip_tunggu_dinas) - parseFloat(x.nominal_cut);

    x.total_grand = x.periode_ttl + x.total - parseFloat(x.employee_bpjs_kesehatan) - parseFloat(x.employee_bpjs_jamsos);

    all_data.standby_1_gaji += parseFloat(x.sb_gaji);
    all_data.standby_1_makan += parseFloat(x.sb_makan);
    all_data.standby_1_dinas += parseFloat(x.sb_dinas);

    all_data.perubahaan_lainnya_1_ttl += parseFloat(x.salary_bonus_nominal);

    all_data.standby_2_gaji += parseFloat(x.sb_gaji_2);
    all_data.standby_2_makan += parseFloat(x.sb_makan_2);
    all_data.standby_2_dinas += parseFloat(x.sb_dinas_2);
    all_data.perubahaan_lainnya_2_ttl += parseFloat(x.salary_bonus_nominal_2);
    all_data.perubahaan_kerajinan_ttl += parseFloat(x.kerajinan);

    all_data.potongan_manual_ttl += parseFloat(x.potongan_manual);

    all_data.trip_umum_gaji += parseFloat(x.uj_gaji);
    all_data.trip_umum_makan += parseFloat(x.uj_makan);
    all_data.trip_umum_dinas += parseFloat(x.uj_dinas);

    all_data.trip_lain_jlh += x.trip_lain;
    all_data.trip_lain_gaji += parseFloat(x.trip_lain_gaji);
    all_data.trip_lain_makan += parseFloat(x.trip_lain_makan);
    all_data.trip_lain_dinas += parseFloat(x.trip_lain_dinas);

    all_data.trip_tunggu_jlh += x.trip_tunggu;
    all_data.trip_tunggu_gaji += parseFloat(x.trip_tunggu_gaji);
    all_data.trip_tunggu_dinas += parseFloat(x.trip_tunggu_dinas);

    all_data.trip_jumlah += x.trip_jumlah;
    all_data.bonus_trip_gaji += x.bonus_trip_gaji;
    all_data.bonus_trip_dinas += x.bonus_trip_dinas;
    all_data.bonus_trip_perubahaan += parseFloat(x.salary_bonus_bonus_trip);

    all_data.potongan_trip += parseFloat(x.nominal_cut);

    all_data.bpjs_kesehatan_ttl += parseFloat(x.employee_bpjs_kesehatan);
    all_data.bpjs_jamsos_ttl += parseFloat(x.employee_bpjs_jamsos);
  })
  all_data.standby_1_ttl = all_data.standby_1_gaji + all_data.standby_1_makan + all_data.standby_1_dinas; 
  all_data.periode_1_ttl = all_data.standby_1_ttl + all_data.perubahaan_lainnya_1_ttl; 
  
  all_data.standby_2_ttl = all_data.standby_2_gaji + all_data.standby_2_makan + all_data.standby_2_dinas; 

  all_data.bonus_trip_ttl = all_data.bonus_trip_gaji + all_data.bonus_trip_dinas + all_data.bonus_trip_perubahaan; 
  all_data.periode_2_ttl = all_data.standby_2_ttl + all_data.perubahaan_lainnya_2_ttl + all_data.perubahaan_kerajinan_ttl + all_data.bonus_trip_ttl;  
  all_data.periode_2_ttl_stlh_pot = all_data.periode_2_ttl + all_data.potongan_manual_ttl;  
  
  all_data.periode_ttl = all_data.periode_1_ttl + all_data.periode_2_ttl_stlh_pot; 

  all_data.trip_umum_ttl = all_data.trip_umum_gaji + all_data.trip_umum_makan + all_data.trip_umum_dinas; 
  all_data.trip_lain_ttl = all_data.trip_lain_gaji + all_data.trip_lain_makan + all_data.trip_lain_dinas; 
  all_data.trip_tunggu_ttl = all_data.trip_tunggu_gaji + all_data.trip_tunggu_dinas; 
  all_data.total = all_data.trip_umum_ttl+ all_data.trip_lain_ttl+ all_data.trip_tunggu_ttl - all_data.potongan_trip;

  all_data.total_grand = all_data.periode_ttl  + all_data.total - all_data.bpjs_kesehatan_ttl - all_data.bpjs_jamsos_ttl;

  table_datas.value = all_data;

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
  // return rpt_salary.value.confirmed_by || rpt_salary.value.ref_id != null;
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
