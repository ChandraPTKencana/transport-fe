<template>
<div class="border-2">
    <div class="w-full font-bold text-center bg-blue-300">TICKET TRIP INFO </div>
    
    <div class="border-t-2 p-2 flex flex-col items-center justify-center">
        <div class="w-full flex flex-row flex-wrap">
            <div v-if="trx_trp.jenis!='' && trx_trp.jenis!='TBSK'" class="w-full flex flex-col flex-wrap p-1">
                <label for="">Tiket A</label>
                <div class="card-border">
                  {{ trx_trp.ticket_a_no }}
                </div>
              </div>
              
              <div v-if="trx_trp.jenis!='' && trx_trp.jenis!='TBSK'" class="w-full flex flex-wrap">
                <div class="w-6/12 sm:w-6/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                  <label for="">In At</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_a_in_at ? $moment(trx_trp.ticket_a_in_at).format("DD-MM-Y HH:mm:ss") : "-" }}
                  </div>
                </div>
                <div class="w-6/12 sm:w-6/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                  <label for="">Out At</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_a_out_at ? $moment(trx_trp.ticket_a_out_at).format("DD-MM-Y HH:mm:ss") : "-" }}
                  </div>
                </div>
                <div class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                  <label for="">Bruto</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_a_bruto ? pointFormat(trx_trp.ticket_a_bruto): 0 }}
                  </div>
                </div>
                <div class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                  <label for="">Tara</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_a_tara ? pointFormat(trx_trp.ticket_a_tara): 0 }}
                  </div>
                </div>
                <div class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                  <label for="">Netto</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_a_bruto ? pointFormat(trx_trp.ticket_a_bruto - trx_trp.ticket_a_tara): 0 }}
                  </div>
                </div>

                <div class="w-3/12 sm:w-2/12 md:w-2/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                  <label for="">No Pol</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_a_no_pol }}
                  </div>
                </div>

                <div class="w-full sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                  <label for="">Supir</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_a_supir }}
                  </div>
                </div>
                
              </div>
              

              <div  v-if="['TBS','TBSK'].indexOf(trx_trp.jenis) > -1" class="w-full flex flex-col flex-wrap p-1">
                <label for="">Tiket B</label>
                <div class="card-border">
                  {{ trx_trp.ticket_b_no }}
                </div>
              </div>
              <div v-if="['TBS','TBSK'].indexOf(trx_trp.jenis) > -1" class="w-full flex flex-wrap">
                <div class="w-6/12 sm:w-6/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                  <label for="">In At</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_b_in_at ? $moment(trx_trp.ticket_b_in_at).format("DD-MM-Y HH:mm:ss") : "-" }}
                  </div>
                </div>
                <div class="w-6/12 sm:w-6/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                  <label for="">Out At</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_b_out_at ? $moment(trx_trp.ticket_b_out_at).format("DD-MM-Y HH:mm:ss") : "-" }}
                  </div>
                </div>
                <div class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                  <label for="">Bruto </label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_b_bruto ? pointFormat(trx_trp.ticket_b_bruto): 0 }}
                  </div>
                </div>
                <div class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                  <label for="">Tara </label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_b_tara ? pointFormat(trx_trp.ticket_b_tara): 0 }}
                  </div>
                </div>
                <div class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                  <label for="">Netto </label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_b_bruto ? pointFormat(trx_trp.ticket_b_bruto - trx_trp.ticket_b_tara): 0 }}
                  </div>
                </div>

                <div class="w-3/12 sm:w-2/12 md:w-2/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                  <label for="">No Pol</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_b_no_pol }}
                  </div>
                </div>

                <div class="w-full sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                  <label for="">Supir</label>
                  <div class="card-border disabled">
                    {{ trx_trp.ticket_b_supir }}
                  </div>
                </div>
              </div>
              
              <div v-if="['CPO','PK'].indexOf(trx_trp.jenis) > -1" class="w-full sm:w-6/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                <label for="">In At</label>
                <div class="card-border">
                  {{ trx_trp.ticket_b_in_at ? $moment(trx_trp.ticket_b_in_at).format("DD-MM-Y HH:mm:ss") : "" }}
                </div>
              </div>

              <div v-if="['CPO','PK'].indexOf(trx_trp.jenis) > -1" class="w-full sm:w-6/12 md:w-3/12 lg:w-2/12 flex flex-col flex-wrap p-1">
                <label for="">Out At</label>
                <div class="card-border">
                  {{trx_trp.ticket_b_out_at ? $moment(trx_trp.ticket_b_out_at).format("DD-MM-Y HH:mm:ss"):"" }}
                </div>
              </div>
                     
              <div v-if="['CPO','PK'].indexOf(trx_trp.jenis) > -1" class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                <label for="">Bruto</label>
                <div class="card-border">
                    {{ pointFormat(trx_trp.ticket_b_bruto || 0) }}
                  </div>
              </div>

              <div v-if="['CPO','PK'].indexOf(trx_trp.jenis) > -1" class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                <label for="">Tara</label>
                <div class="card-border">
                    {{ pointFormat(trx_trp.ticket_b_tara || 0) }}
                  </div>
              </div>

              <div v-if="['CPO','PK'].indexOf(trx_trp.jenis) > -1" class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col flex-wrap p-1">
                <label for="">Netto</label>
                <div class="card-border ">
                    {{ pointFormat(trx_trp.ticket_b_netto || 0) }}
                </div>
              </div>

              <div class="w-full flex flex-wrap">
                <div class="w-full sm:w-full md:w-6/12 lg:w-4/12 flex flex-col flex-wrap p-1 justify-end">
                </div>
                <div class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col justify-end flex-wrap p-1">
                  <label for="" class="font-bold">Selisih Bruto </label>
                  <div class="card-border disabled">
                    {{ pointFormat((trx_trp.ticket_b_bruto - trx_trp.ticket_a_bruto) || 0) }}
                  </div>
                </div>
                <div class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col justify-end flex-wrap p-1">
                  <label for="" class="font-bold">Selisih Tara </label>
                  <div class="card-border disabled">
                    {{ pointFormat((trx_trp.ticket_b_tara - trx_trp.ticket_a_tara) || 0) }}
                  </div>
                </div>
                <div class="w-3/12 sm:w-2/12 md:w-1/12 lg:w-1/12 flex flex-col justify-end flex-wrap p-1">
                  <label for="" class="font-bold">Selisih Netto </label>
                  <div class="card-border disabled">
                    {{ pointFormat(((trx_trp.ticket_b_bruto - trx_trp.ticket_b_tara) - (trx_trp.ticket_a_bruto - trx_trp.ticket_a_tara)) || 0) }}
                  </div>
                </div>
              </div>

              <div class="w-full flex flex-col flex-wrap p-1">
                <label for="">Note</label>
                <div class="card-border">
                  {{ trx_trp.ticket_note }}
                </div>
              </div>
        </div>

        <div class="text-xl font-bold"> APPROVER UANG JALAN TRIP</div>
        <div class="w-full flex flex-wrap justify-center text-xs text-center">
            <div class="border-2 p-1 m-1">
                Staff Logistik <br>
                {{ trx_trp.val_ticket_by ? trx_trp.val_ticket_by.username : "-"}} <br>
                ( {{ trx_trp.val_ticket_at ? $moment(trx_trp.val_ticket_at).format("DD-MM-YYYY HH:mm:ss") :"-" }} )
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