<template>
    <template v-if="extra_money_trxs && extra_money_trxs.length > 0">
        <div class="w-full font-bold text-center bg-blue-300">EXTRA MONEY TRIP INFO </div>
        <div v-for="emt in extra_money_trxs" class="border-2">
            <div class="flex w-full items-center justify-between">
                <div class="flex items-center justify-center p-1"> 
                    <IconsClockAnalog class="text-xl mr-1"/> 
                    <div>
                        <div class="font-bold text-xs">Created At</div>
                        <div class="text-xs sm:flex">
                            <div class="sm:mr-1">
                                {{ emt.created_at ? $moment(emt.created_at).format("DD-MM-YYYY") : "" }}
                            </div>
                            <div>
                                {{ emt.created_at ? $moment(emt.created_at).format("H:m:s") : "" }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="font-bold text-lg text-center">ID #{{ emt.id }} Untuk Trip ID #{{ emt.prev_trx_trp_id }}</div>
                <div class="flex items-center justify-center p-1"> 
                    <IconsClockAnalog class="text-xl mr-1"/> 
                    <div>
                        <div class="font-bold text-xs">Updated At</div>
                        <div class="text-xs sm:flex">
                            <div class="sm:mr-1">
                                {{ emt.updated_at ? $moment(emt.updated_at).format("DD-MM-YYYY") : "" }}
                            </div>
                            <div>
                                {{ emt.updated_at ? $moment(emt.updated_at).format("H:m:s") : "" }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="border-t-2 p-2 flex flex-row flex-wrap items-center justify-center">
                <div class="flex flex-col items-center justify-center">
                    <div class="flex items-center justify-center">
                        <IconsCalendar class="mr-1"/> {{ emt.tanggal ? $moment(emt.tanggal).format("DD-MM-YYYY") : "" }}
                        <span class="font-bold italic ml-2">
                            {{ emt.extra_money.transition_type }} {{ emt.extra_money.transition_target }}
                        </span>
                    </div>
                    <div class="flex flex-col relative">
                            <IconsTruck class="text-9xl"/>
                            <div class="absolute mt-12 ml-2 w-12 text-center font-bold">
                                {{ emt.extra_money.jenis }}
                            </div> 
                            <div class="absolute mt-2 w-16 bg-orange-500 text-center font-bold text-xs">
                                {{ emt.no_pol }}
                            </div>
                    </div>
                    <div class="flex items-center justify-center">
                        <IconsLocationOn /> 
                        <span class="px-1"> {{emt.extra_money.xto}} [#{{emt.extra_money.id}}]</span>
                    </div>
                </div>
                <div class="flex  items-center justify-center mx-3">
                    <div class="w-full flex flex-wrap items-center justify-center border-2 rounded-lg">
                        <div class="w-1/2">
                            <IconsPerson class="text-9xl"/>
                        </div>
                        <div class="w-1/2">
                            <div class="font-bold"> EMPLOYEE #{{ emt.employee_id }} </div>
                            <div>
                                {{ emt.employee.name }}
                            </div>
                        </div>              
                    </div>
                </div>
                <div class="w-full flex">
                    <div class="p-1 w-full sm:w-full md:w-1/2 md:overflow-auto max-h-full">
                        <AttachmentSingle :label="'Attachment'" :value="emt.attachment_1_preview"/>
                    </div>

                    <div class="p-1 w-full sm:w-full md:w-1/2 md:overflow-auto max-h-full">
                        <AttachmentSingle :label="'Attachment'" :value="emt.attachment_2_preview"/>
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
                                    <th class="border-2 border-black p-2">Deskripsi</th>
                                    <th class="border-2 border-black p-2">Qty</th>
                                    <th class="border-2 border-black p-2">Harga</th>
                                    <th class="border-2 border-black p-2">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="border-2 border-black p-2">{{emt.extra_money.description}}</td>
                                    <td class="border-2 border-black p-2 text-right">{{pointFormat(emt.extra_money.qty)}}</td>
                                    <td class="border-2 border-black p-2 text-right">{{pointFormat(emt.extra_money.nominal)}}</td>
                                    <td class="border-2 border-black p-2 text-right">{{pointFormat(emt.extra_money.qty * emt.extra_money.nominal)}}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="w-full font-bold text-xl  text-center mt-2">
                        PEMBAYARAN
                        </div>
                        <table class="w-full text-sm">
                            <tbody>
                                <tr>
                                    <td class="border-2 border-black p-2">Metode </td>
                                    <td class="border-2 border-black p-2 font-bold">{{ emt.payment_method.name }}</td>
                                </tr>
                                <tr>
                                    <td class="border-2 border-black p-2">Sudah Dibayarkan? </td>
                                    <td class="border-2 border-black p-2 font-bold">{{ emt.received_payment ? "Ya" : "Tidak" }}</td>
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
                                    <td class="border-2 border-black p-2 font-bold">{{ emt.note_for_remarks }}</td>
                                </tr>
                                <tr>
                                    <td class="border-2 border-black p-2"> COST CENTER CODE </td>
                                    <td class="border-2 border-black p-2 font-bold">{{ emt.cost_center_code }}</td>
                                </tr>
                                <tr>
                                    <td class="border-2 border-black p-2">COST CENTER DESC</td>
                                    <td class="border-2 border-black p-2 font-bold">{{ emt.cost_center_desc }}</td>
                                </tr>
                                <tr>
                                    <td class="border-2 border-black p-2"> PVR NO </td>
                                    <td class="border-2 border-black p-2 font-bold">{{ emt.pvr_no }}</td>
                                </tr>
                                <tr>
                                    <td class="border-2 border-black p-2"> PVR AMOUNT </td>
                                    <td class="border-2 border-black p-2 font-bold">{{ pointFormat(emt.pvr_total || 0) }}</td>
                                </tr>
                                <tr>
                                    <td class="border-2 border-black p-2"> PV NO </td>
                                    <td class="border-2 border-black p-2 font-bold">{{ emt.pv_no }}</td>
                                </tr>
                                <tr>
                                    <td class="border-2 border-black p-2">PV AMOUNT</td>
                                    <td class="border-2 border-black p-2 font-bold">{{ pointFormat(emt.pv_total || 0) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="w-full text-xl font-bold"> APPROVER EXTRA MONEY TRIP</div>
                <div class="w-full flex flex-wrap justify-center text-xs text-center">
                    <div class="border-2 p-1 m-1">
                        Kasir <br>
                        {{ emt.val1_by ? emt.val1_by.username : "-"}} <br>
                        ( {{ emt.val1_at ? $moment(emt.val1_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
                    </div>
                    <div class="border-2 p-1 m-1">
                        Mandor <br>
                        {{ emt.val2_by ? emt.val2_by.username : "-"}} <br>
                        ( {{ emt.val2_at ? $moment(emt.val2_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
                    </div>
                    <div class="border-2 p-1 m-1">
                        KTU/W <br>
                        {{ emt.val3_by ? emt.val3_by.username : "-"}} <br>
                        ( {{ emt.val3_at ? $moment(emt.val3_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
                    </div>
                    <div class="border-2 p-1 m-1">
                        Logistik <br>
                        {{ emt.val4_by ? emt.val4_by.username : "-"}} <br>
                        ( {{ emt.val4_at ? $moment(emt.val4_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
                    </div>
                    <div class="border-2 p-1 m-1">
                        SPV Logistik <br>
                        {{ emt.val5_by ? emt.val5_by.username : "-"}} <br>
                        ( {{ emt.val5_at ? $moment(emt.val5_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
                    </div>
                    <div class="border-2 p-1 m-1">
                        MGR Logistik <br>
                        {{ emt.val6_by ? emt.val6_by.username : "-"}} <br>
                        ( {{ emt.val6_at ? $moment(emt.val6_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
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
    extra_money_trxs: {
        type: Array,
        required: false,
    }
})
</script>