<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Salary Report'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">
              <div class="w-full sm:w-4/12 md:w-3/12 lg:w-3/12 flex flex-col flex-wrap p-1">
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
                      <th >Potongan <span class="text-sm">({{pointFormat(table_datas.bonus_trip_perubahaan || 0) }} )</span></th>
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

const token = useDynamicPathCookie('token');

const field_errors = ref({})


const details = ref([]);
const table_datas = ref([]);

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
    if(idx>-1){
      props.p_data.splice(idx,1,{...rpt_salary.value});    
    }
  }

  rerenderView(details.value);
  // props.fnClose();
  // router.go(-1);
}

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

  rerenderView(data.value.data.details);
}

const rerenderView = (xdetails)=>{
  // remake details
  let all_data = {
    details : xdetails,
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
