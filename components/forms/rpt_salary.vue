<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Salary Report'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">
            <div class="w-full flex flex-row flex-wrap">
              <button v-if="!disabled" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doGen()">
                Generate {{ rpt_salary.id=="" ? "& Save" : '' }}
              </button>
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

            

            <div v-if="source.length" class="w-full flex p-1 justify-between flex-wrap overflow-auto">
              <div class="w-full" role="sticky">
                <table class="backy w-full" style="white-space:normal;">
                  <thead >
                    <tr >
                      <td colspan="50" class="sticky -top-1 !z-[2] !bg-slate-800 text-white font-bold">
                        Detail
                      </td>
                    </tr>
                    <tr>
                      <th  class="sticky top-7 !z-[2]" rowspan="2">
                        <div>No</div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2">
                        <div>ID</div>
                      </th>
                      <th  class="sticky top-7 left-0 !z-[3]" rowspan="2" >
                        <div>Nama Pekerja</div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2" >
                        <div>Jabatan</div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2" >
                        <div>Tmpt Lahir</div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2" >
                        <div>Tgl Lahir</div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2" >
                        <div>TMK</div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2" >
                        <div>No KTP</div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2" >
                        <div>Alamat</div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2" >
                        <div>Status</div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2" >
                        <div>No Rek</div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2" >
                        <div>Nama Rek</div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2" >
                        <div>Nama Bank</div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" colspan="3"> 
                        <div>    
                          Standby 1 <span class="text-sm">({{pointFormat(all_data.standby_1_ttl) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2"> 
                        <div>    
                          Potongan 1 <span class="text-sm">({{pointFormat(all_data.perubahaan_lainnya_1_ttl) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2"> 
                        <div>    
                          Periode 1 <span class="text-sm">({{pointFormat(all_data.periode_1_ttl) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" colspan="3"> 
                        <div>    
                          Standby 2 <span class="text-sm">({{pointFormat(all_data.standby_2_ttl) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2"> 
                        <div>    
                          Potongan 2 <span class="text-sm">({{pointFormat(all_data.perubahaan_lainnya_2_ttl) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2"> 
                        <div>    
                          U.Kerajinan <span class="text-sm">({{pointFormat(all_data.perubahaan_kerajinan_ttl) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" colspan="3"> 
                        <div>    
                          Bonus Trip <span class="text-sm">({{pointFormat(all_data.bonus_trip_ttl) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2"> 
                        <div>    
                          Periode 2 <span class="text-sm">({{pointFormat(all_data.periode_2_ttl) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2"> 
                        <div>    
                          Potongan Manual <span class="text-sm">({{pointFormat(all_data.potongan_manual_ttl) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2"> 
                        <div>    
                          Periode 2 setelah potongan <span class="text-sm">({{pointFormat(all_data.periode_2_ttl_stlh_pot) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2"> 
                        <div>    
                          Periode 1+2 <span class="text-sm">({{pointFormat(all_data.periode_ttl) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" colspan="8"> 
                        <div>    
                          Trip <span class="text-sm">({{pointFormat(all_data.trip_umum_ttl) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" colspan="4"> 
                        <div>    
                          Trip Lain <span class="text-sm">({{pointFormat(all_data.trip_lain_ttl) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2] whitespace-nowrap" colspan="3">
                        <div>
                          Trip Tunggu <span class="text-sm">({{pointFormat(all_data.trip_tunggu_ttl) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2">
                        <div>
                          Potongan Trip <span class="text-sm">({{pointFormat(all_data.potongan_trip) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2">
                        <div>
                          Total 
                          <span class="text-sm">({{pointFormat(all_data.total) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2">
                        <div>
                          BPJS Kesehatan 
                          <span class="text-sm">({{pointFormat(all_data.bpjs_kesehatan_ttl) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2">
                        <div>
                          BPJS Jamsos 
                          <span class="text-sm">({{pointFormat(all_data.bpjs_jamsos_ttl) }})</span>
                        </div>
                      </th>
                      <th  class="sticky top-7 !z-[2]" rowspan="2">
                        <div>
                          Grand Total 
                          <span class="text-sm">({{pointFormat(all_data.total_grand) }})</span>
                        </div>
                      </th>
                    </tr>
                    <tr >
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Gaji <span class="text-sm">({{pointFormat(all_data.standby_1_gaji) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Makan <span class="text-sm">({{pointFormat(all_data.standby_1_makan) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Dinas <span class="text-sm">({{pointFormat(all_data.standby_1_dinas) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Gaji <span class="text-sm">({{pointFormat(all_data.standby_2_gaji) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Makan <span class="text-sm">({{pointFormat(all_data.standby_2_makan) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Dinas <span class="text-sm">({{pointFormat(all_data.standby_2_dinas) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Gaji <span class="text-sm">({{pointFormat(all_data.bonus_trip_gaji) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Dinas <span class="text-sm">({{pointFormat(all_data.bonus_trip_dinas) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Potongan <span class="text-sm">({{pointFormat(all_data.bonus_trip_perubahaan || 0) }} )</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Jmlh <span class="text-sm">({{pointFormat(all_data.trip_jumlah) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Gaji <span class="text-sm">({{pointFormat(all_data.trip_umum_gaji) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Gaji Manual <span class="text-sm">({{pointFormat(all_data.trip_umum_gaji_manual) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Makan <span class="text-sm">({{pointFormat(all_data.trip_umum_makan) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Makan Manual <span class="text-sm">({{pointFormat(all_data.trip_umum_makan_manual) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Dinas <span class="text-sm">({{pointFormat(all_data.trip_umum_dinas) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Dinas Manual <span class="text-sm">({{pointFormat(all_data.trip_umum_dinas_manual) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Manual Reason <span class="text-sm"></span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Jmlh <span class="text-sm">({{pointFormat(all_data.trip_lain_jlh) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Gaji <span class="text-sm">({{pointFormat(all_data.trip_lain_gaji) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Makan <span class="text-sm">({{pointFormat(all_data.trip_lain_makan) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Dinas <span class="text-sm">({{pointFormat(all_data.trip_lain_dinas) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Jmlh <span class="text-sm">({{pointFormat(all_data.trip_tunggu_jlh) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Gaji <span class="text-sm">({{pointFormat(all_data.trip_tunggu_gaji) }})</span>
                        </div>
                      </th>
                      <th class="sticky top-[60px] !z-[2]" >
                        <div>
                          Dinas <span class="text-sm">({{pointFormat(all_data.trip_tunggu_dinas) }})</span>
                        </div>
                      </th>
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
                        <!-- <td>{{ pointFormat(detail.periode_2_ttl_stlh_pot) }}</td> -->
                        <td>{{ pointFormat(detail.payment_total) }}</td>
                        <td>{{ pointFormat(detail.periode_ttl) }}</td>
                        <td>{{ pointFormat(detail.trip_jumlah) }}</td>
                        <td>{{ pointFormat(detail.uj_gaji) }}</td>
                        <td class="!bg-gray-400 font-bold">
                          <InputPointFormat
                          :key="index"
                          class="min-w-[110px] h-full p-1" :class="parseFloat(detail.uj_gaji)!=parseFloat(detail.uj_gaji_manual) ? 'text-orange-500':''"
                          type="text" 
                          :value="detail.uj_gaji_manual || 0" 
                          @input="detail.uj_gaji_manual = $event"/>
                        </td>
                        <td>{{ pointFormat(detail.uj_makan) }}</td>
                        <td class="!bg-gray-400 font-bold">
                          <InputPointFormat
                          :key="index"
                          class="min-w-[110px] h-full p-1"  :class="parseFloat(detail.uj_makan)!=parseFloat(detail.uj_makan_manual) ? 'text-orange-500':''"
                          type="text" 
                          :value="detail.uj_makan_manual || 0" 
                          @input="detail.uj_makan_manual = $event"/>
                        </td>
                        <td>{{ pointFormat(detail.uj_dinas) }}</td>
                        <td class="!bg-gray-400 font-bold">
                          <InputPointFormat
                          :key="index"
                          class="min-w-[110px] h-full p-1 " :class="parseFloat(detail.uj_dinas)!=parseFloat(detail.uj_dinas_manual) ? 'text-orange-500':''"
                          type="text" 
                          :value="detail.uj_dinas_manual || 0" 
                          @input="detail.uj_dinas_manual = $event"/>
                        </td>
                        <td class="!bg-gray-400 font-bold">
                          <textarea :key="index" 
                          v-model="detail.uj_manual_reason" class="min-w-[200px] h-full"></textarea>
                        </td>
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
            <button v-if="!disabled" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doGen()">
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

const doGen = async () => {
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

  // props.fnClose();
  // router.go(-1);
}

const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();

  let $method = "post";

  let id = rpt_salary.value.id;
  if (id == "") {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/rpt_salary/save_manual", {
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


const all_data=computed(()=>{
  let xdetails = details.value;
  let resdata = {
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
    trip_umum_gaji_manual : 0,
    trip_umum_makan : 0,
    trip_umum_makan_manual : 0,
    trip_umum_dinas : 0,
    trip_umum_dinas_manual : 0,
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
  }

  resdata.details.forEach(x=>{
    x.periode_1_ttl=parseFloat(x.sb_gaji)+parseFloat(x.sb_makan)+parseFloat(x.sb_dinas)+parseFloat(x.salary_bonus_nominal);

    x.trip_jumlah = x.trip_cpo + x.trip_pk + x.trip_cangkang + x.trip_tbs + x.trip_tbsk;
    x.bonus_trip_gaji = parseFloat(x.trip_cpo_bonus_gaji) + parseFloat(x.trip_pk_bonus_gaji) + parseFloat(x.trip_cangkang_bonus_gaji) + parseFloat(x.trip_tbs_bonus_gaji) + parseFloat(x.trip_tbsk_bonus_gaji);
    x.bonus_trip_dinas = parseFloat(x.trip_cpo_bonus_dinas) + parseFloat(x.trip_pk_bonus_dinas) + parseFloat(x.trip_cangkang_bonus_dinas) + parseFloat(x.trip_tbs_bonus_dinas) + parseFloat(x.trip_tbsk_bonus_dinas);

    x.periode_2_ttl=parseFloat(x.sb_gaji_2)+parseFloat(x.sb_makan_2)+parseFloat(x.sb_dinas_2)+parseFloat(x.salary_bonus_nominal_2)+parseFloat(x.kerajinan)
    +parseFloat(x.bonus_trip_gaji)+parseFloat(x.bonus_trip_dinas) + parseFloat(x.salary_bonus_bonus_trip);
    
    x.periode_2_ttl_stlh_pot=x.periode_2_ttl-parseFloat(x.potongan_manual); 

    x.periode_ttl = x.periode_1_ttl +  x.periode_2_ttl_stlh_pot;
    
    x.total = parseFloat(x.uj_gaji_manual) + parseFloat(x.uj_makan_manual)+ parseFloat(x.uj_dinas_manual)
    + parseFloat(x.trip_lain_gaji)+ parseFloat(x.trip_lain_makan)+ parseFloat(x.trip_lain_dinas)
    + parseFloat(x.trip_tunggu_gaji) + parseFloat(x.trip_tunggu_dinas) - parseFloat(x.nominal_cut);

    x.total_grand = x.periode_ttl + x.total - parseFloat(x.employee_bpjs_kesehatan) - parseFloat(x.employee_bpjs_jamsos);

    resdata.standby_1_gaji += parseFloat(x.sb_gaji);
    resdata.standby_1_makan += parseFloat(x.sb_makan);
    resdata.standby_1_dinas += parseFloat(x.sb_dinas);

    resdata.perubahaan_lainnya_1_ttl += parseFloat(x.salary_bonus_nominal);

    resdata.standby_2_gaji += parseFloat(x.sb_gaji_2);
    resdata.standby_2_makan += parseFloat(x.sb_makan_2);
    resdata.standby_2_dinas += parseFloat(x.sb_dinas_2);
    resdata.perubahaan_lainnya_2_ttl += parseFloat(x.salary_bonus_nominal_2);
    resdata.perubahaan_kerajinan_ttl += parseFloat(x.kerajinan);
    
    resdata.potongan_manual_ttl += parseFloat(x.potongan_manual);

    resdata.trip_umum_gaji += parseFloat(x.uj_gaji);
    resdata.trip_umum_gaji_manual += parseFloat(x.uj_gaji_manual);
    resdata.trip_umum_makan += parseFloat(x.uj_makan);
    resdata.trip_umum_makan_manual += parseFloat(x.uj_makan_manual);
    resdata.trip_umum_dinas += parseFloat(x.uj_dinas);
    resdata.trip_umum_dinas_manual += parseFloat(x.uj_dinas_manual);

    resdata.trip_lain_jlh += x.trip_lain;
    resdata.trip_lain_gaji += parseFloat(x.trip_lain_gaji);
    resdata.trip_lain_makan += parseFloat(x.trip_lain_makan);
    resdata.trip_lain_dinas += parseFloat(x.trip_lain_dinas);

    resdata.trip_tunggu_jlh += x.trip_tunggu;
    resdata.trip_tunggu_gaji += parseFloat(x.trip_tunggu_gaji);
    resdata.trip_tunggu_dinas += parseFloat(x.trip_tunggu_dinas);

    resdata.trip_jumlah += x.trip_jumlah;
    resdata.bonus_trip_gaji += x.bonus_trip_gaji;
    resdata.bonus_trip_dinas += x.bonus_trip_dinas;
    resdata.bonus_trip_perubahaan += parseFloat(x.salary_bonus_bonus_trip);

    resdata.potongan_trip += parseFloat(x.nominal_cut);

    resdata.bpjs_kesehatan_ttl += parseFloat(x.employee_bpjs_kesehatan);
    resdata.bpjs_jamsos_ttl += parseFloat(x.employee_bpjs_jamsos);
  })
  resdata.standby_1_ttl = resdata.standby_1_gaji + resdata.standby_1_makan + resdata.standby_1_dinas; 
  resdata.periode_1_ttl = resdata.standby_1_ttl + resdata.perubahaan_lainnya_1_ttl; 
  
  resdata.standby_2_ttl = resdata.standby_2_gaji + resdata.standby_2_makan + resdata.standby_2_dinas; 

  resdata.bonus_trip_ttl = resdata.bonus_trip_gaji + resdata.bonus_trip_dinas + resdata.bonus_trip_perubahaan; 
  resdata.periode_2_ttl = resdata.standby_2_ttl + resdata.perubahaan_lainnya_2_ttl + resdata.perubahaan_kerajinan_ttl + resdata.bonus_trip_ttl;  
  resdata.periode_2_ttl_stlh_pot = resdata.periode_2_ttl - resdata.potongan_manual_ttl;  
  
  resdata.periode_ttl = resdata.periode_1_ttl + resdata.periode_2_ttl_stlh_pot; 

  resdata.trip_umum_ttl = resdata.trip_umum_gaji_manual + resdata.trip_umum_makan_manual + resdata.trip_umum_dinas_manual; 
  resdata.trip_lain_ttl = resdata.trip_lain_gaji + resdata.trip_lain_makan + resdata.trip_lain_dinas; 
  resdata.trip_tunggu_ttl = resdata.trip_tunggu_gaji + resdata.trip_tunggu_dinas; 
  resdata.total = resdata.trip_umum_ttl+ resdata.trip_lain_ttl+ resdata.trip_tunggu_ttl - resdata.potongan_trip;

  resdata.total_grand = resdata.periode_ttl  + resdata.total - resdata.bpjs_kesehatan_ttl - resdata.bpjs_jamsos_ttl;


  return resdata;
})
</script>

<style scoped>
  /* tbody tr td{
    background-color: rgb(100, 100, 100);
  } */
</style>
