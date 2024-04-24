<template>
  <div class="w-full h-full flex flex-col">
    <Header :title="'List Transaction'" />
    <div class="w-full flex grow flex-col overflow-auto h-0">
      <div class="w-full flex justify-between">
        <div class="grow flex">
          <button type="button" name="button" class="m-1 text-2xl "
          @click="form_add()">
          <IconsPlus />
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
          @click="form_edit()">
          <IconsEdit/>
        </button>
        <button  v-if="!checkRole(['PabrikTransport'])" type="button" name="button" class="m-1 text-2xl "
          @click="remove()">
          <IconsDelete />
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
          @click="validasi()">
          <IconsSignature />
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
          @click="printPreview()">
          <IconsPrinterEye />
        </button>
        <button type="button" name="button" class="m-1 text-2xl "
          @click="cogs_show=true">
          <IconsCog />
        </button>
        </div>
        <div class="flex">
          <button type="button" name="button" class="m-1 text-sm whitespace-nowrap"
            @click="generatePVR()">
            Gen/Update PVR
          </button>
          <button type="button" name="button" class="m-1 text-sm whitespace-nowrap"
            @click="updatePV()">
            Update PV
          </button>
          <div class="m-1 card-border cursor-pointer" @click="online_status = !online_status">
            <span class="text-xs">Mode</span> : <span class="font-bold" :class="online_status?'text-green-600' : 'text-red-600'">{{ online_status ? "ONLINE" : "OFFLINE" }} </span>
          </div>
        </div>
      </div>

      <form action="#" class="w-full flex p-1">
        <div class="grow">
          <div class="font-bold"> Keyword </div>
          <input class="" type="text" v-model="search" name="search"
            placeholder="Keyword">
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort By </div>
          <select class="" v-model="sort.field">
            <option value=""></option>
            <option value="id">ID</option>
            <option value="xto">To</option>
            <option value="jenis">Jenis</option>
            <option value="tipe">Tipe</option>
          </select>
        </div>
        <div class="pl-1">
          <div class="font-bold"> Sort Order </div>
          <select class="" v-model="sort.by">
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <div class="flex items-end pl-1">
          <button class="" type="submit" name="button" @click.prevent="searching()">
            <IconsSearch class="text-2xl" />
          </button>
        </div>
      </form>
      <div class="w-full flex justify-center items-center grow h-0 p-1">

        <div v-if="trx_trps.length == 0" class="">
          Maaf Tidak Ada Record
        </div>

        <div v-else class="w-full h-full overflow-auto" role="sticky" ref="loadRef" @scroll="loadMore">
          <table class="tacky">
            <thead>
              <tr class="sticky top-0 !z-[2]">
                <!-- <th>No.</th> -->
                <!-- <th>Updated At</th> -->
                <th v-if="checkCheckedField('Status')">Status</th>
                <th v-if="checkCheckedField('App 1')">App 1</th>
                <th v-if="checkCheckedField('App 2')">App 2</th>
                <th v-if="checkCheckedField('ID')">ID</th>
                <th v-if="checkCheckedField('U.Jalan Per')">U.Jalan Per</th>
                <th v-if="checkCheckedField('No Pol')">No Pol</th>
                <th v-if="checkCheckedField('Tujuan')">Tujuan</th>
                <th v-if="checkCheckedField('Tipe')">Tipe</th>
                <th v-if="checkCheckedField('Jenis')">Jenis</th>
                <th v-if="checkCheckedField('Amount')">Amount</th>
                <th v-if="checkCheckedField('Cost Center Code')">Cost Center Code</th>
                <th v-if="checkCheckedField('Cost Center Desc')">Cost Center Desc</th>
                <th v-if="checkCheckedField('PVR No')">PVR No</th>
                <th v-if="checkCheckedField('PVR Total')">PVR Total</th>
                <th v-if="checkCheckedField('PVR Completed')">PVR Completed</th>
                <th v-if="checkCheckedField('PV No')">PV No</th>
                <th v-if="checkCheckedField('PV Total')">PV Total</th>

                <th v-if="checkCheckedField('Ticket A No')">Ticket A No</th>
                <th v-if="checkCheckedField('Ticket A Bruto')">Ticket A Bruto</th>
                <th v-if="checkCheckedField('Ticket A Tara')">Ticket A Tara</th>
                <th v-if="checkCheckedField('Ticket A Netto')">Ticket A Netto</th>
                <th v-if="checkCheckedField('Ticket A Supir')">Ticket A Supir</th>
                <th v-if="checkCheckedField('Ticket A No Pol')">Ticket A No Pol</th>
                <th v-if="checkCheckedField('Ticket A In At')">Ticket A In At</th>
                <th v-if="checkCheckedField('Ticket A Out At')">Ticket A Out At</th>

                <th v-if="checkCheckedField('Ticket B No')">Ticket B No</th>
                <th v-if="checkCheckedField('Ticket B Bruto')">Ticket B Bruto</th>
                <th v-if="checkCheckedField('Ticket B Tara')">Ticket B Tara</th>
                <th v-if="checkCheckedField('Ticket B Netto')">Ticket B Netto</th>
                <th v-if="checkCheckedField('Ticket B Supir')">Ticket B Supir</th>
                <th v-if="checkCheckedField('Ticket B No Pol')">Ticket B No Pol</th>
                <th v-if="checkCheckedField('Ticket B In At')">Ticket B In At</th>
                <th v-if="checkCheckedField('Ticket B Out At')">Ticket B Out At</th>

                <th v-if="checkCheckedField('Supir')">Supir</th>
                <th v-if="checkCheckedField('Kernet')">Kernet</th>
                <!-- <th v-if="checkCheckedField('App 1')">Created User</th> -->
                <th v-if="checkCheckedField('Created At')">Created At</th>
                <th v-if="checkCheckedField('Updated At')">Updated At</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(trx_trp, index) in trx_trps" :key="index" @click="selected = index"
                :class="selected == index ? 'active' : ''">
                <td v-if="checkCheckedField('Status')">
                  <div class="flex items-center justify-center">
                    <div class="text-white text-xs px-2 py-1 rounded-lg" :class="checkStatus(trx_trp) ? 'bg-green-600' : 'bg-red-600' ">
                      {{checkStatus(trx_trp) ? "Done" : "Not Done" }}
                    </div>
                  </div>
                </td>
                <td v-if="checkCheckedField('App 1')">
                  <div class="flex items-center justify-center">
                    <IconsLine v-if="!trx_trp.val"/>
                    <IconsCheck v-else/>
                  </div>
                </td>
                <td v-if="checkCheckedField('App 2')">
                  <div class="flex items-center justify-center">
                    <IconsLine v-if="!trx_trp.val1"/>
                    <IconsCheck v-else/>
                  </div>
                </td>
                <td v-if="checkCheckedField('ID')" class="bold">{{ trx_trp.id }}</td>
                <td v-if="checkCheckedField('U.Jalan Per')">{{ trx_trp.tanggal ? $moment(trx_trp.tanggal).format("DD-MM-Y") : "" }}</td>
                <td v-if="checkCheckedField('No Pol')">{{ trx_trp.no_pol }}</td>
                <td v-if="checkCheckedField('Tujuan')">{{ trx_trp.xto }}</td>
                <td v-if="checkCheckedField('Tipe')">{{ trx_trp.tipe }}</td>
                <td v-if="checkCheckedField('Jenis')">{{ trx_trp.jenis }}</td>
                <td v-if="checkCheckedField('Amount')">{{ pointFormat(trx_trp.amount) }}</td>
                <td v-if="checkCheckedField('Cost Center Code')">{{ trx_trp.cost_center_code }}</td>
                <td v-if="checkCheckedField('Cost Center Desc')">{{ trx_trp.cost_center_desc }}</td>
                <td v-if="checkCheckedField('PVR No')">{{ trx_trp.pvr_no }}</td>
                <td v-if="checkCheckedField('PVR Total')">{{ trx_trp.pv_amount }}</td>
                <td v-if="checkCheckedField('PVR Completed')"><IconsLine v-if="!trx_trp.pvr_had_detail"/><IconsCheck v-else/></td>
                <td v-if="checkCheckedField('PV No')">{{ trx_trp.pv_no }}</td>
                <td v-if="checkCheckedField('PV Total')">{{ pointFormat(trx_trp.pv_total) }}</td>

                <td v-if="checkCheckedField('Ticket A No')">{{ trx_trp.ticket_a_no }}</td>
                <td v-if="checkCheckedField('Ticket A Bruto')">{{ pointFormat(trx_trp.ticket_a_bruto) }}</td>
                <td v-if="checkCheckedField('Ticket A Tara')">{{ pointFormat(trx_trp.ticket_a_tara) }}</td>
                <td v-if="checkCheckedField('Ticket A Netto')">{{ pointFormat(trx_trp.ticket_a_netto) }}</td>
                <td v-if="checkCheckedField('Ticket A Supir')">{{ trx_trp.ticket_a_supir }}</td>
                <td v-if="checkCheckedField('Ticket A No Pol')">{{ trx_trp.ticket_a_no_pol }}</td>
                <td v-if="checkCheckedField('Ticket A In At')">{{ trx_trp.ticket_a_in_at ? $moment(trx_trp.ticket_a_in_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
                <td v-if="checkCheckedField('Ticket A Out At')">{{ trx_trp.ticket_a_out_at ? $moment(trx_trp.ticket_a_out_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>

                <td v-if="checkCheckedField('Ticket B No')">{{ trx_trp.ticket_b_no }}</td>
                <td v-if="checkCheckedField('Ticket B Bruto')">{{ pointFormat(trx_trp.ticket_b_bruto) }}</td>
                <td v-if="checkCheckedField('Ticket B Tara')">{{ pointFormat(trx_trp.ticket_b_tara) }}</td>
                <td v-if="checkCheckedField('Ticket B Netto')">{{ pointFormat(trx_trp.ticket_b_netto) }}</td>
                <td v-if="checkCheckedField('Ticket B Supir')">{{ trx_trp.ticket_b_supir }}</td>
                <td v-if="checkCheckedField('Ticket B No Pol')">{{ trx_trp.ticket_b_no_pol }}</td>
                <td v-if="checkCheckedField('Ticket B In At')">{{ trx_trp.ticket_b_in_at ? $moment(trx_trp.ticket_b_in_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
                <td v-if="checkCheckedField('Ticket B Out At')">{{ trx_trp.ticket_b_out_at ? $moment(trx_trp.ticket_b_out_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>

                <td v-if="checkCheckedField('Supir')">{{ trx_trp.supir }}</td>
                <td v-if="checkCheckedField('Kernet')">{{ trx_trp.kernet }}</td>
                <td v-if="checkCheckedField('Created At')">{{ trx_trp.created_at ? $moment(trx_trp.created_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
                <td v-if="checkCheckedField('Updated At')">{{ trx_trp.updated_at ? $moment(trx_trp.updated_at).format("DD-MM-Y HH:mm:ss") : "" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <PopupMini :type="'delete'" :show="delete_box" :data="delete_data" :fnClose="toggleDeleteBox" :fnConfirm="confirmed_delete" />
    <!-- <trx_trpsRequested :show="popup_request" :fnClose="()=>{ popup_request = false; }" @update_request_notif="request_notif = $event"/> -->
    <FormsTrxTrp :show="forms_trx_trp_show" :fnClose="()=>{forms_trx_trp_show=false}" :fnLoadDBData="fnLoadDBData" :id="forms_trx_trp_id" :p_data="trx_trps" :list_ujalan="list_ujalan" :list_ticket="list_ticket" :list_pv="list_pv" :list_cost_center="list_cost_center" :online_status="online_status"/>
    <FormsTrxTrpValidasi :show="forms_trx_trp_valid_show" :fnClose="()=>{forms_trx_trp_valid_show=false}" :id="forms_trx_trp_valid_id" :p_data="trx_trps"/>
  
    <div v-if="prtView" class="w-full h-full flex items-center justify-center fixed top-0 left-0 z-20 p-3"
    style="background-color: rgba(255,255,255,0.9);">
      <div class="relative" style="width:95%; height: 90%;">
        <div class="absolute -top-7 right-0 bg-white"
          style="position: absolute; padding:5px 10px; border: solid 1px #ccc; border-bottom: none; border-top-right-radius: 5px;  border-top-left-radius: 5px;">
          <IconsTimes  style="color:black; cursor:pointer;" @click="printPreview()"/>
        </div>
        <iframe ref="iframe" width='100%' height='100%' :src='pdfContent.dataBase64'></iframe>
        <div
          style="position: absolute; top: 12px; right: 98px; background-color: rgba(255,255,255,0); width: 37px; height: 36px; z-index:1; cursor: pointer;"
          @click="download()">
        </div>
      </div>
    </div>


    <div v-if="cogs_show" class="w-full h-full flex items-center justify-center fixed top-0 left-0 z-20 p-3"
    style="background-color: rgba(255,255,255,0.9);">
      <div class="relative" style="width:95%; height: 90%;">
        <div class="absolute -top-7 right-0 bg-white"
          style="position: absolute; padding:5px 10px; border: solid 1px #ccc; border-bottom: none; border-top-right-radius: 5px;  border-top-left-radius: 5px;">
          <IconsTimes  style="color:black; cursor:pointer;" @click="cogs_show=false"/>
        </div>
        <div class="w-full h-full flex flex-col items-center justify-content-center bg-white">
          <div class="w-full p-1">
            <div class="w-full p-1 bg-gray-200">
              <div class="w-full text-blue-600 font-bold">
                Set Date For Load Data
              </div>
              <div class="w-full grid grid-cols-2 grid-rows-1 gap-1">
                
                <div class="flex flex-col flex-wrap p-1">
                  <label for="">From</label>
                  <div class="grow" >
                    <ClientOnly>
                      <vue-date-picker  v-model="loadDBData.from" 
                      type="datetime" 
                      format="dd-MM-yyyy"
                      :enable-time-picker = "false"
                      :clearable="false" 
                      text-input
                      teleport-center @closed="handleDate('from')"></vue-date-picker>
                    </ClientOnly>
                  </div>
                </div>
                
                <div class="flex flex-col flex-wrap p-1">
                  <label for="">To</label>
                    <div class="grow" >
                    <ClientOnly>
                      <vue-date-picker  v-model="loadDBData.to" 
                      type="datetime" 
                      format="dd-MM-yyyy"
                      :enable-time-picker = "false"
                      :clearable="false" 
                      text-input
                      teleport-center @closed="handleDate('to')"></vue-date-picker>
                    </ClientOnly>
                  </div>
                </div>
              </div>

            </div>

          </div>
          <div class="w-full p-1">
            <div class="w-full p-1 bg-gray-200">
              <div class="w-full text-blue-600 font-bold grid-">
                Set Show Column Field           
              </div>            
              <div class="w-full flex flex-wrap">
                <div v-for="(fd,k) in fields_data" class="p-2 m-1 font-bold cursor-pointer" :class="fd.checked ? 'bg-green-600 text-white' : 'bg-gray-400 text-black'" @click="fd.checked=!fd.checked">
                  {{ fd.name }}
                </div>
              </div>
              <div class="w-full flex justify-end">
                <button class="bg-white font-bold mr-2"  @click="toggleAllFields('select')">
                  Select All
                </button>
                <button class="bg-white font-bold" @click="toggleAllFields('invert')">
                  Invert All
                </button>
              </div>
            </div>
          </div>

        </div>
        <div
          style="position: absolute; top: 12px; right: 98px; background-color: rgba(255,255,255,0); width: 37px; height: 36px; z-index:1; cursor: pointer;"
          @click="cogs_show=false">
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

const { pointFormat } = useUtils();

definePageMeta({
  // layout: "clear",
  middleware: [
    function (to, from) {
      // if (!useAuthStore().checkScopes(['ap-trx_trp-view']))
      //   return navigateTo('/');
      if (!useAuthStore().checkRole(["SuperAdmin","Logistic",'PabrikTransport']))
      return navigateTo('/');

    },
    // 'auth',
  ],
});

const params = {};
params._TimeZoneOffset = new Date().getTimezoneOffset();
params.sort ="tanggal:desc";


const token = useCookie('token');
const role = useCookie('role'); // useCookie new hook in nuxt 3
const checkRole=(list)=>{
  return (list).includes(role.value);
};
const { data: dt_async } = await useAsyncData(async () => {
  useCommonStore().loading_full = true;
  let trx_trps = [];
  // let list_ujalan = [];
  // let list_ticket = [];
  // let list_pv = [];

  const [data1, data2] = await Promise.all([
    useMyFetch("/trx_trps", {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Accept': 'application/json'
      },
      retry: 0,
    }),
    // useMyFetch("/trx_load_for_trp", {
    //   method: 'get',
    //   headers: {
    //     'Authorization': `Bearer ${token.value}`,
    //     'Accept': 'application/json'
    //   },
    //   retry: 0,
    // }),
  ]);

  

  if (data1.status.value !== 'error') {
    trx_trps = data1.data.value.data;
  }

  if (data1.status.value === 'error') {
    useErrorStore().trigger(data1.error);
    // return { trx_trps, list_ujalan, list_ticket, list_pv };
    return { trx_trps };
  }

  // if (data2.status.value !== 'error') {
  //   list_ujalan = data2.data.value.list_ujalan;
  //   list_ticket = data2.data.value.list_ticket;
  //   list_pv = data2.data.value.list_pv;
  // }
  useCommonStore().loading_full = false;

  // return { trx_trps, list_ujalan, list_ticket, list_pv };
  return { trx_trps };
});

const trx_trps = ref(dt_async.value.trx_trps || []);
// const list_ujalan = ref(dt_async.value.list_ujalan);
// const list_ticket = ref(dt_async.value.list_ticket);
// const list_pv = ref(dt_async.value.list_pv);
const list_ujalan = ref([]);
const list_cost_center = ref([]);
const list_ticket = ref([]);
const list_pv = ref([]);
const online_status=ref(false);
const fnLoadDBData = async (jenis) => {
  useCommonStore().loading_full = true;
  let from = loadDBData.value.from ? $moment(loadDBData.value.from).format("Y-MM-DD") : "";
  let to = loadDBData.value.to ? $moment(loadDBData.value.to).format("Y-MM-DD") : "";
  const { data, error, status } = await useMyFetch("/trx_load_for_trp", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {jenis,"online_status":online_status.value,from,to},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  list_ujalan.value = data.value.list_ujalan;
  list_cost_center.value = data.value.list_cost_center;
  list_ticket.value = data.value.list_ticket;
  list_pv.value = data.value.list_pv;
}

const search = ref("");
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
  if (search.value != "") {
    params.like = `id:%${search.value}%,xto:%${search.value}%,jenis:%${search.value}%,pv_no:%${search.value}%,ticket_a_no:%${search.value}%,ticket_b_no:%${search.value}%,no_pol:%${search.value}%,supir:%${search.value}%,kernet:%${search.value}%,cost_center_code:%${search.value}%,cost_center_desc:%${search.value}%,pvr_id:%${search.value}%,pvr_no:%${search.value}%,tanggal:%${search.value}%`;
  }
  params.sort = "";
  if (sort.value.field) {
    params.sort = sort.value.field + ":" + sort.value.by;
  }
};

const loadRef = ref(null);

const callData = async () => {
  useCommonStore().loading_full = true;
  scrolling.value.may_get_data = false;
  params.page = scrolling.value.page;
  if (params.page == 1) trx_trps.value = [];
  if(params.first_row) delete params.first_row;
  if(params.page > 1){
    params.first_row = JSON.stringify(trx_trps.value[0]);
  }
  const { data, error, status } = await useMyFetch("/trx_trps", {
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
    useErrorStore().trigger(error);
    return;
  }

  if (scrolling.value.page == 1) {
    trx_trps.value = data.value.data;
    if (loadRef.value) loadRef.value.scrollTop = 0;
  } else if (scrolling.value.page > 1) {
    trx_trps.value = [...trx_trps.value, ...data.value.data];
  }
  if (data.value.data.length == 0) {
    scrolling.value.is_last_record = true;
  }
}

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

const searching = () => {
  scrolling.value.page = 1;
  scrolling.value.is_last_record = false;
  inject_params();
  callData();
}

const router = useRouter();

const forms_trx_trp_show =  ref(false);
const forms_trx_trp_id = ref(0);
const form_add = () => {
  forms_trx_trp_id.value = 0;
  forms_trx_trp_show.value = true;
  // router.push({ name: 'data_trx_trp-form', query: { id: "" } });
}

const { display } = useAlertStore();
const { show, status, message } = storeToRefs(useAlertStore());

const form_edit = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_show.value = true;
    // router.push({ name: 'data_trx_trp-form', query: { id: trx_trps.value[selected.value].id } });
  }
};

const forms_trx_trp_valid_show =  ref(false);
const forms_trx_trp_valid_id = ref(0);
const validasi = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    forms_trx_trp_valid_id.value = trx_trps.value[selected.value].id;
    forms_trx_trp_valid_show.value = true;
  }
};

const delete_data = ref({});
const delete_box = ref(false);

const toggleDeleteBox = async()=>{  
  if (delete_box.value) {
    delete_box.value = false;
  }
};

const remove = () => {
  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
  } else {
    delete_data.value = {id : trx_trps.value[selected.value].id};
    delete_box.value = true;
  }
};

const confirmed_delete = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", trx_trps.value[selected.value].id);  
  data_in.append("_method", "DELETE");

  const { data, error, status } = await useMyFetch("/trx_trp", {
    method: "post",
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
    },
    body: data_in,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  trx_trps.value.splice(selected.value,1);
  selected.value = -1;
  delete_box.value = false;
}

const { downloadFile, printHtml } = useDownload();

const prtView = ref(false);
const pdfContent = ref("");

const printPreview = async()=>{
  
  if (prtView.value==true) {
    prtView.value = false;
    return;
  }

  if (selected.value == -1) {
    display({ show: true, status: "Failed", message: "Silahkan Pilih Data Terlebih Dahulu" });
    return;
  } 
  
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/trx_trp_preview_file", {
    method: 'get',
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json'
    },
    params: {id : trx_trps.value[selected.value].id},
    retry: 0,
  });
  useCommonStore().loading_full = false;

  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  // pdfContent.value = data.value;
  // prtView.value = true;

  printHtml(data.value.html,318);
}

const download = ()=>{
  downloadFile(pdfContent.value);
}


const checkStatus=(data)=>{
  if(
    data.pv_id<=0 ||
    (["CPO","PK"].indexOf(data.jenis)>-1 && (data.ticket_a_id<=0 || data.ticket_b_bruto<=0 || data.ticket_b_tara<=0 || data.ticket_b_netto <=0 || data.ticket_b_in_at==""|| data.ticket_b_out_at=="")) ||
    (data.jenis=="TBS" && (data.ticket_a_id<=0 || data.ticket_b_id<=0)) ||
    (data.jenis=="TBSK" && data.ticket_b_id<=0)
  ) return 0;
  return 1;
}

const cogs_show=ref(false);

const loadDBData = ref({
  from: new Date().setDate(new Date().getDate() - 3),
  to:new Date(),
})

const handleDate = (source)=>{
  if(source=='from'){
    if(loadDBData.value.from-loadDBData.value.to>0){
      loadDBData.value.from = loadDBData.value.to;
    }
  }else{
    if(loadDBData.value.to-loadDBData.value.from<0){
      loadDBData.value.to = loadDBData.value.from;
    }
  }
}

const toggleAllFields=(v)=>{
  if(v=="select"){
    fields_data.value = fields_data.value.map((x)=>{
      x.checked = 1;
      return x;
    })
  }else{
    fields_data.value = fields_data.value.map((x)=>{
      x.checked = 0;
      return x;
    })
  }
}

const fields_data=ref([
  {checked:1,name:"Status"},
  {checked:1,name:"App 1"},
  {checked:1,name:"App 2"},
  {checked:1,name:"ID"},
  {checked:1,name:"U.Jalan Per"},
  {checked:1,name:"No Pol"},
  {checked:1,name:"Tujuan"},
  {checked:1,name:"Tipe"},
  {checked:1,name:"Jenis"},
  {checked:1,name:"Amount"},
  {checked:1,name:"Cost Center Code"},
  {checked:1,name:"Cost Center Desc"},
  {checked:1,name:"PVR No"},
  {checked:1,name:"PVR Total"},
  {checked:1,name:"PVR Completed"},
  {checked:1,name:"PV No"},
  {checked:1,name:"PV Total"},
  {checked:1,name:"Ticket A No"},
  {checked:1,name:"Ticket A Bruto"},
  {checked:1,name:"Ticket A Tara"},
  {checked:1,name:"Ticket A Netto"},
  {checked:1,name:"Ticket A Supir"},
  {checked:1,name:"Ticket A No Pol"},
  {checked:1,name:"Ticket A In At"},
  {checked:1,name:"Ticket A Out At"},
  {checked:1,name:"Ticket B No"},
  {checked:1,name:"Ticket B Bruto"},
  {checked:1,name:"Ticket B Tara"},
  {checked:1,name:"Ticket B Netto"},
  {checked:1,name:"Ticket B Supir"},
  {checked:1,name:"Ticket B No Pol"},
  {checked:1,name:"Ticket B In At"},
  {checked:1,name:"Ticket B Out At"},
  {checked:1,name:"Supir"},
  {checked:1,name:"Kernet"},
  {checked:1,name:"Created At"},
  {checked:1,name:"Updated At"},
]);

const checkCheckedField=(name)=>{
  let index  = fields_data.value.map((x)=>x.name).indexOf(name);
  return fields_data.value[index].checked;  
}


const generatePVR = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("id", trx_trps.value[selected.value].id);  
  data_in.append("online_status", online_status.value);  

  const { data, error, status } = await useMyFetch("/trx_trp_do_gen_pvr", {
    method: "post",
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
    },
    body: data_in,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }
  let dt = trx_trps.value[selected.value];
  dt.pvr_id = data.value.pvr_id;
  dt.pvr_no = data.value.pvr_no;
  dt.pvr_total = data.value.pvr_total;
  dt.pvr_had_detail = data.value.pvr_had_detail;
  dt.updated_at = data.value.updated_at;

  trx_trps.value.splice(selected.value,1,{...dt});
  selected.value = -1;

  display({ show: true, status: "Success", message: "Generate Or Update PVR Done" });
}

const updatePV = async() => {
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  data_in.append("online_status", online_status.value);  

  const { data, error, status } = await useMyFetch("/trx_trp_do_update_pv", {
    method: "post",
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'application/json',
    },
    body: data_in,
    retry: 0,
  });
  useCommonStore().loading_full = false;
  if (status.value === 'error') {
    useErrorStore().trigger(error);
    return;
  }

  data.value.data.forEach(e => {
    let idx = trx_trps.value.map((x)=>x.id).indexOf(e.id);
    if(idx !== -1) {
      let dt = {        
        pv_id : data.value.pv_id,
        pv_no : data.value.pv_no,
        pv_total : data.value.pv_total,
        updated_at : data.value.updated_at,
      };
      
      trx_trps.value.splice(idx,1,{...dt});
    }
    
  });


  display({ show: true, status: "Success", message: "Update PV Done" });
}
</script>