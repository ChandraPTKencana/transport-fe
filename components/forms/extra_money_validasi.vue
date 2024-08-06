<template>
  <section v-show="show" class="box-fixed">
    <div>
      <HeaderPopup :title="'Form Transaction Salary Bonus Validation'" :fn="fnClose" class="w-100 flex align-items-center"
        style="color:white;" />

        <form action="#" class="w-full flex grow flex-col h-0 overflow-auto bg-white">
          <div class="w-full flex flex-col items-center grow overflow-auto">

            <div class="w-full flex flex-row flex-wrap">

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Tujuan</label>
                <div class="w-full card-border" >
                  {{ extra_money.xto }}
                </div>
              </div>

              <div class="w-6/12 sm:w-4/12 md:w-4/12 lg:w-3/12 flex flex-col flex-wrap p-1">
                <label for="">Jenis</label>
                <div class="w-full card-border" >
                  {{ extra_money.jenis }}
                </div>
              </div>

              <div class="w-full sm:w-3/12 flex px-2 py-3">                
                <div class="w-full flex flex-wrap ring-1 ring-gray-500 p-2 relative items-end">
                  
                  <div class="absolute bg-white -top-3"> Peralihan </div>
                  
                  <div  class="w-6/12 flex flex-col flex-wrap p-1">
                    <div class="w-full card-border" >
                      {{ extra_money.transition_type }}
                    </div>
                  </div>

                  <div class="w-6/12 flex flex-col flex-wrap p-1">
                    <div class="card-border">
                      {{ extra_money.transition_target }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="w-full sm:w-12/12 flex px-2 py-3">                
                <div class="w-full flex flex-wrap ring-1 ring-gray-500 p-2 relative items-start">
                  
                  <div class="absolute bg-white -top-3"> Account </div>
                  
                  <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                    <label for="">Info</label>
                    <div class="card-border">
                      <WidthMiniPart :selected="selected_acc"/>
                    </div>
                  </div>

                  <div class="w-full sm:w-6/12 md:w-6/12 lg:w-6/12 flex flex-col flex-wrap p-1">
                    <label for="">Deskripsi</label>
                    <div class="w-full card-border" >
                      {{ extra_money.description }}
                    </div>
                  </div>

                  <div class="w-full sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                    <label for="">Nominal</label>
                    <div class="w-full card-border" >
                      {{ pointFormat(extra_money.nominal) }}
                    </div>
                  </div>

                  <div class="w-full sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                    <label for="">Qty</label>
                    <div class="w-full card-border" >
                      {{ pointFormat(extra_money.qty) }}
                    </div>
                  </div>

                  <div class="w-full sm:w-4/12 md:w-4/12 lg:w-4/12 flex flex-col flex-wrap p-1">
                    <label for="">Total</label>
                    <div class="w-full card-border" >
                      {{ pointFormat(extra_money.nominal * extra_money.qty) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          <div class="w-full flex items-center justify-end">
            <div class="w-full flex flex-wrap p-3 items-center">
              <div>
                Di Validasi oleh : 
              </div>
              <div v-if="extra_money.val1 || extra_money.val2" class="border-solid border-2 w-fit p-1 bg-slate-700 text-white text-xs">
                <div v-if="extra_money.val1">
                  App 1 : {{ extra_money.val1_by.username}} ( {{ extra_money.val1_at ? $moment(extra_money.val1_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
                <div v-if="extra_money.val2">
                  App 2 : {{ extra_money.val2_by.username}} ( {{ extra_money.val2_at ? $moment(extra_money.val2_at).format("DD-MM-YYYY HH:mm:ss") :"" }} )
                </div>
              </div>
            </div>

            <button type="button" name="button" class="w-36 m-1" @click="fnClose()">
              Cancel
            </button>
            <button ref="it_val" v-if="is_view==0" type="submit" name="button" class="w-36 m-1 bg-blue-600 text-white  rounded-sm" @click.prevent="doSave()">
              Validasi
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
  is_view:{
    type:Boolean,
    required:false,
    default:false
  },
})

const extra_money_temp = {
    id: "",
    tanggal: new Date(),
    type:"Kerajinan",
    nominal:0,
    note:"",
    attachment_1:"",
    attachment_1_preview:"",
};

const extra_money = ref({...extra_money_temp});

const token = useCookie('token');
const field_errors = ref({});
const it_val = ref(null);
const details = ref([]);


const selected_mini_temp={
  _:{
    id:{
      tcon:"",
      text:"ID",
      val:"",
    },
    code:{
      tcon:"",
      text:"Code",
      val:"",
    },
    name:{
      tcon:"",
      text:"Name",
      val:"",
    },
  },
  id:"",
  name:"",
  title:"",
};

const selected_acc = ref(JSON.parse(JSON.stringify(selected_mini_temp)));


const doSave = async () => {
  useCommonStore().loading_full = true;
  field_errors.value = {};

  const data_in = new FormData();
  
  let $method = "post";

  let id = props.id;
  if (id == 0) {
  } else {
    // $method = "put";
    // data_in['id'] = id;
    data_in.append("id", id);
    data_in.append("_method", "PUT");
  }

  const { data, error, status } = await useMyFetch("/extra_money_validasi", {
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


  extra_money.value.val = data.value.val;
  extra_money.value.val_user = data.value.val_user;
  extra_money.value.val_by = data.value.val_by;
  extra_money.value.val_at = data.value.val_at;

  extra_money.value.val1 = data.value.val1;
  extra_money.value.val1_user = data.value.val1_user;
  extra_money.value.val1_by = data.value.val1_by;
  extra_money.value.val1_at = data.value.val1_at;

  extra_money.value.val2 = data.value.val2;
  extra_money.value.val2_user = data.value.val2_user;
  extra_money.value.val2_by = data.value.val2_by;
  extra_money.value.val2_at = data.value.val2_at;



  let idx= props.p_data.map((x)=>x.id).indexOf(props.id);
  if(idx>=-1){
    props.p_data.splice(idx,1,{...extra_money.value});    
  }


  props.fnClose();
}


const callData = async () => {
  useCommonStore().loading_full = true;
  const { data, error, status } = await useMyFetch("/extra_money", {
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

  let dt =data.value.data;

  extra_money.value = dt;

  selected_acc.value._.id.val=dt.ac_account_id;
  selected_acc.value._.name.val=dt.ac_account_name;
  selected_acc.value._.code.val=dt.ac_account_code;

  selected_acc.value.id=dt.ac_account_id;
  selected_acc.value.name=dt.ac_account_code;
  selected_acc.value.title=dt.ac_account_name;

}

watch(() => props.show, (newVal, oldVal) => {
  if (newVal == true){
    if(props.is_view==false){
      setTimeout(()=>{
        it_val.value.focus();
      },1);
    }
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
