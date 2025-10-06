<template>
<div class="border-2 w-full">
    <div class="w-full font-bold text-center bg-blue-300">UANG JALAN TRIP INFO </div>
    <div class="border-t-2 flex w-full items-center justify-between">
        <div class="flex items-center justify-center p-1"> 
            <IconsClockAnalog class="text-xl mr-1"/> 
            <div>
                <div class="font-bold text-xs">Created At</div>
                <div class="text-xs sm:flex">
                    <div class="sm:mr-1">
                    {{ trx_trp.created_at ? $moment(trx_trp.created_at).format("DD-MM-YYYY") : "" }}
                    </div>
                    <div>
                    {{ trx_trp.created_at ? $moment(trx_trp.created_at).format("H:m:s") : "" }}
                    </div>
                </div>
            </div>
        </div>
        <div class="font-bold text-lg text-center">ID #{{ trx_trp.id }}</div>
        <div class="flex items-center justify-center p-1"> 
            <IconsClockAnalog class="text-xl mr-1"/> 
            <div>
                <div class="font-bold text-xs">Updated At</div>
                <div class="text-xs sm:flex">
                    <div class="sm:mr-1">
                    {{ trx_trp.updated_at ? $moment(trx_trp.updated_at).format("DD-MM-YYYY") : "" }}
                    </div>
                    <div>
                    {{ trx_trp.updated_at ? $moment(trx_trp.updated_at).format("H:m:s") : "" }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="border-t-2 p-2 flex flex-col items-center justify-center">
        <div class="flex flex-col items-center justify-center">
            <div class="flex items-center justify-center">
                <IconsCalendar class="mr-1"/> {{ trx_trp.tanggal ? $moment(trx_trp.tanggal).format("DD-MM-YYYY") : "" }} 
                <span class="font-bold italic ml-2">
                    {{ trx_trp.transition_type }} {{ trx_trp.transition_target }}
                </span>
            </div>
            <div class="flex flex-col relative">
                <IconsTruck class="text-9xl"/> 
                <div class="absolute mt-12 ml-2 w-12 text-center font-bold">
                    {{ trx_trp.jenis }}
                </div>
                <div class="absolute mt-2 w-16 bg-orange-500 text-center font-bold text-xs">
                    {{ trx_trp.no_pol }}
                </div>
            </div>
            <div class="flex items-center justify-center">
                <IconsLocationOn /> 
                <span class="px-1"> {{trx_trp.uj?.xto}} [#{{trx_trp.uj?.id}}]</span>
                <span class="px-1 font-bold"> {{pointFormat(trx_trp.uj?.harga)}}</span>
            </div>
        </div>
        <div class="w-full flex flex-wrap  items-center justify-center">
            <div class="w-full sm:w-1/2 flex flex-wrap items-center justify-center border-2 rounded-lg">
                <div class="w-1/2">
                    <IconsTruckDriver class="text-9xl"/>
                </div>
                <div class="w-1/2">
                    <div class="font-bold"> DRIVER #{{ trx_trp.supir_id }} </div>
                    <div>
                    {{ trx_trp.supir }}
                    </div>
                </div>              
            </div>

            <div v-if="trx_trp.kernet_id" class="w-full sm:w-1/2 flex items-center justify-center border-2 rounded-lg">
                <div class="w-1/2">
                    <IconsTruckDriver class="text-9xl"/>
                </div>
                <div class="w-1/2">
                    <div class="font-bold"> ASST DRIVER #{{ trx_trp.kernet_id }} </div>
                    <div>
                    {{ trx_trp.kernet }}
                    </div>
                </div>
            </div>

        </div>
        <div class="w-full flex flex-row flex-wrap">
            <div class="w-full sm:w-7/12 md:w-1/2 p-2">
                <div class="w-full font-bold text-xl  text-center mt-2">
                    BIAYA PERJALANAN
                </div>
                <table class="w-full text-xs sm:text-sm">
                    <thead>
                    <tr>
                        <th class="border-2 border-black p-1">No</th>
                        <th class="border-2 border-black p-1">Deskripsi</th>
                        <th class="border-2 border-black p-1">Qty</th>
                        <th class="border-2 border-black p-1">Harga</th>
                        <th class="border-2 border-black p-1">Jumlah</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(du,idx) in trx_trp.details_uj">
                        <td class="border-2 border-black p-1">{{idx+1}}</td>
                        <td class="border-2 border-black p-1">{{du.xdesc}}</td>
                        <td class="border-2 border-black p-1 text-right">{{pointFormat(du.qty)}}</td>
                        <td class="border-2 border-black p-1 text-right">{{pointFormat(du.harga)}}</td>
                        <td class="border-2 border-black p-1 text-right">{{pointFormat(du.qty * du.harga)}}</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <th class="border-2 border-black p-1" colspan="4"> Total </th>
                        <th class="border-2 border-black p-1" v-if="trx_trp.details_uj && trx_trp.details_uj.length > 0">{{ pointFormat(trx_trp.details_uj.map((x)=>x.qty*x.harga).reduce((prev,curr)=>{prev+=curr; return prev})) }}</th>
                    </tr>
                    <template v-if="trx_trp.potongan && trx_trp.potongan.length > 0">
                        <tr v-for="ptg in trx_trp.potongan">
                        <td class="border-2 border-black p-1 text-red-500" colspan="4"> Potongan {{ ptg.potongan_mst.employee_id == trx_trp.supir_id ? 'Supir' : 'Kernet' }} #{{ ptg.potongan_mst.id }} </td>
                        <td class="border-2 border-black p-1 text-red-500 text-right">{{ pointFormat(ptg.nominal_cut) }}</td>
                        </tr>
                        <tr>
                        <td class="border-2 border-black p-1 text-red-500" colspan="4"> Total Potongan </td>
                        <td class="border-2 border-black p-1 text-red-500 text-right">{{ pointFormat(trx_trp.potongan.map((x)=>x.nominal_cut).reduce((prev,curr)=>{prev+=curr; return prev})) }}</td>
                        </tr>
                        <tr>
                        <th class="border-2 border-black p-1" colspan="4"> Total Diterima  </th>
                        <th class="border-2 border-black p-1 text-right" v-if="trx_trp.details_uj && trx_trp.potongan">{{ pointFormat(trx_trp.details_uj.map((x)=>x.qty*x.harga).reduce((prev,curr)=>{prev+=curr; return prev}) - trx_trp.potongan.map((x)=>x.nominal_cut).reduce((prev,curr)=>{prev+=curr; return prev})) }}</th>
                        </tr>
                    </template>
                    </tfoot>
                </table>
            </div>
            <div class="w-full sm:w-5/12 md:w-1/2 p-2">
                <div class="w-full font-bold text-xl  text-center mt-2">
                    PEMBAYARAN
                </div>
                <table class="w-full text-sm">
                    <tbody>
                    <tr>
                        <td class="border-2 border-black p-2">Metode </td>
                        <td class="border-2 border-black p-2 font-bold">{{ trx_trp.payment_method.name }}</td>
                    </tr>
                    <tr>
                        <td class="border-2 border-black p-2">Sudah Dibayarkan? </td>
                        <td class="border-2 border-black p-2 font-bold">{{ trx_trp.received_payment ? "Ya" : "Tidak" }}</td>
                    </tr>
                    </tbody>
                </table>

                <div class="w-full font-bold text-xl  text-center mt-2">
                    DUITKU SUPIR
                </div>
                <table class="w-full text-sm">
                    <tbody>
                    <tr>
                        <td class="border-2 border-black p-2">ID </td>
                        <td class="border-2 border-black p-2">INQUERY</td>
                        <td class="border-2 border-black p-2">TRANSFER</td>
                    </tr>
                    <tr>
                        <td class="border-2 border-black p-2 font-bold">{{ trx_trp.duitku_supir_disburseId }}</td>
                        <td class="border-2 border-black p-2 font-bold">{{ trx_trp.duitku_supir_inv_res_desc }}</td>
                        <td class="border-2 border-black p-2 font-bold">{{ trx_trp.duitku_supir_trf_res_desc }}</td>
                    </tr>
                    </tbody>
                </table>

                <div v-if="trx_trp.kernet" class="w-full font-bold text-xl  text-center mt-2">
                    DUITKU KERNET
                </div>
                <table v-if="trx_trp.kernet" class="w-full text-sm">
                    <tbody>
                    <tr>
                        <td class="border-2 border-black p-2">ID </td>
                        <td class="border-2 border-black p-2">INQUERY</td>
                        <td class="border-2 border-black p-2">TRANSFER</td>
                    </tr>
                    <tr>
                        <td class="border-2 border-black p-2 font-bold">{{ trx_trp.duitku_kernet_disburseId }}</td>
                        <td class="border-2 border-black p-2 font-bold">{{ trx_trp.duitku_kernet_inv_res_desc }}</td>
                        <td class="border-2 border-black p-2 font-bold">{{ trx_trp.duitku_kernet_trf_res_desc }}</td>
                    </tr>
                    </tbody>
                </table>

                <div class="w-full font-bold text-xl  text-center mt-2">
                    ASCEND
                </div>
                <table class="w-full text-sm">
                    <tbody>
                    <tr>
                        <td class="border-2 border-black p-2"> NOTE FOR REMARKS </td>
                        <td class="border-2 border-black p-2 font-bold">{{ trx_trp.note_for_remarks }}</td>
                    </tr>
                    <tr>
                        <td class="border-2 border-black p-2"> COST CENTER CODE </td>
                        <td class="border-2 border-black p-2 font-bold">{{ trx_trp.cost_center_code }}</td>
                    </tr>
                    <tr>
                        <td class="border-2 border-black p-2">COST CENTER DESC</td>
                        <td class="border-2 border-black p-2 font-bold">{{ trx_trp.cost_center_desc }}</td>
                    </tr>
                    <tr>
                        <td class="border-2 border-black p-2"> PVR NO </td>
                        <td class="border-2 border-black p-2 font-bold">{{ trx_trp.pvr_no }}</td>
                    </tr>
                    <tr>
                        <td class="border-2 border-black p-2"> PVR AMOUNT </td>
                        <td class="border-2 border-black p-2 font-bold">{{ pointFormat(trx_trp.pvr_total || 0) }}</td>
                    </tr>
                    <tr>
                        <td class="border-2 border-black p-2"> PV NO </td>
                        <td class="border-2 border-black p-2 font-bold">{{ trx_trp.pv_no }}</td>
                    </tr>
                    <tr>
                        <td class="border-2 border-black p-2">PV AMOUNT</td>
                        <td class="border-2 border-black p-2 font-bold">{{ pointFormat(trx_trp.pv_total || 0) }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="text-xl font-bold"> APPROVER UANG JALAN TRIP</div>
        <div class="w-full flex flex-wrap justify-center text-xs text-center">
            <div class="border-2 p-1 m-1">
                Kasir <br>
                {{ trx_trp.val && trx_trp.val_by ? trx_trp.val_by.username : "-"}} <br>
                ( {{ trx_trp.val && trx_trp.val_at ? $moment(trx_trp.val_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
            </div>
            <div class="border-2 p-1 m-1">
                Mandor <br>
                {{ trx_trp.val1 && trx_trp.val1_by ? trx_trp.val1_by.username : "-"}} <br>
                ( {{ trx_trp.val1 && trx_trp.val1_at ? $moment(trx_trp.val1_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
            </div>
            <div class="border-2 p-1 m-1">
                KTU/W <br>
                {{ trx_trp.val2 && trx_trp.val2_by ? trx_trp.val2_by.username : "-"}} <br>
                ( {{ trx_trp.val2 && trx_trp.val2_at ? $moment(trx_trp.val2_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
            </div>
            <div class="border-2 p-1 m-1">
                Marketing <br>
                {{ trx_trp.val3 && trx_trp.val3_by ? trx_trp.val3_by.username : "-"}} <br>
                ( {{ trx_trp.val3 && trx_trp.val3_at ? $moment(trx_trp.val3_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
            </div>
            <div class="border-2 p-1 m-1">
                Logistik <br>
                {{ trx_trp.val4 && trx_trp.val4_by ? trx_trp.val4_by.username : "-"}} <br>
                ( {{ trx_trp.val4 && trx_trp.val4_at ? $moment(trx_trp.val4_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
            </div>
            <div class="border-2 p-1 m-1">
                SPV Logistik <br>
                {{ trx_trp.val5 && trx_trp.val5_by ? trx_trp.val5_by.username : "-"}} <br>
                ( {{ trx_trp.val5 && trx_trp.val5_at ? $moment(trx_trp.val5_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
            </div>
            <div class="border-2 p-1 m-1">
                MGR Logistik <br>
                {{ trx_trp.val6 && trx_trp.val6_by ? trx_trp.val6_by.username : "-"}} <br>
                ( {{ trx_trp.val6 && trx_trp.val6_at ? $moment(trx_trp.val6_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
            </div>
        </div>
    </div>
    <div v-if="save_state.length > 0" class="flex flex-wrap justify-between">
        <button type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doValidate()">
            Validasi
            <div class="text-xs font-bold" v-if="save_do[0]=='VAL' && save_state[0]!=''">
                {{ save_state[0] }}
            </div>
        </button>
        <button type="submit" name="button" class="w-36 m-1 bg-yellow-600 text-white  rounded-sm" @click.prevent="doUnValidate()">
            Unvalidasi
            <div class="text-xs font-bold" v-if="save_do[0]=='UNVAL' && save_state[0]!=''">
                {{ save_state[0] }}
            </div>
        </button>
    </div>
</div>
</template>

<script setup>

const { $moment } = useNuxtApp()
import { useErrorStore } from '~/store/error';
import { useCommonStore } from '~/store/common';
import Trx_trp from '../trx_trp.vue';
const { pointFormat } = useUtils();

const props = defineProps({
    trx_trp: {
        type: Object,
        required: true,
    },
    p_data:{
        type:Array,
        required:false,
        default:[]
    },
    save_state:{
        type:Array,
        required:false,
        default:[]
    },

    save_do:{
        type:Array,
        required:false,
        default:[]
    },
})
const token = useDynamicPathCookie('token');
const field_errors = ref({})



const doValidate = async () => {
    props.save_state[0] = "PROSES...";
    props.save_do[0] = "VAL";
  useCommonStore().loading_full = true;

  const data_in = new FormData();
  
  let $method = "post";

  let id = props.trx_trp.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/trx_trp_validasi", {
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
    props.save_state[0] = "GAGAL";
    useErrorStore().trigger(error);
    return;
  }
  
  props.trx_trp.val = data.value.val;
  props.trx_trp.val_user = data.value.val_user;
  props.trx_trp.val_by = data.value.val_by;
  props.trx_trp.val_at = data.value.val_at;

  props.trx_trp.val1 = data.value.val1;
  props.trx_trp.val1_user = data.value.val1_user;
  props.trx_trp.val1_by = data.value.val1_by;
  props.trx_trp.val1_at = data.value.val1_at;

  props.trx_trp.val2 = data.value.val2;
  props.trx_trp.val2_user = data.value.val2_user;
  props.trx_trp.val2_by = data.value.val2_by;
  props.trx_trp.val2_at = data.value.val2_at;

  props.trx_trp.val3 = data.value.val3;
  props.trx_trp.val3_user = data.value.val3_user;
  props.trx_trp.val3_by = data.value.val3_by;
  props.trx_trp.val3_at = data.value.val3_at;

  props.trx_trp.val4 = data.value.val4;
  props.trx_trp.val4_user = data.value.val4_user;
  props.trx_trp.val4_by = data.value.val4_by;
  props.trx_trp.val4_at = data.value.val4_at;

  props.trx_trp.val5 = data.value.val5;
  props.trx_trp.val5_user = data.value.val5_user;
  props.trx_trp.val5_by = data.value.val5_by;
  props.trx_trp.val5_at = data.value.val5_at;

  props.trx_trp.val6 = data.value.val6;
  props.trx_trp.val6_user = data.value.val6_user;
  props.trx_trp.val6_by = data.value.val6_by;
  props.trx_trp.val6_at = data.value.val6_at;

  let idx= props.p_data.map((x)=>x.id).indexOf(props.trx_trp.id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...props.trx_trp});    
  }

  props.save_state[0] = "BERHASIL";

  // props.fnClose();
}

const doUnValidate = async () => {
  props.save_state[0] = "PROSES...";
  props.save_do[0] = "UNVAL";

  useCommonStore().loading_full = true;

  const data_in = new FormData();
  
  let $method = "post";

  let id = props.trx_trp.id;
  if (id == 0) {
  } else {
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/trx_trp_unvalidasi", {
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
    props.save_state[0] = "GAGAL";
    useErrorStore().trigger(error);
    return;
  }
  
  props.trx_trp.val = data.value.val;
  props.trx_trp.val_user = data.value.val_user;
  props.trx_trp.val_by = data.value.val_by;
  props.trx_trp.val_at = data.value.val_at;

  props.trx_trp.val1 = data.value.val1;
  props.trx_trp.val1_user = data.value.val1_user;
  props.trx_trp.val1_by = data.value.val1_by;
  props.trx_trp.val1_at = data.value.val1_at;

  props.trx_trp.val2 = data.value.val2;
  props.trx_trp.val2_user = data.value.val2_user;
  props.trx_trp.val2_by = data.value.val2_by;
  props.trx_trp.val2_at = data.value.val2_at;

  props.trx_trp.val3 = data.value.val3;
  props.trx_trp.val3_user = data.value.val3_user;
  props.trx_trp.val3_by = data.value.val3_by;
  props.trx_trp.val3_at = data.value.val3_at;

  props.trx_trp.val4 = data.value.val4;
  props.trx_trp.val4_user = data.value.val4_user;
  props.trx_trp.val4_by = data.value.val4_by;
  props.trx_trp.val4_at = data.value.val4_at;

  props.trx_trp.val5 = data.value.val5;
  props.trx_trp.val5_user = data.value.val5_user;
  props.trx_trp.val5_by = data.value.val5_by;
  props.trx_trp.val5_at = data.value.val5_at;

  props.trx_trp.val6 = data.value.val6;
  props.trx_trp.val6_user = data.value.val6_user;
  props.trx_trp.val6_by = data.value.val6_by;
  props.trx_trp.val6_at = data.value.val6_at;

  let idx= props.p_data.map((x)=>x.id).indexOf(props.trx_trp.id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...props.trx_trp});    
  }

  props.save_state[0] = "BERHASIL";

  // props.fnClose();
}
</script>