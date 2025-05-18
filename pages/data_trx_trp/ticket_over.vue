<template>
    <div class="w-full h-full flex flex-col">
      <Header :title="'List Transaction'" />
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
  </template>
  
  <script setup>
  const { $moment } = useNuxtApp()
  import { storeToRefs } from 'pinia';
  
  import { useAuthStore } from '~/store/auth';
  import { useErrorStore } from '~/store/error';
  import { useCommonStore } from '~/store/common';
  import { useAlertStore } from '~/store/alert';
  
  definePageMeta({
    // layout: "clear",
    middleware: [
      function (to, from) {
        if (!useAuthStore().checkPermission('trp_trx.ticket.views')){
          useCommonStore().loading_full = false;
          return navigateTo('/');
        }
      },
      // 'auth',
    ],
  });
  
  const filter_status = ref("ticket_not_done")

  
  const params = {};
  params._TimeZoneOffset = new Date().getTimezoneOffset();
  params.sort ="tanggal:desc";
  
  const field_errors = ref({})
  
  const date = ref({
    from: "",
    to: "",
  });
  
  const token = useDynamicPathCookie('token');
  const { data: dt_async } = await useAsyncData(async () => {
    useCommonStore().loading_full = true;
    let trx_trps = [];
  
    const [data1, data2] = await Promise.all([
      useMyFetch("/trx_trps/ticket_over", {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/json'
        },
        params:{filter_status},
        retry: 0,
      }),
    ]);    
    
    if (data1.status.value === 'error') {
      useErrorStore().trigger(data1.error);
      return { trx_trps };
    }
  
    useCommonStore().loading_full = false;
    trx_trps = data1.data.value.data;
  
    return { trx_trps };
  });
  
  const trx_trps = ref(dt_async.value.trx_trps || []);


  
  const sort = ref({
    field: "tanggal",
    by: "desc"
  });
  const selected = ref(-1);

  
  const scrolling = ref({
    page: 1,
    is_last_record: false,
    scrollLeft: 0,
    may_get_data: true
  });
  
  const inject_params = () => {
    params.like = "";
    let words = JSON.parse(JSON.stringify(useCommonStore()._tv.global_keyword));
    if (words != "") {
      params.like = `id:%${words}%,xto:%${words}%,jenis:%${words}%,pv_no:%${words}%,ticket_a_no:%${words}%,ticket_b_no:%${words}%,no_pol:%${words}%,supir:%${words}%,kernet:%${words}%,cost_center_code:%${words}%,cost_center_desc:%${words}%,pvr_no:%${words}%,tanggal:%${words}%,transition_target:%${words}%`;
    }
    params.sort = "";
    if (sort.value.field) {
      params.sort = sort.value.field + ":" + sort.value.by;
    }
  
    params.date_from = date.value.from ? $moment(date.value.from).format("YYYY-MM-DD") : "";
    params.date_to = date.value.to ? $moment(date.value.to).format("YYYY-MM-DD") : "";
    
    params.filter_model = JSON.stringify(useCommonStore()._tv.filter_model);
  };
  
  
  
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
    params.filter_status = filter_status.value;
  
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
    inject_params();
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


  </script>