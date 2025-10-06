<template>
    <template v-if="standby_trxs && standby_trxs.length > 0">
        <div class="border-2 w-full">
            <div class="w-full font-bold text-center bg-blue-300">STANDBY </div>
            <div v-for="(st,st_idx) in standby_trxs" class="border-2">
                <div class="flex w-full items-center justify-between">
                    <div class="flex items-center justify-center p-1"> 
                        <IconsClockAnalog class="text-xl mr-1"/> 
                        <div>
                            <div class="font-bold text-xs">Created At</div>
                            <div class="text-xs sm:flex">
                                <div class="sm:mr-1">
                                    {{ st.created_at ? $moment(st.created_at).format("DD-MM-YYYY") : "" }}
                                </div>
                                <div>
                                    {{ st.created_at ? $moment(st.created_at).format("H:m:s") : "" }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="font-bold text-lg text-center">ID #{{ st.id }}</div>
                    <div class="flex items-center justify-center p-1"> 
                        <IconsClockAnalog class="text-xl mr-1"/> 
                        <div>
                            <div class="font-bold text-xs">Updated At</div>
                            <div class="text-xs sm:flex">
                                <div class="sm:mr-1">
                                    {{ st.updated_at ? $moment(st.updated_at).format("DD-MM-YYYY") : "" }}
                                </div>
                                <div>
                                    {{ st.updated_at ? $moment(st.updated_at).format("H:m:s") : "" }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="border-t-2 p-2 flex flex-row flex-wrap items-center justify-center">
                    <div class="flex flex-col items-center justify-center">
                        <div class="flex items-center justify-center">
                            <IconsCalendar class="mr-1"/> {{ st.tanggal ? $moment(st.tanggal).format("DD-MM-YYYY") : "" }} 
                            <span class="font-bold italic ml-2">
                                {{ st.transition_type }} {{ st.transition_target }}
                            </span>
                        </div>
                        <div class="flex flex-col relative">
                            <IconsTruck class="text-9xl"/> 
                                <!-- <div class="absolute mt-12 ml-2 w-12 text-center font-bold">
                                    {{ st.jenis }}
                                </div> -->
                            <div class="absolute mt-2 w-16 bg-orange-500 text-center font-bold text-xs">
                                {{ st.no_pol }}
                            </div>
                        </div>
                        <div class="flex items-center justify-center">
                            <IconsLocationOn /> 
                            <span class="px-1"> {{st.xto}} </span>
                            <!-- <span class="px-1 font-bold"> {{pointFormat(st.standby_mst._raw.harga)}}</span> -->
                        </div>
                    </div>
                    <div class="w-full flex  items-center justify-center">
                        <div class="w-full sm:w-1/2 flex flex-wrap items-center justify-center border-2 rounded-lg">
                            <div class="w-1/2">
                                <IconsTruckDriver class="text-9xl"/>
                            </div>
                            <div class="w-1/2">
                                <div class="font-bold"> DRIVER #{{ st.supir_id }} </div>
                                <div>                    
                                {{ st.supir }}
                                </div>
                            </div>              
                        </div>
    
                        <div v-if="st.kernet_id" class="w-full sm:w-1/2 flex items-center justify-center border-2 rounded-lg">
                            <div class="w-1/2">
                                <IconsTruckDriver class="text-9xl"/>
                            </div>
                            <div class="w-1/2">
                                <div class="font-bold"> ASST DRIVER #{{ st.kernet_id }} </div>
                                <div>
                                
                                {{ st.kernet }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-full flex flex-row flex-wrap">
                        <div class="w-full sm:w-7/12 md:w-1/2 p-2">
                            <div class="w-full font-bold text-xl  text-center mt-2">
                                BIAYA
                            </div>
                            <table class="w-full text-sm">
                                <thead>
                                    <tr>
                                        <th class="border-2 border-black p-2">Type</th>
                                        <th class="border-2 border-black p-2">Deskripsi</th>
                                        <th class="border-2 border-black p-2">Nominal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="border-2 border-black p-2">{{st.standby_mst_?.tipe}}</td>
                                        <td class="border-2 border-black p-2">{{st.standby_mst_?.name}}</td>
                                        <td class="border-2 border-black p-2 text-right">{{pointFormat(st.standby_mst_?.amount)}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="w-full sm:w-5/12 md:w-1/2 p-2">
                            <div class="w-full font-bold text-xl  text-center mt-2">
                            ASCEND
                            </div>
                        <table class="w-full text-sm">
                        <tbody>
                            <tr>
                                <td class="border-2 border-black p-2"> NOTE FOR REMARKS </td>
                                <td class="border-2 border-black p-2 font-bold">{{ st.note_for_remarks }}</td>
                            </tr>
                            <tr>
                                <td class="border-2 border-black p-2"> COST CENTER CODE </td>
                                <td class="border-2 border-black p-2 font-bold">{{ st.cost_center_code }}</td>
                            </tr>
                            <tr>
                            <td class="border-2 border-black p-2">COST CENTER DESC</td>
                            <td class="border-2 border-black p-2 font-bold">{{ st.cost_center_desc }}</td>
                            </tr>
                            <tr>
                            <td class="border-2 border-black p-2"> PVR NO </td>
                            <td class="border-2 border-black p-2 font-bold">{{ st.pvr_no }}</td>
                            </tr>
                            <tr>
                            <td class="border-2 border-black p-2"> PVR AMOUNT </td>
                            <td class="border-2 border-black p-2 font-bold">{{ pointFormat(st.pvr_total || 0) }}</td>
                            </tr>
                            <tr>
                            <td class="border-2 border-black p-2"> PV NO </td>
                            <td class="border-2 border-black p-2 font-bold">{{ st.pv_no }}</td>
                            </tr>
                            <tr>
                            <td class="border-2 border-black p-2">PV AMOUNT</td>
                            <td class="border-2 border-black p-2 font-bold">{{ pointFormat(st.pv_total || 0) }}</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    </div>
    
                    <div class="w-full flex grow p-1 overflow-auto 2xl:overflow-hidden justify-between flex-wrap">
                    <div class="w-full" role="sticky">
                        <table class="tacky w-full !table-auto" style="white-space:normal;">
                            <thead >
                                <tr class="sticky -top-1 !z-[2]">
                                <td colspan="6" class="!bg-slate-800 text-white font-bold">
                                    Detail Transaction
                                </td>
                                </tr>
                                <tr class="sticky top-7 !z-[2]">
                                <th class="!min-w-[50px] !w-[50px] !max-w-[50px] ">No</th>
                                <th class="!min-w-[90px] !w-[90px] !max-w-[90px] ">Tanggal</th>
                                <th class="!min-w-[55px] !w-[55px] !max-w-[55px] ">Waktu</th>
                                <th class="!min-w-[200px] !w-[200px] !max-w-[200px] ">Foto</th>
                                <th class="!min-w-[200px] !w-[200px] !max-w-[200px] ">Note</th>
                                <th class="!min-w-[70px] !w-[70px] !max-w-[70px] ">Dibayar</th>
                                </tr>
                            </thead>
                            <tbody ref="to_move">
                                <template v-for="(detail, index) in st.details" :key="index">
                                <tr v-if="detail.p_status!='Remove'"  :data-index="index">
                                    <td>{{ index + 1 }}.</td>
                                    <td class="cell">
                                    <div class="w-full h-auto flex items-center justify-center relative">
                                        {{ $moment(detail.tanggal).format("DD-MM-YYYY") }}
                                    </div>
                                    </td>
                                    <td class="cell">
                                    <div class="w-full h-auto flex items-center justify-center relative">
                                        {{ detail.waktu.substring(0,5)  }}
                                    </div>
                                    </td>
                                    <td class="cell">
                                    <div style="width:60vw;" class="h-auto flex items-center justify-center">
                                        <AttachmentSingle :value="detail.attachment_1_preview" @setFile="detail.attachment_1=$event"  @setPreview="detail.attachment_1_preview=$event"/>
                                    </div>
                                    </td>
                                    <td class="cell">
                                    <div class="h-auto flex items-center justify-center">
                                        {{detail.note}}
                                    </div>
                                    </td>
                                    <td class="cell" :class="!useUtils().checkPermissions(['standby_trx.detail.decide_paid']) || st.val5==1 ? 'unselectable' : ''">
                                        <div class="w-full h-auto flex items-center justify-center">
                                            <div v-if="!useUtils().checkPermissions(['standby_trx.detail.decide_paid']) || st.val5==1" class="text-3xl">
                                                <IconsTimes v-if="detail.be_paid==0" class="text-red-800"/>
                                                <IconsCheck v-else class="text-green-800"/>                                           
                                            </div>
    
                                            <button v-else type="button" @click="detail.be_paid = (detail.be_paid ? 0 : 1)" class="text-white w-auto rounded text-xl" :class="detail.be_paid?'bg-green-600' : 'bg-red-600'">
                                                <IconsTimes v-if="detail.be_paid==0"/>
                                                <IconsCheck v-else/>             
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                    </div>
    
                    <div class="w-full text-xl font-bold text-center"> APPROVER STANDBY TRIP</div>
                    <div class="w-full flex flex-wrap justify-center text-xs text-center">
                        <div class="border-2 p-1 m-1">
                            Kasir <br>
                            {{ st.val_by && st.val? st.val_by.username : "-"}} <br>
                            ( {{ st.val_at && st.val? $moment(st.val_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
                        </div>
                        <div class="border-2 p-1 m-1">
                            Mandor <br>
                            {{ st.val1_by && st.val1? st.val1_by.username : "-"}} <br>
                            ( {{ st.val1_at && st.val1 ? $moment(st.val1_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
                        </div>
                        <div class="border-2 p-1 m-1">
                            Staff Logistik <br>
                            {{ st.val2_by && st.val2? st.val2_by.username : "-"}} <br>
                            ( {{ st.val2_at && st.val2 ? $moment(st.val2_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
                        </div>
                        <div class="border-2 p-1 m-1">
                            Admin LogistiK <br>
                            {{ st.val3_by && st.val3? st.val3_by.username : "-"}} <br>
                            ( {{ st.val3_at && st.val3 ? $moment(st.val3_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
                        </div>
                        <div class="border-2 p-1 m-1">
                            SPV Logistik <br>
                            {{ st.val4_by && st.val4? st.val4_by.username : "-"}} <br>
                            ( {{ st.val4_at && st.val4 ? $moment(st.val4_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
                        </div>
                        <div class="border-2 p-1 m-1">
                            MGR Logistik <br>
                            {{ st.val5_by && st.val5? st.val5_by.username : "-"}} <br>
                            ( {{ st.val5_at && st.val5 ? $moment(st.val5_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
                        </div>
                    </div>
                    <div class="flex flex-wrap justify-between">
                        <button v-if="useUtils().checkPermissions(['standby_trx.detail.decide_paid']) && st.val5=='0'" type="submit" name="button" class="w-36 m-1 bg-green-600 text-white text-xs rounded-sm" @click.prevent="doValidate(st_idx,'paid')">
                            Paid
                        </button>
                        <button v-if="useUtils().checkPermissions(['standby_trx.detail.decide_paid']) && st.val5=='0'" type="submit" name="button" class="w-36 m-1 bg-red-600 text-white text-xs rounded-sm" @click.prevent="doValidate(st_idx,'nopaid')">
                            NoPaid
                        </button>
                        <button type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doValidate(st_idx)">
                            Validasi
                            <div class="text-xs font-bold" v-if="save_do[st_idx]=='VAL' && save_state[st_idx]!=''">
                                {{ save_state[st_idx] }}
                            </div>
                        </button>
                        <button type="submit" name="button" class="w-36 m-1 bg-yellow-600 text-white  rounded-sm" @click.prevent="doUnValidate(st_idx)">
                            Unvalidasi
                            <div class="text-xs font-bold" v-if="save_do[st_idx]=='UNVAL' && save_state[st_idx]!=''">
                                {{ save_state[st_idx] }}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>

<script setup>

const { $moment } = useNuxtApp()
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import Trx_trp from '../trx_trp.vue';
const { pointFormat } = useUtils();

const props = defineProps({
    standby_trxs: {
        type: Array,
        required: false,
    },
    p_data:{
        type:Array,
        required:true,
        default:[]
    },

    save_state:{
        type:Array,
        required:true,
        default:[]
    },

    save_do:{
        type:Array,
        required:true,
        default:[]
    },
})


const token = useDynamicPathCookie('token');
const field_errors = ref({})

const doValidate = async (st_idx,paid_state) => {
    props.save_state[st_idx] = "PROSES...";
    props.save_do[st_idx] = "VAL";
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();

  let tDetails = [...props.standby_trxs[st_idx].details];
  if(paid_state=='paid'){    
    tDetails = tDetails.map((x,k)=>{
      x.be_paid=1;
      return x;
    });
  }else if(paid_state=='nopaid'){
    tDetails = tDetails.map((x,k)=>{
      x.be_paid=0;
      return x;
    });
  }

  data_in.append("details", JSON.stringify(tDetails));
  data_in.append("id", props.standby_trxs[st_idx].id);
  data_in.append("_method", "PUT");
  
  let $method = "post";
  const { data, error, status } = await useMyFetch("/standby_trx_validasi", {
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
    props.save_state[st_idx] = "GAGAL";
    useErrorStore().trigger(error, field_errors);
    return;
  }

  props.standby_trxs[st_idx].val = data.value.val;
  props.standby_trxs[st_idx].val_user = data.value.val_user;
  props.standby_trxs[st_idx].val_by = data.value.val_by;
  props.standby_trxs[st_idx].val_at = data.value.val_at;

  props.standby_trxs[st_idx].val1 = data.value.val1;
  props.standby_trxs[st_idx].val1_user = data.value.val1_user;
  props.standby_trxs[st_idx].val1_by = data.value.val1_by;
  props.standby_trxs[st_idx].val1_at = data.value.val1_at;

  props.standby_trxs[st_idx].val2 = data.value.val2;
  props.standby_trxs[st_idx].val2_user = data.value.val2_user;
  props.standby_trxs[st_idx].val2_by = data.value.val2_by;
  props.standby_trxs[st_idx].val2_at = data.value.val2_at;

  props.standby_trxs[st_idx].val3 = data.value.val3;
  props.standby_trxs[st_idx].val3_user = data.value.val3_user;
  props.standby_trxs[st_idx].val3_by = data.value.val3_by;
  props.standby_trxs[st_idx].val3_at = data.value.val3_at;

  props.standby_trxs[st_idx].val4 = data.value.val4;
  props.standby_trxs[st_idx].val4_user = data.value.val4_user;
  props.standby_trxs[st_idx].val4_by = data.value.val4_by;
  props.standby_trxs[st_idx].val4_at = data.value.val4_at;

  props.standby_trxs[st_idx].val5 = data.value.val5;
  props.standby_trxs[st_idx].val5_user = data.value.val5_user;
  props.standby_trxs[st_idx].val5_by = data.value.val5_by;
  props.standby_trxs[st_idx].val5_at = data.value.val5_at;

  props.save_state[st_idx] = "BERHASIL";

  let idx= props.p_data.map((x)=>x.id).indexOf(props.standby_trxs[st_idx].id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...props.standby_trxs[st_idx]});    
  }
}

const doUnValidate = async (st_idx) => {
    props.save_state[st_idx] = "PROSES...";
    props.save_do[st_idx] = "UNVAL";
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData(); 
  data_in.append("id", props.standby_trxs[st_idx].id);
  data_in.append("_method", "PUT");
  
  let $method = "post";

  const { data, error, status } = await useMyFetch("/standby_trx_unvalidasi", {
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
    props.save_state[st_idx] = "GAGAL";
    useErrorStore().trigger(error, field_errors);
    return;
  }


  props.standby_trxs[st_idx].val = data.value.val;
  props.standby_trxs[st_idx].val_user = data.value.val_user;
  props.standby_trxs[st_idx].val_by = data.value.val_by;
  props.standby_trxs[st_idx].val_at = data.value.val_at;

  props.standby_trxs[st_idx].val1 = data.value.val1;
  props.standby_trxs[st_idx].val1_user = data.value.val1_user;
  props.standby_trxs[st_idx].val1_by = data.value.val1_by;
  props.standby_trxs[st_idx].val1_at = data.value.val1_at;

  props.standby_trxs[st_idx].val2 = data.value.val2;
  props.standby_trxs[st_idx].val2_user = data.value.val2_user;
  props.standby_trxs[st_idx].val2_by = data.value.val2_by;
  props.standby_trxs[st_idx].val2_at = data.value.val2_at;

  props.standby_trxs[st_idx].val3 = data.value.val3;
  props.standby_trxs[st_idx].val3_user = data.value.val3_user;
  props.standby_trxs[st_idx].val3_by = data.value.val3_by;
  props.standby_trxs[st_idx].val3_at = data.value.val3_at;

  props.standby_trxs[st_idx].val4 = data.value.val4;
  props.standby_trxs[st_idx].val4_user = data.value.val4_user;
  props.standby_trxs[st_idx].val4_by = data.value.val4_by;
  props.standby_trxs[st_idx].val4_at = data.value.val4_at;

  props.standby_trxs[st_idx].val5 = data.value.val5;
  props.standby_trxs[st_idx].val5_user = data.value.val5_user;
  props.standby_trxs[st_idx].val5_by = data.value.val5_by;
  props.standby_trxs[st_idx].val5_at = data.value.val5_at;

  props.save_state[st_idx] = "BERHASIL";

  let idx= props.p_data.map((x)=>x.id).indexOf(props.standby_trxs[st_idx].id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...props.standby_trxs[st_idx]});    
  }
}
</script>