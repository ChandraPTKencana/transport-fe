<template>
<div class="border-2">
    <div class="w-full font-bold text-center bg-blue-300">ABSEN TRIP</div>
    <div class="border-t-2 flex w-full items-center justify-between">
        <div class="w-full flex flex-wrap items-center">
            <div class="w-full sm:w-1/2 text-center p-1">
            <div class="border-[1px] p-1">
                <label class="font-bold">Berangkat : {{ trx_trp.img_leave_ts ? $moment(trx_trp.img_leave_ts).format("DD-MM-YYYY HH:mm") : "" }} {{ trx_trp.img_leave_is_manual ? '(Manual)' : '(System)' }}</label>
                <div class="w-full flex justify-center items-center">
                <img :src="trx_trp.img_leave" alt="">
                </div>
            </div>
            </div>

            <div class="w-full sm:w-1/2 text-center p-1">
            <div class="border-[1px] p-1">
                <div class="border-[1px] p-1">
                <label class="font-bold">Tiba : {{ trx_trp.img_arrive_ts ? $moment(trx_trp.img_arrive_ts).format("DD-MM-YYYY HH:mm") : "" }} {{ trx_trp.img_arrive_is_manual ? '(Manual)' : '(System)' }}</label>
                <div class="w-full flex justify-center items-center">
                    <img :src="trx_trp.img_arrive" alt="">
                </div>
                </div>
            </div>
            </div>

            <div class="w-full sm:w-1/2 text-center p-1">
            <div class="border-[1px] p-1">
                <div class="border-[1px] p-1">
                <label class="font-bold">Kembali : {{ trx_trp.img_return_ts ? $moment(trx_trp.img_return_ts).format("DD-MM-YYYY HH:mm") : "" }} {{ trx_trp.img_return_is_manual ? '(Manual)' : '(System)' }}</label>
                <div class="w-full flex justify-center items-center">
                    <img :src="trx_trp.img_return" alt="">
                </div>
                </div>
            </div>
            </div>

            <div class="w-full sm:w-1/2 text-center p-1">
            <div class="border-[1px] p-1">
                <div class="border-[1px] p-1">
                <label class="font-bold">Sampai : {{ trx_trp.img_till_ts ? $moment(trx_trp.img_till_ts).format("DD-MM-YYYY HH:mm") : "" }} {{ trx_trp.img_till_is_manual ? '(Manual)' : '(System)' }}</label>
                <div class="w-full flex justify-center items-center">
                    <img :src="trx_trp.img_till" alt="">
                </div>
                </div>
            </div>
            </div>

            <div class="w-full p-1">
            <label for=""> Note </label>
            <div class="card-border">
                {{ trx_trp.ritase_note }}
            </div>
            </div>
        </div>
    </div>
    <div class="border-t-2 p-2 flex flex-col items-center justify-center">
        <div class="text-xl font-bold"> APPROVER ABSEN TRIP</div>
        <div class="w-full flex flex-wrap justify-center text-xs text-center">
            <div class="border-2 p-1 m-1">
            Kasir <br>
            {{ trx_trp.ritase_val_by ? trx_trp.ritase_val_by.username : "-"}} <br>
            ( {{ trx_trp.ritase_val_at ? $moment(trx_trp.ritase_val_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
          </div><div class="border-2 p-1 m-1">
            Mandor <br>
            {{ trx_trp.ritase_val1_by ? trx_trp.ritase_val1_by.username : "-"}} <br>
            ( {{ trx_trp.ritase_val1_at ? $moment(trx_trp.ritase_val1_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
          </div>
          <div class="border-2 p-1 m-1">
            Staff <br>
            {{ trx_trp.ritase_val2_by ? trx_trp.ritase_val2_by.username : "-"}} <br>
            ( {{ trx_trp.ritase_val2_at ? $moment(trx_trp.ritase_val2_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
          </div>
        </div>
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
    }
})
</script>