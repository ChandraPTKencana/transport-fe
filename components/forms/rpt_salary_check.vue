<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Check Nilai'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <div class="w-full flex grow flex-col overflow-auto h-0">
        <div class="w-full flex justify-between flex-wrap">
          <div class="grow flex">  
            
            <button type="button" name="button" class="m-1 text-2xl "
              @click="searching()">
              <IconsRefresh />
            </button>
            
          </div>
        </div>
  
        <div class="w-full flex flex-col overflow-auto grow h-0 p-1">
          <div class="w-full" v-if="rpt_total_tidak_sesuai.length > 0">
            <div>
              PV yang nilai nya tidak sama diascend
            </div>
            <table class="tacky">
                <thead>
                  <tr >
                      <th>NO.</th>
                      <th>Header</th>
                      <th>Detail</th>
                      <th>Selisih</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(rtts, index) in rpt_total_tidak_sesuai" :key="index">
                      <td>{{ rtts.no }}</td>
                      <td>{{ rtts.header }}</td>
                      <td>{{ rtts.detail }}</td>
                      <td>{{ rtts.selisih }}</td>
                  </tr>
                </tbody>
            </table>
          </div>
          <div class="w-full" v-for="(rp,idx) in rpt_pembanding">
            <div>
              {{ idx }} 
            </div>
            <div v-for="(cmpr,idxc) in rp">              
              <div v-if="idxc=='AL'">Ascend Ada / Local Tidak Ada</div>
              <div v-if="idxc=='LA'">Local Ada / Ascend Tidak Ada</div>
              <table class="tacky w-full">
                  <thead>
                    <tr >
                        <th>No</th>
                        <th>Nominal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(cr, idxcr) in cmpr" :key="idxcr">
                        <td>{{ cr.voucherno }}</td>
                        <td>{{ cr.amount }}</td>
                    </tr>
                  </tbody>
              </table>
            </div>
          </div> 
        </div>
      </div>
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
    required: true,
    default: 0,
  },
})
  
const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();
params.sort ="tanggal:desc";

const field_errors = ref({})

const token = useCookie('token');
const rpt_total_tidak_sesuai = ref([]);
const rpt_pembanding = ref([]);


const selected = ref(-1);

const callData = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  params.id = props.id;

  const { data, error, status } = await useMyFetch("/rpt_salary/check_nilai_ascend", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: params,
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error, field_errors);
    return;
  }

  rpt_total_tidak_sesuai.value = data.value.total_tidak_sesuai;
  rpt_pembanding.value = data.value.pembanding;
}

const searching = () => {
  callData();
}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
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
