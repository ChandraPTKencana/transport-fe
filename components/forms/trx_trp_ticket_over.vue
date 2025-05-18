<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Check Tickets'" :fn="fnClose" class="w-100 flex align-items-center"
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
  
        <div class="w-full flex justify-center items-center grow h-0 p-1">

            <div v-if="trx_trps.length == 0" class="">
            Maaf Tidak Ada Record
            </div>

            <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
            <table class="tacky">
                <thead>
                <tr class="sticky top-0 !z-[2]">
                    <th>No.</th>
                    <th>Jenis Tiket</th>
                    <th>No Ticket</th>
                    <th>Lebih</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(trx_trp, index) in trx_trps" :key="index" @click="selected = index"
                    :class="selected == index ? 'active' : ''">
                    <td>{{ index + 1 }}.</td>
                    <td>{{ trx_trp.jenis }}</td>
                    <td>{{ trx_trp.ticket_no }}</td>
                    <td>{{ trx_trp.lebih }}</td>
                </tr>
                </tbody>
            </table>
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
})
  
const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();
params.sort ="tanggal:desc";

const field_errors = ref({})

const token = useDynamicPathCookie('token');
const trx_trps = ref([]);

const selected = ref(-1);

const scrolling = ref({
  page: 1,
  is_last_record: false,
  scrollLeft: 0,
  may_get_data: true
});

const callData = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  scrolling.value.may_get_data = false;
  params.page = scrolling.value.page;
  if (params.page == 1) trx_trps.value = [];
  if(params.first_row) delete params.first_row;
  if(params.page > 1){
    params.first_row = JSON.stringify(trx_trps.value[0]);
  }

  const { data, error, status } = await useMyFetch("/trx_trps/ticket_over", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: params,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  scrolling.value.may_get_data = true;

  if (status.value === 'error') {
    useErrorStore().trigger(error, field_errors);
    return;
  }

  if (scrolling.value.page == 1) {
    trx_trps.value = data.value.data;
  } else if (scrolling.value.page > 1) {
    trx_trps.value = [...trx_trps.value, ...data.value.data];
  }
  if (data.value.data.length == 0) {
    scrolling.value.is_last_record = true;
  }

  useCommonStore()._tv.filter_box = false;
}

const searching = () => {
  selected.value = -1;
  scrolling.value.page = 1;
  scrolling.value.is_last_record = false;
  callData();
}
const loadRef = ref(null);

const loadMore = async () => {

  if (!scrolling.value.may_get_data) return;
  let parent = loadRef.value;

  if (parent.scrollLeft != scrolling.value.scrollLeft) {
  scrolling.value.scrollLeft = parent.scrollLeft;
  return;
  }

  if (scrolling.value.is_last_record) return;

  let stuck = Math.round(parent.scrollTop) + parent.clientHeight >= parent.scrollHeight - 1 ? true : false;
  if (!stuck) return;

  scrolling.value.page++;
  await callData();

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
